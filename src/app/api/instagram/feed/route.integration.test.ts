import { describe, expect, it, vi } from "vitest";

const mocks = vi.hoisted(() => ({
  getInstagramFeed: vi.fn(),
}));

vi.mock("@/lib/instagram/cache", () => ({
  getInstagramFeed: mocks.getInstagramFeed,
}));

import { GET } from "@/app/api/instagram/feed/route";

describe("GET /api/instagram/feed", () => {
  it("returns 200 with cache source", async () => {
    mocks.getInstagramFeed.mockResolvedValue({
      items: [
        {
          id: "p1",
          permalink: "https://instagram.com/p/1",
          mediaType: "IMAGE",
          timestamp: "2026-01-01T00:00:00.000Z",
        },
      ],
      meta: {
        source: "cache",
        fetchedAt: new Date("2026-01-01T00:00:00.000Z"),
        expiresAt: new Date("2026-01-01T01:00:00.000Z"),
        stale: false,
      },
    });

    const response = await GET();
    const data = await response.json();

    expect(response.status).toBe(200);
    expect(response.headers.get("cache-control")).toBe("no-store");
    expect(data.meta.source).toBe("cache");
  });

  it("returns 200 with fresh source", async () => {
    mocks.getInstagramFeed.mockResolvedValue({
      items: [],
      meta: {
        source: "fresh",
        fetchedAt: new Date("2026-01-01T00:00:00.000Z"),
        expiresAt: new Date("2026-01-01T01:00:00.000Z"),
        stale: false,
      },
    });

    const response = await GET();
    const data = await response.json();

    expect(response.status).toBe(200);
    expect(data.meta.source).toBe("fresh");
  });

  it("returns 200 and stale true when cache fallback is used", async () => {
    const warnSpy = vi.spyOn(console, "warn").mockImplementation(() => {});

    mocks.getInstagramFeed.mockResolvedValue({
      items: [],
      meta: {
        source: "cache",
        fetchedAt: new Date("2026-01-01T00:00:00.000Z"),
        expiresAt: new Date("2026-01-01T01:00:00.000Z"),
        stale: true,
      },
    });

    const response = await GET();
    const data = await response.json();

    expect(response.status).toBe(200);
    expect(data.meta.stale).toBe(true);
    expect(warnSpy).toHaveBeenCalled();
  });

  it("returns 500 when feed is unavailable", async () => {
    const errorSpy = vi.spyOn(console, "error").mockImplementation(() => {});

    mocks.getInstagramFeed.mockRejectedValue(new Error("IG down"));

    const response = await GET();
    const data = await response.json();

    expect(response.status).toBe(500);
    expect(response.headers.get("cache-control")).toBe("no-store");
    expect(data).toEqual({
      error: "instagram_unavailable",
      items: [],
    });
    expect(errorSpy).toHaveBeenCalled();
  });
});
