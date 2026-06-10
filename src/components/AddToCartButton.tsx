"use client";
import { useTranslations } from "next-intl";
import { useCartStore } from "@/store/cart";
import type { Product } from "@prisma/client";
import { ShoppingCart } from "lucide-react";

interface Props {
  product: Product;
  locale: string;
}

export default function AddToCartButton({ product, locale }: Props) {
  const t = useTranslations("product");
  const addItem = useCartStore((s) => s.addItem);

  if (product.stock === 0) {
    return (
      <span className="text-xs text-gray-400">{t("out_of_stock")}</span>
    );
  }

  return (
    <button
      onClick={() =>
        addItem({
          productId: product.id,
          slug: product.slug,
          name: locale === "es" ? product.nameEs : product.nameEn,
          image: product.images[0] ?? "/placeholder.png",
          price: product.price,
        })
      }
      className="bg-black text-white p-2 rounded-lg hover:bg-gray-800 transition"
      title={t("add_to_cart")}
    >
      <ShoppingCart className="w-4 h-4" />
    </button>
  );
}
