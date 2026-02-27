import { NextResponse } from "next/server";
import { getInstagramFeed } from "@/lib/instagram/cache";

export async function GET() {
  try {
    const result = await getInstagramFeed();

    if (result.meta.stale) {
      console.warn("GET /api/instagram/feed returned stale cache");
    }

    return NextResponse.json(
      {
        items: result.items,
        meta: {
          source: result.meta.source,
          fetchedAt: result.meta.fetchedAt.toISOString(),
          expiresAt: result.meta.expiresAt.toISOString(),
          stale: result.meta.stale,
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
