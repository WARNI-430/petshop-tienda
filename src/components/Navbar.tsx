"use client";
import Link from "next/link";
import { useCartStore } from "@/store/cart";
import { ShoppingBag, Menu, X } from "lucide-react";
import { useState, useEffect } from "react";
import { useLocale } from "next-intl";

export default function Navbar() {
  const { items } = useCartStore();
  const locale = useLocale();
  const count = items.reduce((a, i) => a + i.qty, 0);
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const fn = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", fn, { passive: true });
    return () => window.removeEventListener("scroll", fn);
  }, []);

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
        scrolled
          ? "bg-[#07070f]/85 backdrop-blur-2xl border-b border-white/[0.06]"
          : "bg-transparent"
      }`}
    >
      <nav className="max-w-6xl mx-auto px-5 h-[68px] flex items-center justify-between">
        {/* Logo */}
        <Link href={`/${locale}`} className="flex items-center gap-2.5 group">
          <div className="relative w-9 h-9 rounded-xl overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-br from-violet-500 via-purple-600 to-indigo-700" />
            <div className="absolute inset-0 flex items-center justify-center text-white font-black text-base">P</div>
          </div>
          <div className="flex flex-col leading-none">
            <span className="font-extrabold text-white text-[15px] tracking-tight">Petify</span>
            <span className="text-[10px] text-white/25 font-medium tracking-widest uppercase">Store</span>
          </div>
        </Link>

        {/* Desktop center nav */}
        <div className="hidden md:flex items-center gap-1 absolute left-1/2 -translate-x-1/2">
          <Link href={`/${locale}/catalog`} className="px-4 py-2 rounded-lg text-[13px] text-white/50 hover:text-white hover:bg-white/[0.06] transition-all font-medium">
            {locale === "es" ? "Catálogo" : "Catalog"}
          </Link>
          <Link href={`/${locale}/catalog`} className="px-4 py-2 rounded-lg text-[13px] text-white/50 hover:text-white hover:bg-white/[0.06] transition-all font-medium">
            {locale === "es" ? "Ofertas" : "Deals"}
          </Link>
        </div>

        {/* Right */}
        <div className="flex items-center gap-1.5">
          <Link
            href={locale === "es" ? "/en" : "/es"}
            className="hidden sm:flex items-center px-2.5 py-1.5 rounded-lg text-[11px] text-white/30 hover:text-white/60 hover:bg-white/[0.05] transition-all font-semibold tracking-widest"
          >
            {locale === "es" ? "EN" : "ES"}
          </Link>

          <Link href={`/${locale}/cart`} className="relative flex items-center justify-center w-10 h-10 rounded-xl hover:bg-white/[0.07] transition-all">
            <ShoppingBag className="w-[18px] h-[18px] text-white/60 hover:text-white transition-colors" />
            {count > 0 && (
              <span className="absolute -top-1 -right-1 min-w-[18px] h-[18px] bg-violet-600 rounded-full text-[10px] font-bold text-white flex items-center justify-center px-1 shadow-lg shadow-violet-900/60">
                {count}
              </span>
            )}
          </Link>

          <button
            className="md:hidden flex items-center justify-center w-10 h-10 rounded-xl hover:bg-white/[0.07] transition-all"
            onClick={() => setOpen(!open)}
          >
            {open ? <X className="w-5 h-5 text-white/60" /> : <Menu className="w-5 h-5 text-white/60" />}
          </button>
        </div>
      </nav>

      {/* Mobile drawer */}
      <div className={`md:hidden overflow-hidden transition-all duration-300 ${open ? "max-h-48" : "max-h-0"}`}>
        <div className="border-t border-white/[0.06] bg-[#07070f]/95 backdrop-blur-2xl px-5 py-3 space-y-0.5">
          {[
            { href: `/${locale}/catalog`, label: locale === "es" ? "Catálogo" : "Catalog" },
            { href: `/${locale}/catalog`, label: locale === "es" ? "Ofertas" : "Deals" },
          ].map((l) => (
            <Link key={l.label} href={l.href} onClick={() => setOpen(false)}
              className="block px-4 py-3 rounded-xl text-sm text-white/55 hover:text-white hover:bg-white/[0.06] transition-all font-medium">
              {l.label}
            </Link>
          ))}
        </div>
      </div>
    </header>
  );
}
