import type { Product } from "@/types";

interface ProductSchemaProps {
  product: Product;
  url: string;
}

export function ProductSchema({ product, url }: ProductSchemaProps) {
  const schema = {
    "@context": "https://schema.org",
    "@type": "Product",
    name: product.name,
    description: product.description,
    image: [product.mainImage, ...product.images].filter(Boolean),
    sku: product.id,
    offers: {
      "@type": "Offer",
      price: product.price,
      priceCurrency: "ALL",
      availability:
        product.stock > 0
          ? "https://schema.org/InStock"
          : "https://schema.org/OutOfStock",
      url,
      seller: {
        "@type": "Organization",
        name: "Bogadni Store",
      },
    },
    brand: {
      "@type": "Brand",
      name: "Bogadni Store",
    },
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
}

export function OrganizationSchema() {
  const schema = {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: "Bogadni Store",
    url: "https://bogadnistore.com",
    logo: "https://bogadnistore.com/logo.png",
    contactPoint: {
      "@type": "ContactPoint",
      telephone: "+355-69-211-1876",
      contactType: "customer service",
      availableLanguage: "Albanian",
    },
    sameAs: [
      "https://instagram.com/bogadnistore",
      "https://facebook.com/bogadnistore",
    ],
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
}

export function BreadcrumbSchema({
  items,
}: {
  items: { name: string; url: string }[];
}) {
  const schema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: item.name,
      item: item.url,
    })),
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
}

export function WebsiteSchema() {
  const schema = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: "Bogadni Store",
    url: "https://bogadnistore.com",
    potentialAction: {
      "@type": "SearchAction",
      target: {
        "@type": "EntryPoint",
        urlTemplate: "https://bogadnistore.com/shop?q={search_term_string}",
      },
      "query-input": "required name=search_term_string",
    },
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
}
