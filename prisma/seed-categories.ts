import { PrismaClient } from "@prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import * as dotenv from "dotenv";

dotenv.config({ path: ".env.local" });
dotenv.config({ path: ".env" });

const adapter = new PrismaPg(process.env.DATABASE_URL!);
const prisma = new PrismaClient({ adapter } as never);

function toSlug(name: string) {
  return name
    .toLowerCase()
    .replace(/ë/g, "e")
    .replace(/ç/g, "c")
    .replace(/\(/g, "").replace(/\)/g, "")
    .replace(/[^a-z0-9\s-]/g, "")
    .trim()
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-");
}

const categories = [
  // Veshje
  { name: "Bluza me Mëngë të Shkurtra", group: "Veshje" },
  { name: "Polo (Bluza me Jakë)",        group: "Veshje" },
  { name: "Bluza me Mëngë të Gjata",    group: "Veshje" },
  { name: "Xhinse",                      group: "Veshje" },
  { name: "Tuta të Gjata",              group: "Veshje" },
  { name: "Tuta të Shkurtra",           group: "Veshje" },
  { name: "Komplete Verore",            group: "Veshje" },
  { name: "Komplete Dimërore",          group: "Veshje" },
  { name: "Jelekë",                     group: "Veshje" },
  { name: "Xhaketa",                    group: "Veshje" },
  { name: "Xhupa",                      group: "Veshje" },
  { name: "Tuta Plazhi",                group: "Veshje" },
  // Sport
  { name: "Bluza Futbolli",             group: "Sport"  },
  { name: "Komplete Futbolli",          group: "Sport"  },
  // Aksesorë
  { name: "Çanta",                      group: "Aksesorë" },
  { name: "Kapele",                     group: "Aksesorë" },
  { name: "Rripa Lëkure",              group: "Aksesorë" },
];

