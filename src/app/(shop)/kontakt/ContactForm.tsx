"use client";

import { useState } from "react";
import { toast } from "sonner";
import { submitContact } from "@/app/actions/contact";

export function ContactForm() {
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);

    const form = e.currentTarget;
    const fd = new FormData(form);
    const data = {
      name: String(fd.get("name") || ""),
      email: String(fd.get("email") || ""),
      phone: fd.get("phone") ? String(fd.get("phone")) : undefined,
      message: String(fd.get("message") || ""),
    };

    const result = await submitContact(data);
    setLoading(false);

    if (result.success) {
      toast.success("Mesazhi u dërgua! Do t'ju kontaktojmë së shpejti.");
      form.reset();
    } else {
      toast.error(result.error || "Ndodhi një gabim. Provoni përsëri.");
    }
  };

  return (
    <form className="space-y-4" onSubmit={handleSubmit}>
      <div>
        <label className="block text-xs font-semibold tracking-widest mb-1.5">EMRI</label>
        <input
          type="text"
          name="name"
          placeholder="Emri juaj"
          required
          minLength={2}
          maxLength={100}
          className="w-full border border-neutral-200 px-4 py-3 text-sm focus:outline-none focus:border-black"
        />
      </div>
      <div>
        <label className="block text-xs font-semibold tracking-widest mb-1.5">EMAIL</label>
        <input
          type="email"
          name="email"
          placeholder="Email-i juaj"
          required
          maxLength={254}
          className="w-full border border-neutral-200 px-4 py-3 text-sm focus:outline-none focus:border-black"
        />
      </div>
      <div>
        <label className="block text-xs font-semibold tracking-widest mb-1.5">TELEFONI (opsional)</label>
        <input
          type="tel"
          name="phone"
          placeholder="+355 ..."
          maxLength={20}
          className="w-full border border-neutral-200 px-4 py-3 text-sm focus:outline-none focus:border-black"
        />
      </div>
      <div>
        <label className="block text-xs font-semibold tracking-widest mb-1.5">MESAZHI</label>
        <textarea
          name="message"
          rows={5}
          placeholder="Mesazhi juaj..."
          required
          minLength={10}
          maxLength={2000}
          className="w-full border border-neutral-200 px-4 py-3 text-sm focus:outline-none focus:border-black resize-none"
        />
      </div>
      <button
        type="submit"
        disabled={loading}
        className="w-full bg-black text-white text-xs font-bold tracking-widest py-4 hover:bg-neutral-800 transition-colors disabled:opacity-50"
      >
        {loading ? "Duke dërguar..." : "DËRGO MESAZHIN"}
      </button>
    </form>
  );
}
