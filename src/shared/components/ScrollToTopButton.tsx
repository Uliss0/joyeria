"use client";

import { ChevronUp } from "lucide-react";

export function ScrollToTopButton() {
  return (
    <button
      onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
      aria-label="Volver arriba"
      className="group flex flex-col items-center gap-1 pr-4 text-white/55 transition-all duration-300 hover:text-gold-400"
    >
      <span className="flex h-11 w-11 items-center justify-center rounded-full border border-white/20 transition-all duration-300 group-hover:border-gold-400/50 group-hover:-translate-y-1">
        <ChevronUp className="h-5 w-5 transition-transform duration-300 group-hover:-translate-y-0.5" />
      </span>
      <span className="text-[10px] tracking-widest uppercase opacity-75 group-hover:opacity-100">Inicio</span>
    </button>
  );
}
