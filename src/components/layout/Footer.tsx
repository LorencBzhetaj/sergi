"use client";

import Link from "next/link";
import { MessageCircle } from "lucide-react";
import { Logo } from "./Logo";

export function Footer() {
  return (
    <footer className="bg-black text-white mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-16">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10">
          {/* Brand */}
          <div className="md:col-span-1">
            <div className="flex items-center gap-3 mb-4">
              <div className="rounded-full bg-white p-0.5 shrink-0">
                <img src="/icon.png" alt="Bogdani Store" width={52} height={52} className="rounded-full object-contain" />
              </div>
              <div>
                <div className="font-bold text-lg tracking-widest text-white">BOGDANI</div>
                <div className="text-[10px] tracking-[0.3em] text-[#C9A84C]">— STORE —</div>
              </div>
            </div>
            <p className="text-neutral-400 text-sm leading-relaxed mb-6">
              Stil. Cilësi. Vetëbesim. Rroba moderne për çdo moment.
            </p>
            <div className="flex gap-3">
              <a href="https://instagram.com" target="_blank" rel="noopener noreferrer"
                className="w-9 h-9 border border-neutral-700 flex items-center justify-center hover:border-[#C9A84C] hover:text-[#C9A84C] transition-colors text-xs font-bold">
                IG
              </a>
              <a href="https://facebook.com" target="_blank" rel="noopener noreferrer"
                className="w-9 h-9 border border-neutral-700 flex items-center justify-center hover:border-[#C9A84C] hover:text-[#C9A84C] transition-colors text-xs font-bold">
                FB
              </a>
              <a href={`https://wa.me/${process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || "355692111876"}`}
                target="_blank" rel="noopener noreferrer"
                className="w-9 h-9 border border-neutral-700 flex items-center justify-center hover:border-[#C9A84C] hover:text-[#C9A84C] transition-colors">
                <MessageCircle className="h-4 w-4" />
              </a>
            </div>
          </div>

          {/* Shop */}
          <div>
            <h4 className="text-xs font-bold tracking-widest text-[#C9A84C] mb-5">SHOP</h4>
            <ul className="space-y-3">
              {["Hoodies", "T-Shirts", "Sweatshirts", "Pantallona"].map((item) => (
                <li key={item}>
                  <Link href={`/shop?category=${item.toLowerCase().replace(" ", "-")}`}
                    className="text-sm text-neutral-400 hover:text-white transition-colors">
                    {item}
                  </Link>
                </li>
              ))}
              <li>
                <Link href="/koleksione" className="text-sm text-neutral-400 hover:text-white transition-colors">
                  Koleksione
                </Link>
              </li>
            </ul>
          </div>

          {/* Info */}
          <div>
            <h4 className="text-xs font-bold tracking-widest text-[#C9A84C] mb-5">INFORMACION</h4>
            <ul className="space-y-3">
              {[
                { label: "Rreth Nesh", href: "/rreth-nesh" },
                { label: "Kontakt", href: "/kontakt" },
                { label: "Transporti & Kthimet", href: "/shipping" },
                { label: "Politika e Privatësisë", href: "/privacy-policy" },
                { label: "Kushtet e Shërbimit", href: "/terms" },
              ].map((item) => (
                <li key={item.href}>
                  <Link href={item.href} className="text-sm text-neutral-400 hover:text-white transition-colors">
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Newsletter */}
          <div>
            <h4 className="text-xs font-bold tracking-widest text-[#C9A84C] mb-5">NEWSLETTER</h4>
            <p className="text-sm text-neutral-400 mb-4">
              Regjistrohu për oferta ekskluzive dhe koleksione të reja.
            </p>
            <form className="flex flex-col gap-2" onSubmit={(e) => e.preventDefault()}>
              <input
                type="email"
                placeholder="Email-i juaj"
                className="bg-neutral-900 border border-neutral-700 text-white text-sm px-4 py-2.5 placeholder:text-neutral-500 focus:outline-none focus:border-[#C9A84C]"
              />
              <button
                type="submit"
                className="bg-[#C9A84C] text-white text-xs font-semibold tracking-widest py-2.5 hover:bg-[#A8893F] transition-colors"
              >
                REGJISTROHU
              </button>
            </form>
          </div>
        </div>

        <div className="border-t border-neutral-800 mt-12 pt-8 flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-xs text-neutral-500">
            © {new Date().getFullYear()} Bogdani Store. Të gjitha të drejtat e rezervuara.
          </p>
          <p className="text-xs text-neutral-600">
            <a
              href="https://share.google/Mv4TT4DtpPbf1dsVo"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-[#C9A84C] transition-colors"
            >
              📍 Tiranë, Shqipëri
            </a>
            {" • "}
            <a href="https://wa.me/355692111876" target="_blank" rel="noopener noreferrer" className="hover:text-[#C9A84C] transition-colors">
              WhatsApp: +355 69 211 1876
            </a>
          </p>
        </div>
      </div>
    </footer>
  );
}
