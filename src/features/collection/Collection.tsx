"use client";

import { useState, useEffect, useCallback } from "react";
import { ProductFilters } from "./components/ProductFilters";
import { ProductGrid } from "./components/ProductGrid";
import { CollectionHeader } from "./components/CollectionHeader";
import Link from "next/link";
import { cn } from "@/lib/utils";

// Definición de la interfaz Product (copiada de ProductGrid para asegurar compatibilidad)
interface Product {
  id: string;
  name: string;
  slug: string;
  description?: string; // Added description property
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

// Mock data - replace with API call
const mockProducts: Product[] = [
  {
    id: "1",
    name: "Anillo Clásico de Oro",
    slug: "anillo-clasico-oro",
    price: 85000,
    compareAtPrice: 95000,
    images: [
      {
        url: "https://images.unsplash.com/photo-1605100804763-247f67b3557e?w=400&h=400&fit=crop",
        alt: "Anillo clásico de oro",
        isMain: true,
      },
    ],
    category: {
      name: "Anillos",
      slug: "anillos",
    },
    isFeatured: true,
    isNew: true,
    tags: [{ name: "Oro", color: "#FFD700" }],
  },
  {
    id: "2",
    name: "Collar Minimalista de Plata",
    slug: "collar-minimalista-plata",
    price: 45000,
    images: [
      {
        url: "https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?w=400&h=400&fit=crop",
        alt: "Collar minimalista de plata",
        isMain: true,
      },
    ],
    category: {
      name: "Collares",
      slug: "collares",
    },
    isFeatured: false,
    isNew: true,
    tags: [{ name: "Plata", color: "#C0C0C0" }],
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
    category: {
      name: "Pulseras",
      slug: "pulseras",
    },
    isFeatured: true,
    isNew: false,
    tags: [{ name: "Oro", color: "#FFD700" }],
  },
  {
    id: "4",
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
    category: {
      name: "Aros",
      slug: "aros",
    },
    isFeatured: false,
    isNew: false,
    tags: [{ name: "Plata", color: "#C0C0C0" }],
  },
  {
    id: "5",
    name: "Pendientes de Diamante",
    slug: "pendientes-diamante",
    price: 180000,
    images: [
      {
        url: "https://images.unsplash.com/photo-1603561591411-07134e71a2a9?w=400&h=400&fit=crop",
        alt: "Pendientes de diamante",
        isMain: true,
      },
    ],
    category: {
      name: "Pendientes",
      slug: "pendientes",
    },
    isFeatured: true,
    isNew: true,
    tags: [{ name: "Diamante", color: "#B9F2FF" }],
  },
  {
    id: "6",
    name: "Anillo de Compromiso",
    slug: "anillo-compromiso",
    price: 250000,
    images: [
      {
        url: "https://images.unsplash.com/photo-1605100804763-247f67b3557e?w=400&h=400&fit=crop",
        alt: "Anillo de compromiso",
        isMain: true,
      },
    ],
    category: {
      name: "Anillos",
      slug: "anillos",
    },
    isFeatured: true,
    isNew: false,
    tags: [{ name: "Oro", color: "#FFD700" }, { name: "Diamante", color: "#B9F2FF" }],
  },
];

export default function Collection() {
  const [displayedProducts, setDisplayedProducts] = useState<Product[]>(mockProducts);
  const [loading, setLoading] = useState(false);
  const [sortBy, setSortBy] = useState("featured");
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");

  // Filter states
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [selectedGenders, setSelectedGenders] = useState<string[]>([]);
  const [selectedMaterials, setSelectedMaterials] = useState<string[]>([]);
  const [selectedPriceRange, setSelectedPriceRange] = useState<string>("");
  const [searchTerm, setSearchTerm] = useState<string>("");

  const applyFilters = useCallback(() => {
    setLoading(true);
    setTimeout(() => {
      let filtered = [...mockProducts];

      // Filter by search term
      if (searchTerm) {
        filtered = filtered.filter(product =>
          product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          product.description?.toLowerCase().includes(searchTerm.toLowerCase()) ||
          product.category.name.toLowerCase().includes(searchTerm.toLowerCase())
        );
      }

      // Filter by category
      if (selectedCategories.length > 0) {
        filtered = filtered.filter(product => selectedCategories.includes(product.category.slug));
      }

      // Filter by gender (assuming gender is also a tag or category, for mock purposes let's check tags)
      if (selectedGenders.length > 0) {
        filtered = filtered.filter(product =>
          product.tags?.some(tag => selectedGenders.includes(tag.name.toLowerCase())) ||
          selectedGenders.includes(product.category.slug) // Fallback for mock data if gender is in category
        );
      }

      // Filter by material (assuming material is a tag)
      if (selectedMaterials.length > 0) {
        filtered = filtered.filter(product =>
          product.tags?.some(tag => selectedMaterials.includes(tag.name.toLowerCase()))
        );
      }

      // Filter by price range
      if (selectedPriceRange) {
        const [minPriceStr, maxPriceStr] = selectedPriceRange.split('-');
        const minPrice = parseInt(minPriceStr);
        const maxPrice = maxPriceStr ? parseInt(maxPriceStr) : Infinity;

        filtered = filtered.filter(product =>
          product.price >= minPrice && product.price <= maxPrice
        );
      }

      // Apply sorting
      const sorted = filtered.sort((a, b) => {
        switch (sortBy) {
          case "price-low":
            return a.price - b.price;
          case "price-high":
            return b.price - a.price;
          case "name-asc":
            return a.name.localeCompare(b.name);
          case "name-desc":
            return b.name.localeCompare(a.name);
          case "newest":
            return (b.isNew ? 1 : 0) - (a.isNew ? 1 : 0);
          case "featured":
          default:
            return (b.isFeatured ? 1 : 0) - (a.isFeatured ? 1 : 0);
        }
      });

      setDisplayedProducts(sorted);
      setLoading(false);
    }, 300); // Simulate API call delay
  }, [selectedCategories, selectedGenders, selectedMaterials, selectedPriceRange, searchTerm, sortBy]);

  // Apply filters on initial load and when filter states change
  useEffect(() => {
    applyFilters();
  }, [applyFilters]);

  const handleSortChange = (newSort: string) => {
    setSortBy(newSort);
  };

  const handleCategoryChange = (category: string) => {
    setSelectedCategories(prev =>
      prev.includes(category)
        ? prev.filter(c => c !== category)
        : [...prev, category]
    );
  };

  const handleGenderChange = (gender: string) => {
    setSelectedGenders(prev =>
      prev.includes(gender)
        ? prev.filter(g => g !== gender)
        : [...prev, gender]
    );
  };

  const handleMaterialChange = (material: string) => {
    setSelectedMaterials(prev =>
      prev.includes(material)
        ? prev.filter(m => m !== material)
        : [...prev, material]
    );
  };

  const handlePriceRangeChange = (range: string) => {
    setSelectedPriceRange(range);
  };

  const handleSearchTermChange = (term: string) => {
    setSearchTerm(term);
  };

  const clearAllFilters = () => {
    setSelectedCategories([]);
    setSelectedGenders([]);
    setSelectedMaterials([]);
    setSelectedPriceRange("");
    setSearchTerm(""); // Clear search term
    setSortBy("featured"); // Reset sorting as well
  };

  return (
    <div className="min-h-screen bg-white">
      <div className="container mx-auto px-4 py-8">
        {/* Breadcrumb 
        <nav className="flex items-center space-x-2 text-sm text-gray-500 mb-8 font-sans">
          <Link href="/">Inicio</Link>
          <span>/</span>
          <span className="text-gray-900">Colección</span>
        </nav>*/}

        <div className="flex flex-col lg:flex-row gap-8">
          {/* Filters Sidebar */}
          <ProductFilters
            selectedCategories={selectedCategories}
            onCategoryChange={handleCategoryChange}
            selectedGenders={selectedGenders}
            onGenderChange={handleGenderChange}
            selectedMaterials={selectedMaterials}
            onMaterialChange={handleMaterialChange}
            selectedPriceRange={selectedPriceRange}
            onPriceRangeChange={handlePriceRangeChange}
            searchTerm={searchTerm}
            onSearchTermChange={handleSearchTermChange}
            clearAllFilters={clearAllFilters}
          />

          {/* Main Content */}
          <div className="flex-1">
            <CollectionHeader
              title="Nuestra Colección"
              subtitle="Descubre piezas únicas que reflejan tu estilo personal"
              totalProducts={displayedProducts.length}
              sortBy={sortBy}
              viewMode={viewMode}
              onSortChange={handleSortChange}
              onViewModeChange={setViewMode}
              className="mb-8"
            />

            <ProductGrid
              products={displayedProducts}
              loading={loading}
            />
          </div>
        </div>
      </div>
    </div>
  );
}