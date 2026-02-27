export type InstagramMediaType = "IMAGE" | "VIDEO";

export interface InstagramFeedItem {
  id: string;
  permalink: string;
  mediaType: InstagramMediaType;
  mediaUrl?: string;
  thumbnailUrl?: string;
  timestamp: string;
  caption?: string;
}

export interface InstagramFeedMeta {
  source: "cache" | "fresh";
  fetchedAt: string;
  expiresAt: string;
  stale: boolean;
}

export interface InstagramFeedResponse {
  items: InstagramFeedItem[];
  meta: InstagramFeedMeta;
}
