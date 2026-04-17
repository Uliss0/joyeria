import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { OrderStatus, Prisma } from "@prisma/client";
import { authOptions } from "@/lib/auth/config";
import { dateRangeToWhere, getDateRange, toNumber, type PresetRange } from "@/lib/admin-date-range";
import { prisma } from "@/lib/prisma";

const ADMIN_ORDER_STATUSES = [
  "PENDING",
  "CONFIRMED",
  "PROCESSING",
  "SHIPPED",
  "DELIVERED",
  "CANCELLED",
  "REFUNDED",
] as const;

async function assertAdminSession() {
  const session = await getServerSession(authOptions);
  if (!session?.user || session.user.role !== "ADMIN") {
    return null;
  }

  return session;
}

export async function GET(req: NextRequest) {
  const session = await assertAdminSession();
  if (!session) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  const url = new URL(req.url);
  const status = url.searchParams.get("status");
  const presetParam = url.searchParams.get("preset");
  const preset: PresetRange =
    presetParam === "7d" ||
    presetParam === "30d" ||
    presetParam === "90d" ||
    presetParam === "month" ||
    presetParam === "year" ||
    presetParam === "all" ||
    presetParam === "custom"
      ? presetParam
      : "30d";
  const range = getDateRange(preset, url.searchParams.get("from"), url.searchParams.get("to"));
  const take = Math.min(Number(url.searchParams.get("take") || 50), 100);

  if ("error" in range) {
    return NextResponse.json({ message: range.error }, { status: 400 });
  }

  const where: Prisma.OrderWhereInput = {
    ...(status && ADMIN_ORDER_STATUSES.includes(status as any) ? { status: status as OrderStatus } : {}),
    ...dateRangeToWhere(range.from, range.to),
  };

  try {
    const [orders, counts, totalSales] = await Promise.all([
      prisma.order.findMany({
        where,
        orderBy: { createdAt: "desc" },
        take,
        select: {
          id: true,
          orderNumber: true,
          status: true,
          total: true,
          paymentMethod: true,
          trackingNumber: true,
          shippedAt: true,
          deliveredAt: true,
          createdAt: true,
          user: {
            select: {
              name: true,
              email: true,
            },
          },
          shippingAddress: {
            select: {
              firstName: true,
              lastName: true,
              city: true,
              state: true,
              zipCode: true,
              phone: true,
            },
          },
          items: {
            select: {
              id: true,
              quantity: true,
              product: {
                select: {
                  name: true,
                  slug: true,
                  sku: true,
                },
              },
            },
          },
        },
      }),
      prisma.order.groupBy({
        by: ["status"],
        where,
        _count: { _all: true },
      }),
      prisma.order.aggregate({
        where,
        _sum: { total: true },
        _count: { _all: true },
      }),
    ]);

    return NextResponse.json({
      appliedFilters: {
        preset: range.appliedPreset,
        status: status && ADMIN_ORDER_STATUSES.includes(status as any) ? status : null,
        from: range.from ? range.from.toISOString() : null,
        to: range.to ? range.to.toISOString() : null,
      },
      summary: {
        totalOrders: totalSales._count._all ?? 0,
        totalSales: toNumber(totalSales._sum.total),
      },
      counts: counts.map((entry) => ({
        status: entry.status,
        count: entry._count._all,
      })),
      orders: orders.map((order) => ({
        id: order.id,
        orderNumber: order.orderNumber,
        status: order.status,
        total: toNumber(order.total),
        paymentMethod: order.paymentMethod,
        trackingNumber: order.trackingNumber,
        shippedAt: order.shippedAt?.toISOString() ?? null,
        deliveredAt: order.deliveredAt?.toISOString() ?? null,
        createdAt: order.createdAt.toISOString(),
        customer: {
          name: order.user.name,
          email: order.user.email,
        },
        shippingAddress: order.shippingAddress,
        itemsCount: order.items.length,
        itemsPreview: order.items.slice(0, 3).map((item) => item.product.name),
      })),
    });
  } catch (error) {
    console.error("GET /api/admin/orders error", error);
    return NextResponse.json({ message: "No se pudieron cargar los pedidos." }, { status: 500 });
  }
}
