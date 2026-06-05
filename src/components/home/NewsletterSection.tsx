"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";

export function NewsletterSection() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;
    setLoading(true);
    try {
      const res = await fetch("/api/newsletter", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });
      if (res.ok) {
        toast.success("U regjistruat me sukses!");
        setEmail("");
      } else {
        const data = await res.json();
        toast.error(data.error || "Ndodhi një gabim. Provoni përsëri.");
      }
    } catch {
      toast.error("Ndodhi një gabim. Provoni përsëri.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="bg-black text-white py-16">
      <div className="max-w-xl mx-auto px-4 text-center">
        <p className="text-[#C9A84C] text-xs font-semibold tracking-widest mb-3">NEWSLETTER</p>
        <h2 className="text-2xl font-bold tracking-tight mb-3">
          Qëndroni të informuar
        </h2>
        <p className="text-neutral-400 text-sm mb-8">
          Regjistrohuni dhe merrni oferta ekskluzive, lajmet e fundit mbi koleksionet e reja dhe zbritjet speciale.
        </p>
        <form onSubmit={handleSubmit} className="flex gap-2 max-w-sm mx-auto">
          <Input
            type="email"
            placeholder="Email-i juaj"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="bg-neutral-900 border-neutral-700 text-white placeholder:text-neutral-500 focus-visible:ring-[#C9A84C]"
            required
          />
          <Button
            type="submit"
            variant="gold"
            disabled={loading}
            className="shrink-0 text-xs font-semibold tracking-widest"
          >
            {loading ? "..." : "REGJISTROHU"}
          </Button>
        </form>
      </div>
    </section>
  );
}
