"use client";

import { useState } from "react";
import { ChevronDown, ChevronUp, SlidersHorizontal, Search, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";

interface FilterOption {
  value: string;
  label: string;
  count?: number;
}

interface ProductFiltersProps {
  className?: string;
  categoryOptions: FilterOption[];
  selectedCategories: string[];
  onCategoryChange: (category: string) => void;
  genderOptions: FilterOption[];
  selectedGenders: string[];
  onGenderChange: (gender: string) => void;
  materialOptions: FilterOption[];
  selectedMaterials: string[];
  onMaterialChange: (material: string) => void;
  themeOptions: FilterOption[];
  selectedThemes: string[];
  onThemeChange: (theme: string) => void;
  priceRangeOptions: FilterOption[];
  selectedPriceRange: string;
  onPriceRangeChange: (range: string) => void;
  searchTerm: string;
  onSearchTermChange: (term: string) => void;
  clearAllFilters: () => void;
}

export function ProductFilters({
  className,
  categoryOptions,
  selectedCategories,
  onCategoryChange,
  genderOptions,
  selectedGenders,
  onGenderChange,
  materialOptions,
  selectedMaterials,
  onMaterialChange,
  themeOptions,
  selectedThemes,
  onThemeChange,
  priceRangeOptions,
  selectedPriceRange,
  onPriceRangeChange,
  searchTerm,
  onSearchTermChange,
  clearAllFilters,
}: ProductFiltersProps) {
  const [expandedSections, setExpandedSections] = useState<Record<string, boolean>>({
    category: true,
    gender: true,
    material: true,
    theme: true,
    price: true,
  });

  const toggleSection = (section: string) => {
    setExpandedSections(prev => ({
      ...prev,
      [section]: !prev[section]
    }));
  };

  const FilterSection = ({
    title,
    options,
    selectedValues,
    onChange,
    sectionKey
  }: {
    title: string;
    options: FilterOption[];
    selectedValues: string[];
    onChange: (value: string) => void;
    sectionKey: string;
  }) => (
    <div className="border-b border-gray-200 pb-4 mb-4 last:border-b-0">
      <button
        onClick={() => toggleSection(sectionKey)}
        className="flex items-center justify-between w-full text-left font-serif text-lg font-semibold text-gray-900 mb-3 hover:text-gold-700 transition-colors"
      >
        {title}
        {expandedSections[sectionKey] ? (
          <ChevronUp className="w-5 h-5 text-gray-600" />
        ) : (
          <ChevronDown className="w-5 h-5 text-gray-600" />
        )}
      </button>

      {expandedSections[sectionKey] && (
        <div className="space-y-2">
          {options.map((option) => (
            <label key={option.value} className="flex items-center space-x-2 cursor-pointer group">
              <input
                type="checkbox"
                checked={selectedValues.includes(option.value)}
                onChange={() => onChange(option.value)}
                className="h-4 w-4 rounded border-gray-300 text-gold-600 focus:ring-gold-500 focus:ring-offset-0 cursor-pointer"
              />
              <span className="text-base text-gray-700 font-sans group-hover:text-gold-600 transition-colors">
                {option.label}
                {option.count !== undefined && (
                  <span className="text-gray-500 ml-1 text-sm">({option.count})</span>
                )}
              </span>
            </label>
          ))}
        </div>
      )}
    </div>
  );

  const FiltersContent = () => (
    <div className="space-y-6">
      <div className="relative mb-6">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
        <Input
          type="text"
          placeholder="Buscar productos..."
          className="w-full pl-9 pr-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-gold-500 focus:border-gold-500 font-sans text-sm"
          value={searchTerm}
          onChange={(e) => onSearchTermChange(e.target.value)}
        />
        {searchTerm && (
          <Button
            variant="ghost"
            size="sm"
            onClick={() => onSearchTermChange("")}
            className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700 p-1"
          >
            <X className="w-4 h-4" />
          </Button>
        )}
      </div>
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold text-gray-900">Filtros</h3>
        <Button
          variant="ghost"
          size="sm"
          onClick={clearAllFilters}
          className="text-gold-600 hover:text-gold-700"
        >
          Limpiar todo
        </Button>
      </div>

      <FilterSection
        title="Categoría"
        options={categoryOptions}
        selectedValues={selectedCategories}
        onChange={onCategoryChange}
        sectionKey="category"
      />

      <FilterSection
        title="Género"
        options={genderOptions}
        selectedValues={selectedGenders}
        onChange={onGenderChange}
        sectionKey="gender"
      />

      <FilterSection
        title="Material"
        options={materialOptions}
        selectedValues={selectedMaterials}
        onChange={onMaterialChange}
        sectionKey="material"
      />

      <FilterSection
        title="Temática"
        options={themeOptions}
        selectedValues={selectedThemes}
        onChange={onThemeChange}
        sectionKey="theme"
      />

      {/* Price Range - Radio buttons */}
      <div className="border-b border-gray-200 pb-4 mb-4 last:border-b-0">
        <button
          onClick={() => toggleSection("price")}
          className="flex items-center justify-between w-full text-left font-medium text-gray-900 mb-3 hover:text-gold-700 transition-colors"
        >
          Precio
          {expandedSections.price ? (
            <ChevronUp className="w-4 h-4" />
          ) : (
            <ChevronDown className="w-4 h-4" />
          )}
        </button>

        {expandedSections.price && (
          <div className="space-y-2">
            {priceRangeOptions.map((range) => (
              <label key={range.value} className="flex items-center space-x-2 cursor-pointer">
                <input
                  type="radio"
                  name="priceRange"
                  value={range.value}
                  checked={selectedPriceRange === range.value}
                  onChange={(e) => onPriceRangeChange(e.target.value)}
                  className="border-gray-300 text-gold-600 focus:ring-gold-500"
                />
                <span className="text-sm text-gray-700">
                  {range.label}
                  {range.count !== undefined && (
                    <span className="text-gray-400 ml-1">({range.count})</span>
                  )}
                </span>
              </label>
            ))}
          </div>
        )}
      </div>
    </div>
  );

  return (
    <>
      {/* Desktop Filters */}
      <div className={cn("hidden lg:block w-64 flex-shrink-0", className)}>
        <div className="bg-white border border-gray-200 rounded-lg p-6 sticky top-4">
          <FiltersContent />
        </div>
      </div>

      {/* Mobile Filters */}
      <div className="lg:hidden mb-6">
        <Sheet>
          <SheetTrigger asChild>
            <Button variant="outline" className="w-full">
              <SlidersHorizontal className="w-4 h-4 mr-2" />
              Filtros
              {(selectedCategories.length + selectedGenders.length + selectedMaterials.length + selectedThemes.length + (selectedPriceRange ? 1 : 0) + (searchTerm ? 1 : 0)) > 0 && (
                <span className="ml-2 bg-gold-600 text-white rounded-full px-2 py-0.5 text-xs">
                  {selectedCategories.length + selectedGenders.length + selectedMaterials.length + selectedThemes.length + (selectedPriceRange ? 1 : 0) + (searchTerm ? 1 : 0)}
                </span>
              )}
            </Button>
          </SheetTrigger>
          <SheetContent side="left" className="w-80">
            <SheetTitle className="sr-only">Filtros de productos</SheetTitle>
            <FiltersContent />
          </SheetContent>
        </Sheet>
      </div>
    </>
  );
}
