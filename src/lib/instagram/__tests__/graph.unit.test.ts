import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { fetchInstagramMedia } from "@/lib/instagram/graph";

const originalEnv = process.env;

describe("fetchInstagramMedia", () => {
  beforeEach(() => {
    process.env = {
      ...originalEnv,
      INSTAGRAM_USER_ID: "ig-user-1",
      INSTAGRAM_ACCESS_TOKEN: "token-1",
      INSTAGRAM_FEED_LIMIT: "2",
      INSTAGRAM_API_VERSION: "v22.0",
    };
  });

  afterEach(() => {
    process.env = originalEnv;
    vi.restoreAllMocks();
  });

  it("maps graph response and filters unsupported media", async () => {
    vi.spyOn(global, "fetch").mockResolvedValue(
      new Response(
        JSON.stringify({
          data: [
            {
              id: "1",
              media_type: "IMAGE",
              permalink: "https://instagram.com/p/1",
              timestamp: "2026-01-01T00:00:00+0000",
              caption: "post 1",
            },
            {
              id: "2",
              media_type: "CAROUSEL_ALBUM",
              permalink: "https://instagram.com/p/2",
              timestamp: "2026-01-01T00:00:00+0000",
            },
            {
              id: "3",
              media_type: "VIDEO",
              permalink: "https://instagram.com/p/3",
              timestamp: "2026-01-01T00:00:00+0000",
            },
          ],
        }),
        { status: 200 }
      )
    );

    const items = await fetchInstagramMedia();

    expect(items).toEqual([
      {
        id: "1",
        mediaType: "IMAGE",
        permalink: "https://instagram.com/p/1",
        timestamp: "2026-01-01T00:00:00+0000",
        caption: "post 1",
        mediaUrl: undefined,
        thumbnailUrl: undefined,
      },
      {
        id: "3",
        mediaType: "VIDEO",
        permalink: "https://instagram.com/p/3",
        timestamp: "2026-01-01T00:00:00+0000",
        mediaUrl: undefined,
        thumbnailUrl: undefined,
        caption: undefined,
      },
    ]);
  });

  it("respects INSTAGRAM_FEED_LIMIT", async () => {
    process.env.INSTAGRAM_FEED_LIMIT = "1";

    vi.spyOn(global, "fetch").mockResolvedValue(
      new Response(
        JSON.stringify({
          data: [
            {
              id: "1",
              media_type: "IMAGE",
              permalink: "https://instagram.com/p/1",
              timestamp: "2026-01-01T00:00:00+0000",
            },
            {
              id: "2",
              media_type: "VIDEO",
              permalink: "https://instagram.com/p/2",
              timestamp: "2026-01-01T00:00:00+0000",
            },
          ],
        }),
        { status: 200 }
      )
    );

    const items = await fetchInstagramMedia();

    expect(items).toHaveLength(1);
    expect(items[0]?.id).toBe("1");
  });

  it("throws when required env vars are missing", async () => {
    delete process.env.INSTAGRAM_ACCESS_TOKEN;

    await expect(fetchInstagramMedia()).rejects.toThrow(
      "Missing INSTAGRAM_ACCESS_TOKEN"
    );
  });
});
