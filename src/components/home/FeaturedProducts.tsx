import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { ProductGrid } from "@/components/product/ProductGrid";
import type { Product } from "@/types";

interface FeaturedProductsProps {
  products: Product[];
  title?: string;
  viewAllHref?: string;
}

export function FeaturedProducts({
  products,
  title = "MË TË SHITURAT",
  viewAllHref = "/shop",
}: FeaturedProductsProps) {
  return (
    <section className="max-w-7xl mx-auto px-4 sm:px-6 py-16">
      <div className="flex items-center justify-between mb-8">
        <h2 className="text-xl font-bold tracking-widest text-black">{title}</h2>
        <Link
          href={viewAllHref}
          className="flex items-center gap-1.5 text-xs font-semibold tracking-widest text-neutral-600 hover:text-black transition-colors"
        >
          SHIKO TË GJITHA
          <ArrowRight className="h-3.5 w-3.5" />
        </Link>
      </div>
      <ProductGrid products={products} columns={4} />
    </section>
  );
}
