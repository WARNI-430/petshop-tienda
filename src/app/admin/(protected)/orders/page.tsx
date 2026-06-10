import { db } from "@/lib/db";

const STATUS_STYLE: Record<string, string> = {
  PENDING: "bg-white/10 text-white/50",
  PAID: "bg-indigo-500/20 text-indigo-300",
  PROCESSING: "bg-amber-500/20 text-amber-300",
  SHIPPED: "bg-violet-500/20 text-violet-300",
  DELIVERED: "bg-emerald-500/20 text-emerald-300",
  CANCELLED: "bg-red-500/20 text-red-300",
  REFUNDED: "bg-orange-500/20 text-orange-300",
};

const STATUS_LABELS: Record<string, string> = {
  PAID: "Pagado",
  PROCESSING: "Procesando",
  SHIPPED: "Enviado",
  DELIVERED: "Entregado",
  CANCELLED: "Cancelado",
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

  const statuses = Object.keys(STATUS_LABELS);

  return (
    <div className="p-8">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-white">Pedidos</h1>
        <p className="text-white/40 text-sm mt-1">{orders.length} pedidos encontrados</p>
      </div>

      {/* Filtros */}
      <div className="flex gap-2 mb-6 flex-wrap">
        <a
          href="/admin/orders"
          className={`px-4 py-1.5 rounded-lg text-xs font-medium transition-all ${
            !status
              ? "bg-indigo-600 text-white"
              : "bg-white/[0.04] text-white/50 hover:bg-white/[0.08] hover:text-white/70 border border-white/[0.06]"
          }`}
        >
          Todos
        </a>
        {statuses.map((s) => (
          <a
            key={s}
            href={`/admin/orders?status=${s}`}
            className={`px-4 py-1.5 rounded-lg text-xs font-medium transition-all ${
              status === s
                ? "bg-indigo-600 text-white"
                : "bg-white/[0.04] text-white/50 hover:bg-white/[0.08] hover:text-white/70 border border-white/[0.06]"
            }`}
          >
            {STATUS_LABELS[s]}
          </a>
        ))}
      </div>

      <div className="rounded-xl border border-white/[0.06] bg-white/[0.02] overflow-hidden">
        {orders.length === 0 ? (
          <div className="px-6 py-16 text-center">
            <p className="text-white/20 text-sm">No hay pedidos.</p>
          </div>
        ) : (
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-white/[0.06]">
                <th className="px-6 py-3 text-left text-[11px] font-medium text-white/30 uppercase tracking-wider">ID</th>
                <th className="px-6 py-3 text-left text-[11px] font-medium text-white/30 uppercase tracking-wider">Cliente</th>
                <th className="px-6 py-3 text-left text-[11px] font-medium text-white/30 uppercase tracking-wider">Productos</th>
                <th className="px-6 py-3 text-left text-[11px] font-medium text-white/30 uppercase tracking-wider">Estado</th>
                <th className="px-6 py-3 text-left text-[11px] font-medium text-white/30 uppercase tracking-wider">Tracking</th>
                <th className="px-6 py-3 text-right text-[11px] font-medium text-white/30 uppercase tracking-wider">Total</th>
                <th className="px-6 py-3 text-left text-[11px] font-medium text-white/30 uppercase tracking-wider">Fecha</th>
              </tr>
            </thead>
            <tbody>
              {orders.map((o) => (
                <tr key={o.id} className="border-b border-white/[0.03] hover:bg-white/[0.02] transition-colors">
                  <td className="px-6 py-4 font-mono text-xs text-white/40">{o.id.slice(-8).toUpperCase()}</td>
                  <td className="px-6 py-4">
                    <p className="font-medium text-white/80">{o.customerName}</p>
                    <p className="text-[11px] text-white/30 mt-0.5">{o.customerEmail}</p>
                  </td>
                  <td className="px-6 py-4 text-xs text-white/35 max-w-[180px] truncate">
                    {o.items.map((i) => `${i.product.nameEs} x${i.qty}`).join(", ")}
                  </td>
                  <td className="px-6 py-4">
                    <span className={`px-2.5 py-1 rounded-md text-[11px] font-medium ${STATUS_STYLE[o.status] ?? "bg-white/10 text-white/40"}`}>
                      {o.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 font-mono text-xs text-white/30">
                    {o.trackingCode ?? "—"}
                  </td>
                  <td className="px-6 py-4 text-right font-semibold text-white tabular-nums">{o.total.toFixed(2)} €</td>
                  <td className="px-6 py-4 text-white/30 text-xs">{new Date(o.createdAt).toLocaleDateString("es-ES")}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
