"use server";

import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";
import { categorySchema } from "@/lib/validations";

async function requireAdmin() {
  const session = await auth();
  if (!session || (session.user as { role?: string }).role !== "ADMIN") throw new Error("Unauthorized");
}

export async function createCategory(data: { name: string; slug: string; description?: string; image?: string }) {
  await requireAdmin();
  const parsed = categorySchema.safeParse(data);
  if (!parsed.success) return { error: parsed.error.issues[0]?.message ?? "Validation error" };
  try {
    await prisma.category.create({ data: parsed.data });
    revalidatePath("/admin/categories");
    return { success: true };
  } catch {
    return { error: "Kjo kategori ekziston tashmë." };
  }
}

export async function updateCategory(id: string, data: { name: string; slug: string; description?: string; image?: string }) {
  await requireAdmin();
  const parsed = categorySchema.safeParse(data);
  if (!parsed.success) return { error: parsed.error.issues[0]?.message ?? "Validation error" };
  try {
    await prisma.category.update({ where: { id }, data: parsed.data });
    revalidatePath("/admin/categories");
    return { success: true };
  } catch {
    return { error: "Ndodhi një gabim." };
  }
}

export async function deleteCategory(id: string) {
  await requireAdmin();
  try {
    await prisma.category.delete({ where: { id } });
    revalidatePath("/admin/categories");
    return { success: true };
  } catch {
    return { error: "Nuk mund të fshihet - ka produkte të lidhura." };
  }
}
