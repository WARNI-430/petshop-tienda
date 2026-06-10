import { db } from "@/lib/db";
import { getLocale } from "next-intl/server";
import ProductCard from "@/components/ProductCard";

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
    ...(q
      ? {
          OR: [
            { nameEs: { contains: q, mode: "insensitive" as const } },
            { nameEn: { contains: q, mode: "insensitive" as const } },
          ],
        }
      : {}),
  };

  const [products, total] = await Promise.all([
    db.product.findMany({ where, skip, take: PAGE_SIZE, orderBy: { createdAt: "desc" } }),
    db.product.count({ where }),
  ]);

  const totalPages = Math.ceil(total / PAGE_SIZE);

  return (
    <div className="max-w-6xl mx-auto px-4 py-12">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
        <h1 className="text-3xl font-bold">
          {locale === "es" ? "Catálogo" : "Catalog"}
        </h1>
        <form className="flex gap-2">
          <input
            name="q"
            defaultValue={q}
            placeholder={locale === "es" ? "Buscar productos..." : "Search products..."}
            className="border border-gray-300 rounded-lg px-3 py-2 text-sm w-56 focus:outline-none focus:ring-2 focus:ring-black"
          />
          <button
            type="submit"
            className="bg-black text-white px-4 py-2 rounded-lg text-sm hover:bg-gray-800 transition"
          >
            {locale === "es" ? "Buscar" : "Search"}
          </button>
        </form>
      </div>

      {products.length === 0 ? (
        <div className="text-center py-24 text-gray-400">
          {locale === "es" ? "No hay productos disponibles." : "No products available."}
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
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
                  className={`w-9 h-9 flex items-center justify-center rounded-lg text-sm font-medium transition ${
                    p === currentPage
                      ? "bg-black text-white"
                      : "border border-gray-300 hover:bg-gray-100"
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
