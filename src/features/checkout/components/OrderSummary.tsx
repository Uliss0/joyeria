"use client";

import Image from "next/image";
import { useCartItems, useCartSubtotal, useCartCloseCart } from "@/shared/store/cartStore";
import { cn } from "@/lib/utils";

interface OrderSummaryProps {
  className?: string;
  showEditButton?: boolean;
  onEditCart?: () => void;
}

export function OrderSummary({ className, showEditButton = true, onEditCart }: OrderSummaryProps) {
  const items = useCartItems();
  const subtotal = useCartSubtotal();

  const shippingThreshold = 50000; // Free shipping over $50,000
  const shipping = subtotal >= shippingThreshold ? 0 : 5000;
  const total = subtotal + shipping;

  return (
    <div className={cn("bg-gray-50 rounded-lg p-6", className)}>
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-gray-900">Resumen de la orden</h3>
        {showEditButton && onEditCart && (
          <button
            onClick={onEditCart}
            className="text-sm text-gold-600 hover:text-gold-700 underline"
          >
            Editar carrito
          </button>
        )}
      </div>

      {/* Cart Items */}
      <div className="space-y-4 mb-6">
        {items.map((item) => (
          <div key={item.id} className="flex space-x-3">
            <div className="relative w-16 h-16 bg-gray-100 rounded-lg overflow-hidden flex-shrink-0">
              <Image
                src={item.image}
                alt={item.name}
                fill
                className="object-cover"
                sizes="64px"
              />
            </div>
            <div className="flex-1 min-w-0">
              <h4 className="font-medium text-gray-900 truncate">{item.name}</h4>
              <div className="text-sm text-gray-600">
                {Object.entries(item.variants).map(([key, value]) => (
                  <span key={key}>{key}: {value}</span>
                )).join(' • ')}
              </div>
              <div className="flex justify-between items-center mt-1">
                <span className="text-sm text-gray-500">Cant: {item.quantity}</span>
                <span className="font-medium text-gray-900">
                  ${(item.price * item.quantity).toLocaleString('es-AR')}
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Totals */}
      <div className="border-t border-gray-200 pt-4 space-y-2">
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
        {shipping === 0 && (
          <p className="text-xs text-green-600">
            ¡Envío gratuito aplicado!
          </p>
        )}
        <div className="flex justify-between font-semibold text-lg border-t border-gray-200 pt-2">
          <span>Total</span>
          <span>${total.toLocaleString('es-AR')}</span>
        </div>
      </div>

      {/* Trust Indicators */}
      <div className="mt-6 pt-4 border-t border-gray-200">
        <div className="flex items-center justify-center space-x-6 text-xs text-gray-500">
          <div className="flex items-center space-x-1">
            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd" />
            </svg>
            <span>Pagos seguros</span>
          </div>
          <div className="flex items-center space-x-1">
            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
            </svg>
            <span>Envío garantizado</span>
          </div>
        </div>
      </div>
    </div>
  );
}