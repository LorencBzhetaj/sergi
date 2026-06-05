"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { Search, Heart, Menu, X, ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";
import { Logo } from "./Logo";
import { CartButton } from "./CartButton";
import { SearchModal } from "./SearchModal";
import { useWishlist } from "@/store/wishlist";
import { useHydrated } from "@/hooks/useHydrated";

interface CategoryItem {
  id: string;
  name: string;
  slug: string;
  description: string | null;
}

interface CategoryGroup {
  group: string;
  items: CategoryItem[];
}

interface NavbarProps {
  groups?: CategoryGroup[];
}

export function Navbar({ groups = [] }: NavbarProps) {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [mobileShopOpen, setMobileShopOpen] = useState(false);
  const pathname = usePathname();
  const router = useRouter();
  const hydrated = useHydrated();
  const wishlistCount = useWishlist((s) => s.count());

  // Close mobile menu on route change
  useEffect(() => { setMobileOpen(false); }, [pathname]);

  // Keyboard shortcut: Cmd+K / Ctrl+K to open search
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === "k") {
        e.preventDefault();
        setSearchOpen(true);
      }
      if (e.key === "Escape") setSearchOpen(false);
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, []);

  return (
    <>
      <nav className="bg-white border-b border-neutral-100 sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="flex items-center justify-between h-14 sm:h-16">

            {/* Mobile menu button */}
            <button
              className="md:hidden p-2"
              onClick={() => setMobileOpen(!mobileOpen)}
              aria-label="Toggle menu"
            >
              {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </button>

            {/* Logo */}
            <Logo />

            {/* Desktop Nav */}
            <ul className="hidden md:flex items-center gap-8">
              {/* KREU */}
              <li>
                <Link
                  href="/"
                  className={cn(
                    "text-xs font-semibold tracking-widest transition-colors hover:text-[#C9A84C]",
                    pathname === "/" ? "text-[#C9A84C]" : "text-black"
                  )}
                >
                  KREU
                </Link>
              </li>

              {/* SHOP — mega dropdown */}
              <li className="relative group">
                <button
                  onClick={() => router.push("/shop")}
                  className={cn(
                    "flex items-center gap-1 text-xs font-semibold tracking-widest transition-colors hover:text-[#C9A84C]",
                    pathname.startsWith("/shop") || pathname.startsWith("/product")
                      ? "text-[#C9A84C]"
                      : "text-black"
                  )}
                >
                  SHOP <ChevronDown className="h-3 w-3" />
                </button>

                {/* Dropdown */}
                <div className="absolute top-full left-1/2 -translate-x-1/2 pt-3 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200">
                  <div className="bg-white border border-neutral-100 shadow-xl p-5 min-w-[480px]">
                    {groups.length > 0 ? (
                      <div className="grid grid-cols-3 gap-6">
                        {groups.map((g) => (
                          <div key={g.group}>
                            <p className="text-[10px] font-bold tracking-widest text-[#C9A84C] mb-3 uppercase">
                              {g.group}
                            </p>
                            <ul className="space-y-1.5">
                              {g.items.map((cat) => (
                                <li key={cat.id}>
                                  <Link
                                    href={`/shop?category=${cat.slug}`}
                                    className="text-xs text-neutral-600 hover:text-black transition-colors block py-0.5"
                                  >
                                    {cat.name}
                                  </Link>
                                </li>
                              ))}
                            </ul>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <Link href="/shop" className="text-sm text-neutral-600 hover:text-black">
                        Shiko të gjitha produktet
                      </Link>
                    )}

                    <div className="border-t border-neutral-100 mt-4 pt-3 flex gap-4">
                      <Link href="/shop?sale=true" className="text-xs font-semibold text-red-600 hover:opacity-80 tracking-widest">
                        ↓ NË ULJE
                      </Link>
                      <Link href="/shop?newArrival=true" className="text-xs font-semibold text-black hover:text-[#C9A84C] tracking-widest">
                        ★ TË REJA
                      </Link>
                    </div>
                  </div>
                </div>
              </li>

              {/* KOLEKSIONE */}
              <li>
                <Link
                  href="/koleksione"
                  className={cn(
                    "text-xs font-semibold tracking-widest transition-colors hover:text-[#C9A84C]",
                    pathname === "/koleksione" ? "text-[#C9A84C]" : "text-black"
                  )}
                >
                  KOLEKSIONE
                </Link>
              </li>

              {/* RRETH NESH */}
              <li>
                <Link
                  href="/rreth-nesh"
                  className={cn(
                    "text-xs font-semibold tracking-widest transition-colors hover:text-[#C9A84C]",
                    pathname === "/rreth-nesh" ? "text-[#C9A84C]" : "text-black"
                  )}
                >
                  RRETH NESH
                </Link>
              </li>

              {/* KONTAKT */}
              <li>
                <Link
                  href="/kontakt"
                  className={cn(
                    "text-xs font-semibold tracking-widest transition-colors hover:text-[#C9A84C]",
                    pathname === "/kontakt" ? "text-[#C9A84C]" : "text-black"
                  )}
                >
                  KONTAKT
                </Link>
              </li>
            </ul>

            {/* Icons */}
            <div className="flex items-center gap-1">
              {/* Search */}
              <button
                onClick={() => setSearchOpen(true)}
                className="p-2 hover:opacity-70 transition-opacity"
                aria-label="Kërko"
              >
                <Search className="h-5 w-5" />
              </button>

              {/* Wishlist */}
              <Link
                href="/wishlist"
                className="relative p-2 hover:opacity-70 transition-opacity"
                aria-label="Të preferuarat"
              >
                <Heart className="h-5 w-5" />
                {hydrated && wishlistCount > 0 && (
                  <span className="absolute -top-0.5 -right-0.5 w-4 h-4 bg-[#C9A84C] text-white text-[9px] font-bold flex items-center justify-center rounded-full">
                    {wishlistCount > 9 ? "9+" : wishlistCount}
                  </span>
                )}
              </Link>

              {/* Cart */}
              <CartButton />
            </div>
          </div>
        </div>

        {/* Mobile menu */}
        {mobileOpen && (
          <div className="md:hidden border-t border-neutral-100 bg-white max-h-[80vh] overflow-y-auto">
            <div className="px-4 py-4 space-y-1">
              <Link href="/" className="block py-2.5 text-xs font-semibold tracking-widest hover:text-[#C9A84C]">
                KREU
              </Link>

              {/* Shop with subcategories */}
              <div>
                <button
                  className="flex items-center justify-between w-full py-2.5 text-xs font-semibold tracking-widest hover:text-[#C9A84C]"
                  onClick={() => setMobileShopOpen(!mobileShopOpen)}
                >
                  SHOP <ChevronDown className={cn("h-3 w-3 transition-transform", mobileShopOpen && "rotate-180")} />
                </button>
                {mobileShopOpen && (
                  <div className="pl-3 pb-2 space-y-3">
                    <Link href="/shop" className="block py-1 text-xs text-neutral-600 font-semibold">
                      Të gjitha
                    </Link>
                    {groups.map((g) => (
                      <div key={g.group}>
                        <p className="text-[9px] font-bold tracking-widest text-[#C9A84C] uppercase mb-1.5">
                          {g.group}
                        </p>
                        <div className="space-y-1">
                          {g.items.map((cat) => (
                            <Link
                              key={cat.id}
                              href={`/shop?category=${cat.slug}`}
                              className="block py-0.5 text-xs text-neutral-600 hover:text-black"
                            >
                              {cat.name}
                            </Link>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              <Link href="/koleksione" className="block py-2.5 text-xs font-semibold tracking-widest hover:text-[#C9A84C]">
                KOLEKSIONE
              </Link>
              <Link href="/rreth-nesh" className="block py-2.5 text-xs font-semibold tracking-widest hover:text-[#C9A84C]">
                RRETH NESH
              </Link>
              <Link href="/kontakt" className="block py-2.5 text-xs font-semibold tracking-widest hover:text-[#C9A84C]">
                KONTAKT
              </Link>
            </div>
          </div>
        )}
      </nav>

      {/* Search Modal */}
      <SearchModal open={searchOpen} onClose={() => setSearchOpen(false)} />
    </>
  );
}
