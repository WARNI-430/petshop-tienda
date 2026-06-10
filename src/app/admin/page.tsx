import { db } from "@/lib/db";
import { Package, ShoppingBag, Euro, TrendingUp } from "lucide-react";

export default async function AdminDashboard() {
  const [totalOrders, totalProducts, revenueData, processingOrders] = await Promise.all([
    db.order.count(),
    db.product.count({ where: { active: true } }),
    db.order.aggregate({
      where: { status: { in: ["PAID", "PROCESSING", "SHIPPED", "DELIVERED"] } },
      _sum: { total: true },
    }),
    db.order.count({ where: { status: "PROCESSING" } }),
  ]);

  const revenue = revenueData._sum.total ?? 0;

  const recentOrders = await db.order.findMany({
    orderBy: { createdAt: "desc" },
    take: 5,
    include: { items: true },
  });

  const stats = [
    { label: "Productos activos", value: totalProducts, icon: Package, color: "bg-blue-50 text-blue-600" },
    { label: "Pedidos totales", value: totalOrders, icon: ShoppingBag, color: "bg-green-50 text-green-600" },
    { label: "Ingresos", value: `${revenue.toFixed(2)} €`, icon: Euro, color: "bg-yellow-50 text-yellow-600" },
    { label: "En proceso (CJ)", value: processingOrders, icon: TrendingUp, color: "bg-purple-50 text-purple-600" },
  ];

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-8">Dashboard</h1>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
        {stats.map((s) => (
          <div key={s.label} className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
            <div className={`inline-flex p-2 rounded-lg mb-3 ${s.color}`}>
              <s.icon className="w-5 h-5" />
            </div>
            <p className="text-2xl font-bold">{s.value}</p>
            <p className="text-sm text-gray-500 mt-1">{s.label}</p>
          </div>
        ))}
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-100">
          <h2 className="font-semibold">Últimos pedidos</h2>
        </div>
        {recentOrders.length === 0 ? (
          <p className="px-6 py-8 text-gray-400 text-sm">No hay pedidos todavía.</p>
        ) : (
          <table className="w-full text-sm">
            <thead className="bg-gray-50 text-gray-500 text-xs uppercase">
              <tr>
                <th className="px-6 py-3 text-left">ID</th>
                <th className="px-6 py-3 text-left">Cliente</th>
                <th className="px-6 py-3 text-left">Estado</th>
                <th className="px-6 py-3 text-right">Total</th>
                <th className="px-6 py-3 text-left">Fecha</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {recentOrders.map((o) => (
                <tr key={o.id} className="hover:bg-gray-50">
                  <td className="px-6 py-3 font-mono text-xs">{o.id.slice(-8).toUpperCase()}</td>
                  <td className="px-6 py-3">{o.customerName}</td>
                  <td className="px-6 py-3">
                    <StatusBadge status={o.status} />
                  </td>
                  <td className="px-6 py-3 text-right font-medium">{o.total.toFixed(2)} €</td>
                  <td className="px-6 py-3 text-gray-500">{new Date(o.createdAt).toLocaleDateString("es-ES")}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}

function StatusBadge({ status }: { status: string }) {
  const map: Record<string, string> = {
    PENDING: "bg-gray-100 text-gray-600",
    PAID: "bg-blue-100 text-blue-700",
    PROCESSING: "bg-yellow-100 text-yellow-700",
    SHIPPED: "bg-purple-100 text-purple-700",
    DELIVERED: "bg-green-100 text-green-700",
    CANCELLED: "bg-red-100 text-red-700",
    REFUNDED: "bg-orange-100 text-orange-700",
  };
  return (
    <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${map[status] ?? "bg-gray-100 text-gray-600"}`}>
      {status}
    </span>
  );
}
