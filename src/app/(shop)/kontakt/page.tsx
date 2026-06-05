import { Metadata } from "next";
import { MessageCircle, Mail, MapPin, ExternalLink } from "lucide-react";
import { ContactForm } from "./ContactForm";

export const metadata: Metadata = {
  title: "Kontakt",
  description: "Na kontaktoni nëpërmjet WhatsApp ose email.",
};

const MAPS_SHARE = "https://share.google/Mv4TT4DtpPbf1dsVo";

export default function KontaktPage() {
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-16">
      <div className="text-center mb-12">
        <p className="text-[#C9A84C] text-xs tracking-widest font-semibold mb-3">NA KONTAKTONI</p>
        <h1 className="text-3xl font-bold tracking-widest">KONTAKT</h1>
        <p className="text-neutral-500 mt-3 text-sm">
          Jemi gjithmonë në dispozicion të juaj. Na kontaktoni nëpërmjet WhatsApp ose email.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
        {/* Contact info */}
        <div className="space-y-6">
          {/* WhatsApp */}
          <div className="flex items-start gap-4">
            <div className="w-10 h-10 border border-[#C9A84C] flex items-center justify-center shrink-0">
              <MessageCircle className="h-5 w-5 text-[#C9A84C]" />
            </div>
            <div>
              <p className="font-semibold text-sm">WhatsApp</p>
              <a
                href="https://wa.me/355692111876"
                target="_blank"
                rel="noopener noreferrer"
                className="text-sm text-neutral-600 hover:text-[#C9A84C] transition-colors"
              >
                +355 69 211 1876
              </a>
              <p className="text-xs text-neutral-400 mt-1">E Hënë - E Diel, 09:00 - 21:00</p>
            </div>
          </div>

          {/* Email */}
          <div className="flex items-start gap-4">
            <div className="w-10 h-10 border border-[#C9A84C] flex items-center justify-center shrink-0">
              <Mail className="h-5 w-5 text-[#C9A84C]" />
            </div>
            <div>
              <p className="font-semibold text-sm">Email</p>
              <a
                href="mailto:info@bogadnistore.com"
                className="text-sm text-neutral-600 hover:text-[#C9A84C] transition-colors"
              >
                info@bogadnistore.com
              </a>
            </div>
          </div>

          {/* Location card */}
          <div className="flex items-start gap-4">
            <div className="w-10 h-10 border border-[#C9A84C] flex items-center justify-center shrink-0">
              <MapPin className="h-5 w-5 text-[#C9A84C]" />
            </div>
            <div>
              <p className="font-semibold text-sm">Lokacioni</p>
              <p className="text-sm text-neutral-600">Tiranë, Shqipëri</p>
            </div>
          </div>

          {/* Map preview card — clickable, opens real location */}
          <a
            href={MAPS_SHARE}
            target="_blank"
            rel="noopener noreferrer"
            className="block w-full border border-neutral-200 hover:border-[#C9A84C] transition-colors overflow-hidden group"
          >
            {/* Location card */}
            <div className="bg-neutral-50 group-hover:bg-neutral-100 transition-colors p-5 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-[#C9A84C] flex items-center justify-center rounded-full shrink-0">
                  <MapPin className="h-5 w-5 text-white" />
                </div>
                <div>
                  <p className="text-sm font-semibold text-black">Bogadni Store</p>
                  <p className="text-xs text-neutral-500">Tiranë, Shqipëri</p>
                </div>
              </div>
              <div className="flex items-center gap-1.5 text-xs font-semibold text-[#C9A84C] group-hover:text-black transition-colors">
                Hap Maps <ExternalLink className="h-3.5 w-3.5" />
              </div>
            </div>
          </a>

          {/* WhatsApp CTA */}
          <a
            href="https://wa.me/355692111876?text=Pershendetje%2C%20dua%20te%20marr%20informacion%20per%20produktet%20tuaja."
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-center gap-2 bg-black text-white text-xs font-bold tracking-widest py-4 w-full hover:bg-neutral-800 transition-colors"
          >
            <MessageCircle className="h-4 w-4" />
            NA SHKRUANI NË WHATSAPP
          </a>
        </div>

        <ContactForm />
      </div>
    </div>
  );
}
