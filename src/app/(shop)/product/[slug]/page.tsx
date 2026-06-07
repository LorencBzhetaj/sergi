import { notFound } from "next/navigation";
import { Metadata } from "next";
import { prisma } from "@/lib/prisma";
import { ProductDetailClient } from "./ProductDetailClient";
import { ProductGrid } from "@/components/product/ProductGrid";
import { ProductSchema, BreadcrumbSchema } from "@/components/seo/ProductSchema";
import type { Product } from "@/types";

interface Props {
  params: Promise<{ slug: string }>;
}

async function getProduct(slug: string): Promise<Product | null> {
  try {
    const product = await prisma.product.findUnique({
      where: { slug, isActive: true },        // only active products
      include: { category: true, collection: true },
    });
    if (!product) return null;
    // Fire-and-forget view increment — does not block page render
    prisma.product.update({ where: { slug }, data: { views: { increment: 1 } } }).catch(() => {});
    return product as unknown as Product;
  } catch {
    return null;
  }
}

async function getRelated(categoryId: string, excludeId: string): Promise<Product[]> {
  try {
    const products = await prisma.product.findMany({
      where: { categoryId, id: { not: excludeId }, isActive: true },   // only active
      include: { category: true, collection: true },
      take: 4,
    });
    return products as unknown as Product[];
  } catch {
    return [];
  }
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const product = await getProduct(slug);
  if (!product) return { title: "Produkt nuk u gjet" };
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://bogdanistore.com";
  return {
    title: `${product.name} - ${product.price.toLocaleString("sq-AL")} Lek`,
    description: product.description.slice(0, 160),
    alternates: { canonical: `${siteUrl}/product/${slug}` },
    openGraph: {
      title: `${product.name} | Bogdani Store`,
      description: product.description.slice(0, 160),
      images: [{ url: product.mainImage, width: 800, height: 1000, alt: product.name }],
      type: "website",
    },
    twitter: {
      card: "summary_large_image",
      title: product.name,
      description: product.description.slice(0, 160),
      images: [product.mainImage],
    },
  };
}

export default async function ProductPage({ params }: Props) {
  const { slug } = await params;
  const product = await getProduct(slug);
  if (!product) notFound();

  const related = await getRelated(product.categoryId, product.id);
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://bogdanistore.com";

  return (
    <>
      <ProductSchema product={product} url={`${siteUrl}/product/${slug}`} />
      <BreadcrumbSchema
        items={[
          { name: "Kreu", url: siteUrl },
          { name: "Shop", url: `${siteUrl}/shop` },
          { name: product.category?.name ?? "", url: `${siteUrl}/shop?category=${product.category?.slug}` },
          { name: product.name, url: `${siteUrl}/product/${slug}` },
        ]}
      />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-12">
        <ProductDetailClient product={product} />

        {related.length > 0 && (
          <div className="mt-20 border-t border-neutral-100 pt-12">
            <h2 className="text-lg font-bold tracking-widest mb-8">PRODUKTE TË NGJASHME</h2>
            <ProductGrid products={related} columns={4} />
          </div>
        )}
      </div>
    </>
  );
}
