"use client";

import { InstagramEmbed } from "react-social-media-embed";
import { motion } from "framer-motion";

interface InstagramFeedSectionProps {
  className?: string;
}

export function InstagramFeedSection({ className }: InstagramFeedSectionProps) {
  const instagramPostUrls = [
    "https://www.instagram.com/p/DRpLiXQDVBs/", 
    "https://www.instagram.com/p/DRxyVKfjV18/",
    "https://www.instagram.com/p/DRpLiXQDVBs/",
    "https://www.instagram.com/p/DRxyVKfjV18/",
  ];

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
            Nuestras Últimas Novedades en Instagram
          </h2>
          <p className="text-lg text-gray-700 font-sans">
            Síguenos en Instagram para descubrir nuestras últimas colecciones y momentos especiales.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8 justify-items-center">
          {instagramPostUrls.map((postUrl, index) => (
            <motion.div
              key={index}
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
