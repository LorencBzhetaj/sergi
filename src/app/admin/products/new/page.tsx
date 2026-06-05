import { prisma } from "@/lib/prisma";
import { ProductForm } from "../ProductForm";

export default async function NewProductPage() {
  const [categories, collections] = await Promise.all([
    prisma.category.findMany(),
    prisma.collection.findMany(),
  ]);

  return (
    <div>
      <h1 className="text-xl font-bold tracking-widest mb-8">SHTO PRODUKT TË RI</h1>
      <ProductForm categories={categories} collections={collections} />
    </div>
  );
}
