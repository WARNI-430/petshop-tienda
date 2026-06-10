import { db } from "@/lib/db";

const STATUS_COLORS: Record<string, string> = {
  PENDING: "bg-gray-100 text-gray-600",
  PAID: "bg-blue-100 text-blue-700",
  PROCESSING: "bg-yellow-100 text-yellow-700",
  SHIPPED: "bg-purple-100 text-purple-700",
  DELIVERED: "bg-green-100 text-green-700",
  CANCELLED: "bg-red-100 text-red-700",
  REFUNDED: "bg-orange-100 text-orange-700",
};

export default async function AdminOrders({
  searchParams,
}: {
  searchParams: Promise<{ status?: string }>;
}) {
  const { status } = await searchParams;

  const orders = await db.order.findMany({
    where: status ? { status: status as never } : undefined,
    orderBy: { createdAt: "desc" },
    include: { items: { include: { product: true } } },
  });

  const statuses = ["PAID", "PROCESSING", "SHIPPED", "DELIVERED", "CANCELLED"];

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-6">Pedidos</h1>

      {/* Filtros */}
      <div className="flex gap-2 mb-6 flex-wrap">
        <a
          href="/admin/orders"
          className={`px-3 py-1.5 rounded-lg text-sm font-medium transition ${!status ? "bg-black text-white" : "bg-white border border-gray-200 hover:bg-gray-50"}`}
        >
          Todos
        </a>
        {statuses.map((s) => (
          <a
            key={s}
            href={`/admin/orders?status=${s}`}
            className={`px-3 py-1.5 rounded-lg text-sm font-medium transition ${status === s ? "bg-black text-white" : "bg-white border border-gray-200 hover:bg-gray-50"}`}
          >
            {s}
          </a>
        ))}
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        {orders.length === 0 ? (
          <p className="px-6 py-12 text-center text-gray-400">No hay pedidos.</p>
        ) : (
          <table className="w-full text-sm">
            <thead className="bg-gray-50 text-gray-500 text-xs uppercase">
              <tr>
                <th className="px-6 py-3 text-left">ID</th>
                <th className="px-6 py-3 text-left">Cliente</th>
                <th className="px-6 py-3 text-left">Productos</th>
                <th className="px-6 py-3 text-left">Estado</th>
                <th className="px-6 py-3 text-left">Tracking</th>
                <th className="px-6 py-3 text-right">Total</th>
                <th className="px-6 py-3 text-left">Fecha</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {orders.map((o) => (
                <tr key={o.id} className="hover:bg-gray-50">
                  <td className="px-6 py-3 font-mono text-xs">{o.id.slice(-8).toUpperCase()}</td>
                  <td className="px-6 py-3">
                    <p className="font-medium">{o.customerName}</p>
                    <p className="text-xs text-gray-400">{o.customerEmail}</p>
                  </td>
                  <td className="px-6 py-3 text-xs text-gray-500">
                    {o.items.map((i) => `${i.product.nameEs} x${i.qty}`).join(", ")}
                  </td>
                  <td className="px-6 py-3">
                    <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${STATUS_COLORS[o.status] ?? ""}`}>
                      {o.status}
                    </span>
                  </td>
                  <td className="px-6 py-3 font-mono text-xs text-gray-500">
                    {o.trackingCode ?? "—"}
                  </td>
                  <td className="px-6 py-3 text-right font-medium">{o.total.toFixed(2)} €</td>
                  <td className="px-6 py-3 text-gray-500 text-xs">
                    {new Date(o.createdAt).toLocaleDateString("es-ES")}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
