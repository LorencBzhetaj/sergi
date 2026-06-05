import Image from "next/image";
import Link from "next/link";
import { ArrowRight } from "lucide-react";

export function PromoBanners() {
  return (
    <section className="max-w-7xl mx-auto px-4 sm:px-6 pb-16">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Summer Sale Banner */}
        <div className="md:col-span-2 relative overflow-hidden bg-neutral-900 aspect-[16/7]">
          <Image
            src="/summer-sale-homepage.jpg"
            alt="Summer Sale"
            fill
            className="object-cover object-center"
            sizes="(max-width: 768px) 100vw, 67vw"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-black/75 via-black/40 to-transparent" />
          <div className="absolute inset-0 flex flex-col justify-center px-8">
            <p className="text-[#C9A84C] text-xs font-semibold tracking-widest mb-2">DERI NË 30% ULJE</p>
            <h3 className="text-white text-3xl font-bold tracking-tight mb-4">SUMMER SALE</h3>
            <Link
              href="/shop?sale=true"
              className="inline-flex items-center gap-2 bg-white text-black text-xs font-bold tracking-widest px-6 py-3 hover:bg-[#C9A84C] hover:text-white transition-colors w-fit"
            >
              SHOP SALE
            </Link>
          </div>
        </div>

        {/* New Collection Banner */}
        <div className="relative overflow-hidden bg-neutral-100 aspect-[16/7] md:aspect-auto">
          <Image
            src="/collection-summer-sale.jpg"
            alt="New Collection"
            fill
            className="object-cover object-center"
            sizes="(max-width: 768px) 100vw, 33vw"
          />
          <div className="absolute inset-0 bg-black/30 flex flex-col justify-end px-6 py-6">
            <p className="text-[#C9A84C] text-xs font-semibold tracking-widest mb-1">NEW</p>
            <h3 className="text-white text-xl font-bold tracking-tight mb-3">COLLECTION</h3>
            <Link
              href="/koleksione"
              className="inline-flex items-center gap-1.5 text-white text-xs font-semibold tracking-widest hover:text-[#C9A84C] transition-colors"
            >
              ZBULO TANI <ArrowRight className="h-3 w-3" />
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
