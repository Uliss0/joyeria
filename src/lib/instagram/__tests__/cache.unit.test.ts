import { beforeEach, describe, expect, it, vi } from "vitest";

const mocks = vi.hoisted(() => ({
  findUnique: vi.fn(),
  upsert: vi.fn(),
  update: vi.fn(),
  fetchInstagramMedia: vi.fn(),
}));

vi.mock("@/lib/prisma", () => ({
  prisma: {
    instagramFeedCache: {
      findUnique: mocks.findUnique,
      upsert: mocks.upsert,
      update: mocks.update,
    },
  },
}));

vi.mock("@/lib/instagram/graph", () => ({
  fetchInstagramMedia: mocks.fetchInstagramMedia,
}));

import { getInstagramFeed } from "@/lib/instagram/cache";

describe("getInstagramFeed", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    process.env.INSTAGRAM_USER_ID = "ig-user-1";
    process.env.INSTAGRAM_CACHE_TTL_SECONDS = "3600";
  });

  it("returns fresh cache without hitting graph", async () => {
    const now = new Date();
    const cached = {
      accountId: "ig-user-1",
      payload: [
        {
          id: "p1",
          permalink: "https://instagram.com/p/1",
          mediaType: "IMAGE",
          timestamp: now.toISOString(),
        },
      ],
      fetchedAt: now,
      expiresAt: new Date(now.getTime() + 60_000),
    };

    mocks.findUnique.mockResolvedValue(cached);

    const result = await getInstagramFeed();

    expect(mocks.fetchInstagramMedia).not.toHaveBeenCalled();
    expect(result.meta.source).toBe("cache");
    expect(result.meta.stale).toBe(false);
    expect(result.items).toHaveLength(1);
  });

  it("refreshes cache when expired", async () => {
    const oldDate = new Date(Date.now() - 120_000);
    const newDate = new Date();

    mocks.findUnique.mockResolvedValue({
      accountId: "ig-user-1",
      payload: [],
      fetchedAt: oldDate,
      expiresAt: oldDate,
    });

    mocks.fetchInstagramMedia.mockResolvedValue([
      {
        id: "p2",
        permalink: "https://instagram.com/p/2",
        mediaType: "VIDEO",
        timestamp: newDate.toISOString(),
      },
    ]);

    mocks.upsert.mockResolvedValue({
      fetchedAt: newDate,
      expiresAt: new Date(newDate.getTime() + 3600_000),
    });

    const result = await getInstagramFeed();

    expect(mocks.fetchInstagramMedia).toHaveBeenCalledTimes(1);
    expect(mocks.upsert).toHaveBeenCalledTimes(1);
    expect(result.meta.source).toBe("fresh");
    expect(result.items[0]?.id).toBe("p2");
  });

  it("returns stale cache when graph fails and cache exists", async () => {
    const oldDate = new Date(Date.now() - 120_000);
    const cached = {
      accountId: "ig-user-1",
      payload: [
        {
          id: "p1",
          permalink: "https://instagram.com/p/1",
          mediaType: "IMAGE",
          timestamp: oldDate.toISOString(),
        },
      ],
      fetchedAt: oldDate,
      expiresAt: oldDate,
    };

    mocks.findUnique.mockResolvedValue(cached);
    mocks.fetchInstagramMedia.mockRejectedValue(new Error("IG down"));

    const result = await getInstagramFeed();

    expect(result.meta.source).toBe("cache");
    expect(result.meta.stale).toBe(true);
    expect(mocks.update).toHaveBeenCalledTimes(1);
  });

  it("throws when graph fails and cache does not exist", async () => {
    mocks.findUnique.mockResolvedValue(null);
    mocks.fetchInstagramMedia.mockRejectedValue(new Error("IG down"));

    await expect(getInstagramFeed()).rejects.toThrow("IG down");
  });
});
