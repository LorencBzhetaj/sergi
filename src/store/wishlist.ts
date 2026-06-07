"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";

interface WishlistStore {
  items: string[]; // product slugs
  toggle: (slug: string) => void;
  isWishlisted: (slug: string) => boolean;
  count: () => number;
}

export const useWishlist = create<WishlistStore>()(
  persist(
    (set, get) => ({
      items: [],
      toggle: (slug) => {
        set((state) => ({
          items: state.items.includes(slug)
            ? state.items.filter((s) => s !== slug)
            : [...state.items, slug],
        }));
      },
      isWishlisted: (slug) => get().items.includes(slug),
      count: () => get().items.length,
    }),
    { name: "bogdani-wishlist" }
  )
);
