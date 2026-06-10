import { useTranslations } from "next-intl";
import { getLocale } from "next-intl/server";
import Link from "next/link";
import { db } from "@/lib/db";
import ProductCard from "@/components/ProductCard";

export default async function HomePage() {
  const locale = await getLocale();
  const products = await db.product.findMany({
    where: { active: true },
    orderBy: { createdAt: "desc" },
    take: 4,
  });

  return (
    <div>
      {/* Hero */}
      <section className="bg-amber-50 py-20 px-4 text-center">
        <HeroContent locale={locale} />
      </section>

      {/* Productos destacados */}
      {products.length > 0 && (
        <section className="max-w-6xl mx-auto px-4 py-16">
          <h2 className="text-2xl font-bold mb-8">
            {locale === "es" ? "Productos destacados" : "Featured products"}
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {products.map((p) => (
              <ProductCard key={p.id} product={p} locale={locale} />
            ))}
          </div>
        </section>
      )}

      {/* Categorías */}
      <section className="bg-gray-50 py-16 px-4">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-2xl font-bold mb-8 text-center">
            {locale === "es" ? "Categorías" : "Categories"}
          </h2>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            {[
              { emoji: "🐾", label: locale === "es" ? "Comederos" : "Feeders" },
              { emoji: "🛁", label: locale === "es" ? "Aseo" : "Grooming" },
              { emoji: "🛏️", label: locale === "es" ? "Descanso" : "Rest" },
              { emoji: "🚶", label: locale === "es" ? "Paseos" : "Walking" },
            ].map((cat) => (
              <Link
                key={cat.label}
                href={`/${locale}/catalog`}
                className="bg-white rounded-xl p-6 text-center hover:shadow-md transition"
              >
                <div className="text-4xl mb-2">{cat.emoji}</div>
                <div className="font-medium">{cat.label}</div>
              </Link>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}

function HeroContent({ locale }: { locale: string }) {
  const t = useTranslations("home");
  return (
    <>
      <h1 className="text-5xl font-bold mb-4 text-gray-900">{t("hero_title")}</h1>
      <p className="text-xl text-gray-600 mb-8 max-w-xl mx-auto">{t("hero_subtitle")}</p>
      <Link
        href={`/${locale}/catalog`}
        className="inline-block bg-black text-white px-8 py-3 rounded-lg hover:bg-gray-800 transition font-medium"
      >
        {t("cta")}
      </Link>
    </>
  );
}
