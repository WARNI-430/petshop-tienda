"use client";
import { useTranslations, useLocale } from "next-intl";
import { useCartStore } from "@/store/cart";
import Image from "next/image";
import Link from "next/link";
import { Trash2, Plus, Minus } from "lucide-react";
import { useRouter } from "next/navigation";

export default function CartPage() {
  const t = useTranslations("cart");
  const locale = useLocale();
  const { items, removeItem, updateQty } = useCartStore();
  const router = useRouter();

  const total = items.reduce((acc, i) => acc + i.price * i.qty, 0);

  if (items.length === 0) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-24 text-center">
        <p className="text-gray-400 text-lg mb-6">{t("empty")}</p>
        <Link
          href={`/${locale}/catalog`}
          className="inline-block bg-black text-white px-6 py-3 rounded-lg hover:bg-gray-800 transition"
        >
          {locale === "es" ? "Ver catálogo" : "Browse catalog"}
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto px-4 py-12">
      <h1 className="text-3xl font-bold mb-8">{t("title")}</h1>

      <div className="space-y-4 mb-8">
        {items.map((item) => (
          <div key={item.productId} className="flex gap-4 items-center border border-gray-200 rounded-xl p-4">
            <div className="relative w-20 h-20 shrink-0 rounded-lg overflow-hidden bg-gray-50">
              <Image src={item.image} alt={item.name} fill className="object-cover" sizes="80px" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="font-medium text-sm truncate">{item.name}</p>
              <p className="text-gray-500 text-sm">{item.price.toFixed(2)} € / ud.</p>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={() => updateQty(item.productId, item.qty - 1)}
                className="w-7 h-7 border border-gray-300 rounded flex items-center justify-center hover:bg-gray-100 transition"
              >
                <Minus className="w-3 h-3" />
              </button>
              <span className="w-6 text-center text-sm font-medium">{item.qty}</span>
              <button
                onClick={() => updateQty(item.productId, item.qty + 1)}
                className="w-7 h-7 border border-gray-300 rounded flex items-center justify-center hover:bg-gray-100 transition"
              >
                <Plus className="w-3 h-3" />
              </button>
            </div>
            <p className="font-bold w-16 text-right">{(item.price * item.qty).toFixed(2)} €</p>
            <button
              onClick={() => removeItem(item.productId)}
              className="text-gray-400 hover:text-red-500 transition ml-2"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          </div>
        ))}
      </div>

      <div className="border-t border-gray-200 pt-6 flex flex-col sm:flex-row justify-between items-center gap-4">
        <div className="text-xl font-bold">
          Total: {total.toFixed(2)} €
        </div>
        <button
          onClick={() => router.push(`/${locale}/checkout`)}
          className="w-full sm:w-auto bg-black text-white px-8 py-3 rounded-lg hover:bg-gray-800 transition font-medium"
        >
          {t("checkout")}
        </button>
      </div>
    </div>
  );
}
