"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";

const slides = [
  {
    id: 1,
    image: "/hero-1.jpg",
    imageMobile: "/hero-1-mobile.jpg", // dedicated portrait crop for mobile
    title1: "STIL. CILËSI.",
    title2: "VETËBESIM.",
    subtitle: "Rroba moderne për çdo moment. Zgjidh stilin tënd, dallohu.",
    textDark: true, // light background image → dark text
  },
  {
    id: 2,
    image: "/hero-2.jpg",
    imageMobile: "/hero-2-mobile.jpg",
    title1: "KOLEKSIONI",
    title2: "I RI.",
    subtitle: "Zbulo veshjet e sezonit të ri. Premium. Minimal. Elegant.",
    textDark: false,
  },
  {
    id: 3,
    image: "/hero-3.jpg",
    imageMobile: "/hero-3-mobile.jpg",
    title1: "EKSPERIENCA",
    title2: "BOGADNI.",
    subtitle: "Cilësi premium dhe shërbim i përkushtuar. Vizito dyqanin tonë.",
    textDark: false,
  },
];

export function HeroSection() {
  const [current, setCurrent] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrent((c) => (c + 1) % slides.length);
    }, 5000);
    return () => clearInterval(timer);
  }, []);

  const slide = slides[current];

  return (
    // Mobile: shorter height. Desktop (sm:+) = IDENTICAL to original (90vh / 560-860px).
    <div className={`relative h-[68vh] min-h-[420px] max-h-[540px] sm:h-[90vh] sm:min-h-[560px] sm:max-h-[860px] overflow-hidden ${slide.id === 3 ? "bg-black" : "bg-neutral-100"}`}>
      {/* Background image */}
      <AnimatePresence mode="wait">
        <motion.div
          key={slide.id}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.8 }}
          className="absolute inset-0"
        >
          {/* MOBILE only — dedicated portrait image fills perfectly with object-cover */}
          <Image
            src={slide.imageMobile}
            alt="Hero"
            fill
            className="object-cover sm:hidden"
            priority
            sizes="100vw"
          />
          {/* DESKTOP only (sm:+) — IDENTICAL to original behavior */}
          <Image
            src={slide.image}
            alt="Hero"
            fill
            className={`hidden sm:block ${slide.id === 3 ? "object-contain" : "object-cover"}`}
            style={{
              objectPosition:
                slide.id === 1 ? "60% top" :
                "center center"
            }}
            priority
            sizes="100vw"
          />
          {/* Desktop gradient (sm:+) = IDENTICAL to original (to-r).
              Mobile = bottom-up gradient so text at bottom is readable. */}
          <div className={`absolute inset-0 ${
            slide.textDark
              ? "bg-gradient-to-t from-white/90 via-white/25 to-transparent sm:bg-gradient-to-r sm:from-white/70 sm:via-white/20 sm:to-transparent"
              : "bg-gradient-to-t from-black/80 via-black/25 to-transparent sm:bg-gradient-to-r sm:from-black/60 sm:via-black/30 sm:to-transparent"
          }`} />
        </motion.div>
      </AnimatePresence>

      {/* Content — mobile: bottom-aligned. Desktop (sm:+): centered, IDENTICAL to original. */}
      <div className="relative h-full max-w-7xl mx-auto px-5 sm:px-6 flex items-end pb-16 sm:items-center sm:pb-0">
        <AnimatePresence mode="wait">
          <motion.div
            key={slide.id}
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="max-w-xl"
          >
            <h1 className="font-bold leading-[1.05] sm:leading-none mb-2">
              {/* Mobile: text-2xl. Desktop (sm:+) = IDENTICAL to original (5xl/6xl). */}
              <span className={`block text-2xl sm:text-5xl lg:text-6xl tracking-tight ${slide.textDark ? "text-black" : "text-white"}`}>
                {slide.title1}
              </span>
              <span className="block text-2xl sm:text-5xl lg:text-6xl text-[#C9A84C] tracking-tight">
                {slide.title2}
              </span>
            </h1>
            <p className={`text-sm sm:text-lg mt-2.5 sm:mt-4 mb-5 sm:mb-8 max-w-xs sm:max-w-sm ${slide.textDark ? "text-neutral-700 sm:text-neutral-600" : "text-neutral-100 sm:text-neutral-200"}`}>
              {slide.subtitle}
            </p>
            <div className="flex flex-wrap gap-3">
              <Button asChild size="lg" className="text-xs font-semibold tracking-widest">
                <Link href="/shop">SHOP NOW</Link>
              </Button>
              <Button asChild variant="outline" size="lg" className="text-xs font-semibold tracking-widest">
                <Link href="/koleksione">ZBULO KOLEKSIONIN</Link>
              </Button>
            </div>
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Slide indicators — desktop (sm:+) IDENTICAL to original. Mobile: tighter + adaptive color. */}
      <div className="absolute bottom-4 sm:bottom-8 left-0 right-0 max-w-7xl mx-auto px-5 sm:px-6">
        <div className="flex items-center gap-4">
          {slides.map((s, i) => (
            <button
              key={s.id}
              onClick={() => setCurrent(i)}
              className="flex items-center gap-2 group"
              aria-label={`Slide ${i + 1}`}
            >
              {/* On mobile, color adapts to slide (white on dark images). Desktop keeps original black. */}
              <span className={`text-xs font-bold ${
                i === current
                  ? `${slide.textDark ? "text-black" : "text-white"} sm:text-black`
                  : "text-neutral-400"
              }`}>
                0{i + 1}
              </span>
              <div className={`h-px transition-all duration-500 ${
                i === current
                  ? `w-12 ${slide.textDark ? "bg-black" : "bg-white"} sm:bg-black`
                  : "w-6 bg-neutral-300"
              }`} />
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
