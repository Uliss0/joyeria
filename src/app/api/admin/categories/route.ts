import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import type { Session } from "next-auth";
import { authOptions } from "@/lib/auth/config";

export async function GET(req: Request) {
  const session = (await getServerSession(authOptions as any)) as Session | null;
  if (!session || session.user?.role !== "ADMIN") {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  const categories = await prisma.category.findMany({ select: { id: true, name: true } });
  return NextResponse.json(categories);
}
