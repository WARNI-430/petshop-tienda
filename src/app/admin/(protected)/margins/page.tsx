import { db } from "@/lib/db";

export default async function AdminMargins() {
  const products = await db.product.findMany({
    where: { active: true },
    include: { orderItems: true },
  });

  const totalRevenue = await db.order.aggregate({
    where: { status: { in: ["PAID", "PROCESSING", "SHIPPED", "DELIVERED"] } },
    _sum: { total: true },
  });

  const paidItems = await db.orderItem.findMany({
    where: { order: { status: { in: ["PAID", "PROCESSING", "SHIPPED", "DELIVERED"] } } },
    include: { product: true },
  });

  const totalCost = paidItems.reduce((acc, i) => acc + i.product.costPrice * i.qty, 0);
  const revenue = totalRevenue._sum.total ?? 0;
  const grossProfit = revenue - totalCost;
  const globalMargin = revenue > 0 ? (grossProfit / revenue) * 100 : 0;

  const summary = [
    {
      label: "Ingresos totales",
      value: `${revenue.toFixed(2)} €`,
      color: "text-emerald-400",
      gradient: "from-emerald-500/15 to-emerald-500/5",
      border: "border-emerald-500/20",
    },
    {
      label: "Coste total (CJ)",
      value: `${totalCost.toFixed(2)} €`,
      color: "text-red-400",
      gradient: "from-red-500/15 to-red-500/5",
      border: "border-red-500/20",
    },
    {
      label: "Beneficio bruto",
      value: `${grossProfit.toFixed(2)} € (${globalMargin.toFixed(1)}%)`,
      color: grossProfit >= 0 ? "text-emerald-400" : "text-red-400",
      gradient: grossProfit >= 0 ? "from-emerald-500/15 to-emerald-500/5" : "from-red-500/15 to-red-500/5",
      border: grossProfit >= 0 ? "border-emerald-500/20" : "border-red-500/20",
    },
  ];

  return (
    <div className="p-8">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-white">Márgenes</h1>
        <p className="text-white/40 text-sm mt-1">Análisis de rentabilidad por producto</p>
      </div>

      {/* Summary cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
        {summary.map((s) => (
          <div
            key={s.label}
            className={`rounded-xl p-5 border ${s.border} bg-gradient-to-br ${s.gradient}`}
          >
            <p className="text-xs text-white/40 mb-2">{s.label}</p>
            <p className={`text-2xl font-bold tabular-nums ${s.color}`}>{s.value}</p>
          </div>
        ))}
      </div>

      {/* Per-product table */}
      <div className="rounded-xl border border-white/[0.06] bg-white/[0.02] overflow-hidden">
        <div className="px-6 py-4 border-b border-white/[0.06] flex items-center justify-between">
          <h2 className="text-sm font-semibold text-white">Margen por producto</h2>
          <span className="text-xs text-white/30">{products.length} activos</span>
        </div>
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-white/[0.04]">
              {["Producto", "Coste CJ", "Precio venta", "Margen €", "Margen %", "Unidades vendidas"].map((h, i) => (
                <th
                  key={h}
                  className={`px-6 py-3 text-[11px] font-medium text-white/30 uppercase tracking-wider ${i === 0 ? "text-left" : "text-right"}`}
                >
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {products.length === 0 ? (
              <tr>
                <td colSpan={6} className="px-6 py-12 text-center text-white/20 text-sm">
                  No hay productos activos todavía
                </td>
              </tr>
            ) : (
              products.map((p) => {
                const marginEur = p.price - p.costPrice;
                const marginPct = p.price > 0 ? (marginEur / p.price) * 100 : 0;
                const unitsSold = p.orderItems.reduce((acc, i) => acc + i.qty, 0);
                return (
                  <tr key={p.id} className="border-b border-white/[0.03] hover:bg-white/[0.02] transition-colors">
                    <td className="px-6 py-4 font-medium text-white/80">{p.nameEs}</td>
                    <td className="px-6 py-4 text-right text-white/40 tabular-nums">{p.costPrice.toFixed(2)} €</td>
                    <td className="px-6 py-4 text-right text-white/70 tabular-nums">{p.price.toFixed(2)} €</td>
                    <td className="px-6 py-4 text-right font-semibold text-white tabular-nums">{marginEur.toFixed(2)} €</td>
                    <td className="px-6 py-4 text-right">
                      <span
                        className={`inline-block px-2.5 py-1 rounded-md text-[11px] font-bold ${
                          marginPct >= 40
                            ? "bg-emerald-500/15 text-emerald-400"
                            : marginPct >= 20
                            ? "bg-amber-500/15 text-amber-400"
                            : "bg-red-500/15 text-red-400"
                        }`}
                      >
                        {marginPct.toFixed(1)}%
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right text-white/40 tabular-nums">{unitsSold}</td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
