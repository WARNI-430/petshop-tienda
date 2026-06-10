import { db } from "@/lib/db";
import Link from "next/link";
import ToggleProductButton from "./ToggleProductButton";

export default async function AdminProducts() {
  const products = await db.product.findMany({ orderBy: { createdAt: "desc" } });

  return (
    <div className="p-8">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-white">Productos</h1>
          <p className="text-white/40 text-sm mt-1">{products.length} productos en catálogo</p>
        </div>
        <Link
          href="/admin/import"
          className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-500 text-white px-4 py-2.5 rounded-lg text-sm font-medium transition-colors"
        >
          <span className="text-base leading-none">+</span> Importar desde CJ
        </Link>
      </div>

      <div className="rounded-xl border border-white/[0.06] bg-white/[0.02] overflow-hidden">
        {products.length === 0 ? (
          <div className="px-6 py-20 text-center">
            <p className="text-white/20 text-sm">
              No hay productos.{" "}
              <Link href="/admin/import" className="text-indigo-400 hover:text-indigo-300 transition-colors">
                Importa el primero desde CJ.
              </Link>
            </p>
          </div>
        ) : (
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-white/[0.06]">
                <th className="px-6 py-3 text-left text-[11px] font-medium text-white/30 uppercase tracking-wider">Producto</th>
                <th className="px-6 py-3 text-right text-[11px] font-medium text-white/30 uppercase tracking-wider">Coste CJ</th>
                <th className="px-6 py-3 text-right text-[11px] font-medium text-white/30 uppercase tracking-wider">Precio venta</th>
                <th className="px-6 py-3 text-right text-[11px] font-medium text-white/30 uppercase tracking-wider">Margen</th>
                <th className="px-6 py-3 text-center text-[11px] font-medium text-white/30 uppercase tracking-wider">Stock</th>
                <th className="px-6 py-3 text-center text-[11px] font-medium text-white/30 uppercase tracking-wider">Activo</th>
              </tr>
            </thead>
            <tbody>
              {products.map((p) => {
                const margin = p.price > 0 ? ((p.price - p.costPrice) / p.price) * 100 : 0;
                return (
                  <tr key={p.id} className="border-b border-white/[0.03] hover:bg-white/[0.02] transition-colors">
                    <td className="px-6 py-4">
                      <p className="font-medium text-white/80">{p.nameEs}</p>
                      <p className="text-[11px] text-white/25 font-mono mt-0.5">{p.cjProductId}</p>
                    </td>
                    <td className="px-6 py-4 text-right text-white/40 tabular-nums">{p.costPrice.toFixed(2)} €</td>
                    <td className="px-6 py-4 text-right font-semibold text-white tabular-nums">{p.price.toFixed(2)} €</td>
                    <td className="px-6 py-4 text-right">
                      <span
                        className={`inline-block px-2.5 py-1 rounded-md text-[11px] font-semibold ${
                          margin >= 40
                            ? "bg-emerald-500/15 text-emerald-400"
                            : margin >= 20
                            ? "bg-amber-500/15 text-amber-400"
                            : "bg-red-500/15 text-red-400"
                        }`}
                      >
                        {margin.toFixed(0)}%
                      </span>
                    </td>
                    <td className="px-6 py-4 text-center text-white/50 tabular-nums">{p.stock}</td>
                    <td className="px-6 py-4 text-center">
                      <ToggleProductButton id={p.id} active={p.active} />
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
