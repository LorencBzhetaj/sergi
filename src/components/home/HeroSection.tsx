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
    title1: "STIL. CILËSI.",
    title2: "VETËBESIM.",
    subtitle: "Rroba moderne për çdo moment. Zgjidh stilin tënd, dallohu.",
    textDark: true, // light background image → dark text
  },
  {
    id: 2,
    image: "/hero-2.jpg",
    title1: "KOLEKSIONI",
    title2: "I RI.",
    subtitle: "Zbulo veshjet e sezonit të ri. Premium. Minimal. Elegant.",
    textDark: false,
  },
  {
    id: 3,
    image: "/hero-3.jpg",
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
    <div className={`relative h-[90vh] min-h-[560px] max-h-[860px] overflow-hidden ${slide.id === 3 ? "bg-black" : "bg-neutral-100"}`}>
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
          <Image
            src={slide.image}
            alt="Hero"
            fill
            className={slide.id === 3 ? "object-contain" : "object-cover"}
            style={{
              objectPosition:
                slide.id === 1 ? "60% top" :
                "center center"
            }}
            priority
            sizes="100vw"
          />
          <div className={`absolute inset-0 ${slide.textDark ? "bg-gradient-to-r from-white/70 via-white/20 to-transparent" : "bg-gradient-to-r from-black/60 via-black/30 to-transparent"}`} />
        </motion.div>
      </AnimatePresence>

      {/* Content */}
      <div className="relative h-full max-w-7xl mx-auto px-6 flex items-center">
        <AnimatePresence mode="wait">
          <motion.div
            key={slide.id}
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="max-w-xl"
          >
            <h1 className="font-bold leading-none mb-2">
              <span className={`block text-4xl sm:text-5xl lg:text-6xl tracking-tight ${slide.textDark ? "text-black" : "text-white"}`}>
                {slide.title1}
              </span>
              <span className="block text-4xl sm:text-5xl lg:text-6xl text-[#C9A84C] tracking-tight">
                {slide.title2}
              </span>
            </h1>
            <p className={`text-base sm:text-lg mt-4 mb-8 max-w-sm ${slide.textDark ? "text-neutral-600" : "text-neutral-200"}`}>
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

      {/* Slide indicators */}
      <div className="absolute bottom-8 left-0 right-0 max-w-7xl mx-auto px-6">
        <div className="flex items-center gap-4">
          {slides.map((s, i) => (
            <button
              key={s.id}
              onClick={() => setCurrent(i)}
              className="flex items-center gap-2 group"
            >
              <span className={`text-xs font-bold ${i === current ? "text-black" : "text-neutral-400"}`}>
                0{i + 1}
              </span>
              <div className={`h-px transition-all duration-500 ${i === current ? "w-12 bg-black" : "w-6 bg-neutral-300"}`} />
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
