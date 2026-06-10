"use client";

/**
 * MagicCard — Magic UI inline
 * Card com efeito "spotlight" — gradiente radial que segue o cursor.
 * Inspirado em: https://magicui.design/docs/components/magic-card
 */

import { useRef, useCallback } from "react";
import { motion, useMotionValue, useTransform } from "framer-motion";
import { cn } from "@/lib/utils";

interface MagicCardProps {
  children: React.ReactNode;
  className?: string;
  /** Raio do spotlight em px. Padrão: 250 */
  spotlightSize?: number;
  /** Cor do spotlight. Padrão: rgba(244, 123, 58, 0.08) */
  spotlightColor?: string;
}

export function MagicCard({
  children,
  className,
  spotlightSize = 250,
  spotlightColor = "rgba(244, 123, 58, 0.08)",
}: MagicCardProps) {
  const cardRef = useRef<HTMLDivElement>(null);
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  const background = useTransform(
    [mouseX, mouseY],
    ([x, y]: number[]) =>
      `radial-gradient(${spotlightSize}px circle at ${x}px ${y}px, ${spotlightColor}, transparent 80%)`
  );

  const handleMouseMove = useCallback(
    (e: React.MouseEvent<HTMLDivElement>) => {
      if (!cardRef.current) return;
      const rect = cardRef.current.getBoundingClientRect();
      mouseX.set(e.clientX - rect.left);
      mouseY.set(e.clientY - rect.top);
    },
    [mouseX, mouseY]
  );

  return (
    <div
      ref={cardRef}
      onMouseMove={handleMouseMove}
      className={cn("relative", className)}
    >
      {/* Spotlight layer */}
      <motion.div
        className="pointer-events-none absolute inset-0 rounded-[inherit] z-0 transition-opacity duration-300"
        style={{ background }}
      />
      {/* Content */}
      <div className="relative z-10">{children}</div>
    </div>
  );
}
