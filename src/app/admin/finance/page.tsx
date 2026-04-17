"use client";

import { useEffect, useState, useTransition } from "react";
import { BarChart3, CalendarRange, CheckCircle2, CircleDollarSign, Wallet } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";

type FinancePreset = "7d" | "30d" | "90d" | "month" | "year" | "all" | "custom";

type FinanceResponse = {
  appliedPreset: FinancePreset;
  range: {
    from: string | null;
    to: string | null;
  };
  summary: {
    totalSales: number;
    developerFee: number;
    developerFeeRate: number;
    orderCount: number;
    averageTicket: number;
  };
  statusBreakdown: Array<{
    status: string;
    count: number;
  }>;
  recentOrders: Array<{
    id: string;
    orderNumber: string;
    total: number;
    status: string;
    paymentMethod: string | null;
    createdAt: string;
  }>;
  soldProducts: Array<{
    id: string;
    productId: string;
    productName: string;
    productSlug: string;
    sku: string;
    category: string;
    quantity: number;
    unitPrice: number;
    total: number;
    orderId: string;
    orderNumber: string;
    orderStatus: string;
    paymentMethod: string | null;
    soldAt: string;
  }>;
  developerPayout: {
    year: number;
    month: number;
    amountDue: number;
    isPaid: boolean;
    paidAt: string | null;
    amountPaid: number | null;
    notes: string | null;
  };
};

type AppliedFilters = {
  preset: FinancePreset;
  from: string;
  to: string;
};

const presetOptions: Array<{ value: Exclude<FinancePreset, "custom">; label: string }> = [
  { value: "7d", label: "Ultimos 7 dias" },
  { value: "30d", label: "Ultimos 30 dias" },
  { value: "90d", label: "Ultimos 90 dias" },
  { value: "month", label: "Mes actual" },
  { value: "year", label: "Ano actual" },
  { value: "all", label: "Historico completo" },
];

const currencyFormatter = new Intl.NumberFormat("es-AR", {
  style: "currency",
  currency: "ARS",
  maximumFractionDigits: 2,
});

const dateFormatter = new Intl.DateTimeFormat("es-AR", {
  day: "2-digit",
  month: "short",
  year: "numeric",
});

const monthFormatter = new Intl.DateTimeFormat("es-AR", {
  month: "long",
  year: "numeric",
});

const statusLabels: Record<string, string> = {
  PENDING: "Pendiente",
  CONFIRMED: "Confirmado",
  PROCESSING: "En proceso",
  SHIPPED: "Enviado",
  DELIVERED: "Entregado",
};

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

function buildPeriodLabel(data: FinanceResponse | null) {
  if (!data) return "Selecciona un rango para ver las ventas.";
  if (!data.range.from || !data.range.to) return "Ventas acumuladas de todo el historial disponible.";

  return `Ventas registradas entre ${dateFormatter.format(new Date(data.range.from))} y ${dateFormatter.format(
    new Date(data.range.to)
  )}.`;
}

function buildStatusLabel(status: string) {
  return statusLabels[status] ?? status;
}

