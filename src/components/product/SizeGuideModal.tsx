"use client";

import { useState } from "react";
import { X } from "lucide-react";

const sizeChart = [
  { size: "S",   chest: "86-91", waist: "71-76", hip: "91-96",  height: "165-170" },
  { size: "M",   chest: "91-96", waist: "76-81", hip: "96-101", height: "170-175" },
  { size: "L",   chest: "96-101",waist: "81-86", hip: "101-106",height: "175-180" },
  { size: "XL",  chest: "101-106",waist:"86-91", hip: "106-111",height: "180-185" },
  { size: "XXL", chest: "106-112",waist:"91-97", hip: "111-117",height: "185-190" },
];

interface SizeGuideModalProps {
  trigger?: React.ReactNode;
}

export function SizeGuideModal({ trigger }: SizeGuideModalProps) {
  const [open, setOpen] = useState(false);

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        className="text-xs text-neutral-500 underline hover:text-black transition-colors"
        type="button"
      >
        {trigger ?? "Udhëzues për masa"}
      </button>

      {open && (
        <div
          className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4"
          onClick={(e) => { if (e.target === e.currentTarget) setOpen(false); }}
        >
          <div className="bg-white w-full max-w-lg shadow-2xl">
            {/* Header */}
            <div className="flex items-center justify-between px-6 py-4 border-b border-neutral-100">
              <h2 className="text-sm font-bold tracking-widest">UDHËZUES PËR MASA</h2>
              <button onClick={() => setOpen(false)} className="p-1 hover:opacity-70">
                <X className="h-5 w-5" />
              </button>
            </div>

            {/* Content */}
            <div className="p-6">
              <p className="text-xs text-neutral-500 mb-4">
                Të gjitha masat janë në <strong>centimetra (cm)</strong>. Nëse jeni midis dy masave, zgjidhni masën më të madhe.
              </p>

              {/* Table */}
              <div className="overflow-x-auto">
                <table className="w-full text-xs">
                  <thead>
                    <tr className="border-b border-neutral-200">
                      <th className="text-left font-bold tracking-widest py-2 pr-4">MASA</th>
                      <th className="text-center font-bold tracking-widest py-2 px-2">GJOKSI</th>
                      <th className="text-center font-bold tracking-widest py-2 px-2">BELI</th>
                      <th className="text-center font-bold tracking-widest py-2 px-2">IJET</th>
                      <th className="text-center font-bold tracking-widest py-2 pl-2">GJATËSIA</th>
                    </tr>
                  </thead>
                  <tbody>
                    {sizeChart.map((row, i) => (
                      <tr key={row.size} className={i % 2 === 0 ? "bg-neutral-50" : ""}>
                        <td className="py-2.5 pr-4 font-bold">{row.size}</td>
                        <td className="py-2.5 px-2 text-center text-neutral-600">{row.chest}</td>
                        <td className="py-2.5 px-2 text-center text-neutral-600">{row.waist}</td>
                        <td className="py-2.5 px-2 text-center text-neutral-600">{row.hip}</td>
                        <td className="py-2.5 pl-2 text-center text-neutral-600">{row.height}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Tip */}
              <div className="mt-5 bg-neutral-50 p-4 text-xs text-neutral-600 leading-relaxed">
                <strong className="font-semibold">Si të mat:</strong> Mat gjoksin në pjesën më të gjerë, belin në pjesën më të ngushtë dhe ijet 20 cm poshtë belit. Mos i shtrëngoni tepër masat.
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
