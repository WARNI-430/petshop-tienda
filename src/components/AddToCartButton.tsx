"use client";
import { useCartStore } from "@/store/cart";
import type { Product } from "@prisma/client";
import { ShoppingCart, Check, Plus } from "lucide-react";
import { useState } from "react";

interface Props {
  product: Product;
  locale: string;
  compact?: boolean;
}

export default function AddToCartButton({ product, locale, compact = false }: Props) {
  const addItem = useCartStore((s) => s.addItem);
  const [added, setAdded] = useState(false);

  const name = locale === "es" ? product.nameEs : product.nameEn;
  const image = product.images[0] ?? "/placeholder.png";

  function handleAdd() {
    addItem({
      productId: product.id,
      slug: product.slug,
      name,
      price: Number(product.price),
      image,
    });
    setAdded(true);
    setTimeout(() => setAdded(false), 1800);
  }

  if (compact) {
    return (
      <button
        onClick={handleAdd}
        disabled={added}
        className={`flex items-center justify-center w-9 h-9 rounded-xl transition-all duration-200 ${
          added
            ? "bg-emerald-500/20 text-emerald-400 border border-emerald-500/30"
            : "bg-violet-600/20 text-violet-400 border border-violet-500/20 hover:bg-violet-600 hover:text-white hover:border-violet-600"
        }`}
      >
        {added ? <Check className="w-4 h-4" /> : <Plus className="w-4 h-4" />}
      </button>
    );
  }

  return (
    <button
      onClick={handleAdd}
      disabled={added}
      className={`w-full flex items-center justify-center gap-2.5 py-3.5 rounded-xl font-semibold text-sm transition-all duration-200 ${
        added
          ? "bg-emerald-600 text-white shadow-lg shadow-emerald-900/30"
          : "bg-violet-600 hover:bg-violet-500 text-white shadow-lg shadow-violet-900/30 hover:shadow-violet-800/40 active:scale-[0.98]"
      }`}
    >
      {added ? (
        <>
          <Check className="w-4 h-4" />
          {locale === "es" ? "Añadido" : "Added"}
        </>
      ) : (
        <>
          <ShoppingCart className="w-4 h-4" />
          {locale === "es" ? "Añadir al carrito" : "Add to cart"}
        </>
      )}
    </button>
  );
}
