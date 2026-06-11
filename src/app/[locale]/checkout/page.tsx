"use client";
import { useCartStore } from "@/store/cart";
import { useLocale } from "next-intl";
import { useRouter } from "next/navigation";
import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Lock, ShieldCheck, ArrowLeft } from "lucide-react";

export default function CheckoutPage() {
  const locale = useLocale();
  const { items } = useCartStore();
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const isEs = locale === "es";

  const subtotal = items.reduce((acc, i) => acc + i.price * i.qty, 0);

  if (items.length === 0) {
    return (
      <div className="min-h-screen pt-24 flex items-center justify-center px-5">
        <div className="text-center">
          <p className="text-white/30 mb-6">{isEs ? "Tu carrito está vacío." : "Your cart is empty."}</p>
          <Link href={`/${locale}/catalog`} className="inline-flex items-center gap-2 bg-violet-600 hover:bg-violet-500 text-white px-6 py-3 rounded-xl text-sm font-medium transition-colors">
            {isEs ? "Ver catálogo" : "Browse catalog"}
          </Link>
        </div>
      </div>
    );
  }

  async function handleCheckout() {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/stripe/create-session", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ items: items.map((i) => ({ productId: i.productId, qty: i.qty })), locale }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);
      window.location.href = data.url;
    } catch (e) {
      setError(e instanceof Error ? e.message : "Error al procesar el pago");
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen pt-24 pb-16">
      <div className="max-w-5xl mx-auto px-5">
        {/* Header */}
        <div className="flex items-center gap-4 mb-10">
          <Link href={`/${locale}/cart`} className="w-9 h-9 rounded-xl border border-white/[0.08] flex items-center justify-center text-white/40 hover:text-white hover:border-white/20 transition-all">
            <ArrowLeft className="w-4 h-4" />
          </Link>
          <div>
            <h1 className="text-xl font-bold text-white">{isEs ? "Finalizar compra" : "Checkout"}</h1>
            <p className="text-[12px] text-white/30">{isEs ? "Revisa tu pedido antes de pagar" : "Review your order before paying"}</p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-[1fr_360px] gap-8">
          {/* Items list */}
          <div className="space-y-3">
            <p className="text-[11px] font-semibold text-white/25 uppercase tracking-widest mb-4">
              {isEs ? "Artículos" : "Items"}
            </p>
            {items.map((item) => (
              <div key={item.productId} className="flex gap-4 items-center rounded-2xl border border-white/[0.07] bg-[#0d0d1a] p-4">
                <div className="relative w-14 h-14 shrink-0 rounded-xl overflow-hidden bg-[#13131f]">
                  <Image src={item.image} alt={item.name} fill className="object-cover" sizes="56px" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-[13px] font-medium text-white/80 truncate">{item.name}</p>
                  <p className="text-[11px] text-white/30 mt-0.5">x{item.qty}</p>
                </div>
                <span className="text-[14px] font-bold text-white tabular-nums">{(item.price * item.qty).toFixed(2)} €</span>
              </div>
            ))}
          </div>

          {/* Payment panel */}
          <div className="lg:sticky lg:top-24 h-fit space-y-4">
            {/* Secure badge */}
            <div className="rounded-2xl border border-white/[0.07] bg-[#0d0d1a] p-5">
              <div className="flex items-center gap-2.5 mb-4">
                <ShieldCheck className="w-4 h-4 text-emerald-400" />
                <span className="text-[12px] text-white/40 font-medium">
                  {isEs ? "Pago seguro y cifrado con Stripe" : "Secure encrypted payment via Stripe"}
                </span>
              </div>
              <div className="flex gap-2 flex-wrap">
                {["Visa", "Mastercard", "AMEX", "Apple Pay"].map((c) => (
                  <span key={c} className="border border-white/[0.08] bg-white/[0.03] rounded-lg px-2.5 py-1 text-[11px] font-medium text-white/35">
                    {c}
                  </span>
                ))}
              </div>
            </div>

            {/* Totals */}
            <div className="rounded-2xl border border-white/[0.07] bg-[#0d0d1a] p-5 space-y-3">
              <div className="flex justify-between text-[13px]">
                <span className="text-white/40">{isEs ? "Subtotal" : "Subtotal"}</span>
                <span className="text-white tabular-nums">{subtotal.toFixed(2)} €</span>
              </div>
              <div className="flex justify-between text-[13px]">
                <span className="text-white/40">{isEs ? "Envío" : "Shipping"}</span>
                <span className="text-emerald-400 font-medium">{isEs ? "Gratis" : "Free"}</span>
              </div>
              <div className="border-t border-white/[0.06] pt-3 flex justify-between">
                <span className="font-semibold text-white">{isEs ? "Total" : "Total"}</span>
                <span className="text-2xl font-extrabold text-white tabular-nums">{subtotal.toFixed(2)} €</span>
              </div>
            </div>

            {error && (
              <div className="bg-red-500/8 border border-red-500/20 rounded-xl px-4 py-3">
                <p className="text-red-400 text-[13px]">{error}</p>
              </div>
            )}

            <button
              onClick={handleCheckout}
              disabled={loading}
              className="w-full bg-violet-600 hover:bg-violet-500 disabled:opacity-50 disabled:cursor-not-allowed text-white py-4 rounded-2xl font-bold text-[15px] transition-all flex items-center justify-center gap-2.5 shadow-2xl shadow-violet-900/40 hover:shadow-violet-700/40"
            >
              <Lock className="w-4 h-4" />
              {loading
                ? (isEs ? "Redirigiendo..." : "Redirecting...")
                : (isEs ? `Pagar ${subtotal.toFixed(2)} €` : `Pay ${subtotal.toFixed(2)} €`)}
            </button>

            <p className="text-center text-[11px] text-white/20">
              {isEs ? "Al pagar aceptas nuestros términos y condiciones" : "By paying you accept our terms and conditions"}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
