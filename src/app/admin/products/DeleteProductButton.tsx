"use client";

import { useState } from "react";
import { Trash2 } from "lucide-react";
import { deleteProduct } from "@/app/actions/products";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

export function DeleteProductButton({ id, name }: { id: string; name: string }) {
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleDelete = async () => {
    if (!confirm(`Jeni të sigurt që doni të fshini "${name}"?`)) return;
    setLoading(true);
    const result = await deleteProduct(id);
    setLoading(false);
    if (result.success) {
      toast.success("Produkti u fshi!");
      router.refresh();
    } else {
      toast.error(result.error || "Ndodhi një gabim.");
    }
  };

  return (
    <button
      onClick={handleDelete}
      disabled={loading}
      className="p-1.5 hover:bg-red-50 hover:text-red-500 transition-colors disabled:opacity-50"
    >
      <Trash2 className="h-3.5 w-3.5" />
    </button>
  );
}
