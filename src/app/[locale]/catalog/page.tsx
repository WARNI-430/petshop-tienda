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
    <div className="max-w-6xl mx-auto px-6 py-12">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-10">
        <div>
          <h1 className="text-3xl font-bold text-white">
            {locale === "es" ? "Catálogo" : "Catalog"}
          </h1>
          <p className="text-white/30 text-sm mt-1">{total} {locale === "es" ? "productos" : "products"}</p>
        </div>
        <form className="flex gap-2">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/25" />
            <input
              name="q"
              defaultValue={q}
              placeholder={locale === "es" ? "Buscar productos..." : "Search products..."}
              className="bg-white/[0.04] border border-white/[0.08] text-white placeholder-white/25 rounded-xl pl-10 pr-4 py-2.5 text-sm w-56 focus:outline-none focus:border-indigo-500/50 transition-all"
            />
          </div>
          <button
            type="submit"
            className="bg-indigo-600 hover:bg-indigo-500 text-white px-5 py-2.5 rounded-xl text-sm font-medium transition-colors"
          >
            {locale === "es" ? "Buscar" : "Search"}
          </button>
        </form>
      </div>

      {products.length === 0 ? (
        <div className="text-center py-32">
          <p className="text-white/20 text-sm">
            {locale === "es" ? "No hay productos disponibles." : "No products available."}
          </p>
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {products.map((p) => (
              <ProductCard key={p.id} product={p} locale={locale} />
            ))}
          </div>

          {totalPages > 1 && (
            <div className="flex justify-center gap-2 mt-12">
              {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
                <a
                  key={p}
                  href={`?page=${p}${q ? `&q=${q}` : ""}`}
                  className={`w-9 h-9 flex items-center justify-center rounded-lg text-sm font-medium transition-all ${
                    p === currentPage
                      ? "bg-indigo-600 text-white"
                      : "border border-white/[0.08] text-white/40 hover:text-white hover:border-white/20"
                  }`}
                >
                  {p}
                </a>
              ))}
            </div>
          )}
        </>
      )}
    </div>
  );
}
