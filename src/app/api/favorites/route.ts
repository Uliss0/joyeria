import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { prisma } from "@/lib/prisma";
import { authOptions } from "@/lib/auth/config";

const mapProduct = (p: any) => ({
  id: p.id,
  name: p.name,
  slug: p.slug,
  price: Number(p.price),
  compareAtPrice: p.compareAtPrice ? Number(p.compareAtPrice) : undefined,
  images: (p.images || []).map((img: any) => ({
    url: img.url,
    alt: img.alt || "",
    isMain: img.isMain,
  })),
  category: p.category
    ? { name: p.category.name, slug: p.category.slug }
    : { name: "Colección", slug: "coleccion" },
  isFeatured: p.isFeatured,
  isNew: false,
  tags: ((p as any).producttoproducttag || [])
    .map((link: any) => link.product_tags)
    .filter(Boolean)
    .map((t: any) => ({ name: t.name, color: t.color || "#000" })),
});

export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const favorites = await prisma.favorite.findMany({
      where: { userId: (session.user as any).id },
      include: {
        product: {
          include: {
            images: true,
            producttoproducttag: { include: { product_tags: true } },
            category: true,
          },
        },
      },
      orderBy: { createdAt: "desc" },
    });

    const products = favorites.map((favorite) => mapProduct(favorite.product));

    return NextResponse.json({ favorites: products });
  } catch (error) {
    console.error("GET /api/favorites error", error);
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
    const productId = body?.productId as string | undefined;
    if (!productId) {
      return NextResponse.json({ error: "productId is required" }, { status: 400 });
    }

    await prisma.favorite.upsert({
      where: {
        userId_productId: { userId: (session.user as any).id, productId },
      },
      update: {},
      create: { userId: (session.user as any).id, productId },
    });

    return NextResponse.json({ ok: true });
  } catch (error) {
    console.error("POST /api/favorites error", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
