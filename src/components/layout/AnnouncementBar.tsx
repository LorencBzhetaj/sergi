"use client";

import { Truck } from "lucide-react";

export function AnnouncementBar() {
  return (
    <div className="bg-black text-[#C9A84C] text-xs font-semibold tracking-widest py-2.5 text-center">
      <div className="flex items-center justify-center gap-2">
        <Truck className="h-3.5 w-3.5 shrink-0" />
        <span>TRANSPORT FALAS PËR POROSI MBI 5,000 LEK</span>
      </div>
    </div>
  );
}
