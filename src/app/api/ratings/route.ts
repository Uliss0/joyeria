import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { prisma } from "@/lib/prisma";
import { authOptions } from "@/lib/auth/config";

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();
    const productId = body?.productId as string | undefined;
    const rating = Number(body?.rating);

    if (!productId) {
      return NextResponse.json({ error: "productId is required" }, { status: 400 });
    }

    if (!Number.isInteger(rating) || rating < 1 || rating > 5) {
      return NextResponse.json({ error: "rating must be an integer between 1 and 5" }, { status: 400 });
    }

    await prisma.productRating.upsert({
      where: {
        userId_productId: { userId: (session.user as any).id, productId },
      },
      update: { rating },
      create: { userId: (session.user as any).id, productId, rating },
    });

    const summary = await prisma.productRating.aggregate({
      where: { productId },
      _avg: { rating: true },
      _count: { rating: true },
    });

    return NextResponse.json({
      average: summary._avg.rating ?? 0,
      count: summary._count.rating ?? 0,
      userRating: rating,
    });
  } catch (error) {
    console.error("POST /api/ratings error", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
