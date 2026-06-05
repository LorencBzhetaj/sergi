import { prisma } from "@/lib/prisma";
import { formatPrice } from "@/lib/utils";
import { OrderStatusSelect } from "./OrderStatusSelect";

function maskPhone(phone: string | null): string {
  if (!phone) return "—";
  const digits = phone.replace(/\s/g, "");
  if (digits.length <= 4) return phone;
  return `••• ••• ${digits.slice(-4)}`;
}

export default async function AdminOrdersPage() {
  const orders = await prisma.order.findMany({
    include: { items: { include: { product: { select: { name: true } } } } },
    orderBy: { createdAt: "desc" },
    take: 100,
  });

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-lg sm:text-xl font-bold tracking-widest">POROSI</h1>
        <p className="text-neutral-500 text-sm mt-1">{orders.length} porosi gjithsej</p>
      </div>

      <div className="bg-white border border-neutral-100 overflow-x-auto">
        <table className="w-full text-sm min-w-[760px]">
          <thead className="border-b border-neutral-100">
            <tr className="text-left">
              <th className="py-3 px-4 text-xs font-bold tracking-widest text-neutral-500">ID</th>
              <th className="py-3 px-4 text-xs font-bold tracking-widest text-neutral-500">KLIENTI</th>
              <th className="py-3 px-4 text-xs font-bold tracking-widest text-neutral-500">ARTIKUJ</th>
              <th className="py-3 px-4 text-xs font-bold tracking-widest text-neutral-500">TOTALI</th>
              <th className="py-3 px-4 text-xs font-bold tracking-widest text-neutral-500">STATUSI</th>
              <th className="py-3 px-4 text-xs font-bold tracking-widest text-neutral-500">DATA</th>
            </tr>
          </thead>
          <tbody>
            {orders.map((order) => (
              <tr key={order.id} className="border-b border-neutral-50 hover:bg-neutral-50">
                <td className="py-3 px-4 text-xs font-mono">#{order.id.slice(-8).toUpperCase()}</td>
                <td className="py-3 px-4 text-xs">
                  <p className="font-medium">{order.customerName || "—"}</p>
                  <p className="text-neutral-400">{maskPhone(order.phone)}</p>
                </td>
                <td className="py-3 px-4 text-xs max-w-[220px]">
                  <span className="line-clamp-2">
                    {order.items.map((i) => `${i.quantity}× ${i.product.name}`).join(", ")}
                  </span>
                </td>
                <td className="py-3 px-4 text-xs font-medium whitespace-nowrap">{formatPrice(order.total)}</td>
                <td className="py-3 px-4">
                  <OrderStatusSelect orderId={order.id} current={order.status} />
                </td>
                <td className="py-3 px-4 text-xs text-neutral-500 whitespace-nowrap">
                  {new Date(order.createdAt).toLocaleDateString("sq-AL")}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {orders.length === 0 && (
          <p className="text-center py-12 text-neutral-400 text-sm">Nuk ka porosi ende.</p>
        )}
      </div>
    </div>
  );
}
