"use client";

import { useState } from "react";
import Link from "next/link";
import { ChevronRight, Star, Share2 } from "lucide-react";
import { ProductGallery } from "./components/ProductGallery";
import { ProductInfo } from "./components/ProductInfo";
import { RelatedProducts } from "./components/RelatedProducts";
import { IconButton } from "@/shared/components/IconButton";
import { cn } from "@/lib/utils";
import { useSession } from "next-auth/react";

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
  userRating?: number | null;
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
  const { data: session, status } = useSession();
  const [ratingAverage, setRatingAverage] = useState(selectedProduct.rating.average);
  const [ratingCount, setRatingCount] = useState(selectedProduct.rating.count);
  const [userRating, setUserRating] = useState<number | null>(selectedProduct.rating.userRating ?? null);
  const [hoverRating, setHoverRating] = useState<number | null>(null);
  const [isSubmittingRating, setIsSubmittingRating] = useState(false);

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

  const handleRate = async (rating: number) => {
    if (status === "loading" || isSubmittingRating) return;

    if (!session?.user) {
      alert("Inicia sesion para calificar.");
      window.location.href = "/auth/signin";
      return;
    }

    setIsSubmittingRating(true);
    try {
      const res = await fetch("/api/ratings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ productId: selectedProduct.id, rating }),
      });

      if (!res.ok) {
        throw new Error("Failed to submit rating");
      }

      const data = await res.json();
      setRatingAverage(data.average ?? ratingAverage);
      setRatingCount(data.count ?? ratingCount);
      setUserRating(data.userRating ?? rating);
    } catch (error) {
      console.error("Rating submission error", error);
      alert("No se pudo guardar tu calificacion. Intenta de nuevo.");
    } finally {
      setIsSubmittingRating(false);
      setHoverRating(null);
    }
  };

  return (
    <div className={cn("min-h-screen bg-background text-foreground transition-colors duration-300", className)}>
      <div className="container mx-auto px-4 py-8">
        {/* Breadcrumb */}
        <nav className="flex flex-wrap items-center gap-2 text-xs md:text-sm text-muted-foreground mb-8">
          <Link href="/" className="hover:text-primary transition-colors">Inicio</Link>
          <ChevronRight className="w-3.5 h-3.5 opacity-60" />
          <Link href="/coleccion" className="hover:text-primary transition-colors">Colección</Link>
          <ChevronRight className="w-3.5 h-3.5 opacity-60" />
          <Link href={`/coleccion?categoria=${selectedProduct.category.slug}`} className="hover:text-primary transition-colors">
            {selectedProduct.category.name}
          </Link>
          <ChevronRight className="w-3.5 h-3.5 opacity-60" />
          <span className="text-foreground font-medium truncate max-w-[200px] md:max-w-none">{selectedProduct.name}</span>
        </nav>
 
        {/* Product Section */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-16 mb-16">
          {/* Product Gallery */}
          <ProductGallery
            images={selectedProduct.images}
            productName={selectedProduct.name}
            className="lg:col-span-7"
          />
 
          {/* Product Information */}
          <div className="lg:col-span-5 space-y-6">
            {/* Rating and Share */}
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <div className="flex items-center space-x-1">
                  {(() => {
                    const effectiveRating = hoverRating ?? userRating ?? Math.round(ratingAverage);
                    return [1, 2, 3, 4, 5].map((star) => (
                      <button
                        type="button"
                        key={star}
                        onClick={() => handleRate(star)}
                        onMouseEnter={() => setHoverRating(star)}
                        onMouseLeave={() => setHoverRating(null)}
                        className="transition-colors disabled:cursor-not-allowed"
                        disabled={isSubmittingRating}
                        aria-label={`Puntuar ${star} estrellas`}
                      >
                        <Star
                          className={cn(
                            "w-4 h-4",
                            star <= effectiveRating
                              ? "text-yellow-400 fill-current"
                              : "text-gray-300"
                          )}
                        />
                      </button>
                    ));
                  })()}
                </div>
                <span className="text-sm text-gray-600">
                  {ratingCount > 0
                    ? `${ratingAverage.toFixed(1)} (${ratingCount} reseñas)`
                    : "Sin reseñas"}
                </span>
                {userRating ? (
                  <span className="text-xs text-gray-500">
                    Tu puntuacion: {userRating}/5
                  </span>
                ) : null}
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
