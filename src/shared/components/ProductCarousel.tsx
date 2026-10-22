"use client";

import { useEffect, useRef, useState } from "react";
import type { Swiper as SwiperType } from "swiper";
import { Swiper, SwiperSlide } from "swiper/react";
import { Pagination } from "swiper/modules";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";
import { ProductCard } from "@/features/collection/components/ProductGrid";

import "swiper/css";
import "swiper/css/pagination";

interface Product {
  id: string;
  name: string;
  slug: string;
  price: number;
  compareAtPrice?: number;
  images: Array<{
    url: string;
    alt: string;
    isMain: boolean;
  }>;
  category: {
    name: string;
    slug: string;
  };
  isFeatured?: boolean;
  isNew?: boolean;
  tags?: Array<{
    name: string;
    color?: string;
  }>;
}

interface ProductCarouselProps {
  products: Product[];
  title?: string;
  subtitle?: string;
  className?: string;
  loading?: boolean;
  id?: string;
}

export function ProductCarousel({
  products,
  title,
  subtitle,
  className,
  loading = false,
  id,
}: ProductCarouselProps) {
  const swiperRef = useRef<SwiperType | null>(null);
  const [isBeginning, setIsBeginning] = useState(true);
  const [isEnd, setIsEnd] = useState(false);

  useEffect(() => {
    if (swiperRef.current) {
      swiperRef.current.update();
      setIsBeginning(swiperRef.current.isBeginning);
      setIsEnd(swiperRef.current.isEnd);
    }
  }, [products, loading]);

  if (!loading && products.length === 0) return null;

  return (
    <section id={id} className={cn("py-12 md:py-16 bg-transparent", className)}>
      <div className="container mx-auto px-4">
        {(title || subtitle) && (
          <div className="text-center mb-10">
            {title && (
              <h2 className="text-3xl md:text-4xl font-serif font-light text-foreground mb-3">
                {title}
              </h2>
            )}
            {subtitle && (
              <p className="text-lg text-muted-foreground font-sans max-w-2xl mx-auto">
                {subtitle}
              </p>
            )}
          </div>
        )}

        <div className="relative group/carousel">
          <Swiper
            onSwiper={(swiper) => {
              swiperRef.current = swiper;
              setIsBeginning(swiper.isBeginning);
              setIsEnd(swiper.isEnd);
            }}
            onSlideChange={(swiper) => {
              setIsBeginning(swiper.isBeginning);
              setIsEnd(swiper.isEnd);
            }}
            slidesPerView={1}
            spaceBetween={20}
            pagination={false}
            breakpoints={{
              640: { slidesPerView: 2, spaceBetween: 20 },
              768: { slidesPerView: 3, spaceBetween: 30 },
              1024: { slidesPerView: 4, spaceBetween: 40 },
            }}
            modules={[Pagination]}
            className="product-swiper"
          >
            {loading
              ? Array.from({ length: 6 }).map((_, i) => (
                  <SwiperSlide key={i}>
                    <div className="animate-pulse group relative border border-border rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-all duration-300">
                      <div className="relative aspect-square bg-muted" />
                      <div className="p-4 space-y-2">
                        <div className="h-4 bg-muted rounded w-3/4" />
                        <div className="h-6 bg-muted rounded" />
                        <div className="h-4 bg-muted rounded w-1/2" />
                      </div>
                    </div>
                  </SwiperSlide>
                ))
              : products.map((product) => (
                  <SwiperSlide key={product.id} className="h-auto pb-2">
                    <ProductCard product={product} />
                  </SwiperSlide>
                ))}
          </Swiper>

          <button
            type="button"
            onClick={() => swiperRef.current?.slidePrev()}
            disabled={isBeginning}
            aria-label="Producto anterior"
            className={cn(
              "absolute left-0 top-1/2 -translate-y-1/2 -ml-3 md:-ml-5 bg-card/90 hover:bg-card border border-border z-10 transition-all duration-300 rounded-full w-10 h-10 items-center justify-center shadow-md hidden md:flex",
              isBeginning
                ? "opacity-30 cursor-not-allowed"
                : "opacity-70 group-hover/carousel:opacity-100 hover:scale-105 cursor-pointer"
            )}
          >
            <ChevronLeft className="w-5 h-5 text-foreground" />
          </button>

          <button
            type="button"
            onClick={() => swiperRef.current?.slideNext()}
            disabled={isEnd}
            aria-label="Producto siguiente"
            className={cn(
              "absolute right-0 top-1/2 -translate-y-1/2 -mr-3 md:-mr-5 bg-card/90 hover:bg-card border border-border z-10 transition-all duration-300 rounded-full w-10 h-10 items-center justify-center shadow-md hidden md:flex",
              isEnd
                ? "opacity-30 cursor-not-allowed"
                : "opacity-70 group-hover/carousel:opacity-100 hover:scale-105 cursor-pointer"
            )}
          >
            <ChevronRight className="w-5 h-5 text-foreground" />
          </button>
        </div>
      </div>
    </section>
  );
}
