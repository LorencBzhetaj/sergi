"use client";

import Link from "next/link";
import { ShoppingBag } from "lucide-react";
import { useCart } from "@/store/cart";
import { useHydrated } from "@/hooks/useHydrated";

export function CartButton() {
  const hydrated = useHydrated();
  const itemCount = useCart((s) => s.itemCount());

  return (
    <Link href="/cart" className="relative p-2 hover:opacity-70 transition-opacity" aria-label="Shporta">
      <ShoppingBag className="h-5 w-5" />
      {hydrated && itemCount > 0 && (
        <span className="absolute -top-1 -right-1 bg-[#C9A84C] text-white text-[10px] font-bold rounded-full w-4 h-4 flex items-center justify-center">
          {itemCount > 9 ? "9+" : itemCount}
        </span>
      )}
    </Link>
  );
}
