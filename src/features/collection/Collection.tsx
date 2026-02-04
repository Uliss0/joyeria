"use client";

import { useState, useEffect, useMemo, useDeferredValue } from "react";
import { useSearchParams } from "next/navigation";
import { ProductFilters } from "./components/ProductFilters";
import { ProductGrid } from "./components/ProductGrid";
import { CollectionHeader } from "./components/CollectionHeader";

// Definición de la interfaz Product (copiada de ProductGrid para asegurar compatibilidad)
interface Product {
  id: string;
  name: string;
  slug: string;
  description?: string; // Added description property
  material?: string;
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

interface FilterOption {
  value: string;
  label: string;
  count?: number;
}

const normalizeValue = (value: string) => value.trim().toLowerCase();
const genderValues = new Set(["mujer", "hombre", "unisex"]);

export default function Collection() {
  const searchParams = useSearchParams();
  const [allProducts, setAllProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  // Fetch products from API on mount
  useEffect(() => {
    let mounted = true;

    const fetchProducts = async () => {
      setLoading(true);
      try {
        const res = await fetch('/api/products?limit=200');
        if (!res.ok) throw new Error('Failed to fetch products');
        const data = await res.json();
        if (mounted) setAllProducts(data?.products || []);
      } catch (e) {
        console.error('Error fetching products:', e);
        if (mounted) setAllProducts([]);
      } finally {
        if (mounted) setLoading(false);
      }
    };

    fetchProducts();

    return () => {
      mounted = false;
    };
  }, []);
  const [sortBy, setSortBy] = useState("featured");
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");

  // Filter states
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [selectedGenders, setSelectedGenders] = useState<string[]>([]);
  const [selectedMaterials, setSelectedMaterials] = useState<string[]>([]);
  const [selectedPriceRange, setSelectedPriceRange] = useState<string>("");
  const [searchTerm, setSearchTerm] = useState<string>("");
  const deferredSearchTerm = useDeferredValue(searchTerm);

  useEffect(() => {
    const categoryParam = searchParams.get("categoria") ?? searchParams.get("category");
    const normalized = categoryParam ? categoryParam.toLowerCase() : "";

    setSelectedCategories((prev) => {
      if (normalized) {
        if (prev.length === 1 && prev[0] === normalized) return prev;
        return [normalized];
      }
      if (prev.length === 0) return prev;
      return [];
    });
  }, [searchParams]);

  const categoryOptions = useMemo<FilterOption[]>(() => {
    const map = new Map<string, FilterOption>();
    for (const product of allProducts) {
      const slug = normalizeValue(product.category?.slug || "coleccion");
      const label = product.category?.name || "Colecci\u00f3n";
      const current = map.get(slug);
      if (current) {
        current.count = (current.count || 0) + 1;
      } else {
        map.set(slug, { value: slug, label, count: 1 });
      }
    }
    return Array.from(map.values()).sort((a, b) => a.label.localeCompare(b.label));
  }, [allProducts]);

  const genderOptions = useMemo<FilterOption[]>(() => {
    const base = [
      { value: "mujer", label: "Mujer" },
      { value: "hombre", label: "Hombre" },
      { value: "unisex", label: "Unisex" },
    ];
    const counts = new Map<string, number>();
    for (const product of allProducts) {
      for (const tag of product.tags || []) {
        const normalized = normalizeValue(tag.name);
        if (genderValues.has(normalized)) {
          counts.set(normalized, (counts.get(normalized) || 0) + 1);
        }
      }
    }
    return base.map((option) => ({
      ...option,
      count: counts.get(option.value) || 0,
    }));
  }, [allProducts]);

  const materialOptions = useMemo<FilterOption[]>(() => {
    const map = new Map<string, FilterOption>();
    const addMaterial = (raw: string | undefined) => {
      if (!raw) return;
      const value = normalizeValue(raw);
      if (!value || genderValues.has(value)) return;
      const current = map.get(value);
      if (current) {
        current.count = (current.count || 0) + 1;
      } else {
        map.set(value, { value, label: raw.trim(), count: 1 });
      }
    };

    for (const product of allProducts) {
      addMaterial(product.material);
      for (const tag of product.tags || []) {
        addMaterial(tag.name);
      }
    }

    return Array.from(map.values()).sort((a, b) => a.label.localeCompare(b.label));
  }, [allProducts]);

  const priceRangeOptions = useMemo<FilterOption[]>(() => {
    const ranges = [
      { value: "0-50000", label: "Hasta $50.000" },
      { value: "50000-150000", label: "$50.000 - $150.000" },
      { value: "150000-300000", label: "$150.000 - $300.000" },
      { value: "300000+", label: "M\u00e1s de $300.000" },
    ];

    const counts = new Map<string, number>();
    for (const product of allProducts) {
      const price = product.price;
      if (price <= 50000) counts.set("0-50000", (counts.get("0-50000") || 0) + 1);
      else if (price <= 150000) counts.set("50000-150000", (counts.get("50000-150000") || 0) + 1);
      else if (price <= 300000) counts.set("150000-300000", (counts.get("150000-300000") || 0) + 1);
      else counts.set("300000+", (counts.get("300000+") || 0) + 1);
    }

    return ranges.map((range) => ({
      ...range,
      count: counts.get(range.value) || 0,
    }));
  }, [allProducts]);

  const displayedProducts = useMemo(() => {
    let filtered = [...allProducts];

    if (deferredSearchTerm) {
      const term = normalizeValue(deferredSearchTerm);
      filtered = filtered.filter(product =>
        product.name.toLowerCase().includes(term) ||
        (product.description || "").toLowerCase().includes(term) ||
        (product.category?.name || "Colecci\u00f3n").toLowerCase().includes(term)
      );
    }

    if (selectedCategories.length > 0) {
      filtered = filtered.filter(product =>
        selectedCategories.includes(normalizeValue(product.category.slug))
      );
    }

    if (selectedGenders.length > 0) {
      filtered = filtered.filter(product =>
        product.tags?.some(tag => selectedGenders.includes(normalizeValue(tag.name))) ||
        selectedGenders.includes(normalizeValue(product.category.slug))
      );
    }

    if (selectedMaterials.length > 0) {
      filtered = filtered.filter(product => {
        const normalizedMaterial = product.material ? normalizeValue(product.material) : "";
        const materialMatches = normalizedMaterial
          ? selectedMaterials.some((material) => normalizedMaterial.includes(material))
          : false;
        const tagMatches = product.tags?.some(tag => selectedMaterials.includes(normalizeValue(tag.name)));
        return materialMatches || tagMatches;
      });
    }

    if (selectedPriceRange) {
      const [minPriceStr, maxPriceStr] = selectedPriceRange.split("-");
      const minPrice = parseInt(minPriceStr, 10);
      const maxPrice = maxPriceStr ? parseInt(maxPriceStr, 10) : Infinity;

      filtered = filtered.filter(product =>
        product.price >= minPrice && product.price <= maxPrice
      );
    }

    return filtered.sort((a, b) => {
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
  }, [
    allProducts,
    deferredSearchTerm,
    selectedCategories,
    selectedGenders,
    selectedMaterials,
    selectedPriceRange,
    sortBy,
  ]);

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
            categoryOptions={categoryOptions}
            selectedCategories={selectedCategories}
            onCategoryChange={handleCategoryChange}
            genderOptions={genderOptions}
            selectedGenders={selectedGenders}
            onGenderChange={handleGenderChange}
            materialOptions={materialOptions}
            selectedMaterials={selectedMaterials}
            onMaterialChange={handleMaterialChange}
            priceRangeOptions={priceRangeOptions}
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


