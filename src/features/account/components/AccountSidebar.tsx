"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { User, ShoppingBag, MapPin, Settings, LogOut } from "lucide-react";
import { signOut } from "next-auth/react";
import { cn } from "@/lib/utils";

const navigation = [
  { name: "Mi Perfil", href: "/cuenta/perfil", icon: User },
  { name: "Mis Pedidos", href: "/cuenta/pedidos", icon: ShoppingBag },
  { name: "Direcciones", href: "/cuenta/direcciones", icon: MapPin },
  { name: "Configuración", href: "/cuenta/configuracion", icon: Settings },
];

export function AccountSidebar() {
  const pathname = usePathname();

  const handleSignOut = () => {
    signOut({ callbackUrl: "/" });
  };

  return (
    <div className="bg-card/95 border border-border/80 rounded-3xl p-6 shadow-sm backdrop-blur-md text-foreground">
      <div className="space-y-2">
        <div className="px-3 pb-3 mb-2 border-b border-border/60">
          <span className="text-[11px] font-semibold uppercase tracking-[0.25em] text-gold-500/90 block">
            Panel
          </span>
          <h2 className="text-xl font-serif font-light text-foreground mt-0.5">Mi Cuenta</h2>
        </div>

        <nav className="space-y-1.5" aria-label="Navegación de cuenta">
          {navigation.map((item) => {
            const Icon = item.icon;
            const isActive = pathname === item.href;

            return (
              <Link
                key={item.name}
                href={item.href}
                className={cn(
                  "flex items-center gap-3.5 px-3.5 py-3 rounded-2xl text-sm font-medium transition-all duration-200 group cursor-pointer",
                  isActive
                    ? "bg-gold-500/10 text-gold-500 dark:text-gold-400 border border-gold-500/30 shadow-sm"
                    : "text-muted-foreground hover:bg-accent/60 hover:text-foreground"
                )}
              >
                <div
                  className={cn(
                    "p-2 rounded-xl transition-colors",
                    isActive
                      ? "bg-gold-500/15 text-gold-500 dark:text-gold-400"
                      : "bg-background/80 text-muted-foreground group-hover:text-foreground group-hover:bg-background"
                  )}
                >
                  <Icon className="w-4 h-4" />
                </div>
                <span className="font-medium truncate">{item.name}</span>
              </Link>
            );
          })}
        </nav>

        <div className="pt-4 mt-4 border-t border-border/60">
          <button
            onClick={handleSignOut}
            className="flex items-center gap-3.5 w-full px-3.5 py-3 rounded-2xl text-sm font-medium text-red-500 dark:text-red-400 hover:bg-red-500/10 hover:text-red-600 transition-colors cursor-pointer group"
          >
            <div className="p-2 rounded-xl bg-red-500/10 text-red-500 group-hover:bg-red-500/20 transition-colors">
              <LogOut className="w-4 h-4" />
            </div>
            <span>Cerrar Sesión</span>
          </button>
        </div>
      </div>
    </div>
  );
}
