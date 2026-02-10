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
      quantity,
      sizes,
      metal,
      description,
      imageDataUrl,
      backgroundType,
      gender,
      themes,
    } = body;

    if (!name || !categoryId || !price || !imageDataUrl) {
      return NextResponse.json({ message: "Campos requeridos faltantes" }, { status: 400 });
    }

    // Upload image to Cloudinary
    const uploadResult = await uploadToCloudinary(imageDataUrl);
    const publicId = uploadResult.public_id;
    const originalUrl = uploadResult.secure_url || uploadResult.url;

    // Build transformed URL using provided template, replacing final public id
    //const transformed = `https://res.cloudinary.com/${CLOUDINARY_CLOUD_NAME}/image/upload/e_background_removal/d_docs:placeholders:samples:avatar.png/u_unnamed_njbj9m/c_scale,h_1.10,w_1.00/fl_layer_apply,fl_no_overflow,g_center/f_webp/cs_srgb/q_auto:good/dpr_auto/${encodeURIComponent(publicId)}`;
      //const transformed= `https://res.cloudinary.com/${CLOUDINARY_CLOUD_NAME}/image/upload/e_background_removal/u_abstract-marble-black-gold-background_pyjrww/c_scale,fl_relative,w_1.22/fl_layer_apply,fl_no_overflow,g_center,x_181,y_74/ar_4:3,c_auto,w_1024/f_webp/cs_srgb/q_auto/dpr_auto/${encodeURIComponent(publicId)}`;
      const transformedblack= `https://res.cloudinary.com/${CLOUDINARY_CLOUD_NAME}${CLOUDINARY_URL_PART_BLACKMARBLE}${encodeURIComponent(publicId)}`;
      const tranformedwhite=`https://res.cloudinary.com/${CLOUDINARY_CLOUD_NAME}${CLOUDINARY_URL_PART_WHITEMARBLE}${encodeURIComponent(publicId)}`;

      const normalizedBackground = typeof backgroundType === "string" ? backgroundType.toLowerCase() : "none";
      let transformed = originalUrl;

      if (normalizedBackground === "white" && CLOUDINARY_URL_PART_WHITEMARBLE) {
        transformed = tranformedwhite;
      } else if (normalizedBackground === "black" && CLOUDINARY_URL_PART_BLACKMARBLE) {
        transformed = transformedblack;
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

    const product = await prisma.product.create({
      data: {
        name,
        slug,
        description: description || null,
        shortDescription: description ? description.slice(0, 160) : null,
        sku,
        price: price.toString(),
        stock: parseInt(quantity || "0", 10) || 0,
        category: { connect: { id: categoryId } },
        material: metal || null,
        gender: gender || null,
        images: {
          create: [{ url: transformed, alt: name, isMain: true }],
        },
        ...(themeConnectOrCreate.length > 0
          ? { tags: { connectOrCreate: themeConnectOrCreate } }
          : {}),
      },
      include: { images: true },
    });

    return NextResponse.json(product);
  } catch (err: any) {
    return NextResponse.json({ message: err.message || "Error" }, { status: 500 });
  }
}
