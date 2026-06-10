import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import type { Session } from "next-auth";
import { authOptions } from "@/lib/auth/config";

const CLOUDINARY_CLOUD_NAME = process.env.CLOUDINARY_CLOUD_NAME;
const CLOUDINARY_API_KEY = process.env.CLOUDINARY_API_KEY;
const CLOUDINARY_API_SECRET = process.env.CLOUDINARY_API_SECRET;
const CLOUDINARY_UPLOAD_PRESET = process.env.CLOUDINARY_UPLOAD_PRESET;

async function uploadToCloudinary(dataUrl: string) {
  if (!CLOUDINARY_CLOUD_NAME) throw new Error("CLOUDINARY_CLOUD_NAME no configurado");
  const url = `https://api.cloudinary.com/v1_1/${CLOUDINARY_CLOUD_NAME}/image/upload`;
  const body = new FormData();
  body.append("file", dataUrl);
  if (CLOUDINARY_UPLOAD_PRESET) {
    body.append("upload_preset", CLOUDINARY_UPLOAD_PRESET);
  }
  const headers: Record<string, string> | undefined = CLOUDINARY_API_KEY && CLOUDINARY_API_SECRET
    ? {
        Authorization: `Basic ${Buffer.from(`${CLOUDINARY_API_KEY}:${CLOUDINARY_API_SECRET}`).toString("base64")}`,
      }
    : undefined;
  if (!CLOUDINARY_UPLOAD_PRESET && !headers) {
    throw new Error("CLOUDINARY_UPLOAD_PRESET no configurado.");
  }
  const res = await fetch(url, { method: "POST", body, headers } as any);
  if (!res.ok) {
    const txt = await res.text();
    throw new Error(`Cloudinary upload failed: ${txt}`);
  }
  return await res.json();
}

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
      images: product.images.map((img) => ({ id: img.id, url: img.url, isMain: img.isMain, order: img.order })),
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
      newImageDataUrls,
      deletedImageIds,
      mainImageId,
    } = body;

    // 1. Process deletes if any
    if (Array.isArray(deletedImageIds) && deletedImageIds.length > 0) {
      await prisma.productImage.deleteMany({
        where: {
          id: { in: deletedImageIds },
          productId: productId,
        },
      });
    }

    // 2. Process new image uploads if any
    if (Array.isArray(newImageDataUrls) && newImageDataUrls.length > 0) {
      const currentImages = await prisma.productImage.findMany({
        where: { productId },
        orderBy: { order: "asc" },
      });
      let maxOrder = currentImages.reduce((max, img) => Math.max(max, img.order), -1);

      for (const dUrl of newImageDataUrls) {
        if (dUrl) {
          const uploadResult = await uploadToCloudinary(dUrl);
          const originalUrl = uploadResult.secure_url || uploadResult.url;
          maxOrder++;
          await prisma.productImage.create({
            data: {
              productId,
              url: originalUrl,
              alt: name || "Product Image",
              isMain: false,
              order: maxOrder,
            },
          });
        }
      }
    }

    // 3. Process main image setting if any
    if (typeof mainImageId === "string" && mainImageId) {
      await prisma.productImage.updateMany({
        where: { productId },
        data: { isMain: false },
      });
      await prisma.productImage.updateMany({
        where: { id: mainImageId, productId },
        data: { isMain: true },
      });
    }

    // 4. Ensure there is exactly one main image if images exist
    const remainingImages = await prisma.productImage.findMany({
      where: { productId },
      orderBy: { order: "asc" },
    });

    if (remainingImages.length > 0) {
      const hasMain = remainingImages.some((img) => img.isMain);
      if (!hasMain) {
        await prisma.productImage.update({
          where: { id: remainingImages[0].id },
          data: { isMain: true },
        });
      }
    }

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
        return NextResponse.json({ message: "Precio invalido" }, { status: 400 });
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
