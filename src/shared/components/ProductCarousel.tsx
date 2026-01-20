"use client";

import Link from "next/link";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { ProductCard } from "@/features/collection/components/ProductGrid";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination } from "swiper/modules";

import "swiper/css";
import "swiper/css/navigation";
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
}

export function ProductCarousel({ products, title, subtitle, className }: ProductCarouselProps) {
  if (products.length === 0) return null;

  return (
    <section className={cn("py-12 md:py-16 bg-white", className)}>
      <div className="container mx-auto px-4">
        {(title || subtitle) && (
          <div className="text-center mb-10">
            {title && (
              <h2 className="text-3xl md:text-4xl font-serif font-light text-gray-900 mb-3">
                {title}
              </h2>
            )}
            {subtitle && (
              <p className="text-lg text-gray-700 font-sans max-w-2xl mx-auto">
                {subtitle}
              </p>
            )}
          </div>
        )}

        <div className="relative">
          <Swiper
            slidesPerView={1}
            spaceBetween={20}
            navigation={{
              nextEl: ".swiper-button-next",
              prevEl: ".swiper-button-prev",
            }}
            pagination={false}
            breakpoints={{
              640: { slidesPerView: 2, spaceBetween: 20 },
              768: { slidesPerView: 3, spaceBetween: 30 },
              1024: { slidesPerView: 4, spaceBetween: 40 },
            }}
            modules={[Navigation, Pagination]}
            className="product-swiper"
          >
            {products.map((product) => (
              <SwiperSlide key={product.id}>
                <ProductCard product={product} />
              </SwiperSlide>
            ))}
          </Swiper>

          <div className="swiper-button-prev absolute left-0 top-1/2 -translate-y-1/2 -ml-6 bg-gray-100/80 hover:bg-gray-200 z-10 opacity-0 hover:opacity-100 transition-opacity duration-300 rounded-full w-10 h-10 items-center justify-center cursor-pointer shadow-md hidden md:flex">
            <ChevronLeft className="w-5 h-5 text-gray-700" />
          </div>
          <div className="swiper-button-next absolute right-0 top-1/2 -translate-y-1/2 -mr-6 bg-gray-100/80 hover:bg-gray-200 z-10 opacity-0 hover:opacity-100 transition-opacity duration-300 rounded-full w-10 h-10 items-center justify-center cursor-pointer shadow-md hidden md:flex">
            <ChevronRight className="w-5 h-5 text-gray-700" />
          </div>
        </div>
      </div>
    </section>
  );
}
