"use client";
import { useCartStore } from "@/store/cart";
import { useLocale } from "next-intl";
import { useRouter } from "next/navigation";
import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Lock, ShieldCheck } from "lucide-react";

export default function CheckoutPage() {
  const locale = useLocale() as "es" | "en";
  const { items } = useCartStore();
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const subtotal = items.reduce((acc, i) => acc + i.price * i.qty, 0);

  if (items.length === 0) {
    return (
      <div className="max-w-2xl mx-auto px-6 py-32 text-center">
        <p className="text-white/30 mb-6">
          {locale === "es" ? "Tu carrito está vacío." : "Your cart is empty."}
        </p>
        <Link href={`/${locale}/catalog`} className="inline-flex items-center gap-2 bg-indigo-600 hover:bg-indigo-500 text-white px-6 py-3 rounded-xl text-sm font-medium transition-colors">
          {locale === "es" ? "Ver catálogo" : "Browse catalog"}
        </Link>
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
        body: JSON.stringify({
          items: items.map((i) => ({ productId: i.productId, qty: i.qty })),
          locale,
        }),
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
    <div className="max-w-4xl mx-auto px-6 py-12">
      <h1 className="text-2xl font-bold text-white mb-10">
        {locale === "es" ? "Resumen del pedido" : "Order summary"}
      </h1>

      <div className="grid grid-cols-1 md:grid-cols-5 gap-8">
        {/* Order items */}
        <div className="md:col-span-3 space-y-3">
          {items.map((item) => (
            <div key={item.productId} className="flex gap-4 items-center rounded-xl border border-white/[0.06] bg-white/[0.02] p-4">
              <div className="relative w-14 h-14 shrink-0 rounded-lg overflow-hidden bg-white/[0.04]">
                <Image src={item.image} alt={item.name} fill className="object-cover" sizes="56px" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-white/80 truncate">{item.name}</p>
                <p className="text-xs text-white/30 mt-0.5">x{item.qty}</p>
              </div>
              <span className="text-sm font-semibold text-white tabular-nums">{(item.price * item.qty).toFixed(2)} €</span>
            </div>
          ))}

          <div className="rounded-xl border border-white/[0.06] bg-white/[0.02] px-4 py-3 flex justify-between">
            <span className="text-sm text-white/40">{locale === "es" ? "Subtotal" : "Subtotal"}</span>
            <span className="text-sm font-bold text-white tabular-nums">{subtotal.toFixed(2)} €</span>
          </div>
          <p className="text-xs text-white/20 px-1">
            {locale === "es" ? "El envío se calcula en el siguiente paso." : "Shipping calculated at next step."}
          </p>
        </div>

        {/* Payment panel */}
        <div className="md:col-span-2 flex flex-col gap-4">
          <div className="rounded-xl border border-white/[0.06] bg-white/[0.02] p-5 space-y-4">
            <div className="flex items-center gap-2 text-xs text-white/40">
              <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0" />
              {locale === "es" ? "Pago seguro con Stripe" : "Secure payment with Stripe"}
            </div>
            <div className="flex gap-2">
              {["Visa", "Mastercard", "AMEX"].map((c) => (
                <span key={c} className="border border-white/[0.08] bg-white/[0.04] rounded-md px-2.5 py-1 text-[11px] font-medium text-white/40">
                  {c}
                </span>
              ))}
            </div>
          </div>

          {error && (
            <div className="bg-red-500/10 border border-red-500/20 rounded-xl px-4 py-3">
              <p className="text-red-400 text-sm">{error}</p>
            </div>
          )}

          <button
            onClick={handleCheckout}
            disabled={loading}
            className="w-full bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed text-white py-4 rounded-xl font-bold text-base transition-colors flex items-center justify-center gap-2"
          >
            <Lock className="w-4 h-4" />
            {loading
              ? (locale === "es" ? "Redirigiendo..." : "Redirecting...")
              : (locale === "es" ? `Pagar ${subtotal.toFixed(2)} €` : `Pay ${subtotal.toFixed(2)} €`)}
          </button>

          <Link href={`/${locale}/cart`} className="text-center text-xs text-white/20 hover:text-white/50 transition-colors">
            ← {locale === "es" ? "Volver al carrito" : "Back to cart"}
          </Link>
        </div>
      </div>
    </div>
  );
}
