import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { prisma } from "@/lib/prisma";
import { authOptions } from "@/lib/auth/config";

type RouteContext = {
  params: Promise<{ addressId: string }>;
};

export async function PUT(
  req: NextRequest,
  { params }: RouteContext
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { addressId } = await params;
    if (!addressId) {
      return NextResponse.json({ error: "addressId is required" }, { status: 400 });
    }

    const body = await req.json();
    const requiredFields = ["firstName", "lastName", "address1", "city", "state", "zipCode", "country"];
    const missing = requiredFields.filter((field) => !body?.[field]);
    if (missing.length > 0) {
      return NextResponse.json({ error: `Missing fields: ${missing.join(", ")}` }, { status: 400 });
    }

    const userId = (session.user as any).id as string;
    const existing = await prisma.address.findFirst({
      where: { id: addressId, userId },
    });

    if (!existing) {
      return NextResponse.json({ error: "Address not found" }, { status: 404 });
    }

    const shouldBeDefault = Boolean(body?.isDefault);

    await prisma.$transaction(async (tx) => {
      if (shouldBeDefault) {
        await tx.address.updateMany({
          where: { userId },
          data: { isDefault: false },
        });
      }

      await tx.address.update({
        where: { id: addressId },
        data: {
          type: body?.type === "billing" ? "BILLING" : "SHIPPING",
          firstName: body.firstName,
          lastName: body.lastName,
          company: body.company || undefined,
          address1: body.address1,
          address2: body.address2 || undefined,
          city: body.city,
          state: body.state,
          zipCode: body.zipCode,
          country: body.country || "Argentina",
          phone: body.phone || undefined,
          isDefault: shouldBeDefault,
        },
      });
    });

    return NextResponse.json({ ok: true });
  } catch (error) {
    console.error("PUT /api/addresses error", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}

export async function DELETE(
  _req: NextRequest,
  { params }: RouteContext
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { addressId } = await params;
    if (!addressId) {
      return NextResponse.json({ error: "addressId is required" }, { status: 400 });
    }

    const userId = (session.user as any).id as string;
    const address = await prisma.address.findFirst({
      where: { id: addressId, userId },
    });

    if (!address) {
      return NextResponse.json({ error: "Address not found" }, { status: 404 });
    }

    await prisma.$transaction(async (tx) => {
      await tx.address.delete({ where: { id: addressId } });

      if (address.isDefault) {
        const nextDefault = await tx.address.findFirst({
          where: { userId },
          orderBy: { createdAt: "desc" },
        });

        if (nextDefault) {
          await tx.address.update({
            where: { id: nextDefault.id },
            data: { isDefault: true },
          });
        }
      }
    });

    return NextResponse.json({ ok: true });
  } catch (error) {
    console.error("DELETE /api/addresses error", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
