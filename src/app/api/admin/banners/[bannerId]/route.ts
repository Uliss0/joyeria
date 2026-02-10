import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import type { Session } from "next-auth";
import { authOptions } from "@/lib/auth/config";

function isAdmin(session: Session | null) {
  return !!session && session.user?.role === "ADMIN";
}

export async function DELETE(_: Request, { params }: { params: { bannerId: string } }) {
  const session = (await getServerSession(authOptions as any)) as Session | null;
  if (!isAdmin(session)) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  try {
    await prisma.promoBanner.delete({ where: { id: params.bannerId } });
    return NextResponse.json({ ok: true });
  } catch (err: any) {
    return NextResponse.json({ message: err.message || "Error" }, { status: 500 });
  }
}
