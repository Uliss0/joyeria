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
    <div className="flex min-h-screen items-center justify-center bg-gray-50 px-4 py-12">
      <div className="w-full max-w-md text-center">
        <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-full bg-green-100">
          <CheckCircle className="h-8 w-8 text-green-600" />
        </div>

        <h1 className="mb-2 text-2xl font-bold text-gray-900">
          {loading ? "Confirmando pedido..." : "¡Pedido confirmado!"}
        </h1>
        <p className="mb-8 text-gray-600">
          Gracias por tu compra. Hemos recibido tu pedido y lo estamos procesando.
        </p>

        <div className="mb-8 rounded-lg border border-gray-200 bg-white p-6 shadow-sm">
          <h2 className="mb-4 font-semibold text-gray-900">Detalles del pedido</h2>

          {loading ? (
            <p className="text-sm text-gray-500">Estamos recuperando el resumen del pedido...</p>
          ) : error ? (
            <p className="text-sm text-red-600">{error}</p>
          ) : order ? (
            <div className="space-y-3 text-sm">
              <div className="flex justify-between gap-4">
                <span className="text-gray-600">Número de pedido:</span>
                <span className="font-medium text-gray-900">#{order.orderNumber}</span>
              </div>
              <div className="flex justify-between gap-4">
                <span className="text-gray-600">Estado:</span>
                <span className="font-medium text-gray-900">{getOrderStatusLabel(order.status)}</span>
              </div>
              <div className="flex justify-between gap-4">
                <span className="text-gray-600">Método de pago:</span>
                <span className="font-medium text-gray-900">{getPaymentMethodLabel(order.paymentMethod)}</span>
              </div>
              <div className="flex justify-between gap-4">
                <span className="text-gray-600">Total:</span>
                <span className="font-medium text-gray-900">{formatCurrency(order.total)}</span>
              </div>
            </div>
          ) : (
            <div className="space-y-3 text-sm">
              <div className="flex justify-between gap-4">
                <span className="text-gray-600">Número de pedido:</span>
                <span className="font-medium text-gray-900">Pendiente de sincronización</span>
              </div>
            </div>
          )}
        </div>

        <div className="mb-8 rounded-lg border border-blue-200 bg-blue-50 p-4 text-left">
          <h3 className="mb-3 font-semibold text-blue-900">¿Qué sucede ahora?</h3>
          <div className="space-y-3 text-sm text-blue-800">
            <div className="flex items-start gap-3">
              <Mail className="mt-0.5 h-4 w-4 flex-shrink-0 text-blue-600" />
              <span>Recibirás un email de confirmación con los detalles de tu pedido</span>
            </div>
            <div className="flex items-start gap-3">
              <Package className="mt-0.5 h-4 w-4 flex-shrink-0 text-blue-600" />
              <span>Procesaremos tu pedido en 1-2 días hábiles</span>
            </div>
            <div className="flex items-start gap-3">
              <Truck className="mt-0.5 h-4 w-4 flex-shrink-0 text-blue-600" />
              <span>Te enviaremos actualizaciones de envío por email</span>
            </div>
          </div>
        </div>

        <div className="space-y-3">
          <Button asChild className="w-full bg-gold-600 hover:bg-gold-700">
            <Link href="/cuenta/pedidos">Ver estado del pedido</Link>
          </Button>
          <Button variant="outline" asChild className="w-full">
            <Link href="/coleccion">Continuar comprando</Link>
          </Button>
        </div>

        <div className="mt-8 text-center text-sm text-gray-500">
          <p>¿Necesitas ayuda? Contactanos:</p>
          <p className="mt-1">
            <a href="mailto:hola@moksha.com.ar" className="text-gold-600 hover:text-gold-700">
              hola@moksha.com.ar
            </a>
            {" • "}
            <a href="tel:+541112345678" className="text-gold-600 hover:text-gold-700">
              +54 11 1234-5678
            </a>
          </p>
        </div>
      </div>
    </div>
  );
}
