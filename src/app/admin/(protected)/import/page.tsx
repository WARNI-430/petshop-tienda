"use client";
import { useState } from "react";
import { Search, Plus, Loader2, Check, Link as LinkIcon } from "lucide-react";
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
  const [mode, setMode] = useState<"search" | "manual">("manual");

  // Search mode state
  const [query, setQuery] = useState("pet");
  const [results, setResults] = useState<CJProduct[]>([]);
  const [loading, setLoading] = useState(false);
  const [searchError, setSearchError] = useState<string | null>(null);

  // Manual mode state
  const [manualId, setManualId] = useState("");
  const [manualPrice, setManualPrice] = useState("");
  const [manualCost, setManualCost] = useState("");
  const [manualName, setManualName] = useState("");
  const [importing, setImporting] = useState(false);
  const [manualSuccess, setManualSuccess] = useState(false);
  const [manualError, setManualError] = useState<string | null>(null);

  // Search mode
  const [prices, setPrices] = useState<Record<string, string>>({});
  const [importingId, setImportingId] = useState<string | null>(null);
  const [imported, setImported] = useState<Set<string>>(new Set());

  async function search() {
    setLoading(true);
    setSearchError(null);
    try {
      const res = await fetch(`/api/cj/products?q=${encodeURIComponent(query)}`);
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);
      setResults(data.products ?? []);
    } catch (e) {
      setSearchError(e instanceof Error ? e.message : "Error al buscar");
    } finally {
      setLoading(false);
    }
  }

  async function importFromSearch(cjProductId: string) {
    const price = parseFloat(prices[cjProductId] ?? "0");
    if (!price || price <= 0) { alert("Introduce un precio de venta válido."); return; }
    setImportingId(cjProductId);
    try {
      const res = await fetch("/api/cj/import", {
        method: "POST",
        headers: { "Content-Type": "application/json", "x-admin-secret": getCookie("admin_auth") ?? "" },
        body: JSON.stringify({ cjProductId, price }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);
      setImported((prev) => new Set([...prev, cjProductId]));
    } catch (e) {
      alert(e instanceof Error ? e.message : "Error al importar");
    } finally {
      setImportingId(null);
    }
  }

  async function importManual() {
    const id = extractCjId(manualId.trim());
    const price = parseFloat(manualPrice);
    if (!id) { setManualError("ID o URL de producto no válido."); return; }
    if (!manualName.trim()) { setManualError("El nombre del producto es obligatorio."); return; }
    if (!price || price <= 0) { setManualError("Introduce un precio de venta válido."); return; }
    setImporting(true);
    setManualError(null);
    setManualSuccess(false);
    try {
      const res = await fetch("/api/cj/import", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          cjProductId: id,
          price,
          nameEs: manualName.trim(),
          nameEn: manualName.trim(),
          costPrice: manualCost ? parseFloat(manualCost) : undefined,
          skipCjFetch: false,
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);
      setManualSuccess(true);
      setManualId("");
      setManualPrice("");
      setManualCost("");
      setManualName("");
    } catch (e) {
      setManualError(e instanceof Error ? e.message : "Error al importar");
    } finally {
      setImporting(false);
    }
  }

  return (
    <div className="p-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-white">Importar desde CJ</h1>
        <p className="text-white/40 text-sm mt-1">Añade productos de CJ Dropshipping a tu catálogo</p>
      </div>

      {/* Mode toggle */}
      <div className="flex gap-1 mb-8 bg-white/[0.04] border border-white/[0.06] rounded-xl p-1 w-fit">
        <button
          onClick={() => setMode("manual")}
          className={`px-5 py-2 rounded-lg text-sm font-medium transition-all ${
            mode === "manual" ? "bg-indigo-600 text-white shadow" : "text-white/40 hover:text-white/70"
          }`}
        >
          Importar por ID
        </button>
        <button
          onClick={() => setMode("search")}
          className={`px-5 py-2 rounded-lg text-sm font-medium transition-all ${
            mode === "search" ? "bg-indigo-600 text-white shadow" : "text-white/40 hover:text-white/70"
          }`}
        >
          Buscar en CJ
        </button>
      </div>

      {/* MANUAL MODE */}
      {mode === "manual" && (
        <div className="max-w-lg">
          <div className="rounded-xl border border-white/[0.08] bg-white/[0.03] p-6 space-y-5">
            {/* Instructions */}
            <div className="bg-indigo-500/10 border border-indigo-500/20 rounded-lg px-4 py-3">
              <p className="text-indigo-300 text-xs leading-relaxed">
                <span className="font-semibold">Cómo hacerlo:</span> Ve a{" "}
                <span className="font-mono">cjdropshipping.com</span> → busca un producto →
                copia la URL completa o solo el ID del producto y pégalo aquí.
              </p>
            </div>

            {/* ID field */}
            <div>
              <label className="block text-xs font-medium text-white/40 mb-2 uppercase tracking-wider">
                URL o ID del producto CJ
              </label>
              <div className="relative">
                <LinkIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/25" />
                <input
                  value={manualId}
                  onChange={(e) => setManualId(e.target.value)}
                  placeholder="https://cjdropshipping.com/product/...  o  abc123-..."
                  className="w-full bg-white/[0.06] border border-white/[0.08] text-white placeholder-white/20 rounded-xl pl-10 pr-4 py-3 text-sm focus:outline-none focus:border-indigo-500/60 transition-all"
                />
              </div>
            </div>

            {/* Name */}
            <div>
              <label className="block text-xs font-medium text-white/40 mb-2 uppercase tracking-wider">
                Nombre del producto <span className="text-red-400">*</span>
              </label>
              <input
                value={manualName}
                onChange={(e) => setManualName(e.target.value)}
                placeholder="Ej: Comedero interactivo para perros"
                className="w-full bg-white/[0.06] border border-white/[0.08] text-white placeholder-white/20 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-indigo-500/60 transition-all"
              />
            </div>

            {/* Price + Cost */}
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-medium text-white/40 mb-2 uppercase tracking-wider">
                  Precio venta (€) <span className="text-red-400">*</span>
                </label>
                <input
                  type="number" min="0" step="0.01"
                  value={manualPrice}
                  onChange={(e) => setManualPrice(e.target.value)}
                  placeholder="29.99"
                  className="w-full bg-white/[0.06] border border-white/[0.08] text-white placeholder-white/20 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-indigo-500/60 transition-all"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-white/40 mb-2 uppercase tracking-wider">
                  Coste CJ ($) <span className="text-white/20 normal-case">(opcional)</span>
                </label>
                <input
                  type="number" min="0" step="0.01"
                  value={manualCost}
                  onChange={(e) => setManualCost(e.target.value)}
                  placeholder="8.50"
                  className="w-full bg-white/[0.06] border border-white/[0.08] text-white placeholder-white/20 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-indigo-500/60 transition-all"
                />
              </div>
            </div>

            {/* Error */}
            {manualError && (
              <div className="bg-red-500/10 border border-red-500/20 rounded-lg px-4 py-3">
                <p className="text-red-400 text-sm">{manualError}</p>
              </div>
            )}

            {/* Success */}
            {manualSuccess && (
              <div className="bg-emerald-500/10 border border-emerald-500/20 rounded-lg px-4 py-3 flex items-center gap-2">
                <Check className="w-4 h-4 text-emerald-400 shrink-0" />
                <p className="text-emerald-400 text-sm">Producto importado correctamente. Ya aparece en tu catálogo.</p>
              </div>
            )}

            {/* Button */}
            <button
              onClick={importManual}
              disabled={importing || !manualId || !manualPrice || !manualName}
              className="w-full bg-indigo-600 hover:bg-indigo-500 disabled:opacity-40 disabled:cursor-not-allowed text-white font-semibold py-3 rounded-xl transition-colors text-sm flex items-center justify-center gap-2"
            >
              {importing ? (
                <><Loader2 className="w-4 h-4 animate-spin" /> Importando...</>
              ) : (
                <><Plus className="w-4 h-4" /> Importar producto</>
              )}
            </button>
          </div>
        </div>
      )}

      {/* SEARCH MODE */}
      {mode === "search" && (
        <>
          <div className="flex gap-3 mb-8">
            <div className="flex-1 relative">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-white/30" />
              <input
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && search()}
                placeholder="Buscar en CJ (ej: pet feeder, dog bed, cat toy...)"
                className="w-full bg-white/[0.04] border border-white/[0.08] text-white placeholder-white/25 rounded-xl pl-11 pr-4 py-3 text-sm focus:outline-none focus:border-indigo-500/50 transition-all"
              />
            </div>
            <button
              onClick={search}
              disabled={loading}
              className="bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 text-white px-6 py-3 rounded-xl text-sm font-medium transition-colors flex items-center gap-2"
            >
              {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Search className="w-4 h-4" />}
              Buscar
            </button>
          </div>

          {searchError && (
            <div className="mb-6 bg-red-500/10 border border-red-500/20 rounded-xl px-4 py-3">
              <p className="text-red-400 text-sm">{searchError}</p>
              <p className="text-white/30 text-xs mt-1">Si la API de CJ no está disponible, usa el modo "Importar por ID".</p>
            </div>
          )}

          {results.length === 0 && !loading && (
            <div className="text-center py-24">
              <div className="w-16 h-16 rounded-2xl bg-white/[0.04] border border-white/[0.06] flex items-center justify-center mx-auto mb-4 text-2xl">🔍</div>
              <p className="text-white/25 text-sm">Busca productos de CJ para importarlos al catálogo</p>
            </div>
          )}

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {results.map((p) => {
              const isImported = imported.has(p.pid);
              const isImporting = importingId === p.pid;
              return (
                <div key={p.pid} className="rounded-xl border border-white/[0.06] bg-white/[0.02] overflow-hidden hover:border-white/[0.12] transition-all">
                  <div className="relative aspect-square bg-white/[0.03]">
                    {p.productImage && (
                      <Image src={p.productImage} alt={p.productNameEn ?? p.productName} fill className="object-cover" sizes="25vw" />
                    )}
                  </div>
                  <div className="p-4">
                    <p className="text-xs font-medium text-white/75 line-clamp-2 leading-relaxed mb-3">{p.productNameEn || p.productName}</p>
                    <div className="flex items-center justify-between mb-3">
                      <span className="text-[11px] text-white/30">Coste CJ</span>
                      <span className="text-xs font-semibold text-amber-400">{p.sellPrice} $</span>
                    </div>
                    <div className="flex gap-2">
                      <input
                        type="number" min="0" step="0.01" placeholder="Precio €"
                        value={prices[p.pid] ?? ""}
                        onChange={(e) => setPrices((prev) => ({ ...prev, [p.pid]: e.target.value }))}
                        className="w-24 bg-white/[0.06] border border-white/[0.08] text-white placeholder-white/25 rounded-lg px-3 py-1.5 text-xs focus:outline-none focus:border-indigo-500/50 transition-colors"
                      />
                      <button
                        onClick={() => importFromSearch(p.pid)}
                        disabled={isImporting || isImported}
                        className={`flex-1 flex items-center justify-center gap-1.5 rounded-lg py-1.5 text-xs font-medium transition-all ${
                          isImported ? "bg-emerald-500/15 text-emerald-400 border border-emerald-500/20" : "bg-indigo-600 hover:bg-indigo-500 text-white disabled:opacity-50"
                        }`}
                      >
                        {isImporting ? <Loader2 className="w-3 h-3 animate-spin" /> : isImported ? <><Check className="w-3 h-3" /> Importado</> : <><Plus className="w-3 h-3" /> Importar</>}
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </>
      )}
    </div>
  );
}

function extractCjId(input: string): string | null {
  // URL format: https://cjdropshipping.com/product/name-p-XXXXXXXX.html or with UUID
  const uuidMatch = input.match(/[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}/i);
  if (uuidMatch) return uuidMatch[0];
  // Short ID at end of URL: -p-XXXXXXXX.html
  const shortMatch = input.match(/[-p-]([A-Za-z0-9]{8,})\.html/);
  if (shortMatch) return shortMatch[1];
  // Raw ID (no URL)
  if (/^[A-Za-z0-9_-]{8,}$/.test(input)) return input;
  return null;
}

function getCookie(name: string) {
  const match = document.cookie.match(new RegExp(`(^| )${name}=([^;]+)`));
  return match ? match[2] : null;
}
