import { PrismaClient } from "@prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import pg from "pg";
import * as dotenv from "dotenv";

dotenv.config({ path: ".env.local" });
dotenv.config({ path: ".env" });

const pool = new pg.Pool({ connectionString: process.env.DATABASE_URL!, max: 1 });
const prisma = new PrismaClient({ adapter: new PrismaPg(pool) } as never);

const TSHIRT_CATEGORY_ID = "cmpx93llc0000uwda4mjx7jbp"; // Bluza me Mëngë të Shkurtra

const bestSellers = [
  {
    name: "AMIRI Tee",
    slug: "amiri-tee",
    price: 8900,
    comparePrice: null,
    description:
      "Bluzë premium AMIRI me mëngë të shkurtra. Pambuk 100% me cilësi të lartë. Logo elegante në pjesën e përparme. Prerje moderne për një stil të përkryer.",
    image: "/tshirt-amiri.jpg",
    colors: [{ name: "E zezë", hex: "#000000" }],
  },
  {
    name: "GIVENCHY Paris Tee",
    slug: "givenchy-paris-tee",
    price: 9500,
    comparePrice: null,
    description:
      "Bluzë GIVENCHY Paris me mëngë të shkurtra. Pambuk premium me prerje klasike. Logo ikonike GIVENCHY PARIS. Elegancë dhe cilësi në çdo detaj.",
    image: "/tshirt-givenchy.jpg",
    colors: [{ name: "E bardhë", hex: "#FFFFFF" }],
  },
  {
    name: "BOSS x AJBXNG Tee",
    slug: "boss-ajbxng-tee",
    price: 7900,
    comparePrice: null,
    description:
      "Bluzë BOSS x AJBXNG edicion i kufizuar. Dizajn me logo gold dhe print all-over. Pambuk premium me ndjesi luksoze. Stil unik dhe i veçantë.",
    image: "/tshirt-boss.jpg",
    colors: [{ name: "E zezë", hex: "#000000" }],
  },
  {
    name: "Calvin Klein Jeans Tee",
    slug: "calvin-klein-jeans-tee",
    price: 5900,
    comparePrice: null,
    description:
      "Bluzë Calvin Klein Jeans me mëngë të shkurtra. Pambuk i butë me prerje minimaliste. Logo diskrete në gjoks. Klasike dhe e përhershme.",
    image: "/tshirt-calvin-klein.jpg",
    colors: [{ name: "Gri", hex: "#7A7E83" }],
  },
];

async function main() {
  // 1. Hiq featured nga TË GJITHA produktet ekzistuese
  await prisma.product.updateMany({ data: { featured: false } });
  console.log("✓ Hequr featured nga të gjitha produktet");

  // 2. Krijo/përditëso 4 best-sellers
  for (const p of bestSellers) {
    await prisma.product.upsert({
      where: { slug: p.slug },
      update: {
        name: p.name,
        price: p.price,
        comparePrice: p.comparePrice,
        description: p.description,
        mainImage: p.image,
        colors: p.colors,
        featured: true,
        isActive: true,
      },
      create: {
        name: p.name,
        slug: p.slug,
        price: p.price,
        comparePrice: p.comparePrice,
        description: p.description,
        categoryId: TSHIRT_CATEGORY_ID,
        sizes: ["S", "M", "L", "XL", "XXL"],
        colors: p.colors,
        stock: 30,
        mainImage: p.image,
        images: [],
        featured: true,
        newArrival: false,
        onSale: false,
        isActive: true,
      },
    });
    console.log(`  ✓ ${p.name} (${p.price} Lek)`);
  }

  const featuredCount = await prisma.product.count({ where: { featured: true } });
  console.log(`\n✅ Gati! ${featuredCount} produkte featured (MË TË SHITURAT)`);
}

main()
  .catch((e) => { console.error(e); process.exit(1); })
  .finally(() => prisma.$disconnect());
