"use server";

import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { headers } from "next/headers";
import { z } from "zod";

const statusSchema = z.enum(["PENDING", "CONFIRMED", "SHIPPED", "DELIVERED", "CANCELLED"]);

async function requireAdmin() {
  const session = await auth();
  if (!session || (session.user as { role?: string }).role !== "ADMIN") {
    throw new Error("Unauthorized");
  }
  return session;
}

export async function updateOrderStatus(orderId: string, status: string) {
  try {
    const session = await requireAdmin();
    const adminId = (session.user as { id?: string }).id || "unknown";

    const parsed = statusSchema.safeParse(status);
    if (!parsed.success) {
      return { error: "Statusi është i pavlefshëm." };
    }

    await prisma.order.update({
      where: { id: orderId },
      data: { status: parsed.data },
    });

    // Audit log
    let ip = "unknown";
    try {
      const h = await headers();
      ip = h.get("x-forwarded-for")?.split(",")[0].trim() || "unknown";
    } catch {}

    await prisma.auditLog.create({
      data: {
        adminId,
        action: "UPDATE_ORDER_STATUS",
        entity: "Order",
        entityId: orderId,
        metadata: { status: parsed.data },
        ip,
      },
    }).catch(() => {});

    revalidatePath("/admin/orders");
    revalidatePath("/admin");
    return { success: true };
  } catch {
    return { error: "Ndodhi një gabim. Provoni përsëri." };
  }
}
