import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    const posts = await prisma.instagramPost.findMany({
      where: { isActive: true },
      orderBy: [{ order: "asc" }, { createdAt: "desc" }],
    });

    const items = posts.map((post) => ({
      id: post.id,
      permalink: post.postUrl,
    }));

    return NextResponse.json(
      {
        items,
        meta: {
          source: "database",
          fetchedAt: new Date().toISOString(),
          expiresAt: new Date().toISOString(),
          stale: false,
        },
      },
      {
        headers: {
          "Cache-Control": "no-store",
        },
      }
    );
  } catch (error) {
    console.error("GET /api/instagram/feed error", error);

    return NextResponse.json(
      {
        error: "instagram_unavailable",
        items: [],
      },
      {
        status: 500,
        headers: {
          "Cache-Control": "no-store",
        },
      }
    );
  }
}

