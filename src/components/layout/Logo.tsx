"use client";

import Link from "next/link";
import Image from "next/image";

/* ─── Navbar Logo ────────────────────────────────────────────
   Mobile: icon 44px + text
   Desktop: icon 54px + text
   ─────────────────────────────────────────────────────────── */
export function Logo({ className = "" }: { className?: string }) {
  return (
    <Link href="/" className={`flex items-center gap-2 group ${className}`}>
      {/* Smaller on mobile, bigger on desktop */}
      <div className="relative shrink-0 w-10 h-10 sm:w-14 sm:h-14">
        <Image
          src="/icon.png"
          alt="Bogdani Store Logo"
          fill
          className="object-contain"
          priority
        />
      </div>
      <div className="flex flex-col leading-none select-none">
        <span
          className="font-bold text-black text-sm sm:text-base"
          style={{ letterSpacing: "0.22em" }}
        >
          BOGDANI
        </span>
        <span
          className="text-[#C9A84C]"
          style={{ fontSize: "0.52rem", letterSpacing: "0.3em" }}
        >
          — STORE —
        </span>
      </div>
    </Link>
  );
}

/* ─── Admin Sidebar ──────────────────────────────────────── */
export function LogoAdmin() {
  return (
    <div className="flex items-center gap-2.5">
      <div className="relative w-9 h-9 shrink-0">
        <Image src="/icon.png" alt="Bogdani Store" fill className="object-contain" />
      </div>
      <div className="flex flex-col leading-none">
        <span className="font-bold text-xs tracking-widest text-black">BOGDANI</span>
        <span className="text-[#C9A84C]" style={{ fontSize: "0.48rem", letterSpacing: "0.25em" }}>
          ADMIN
        </span>
      </div>
    </div>
  );
}

/* ─── Icon only ──────────────────────────────────────────── */
export function LogoIcon({ size = 40 }: { size?: number }) {
  return (
    <Image src="/icon.png" alt="Bogdani Store" width={size} height={size} className="object-contain" />
  );
}
