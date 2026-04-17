export const ORDER_STATUS_OPTIONS = [
  "PENDING",
  "CONFIRMED",
  "PROCESSING",
  "SHIPPED",
  "DELIVERED",
  "CANCELLED",
  "REFUNDED",
] as const;

export type OrderStatusValue = (typeof ORDER_STATUS_OPTIONS)[number];

export const PAYMENT_METHOD_OPTIONS = [
  "MERCADO_PAGO",
  "TRANSFERENCIA",
  "EFECTIVO",
  "TARJETA",
] as const;

export type PaymentMethodValue = (typeof PAYMENT_METHOD_OPTIONS)[number];

export const ORDER_STATUS_LABELS: Record<OrderStatusValue, string> = {
  PENDING: "Pendiente",
  CONFIRMED: "Confirmado",
  PROCESSING: "Preparando",
  SHIPPED: "Enviado",
  DELIVERED: "Entregado",
  CANCELLED: "Cancelado",
  REFUNDED: "Reembolsado",
};

export const PAYMENT_METHOD_LABELS: Record<PaymentMethodValue, string> = {
  MERCADO_PAGO: "Mercado Pago",
  TRANSFERENCIA: "Transferencia bancaria",
  EFECTIVO: "Efectivo",
  TARJETA: "Tarjetas",
};

export const ORDER_STATUS_COLORS: Record<OrderStatusValue, string> = {
  PENDING: "border-amber-500/30 bg-amber-500/10 text-amber-100",
  CONFIRMED: "border-sky-500/30 bg-sky-500/10 text-sky-100",
  PROCESSING: "border-violet-500/30 bg-violet-500/10 text-violet-100",
  SHIPPED: "border-cyan-500/30 bg-cyan-500/10 text-cyan-100",
  DELIVERED: "border-emerald-500/30 bg-emerald-500/10 text-emerald-100",
  CANCELLED: "border-red-500/30 bg-red-500/10 text-red-100",
  REFUNDED: "border-stone-500/30 bg-stone-500/10 text-stone-100",
};

export function formatCurrency(value: number) {
  return new Intl.NumberFormat("es-AR", {
    style: "currency",
    currency: "ARS",
    maximumFractionDigits: 0,
  }).format(value);
}

export function getOrderStatusLabel(status: string | null | undefined) {
  if (!status) return "Sin estado";
  return ORDER_STATUS_LABELS[status as OrderStatusValue] ?? status;
}

export function getOrderStatusColor(status: string | null | undefined) {
  if (!status) return "border-white/10 bg-white/5 text-stone-200";
  return ORDER_STATUS_COLORS[status as OrderStatusValue] ?? "border-white/10 bg-white/5 text-stone-200";
}

export function getPaymentMethodLabel(method: string | null | undefined) {
  if (!method) return "Sin informar";
  return PAYMENT_METHOD_LABELS[method as PaymentMethodValue] ?? method;
}

export function isCardPaymentMethod(method: string | null | undefined) {
  return method === "TARJETA";
}

export function buildOrderNumber() {
  const timestamp = Date.now().toString(36).toUpperCase();
  const random = Math.random().toString(36).slice(2, 6).toUpperCase();
  return `MOK-${timestamp}-${random}`;
}
