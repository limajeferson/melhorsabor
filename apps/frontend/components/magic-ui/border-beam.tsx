"use client";

/**
 * BorderBeam — Magic UI inline
 * Faixa luminosa que percorre a borda do card em loop.
 * Usa rotate animation (type-safe) em vez de CSS variable.
 */

import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

interface BorderBeamProps {
  /** Duracao de uma volta em segundos. Padrao: 3 */
  duration?: number;
  /** Cor inicial do gradiente */
  colorFrom?: string;
  /** Cor final do gradiente */
  colorTo?: string;
  className?: string;
}

export function BorderBeam({
  duration = 3,
  colorFrom = "#f47b3a",
  colorTo = "#ffd27d",
  className,
}: BorderBeamProps) {
  return (
    <motion.span
      className={cn(
        "pointer-events-none absolute inset-0 rounded-[inherit]",
        className
      )}
      style={{
        background: `conic-gradient(transparent 60%, ${colorFrom}, ${colorTo}, transparent 65%)`,
        mask: "linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)",
        maskComposite: "exclude",
        WebkitMask:
          "linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)",
        WebkitMaskComposite: "xor",
        padding: "1px",
      }}
      animate={{ rotate: [0, 360] }}
      transition={{
        duration,
        repeat: Infinity,
        ease: "linear",
      }}
    />
  );
}