async function main() {
  // 1. Fshij në rend të saktë (foreign keys)
  console.log("Fshij të dhënat e vjetra...");
  await prisma.orderItem.deleteMany({});
  await prisma.order.deleteMany({});
  await prisma.product.deleteMany({});
  await prisma.category.deleteMany({});
  console.log("  ✓ Pastruar");

  // 2. Krijo kategorite e reja
  console.log("\nShto kategorite e reja...");
  for (const cat of categories) {
    await prisma.category.create({
      data: { name: cat.name, slug: toSlug(cat.name), description: cat.group },
    });
    console.log(`  ✓ [${cat.group}] ${cat.name}`);
  }

  // 3. Shto produkte mostër të lidhura me kategorinë "Tuta të Gjata"
  console.log("\nShto produkte mostër...");
  const allCats = await prisma.category.findMany();
  const find = (name: string) => allCats.find(c => c.name === name)!;
  const catTuta    = find("Tuta të Gjata");
  const catBluza   = find("Bluza me Mëngë të Shkurtra");
  const catXhinse  = find("Xhinse");
  const catXhaketa = find("Xhaketa");

  const sampleProducts = [
    {
      name: "Hoodie Essential",
      slug: "hoodie-essential",
      price: 4490,
      description: "Dizajn minimal. Cilësi maksimale. Material premium pambuku për rehati gjithë ditës.",
      categoryId: catTuta!.id,
      sizes: ["S","M","L","XL","XXL"],
      colors: [{ name: "E zezë", hex: "#000000" }, { name: "Gri", hex: "#808080" }, { name: "Beige", hex: "#F5F0E8" }],
      stock: 50, featured: true, newArrival: false, onSale: false,
      mainImage: "https://images.unsplash.com/photo-1556821840-3a63f15732ce?w=800",
      images: [],
    },
    {
      name: "Oversized T-Shirt",
      slug: "oversized-t-shirt",
      price: 2990,
      description: "T-shirt oversized me prerje moderne. 100% pambuk organik.",
      categoryId: catBluza!.id,
      sizes: ["S","M","L","XL","XXL"],
      colors: [{ name: "Beige", hex: "#F5F0E8" }, { name: "E bardhë", hex: "#FFFFFF" }, { name: "E zezë", hex: "#000000" }],
      stock: 80, featured: true, newArrival: true, onSale: false,
      mainImage: "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=800",
      images: [],
    },
    {
      name: "Crewneck Sweatshirt",
      slug: "crewneck-sweatshirt",
      price: 3990,
      description: "Sweatshirt me jakë rrethore, i rehatshëm dhe elegant.",
      categoryId: catTuta!.id,
      sizes: ["S","M","L","XL"],
      colors: [{ name: "E zezë", hex: "#000000" }, { name: "Gri e hapur", hex: "#D3D3D3" }],
      stock: 35, featured: true, newArrival: false, onSale: false,
      mainImage: "https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=800",
      images: [],
    },
    {
      name: "Cargo Pants",
      slug: "cargo-pants",
      price: 4990,
      description: "Pantalona cargo me xhepa funksionale. Stil urban dhe praktik.",
      categoryId: catXhinse!.id,
      sizes: ["S","M","L","XL","XXL"],
      colors: [{ name: "E zezë", hex: "#000000" }, { name: "Bej", hex: "#C8A882" }],
      stock: 25, featured: true, newArrival: false, onSale: false,
      mainImage: "https://images.unsplash.com/photo-1624378439575-d8705ad7ae80?w=800",
      images: [],
    },
    {
      name: "Zip-Up Hoodie",
      slug: "zip-up-hoodie",
      price: 5490,
      description: "Hoodie me zinxhir. Dizajn i pastër, cilësi e lartë.",
      categoryId: catXhaketa!.id,
      sizes: ["S","M","L","XL","XXL"],
      colors: [{ name: "E zezë", hex: "#000000" }, { name: "Gri", hex: "#808080" }],
      stock: 40, featured: false, newArrival: true, onSale: false,
      mainImage: "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=800",
      images: [],
    },
    {
      name: "Slim Fit T-Shirt",
      slug: "slim-fit-t-shirt",
      price: 1990,
      description: "T-shirt slim fit bazë. I domosdoshëm në çdo garderobë.",
      categoryId: catBluza!.id,
      sizes: ["S","M","L","XL","XXL"],
      colors: [{ name: "E bardhë", hex: "#FFFFFF" }, { name: "E zezë", hex: "#000000" }, { name: "Blu navy", hex: "#1B2A4A" }],
      stock: 100, featured: false, newArrival: false, onSale: true,
      mainImage: "https://images.unsplash.com/photo-1581655353564-df123a1eb820?w=800",
      images: [],
    },
    {
      name: "Jogger Pants",
      slug: "jogger-pants",
      price: 3490,
      description: "Pantallona jogger komode për sport dhe jetën e përditshme.",
      categoryId: catTuta!.id,
      sizes: ["S","M","L","XL","XXL"],
      colors: [{ name: "Gri", hex: "#808080" }, { name: "E zezë", hex: "#000000" }],
      stock: 60, featured: false, newArrival: true, onSale: false,
      mainImage: "https://images.unsplash.com/photo-1552902865-b72c031ac5ea?w=800",
      images: [],
    },
    {
      name: "Premium Sweatshirt",
      slug: "premium-sweatshirt",
      price: 4490,
      description: "Sweatshirt premium me logo Bogadni Store. Cilësi e lartë.",
      categoryId: catTuta!.id,
      sizes: ["S","M","L","XL","XXL"],
      colors: [{ name: "E zezë", hex: "#000000" }, { name: "Krem", hex: "#FFFDD0" }],
      stock: 45, featured: true, newArrival: true, onSale: false,
      mainImage: "https://images.unsplash.com/photo-1593429863934-a4c0a3e98dda?w=800",
      images: [],
    },
  ];

  for (const p of sampleProducts) {
    await prisma.product.create({ data: p as never });
    console.log(`  ✓ ${p.name}`);
  }

  console.log("\n✅ Gati! Rezultati:");
  const cats = await prisma.category.findMany({ orderBy: { name: "asc" } });
  const prods = await prisma.product.count();
  console.log(`  Kategori: ${cats.length}`);
  console.log(`  Produkte: ${prods}`);
}

main()
  .catch((e) => { console.error(e); process.exit(1); })
  .finally(() => prisma.$disconnect());
