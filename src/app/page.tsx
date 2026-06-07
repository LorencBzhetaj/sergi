import { prisma } from "@/lib/prisma";
import { HeroSection } from "@/components/home/HeroSection";
import { FeaturedProducts } from "@/components/home/FeaturedProducts";
import { PromoBanners } from "@/components/home/PromoBanners";
import { TrustBadges } from "@/components/home/TrustBadges";
import { NewsletterSection } from "@/components/home/NewsletterSection";
import { OrganizationSchema, WebsiteSchema } from "@/components/seo/ProductSchema";
import { AnnouncementBar } from "@/components/layout/AnnouncementBar";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import type { Metadata } from "next";
import type { Product } from "@/types";

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://bogdanistore.com";

export const metadata: Metadata = {
  title: "Bogdani Store | Rroba Online Shqiperi - Dyqan Rrobash Tirane",
  description:
    "Dyqan rrobash online premium në Shqipëri. Stil. Cilësi. Vetëbesim. Porosi nëpërmjet WhatsApp. Transport falas mbi 5,000 Lek.",
  alternates: { canonical: siteUrl },
};

async function getFeaturedProducts(): Promise<Product[]> {
  try {
    const p = await prisma.product.findMany({
      where: { featured: true, isActive: true },
      include: { category: true, collection: true },
      take: 4,
      orderBy: { createdAt: "asc" },
    });
    return p as unknown as Product[];
  } catch {
    return [];
  }
}

async function getNewArrivals(): Promise<Product[]> {
  try {
    const p = await prisma.product.findMany({
      where: { newArrival: true, isActive: true },
      include: { category: true, collection: true },
      take: 4,
      orderBy: { createdAt: "desc" },
    });
    return p as unknown as Product[];
  } catch {
    return [];
  }
}

export default async function HomePage() {
  const [featured, newArrivals] = await Promise.all([
    getFeaturedProducts(),
    getNewArrivals(),
  ]);

  return (
    <>
      <Navbar />
      <main id="main-content" className="flex-1">
        <OrganizationSchema />
        <WebsiteSchema />
        <HeroSection />
        <FeaturedProducts products={featured} title="MË TË SHITURAT" />
        <PromoBanners />
        {newArrivals.length > 0 && (
          <FeaturedProducts
            products={newArrivals}
            title="ARRITJET E REJA"
            viewAllHref="/shop?newArrival=true"
          />
        )}
        <NewsletterSection />
      </main>
      <Footer />
    </>
  );
}
