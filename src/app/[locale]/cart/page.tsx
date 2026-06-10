"use client";
import { useTranslations, useLocale } from "next-intl";
import { useCartStore } from "@/store/cart";
import Image from "next/image";
import Link from "next/link";
import { Trash2, Plus, Minus, ShoppingBag } from "lucide-react";
import { useRouter } from "next/navigation";

export default function CartPage() {
  const t = useTranslations("cart");
  const locale = useLocale();
  const { items, removeItem, updateQty } = useCartStore();
  const router = useRouter();

  const total = items.reduce((acc, i) => acc + i.price * i.qty, 0);

  if (items.length === 0) {
    return (
      <div className="max-w-2xl mx-auto px-6 py-32 text-center">
        <div className="w-16 h-16 rounded-2xl bg-white/[0.04] border border-white/[0.06] flex items-center justify-center mx-auto mb-6">
          <ShoppingBag className="w-7 h-7 text-white/20" />
        </div>
        <p className="text-white/30 mb-6">{t("empty")}</p>
        <Link
          href={`/${locale}/catalog`}
          className="inline-flex items-center gap-2 bg-indigo-600 hover:bg-indigo-500 text-white px-6 py-3 rounded-xl text-sm font-medium transition-colors"
        >
          {locale === "es" ? "Ver catálogo" : "Browse catalog"}
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto px-6 py-12">
      <h1 className="text-2xl font-bold text-white mb-8">{t("title")}</h1>

      <div className="space-y-3 mb-8">
        {items.map((item) => (
          <div
            key={item.productId}
            className="flex gap-4 items-center rounded-2xl border border-white/[0.06] bg-white/[0.02] p-4 hover:bg-white/[0.04] transition-colors"
          >
            <div className="relative w-16 h-16 shrink-0 rounded-xl overflow-hidden bg-white/[0.04]">
              <Image src={item.image} alt={item.name} fill className="object-cover" sizes="64px" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="font-medium text-sm text-white/80 truncate">{item.name}</p>
              <p className="text-white/30 text-xs mt-0.5 tabular-nums">{item.price.toFixed(2)} € / ud.</p>
            </div>
            <div className="flex items-center gap-1.5">
              <button
                onClick={() => updateQty(item.productId, item.qty - 1)}
                className="w-7 h-7 rounded-lg border border-white/[0.08] bg-white/[0.04] flex items-center justify-center hover:bg-white/[0.08] transition-colors text-white/50"
              >
                <Minus className="w-3 h-3" />
              </button>
              <span className="w-7 text-center text-sm font-semibold text-white tabular-nums">{item.qty}</span>
              <button
                onClick={() => updateQty(item.productId, item.qty + 1)}
                className="w-7 h-7 rounded-lg border border-white/[0.08] bg-white/[0.04] flex items-center justify-center hover:bg-white/[0.08] transition-colors text-white/50"
              >
                <Plus className="w-3 h-3" />
              </button>
            </div>
            <p className="font-bold text-white w-16 text-right text-sm tabular-nums">{(item.price * item.qty).toFixed(2)} €</p>
            <button
              onClick={() => removeItem(item.productId)}
              className="text-white/20 hover:text-red-400 transition-colors ml-1"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          </div>
        ))}
      </div>

      <div className="rounded-2xl border border-white/[0.06] bg-white/[0.02] p-6">
        <div className="flex justify-between items-center mb-6">
          <span className="text-white/50 text-sm">{locale === "es" ? "Total" : "Total"}</span>
          <span className="text-2xl font-bold text-white tabular-nums">{total.toFixed(2)} €</span>
        </div>
        <button
          onClick={() => router.push(`/${locale}/checkout`)}
          className="w-full bg-indigo-600 hover:bg-indigo-500 text-white py-3.5 rounded-xl font-semibold text-sm transition-colors"
        >
          {t("checkout")}
        </button>
        <Link
          href={`/${locale}/catalog`}
          className="block text-center text-xs text-white/25 hover:text-white/50 mt-4 transition-colors"
        >
          {locale === "es" ? "← Seguir comprando" : "← Continue shopping"}
        </Link>
      </div>
    </div>
  );
}
