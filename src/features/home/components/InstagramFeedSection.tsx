"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";

interface InstagramFeedSectionProps {
  className?: string;
}

const FALLBACK_POST_URLS = [
  "https://www.instagram.com/p/DRpLiXQDVBs/",
  "https://www.instagram.com/p/DRxyVKfjV18/",
  "https://www.instagram.com/p/DXPAsv0DZSl/",
  "https://www.instagram.com/reel/DTBqai0jTCn/"
];

function InstagramPostEmbed({ url }: { url: string }) {
  useEffect(() => {
    // Asegurar que el script oficial de Instagram esté en la página
    const hasScript = document.querySelector('script[src="https://www.instagram.com/embed.js"]');
    if (!hasScript) {
      const script = document.createElement("script");
      script.src = "https://www.instagram.com/embed.js";
      script.async = true;
      document.body.appendChild(script);
    }

    // Procesar los embeds dinámicos después del montaje
    try {
      if ((window as any).instgrm) {
        (window as any).instgrm.Embeds.process();
      } else {
        const timer = setTimeout(() => {
          if ((window as any).instgrm) {
            (window as any).instgrm.Embeds.process();
          }
        }, 150);
        return () => clearTimeout(timer);
      }
    } catch (err) {
      console.error("Error processing Instagram embeds:", err);
    }
  }, [url]);

  return (
    <div className="w-full max-w-sm mx-auto rounded-2xl overflow-hidden bg-transparent"
      style={{ height: "540px" }}
    >
      <blockquote
        className="instagram-media"
        data-instgrm-permalink={url}
        data-instgrm-version="14"
        style={{
          background: "transparent",
          border: "0",
          borderRadius: "0",
          boxShadow: "none",
          display: "block",
          margin: "0",
          padding: "0px",
          width: "100%",
        }}
      />
    </div>
  );
}

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

        const data = (await response.json()) as { items?: { permalink: string }[] };
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
    <section className={`bg-transparent ${className ?? ''}`}>
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7 }}
          viewport={{ once: true }}
          className="text-center mb-12 max-w-3xl mx-auto"
        >
          <h2 className="text-4xl md:text-5xl font-serif font-light text-foreground mb-6 leading-snug">
            Nuestras últimas novedades en Instagram
          </h2>
          <p className="text-lg text-muted-foreground font-sans">
            Síguenos en Instagram para descubrir nuestras últimas colecciones y
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
                  className="w-full max-w-sm rounded-2xl border border-border/50 animate-pulse p-4 flex flex-col justify-between"
                  style={{ height: "540px" }}
                >
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-muted" />
                    <div className="space-y-2 flex-1">
                      <div className="h-3 bg-muted rounded w-1/3" />
                      <div className="h-2 bg-muted rounded w-1/4" />
                    </div>
                  </div>
                  <div className="h-48 bg-muted rounded-lg w-full flex-1 my-4" />
                  <div className="space-y-2">
                    <div className="h-3 bg-muted rounded w-full" />
                    <div className="h-3 bg-muted rounded w-5/6" />
                  </div>
                </motion.div>
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
                  <InstagramPostEmbed url={postUrl} />
                </motion.div>
              ))}
        </div>
      </div>
    </section>
  );
}

