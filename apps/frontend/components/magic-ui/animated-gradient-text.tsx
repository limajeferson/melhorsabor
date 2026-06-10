"use client";

/**
 * AnimatedGradientText — Magic UI inline
 * Texto com gradiente animado (shimmer horizontal).
 * Inspirado em: https://magicui.design/docs/components/animated-gradient-text
 */

import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

interface AnimatedGradientTextProps {
  children: React.ReactNode;
  className?: string;
  /** Cores do gradiente. Padrão: paleta MelhorSabor (tomato → honey → apricot) */
  colors?: string[];
  /** Duração do ciclo de animação em segundos. Padrão: 4 */
  duration?: number;
}

export function AnimatedGradientText({
  children,
  className,
  colors = ["#f47b3a", "#ffd27d", "#ffc985", "#f47b3a"],
  duration = 4,
}: AnimatedGradientTextProps) {
  const gradient = `linear-gradient(90deg, ${colors.join(", ")})`;

  return (
    <motion.span
      className={cn("inline-block bg-clip-text text-transparent", className)}
      style={{
        backgroundImage: gradient,
        backgroundSize: "200% 100%",
      }}
      animate={{
        backgroundPosition: ["0% 50%", "100% 50%", "0% 50%"],
      }}
      transition={{
        duration,
        repeat: Infinity,
        ease: "linear",
      }}
    >
      {children}
    </motion.span>
  );
}
