import { PrismaClient } from "@prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import bcrypt from "bcryptjs";
import * as dotenv from "dotenv";

dotenv.config({ path: ".env.local" });
dotenv.config({ path: ".env" });

const adapter = new PrismaPg(process.env.DATABASE_URL!);
const prisma = new PrismaClient({ adapter } as never);

async function main() {
  // Admin user
  const hashedPassword = await bcrypt.hash(
    process.env.ADMIN_PASSWORD || "admin123",
    12
  );
  await prisma.user.upsert({
    where: { email: process.env.ADMIN_EMAIL || "admin@bogadnistore.com" },
    update: {},
    create: {
      email: process.env.ADMIN_EMAIL || "admin@bogadnistore.com",
      name: "Admin",
      password: hashedPassword,
      role: "ADMIN",
    },
  });

  // Categories
  const hoodies = await prisma.category.upsert({
    where: { slug: "hoodies" },
    update: {},
    create: { name: "Hoodies", slug: "hoodies", description: "Hoodies premium" },
  });
  const tshirts = await prisma.category.upsert({
    where: { slug: "t-shirts" },
    update: {},
    create: { name: "T-Shirts", slug: "t-shirts", description: "T-Shirts moderne" },
  });
  const sweatshirts = await prisma.category.upsert({
    where: { slug: "sweatshirts" },
    update: {},
    create: { name: "Sweatshirts", slug: "sweatshirts", description: "Sweatshirts cilësore" },
  });
  const pants = await prisma.category.upsert({
    where: { slug: "pantallona" },
    update: {},
    create: { name: "Pantallona", slug: "pantallona", description: "Pantallona të rehatshme" },
  });

  // Collections
  const summer = await prisma.collection.upsert({
    where: { slug: "summer-sale" },
    update: {},
    create: { name: "Summer Sale", slug: "summer-sale", description: "Deri në 30% ulje" },
  });
  const newCol = await prisma.collection.upsert({
    where: { slug: "new-collection" },
    update: {},
    create: { name: "New Collection", slug: "new-collection", description: "Koleksioni i ri" },
  });

  // Products
  const products = [
    {
      name: "Hoodie Essential",
      slug: "hoodie-essential",
      price: 4490,
      comparePrice: 5500,
      description:
        "Dizajn minimal. Cilësi maksimale. Material premium pambuku për rehati gjithë ditës. Fit i relaksuar, i përshtatshëm për çdo rast.",
      categoryId: hoodies.id,
      collectionId: newCol.id,
      sizes: ["S", "M", "L", "XL", "XXL"],
      colors: [
        { name: "E zezë", hex: "#000000" },
        { name: "Gri", hex: "#808080" },
        { name: "Beige", hex: "#F5F0E8" },
      ],
      stock: 50,
      mainImage: "https://images.unsplash.com/photo-1556821840-3a63f15732ce?w=800&q=80",
      images: [
        "https://images.unsplash.com/photo-1556821840-3a63f15732ce?w=800&q=80",
        "https://images.unsplash.com/photo-1509942774463-acf339cf87d5?w=800&q=80",
      ],
      featured: true,
      newArrival: true,
      onSale: false,
    },
    {
      name: "Oversized T-Shirt",
      slug: "oversized-t-shirt",
      price: 2990,
      comparePrice: null,
      description:
        "T-shirt oversized me fit të lirshëm. Ideal për stilin streetwear. 100% pambuk organik, i butë në lëkurë.",
      categoryId: tshirts.id,
      collectionId: summer.id,
      sizes: ["S", "M", "L", "XL"],
      colors: [
        { name: "Beige", hex: "#F5F0E8" },
        { name: "E bardhë", hex: "#FFFFFF" },
        { name: "E zezë", hex: "#000000" },
      ],
      stock: 80,
      mainImage: "https://images.unsplash.com/photo-1583743814966-8936f5b7be1a?w=800&q=80",
      images: [
        "https://images.unsplash.com/photo-1583743814966-8936f5b7be1a?w=800&q=80",
        "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=800&q=80",
      ],
      featured: true,
      newArrival: false,
      onSale: true,
    },
    {
      name: "Crewneck Sweatshirt",
      slug: "crewneck-sweatshirt",
      price: 3990,
      comparePrice: 4800,
      description:
        "Crewneck klasik me logo Bogadni Store. Material i trashë dhe i ngrohtë, i përshtatshëm për stinën e ftohtë.",
      categoryId: sweatshirts.id,
      collectionId: newCol.id,
      sizes: ["S", "M", "L", "XL", "XXL"],
      colors: [
        { name: "Beige", hex: "#F5F0E8" },
        { name: "E zezë", hex: "#000000" },
        { name: "Kafe", hex: "#795548" },
      ],
      stock: 35,
      mainImage: "https://images.unsplash.com/photo-1578768079052-aa76e52ff62e?w=800&q=80",
      images: [
        "https://images.unsplash.com/photo-1578768079052-aa76e52ff62e?w=800&q=80",
        "https://images.unsplash.com/photo-1594938298603-c8148c4dae35?w=800&q=80",
      ],
      featured: true,
      newArrival: true,
      onSale: true,
    },
    {
      name: "Cargo Pants",
      slug: "cargo-pants",
      price: 4990,
      comparePrice: 6000,
      description:
        "Pantallona cargo me shumë xhepa funksionale. Materiali i fortë dhe i qëndrueshëm. Fit relaksuar për komoditet maksimal.",
      categoryId: pants.id,
      collectionId: summer.id,
      sizes: ["S", "M", "L", "XL"],
      colors: [
        { name: "E zezë", hex: "#000000" },
        { name: "Gri", hex: "#808080" },
        { name: "Kaki", hex: "#8B8B6B" },
      ],
      stock: 25,
      mainImage: "https://images.unsplash.com/photo-1624378439575-d8705ad7ae80?w=800&q=80",
      images: [
        "https://images.unsplash.com/photo-1624378439575-d8705ad7ae80?w=800&q=80",
        "https://images.unsplash.com/photo-1506629082955-511b1aa562c8?w=800&q=80",
      ],
      featured: true,
      newArrival: false,
      onSale: true,
    },
    {
      name: "Zip-Up Hoodie",
      slug: "zip-up-hoodie",
      price: 5490,
      comparePrice: null,
      description:
        "Hoodie me zinxhir të plotë. Dizajn modern dhe funksional. Material premium me kapuç të rregullueshëm.",
      categoryId: hoodies.id,
      collectionId: newCol.id,
      sizes: ["S", "M", "L", "XL", "XXL"],
      colors: [
        { name: "E zezë", hex: "#000000" },
        { name: "Gri e errët", hex: "#333333" },
      ],
      stock: 40,
      mainImage: "https://images.unsplash.com/photo-1571945153237-4929e783af4a?w=800&q=80",
      images: [
        "https://images.unsplash.com/photo-1571945153237-4929e783af4a?w=800&q=80",
      ],
      featured: false,
      newArrival: true,
      onSale: false,
    },
    {
      name: "Slim Fit T-Shirt",
      slug: "slim-fit-t-shirt",
      price: 1990,
      comparePrice: null,
      description:
        "T-shirt slim fit klasik. I përshtatshëm për çdo rast, nga sporti deri tek daljet ditore.",
      categoryId: tshirts.id,
      collectionId: summer.id,
      sizes: ["S", "M", "L", "XL"],
      colors: [
        { name: "E bardhë", hex: "#FFFFFF" },
        { name: "E zezë", hex: "#000000" },
        { name: "Gri", hex: "#808080" },
      ],
      stock: 100,
      mainImage: "https://images.unsplash.com/photo-1586790170083-2f9ceadc732d?w=800&q=80",
      images: [
        "https://images.unsplash.com/photo-1586790170083-2f9ceadc732d?w=800&q=80",
      ],
      featured: false,
      newArrival: false,
      onSale: true,
    },
    {
      name: "Jogger Pants",
      slug: "jogger-pants",
      price: 3490,
      comparePrice: 4200,
      description:
        "Pantallona jogger të rehatshme me brez elastik. Perfekte për stërvitje ose relaksim në shtëpi.",
      categoryId: pants.id,
      collectionId: summer.id,
      sizes: ["S", "M", "L", "XL"],
      colors: [
        { name: "Gri", hex: "#808080" },
        { name: "E zezë", hex: "#000000" },
      ],
      stock: 60,
      mainImage: "https://images.unsplash.com/photo-1552902865-b72c031ac5ea?w=800&q=80",
      images: [
        "https://images.unsplash.com/photo-1552902865-b72c031ac5ea?w=800&q=80",
      ],
      featured: false,
      newArrival: true,
      onSale: true,
    },
    {
      name: "Premium Sweatshirt",
      slug: "premium-sweatshirt",
      price: 4490,
      comparePrice: null,
      description:
        "Sweatshirt premium me material të trashë 380gsm. Warmth dhe stil në të njëjtën kohë.",
      categoryId: sweatshirts.id,
      collectionId: newCol.id,
      sizes: ["S", "M", "L", "XL", "XXL"],
      colors: [
        { name: "Beige", hex: "#F5F0E8" },
        { name: "Gri e çelët", hex: "#D3D3D3" },
        { name: "E zezë", hex: "#000000" },
      ],
      stock: 45,
      mainImage: "https://images.unsplash.com/photo-1614251056216-f748f76cd228?w=800&q=80",
      images: [
        "https://images.unsplash.com/photo-1614251056216-f748f76cd228?w=800&q=80",
      ],
      featured: false,
      newArrival: true,
      onSale: false,
    },
  ];

  for (const p of products) {
    await prisma.product.upsert({
      where: { slug: p.slug },
      update: {},
      create: p,
    });
  }

  // Site settings
  await prisma.siteSettings.upsert({
    where: { id: "default" },
    update: {},
    create: {
      id: "default",
      heroTitle: "STIL. CILËSI. VETËBESIM.",
      heroSubtitle: "Rroba moderne për çdo moment. Zgjidh stilin tënd, dallohu.",
      announcementText: "TRANSPORT FALAS PËR POROSI MBI 5,000 LEK",
      freeShippingMin: 5000,
    },
  });

  console.log("Seed completed successfully!");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
