import { prisma } from "@/lib/prisma";
import { CollectionManager } from "./CollectionManager";

export default async function AdminCollectionsPage() {
  const collections = await prisma.collection.findMany({
    include: { _count: { select: { products: true } } },
    orderBy: { name: "asc" },
  });
  return (
    <div>
      <h1 className="text-xl font-bold tracking-widest mb-8">KOLEKSIONE</h1>
      <CollectionManager collections={collections} />
    </div>
  );
}
