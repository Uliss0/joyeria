import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth/config";
import { prisma } from "@/lib/prisma";
import { formatCurrency } from "@/lib/orders";

function formatOrder(order: any) {
  return {
    id: order.id,
    orderNumber: order.orderNumber,
    status: order.status,
    total: Number(order.total),
    paymentMethod: order.paymentMethod,
    trackingNumber: order.trackingNumber || null,
    shippedAt: order.shippedAt?.toISOString() ?? null,
    deliveredAt: order.deliveredAt?.toISOString() ?? null,
    createdAt: order.createdAt.toISOString(),
    subtotal: Number(order.subtotal),
    shipping: Number(order.shipping),
    currency: order.currency,
    formattedTotal: formatCurrency(Number(order.total)),
    shippingAddress: order.shippingAddress,
    billingAddress: order.billingAddress,
    items: order.items.map((item: any) => ({
      id: item.id,
      productId: item.productId,
      name: item.product.name,
      slug: item.product.slug,
      quantity: item.quantity,
      price: Number(item.price),
      total: Number(item.total),
      image: item.product.images?.[0]?.url ?? null,
    })),
  };
}

export async function GET(_: Request, { params }: { params: Promise<{ orderId: string }> }) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const { orderId } = await params;
    const isAdmin = session.user.role === "ADMIN";

    const order = await prisma.order.findFirst({
      where: {
        id: orderId,
        ...(isAdmin ? {} : { userId: session.user.id }),
      },
      select: {
        id: true,
        orderNumber: true,
        status: true,
        total: true,
        subtotal: true,
        shipping: true,
        currency: true,
        paymentMethod: true,
        trackingNumber: true,
        shippedAt: true,
        deliveredAt: true,
        createdAt: true,
        shippingAddress: true,
        billingAddress: true,
        items: {
          select: {
            id: true,
            productId: true,
            quantity: true,
            price: true,
            total: true,
            product: {
              select: {
                name: true,
                slug: true,
                images: {
                  where: { isMain: true },
                  orderBy: [{ isMain: "desc" }, { order: "asc" }],
                  take: 1,
                  select: { url: true },
                },
              },
            },
          },
        },
      },
    });

    if (!order) {
      return NextResponse.json({ message: "Pedido no encontrado." }, { status: 404 });
    }

    return NextResponse.json({ order: formatOrder(order) });
  } catch (error) {
    console.error("GET /api/orders/[orderId] error", error);
    return NextResponse.json({ message: "No se pudo cargar el pedido." }, { status: 500 });
  }
}
