import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { orderIntentSchema } from "@/lib/validations";
import { checkRateLimit } from "@/lib/rate-limit";

const FREE_SHIPPING_MIN = 5000;
const SHIPPING_COST = 300;
const WHATSAPP_NUMBER = process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || "355692111876";

interface ProductRow {
  id: string;
  name: string;
  price: number;
  stock: number;
}

function buildWhatsAppMessage(
  items: Array<{ name: string; color: string; size: string; quantity: number; price: number }>,
  total: number,
  shipping: number
): string {
  const lines = items.map((item, i) => {
    const itemTotal = item.price * item.quantity;
    return `${i + 1}. ${item.name}\n   Ngjyra: ${item.color} | Masa: ${item.size} | Sasia: ${item.quantity} — ${itemTotal.toLocaleString("sq-AL")} Lek`;
  });
  const shippingLine =
    shipping === 0
      ? "Transporti: Falas (porosi mbi 5,000 Lek)"
      : `Transporti: ${shipping} Lek`;
  return (
    `Pershendetje, dua te porosis:\n\n` +
    lines.join("\n\n") +
    `\n\nTotali: ${total.toLocaleString("sq-AL")} Lek\n${shippingLine}\n\nFaleminderit nga Bogadni Store!`
  );
}

export async function POST(req: NextRequest) {
  const ip = req.headers.get("x-forwarded-for")?.split(",")[0].trim() || "unknown";

  const rl = await checkRateLimit(ip, "orderIntent");
  if (!rl.success) {
    return NextResponse.json(
      { error: "Shumë kërkesa. Provoni përsëri pas 10 minutash." },
      { status: 429 }
    );
  }

  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Kërkesa është e pavlefshme." }, { status: 400 });
  }

  const parsed = orderIntentSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: parsed.error.issues[0]?.message ?? "Të dhënat janë të pavlefshme." },
      { status: 400 }
    );
  }

  const { items, customerName, customerPhone } = parsed.data;
  const productIds = [...new Set(items.map((i) => i.productId))];

  try {
    // ── SERIALIZABLE transaction + SELECT FOR UPDATE ────────────────────────
    // This is the only correct fix for the race condition:
    //   READ COMMITTED (default): two concurrent txns both see stock=1 → oversell
    //   SERIALIZABLE: one txn is aborted and must retry → no oversell
    //
    // We also use SELECT ... FOR UPDATE to row-lock the product rows,
    // preventing concurrent reads until this transaction commits.
    const result = await prisma.$transaction(
      async (tx) => {
        // 1. Lock product rows with SELECT FOR UPDATE — no other transaction
        //    can read or modify these rows until we commit.
        const products = await tx.$queryRaw<ProductRow[]>`
          SELECT id, name, price, stock
          FROM "Product"
          WHERE id = ANY(${productIds}::text[])
            AND "isActive" = true
          FOR UPDATE
        `;

        const productMap = new Map(products.map((p) => [p.id, p]));

        // 2. Validate — all products must exist and have sufficient stock
        for (const item of items) {
          const product = productMap.get(item.productId);
          if (!product) {
            throw Object.assign(
              new Error(`Produkti nuk u gjet ose nuk është aktiv.`),
              { userError: true }
            );
          }
          if (product.stock < item.quantity) {
            throw Object.assign(
              new Error(`Stoku i pamjaftueshëm për "${product.name}". Disponibël: ${product.stock}`),
              { userError: true }
            );
          }
        }

        // 3. Calculate total from DB prices — NEVER trust frontend
        const subtotal = items.reduce(
          (sum, item) => sum + productMap.get(item.productId)!.price * item.quantity,
          0
        );
        const shipping = subtotal >= FREE_SHIPPING_MIN ? 0 : SHIPPING_COST;
        const total = subtotal + shipping;

        // 4. Atomic decrement — each decrement is a separate UPDATE
        //    with a WHERE stock >= quantity guard (double safety)
        for (const item of items) {
          const updated = await tx.$executeRaw`
            UPDATE "Product"
            SET stock = stock - ${item.quantity}
            WHERE id = ${item.productId}
              AND stock >= ${item.quantity}
          `;
          if (updated === 0) {
            // Stock became 0 between our lock and update (shouldn't happen,
            // but guard against any edge case)
            throw Object.assign(
              new Error(`Stoku u shua gjatë procesimit. Provoni përsëri.`),
              { userError: true }
            );
          }
        }

        // 5. Build WhatsApp message
        const messageItems = items.map((item) => ({
          name: productMap.get(item.productId)!.name,
          color: item.color,
          size: item.size,
          quantity: item.quantity,
          price: productMap.get(item.productId)!.price,
        }));
        const whatsappMsg = buildWhatsAppMessage(messageItems, total, shipping);
        const whatsappUrl = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(whatsappMsg)}`;

        // 6. Create order record
        const order = await tx.order.create({
          data: {
            customerName: customerName ?? null,
            phone: customerPhone ?? null,
            total,
            status: "PENDING",
            whatsappMsg,
            items: {
              create: items.map((item) => ({
                productId: item.productId,
                size: item.size,
                color: item.color,
                quantity: item.quantity,
                price: productMap.get(item.productId)!.price,
              })),
            },
          },
        });

        return { whatsappUrl, orderId: order.id, total, shipping };
      },
      {
        // SERIALIZABLE: prevents phantom reads and write skew.
        // PostgreSQL will abort + retry one of the concurrent transactions
        // automatically when a conflict is detected.
        isolationLevel: "Serializable",
        timeout: 10_000, // 10s max — prevents long-running locks
      }
    );

    return NextResponse.json(result);
  } catch (err: unknown) {
    const isUserError = err instanceof Error && "userError" in err;
    const message = err instanceof Error ? err.message : "Ndodhi një gabim.";

    // PostgreSQL serialization failure code: 40001
    const isSerializationFailure =
      err instanceof Error && "code" in err && err.code === "40001";
    if (isSerializationFailure) {
      return NextResponse.json(
        { error: "Produkt i njëjtë po porositet njëkohësisht. Provoni përsëri." },
        { status: 409 }
      );
    }

    return NextResponse.json(
      { error: isUserError ? message : "Ndodhi një gabim. Provoni përsëri." },
      { status: isUserError ? 400 : 500 }
    );
  }
}
