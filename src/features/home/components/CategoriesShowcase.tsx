"use client";

import { useRef, useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";

interface CategoryItem {
  id: string;
  name: string;
  slug: string;
  image: string;
}

const CATEGORIES: CategoryItem[] = [
  {
    id: "anillos",
    name: "Anillos",
    slug: "anillos",
    image: "/categories/anillos-marble.jpg",
  },
  {
    id: "collares",
    name: "Collares",
    slug: "collares",
    image: "/categories/collares-marble.jpg",
  },
  {
    id: "pulseras",
    name: "Pulseras",
    slug: "pulseras",
    image: "/categories/pulseras-marble.jpg",
  },
  {
    id: "aros",
    name: "Aros",
    slug: "aros",
    image: "/categories/aros-marble.jpg",
  },
  {
    id: "relojes",
    name: "Relojes",
    slug: "relojes",
    image: "/categories/relojes-marble.jpg",
  },
];

interface CategoriesShowcaseProps {
  className?: string;
}

export function CategoriesShowcase({ className }: CategoriesShowcaseProps) {
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(true);

  const checkScroll = () => {
    const el = scrollContainerRef.current;
    if (!el) return;
    const { scrollLeft, scrollWidth, clientWidth } = el;
    setCanScrollLeft(scrollLeft > 10);
    setCanScrollRight(scrollLeft < scrollWidth - clientWidth - 10);
  };

  useEffect(() => {
    checkScroll();
    const el = scrollContainerRef.current;
    if (!el) return;
    el.addEventListener("scroll", checkScroll, { passive: true });
    window.addEventListener("resize", checkScroll);
    return () => {
      el.removeEventListener("scroll", checkScroll);
      window.removeEventListener("resize", checkScroll);
    };
  }, []);

  const scroll = (direction: "left" | "right") => {
    const el = scrollContainerRef.current;
    if (!el) return;
    const scrollAmount = el.clientWidth * 0.75;
    el.scrollBy({
      left: direction === "left" ? -scrollAmount : scrollAmount,
      behavior: "smooth",
    });
  };

  return (
    <section className={cn("py-8 md:py-1 relative overflow-hidden", className)}>
      <div className="container relative z-10 mx-auto px-4 md:px-6">
        {/* Cabecera sutil y minimalista */}
        <div className="flex items-center justify-between mb-4 md:mb-6">
       

          <div className="flex items-center gap-2">
            {/* Controles de scroll para mobile */}
            <div className="flex items-center gap-1 md:hidden">
              <button
                type="button"
                onClick={() => scroll("left")}
                disabled={!canScrollLeft}
                aria-label="Desplazar a la izquierda"
                className={cn(
                  "w-7 h-7 rounded-full border border-border flex items-center justify-center transition-all bg-card/80 text-foreground",
                  !canScrollLeft ? "opacity-25 cursor-not-allowed" : "hover:border-gold-500/60 active:scale-95"
                )}
              >
                <ChevronLeft className="w-3.5 h-3.5" />
              </button>
              <button
                type="button"
                onClick={() => scroll("right")}
                disabled={!canScrollRight}
                aria-label="Desplazar a la derecha"
                className={cn(
                  "w-7 h-7 rounded-full border border-border flex items-center justify-center transition-all bg-card/80 text-foreground",
                  !canScrollRight ? "opacity-25 cursor-not-allowed" : "hover:border-gold-500/60 active:scale-95"
                )}
              >
                <ChevronRight className="w-3.5 h-3.5" />
              </button>
            </div>

          </div>
        </div>

        {/* Grid horizontal con proporción apaisada (ancho > largo) y espacio reducido */}
        <div
          ref={scrollContainerRef}
          className="flex overflow-x-auto gap-2 sm:gap-2.5 md:gap-3 md:grid md:grid-cols-5 md:overflow-visible pb-2 pt-1 px-0.5 scrollbar-none snap-x snap-mandatory"
          style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
        >
          {CATEGORIES.map((cat, idx) => (
            <motion.div
              key={cat.id}
              initial={{ opacity: 0, y: 15 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: idx * 0.05 }}
              className="min-w-[200px] sm:min-w-[230px] md:min-w-0 flex-1 snap-start"
            >
              <Link
                href={`/coleccion?categoria=${cat.slug}`}
                className="group relative block aspect-[4/3] rounded-xl overflow-hidden border border-border/70 hover:border-gold-500/60 transition-all duration-300 shadow-sm hover:shadow-xl hover:shadow-gold-500/10 cursor-pointer"
              >
                {/* Imagen Escultural de Fondo (ancho > largo) */}
                <Image
                  src={cat.image}
                  alt={`Colección de ${cat.name} MOKSHA`}
                  fill
                  sizes="(max-width: 768px) 60vw, 20vw"
                  className="object-cover object-center transition-transform duration-500 ease-out group-hover:scale-105"
                  priority={idx < 3}
                />

                {/* Filtro degradado tenue para contraste */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/25 to-black/10 group-hover:from-black/70 group-hover:via-black/15 transition-all duration-300" />

                {/* Resplandor suave en hover */}
                <div className="absolute inset-0 rounded-xl border border-gold-400/0 group-hover:border-gold-400/40 transition-colors duration-300 pointer-events-none" />

                {/* Título de la categoría completamente limpio y minimalista */}
                <div className="absolute inset-0 p-4 flex flex-col justify-end items-center text-center z-10">
                  <h3 className="font-serif text-lg sm:text-xl lg:text-2xl font-light text-gray-200 tracking-wide drop-shadow-md group-hover:text-gold-200 transition-colors duration-300 ml-20 ">
                    {cat.name}
                  </h3>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
