import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import type { Session } from "next-auth";
import { authOptions } from "@/lib/auth/config";

function isAdmin(session: Session | null) {
  return !!session && session.user?.role === "ADMIN";
}

type RouteContext = {
  params: Promise<{ postId: string }>;
};

export async function DELETE(_: NextRequest, { params }: RouteContext) {
  const session = (await getServerSession(authOptions as any)) as Session | null;
  if (!isAdmin(session)) {
    return NextResponse.json({ message: "No autorizado" }, { status: 401 });
  }

  try {
    const { postId } = await params;
    await prisma.instagramPost.delete({ where: { id: postId } });
    return NextResponse.json({ ok: true });
  } catch (err: any) {
    return NextResponse.json(
      { message: err.message || "Error al eliminar la publicación" },
      { status: 500 }
    );
  }
}
