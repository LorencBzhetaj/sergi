"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { signOut } from "next-auth/react";
import {
  LayoutDashboard, Package, Tag, Layers,
  ShoppingBag, MessageSquare, BarChart2, LogOut, Menu, X,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { LogoAdmin } from "@/components/layout/Logo";

const navItems = [
  { label: "Paneli Kryesor", href: "/admin",             icon: LayoutDashboard },
  { label: "Produkte",       href: "/admin/products",    icon: Package },
  { label: "Kategori",       href: "/admin/categories",  icon: Tag },
  { label: "Koleksione",     href: "/admin/collections", icon: Layers },
  { label: "Porosi",         href: "/admin/orders",      icon: ShoppingBag },
  { label: "Mesazhet",       href: "/admin/mesazhet",    icon: MessageSquare },
  { label: "Statistikat",    href: "/admin/stats",       icon: BarChart2 },
];

export function AdminSidebar() {
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);

  const NavContent = () => (
    <>
      {/* Logo */}
      <div className="px-5 py-5 border-b border-neutral-100 flex items-center justify-between">
        <LogoAdmin />
        <button className="lg:hidden p-1" onClick={() => setMobileOpen(false)}>
          <X className="h-5 w-5 text-neutral-400" />
        </button>
      </div>

      {/* Nav links */}
      <nav className="flex-1 py-4 px-3 overflow-y-auto">
        <ul className="space-y-0.5">
          {navItems.map((item) => {
            const isActive = item.href === "/admin"
              ? pathname === "/admin"
              : pathname.startsWith(item.href);
            return (
              <li key={item.href}>
                <Link
                  href={item.href}
                  onClick={() => setMobileOpen(false)}
                  className={cn(
                    "flex items-center gap-3 px-3 py-3 text-sm font-medium transition-colors rounded",
                    isActive
                      ? "bg-black text-white"
                      : "text-neutral-600 hover:bg-neutral-50 hover:text-black"
                  )}
                >
                  <item.icon className="h-4 w-4 shrink-0" />
                  {item.label}
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>

      {/* Logout */}
      <div className="px-3 py-4 border-t border-neutral-100">
        <button
          onClick={() => signOut({ callbackUrl: "/admin/login" })}
          className="flex items-center gap-3 px-3 py-3 text-sm font-medium text-neutral-600 hover:text-red-600 w-full transition-colors rounded hover:bg-red-50"
        >
          <LogOut className="h-4 w-4" />
          Dal nga paneli
        </button>
      </div>
    </>
  );

  return (
    <>
      {/* Mobile topbar */}
      <div className="lg:hidden fixed top-0 left-0 right-0 z-40 bg-white border-b border-neutral-100 flex items-center justify-between px-4 h-14">
        <LogoAdmin />
        <button onClick={() => setMobileOpen(true)} className="p-2" aria-label="Menu">
          <Menu className="h-5 w-5" />
        </button>
      </div>

      {/* Mobile overlay */}
      {mobileOpen && (
        <div
          className="lg:hidden fixed inset-0 z-50 bg-black/40"
          onClick={() => setMobileOpen(false)}
        />
      )}

      {/* Mobile drawer */}
      <aside
        className={cn(
          "lg:hidden fixed top-0 left-0 z-50 h-full w-72 bg-white flex flex-col shadow-xl transition-transform duration-300",
          mobileOpen ? "translate-x-0" : "-translate-x-full"
        )}
      >
        <NavContent />
      </aside>

      {/* Desktop sidebar */}
      <aside className="hidden lg:flex w-56 bg-white border-r border-neutral-100 flex-col min-h-screen sticky top-0">
        <NavContent />
      </aside>
    </>
  );
}
