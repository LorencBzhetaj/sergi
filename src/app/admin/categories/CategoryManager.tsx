"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { Plus, Trash2 } from "lucide-react";
import { toast } from "sonner";
import { createCategory, deleteCategory } from "@/app/actions/categories";
import { generateSlug } from "@/lib/utils";

interface Category {
  id: string;
  name: string;
  slug: string;
  _count: { products: number };
}

export function CategoryManager({ categories }: { categories: Category[] }) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [name, setName] = useState("");
  const [slug, setSlug] = useState("");

  const handleCreate = () => {
    if (!name.trim()) return;
    startTransition(async () => {
      const result = await createCategory({ name, slug: slug || generateSlug(name) });
      if (result.success) {
        toast.success("Kategoria u krijua!");
        setName(""); setSlug("");
        router.refresh();
      } else {
        toast.error(result.error);
      }
    });
  };

  const handleDelete = (id: string, catName: string) => {
    if (!confirm(`Fshi kategorinë "${catName}"?`)) return;
    startTransition(async () => {
      const result = await deleteCategory(id);
      if (result.success) { toast.success("Kategoria u fshi!"); router.refresh(); }
      else toast.error(result.error);
    });
  };

  return (
    <div className="max-w-xl">
      {/* Add form */}
      <div className="bg-white border border-neutral-100 p-6 mb-6">
        <h2 className="text-xs font-bold tracking-widest mb-4">SHTO KATEGORI TË RE</h2>
        <div className="flex gap-3">
          <input
            className="flex-1 border border-neutral-200 px-3 py-2.5 text-sm focus:outline-none focus:border-black"
            placeholder="Emri i kategorisë"
            value={name}
            onChange={(e) => { setName(e.target.value); setSlug(generateSlug(e.target.value)); }}
          />
          <button
            onClick={handleCreate}
            disabled={isPending || !name.trim()}
            className="flex items-center gap-2 bg-black text-white text-xs font-bold tracking-widest px-4 py-2.5 hover:bg-neutral-800 disabled:opacity-50"
          >
            <Plus className="h-4 w-4" /> SHTO
          </button>
        </div>
        {slug && <p className="text-xs text-neutral-400 mt-2">Slug: {slug}</p>}
      </div>

      {/* List */}
      <div className="bg-white border border-neutral-100">
        {categories.map((cat, i) => (
          <div key={cat.id} className={`flex items-center justify-between px-5 py-4 ${i > 0 ? "border-t border-neutral-50" : ""}`}>
            <div>
              <p className="text-sm font-medium">{cat.name}</p>
              <p className="text-xs text-neutral-400">{cat.slug} · {cat._count.products} produkte</p>
            </div>
            <button onClick={() => handleDelete(cat.id, cat.name)} className="p-1.5 hover:text-red-500 transition-colors">
              <Trash2 className="h-4 w-4" />
            </button>
          </div>
        ))}
        {categories.length === 0 && (
          <p className="text-center py-8 text-neutral-400 text-sm">Nuk ka kategori ende.</p>
        )}
      </div>
    </div>
  );
}
