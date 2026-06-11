"use client";

import { useState } from "react";
import { Grid, List, SlidersHorizontal, ArrowUpDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { cn } from "@/lib/utils";

interface CollectionHeaderProps {
  title: string;
  subtitle?: string;
  totalProducts: number;
  sortBy: string;
  viewMode: "grid" | "list";
  onSortChange: (sort: string) => void;
  onViewModeChange: (mode: "grid" | "list") => void;
  className?: string;
}

const sortOptions = [
  { value: "featured", label: "Destacados" },
  { value: "newest", label: "Más recientes" },
  { value: "price-low", label: "Precio: menor a mayor" },
  { value: "price-high", label: "Precio: mayor a menor" },
  { value: "name-asc", label: "Nombre: A-Z" },
  { value: "name-desc", label: "Nombre: Z-A" },
];

export function CollectionHeader({
  title,
  subtitle,
  totalProducts,
  sortBy,
  viewMode,
  onSortChange,
  onViewModeChange,
  className
}: CollectionHeaderProps) {
  const currentSortLabel = sortOptions.find(option => option.value === sortBy)?.label || "Destacados";

  return (
    <div className={cn("space-y-6", className)}>
      {/* Title Section */}
      <div className="text-center">
        <h1 className="text-4xl md:text-5xl font-serif font-light text-foreground mb-3 leading-tight">
          {title}
        </h1>
        {subtitle && (
          <p className="text-lg md:text-xl text-muted-foreground font-sans max-w-2xl mx-auto">
            {subtitle}
          </p>
        )}
      </div>

      {/* Controls */}
      <div className="flex flex-col sm:flex-row items-center justify-between border-b border-border pb-4">
        <div className="text-sm text-muted-foreground font-sans mb-4 sm:mb-0">
          <span className="font-semibold text-foreground">{totalProducts}</span> {totalProducts === 1 ? 'producto' : 'productos'}
        </div>

        <div className="flex items-center space-x-4">
          {/* Sort Dropdown */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="sm" className="flex items-center space-x-2 border-border text-foreground hover:bg-muted transition-colors cursor-pointer bg-card">
                <ArrowUpDown className="w-4 h-4" />
                <span className="hidden sm:inline font-sans">{currentSortLabel}</span>
                <span className="sm:hidden font-sans">Ordenar</span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-48 bg-card shadow-lg border border-border rounded-md py-1">
              {sortOptions.map((option) => (
                <DropdownMenuItem
                   key={option.value}
                   onClick={() => onSortChange(option.value)}
                   className={cn(
                     "cursor-pointer text-foreground hover:bg-muted transition-colors px-4 py-2 text-sm font-sans focus:bg-muted focus:text-foreground",
                     sortBy === option.value && "bg-primary/10 text-primary font-semibold hover:bg-primary/15"
                   )}
                >
                  {option.label}
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>

          {/* View Mode Toggle */}
          <div className="flex items-center border border-border rounded-md shadow-sm bg-card overflow-hidden">
            <Button
              variant={viewMode === "grid" ? "default" : "ghost"}
              size="sm"
              onClick={() => onViewModeChange("grid")}
              className={cn(
                "rounded-none border-r border-border px-3 py-1.5 cursor-pointer",
                viewMode === "grid"
                  ? "bg-primary hover:bg-primary/90 text-primary-foreground"
                  : "hover:bg-muted text-muted-foreground bg-transparent"
              )}
            >
              <Grid className="w-4 h-4" />
            </Button>
            <Button
              variant={viewMode === "list" ? "default" : "ghost"}
              size="sm"
              onClick={() => onViewModeChange("list")}
              className={cn(
                "rounded-none px-3 py-1.5 cursor-pointer",
                viewMode === "list"
                  ? "bg-primary hover:bg-primary/90 text-primary-foreground"
                  : "hover:bg-muted text-muted-foreground bg-transparent"
              )}
            >
              <List className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}