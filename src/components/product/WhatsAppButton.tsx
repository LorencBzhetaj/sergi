"use client";

import { useState } from "react";
import { MessageCircle, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

interface WhatsAppButtonProps {
  productId: string;       // needed to save order in DB
  productSlug: string;
  size: string;
  color: string;
  quantity?: number;
  disabled?: boolean;
  className?: string;
}

export function WhatsAppButton({
  productId,
  productSlug,
  size,
  color,
  quantity = 1,
  disabled,
  className,
}: WhatsAppButtonProps) {
  const [loading, setLoading] = useState(false);

  const handleClick = async () => {
    if (!size) { toast.error("Zgjidhni madhësinë!"); return; }
    if (!color) { toast.error("Zgjidhni ngjyrën!"); return; }

    setLoading(true);
    try {
      // Save order intent in DB — prices validated server-side
      const res = await fetch("/api/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          items: [{ productId, size, color, quantity }],
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        toast.error(data.error || "Ndodhi një gabim. Provoni përsëri.");
        return;
      }

      // Open WhatsApp with server-generated message
      window.open(data.whatsappUrl, "_blank");
    } catch {
      // Fallback: open WhatsApp without saving (so customer isn't blocked)
      const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://bogdanistore.com";
      const msg = `Pershendetje, dua te porosis:\n\nProdukti: ${productSlug}\nMasa: ${size}\nNgjyra: ${color}\n\nLink: ${siteUrl}/product/${productSlug}`;
      window.open(`https://wa.me/${process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || "355692111876"}?text=${encodeURIComponent(msg)}`, "_blank");
      toast.error("Porosi u dërgua, por nuk u ruajt. Kontrolloni lidhjen.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Button
      variant="whatsapp"
      size="xl"
      className={`w-full font-semibold tracking-wide ${className || ""}`}
      onClick={handleClick}
      disabled={disabled || loading}
    >
      {loading ? (
        <Loader2 className="h-5 w-5 animate-spin" />
      ) : (
        <MessageCircle className="h-5 w-5" />
      )}
      {loading ? "Duke përgatitur..." : "POROSIT NË WHATSAPP"}
    </Button>
  );
}
