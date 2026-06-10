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
      <section className="relative overflow-hidden px-6 py-28 text-center">
        {/* Background glow */}
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[500px] bg-indigo-600/10 rounded-full blur-3xl" />
        </div>

        <HeroContent locale={locale} />
      </section>

      {/* Featured products */}
      {products.length > 0 && (
        <section className="max-w-6xl mx-auto px-6 py-16">
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-xl font-bold text-white">
              {locale === "es" ? "Productos destacados" : "Featured products"}
            </h2>
            <Link
              href={`/${locale}/catalog`}
              className="text-sm text-indigo-400 hover:text-indigo-300 transition-colors"
            >
              {locale === "es" ? "Ver todos →" : "View all →"}
            </Link>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {products.map((p) => (
              <ProductCard key={p.id} product={p} locale={locale} />
            ))}
          </div>
        </section>
      )}

      {/* Categories */}
      <section className="border-t border-white/[0.04] py-16 px-6">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-xl font-bold text-white mb-8 text-center">
            {locale === "es" ? "Categorías" : "Categories"}
          </h2>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {[
              { emoji: "🐾", label: locale === "es" ? "Comederos" : "Feeders" },
              { emoji: "🛁", label: locale === "es" ? "Aseo" : "Grooming" },
              { emoji: "🛏️", label: locale === "es" ? "Descanso" : "Rest" },
              { emoji: "🚶", label: locale === "es" ? "Paseos" : "Walking" },
            ].map((cat) => (
              <Link
                key={cat.label}
                href={`/${locale}/catalog`}
                className="group rounded-2xl border border-white/[0.06] bg-white/[0.02] p-6 text-center hover:border-indigo-500/30 hover:bg-indigo-500/5 transition-all duration-200"
              >
                <div className="text-3xl mb-3">{cat.emoji}</div>
                <div className="text-sm font-medium text-white/60 group-hover:text-white/90 transition-colors">{cat.label}</div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Trust badges */}
      <section className="border-t border-white/[0.04] py-12 px-6">
        <div className="max-w-4xl mx-auto grid grid-cols-1 sm:grid-cols-3 gap-6 text-center">
          {[
            { icon: "🚚", title: locale === "es" ? "Envío rápido" : "Fast shipping", desc: locale === "es" ? "Entrega en 3–7 días" : "3–7 day delivery" },
            { icon: "🔒", title: locale === "es" ? "Pago seguro" : "Secure payment", desc: locale === "es" ? "Cifrado SSL con Stripe" : "SSL encrypted with Stripe" },
            { icon: "↩️", title: locale === "es" ? "Devoluciones" : "Returns", desc: locale === "es" ? "14 días sin preguntas" : "14 days no questions" },
          ].map((b) => (
            <div key={b.title} className="flex flex-col items-center gap-2">
              <span className="text-2xl">{b.icon}</span>
              <p className="text-sm font-semibold text-white/70">{b.title}</p>
              <p className="text-xs text-white/30">{b.desc}</p>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}

function HeroContent({ locale }: { locale: string }) {
  const t = useTranslations("home");
  return (
    <div className="relative">
      <div className="inline-flex items-center gap-2 bg-indigo-500/10 border border-indigo-500/20 rounded-full px-4 py-1.5 text-xs text-indigo-300 mb-6">
        <span className="w-1.5 h-1.5 rounded-full bg-indigo-400 animate-pulse" />
        {locale === "es" ? "Envío gratis en pedidos +50€" : "Free shipping on orders +€50"}
      </div>
      <h1 className="text-5xl sm:text-6xl font-bold mb-5 text-white leading-tight tracking-tight">
        {t("hero_title")}
      </h1>
      <p className="text-lg text-white/40 mb-10 max-w-lg mx-auto leading-relaxed">
        {t("hero_subtitle")}
      </p>
      <Link
        href={`/${locale}/catalog`}
        className="inline-flex items-center gap-2 bg-indigo-600 hover:bg-indigo-500 text-white px-8 py-3.5 rounded-xl font-semibold transition-colors text-sm"
      >
        {t("cta")}
        <span>→</span>
      </Link>
    </div>
  );
}
