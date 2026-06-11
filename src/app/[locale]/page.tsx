import { getLocale } from "next-intl/server";
import Link from "next/link";
import { db } from "@/lib/db";
import ProductCard from "@/components/ProductCard";
import { ArrowRight, Shield, Truck, RotateCcw, Star } from "lucide-react";

export default async function HomePage() {
  const locale = await getLocale();
  const products = await db.product.findMany({
    where: { active: true },
    orderBy: { createdAt: "desc" },
    take: 4,
  });

  const isEs = locale === "es";

  return (
    <div className="overflow-x-hidden">
      {/* ── HERO ─────────────────────────────────────── */}
      <section className="relative min-h-screen flex items-center justify-center px-5 pt-20">
        {/* Animated background orbs */}
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          <div className="absolute -top-40 left-1/2 -translate-x-1/2 w-[900px] h-[600px] bg-violet-600/8 rounded-full blur-[120px]" />
          <div className="absolute top-1/3 -left-40 w-[500px] h-[500px] bg-indigo-600/6 rounded-full blur-[100px]" />
          <div className="absolute bottom-0 right-0 w-[400px] h-[400px] bg-purple-700/5 rounded-full blur-[80px]" />
          {/* Grid pattern */}
          <div className="absolute inset-0 opacity-[0.02]"
            style={{backgroundImage: "linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)", backgroundSize: "60px 60px"}} />
        </div>

        <div className="relative text-center max-w-4xl mx-auto">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 bg-violet-600/10 border border-violet-500/20 rounded-full px-4 py-1.5 text-xs text-violet-300 mb-8 font-medium">
            <span className="w-1.5 h-1.5 rounded-full bg-violet-400 animate-pulse-glow" />
            {isEs ? "🐾 Envío gratis en pedidos +50€" : "🐾 Free shipping on orders +€50"}
          </div>

          {/* Headline */}
          <h1 className="text-[clamp(2.8rem,8vw,5.5rem)] font-extrabold leading-[1.05] tracking-tight text-white mb-6">
            {isEs ? (
              <>Tu mascota se<br /><span className="gradient-text">merece lo mejor</span></>
            ) : (
              <>Your pet deserves<br /><span className="gradient-text">the very best</span></>
            )}
          </h1>

          <p className="text-[clamp(1rem,2vw,1.2rem)] text-white/40 mb-10 max-w-xl mx-auto leading-relaxed">
            {isEs
              ? "Productos premium para perros y gatos. Calidad garantizada, entrega rápida a tu puerta."
              : "Premium products for dogs and cats. Guaranteed quality, fast delivery to your door."}
          </p>

          {/* CTAs */}
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Link
              href={`/${locale}/catalog`}
              className="inline-flex items-center justify-center gap-2 bg-violet-600 hover:bg-violet-500 text-white px-8 py-4 rounded-2xl font-semibold text-[15px] transition-all duration-200 shadow-2xl shadow-violet-900/40 hover:shadow-violet-700/40 group"
            >
              {isEs ? "Ver catálogo" : "Browse catalog"}
              <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
            </Link>
            <Link
              href={`/${locale}/catalog`}
              className="inline-flex items-center justify-center gap-2 bg-white/[0.05] hover:bg-white/[0.09] border border-white/[0.1] text-white/70 hover:text-white px-8 py-4 rounded-2xl font-semibold text-[15px] transition-all duration-200"
            >
              {isEs ? "Ofertas del día" : "Today's deals"}
            </Link>
          </div>

          {/* Social proof */}
          <div className="flex items-center justify-center gap-6 mt-12 text-xs text-white/25">
            <div className="flex items-center gap-1.5">
              <div className="flex">
                {[...Array(5)].map((_, i) => <Star key={i} className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />)}
              </div>
              <span className="font-medium">4.9/5</span>
            </div>
            <div className="w-px h-4 bg-white/10" />
            <span>{isEs ? "+2.400 clientes felices" : "+2,400 happy customers"}</span>
            <div className="w-px h-4 bg-white/10" />
            <span>{isEs ? "Envío en 24h" : "24h shipping"}</span>
          </div>
        </div>

        {/* Scroll indicator */}
        <div className="absolute bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 text-white/15">
          <div className="w-5 h-8 rounded-full border border-white/15 flex items-start justify-center pt-1.5">
            <div className="w-1 h-2 bg-white/30 rounded-full animate-bounce" />
          </div>
        </div>
      </section>

      {/* ── TRUST STRIP ──────────────────────────────── */}
      <section className="border-y border-white/[0.05] py-5 px-5">
        <div className="max-w-5xl mx-auto">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-0 divide-y sm:divide-y-0 sm:divide-x divide-white/[0.05]">
            {[
              { Icon: Truck, title: isEs ? "Envío rápido" : "Fast shipping", desc: isEs ? "3–7 días a toda España" : "3–7 days nationwide" },
              { Icon: Shield, title: isEs ? "Pago 100% seguro" : "Secure checkout", desc: isEs ? "Cifrado SSL con Stripe" : "SSL encrypted with Stripe" },
              { Icon: RotateCcw, title: isEs ? "Devoluciones fáciles" : "Easy returns", desc: isEs ? "14 días sin preguntas" : "14-day hassle-free" },
            ].map(({ Icon, title, desc }) => (
              <div key={title} className="flex items-center gap-4 px-6 py-4 sm:justify-center">
                <div className="w-9 h-9 rounded-xl bg-violet-600/10 flex items-center justify-center shrink-0">
                  <Icon className="w-4 h-4 text-violet-400" />
                </div>
                <div>
                  <p className="text-[13px] font-semibold text-white/70">{title}</p>
                  <p className="text-[11px] text-white/30">{desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── FEATURED PRODUCTS ────────────────────────── */}
      {products.length > 0 && (
        <section className="max-w-6xl mx-auto px-5 py-20">
          <div className="flex items-end justify-between mb-10">
            <div>
              <p className="text-[11px] font-semibold text-violet-400 uppercase tracking-widest mb-2">
                {isEs ? "Selección especial" : "Special selection"}
              </p>
              <h2 className="text-2xl sm:text-3xl font-bold text-white">
                {isEs ? "Más vendidos" : "Best sellers"}
              </h2>
            </div>
            <Link href={`/${locale}/catalog`} className="flex items-center gap-1.5 text-[13px] text-white/40 hover:text-white/70 transition-colors group">
              {isEs ? "Ver todos" : "See all"}
              <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
            </Link>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {products.map((p) => (
              <ProductCard key={p.id} product={p} locale={locale} />
            ))}
          </div>
        </section>
      )}

      {/* ── CATEGORIES ───────────────────────────────── */}
      <section className="px-5 py-16 bg-gradient-to-b from-transparent via-violet-950/5 to-transparent">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <p className="text-[11px] font-semibold text-violet-400 uppercase tracking-widest mb-2">
              {isEs ? "Navega por sección" : "Browse by section"}
            </p>
            <h2 className="text-2xl sm:text-3xl font-bold text-white">
              {isEs ? "Encuentra lo que buscas" : "Find what you need"}
            </h2>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {[
              { emoji: "🦴", label: isEs ? "Alimentación" : "Food", color: "from-amber-600/15 to-orange-700/10 border-amber-600/20 hover:border-amber-500/40" },
              { emoji: "✂️", label: isEs ? "Aseo & Cuidado" : "Grooming", color: "from-pink-600/15 to-rose-700/10 border-pink-600/20 hover:border-pink-500/40" },
              { emoji: "🛏️", label: isEs ? "Descanso" : "Comfort", color: "from-blue-600/15 to-indigo-700/10 border-blue-600/20 hover:border-blue-500/40" },
              { emoji: "🎾", label: isEs ? "Juguetes" : "Toys", color: "from-emerald-600/15 to-green-700/10 border-emerald-600/20 hover:border-emerald-500/40" },
            ].map((cat) => (
              <Link key={cat.label} href={`/${locale}/catalog`}
                className={`group rounded-2xl border bg-gradient-to-br ${cat.color} p-6 text-center hover:scale-[1.02] transition-all duration-200`}>
                <div className="text-3xl mb-3">{cat.emoji}</div>
                <div className="text-[13px] font-semibold text-white/60 group-hover:text-white/90 transition-colors">
                  {cat.label}
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA BANNER ───────────────────────────────── */}
      <section className="max-w-6xl mx-auto px-5 py-8 mb-8">
        <div className="relative rounded-3xl overflow-hidden border border-violet-500/20 bg-gradient-to-br from-violet-900/30 via-purple-900/20 to-indigo-900/30 p-10 text-center">
          <div className="absolute inset-0 pointer-events-none">
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full bg-violet-600/5 blur-3xl" />
          </div>
          <p className="text-[11px] font-semibold text-violet-400 uppercase tracking-widest mb-3">
            {isEs ? "Oferta limitada" : "Limited offer"}
          </p>
          <h3 className="text-2xl sm:text-3xl font-bold text-white mb-3">
            {isEs ? "Envío gratis en tu primer pedido" : "Free shipping on your first order"}
          </h3>
          <p className="text-white/40 text-sm mb-7">
            {isEs ? "Usa el código BIENVENIDO al finalizar la compra" : "Use code WELCOME at checkout"}
          </p>
          <Link href={`/${locale}/catalog`}
            className="inline-flex items-center gap-2 bg-white text-violet-900 px-8 py-3.5 rounded-xl font-bold text-sm transition-all hover:bg-violet-50 shadow-xl shadow-black/20">
            {isEs ? "Comprar ahora" : "Shop now"}
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </section>
    </div>
  );
}
