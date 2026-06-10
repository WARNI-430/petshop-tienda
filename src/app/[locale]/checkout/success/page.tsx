"use client";
import { useEffect } from "react";
import { useCartStore } from "@/store/cart";
import { useLocale } from "next-intl";
import Link from "next/link";
import { CheckCircle } from "lucide-react";

export default function SuccessPage() {
  const locale = useLocale();
  const clear = useCartStore((s) => s.clear);

  useEffect(() => {
    clear();
  }, [clear]);

  return (
    <div className="max-w-lg mx-auto px-4 py-24 text-center">
      <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-6" />
      <h1 className="text-3xl font-bold mb-4">
        {locale === "es" ? "¡Pedido confirmado!" : "Order confirmed!"}
      </h1>
      <p className="text-gray-500 mb-2">
        {locale === "es"
          ? "Recibirás un email de confirmación en breve."
          : "You will receive a confirmation email shortly."}
      </p>
      <p className="text-gray-500 mb-8">
        {locale === "es"
          ? "Cuando tu pedido sea enviado, te avisamos con el número de seguimiento."
          : "We'll notify you with a tracking number once your order ships."}
      </p>
      <Link
        href={`/${locale}/catalog`}
        className="inline-block bg-black text-white px-6 py-3 rounded-lg hover:bg-gray-800 transition"
      >
        {locale === "es" ? "Seguir comprando" : "Continue shopping"}
      </Link>
    </div>
  );
}
