import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import type { Session } from "next-auth";
import { Prisma } from "@prisma/client";
import { authOptions } from "@/lib/auth/config";
import { dateRangeToWhere, getDateRange, toNumber, type PresetRange } from "@/lib/admin-date-range";
import { prisma } from "@/lib/prisma";

const DEVELOPER_FEE_RATE = 0.05;
const EXCLUDED_ORDER_STATUSES = ["CANCELLED", "REFUNDED"] as const;

function getCurrentMonthRange() {
  const now = new Date();
  const from = new Date(now.getFullYear(), now.getMonth(), 1, 0, 0, 0, 0);
  const to = new Date(now.getFullYear(), now.getMonth() + 1, 0, 23, 59, 59, 999);

  return {
    year: now.getFullYear(),
    month: now.getMonth() + 1,
    from,
    to,
  };
}

async function assertAdminSession() {
  const session = (await getServerSession(authOptions as any)) as Session | null;
  if (!session || session.user?.role !== "ADMIN") {
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

  const range = getDateRange(
    preset,
    url.searchParams.get("from"),
    url.searchParams.get("to")
  );

  if ("error" in range) {
    return NextResponse.json({ message: range.error }, { status: 400 });
  }

  const where = {
    status: {
      notIn: [...EXCLUDED_ORDER_STATUSES],
    },
    ...dateRangeToWhere(range.from, range.to),
  } satisfies Prisma.OrderWhereInput;

  try {
    const currentMonth = getCurrentMonthRange();
    const currentMonthWhere = {
      status: {
        notIn: [...EXCLUDED_ORDER_STATUSES],
      },
      createdAt: {
        gte: currentMonth.from,
        lte: currentMonth.to,
      },
    } satisfies Prisma.OrderWhereInput;

    const [aggregate, statusBreakdown, recentOrders, soldProducts, currentMonthAggregate, currentMonthPayout] = await Promise.all([
      prisma.order.aggregate({
        where,
        _count: { _all: true },
        _sum: { total: true },
      }),
      prisma.order.groupBy({
        by: ["status"],
        where,
        _count: { _all: true },
        orderBy: {
          status: "asc",
        },
      }),
      prisma.order.findMany({
        where,
        orderBy: {
          createdAt: "desc",
        },
        take: 6,
        select: {
          id: true,
          orderNumber: true,
          total: true,
          status: true,
          paymentMethod: true,
          createdAt: true,
        },
      }),
      prisma.orderItem.findMany({
        where: {
          order: where,
        },
        orderBy: {
          order: {
            createdAt: "desc",
          },
        },
        take: 20,
        select: {
          id: true,
          quantity: true,
          price: true,
          total: true,
          order: {
            select: {
              id: true,
              orderNumber: true,
              createdAt: true,
              status: true,
              paymentMethod: true,
            },
          },
          product: {
            select: {
              id: true,
              name: true,
              slug: true,
              sku: true,
              category: {
                select: {
                  name: true,
                },
              },
            },
          },
        },
      }),
      prisma.order.aggregate({
        where: currentMonthWhere,
        _sum: { total: true },
      }),
      prisma.$queryRaw<
        Array<{
          year: number;
          month: number;
          amount: Prisma.Decimal | number;
          paidAt: Date | null;
          notes: string | null;
        }>
      >`SELECT year, month, amount, paidAt, notes
        FROM developer_payouts
        WHERE year = ${currentMonth.year} AND month = ${currentMonth.month}
        LIMIT 1`,
    ]);

    const totalSales = toNumber(aggregate._sum.total);
    const orderCount = aggregate._count._all ?? 0;
    const developerFee = totalSales * DEVELOPER_FEE_RATE;
    const averageTicket = orderCount > 0 ? totalSales / orderCount : 0;
    const currentMonthSales = toNumber(currentMonthAggregate._sum.total);
    const currentMonthDeveloperFee = currentMonthSales * DEVELOPER_FEE_RATE;

    return NextResponse.json({
      appliedPreset: range.appliedPreset,
      range: {
        from: range.from?.toISOString() ?? null,
        to: range.to?.toISOString() ?? null,
      },
      summary: {
        totalSales,
        developerFee,
        developerFeeRate: DEVELOPER_FEE_RATE,
        orderCount,
        averageTicket,
      },
      statusBreakdown: statusBreakdown.map((entry: { status: string; _count: { _all: number } }) => ({
        status: entry.status,
        count: entry._count._all,
      })),
      recentOrders: recentOrders.map((order: {
        id: string;
        orderNumber: string;
        total: Prisma.Decimal | number;
        status: string;
        paymentMethod: string | null;
        createdAt: Date;
      }) => ({
        id: order.id,
        orderNumber: order.orderNumber,
        total: toNumber(order.total),
        status: order.status,
        paymentMethod: order.paymentMethod,
        createdAt: order.createdAt.toISOString(),
      })),
      soldProducts: soldProducts.map((item: {
        id: string;
        quantity: number;
        price: Prisma.Decimal | number;
        total: Prisma.Decimal | number;
        order: {
          id: string;
          orderNumber: string;
          createdAt: Date;
          status: string;
          paymentMethod: string | null;
        };
        product: {
          id: string;
          name: string;
          slug: string;
          sku: string;
          category: { name: string } | null;
        };
      }) => ({
        id: item.id,
        productId: item.product.id,
        productName: item.product.name,
        productSlug: item.product.slug,
        sku: item.product.sku,
        category: item.product.category?.name || "Sin categoria",
        quantity: item.quantity,
        unitPrice: toNumber(item.price),
        total: toNumber(item.total),
        orderId: item.order.id,
        orderNumber: item.order.orderNumber,
        orderStatus: item.order.status,
        paymentMethod: item.order.paymentMethod,
        soldAt: item.order.createdAt.toISOString(),
      })),
      developerPayout: {
        year: currentMonth.year,
        month: currentMonth.month,
        amountDue: currentMonthDeveloperFee,
        isPaid: Boolean(currentMonthPayout[0]?.paidAt),
        paidAt: currentMonthPayout[0]?.paidAt?.toISOString() ?? null,
        amountPaid: currentMonthPayout[0] ? toNumber(currentMonthPayout[0].amount) : null,
        notes: currentMonthPayout[0]?.notes ?? null,
      },
    });
  } catch (error: any) {
    return NextResponse.json(
      { message: error?.message || "No se pudieron cargar las finanzas." },
      { status: 500 }
    );
  }
}

export async function POST(req: NextRequest) {
  const session = await assertAdminSession();
  if (!session) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  try {
    const body = await req.json().catch(() => ({}));
    const action = body?.action;
    const notes = typeof body?.notes === "string" ? body.notes.trim() : null;
    const currentMonth = getCurrentMonthRange();

    if (action !== "mark-paid" && action !== "mark-unpaid") {
      return NextResponse.json({ message: "Accion invalida." }, { status: 400 });
    }

    if (action === "mark-paid") {
      const aggregate = await prisma.order.aggregate({
        where: {
          status: {
            notIn: [...EXCLUDED_ORDER_STATUSES],
          },
          createdAt: {
            gte: currentMonth.from,
            lte: currentMonth.to,
          },
        },
        _sum: { total: true },
      });

      const amountDue = toNumber(aggregate._sum.total) * DEVELOPER_FEE_RATE;

      const paidAt = new Date();

      await prisma.$executeRaw`
        INSERT INTO developer_payouts (id, year, month, amount, paidAt, notes, createdAt, updatedAt)
        VALUES (${crypto.randomUUID()}, ${currentMonth.year}, ${currentMonth.month}, ${amountDue}, ${paidAt}, ${notes}, NOW(3), NOW(3))
        ON DUPLICATE KEY UPDATE
          amount = VALUES(amount),
          paidAt = VALUES(paidAt),
          notes = VALUES(notes),
          updatedAt = NOW(3)
      `;

      const payout = await prisma.$queryRaw<
        Array<{
          year: number;
          month: number;
          amount: Prisma.Decimal | number;
          paidAt: Date | null;
          notes: string | null;
        }>
      >`SELECT year, month, amount, paidAt, notes
        FROM developer_payouts
        WHERE year = ${currentMonth.year} AND month = ${currentMonth.month}
        LIMIT 1`;

      return NextResponse.json({
        ok: true,
        payout: {
          year: payout[0]?.year ?? currentMonth.year,
          month: payout[0]?.month ?? currentMonth.month,
          amountPaid: payout[0] ? toNumber(payout[0].amount) : amountDue,
          paidAt: payout[0]?.paidAt?.toISOString() ?? paidAt.toISOString(),
          notes: payout[0]?.notes ?? notes,
        },
      });
    }

    await prisma.$executeRaw`
      INSERT INTO developer_payouts (id, year, month, amount, paidAt, notes, createdAt, updatedAt)
      VALUES (${crypto.randomUUID()}, ${currentMonth.year}, ${currentMonth.month}, ${0}, ${null}, ${notes}, NOW(3), NOW(3))
      ON DUPLICATE KEY UPDATE
        paidAt = VALUES(paidAt),
        notes = VALUES(notes),
        updatedAt = NOW(3)
    `;

    const payout = await prisma.$queryRaw<
      Array<{
        year: number;
        month: number;
        amount: Prisma.Decimal | number;
        paidAt: Date | null;
        notes: string | null;
      }>
    >`SELECT year, month, amount, paidAt, notes
      FROM developer_payouts
      WHERE year = ${currentMonth.year} AND month = ${currentMonth.month}
      LIMIT 1`;

    return NextResponse.json({
      ok: true,
      payout: {
        year: payout[0]?.year ?? currentMonth.year,
        month: payout[0]?.month ?? currentMonth.month,
        amountPaid: payout[0] ? toNumber(payout[0].amount) : 0,
        paidAt: null,
        notes: payout[0]?.notes ?? notes,
      },
    });
  } catch (error: any) {
    return NextResponse.json(
      { message: error?.message || "No se pudo actualizar el pago del desarrollador." },
      { status: 500 }
    );
  }
}
