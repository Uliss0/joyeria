import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { LucideIcon } from "lucide-react";
import React from "react";

interface IconButtonProps {
  icon: LucideIcon;
  size?: "sm" | "md" | "lg";
  variant?: "default" | "destructive" | "outline" | "secondary" | "ghost" | "link";
  className?: string;
  onClick?: (e: React.MouseEvent<HTMLButtonElement>) => void;
  disabled?: boolean;
  "aria-label": string;
}

export function IconButton({
  icon: Icon,
  size = "md",
  variant = "ghost",
  className,
  onClick,
  disabled,
  "aria-label": ariaLabel,
}: IconButtonProps) {
  const sizeClasses = {
    sm: "w-4 h-4",
    md: "w-5 h-5",
    lg: "w-6 h-6",
  };

  return (
    <Button
      variant={variant}
      size="icon"
      className={cn("p-2", className)}
      onClick={onClick}
      disabled={disabled}
      aria-label={ariaLabel}
    >
      <Icon className={sizeClasses[size]} />
    </Button>
  );
}