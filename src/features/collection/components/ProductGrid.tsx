"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Heart, ShoppingCart, Eye } from "lucide-react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { IconButton } from "@/shared/components/IconButton";
import { cn } from "@/lib/utils";
import { useCartAddItem, useCartToggleCart } from "@/shared/store/cartStore";

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
  const [isWishlisted, setIsWishlisted] = useState(false);

  const mainImage = product.images.find(img => img.isMain) || product.images[0];
  const discountPercentage = product.compareAtPrice
    ? Math.round(((product.compareAtPrice - product.price) / product.compareAtPrice) * 100)
    : 0;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="group relative border border-gray-100 rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-all duration-300"
    >
      <Link href={`/producto/${product.slug}`} className="block">
        <div
          className="relative aspect-square bg-gray-50 overflow-hidden cursor-pointer"
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
        >
          {mainImage && (
            <Image
              src={mainImage.url}
              alt={mainImage.alt || product.name}
              fill
              className="object-cover transition-transform duration-300 group-hover:scale-105"
              sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
            />
          )}

          {/* Badges */}
          <div className="absolute top-3 left-3 space-y-2 z-10">
            {product.isNew && (
              <Badge className="bg-gold-600 hover:bg-gold-700 text-white font-sans text-xs px-2 py-1">Nuevo</Badge>
            )}
            {product.isFeatured && (
              <Badge className="bg-blue-600 hover:bg-blue-700 text-white font-sans text-xs px-2 py-1">Destacado</Badge>
            )}
            {discountPercentage > 0 && (
              <Badge className="bg-red-600 hover:bg-red-700 text-white font-sans text-xs px-2 py-1">-{discountPercentage}%</Badge>
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
              onClick={(e) => {
                e.preventDefault();
                setIsWishlisted(!isWishlisted);
              }}
              className={cn(
                "bg-white/90 hover:bg-white text-gray-700 hover:text-red-500 transition-colors",
                isWishlisted && "text-red-500"
              )}
              aria-label="Agregar a favoritos"
            />
            <IconButton
              icon={Eye}
              size="sm"
              className="bg-white/90 hover:bg-white text-gray-700 hover:text-gold-700 transition-colors"
              aria-label="Vista rápida"
            />
          </div>

          {/* Hover Overlay */}
          <div className={cn(
            "absolute inset-0 bg-black/20 transition-opacity duration-300 z-0",
            isHovered ? "opacity-100" : "opacity-0"
          )} />

          {/* Add to Cart Button */}
          <div className={cn(
            "absolute bottom-0 left-0 right-0 p-3 transition-transform duration-300 z-10",
            isHovered ? "translate-y-0" : "translate-y-full"
          )}>
            <Button
              size="sm"
              className="w-full btn-gold shadow-md"
              onClick={(e) => {
                e.preventDefault();
                const addItem = useCartAddItem();
                const toggleCart = useCartToggleCart();
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
      <div className="p-4 space-y-2">
        <div className="flex items-center justify-between">
          <span className="text-xs text-gray-500 uppercase tracking-wide font-sans">
            {product.category.name}
          </span>
          {product.tags && product.tags.length > 0 && (
            <div className="flex space-x-1">
              {product.tags.slice(0, 2).map((tag) => (
                <Badge
                  key={tag.name}
                  variant="secondary"
                  className="text-xs px-1.5 py-0.5 font-sans"
                  style={{ backgroundColor: tag.color ? `${tag.color}20` : undefined, color: tag.color }}
                >
                  {tag.name}
                </Badge>
              ))}
            </div>
          )}
        </div>

        <Link href={`/producto/${product.slug}`}>
          <h3 className="font-serif text-lg font-medium text-gray-900 hover:text-gold-700 transition-colors line-clamp-2">
            {product.name}
          </h3>
        </Link>

        <div className="flex items-center space-x-2 pt-1">
          <span className="text-xl font-serif font-semibold text-gray-900">
            ${product.price.toLocaleString('es-AR')}
          </span>
          {product.compareAtPrice && (
            <span className="text-sm text-gray-500 line-through font-sans">
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
          <div key={i} className="animate-pulse rounded-lg overflow-hidden border border-gray-100 shadow-sm">
            <div className="aspect-square bg-gray-200 mb-4"></div>
            <div className="p-4 space-y-2">
              <div className="h-4 bg-gray-200 rounded w-3/4"></div>
              <div className="h-6 bg-gray-200 rounded"></div>
              <div className="h-4 bg-gray-200 rounded w-1/2"></div>
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (products.length === 0) {
    return (
      <div className={cn("flex flex-col items-center justify-center py-20 text-center bg-gray-50 rounded-lg shadow-inner", className)}>
        <div className="w-24 h-24 bg-gold-100 rounded-full flex items-center justify-center mb-6">
          <ShoppingCart className="w-12 h-12 text-gold-600" />
        </div>
        <h3 className="text-2xl font-serif font-medium text-gray-900 mb-3">
          No se encontraron productos
        </h3>
        <p className="text-lg text-gray-700 font-sans mb-8 max-w-md">
          Intenta ajustar tus filtros o explora otras categorías.
        </p>
        <Button variant="outline" className="btn-gold-outline">
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