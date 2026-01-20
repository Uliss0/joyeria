"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

interface RelatedProduct {
  id: string;
  name: string;
  slug: string;
  price: number;
  compareAtPrice?: number;
  images: Array<{
    url: string;
    alt: string;
    isMain?: boolean;
  }>;
  isNew?: boolean;
  isFeatured?: boolean;
}

interface RelatedProductsProps {
  products: RelatedProduct[];
  title?: string;
  className?: string;
}

const ProductCard = ({ product }: { product: RelatedProduct }) => {
  const mainImage = product.images.find(img => img.isMain) || product.images[0];
  const discountPercentage = product.compareAtPrice
    ? Math.round(((product.compareAtPrice - product.price) / product.compareAtPrice) * 100)
    : 0;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      viewport={{ once: true }}
      className="group"
    >
      <Link href={`/producto/${product.slug}`}>
        <div className="relative aspect-square bg-gray-50 rounded-lg overflow-hidden mb-3 cursor-pointer">
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
          <div className="absolute top-2 left-2 space-y-1">
            {product.isNew && (
              <Badge className="bg-green-600 hover:bg-green-700 text-xs px-1.5 py-0.5">
                Nuevo
              </Badge>
            )}
            {product.isFeatured && (
              <Badge className="bg-gold-600 hover:bg-gold-700 text-xs px-1.5 py-0.5">
                Destacado
              </Badge>
            )}
            {discountPercentage > 0 && (
              <Badge className="bg-red-600 hover:bg-red-700 text-xs px-1.5 py-0.5">
                -{discountPercentage}%
              </Badge>
            )}
          </div>
        </div>

        <div className="space-y-1">
          <h3 className="font-medium text-gray-900 hover:text-gold-600 transition-colors line-clamp-2 text-sm">
            {product.name}
          </h3>
          <div className="flex items-center space-x-2">
            <span className="text-sm font-semibold text-gray-900">
              ${product.price.toLocaleString('es-AR')}
            </span>
            {product.compareAtPrice && (
              <span className="text-xs text-gray-500 line-through">
                ${product.compareAtPrice.toLocaleString('es-AR')}
              </span>
            )}
          </div>
        </div>
      </Link>
    </motion.div>
  );
};

export function RelatedProducts({
  products,
  title = "Productos relacionados",
  className
}: RelatedProductsProps) {
  if (!products || products.length === 0) {
    return null;
  }

  return (
    <section className={cn("py-12 bg-gray-50", className)}>
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between mb-8">
          <h2 className="text-2xl md:text-3xl font-light text-gray-900">
            {title}
          </h2>
          <Button variant="ghost" className="text-gold-600 hover:text-gold-700">
            Ver todos
            <ArrowRight className="w-4 h-4 ml-2" />
          </Button>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
          {products.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </div>
    </section>
  );
}