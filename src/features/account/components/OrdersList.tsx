"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Package, Truck, CheckCircle, Clock, Eye, RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

interface Order {
  id: string;
  orderNumber: string;
  status: 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled';
  total: number;
  createdAt: string;
  items: Array<{
    id: string;
    name: string;
    quantity: number;
    price: number;
    image: string;
  }>;
  trackingNumber?: string;
}

const statusConfig = {
  pending: {
    label: 'Pendiente',
    color: 'bg-yellow-100 text-yellow-800',
    icon: Clock,
  },
  processing: {
    label: 'Procesando',
    color: 'bg-blue-100 text-blue-800',
    icon: RefreshCw,
  },
  shipped: {
    label: 'Enviado',
    color: 'bg-purple-100 text-purple-800',
    icon: Truck,
  },
  delivered: {
    label: 'Entregado',
    color: 'bg-green-100 text-green-800',
    icon: CheckCircle,
  },
  cancelled: {
    label: 'Cancelado',
    color: 'bg-red-100 text-red-800',
    icon: Package,
  },
};

// Mock data - replace with API call
const mockOrders: Order[] = [
  {
    id: '1',
    orderNumber: 'MOK-001',
    status: 'delivered',
    total: 125000,
    createdAt: '2024-01-15T10:30:00Z',
    items: [
      {
        id: '1',
        name: 'Anillo Clásico de Oro',
        quantity: 1,
        price: 85000,
        image: '/placeholder-product.jpg',
      },
      {
        id: '2',
        name: 'Pulsera Elegante',
        quantity: 1,
        price: 40000,
        image: '/placeholder-product.jpg',
      },
    ],
    trackingNumber: 'TRK123456789',
  },
  {
    id: '2',
    orderNumber: 'MOK-002',
    status: 'shipped',
    total: 65000,
    createdAt: '2024-01-10T14:20:00Z',
    items: [
      {
        id: '3',
        name: 'Aros Geométricos',
        quantity: 2,
        price: 32500,
        image: '/placeholder-product.jpg',
      },
    ],
    trackingNumber: 'TRK987654321',
  },
  {
    id: '3',
    orderNumber: 'MOK-003',
    status: 'processing',
    total: 180000,
    createdAt: '2024-01-08T09:15:00Z',
    items: [
      {
        id: '4',
        name: 'Pendientes de Diamante',
        quantity: 1,
        price: 180000,
        image: '/placeholder-product.jpg',
      },
    ],
  },
];

export function OrdersList() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Simulate API call
    const fetchOrders = async () => {
      setLoading(true);
      // In real app: await fetch('/api/orders')
      setTimeout(() => {
        setOrders(mockOrders);
        setLoading(false);
      }, 1000);
    };

    fetchOrders();
  }, []);

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('es-AR', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  if (loading) {
    return (
      <div className="space-y-4">
        {Array.from({ length: 3 }).map((_, i) => (
          <div key={i} className="bg-white rounded-lg border border-gray-200 p-6">
            <div className="animate-pulse space-y-4">
              <div className="flex justify-between items-start">
                <div className="space-y-2">
                  <div className="h-4 bg-gray-200 rounded w-24"></div>
                  <div className="h-3 bg-gray-200 rounded w-32"></div>
                </div>
                <div className="h-6 bg-gray-200 rounded w-20"></div>
              </div>
              <div className="h-16 bg-gray-200 rounded"></div>
              <div className="flex justify-between">
                <div className="h-4 bg-gray-200 rounded w-16"></div>
                <div className="h-4 bg-gray-200 rounded w-20"></div>
              </div>
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (orders.length === 0) {
    return (
      <div className="bg-white rounded-lg border border-gray-200 p-12 text-center">
        <Package className="w-16 h-16 text-gray-300 mx-auto mb-4" />
        <h3 className="text-lg font-medium text-gray-900 mb-2">
          No tienes pedidos aún
        </h3>
        <p className="text-gray-600 mb-6">
          Tus pedidos aparecerán aquí una vez que realices tu primera compra.
        </p>
        <Button asChild className="bg-gold-600 hover:bg-gold-700">
          <Link href="/coleccion">Explorar Colección</Link>
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {orders.map((order) => {
        const statusInfo = statusConfig[order.status];
        const StatusIcon = statusInfo.icon;

        return (
          <div key={order.id} className="bg-white rounded-lg border border-gray-200 p-6">
            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between mb-4">
              <div className="space-y-1">
                <div className="flex items-center space-x-3">
                  <h3 className="text-lg font-semibold text-gray-900">
                    Pedido #{order.orderNumber}
                  </h3>
                  <Badge className={cn("flex items-center space-x-1", statusInfo.color)}>
                    <StatusIcon className="w-3 h-3" />
                    <span>{statusInfo.label}</span>
                  </Badge>
                </div>
                <p className="text-sm text-gray-600">
                  {formatDate(order.createdAt)}
                </p>
              </div>

              <div className="mt-4 lg:mt-0 flex items-center space-x-4">
                <div className="text-right">
                  <p className="text-sm text-gray-600">Total</p>
                  <p className="text-lg font-semibold text-gray-900">
                    ${order.total.toLocaleString('es-AR')}
                  </p>
                </div>
                <Button variant="outline" size="sm" asChild>
                  <Link href={`/cuenta/pedidos/${order.id}`}>
                    <Eye className="w-4 h-4 mr-2" />
                    Ver Detalles
                  </Link>
                </Button>
              </div>
            </div>

            <div className="border-t border-gray-200 pt-4">
              <div className="flex items-center space-x-4 text-sm text-gray-600">
                <span>{order.items.length} producto{order.items.length !== 1 ? 's' : ''}</span>
                {order.trackingNumber && (
                  <>
                    <span>•</span>
                    <span>Tracking: {order.trackingNumber}</span>
                  </>
                )}
              </div>

              <div className="mt-3 flex space-x-4 overflow-x-auto">
                {order.items.slice(0, 3).map((item) => (
                  <div key={item.id} className="flex items-center space-x-3 min-w-0 flex-shrink-0">
                    <div className="w-12 h-12 bg-gray-100 rounded-lg flex items-center justify-center flex-shrink-0">
                      <Package className="w-6 h-6 text-gray-400" />
                    </div>
                    <div className="min-w-0">
                      <p className="text-sm font-medium text-gray-900 truncate">
                        {item.name}
                      </p>
                      <p className="text-xs text-gray-600">
                        {item.quantity}x • ${item.price.toLocaleString('es-AR')}
                      </p>
                    </div>
                  </div>
                ))}
                {order.items.length > 3 && (
                  <div className="flex items-center text-sm text-gray-500">
                    +{order.items.length - 3} más
                  </div>
                )}
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}