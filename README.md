# BOGADNI STORE

Premium fashion e-commerce platform for Albania. Orders via WhatsApp (+355 69 211 1876).

**Stil. Cilësi. Vetëbesim.**

---

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend | Next.js 16, TypeScript, Tailwind CSS v4 |
| UI | Radix UI, Framer Motion, Lucide Icons |
| Backend | Next.js Server Actions, Route Handlers |
| Database | PostgreSQL + Prisma ORM v7 |
| Auth | NextAuth v5 (Auth.js) |
| State | Zustand (cart, wishlist) |
| Deployment | Vercel |

---

## Quick Start

### 1. Install

```bash
cd bogadni-store
npm install
```

### 2. Environment Variables

```bash
cp .env.example .env.local
# Edit .env.local with your values
```

Key variables:

```env
DATABASE_URL="postgresql://user:password@localhost:5432/bogadni_store"
NEXTAUTH_SECRET="min-32-character-secret-key"
NEXTAUTH_URL="http://localhost:3000"
ADMIN_EMAIL="admin@bogadnistore.com"
ADMIN_PASSWORD="your-secure-password"
NEXT_PUBLIC_WHATSAPP_NUMBER="355692111876"
NEXT_PUBLIC_SITE_URL="http://localhost:3000"
```

### 3. Database Setup

```bash
# Create DB
createdb bogadni_store

# Push schema
npm run db:push

# Generate client
npm run db:generate

# Seed sample data + admin user
npm run db:seed
```

### 4. Run

```bash
npm run dev
# Open http://localhost:3000
```

---

## Admin Panel

URL: `/admin/login`

Credentials: set via `ADMIN_EMAIL` and `ADMIN_PASSWORD` in `.env.local`.

Features:
- **Dashboard** — stats, top products, recent orders
- **Products** — full CRUD with image URLs, sizes, colors, stock
- **Categories** — manage product categories
- **Collections** — manage curated collections (Summer Sale, New Collection, etc.)
- **Orders** — view WhatsApp orders and status
- **Statistics** — top products by views, revenue

---

## WhatsApp Ordering

No payment gateway — all orders go through WhatsApp.

Single product message format:
```
Pershendetje, Dua te porosis:

Produkti: Hoodie Essential
Masa: M
Ngjyra: E zeze
Cmimi: 4,490 Lek
Link: https://bogadnistore.com/product/hoodie-essential
```

Cart checkout generates a message with all items, totals, and shipping info.

---

## Deployment (Vercel)

1. Push to GitHub
2. Import repo to Vercel
3. Add all env vars from `.env.example` in Vercel dashboard
4. Use a managed PostgreSQL (Neon, Supabase, Railway)
5. Deploy — Vercel auto-detects Next.js

Production DB setup:
```bash
npx vercel env pull .env.local
npm run db:push
npm run db:seed
```

---

## Project Structure

```
src/
├── app/
│   ├── (shop)/         # Public storefront pages
│   ├── admin/          # Admin panel (protected)
│   ├── api/            # API routes
│   └── actions/        # Server Actions (CRUD)
├── components/
│   ├── layout/         # Navbar, Footer, AnnouncementBar
│   ├── product/        # ProductCard, WhatsAppButton, etc.
│   ├── home/           # HeroSection, FeaturedProducts, etc.
│   └── ui/             # Base components (Button, Input, etc.)
├── lib/                # prisma, auth, utils, validations
├── store/              # Zustand cart store
└── types/              # TypeScript types
```

---

## Security

- Admin routes protected by session check in `proxy.ts`
- Server-side role check on all admin Server Actions
- Zod validation on all inputs
- Rate limiting on API routes
- Security headers (X-Frame-Options, CSP, etc.)
- Prisma parameterized queries (SQL injection protection)

---

## License

Private — Bogadni Store © 2025
