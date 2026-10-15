"use client";

import { useState } from "react";
import { CheckCircle, CreditCard, Mail, MapPin, Phone, Truck } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import {
  formatCurrency,
  getPaymentMethodLabel,
  isCardPaymentMethod,
} from "@/lib/orders";
import type {
  CheckoutItem,
  CheckoutOrderResponse,
  PaymentInfo,
  ShippingInfo,
} from "../types";

interface ReviewStepProps {
  shippingData: ShippingInfo;
  paymentData: PaymentInfo;
  items: CheckoutItem[];
  onComplete: (order: CheckoutOrderResponse) => void;
  onBack: () => void;
  className?: string;
}

export function ReviewStep({ shippingData, paymentData, items, onComplete, onBack, className }: ReviewStepProps) {
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const subtotal = items.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const shippingCost = shippingData.shippingMethod === "express" ? 12000 : 5000;
  const total = subtotal + shippingCost;
  const paymentLabel = getPaymentMethodLabel(paymentData.paymentMethod);

  const handleCompleteOrder = async () => {
    setIsProcessing(true);
    setError(null);

    try {
      const response = await fetch("/api/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          shippingData,
          paymentData,
          items,
        }),
      });

      const payload = await response.json().catch(() => null);

      if (!response.ok) {
        throw new Error(payload?.message || "No se pudo crear el pedido.");
      }

      onComplete(payload.order as CheckoutOrderResponse);
    } catch (err: any) {
      setError(err?.message || "No se pudo crear el pedido.");
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className={cn("max-w-4xl mx-auto text-foreground", className)}>
      <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
        <div className="space-y-6 lg:col-span-2">
          <div>
            <h3 className="mb-4 text-xl font-serif font-light text-foreground">Revisar y confirmar</h3>

            <div className="mb-4 rounded-2xl bg-card border border-border p-5 shadow-sm">
              <div className="mb-3 flex items-center space-x-2 border-b border-border/50 pb-2">
                <MapPin className="h-5 w-5 text-gold-600 dark:text-gold-400" />
                <h4 className="font-medium text-foreground">Dirección de envío</h4>
              </div>
              <div className="space-y-1 text-sm text-muted-foreground font-sans">
                <p className="font-medium text-foreground">
                  {shippingData.firstName} {shippingData.lastName}
                </p>
                <p>{shippingData.address1}</p>
                {shippingData.address2 && <p>{shippingData.address2}</p>}
                <p>
                  {shippingData.city}, {shippingData.state} {shippingData.zipCode}
                </p>
                <p>Argentina</p>
              </div>
              <div className="mt-3 flex items-center space-x-2 pt-2 border-t border-border/40">
                <Phone className="h-4 w-4 text-gold-600/70 dark:text-gold-400/70" />
                <span className="text-sm text-muted-foreground">{shippingData.phone}</span>
              </div>
              <div className="flex items-center space-x-2 mt-1">
                <Mail className="h-4 w-4 text-gold-600/70 dark:text-gold-400/70" />
                <span className="text-sm text-muted-foreground">{shippingData.email}</span>
              </div>
            </div>

            <div className="mb-4 rounded-2xl bg-card border border-border p-5 shadow-sm">
              <div className="mb-3 flex items-center space-x-2 border-b border-border/50 pb-2">
                <Truck className="h-5 w-5 text-gold-600 dark:text-gold-400" />
                <h4 className="font-medium text-foreground">Método de envío</h4>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-muted-foreground">
                  {shippingData.shippingMethod === "express" ? "Envío express" : "Envío estándar"}
                </span>
                <span className="text-sm font-medium text-foreground">{formatCurrency(shippingCost)}</span>
              </div>
              <p className="mt-1 text-xs text-muted-foreground/80 font-sans">
                {shippingData.shippingMethod === "express" ? "2-3 días hábiles" : "5-7 días hábiles"}
              </p>
            </div>

            <div className="rounded-2xl bg-card border border-border p-5 shadow-sm">
              <div className="mb-3 flex items-center space-x-2 border-b border-border/50 pb-2">
                <CreditCard className="h-5 w-5 text-gold-600 dark:text-gold-400" />
                <h4 className="font-medium text-foreground">Método de pago</h4>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-muted-foreground">{paymentLabel}</span>
                {isCardPaymentMethod(paymentData.paymentMethod) && paymentData.cardNumber ? (
                  <span className="text-sm font-medium text-foreground">
                    •••• •••• •••• {paymentData.cardNumber.slice(-4)}
                  </span>
                ) : (
                  <span className="text-sm font-medium text-foreground">
                    {paymentData.paymentMethod === "MERCADO_PAGO"
                      ? "Cobro online"
                      : paymentData.paymentMethod === "TRANSFERENCIA"
                        ? "Pago pendiente"
                        : "Abono coordinado"}
                  </span>
                )}
              </div>
              {isCardPaymentMethod(paymentData.paymentMethod) && paymentData.cardholderName && (
                <p className="mt-1 text-xs text-muted-foreground">{paymentData.cardholderName}</p>
              )}
            </div>
          </div>
        </div>

        <div className="lg:col-span-1">
          <div className="sticky top-4 rounded-2xl bg-card border border-border p-6 shadow-sm">
            <h4 className="mb-4 font-serif font-semibold text-lg text-foreground border-b border-border/50 pb-2">
              Resumen del pedido
            </h4>

            <div className="space-y-2.5 text-sm">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Subtotal</span>
                <span className="font-medium text-foreground">{formatCurrency(subtotal)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Envío</span>
                <span className="font-medium text-foreground">{formatCurrency(shippingCost)}</span>
              </div>
              <div className="mt-3 flex justify-between border-t border-border pt-3 text-lg font-serif font-semibold text-foreground">
                <span>Total</span>
                <span>{formatCurrency(total)}</span>
              </div>
            </div>

            <div className="mt-6 space-y-3">
              <Button
                onClick={handleCompleteOrder}
                disabled={isProcessing}
                className="w-full btn-gold text-white cursor-pointer shadow-md"
                size="lg"
              >
                {isProcessing ? (
                  <>
                    <div className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
                    Procesando...
                  </>
                ) : (
                  <>
                    <CheckCircle className="mr-2 h-4 w-4" />
                    Confirmar pedido
                  </>
                )}
              </Button>

              <Button
                type="button"
                variant="outline"
                onClick={onBack}
                disabled={isProcessing}
                className="w-full border-border text-foreground hover:bg-muted cursor-pointer"
              >
                Volver
              </Button>
            </div>

            <div className="mt-4 text-center text-xs text-muted-foreground">
              <p>Al confirmar, aceptas nuestros términos y condiciones.</p>
            </div>

            {error && (
              <div className="mt-4 rounded-xl border border-red-500/30 bg-red-500/10 px-4 py-3 text-sm text-red-600 dark:text-red-400">
                {error}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
