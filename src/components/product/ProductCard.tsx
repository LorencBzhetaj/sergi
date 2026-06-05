"use client";

import Image from "next/image";
import Link from "next/link";
import { Heart } from "lucide-react";
import { toast } from "sonner";
import { formatPrice } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import { useWishlist } from "@/store/wishlist";
import { useHydrated } from "@/hooks/useHydrated";
import type { Product } from "@/types";

export function ProductCard({ product }: { product: Product }) {
  const hydrated = useHydrated();
  const toggle = useWishlist((s) => s.toggle);
  const _wishlisted = useWishlist((s) => s.isWishlisted(product.slug));
  const isWishlisted = hydrated && _wishlisted;

  const handleWishlist = (e: React.MouseEvent) => {
    e.preventDefault();
    toggle(product.slug);
    toast(isWishlisted ? "Hequr nga të preferuarat" : "Shtuar në të preferuarat ❤️", {
      duration: 1500,
    });
  };

  return (
    <div className="group relative">
      {/* Image */}
      <Link
        href={`/product/${product.slug}`}
        className="block relative overflow-hidden bg-neutral-100 aspect-[3/4]"
      >
        <Image
          src={product.mainImage}
          alt={product.name}
          fill
          className="object-cover transition-transform duration-500 group-hover:scale-105"
          sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
        />

        {/* Badges */}
        <div className="absolute top-3 left-3 flex flex-col gap-1.5">
          {product.newArrival && (
            <Badge variant="new" className="text-[10px] tracking-widest">NEW</Badge>
          )}
          {product.onSale && product.comparePrice && (
            <Badge variant="sale" className="text-[10px] tracking-widest">SALE</Badge>
          )}
        </div>

        {/* Wishlist button */}
        <button
          onClick={handleWishlist}
          className={`absolute top-3 right-3 w-8 h-8 bg-white flex items-center justify-center transition-all ${
            isWishlisted
              ? "opacity-100"
              : "opacity-0 group-hover:opacity-100"
          }`}
          aria-label={isWishlisted ? "Hiq nga të preferuarat" : "Shto në të preferuarat"}
        >
          <Heart
            className="h-4 w-4 transition-colors"
            fill={isWishlisted ? "#C9A84C" : "none"}
            stroke={isWishlisted ? "#C9A84C" : "currentColor"}
          />
        </button>
      </Link>

      {/* Info */}
      <div className="pt-3 pb-1">
        <Link href={`/product/${product.slug}`}>
          <h3 className="text-sm font-medium text-black hover:text-[#C9A84C] transition-colors line-clamp-1">
            {product.name}
          </h3>
        </Link>
        <div className="flex items-center gap-2 mt-1">
          <span className="text-sm font-semibold text-black">{formatPrice(product.price)}</span>
          {product.comparePrice && (
            <span className="text-xs text-neutral-400 line-through">
              {formatPrice(product.comparePrice)}
            </span>
          )}
        </div>
        {/* Color dots */}
        {Array.isArray(product.colors) && product.colors.length > 0 && (
          <div className="flex gap-1.5 mt-2">
            {(product.colors as { name: string; hex: string }[]).slice(0, 5).map((c) => (
              <div
                key={c.hex}
                title={c.name}
                className="w-3 h-3 rounded-full border border-neutral-300"
                style={{ backgroundColor: c.hex }}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
