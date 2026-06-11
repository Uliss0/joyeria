"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { Minus, Plus, X, ShoppingBag } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { IconButton } from "./IconButton";
import { useCartItems, useCartSubtotal, useCartUpdateQuantity, useCartRemoveItem, useCartClearCart, useCartCloseCart, useCartIsOpen } from "@/shared/store/cartStore";
import { cn } from "@/lib/utils";

interface CartItemProps {
  item: {
    id: string;
    productId: string;
    name: string;
    slug: string;
    price: number;
    quantity: number;
    image: string;
    variants: Record<string, string>;
    maxStock: number;
  };
  onUpdateQuantity: (itemId: string, quantity: number) => void;
  onRemove: (itemId: string) => void;
}

const CartItem = ({ item, onUpdateQuantity, onRemove }: CartItemProps) => {
  const [isUpdating, setIsUpdating] = useState(false);

  const handleQuantityChange = async (newQuantity: number) => {
    if (newQuantity < 1 || newQuantity > item.maxStock) return;

    setIsUpdating(true);
    await new Promise(resolve => setTimeout(resolve, 200));
    onUpdateQuantity(item.id, newQuantity);
    setIsUpdating(false);
  };

  const selectedVariants = Object.entries(item.variants)
    .map(([key, value]) => `${key}: ${value}`)
    .join(', ');

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="flex space-x-4 py-4 border-b border-border/40 last:border-b-0"
    >
      {/* Product Image */}
      <Link href={`/producto/${item.slug}`} className="flex-shrink-0">
        <div className="relative w-16 h-16 bg-muted/40 rounded-lg overflow-hidden">
          <Image
            src={item.image}
            alt={item.name}
            fill
            className="object-cover"
            sizes="64px"
          />
        </div>
      </Link>

      {/* Product Details */}
      <div className="flex-1 min-w-0">
        <Link href={`/producto/${item.slug}`}>
          <h4 className="font-medium text-foreground hover:text-gold-600 transition-colors line-clamp-2">
            {item.name}
          </h4>
        </Link>

        {selectedVariants && (
          <p className="text-sm text-muted-foreground mt-1">{selectedVariants}</p>
        )}

        <div className="flex items-center justify-between mt-2">
          <span className="font-semibold text-foreground">
            ${item.price.toLocaleString('es-AR')}
          </span>

          {/* Quantity Controls */}
          <div className="flex items-center space-x-2">
            <div className="flex items-center border border-border rounded-md">
              <button
                onClick={() => handleQuantityChange(item.quantity - 1)}
                disabled={item.quantity <= 1 || isUpdating}
                className="p-1 hover:bg-muted disabled:opacity-50 disabled:cursor-not-allowed"
                aria-label="Disminuir cantidad"
              >
                <Minus className="w-3 h-3" />
              </button>
              <span className={cn(
                "px-3 py-1 text-sm font-medium min-w-[2rem] text-center",
                isUpdating && "opacity-50"
              )}>
                {item.quantity}
              </span>
              <button
                onClick={() => handleQuantityChange(item.quantity + 1)}
                disabled={item.quantity >= item.maxStock || isUpdating}
                className="p-1 hover:bg-muted disabled:opacity-50 disabled:cursor-not-allowed"
                aria-label="Aumentar cantidad"
              >
                <Plus className="w-3 h-3" />
              </button>
            </div>

            <IconButton
              icon={X}
              size="sm"
              onClick={() => onRemove(item.id)}
              className="text-muted-foreground hover:text-red-500"
              aria-label="Remover producto"
            />
          </div>
        </div>

        {/* Subtotal */}
        <div className="text-sm text-muted-foreground mt-1">
          Subtotal: ${(item.price * item.quantity).toLocaleString('es-AR')}
        </div>
      </div>
    </motion.div>
  );
};

interface CartProps {
  className?: string;
}

