import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import type { Session } from "next-auth";
import { authOptions } from "@/lib/auth/config";

function isAdmin(session: Session | null) {
  return !!session && session.user?.role === "ADMIN";
}

// Limpia y estandariza la URL de Instagram
function cleanInstagramUrl(url: string): string {
  const trimmed = url.trim();
  // Validar formato básico
  if (!trimmed.toLowerCase().includes("instagram.com")) {
    throw new Error("La URL debe ser un enlace válido de Instagram");
  }

  // Remover parámetros de consulta como ?igsh=...
  let clean = trimmed.split("?")[0];

  // Normalizar: si contiene /username/p/shortcode o /username/reel/shortcode o /username/reels/shortcode,
  // extraer a la forma estándar /p/shortcode/ o /reel/shortcode/
  const pattern = /instagram\.com\/[^/]+\/(p|reel|reels)\/([^/]+)/i;
  const match = clean.match(pattern);
  
  if (match) {
    const type = match[1].toLowerCase() === "reels" ? "reel" : match[1].toLowerCase();
    clean = `https://www.instagram.com/${type}/${match[2]}/`;
  } else {
    // Si no tiene el username pero coincide con el estándar p/shortcode o reel/shortcode
    const stdPattern = /instagram\.com\/(p|reel|reels)\/([^/]+)/i;
    const stdMatch = clean.match(stdPattern);
    if (stdMatch) {
      const type = stdMatch[1].toLowerCase() === "reels" ? "reel" : stdMatch[1].toLowerCase();
      clean = `https://www.instagram.com/${type}/${stdMatch[2]}/`;
    } else {
      // Formato básico de fallback
      if (!clean.startsWith("http")) {
        clean = "https://" + clean.replace(/^\/+/, "");
      }
      if (!clean.endsWith("/")) {
        clean += "/";
      }
    }
  }

  return clean;
}

export async function GET() {
  const session = (await getServerSession(authOptions as any)) as Session | null;
  if (!isAdmin(session)) {
    return NextResponse.json({ message: "No autorizado" }, { status: 401 });
  }

  try {
    const posts = await prisma.instagramPost.findMany({
      orderBy: [{ order: "asc" }, { createdAt: "desc" }],
    });

    return NextResponse.json({ posts });
  } catch (err: any) {
    return NextResponse.json(
      { message: err.message || "Error al obtener publicaciones" },
      { status: 500 }
    );
  }
}

export async function POST(req: Request) {
  const session = (await getServerSession(authOptions as any)) as Session | null;
  if (!isAdmin(session)) {
    return NextResponse.json({ message: "No autorizado" }, { status: 401 });
  }

  try {
    const body = await req.json();
    const { postUrl, order } = body;

    if (!postUrl) {
      return NextResponse.json({ message: "El link de la publicación es requerido" }, { status: 400 });
    }

    let cleanedUrl;
    try {
      cleanedUrl = cleanInstagramUrl(postUrl);
    } catch (validationError: any) {
      return NextResponse.json({ message: validationError.message }, { status: 400 });
    }

    const post = await prisma.instagramPost.create({
      data: {
        postUrl: cleanedUrl,
        order: typeof order === "number" ? order : 0,
        isActive: true,
      },
    });

    return NextResponse.json(post);
  } catch (err: any) {
    return NextResponse.json(
      { message: err.message || "Error al guardar la publicación" },
      { status: 500 }
    );
  }
}

export async function PATCH(req: Request) {
  const session = (await getServerSession(authOptions as any)) as Session | null;
  if (!isAdmin(session)) {
    return NextResponse.json({ message: "No autorizado" }, { status: 401 });
  }

  try {
    const body = await req.json();
    const { orderedIds } = body;

    if (!Array.isArray(orderedIds) || orderedIds.length === 0) {
      return NextResponse.json({ message: "Se requiere un arreglo de IDs ordenados" }, { status: 400 });
    }

    // Actualizar el campo order de cada post en una transacción
    await prisma.$transaction(
      orderedIds.map((id: string, index: number) =>
        prisma.instagramPost.update({
          where: { id },
          data: { order: index },
        })
      )
    );

    return NextResponse.json({ ok: true });
  } catch (err: any) {
    return NextResponse.json(
      { message: err.message || "Error al reordenar las publicaciones" },
      { status: 500 }
    );
  }
}
