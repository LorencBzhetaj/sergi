import { Metadata } from "next";

export const metadata: Metadata = { title: "Politika e Privatësisë" };

export default function PrivacyPolicyPage() {
  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 py-16">
      <h1 className="text-2xl font-bold tracking-widest mb-2">POLITIKA E PRIVATËSISË</h1>
      <p className="text-neutral-500 text-sm mb-10">Përditësuar: Janar 2025</p>
      <div className="prose prose-sm max-w-none text-neutral-700 space-y-6">
        <section>
          <h2 className="font-bold text-black mb-2">1. Informacioni që mbledhim</h2>
          <p>Bogdani Store mbledh vetëm informacionin e nevojshëm për përpunimin e porosive tuaja, duke përfshirë emrin, numrin e telefonit dhe adresën e dorëzimit. Ky informacion jepet vullnetarisht nga ju nëpërmjet WhatsApp.</p>
        </section>
        <section>
          <h2 className="font-bold text-black mb-2">2. Si e përdorim informacionin</h2>
          <p>Informacioni juaj përdoret vetëm për: përpunimin dhe konfirmimin e porosive, komunikimin me ju lidhur me porosinë, dhe dërgimin e produkteve.</p>
        </section>
        <section>
          <h2 className="font-bold text-black mb-2">3. Ndarja e informacionit</h2>
          <p>Ne nuk ndajmë informacionin tuaj personal me palë të treta, me përjashtim të shërbimeve të transportit të nevojshme për dorëzimin e porosisë suaj.</p>
        </section>
        <section>
          <h2 className="font-bold text-black mb-2">4. Siguria</h2>
          <p>Marrim masa të arsyeshme për të mbrojtur informacionin tuaj personal nga aksesi i paautorizuar ose zbulimi.</p>
        </section>
        <section>
          <h2 className="font-bold text-black mb-2">5. Kontakt</h2>
          <p>Për çdo pyetje lidhur me privatësinë tuaj, na kontaktoni nëpërmjet WhatsApp: +355 69 211 1876</p>
        </section>
      </div>
    </div>
  );
}
