import { prisma } from "@/lib/prisma";
import Image from "next/image";
import Link from "next/link";
import { formatPrice } from "@/lib/utils";
import { Package, ShoppingBag, TrendingUp, Eye, Plus, ArrowRight } from "lucide-react";

async function getStats() {
  const now = new Date();
  const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
  const startOfLastMonth = new Date(now.getFullYear(), now.getMonth() - 1, 1);

  const [
    productCount, productCountLastMonth,
    orderCount, orderCountLastMonth,
    allOrders, pendingOrders, confirmedOrders,
    topProducts, recentOrders,
    newsletterCount,
  ] = await Promise.all([
    prisma.product.count({ where: { isActive: true } }),
    prisma.product.count({ where: { isActive: true, createdAt: { lt: startOfMonth } } }),
    prisma.order.count(),
    prisma.order.count({ where: { createdAt: { lt: startOfMonth } } }),
    prisma.order.findMany({ select: { total: true, createdAt: true } }),
    prisma.order.count({ where: { status: "PENDING" } }),
    prisma.order.count({ where: { status: "CONFIRMED" } }),
    prisma.product.findMany({
      where: { isActive: true },
      orderBy: { views: "desc" },
      take: 5,
      select: { id: true, name: true, slug: true, views: true, mainImage: true, price: true },
    }),
    prisma.order.findMany({
      orderBy: { createdAt: "desc" },
      take: 6,
      include: {
        items: {
          include: { product: { select: { name: true } } },
          take: 1,
        },
      },
    }),
    prisma.newsletter.count(),
  ]);

  const revenue = allOrders.reduce((s, o) => s + o.total, 0);
  const revenueThisMonth = allOrders
    .filter((o) => o.createdAt >= startOfMonth)
    .reduce((s, o) => s + o.total, 0);
  const revenueLastMonth = allOrders
    .filter((o) => o.createdAt >= startOfLastMonth && o.createdAt < startOfMonth)
    .reduce((s, o) => s + o.total, 0);

  const newProductsThisMonth = productCount - productCountLastMonth;
  const newOrdersThisMonth = orderCount - orderCountLastMonth;

  return {
    productCount, newProductsThisMonth,
    orderCount, newOrdersThisMonth,
    revenue, revenueThisMonth, revenueLastMonth,
    pendingOrders, confirmedOrders,
    topProducts, recentOrders, newsletterCount,
  };
}

function Delta({ value, suffix = "" }: { value: number; suffix?: string }) {
  if (value === 0) return null;
  return (
    <span className={`text-[10px] font-medium ${value > 0 ? "text-green-600" : "text-red-500"}`}>
      {value > 0 ? "+" : ""}{value}{suffix} këtë muaj
    </span>
  );
}

const STATUS_LABELS: Record<string, { label: string; cls: string }> = {
  PENDING:   { label: "Në pritje", cls: "bg-yellow-100 text-yellow-700" },
  CONFIRMED: { label: "Konfirmuar", cls: "bg-blue-100 text-blue-700" },
  SHIPPED:   { label: "Dërguar", cls: "bg-indigo-100 text-indigo-700" },
  DELIVERED: { label: "Dorëzuar", cls: "bg-green-100 text-green-700" },
  CANCELLED: { label: "Anuluar", cls: "bg-red-100 text-red-600" },
};

