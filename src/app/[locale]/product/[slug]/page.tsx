import { db } from "@/lib/db";
import { getLocale } from "next-intl/server";
import { notFound } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import AddToCartButton from "@/components/AddToCartButton";
import { Truck, Shield, RotateCcw, ArrowLeft, Star } from "lucide-react";

export default async function ProductPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const locale = await getLocale();
  const { slug } = await params;
  const isEs = locale === "es";

  const product = await db.product.findUnique({ where: { slug, active: true } });
  if (!product) notFound();

  const name = isEs ? product.nameEs : product.nameEn;
  const desc = isEs ? product.descEs : product.descEn;
  const mainImage = product.images[0] ?? "/placeholder.png";

  return (
    <div className="min-h-screen pt-24 pb-16">
      <div className="max-w-6xl mx-auto px-5">
        {/* Breadcrumb */}
        <div className="flex items-center gap-2 mb-8">
          <Link href={`/${locale}/catalog`}
            className="flex items-center gap-1.5 text-[13px] text-white/30 hover:text-white/60 transition-colors">
            <ArrowLeft className="w-3.5 h-3.5" />
            {isEs ? "Catálogo" : "Catalog"}
          </Link>
          <span className="text-white/15">/</span>
          <span className="text-[13px] text-white/50 truncate max-w-[200px]">{name}</span>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-16">
          {/* Images */}
          <div className="space-y-3">
            <div className="relative aspect-square rounded-3xl overflow-hidden bg-[#0d0d1a] border border-white/[0.07]">
              <Image src={mainImage} alt={name} fill className="object-cover" sizes="(max-width: 1024px) 100vw, 50vw" priority />
              {product.stock === 0 && (
                <div className="absolute inset-0 bg-black/60 flex items-center justify-center">
                  <span className="border border-white/20 text-white/60 text-sm px-4 py-2 rounded-full backdrop-blur-sm">
                    {isEs ? "Sin stock" : "Out of stock"}
                  </span>
                </div>
              )}
            </div>
            {product.images.length > 1 && (
              <div className="flex gap-2 overflow-x-auto pb-1">
                {product.images.map((img, i) => (
                  <div key={i} className="relative w-20 h-20 shrink-0 rounded-2xl overflow-hidden bg-[#0d0d1a] border border-white/[0.07]">
                    <Image src={img} alt={`${name} ${i + 1}`} fill className="object-cover" sizes="80px" />
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Info panel */}
          <div className="flex flex-col">
            {/* Stock indicator */}
            <div className="flex items-center gap-2 mb-4">
              {product.stock > 0 ? (
                <span className="inline-flex items-center gap-1.5 text-[12px] text-emerald-400 font-medium">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                  {isEs ? "En stock" : "In stock"}
                  {product.stock <= 10 && <span className="text-emerald-400/60">· {product.stock} {isEs ? "disponibles" : "available"}</span>}
                </span>
              ) : (
                <span className="inline-flex items-center gap-1.5 text-[12px] text-red-400 font-medium">
                  <span className="w-1.5 h-1.5 rounded-full bg-red-400" />
                  {isEs ? "Sin stock" : "Out of stock"}
                </span>
              )}
            </div>

            <h1 className="text-3xl sm:text-4xl font-bold text-white leading-tight mb-4">{name}</h1>

            {/* Fake reviews */}
            <div className="flex items-center gap-2 mb-5">
              <div className="flex">
                {[...Array(5)].map((_, i) => <Star key={i} className="w-4 h-4 fill-amber-400 text-amber-400" />)}
              </div>
              <span className="text-[13px] text-white/35">4.9 · {isEs ? "128 reseñas" : "128 reviews"}</span>
            </div>

            <div className="flex items-baseline gap-2 mb-6">
              <span className="text-4xl font-extrabold text-white tabular-nums">{product.price.toFixed(2)}</span>
              <span className="text-xl text-white/40 font-medium">€</span>
            </div>

            {desc && (
              <p className="text-[14px] text-white/45 leading-relaxed mb-8 border-t border-white/[0.05] pt-6">
                {desc}
              </p>
            )}

            {/* CTA */}
            {product.stock > 0 && (
              <div className="mb-8">
                <AddToCartButton product={product} locale={locale} />
              </div>
            )}

            {/* Trust badges */}
            <div className="space-y-3 border-t border-white/[0.05] pt-6">
              {[
                { Icon: Truck, text: isEs ? "Entrega estimada en 3–7 días laborables" : "Estimated delivery 3–7 business days" },
                { Icon: Shield, text: isEs ? "Pago 100% seguro con Stripe" : "100% secure payment with Stripe" },
                { Icon: RotateCcw, text: isEs ? "Devolución gratuita en 14 días" : "Free returns within 14 days" },
              ].map(({ Icon, text }) => (
                <div key={text} className="flex items-center gap-3 text-[13px] text-white/35">
                  <Icon className="w-4 h-4 text-violet-400/70 shrink-0" />
                  {text}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
