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
      setError(err?.message || "Ocurrió un error al cargar tus pedidos.");
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
        {[1, 2].map((placeholder) => (
          <div
            key={placeholder}
            className="rounded-3xl border border-border/80 bg-card/95 p-6 animate-pulse"
          >
            <div className="space-y-4">
              <div className="flex justify-between">
                <div className="space-y-2">
                  <div className="h-5 w-32 rounded-lg bg-accent" />
                  <div className="h-3 w-40 rounded-lg bg-accent/60" />
                </div>
                <div className="h-6 w-20 rounded-lg bg-accent" />
              </div>
              <div className="h-16 rounded-2xl bg-accent/40" />
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (error) {
    return (
      <div className="rounded-3xl border border-red-500/30 bg-red-500/10 p-6 text-sm text-red-500 dark:text-red-400">
        <p className="font-medium">{error}</p>
        <Button variant="outline" className="mt-4 border-border" onClick={() => void fetchOrders()}>
          <RefreshCw className="mr-2 h-4 w-4" />
          Reintentar
        </Button>
      </div>
    );
  }

  if (orders.length === 0) {
    return (
      <div className="rounded-3xl border border-border/80 bg-card/95 p-10 text-center shadow-sm backdrop-blur-sm">
        <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-2xl border border-gold-500/20 bg-gold-500/10 text-gold-500">
          <ShoppingBag className="h-8 w-8" />
        </div>
        <h3 className="mb-2 text-xl font-serif font-light text-foreground">Todavía no tenés pedidos</h3>
        <p className="mb-6 text-sm text-muted-foreground max-w-md mx-auto">
          Tus compras aparecerán aquí apenas confirmes tu primer pedido en la tienda.
        </p>
        <Button asChild variant="gold" className="btn-gold">
          <Link href="/coleccion">Explorar colección</Link>
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-4 text-foreground">
      <div className="flex justify-end">
        <Button variant="outline" className="rounded-xl border-border" onClick={() => void fetchOrders()}>
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
            className="overflow-hidden rounded-3xl border border-border/80 bg-card/95 shadow-sm transition-shadow hover:shadow-md backdrop-blur-sm"
          >
            <div className="flex flex-col gap-6 p-6 lg:flex-row lg:items-start lg:justify-between">
              <div className="space-y-4 flex-1">
                <div className="flex flex-wrap items-center gap-3">
                  <h3 className="text-lg font-serif font-medium text-foreground">Pedido #{order.orderNumber}</h3>
                  <Badge className={cn("border px-3 py-1", getOrderStatusColor(order.status))}>
                    {getOrderStatusLabel(order.status)}
                  </Badge>
                  <Badge variant="outline" className="border-border bg-accent/50 text-foreground">
                    {getPaymentMethodLabel(order.paymentMethod)}
                  </Badge>
                </div>

                <p className="text-sm text-muted-foreground">
                  {new Date(order.createdAt).toLocaleDateString("es-AR", {
                    day: "2-digit",
                    month: "long",
                    year: "numeric",
                  })}
                  {" • "}
                  {order.shippingAddress.city}, {order.shippingAddress.state}
                </p>

                <div className="flex flex-wrap items-center gap-3 text-sm text-muted-foreground">
                  <span>{itemsCount} producto{itemsCount !== 1 ? "s" : ""}</span>
                  {order.trackingNumber && (
                    <span className="inline-flex items-center gap-1 text-gold-500 font-medium">
                      <Truck className="h-4 w-4" />
                      {order.trackingNumber}
                    </span>
                  )}
                </div>

                {firstItem && (
                  <div className="flex items-center gap-3 rounded-2xl border border-border/60 bg-background/50 p-3">
                    <div className="flex h-14 w-14 items-center justify-center rounded-xl bg-card border border-border/50 text-muted-foreground">
                      <Package className="h-6 w-6" />
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="truncate text-sm font-medium text-foreground">{firstItem.name}</p>
                      <p className="text-xs text-muted-foreground">
                        {firstItem.quantity} unidad{firstItem.quantity !== 1 ? "es" : ""} · {formatCurrency(firstItem.price)}
                      </p>
                    </div>
                    {order.items.length > 1 && (
                      <div className="ml-auto rounded-full bg-accent/60 border border-border px-3 py-1 text-xs font-medium text-foreground shadow-sm">
                        +{order.items.length - 1} más
                      </div>
                    )}
                  </div>
                )}
              </div>

              <div className="flex flex-col gap-3 lg:min-w-[220px] lg:items-end">
                <div className="text-left lg:text-right">
                  <p className="text-xs uppercase tracking-wider text-muted-foreground">Total</p>
                  <p className="text-2xl font-serif font-light text-foreground">{formatCurrency(order.total)}</p>
                </div>

                <Button asChild variant="outline" className="w-full lg:w-auto rounded-xl border-border">
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