export default async function AdminDashboard() {
  const s = await getStats();

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-lg sm:text-xl font-bold tracking-widest">PANELI KRYESOR</h1>
          <p className="text-neutral-500 text-sm mt-0.5">Bogdani Store — pasqyra e aktivitetit</p>
        </div>
        <Link
          href="/admin/products/new"
          className="flex items-center gap-1.5 bg-black text-white text-xs font-bold tracking-widest px-4 py-2.5 hover:bg-neutral-800 transition-colors"
        >
          <Plus className="h-3.5 w-3.5" /> Produkt i ri
        </Link>
      </div>

      {/* Stat cards */}
      <div className="grid grid-cols-2 xl:grid-cols-4 gap-3 sm:gap-4">
        {[
          {
            label: "Produkte aktive",
            value: s.productCount,
            sub: <Delta value={s.newProductsThisMonth} />,
            icon: Package, color: "text-blue-600", bg: "bg-blue-50",
          },
          {
            label: "Porosi totale",
            value: s.orderCount,
            sub: <Delta value={s.newOrdersThisMonth} />,
            icon: ShoppingBag, color: "text-[#C9A84C]", bg: "bg-amber-50",
          },
          {
            label: "Të ardhurat (Lek)",
            value: formatPrice(s.revenue),
            sub: s.revenueThisMonth > 0
              ? <span className="text-[10px] text-green-600">+{formatPrice(s.revenueThisMonth)} këtë muaj</span>
              : null,
            icon: TrendingUp, color: "text-green-600", bg: "bg-green-50",
          },
          {
            label: "Abonentë newsletter",
            value: s.newsletterCount,
            sub: null,
            icon: Eye, color: "text-purple-600", bg: "bg-purple-50",
          },
        ].map((card) => (
          <div key={card.label} className="bg-white border border-neutral-100 p-4 sm:p-5">
            <div className="flex items-start justify-between mb-3">
              <p className="text-xs text-neutral-500 leading-tight">{card.label}</p>
              <div className={`${card.bg} p-1.5 rounded`}>
                <card.icon className={`h-3.5 w-3.5 ${card.color}`} />
              </div>
            </div>
            <p className="text-xl sm:text-2xl font-bold">{card.value}</p>
            <div className="mt-1 h-4">{card.sub}</div>
          </div>
        ))}
      </div>

      {/* Order status row */}
      <div className="grid grid-cols-2 gap-3">
        <div className="bg-yellow-50 border border-yellow-100 p-4 flex items-center gap-3">
          <ShoppingBag className="h-5 w-5 text-yellow-600 shrink-0" />
          <div>
            <p className="text-xl font-bold text-yellow-700">{s.pendingOrders}</p>
            <p className="text-xs text-yellow-600">Porosi në pritje</p>
          </div>
        </div>
        <div className="bg-blue-50 border border-blue-100 p-4 flex items-center gap-3">
          <ShoppingBag className="h-5 w-5 text-blue-600 shrink-0" />
          <div>
            <p className="text-xl font-bold text-blue-700">{s.confirmedOrders}</p>
            <p className="text-xs text-blue-600">Porosi konfirmuara</p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
        {/* Top products */}
        <div className="bg-white border border-neutral-100 p-4 sm:p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xs font-bold tracking-widest">MË TË SHIKUARAT</h2>
            <Link href="/admin/products" className="text-xs text-neutral-400 hover:text-black flex items-center gap-1">
              Të gjitha <ArrowRight className="h-3 w-3" />
            </Link>
          </div>
          <div className="space-y-3">
            {s.topProducts.length === 0 ? (
              <p className="text-xs text-neutral-400 py-4 text-center">Nuk ka produkte ende.</p>
            ) : s.topProducts.map((p, i) => (
              <Link key={p.id} href={`/admin/products/${p.id}/edit`} className="flex items-center gap-3 hover:bg-neutral-50 -mx-2 px-2 py-1 rounded transition-colors">
                <span className="text-xs text-neutral-400 w-4 shrink-0">{i + 1}</span>
                <div className="relative w-10 h-10 bg-neutral-100 shrink-0 overflow-hidden">
                  <Image src={p.mainImage} alt={p.name} fill className="object-cover" sizes="40px" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-xs font-medium truncate">{p.name}</p>
                  <p className="text-xs text-neutral-400">{formatPrice(p.price)}</p>
                </div>
                <div className="text-right shrink-0">
                  <p className="text-xs font-semibold">{p.views.toLocaleString()}</p>
                  <p className="text-[10px] text-neutral-400">shikime</p>
                </div>
              </Link>
            ))}
          </div>
        </div>

        {/* Recent orders */}
        <div className="bg-white border border-neutral-100 p-4 sm:p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xs font-bold tracking-widest">POROSITË E FUNDIT</h2>
            <Link href="/admin/orders" className="text-xs text-neutral-400 hover:text-black flex items-center gap-1">
              Të gjitha <ArrowRight className="h-3 w-3" />
            </Link>
          </div>
          <div className="space-y-3">
            {s.recentOrders.length === 0 ? (
              <p className="text-xs text-neutral-400 py-4 text-center">Nuk ka porosi ende.</p>
            ) : s.recentOrders.map((order) => {
              const st = STATUS_LABELS[order.status] ?? { label: order.status, cls: "bg-neutral-100 text-neutral-600" };
              return (
                <div key={order.id} className="flex items-center justify-between text-xs py-1">
                  <div className="min-w-0 flex-1">
                    <p className="font-mono font-semibold">#{order.id.slice(-6).toUpperCase()}</p>
                    <p className="text-neutral-400 truncate">
                      {order.customerName || "—"} · {order.items[0]?.product?.name ?? ""}
                      {order.items.length > 1 ? ` +${order.items.length - 1}` : ""}
                    </p>
                  </div>
                  <div className="text-right ml-3 shrink-0">
                    <p className="font-semibold">{formatPrice(order.total)}</p>
                    <span className={`text-[9px] px-1.5 py-0.5 rounded font-medium ${st.cls}`}>
                      {st.label}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
