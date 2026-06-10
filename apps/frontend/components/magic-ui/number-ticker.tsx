"use client";

/**
 * NumberTicker — Magic UI inline
 * Contador que anima de 0 até o valor-alvo quando entra no viewport.
 * Inspirado em: https://magicui.design/docs/components/number-ticker
 */

import { useEffect, useRef, useState } from "react";
import { useInView } from "framer-motion";
import { cn } from "@/lib/utils";

interface NumberTickerProps {
  value: number;
  /** Duração da animação em ms. Padrão: 1500 */
  duration?: number;
  /** Prefixo (ex: "R$") */
  prefix?: string;
  /** Sufixo (ex: "+", "%") */
  suffix?: string;
  className?: string;
}

export function NumberTicker({
  value,
  duration = 1500,
  prefix = "",
  suffix = "",
  className,
}: NumberTickerProps) {
  const ref = useRef<HTMLSpanElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-10% 0px" });
  const [displayed, setDisplayed] = useState(0);
  const started = useRef(false);

  useEffect(() => {
    if (!isInView || started.current) return;
    started.current = true;

    const startTime = performance.now();

    function step(now: number) {
      const elapsed = now - startTime;
      const progress = Math.min(elapsed / duration, 1);
      // Ease-out cubic
      const eased = 1 - Math.pow(1 - progress, 3);
      setDisplayed(Math.round(eased * value));

      if (progress < 1) requestAnimationFrame(step);
    }

    requestAnimationFrame(step);
  }, [isInView, value, duration]);

  return (
    <span ref={ref} className={cn("tabular-nums", className)}>
      {prefix}
      {displayed.toLocaleString("pt-BR")}
      {suffix}
    </span>
  );
}
