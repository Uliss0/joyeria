import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import type { Session } from "next-auth";
import { authOptions } from "@/lib/auth/config";


const CLOUDINARY_CLOUD_NAME = process.env.CLOUDINARY_CLOUD_NAME;
const CLOUDINARY_API_KEY = process.env.CLOUDINARY_API_KEY;
const CLOUDINARY_API_SECRET = process.env.CLOUDINARY_API_SECRET;
const CLOUDINARY_UPLOAD_PRESET = process.env.CLOUDINARY_UPLOAD_PRESET;
const CLOUDINARY_URL_PART_BLACKMARBLE = process.env.CLOUDINARY_URL_PART_BLACKMARBLE  || "";
const CLOUDINARY_URL_PART_WHITEMARBLE = process.env.CLOUDINARY_URL_PART_WHITEMARBLE || "";

function slugify(str: string) {
  return str
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)+/g, "");
}

async function uploadToCloudinary(dataUrl: string) {
  if (!CLOUDINARY_CLOUD_NAME) throw new Error("CLOUDINARY_CLOUD_NAME no configurado");

  const url = `https://api.cloudinary.com/v1_1/${CLOUDINARY_CLOUD_NAME}/image/upload`;

  const body = new FormData();
  body.append("file", dataUrl);

  // If upload preset is provided, use unsigned upload
  if (CLOUDINARY_UPLOAD_PRESET) {
    body.append("upload_preset", CLOUDINARY_UPLOAD_PRESET);
  }

  // If API key + secret are provided, use basic auth for signed upload
  const headers: Record<string, string> | undefined = CLOUDINARY_API_KEY && CLOUDINARY_API_SECRET
    ? {
        Authorization: `Basic ${Buffer.from(`${CLOUDINARY_API_KEY}:${CLOUDINARY_API_SECRET}`).toString("base64")}`,
      }
    : undefined;

  // If neither preset nor credentials are configured, fail fast with helpful message
  if (!CLOUDINARY_UPLOAD_PRESET && !headers) {
    throw new Error(
      "CLOUDINARY_UPLOAD_PRESET no configurado. Configurá CLOUDINARY_UPLOAD_PRESET para uploads sin firma, o CLOUDINARY_API_KEY y CLOUDINARY_API_SECRET para uploads firmados."
    );
  }

  const res = await fetch(url, {
    method: "POST",
    body,
    headers,
  } as any);

  if (!res.ok) {
    const txt = await res.text();
    throw new Error(`Cloudinary upload failed: ${txt}`);
  }

  const json = await res.json();
  return json; // contains public_id, secure_url, etc.
}



