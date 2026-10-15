"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { Sparkles, Gem, ArrowRight, ShieldCheck, Flame, CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ProductCarousel } from "@/shared/components/ProductCarousel";
import { cn } from "@/lib/utils";

interface Product {
  id: string;
  name: string;
  slug: string;
  price: number;
  compareAtPrice?: number;
  description?: string;
  shortDescription?: string;
  material?: string;
  images: Array<{
    url: string;
    alt: string;
    isMain: boolean;
  }>;
  category: {
    name: string;
    slug: string;
  };
  tags?: Array<{
    name: string;
    color?: string;
  }>;
  isFeatured?: boolean;
}

interface UniquePiecesSectionProps {
  className?: string;
}

export function UniquePiecesSection({ className }: UniquePiecesSectionProps) {
  const [uniqueProducts, setUniqueProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let mounted = true;

    async function fetchUniquePieces() {
      try {
        setLoading(true);
        const res = await fetch("/api/products?category=piezas-unicas&limit=12");
        if (res.ok) {
          const data = await res.json();
          if (mounted && data?.products && data.products.length > 0) {
            setUniqueProducts(data.products);
            return;
          }
        }
      } catch (err) {
        console.error("Error fetching unique pieces:", err);
      } finally {
        if (mounted) setLoading(false);
      }
    }

    void fetchUniquePieces();
    return () => {
      mounted = false;
    };
  }, []);

  // Primary featured piece: either first product from DB or editorial fallback
  const featured = uniqueProducts[0] || {
    id: "editorial-unique-1",
    name: "Gargantilla Imperial Esmeralda & Diamantes 1/1",
    slug: "gargantilla-imperial-esmeralda",
    price: 1850000,
    compareAtPrice: 2100000,
    material: "Oro 18k & Esmeralda Colombiana",
    shortDescription:
      "Obra maestra de alta joyería 1/1 en oro 18k con esmeralda central colombiana de talla cojín y pavé de diamantes.",
    images: [{ url: "https://res.cloudinary.com/dnyv5z9ug/image/upload/v1791980775/stbvygthudd2sem6qtso.jpg", alt: "Gargantilla Imperial", isMain: true }],
    category: { name: "Piezas Únicas", slug: "piezas-unicas" },
    tags: [{ name: "Pieza Única" }, { name: "Alta Joyería" }, { name: "1 de 1" }],
  };

  const mainImageUrl = featured.images?.[0]?.url || "https://res.cloudinary.com/dnyv5z9ug/image/upload/v1791980775/stbvygthudd2sem6qtso.jpg";

  return (
    <section id="piezas-unicas" className={cn("unique-pieces-section py-20 md:py-28 overflow-hidden", className)}>
      {/* Background ambient radial glows */}
      <div
        className="absolute top-1/4 -left-32 w-96 h-96 rounded-full pointer-events-none opacity-25 blur-3xl"
        style={{ background: "radial-gradient(circle, rgba(212,178,125,0.4) 0%, transparent 70%)" }}
        aria-hidden="true"
      />
      <div
        className="absolute bottom-10 -right-32 w-[30rem] h-[30rem] rounded-full pointer-events-none opacity-20 blur-3xl"
        style={{ background: "radial-gradient(circle, rgba(164,122,74,0.35) 0%, transparent 70%)" }}
        aria-hidden="true"
      />

      <div className="container relative z-10 mx-auto px-4 md:px-6">
        {/* Header Kicker & Title */}
        <div className="text-center max-w-3xl mx-auto mb-14 md:mb-18">{/*
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full border border-gold-500/40 bg-gold-500/15 text-gold-700 dark:text-gold-300 text-xs font-semibold uppercase tracking-[0.22em] mb-4 shadow-sm"
          >
            <Flame className="w-3.5 h-3.5 text-amber-500 animate-pulse" />
            <span>Oportunidad Irrepetible • 1 de 1</span>
          </motion.div>*/}

          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7, delay: 0.1 }}
            className="text-3xl md:text-5xl lg:text-6xl font-serif font-light text-foreground mb-5 leading-tight"
          >
            Piezas Únicas 
          </motion.h2>{/*

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7, delay: 0.2 }}
            className="text-base md:text-lg text-muted-foreground font-sans leading-relaxed max-w-2xl mx-auto"
          >
            Creaciones singulares concebidas para existir una sola vez en el mundo.
            Cada joya posee gemas irrepetibles, certificado de autenticidad y el compromiso de no volver a forjarse jamás.
          </motion.p>*/}
        </div>

        {/* Hero Showcase Card */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="unique-pieces-card relative rounded-3xl overflow-hidden backdrop-blur-xl"
        >
          {/* Subtle gold border highlight */}
          <div className="absolute inset-x-0 top-0 h-[1px] bg-gradient-to-r from-transparent via-gold-500/60 to-transparent" />

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-0 items-stretch">
            {/* Left image column */}
            <div className="lg:col-span-7 relative min-h-[380px] sm:min-h-[460px] lg:min-h-[560px] overflow-hidden group">
              <Image
                src={mainImageUrl}
                alt={featured.name}
                fill
                priority
                className="object-cover object-center transition-transform duration-700 ease-out group-hover:scale-105"
                sizes="(max-width: 1024px) 100vw, 60vw"
              />

              {/* Gradient overlays for cinematic depth */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/25 to-transparent lg:bg-gradient-to-r lg:from-transparent lg:via-transparent lg:to-black/60 pointer-events-none" />

              {/* Badges on image */}
              <div className="absolute top-5 left-5 flex flex-wrap gap-2 z-10">
                <span className="px-3 py-1 rounded-full text-xs font-semibold uppercase tracking-wider bg-gold-600 text-white shadow-lg border border-gold-400/30">
                  Edición 1 / 1
                </span>
                <span className="px-3 py-1 rounded-full text-xs font-medium bg-black/65 backdrop-blur-md text-amber-200 border border-white/10">
                  Certificado Gemológico
                </span>
              </div>

              {/* Micro-callout bottom left 
              <div className="absolute bottom-5 left-5 right-5 lg:right-auto z-10 flex items-center gap-2 p-3 rounded-xl bg-black/75 backdrop-blur-md border border-white/15 max-w-sm">
                <ShieldCheck className="w-5 h-5 text-gold-500 flex-shrink-0" />
                <p className="text-xs text-white/90 leading-tight">
                  Pieza certificada. No existe duplicado en diseño, engaste ni gema.
                </p>
              </div>*/}
            </div>

            {/* Right editorial column */}
            <div className="lg:col-span-5 p-7 md:p-10 lg:p-12 flex flex-col justify-between">
              <div>
                <div className="flex items-center gap-2 text-gold-600 dark:text-gold-400 text-xs font-semibold tracking-widest uppercase mb-3">
                  <Gem className="w-4 h-4" />
                  <span></span>
                </div>

                <h3 className="text-2xl md:text-3xl lg:text-4xl font-serif font-light text-foreground mb-4 leading-snug">
                  {featured.name}
                </h3>

                <p className="text-sm md:text-base text-muted-foreground font-sans leading-relaxed mb-6">
                  {featured.shortDescription || featured.description}
                </p>

                {/* Technical highlights */}
                <div className="space-y-3 pt-2 pb-6 border-y border-border/60 text-sm">
                  {featured.material && (
                    <div className="flex items-center justify-between text-xs md:text-sm">
                      <span className="text-muted-foreground">Composición & Gema:</span>
                      <span className="text-foreground font-medium">{featured.material}</span>
                    </div>
                  )}
                  <div className="flex items-center justify-between text-xs md:text-sm">
                    <span className="text-muted-foreground">Disponibilidad:</span>
                    <span className="text-emerald-600 dark:text-emerald-400 font-semibold flex items-center gap-1">
                      <CheckCircle2 className="w-3.5 h-3.5" /> 1 sola unidad forjada
                    </span>
                  </div>
                  <div className="flex items-center justify-between text-xs md:text-sm">
                    <span className="text-muted-foreground">Autenticidad:</span>
                    <span className="text-foreground font-medium">Validada por Profesionales</span>
                  </div>
                </div>
              </div>

              {/* Price & Actions */}
              <div className="mt-8 pt-6 border-t border-border/60">
                <div className="flex items-baseline gap-3 mb-6">
                  <span className="text-3xl md:text-4xl font-serif font-semibold text-foreground">
                    ${featured.price.toLocaleString("es-AR")}
                  </span>
                  {featured.compareAtPrice && (
                    <span className="text-base text-muted-foreground line-through font-sans">
                      ${featured.compareAtPrice.toLocaleString("es-AR")}
                    </span>
                  )}
                </div>

                <div className="flex flex-col sm:flex-row gap-3">
                  <Link href={`/producto/${featured.slug}`} className="flex-1">
                    <Button
                      size="lg"
                      className="w-full btn-gold text-white shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-0.5 cursor-pointer font-medium"
                    >
                      <Sparkles className="w-4 h-4 mr-2" />
                      Ver Esta Pieza Única
                    </Button>
                  </Link>
                  <Link href="/coleccion?categoria=piezas-unicas" className="flex-1">
                    <Button
                      variant="outline"
                      size="lg"
                      className="w-full border-border text-foreground hover:bg-muted transition-colors cursor-pointer"
                    >
                      Ver Oportunidades
                      <ArrowRight className="w-4 h-4 ml-2" />
                    </Button>
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Carousel of Unique Pieces */}
        {uniqueProducts.length > 0 && (
          <div className="mt-16 md:mt-20 pt-8 border-t border-border/50">
            <ProductCarousel
              title="Galería de Piezas Únicas"
              subtitle="Creaciones exclusivas irrepetibles. Al adquirir una pieza única, se retira inmediatamente de la venta."
              products={uniqueProducts}
              loading={loading}
              className="py-6"
            />
          </div>
        )}

        {/* Footer reassurance banner */}
        <div className="mt-12 text-center">
          <p className="text-xs md:text-sm text-muted-foreground font-sans tracking-wide">
            ✦ Cada pieza única cuenta con atención personalizada y envío seguro en todo el país.
          </p>
        </div>
      </div>
    </section>
  );
}
