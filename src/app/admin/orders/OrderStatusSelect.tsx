"use client";

import { useState, useTransition } from "react";
import { toast } from "sonner";
import { updateOrderStatus } from "@/app/actions/orders";

const STATUSES = [
  { value: "PENDING",   label: "Në pritje",  cls: "bg-yellow-100 text-yellow-800 border-yellow-200" },
  { value: "CONFIRMED", label: "Konfirmuar", cls: "bg-blue-100 text-blue-800 border-blue-200" },
  { value: "SHIPPED",   label: "Dërguar",    cls: "bg-indigo-100 text-indigo-800 border-indigo-200" },
  { value: "DELIVERED", label: "Dorëzuar",   cls: "bg-green-100 text-green-800 border-green-200" },
  { value: "CANCELLED", label: "Anuluar",    cls: "bg-red-100 text-red-700 border-red-200" },
];

export function OrderStatusSelect({ orderId, current }: { orderId: string; current: string }) {
  const [status, setStatus] = useState(current);
  const [isPending, startTransition] = useTransition();

  const handleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newStatus = e.target.value;
    const prev = status;
    setStatus(newStatus);
    startTransition(async () => {
      const result = await updateOrderStatus(orderId, newStatus);
      if (result.success) {
        toast.success("Statusi u përditësua!");
      } else {
        setStatus(prev);
        toast.error(result.error || "Gabim.");
      }
    });
  };

  const cls = STATUSES.find((s) => s.value === status)?.cls || "";

  return (
    <select
      value={status}
      onChange={handleChange}
      disabled={isPending}
      className={`text-[11px] font-semibold px-2 py-1 border rounded cursor-pointer outline-none disabled:opacity-50 ${cls}`}
    >
      {STATUSES.map((s) => (
        <option key={s.value} value={s.value}>{s.label}</option>
      ))}
    </select>
  );
}
