"use client";

import { useRouter, useSearchParams, usePathname } from "next/navigation";
import { useCallback, useEffect, useState } from "react";
import type { Category } from "@/types";

interface CategoryGroup { group: string; items: Category[] }
interface ShopFiltersProps { categories: Category[]; groups: CategoryGroup[] }

const SIZES = ["XS", "S", "M", "L", "XL", "XXL"];

export function ShopFilters({ groups }: ShopFiltersProps) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const currentCategory = searchParams.get("category") || "";
  const currentSize     = searchParams.get("size")     || "";
  const currentColor    = searchParams.get("color")    || "";
  const currentSale     = searchParams.get("sale")     || "";
  const currentNew      = searchParams.get("newArrival") || "";

  // Load unique colors from API
  const [colors, setColors] = useState<{ name: string; hex: string }[]>([]);
  useEffect(() => {
    fetch("/api/products/colors")
      .then((r) => r.json())
      .then(setColors)
      .catch(() => {});
  }, []);

  const setParam = useCallback(
    (key: string, value: string | null) => {
      const params = new URLSearchParams(searchParams.toString());
      if (value) params.set(key, value);
      else params.delete(key);
      router.push(`${pathname}?${params.toString()}`);
    },
    [searchParams, pathname, router]
  );

  const activeFilters = [currentCategory, currentSize, currentColor, currentSale, currentNew].filter(Boolean).length;

  return (
    <aside className="w-52 shrink-0 space-y-6">

      {/* Clear all */}
      {activeFilters > 0 && (
        <button
          onClick={() => router.push(pathname)}
          className="text-xs font-semibold text-[#C9A84C] hover:text-black transition-colors underline"
        >
          Pastro të gjithë filtrat ({activeFilters})
        </button>
      )}

      {/* ── KATEGORIA ─── */}
      <div>
        <h3 className="text-[10px] font-bold tracking-widest mb-3 text-black">KATEGORIA</h3>
        <ul className="space-y-0.5">
          <li>
            <button
              onClick={() => setParam("category", null)}
              className={`text-sm w-full text-left py-0.5 transition-colors ${!currentCategory ? "text-black font-semibold" : "text-neutral-500 hover:text-black"}`}
            >
              Të gjitha
            </button>
          </li>
        </ul>
        {groups.map((group) => (
          <div key={group.group} className="mt-3">
            <p className="text-[9px] font-bold tracking-widest text-[#C9A84C] uppercase mb-1.5">{group.group}</p>
            <ul className="space-y-0.5">
              {group.items.map((cat) => (
                <li key={cat.id}>
                  <button
                    onClick={() => setParam("category", currentCategory === cat.slug ? null : cat.slug)}
                    className={`text-sm w-full text-left py-0.5 transition-colors ${currentCategory === cat.slug ? "text-black font-semibold" : "text-neutral-500 hover:text-black"}`}
                  >
                    {currentCategory === cat.slug && <span className="mr-1">›</span>}
                    {cat.name}
                  </button>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>

      <div className="border-t border-neutral-100" />

      {/* ── MASAT ─── */}
      <div>
        <h3 className="text-[10px] font-bold tracking-widest mb-3 text-black">MASA</h3>
        <div className="flex flex-wrap gap-1.5">
          {SIZES.map((size) => (
            <button
              key={size}
              onClick={() => setParam("size", currentSize === size ? null : size)}
              className={`w-9 h-9 border text-xs font-semibold transition-all ${currentSize === size ? "border-black bg-black text-white" : "border-neutral-200 hover:border-black text-black"}`}
            >
              {size}
            </button>
          ))}
        </div>
      </div>

      {/* ── NGJYRAT ─── */}
      {colors.length > 0 && (
        <>
          <div className="border-t border-neutral-100" />
          <div>
            <h3 className="text-[10px] font-bold tracking-widest mb-3 text-black">NGJYRA</h3>
            <div className="flex flex-wrap gap-2">
              {colors.map((c) => {
                const active = currentColor === c.name;
                return (
                  <button
                    key={c.name}
                    title={c.name}
                    onClick={() => setParam("color", active ? null : c.name)}
                    className={`relative w-7 h-7 rounded-full border-2 transition-all ${active ? "border-black scale-110" : "border-neutral-300 hover:border-neutral-500"}`}
                    style={{ backgroundColor: c.hex }}
                  >
                    {active && (
                      <span className="absolute inset-0 flex items-center justify-center">
                        <span className="w-2 h-2 rounded-full bg-white opacity-80" />
                      </span>
                    )}
                  </button>
                );
              })}
            </div>
            {currentColor && (
              <p className="text-xs text-neutral-500 mt-2">
                Ngjyra: <strong>{currentColor}</strong>
                <button onClick={() => setParam("color", null)} className="ml-2 text-neutral-400 hover:text-black underline">hiq</button>
              </p>
            )}
          </div>
        </>
      )}

      <div className="border-t border-neutral-100" />

      {/* ── FILTRO ─── */}
      <div>
        <h3 className="text-[10px] font-bold tracking-widest mb-3 text-black">FILTRO</h3>
        <ul className="space-y-1">
          <li>
            <button
              onClick={() => setParam("sale", currentSale === "true" ? null : "true")}
              className={`text-sm w-full text-left py-0.5 transition-colors ${currentSale === "true" ? "text-[#C9A84C] font-semibold" : "text-neutral-500 hover:text-black"}`}
            >
              {currentSale === "true" ? "› " : ""}Në ulje
            </button>
          </li>
          <li>
            <button
              onClick={() => setParam("newArrival", currentNew === "true" ? null : "true")}
              className={`text-sm w-full text-left py-0.5 transition-colors ${currentNew === "true" ? "text-black font-semibold" : "text-neutral-500 hover:text-black"}`}
            >
              {currentNew === "true" ? "› " : ""}Arritjet e reja
            </button>
          </li>
        </ul>
      </div>
    </aside>
  );
}
