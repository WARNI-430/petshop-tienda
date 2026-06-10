import { useTranslations, useLocale } from "next-intl";
import Link from "next/link";

export default function Footer() {
  const t = useTranslations("footer");
  const locale = useLocale();

  return (
    <footer className="border-t border-white/[0.06] mt-auto">
      <div className="max-w-6xl mx-auto px-6 py-6 flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-2">
          <div className="w-5 h-5 rounded bg-gradient-to-br from-indigo-500 to-violet-600 flex items-center justify-center text-[10px]">🐾</div>
          <span className="text-white/20 text-sm">© {new Date().getFullYear()} PetShop</span>
        </div>
        <div className="flex gap-6 text-xs text-white/25">
          <Link href={`/${locale}/legal/aviso-legal`} className="hover:text-white/60 transition-colors">{t("legal")}</Link>
          <Link href={`/${locale}/legal/privacidad`} className="hover:text-white/60 transition-colors">{t("privacy")}</Link>
          <Link href={`/${locale}/legal/devoluciones`} className="hover:text-white/60 transition-colors">{t("returns")}</Link>
        </div>
      </div>
    </footer>
  );
}
