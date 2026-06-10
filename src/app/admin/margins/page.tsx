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

  // Calcular coste total de pedidos pagados
  const paidItems = await db.orderItem.findMany({
    where: { order: { status: { in: ["PAID", "PROCESSING", "SHIPPED", "DELIVERED"] } } },
    include: { product: true },
  });

  const totalCost = paidItems.reduce((acc, i) => acc + i.product.costPrice * i.qty, 0);
  const revenue = totalRevenue._sum.total ?? 0;
  const grossProfit = revenue - totalCost;
  const globalMargin = revenue > 0 ? (grossProfit / revenue) * 100 : 0;

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-8">Márgenes</h1>

      {/* Resumen global */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-10">
        {[
          { label: "Ingresos totales", value: `${revenue.toFixed(2)} €`, color: "text-green-600" },
          { label: "Coste total (CJ)", value: `${totalCost.toFixed(2)} €`, color: "text-red-500" },
          { label: "Beneficio bruto", value: `${grossProfit.toFixed(2)} € (${globalMargin.toFixed(1)}%)`, color: grossProfit >= 0 ? "text-green-600" : "text-red-500" },
        ].map((s) => (
          <div key={s.label} className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
            <p className="text-sm text-gray-500 mb-1">{s.label}</p>
            <p className={`text-2xl font-bold ${s.color}`}>{s.value}</p>
          </div>
        ))}
      </div>

      {/* Margen por producto */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-100">
          <h2 className="font-semibold">Margen por producto</h2>
        </div>
        <table className="w-full text-sm">
          <thead className="bg-gray-50 text-gray-500 text-xs uppercase">
            <tr>
              <th className="px-6 py-3 text-left">Producto</th>
              <th className="px-6 py-3 text-right">Coste CJ</th>
              <th className="px-6 py-3 text-right">Precio venta</th>
              <th className="px-6 py-3 text-right">Margen €</th>
              <th className="px-6 py-3 text-right">Margen %</th>
              <th className="px-6 py-3 text-right">Unidades vendidas</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {products.map((p) => {
              const marginEur = p.price - p.costPrice;
              const marginPct = p.price > 0 ? (marginEur / p.price) * 100 : 0;
              const unitsSold = p.orderItems.reduce((acc, i) => acc + i.qty, 0);
              return (
                <tr key={p.id} className="hover:bg-gray-50">
                  <td className="px-6 py-3 font-medium">{p.nameEs}</td>
                  <td className="px-6 py-3 text-right text-gray-500">{p.costPrice.toFixed(2)} €</td>
                  <td className="px-6 py-3 text-right">{p.price.toFixed(2)} €</td>
                  <td className="px-6 py-3 text-right font-medium">{marginEur.toFixed(2)} €</td>
                  <td className="px-6 py-3 text-right">
                    <span className={`font-bold ${marginPct >= 40 ? "text-green-600" : marginPct >= 20 ? "text-yellow-600" : "text-red-500"}`}>
                      {marginPct.toFixed(1)}%
                    </span>
                  </td>
                  <td className="px-6 py-3 text-right text-gray-500">{unitsSold}</td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
