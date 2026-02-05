"use client";

import Link from "next/link";
import { ChevronRight, Star, Share2 } from "lucide-react";
import { ProductGallery } from "./components/ProductGallery";
import { ProductInfo } from "./components/ProductInfo";
import { RelatedProducts } from "./components/RelatedProducts";
import { IconButton } from "@/shared/components/IconButton";
import { cn } from "@/lib/utils";

interface ProductImage {
  id: string;
  url: string;
  alt: string;
  isMain?: boolean;
}

interface ProductVariant {
  id: string;
  name: string;
  value: string;
  stock: number;
}

interface ProductTag {
  name: string;
  color?: string;
}

interface ProductCategory {
  name: string;
  slug: string;
}

interface ProductRating {
  average: number;
  count: number;
}

interface Product {
  id: string;
  name: string;
  slug: string;
  price: number;
  compareAtPrice?: number;
  description: string;
  shortDescription: string;
  sku: string;
  material: string;
  careInstructions: string;
  stock: number;
  isFeatured?: boolean;
  isNew?: boolean;
  images: ProductImage[];
  variants?: ProductVariant[];
  tags?: ProductTag[];
  category: ProductCategory;
  rating: ProductRating;
}

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

interface ProductPageProps {
  product: Product;
  relatedProducts?: RelatedProduct[];
  className?: string;
}

export default function ProductPage({ product, relatedProducts = [], className }: ProductPageProps) {
  const selectedProduct = product;

  const handleAddToCart = (
    _productId: string,
    _quantity: number,
    _selectedVariants: Record<string, string>
  ) => {
    // Cart logic is handled by ProductInfo component using Zustand store
    console.log("Product added to cart via Zustand store");
  };

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: selectedProduct.name,
        text: selectedProduct.shortDescription,
        url: window.location.href,
      });
    } else {
      // Fallback: copy to clipboard
      navigator.clipboard.writeText(window.location.href);
      alert("Enlace copiado al portapapeles");
    }
  };

  return (
    <div className={cn("min-h-screen bg-white", className)}>
      <div className="container mx-auto px-4 py-8">
        {/* Breadcrumb */}
        <nav className="flex items-center space-x-2 text-sm text-gray-500 mb-8">
          <Link href="/" className="hover:text-gold-600">Inicio</Link>
          <ChevronRight className="w-4 h-4" />
          <Link href="/coleccion" className="hover:text-gold-600">Colección</Link>
          <ChevronRight className="w-4 h-4" />
          <Link href={`/coleccion?categoria=${selectedProduct.category.slug}`} className="hover:text-gold-600">
            {selectedProduct.category.name}
          </Link>
          <ChevronRight className="w-4 h-4" />
          <span className="text-gray-900">{selectedProduct.name}</span>
        </nav>

        {/* Product Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 mb-16">
          {/* Product Gallery */}
          <ProductGallery
            images={selectedProduct.images}
            productName={selectedProduct.name}
          />

          {/* Product Information */}
          <div className="space-y-6">
            {/* Rating and Share */}
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <div className="flex items-center space-x-1">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <Star
                      key={star}
                      className={cn(
                        "w-4 h-4",
                        star <= Math.floor(selectedProduct.rating.average)
                          ? "text-yellow-400 fill-current"
                          : "text-gray-300"
                      )}
                    />
                  ))}
                </div>
                <span className="text-sm text-gray-600">
                  {selectedProduct.rating.average} ({selectedProduct.rating.count} reseñas)
                </span>
              </div>

              <IconButton
                icon={Share2}
                onClick={handleShare}
                aria-label="Compartir producto"
              />
            </div>

            <ProductInfo
              {...selectedProduct}
              onAddToCart={handleAddToCart}
            />
          </div>
        </div>

        {/* Related Products */}
        <RelatedProducts
          products={relatedProducts}
          title="También te puede interesar"
        />
      </div>
    </div>
  );
}
