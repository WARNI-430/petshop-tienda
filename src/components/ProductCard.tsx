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
    <div className="group bg-white rounded-xl border border-gray-200 overflow-hidden hover:shadow-lg transition">
      <Link href={`/${locale}/product/${product.slug}`}>
        <div className="relative aspect-square bg-gray-50">
          <Image
            src={image}
            alt={name}
            fill
            className="object-cover group-hover:scale-105 transition duration-300"
            sizes="(max-width: 640px) 50vw, 25vw"
          />
        </div>
      </Link>
      <div className="p-4">
        <Link href={`/${locale}/product/${product.slug}`}>
          <h3 className="font-medium text-sm leading-tight mb-2 hover:underline line-clamp-2">
            {name}
          </h3>
        </Link>
        <div className="flex items-center justify-between">
          <span className="font-bold text-lg">{product.price.toFixed(2)} €</span>
          <AddToCartButton product={product} locale={locale} />
        </div>
      </div>
    </div>
  );
}
