"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Minus, Plus, X, ShoppingBag } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";
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
    // Simulate API call delay
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
      className="flex space-x-4 py-4 border-b border-gray-100 last:border-b-0"
    >
      

      {/* Product Image */}
      <Link href={`/producto/${item.slug}`} className="flex-shrink-0">
        <div className="relative w-16 h-16 bg-gray-50 rounded-lg overflow-hidden">
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
          <h4 className="font-medium text-gray-900 hover:text-gold-600 transition-colors line-clamp-2">
            {item.name}
          </h4>
        </Link>

        {selectedVariants && (
          <p className="text-sm text-gray-500 mt-1">{selectedVariants}</p>
        )}

        <div className="flex items-center justify-between mt-2">
          <span className="font-semibold text-gray-900">
            ${item.price.toLocaleString('es-AR')}
          </span>

          {/* Quantity Controls */}
          <div className="flex items-center space-x-2">
            <div className="flex items-center border border-gray-200 rounded-md">
              <button
                onClick={() => handleQuantityChange(item.quantity - 1)}
                disabled={item.quantity <= 1 || isUpdating}
                className="p-1 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
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
                className="p-1 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                aria-label="Aumentar cantidad"
              >
                <Plus className="w-3 h-3" />
              </button>
            </div>

            <IconButton
              icon={X}
              size="sm"
              onClick={() => onRemove(item.id)}
              className="text-gray-400 hover:text-red-500"
              aria-label="Remover producto"
            />
          </div>
        </div>

        {/* Subtotal */}
        <div className="text-sm text-gray-600 mt-1">
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
  const shippingThreshold = 50000; // Free shipping over $50,000
  const shipping = subtotal >= shippingThreshold ? 0 : 5000;
  const total = subtotal + shipping;

  const handleCheckout = () => {
    closeCart();
    // Navigate to checkout
    window.location.href = '/checkout';
  };

  return (
    <Sheet open={isOpen} onOpenChange={closeCart}>
      <SheetContent side="right" className="w-full sm:max-w-lg flex flex-col">
        <SheetHeader className="border-b border-gray-100 pb-4">
          <SheetTitle className="flex items-center space-x-2">
            <ShoppingBag className="w-5 h-5" />
            <span>Carrito de Compras</span>
            <span className="text-sm font-normal text-gray-500">
              ({items.length} {items.length === 1 ? 'producto' : 'productos'})
            </span>
          </SheetTitle>
        </SheetHeader>

        {items.length === 0 ? (
          <div className="flex-1 flex flex-col items-center justify-center text-center py-12">
            <ShoppingBag className="w-16 h-16 text-gray-300 mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              Tu carrito está vacío
            </h3>
            <p className="text-gray-500 mb-6">
              Descubre nuestras joyas premium y agrega tus favoritas.
            </p>
            <Button onClick={closeCart} asChild>
              <Link href="/coleccion">Explorar Colección</Link>
            </Button>
          </div>
        ) : (
          <>
            {/* Cart Items */}
            <div className="flex-1 overflow-y-auto py-4">
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
            <div className="border-t border-gray-100 pt-4 space-y-4">
              {/* Shipping Notice */}
              {subtotal < shippingThreshold && (
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
                  <p className="text-sm text-blue-800">
                    Agrega ${(shippingThreshold - subtotal).toLocaleString('es-AR')} más para envío gratuito
                  </p>
                </div>
              )}

              {/* Totals */}
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span>Subtotal</span>
                  <span>${subtotal.toLocaleString('es-AR')}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span>Envío</span>
                  <span className={shipping === 0 ? 'text-green-600' : ''}>
                    {shipping === 0 ? 'Gratis' : `$${shipping.toLocaleString('es-AR')}`}
                  </span>
                </div>
                <div className="flex justify-between font-semibold text-lg border-t border-gray-200 pt-2">
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
                  className="w-full"
                  asChild
                >
                  <Link href="/coleccion">Continuar Comprando</Link>
                </Button>
                <Button
                  variant="ghost"
                  onClick={clearCart}
                  className="w-full text-red-600 hover:text-red-700 hover:bg-red-50"
                >
                  Vaciar Carrito
                </Button>
              </div>

              {/* Trust Indicators */}
              <div className="text-center text-xs text-gray-500 space-y-1">
                <p>✓ Pagos seguros con encriptación SSL</p>
                <p>✓ Envío gratuito en compras mayores a $50.000</p>
                <p>✓ Devoluciones gratuitas por 30 días</p>
              </div>
            </div>
          </>
        )}
      </SheetContent>
    </Sheet>
  );
}