"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { Watch, Compass, ArrowRight, Award, Layers } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
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

interface WatchesSectionProps {
  className?: string;
}

export function WatchesSection({ className }: WatchesSectionProps) {
  const [watchProducts, setWatchProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeDimension, setActiveDimension] = useState<"movimiento" | "malla" | "estatus">("movimiento");

  useEffect(() => {
    let mounted = true;

    async function fetchWatches() {
      try {
        setLoading(true);
        const res = await fetch("/api/products?category=relojes&limit=12");
        if (res.ok) {
          const data = await res.json();
          if (mounted && data?.products && data.products.length > 0) {
            setWatchProducts(data.products);
            return;
          }
        }
      } catch (err) {
        console.error("Error fetching watch products:", err);
      } finally {
        if (mounted) setLoading(false);
      }
    }

    void fetchWatches();
    return () => {
      mounted = false;
    };
  }, []);

  const featuredWatch = watchProducts[0] || {
    id: "editorial-watch-1",
    name: "Cronógrafo Suizo Heritage Black Edition",
    slug: "cronografo-suizo-heritage",
    price: 485000,
    compareAtPrice: 560000,
    material: "Acero Noble 316L & Cerámica",
    shortDescription:
      "Cronógrafo suizo de precisión, bisel cerámico y malla milanesa de acero noble 316L. Hermeticidad 10 ATM.",
    images: [
      { url: "https://res.cloudinary.com/dnyv5z9ug/image/upload/v1791980773/mgeridb4nqw6chjuj4ch.jpg", alt: "Cronógrafo Suizo Heritage", isMain: true },
      { url: "https://res.cloudinary.com/dnyv5z9ug/image/upload/v1791980774/ogmmabfiiguiynifvfau.jpg", alt: "Detalle maquinaria", isMain: false },
    ],
    category: { name: "Relojes", slug: "relojes" },
    tags: [{ name: "Automático" }, { name: "Malla Milanesa" }, { name: "Cronógrafo" }],
  };

  const watchImageUrl = featuredWatch.images?.[0]?.url || "https://res.cloudinary.com/dnyv5z9ug/image/upload/v1791980773/mgeridb4nqw6chjuj4ch.jpg";

  return (
    <section
      id="relojeria"
      className={cn("watches-section text-foreground py-20 md:py-28 overflow-hidden", className)}
    >
      {/* Decorative fine architectural lines */}
      <div className="absolute inset-0 pointer-events-none opacity-[0.03] dark:opacity-[0.04]">
        <div
          className="w-full h-full"
          style={{
            backgroundImage:
              "linear-gradient(currentColor 1px, transparent 1px), linear-gradient(90deg, currentColor 1px, transparent 1px)",
            backgroundSize: "60px 60px",
          }}
        />
      </div>

      <div className="container relative z-10 mx-auto px-4 md:px-6">
        {/* Header - Subtle & Professional status */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-14 md:mb-16 gap-6 border-b border-border/50 pb-8">
          <div className="max-w-2xl">
            {/*
            <motion.div
              initial={{ opacity: 0, x: -15 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
              className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.25em] text-gold-600 dark:text-gold-400 mb-3"
            >
              <Watch className="w-4 h-4 text-gold-500" />
              <span>Haute Horlogerie • Precisión & Estatus</span>
            </motion.div>*/}  

            <motion.h2
              initial={{ opacity: 0, y: 15 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="text-3xl md:text-5xl font-serif font-light text-foreground leading-tight"
            >
              Relojería de Vanguardia
            </motion.h2>

            <motion.p
              initial={{ opacity: 0, y: 15 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="text-sm md:text-base text-muted-foreground font-sans mt-3 leading-relaxed"
            >
              Piezas sobrias de alta manufactura donde la ingeniería milimétrica se encuentra con la distinción atemporal.
              Diferenciación por calibres, acabados de malla y presencia.
            </motion.p>
          </div>

          <motion.div
            initial={{ opacity: 0, x: 15 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="flex-shrink-0"
          >
            <Link href="/coleccion?categoria=relojes">
              <Button
                variant="outline"
                className="border-border text-foreground hover:bg-muted hover:text-foreground transition-all cursor-pointer font-sans text-sm tracking-wide"
              >
                Ver Catálogo de Relojes
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            </Link>
          </motion.div>
        </div>

        {/* 3 Status Dimension Selectors */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-12">
          {/* Dimension 1: Tipo de Reloj */}
          <button
            type="button"
            onClick={() => setActiveDimension("movimiento")}
            className={cn(
              "watch-dim-btn p-5 rounded-2xl text-left border transition-all duration-300 cursor-pointer flex flex-col justify-between",
              activeDimension === "movimiento" && "watch-dim-btn-active"
            )}
          >
            <div>
              <div className="flex items-center justify-between mb-3">
                <Compass className="w-5 h-5 text-gold-500" />
                <span className="text-[10px] tracking-widest uppercase font-semibold text-muted-foreground">Calibre</span>
              </div>
              <h4 className="text-base font-semibold text-foreground mb-1">Tipos de Movimiento</h4>
              <p className="text-xs text-muted-foreground leading-relaxed">
                Automáticos suizos con rotor visible, cronógrafos de precisión y cuarzo de alta fidelidad.
              </p>
            </div>
            <div className="flex flex-wrap gap-1.5 mt-4">
              <span className="text-[10px] px-2 py-0.5 rounded bg-muted text-foreground/80 font-medium">Automático</span>
              <span className="text-[10px] px-2 py-0.5 rounded bg-muted text-foreground/80 font-medium">Cronógrafo</span>
              <span className="text-[10px] px-2 py-0.5 rounded bg-muted text-foreground/80 font-medium">Cuarzo</span>
              <span className="text-[10px] px-2 py-0.5 rounded bg-muted text-foreground/80 font-medium">Deportivo</span>
            </div>
          </button>

          {/* Dimension 2: Tipo de Malla */}
          <button
            type="button"
            onClick={() => setActiveDimension("malla")}
            className={cn(
              "watch-dim-btn p-5 rounded-2xl text-left border transition-all duration-300 cursor-pointer flex flex-col justify-between",
              activeDimension === "malla" && "watch-dim-btn-active"
            )}
          >
            <div>
              <div className="flex items-center justify-between mb-3">
                <Layers className="w-5 h-5 text-gold-500" />
                <span className="text-[10px] tracking-widest uppercase font-semibold text-muted-foreground">Confort & Material</span>
              </div>
              <h4 className="text-base font-semibold text-foreground mb-1">Variedad de Mallas</h4>
              <p className="text-xs text-muted-foreground leading-relaxed">
                Mallas milanesas flexibles, acero 316L sólido, cuero italiano genuino y caucho deportivo.
              </p>
            </div>
            <div className="flex flex-wrap gap-1.5 mt-4">
              <span className="text-[10px] px-2 py-0.5 rounded bg-muted text-foreground/80 font-medium">Malla Milanesa</span>
              <span className="text-[10px] px-2 py-0.5 rounded bg-muted text-foreground/80 font-medium">Acero 316L</span>
              <span className="text-[10px] px-2 py-0.5 rounded bg-muted text-foreground/80 font-medium">Cuero Italiano</span>
              <span className="text-[10px] px-2 py-0.5 rounded bg-muted text-foreground/80 font-medium">Caucho</span>
            </div>
          </button>

          {/* Dimension 3: Estatus y Marcas */}
          <button
            type="button"
            onClick={() => setActiveDimension("estatus")}
            className={cn(
              "watch-dim-btn p-5 rounded-2xl text-left border transition-all duration-300 cursor-pointer flex flex-col justify-between",
              activeDimension === "estatus" && "watch-dim-btn-active"
            )}
          >
            <div>
              <div className="flex items-center justify-between mb-3">
                <Award className="w-5 h-5 text-gold-500" />
                <span className="text-[10px] tracking-widest uppercase font-semibold text-muted-foreground">Distinción</span>
              </div>
              <h4 className="text-base font-semibold text-foreground mb-1">Estatus & Curaduría</h4>
              <p className="text-xs text-muted-foreground leading-relaxed">
                Marcas y piezas seleccionadas para quienes valoran la discreción, el calibre y la autoridad visual.
              </p>
            </div>
            <div className="flex flex-wrap gap-1.5 mt-4">
              <span className="text-[10px] px-2 py-0.5 rounded bg-muted text-foreground/80 font-medium">Zafiro Antirreflejo</span>
              <span className="text-[10px] px-2 py-0.5 rounded bg-muted text-foreground/80 font-medium">Hermético 10 ATM</span>
              <span className="text-[10px] px-2 py-0.5 rounded bg-muted text-foreground/80 font-medium">Garantía Oficial</span>
            </div>
          </button>
        </div>

        {/* Featured Watch Technical Showcase */}
        <div className="watch-showcase-card rounded-3xl overflow-hidden p-6 md:p-10 shadow-2xl">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            {/* Watch imagery */}
            <div className="lg:col-span-6 relative aspect-square sm:aspect-[4/3] rounded-2xl overflow-hidden border border-border/50 group bg-card">
              <Image
                src={watchImageUrl}
                alt={featuredWatch.name}
                fill
                className="object-cover object-center transition-transform duration-700 ease-out group-hover:scale-105"
                sizes="(max-width: 1024px) 100vw, 50vw"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent pointer-events-none" />

              <div className="absolute top-4 left-4 flex gap-2">
                <Badge className="bg-black/60 backdrop-blur-md text-white border border-white/10 text-xs">
                  Alta Horología
                </Badge>
                <Badge className="bg-gold-600 text-white text-xs border-0">
                  Precisión Certificada
                </Badge>
              </div>

              <div className="absolute bottom-4 left-4 right-4 flex items-center justify-between text-xs text-white/90 backdrop-blur-md bg-black/60 p-2.5 rounded-xl border border-white/10">
                <span>Cristal: Zafiro sintético puro</span>
                <span className="text-amber-300 font-medium">Bisel: Cerámica de alta densidad</span>
              </div>
            </div>

            {/* Technical specs & actions */}
            <div className="lg:col-span-6 space-y-6">
              <div>
                <p className="text-xs uppercase tracking-[0.25em] text-gold-600 dark:text-gold-400 font-semibold mb-2">
                  Colección de Estatus
                </p>
                <h3 className="text-2xl md:text-3xl lg:text-4xl font-serif text-foreground font-light mb-3">
                  {featuredWatch.name}
                </h3>
                <p className="text-sm md:text-base text-muted-foreground font-sans leading-relaxed">
                  {featuredWatch.shortDescription || featuredWatch.description}
                </p>
              </div>

              {/* Specs Table */}
              <div className="grid grid-cols-2 gap-3 text-xs md:text-sm pt-2 pb-4 border-y border-border/60">
                <div className="watch-spec-box p-3 rounded-xl">
                  <span className="text-muted-foreground block text-xs">Movimiento</span>
                  <span className="text-foreground font-medium">Cronógrafo Mecánico / Automático</span>
                </div>
                <div className="watch-spec-box p-3 rounded-xl">
                  <span className="text-muted-foreground block text-xs">Malla / Pulsera</span>
                  <span className="text-foreground font-medium">{featuredWatch.material || "Acero Noble 316L"}</span>
                </div>
                <div className="watch-spec-box p-3 rounded-xl">
                  <span className="text-muted-foreground block text-xs">Resistencia al Agua</span>
                  <span className="text-foreground font-medium">100 Metros / 10 ATM</span>
                </div>
                <div className="watch-spec-box p-3 rounded-xl">
                  <span className="text-muted-foreground block text-xs">Garantía</span>
                  <span className="text-foreground font-medium">2 Años de Garantía Internacional</span>
                </div>
              </div>

              {/* Price & Buttons */}
              <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-2">
                <div>
                  <span className="text-2xl md:text-3xl font-serif font-semibold text-foreground">
                    ${featuredWatch.price.toLocaleString("es-AR")}
                  </span>
                  {featuredWatch.compareAtPrice && (
                    <span className="text-sm text-muted-foreground line-through ml-2 font-sans">
                      ${featuredWatch.compareAtPrice.toLocaleString("es-AR")}
                    </span>
                  )}
                </div>

                <div className="flex gap-3 w-full sm:w-auto">
                  <Link href={`/producto/${featuredWatch.slug}`} className="flex-1 sm:flex-initial">
                    <Button className="w-full btn-gold text-white font-medium shadow-md cursor-pointer">
                      Ver Ficha Técnica
                    </Button>
                  </Link>
                  <Link href="/coleccion?categoria=relojes" className="flex-1 sm:flex-initial">
                    <Button variant="outline" className="w-full border-border text-foreground hover:bg-muted cursor-pointer">
                      Ver Todos los Relojes
                    </Button>
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Carousel of Watch Products */}
        {watchProducts.length > 0 && (
          <div className="mt-16 md:mt-20 pt-8 border-t border-border/50">
            <ProductCarousel
              title="Catálogo de Relojería "
              subtitle="Explora nuestra selección de relojes de alta precisión. Encuentra tu estilo."
              products={watchProducts}
              loading={loading}
              className="py-6"
            />
          </div>
        )}

        {/* Quick filter shortcut tags */}
        <div className="mt-10 flex flex-wrap items-center justify-center gap-2.5 text-xs text-muted-foreground">
          <span className="mr-1">Filtrar directamente:</span>
          <Link
            href="/coleccion?categoria=relojes&tematica=automatico"
            className="px-3 py-1.5 rounded-full border border-border hover:border-gold-500/60 hover:text-foreground transition-colors bg-card/60"
          >
            Relojes Automáticos
          </Link>
          <Link
            href="/coleccion?categoria=relojes&tematica=cronografo"
            className="px-3 py-1.5 rounded-full border border-border hover:border-gold-500/60 hover:text-foreground transition-colors bg-card/60"
          >
            Cronógrafos
          </Link>
          <Link
            href="/coleccion?categoria=relojes&tematica=malla-milanesa"
            className="px-3 py-1.5 rounded-full border border-border hover:border-gold-500/60 hover:text-foreground transition-colors bg-card/60"
          >
            Malla Milanesa
          </Link>
          <Link
            href="/coleccion?categoria=relojes&tematica=suizo"
            className="px-3 py-1.5 rounded-full border border-border hover:border-gold-500/60 hover:text-foreground transition-colors bg-card/60"
          >
            Maquinaria Suiza
          </Link>
        </div>
      </div>
    </section>
  );
}
