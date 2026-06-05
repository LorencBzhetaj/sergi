import { Metadata } from "next";
import Image from "next/image";

export const metadata: Metadata = {
  title: "Rreth Nesh",
  description: "Historia e Bogadni Store - Dyqan rrobash premium në Shqipëri.",
};

export default function RrethNeshPage() {
  return (
    <div>
      {/* Hero — Bogadni Store wall sign */}
      <div className="relative h-72 sm:h-[28rem] bg-neutral-900 overflow-hidden">
        <Image
          src="/about-banner.jpg"
          alt="Bogadni Store"
          fill
          className="object-cover"
          priority
          sizes="100vw"
        />
      </div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center mb-16">
          <div>
            <p className="text-[#C9A84C] text-xs tracking-widest font-semibold mb-3">HISTORIA JONË</p>
            <h2 className="text-2xl font-bold tracking-tight mb-4">Stil. Cilësi. Vetëbesim.</h2>
            <p className="text-neutral-600 leading-relaxed text-sm">
              Bogadni Store u themelua me një vizion të qartë: të sjellë rroba premium dhe moderne direkt tek klientët shqiptarë. Besojmë se çdo person meriton të vishet me cilësi dhe të shprehë personalitetin e tij nëpërmjet stilit.
            </p>
            <p className="text-neutral-600 leading-relaxed text-sm mt-4">
              Çdo produkt i Bogadni Store është zgjedhur me kujdes të madh, duke kombinuar materialet premium me dizajnin modern dhe çmimet e arsyeshme.
            </p>
          </div>
          <div className="relative aspect-[4/3] bg-neutral-100 overflow-hidden">
            <Image
              src="/about-products.jpg"
              alt="Koleksioni Bogadni Store"
              fill
              className="object-cover"
              sizes="(max-width: 768px) 100vw, 50vw"
            />
          </div>
        </div>

        {/* Values */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
          {[
            { title: "CILËSIA", desc: "Materialet tona zgjidhen me kujdes për qëndrueshmëri dhe rehati maksimale." },
            { title: "STILI", desc: "Dizajne moderne dhe minimaliste që përshtaten me çdo rast dhe personalitet." },
            { title: "VLERA", desc: "Çmime të arsyeshme pa kompromis në cilësi. Premium është e arritshme." },
          ].map((v) => (
            <div key={v.title} className="border-t-2 border-[#C9A84C] pt-6">
              <h3 className="font-bold tracking-widest mb-3 text-sm">{v.title}</h3>
              <p className="text-sm text-neutral-500 leading-relaxed">{v.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