export async function POST(req: Request) {
  const session = (await getServerSession(authOptions as any)) as Session | null;
  if (!session || session.user?.role !== "ADMIN") {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  try {
    const body = await req.json();
    const {
      name,
      categoryId,
      price,
      compareAtPrice,
      quantity,
      sizes,
      metal,
      description,
      imageDataUrl,
      imageDataUrls,
      backgroundType,
      gender,
      themes,
    } = body;

    if (!name || !categoryId || !price) {
      return NextResponse.json({ message: "Campos requeridos faltantes" }, { status: 400 });
    }

    const urlsToUpload = Array.isArray(imageDataUrls)
      ? imageDataUrls
      : imageDataUrl
        ? [imageDataUrl]
        : [];

    if (urlsToUpload.length === 0) {
      return NextResponse.json({ message: "Se requiere al menos una imagen" }, { status: 400 });
    }

    const uploadedUrls: string[] = [];
    for (const dUrl of urlsToUpload) {
      if (dUrl) {
        const uploadResult = await uploadToCloudinary(dUrl);
        const publicId = uploadResult.public_id;
        const originalUrl = uploadResult.secure_url || uploadResult.url;

        const transformedblack = `https://res.cloudinary.com/${CLOUDINARY_CLOUD_NAME}${CLOUDINARY_URL_PART_BLACKMARBLE}${encodeURIComponent(publicId)}`;
        const tranformedwhite = `https://res.cloudinary.com/${CLOUDINARY_CLOUD_NAME}${CLOUDINARY_URL_PART_WHITEMARBLE}${encodeURIComponent(publicId)}`;

        const normalizedBackground = typeof backgroundType === "string" ? backgroundType.toLowerCase() : "none";
        let transformed = originalUrl;

        if (normalizedBackground === "white" && CLOUDINARY_URL_PART_WHITEMARBLE) {
          transformed = tranformedwhite;
        } else if (normalizedBackground === "black" && CLOUDINARY_URL_PART_BLACKMARBLE) {
          transformed = transformedblack;
        }
        uploadedUrls.push(transformed);
      }
    }

    if (uploadedUrls.length === 0) {
      return NextResponse.json({ message: "Error al procesar las imagenes" }, { status: 400 });
    }

    // Generate slug and sku
    const baseSlug = slugify(name || "product");
    const slug = `${baseSlug}-${Date.now().toString().slice(-5)}`;
    const sku = `SKU-${Date.now().toString().slice(-6)}`;

    const themeList = Array.isArray(themes)
      ? themes
      : typeof themes === "string"
        ? themes.split(",")
        : [];

    const uniqueThemes = Array.from(
      new Set(themeList.map((theme: string) => theme.trim()).filter(Boolean))
    );

    const themeConnectOrCreate = uniqueThemes.map((theme: string) => {
      const slug = slugify(theme);
      return {
        where: { slug },
        create: { name: theme, slug },
      };
    });

    const parsedPrice = Number(price);
    if (!Number.isFinite(parsedPrice)) {
      return NextResponse.json({ message: "Precio invalido" }, { status: 400 });
    }
    const parsedCompareAt = compareAtPrice !== undefined && compareAtPrice !== null && `${compareAtPrice}`.length > 0
      ? Number(compareAtPrice)
      : null;

    const product = await prisma.product.create({
      data: {
        name,
        slug,
        description: description || null,
        shortDescription: description ? description.slice(0, 160) : null,
        sku,
        price: parsedPrice.toString(),
        compareAtPrice: Number.isFinite(parsedCompareAt) ? parsedCompareAt?.toString() : null,
        stock: parseInt(quantity || "0", 10) || 0,
        category: { connect: { id: categoryId } },
        material: metal || null,
        gender: gender || null,
        images: {
          create: uploadedUrls.map((url, idx) => ({
            url,
            alt: name,
            isMain: idx === 0,
            order: idx,
          })),
        },
        ...(themeConnectOrCreate.length > 0
          ? {
              producttoproducttag: {
                create: themeConnectOrCreate.map((theme) => ({
                  product_tags: {
                    connectOrCreate: theme,
                  },
                })),
              },
            }
          : {}),
      },
      include: { images: true },
    });

    return NextResponse.json(product);
  } catch (err: any) {
    return NextResponse.json({ message: err.message || "Error" }, { status: 500 });
  }
}

export async function GET() {
  const session = (await getServerSession(authOptions as any)) as Session | null;
  if (!session || session.user?.role !== "ADMIN") {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  try {
    const products = await prisma.product.findMany({
      orderBy: [{ createdAt: "desc" }],
      include: { images: true, category: true },
    });

    const mapped = products.map((p) => ({
      id: p.id,
      name: p.name,
      slug: p.slug,
      price: Number(p.price),
      compareAtPrice: p.compareAtPrice ? Number(p.compareAtPrice) : null,
      stock: p.stock,
      isActive: p.isActive,
      category: p.category ? { id: p.category.id, name: p.category.name } : null,
      image: p.images.find((img) => img.isMain)?.url || p.images[0]?.url || null,
      createdAt: p.createdAt?.toISOString(),
    }));

    return NextResponse.json({ products: mapped });
  } catch (err: any) {
    return NextResponse.json({ message: err.message || "Error" }, { status: 500 });
  }
}
