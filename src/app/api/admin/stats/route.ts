import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

function maskPhone(phone: string | null | undefined): string {
  if (!phone) return "";
  if (phone.length <= 4) return "****";
  return "*".repeat(phone.length - 4) + phone.slice(-4);
}

export async function GET() {
  const session = await auth();
  if (!session || (session.user as { role?: string }).role !== "ADMIN") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

    const [
      productCount,
      orderCount,
      pendingOrderCount,
      confirmedOrderCount,
      orders,
      topProducts,
      recentOrders,
      dailyOrders,
    ] = await Promise.all([
      prisma.product.count({ where: { isActive: true } }),
      prisma.order.count(),
      prisma.order.count({ where: { status: "PENDING" } }),
      prisma.order.count({ where: { status: "CONFIRMED" } }),
      prisma.order.findMany({ select: { total: true } }),
      prisma.product.findMany({
        orderBy: { views: "desc" },
        take: 5,
        select: { id: true, name: true, views: true, mainImage: true, price: true },
      }),
      prisma.order.findMany({
        orderBy: { createdAt: "desc" },
        take: 10,
        include: { items: { include: { product: { select: { name: true } } } } },
      }),
      prisma.order.groupBy({
        by: ["createdAt"],
        where: { createdAt: { gte: thirtyDaysAgo } },
        _count: { id: true },
        _sum: { total: true },
      }),
    ]);

    const revenue = orders.reduce((sum, o) => sum + o.total, 0);

    // Mask customer phone in recent orders
    const maskedRecentOrders = recentOrders.map((order) => ({
      ...order,
      phone: maskPhone(order.phone),
      customerName: order.customerName,
    }));

    // Group daily orders by date string
    const ordersChart: Record<string, { count: number; revenue: number }> = {};
    for (const row of dailyOrders) {
      const dateKey = row.createdAt.toISOString().slice(0, 10);
      if (!ordersChart[dateKey]) {
        ordersChart[dateKey] = { count: 0, revenue: 0 };
      }
      ordersChart[dateKey].count += row._count.id;
      ordersChart[dateKey].revenue += row._sum.total ?? 0;
    }

    return NextResponse.json({
      productCount,
      orderCount,
      pendingOrderCount,
      confirmedOrderCount,
      revenue,
      topProducts,
      recentOrders: maskedRecentOrders,
      ordersChart,
    });
  } catch {
    return NextResponse.json({ error: "Ndodhi një gabim." }, { status: 500 });
  }
}