export function Cart({ className }: CartProps) {
  const items = useCartItems();
  const subtotal = useCartSubtotal();
  const isOpen = useCartIsOpen();
  const updateQuantity = useCartUpdateQuantity();
  const removeItem = useCartRemoveItem();
  const clearCart = useCartClearCart();
  const closeCart = useCartCloseCart();
  const shippingThreshold = 50000;
  const shipping = subtotal >= shippingThreshold ? 0 : 5000;
  const total = subtotal + shipping;

  // Detect active theme to match panel bg like the favorites panel
  const [isLight, setIsLight] = useState(false);
  useEffect(() => {
    setIsLight(document.documentElement.classList.contains("light"));
    const observer = new MutationObserver(() => {
      setIsLight(document.documentElement.classList.contains("light"));
    });
    observer.observe(document.documentElement, { attributes: true, attributeFilter: ["class"] });
    return () => observer.disconnect();
  }, []);

  const panelBg = isLight ? "#faf8f5" : "#222428";
  const panelColor = isLight ? "#1e1a14" : "#f5efe4";
  const borderColor = isLight ? "rgba(193,150,89,0.18)" : "rgba(255,255,255,0.08)";

  const handleCheckout = () => {
    closeCart();
    window.location.href = '/checkout';
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] h-screen">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/50 h-screen"
        onClick={closeCart}
      />

      {/* Panel */}
      <div
        className="absolute right-0 top-0 h-screen w-full sm:w-[28rem] animate-slide-in-right flex flex-col shadow-2xl"
        style={{ backgroundColor: panelBg, color: panelColor }}
      >

        {/* Header */}
        <div className="flex items-center gap-3 p-6" style={{ borderBottom: `1px solid ${borderColor}` }}>
          <ShoppingBag className="w-5 h-5 text-primary flex-shrink-0" />
          <h2 className="font-serif text-xl font-semibold tracking-wide flex-1" style={{ color: panelColor }}>
            Carrito de Compras
          </h2>
          <span className="text-xs font-sans font-medium opacity-60">
            {items.length} {items.length === 1 ? 'producto' : 'productos'}
          </span>
          <button
            onClick={closeCart}
            className="p-1.5 opacity-60 hover:opacity-100 transition-opacity"
            aria-label="Cerrar carrito"
          >
            <X size={18} />
          </button>
        </div>

        {items.length === 0 ? (
          <div className="flex-1 flex flex-col items-center justify-center text-center py-12 px-6">
            <ShoppingBag className="w-16 h-16 mb-4 opacity-20" />
            <h3 className="text-lg font-medium mb-2">
              Tu carrito está vacío
            </h3>
            <p className="opacity-60 mb-6">
              Descubre nuestras joyas premium y agrega tus favoritas.
            </p>
            <Button
              onClick={closeCart}
              className="bg-gold-600 hover:bg-gold-700 text-white font-medium"
              asChild
            >
              <Link href="/coleccion">Explorar Colección</Link>
            </Button>
          </div>
        ) : (
          <>
            {/* Cart Items */}
            <div className="flex-1 overflow-y-auto px-6 py-4">
              <AnimatePresence>
                {items.map((item) => (
                  <CartItem
                    key={item.id}
                    item={item}
                    onUpdateQuantity={updateQuantity}
                    onRemove={removeItem}
                  />
                ))}
              </AnimatePresence>
            </div>

            {/* Cart Summary */}
            <div className="px-6 pb-6 pt-4 space-y-4" style={{ borderTop: `1px solid ${borderColor}` }}>
              {/* Shipping Notice */}
              {subtotal < shippingThreshold && (
                <div className="bg-primary/10 rounded-lg p-3">
                  <p className="text-sm">
                    Agrega ${(shippingThreshold - subtotal).toLocaleString('es-AR')} más para envío gratuito
                  </p>
                </div>
              )}

              {/* Totals */}
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="opacity-60">Subtotal</span>
                  <span>${subtotal.toLocaleString('es-AR')}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="opacity-60">Envío</span>
                  <span className={shipping === 0 ? 'text-green-500' : ''}>
                    {shipping === 0 ? 'Gratis' : `$${shipping.toLocaleString('es-AR')}`}
                  </span>
                </div>
                <div className="flex justify-between font-semibold text-base pt-2" style={{ borderTop: `1px solid ${borderColor}` }}>
                  <span>Total</span>
                  <span>${total.toLocaleString('es-AR')}</span>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="space-y-3">
                <Button
                  onClick={handleCheckout}
                  className="w-full bg-gold-600 hover:bg-gold-700 text-white py-3"
                  size="lg"
                >
                  Proceder al Checkout
                </Button>
                <Button
                  variant="outline"
                  onClick={closeCart}
                  className="w-full font-medium"
                  style={{ borderColor: '#c19659', color: '#c19659' }}
                  asChild
                >
                  <Link href="/coleccion">Continuar Comprando</Link>
                </Button>
                <Button
                  variant="ghost"
                  onClick={clearCart}
                  className="w-full text-red-500 hover:text-red-600 hover:bg-red-500/10"
                >
                  Vaciar Carrito
                </Button>
              </div>

              {/* Trust Indicators */}
              <div className="text-center text-xs opacity-50 space-y-1">
                <p>✓ Pagos seguros con encriptación SSL</p>
                <p>✓ Envío gratuito en compras mayores a $50.000</p>
                <p>✓ Devoluciones gratuitas por 30 días</p>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}