import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { rateLimit } from "@/lib/rate-limit";

export async function GET(req: NextRequest) {
  const ip = req.headers.get("x-forwarded-for") || "unknown";
  if (!rateLimit(`products:${ip}`, 60, 60_000)) {
    return NextResponse.json({ error: "Shumë kërkesa. Provoni përsëri." }, { status: 429 });
  }

  const { searchParams } = new URL(req.url);
  const category   = searchParams.get("category");
  const sale       = searchParams.get("sale");
  const newArrival = searchParams.get("newArrival");
  const featured   = searchParams.get("featured");
  const size       = searchParams.get("size");
  const color      = searchParams.get("color");
  const q          = searchParams.get("q");
  const sort       = searchParams.get("sort");
  const limitParam = Math.min(parseInt(searchParams.get("limit") || "50"), 100);

  try {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const where: Record<string, any> = { isActive: true };

    if (category)              where.category    = { slug: category };
    if (sale === "true")       where.onSale      = true;
    if (newArrival === "true") where.newArrival  = true;
    if (featured === "true")   where.featured    = true;
    if (size)                  where.sizes       = { has: size };
    if (color)                 where.colors      = { array_contains: [{ name: color }] };

    if (q) {
      where.OR = [
        { name:        { contains: q, mode: "insensitive" } },
        { description: { contains: q, mode: "insensitive" } },
      ];
    }

    let orderBy: Record<string, string> = { createdAt: "desc" };
    if (sort === "price-asc")  orderBy = { price: "asc" };
    if (sort === "price-desc") orderBy = { price: "desc" };
    if (sort === "popular")    orderBy = { views: "desc" };

    const products = await prisma.product.findMany({
      where,
      include: { category: true, collection: true },
      take: limitParam,
      orderBy,
    });

    return NextResponse.json(products, {
      headers: { "Cache-Control": "public, s-maxage=30, stale-while-revalidate=60" },
    });
  } catch {
    return NextResponse.json({ error: "Ndodhi një gabim." }, { status: 500 });
  }
}
