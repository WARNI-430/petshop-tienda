import { db } from "@/lib/db";
import { getLocale } from "next-intl/server";
import { notFound } from "next/navigation";
import Image from "next/image";
import AddToCartButton from "@/components/AddToCartButton";

export default async function ProductPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const locale = await getLocale();
  const { slug } = await params;

  const product = await db.product.findUnique({ where: { slug, active: true } });
  if (!product) notFound();

  const name = locale === "es" ? product.nameEs : product.nameEn;
  const desc = locale === "es" ? product.descEs : product.descEn;
  const mainImage = product.images[0] ?? "/placeholder.png";

  return (
    <div className="max-w-5xl mx-auto px-6 py-14">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-14">
        {/* Image */}
        <div className="space-y-3">
          <div className="relative aspect-square rounded-2xl overflow-hidden bg-white/[0.03] border border-white/[0.06]">
            <Image src={mainImage} alt={name} fill className="object-cover" sizes="(max-width: 768px) 100vw, 50vw" />
          </div>
          {product.images.length > 1 && (
            <div className="flex gap-2 overflow-x-auto pb-1">
              {product.images.map((img, i) => (
                <div key={i} className="relative w-20 h-20 shrink-0 rounded-xl overflow-hidden bg-white/[0.03] border border-white/[0.06]">
                  <Image src={img} alt={`${name} ${i + 1}`} fill className="object-cover" sizes="80px" />
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Info */}
        <div className="flex flex-col">
          <h1 className="text-3xl font-bold text-white mb-3 leading-tight">{name}</h1>
          <p className="text-4xl font-bold text-white mb-2 tabular-nums">{product.price.toFixed(2)} €</p>

          {product.stock > 0 ? (
            <span className="inline-flex items-center gap-1.5 text-xs text-emerald-400 mb-8">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
              {locale === "es" ? "En stock" : "In stock"}
            </span>
          ) : (
            <span className="inline-flex items-center gap-1.5 text-xs text-red-400 mb-8">
              <span className="w-1.5 h-1.5 rounded-full bg-red-400" />
              {locale === "es" ? "Sin stock" : "Out of stock"}
            </span>
          )}

          {desc && <p className="text-white/40 leading-relaxed mb-8 text-sm">{desc}</p>}

          {/* Add to cart */}
          <div className="mb-10">
            <AddToCartButton product={product} locale={locale} />
          </div>

          {/* Trust */}
          <div className="border-t border-white/[0.06] pt-6 space-y-3">
            {[
              { icon: "🚚", text: locale === "es" ? "Entrega en 3–7 días" : "Delivery in 3–7 days" },
              { icon: "🔒", text: locale === "es" ? "Pago 100% seguro con Stripe" : "100% secure payment with Stripe" },
              { icon: "↩️", text: locale === "es" ? "Devoluciones en 14 días" : "14-day returns" },
            ].map((item) => (
              <div key={item.text} className="flex items-center gap-3 text-sm text-white/35">
                <span className="text-base">{item.icon}</span>
                {item.text}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
