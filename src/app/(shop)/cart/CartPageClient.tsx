"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Minus, Plus, X, ShoppingBag, MessageCircle, Loader2 } from "lucide-react";
import { useCart } from "@/store/cart";
import { Button } from "@/components/ui/button";
import { formatPrice } from "@/lib/utils";
import { toast } from "sonner";

export default function CartPageClient() {
  const { items, removeItem, updateQuantity, total, itemCount, clearCart } = useCart();
  const [loading, setLoading] = useState(false);
  const cartTotal = total();
  const count = itemCount();
  const shipping = cartTotal >= 5000 ? 0 : 300;

  const handleWhatsAppCheckout = async () => {
    if (items.length === 0) return;
    setLoading(true);
    try {
      // Save order in DB — server validates all prices, generates WhatsApp URL
      const res = await fetch("/api/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          items: items.map((i) => ({
            productId: i.productId,
            size: i.size,
            color: i.color,
            quantity: i.quantity,
          })),
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        toast.error(data.error || "Ndodhi një gabim. Provoni përsëri.");
        return;
      }

      // Open WhatsApp with server-generated message
      window.open(data.whatsappUrl, "_blank");
      // Optional: clear cart after sending
      // clearCart();
    } catch {
      toast.error("Nuk mund të lidhemi me serverin. Kontrolloni internetin.");
    } finally {
      setLoading(false);
    }
  };

  if (count === 0) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-24 text-center">
        <ShoppingBag className="h-16 w-16 text-neutral-300 mx-auto mb-4" />
        <h1 className="text-xl font-bold tracking-widest mb-2">SHPORTA JUAJ ËSHTË BOSH</h1>
        <p className="text-neutral-500 mb-8">Shtoni produkte për të vazhduar me porosinë.</p>
        <Button asChild size="lg">
          <Link href="/shop">SHFLETONI SHOP</Link>
        </Button>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-12">
      <h1 className="text-2xl font-bold tracking-widest mb-8">SHPORTA JOTE ({count})</h1>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
        {/* Items */}
        <div className="lg:col-span-2 space-y-4">
          {items.map((item) => (
            <div
              key={`${item.productId}-${item.size}-${item.color}`}
              className="flex gap-4 border border-neutral-100 p-4"
            >
              <Link href={`/product/${item.slug}`} className="relative w-20 h-24 shrink-0 bg-neutral-100">
                <Image src={item.image} alt={item.name} fill className="object-cover" sizes="80px" />
              </Link>
              <div className="flex-1 min-w-0">
                <div className="flex items-start justify-between">
                  <div>
                    <Link
                      href={`/product/${item.slug}`}
                      className="font-medium text-sm hover:text-[#C9A84C] transition-colors"
                    >
                      {item.name}
                    </Link>
                    <p className="text-xs text-neutral-500 mt-0.5">
                      Ngjyra: {item.color} · Masa: {item.size}
                    </p>
                  </div>
                  <button
                    onClick={() => removeItem(item.productId, item.size, item.color)}
                    className="p-1 hover:text-red-500 transition-colors"
                    aria-label="Hiq"
                  >
                    <X className="h-4 w-4" />
                  </button>
                </div>
                <div className="flex items-center justify-between mt-3">
                  <div className="flex items-center border border-neutral-200">
                    <button
                      onClick={() => updateQuantity(item.productId, item.size, item.color, item.quantity - 1)}
                      className="w-8 h-8 flex items-center justify-center hover:bg-neutral-50"
                    >
                      <Minus className="h-3 w-3" />
                    </button>
                    <span className="w-8 text-center text-sm">{item.quantity}</span>
                    <button
                      onClick={() => updateQuantity(item.productId, item.size, item.color, item.quantity + 1)}
                      className="w-8 h-8 flex items-center justify-center hover:bg-neutral-50"
                    >
                      <Plus className="h-3 w-3" />
                    </button>
                  </div>
                  <span className="font-semibold text-sm">{formatPrice(item.price * item.quantity)}</span>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Summary */}
        <div className="lg:col-span-1">
          <div className="border border-neutral-100 p-6 sticky top-24">
            <h2 className="text-sm font-bold tracking-widest mb-6">PËRMBLEDHJA E POROSISË</h2>

            <div className="space-y-3 text-sm">
              <div className="flex justify-between">
                <span className="text-neutral-600">Nëntotali</span>
                <span>{formatPrice(cartTotal)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-neutral-600">Transporti</span>
                <span className={shipping === 0 ? "text-green-600 font-medium" : ""}>
                  {shipping === 0 ? "Falas" : formatPrice(shipping)}
                </span>
              </div>
              {cartTotal < 5000 && (
                <p className="text-xs text-neutral-400">
                  Shtoni {formatPrice(5000 - cartTotal)} më shumë për transport falas.
                </p>
              )}
              <div className="border-t border-neutral-100 pt-3 flex justify-between font-bold text-base">
                <span>TOTALI</span>
                <span>{formatPrice(cartTotal + shipping)}</span>
              </div>
            </div>

            <button
              onClick={handleWhatsAppCheckout}
              disabled={loading}
              className="mt-6 w-full flex items-center justify-center gap-2 bg-black text-white text-xs font-bold tracking-widest py-4 hover:bg-neutral-800 transition-colors disabled:opacity-60"
            >
              {loading ? (
                <><Loader2 className="h-4 w-4 animate-spin" /> Duke përgatitur...</>
              ) : (
                <><MessageCircle className="h-4 w-4" /> POROSIT NË WHATSAPP</>
              )}
            </button>

            <p className="text-xs text-neutral-400 text-center mt-3">
              Porositë konfirmohen nëpërmjet WhatsApp. Numri: +355 69 211 1876
            </p>

            <div className="mt-6 pt-6 border-t border-neutral-100">
              <h3 className="text-xs font-bold tracking-widest mb-4">SI FUNKSIONON?</h3>
              <ol className="space-y-2">
                {[
                  "Kliko \"Porosit në WhatsApp\"",
                  "Porosi regjistrohet automatikisht",
                  "WhatsApp hapet me detajet",
                  "Ne konfirmojmë brenda 1-3 ditësh",
                ].map((step, i) => (
                  <li key={i} className="flex gap-2 text-xs text-neutral-500">
                    <span className="text-[#C9A84C] font-bold shrink-0">{i + 1}.</span>
                    {step}
                  </li>
                ))}
              </ol>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
