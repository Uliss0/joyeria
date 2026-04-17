"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, CalendarDays, CreditCard, Package, Truck } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { formatCurrency, getOrderStatusColor, getOrderStatusLabel, getPaymentMethodLabel } from "@/lib/orders";

type OrderDetails = {
  id: string;
  orderNumber: string;
  status: string;
  total: number;
  subtotal: number;
  shipping: number;
  paymentMethod: string | null;
  trackingNumber: string | null;
  shippedAt: string | null;
  deliveredAt: string | null;
  createdAt: string;
  shippingAddress: {
    firstName: string;
    lastName: string;
    address1: string;
    address2: string | null;
    city: string;
    state: string;
    zipCode: string;
    country: string;
    phone: string | null;
  };
  items: Array<{
    id: string;
    productId: string;
    name: string;
    slug: string;
    quantity: number;
    price: number;
    total: number;
    image: string | null;
  }>;
};

export default function OrderDetailsPage() {
  const params = useParams<{ orderId: string }>();
  const router = useRouter();
  const [order, setOrder] = useState<OrderDetails | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const controller = new AbortController();

    async function loadOrder() {
      setLoading(true);
      setError(null);

      try {
        const response = await fetch(`/api/orders/${params.orderId}`, {
          credentials: "include",
          signal: controller.signal,
        });
        const payload = await response.json().catch(() => null);

        if (!response.ok) {
          throw new Error(payload?.message || "No se pudo cargar el pedido.");
        }

        setOrder(payload.order as OrderDetails);
      } catch (err: any) {
        if (err?.name === "AbortError") return;
        setError(err?.message || "No se pudo cargar el pedido.");
      } finally {
        setLoading(false);
      }
    }

    if (params.orderId) {
      void loadOrder();
    }

    return () => controller.abort();
  }, [params.orderId]);

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <Button variant="outline" size="icon" onClick={() => router.back()}>
          <ArrowLeft className="h-4 w-4" />
        </Button>
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Detalle del pedido</h1>
          <p className="text-gray-600">Seguimiento completo del pedido y sus movimientos.</p>
        </div>
      </div>

      {loading ? (
        <div className="rounded-2xl border border-gray-200 bg-white p-8 text-sm text-gray-500">
          Cargando pedido...
        </div>
      ) : error ? (
        <div className="rounded-2xl border border-red-200 bg-red-50 p-6 text-sm text-red-700">
          {error}
        </div>
      ) : order ? (
        <div className="grid gap-6 xl:grid-cols-[1.1fr_0.9fr]">
          <section className="space-y-4 rounded-3xl border border-gray-200 bg-white p-6 shadow-sm">
            <div className="flex flex-wrap items-center gap-3">
              <h2 className="text-xl font-semibold text-gray-900">Pedido #{order.orderNumber}</h2>
              <Badge className={getOrderStatusColor(order.status)}>{getOrderStatusLabel(order.status)}</Badge>
              <Badge variant="outline" className="border-gray-200 bg-gray-50 text-gray-700">
                {getPaymentMethodLabel(order.paymentMethod)}
              </Badge>
            </div>

            <div className="grid gap-3 sm:grid-cols-3">
              <div className="rounded-2xl border border-gray-100 bg-gray-50 p-4">
                <p className="text-xs uppercase tracking-[0.2em] text-gray-500">Fecha</p>
                <div className="mt-2 flex items-center gap-2 text-sm font-medium text-gray-900">
                  <CalendarDays className="h-4 w-4 text-gray-500" />
                  {new Date(order.createdAt).toLocaleDateString("es-AR")}
                </div>
              </div>
              <div className="rounded-2xl border border-gray-100 bg-gray-50 p-4">
                <p className="text-xs uppercase tracking-[0.2em] text-gray-500">Total</p>
                <p className="mt-2 text-sm font-medium text-gray-900">{formatCurrency(order.total)}</p>
              </div>
              <div className="rounded-2xl border border-gray-100 bg-gray-50 p-4">
                <p className="text-xs uppercase tracking-[0.2em] text-gray-500">Tracking</p>
                <p className="mt-2 text-sm font-medium text-gray-900">{order.trackingNumber || "Sin asignar"}</p>
              </div>
            </div>

            <div className="rounded-2xl border border-gray-100 bg-gray-50 p-4">
              <div className="mb-3 flex items-center gap-2 text-sm font-medium text-gray-900">
                <Truck className="h-4 w-4 text-gray-500" />
                Direccion de envio
              </div>
              <div className="space-y-1 text-sm text-gray-600">
                <p>
                  {order.shippingAddress.firstName} {order.shippingAddress.lastName}
                </p>
                <p>{order.shippingAddress.address1}</p>
                {order.shippingAddress.address2 && <p>{order.shippingAddress.address2}</p>}
                <p>
                  {order.shippingAddress.city}, {order.shippingAddress.state} {order.shippingAddress.zipCode}
                </p>
                <p>{order.shippingAddress.country}</p>
                {order.shippingAddress.phone && <p>{order.shippingAddress.phone}</p>}
              </div>
            </div>

            <div className="space-y-3">
              <h3 className="flex items-center gap-2 text-lg font-semibold text-gray-900">
                <Package className="h-4 w-4 text-gray-500" />
                Productos
              </h3>
              <div className="space-y-3">
                {order.items.map((item) => (
                  <div key={item.id} className="flex items-center gap-4 rounded-2xl border border-gray-100 bg-white p-4">
                    <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-gray-100 text-gray-400">
                      <Package className="h-6 w-6" />
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="truncate font-medium text-gray-900">{item.name}</p>
                      <p className="text-sm text-gray-500">
                        {item.quantity} x {formatCurrency(item.price)}
                      </p>
                    </div>
                    <p className="text-sm font-semibold text-gray-900">{formatCurrency(item.total)}</p>
                  </div>
                ))}
              </div>
            </div>
          </section>

          <aside className="space-y-4 rounded-3xl border border-gray-200 bg-white p-6 shadow-sm">
            <div className="flex items-center gap-2 text-lg font-semibold text-gray-900">
              <CreditCard className="h-5 w-5 text-gray-500" />
              Estado actual
            </div>

            <div className="space-y-3 rounded-2xl border border-gray-100 bg-gray-50 p-4 text-sm text-gray-600">
              <div className="flex items-center justify-between">
                <span>Confirmado</span>
                <span className={order.status !== "PENDING" ? "font-medium text-green-700" : ""}>
                  {order.status === "PENDING" ? "Pendiente" : "Listo"}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span>Enviado</span>
                <span className={order.status === "SHIPPED" || order.status === "DELIVERED" ? "font-medium text-green-700" : ""}>
                  {order.shippedAt ? new Date(order.shippedAt).toLocaleDateString("es-AR") : "Pendiente"}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span>Entregado</span>
                <span className={order.status === "DELIVERED" ? "font-medium text-green-700" : ""}>
                  {order.deliveredAt ? new Date(order.deliveredAt).toLocaleDateString("es-AR") : "Pendiente"}
                </span>
              </div>
            </div>

            <Button asChild className="w-full bg-gold-600 hover:bg-gold-700">
              <Link href="/coleccion">Seguir comprando</Link>
            </Button>
          </aside>
        </div>
      ) : null}
    </div>
  );
}
