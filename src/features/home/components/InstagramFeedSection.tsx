"use client";

import { useEffect, useState } from "react";
import { InstagramEmbed } from "react-social-media-embed";
import { motion } from "framer-motion";
import type { InstagramFeedItem } from "@/lib/instagram/types";

interface InstagramFeedSectionProps {
  className?: string;
}

const FALLBACK_POST_URLS = [
  "https://www.instagram.com/p/DRpLiXQDVBs/",
  "https://www.instagram.com/p/DRxyVKfjV18/",
  "https://www.instagram.com/p/DXPAsv0DZSl/",
  "https://www.instagram.com/reel/DTBqai0jTCn/"
];

export function InstagramFeedSection({ className }: InstagramFeedSectionProps) {
  const [postUrls, setPostUrls] = useState<string[]>([]);
  const [status, setStatus] = useState<"loading" | "success" | "error">(
    "loading"
  );

  useEffect(() => {
    let active = true;

    const run = async () => {
      try {
        const response = await fetch("/api/instagram/feed", {
          cache: "no-store",
        });

        if (!response.ok) {
          throw new Error("Failed to fetch instagram feed");
        }

        const data = (await response.json()) as { items?: InstagramFeedItem[] };
        const urls = (data.items ?? [])
          .map((item) => item.permalink)
          .filter((url): url is string => Boolean(url))
          .slice(0, 4);

        if (!active) return;

        if (urls.length > 0) {
          setPostUrls(urls);
          setStatus("success");
          return;
        }

        setPostUrls(FALLBACK_POST_URLS);
        setStatus("error");
      } catch (error) {
        console.error("Error loading instagram feed", error);
        if (!active) return;
        setPostUrls(FALLBACK_POST_URLS);
        setStatus("error");
      }
    };

    run();

    return () => {
      active = false;
    };
  }, []);

  return (
    <section className={`py-16 bg-gray-50 ${className}`}>
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7 }}
          viewport={{ once: true }}
          className="text-center mb-12 max-w-3xl mx-auto"
        >
          <h2 className="text-4xl md:text-5xl font-serif font-light text-gray-900 mb-6 leading-snug">
            Nuestras ultimas novedades en Instagram
          </h2>
          <p className="text-lg text-gray-700 font-sans">
            Siguenos en Instagram para descubrir nuestras ultimas colecciones y
            momentos especiales.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8 justify-items-center">
          {status === "loading"
            ? Array.from({ length: 4 }).map((_, index) => (
                <motion.div
                  key={`skeleton-${index}`}
                  initial={{ opacity: 0, scale: 0.9 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  viewport={{ once: true }}
                  className="w-full max-w-sm h-[520px] rounded-lg bg-gray-200 animate-pulse"
                />
              ))
            : postUrls.map((postUrl, index) => (
                <motion.div
                  key={postUrl}
                  initial={{ opacity: 0, scale: 0.9 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  viewport={{ once: true }}
                  className="w-full max-w-sm"
                >
                  <InstagramEmbed url={postUrl} width="100%" />
                </motion.div>
              ))}
        </div>
      </div>
    </section>
  );
}
