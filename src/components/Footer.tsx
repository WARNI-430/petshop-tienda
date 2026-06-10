import { useTranslations, useLocale } from "next-intl";
import Link from "next/link";

export default function Footer() {
  const t = useTranslations("footer");
  const locale = useLocale();

  return (
    <footer className="border-t border-gray-200 mt-auto">
      <div className="max-w-6xl mx-auto px-4 py-6 flex flex-col sm:flex-row items-center justify-between gap-4 text-sm text-gray-500">
        <span>© {new Date().getFullYear()} PetShop</span>
        <div className="flex gap-6">
          <Link href={`/${locale}/legal/aviso-legal`} className="hover:text-gray-800 transition">{t("legal")}</Link>
          <Link href={`/${locale}/legal/privacidad`} className="hover:text-gray-800 transition">{t("privacy")}</Link>
          <Link href={`/${locale}/legal/devoluciones`} className="hover:text-gray-800 transition">{t("returns")}</Link>
        </div>
      </div>
    </footer>
  );
}
