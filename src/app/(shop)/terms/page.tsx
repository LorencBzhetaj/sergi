import { Metadata } from "next";

export const metadata: Metadata = { title: "Kushtet e Shërbimit" };

export default function TermsPage() {
  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 py-16">
      <h1 className="text-2xl font-bold tracking-widest mb-2">KUSHTET E SHËRBIMIT</h1>
      <p className="text-neutral-500 text-sm mb-10">Përditësuar: Janar 2025</p>
      <div className="space-y-6 text-sm text-neutral-700">
        <section>
          <h2 className="font-bold text-black mb-2">1. Pranimi i kushteve</h2>
          <p>Duke përdorur shërbimet e Bogdani Store, ju pranoni të gjitha kushtet e listuara në këtë dokument.</p>
        </section>
        <section>
          <h2 className="font-bold text-black mb-2">2. Produktet dhe çmimet</h2>
          <p>Të gjitha çmimet janë në Lek shqiptar (ALL) dhe përfshijnë TVSH-në. Rezervojmë të drejtën të ndryshojmë çmimet pa njoftim paraprak.</p>
        </section>
        <section>
          <h2 className="font-bold text-black mb-2">3. Porositë</h2>
          <p>Porositë bëhen nëpërmjet WhatsApp. Një porosi konsiderohet e konfirmuar vetëm pasi të keni marrë konfirmimin nga ekipi ynë.</p>
        </section>
        <section>
          <h2 className="font-bold text-black mb-2">4. Anulimi</h2>
          <p>Mund të anuloni porosinë brenda 2 orësh nga konfirmimi. Pas kësaj periudhe, anulimi nuk është i mundshëm nëse produkti është dërguar tashmë.</p>
        </section>
        <section>
          <h2 className="font-bold text-black mb-2">5. Pronësia intelektuale</h2>
          <p>Të gjitha imazhet, logot dhe përmbajtja e kësaj faqeje janë pronë e Bogdani Store dhe nuk mund të përdoren pa leje.</p>
        </section>
      </div>
    </div>
  );
}
