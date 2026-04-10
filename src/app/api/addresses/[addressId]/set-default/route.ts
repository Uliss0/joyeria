import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { prisma } from "@/lib/prisma";
import { authOptions } from "@/lib/auth/config";

type RouteContext = {
  params: Promise<{ addressId: string }>;
};

export async function PUT(
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
      await tx.address.updateMany({
        where: { userId },
        data: { isDefault: false },
      });
      await tx.address.update({
        where: { id: addressId },
        data: { isDefault: true },
      });
    });

    return NextResponse.json({ ok: true });
  } catch (error) {
    console.error("PUT /api/addresses/set-default error", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
