import { ProductCard } from "./ProductCard";
import type { Product } from "@/types";

interface ProductGridProps {
  products: Product[];
  columns?: 2 | 3 | 4;
}

export function ProductGrid({ products, columns = 4 }: ProductGridProps) {
  const colClass = {
    2: "grid-cols-2",
    3: "grid-cols-2 md:grid-cols-3",
    4: "grid-cols-2 md:grid-cols-3 lg:grid-cols-4",
  }[columns];

  if (products.length === 0) {
    return (
      <div className="text-center py-20 text-neutral-400">
        <p className="text-lg">Nuk u gjet asnjë produkt.</p>
      </div>
    );
  }

  return (
    <div className={`grid ${colClass} gap-x-4 gap-y-8`}>
      {products.map((product) => (
        <ProductCard key={product.id} product={product} />
      ))}
    </div>
  );
}
