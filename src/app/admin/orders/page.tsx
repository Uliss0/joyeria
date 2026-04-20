"use client";

import { useEffect, useMemo, useState, useTransition } from "react";
import { CalendarRange, Clock3, Filter, RefreshCw, Truck } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import {
  formatCurrency,
  getOrderStatusColor,
  getOrderStatusLabel,
  getPaymentMethodLabel,
  ORDER_STATUS_OPTIONS,
} from "@/lib/orders";
import type { PresetRange } from "@/lib/admin-date-range";

type AdminOrdersResponse = {
  appliedFilters: {
    preset: PresetRange;
    status: string | null;
    from: string | null;
    to: string | null;
  };
  summary: {
    totalOrders: number;
    totalSales: number;
  };
  counts: Array<{
    status: string;
    count: number;
  }>;
  orders: Array<{
    id: string;
    orderNumber: string;
    status: string;
    total: number;
    paymentMethod: string | null;
    trackingNumber: string | null;
    shippedAt: string | null;
    deliveredAt: string | null;
    createdAt: string;
    customer: {
      name: string | null;
      email: string;
    };
    shippingAddress: {
      firstName: string;
      lastName: string;
      city: string;
      state: string;
      zipCode: string;
      phone: string | null;
    };
    itemsCount: number;
    itemsPreview: string[];
  }>;
};

type FilterState = {
  preset: PresetRange;
  from: string;
  to: string;
  status: "ALL" | (typeof ORDER_STATUS_OPTIONS)[number];
};

const presetOptions: Array<{ value: Exclude<PresetRange, "custom">; label: string }> = [
  { value: "7d", label: "Ultimos 7 dias" },
  { value: "30d", label: "Ultimos 30 dias" },
  { value: "90d", label: "Ultimos 90 dias" },
  { value: "month", label: "Mes actual" },
  { value: "year", label: "Ano actual" },
  { value: "all", label: "Todo el historial" },
];

const statusLabels: Record<"ALL" | (typeof ORDER_STATUS_OPTIONS)[number], string> = {
  ALL: "Todos los estados",
  PENDING: "Pendiente",
  CONFIRMED: "Confirmado",
  PROCESSING: "Preparando",
  SHIPPED: "Enviado",
  DELIVERED: "Entregado",
  CANCELLED: "Cancelado",
  REFUNDED: "Reembolsado",
};

const dateFormatter = new Intl.DateTimeFormat("es-AR", {
  day: "2-digit",
  month: "long",
  year: "numeric",
});

function toDateInputValue(date: Date) {
  const year = date.getFullYear();
  const month = `${date.getMonth() + 1}`.padStart(2, "0");
  const day = `${date.getDate()}`.padStart(2, "0");

  return `${year}-${month}-${day}`;
}

function getInitialRange() {
  const today = new Date();
  const from = new Date(today);
  from.setDate(today.getDate() - 29);

  return {
    from: toDateInputValue(from),
    to: toDateInputValue(today),
  };
}

function buildFiltersLabel(filters: AdminOrdersResponse["appliedFilters"]) {
  if (filters.preset === "all") {
    return filters.status && filters.status !== "ALL"
      ? `Historial completo, filtrado por ${statusLabels[filters.status as keyof typeof statusLabels] ?? filters.status}.`
      : "Historial completo de pedidos.";
  }

  if (!filters.from || !filters.to) {
    return "Mostrando el periodo seleccionado.";
  }

  const dateLabel = `Entre ${dateFormatter.format(new Date(filters.from))} y ${dateFormatter.format(new Date(filters.to))}`;

  if (filters.status && filters.status !== "ALL") {
    return `${dateLabel}, solo ${statusLabels[filters.status as keyof typeof statusLabels] ?? filters.status}.`;
  }

  return `${dateLabel}.`;
}

function buildPeriodCaption(filters: FilterState) {
  if (filters.preset === "all") return "Mostramos todo el historial visible en el panel operativo.";
  if (filters.preset === "custom") {
    return "El rango personalizado queda resaltado y se aplica apenas completas ambas fechas.";
  }
  return "El rango temporal ayuda a concentrarse en lo que entra, sale y se entrega.";
}

