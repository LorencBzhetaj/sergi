import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

// GET /api/products/colors — returns all unique colors across active products
export async function GET() {
  try {
    const products = await prisma.product.findMany({
      where: { isActive: true },
      select: { colors: true },
    });

    const colorMap = new Map<string, string>(); // name → hex

    for (const p of products) {
      const colors = p.colors as { name: string; hex: string }[];
      if (Array.isArray(colors)) {
        for (const c of colors) {
          if (c.name && c.hex && !colorMap.has(c.name)) {
            colorMap.set(c.name, c.hex);
          }
        }
      }
    }

    const result = Array.from(colorMap.entries())
      .map(([name, hex]) => ({ name, hex }))
      .sort((a, b) => a.name.localeCompare(b.name, "sq"));

    return NextResponse.json(result, {
      headers: { "Cache-Control": "public, s-maxage=60, stale-while-revalidate=120" },
    });
  } catch {
    return NextResponse.json([], { status: 500 });
  }
}
