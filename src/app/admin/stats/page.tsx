import { prisma } from "@/lib/prisma";
import { formatPrice } from "@/lib/utils";
import { TrendingUp, Package, ShoppingBag, Eye, Mail, MessageSquare } from "lucide-react";
import Link from "next/link";

async function getStats() {
  const now = new Date();
  const months = Array.from({ length: 6 }, (_, i) => {
    const d = new Date(now.getFullYear(), now.getMonth() - (5 - i), 1);
    return { year: d.getFullYear(), month: d.getMonth(), label: d.toLocaleString("sq-AL", { month: "short" }) };
  });

  const [productCount, orderCount, allOrders, topProducts, categoryStats, newsletterCount, contactCount, statusCounts] =
    await Promise.all([
      prisma.product.count({ where: { isActive: true } }),
      prisma.order.count(),
      prisma.order.findMany({ select: { total: true, createdAt: true, status: true } }),
      prisma.product.findMany({
        where: { isActive: true },
        orderBy: { views: "desc" },
        take: 10,
        select: { id: true, name: true, views: true, price: true, stock: true, category: { select: { name: true } } },
      }),
      prisma.category.findMany({ select: { name: true, _count: { select: { products: true } } }, orderBy: { name: "asc" } }),
      prisma.newsletter.count(),
      prisma.contactMessage.count({ where: { isRead: false } }).catch(() => 0),
      prisma.order.groupBy({ by: ["status"], _count: true }),
    ]);

  const revenue = allOrders.reduce((s, o) => s + o.total, 0);
  const totalViews = topProducts.reduce((s, p) => s + p.views, 0);

  const monthlyData = months.map((m) => {
    const monthOrders = allOrders.filter((o) => {
      const d = new Date(o.createdAt);
      return d.getFullYear() === m.year && d.getMonth() === m.month;
    });
    return { ...m, revenue: monthOrders.reduce((s, o) => s + o.total, 0), orders: monthOrders.length };
  });

  const maxRevenue = Math.max(...monthlyData.map((m) => m.revenue), 1);
  const statusMap: Record<string, number> = {};
  statusCounts.forEach((s) => { statusMap[s.status] = s._count; });

  return { productCount, orderCount, revenue, totalViews, topProducts, categoryStats, newsletterCount, contactCount, monthlyData, maxRevenue, statusMap };
}

const STATUS_STYLES: Record<string, { label: string; cls: string }> = {
  PENDING:   { label: "Në pritje",  cls: "bg-yellow-100 text-yellow-700" },
  CONFIRMED: { label: "Konfirmuar", cls: "bg-blue-100 text-blue-700" },
  SHIPPED:   { label: "Dërguar",    cls: "bg-indigo-100 text-indigo-700" },
  DELIVERED: { label: "Dorëzuar",   cls: "bg-green-100 text-green-700" },
  CANCELLED: { label: "Anuluar",    cls: "bg-red-100 text-red-600" },
};

