"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { Plus, Trash2 } from "lucide-react";
import { toast } from "sonner";
import { createCollection, deleteCollection } from "@/app/actions/collections";
import { generateSlug } from "@/lib/utils";

interface Collection {
  id: string;
  name: string;
  slug: string;
  _count: { products: number };
}

export function CollectionManager({ collections }: { collections: Collection[] }) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [name, setName] = useState("");

  const handleCreate = () => {
    if (!name.trim()) return;
    startTransition(async () => {
      const result = await createCollection({ name, slug: generateSlug(name) });
      if (result.success) { toast.success("Koleksioni u krijua!"); setName(""); router.refresh(); }
      else toast.error(result.error);
    });
  };

  const handleDelete = (id: string, colName: string) => {
    if (!confirm(`Fshi koleksionin "${colName}"?`)) return;
    startTransition(async () => {
      const result = await deleteCollection(id);
      if (result.success) { toast.success("Koleksioni u fshi!"); router.refresh(); }
      else toast.error(result.error);
    });
  };

  return (
    <div className="max-w-xl">
      <div className="bg-white border border-neutral-100 p-6 mb-6">
        <h2 className="text-xs font-bold tracking-widest mb-4">SHTO KOLEKSION TË RI</h2>
        <div className="flex gap-3">
          <input
            className="flex-1 border border-neutral-200 px-3 py-2.5 text-sm focus:outline-none focus:border-black"
            placeholder="Emri i koleksionit"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
          <button
            onClick={handleCreate}
            disabled={isPending || !name.trim()}
            className="flex items-center gap-2 bg-black text-white text-xs font-bold tracking-widest px-4 py-2.5 hover:bg-neutral-800 disabled:opacity-50"
          >
            <Plus className="h-4 w-4" /> SHTO
          </button>
        </div>
      </div>
      <div className="bg-white border border-neutral-100">
        {collections.map((col, i) => (
          <div key={col.id} className={`flex items-center justify-between px-5 py-4 ${i > 0 ? "border-t border-neutral-50" : ""}`}>
            <div>
              <p className="text-sm font-medium">{col.name}</p>
              <p className="text-xs text-neutral-400">{col.slug} · {col._count.products} produkte</p>
            </div>
            <button onClick={() => handleDelete(col.id, col.name)} className="p-1.5 hover:text-red-500">
              <Trash2 className="h-4 w-4" />
            </button>
          </div>
        ))}
        {collections.length === 0 && <p className="text-center py-8 text-neutral-400 text-sm">Nuk ka koleksione ende.</p>}
      </div>
    </div>
  );
}
