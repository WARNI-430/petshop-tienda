"use client";
import { useTranslations } from "next-intl";
import { useCartStore } from "@/store/cart";
import type { Product } from "@prisma/client";
import { ShoppingBag, Check } from "lucide-react";
import { useState } from "react";

interface Props {
  product: Product;
  locale: string;
}

export default function AddToCartButton({ product, locale }: Props) {
  const t = useTranslations("product");
  const addItem = useCartStore((s) => s.addItem);
  const [added, setAdded] = useState(false);

  if (product.stock === 0) {
    return <span className="text-xs text-white/25">{t("out_of_stock")}</span>;
  }

  function handleAdd() {
    addItem({
      productId: product.id,
      slug: product.slug,
      name: locale === "es" ? product.nameEs : product.nameEn,
      image: product.images[0] ?? "/placeholder.png",
      price: product.price,
    });
    setAdded(true);
    setTimeout(() => setAdded(false), 1500);
  }

  return (
    <button
      onClick={handleAdd}
      className={`p-2 rounded-xl transition-all duration-200 ${
        added
          ? "bg-emerald-500/20 text-emerald-400"
          : "bg-indigo-600 hover:bg-indigo-500 text-white"
      }`}
      title={t("add_to_cart")}
    >
      {added ? <Check className="w-4 h-4" /> : <ShoppingBag className="w-4 h-4" />}
    </button>
  );
}