export default function AdminOrdersPage() {
  const initialRange = getInitialRange();
  const [selectedPreset, setSelectedPreset] = useState<PresetRange>("30d");
  const [customFrom, setCustomFrom] = useState(initialRange.from);
  const [customTo, setCustomTo] = useState(initialRange.to);
  const [selectedStatus, setSelectedStatus] = useState<FilterState["status"]>("ALL");
  const [appliedFilters, setAppliedFilters] = useState<FilterState>({
    preset: "30d",
    from: initialRange.from,
    to: initialRange.to,
    status: "ALL",
  });
  const [data, setData] = useState<AdminOrdersResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [drafts, setDrafts] = useState<Record<string, { status: string; trackingNumber: string }>>({});
  const [savingOrderId, setSavingOrderId] = useState<string | null>(null);
  const [selectedOrderId, setSelectedOrderId] = useState<string | null>(null);
  const [orderDialogOpen, setOrderDialogOpen] = useState(false);
  const [isPending, startTransition] = useTransition();

  const loadOrders = async (filters = appliedFilters) => {
    setLoading(true);
    setError(null);

    try {
      const params = new URLSearchParams({
        preset: filters.preset,
        take: "100",
      });

      if (filters.preset === "custom") {
        params.set("from", filters.from);
        params.set("to", filters.to);
      }

      if (filters.status !== "ALL") {
        params.set("status", filters.status);
      }

      const response = await fetch(`/api/admin/orders?${params.toString()}`, { credentials: "include" });
      const payload = await response.json().catch(() => null);

      if (!response.ok) {
        throw new Error(payload?.message || "No se pudieron cargar los pedidos.");
      }

      const nextData = payload as AdminOrdersResponse;
      setData(nextData);
      setDrafts(
        Object.fromEntries(
          nextData.orders.map((order) => [
            order.id,
            {
              status: order.status,
              trackingNumber: order.trackingNumber || "",
            },
          ])
        )
      );
    } catch (err: any) {
      setError(err?.message || "No se pudieron cargar los pedidos.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    void loadOrders();
  }, []);

  const statusTotals = useMemo(
    () =>
      ORDER_STATUS_OPTIONS.map((status) => ({
        status,
        label: getOrderStatusLabel(status),
        count: data?.counts.find((entry) => entry.status === status)?.count ?? 0,
      })),
    [data]
  );

  const visibleOrders = data?.summary.totalOrders ?? 0;
  const pendingOrders = statusTotals.find((entry) => entry.status === "PENDING")?.count ?? 0;
  const shippedOrders = statusTotals.find((entry) => entry.status === "SHIPPED")?.count ?? 0;
  const deliveredOrders = statusTotals.find((entry) => entry.status === "DELIVERED")?.count ?? 0;
  const trackedOrders = (data?.orders ?? []).filter((order) => Boolean(order.trackingNumber)).length;
  const activeFiltersLabel = data ? buildFiltersLabel(data.appliedFilters) : "Aplica un rango para empezar a trabajar.";
  const selectedOrder = data?.orders.find((order) => order.id === selectedOrderId) ?? null;

  const updateDraft = (orderId: string, field: "status" | "trackingNumber", value: string) => {
    setDrafts((prev) => ({
      ...prev,
      [orderId]: {
        status: prev[orderId]?.status ?? "",
        trackingNumber: prev[orderId]?.trackingNumber ?? "",
        [field]: value,
      },
    }));
  };

  const saveOrder = (orderId: string) => {
    const draft = drafts[orderId];
    if (!draft?.status) return;

    setSavingOrderId(orderId);

    void (async () => {
      try {
        const response = await fetch(`/api/admin/orders/${orderId}`, {
          method: "PATCH",
          credentials: "include",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            status: draft.status,
            trackingNumber: draft.trackingNumber,
          }),
        });

        const payload = await response.json().catch(() => null);

        if (!response.ok) {
          throw new Error(payload?.message || "No se pudo actualizar el pedido.");
        }

        await loadOrders(appliedFilters);
      } catch (err: any) {
        setError(err?.message || "No se pudo actualizar el pedido.");
      } finally {
        setSavingOrderId(null);
      }
    })();
  };

  const applyPreset = (preset: Exclude<PresetRange, "custom">) => {
    setSelectedPreset(preset);

    const nextFilters = {
      preset,
      from: customFrom,
      to: customTo,
      status: selectedStatus,
    } satisfies FilterState;

    startTransition(() => {
      setAppliedFilters(nextFilters);
    });

    void loadOrders(nextFilters);
  };

  const applyCustomRange = (nextFrom = customFrom, nextTo = customTo) => {
    setSelectedPreset("custom");

    if (!nextFrom || !nextTo) {
      return;
    }

    if (nextFrom > nextTo) {
      setError("La fecha inicial no puede ser mayor a la fecha final.");
      return;
    }

    const nextFilters: FilterState = {
      preset: "custom",
      from: nextFrom,
      to: nextTo,
      status: selectedStatus,
    };

    startTransition(() => {
      setAppliedFilters(nextFilters);
    });

    void loadOrders(nextFilters);
  };

  const applyStatusFilter = (status: FilterState["status"]) => {
    setSelectedStatus(status);

    const nextFilters: FilterState = {
      ...appliedFilters,
      status,
    };

    startTransition(() => {
      setAppliedFilters(nextFilters);
    });

    void loadOrders(nextFilters);
  };

  const openOrderDialog = (orderId: string) => {
    setSelectedOrderId(orderId);
    setOrderDialogOpen(true);
  };

  useEffect(() => {
    if (selectedOrderId && !data?.orders.some((order) => order.id === selectedOrderId)) {
      setOrderDialogOpen(false);
      setSelectedOrderId(null);
    }
  }, [data, selectedOrderId]);

  return (
    <main className="min-h-screen bg-[radial-gradient(circle_at_top,_rgba(212,178,125,0.18),_transparent_30%),linear-gradient(180deg,_#151311_0%,_#0f0d0c_100%)] px-4 py-8 text-stone-100 sm:px-6 lg:px-8">
      <div className="mx-auto flex w-full max-w-7xl flex-col gap-6">
        <section className="overflow-hidden rounded-[2rem] border border-white/10 bg-white/5 shadow-[0_25px_80px_rgba(0,0,0,0.35)] backdrop-blur">
          <div className="grid gap-6 px-6 py-8 lg:grid-cols-[1.25fr_0.95fr] lg:px-8">
            <div className="space-y-4">
              <div className="inline-flex items-center gap-2 rounded-full border border-[#d4b27d]/30 bg-[#d4b27d]/10 px-3 py-1 text-xs uppercase tracking-[0.28em] text-[#f0e6d1]">
                <Filter className="h-3.5 w-3.5" />
                Pedidos
              </div>
              <div className="space-y-3">
                <h1 className="max-w-3xl text-4xl font-semibold tracking-tight text-white lg:text-5xl">
                  Control operativo con rango de tiempo y estado visible.
                </h1>
                <p className="max-w-2xl text-sm leading-6 text-stone-300 sm:text-base">{activeFiltersLabel}</p>
                <p className="max-w-2xl text-xs uppercase tracking-[0.24em] text-stone-400">
                  {buildPeriodCaption(appliedFilters)}
                </p>
              </div>
            </div>

            <div className="rounded-[1.75rem] border border-white/10 bg-black/20 p-5">
              <div className="mb-4 flex items-center gap-2 text-sm font-medium text-stone-200">
                <CalendarRange className="h-4 w-4 text-[#d4b27d]" />
                Filtros de pedidos
              </div>

              <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
                {presetOptions.map((option) => (
                  <Button
                    key={option.value}
                    type="button"
                    variant={selectedPreset === option.value ? "default" : "outline"}
                    className={
                      selectedPreset === option.value
                        ? "justify-start bg-[#c19659] text-black hover:bg-[#d4b27d]"
                        : "justify-start border-white/15 bg-white/5 text-stone-200 hover:bg-white/10 hover:text-white"
                    }
                    onClick={() => applyPreset(option.value)}
                  >
                    {option.label}
                  </Button>
                ))}
              </div>

              <div
                className={`mt-4 grid gap-3 rounded-2xl border p-4 sm:grid-cols-2 ${
                  selectedPreset === "custom" ? "border-amber-400/40 bg-amber-500/10" : "border-white/10 bg-white/5"
                }`}
              >
                <div className="space-y-2">
                  <label
                    className={`text-xs uppercase tracking-[0.2em] ${
                      selectedPreset === "custom" ? "text-amber-200" : "text-stone-400"
                    }`}
                  >
                    Desde
                  </label>
                  <Input
                    type="date"
                    value={customFrom}
                    onChange={(event) => {
                      const nextFrom = event.target.value;
                      setCustomFrom(nextFrom);
                      applyCustomRange(nextFrom, customTo);
                    }}
                    className="border-white/10 bg-black/20 text-stone-100"
                  />
                </div>
                <div className="space-y-2">
                  <label
                    className={`text-xs uppercase tracking-[0.2em] ${
                      selectedPreset === "custom" ? "text-amber-200" : "text-stone-400"
                    }`}
                  >
                    Hasta
                  </label>
                  <Input
                    type="date"
                    value={customTo}
                    onChange={(event) => {
                      const nextTo = event.target.value;
                      setCustomTo(nextTo);
                      applyCustomRange(customFrom, nextTo);
                    }}
                    className="border-white/10 bg-black/20 text-stone-100"
                  />
                </div>
                <p
                  className={`sm:col-span-2 text-xs uppercase tracking-[0.22em] ${
                    selectedPreset === "custom" ? "text-amber-200" : "text-stone-400"
                  }`}
                >
                  Se aplica automaticamente al completar ambos campos.
                </p>
              </div>

              <div className="mt-4 space-y-2">
                <label className="text-xs uppercase tracking-[0.2em] text-stone-400">Estado</label>
                <Select value={selectedStatus} onValueChange={(value) => applyStatusFilter(value as FilterState["status"])}>
                  <SelectTrigger className="border-white/10 bg-black/20 text-stone-100">
                    <SelectValue placeholder="Todos los estados" />
                  </SelectTrigger>
                  <SelectContent className="border-white/10 bg-[#181513] text-stone-100 shadow-2xl">
                    {Object.entries(statusLabels).map(([value, label]) => (
                      <SelectItem key={value} value={value}>
                        {label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <Button
                type="button"
                variant="outline"
                className="mt-4 w-full border-white/15 bg-white/5 text-stone-200 hover:bg-white/10 hover:text-white"
                onClick={() => void loadOrders(appliedFilters)}
              >
                <RefreshCw className="mr-2 h-4 w-4" />
                Actualizar pedidos
              </Button>
            </div>
          </div>
        </section>

        <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          <Card className="border-white/10 bg-white/5 text-white">
            <CardHeader className="pb-2">
              <CardDescription className="text-stone-400">Pedidos visibles</CardDescription>
              <CardTitle className="text-3xl text-white">{loading ? "..." : visibleOrders}</CardTitle>
            </CardHeader>
            <CardContent className="text-sm text-stone-400">Pedidos dentro del rango y estado seleccionados.</CardContent>
          </Card>

          <Card className="border-white/10 bg-white/5 text-white">
            <CardHeader className="pb-2">
              <CardDescription className="text-stone-400">Pendientes</CardDescription>
              <CardTitle className="text-3xl text-white">{loading ? "..." : pendingOrders}</CardTitle>
            </CardHeader>
            <CardContent className="text-sm text-stone-400">Todavia esperan confirmacion operativa.</CardContent>
          </Card>

          <Card className="border-white/10 bg-white/5 text-white">
            <CardHeader className="pb-2">
              <CardDescription className="text-stone-400">Enviados</CardDescription>
              <CardTitle className="text-3xl text-white">{loading ? "..." : shippedOrders}</CardTitle>
            </CardHeader>
            <CardContent className="text-sm text-stone-400">Pedidos listos para seguimiento con Correo Argentino.</CardContent>
          </Card>

          <Card className="border-white/10 bg-white/5 text-white">
            <CardHeader className="pb-2">
              <CardDescription className="text-stone-400">Entregados</CardDescription>
              <CardTitle className="text-3xl text-white">{loading ? "..." : deliveredOrders}</CardTitle>
            </CardHeader>
            <CardContent className="text-sm text-stone-400">Pedidos cerrados en destino.</CardContent>
          </Card>
        </section>

        <div className="rounded-2xl border border-white/10 bg-black/20 px-4 py-3 text-sm text-stone-300">
          Tracking activo en <span className="font-semibold text-white">{loading ? "..." : trackedOrders}</span> pedidos de la vista actual.
        </div>

        <section className="rounded-[1.75rem] border border-white/10 bg-white/5 p-4">
          <div className="flex flex-wrap items-center gap-2 text-sm text-stone-300">
            <span className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-black/20 px-3 py-1 uppercase tracking-[0.2em] text-stone-400">
              <Filter className="h-3.5 w-3.5" />
              Estado general
            </span>
            {statusTotals.map((entry) => (
              <Badge key={entry.status} variant="outline" className="border-white/10 bg-black/20 text-stone-200">
                {entry.label}: {entry.count}
              </Badge>
            ))}
          </div>
        </section>

        {error && <div className="rounded-2xl border border-red-400/30 bg-red-500/10 px-4 py-3 text-sm text-red-100">{error}</div>}

        <div className="flex flex-wrap items-center justify-between gap-3 text-xs uppercase tracking-[0.24em] text-stone-400">
          <span>Mostrando hasta 100 pedidos</span>
          {isPending ? <span className="text-[#d4b27d]">Actualizando filtros...</span> : null}
        </div>

        <section className="space-y-3">
          {loading ? (
            <div className="rounded-3xl border border-white/10 bg-white/5 p-8 text-sm text-stone-300">Cargando pedidos...</div>
          ) : data?.orders.length ? (
            data.orders.map((order) => {
              const shortPreview = order.itemsPreview.slice(0, 2).join(", ");

              return (
                <button
                  key={order.id}
                  type="button"
                  onClick={() => openOrderDialog(order.id)}
                  className="w-full overflow-hidden rounded-[1.35rem] border border-white/8 bg-black/20 p-4 text-left shadow-[0_16px_50px_rgba(0,0,0,0.18)] transition hover:border-[#d4b27d]/35 hover:bg-white/7"
                >
                  <div className="flex flex-wrap items-start justify-between gap-4">
                    <div className="min-w-0 space-y-2">
                      <div className="flex flex-wrap items-center gap-2">
                        <h3 className="text-base font-semibold text-white">Pedido #{order.orderNumber}</h3>
                        <Badge className={`border px-3 py-1 ${getOrderStatusColor(order.status)}`}>{getOrderStatusLabel(order.status)}</Badge>
                        <Badge variant="outline" className="border-white/10 bg-white/5 text-stone-200">
                          {getPaymentMethodLabel(order.paymentMethod)}
                        </Badge>
                      </div>
                      <p className="truncate text-sm text-stone-300">{order.customer.name || order.customer.email}</p>
                      <p className="text-xs uppercase tracking-[0.18em] text-stone-400">
                        {dateFormatter.format(new Date(order.createdAt))} {order.trackingNumber ? `- Tracking ${order.trackingNumber}` : "- Sin tracking"}
                      </p>
                    </div>

                    <div className="text-right">
                      <p className="text-xs uppercase tracking-[0.22em] text-stone-400">Total</p>
                      <p className="text-lg font-semibold text-white">{formatCurrency(order.total)}</p>
                    </div>
                  </div>

                  <div className="mt-3 grid gap-2 sm:grid-cols-3">
                    <div className="rounded-xl border border-white/10 bg-white/5 px-3 py-2">
                      <p className="text-[11px] uppercase tracking-[0.2em] text-stone-400">Destino</p>
                      <p className="mt-1 text-sm text-stone-200">
                        {order.shippingAddress.city}, {order.shippingAddress.state}
                      </p>
                    </div>
                    <div className="rounded-xl border border-white/10 bg-white/5 px-3 py-2">
                      <p className="text-[11px] uppercase tracking-[0.2em] text-stone-400">Items</p>
                      <p className="mt-1 truncate text-sm text-stone-200">
                        {shortPreview || "Sin detalle visible."}
                        {order.itemsPreview.length > 2 ? ` +${order.itemsPreview.length - 2}` : ""}
                      </p>
                    </div>
                    <div className="rounded-xl border border-white/10 bg-white/5 px-3 py-2">
                      <p className="text-[11px] uppercase tracking-[0.2em] text-stone-400">Editar</p>
                      <p className="mt-1 text-sm text-[#f0e6d1]">Abrir modal de actualizacion</p>
                    </div>
                  </div>
                </button>
              );
            })
          ) : (
            <div className="rounded-3xl border border-white/10 bg-white/5 p-8 text-sm text-stone-300">No hay pedidos para mostrar.</div>
          )}
        </section>

        <Dialog
          open={orderDialogOpen}
          onOpenChange={(open) => {
            setOrderDialogOpen(open);
            if (!open) {
              setSelectedOrderId(null);
            }
          }}
        >
          <DialogContent className="max-h-[90vh] max-w-4xl overflow-y-auto border-white/10 bg-[#15120f] text-stone-100">
            {selectedOrder ? (
              <>
                <DialogHeader>
                  <DialogTitle className="flex flex-wrap items-center gap-2 text-2xl">
                    Pedido #{selectedOrder.orderNumber}
                    <Badge className={`border px-3 py-1 ${getOrderStatusColor(selectedOrder.status)}`}>
                      {getOrderStatusLabel(selectedOrder.status)}
                    </Badge>
                  </DialogTitle>
                  <DialogDescription className="text-stone-300">
                    Actualiza el estado y el tracking desde esta ventana sin salir de la vista de pedidos.
                  </DialogDescription>
                </DialogHeader>

                <div className="grid gap-4 lg:grid-cols-[1.1fr_0.9fr]">
                  <div className="space-y-4">
                    <div className="grid gap-3 md:grid-cols-2">
                      <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
                        <p className="text-xs uppercase tracking-[0.24em] text-stone-400">Cliente</p>
                        <p className="mt-2 font-medium text-white">{selectedOrder.customer.name || "Sin nombre"}</p>
                        <p className="text-sm text-stone-300">{selectedOrder.customer.email}</p>
                      </div>
                      <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
                        <p className="text-xs uppercase tracking-[0.24em] text-stone-400">Destino</p>
                        <p className="mt-2 font-medium text-white">
                          {selectedOrder.shippingAddress.city}, {selectedOrder.shippingAddress.state}
                        </p>
                        <p className="text-sm text-stone-300">
                          {selectedOrder.shippingAddress.firstName} {selectedOrder.shippingAddress.lastName}
                        </p>
                      </div>
                    </div>

                    <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
                      <p className="text-xs uppercase tracking-[0.24em] text-stone-400">Productos</p>
                      <p className="mt-2 text-sm text-stone-200">
                        {selectedOrder.itemsPreview.length ? selectedOrder.itemsPreview.join(", ") : "Sin detalle visible."}
                      </p>
                    </div>

                    {selectedOrder.trackingNumber ? (
                      <div className="rounded-2xl border border-cyan-400/20 bg-cyan-500/10 p-4">
                        <div className="flex items-center gap-2 text-white">
                          <Truck className="h-4 w-4 text-[#d4b27d]" />
                          <p className="font-medium">Tracking {selectedOrder.trackingNumber}</p>
                        </div>
                        <p className="mt-2 text-sm text-stone-300">
                          {selectedOrder.status === "SHIPPED" || selectedOrder.status === "DELIVERED"
                            ? "Listo para seguimiento oficial."
                            : "Guardado, pero todavia no figura como despachado."}
                        </p>
                        <a
                          href="https://www.correoargentino.com.ar/seguimiento-de-envios"
                          target="_blank"
                          rel="noreferrer"
                          className="mt-3 inline-flex items-center text-sm font-medium text-[#f0e6d1] underline-offset-4 hover:underline"
                        >
                          Abrir seguimiento oficial
                        </a>
                      </div>
                    ) : null}
                  </div>

                  <div className="space-y-4 rounded-[1.5rem] border border-white/10 bg-black/20 p-5">
                    <div className="flex items-center gap-2 text-white">
                      <Clock3 className="h-5 w-5 text-[#d4b27d]" />
                      <h4 className="text-lg font-semibold">Actualizar pedido</h4>
                    </div>

                    <div className="space-y-3">
                      <div>
                        <label className="mb-2 block text-xs uppercase tracking-[0.24em] text-stone-400">Estado</label>
                        <Select
                          value={drafts[selectedOrder.id]?.status || selectedOrder.status}
                          onValueChange={(value) => updateDraft(selectedOrder.id, "status", value)}
                        >
                          <SelectTrigger className="border-white/10 bg-black/20 text-white">
                            <SelectValue placeholder="Seleccionar estado" />
                          </SelectTrigger>
                          <SelectContent className="border-white/10 bg-[#181513] text-stone-100 shadow-2xl">
                            {ORDER_STATUS_OPTIONS.map((status) => (
                              <SelectItem key={status} value={status}>
                                {getOrderStatusLabel(status)}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>

                      <div>
                        <label className="mb-2 block text-xs uppercase tracking-[0.24em] text-stone-400">Tracking</label>
                        <Input
                          value={drafts[selectedOrder.id]?.trackingNumber ?? selectedOrder.trackingNumber ?? ""}
                          onChange={(event) => updateDraft(selectedOrder.id, "trackingNumber", event.target.value)}
                          placeholder="Codigo de seguimiento"
                          className="border-white/10 bg-black/20 text-white placeholder:text-stone-500"
                        />
                      </div>
                    </div>

                    <div className="grid gap-2">
                      <Button
                        className="bg-gold-600 text-white hover:bg-gold-700"
                        disabled={savingOrderId === selectedOrder.id}
                        onClick={() => saveOrder(selectedOrder.id)}
                      >
                        {savingOrderId === selectedOrder.id ? "Guardando..." : "Guardar cambios"}
                      </Button>
                      <div className="grid gap-2 sm:grid-cols-2">
                        <Button
                          type="button"
                          variant="outline"
                          className="border-white/15 bg-white/5 text-white hover:bg-white/10 hover:text-white"
                          onClick={() => updateDraft(selectedOrder.id, "status", "CONFIRMED")}
                        >
                          Confirmar
                        </Button>
                        <Button
                          type="button"
                          variant="outline"
                          className="border-white/15 bg-white/5 text-white hover:bg-white/10 hover:text-white"
                          onClick={() => updateDraft(selectedOrder.id, "status", "PROCESSING")}
                        >
                          Preparar
                        </Button>
                        <Button
                          type="button"
                          variant="outline"
                          className="border-white/15 bg-white/5 text-white hover:bg-white/10 hover:text-white"
                          onClick={() => updateDraft(selectedOrder.id, "status", "SHIPPED")}
                        >
                          Enviar
                        </Button>
                        <Button
                          type="button"
                          variant="outline"
                          className="border-white/15 bg-white/5 text-white hover:bg-white/10 hover:text-white"
                          onClick={() => updateDraft(selectedOrder.id, "status", "DELIVERED")}
                        >
                          Entregar
                        </Button>
                      </div>
                    </div>

                    <div className="rounded-2xl border border-white/10 bg-white/5 p-4 text-sm text-stone-300">
                      <div className="flex items-center justify-between">
                        <span>Total</span>
                        <span className="font-semibold text-white">{formatCurrency(selectedOrder.total)}</span>
                      </div>
                      <div className="mt-2 flex items-center justify-between">
                        <span>Items</span>
                        <span>{selectedOrder.itemsCount}</span>
                      </div>
                      <div className="mt-2 flex items-center justify-between">
                        <span>Fecha</span>
                        <span>{dateFormatter.format(new Date(selectedOrder.createdAt))}</span>
                      </div>
                    </div>
                  </div>
                </div>

                <DialogFooter>
                  <Button
                    variant="outline"
                    className="border-white/15 bg-white/5 text-white hover:bg-white/10 hover:text-white"
                    onClick={() => setOrderDialogOpen(false)}
                  >
                    Cerrar
                  </Button>
                </DialogFooter>
              </>
            ) : (
              <div className="py-8 text-sm text-stone-300">Selecciona un pedido para editarlo.</div>
            )}
          </DialogContent>
        </Dialog>

        <section className="rounded-[1.75rem] border border-white/10 bg-black/20 p-5 text-sm text-stone-300">
          <p className="font-medium text-stone-100">Criterio aplicado</p>
          <p className="mt-2 leading-6">
            Esta vista prioriza el control operativo: rango temporal, estado, tracking y evolucion de pedidos. Las metricas de ventas y
            ticket promedio quedan en Finanzas para evitar repetir funcionalidades.
          </p>
          {isPending ? <p className="mt-3 text-xs uppercase tracking-[0.2em] text-[#d4b27d]">Actualizando vista...</p> : null}
        </section>
      </div>
    </main>
  );
}
