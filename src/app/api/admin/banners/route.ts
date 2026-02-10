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

  const headers: Record<string, string> | undefined =
    CLOUDINARY_API_KEY && CLOUDINARY_API_SECRET
      ? {
          Authorization: `Basic ${Buffer.from(
            `${CLOUDINARY_API_KEY}:${CLOUDINARY_API_SECRET}`
          ).toString("base64")}`,
        }
      : undefined;

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

  return res.json();
}

function isAdmin(session: Session | null) {
  return !!session && session.user?.role === "ADMIN";
}

export async function GET() {
  const session = (await getServerSession(authOptions as any)) as Session | null;
  if (!isAdmin(session)) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  const banners = await prisma.promoBanner.findMany({
    orderBy: [{ order: "asc" }, { createdAt: "desc" }],
  });

  return NextResponse.json({ banners });
}

export async function POST(req: Request) {
  const session = (await getServerSession(authOptions as any)) as Session | null;
  if (!isAdmin(session)) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  try {
    const body = await req.json();
    const { imageDataUrl, linkUrl } = body;

    if (!imageDataUrl) {
      return NextResponse.json({ message: "La imagen es requerida" }, { status: 400 });
    }

    const uploadResult = await uploadToCloudinary(imageDataUrl);
    const imageUrl = uploadResult.secure_url || uploadResult.url;

    const banner = await prisma.promoBanner.create({
      data: {
        imageUrl,
        linkUrl: typeof linkUrl === "string" && linkUrl.trim() ? linkUrl.trim() : null,
      },
    });

    return NextResponse.json(banner);
  } catch (err: any) {
    return NextResponse.json({ message: err.message || "Error" }, { status: 500 });
  }
}
