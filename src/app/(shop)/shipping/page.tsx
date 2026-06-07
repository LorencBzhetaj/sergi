import { Metadata } from "next";
import { Truck, RotateCcw, Clock, CheckCircle } from "lucide-react";

export const metadata: Metadata = {
  title: "Transporti & Kthimet",
  description: "Informacion mbi transportin dhe politikën e kthimit të Bogdani Store.",
};

export default function ShippingPage() {
  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 py-16">
      <div className="text-center mb-12">
        <p className="text-[#C9A84C] text-xs tracking-widest font-semibold mb-3">INFORMACION</p>
        <h1 className="text-3xl font-bold tracking-widest">TRANSPORTI & KTHIMET</h1>
      </div>

      <div className="space-y-10">
        <section>
          <div className="flex items-center gap-3 mb-4">
            <Truck className="h-5 w-5 text-[#C9A84C]" />
            <h2 className="font-bold tracking-widest text-sm">TRANSPORTI</h2>
          </div>
          <div className="space-y-3 text-sm text-neutral-600 leading-relaxed">
            <p>• <strong>Transport falas</strong> për porosi mbi 5,000 Lek në të gjithë Shqipërinë.</p>
            <p>• Për porosi nën 5,000 Lek, tarifa e transportit është 300 Lek.</p>
            <p>• Dorëzimi brenda <strong>1-3 ditëve pune</strong> pas konfirmimit të porosisë.</p>
            <p>• Dërgesa bëhet nëpërmjet shërbimeve të besueshme të korrierit.</p>
          </div>
        </section>

        <section>
          <div className="flex items-center gap-3 mb-4">
            <Clock className="h-5 w-5 text-[#C9A84C]" />
            <h2 className="font-bold tracking-widest text-sm">SI BËHET POROSIA</h2>
          </div>
          <div className="space-y-3 text-sm text-neutral-600 leading-relaxed">
            <p>1. Zgjidhni produktin, madhësinë dhe ngjyrën tuaj.</p>
            <p>2. Klikoni <strong>"Porosit në WhatsApp"</strong>.</p>
            <p>3. Mesazhi me detajet e porosisë dërgohet automatikisht.</p>
            <p>4. Na konfirmoni adresën tuaj të dorëzimit.</p>
            <p>5. Dorëzimi bëhet brenda 1-3 ditëve pune.</p>
          </div>
        </section>

        <section>
          <div className="flex items-center gap-3 mb-4">
            <RotateCcw className="h-5 w-5 text-[#C9A84C]" />
            <h2 className="font-bold tracking-widest text-sm">POLITIKA E KTHIMIT</h2>
          </div>
          <div className="space-y-3 text-sm text-neutral-600 leading-relaxed">
            <p>• Kthim i lirë brenda <strong>14 ditësh</strong> nga data e marrjes.</p>
            <p>• Produkti duhet të jetë në gjendje origjinale, i palajthur dhe me etiketat e plota.</p>
            <p>• Na kontaktoni nëpërmjet WhatsApp për të iniciuar kthimin.</p>
            <p>• Rimbursimi bëhet brenda 3-5 ditëve pune pas marrjes së produktit.</p>
          </div>
        </section>

        <section>
          <div className="flex items-center gap-3 mb-4">
            <CheckCircle className="h-5 w-5 text-[#C9A84C]" />
            <h2 className="font-bold tracking-widest text-sm">GARANCIA E CILËSISË</h2>
          </div>
          <p className="text-sm text-neutral-600 leading-relaxed">
            Çdo produkt i Bogdani Store kalon nëpër kontrolle strikte të cilësisë para dërgimit. Nëse merrni një produkt me defekt, do ta zëvendësojmë menjëherë pa kosto shtesë.
          </p>
        </section>
      </div>
    </div>
  );
}
