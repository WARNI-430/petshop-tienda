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
    <div className="group rounded-2xl border border-white/[0.06] bg-white/[0.02] overflow-hidden hover:border-white/[0.12] hover:bg-white/[0.04] transition-all duration-300">
      <Link href={`/${locale}/product/${product.slug}`}>
        <div className="relative aspect-square bg-white/[0.03] overflow-hidden">
          <Image
            src={image}
            alt={name}
            fill
            className="object-cover group-hover:scale-105 transition-transform duration-500"
            sizes="(max-width: 640px) 50vw, 25vw"
          />
        </div>
      </Link>
      <div className="p-4">
        <Link href={`/${locale}/product/${product.slug}`}>
          <h3 className="font-medium text-sm text-white/75 leading-snug mb-3 line-clamp-2 hover:text-white transition-colors">
            {name}
          </h3>
        </Link>
        <div className="flex items-center justify-between">
          <span className="font-bold text-white tabular-nums">{product.price.toFixed(2)} €</span>
          <AddToCartButton product={product} locale={locale} />
        </div>
      </div>
    </div>
  );
}
