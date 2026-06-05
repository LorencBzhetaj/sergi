import Link from "next/link";
import Image from "next/image";
import { prisma } from "@/lib/prisma";
import { formatPrice } from "@/lib/utils";
import { Plus, Pencil, Trash2 } from "lucide-react";
import { DeleteProductButton } from "./DeleteProductButton";

export default async function AdminProductsPage() {
  const products = await prisma.product.findMany({
    include: { category: true },
    orderBy: { createdAt: "desc" },
  });

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-xl font-bold tracking-widest">PRODUKTE</h1>
          <p className="text-neutral-500 text-sm mt-1">{products.length} produkte gjithsej</p>
        </div>
        <Link
          href="/admin/products/new"
          className="flex items-center gap-2 bg-black text-white text-xs font-bold tracking-widest px-5 py-3 hover:bg-neutral-800 transition-colors"
        >
          <Plus className="h-4 w-4" />
          SHTO PRODUKT
        </Link>
      </div>

      <div className="bg-white border border-neutral-100 overflow-hidden">
        <table className="w-full text-sm">
          <thead className="border-b border-neutral-100">
            <tr className="text-left">
              <th className="py-3 px-4 text-xs font-bold tracking-widest text-neutral-500">PRODUKT</th>
              <th className="py-3 px-4 text-xs font-bold tracking-widest text-neutral-500 hidden md:table-cell">KATEGORIA</th>
              <th className="py-3 px-4 text-xs font-bold tracking-widest text-neutral-500">ÇMIMI</th>
              <th className="py-3 px-4 text-xs font-bold tracking-widest text-neutral-500 hidden lg:table-cell">STOKU</th>
              <th className="py-3 px-4 text-xs font-bold tracking-widest text-neutral-500 hidden lg:table-cell">STATUSI</th>
              <th className="py-3 px-4"></th>
            </tr>
          </thead>
          <tbody>
            {products.map((p) => (
              <tr key={p.id} className="border-b border-neutral-50 hover:bg-neutral-50 transition-colors">
                <td className="py-3 px-4">
                  <div className="flex items-center gap-3">
                    <div className="relative w-10 h-10 bg-neutral-100 shrink-0">
                      <Image src={p.mainImage} alt={p.name} fill className="object-cover" sizes="40px" />
                    </div>
                    <div>
                      <p className="font-medium text-xs">{p.name}</p>
                      <p className="text-[10px] text-neutral-400">{p.slug}</p>
                    </div>
                  </div>
                </td>
                <td className="py-3 px-4 text-xs text-neutral-600 hidden md:table-cell">{p.category.name}</td>
                <td className="py-3 px-4 text-xs font-medium">{formatPrice(p.price)}</td>
                <td className="py-3 px-4 text-xs hidden lg:table-cell">
                  <span className={p.stock === 0 ? "text-red-500" : p.stock < 10 ? "text-yellow-600" : "text-green-600"}>
                    {p.stock}
                  </span>
                </td>
                <td className="py-3 px-4 hidden lg:table-cell">
                  <div className="flex gap-1.5">
                    {p.featured && <span className="text-[10px] bg-black text-white px-2 py-0.5">Featured</span>}
                    {p.newArrival && <span className="text-[10px] bg-neutral-200 text-black px-2 py-0.5">New</span>}
                    {p.onSale && <span className="text-[10px] bg-red-100 text-red-700 px-2 py-0.5">Sale</span>}
                  </div>
                </td>
                <td className="py-3 px-4">
                  <div className="flex items-center gap-2 justify-end">
                    <Link
                      href={`/admin/products/${p.id}/edit`}
                      className="p-1.5 hover:bg-neutral-100 transition-colors"
                    >
                      <Pencil className="h-3.5 w-3.5" />
                    </Link>
                    <DeleteProductButton id={p.id} name={p.name} />
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {products.length === 0 && (
          <div className="text-center py-12 text-neutral-400 text-sm">
            Nuk ka produkte ende.{" "}
            <Link href="/admin/products/new" className="text-black underline">Shto tani</Link>
          </div>
        )}
      </div>
    </div>
  );
}
