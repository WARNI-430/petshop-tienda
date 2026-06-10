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
    {
      label: "Productos activos",
      value: totalProducts,
      icon: Package,
      gradient: "from-indigo-500/20 to-indigo-500/5",
      iconColor: "text-indigo-400",
      border: "border-indigo-500/20",
    },
    {
      label: "Pedidos totales",
      value: totalOrders,
      icon: ShoppingBag,
      gradient: "from-emerald-500/20 to-emerald-500/5",
      iconColor: "text-emerald-400",
      border: "border-emerald-500/20",
    },
    {
      label: "Ingresos",
      value: `${revenue.toFixed(2)} €`,
      icon: Euro,
      gradient: "from-amber-500/20 to-amber-500/5",
      iconColor: "text-amber-400",
      border: "border-amber-500/20",
    },
    {
      label: "En proceso (CJ)",
      value: processingOrders,
      icon: TrendingUp,
      gradient: "from-violet-500/20 to-violet-500/5",
      iconColor: "text-violet-400",
      border: "border-violet-500/20",
    },
  ];

  return (
    <div className="p-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-white">Dashboard</h1>
        <p className="text-white/40 text-sm mt-1">Resumen general de tu tienda</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {stats.map((s) => (
          <div
            key={s.label}
            className={`relative rounded-xl p-5 border ${s.border} bg-gradient-to-br ${s.gradient} overflow-hidden`}
          >
            <div className="flex items-start justify-between mb-4">
              <div className={`p-2 rounded-lg bg-white/5 ${s.iconColor}`}>
                <s.icon className="w-4 h-4" />
              </div>
            </div>
            <p className="text-2xl font-bold text-white tabular-nums">{s.value}</p>
            <p className="text-xs text-white/40 mt-1">{s.label}</p>
          </div>
        ))}
      </div>

      {/* Recent orders */}
      <div className="rounded-xl border border-white/[0.06] bg-white/[0.02] overflow-hidden">
        <div className="px-6 py-4 border-b border-white/[0.06] flex items-center justify-between">
          <h2 className="text-sm font-semibold text-white">Últimos pedidos</h2>
          <span className="text-xs text-white/30">{recentOrders.length} registros</span>
        </div>
        {recentOrders.length === 0 ? (
          <div className="px-6 py-16 text-center">
            <p className="text-white/20 text-sm">No hay pedidos todavía</p>
          </div>
        ) : (
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-white/[0.04]">
                <th className="px-6 py-3 text-left text-[11px] font-medium text-white/30 uppercase tracking-wider">ID</th>
                <th className="px-6 py-3 text-left text-[11px] font-medium text-white/30 uppercase tracking-wider">Cliente</th>
                <th className="px-6 py-3 text-left text-[11px] font-medium text-white/30 uppercase tracking-wider">Estado</th>
                <th className="px-6 py-3 text-right text-[11px] font-medium text-white/30 uppercase tracking-wider">Total</th>
                <th className="px-6 py-3 text-left text-[11px] font-medium text-white/30 uppercase tracking-wider">Fecha</th>
              </tr>
            </thead>
            <tbody>
              {recentOrders.map((o) => (
                <tr key={o.id} className="border-b border-white/[0.03] hover:bg-white/[0.02] transition-colors">
                  <td className="px-6 py-3.5 font-mono text-xs text-white/40">{o.id.slice(-8).toUpperCase()}</td>
                  <td className="px-6 py-3.5 text-white/70">{o.customerName}</td>
                  <td className="px-6 py-3.5">
                    <StatusBadge status={o.status} />
                  </td>
                  <td className="px-6 py-3.5 text-right font-semibold text-white">{o.total.toFixed(2)} €</td>
                  <td className="px-6 py-3.5 text-white/30 text-xs">{new Date(o.createdAt).toLocaleDateString("es-ES")}</td>
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
    PENDING: "bg-white/10 text-white/50",
    PAID: "bg-indigo-500/20 text-indigo-300",
    PROCESSING: "bg-amber-500/20 text-amber-300",
    SHIPPED: "bg-violet-500/20 text-violet-300",
    DELIVERED: "bg-emerald-500/20 text-emerald-300",
    CANCELLED: "bg-red-500/20 text-red-300",
    REFUNDED: "bg-orange-500/20 text-orange-300",
  };
  return (
    <span className={`px-2.5 py-1 rounded-md text-[11px] font-medium ${map[status] ?? "bg-white/10 text-white/40"}`}>
      {status}
    </span>
  );
}
