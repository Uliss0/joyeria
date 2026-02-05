import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { AddressType } from "@prisma/client";
import { prisma } from "@/lib/prisma";
import { authOptions } from "@/lib/auth/config";

const mapAddress = (address: any) => ({
  id: address.id,
  type: address.type === "BILLING" ? "billing" : "shipping",
  firstName: address.firstName,
  lastName: address.lastName,
  company: address.company || undefined,
  address1: address.address1,
  address2: address.address2 || undefined,
  city: address.city,
  state: address.state,
  zipCode: address.zipCode,
  country: address.country,
  phone: address.phone || undefined,
  isDefault: Boolean(address.isDefault),
});

const normalizeType = (value: unknown) =>
  value === "billing" ? AddressType.BILLING : AddressType.SHIPPING;

export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const addresses = await prisma.address.findMany({
      where: { userId: (session.user as any).id },
      orderBy: [{ isDefault: "desc" }, { createdAt: "desc" }],
    });

    return NextResponse.json({ addresses: addresses.map(mapAddress) });
  } catch (error) {
    console.error("GET /api/addresses error", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();
    const requiredFields = ["firstName", "lastName", "address1", "city", "state", "zipCode", "country"];
    const missing = requiredFields.filter((field) => !body?.[field]);
    if (missing.length > 0) {
      return NextResponse.json({ error: `Missing fields: ${missing.join(", ")}` }, { status: 400 });
    }

    const userId = (session.user as any).id as string;
    const shouldBeDefault =
      Boolean(body?.isDefault) || (await prisma.address.count({ where: { userId } })) === 0;

    const created = await prisma.$transaction(async (tx) => {
      if (shouldBeDefault) {
        await tx.address.updateMany({
          where: { userId },
          data: { isDefault: false },
        });
      }

      return tx.address.create({
        data: {
          userId,
          type: normalizeType(body?.type),
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

    return NextResponse.json({ address: mapAddress(created) }, { status: 201 });
  } catch (error) {
    console.error("POST /api/addresses error", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
