"use client";
import Link from "next/link";
import { useTranslations, useLocale } from "next-intl";
import { useCartStore } from "@/store/cart";
import { ShoppingBag } from "lucide-react";

export default function Navbar() {
  const t = useTranslations("nav");
  const locale = useLocale();
  const count = useCartStore((s) => s.items.reduce((acc, i) => acc + i.qty, 0));

  return (
    <header className="sticky top-0 z-50 bg-[#0a0a0f]/80 backdrop-blur-md border-b border-white/[0.06]">
      <nav className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
        <Link href={`/${locale}`} className="flex items-center gap-2.5">
          <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-indigo-500 to-violet-600 flex items-center justify-center text-sm">
            🐾
          </div>
          <span className="font-bold text-white tracking-tight">PetShop</span>
        </Link>

        <div className="flex items-center gap-6">
          <Link
            href={`/${locale}/catalog`}
            className="text-sm text-white/50 hover:text-white transition-colors"
          >
            {t("catalog")}
          </Link>

          <Link href={`/${locale}/cart`} className="relative p-1.5">
            <ShoppingBag className="w-5 h-5 text-white/60 hover:text-white transition-colors" />
            {count > 0 && (
              <span className="absolute -top-0.5 -right-0.5 bg-indigo-500 text-white text-[9px] font-bold w-4 h-4 rounded-full flex items-center justify-center">
                {count}
              </span>
            )}
          </Link>

          <Link
            href={locale === "es" ? "/en" : "/es"}
            className="text-[11px] uppercase tracking-widest text-white/30 hover:text-white/70 transition-colors font-medium"
          >
            {locale === "es" ? "EN" : "ES"}
          </Link>
        </div>
      </nav>
    </header>
  );
}
