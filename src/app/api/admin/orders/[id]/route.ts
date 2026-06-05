import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { z } from "zod";

const updateOrderSchema = z.object({
  status: z.enum(["PENDING", "CONFIRMED", "SHIPPED", "DELIVERED", "CANCELLED"]),
});

async function requireAdmin() {
  const session = await auth();
  if (!session || (session.user as { role?: string }).role !== "ADMIN") {
    return null;
  }
  return session;
}

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await requireAdmin();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id } = await params;

  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Kërkesa është e pavlefshme." }, { status: 400 });
  }

  const parsed = updateOrderSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: parsed.error.issues[0]?.message ?? "Statusi është i pavlefshëm." },
      { status: 400 }
    );
  }

  try {
    const order = await prisma.order.update({
      where: { id },
      data: { status: parsed.data.status },
    });

    // Log audit
    const adminId = (session.user as { id?: string }).id;
    if (adminId) {
      await prisma.auditLog.create({
        data: {
          adminId,
          action: "UPDATE_ORDER_STATUS",
          entity: "Order",
          entityId: id,
          metadata: { status: parsed.data.status },
        },
      }).catch(() => {});
    }

    return NextResponse.json({ success: true, status: order.status });
  } catch (e: unknown) {
    if ((e as { code?: string }).code === "P2025") {
      return NextResponse.json({ error: "Porosia nuk u gjet." }, { status: 404 });
    }
    return NextResponse.json({ error: "Ndodhi një gabim." }, { status: 500 });
  }
}
