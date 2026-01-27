import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import type { Session } from "next-auth";
import { authOptions } from "@/lib/auth/config";

export async function POST(req: Request) {
  const session = (await getServerSession(authOptions as any)) as Session | null;
  if (!session || session.user?.role !== "ADMIN") {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  const categories = [
    { name: "Anillos", slug: "anillos", description: "Anillos de distintos estilos" },
    { name: "Collares", slug: "collares", description: "Collares elegantes y modernos" },
    { name: "Pulseras", slug: "pulseras", description: "Pulseras y brazaletes" },
    { name: "Aros", slug: "aros", description: "Aros y pendientes" },
  ];

  await prisma.category.createMany({ data: categories.map((c) => ({ ...c })), skipDuplicates: true });

  const result = await prisma.category.findMany({ select: { id: true, name: true } });

  return NextResponse.json(result);
}
