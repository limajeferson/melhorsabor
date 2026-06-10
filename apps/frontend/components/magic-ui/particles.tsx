"use client";

/**
 * Particles — Magic UI inline
 * Fundo de partículas flutuantes. Posições geradas no cliente via useEffect
 * para evitar mismatch de hidratação.
 * Inspirado em: https://magicui.design/docs/components/particles
 */

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

interface Particle {
  id: number;
  x: number;
  y: number;
  size: number;
  duration: number;
  delay: number;
}

interface ParticlesProps {
  /** Quantidade de partículas. Padrão: 25 */
  count?: number;
  /** Cor das partículas. Padrão: #ffd27d (honey) */
  color?: string;
  /** Opacidade base. Padrão: 0.4 */
  opacity?: number;
  className?: string;
}

export function Particles({
  count = 25,
  color = "#ffd27d",
  opacity = 0.4,
  className,
}: ParticlesProps) {
  const [particles, setParticles] = useState<Particle[]>([]);

  // Gera partículas apenas no cliente para evitar hydration mismatch
  useEffect(() => {
    const generated: Particle[] = Array.from({ length: count }, (_, i) => ({
      id: i,
      x: Math.random() * 100,
      y: Math.random() * 100,
      size: Math.random() * 4 + 2, // 2–6px
      duration: Math.random() * 4 + 3, // 3–7s
      delay: Math.random() * 3, // 0–3s
    }));
    setParticles(generated);
  }, [count]);

  return (
    <div
      className={cn("pointer-events-none absolute inset-0 overflow-hidden", className)}
      aria-hidden
    >
      {particles.map((p) => (
        <motion.span
          key={p.id}
          className="absolute rounded-full"
          style={{
            left: `${p.x}%`,
            top: `${p.y}%`,
            width: p.size,
            height: p.size,
            backgroundColor: color,
            opacity,
          }}
          animate={{
            y: [0, -24, 0],
            opacity: [opacity, opacity * 1.8, opacity],
          }}
          transition={{
            duration: p.duration,
            delay: p.delay,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />
      ))}
    </div>
  );
}
