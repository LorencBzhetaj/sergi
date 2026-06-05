import { z } from "zod";

// Slugs that conflict with Next.js routes or sensitive paths
const RESERVED_SLUGS = new Set([
  "shop", "cart", "wishlist", "admin", "api", "login", "logout",
  "register", "dashboard", "search", "checkout", "payment", "order",
  "orders", "account", "profile", "settings", "new", "edit", "delete",
  "create", "update", "sitemap", "robots", "favicon", "health",
  "koleksione", "kontakt", "rreth-nesh", "shipping", "privacy-policy", "terms",
]);

const slugSchema = z
  .string()
  .min(2)
  .max(200)
  .regex(/^[a-z0-9-]+$/, "Slug duhet të përmbajë vetëm shkronja të vogla, numra dhe vizë")
  .refine((s) => !RESERVED_SLUGS.has(s), { message: "Ky slug është i rezervuar nga sistemi." });

export const productSchema = z.object({
  name: z.string().min(2, "Emri duhet të ketë të paktën 2 karaktere").max(200),
  slug: slugSchema,
  price: z.number().positive("Çmimi duhet të jetë pozitiv").max(1_000_000),
  comparePrice: z.number().positive().nullable().optional(),
  compareAtPrice: z.number().positive().optional(),
  description: z.string().min(10, "Përshkrimi duhet të ketë të paktën 10 karaktere").max(5000),
  categoryId: z.string().min(1, "Kategoria është e detyrueshme"),
  collectionId: z.string().optional().nullable(),
  sizes: z.array(z.string()).min(1, "Zgjidhni të paktën një madhësi"),
  colors: z.array(z.object({ name: z.string(), hex: z.string() })).min(1, "Shtoni të paktën një ngjyrë"),
  stock: z.number().int().min(0, "Stoku nuk mund të jetë negativ"),
  mainImage: z.string().url("Imazhi kryesor duhet të jetë URL e vlefshme").or(z.literal("")).default(""),
  images: z.array(z.string().url()).optional(),
  featured: z.boolean().default(false),
  newArrival: z.boolean().default(false),
  onSale: z.boolean().default(false),
  isActive: z.boolean().default(true),
});

export const loginSchema = z.object({
  email: z.string().email().max(254),
  password: z.string().min(1).max(128),
});

export const newsletterSchema = z.object({
  email: z.string().email("Email-i nuk është i vlefshëm").max(254).trim().toLowerCase(),
});

export const contactSchema = z.object({
  name: z.string().min(2, "Emri duhet të ketë të paktën 2 karaktere").max(100).trim(),
  email: z.string().email("Email-i nuk është i vlefshëm").max(254).trim(),
  phone: z.string().max(20).optional(),
  message: z.string().min(10, "Mesazhi duhet të ketë të paktën 10 karaktere").max(2000).trim(),
});

export const orderIntentSchema = z.object({
  items: z
    .array(
      z.object({
        productId: z.string().min(1),
        size: z.string().min(1),
        color: z.string().min(1),
        quantity: z.number().int().min(1).max(10),
      })
    )
    .min(1)
    .max(20),
  customerName: z.string().max(100).optional(),
  customerPhone: z.string().max(20).optional(),
});

export const categorySchema = z.object({
  name: z.string().min(2),
  slug: z.string().min(2).regex(/^[a-z0-9-]+$/),
  description: z.string().optional(),
  image: z.string().url().optional().nullable(),
});

export const collectionSchema = z.object({
  name: z.string().min(2),
  slug: z.string().min(2).regex(/^[a-z0-9-]+$/),
  description: z.string().optional(),
  image: z.string().url().optional().nullable(),
});

export type ProductFormData = z.infer<typeof productSchema>;
export type NewsletterFormData = z.infer<typeof newsletterSchema>;
export type ContactFormData = z.infer<typeof contactSchema>;
export type OrderIntentFormData = z.infer<typeof orderIntentSchema>;
export type CategoryFormData = z.infer<typeof categorySchema>;
export type CollectionFormData = z.infer<typeof collectionSchema>;
