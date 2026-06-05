"use server";

import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";
import { collectionSchema } from "@/lib/validations";

async function requireAdmin() {
  const session = await auth();
  if (!session || (session.user as { role?: string }).role !== "ADMIN") throw new Error("Unauthorized");
}

export async function createCollection(data: { name: string; slug: string; description?: string; image?: string }) {
  await requireAdmin();
  const parsed = collectionSchema.safeParse(data);
  if (!parsed.success) return { error: parsed.error.issues[0]?.message ?? "Validation error" };
  try {
    await prisma.collection.create({ data: parsed.data });
    revalidatePath("/admin/collections");
    return { success: true };
  } catch {
    return { error: "Ky koleksion ekziston tashmë." };
  }
}

export async function deleteCollection(id: string) {
  await requireAdmin();
  try {
    await prisma.collection.delete({ where: { id } });
    revalidatePath("/admin/collections");
    return { success: true };
  } catch {
    return { error: "Nuk mund të fshihet." };
  }
}
