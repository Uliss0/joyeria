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

type FilterSectionProps = {
  title: string;
  options: FilterOption[];
  selectedValues: string[];
  onChange: (value: string) => void;
  sectionKey: string;
  expandedSections: Record<string, boolean>;
  toggleSection: (section: string) => void;
};

function FilterSection({
  title,
  options,
  selectedValues,
  onChange,
  sectionKey,
  expandedSections,
  toggleSection,
}: FilterSectionProps) {
  return (
    <div className="border-b border-gray-200 pb-4 mb-4 last:border-b-0">
      <button
        type="button"
        onClick={() => toggleSection(sectionKey)}
        className="mb-3 flex w-full items-center justify-between text-left font-serif text-lg font-semibold text-gray-900 transition-colors hover:text-gold-700"
      >
        {title}
        {expandedSections[sectionKey] ? (
          <ChevronUp className="h-5 w-5 text-gray-600" />
        ) : (
          <ChevronDown className="h-5 w-5 text-gray-600" />
        )}
      </button>

      {expandedSections[sectionKey] && (
        <div className="space-y-2">
          {options.map((option) => (
            <label key={option.value} className="group flex cursor-pointer items-center space-x-2">
              <input
                type="checkbox"
                checked={selectedValues.includes(option.value)}
                onChange={() => onChange(option.value)}
                className="h-4 w-4 cursor-pointer rounded border-gray-300 text-gold-600 focus:ring-gold-500 focus:ring-offset-0"
              />
              <span className="font-sans text-base text-gray-700 transition-colors group-hover:text-gold-600">
                {option.label}
                {option.count !== undefined && (
                  <span className="ml-1 text-sm text-gray-500">({option.count})</span>
                )}
              </span>
            </label>
          ))}
        </div>
      )}
    </div>
  );
}

type FiltersContentProps = ProductFiltersProps & {
  expandedSections: Record<string, boolean>;
  toggleSection: (section: string) => void;
};

