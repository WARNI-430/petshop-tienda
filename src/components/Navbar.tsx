"use client";
import Link from "next/link";
import { useTranslations, useLocale } from "next-intl";
import { useCartStore } from "@/store/cart";
import { ShoppingCart } from "lucide-react";

export default function Navbar() {
  const t = useTranslations("nav");
  const locale = useLocale();
  const count = useCartStore((s) => s.items.reduce((acc, i) => acc + i.qty, 0));

  return (
    <header className="sticky top-0 z-50 bg-white border-b border-gray-200">
      <nav className="max-w-6xl mx-auto px-4 h-14 flex items-center justify-between">
        <Link href={`/${locale}`} className="font-bold text-lg tracking-tight">
          PetShop
        </Link>
        <div className="flex items-center gap-6">
          <Link href={`/${locale}/catalog`} className="text-sm hover:text-gray-500 transition">
            {t("catalog")}
          </Link>
          <Link href={`/${locale}/cart`} className="relative">
            <ShoppingCart className="w-5 h-5" />
            {count > 0 && (
              <span className="absolute -top-1.5 -right-1.5 bg-black text-white text-[10px] w-4 h-4 rounded-full flex items-center justify-center">
                {count}
              </span>
            )}
          </Link>
          <Link
            href={locale === "es" ? "/en" : "/es"}
            className="text-xs uppercase tracking-wide text-gray-400 hover:text-gray-800 transition"
          >
            {locale === "es" ? "EN" : "ES"}
          </Link>
        </div>
      </nav>
    </header>
  );
}
