import Link from "next/link";

export default function Footer() {
  return (
    <footer className="border-t border-white/[0.05] mt-24">
      <div className="max-w-6xl mx-auto px-5 py-14">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10 mb-12">
          {/* Brand */}
          <div className="md:col-span-2">
            <div className="flex items-center gap-2.5 mb-4">
              <div className="relative w-8 h-8 rounded-xl overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-br from-violet-500 via-purple-600 to-indigo-700" />
                <div className="absolute inset-0 flex items-center justify-center text-white font-black text-sm">P</div>
              </div>
              <span className="font-extrabold text-white text-[15px] tracking-tight">Petify<span className="text-violet-400">.</span></span>
            </div>
            <p className="text-[13px] text-white/30 leading-relaxed max-w-xs">
              Todo lo que tu mascota necesita, con la calidad y el cuidado que se merece.
            </p>
            <div className="flex items-center gap-3 mt-5">
              {["🐶", "🐱", "🐦", "🐠"].map((e) => (
                <span key={e} className="text-xl">{e}</span>
              ))}
            </div>
          </div>

          {/* Links */}
          <div>
            <p className="text-[11px] font-semibold text-white/25 uppercase tracking-widest mb-4">Tienda</p>
            <div className="space-y-2.5">
              {[["Catálogo", "/es/catalog"], ["Ofertas", "/es/catalog"], ["Nuevos", "/es/catalog"]].map(([label, href]) => (
                <Link key={label} href={href} className="block text-[13px] text-white/40 hover:text-white/70 transition-colors">
                  {label}
                </Link>
              ))}
            </div>
          </div>

          <div>
            <p className="text-[11px] font-semibold text-white/25 uppercase tracking-widest mb-4">Ayuda</p>
            <div className="space-y-2.5">
              {[["Envíos", "#"], ["Devoluciones", "#"], ["Contacto", "#"]].map(([label, href]) => (
                <Link key={label} href={href} className="block text-[13px] text-white/40 hover:text-white/70 transition-colors">
                  {label}
                </Link>
              ))}
            </div>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="border-t border-white/[0.05] pt-7 flex flex-col sm:flex-row items-center justify-between gap-3">
          <p className="text-[12px] text-white/20">© 2026 Petify. Todos los derechos reservados.</p>
          <div className="flex items-center gap-4">
            {["Privacidad", "Términos", "Cookies"].map((t) => (
              <Link key={t} href="#" className="text-[12px] text-white/20 hover:text-white/45 transition-colors">
                {t}
              </Link>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}
