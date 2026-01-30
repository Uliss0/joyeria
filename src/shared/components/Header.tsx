"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import dynamic from "next/dynamic";
import { ShoppingBag, User, Menu, X, LogOut, Settings, User as UserIcon, ArrowRight, Minus, Plus } from "lucide-react";
import { useSession, signOut } from "next-auth/react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Sheet, SheetContent, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { IconButton } from "./IconButton";
import { Cart } from "./Cart";
import { useCartItemCount, useCartToggleCart } from "@/shared/store/cartStore";
import { cn } from "@/lib/utils";
import ShoppingBagg from "./ShoppingBag"; // Mantenemos el import por si se usa a futuro, aunque esté comentado abajo
import { Badge } from "@/components/ui/badge";
import pantheonImage from "@/assets/pantheon.jpg";
import eclipseImage from "@/assets/eclipse.jpg";
import haloImage from "@/assets/halo.jpg";

const navigation = [
  { name: "Inicio", href: "/" },
  { name: "Colección", href: "/coleccion" },
  { name: "Contacto", href: "/contacto" },
];

interface CartItem {
  id: number;
  name: string;
  price: string;
  image: any;
  quantity: number;
  category: string;
}

const CartButton = dynamic(() => Promise.resolve(() => {
  const itemCount = useCartItemCount();
  const toggleCart = useCartToggleCart();

  return (
    <button
      onClick={toggleCart}
      // Puntos 5 y 8: Quitamos hover bg, agregamos glow (drop-shadow) y cursor-pointer
      className="relative p-2 text-white/95 hover:text-white transition-all duration-300 hover:drop-shadow-[0_0_8px_rgba(255,255,255,0.6)] cursor-pointer"
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
        {/* Punto 6: Estilo glow para iniciar sesión */}
        <Button 
          variant="ghost" 
          size="sm"
          className="text-white/95 hover:text-white hover:bg-transparent hover:drop-shadow-[0_0_8px_rgba(255,255,255,0.6)] transition-all duration-300 cursor-pointer"
        >
          Iniciar sesión
        </Button>
      </Link>
    );
  }

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        // Punto 6 y 8: Glow effect y cursor pointer
        className="flex items-center space-x-2 p-2 text-white/95 hover:text-white rounded-lg transition-all duration-300 hover:drop-shadow-[0_0_8px_rgba(255,255,255,0.6)] cursor-pointer"
        aria-label="Menú de usuario"
      >
        {session.user?.image ? (
          <img
            src={session.user.image}
            alt={session.user.name || "Usuario"}
            className="w-8 h-8 rounded-full"
          />
        ) : (
          // Glow interno para el icono de usuario
          <div className="w-8 h-8 rounded-full flex items-center justify-center border border-white/20 hover:border-white/80 transition-all">
            <UserIcon className="w-4 h-4 text-white" />
          </div>
        )}
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-48 bg-[#222428] text-gray-100 rounded-lg shadow-lg border border-slate-900 py-2 z-50 animate-in fade-in zoom-in-95 duration-200">
          <div className="px-4 py-2 border-b border-slate-700">
            <p className="font-medium text-gray-100">{session.user?.name}</p>
            <p className="text-sm text-gray-300 truncate">{session.user?.email}</p>
          </div>

          <Link
            href="/cuenta/perfil"
            className="flex items-center space-x-2 px-4 py-2 text-sm text-gray-200 hover:bg-slate-700 cursor-pointer"
            onClick={() => setIsOpen(false)}
          >
            <UserIcon className="w-4 h-4" />
            <span>Mi perfil</span>
          </Link>

          <Link
            href="/cuenta/pedidos"
            className="flex items-center space-x-2 px-4 py-2 text-sm text-gray-200 hover:bg-slate-700 cursor-pointer"
            onClick={() => setIsOpen(false)}
          >
            <ShoppingBag className="w-4 h-4" />
            <span>Mis pedidos</span>
          </Link>

          <Link
            href="/cuenta/direcciones"
            className="flex items-center space-x-2 px-4 py-2 text-sm text-gray-200 hover:bg-slate-700 cursor-pointer"
            onClick={() => setIsOpen(false)}
          >
            <Settings className="w-4 h-4" />
            <span>Direcciones</span>
          </Link>

          <div className="border-t border-slate-700 mt-2 pt-2">
            <button
              onClick={() => {
                setIsOpen(false);
                signOut({ callbackUrl: "/" });
              }}
              className="flex items-center space-x-2 w-full px-4 py-2 text-sm text-red-400 hover:bg-red-700/10 cursor-pointer"
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

const Header = () => {
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [offCanvasType, setOffCanvasType] = useState<'favorites' | null>(null);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isShoppingBagOpen, setIsShoppingBagOpen] = useState(false);
  const { data: session } = useSession();
  
  // Shopping bag state with 3 mock items
  const [cartItems, setCartItems] = useState<CartItem[]>([
    {
      id: 1,
      name: "Pantheon",
      price: "€2,850",
      image: pantheonImage,
      quantity: 1,
      category: "Earrings"
    },
    {
      id: 2,
      name: "Eclipse",
      price: "€3,200", 
      image: eclipseImage,
      quantity: 1,
      category: "Bracelets"
    },
    {
      id: 3,
      name: "Halo",
      price: "€1,950",
      image: haloImage, 
      quantity: 1,
      category: "Earrings"
    }
  ]);

  const totalItems = cartItems.reduce((sum, item) => sum + item.quantity, 0);
  
  const updateQuantity = (id: number, newQuantity: number) => {
    if (newQuantity <= 0) {
      setCartItems(items => items.filter(item => item.id !== id));
    } else {
      setCartItems(items => 
        items.map(item => 
          item.id === id ? { ...item, quantity: newQuantity } : item
        )
      );
    }
  };
  
  // Preload dropdown images for faster display
  useEffect(() => {
    const imagesToPreload = [
      "/rings-collection.png",
      "/earrings-collection.png", 
      "/arcus-bracelet.png",
      "/span-bracelet.png",
      "/founders.png"
    ];
    
    imagesToPreload.forEach(src => {
      const img = new Image();
      img.src = src;
    });
  }, []);

  const popularSearches = [
    "Gold Rings",
    "Silver Necklaces", 
    "Pearl Earrings",
    "Designer Bracelets",
    "Wedding Rings",
    "Vintage Collection"
  ];
  
  const navItems = [
    { 
      name: "Shop", 
      href: "/coleccion",
      submenuItems: [
        "Rings",
        "Necklaces", 
        "Earrings",
        "Bracelets",
        "Watches"
      ],
      images: [
        { src: "/rings-collection.png", alt: "Rings Collection", label: "Rings" },
        { src: "/earrings-collection.png", alt: "Earrings Collection", label: "Earrings" }
      ]
    },
    { 
      name: "New in", 
      href: "/category/new-in",
      submenuItems: [
        "This Week's Arrivals",
        "Spring Collection",
        "Featured Designers",
        "Limited Edition",
        "Pre-Orders"
      ],
      images: [
        { src: "/arcus-bracelet.png", alt: "Arcus Bracelet", label: "Arcus Bracelet" },
        { src: "/span-bracelet.png", alt: "Span Bracelet", label: "Span Bracelet" }
      ]
    },
    { 
      name: "Contacto", 
      href: "/contacto",
      submenuItems: [
        "Our Story",
        "Sustainability",
        "Size Guide",
        "Customer Care",
        "Store Locator"
      ],
      images: [
        { src: "/founders.png", alt: "Company Founders", label: "Read our story" }
      ]
    }
  ];

  return (
    <nav 
      // Punto 1: Sticky top-0
      // Punto 3: Border blanco (border-white/95) igual que el texto
      className="sticky top-0 z-50 bg-[#222428] text-white/95 backdrop-blur-md border-b border-white/95 shadow-sm transition-all"
    >
      
      {/* Punto 2: Layout Grid para móvil para evitar superposición Cart/Logo */}
      <div className="grid grid-cols-[auto_1fr_auto] lg:flex lg:items-center lg:justify-between h-16 px-6 relative">
        
        {/* Mobile hamburger button */}
        <div className="flex items-center lg:hidden">
          <button
            className="p-2 -ml-2 text-white/95 hover:text-white transition-colors duration-200 cursor-pointer"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            aria-label="Toggle menu"
          >
            <div className="w-5 h-5 relative">
              <span className={`absolute block w-5 h-px bg-current transform transition-all duration-300 ${
                isMobileMenuOpen ? 'rotate-45 top-2.5' : 'top-1.5'
              }`}></span>
              <span className={`absolute block w-5 h-px bg-current transform transition-all duration-300 top-2.5 ${
                isMobileMenuOpen ? 'opacity-0' : 'opacity-100'
              }`}></span>
              <span className={`absolute block w-5 h-px bg-current transform transition-all duration-300 ${
                isMobileMenuOpen ? '-rotate-45 top-2.5' : 'top-3.5'
              }`}></span>
            </div>
          </button>
        </div>

        {/* Left navigation - Hidden on tablets and mobile */}
        <div className="hidden lg:flex space-x-8">
          {navItems.map((item) => (
            <div
              key={item.name}
              className="relative"
              onMouseEnter={() => setActiveDropdown(item.name)}
              onMouseLeave={() => setActiveDropdown(null)}
            >
              <Link
                href={item.href}
                // Punto 7: Iluminación letras en Hover
                className="text-white/95 hover:text-white transition-all duration-300 text-sm font-light py-6 block hover:drop-shadow-[0_0_8px_rgba(255,255,255,0.8)] cursor-pointer"
              >
                {item.name}
              </Link>
            </div>
          ))}
        </div>

        {/* Center logo - Centrado absoluto en Desktop, centrado de grid en móvil */}
        <div className="flex justify-center items-center lg:absolute lg:left-1/2 lg:transform lg:-translate-x-1/2">
          <Link href="/" className="block cursor-pointer">
            {/* Logo con efecto glow suave al hover */}
            <span className="text-xl font-light tracking-[0.3em] text-white hover:drop-shadow-[0_0_8px_rgba(255,255,255,0.5)] transition-all">MOKSHA</span>
          </Link>
        </div>

        {/* Right icons */}
        <div className="flex items-center space-x-2 justify-end">
          {/* Favorites Icon */}
          <button 
            // Punto 6 y 8: Glow effect y cursor pointer
            className="hidden lg:block p-2 text-white/95 hover:text-white transition-all duration-300 hover:drop-shadow-[0_0_8px_rgba(255,255,255,0.6)] cursor-pointer"
            aria-label="Favorites"
            onClick={() => setOffCanvasType('favorites')}
          >
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="w-5 h-5">
              <path strokeLinecap="round" strokeLinejoin="round" d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12Z" />
            </svg>
          </button>
          
          <CartButton />
          
          {session?.user?.role === "ADMIN" && (
            <Link href="/admin/new-product">
              <Button variant="outline" size="sm" className="cursor-pointer">Subir producto</Button>
            </Link>
          )}
          <UserMenu />  
        </div>
      </div>

      {/* Full width dropdown */}
      {/* Punto 4: Animaciones de despliegue */}
      {activeDropdown && (
        <div 
          className="absolute top-full left-0 right-0 bg-[#222428] border-b border-slate-800 z-40 animate-in fade-in slide-in-from-top-2 duration-300 ease-out shadow-2xl"
          onMouseEnter={() => setActiveDropdown(activeDropdown)}
          onMouseLeave={() => setActiveDropdown(null)}
        >
          <div className="px-6 py-8">
            <div className="flex justify-between w-full max-w-7xl mx-auto">
              {/* Left side - Menu items */}
              <div className="flex-1">
                <ul className="space-y-2">
                   {navItems
                     .find(item => item.name === activeDropdown)
                     ?.submenuItems.map((subItem, index) => (
                      <li key={index}>
                        <Link 
                          href={activeDropdown === "About" ? `/about/${subItem.toLowerCase().replace(/\s+/g, '-')}` : `/category/${subItem.toLowerCase()}`}
                          className="text-white/80 hover:text-white transition-colors duration-200 text-sm font-light block py-2 hover:translate-x-1 cursor-pointer"
                        >
                          {subItem}
                        </Link>
                      </li>
                   ))}
                </ul>
              </div>

              {/* Right side - Images */}
              <div className="flex space-x-6">
                {navItems
                  .find(item => item.name === activeDropdown)
                  ?.images.map((image, index) => {
                    // Determine the link destination based on dropdown and image
                    let linkTo = "/";
                    if (activeDropdown === "Shop") {
                      if (image.label === "Rings") linkTo = "/category/rings";
                      else if (image.label === "Earrings") linkTo = "/category/earrings";
                    } else if (activeDropdown === "New in") {
                      if (image.label === "Arcus Bracelet") linkTo = "/product/arcus-bracelet";
                      else if (image.label === "Span Bracelet") linkTo = "/product/span-bracelet";
                    } else if (activeDropdown === "About") {
                      linkTo = "/about/our-story";
                    }
                    
                    return (
                      <Link key={index} href={linkTo} className="w-[400px] h-[280px] cursor-pointer group relative overflow-hidden block rounded-sm">
                        <img 
                          src={image.src}
                          alt={image.alt}
                          className="w-full h-full object-cover transition-all duration-700 group-hover:scale-105 opacity-90 group-hover:opacity-100"
                        />
                        {(activeDropdown === "Shop" || activeDropdown === "New in" || activeDropdown === "About") && (
                          <div className="absolute bottom-4 left-4 text-white text-xs font-light flex items-center gap-1 drop-shadow-md">
                            <span>{image.label}</span>
                            <ArrowRight size={12} className="group-hover:translate-x-2 transition-transform" />
                          </div>
                        )}
                      </Link>
                    );
                  })}
              </div>
            </div>
          </div>
        </div>
      )}
      
      {/* Search overlay */}
      {isSearchOpen && (
        <div 
          className="absolute top-full left-0 right-0 bg-[#222428] border-b border-slate-800 z-40 animate-in fade-in slide-in-from-top-2"
        >
          <div className="px-6 py-8">
            <div className="max-w-2xl mx-auto">
              {/* Search input */}
              <div className="relative mb-8">
                <div className="flex items-center border-b border-border pb-2">
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="w-5 h-5 text-white mr-3">
                    <path strokeLinecap="round" strokeLinejoin="round" d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z" />
                  </svg>
                  <input
                    type="text"
                    placeholder="Search for jewelry..."
                    className="flex-1 bg-transparent text-white placeholder:text-slate-400 outline-none text-lg"
                    autoFocus
                  />
                </div>
              </div>

              {/* Popular searches */}
              <div>
                <h3 className="text-white text-sm font-light mb-4">Popular Searches</h3>
                <div className="flex flex-wrap gap-3">
                  {popularSearches.map((search, index) => (
                    <button
                      key={index}
                      className="text-white hover:text-primary text-sm font-light py-2 px-4 border border-slate-700 rounded-full transition-colors duration-200 hover:border-primary cursor-pointer"
                    >
                      {search}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Mobile navigation menu */}
      {isMobileMenuOpen && (
        <div className="lg:hidden absolute top-full left-0 right-0 bg-[#222428] border-b border-slate-800 z-50 h-[calc(100vh-4rem)] overflow-y-auto animate-in slide-in-from-top-2 fade-in duration-300">
          <div className="px-6 py-8">
            <div className="space-y-6">
              {navItems.map((item, index) => (
                <div key={item.name}>
                  <Link
                    href={item.href}
                    className="text-white hover:text-primary transition-colors duration-200 text-lg font-light block py-2 cursor-pointer"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    {item.name}
                  </Link>
                   <div className="mt-3 pl-4 space-y-2 border-l border-slate-700 ml-1">
                     {item.submenuItems.map((subItem, subIndex) => (
                       <Link
                         key={subIndex}
                         href={item.name === "About" ? `/about/${subItem.toLowerCase().replace(/\s+/g, '-')}` : `/category/${subItem.toLowerCase()}`}
                         className="text-slate-300 hover:text-primary text-sm font-light block py-1 cursor-pointer"
                         onClick={() => setIsMobileMenuOpen(false)}
                       >
                         {subItem}
                       </Link>
                     ))}
                   </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
      
      {/* Shopping Bag Component (Si se usa a futuro) */}
      {/* <ShoppingBagg ... /> */}
      
      <Cart />
      
      {/* Favorites Off-canvas overlay */}
      {offCanvasType === 'favorites' && (
        <div className="fixed inset-0 z-[100] h-screen">
          {/* Backdrop */}
          <div 
            className="absolute inset-0 bg-black/50 backdrop-blur-sm h-screen"
            onClick={() => setOffCanvasType(null)}
          />
          
          {/* Off-canvas panel */}
          <div className="absolute right-0 top-0 h-screen w-96 bg-[#222428] border-l border-slate-800 animate-slide-in-right flex flex-col shadow-2xl">
            {/* Header */}
            <div className="flex items-center justify-between p-6 border-b border-white/10">
              <h2 className="text-lg font-light text-white">Your Favorites</h2>
              <button
                onClick={() => setOffCanvasType(null)}
                className="p-2 text-white hover:text-red-400 transition-colors cursor-pointer"
                aria-label="Close"
              >
                <X size={20} />
              </button>
            </div>
            
            {/* Content */}
            <div className="p-6">
              <p className="text-slate-400 text-sm mb-6">
                You haven't added any favorites yet. Browse our collection and click the heart icon to save items you love.
              </p>
            </div>
          </div>
        </div>
      )}
    </nav>
  );
};

export default Header;