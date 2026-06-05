"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { useRouter } from "next/navigation";
import { Search, X, Loader2 } from "lucide-react";
import Image from "next/image";
import { formatPrice } from "@/lib/utils";
import type { Product } from "@/types";

interface SearchModalProps {
  open: boolean;
  onClose: () => void;
}

export function SearchModal({ open, onClose }: SearchModalProps) {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<Product[]>([]);
  const [loading, setLoading] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const router = useRouter();
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    if (open) {
      setTimeout(() => inputRef.current?.focus(), 50);
    } else {
      setQuery("");
      setResults([]);
    }
  }, [open]);

  const search = useCallback(async (q: string) => {
    if (!q.trim() || q.length < 2) { setResults([]); return; }
    setLoading(true);
    try {
      const res = await fetch(`/api/products?q=${encodeURIComponent(q)}&limit=6`);
      const data = await res.json();
      setResults(Array.isArray(data) ? data : []);
    } catch {
      setResults([]);
    } finally {
      setLoading(false);
    }
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setQuery(val);
    if (debounceRef.current) clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => search(val), 300);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (query.trim()) {
      router.push(`/shop?q=${encodeURIComponent(query.trim())}`);
      onClose();
    }
  };

  const handleSelect = (slug: string) => {
    router.push(`/product/${slug}`);
    onClose();
  };

  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-50 bg-black/40 backdrop-blur-sm"
      onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}
    >
      <div className="bg-white w-full max-w-2xl mx-auto mt-16 shadow-2xl">
        {/* Search input */}
        <form onSubmit={handleSubmit} className="flex items-center border-b border-neutral-200 px-4">
          <Search className="h-5 w-5 text-neutral-400 shrink-0" />
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={handleChange}
            placeholder="Kërko produkte..."
            className="flex-1 px-4 py-4 text-sm outline-none bg-transparent"
          />
          {loading && <Loader2 className="h-4 w-4 animate-spin text-neutral-400 mr-2" />}
          <button
            type="button"
            onClick={onClose}
            className="p-2 hover:text-black text-neutral-400"
          >
            <X className="h-5 w-5" />
          </button>
        </form>

        {/* Results */}
        {results.length > 0 && (
          <ul className="divide-y divide-neutral-100 max-h-96 overflow-y-auto">
            {results.map((p) => (
              <li key={p.id}>
                <button
                  onClick={() => handleSelect(p.slug)}
                  className="w-full flex items-center gap-4 px-5 py-3 hover:bg-neutral-50 text-left transition-colors"
                >
                  <div className="relative w-12 h-14 bg-neutral-100 shrink-0 overflow-hidden">
                    <Image src={p.mainImage} alt={p.name} fill className="object-cover" sizes="48px" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-black truncate">{p.name}</p>
                    <p className="text-xs text-neutral-500">{p.category?.name}</p>
                  </div>
                  <span className="text-sm font-semibold text-black shrink-0">{formatPrice(p.price)}</span>
                </button>
              </li>
            ))}
          </ul>
        )}

        {query.length >= 2 && !loading && results.length === 0 && (
          <div className="px-5 py-8 text-center text-sm text-neutral-500">
            Asnjë produkt nuk u gjet për &quot;{query}&quot;
          </div>
        )}

        {/* Quick links */}
        {query.length < 2 && (
          <div className="px-5 py-4">
            <p className="text-[10px] font-semibold tracking-widest text-neutral-400 mb-3">KËRKO TË SHPEJTA</p>
            <div className="flex flex-wrap gap-2">
              {["Hoodie", "T-Shirt", "Cargo", "Sweatshirt", "Jogger"].map((term) => (
                <button
                  key={term}
                  onClick={() => { setQuery(term); search(term); }}
                  className="px-3 py-1.5 border border-neutral-200 text-xs hover:border-black transition-colors"
                >
                  {term}
                </button>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
