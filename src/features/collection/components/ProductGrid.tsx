"use client";

import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Heart, ShoppingCart, Eye, ChevronLeft, ChevronRight } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { IconButton } from "@/shared/components/IconButton";
import { cn } from "@/lib/utils";
import { useCartAddItem, useCartToggleCart } from "@/shared/store/cartStore";
import { useSession } from "next-auth/react";
import {
  useFavoritesAddFavorite,
  useFavoritesItems,
  useFavoritesRemoveFavorite,
} from "@/shared/store/favoritesStore";

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

interface ProductGridProps {
  products: Product[];
  loading?: boolean;
  className?: string;
}

export const ProductCard = ({ product }: { product: Product }) => {
  const [isHovered, setIsHovered] = useState(false);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  const addItem = useCartAddItem();
  const toggleCart = useCartToggleCart();
  const { data: session, status } = useSession();
  const favorites = useFavoritesItems();
  const addFavorite = useFavoritesAddFavorite();
  const removeFavorite = useFavoritesRemoveFavorite();
  const isWishlisted = favorites.some((favorite) => favorite.id === product.id);

  const mainImage = product.images.find(img => img.isMain) || product.images[0];
  const discountPercentage = product.compareAtPrice
    ? Math.round(((product.compareAtPrice - product.price) / product.compareAtPrice) * 100)
    : 0;

  const handlePrevImage = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setCurrentImageIndex((prev) => (prev === 0 ? product.images.length - 1 : prev - 1));
  };

  const handleNextImage = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setCurrentImageIndex((prev) => (prev === product.images.length - 1 ? 0 : prev + 1));
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="group relative premium-card rounded-xl overflow-hidden hover:shadow-[0_8px_30px_rgb(0,0,0,0.12)] transition-all duration-300"
    >
      <Link href={`/producto/${product.slug}`} className="block">
        <div
          className="relative aspect-square bg-muted/40 overflow-hidden cursor-pointer"
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
        >
          <AnimatePresence initial={false} mode="wait">
            <motion.div
              key={currentImageIndex}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="absolute inset-0"
            >
              {product.images && product.images.length > 0 ? (
                <Image
                  src={product.images[currentImageIndex]?.url}
                  alt={product.images[currentImageIndex]?.alt || product.name}
                  fill
                  className="object-cover transition-transform duration-300 group-hover:scale-105"
                  sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center bg-muted text-muted-foreground/60">Sin imagen</div>
              )}
            </motion.div>
          </AnimatePresence>

          {/* Multi-image Navigation Controls */}
          {product.images && product.images.length > 1 && isHovered && (
            <>
              <button
                onClick={handlePrevImage}
                className="absolute left-2 top-1/2 -translate-y-1/2 z-20 w-7 h-7 bg-card/95 hover:bg-card border border-border rounded-full flex items-center justify-center shadow-md transition-all"
                aria-label="Imagen anterior"
              >
                <ChevronLeft className="w-4 h-4 text-foreground" />
              </button>
              <button
                onClick={handleNextImage}
                className="absolute right-2 top-1/2 -translate-y-1/2 z-20 w-7 h-7 bg-card/95 hover:bg-card border border-border rounded-full flex items-center justify-center shadow-md transition-all"
                aria-label="Imagen siguiente"
              >
                <ChevronRight className="w-4 h-4 text-foreground" />
              </button>

              {/* Indicators */}
              <div className="absolute bottom-3 left-1/2 -translate-x-1/2 z-20 flex space-x-1">
                {product.images.map((_, idx) => (
                  <button
                    key={idx}
                    onClick={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                      setCurrentImageIndex(idx);
                    }}
                    className={cn(
                      "w-1.5 h-1.5 rounded-full transition-all",
                      currentImageIndex === idx ? "bg-primary scale-125" : "bg-muted-foreground/40"
                    )}
                    aria-label={`Ver imagen ${idx + 1}`}
                  />
                ))}
              </div>
            </>
          )}

          {/* Badges */}
          <div className="absolute top-3 left-3 space-y-2 z-10">
            {product.isNew && (
              <Badge className="bg-green-600 hover:bg-green-700 text-white font-sans text-xs px-2 py-1 border-0">Nuevo</Badge>
            )}
            {product.isFeatured && (
              <Badge className="bg-primary hover:bg-primary/90 text-primary-foreground font-sans text-xs px-2 py-1 border-0">Destacado</Badge>
            )}
            {discountPercentage > 0 && (
              <Badge className="bg-red-600 hover:bg-red-700 text-white font-sans text-xs px-2 py-1 border-0">-{discountPercentage}%</Badge>
            )}
          </div>

          {/* Quick Actions */}
          <div className={cn(
            "absolute top-3 right-3 flex flex-col space-y-2 transition-opacity duration-200 z-10",
            isHovered ? "opacity-100" : "opacity-0"
          )}>
            <IconButton
              icon={Heart}
              size="sm"
              onClick={(e: React.MouseEvent<HTMLButtonElement>) => {
                e.preventDefault();
                if (status === "loading") return;
                if (!session?.user) {
                  alert("Inicia sesión para guardar favoritos.");
                  window.location.href = "/auth/signin";
                  return;
                }

                const favoritePayload = {
                  id: product.id,
                  name: product.name,
                  slug: product.slug,
                  price: product.price,
                  compareAtPrice: product.compareAtPrice,
                  images: product.images,
                  category: product.category,
                  isFeatured: product.isFeatured,
                  isNew: product.isNew,
                  tags: product.tags,
                };

                if (isWishlisted) {
                  removeFavorite(product.id);
                  fetch(`/api/favorites/${product.id}`, { method: "DELETE" }).catch(() => {
                    addFavorite(favoritePayload);
                  });
                } else {
                  addFavorite(favoritePayload);
                  fetch("/api/favorites", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ productId: product.id }),
                  }).catch(() => {
                    removeFavorite(product.id);
                  });
                }
              }}
              className={cn(
                "bg-card/95 hover:bg-card border border-border text-foreground hover:text-red-500 transition-colors",
                isWishlisted && "text-red-500 border-red-200 bg-red-500/5 hover:border-red-300"
              )}
              aria-label="Agregar a favoritos"
            />
            <IconButton
              icon={Eye}
              size="sm"
              className="bg-card/95 hover:bg-card border border-border text-foreground hover:text-primary transition-colors"
              aria-label="Vista rápida"
            />
          </div>

          {/* Hover Overlay */}
          <div className={cn(
            "absolute inset-0 bg-black/10 transition-opacity duration-300 z-0",
            isHovered ? "opacity-100" : "opacity-0"
          )} />

          {/* Add to Cart Button */}
          <div className={cn(
            "absolute bottom-0 left-0 right-0 p-3 transition-transform duration-300 z-10",
            isHovered ? "translate-y-0" : "translate-y-full"
          )}>
            <Button
              size="sm"
              className="w-full btn-gold shadow-md cursor-pointer"
              onClick={(e) => {
                e.preventDefault();
                addItem({
                  productId: product.id,
                  name: product.name,
                  slug: product.slug,
                  price: product.price,
                  image: mainImage?.url || "",
                  maxStock: 999, // TODO: Replace with actual product stock
                  variants: {},
                  quantity: 1,
                });
                toggleCart();
              }}
            >
              <ShoppingCart className="w-4 h-4 mr-2" />
              Agregar al carrito
            </Button>
          </div>
        </div>
      </Link>

      {/* Product Info */}
      <div className="p-4 space-y-2 bg-transparent">
        <div className="flex items-center justify-between">
          <span className="text-xs text-muted-foreground uppercase tracking-wide font-sans">
            {product.category.name}
          </span>
          {product.tags && product.tags.length > 0 && (
            <div className="flex space-x-1">
              {product.tags.slice(0, 2).map((tag) => (
                <Badge
                  key={tag.name}
                  variant="secondary"
                  className="text-xs px-1.5 py-0.5 font-sans bg-muted text-muted-foreground border-border"
                  style={{ backgroundColor: tag.color ? `${tag.color}15` : undefined, color: tag.color }}
                >
                  {tag.name}
                </Badge>
              ))}
            </div>
          )}
        </div>

        <Link href={`/producto/${product.slug}`}>
          <h3 className="font-serif text-lg font-medium text-foreground hover:text-primary transition-colors line-clamp-2">
            {product.name}
          </h3>
        </Link>

        <div className="flex items-center space-x-2 pt-1">
          <span className="text-xl font-serif font-semibold text-foreground">
            ${product.price.toLocaleString('es-AR')}
          </span>
          {product.compareAtPrice && (
            <span className="text-sm text-muted-foreground line-through font-sans">
              ${product.compareAtPrice.toLocaleString('es-AR')}
            </span>
          )}
        </div>
      </div>
    </motion.div>
  );
};

