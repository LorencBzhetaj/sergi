"use client";

import { useTransition } from "react";
import { Check, Trash2, Mail, MailOpen } from "lucide-react";
import { toast } from "sonner";
import { markMessageRead, deleteMessage } from "@/app/actions/messages";

export function MessageActions({ id, isRead }: { id: string; isRead: boolean }) {
  const [isPending, startTransition] = useTransition();

  const toggleRead = () => {
    startTransition(async () => {
      const r = await markMessageRead(id, !isRead);
      if (r.success) toast.success(isRead ? "Shënuar si i palexuar" : "Shënuar si i lexuar");
      else toast.error("Gabim.");
    });
  };

  const remove = () => {
    if (!confirm("Fshini këtë mesazh?")) return;
    startTransition(async () => {
      const r = await deleteMessage(id);
      if (r.success) toast.success("Mesazhi u fshi.");
      else toast.error("Gabim.");
    });
  };

  return (
    <div className="flex items-center gap-2">
      <button
        onClick={toggleRead}
        disabled={isPending}
        title={isRead ? "Shëno si i palexuar" : "Shëno si i lexuar"}
        className="p-1.5 hover:bg-neutral-100 rounded transition-colors disabled:opacity-50"
      >
        {isRead ? <MailOpen className="h-4 w-4 text-neutral-400" /> : <Mail className="h-4 w-4 text-[#C9A84C]" />}
      </button>
      <button
        onClick={remove}
        disabled={isPending}
        title="Fshi"
        className="p-1.5 hover:bg-red-50 rounded transition-colors disabled:opacity-50"
      >
        <Trash2 className="h-4 w-4 text-neutral-400 hover:text-red-500" />
      </button>
    </div>
  );
}
