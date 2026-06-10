"use client";
import { useCartStore } from "@/store/cart";
import { useLocale } from "next-intl";
import { useRouter } from "next/navigation";
import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Lock } from "lucide-react";

export default function CheckoutPage() {
  const locale = useLocale() as "es" | "en";
  const { items, clear } = useCartStore();
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const subtotal = items.reduce((acc, i) => acc + i.price * i.qty, 0);

  if (items.length === 0) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-24 text-center">
        <p className="text-gray-400 text-lg mb-6">
          {locale === "es" ? "Tu carrito está vacío." : "Your cart is empty."}
        </p>
        <Link href={`/${locale}/catalog`} className="inline-block bg-black text-white px-6 py-3 rounded-lg hover:bg-gray-800 transition">
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
    <div className="max-w-4xl mx-auto px-4 py-12">
      <h1 className="text-3xl font-bold mb-8">
        {locale === "es" ? "Resumen del pedido" : "Order summary"}
      </h1>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
        {/* Resumen */}
        <div className="space-y-4">
          {items.map((item) => (
            <div key={item.productId} className="flex gap-3 items-center">
              <div className="relative w-14 h-14 shrink-0 rounded-lg overflow-hidden bg-gray-50">
                <Image src={item.image} alt={item.name} fill className="object-cover" sizes="56px" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium truncate">{item.name}</p>
                <p className="text-xs text-gray-500">x{item.qty}</p>
              </div>
              <span className="text-sm font-medium">{(item.price * item.qty).toFixed(2)} €</span>
            </div>
          ))}
          <div className="border-t border-gray-200 pt-4 flex justify-between font-bold">
            <span>{locale === "es" ? "Subtotal" : "Subtotal"}</span>
            <span>{subtotal.toFixed(2)} €</span>
          </div>
          <p className="text-xs text-gray-400">
            {locale === "es"
              ? "El envío se calcula en el siguiente paso."
              : "Shipping is calculated in the next step."}
          </p>
        </div>

        {/* Botón pago */}
        <div className="flex flex-col justify-between">
          <div className="bg-gray-50 rounded-xl p-6 space-y-4">
            <div className="flex items-center gap-2 text-sm text-gray-600">
              <Lock className="w-4 h-4" />
              <span>
                {locale === "es"
                  ? "Pago seguro con Stripe. Tus datos están protegidos."
                  : "Secure payment with Stripe. Your data is protected."}
              </span>
            </div>
            <div className="flex gap-2 flex-wrap">
              {["Visa", "Mastercard", "AMEX"].map((c) => (
                <span key={c} className="border border-gray-200 rounded px-2 py-1 text-xs font-medium text-gray-500 bg-white">
                  {c}
                </span>
              ))}
            </div>
          </div>

          {error && (
            <p className="text-sm text-red-500 mt-4">{error}</p>
          )}

          <button
            onClick={handleCheckout}
            disabled={loading}
            className="mt-6 w-full bg-black text-white py-4 rounded-xl font-semibold text-lg hover:bg-gray-800 transition disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading
              ? locale === "es" ? "Redirigiendo..." : "Redirecting..."
              : locale === "es" ? `Pagar ${subtotal.toFixed(2)} €` : `Pay ${subtotal.toFixed(2)} €`}
          </button>
        </div>
      </div>
    </div>
  );
}
