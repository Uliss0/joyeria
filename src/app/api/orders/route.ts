import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { AddressType, Prisma } from "@prisma/client";
import { authOptions } from "@/lib/auth/config";
import { prisma } from "@/lib/prisma";
import {
  buildOrderNumber,
  PAYMENT_METHOD_OPTIONS,
  type PaymentMethodValue,
} from "@/lib/orders";

type OrderItemInput = {
  productId?: string;
  quantity?: number;
  variants?: Record<string, string>;
};

function toNumber(value: Prisma.Decimal | number | null | undefined) {
  if (value === null || value === undefined) return 0;
  return Number(value);
}

function isPaymentMethod(value: unknown): value is PaymentMethodValue {
  return typeof value === "string" && PAYMENT_METHOD_OPTIONS.includes(value as PaymentMethodValue);
}

function formatOrderResponse(order: any) {
  return {
    id: order.id,
    orderNumber: order.orderNumber,
    status: order.status,
    total: toNumber(order.total),
    paymentMethod: order.paymentMethod,
    trackingNumber: order.trackingNumber || null,
    createdAt: order.createdAt.toISOString(),
    shippingAddress: {
      firstName: order.shippingAddress.firstName,
      lastName: order.shippingAddress.lastName,
      city: order.shippingAddress.city,
      state: order.shippingAddress.state,
      zipCode: order.shippingAddress.zipCode,
    },
    items: order.items.map((item: any) => ({
      id: item.id,
      productId: item.productId,
      name: item.product.name,
      slug: item.product.slug,
      image: item.product.images?.[0]?.url ?? null,
      quantity: item.quantity,
      price: toNumber(item.price),
    })),
  };
}

function buildVariantNotes(items: Array<{ name?: string; variants?: Record<string, string> }>) {
  const notes = items
    .map((item) => {
      const variantEntries = Object.entries(item.variants || {})
        .filter(([, value]) => Boolean(value))
        .map(([key, value]) => `${key}: ${value}`);

      if (!variantEntries.length) return null;
      return `${item.name || "Producto"} · ${variantEntries.join(", ")}`;
    })
    .filter(Boolean);

  return notes.length ? notes.join(" | ") : null;
}

