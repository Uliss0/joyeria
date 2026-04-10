import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { prisma } from "@/lib/prisma";
import { authOptions } from "@/lib/auth/config";

type RouteContext = {
  params: Promise<{ productId: string }>;
};

export async function DELETE(
  _req: NextRequest,
  { params }: RouteContext
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { productId } = await params;
    if (!productId) {
      return NextResponse.json({ error: "productId is required" }, { status: 400 });
    }

    await prisma.favorite.deleteMany({
      where: { userId: (session.user as any).id, productId },
    });

    return NextResponse.json({ ok: true });
  } catch (error) {
    console.error("DELETE /api/favorites error", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
