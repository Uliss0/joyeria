import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { OrderStatus } from "@prisma/client";
import { authOptions } from "@/lib/auth/config";
import { prisma } from "@/lib/prisma";

async function assertAdminSession() {
  const session = await getServerSession(authOptions);
  if (!session?.user || session.user.role !== "ADMIN") {
    return null;
  }

  return session;
}

export async function PATCH(req: Request, { params }: { params: Promise<{ orderId: string }> }) {
  const session = await assertAdminSession();
  if (!session) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  const { orderId } = await params;
  const body = await req.json();
  const status = body?.status as OrderStatus | undefined;
  const trackingNumber = typeof body?.trackingNumber === "string" ? body.trackingNumber.trim() : undefined;

  if (!status) {
    return NextResponse.json({ message: "Debes indicar un estado válido." }, { status: 400 });
  }

  if (!Object.values(OrderStatus).includes(status)) {
    return NextResponse.json({ message: "Estado inválido." }, { status: 400 });
  }

  try {
    const updated = await prisma.order.update({
      where: { id: orderId },
      data: {
        status,
        trackingNumber: trackingNumber || undefined,
        shippedAt: status === "SHIPPED" ? new Date() : undefined,
        deliveredAt: status === "DELIVERED" ? new Date() : undefined,
      },
      select: {
        id: true,
        status: true,
        trackingNumber: true,
        shippedAt: true,
        deliveredAt: true,
      },
    });

    return NextResponse.json({
      order: {
        ...updated,
        shippedAt: updated.shippedAt?.toISOString() ?? null,
        deliveredAt: updated.deliveredAt?.toISOString() ?? null,
      },
    });
  } catch (error) {
    console.error("PATCH /api/admin/orders/[orderId] error", error);
    return NextResponse.json({ message: "No se pudo actualizar el pedido." }, { status: 500 });
  }
}
