"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { CheckCircle, Mail, Package, Truck } from "lucide-react";
import { Button } from "@/components/ui/button";
import { formatCurrency, getOrderStatusLabel, getPaymentMethodLabel } from "@/lib/orders";
import type { CheckoutOrderResponse } from "@/features/checkout/types";

export function CheckoutSuccessClient() {
  const searchParams = useSearchParams();
  const orderId = searchParams.get("orderId");
  const [order, setOrder] = useState<CheckoutOrderResponse | null>(null);
  const [loading, setLoading] = useState(Boolean(orderId));
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!orderId) {
      setLoading(false);
      return;
    }

    const controller = new AbortController();

    async function loadOrder() {
      try {
        const response = await fetch(`/api/orders/${orderId}`, { signal: controller.signal });
        const payload = await response.json().catch(() => null);

        if (!response.ok) {
          throw new Error(payload?.message || "No se pudo cargar el pedido.");
        }

        setOrder(payload.order as CheckoutOrderResponse);
      } catch (err: any) {
        if (err?.name === "AbortError") return;
        setError(err?.message || "No se pudo cargar el pedido.");
      } finally {
        setLoading(false);
      }
    }

    loadOrder();

    return () => controller.abort();
  }, [orderId]);

  return (
    <div className="flex min-h-screen items-center justify-center bg-transparent px-4 py-12 text-foreground">
      <div className="w-full max-w-md text-center">
        <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-full bg-emerald-500/15 text-emerald-600 dark:text-emerald-400">
          <CheckCircle className="h-8 w-8" />
        </div>

        <h1 className="mb-2 text-2xl md:text-3xl font-serif font-light text-foreground">
          {loading ? "Confirmando pedido..." : "¡Pedido confirmado!"}
        </h1>
        <p className="mb-8 text-muted-foreground font-sans text-sm md:text-base">
          Gracias por tu compra. Hemos recibido tu pedido y lo estamos procesando.
        </p>

        <div className="mb-8 rounded-2xl border border-border bg-card p-6 shadow-sm">
          <h2 className="mb-4 font-serif font-medium text-lg text-foreground border-b border-border/50 pb-2">
            Detalles del pedido
          </h2>

          {loading ? (
            <p className="text-sm text-muted-foreground">Estamos recuperando el resumen del pedido...</p>
          ) : error ? (
            <p className="text-sm text-red-600 dark:text-red-400">{error}</p>
          ) : order ? (
            <div className="space-y-3 text-sm">
              <div className="flex justify-between gap-4">
                <span className="text-muted-foreground">Número de pedido:</span>
                <span className="font-medium text-foreground">#{order.orderNumber}</span>
              </div>
              <div className="flex justify-between gap-4">
                <span className="text-muted-foreground">Estado:</span>
                <span className="font-medium text-foreground">{getOrderStatusLabel(order.status)}</span>
              </div>
              <div className="flex justify-between gap-4">
                <span className="text-muted-foreground">Método de pago:</span>
                <span className="font-medium text-foreground">{getPaymentMethodLabel(order.paymentMethod)}</span>
              </div>
              <div className="flex justify-between gap-4 border-t border-border/50 pt-2 font-semibold">
                <span className="text-muted-foreground">Total:</span>
                <span className="text-foreground">{formatCurrency(order.total)}</span>
              </div>
            </div>
          ) : (
            <div className="space-y-3 text-sm">
              <div className="flex justify-between gap-4">
                <span className="text-muted-foreground">Número de pedido:</span>
                <span className="font-medium text-foreground">Pendiente de sincronización</span>
              </div>
            </div>
          )}
        </div>

        <div className="mb-8 rounded-2xl border border-gold-500/30 bg-gold-500/10 p-5 text-left">
          <h3 className="mb-3 font-serif font-semibold text-foreground text-sm uppercase tracking-wide">
            ¿Qué sucede ahora?
          </h3>
          <div className="space-y-3 text-sm text-foreground/80 font-sans">
            <div className="flex items-start gap-3">
              <Mail className="mt-0.5 h-4 w-4 flex-shrink-0 text-gold-600 dark:text-gold-400" />
              <span>Recibirás un email de confirmación con los detalles de tu pedido</span>
            </div>
            <div className="flex items-start gap-3">
              <Package className="mt-0.5 h-4 w-4 flex-shrink-0 text-gold-600 dark:text-gold-400" />
              <span>Procesaremos tu pedido en 1-2 días hábiles</span>
            </div>
            <div className="flex items-start gap-3">
              <Truck className="mt-0.5 h-4 w-4 flex-shrink-0 text-gold-600 dark:text-gold-400" />
              <span>Te enviaremos actualizaciones de envío por email</span>
            </div>
          </div>
        </div>

        <div className="space-y-3">
          <Button asChild className="w-full btn-gold text-white cursor-pointer shadow-md">
            <Link href="/cuenta/pedidos">Ver estado del pedido</Link>
          </Button>
          <Button variant="outline" asChild className="w-full border-border text-foreground hover:bg-muted cursor-pointer">
            <Link href="/coleccion">Continuar comprando</Link>
          </Button>
        </div>

        <div className="mt-8 text-center text-xs text-muted-foreground">
          <p>¿Necesitas ayuda? Contactanos:</p>
          <p className="mt-1">
            <a href="mailto:hola@moksha.com.ar" className="text-gold-600 hover:text-gold-700 dark:text-gold-400">
              hola@moksha.com.ar
            </a>
            {" • "}
            <a href="tel:2915666668" className="text-gold-600 hover:text-gold-700 dark:text-gold-400">
              2915666668
            </a>
          </p>
        </div>
      </div>
    </div>
  );
}
