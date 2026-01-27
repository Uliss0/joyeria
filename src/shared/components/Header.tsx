"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import dynamic from "next/dynamic";
import { ShoppingBag, User, Menu, X, LogOut, Settings, User as UserIcon } from "lucide-react";
import { useSession, signOut } from "next-auth/react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Sheet, SheetContent, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { IconButton } from "./IconButton";
import { Cart } from "./Cart";
import { useCartItemCount, useCartToggleCart } from "@/shared/store/cartStore";
import { cn } from "@/lib/utils";

const navigation = [
  { name: "Inicio", href: "/" },
  { name: "Colección", href: "/coleccion" },
  { name: "Contacto", href: "/contacto" },
];

const CartButton = dynamic(() => Promise.resolve(() => {
  const itemCount = useCartItemCount();
  const toggleCart = useCartToggleCart();

  return (
    <button
      onClick={toggleCart}
      className="relative p-2 hover:bg-gray-100 rounded-lg transition-colors"
      aria-label={`Carrito de compras${itemCount > 0 ? ` (${itemCount} productos)` : ''}`}
    >
      <ShoppingBag className="w-5 h-5" />
      {itemCount > 0 && (
        <span className="absolute -top-1 -right-1 bg-gold-600 text-white text-xs font-bold rounded-full min-w-[1.25rem] h-5 flex items-center justify-center px-1">
          {itemCount > 99 ? '99+' : itemCount}
        </span>
      )}
    </button>
  );
}), { ssr: false });

function UserMenu() {
  const { data: session, status } = useSession();
  const [isOpen, setIsOpen] = useState(false);

  if (status === "loading") {
    return (
      <div className="w-8 h-8 bg-gray-200 rounded-full animate-pulse" />
    );
  }

  if (!session) {
    return (
      <Link href="/auth/signin">
        <Button variant="outline" size="sm">
          Iniciar sesión
        </Button>
      </Link>
    );
  }

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center space-x-2 p-2 hover:bg-gray-100 rounded-lg transition-colors"
        aria-label="Menú de usuario"
      >
        {session.user?.image ? (
          <img
            src={session.user.image}
            alt={session.user.name || "Usuario"}
            className="w-8 h-8 rounded-full"
          />
        ) : (
          <div className="w-8 h-8 bg-gold-100 rounded-full flex items-center justify-center">
            <UserIcon className="w-4 h-4 text-gold-600" />
          </div>
        )}
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 py-2 z-50">
          <div className="px-4 py-2 border-b border-gray-200">
            <p className="font-medium text-gray-900">{session.user?.name}</p>
            <p className="text-sm text-gray-500">{session.user?.email}</p>
          </div>

          <Link
            href="/cuenta/perfil"
            className="flex items-center space-x-2 px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
            onClick={() => setIsOpen(false)}
          >
            <UserIcon className="w-4 h-4" />
            <span>Mi perfil</span>
          </Link>

          <Link
            href="/cuenta/pedidos"
            className="flex items-center space-x-2 px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
            onClick={() => setIsOpen(false)}
          >
            <ShoppingBag className="w-4 h-4" />
            <span>Mis pedidos</span>
          </Link>

          <Link
            href="/cuenta/direcciones"
            className="flex items-center space-x-2 px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
            onClick={() => setIsOpen(false)}
          >
            <Settings className="w-4 h-4" />
            <span>Direcciones</span>
          </Link>

          <div className="border-t border-gray-200 mt-2 pt-2">
            <button
              onClick={() => {
                setIsOpen(false);
                signOut({ callbackUrl: "/" });
              }}
              className="flex items-center space-x-2 w-full px-4 py-2 text-sm text-red-600 hover:bg-red-50"
            >
              <LogOut className="w-4 h-4" />
              <span>Cerrar sesión</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

interface HeaderProps {
  className?: string;
}

export default function Header({ className }: HeaderProps) {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { data: session } = useSession();

  return (
    <header className={cn("sticky top-0 z-50 w-full border-b bg-white/95 shadow-sm backdrop-blur supports-[backdrop-filter]:bg-white/60", className)}>
      <div className="container mx-auto flex h-16 items-center justify-between px-4 sm:px-6 lg:px-8">
        {/* Logo */}
        <Link href="/" className="font-serif text-2xl font-bold text-gray-900 hover:text-gold-600 transition-colors">
          MOKSHA
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex flex-grow justify-center">
          <ul className="flex space-x-8">
            {navigation.map((item) => (
              <li key={item.name}>
                <Link
                  href={item.href}
                  className="text-gray-700 hover:text-gold-600 transition-colors font-sans text-sm font-medium"
                >
                  {item.name}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        {/* Actions - Desktop & Mobile */}
        <div className="flex items-center space-x-4">

          {/* User Account */}
          <UserMenu />

          {/* Shopping Cart */}
          <CartButton />

          {/* Admin: Upload product */}
          {session?.user?.role === "ADMIN" && (
            <Link href="/admin/new-product">
              <Button variant="outline" size="sm">Subir producto</Button>
            </Link>
          )}

          {/* Mobile Menu Trigger */}
          <Sheet open={isMobileMenuOpen} onOpenChange={setIsMobileMenuOpen}>
            <SheetTrigger asChild>
              <IconButton
                icon={Menu}
                className="md:hidden"
                aria-label="Abrir menú"
              />
            </SheetTrigger>
            <SheetContent side="right" className="w-72 sm:w-80">
              <SheetTitle className="sr-only">Menú de navegación</SheetTitle>
              <nav className="flex flex-col space-y-6 mt-8">
                {navigation.map((item) => (
                  <Link
                    key={item.name}
                    href={item.href}
                    className="text-xl text-gray-800 hover:text-gold-600 transition-colors font-serif"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    {item.name}
                  </Link>
                ))}
                <div className="pt-4 border-t border-gray-200">
                  {!session && (
                    <Link href="/auth/signin" onClick={() => setIsMobileMenuOpen(false)}>
                      <Button className="w-full btn-gold">Iniciar sesión</Button>
                    </Link>
                  )}
                </div>
              </nav>
            </SheetContent>
          </Sheet>
        </div>
      </div>

      {/* Cart Sidebar (Assumes it's always rendered and controlled by cartStore) */}
      <Cart />
    </header>
  );
}