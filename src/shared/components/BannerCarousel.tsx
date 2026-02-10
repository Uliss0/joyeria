"use client";

import { useEffect, useState } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, Pagination } from "swiper/modules";
import { cn } from "@/lib/utils";

import "swiper/css";
import "swiper/css/pagination";

type Banner = {
  id: string;
  imageUrl: string;
  linkUrl?: string | null;
};
  
interface BannerCarouselProps {
  className?: string;
}

const isExternal = (url: string) => /^https?:\/\//i.test(url);

export function BannerCarousel({ className }: BannerCarouselProps) {
  const [banners, setBanners] = useState<Banner[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let mounted = true;

    const loadBanners = async () => {
      try {
        const res = await fetch("/api/banners");
        if (!res.ok) throw new Error("Failed");
        const data = await res.json();
        if (mounted) setBanners(Array.isArray(data?.banners) ? data.banners : []);
      } catch {
        if (mounted) setBanners([]);
      } finally {
        if (mounted) setLoading(false);
      }
    };

    loadBanners();
    return () => {
      mounted = false;
    };
  }, []);

  if (!loading && banners.length === 0) return null;
//el banner tiene que ocupar todo el ancho, y tener una altura fija, con object-cover para que se vea bien, y ser responsive, con un tamaño mayor en pantallas grandes. Tambien tiene que tener un borde redondeado y una sombra suave para darle un aspecto elegante.
  return (
    <section className={cn("w-full ", className)}>
      <div className="container mx-auto px-4">
        <div className="relative">
          <Swiper
            slidesPerView={1}
            loop={banners.length > 1}
            autoplay={{ delay: 4500, disableOnInteraction: false }}
            pagination={{ clickable: true }}
            modules={[Autoplay, Pagination]}
            className="banner-swiper"
          >
            {(loading ? Array.from({ length: 1 }) : banners).map((banner: any, index: number) => (
              <SwiperSlide key={banner?.id ?? `placeholder-${index}`}>
                <div className="relative overflow-hidden rounded-lg shadow-sm">
                  {loading ? (
                    <div className="h-56 md:h-80 bg-gray-200 animate-pulse" />
                  ) : banner.linkUrl ? (
                    <a
                      href={banner.linkUrl}
                      target={isExternal(banner.linkUrl) ? "_blank" : undefined}
                      rel={isExternal(banner.linkUrl) ? "noreferrer" : undefined}
                      className="block"
                    >
                      <img
                        src={banner.imageUrl}
                        alt="Promoción"
                        className="w-full h-56 md:h-80 object-cover"
                      />
                    </a>
                  ) : (
                    <img
                      src={banner.imageUrl}
                      alt="Promoción"
                      className="w-full h-56 md:h-80 object-cover"
                    />
                  )}
                </div>
              </SwiperSlide>
            ))}
          </Swiper>
        </div>
      </div>
    </section>
  );
}
