import Link from "next/link";
import Image from "next/image";
import type { Product } from "@prisma/client";
import AddToCartButton from "./AddToCartButton";

interface Props {
  product: Product;
  locale: string;
}

export default function ProductCard({ product, locale }: Props) {
  const name = locale === "es" ? product.nameEs : product.nameEn;
  const image = product.images[0] ?? "/placeholder.png";

  return (
    <div className="group relative rounded-2xl overflow-hidden border border-white/[0.07] bg-[#0d0d1a] hover:border-violet-500/30 transition-all duration-300 hover:shadow-xl hover:shadow-violet-950/30">
      {/* Image */}
      <Link href={`/${locale}/product/${product.slug}`}>
        <div className="relative aspect-square overflow-hidden bg-[#0a0a14]">
          <Image
            src={image}
            alt={name}
            fill
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
            className="object-cover transition-transform duration-500 group-hover:scale-105"
          />
          {/* Gradient overlay on hover */}
          <div className="absolute inset-0 bg-gradient-to-t from-[#0d0d1a]/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

          {/* Stock badge */}
          {product.stock <= 5 && product.stock > 0 && (
            <div className="absolute top-3 left-3 bg-amber-500/90 backdrop-blur-sm text-[10px] font-bold text-black px-2 py-0.5 rounded-full">
              ¡Últimas {product.stock}!
            </div>
          )}
          {product.stock === 0 && (
            <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
              <span className="text-white/60 text-xs font-medium border border-white/20 px-3 py-1 rounded-full backdrop-blur-sm">
                {locale === "es" ? "Sin stock" : "Out of stock"}
              </span>
            </div>
          )}
        </div>
      </Link>

      {/* Info */}
      <div className="p-4">
        <Link href={`/${locale}/product/${product.slug}`}>
          <h3 className="text-[13px] font-medium text-white/80 hover:text-white transition-colors leading-snug line-clamp-2 mb-3">
            {name}
          </h3>
        </Link>

        <div className="flex items-center justify-between gap-2">
          <div>
            <span className="text-lg font-bold text-white tabular-nums">
              {product.price.toFixed(2)}
            </span>
            <span className="text-xs text-white/30 ml-1">€</span>
          </div>
          {product.stock > 0 && <AddToCartButton product={product} locale={locale} compact />}
        </div>
      </div>
    </div>
  );
}
