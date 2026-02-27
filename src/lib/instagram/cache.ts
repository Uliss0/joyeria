import type { Prisma } from "@prisma/client";
import { prisma } from "@/lib/prisma";
import { fetchInstagramMedia } from "@/lib/instagram/graph";
import type { InstagramFeedItem } from "@/lib/instagram/types";

const DEFAULT_CACHE_TTL_SECONDS = 3600;

const asPositiveInt = (value: string | undefined, fallback: number) => {
  const parsed = Number.parseInt(value ?? "", 10);
  return Number.isFinite(parsed) && parsed > 0 ? parsed : fallback;
};

const getTtlSeconds = () =>
  asPositiveInt(process.env.INSTAGRAM_CACHE_TTL_SECONDS, DEFAULT_CACHE_TTL_SECONDS);

const getAccountId = () => {
  const accountId = process.env.INSTAGRAM_USER_ID?.trim();
  if (!accountId) {
    throw new Error("Missing INSTAGRAM_USER_ID");
  }
  return accountId;
};

const isFeedItem = (value: unknown): value is InstagramFeedItem => {
  if (!value || typeof value !== "object") return false;
  const item = value as Record<string, unknown>;
  return (
    typeof item.id === "string" &&
    typeof item.permalink === "string" &&
    (item.mediaType === "IMAGE" || item.mediaType === "VIDEO") &&
    typeof item.timestamp === "string"
  );
};

const parsePayload = (payload: Prisma.JsonValue): InstagramFeedItem[] => {
  if (!Array.isArray(payload)) return [];
  return (payload as unknown[]).filter(isFeedItem);
};

export interface InstagramFeedCacheResult {
  items: InstagramFeedItem[];
  meta: {
    source: "cache" | "fresh";
    fetchedAt: Date;
    expiresAt: Date;
    stale: boolean;
  };
}

export async function getInstagramFeed({
  forceRefresh = false,
}: { forceRefresh?: boolean } = {}): Promise<InstagramFeedCacheResult> {
  const accountId = getAccountId();
  const now = new Date();

  const cached = await prisma.instagramFeedCache.findUnique({
    where: { accountId },
  });

  if (cached && !forceRefresh && now < cached.expiresAt) {
    return {
      items: parsePayload(cached.payload),
      meta: {
        source: "cache",
        fetchedAt: cached.fetchedAt,
        expiresAt: cached.expiresAt,
        stale: false,
      },
    };
  }

  try {
    const items = await fetchInstagramMedia();
    const fetchedAt = new Date();
    const expiresAt = new Date(fetchedAt.getTime() + getTtlSeconds() * 1000);

    const persisted = await prisma.instagramFeedCache.upsert({
      where: { accountId },
      create: {
        accountId,
        payload: items as unknown as Prisma.InputJsonValue,
        fetchedAt,
        expiresAt,
        lastError: null,
      },
      update: {
        payload: items as unknown as Prisma.InputJsonValue,
        fetchedAt,
        expiresAt,
        lastError: null,
      },
    });

    return {
      items,
      meta: {
        source: "fresh",
        fetchedAt: persisted.fetchedAt,
        expiresAt: persisted.expiresAt,
        stale: false,
      },
    };
  } catch (error) {
    if (cached) {
      await prisma.instagramFeedCache.update({
        where: { accountId },
        data: {
          lastError: error instanceof Error ? error.message.slice(0, 191) : "unknown_error",
        },
      });

      return {
        items: parsePayload(cached.payload),
        meta: {
          source: "cache",
          fetchedAt: cached.fetchedAt,
          expiresAt: cached.expiresAt,
          stale: true,
        },
      };
    }

    throw error;
  }
}
