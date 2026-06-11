import { db } from "@/lib/db";
import { getLocale } from "next-intl/server";
import ProductCard from "@/components/ProductCard";
import { Search } from "lucide-react";

const PAGE_SIZE = 12;

export default async function CatalogPage({
  searchParams,
}: {
  searchParams: Promise<{ page?: string; q?: string }>;
}) {
  const locale = await getLocale();
  const { page = "1", q } = await searchParams;
  const currentPage = Math.max(1, parseInt(page));
  const skip = (currentPage - 1) * PAGE_SIZE;
  const isEs = locale === "es";

  const where = {
    active: true,
    ...(q ? { OR: [
      { nameEs: { contains: q, mode: "insensitive" as const } },
      { nameEn: { contains: q, mode: "insensitive" as const } },
    ]} : {}),
  };

  const [products, total] = await Promise.all([
    db.product.findMany({ where, skip, take: PAGE_SIZE, orderBy: { createdAt: "desc" } }),
    db.product.count({ where }),
  ]);

  const totalPages = Math.ceil(total / PAGE_SIZE);

  return (
    <div className="min-h-screen pt-24">
      <div className="border-b border-white/[0.05] bg-[#0d0d1a]/50 backdrop-blur-sm">
        <div className="max-w-6xl mx-auto px-5 py-8">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-5">
            <div>
              <h1 className="text-2xl sm:text-3xl font-bold text-white tracking-tight">
                {isEs ? "Catálogo" : "Catalog"}
              </h1>
              <p className="text-[13px] text-white/30 mt-1">
                {total} {isEs ? "productos disponibles" : "products available"}
                {q && <span className="text-violet-400 ml-1">&middot; &ldquo;{q}&rdquo;</span>}
              </p>
            </div>
            <form className="flex gap-2">
              <div className="relative">
                <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-white/25" />
                <input
                  name="q"
                  defaultValue={q}
                  placeholder={isEs ? "Buscar productos..." : "Search products..."}
                  className="bg-white/[0.04] border border-white/[0.08] text-white placeholder-white/20 rounded-xl pl-10 pr-4 py-2.5 text-sm w-52 focus:outline-none focus:border-violet-500/50 focus:bg-white/[0.06] transition-all"
                />
              </div>
              <button type="submit" className="bg-violet-600 hover:bg-violet-500 text-white px-5 py-2.5 rounded-xl text-sm font-medium transition-colors">
                {isEs ? "Buscar" : "Search"}
              </button>
              {q && (
                <a href="?" className="flex items-center px-3 py-2.5 rounded-xl text-sm text-white/40 hover:text-white border border-white/[0.08] hover:bg-white/[0.05] transition-all">
                  ✕
                </a>
              )}
            </form>
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-5 py-10">
        {products.length === 0 ? (
          <div className="text-center py-32">
            <div className="text-5xl mb-4">🔍</div>
            <p className="text-white/30 text-sm mb-4">
              {isEs ? "No encontramos productos con ese criterio." : "No products found."}
            </p>
            <a href="?" className="text-violet-400 text-sm hover:text-violet-300 underline underline-offset-4">
              {isEs ? "Ver todos los productos" : "View all products"}
            </a>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
              {products.map((p) => (
                <ProductCard key={p.id} product={p} locale={locale} />
              ))}
            </div>
            {totalPages > 1 && (
              <div className="flex justify-center items-center gap-2 mt-14">
                {currentPage > 1 && (
                  <a href={`?page=${currentPage - 1}${q ? `&q=${q}` : ""}`}
                    className="w-9 h-9 flex items-center justify-center rounded-xl border border-white/[0.08] text-white/40 hover:text-white hover:border-white/20 transition-all text-sm">←</a>
                )}
                {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
                  <a key={p} href={`?page=${p}${q ? `&q=${q}` : ""}`}
                    className={`w-9 h-9 flex items-center justify-center rounded-xl text-sm font-medium transition-all ${
                      p === currentPage
                        ? "bg-violet-600 text-white shadow-lg shadow-violet-900/40"
                        : "border border-white/[0.08] text-white/40 hover:text-white hover:border-white/20"
                    }`}>
                    {p}
                  </a>
                ))}
                {currentPage < totalPages && (
                  <a href={`?page=${currentPage + 1}${q ? `&q=${q}` : ""}`}
                    className="w-9 h-9 flex items-center justify-center rounded-xl border border-white/[0.08] text-white/40 hover:text-white hover:border-white/20 transition-all text-sm">→</a>
                )}
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