export default async function AdminStatsPage() {
  const s = await getStats();

  return (
    <div className="space-y-6">
      <h1 className="text-lg sm:text-xl font-bold tracking-widest">STATISTIKAT</h1>

      {/* KPI Cards */}
      <div className="grid grid-cols-2 xl:grid-cols-3 gap-3 sm:gap-4">
        {[
          { label: "Produkte aktive",     value: s.productCount,         icon: Package,       color: "text-blue-600",   bg: "bg-blue-50" },
          { label: "Porosi gjithsej",     value: s.orderCount,           icon: ShoppingBag,   color: "text-amber-600",  bg: "bg-amber-50" },
          { label: "Të ardhura (Lek)",    value: formatPrice(s.revenue), icon: TrendingUp,    color: "text-green-600",  bg: "bg-green-50" },
          { label: "Shikime produktesh",  value: s.totalViews,           icon: Eye,           color: "text-purple-600", bg: "bg-purple-50" },
          { label: "Abonentë newsletter", value: s.newsletterCount,      icon: Mail,          color: "text-pink-600",   bg: "bg-pink-50" },
          { label: "Mesazhe të palexuara",value: s.contactCount,         icon: MessageSquare, color: "text-orange-600", bg: "bg-orange-50" },
        ].map((c) => (
          <div key={c.label} className="bg-white border border-neutral-100 p-4">
            <div className="flex items-start justify-between mb-2">
              <p className="text-xs text-neutral-500 leading-tight">{c.label}</p>
              <div className={`${c.bg} p-1.5 rounded`}>
                <c.icon className={`h-3.5 w-3.5 ${c.color}`} />
              </div>
            </div>
            <p className="text-xl sm:text-2xl font-bold">{c.value}</p>
          </div>
        ))}
      </div>

      {/* Revenue bar chart */}
      <div className="bg-white border border-neutral-100 p-4 sm:p-6">
        <h2 className="text-xs font-bold tracking-widest mb-6">TË ARDHURAT — 6 MUAJT E FUNDIT</h2>
        <div className="flex items-end gap-2 sm:gap-4" style={{ height: "120px" }}>
          {s.monthlyData.map((m) => {
            const pct = (m.revenue / s.maxRevenue) * 100;
            return (
              <div key={`${m.year}-${m.month}`} className="flex-1 flex flex-col items-center gap-1 h-full">
                <div className="w-full flex-1 flex items-end">
                  <div
                    className="w-full bg-[#C9A84C] hover:bg-[#A8893F] transition-colors rounded-t cursor-default"
                    style={{ height: `${Math.max(pct, m.revenue > 0 ? 3 : 1)}%` }}
                    title={`${m.label} ${m.year}: ${formatPrice(m.revenue)} (${m.orders} porosi)`}
                  />
                </div>
                <p className="text-[9px] text-neutral-500 font-medium">{m.label}</p>
                {m.orders > 0 && <p className="text-[8px] text-neutral-400">{m.orders}p</p>}
              </div>
            );
          })}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
        {/* Order status */}
        <div className="bg-white border border-neutral-100 p-4 sm:p-6">
          <h2 className="text-xs font-bold tracking-widest mb-4">STATUSI I POROSIVE</h2>
          <div className="space-y-3">
            {Object.entries(STATUS_STYLES).map(([status, { label, cls }]) => {
              const count = s.statusMap[status] || 0;
              const pct = s.orderCount > 0 ? Math.round((count / s.orderCount) * 100) : 0;
              return (
                <div key={status}>
                  <div className="flex justify-between text-xs mb-1.5">
                    <span className={`px-2 py-0.5 rounded text-[10px] font-semibold ${cls}`}>{label}</span>
                    <span className="font-semibold text-neutral-700">{count} porosi ({pct}%)</span>
                  </div>
                  <div className="h-1.5 bg-neutral-100 rounded-full overflow-hidden">
                    <div className="h-full bg-[#C9A84C] rounded-full" style={{ width: `${pct}%` }} />
                  </div>
                </div>
              );
            })}
            {s.orderCount === 0 && <p className="text-xs text-neutral-400 text-center py-4">Nuk ka porosi ende.</p>}
          </div>
        </div>

        {/* Category breakdown */}
        <div className="bg-white border border-neutral-100 p-4 sm:p-6">
          <h2 className="text-xs font-bold tracking-widest mb-4">PRODUKTE PËR KATEGORI</h2>
          <div className="space-y-2 max-h-52 overflow-y-auto pr-1">
            {s.categoryStats.filter((c) => c._count.products > 0).map((cat) => (
              <div key={cat.name} className="flex items-center justify-between text-xs py-0.5">
                <span className="text-neutral-600 truncate flex-1">{cat.name}</span>
                <span className="font-semibold ml-3 shrink-0 text-black">{cat._count.products} produkte</span>
              </div>
            ))}
            {s.categoryStats.every((c) => c._count.products === 0) && (
              <p className="text-xs text-neutral-400 text-center py-4">Nuk ka produkte ende.</p>
            )}
          </div>
        </div>
      </div>

      {/* Top products table */}
      <div className="bg-white border border-neutral-100 p-4 sm:p-6">
        <h2 className="text-xs font-bold tracking-widest mb-4">TOP 10 PRODUKTE — SIPAS SHIKIMEVE</h2>
        <div className="overflow-x-auto">
          <table className="w-full text-xs min-w-[480px]">
            <thead>
              <tr className="border-b border-neutral-100 text-left">
                {["#", "PRODUKT", "KATEGORIA", "ÇMIMI", "STOKU", "SHIKIME"].map((h, i) => (
                  <th key={h} className={`pb-3 font-bold tracking-widest text-neutral-400 ${i >= 3 ? "text-right" : ""}`}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {s.topProducts.map((p, i) => (
                <tr key={p.id} className="border-b border-neutral-50 hover:bg-neutral-50 transition-colors">
                  <td className="py-3 text-neutral-400 w-6">{i + 1}</td>
                  <td className="py-3 font-medium">
                    <Link href={`/admin/products/${p.id}/edit`} className="hover:text-[#C9A84C] transition-colors">
                      {p.name}
                    </Link>
                  </td>
                  <td className="py-3 text-neutral-500">{p.category.name}</td>
                  <td className="py-3 text-right">{formatPrice(p.price)}</td>
                  <td className={`py-3 text-right font-semibold ${p.stock === 0 ? "text-red-500" : p.stock <= 5 ? "text-orange-500" : p.stock <= 15 ? "text-amber-500" : "text-green-600"}`}>
                    {p.stock === 0 ? "SHLYER" : p.stock}
                  </td>
                  <td className="py-3 text-right">
                    <span className="flex items-center justify-end gap-1">
                      <Eye className="h-3 w-3 text-neutral-400" />
                      {p.views.toLocaleString("sq-AL")}
                    </span>
                  </td>
                </tr>
              ))}
              {s.topProducts.length === 0 && (
                <tr><td colSpan={6} className="py-10 text-center text-neutral-400">Nuk ka produkte ende.</td></tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
