"use client";

/**
 * Particles — Magic UI inline
 * Fundo de partículas flutuantes. Posições vêm de um PRNG semeado para que
 * servidor e cliente gerem o mesmo layout (sem mismatch de hidratação).
 * Inspirado em: https://magicui.design/docs/components/particles
 */

import { useMemo } from "react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

// mulberry32 — PRNG determinístico e barato
function mulberry32(seed: number) {
  return () => {
    seed |= 0;
    seed = (seed + 0x6d2b79f5) | 0;
    let t = Math.imul(seed ^ (seed >>> 15), 1 | seed);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

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
  const particles = useMemo<Particle[]>(() => {
    const rand = mulberry32(count * 9301 + 49297);
    return Array.from({ length: count }, (_, i) => ({
      id: i,
      x: rand() * 100,
      y: rand() * 100,
      size: rand() * 4 + 2, // 2–6px
      duration: rand() * 4 + 3, // 3–7s
      delay: rand() * 3, // 0–3s
    }));
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