export function ProductGrid({ products, loading = false, className }: ProductGridProps) {
  if (loading) {
    return (
      <div className={cn("grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8", className)}>
        {Array.from({ length: 12 }).map((_, i) => (
          <div key={i} className="animate-pulse rounded-xl overflow-hidden border border-border bg-card shadow-sm">
            <div className="aspect-square bg-muted mb-4"></div>
            <div className="p-4 space-y-2">
              <div className="h-4 bg-muted rounded w-3/4"></div>
              <div className="h-6 bg-muted rounded"></div>
              <div className="h-4 bg-muted rounded w-1/2"></div>
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (products.length === 0) {
    return (
      <div className={cn("flex flex-col items-center justify-center py-20 text-center bg-muted/20 border border-border rounded-2xl", className)}>
        <div className="w-24 h-24 bg-primary/10 rounded-full flex items-center justify-center mb-6">
          <ShoppingCart className="w-12 h-12 text-primary" />
        </div>
        <h3 className="text-2xl font-serif font-medium text-foreground mb-3">
          No se encontraron productos
        </h3>
        <p className="text-lg text-muted-foreground font-sans mb-8 max-w-md">
          Intenta ajustar tus filtros o explora otras categorías.
        </p>
        <Button variant="outline" className="border-border text-foreground hover:bg-muted bg-card cursor-pointer">
          Limpiar filtros
        </Button>
      </div>
    );
  }

  return (
    <div className={cn("grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8", className)}>
      {products.map((product) => (
        <ProductCard key={product.id} product={product} />
      ))}
    </div>
  );
}
