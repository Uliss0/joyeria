import type { InstagramFeedItem } from "@/lib/instagram/types";

const DEFAULT_API_VERSION = "v22.0";
const DEFAULT_FEED_LIMIT = 4;
const GRAPH_FETCH_LIMIT = 12;
const GRAPH_TIMEOUT_MS = 8_000;

interface GraphMediaItem {
  id?: string;
  caption?: string;
  media_type?: string;
  media_url?: string;
  thumbnail_url?: string;
  permalink?: string;
  timestamp?: string;
}

interface GraphMediaResponse {
  data?: GraphMediaItem[];
  error?: {
    message?: string;
  };
}

export class InstagramGraphError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "InstagramGraphError";
  }
}

const asPositiveInt = (value: string | undefined, fallback: number) => {
  const parsed = Number.parseInt(value ?? "", 10);
  return Number.isFinite(parsed) && parsed > 0 ? parsed : fallback;
};

const getApiVersion = () =>
  process.env.INSTAGRAM_API_VERSION?.trim() || DEFAULT_API_VERSION;

const getFeedLimit = () =>
  asPositiveInt(process.env.INSTAGRAM_FEED_LIMIT, DEFAULT_FEED_LIMIT);

const isSupportedMediaType = (value?: string): value is "IMAGE" | "VIDEO" =>
  value === "IMAGE" || value === "VIDEO";

const normalizeGraphItem = (item: GraphMediaItem): InstagramFeedItem | null => {
  if (!item.id || !item.permalink || !item.timestamp) return null;
  if (!isSupportedMediaType(item.media_type)) return null;

  return {
    id: item.id,
    permalink: item.permalink,
    mediaType: item.media_type,
    mediaUrl: item.media_url,
    thumbnailUrl: item.thumbnail_url,
    timestamp: item.timestamp,
    caption: item.caption,
  };
};

export async function fetchInstagramMedia(): Promise<InstagramFeedItem[]> {
  const userId = process.env.INSTAGRAM_USER_ID?.trim();
  const accessToken = process.env.INSTAGRAM_ACCESS_TOKEN?.trim();
  const apiVersion = getApiVersion();
  const feedLimit = getFeedLimit();

  if (!userId) {
    throw new InstagramGraphError("Missing INSTAGRAM_USER_ID");
  }

  if (!accessToken) {
    throw new InstagramGraphError("Missing INSTAGRAM_ACCESS_TOKEN");
  }

  const params = new URLSearchParams({
    fields:
      "id,caption,media_type,media_url,thumbnail_url,permalink,timestamp",
    access_token: accessToken,
    limit: String(GRAPH_FETCH_LIMIT),
  });

  const url = `https://graph.facebook.com/${apiVersion}/${userId}/media?${params.toString()}`;

  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), GRAPH_TIMEOUT_MS);

  let response: Response;
  try {
    response = await fetch(url, { signal: controller.signal });
  } catch (error) {
    const isAbortError =
      error instanceof Error && error.name === "AbortError";
    throw new InstagramGraphError(
      isAbortError ? "Instagram Graph timeout" : "Instagram Graph fetch failed"
    );
  } finally {
    clearTimeout(timeoutId);
  }

  let body: GraphMediaResponse;
  try {
    body = (await response.json()) as GraphMediaResponse;
  } catch {
    throw new InstagramGraphError("Invalid Instagram Graph response");
  }

  if (!response.ok) {
    const apiMessage = body?.error?.message || "Instagram Graph API error";
    throw new InstagramGraphError(apiMessage);
  }

  const normalized = (body.data ?? [])
    .map(normalizeGraphItem)
    .filter((item): item is InstagramFeedItem => item !== null)
    .slice(0, feedLimit);

  return normalized;
}