export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const orders = await prisma.order.findMany({
      where: { userId: session.user.id },
      orderBy: { createdAt: "desc" },
      select: {
        id: true,
        orderNumber: true,
        status: true,
        total: true,
        paymentMethod: true,
        trackingNumber: true,
        createdAt: true,
        shippingAddress: {
          select: {
            firstName: true,
            lastName: true,
            city: true,
            state: true,
            zipCode: true,
          },
        },
        items: {
          select: {
            id: true,
            productId: true,
            quantity: true,
            price: true,
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

    return NextResponse.json({
      orders: orders.map((order) => formatOrderResponse(order)),
    });
  } catch (error) {
    console.error("GET /api/orders error", error);
    return NextResponse.json({ message: "No se pudieron cargar los pedidos." }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();
    const items = Array.isArray(body?.items) ? (body.items as OrderItemInput[]) : [];
    const shipping = body?.shippingData;
    const payment = body?.paymentData;

    if (!items.length) {
      return NextResponse.json({ message: "El carrito no puede estar vacío." }, { status: 400 });
    }

    if (!shipping?.firstName || !shipping?.lastName || !shipping?.address1 || !shipping?.city || !shipping?.state || !shipping?.zipCode || !shipping?.email) {
      return NextResponse.json({ message: "Faltan datos de envío." }, { status: 400 });
    }

    if (!isPaymentMethod(payment?.paymentMethod)) {
      return NextResponse.json({ message: "Selecciona un método de pago válido." }, { status: 400 });
    }

    const normalizedItems = items
      .map((item) => ({
        productId: item.productId?.trim() || "",
        quantity: Number(item.quantity || 0),
        variants: item.variants || {},
      }))
      .filter((item) => item.productId && item.quantity > 0);

    if (!normalizedItems.length) {
      return NextResponse.json({ message: "No hay productos válidos para crear el pedido." }, { status: 400 });
    }

    const groupedItemsMap = new Map<string, { productId: string; quantity: number; variants: Record<string, string>[] }>();
    for (const item of normalizedItems) {
      const current = groupedItemsMap.get(item.productId);
      if (current) {
        current.quantity += item.quantity;
        current.variants.push(item.variants);
      } else {
        groupedItemsMap.set(item.productId, {
          productId: item.productId,
          quantity: item.quantity,
          variants: [item.variants],
        });
      }
    }
    const groupedItems = [...groupedItemsMap.values()];

    const productIds = groupedItems.map((item) => item.productId);
    const products = await prisma.product.findMany({
      where: { id: { in: productIds } },
      select: {
        id: true,
        name: true,
        slug: true,
        price: true,
        stock: true,
      },
    });

    const productMap = new Map(products.map((product) => [product.id, product]));

    for (const item of groupedItems) {
      const product = productMap.get(item.productId);
      if (!product) {
        return NextResponse.json({ message: "Uno de los productos del carrito ya no existe." }, { status: 400 });
      }

      if (product.stock < item.quantity) {
        return NextResponse.json(
          { message: `Sin stock suficiente para ${product.name}.` },
          { status: 400 }
        );
      }
    }

    const subtotal = groupedItems.reduce((sum, item) => {
      const product = productMap.get(item.productId);
      return sum + (product ? toNumber(product.price) * item.quantity : 0);
    }, 0);
    const shippingCost = shipping.shippingMethod === "express" ? 12000 : 5000;
    const total = subtotal + shippingCost;
    const variantNotes = buildVariantNotes(items as Array<{ name?: string; variants?: Record<string, string> }>);

    const created = await prisma.$transaction(async (tx) => {
      const shippingAddress = await tx.address.create({
        data: {
          userId: session.user.id as string,
          type: AddressType.SHIPPING,
          firstName: shipping.firstName,
          lastName: shipping.lastName,
          company: shipping.company || undefined,
          address1: shipping.address1,
          address2: shipping.address2 || undefined,
          city: shipping.city,
          state: shipping.state,
          zipCode: shipping.zipCode,
          country: shipping.country || "Argentina",
          phone: shipping.phone || undefined,
          isDefault: Boolean(shipping.saveAddress),
        },
      });

      const order = await tx.order.create({
        data: {
          userId: session.user.id as string,
          orderNumber: buildOrderNumber(),
          status: "PENDING",
          subtotal,
          shipping: shippingCost,
          discount: 0,
          total,
          currency: "ARS",
          paymentMethod: payment.paymentMethod,
          paymentId: payment.paymentId || null,
          shippingAddressId: shippingAddress.id,
          billingAddressId: null,
          notes: variantNotes,
        },
      });

      const createdItems = [];

      for (const item of groupedItems) {
        const product = productMap.get(item.productId)!;
        const price = toNumber(product.price);

        createdItems.push(
          await tx.orderItem.create({
            data: {
              orderId: order.id,
              productId: product.id,
              quantity: item.quantity,
              price,
              total: price * item.quantity,
            },
          })
        );

        await tx.product.update({
          where: { id: product.id },
          data: {
            stock: {
              decrement: item.quantity,
            },
          },
        });
      }

      return {
        order,
        shippingAddress,
        items: createdItems,
      };
    });

    const order = await prisma.order.findUnique({
      where: { id: created.order.id },
      select: {
        id: true,
        orderNumber: true,
        status: true,
        total: true,
        paymentMethod: true,
        trackingNumber: true,
        createdAt: true,
        shippingAddress: {
          select: {
            firstName: true,
            lastName: true,
            city: true,
            state: true,
            zipCode: true,
          },
        },
        items: {
          select: {
            id: true,
            productId: true,
            quantity: true,
            price: true,
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
      return NextResponse.json({ message: "No se pudo crear el pedido." }, { status: 500 });
    }

    return NextResponse.json({ order: formatOrderResponse(order) }, { status: 201 });
  } catch (error: any) {
    console.error("POST /api/orders error", error);

    if (error?.code === "P2002") {
      return NextResponse.json({ message: "No se pudo generar el número de pedido." }, { status: 409 });
    }

    return NextResponse.json({ message: "No se pudo crear el pedido." }, { status: 500 });
  }
}
