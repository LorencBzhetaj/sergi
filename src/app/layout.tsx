import type { Metadata, Viewport } from "next";
import { Geist } from "next/font/google";
import "./globals.css";
import { Toaster } from "sonner";

const geistSans = Geist({
  variable: "--font-sans",
  subsets: ["latin"],
  display: "swap",
});

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: "#C9A84C",
};

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || "https://bogadnistore.com"),
  title: {
    default: "Bogadni Store | Rroba Online Shqiperi - Dyqan Rrobash Tirane",
    template: "%s | Bogadni Store",
  },
  description:
    "Bogadni Store - Dyqan rrobash online në Shqipëri. Veshje moderne dhe premium. Porosi nëpërmjet WhatsApp. Transport falas mbi 5,000 Lek.",
  keywords: [
    "Bogadni Store",
    "Rroba Online Shqiperi",
    "Dyqan Rrobash Tirane",
    "Veshje Online Shqiperi",
    "Moda Shqiperi",
    "hoodie shqiperi",
    "streetwear albania",
    "rroba moderne",
  ],
  authors: [{ name: "Bogadni Store" }],
  creator: "Bogadni Store",
  openGraph: {
    type: "website",
    locale: "sq_AL",
    siteName: "Bogadni Store",
    title: "Bogadni Store | Rroba Online Shqiperi",
    description: "Dyqan rrobash online premium në Shqipëri. Stil. Cilësi. Vetëbesim.",
    images: [
      {
        url: "/og-image.jpg",
        width: 1200,
        height: 630,
        alt: "Bogadni Store - Rroba Online Shqiperi",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Bogadni Store | Rroba Online Shqiperi",
    description: "Dyqan rrobash online premium në Shqipëri.",
    images: ["/og-image.jpg"],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: { index: true, follow: true, "max-image-preview": "large" },
  },
  // Icons auto-detected from src/app/{favicon.ico,icon.png,apple-icon.png}
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="sq" className={`${geistSans.variable} h-full antialiased`}>
      <body className="min-h-full flex flex-col">
        {/* Skip to main content — accessibility */}
        <a
          href="#main-content"
          className="sr-only focus:not-sr-only focus:fixed focus:top-4 focus:left-4 focus:z-[100] focus:bg-black focus:text-white focus:px-4 focus:py-2 focus:text-sm focus:font-semibold"
        >
          Kalo tek përmbajtja kryesore
        </a>
        {children}
        <Toaster position="top-right" richColors />
      </body>
    </html>
  );
}
