"use server";

import { revalidatePath } from "next/cache";
import { headers } from "next/headers";
import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";
import { productSchema } from "@/lib/validations";
import { checkRateLimit } from "@/lib/rate-limit";
import { generateSlug } from "@/lib/utils";

async function requireAdmin() {
  const session = await auth();
  if (!session || (session.user as { role?: string }).role !== "ADMIN") {
    throw new Error("Unauthorized");
  }
  return session;
}

async function getIp(): Promise<string> {
  try {
    const h = await headers();
    return h.get("x-forwarded-for") || "unknown";
  } catch {
    return "unknown";
  }
}

async function logAudit(adminId: string, action: string, entity: string, entityId?: string, metadata?: Record<string, unknown>) {
  try {
    const ip = await getIp();
    await prisma.auditLog.create({
      data: {
        adminId,
        action,
        entity,
        entityId,
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        metadata: metadata ? (metadata as any) : undefined,
        ip,
      },
    });
  } catch {}
}

export async function createProduct(formData: FormData) {
  const session = await requireAdmin();

  const ip = await getIp();
  const adminId = (session.user as { id?: string }).id || "unknown";

  const rl = await checkRateLimit(adminId, "productMutate");
  if (!rl.success) {
    return { error: "Shumë kërkesa. Provoni përsëri." };
  }

  const raw = {
    name: formData.get("name") as string,
    slug: (formData.get("slug") as string) || generateSlug(formData.get("name") as string),
    price: parseFloat(formData.get("price") as string),
    comparePrice: formData.get("comparePrice") ? parseFloat(formData.get("comparePrice") as string) : null,
    description: formData.get("description") as string,
    categoryId: formData.get("categoryId") as string,
    collectionId: (formData.get("collectionId") as string) || null,
    sizes: JSON.parse((formData.get("sizes") as string) || "[]"),
    colors: JSON.parse((formData.get("colors") as string) || "[]"),
    stock: parseInt(formData.get("stock") as string),
    mainImage: formData.get("mainImage") as string,
    images: JSON.parse((formData.get("images") as string) || "[]"),
    featured: formData.get("featured") === "true",
    newArrival: formData.get("newArrival") === "true",
    onSale: formData.get("onSale") === "true",
    isActive: formData.get("isActive") !== "false",
  };

  const parsed = productSchema.safeParse(raw);
  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message ?? "Validation error" };
  }

  try {
    const product = await prisma.product.create({ data: parsed.data });
    await logAudit(adminId, "CREATE_PRODUCT", "Product", product.id, { name: product.name });
    revalidatePath("/shop");
    revalidatePath("/");
    revalidatePath("/admin/products");
    return { success: true, id: product.id };
  } catch (e: unknown) {
    if ((e as { code?: string }).code === "P2002") return { error: "Ky slug ekziston tashmë." };
    return { error: "Ndodhi një gabim." };
  }
}

export async function updateProduct(id: string, formData: FormData) {
  const session = await requireAdmin();
  const adminId = (session.user as { id?: string }).id || "unknown";

  const rl = await checkRateLimit(adminId, "productMutate");
  if (!rl.success) {
    return { error: "Shumë kërkesa. Provoni përsëri." };
  }

  const raw = {
    name: formData.get("name") as string,
    slug: formData.get("slug") as string,
    price: parseFloat(formData.get("price") as string),
    comparePrice: formData.get("comparePrice") ? parseFloat(formData.get("comparePrice") as string) : null,
    description: formData.get("description") as string,
    categoryId: formData.get("categoryId") as string,
    collectionId: (formData.get("collectionId") as string) || null,
    sizes: JSON.parse((formData.get("sizes") as string) || "[]"),
    colors: JSON.parse((formData.get("colors") as string) || "[]"),
    stock: parseInt(formData.get("stock") as string),
    mainImage: formData.get("mainImage") as string,
    images: JSON.parse((formData.get("images") as string) || "[]"),
    featured: formData.get("featured") === "true",
    newArrival: formData.get("newArrival") === "true",
    onSale: formData.get("onSale") === "true",
    isActive: formData.get("isActive") !== "false",
  };

  const parsed = productSchema.safeParse(raw);
  if (!parsed.success) return { error: parsed.error.issues[0]?.message ?? "Validation error" };

  try {
    const product = await prisma.product.update({ where: { id }, data: parsed.data });
    await logAudit(adminId, "UPDATE_PRODUCT", "Product", id, { name: product.name });
    revalidatePath("/shop");
    revalidatePath("/");
    revalidatePath("/admin/products");
    return { success: true };
  } catch {
    return { error: "Ndodhi një gabim." };
  }
}

export async function deleteProduct(id: string) {
  const session = await requireAdmin();
  const adminId = (session.user as { id?: string }).id || "unknown";

  const rl = await checkRateLimit(adminId, "productMutate");
  if (!rl.success) {
    return { error: "Shumë kërkesa. Provoni përsëri." };
  }

  try {
    const product = await prisma.product.delete({ where: { id } });
    await logAudit(adminId, "DELETE_PRODUCT", "Product", id, { name: product.name });
    revalidatePath("/shop");
    revalidatePath("/");
    revalidatePath("/admin/products");
    return { success: true };
  } catch {
    return { error: "Ndodhi një gabim gjatë fshirjes." };
  }
}

export async function toggleProductActive(id: string) {
  const session = await requireAdmin();
  const adminId = (session.user as { id?: string }).id || "unknown";

  try {
    const product = await prisma.product.findUnique({ where: { id }, select: { isActive: true, name: true } });
    if (!product) return { error: "Produkti nuk u gjet." };

    const updated = await prisma.product.update({
      where: { id },
      data: { isActive: !product.isActive },
    });
    await logAudit(adminId, updated.isActive ? "ACTIVATE_PRODUCT" : "DEACTIVATE_PRODUCT", "Product", id, { name: product.name });
    revalidatePath("/admin/products");
    revalidatePath("/shop");
    return { success: true, isActive: updated.isActive };
  } catch {
    return { error: "Ndodhi një gabim." };
  }
}
