import "@/app/globals.css";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import Link from "next/link";
import { LayoutDashboard, Package, ShoppingBag, TrendingUp, RefreshCw, LogOut } from "lucide-react";

const NAV = [
  { href: "/admin", icon: LayoutDashboard, label: "Dashboard" },
  { href: "/admin/products", icon: Package, label: "Productos" },
  { href: "/admin/orders", icon: ShoppingBag, label: "Pedidos" },
  { href: "/admin/margins", icon: TrendingUp, label: "Márgenes" },
  { href: "/admin/import", icon: RefreshCw, label: "Importar CJ" },
];

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const cookieStore = await cookies();
  const auth = cookieStore.get("admin_auth")?.value;
  if (auth !== process.env.ADMIN_SECRET) redirect("/admin/login");

  return (
    <html lang="es">
      <body className="min-h-screen flex antialiased bg-[#0a0a0f]">
        {/* Sidebar */}
        <aside className="w-60 shrink-0 flex flex-col border-r border-white/[0.06] bg-[#0d0d14]">
          {/* Logo */}
          <div className="px-6 py-6 flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-indigo-500 to-violet-600 flex items-center justify-center text-sm">
              🐾
            </div>
            <div>
              <p className="text-white font-semibold text-sm leading-none">PetShop</p>
              <p className="text-white/30 text-[10px] mt-0.5 uppercase tracking-widest">Admin</p>
            </div>
          </div>

          {/* Divider */}
          <div className="mx-4 h-px bg-white/[0.06]" />

          {/* Nav */}
          <nav className="flex-1 px-3 py-4 space-y-0.5">
            {NAV.map(({ href, icon: Icon, label }) => (
              <Link
                key={href}
                href={href}
                className="group flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm text-white/50 hover:text-white hover:bg-white/[0.06] transition-all duration-150"
              >
                <Icon className="w-4 h-4 shrink-0 transition-colors group-hover:text-indigo-400" />
                {label}
              </Link>
            ))}
          </nav>

          {/* Logout */}
          <div className="mx-3 mb-4">
            <div className="h-px bg-white/[0.06] mb-3" />
            <form action="/api/admin/logout" method="POST">
              <button className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm text-white/30 hover:text-white/60 hover:bg-white/[0.04] transition-all duration-150">
                <LogOut className="w-4 h-4" />
                Cerrar sesión
              </button>
            </form>
          </div>
        </aside>

        {/* Main */}
        <main className="flex-1 overflow-auto">{children}</main>
      </body>
    </html>
  );
}
