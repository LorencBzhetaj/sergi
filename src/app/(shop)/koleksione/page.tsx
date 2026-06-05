import { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { prisma } from "@/lib/prisma";

export const metadata: Metadata = {
  title: "Koleksione",
  description: "Zbuloni koleksionet tona ekskluzive të veshjes premium.",
};

export default async function KoleksionePage() {
  let collections: Array<{ id: string; name: string; slug: string; description: string | null; image: string | null; _count: { products: number } }> = [];
  try {
    collections = await prisma.collection.findMany({
      include: { _count: { select: { products: true } } },
    });
  } catch {
    collections = [];
  }

  const fallbackImages = [
    "https://images.unsplash.com/photo-1490481651871-ab68de25d43d?w=800&q=80",
    "https://images.unsplash.com/photo-1523381210434-271e8be1f52b?w=800&q=80",
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-12">
      <div className="text-center mb-12">
        <p className="text-[#C9A84C] text-xs font-semibold tracking-widest mb-3">BOGADNI STORE</p>
        <h1 className="text-3xl font-bold tracking-widest">KOLEKSIONET</h1>
        <p className="text-neutral-500 mt-3 max-w-md mx-auto text-sm">
          Çdo koleksion është krijuar me kujdes për të reflektuar stilin modern dhe cilësinë premium.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {collections.map((col, i) => (
          <Link key={col.id} href={`/shop?collection=${col.slug}`} className="group block relative overflow-hidden bg-neutral-100 aspect-[16/9]">
            <Image
              src={col.image || fallbackImages[i % fallbackImages.length]}
              alt={col.name}
              fill
              className="object-cover transition-transform duration-500 group-hover:scale-105"
              sizes="(max-width: 768px) 100vw, 50vw"
            />
            <div className="absolute inset-0 bg-black/40 group-hover:bg-black/50 transition-colors" />
            <div className="absolute inset-0 flex flex-col items-center justify-center text-white text-center p-6">
              <h2 className="text-2xl font-bold tracking-widest mb-2">{col.name.toUpperCase()}</h2>
              {col.description && <p className="text-sm text-white/80 mb-4">{col.description}</p>}
              <span className="text-xs font-semibold tracking-widest border border-white px-4 py-2 hover:bg-white hover:text-black transition-colors">
                {col._count.products} PRODUKTE
              </span>
            </div>
          </Link>
        ))}
        {collections.length === 0 && (
          <div className="col-span-2 text-center py-20 text-neutral-400">
            <p>Koleksionet po shtohen së shpejti.</p>
          </div>
        )}
      </div>
    </div>
  );
}
