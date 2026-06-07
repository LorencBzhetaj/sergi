import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatPrice(price: number): string {
  return `${price.toLocaleString("sq-AL")} Lek`;
}

export function generateSlug(name: string): string {
  return name
    .toLowerCase()
    .replace(/ë/g, "e")
    .replace(/ç/g, "c")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

export function generateWhatsAppUrl(message: string): string {
  const number = process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || "355692111876";
  const encoded = encodeURIComponent(message);
  return `https://wa.me/${number}?text=${encoded}`;
}

export function generateProductWhatsAppMessage({
  productName,
  size,
  color,
  price,
  productUrl,
}: {
  productName: string;
  size: string;
  color: string;
  price: number;
  productUrl: string;
}): string {
  return `Pershendetje, Dua te porosis:

Produkti: ${productName}
Masa: ${size}
Ngjyra: ${color}
Cmimi: ${formatPrice(price)}
Link: ${productUrl}

Faleminderit nga Bogdani Store!`;
}

export function generateCartWhatsAppMessage(
  items: Array<{
    name: string;
    size: string;
    color: string;
    quantity: number;
    price: number;
  }>,
  total: number
): string {
  const itemLines = items
    .map(
      (item, i) =>
        `${i + 1}. ${item.name}\n   Ngjyra: ${item.color} | Masa: ${item.size} | Sasia: ${item.quantity} - ${formatPrice(item.price * item.quantity)}`
    )
    .join("\n\n");

  const shipping = total >= 5000 ? "Falas" : `${formatPrice(300)}`;

  return `Pershendetje, Dua te porosis:

${itemLines}

Nëntotali: ${formatPrice(total)}
Transporti: ${shipping}

Totali: ${formatPrice(total >= 5000 ? total : total + 300)}

Faleminderit nga Bogdani Store!`;
}
