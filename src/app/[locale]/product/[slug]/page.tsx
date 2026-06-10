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
    <div className="max-w-5xl mx-auto px-4 py-12">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
        {/* Imágenes */}
        <div className="space-y-4">
          <div className="relative aspect-square rounded-xl overflow-hidden bg-gray-50">
            <Image src={mainImage} alt={name} fill className="object-cover" sizes="(max-width: 768px) 100vw, 50vw" />
          </div>
          {product.images.length > 1 && (
            <div className="flex gap-3 overflow-x-auto pb-2">
              {product.images.map((img, i) => (
                <div key={i} className="relative w-20 h-20 shrink-0 rounded-lg overflow-hidden bg-gray-50">
                  <Image src={img} alt={`${name} ${i + 1}`} fill className="object-cover" sizes="80px" />
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Info */}
        <div className="flex flex-col">
          <h1 className="text-3xl font-bold mb-4">{name}</h1>
          <p className="text-4xl font-bold mb-6">{product.price.toFixed(2)} €</p>
          <p className="text-gray-600 leading-relaxed mb-8">{desc}</p>

          <div className="flex items-center gap-4">
            <AddToCartButton product={product} locale={locale} />
            {product.stock > 0 ? (
              <span className="text-sm text-green-600">
                {locale === "es" ? "En stock" : "In stock"}
              </span>
            ) : (
              <span className="text-sm text-red-500">
                {locale === "es" ? "Sin stock" : "Out of stock"}
              </span>
            )}
          </div>

          <div className="mt-8 pt-8 border-t border-gray-200 text-sm text-gray-500 space-y-1">
            <p>🚚 {locale === "es" ? "Entrega en 3–7 días" : "Delivery in 3–7 days"}</p>
            <p>↩️ {locale === "es" ? "Devoluciones en 14 días" : "14-day returns"}</p>
          </div>
        </div>
      </div>
    </div>
  );
}
