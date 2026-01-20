"use client";

import { useState } from "react";
import Image from "next/image";
import { cn } from "@/lib/utils";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import { ZoomIn } from "lucide-react";

interface ProductImageProps {
  src: string;
  alt: string;
  className?: string;
  priority?: boolean;
  enableZoom?: boolean;
}

export function ProductImage({
  src,
  alt,
  className,
  priority = false,
  enableZoom = true,
}: ProductImageProps) {
  const [isZoomed, setIsZoomed] = useState(false);

  if (enableZoom) {
    return (
      <Dialog>
        <DialogTrigger asChild>
          <div
            className={cn(
              "relative cursor-pointer group overflow-hidden",
              className
            )}
            onMouseEnter={() => setIsZoomed(true)}
            onMouseLeave={() => setIsZoomed(false)}
          >
            <Image
              src={src}
              alt={alt}
              fill
              className={cn(
                "object-cover transition-transform duration-300",
                isZoomed && "scale-105"
              )}
              priority={priority}
            />
            <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors duration-300 flex items-center justify-center">
              <ZoomIn className="w-6 h-6 text-white opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            </div>
          </div>
        </DialogTrigger>
        <DialogContent className="max-w-4xl max-h-[90vh] p-0">
          <div className="relative w-full h-full">
            <Image
              src={src}
              alt={alt}
              fill
              className="object-contain"
              priority
            />
          </div>
        </DialogContent>
      </Dialog>
    );
  }

  return (
    <div className={cn("relative overflow-hidden", className)}>
      <Image
        src={src}
        alt={alt}
        fill
        className="object-cover"
        priority={priority}
      />
    </div>
  );
}