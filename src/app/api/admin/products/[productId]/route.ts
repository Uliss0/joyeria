import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import type { Session } from "next-auth";
import { authOptions } from "@/lib/auth/config";

export async function GET(
  _req: Request,
  { params }: { params: Promise<{ productId: string }> }
) {
  const session = (await getServerSession(authOptions as any)) as Session | null;
  if (!session || session.user?.role !== "ADMIN") {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  try {
    const { productId } = await params;
    const product = await prisma.product.findUnique({
      where: { id: productId },
      include: { images: true, category: true },
    });

    if (!product) {
      return NextResponse.json({ message: "Producto no encontrado" }, { status: 404 });
    }

    return NextResponse.json({
      id: product.id,
      name: product.name,
      slug: product.slug,
      price: Number(product.price),
      compareAtPrice: product.compareAtPrice ? Number(product.compareAtPrice) : null,
      stock: product.stock,
      description: product.description || "",
      categoryId: product.categoryId,
      gender: product.gender || "",
      material: product.material || "",
      isActive: product.isActive,
      image: product.images.find((img) => img.isMain)?.url || product.images[0]?.url || null,
    });
  } catch (err: any) {
    return NextResponse.json({ message: err.message || "Error" }, { status: 500 });
  }
}

export async function PATCH(
  req: Request,
  { params }: { params: Promise<{ productId: string }> }
) {
  const session = (await getServerSession(authOptions as any)) as Session | null;
  if (!session || session.user?.role !== "ADMIN") {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  try {
    const { productId } = await params;
    const body = await req.json();
    const {
      name,
      categoryId,
      price,
      compareAtPrice,
      quantity,
      gender,
      metal,
      description,
      isActive,
    } = body;

    const data: any = {};

    if (typeof name === "string") data.name = name;
    if (typeof categoryId === "string" && categoryId) data.category = { connect: { id: categoryId } };
    if (typeof description === "string") {
      data.description = description;
      data.shortDescription = description ? description.slice(0, 160) : null;
    }
    if (typeof gender === "string") data.gender = gender || null;
    if (typeof metal === "string") data.material = metal || null;
    if (typeof isActive === "boolean") data.isActive = isActive;

    if (price !== undefined) {
      const parsedPrice = Number(price);
      if (!Number.isFinite(parsedPrice)) {
        return NextResponse.json({ message: "Precio invÃ¡lido" }, { status: 400 });
      }
      data.price = parsedPrice.toString();
    }

    if (compareAtPrice !== undefined) {
      const parsedCompareAt =
        compareAtPrice !== null && `${compareAtPrice}`.length > 0 ? Number(compareAtPrice) : null;
      data.compareAtPrice = Number.isFinite(parsedCompareAt) ? parsedCompareAt?.toString() : null;
    }

    if (quantity !== undefined) {
      const parsedStock = parseInt(quantity, 10);
      data.stock = Number.isFinite(parsedStock) ? parsedStock : 0;
    }

    const product = await prisma.product.update({
      where: { id: productId },
      data,
    });

    return NextResponse.json({ ok: true, id: product.id });
  } catch (err: any) {
    return NextResponse.json({ message: err.message || "Error" }, { status: 500 });
  }
}

export async function DELETE(
  _req: Request,
  { params }: { params: Promise<{ productId: string }> }
) {
  const session = (await getServerSession(authOptions as any)) as Session | null;
  if (!session || session.user?.role !== "ADMIN") {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  try {
    const { productId } = await params;
    await prisma.product.delete({ where: { id: productId } });
    return NextResponse.json({ ok: true });
  } catch (err: any) {
    return NextResponse.json({ message: err.message || "Error" }, { status: 500 });
  }
}