function FiltersContent({
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
  expandedSections,
  toggleSection,
}: FiltersContentProps) {
  return (
    <div className="space-y-6">
      <div className="relative mb-6">
        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
        <Input
          type="text"
          placeholder="Buscar productos..."
          className="w-full rounded-md border border-gray-300 py-2 pl-9 pr-3 text-sm font-sans shadow-sm focus:border-gold-500 focus:outline-none focus:ring-gold-500"
          value={searchTerm}
          onChange={(e) => onSearchTermChange(e.target.value)}
        />
        {searchTerm && (
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={() => onSearchTermChange("")}
            className="absolute right-2 top-1/2 -translate-y-1/2 p-1 text-gray-500 hover:text-gray-700"
          >
            <X className="h-4 w-4" />
          </Button>
        )}
      </div>

      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold text-gray-900">Filtros</h3>
        <Button
          type="button"
          variant="ghost"
          size="sm"
          onClick={clearAllFilters}
          className="text-gold-600 hover:text-gold-700"
        >
          Limpiar todo
        </Button>
      </div>

      <FilterSection
        title="Categoria"
        options={categoryOptions}
        selectedValues={selectedCategories}
        onChange={onCategoryChange}
        sectionKey="category"
        expandedSections={expandedSections}
        toggleSection={toggleSection}
      />

      <FilterSection
        title="Genero"
        options={genderOptions}
        selectedValues={selectedGenders}
        onChange={onGenderChange}
        sectionKey="gender"
        expandedSections={expandedSections}
        toggleSection={toggleSection}
      />

      <FilterSection
        title="Material"
        options={materialOptions}
        selectedValues={selectedMaterials}
        onChange={onMaterialChange}
        sectionKey="material"
        expandedSections={expandedSections}
        toggleSection={toggleSection}
      />

      <FilterSection
        title="Tematica"
        options={themeOptions}
        selectedValues={selectedThemes}
        onChange={onThemeChange}
        sectionKey="theme"
        expandedSections={expandedSections}
        toggleSection={toggleSection}
      />

      <div className="border-b border-gray-200 pb-4 last:border-b-0">
        <button
          type="button"
          onClick={() => toggleSection("price")}
          className="mb-3 flex w-full items-center justify-between text-left font-medium text-gray-900 transition-colors hover:text-gold-700"
        >
          Precio
          {expandedSections.price ? (
            <ChevronUp className="h-4 w-4" />
          ) : (
            <ChevronDown className="h-4 w-4" />
          )}
        </button>

        {expandedSections.price && (
          <div className="space-y-2">
            {priceRangeOptions.map((range) => (
              <label key={range.value} className="flex cursor-pointer items-center space-x-2">
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
                    <span className="ml-1 text-gray-400">({range.count})</span>
                  )}
                </span>
              </label>
            ))}
          </div>
        )}
      </div>
    </div>
  );
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
    setExpandedSections((prev) => ({
      ...prev,
      [section]: !prev[section],
    }));
  };

  return (
    <>
      <div className={cn("hidden w-64 flex-shrink-0 lg:block", className)}>
        <div className="sticky top-4 rounded-lg border border-gray-200 bg-white p-6">
          <FiltersContent
            categoryOptions={categoryOptions}
            selectedCategories={selectedCategories}
            onCategoryChange={onCategoryChange}
            genderOptions={genderOptions}
            selectedGenders={selectedGenders}
            onGenderChange={onGenderChange}
            materialOptions={materialOptions}
            selectedMaterials={selectedMaterials}
            onMaterialChange={onMaterialChange}
            themeOptions={themeOptions}
            selectedThemes={selectedThemes}
            onThemeChange={onThemeChange}
            priceRangeOptions={priceRangeOptions}
            selectedPriceRange={selectedPriceRange}
            onPriceRangeChange={onPriceRangeChange}
            searchTerm={searchTerm}
            onSearchTermChange={onSearchTermChange}
            clearAllFilters={clearAllFilters}
            expandedSections={expandedSections}
            toggleSection={toggleSection}
          />
        </div>
      </div>

      <div className="mb-6 lg:hidden">
        <Sheet>
          <SheetTrigger asChild>
            <Button type="button" variant="outline" className="w-full">
              <SlidersHorizontal className="mr-2 h-4 w-4" />
              Filtros
              {(selectedCategories.length +
                selectedGenders.length +
                selectedMaterials.length +
                selectedThemes.length +
                (selectedPriceRange ? 1 : 0) +
                (searchTerm ? 1 : 0)) > 0 && (
                <span className="ml-2 rounded-full bg-gold-600 px-2 py-0.5 text-xs text-white">
                  {selectedCategories.length +
                    selectedGenders.length +
                    selectedMaterials.length +
                    selectedThemes.length +
                    (selectedPriceRange ? 1 : 0) +
                    (searchTerm ? 1 : 0)}
                </span>
              )}
            </Button>
          </SheetTrigger>
          <SheetContent side="left" className="w-80">
            <SheetTitle className="sr-only">Filtros de productos</SheetTitle>
            <FiltersContent
              categoryOptions={categoryOptions}
              selectedCategories={selectedCategories}
              onCategoryChange={onCategoryChange}
              genderOptions={genderOptions}
              selectedGenders={selectedGenders}
              onGenderChange={onGenderChange}
              materialOptions={materialOptions}
              selectedMaterials={selectedMaterials}
              onMaterialChange={onMaterialChange}
              themeOptions={themeOptions}
              selectedThemes={selectedThemes}
              onThemeChange={onThemeChange}
              priceRangeOptions={priceRangeOptions}
              selectedPriceRange={selectedPriceRange}
              onPriceRangeChange={onPriceRangeChange}
              searchTerm={searchTerm}
              onSearchTermChange={onSearchTermChange}
              clearAllFilters={clearAllFilters}
              expandedSections={expandedSections}
              toggleSection={toggleSection}
            />
          </SheetContent>
        </Sheet>
      </div>
    </>
  );
}