export default function AdminFinancePage() {
  const initialRange = getInitialRange();
  const [selectedPreset, setSelectedPreset] = useState<FinancePreset>("30d");
  const [customFrom, setCustomFrom] = useState(initialRange.from);
  const [customTo, setCustomTo] = useState(initialRange.to);
  const [appliedFilters, setAppliedFilters] = useState<AppliedFilters>({
    preset: "30d",
    from: initialRange.from,
    to: initialRange.to,
  });
  const [data, setData] = useState<FinanceResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [isPending, startTransition] = useTransition();
  const [paymentActionPending, startPaymentAction] = useTransition();
  const [paymentNotes, setPaymentNotes] = useState("");
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const controller = new AbortController();

    async function loadFinance() {
      setLoading(true);
      setError(null);

      try {
        const params = new URLSearchParams({ preset: appliedFilters.preset });

        if (appliedFilters.preset === "custom") {
          params.set("from", appliedFilters.from);
          params.set("to", appliedFilters.to);
        }

        const res = await fetch(`/api/admin/finance?${params.toString()}`, {
          credentials: "include",
          signal: controller.signal,
        });

        if (!res.ok) {
          const err = await res.json().catch(() => null);
          throw new Error(err?.message || "No se pudieron cargar las metricas.");
        }

        const payload = (await res.json()) as FinanceResponse;
        setData(payload);
        setPaymentNotes(payload.developerPayout.notes || "");
      } catch (err: any) {
        if (err?.name === "AbortError") return;
        setError(err?.message || "No se pudieron cargar las metricas.");
      } finally {
        setLoading(false);
      }
    }

    loadFinance();

    return () => {
      controller.abort();
    };
  }, [appliedFilters]);

  const applyPreset = (preset: Exclude<FinancePreset, "custom">) => {
    setSelectedPreset(preset);
    startTransition(() => {
      setAppliedFilters({
        preset,
        from: customFrom,
        to: customTo,
      });
    });
  };

  const applyCustomRange = () => {
    setSelectedPreset("custom");
    startTransition(() => {
      setAppliedFilters({
        preset: "custom",
        from: customFrom,
        to: customTo,
      });
    });
  };

  const totalSales = data?.summary.totalSales ?? 0;
  const developerFee = data?.summary.developerFee ?? 0;
  const orderCount = data?.summary.orderCount ?? 0;
  const averageTicket = data?.summary.averageTicket ?? 0;
  const currentMonthPayout = data?.developerPayout;
  const currentMonthLabel = currentMonthPayout
    ? monthFormatter.format(new Date(currentMonthPayout.year, currentMonthPayout.month - 1, 1))
    : monthFormatter.format(new Date());

  const updateDeveloperPaymentStatus = (action: "mark-paid" | "mark-unpaid") => {
    startPaymentAction(async () => {
      try {
        setError(null);
        const res = await fetch("/api/admin/finance", {
          method: "POST",
          credentials: "include",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            action,
            notes: paymentNotes,
          }),
        });

        if (!res.ok) {
          const err = await res.json().catch(() => null);
          throw new Error(err?.message || "No se pudo actualizar el pago.");
        }

        setAppliedFilters((prev) => ({ ...prev }));
      } catch (err: any) {
        setError(err?.message || "No se pudo actualizar el pago.");
      }
    });
  };

  return (
    <main className="min-h-screen bg-[radial-gradient(circle_at_top,_rgba(212,178,125,0.18),_transparent_30%),linear-gradient(180deg,_#151311_0%,_#0f0d0c_100%)] px-4 py-8 text-stone-100 sm:px-6 lg:px-8">
      <div className="mx-auto flex w-full max-w-7xl flex-col gap-6">
        <section className="overflow-hidden rounded-[2rem] border border-white/10 bg-white/5 shadow-[0_25px_80px_rgba(0,0,0,0.35)] backdrop-blur">
          <div className="grid gap-6 px-6 py-8 lg:grid-cols-[1.3fr_0.9fr] lg:px-8">
            <div className="space-y-4">
              <div className="inline-flex items-center gap-2 rounded-full border border-[#d4b27d]/30 bg-[#d4b27d]/10 px-3 py-1 text-xs uppercase tracking-[0.28em] text-[#f0e6d1]">
                <BarChart3 className="h-3.5 w-3.5" />
                Finanzas
              </div>
              <div className="space-y-3">
                <h1 className="max-w-3xl text-4xl font-semibold tracking-tight text-white lg:text-5xl">
                  Control de ventas, pedidos y seguimiento mensual.
                </h1>
                <p className="max-w-2xl text-sm leading-6 text-stone-300 sm:text-base">
                  {buildPeriodLabel(data)}
                </p>
              </div>
            </div>

            <div className="rounded-[1.75rem] border border-white/10 bg-black/20 p-5">
              <div className="mb-4 flex items-center gap-2 text-sm font-medium text-stone-200">
                <CalendarRange className="h-4 w-4 text-[#d4b27d]" />
                Filtrar periodo
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

              <div className="mt-4 grid gap-3 rounded-2xl border border-white/10 bg-white/5 p-4 sm:grid-cols-2">
                <div className="space-y-2">
                  <label className="text-xs uppercase tracking-[0.2em] text-stone-400">Desde</label>
                  <Input
                    type="date"
                    value={customFrom}
                    onChange={(event) => setCustomFrom(event.target.value)}
                    className="border-white/10 bg-black/20 text-stone-100"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-xs uppercase tracking-[0.2em] text-stone-400">Hasta</label>
                  <Input
                    type="date"
                    value={customTo}
                    onChange={(event) => setCustomTo(event.target.value)}
                    className="border-white/10 bg-black/20 text-stone-100"
                  />
                </div>
                <Button
                  type="button"
                  className="sm:col-span-2 bg-white text-black hover:bg-stone-200"
                  onClick={applyCustomRange}
                >
                  Aplicar rango personalizado
                </Button>
              </div>
            </div>
          </div>
        </section>

        {error ? (
          <div className="rounded-2xl border border-red-500/30 bg-red-500/10 px-4 py-3 text-sm text-red-100">
            {error}
          </div>
        ) : null}

        <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          <Card className="border-white/10 bg-white/5 text-white">
            <CardHeader>
              <CardDescription className="text-stone-400">Ventas totales</CardDescription>
              <CardTitle className="flex items-center justify-between text-3xl text-white">
                {loading ? "..." : currencyFormatter.format(totalSales)}
                <CircleDollarSign className="h-6 w-6 text-[#d4b27d]" />
              </CardTitle>
            </CardHeader>
            <CardContent className="text-sm text-stone-300">
              Suma de pedidos validos dentro del periodo elegido.
            </CardContent>
          </Card>

          <Card className="border-white/10 bg-white/5 text-white">
            <CardHeader>
              <CardDescription className="text-stone-400">Pedidos contabilizados</CardDescription>
              <CardTitle className="text-3xl text-white">{loading ? "..." : orderCount}</CardTitle>
            </CardHeader>
            <CardContent className="text-sm text-stone-300">
              No se incluyen pedidos cancelados ni reembolsados.
            </CardContent>
          </Card>

          <Card className="border-white/10 bg-white/5 text-white">
            <CardHeader>
              <CardDescription className="text-stone-400">Ticket promedio</CardDescription>
              <CardTitle className="text-3xl text-white">
                {loading ? "..." : currencyFormatter.format(averageTicket)}
              </CardTitle>
            </CardHeader>
            <CardContent className="text-sm text-stone-300">
              Promedio simple entre ventas totales y cantidad de pedidos.
            </CardContent>
          </Card>
        </section>

        <section className="grid gap-4 xl:grid-cols-[0.85fr_1.15fr]">
          <Card className="border-white/10 bg-white/5 text-white">
            <CardHeader>
              <CardTitle className="text-2xl text-white">Pago del desarrollador</CardTitle>
              <CardDescription className="text-stone-400">
                Control administrativo del {Math.round((data?.summary.developerFeeRate ?? 0.05) * 100)}% correspondiente a {currentMonthLabel}.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="rounded-2xl border border-white/10 bg-black/20 p-4">
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <p className="text-sm text-stone-400">Estado del mes actual</p>
                    <p className="mt-1 text-lg font-medium text-white">
                      {currentMonthPayout?.isPaid ? "Pagado" : "Pendiente"}
                    </p>
                    <p className="mt-2 text-sm text-stone-300">
                      Monto estimado: {loading ? "..." : currencyFormatter.format(currentMonthPayout?.amountDue ?? 0)}
                    </p>
                    {currentMonthPayout?.paidAt ? (
                      <p className="mt-1 text-xs text-stone-400">
                        Pagado el {dateFormatter.format(new Date(currentMonthPayout.paidAt))}
                      </p>
                    ) : null}
                  </div>
                  <div
                    className={`inline-flex items-center gap-2 rounded-full px-3 py-1 text-xs uppercase tracking-[0.2em] ${
                      currentMonthPayout?.isPaid
                        ? "bg-emerald-500/15 text-emerald-200"
                        : "bg-amber-500/15 text-amber-200"
                    }`}
                  >
                    <CheckCircle2 className="h-3.5 w-3.5" />
                    {currentMonthPayout?.isPaid ? "Pagado" : "Pendiente"}
                  </div>
                </div>
              </div>

              <div className="rounded-2xl border border-white/10 bg-black/20 p-4">
                <p className="text-sm text-stone-400">Monto de referencia</p>
                <div className="mt-2 flex items-center justify-between gap-3">
                  <span className="text-2xl font-semibold text-white">
                    {loading ? "..." : currencyFormatter.format(developerFee)}
                  </span>
                  <Wallet className="h-5 w-5 text-[#d4b27d]" />
                </div>
                <p className="mt-2 text-xs leading-5 text-stone-400">
                  Este valor se calcula automaticamente como el 5% de las ventas del periodo visible.
                </p>
              </div>

              <div className="space-y-2">
                <label className="text-xs uppercase tracking-[0.2em] text-stone-400">Nota interna</label>
                <Input
                  value={paymentNotes}
                  onChange={(event) => setPaymentNotes(event.target.value)}
                  placeholder="Ej: Transferido el 10/04 por banco"
                  className="border-white/10 bg-black/20 text-stone-100"
                />
              </div>

              <div className="flex flex-wrap gap-3">
                <Button
                  type="button"
                  className="bg-white text-black hover:bg-stone-200"
                  disabled={paymentActionPending}
                  onClick={() => updateDeveloperPaymentStatus("mark-paid")}
                >
                  Marcar como pagado
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  className="border-white/15 bg-white/5 text-stone-200 hover:bg-white/10 hover:text-white"
                  disabled={paymentActionPending}
                  onClick={() => updateDeveloperPaymentStatus("mark-unpaid")}
                >
                  Marcar como pendiente
                </Button>
              </div>
            </CardContent>
          </Card>

          <Card className="border-white/10 bg-white/5 text-white">
            <CardHeader>
              <CardTitle className="text-2xl text-white">Estado de ventas</CardTitle>
              <CardDescription className="text-stone-400">
                Distribucion de pedidos dentro del rango seleccionado.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              {loading ? (
                <p className="text-sm text-stone-400">Cargando estados...</p>
              ) : data?.statusBreakdown.length ? (
                data.statusBreakdown.map((item) => {
                  const percentage = orderCount > 0 ? (item.count / orderCount) * 100 : 0;

                  return (
                    <div key={item.status} className="space-y-2">
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-stone-200">{buildStatusLabel(item.status)}</span>
                        <span className="text-stone-400">
                          {item.count} pedidos · {percentage.toFixed(0)}%
                        </span>
                      </div>
                      <div className="h-2 overflow-hidden rounded-full bg-white/10">
                        <div
                          className="h-full rounded-full bg-[linear-gradient(90deg,#c19659,#f0e6d1)]"
                          style={{ width: `${percentage}%` }}
                        />
                      </div>
                    </div>
                  );
                })
              ) : (
                <p className="text-sm text-stone-400">No hay pedidos para este periodo.</p>
              )}
            </CardContent>
          </Card>

        </section>

        <section className="grid gap-4 xl:grid-cols-[0.95fr_1.05fr]">
          <Card className="border-white/10 bg-white/5 text-white">
            <CardHeader>
              <CardTitle className="text-2xl text-white">Ultimas ventas</CardTitle>
              <CardDescription className="text-stone-400">
                Detalle rapido de los pedidos mas recientes computados en la vista.
              </CardDescription>
            </CardHeader>
            <CardContent>
              {loading ? (
                <p className="text-sm text-stone-400">Cargando ventas...</p>
              ) : data?.recentOrders.length ? (
                <div className="overflow-hidden rounded-2xl border border-white/10">
                  <div className="grid grid-cols-[1.1fr_0.8fr_0.7fr_0.9fr] gap-3 border-b border-white/10 bg-white/5 px-4 py-3 text-xs uppercase tracking-[0.2em] text-stone-400">
                    <span>Pedido</span>
                    <span>Fecha</span>
                    <span>Estado</span>
                    <span className="text-right">Total</span>
                  </div>
                  {data.recentOrders.map((order) => (
                    <div
                      key={order.id}
                      className="grid grid-cols-[1.1fr_0.8fr_0.7fr_0.9fr] gap-3 border-b border-white/5 px-4 py-3 text-sm last:border-b-0"
                    >
                      <div className="min-w-0">
                        <p className="truncate font-medium text-stone-100">{order.orderNumber}</p>
                        <p className="truncate text-xs text-stone-400">
                          {order.paymentMethod || "Metodo sin informar"}
                        </p>
                      </div>
                      <span className="text-stone-300">{dateFormatter.format(new Date(order.createdAt))}</span>
                      <span className="text-stone-300">{buildStatusLabel(order.status)}</span>
                      <span className="text-right font-medium text-white">
                        {currencyFormatter.format(order.total)}
                      </span>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-sm text-stone-400">Todavia no hay ventas en este rango.</p>
              )}
            </CardContent>
          </Card>

          <Card className="border-white/10 bg-white/5 text-white">
            <CardHeader>
              <CardTitle className="text-2xl text-white">Productos vendidos</CardTitle>
              <CardDescription className="text-stone-400">
                Listado de items vendidos en el rango elegido, con fecha, pedido y cantidades.
              </CardDescription>
            </CardHeader>
            <CardContent>
              {loading ? (
                <p className="text-sm text-stone-400">Cargando productos vendidos...</p>
              ) : data?.soldProducts.length ? (
                <div className="overflow-hidden rounded-2xl border border-white/10">
                  <div className="grid grid-cols-[1.3fr_0.7fr_0.8fr_0.8fr] gap-3 border-b border-white/10 bg-white/5 px-4 py-3 text-xs uppercase tracking-[0.2em] text-stone-400">
                    <span>Producto</span>
                    <span>Fecha</span>
                    <span>Cantidad</span>
                    <span className="text-right">Total</span>
                  </div>
                  {data.soldProducts.map((item) => (
                    <div
                      key={item.id}
                      className="grid grid-cols-[1.3fr_0.7fr_0.8fr_0.8fr] gap-3 border-b border-white/5 px-4 py-3 text-sm last:border-b-0"
                    >
                      <div className="min-w-0">
                        <p className="truncate font-medium text-stone-100">{item.productName}</p>
                        <p className="truncate text-xs text-stone-400">
                          {item.orderNumber} · {item.category} · SKU {item.sku}
                        </p>
                      </div>
                      <span className="text-stone-300">{dateFormatter.format(new Date(item.soldAt))}</span>
                      <span className="text-stone-300">
                        {item.quantity} · {currencyFormatter.format(item.unitPrice)}
                      </span>
                      <span className="text-right font-medium text-white">
                        {currencyFormatter.format(item.total)}
                      </span>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-sm text-stone-400">
                  No se registran productos vendidos en este rango. Si esperabas ver datos aca, todavia no hay ventas confirmadas que entren en el filtro.
                </p>
              )}
            </CardContent>
          </Card>
        </section>

        <section className="rounded-[1.75rem] border border-white/10 bg-black/20 p-5 text-sm text-stone-300">
          <p className="font-medium text-stone-100">Criterio aplicado</p>
          <p className="mt-2 leading-6">
            Esta vista calcula ventas totales, muestra productos vendidos por item y excluye pedidos con estado cancelado o reembolsado.
          </p>
          {isPending || paymentActionPending ? (
            <p className="mt-3 text-xs uppercase tracking-[0.2em] text-[#d4b27d]">Actualizando vista...</p>
          ) : null}
        </section>
      </div>
    </main>
  );
}
