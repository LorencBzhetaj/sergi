"use server";

import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";

async function requireAdmin() {
  const session = await auth();
  if (!session || (session.user as { role?: string }).role !== "ADMIN") {
    throw new Error("Unauthorized");
  }
}

export async function markMessageRead(id: string, isRead: boolean) {
  try {
    await requireAdmin();
    await prisma.contactMessage.update({ where: { id }, data: { isRead } });
    revalidatePath("/admin/mesazhet");
    return { success: true };
  } catch {
    return { error: "Gabim." };
  }
}

export async function deleteMessage(id: string) {
  try {
    await requireAdmin();
    await prisma.contactMessage.delete({ where: { id } });
    revalidatePath("/admin/mesazhet");
    return { success: true };
  } catch {
    return { error: "Gabim." };
  }
}
