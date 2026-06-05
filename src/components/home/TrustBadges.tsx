import { Truck, RotateCcw, Shield, MessageCircle } from "lucide-react";

const badges = [
  { icon: Truck, title: "Transport Falas", desc: "Për porosi mbi 5,000 Lek" },
  { icon: RotateCcw, title: "Kthim Falas", desc: "Brenda 14 ditësh" },
  { icon: Shield, title: "Pagesë e Sigurt", desc: "Porosi nëpërmjet WhatsApp" },
  { icon: MessageCircle, title: "Suport 24/7", desc: "Gjithmonë në dispozicion" },
];

export function TrustBadges() {
  return (
    <section className="border-y border-neutral-100 bg-neutral-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-10">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          {badges.map((b) => (
            <div key={b.title} className="flex flex-col items-center text-center gap-3">
              <div className="w-12 h-12 border border-[#C9A84C] flex items-center justify-center">
                <b.icon className="h-5 w-5 text-[#C9A84C]" />
              </div>
              <div>
                <p className="text-xs font-bold tracking-widest text-black">{b.title}</p>
                <p className="text-xs text-neutral-500 mt-0.5">{b.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
