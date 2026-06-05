"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { ChevronRight, Heart, Star, Plus, Minus } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { WhatsAppButton } from "@/components/product/WhatsAppButton";
import { SizeGuideModal } from "@/components/product/SizeGuideModal";
import { useCart } from "@/store/cart";
import { useWishlist } from "@/store/wishlist";
import { useHydrated } from "@/hooks/useHydrated";
import { formatPrice } from "@/lib/utils";
import type { Product, ProductColor } from "@/types";

export function ProductDetailClient({ product }: { product: Product }) {
  const [selectedImage, setSelectedImage] = useState(0);
  const [selectedSize, setSelectedSize] = useState<string>("");
  const [selectedColor, setSelectedColor] = useState<ProductColor | null>(null);
  const [quantity, setQuantity] = useState(1);
  const [openSection, setOpenSection] = useState<string | null>("details");

  const hydrated = useHydrated();
  const addToCart = useCart((s) => s.addItem);
  const toggleWishlist = useWishlist((s) => s.toggle);
  const _wishlisted = useWishlist((s) => s.isWishlisted(product.slug));
  const isWishlisted = hydrated && _wishlisted;

  const allImages = [product.mainImage, ...(product.images || [])].filter(Boolean);
  const colors = Array.isArray(product.colors)
    ? (product.colors as ProductColor[])
    : [];

  const handleAddToCart = () => {
    if (!selectedSize) { toast.error("Zgjidhni madhësinë!"); return; }
    if (colors.length > 0 && !selectedColor) { toast.error("Zgjidhni ngjyrën!"); return; }
    addToCart({
      productId: product.id,
      name: product.name,
      price: product.price,
      size: selectedSize,
      color: selectedColor?.name || "",
      image: product.mainImage,
      quantity,
      slug: product.slug,
    });
    toast.success("Produkti u shtua në shportë!");
  };

  return (
    <>
      {/* Breadcrumb */}
      <nav className="flex items-center gap-1.5 text-xs text-neutral-500 mb-8">
        <Link href="/" className="hover:text-black">Kreu</Link>
        <ChevronRight className="h-3 w-3" />
        <Link href="/shop" className="hover:text-black">Shop</Link>
        <ChevronRight className="h-3 w-3" />
        <Link href={`/shop?category=${product.category?.slug}`} className="hover:text-black">
          {product.category?.name}
        </Link>
        <ChevronRight className="h-3 w-3" />
        <span className="text-black font-medium">{product.name}</span>
      </nav>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
        {/* Gallery */}
        <div className="flex gap-3">
          {/* Thumbnails */}
          {allImages.length > 1 && (
            <div className="flex flex-col gap-2 w-16 shrink-0">
              {allImages.slice(0, 5).map((img, i) => (
                <button
                  key={i}
                  onClick={() => setSelectedImage(i)}
                  className={`relative aspect-square overflow-hidden border-2 transition-colors ${
                    selectedImage === i ? "border-black" : "border-neutral-200"
                  }`}
                >
                  <Image src={img} alt={`${product.name} ${i + 1}`} fill className="object-cover" sizes="64px" />
                </button>
              ))}
            </div>
          )}

          {/* Main image */}
          <div className="flex-1 relative aspect-[3/4] overflow-hidden bg-neutral-100 zoom-container">
            <AnimatePresence mode="wait">
              <motion.div
                key={selectedImage}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.3 }}
                className="absolute inset-0"
              >
                <Image
                  src={allImages[selectedImage] || product.mainImage}
                  alt={product.name}
                  fill
                  className="object-cover"
                  priority
                  sizes="(max-width: 1024px) 100vw, 50vw"
                />
              </motion.div>
            </AnimatePresence>

            {/* Badges */}
            <div className="absolute top-4 left-4 flex flex-col gap-2">
              {product.newArrival && <Badge variant="new" className="text-[10px] tracking-widest">NEW</Badge>}
              {product.onSale && <Badge variant="sale" className="text-[10px] tracking-widest">SALE</Badge>}
            </div>
          </div>
        </div>

        {/* Product Info */}
        <div>
          <div className="flex items-start justify-between">
            <div>
              <p className="text-xs text-neutral-500 tracking-widest mb-1">{product.category?.name}</p>
              <h1 className="text-2xl font-bold text-black">{product.name}</h1>
            </div>
            <button
              onClick={() => {
                toggleWishlist(product.slug);
                toast(isWishlisted ? "Hequr nga të preferuarat" : "Shtuar në të preferuarat ❤️", { duration: 1500 });
              }}
              className="p-2 border border-neutral-200 hover:border-black transition-colors"
              aria-label={isWishlisted ? "Hiq nga të preferuarat" : "Shto në të preferuarat"}
            >
              <Heart
                className="h-5 w-5"
                fill={isWishlisted ? "#C9A84C" : "none"}
                stroke={isWishlisted ? "#C9A84C" : "currentColor"}
              />
            </button>
          </div>

          {/* Quality badge (jo review fals) */}
          <div className="flex items-center gap-2 mt-2">
            <div className="flex gap-0.5">
              {[1, 2, 3, 4, 5].map((s) => (
                <Star key={s} className="h-3.5 w-3.5 fill-[#C9A84C] text-[#C9A84C]" />
              ))}
            </div>
            <span className="text-xs text-neutral-500">Cilësi premium e garantuar</span>
          </div>

          {/* Price */}
          <div className="flex items-center gap-3 mt-4">
            <span className="text-2xl font-bold">{formatPrice(product.price)}</span>
            {product.comparePrice && (
              <span className="text-lg text-neutral-400 line-through">{formatPrice(product.comparePrice)}</span>
            )}
            {product.comparePrice && (
              <Badge variant="sale" className="text-[10px]">
                -{Math.round(((product.comparePrice - product.price) / product.comparePrice) * 100)}%
              </Badge>
            )}
          </div>

          {/* Color selector */}
          {colors.length > 0 && (
            <div className="mt-6">
              <p className="text-xs font-semibold tracking-widest mb-3">
                NGJYRA: {selectedColor ? selectedColor.name : "—"}
              </p>
              <div className="flex gap-2">
                {colors.map((c) => (
                  <button
                    key={c.hex}
                    title={c.name}
                    onClick={() => setSelectedColor(c)}
                    className={`w-8 h-8 rounded-full border-2 transition-all ${
                      selectedColor?.hex === c.hex ? "border-black scale-110" : "border-neutral-300"
                    }`}
                    style={{ backgroundColor: c.hex }}
                  />
                ))}
              </div>
            </div>
          )}

          {/* Size selector */}
          <div className="mt-6">
            <div className="flex items-center justify-between mb-3">
              <p className="text-xs font-semibold tracking-widest">MASA: {selectedSize || "—"}</p>
              <SizeGuideModal />
            </div>
            <div className="flex gap-2 flex-wrap">
              {product.sizes.map((size) => (
                <button
                  key={size}
                  onClick={() => setSelectedSize(size)}
                  className={`w-12 h-10 border text-xs font-semibold transition-all ${
                    selectedSize === size
                      ? "border-black bg-black text-white"
                      : "border-neutral-200 hover:border-black text-black"
                  }`}
                >
                  {size}
                </button>
              ))}
            </div>
          </div>

          {/* Quantity */}
          <div className="mt-6">
            <p className="text-xs font-semibold tracking-widest mb-3">SASIA</p>
            <div className="flex items-center border border-neutral-200 w-fit">
              <button
                onClick={() => setQuantity(Math.max(1, quantity - 1))}
                className="w-10 h-10 flex items-center justify-center hover:bg-neutral-50"
              >
                <Minus className="h-3.5 w-3.5" />
              </button>
              <span className="w-10 text-center text-sm font-medium">{quantity}</span>
              <button
                onClick={() => setQuantity(Math.min(product.stock, quantity + 1))}
                className="w-10 h-10 flex items-center justify-center hover:bg-neutral-50"
              >
                <Plus className="h-3.5 w-3.5" />
              </button>
            </div>
          </div>

          {/* Actions */}
          <div className="mt-8 space-y-3">
            <WhatsAppButton
              productId={product.id}
              productSlug={product.slug}
              size={selectedSize}
              color={selectedColor?.name || (colors[0]?.name || "")}
              quantity={quantity}
              disabled={!selectedSize || (colors.length > 0 && !selectedColor)}
            />
            <Button
              variant="outline"
              size="xl"
              className="w-full text-xs font-semibold tracking-widest"
              onClick={handleAddToCart}
            >
              SHTO NË SHPORTË
            </Button>
          </div>

          {/* Info sections */}
          <div className="mt-8 border-t border-neutral-100">
            {[
              {
                id: "details",
                title: "DETAJET E PRODUKTIT",
                content: product.description,
              },
              {
                id: "shipping",
                title: "TRANSPORTI & KTHIMET",
                content:
                  "Transport falas për porosi mbi 5,000 Lek. Dorëzimi brenda 1-3 ditëve pune. Kthim i lirë brenda 14 ditësh.",
              },
              {
                id: "material",
                title: "MATERIALI & KUJDESI",
                content:
                  "100% Pambuk organik premium. Lajeni me dorë ose me lavastovilje në 30°C. Mos e vendosni në tharëse.",
              },
            ].map((section) => (
              <div key={section.id} className="border-b border-neutral-100">
                <button
                  onClick={() => setOpenSection(openSection === section.id ? null : section.id)}
                  className="w-full flex items-center justify-between py-4 text-xs font-semibold tracking-widest hover:text-[#C9A84C] transition-colors"
                >
                  {section.title}
                  <span className="text-lg">{openSection === section.id ? "−" : "+"}</span>
                </button>
                <AnimatePresence>
                  {openSection === section.id && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.2 }}
                      className="overflow-hidden"
                    >
                      <p className="text-sm text-neutral-600 leading-relaxed pb-4">{section.content}</p>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            ))}
          </div>
        </div>
      </div>
    </>
  );
}
