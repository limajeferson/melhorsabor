"use client";

/**
 * ShimmerButton — Magic UI inline
 * Botão CTA com varredura luminosa em loop.
 * Inspirado em: https://magicui.design/docs/components/shimmer-button
 */

import { motion } from "framer-motion";
import Link from "next/link";
import { cn } from "@/lib/utils";

interface ShimmerButtonProps {
  children: React.ReactNode;
  className?: string;
  href?: string;
  onClick?: () => void;
  /** Cor de fundo. Padrão: tomato */
  background?: string;
  /** Duração do shimmer em segundos. Padrão: 2.5 */
  shimmerDuration?: number;
}

export function ShimmerButton({
  children,
  className,
  href,
  onClick,
  background = "#f47b3a",
  shimmerDuration = 2.5,
}: ShimmerButtonProps) {
  const inner = (
    <motion.span
      className={cn(
        "relative inline-flex items-center justify-center gap-2 overflow-hidden",
        "px-8 py-4 rounded-full font-bold text-white text-sm",
        "shadow-lg shadow-tomato/25 hover:shadow-tomato/40",
        "transition-shadow duration-300 cursor-pointer select-none",
        className
      )}
      style={{ backgroundColor: background }}
      whileHover={{ scale: 1.03 }}
      whileTap={{ scale: 0.97 }}
      transition={{ type: "spring", stiffness: 400, damping: 25 }}
    >
      {/* Shimmer overlay */}
      <motion.span
        className="pointer-events-none absolute inset-0 -skew-x-12"
        style={{
          background:
            "linear-gradient(90deg, transparent 0%, rgba(255,255,255,0.20) 50%, transparent 100%)",
          width: "60%",
        }}
        animate={{ x: ["-120%", "220%"] }}
        transition={{
          duration: shimmerDuration,
          repeat: Infinity,
          ease: "easeInOut",
          repeatDelay: 1,
        }}
      />
      {children}
    </motion.span>
  );

  if (href) {
    return (
      <Link href={href} className="inline-flex" onClick={onClick}>
        {inner}
      </Link>
    );
  }

  return (
    <button onClick={onClick} className="inline-flex">
      {inner}
    </button>
  );
}
