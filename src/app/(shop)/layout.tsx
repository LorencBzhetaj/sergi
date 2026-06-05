import { prisma } from "@/lib/prisma";
import { AnnouncementBar } from "@/components/layout/AnnouncementBar";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";

const GROUP_ORDER = ["Veshje", "Sport", "Aksesorë"];

export default async function ShopLayout({ children }: { children: React.ReactNode }) {
  const rawCategories = await prisma.category
    .findMany({ orderBy: { name: "asc" } })
    .catch(() => []);

  // Serialize to plain objects — avoid passing Prisma proxies to client components
  const categories = rawCategories.map((c) => ({
    id: c.id,
    name: c.name,
    slug: c.slug,
    description: c.description ?? null,
  }));

  const groups = GROUP_ORDER
    .map((g) => ({
      group: g,
      items: categories.filter((c) => c.description === g),
    }))
    .filter((g) => g.items.length > 0);

  return (
    <>
      <Navbar groups={groups} />
      <main id="main-content" className="flex-1">
        {children}
      </main>
      <Footer />
    </>
  );
}
