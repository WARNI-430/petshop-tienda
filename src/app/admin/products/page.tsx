import { db } from "@/lib/db";
import Link from "next/link";
import ToggleProductButton from "./ToggleProductButton";

export default async function AdminProducts() {
  const products = await db.product.findMany({ orderBy: { createdAt: "desc" } });

  return (
    <div className="p-8">
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-2xl font-bold">Productos</h1>
        <Link
          href="/admin/import"
          className="bg-black text-white px-4 py-2 rounded-lg text-sm hover:bg-gray-800 transition"
        >
          + Importar desde CJ
        </Link>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        {products.length === 0 ? (
          <p className="px-6 py-12 text-center text-gray-400">
            No hay productos. <Link href="/admin/import" className="underline">Importa el primero desde CJ.</Link>
          </p>
        ) : (
          <table className="w-full text-sm">
            <thead className="bg-gray-50 text-gray-500 text-xs uppercase">
              <tr>
                <th className="px-6 py-3 text-left">Producto</th>
                <th className="px-6 py-3 text-right">Coste CJ</th>
                <th className="px-6 py-3 text-right">Precio venta</th>
                <th className="px-6 py-3 text-right">Margen</th>
                <th className="px-6 py-3 text-center">Stock</th>
                <th className="px-6 py-3 text-center">Activo</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {products.map((p) => {
                const margin = p.price > 0 ? ((p.price - p.costPrice) / p.price) * 100 : 0;
                return (
                  <tr key={p.id} className="hover:bg-gray-50">
                    <td className="px-6 py-3">
                      <p className="font-medium">{p.nameEs}</p>
                      <p className="text-xs text-gray-400 font-mono">{p.cjProductId}</p>
                    </td>
                    <td className="px-6 py-3 text-right text-gray-500">{p.costPrice.toFixed(2)} €</td>
                    <td className="px-6 py-3 text-right font-medium">{p.price.toFixed(2)} €</td>
                    <td className="px-6 py-3 text-right">
                      <span className={`font-medium ${margin >= 40 ? "text-green-600" : margin >= 20 ? "text-yellow-600" : "text-red-500"}`}>
                        {margin.toFixed(0)}%
                      </span>
                    </td>
                    <td className="px-6 py-3 text-center">{p.stock}</td>
                    <td className="px-6 py-3 text-center">
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
