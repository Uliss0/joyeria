"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Eye, Package, RefreshCw, ShoppingBag, Truck } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import {
  formatCurrency,
  getOrderStatusColor,
  getOrderStatusLabel,
  getPaymentMethodLabel,
} from "@/lib/orders";

interface Order {
  id: string;
  orderNumber: string;
  status: string;
  total: number;
  paymentMethod: string | null;
  createdAt: string;
  trackingNumber?: string | null;
  shippingAddress: {
    firstName: string;
    lastName: string;
    city: string;
    state: string;
    zipCode: string;
  };
  items: Array<{
    id: string;
    productId: string;
    name: string;
    slug: string;
    image: string | null;
    quantity: number;
    price: number;
  }>;
}

export function OrdersList() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchOrders = async () => {
    setLoading(true);
    setError(null);

    try {
      const response = await fetch("/api/orders", { credentials: "include" });
      const payload = await response.json().catch(() => null);

      if (!response.ok) {
        throw new Error(payload?.message || "No se pudieron cargar tus pedidos.");
      }

      setOrders(Array.isArray(payload?.orders) ? payload.orders : []);
    } catch (err: any) {
      setError(err?.message || "No se pudieron cargar tus pedidos.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    void fetchOrders();
  }, []);

  if (loading) {
    return (
      <div className="space-y-4">
        {Array.from({ length: 3 }).map((_, index) => (
          <div key={index} className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
            <div className="animate-pulse space-y-4">
              <div className="flex items-start justify-between gap-4">
                <div className="space-y-2">
                  <div className="h-4 w-28 rounded bg-gray-200" />
                  <div className="h-3 w-40 rounded bg-gray-200" />
                </div>
                <div className="h-6 w-20 rounded bg-gray-200" />
              </div>
              <div className="h-16 rounded bg-gray-200" />
              <div className="flex justify-between">
                <div className="h-4 w-16 rounded bg-gray-200" />
                <div className="h-4 w-20 rounded bg-gray-200" />
              </div>
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (error) {
    return (
      <div className="rounded-2xl border border-red-200 bg-red-50 p-6 text-sm text-red-700">
        <p>{error}</p>
        <Button variant="outline" className="mt-4" onClick={() => void fetchOrders()}>
          <RefreshCw className="mr-2 h-4 w-4" />
          Reintentar
        </Button>
      </div>
    );
  }

  if (orders.length === 0) {
    return (
      <div className="rounded-2xl border border-gray-200 bg-white p-10 text-center shadow-sm">
        <ShoppingBag className="mx-auto mb-4 h-16 w-16 text-gray-300" />
        <h3 className="mb-2 text-lg font-semibold text-gray-900">Todavía no tenés pedidos</h3>
        <p className="mb-6 text-gray-600">
          Tus compras aparecerán acá apenas confirmes tu primer pedido.
        </p>
        <Button asChild className="bg-gold-600 hover:bg-gold-700">
          <Link href="/coleccion">Explorar colección</Link>
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-end">
        <Button variant="outline" onClick={() => void fetchOrders()}>
          <RefreshCw className="mr-2 h-4 w-4" />
          Actualizar
        </Button>
      </div>

      {orders.map((order) => {
        const itemsCount = order.items.reduce((sum, item) => sum + item.quantity, 0);
        const firstItem = order.items[0];

        return (
          <article
            key={order.id}
            className="overflow-hidden rounded-3xl border border-gray-200 bg-white shadow-sm transition-shadow hover:shadow-md"
          >
            <div className="flex flex-col gap-6 p-6 lg:flex-row lg:items-start lg:justify-between">
              <div className="space-y-4">
                <div className="flex flex-wrap items-center gap-3">
                  <h3 className="text-lg font-semibold text-gray-900">Pedido #{order.orderNumber}</h3>
                  <Badge className={cn("border px-3 py-1", getOrderStatusColor(order.status))}>
                    {getOrderStatusLabel(order.status)}
                  </Badge>
                  <Badge variant="outline" className="border-gray-200 bg-gray-50 text-gray-700">
                    {getPaymentMethodLabel(order.paymentMethod)}
                  </Badge>
                </div>

                <p className="text-sm text-gray-600">
                  {new Date(order.createdAt).toLocaleDateString("es-AR", {
                    day: "2-digit",
                    month: "long",
                    year: "numeric",
                  })}
                  {" • "}
                  {order.shippingAddress.city}, {order.shippingAddress.state}
                </p>

                <div className="flex flex-wrap items-center gap-3 text-sm text-gray-600">
                  <span>{itemsCount} producto{itemsCount !== 1 ? "s" : ""}</span>
                  {order.trackingNumber && (
                    <span className="inline-flex items-center gap-1">
                      <Truck className="h-4 w-4" />
                      {order.trackingNumber}
                    </span>
                  )}
                </div>

                {firstItem && (
                  <div className="flex items-center gap-3 rounded-2xl border border-gray-100 bg-gray-50 p-3">
                    <div className="flex h-14 w-14 items-center justify-center rounded-xl bg-white text-gray-400">
                      <Package className="h-6 w-6" />
                    </div>
                    <div className="min-w-0">
                      <p className="truncate text-sm font-medium text-gray-900">{firstItem.name}</p>
                      <p className="text-xs text-gray-500">
                        {firstItem.quantity} unidad{firstItem.quantity !== 1 ? "es" : ""} · {formatCurrency(firstItem.price)}
                      </p>
                    </div>
                    {order.items.length > 1 && (
                      <div className="ml-auto rounded-full bg-white px-3 py-1 text-xs font-medium text-gray-700 shadow-sm">
                        +{order.items.length - 1} más
                      </div>
                    )}
                  </div>
                )}
              </div>

              <div className="flex flex-col gap-3 lg:min-w-[220px] lg:items-end">
                <div className="text-right">
                  <p className="text-sm text-gray-500">Total</p>
                  <p className="text-2xl font-semibold text-gray-900">{formatCurrency(order.total)}</p>
                </div>

                <Button asChild variant="outline" className="w-full lg:w-auto">
                  <Link href={`/cuenta/pedidos/${order.id}`}>
                    <Eye className="mr-2 h-4 w-4" />
                    Ver detalles
                  </Link>
                </Button>
              </div>
            </div>
          </article>
        );
      })}
    </div>
  );
}
