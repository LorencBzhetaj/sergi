"use client";

import Link from "next/link";
import { Heart } from "lucide-react";
import { useEffect, useState } from "react";
import { useWishlist } from "@/store/wishlist";
import { ProductCard } from "@/components/product/ProductCard";
import type { Product } from "@/types";

export default function WishlistPage() {
  const items = useWishlist((s) => s.items);
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (items.length === 0) { setLoading(false); return; }

    // Fetch all products and filter by slug
    fetch("/api/products?limit=100")
      .then((r) => r.json())
      .then((data: Product[]) => {
        const filtered = Array.isArray(data)
          ? data.filter((p) => items.includes(p.slug))
          : [];
        setProducts(filtered);
      })
      .catch(() => setProducts([]))
      .finally(() => setLoading(false));
  }, [items]);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-12">
      <div className="flex items-center gap-3 mb-8">
        <Heart className="h-5 w-5 fill-[#C9A84C] text-[#C9A84C]" />
        <div>
          <h1 className="text-2xl font-bold tracking-widest">TË PREFERUARAT</h1>
          <p className="text-sm text-neutral-500 mt-0.5">{items.length} produkte</p>
        </div>
      </div>

      {loading ? (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="aspect-[3/4] bg-neutral-100 animate-pulse" />
          ))}
        </div>
      ) : items.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-24 text-center">
          <Heart className="h-12 w-12 text-neutral-200 mb-4" />
          <p className="text-lg font-semibold mb-2">Lista është bosh</p>
          <p className="text-sm text-neutral-500 mb-6">
            Shtoni produkte duke klikuar zemrën 🤍
          </p>
          <Link
            href="/shop"
            className="bg-black text-white text-xs font-bold tracking-widest px-8 py-3 hover:bg-neutral-800 transition-colors"
          >
            SHFLETO SHOP
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {products.map((p) => (
            <ProductCard key={p.id} product={p} />
          ))}
        </div>
      )}
    </div>
  );
}
