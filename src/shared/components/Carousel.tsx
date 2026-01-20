"use client";

import { useState } from "react";
import Image from "next/image";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination, Thumbs, FreeMode } from "swiper/modules";
import { ProductImage } from "./ProductImage";
import { cn } from "@/lib/utils";

import "swiper/css";
import "swiper/css/free-mode";
import "swiper/css/navigation";
import "swiper/css/thumbs";
import "swiper/css/pagination";

interface CarouselProps {
  images: Array<{
    src: string;
    alt: string;
  }>;
  className?: string;
}

export function Carousel({ images, className }: CarouselProps) {
  const [thumbsSwiper, setThumbsSwiper] = useState<any>(null);

  if (images.length === 0) return null;

  return (
    <div className={cn("relative", className)}>
      {/* Main image carousel */}
      <Swiper
        loop={true}
        spaceBetween={10}
        navigation={true}
        thumbs={{ swiper: thumbsSwiper }}
        modules={[FreeMode, Navigation, Thumbs, Pagination]}
        className="mb-4 rounded-lg overflow-hidden"
        pagination={{
          clickable: true,
        }}
      >
        {images.map((image, index) => (
          <SwiperSlide key={index}>
            <ProductImage
              src={image.src}
              alt={image.alt}
              className="w-full h-full object-cover"
              priority={index === 0}
            />
          </SwiperSlide>
        ))}
      </Swiper>

      {/* Thumbnail carousel */}
      {images.length > 1 && (
        <Swiper
          onSwiper={setThumbsSwiper}
          loop={true}
          spaceBetween={10}
          slidesPerView={4}
          freeMode={true}
          watchSlidesProgress={true}
          modules={[FreeMode, Navigation, Thumbs]}
          className="product-thumbnail-carousel"
        >
          {images.map((image, index) => (
            <SwiperSlide key={index}>
              <button className="flex-shrink-0 w-16 h-16 border-2 rounded overflow-hidden">
                <Image
                  src={image.src}
                  alt={image.alt}
                  width={64}
                  height={64}
                  className="w-full h-full object-cover"
                />
              </button>
            </SwiperSlide>
          ))}
        </Swiper>
      )}
    </div>
  );
}