"use client";
import { useState } from "react";
import { Search, Plus, Loader2 } from "lucide-react";
import Image from "next/image";

interface CJProduct {
  pid: string;
  productName: string;
  productNameEn: string;
  sellPrice: string;
  productImage: string;
  productWeight: string;
}

export default function AdminImport() {
  const [query, setQuery] = useState("pet");
  const [results, setResults] = useState<CJProduct[]>([]);
  const [loading, setLoading] = useState(false);
  const [importing, setImporting] = useState<string | null>(null);
  const [prices, setPrices] = useState<Record<string, string>>({});
  const [imported, setImported] = useState<Set<string>>(new Set());
  const [error, setError] = useState<string | null>(null);

  async function search() {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch(`/api/cj/products?q=${encodeURIComponent(query)}`);
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);
      setResults(data.products ?? []);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Error al buscar");
    } finally {
      setLoading(false);
    }
  }

  async function importProduct(cjProductId: string) {
    const price = parseFloat(prices[cjProductId] ?? "0");
    if (!price || price <= 0) {
      alert("Introduce un precio de venta válido.");
      return;
    }
    setImporting(cjProductId);
    try {
      const res = await fetch("/api/cj/import", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-admin-secret": getCookie("admin_auth") ?? "",
        },
        body: JSON.stringify({ cjProductId, price }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);
      setImported((prev) => new Set([...prev, cjProductId]));
    } catch (e) {
      alert(e instanceof Error ? e.message : "Error al importar");
    } finally {
      setImporting(null);
    }
  }

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-6">Importar productos desde CJ</h1>

      <div className="flex gap-3 mb-8">
        <input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && search()}
          placeholder="Buscar en CJ (ej: pet feeder, dog bed...)"
          className="flex-1 border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-black"
        />
        <button
          onClick={search}
          disabled={loading}
          className="bg-black text-white px-5 py-2 rounded-lg hover:bg-gray-800 transition flex items-center gap-2 disabled:opacity-50"
        >
          {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Search className="w-4 h-4" />}
          Buscar
        </button>
      </div>

      {error && <p className="text-red-500 text-sm mb-4">{error}</p>}

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {results.map((p) => (
          <div key={p.pid} className="bg-white rounded-xl border border-gray-200 overflow-hidden">
            <div className="relative aspect-square bg-gray-50">
              {p.productImage && (
                <Image
                  src={p.productImage}
                  alt={p.productNameEn ?? p.productName}
                  fill
                  className="object-cover"
                  sizes="(max-width: 640px) 50vw, 25vw"
                />
              )}
            </div>
            <div className="p-3">
              <p className="text-xs font-medium line-clamp-2 mb-2">
                {p.productNameEn || p.productName}
              </p>
              <p className="text-xs text-gray-500 mb-3">
                Coste CJ: <span className="font-semibold text-gray-800">{p.sellPrice} $</span>
              </p>
              <div className="flex gap-2 items-center">
                <input
                  type="number"
                  min="0"
                  step="0.01"
                  placeholder="Precio €"
                  value={prices[p.pid] ?? ""}
                  onChange={(e) => setPrices((prev) => ({ ...prev, [p.pid]: e.target.value }))}
                  className="w-24 border border-gray-300 rounded px-2 py-1 text-xs focus:outline-none focus:ring-1 focus:ring-black"
                />
                <button
                  onClick={() => importProduct(p.pid)}
                  disabled={importing === p.pid || imported.has(p.pid)}
                  className="flex-1 flex items-center justify-center gap-1 bg-black text-white rounded py-1.5 text-xs hover:bg-gray-800 transition disabled:opacity-50"
                >
                  {importing === p.pid ? (
                    <Loader2 className="w-3 h-3 animate-spin" />
                  ) : imported.has(p.pid) ? (
                    "✓ Importado"
                  ) : (
                    <><Plus className="w-3 h-3" /> Importar</>
                  )}
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {results.length === 0 && !loading && (
        <p className="text-center text-gray-400 py-16">
          Busca productos de CJ para importarlos al catálogo.
        </p>
      )}
    </div>
  );
}

function getCookie(name: string) {
  const match = document.cookie.match(new RegExp(`(^| )${name}=([^;]+)`));
  return match ? match[2] : null;
}
