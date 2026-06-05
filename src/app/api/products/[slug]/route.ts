import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { rateLimit } from "@/lib/rate-limit";

// Fields safe to expose publicly
const PUBLIC_PRODUCT_SELECT = {
  id: true, name: true, slug: true, price: true, comparePrice: true,
  description: true, sizes: true, colors: true, stock: true,
  mainImage: true, images: true, featured: true, newArrival: true, onSale: true,
  category: { select: { id: true, name: true, slug: true } },
  collection: { select: { id: true, name: true, slug: true } },
  // Excluded: views, isActive, createdAt, updatedAt (internal)
} as const;

// In-memory view debounce — same IP only increments once per 10 min per product
const viewedRecently = new Map<string, number>();

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  const { slug } = await params;
  const ip = req.headers.get("x-forwarded-for")?.split(",")[0].trim() || "unknown";

  // Rate limit: 60 product views per minute per IP
  if (!rateLimit(`product-view:${ip}`, 60, 60_000)) {
    return NextResponse.json({ error: "Shumë kërkesa." }, { status: 429 });
  }

  try {
    const product = await prisma.product.findUnique({
      where: { slug, isActive: true },
      select: PUBLIC_PRODUCT_SELECT,
    });
    if (!product) return NextResponse.json({ error: "Produkti nuk u gjet." }, { status: 404 });

    // Increment views — debounced per IP per product (max once / 10 min)
    const viewKey = `${ip}:${slug}`;
    const lastViewed = viewedRecently.get(viewKey) || 0;
    if (Date.now() - lastViewed > 10 * 60 * 1000) {
      viewedRecently.set(viewKey, Date.now());
      // Fire-and-forget — don't block response
      prisma.product.update({ where: { slug }, data: { views: { increment: 1 } } }).catch(() => {});
    }

    return NextResponse.json(product, {
      headers: { "Cache-Control": "public, s-maxage=30, stale-while-revalidate=60" },
    });
  } catch {
    return NextResponse.json({ error: "Ndodhi një gabim." }, { status: 500 });
  }
}
