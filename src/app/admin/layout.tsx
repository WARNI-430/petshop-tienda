import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import Link from "next/link";
import { LayoutDashboard, Package, ShoppingBag, TrendingUp, RefreshCw } from "lucide-react";

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const cookieStore = await cookies();
  const auth = cookieStore.get("admin_auth")?.value;
  if (auth !== process.env.ADMIN_SECRET) redirect("/admin/login");

  return (
    <div className="min-h-screen flex">
      <aside className="w-56 bg-gray-900 text-white flex flex-col">
        <div className="px-6 py-5 font-bold text-lg border-b border-gray-700">
          PetShop Admin
        </div>
        <nav className="flex-1 px-3 py-4 space-y-1">
          {[
            { href: "/admin", icon: LayoutDashboard, label: "Dashboard" },
            { href: "/admin/products", icon: Package, label: "Productos" },
            { href: "/admin/orders", icon: ShoppingBag, label: "Pedidos" },
            { href: "/admin/margins", icon: TrendingUp, label: "Márgenes" },
            { href: "/admin/import", icon: RefreshCw, label: "Importar CJ" },
          ].map(({ href, icon: Icon, label }) => (
            <Link
              key={href}
              href={href}
              className="flex items-center gap-3 px-3 py-2 rounded-lg text-sm text-gray-300 hover:bg-gray-800 hover:text-white transition"
            >
              <Icon className="w-4 h-4" />
              {label}
            </Link>
          ))}
        </nav>
        <form action="/api/admin/logout" method="POST" className="px-3 pb-4">
          <button className="w-full text-left px-3 py-2 text-xs text-gray-500 hover:text-gray-300 transition">
            Cerrar sesión
          </button>
        </form>
      </aside>
      <main className="flex-1 bg-gray-50 overflow-auto">{children}</main>
    </div>
  );
}
