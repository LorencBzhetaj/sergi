import { Metadata } from "next";
import { Suspense } from "react";
import { prisma } from "@/lib/prisma";
import { ProductGrid } from "@/components/product/ProductGrid";
import { ShopFilters } from "@/components/shop/ShopFilters";
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select";
import type { Product, Category } from "@/types";

export const metadata: Metadata = {
  title: "Shop - Të gjitha produktet",
  description: "Shfletoni koleksionin tonë të plotë të veshjes premium.",
};

async function getProducts(params: {
  category?: string; sort?: string; sale?: string;
  newArrival?: string; size?: string; q?: string; color?: string;
}): Promise<Product[]> {
  try {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const where: Record<string, any> = { isActive: true };

    if (params.category)              where.category   = { slug: params.category };
    if (params.sale === "true")       where.onSale     = true;
    if (params.newArrival === "true") where.newArrival = true;
    if (params.size)                  where.sizes      = { has: params.size };

    // Color filter — match products whose JSON colors array contains this color
    if (params.color) {
      where.colors = { array_contains: [{ name: params.color }] };
    }

    if (params.q) {
      where.OR = [
        { name:        { contains: params.q, mode: "insensitive" } },
        { description: { contains: params.q, mode: "insensitive" } },
      ];
    }

    let orderBy: Record<string, string> = { createdAt: "desc" };
    if (params.sort === "price-asc")  orderBy = { price: "asc" };
    if (params.sort === "price-desc") orderBy = { price: "desc" };
    if (params.sort === "popular")    orderBy = { views: "desc" };

    const products = await prisma.product.findMany({
      where,
      include: { category: true, collection: true },
      orderBy,
    });
    return products as unknown as Product[];
  } catch {
    return [];
  }
}

async function getCategories(): Promise<Category[]> {
  try {
    return (await prisma.category.findMany({ orderBy: { name: "asc" } })) as unknown as Category[];
  } catch {
    return [];
  }
}

interface ShopPageProps {
  searchParams: Promise<{
    category?: string; sort?: string; sale?: string;
    newArrival?: string; size?: string; q?: string; color?: string;
  }>;
}

export default async function ShopPage({ searchParams }: ShopPageProps) {
  const params = await searchParams;
  const [products, categories] = await Promise.all([getProducts(params), getCategories()]);

  // Group categories by description (group)
  const groupOrder = ["Veshje", "Sport", "Aksesorë"];
  const grouped = groupOrder
    .map((g) => ({ group: g, items: categories.filter((c) => c.description === g) }))
    .filter((g) => g.items.length > 0);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-12">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold tracking-widest">SHOP</h1>
          <p className="text-sm text-neutral-500 mt-1">
            {params.q ? `Rezultate për "${params.q}" — ` : ""}
            {products.length} produkte
          </p>
        </div>
        <div className="flex items-center gap-3">
          <Select defaultValue={params.sort || "newest"}>
            <SelectTrigger className="w-44 text-xs">
              <SelectValue placeholder="Rendit sipas" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="newest">Më të rejat</SelectItem>
              <SelectItem value="popular">Më të njohurat</SelectItem>
              <SelectItem value="price-asc">Çmimi: i ulët → i lartë</SelectItem>
              <SelectItem value="price-desc">Çmimi: i lartë → i ulët</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="flex gap-8">
        {/* Sidebar — client component for interactive filters */}
        <div className="hidden lg:block">
          <Suspense fallback={<div className="w-52" />}>
            <ShopFilters categories={categories} groups={grouped} />
          </Suspense>
        </div>

        {/* Products */}
        <div className="flex-1 min-w-0">
          {products.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-24 text-center">
              <p className="text-2xl mb-3">🔍</p>
              <p className="font-semibold text-black mb-1">Asnjë produkt nuk u gjet</p>
              <p className="text-sm text-neutral-500">
                Provoni filtra të ndryshëm ose{" "}
                <a href="/shop" className="underline hover:text-black">shihni të gjitha</a>
              </p>
            </div>
          ) : (
            <ProductGrid products={products} columns={3} />
          )}
        </div>
      </div>
    </div>
  );
}
