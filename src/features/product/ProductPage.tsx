"use client";

import { useState } from "react";
import Link from "next/link";
import { ChevronRight, Star, Share2 } from "lucide-react";
import { ProductGallery } from "./components/ProductGallery";
import { ProductInfo } from "./components/ProductInfo";
import { RelatedProducts } from "./components/RelatedProducts";
import { Button } from "@/components/ui/button";
import { IconButton } from "@/shared/components/IconButton";
import { cn } from "@/lib/utils";

// Mock data - replace with API call
const mockProduct = {
  id: "1",
  name: "Anillo Clásico de Oro 18K",
  slug: "anillo-clasico-oro-18k",
  price: 85000,
  compareAtPrice: 95000,
  description: `
    <p>Un anillo clásico que nunca pasa de moda. Este diseño atemporal combina la elegancia del oro 18K con un estilo versátil que se adapta a cualquier ocasión.</p>
    <p>Cada pieza está cuidadosamente elaborada por artesanos expertos, garantizando la máxima calidad y durabilidad. El oro 18K ofrece el equilibrio perfecto entre resistencia y belleza.</p>
    <ul>
      <li>Oro 18K de alta pureza</li>
      <li>Acabado pulido a mano</li>
      <li>Diseño unisex adaptable</li>
      <li>Garantía de por vida</li>
    </ul>
  `,
  shortDescription: "Diseño atemporal en oro 18K, perfecto para cualquier ocasión especial.",
  sku: "ANILLO-ORO-CLASICO-001",
  material: "Oro 18K amarillo, certificado con sello de autenticidad",
  careInstructions: "Limpie con un paño suave y jabón neutro. Evite el contacto con productos químicos agresivos. Guarde en estuche individual.",
  stock: 12,
  isFeatured: true,
  isNew: false,
  images: [
    {
      id: "1",
      url: "https://images.unsplash.com/photo-1605100804763-247f67b3557e?w=800&h=800&fit=crop",
      alt: "Anillo clásico de oro visto desde arriba",
      isMain: true,
    },
    {
      id: "2",
      url: "https://images.unsplash.com/photo-1605100804763-247f67b3557e?w=800&h=800&fit=crop",
      alt: "Anillo clásico de oro visto de lado",
    },
    {
      id: "3",
      url: "https://images.unsplash.com/photo-1605100804763-247f67b3557e?w=800&h=800&fit=crop",
      alt: "Anillo clásico de oro con luz",
    },
    {
      id: "4",
      url: "https://images.unsplash.com/photo-1605100804763-247f67b3557e?w=800&h=800&fit=crop",
      alt: "Detalle del sello de autenticidad",
    },
  ],
  variants: [
    {
      id: "1",
      name: "Talle",
      value: "15",
      stock: 3,
    },
    {
      id: "2",
      name: "Talle",
      value: "16",
      stock: 4,
    },
    {
      id: "3",
      name: "Talle",
      value: "17",
      stock: 3,
    },
    {
      id: "4",
      name: "Talle",
      value: "18",
      stock: 2,
    },
  ],
  tags: [
    { name: "Oro 18K", color: "#FFD700" },
    { name: "Clásico", color: "#8B4513" },
    { name: "Unisex", color: "#708090" },
  ],
  category: {
    name: "Anillos",
    slug: "anillos",
  },
  rating: {
    average: 4.8,
    count: 24,
  },
};

const mockRelatedProducts = [
  {
    id: "2",
    name: "Anillo Moderno de Plata",
    slug: "anillo-moderno-plata",
    price: 45000,
    images: [
      {
        url: "https://images.unsplash.com/photo-1605100804763-247f67b3557e?w=400&h=400&fit=crop",
        alt: "Anillo moderno de plata",
        isMain: true,
      },
    ],
    isNew: true,
  },
  {
    id: "3",
    name: "Pulsera Elegante",
    slug: "pulsera-elegante",
    price: 65000,
    compareAtPrice: 75000,
    images: [
      {
        url: "https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?w=400&h=400&fit=crop",
        alt: "Pulsera elegante",
        isMain: true,
      },
    ],
    isFeatured: true,
  },
  {
    id: "4",
    name: "Collar Minimalista",
    slug: "collar-minimalista",
    price: 55000,
    images: [
      {
        url: "https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?w=400&h=400&fit=crop",
        alt: "Collar minimalista",
        isMain: true,
      },
    ],
  },
  {
    id: "5",
    name: "Aros Geométricos",
    slug: "aros-geometricos",
    price: 35000,
    images: [
      {
        url: "https://images.unsplash.com/photo-1603808033192-082d6919d3e1?w=400&h=400&fit=crop",
        alt: "Aros geométricos",
        isMain: true,
      },
    ],
    isNew: true,
  },
];

interface ProductPageProps {
  product: typeof mockProduct;
  relatedProducts?: typeof mockRelatedProducts;
  className?: string;
}

export default function ProductPage({ product, relatedProducts = mockRelatedProducts, className }: ProductPageProps) {
  const [selectedProduct] = useState(product);

  const handleAddToCart = (
    productId: string,
    quantity: number,
    selectedVariants: Record<string, string>
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
