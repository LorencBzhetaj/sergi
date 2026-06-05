import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { ProductForm } from "../../ProductForm";

interface Props {
  params: Promise<{ id: string }>;
}

export default async function EditProductPage({ params }: Props) {
  const { id } = await params;
  const [product, categories, collections] = await Promise.all([
    prisma.product.findUnique({ where: { id } }),
    prisma.category.findMany(),
    prisma.collection.findMany(),
  ]);
  if (!product) notFound();

  return (
    <div>
      <h1 className="text-xl font-bold tracking-widest mb-8">EDITO: {product.name.toUpperCase()}</h1>
      <ProductForm
        categories={categories}
        collections={collections}
        product={{
          ...product,
          comparePrice: product.comparePrice ?? null,
          collectionId: product.collectionId ?? null,
          colors: product.colors as { name: string; hex: string }[],
        }}
      />
    </div>
  );
}
