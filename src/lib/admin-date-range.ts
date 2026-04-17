import { Prisma } from "@prisma/client";

export type PresetRange = "7d" | "30d" | "90d" | "month" | "year" | "all" | "custom";

export function parseDateParam(value: string | null) {
  if (!value) return null;

  const parsed = new Date(`${value}T00:00:00`);
  return Number.isNaN(parsed.getTime()) ? null : parsed;
}

export function getDateRange(preset: PresetRange, from: string | null, to: string | null) {
  const now = new Date();
  const end = new Date(now);
  end.setHours(23, 59, 59, 999);

  if (preset === "all") {
    return { from: null, to: null, appliedPreset: preset };
  }

  if (preset === "custom") {
    const customFrom = parseDateParam(from);
    const customTo = parseDateParam(to);

    if (!customFrom || !customTo) {
      return { error: "Debes indicar ambas fechas para un rango personalizado." };
    }

    customFrom.setHours(0, 0, 0, 0);
    customTo.setHours(23, 59, 59, 999);

    if (customFrom > customTo) {
      return { error: "La fecha inicial no puede ser mayor a la fecha final." };
    }

    return { from: customFrom, to: customTo, appliedPreset: preset };
  }

  const start = new Date(now);
  start.setHours(0, 0, 0, 0);

  switch (preset) {
    case "7d":
      start.setDate(start.getDate() - 6);
      break;
    case "30d":
      start.setDate(start.getDate() - 29);
      break;
    case "90d":
      start.setDate(start.getDate() - 89);
      break;
    case "month":
      start.setDate(1);
      break;
    case "year":
      start.setMonth(0, 1);
      break;
    default:
      start.setDate(start.getDate() - 29);
      return { from: start, to: end, appliedPreset: "30d" as const };
  }

  return { from: start, to: end, appliedPreset: preset };
}

export function dateRangeToWhere(from: Date | null, to: Date | null) {
  return from && to
    ? {
        createdAt: {
          gte: from,
          lte: to,
        },
      }
    : {};
}

export function toNumber(value: Prisma.Decimal | number | null | undefined) {
  if (value === null || value === undefined) return 0;
  return Number(value);
}
