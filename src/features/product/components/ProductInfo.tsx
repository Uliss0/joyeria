"use client";

import { useState } from "react";
import { Heart, Minus, Plus, ShoppingCart, Truck, Shield, RotateCcw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { IconButton } from "@/shared/components/IconButton";
import { useCartAddItem, useCartOpenCart } from "@/shared/store/cartStore";
import { cn } from "@/lib/utils";
import { useSession } from "next-auth/react";
import {
  useFavoritesAddFavorite,
  useFavoritesItems,
  useFavoritesRemoveFavorite,
} from "@/shared/store/favoritesStore";

interface ProductVariant {
  id: string;
  name: string;
  value: string;
  price?: number;
  stock?: number;
}

interface ProductImage {
  url: string;
  alt: string;
  isMain?: boolean;
}

interface ProductCategory {
  name: string;
  slug: string;
}

interface ProductInfoProps {
  id: string;
  name: string;
  slug: string;
  price: number;
  compareAtPrice?: number;
  description?: string;
  shortDescription?: string;
  sku?: string;
  variants?: ProductVariant[];
  material?: string;
  careInstructions?: string;
  stock: number;
  isFeatured?: boolean;
  isNew?: boolean;
  tags?: Array<{
    name: string;
    color?: string;
  }>;
  images?: ProductImage[];
  category?: ProductCategory;
  onAddToCart: (productId: string, quantity: number, selectedVariants: Record<string, string>) => void;
  className?: string;
}

export function ProductInfo({
  id,
  name,
  price,
  compareAtPrice,
  description,
  shortDescription,
  sku,
  variants = [],
  material,
  careInstructions,
  stock,
  isFeatured,
  isNew,
  tags,
  onAddToCart,
  className
}: ProductInfoProps) {
  const [quantity, setQuantity] = useState(1);
  const [selectedVariants, setSelectedVariants] = useState<Record<string, string>>({});
  const addItem = useCartAddItem();
  const openCart = useCartOpenCart();
  const { data: session, status } = useSession();
  const favorites = useFavoritesItems();
  const addFavorite = useFavoritesAddFavorite();
  const removeFavorite = useFavoritesRemoveFavorite();
  const isWishlisted = favorites.some((favorite) => favorite.id === id);

  // Group variants by name
  const variantGroups = variants.reduce((acc, variant) => {
    if (!acc[variant.name]) {
      acc[variant.name] = [];
    }
    acc[variant.name].push(variant);
    return acc;
  }, {} as Record<string, ProductVariant[]>);

  const handleVariantChange = (variantName: string, variantValue: string) => {
    setSelectedVariants(prev => ({
      ...prev,
      [variantName]: variantValue
    }));
  };

  const handleQuantityChange = (newQuantity: number) => {
    if (newQuantity >= 1 && newQuantity <= stock) {
      setQuantity(newQuantity);
    }
  };

  const handleAddToCart = () => {
    // Check if all required variants are selected
    const requiredVariants = Object.keys(variantGroups);
    const missingVariants = requiredVariants.filter(variantName => !selectedVariants[variantName]);

    if (missingVariants.length > 0) {
      alert(`Por favor selecciona: ${missingVariants.join(', ')}`);
      return;
    }

    // Add to cart using Zustand store
    addItem({
      productId: id,
      name,
      slug,
      price,
      image: "/placeholder-product.jpg", // In real app, get main image
      variants: selectedVariants,
      maxStock: stock,
      quantity,
    });

    // Open cart to show feedback
    openCart();

    // Call the original callback if provided
    if (onAddToCart) {
      onAddToCart(id, quantity, selectedVariants);
    }
  };

  const discountPercentage = compareAtPrice
    ? Math.round(((compareAtPrice - price) / compareAtPrice) * 100)
    : 0;

  const isOutOfStock = stock === 0;
  const hasLimitedStock = stock > 0 && stock <= 5;

  return (
    <div className={cn("space-y-6", className)}>
      {/* Header */}
      <div className="space-y-4">
        {/* Badges */}
        <div className="flex items-center space-x-2">
          {isNew && <Badge className="bg-green-600 hover:bg-green-700">Nuevo</Badge>}
          {isFeatured && <Badge className="bg-gold-600 hover:bg-gold-700">Destacado</Badge>}
          {discountPercentage > 0 && (
            <Badge className="bg-red-600 hover:bg-red-700">-{discountPercentage}%</Badge>
          )}
          {hasLimitedStock && (
            <Badge variant="secondary" className="text-orange-600">
              ¡Últimas {stock} unidades!
            </Badge>
          )}
        </div>

        {/* Title and SKU */}
        <div>
          <h1 className="text-3xl md:text-4xl font-light text-gray-900 mb-2">
            {name}
          </h1>
          {sku && (
            <p className="text-sm text-gray-500">SKU: {sku}</p>
          )}
        </div>

        {/* Tags */}
        {tags && tags.length > 0 && (
          <div className="flex flex-wrap gap-2">
            {tags.map((tag) => (
              <Badge
                key={tag.name}
                variant="secondary"
                className="text-xs"
                style={{ backgroundColor: tag.color ? `${tag.color}20` : undefined }}
              >
                {tag.name}
              </Badge>
            ))}
          </div>
        )}

        {/* Price */}
        <div className="flex items-center space-x-3">
          <span className="text-3xl font-semibold text-gray-900">
            ${price.toLocaleString('es-AR')}
          </span>
          {compareAtPrice && (
            <span className="text-xl text-gray-500 line-through">
              ${compareAtPrice.toLocaleString('es-AR')}
            </span>
          )}
        </div>

        {/* Short Description */}
        {shortDescription && (
          <p className="text-lg text-gray-600 leading-relaxed">
            {shortDescription}
          </p>
        )}
      </div>

      {/* Variants */}
      {Object.entries(variantGroups).map(([variantName, variantOptions]) => (
        <div key={variantName} className="space-y-3">
          <h3 className="font-medium text-gray-900">{variantName}</h3>
          <div className="flex flex-wrap gap-2">
            {variantOptions.map((variant) => (
              <button
                key={variant.id}
                onClick={() => handleVariantChange(variantName, variant.value)}
                className={cn(
                  "px-4 py-2 border rounded-lg text-sm font-medium transition-colors",
                  selectedVariants[variantName] === variant.value
                    ? "border-gold-600 bg-gold-50 text-gold-700"
                    : "border-gray-200 hover:border-gray-300 text-gray-700"
                )}
                disabled={variant.stock === 0}
              >
                {variant.value}
                {variant.stock === 0 && " (Agotado)"}
              </button>
            ))}
          </div>
        </div>
      ))}

      {/* Quantity and Add to Cart */}
      <div className="space-y-4">
        {/* Quantity Selector */}
        <div className="flex items-center space-x-4">
          <span className="font-medium text-gray-900">Cantidad:</span>
          <div className="flex items-center border border-gray-200 rounded-lg">
            <button
              onClick={() => handleQuantityChange(quantity - 1)}
              disabled={quantity <= 1}
              className="p-2 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
              aria-label="Disminuir cantidad"
            >
              <Minus className="w-4 h-4" />
            </button>
            <span className="px-4 py-2 font-medium min-w-[3rem] text-center">
              {quantity}
            </span>
            <button
              onClick={() => handleQuantityChange(quantity + 1)}
              disabled={quantity >= stock}
              className="p-2 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
              aria-label="Aumentar cantidad"
            >
              <Plus className="w-4 h-4" />
            </button>
          </div>
          <span className="text-sm text-gray-500">
            {stock} disponibles
          </span>
        </div>

        {/* Action Buttons */}
        <div className="flex space-x-3">
          <Button
            onClick={handleAddToCart}
            disabled={isOutOfStock}
            className="flex-1 bg-gold-600 hover:bg-gold-700 text-white py-3"
            size="lg"
          >
            <ShoppingCart className="w-5 h-5 mr-2" />
            {isOutOfStock ? "Agotado" : "Agregar al carrito"}
          </Button>
          <IconButton
            icon={Heart}
            onClick={() => {
              if (status === "loading") return;
              if (!session?.user) {
                alert("Inicia sesión para guardar favoritos.");
                window.location.href = "/auth/signin";
                return;
              }

              const favoritePayload = {
                id,
                name,
                slug,
                price,
                compareAtPrice,
                images: images || [],
                category: category || { name: "Colección", slug: "coleccion" },
                isFeatured,
                isNew,
                tags,
              };

              if (isWishlisted) {
                removeFavorite(id);
                fetch(`/api/favorites/${id}`, { method: "DELETE" }).catch(() => {
                  addFavorite(favoritePayload);
                });
              } else {
                addFavorite(favoritePayload);
                fetch("/api/favorites", {
                  method: "POST",
                  headers: { "Content-Type": "application/json" },
                  body: JSON.stringify({ productId: id }),
                }).catch(() => {
                  removeFavorite(id);
                });
              }
            }}
            className={cn(
              "border border-gray-200 hover:border-gray-300",
              isWishlisted && "text-red-500 border-red-200"
            )}
            aria-label="Agregar a favoritos"
          />
        </div>
      </div>

      {/* Trust Indicators */}
      <div className="border-t pt-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="flex items-center space-x-3 text-sm text-gray-600">
            <Truck className="w-5 h-5 text-green-600 flex-shrink-0" />
            <span>Envío gratuito en compras mayores a $50.000</span>
          </div>
          <div className="flex items-center space-x-3 text-sm text-gray-600">
            <Shield className="w-5 h-5 text-blue-600 flex-shrink-0" />
            <span>Garantía de autenticidad</span>
          </div>
          <div className="flex items-center space-x-3 text-sm text-gray-600">
            <RotateCcw className="w-5 h-5 text-orange-600 flex-shrink-0" />
            <span>Devoluciones gratuitas por 30 días</span>
          </div>
        </div>
      </div>

      {/* Additional Information */}
      <div className="border-t pt-6 space-y-4">
        {/* Description */}
        {description && (
          <div>
            <h3 className="font-semibold text-gray-900 mb-2">Descripción</h3>
            <div
              className="text-gray-600 leading-relaxed prose prose-sm max-w-none"
              dangerouslySetInnerHTML={{ __html: description }}
            />
          </div>
        )}

        {/* Material */}
        {material && (
          <div>
            <h3 className="font-semibold text-gray-900 mb-2">Material</h3>
            <p className="text-gray-600">{material}</p>
          </div>
        )}

        {/* Care Instructions */}
        {careInstructions && (
          <div>
            <h3 className="font-semibold text-gray-900 mb-2">Cuidados</h3>
            <p className="text-gray-600">{careInstructions}</p>
          </div>
        )}
      </div>
    </div>
  );
}
