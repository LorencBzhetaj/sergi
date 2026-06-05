import { prisma } from "@/lib/prisma";
import { CategoryManager } from "./CategoryManager";

export default async function AdminCategoriesPage() {
  const categories = await prisma.category.findMany({
    include: { _count: { select: { products: true } } },
    orderBy: { name: "asc" },
  });

  return (
    <div>
      <h1 className="text-xl font-bold tracking-widest mb-8">KATEGORI</h1>
      <CategoryManager categories={categories} />
    </div>
  );
}
