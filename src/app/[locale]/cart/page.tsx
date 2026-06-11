"use client";
import { useLocale } from "next-intl";
import { useCartStore } from "@/store/cart";
import Image from "next/image";
import Link from "next/link";
import { Trash2, Plus, Minus, ShoppingBag, ArrowRight } from "lucide-react";
import { useRouter } from "next/navigation";

export default function CartPage() {
  const locale = useLocale();
  const { items, removeItem, updateQty } = useCartStore();
  const router = useRouter();
  const isEs = locale === "es";

  const total = items.reduce((acc, i) => acc + i.price * i.qty, 0);

  if (items.length === 0) {
    return (
      <div className="min-h-screen pt-24 flex items-center justify-center px-5">
        <div className="text-center max-w-sm">
          <div className="w-20 h-20 rounded-3xl bg-[#0d0d1a] border border-white/[0.07] flex items-center justify-center mx-auto mb-6">
            <ShoppingBag className="w-9 h-9 text-white/15" />
          </div>
          <h2 className="text-xl font-bold text-white mb-2">
            {isEs ? "Tu carrito está vacío" : "Your cart is empty"}
          </h2>
          <p className="text-[13px] text-white/30 mb-8">
            {isEs ? "Descubre nuestros productos y añade algo al carrito." : "Discover our products and add something to your cart."}
          </p>
          <Link href={`/${locale}/catalog`}
            className="inline-flex items-center gap-2 bg-violet-600 hover:bg-violet-500 text-white px-7 py-3 rounded-xl font-medium text-sm transition-colors">
            {isEs ? "Explorar catálogo" : "Browse catalog"}
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen pt-24 pb-16">
      <div className="max-w-4xl mx-auto px-5">
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-2xl font-bold text-white">
            {isEs ? "Tu carrito" : "Your cart"}
          </h1>
          <span className="text-[13px] text-white/30">
            {items.reduce((a, i) => a + i.qty, 0)} {isEs ? "artículos" : "items"}
          </span>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-[1fr_320px] gap-6">
          {/* Items */}
          <div className="space-y-3">
            {items.map((item) => (
              <div key={item.productId}
                className="flex gap-4 items-center rounded-2xl border border-white/[0.07] bg-[#0d0d1a] p-4 hover:border-white/[0.11] transition-all">
                <Link href={`/${locale}/catalog`} className="relative w-16 h-16 shrink-0 rounded-xl overflow-hidden bg-[#13131f]">
                  <Image src={item.image} alt={item.name} fill className="object-cover" sizes="64px" />
                </Link>
                <div className="flex-1 min-w-0">
                  <p className="font-medium text-[13px] text-white/80 truncate">{item.name}</p>
                  <p className="text-[12px] text-white/30 mt-0.5 tabular-nums">{item.price.toFixed(2)} € / ud.</p>
                </div>

                {/* Qty controls */}
                <div className="flex items-center gap-1.5 bg-white/[0.04] rounded-xl p-1">
                  <button onClick={() => updateQty(item.productId, item.qty - 1)}
                    className="w-7 h-7 rounded-lg flex items-center justify-center hover:bg-white/[0.08] transition-colors text-white/50 hover:text-white">
                    <Minus className="w-3 h-3" />
                  </button>
                  <span className="w-6 text-center text-[13px] font-semibold text-white tabular-nums">{item.qty}</span>
                  <button onClick={() => updateQty(item.productId, item.qty + 1)}
                    className="w-7 h-7 rounded-lg flex items-center justify-center hover:bg-white/[0.08] transition-colors text-white/50 hover:text-white">
                    <Plus className="w-3 h-3" />
                  </button>
                </div>

                <p className="font-bold text-white text-[15px] tabular-nums w-16 text-right">
                  {(item.price * item.qty).toFixed(2)} €
                </p>
                <button onClick={() => removeItem(item.productId)}
                  className="text-white/15 hover:text-red-400 transition-colors ml-1">
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            ))}
          </div>

          {/* Order summary */}
          <div className="lg:sticky lg:top-24 h-fit">
            <div className="rounded-2xl border border-white/[0.07] bg-[#0d0d1a] p-6">
              <h3 className="font-bold text-white mb-5">{isEs ? "Resumen" : "Summary"}</h3>
              <div className="space-y-3 mb-5">
                <div className="flex justify-between text-[13px]">
                  <span className="text-white/40">{isEs ? "Subtotal" : "Subtotal"}</span>
                  <span className="text-white tabular-nums">{total.toFixed(2)} €</span>
                </div>
                <div className="flex justify-between text-[13px]">
                  <span className="text-white/40">{isEs ? "Envío" : "Shipping"}</span>
                  <span className="text-emerald-400 font-medium">{isEs ? "Gratis" : "Free"}</span>
                </div>
              </div>
              <div className="border-t border-white/[0.06] pt-4 mb-5 flex justify-between">
                <span className="font-semibold text-white">{isEs ? "Total" : "Total"}</span>
                <span className="text-xl font-extrabold text-white tabular-nums">{total.toFixed(2)} €</span>
              </div>
              <button
                onClick={() => router.push(`/${locale}/checkout`)}
                className="w-full bg-violet-600 hover:bg-violet-500 text-white py-3.5 rounded-xl font-semibold text-sm transition-all flex items-center justify-center gap-2 shadow-lg shadow-violet-900/30">
                {isEs ? "Ir al pago" : "Proceed to checkout"}
                <ArrowRight className="w-4 h-4" />
              </button>
              <Link href={`/${locale}/catalog`}
                className="block text-center text-[12px] text-white/20 hover:text-white/45 mt-4 transition-colors">
                ← {isEs ? "Seguir comprando" : "Continue shopping"}
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
