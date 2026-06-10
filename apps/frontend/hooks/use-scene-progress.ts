/**
 * useSceneProgress
 *
 * Extrai um progresso normalizado [0, 1] para uma cena específica
 * a partir do scrollYProgress global do wrapper de scroll-telling.
 *
 * Uso:
 *   const scene2 = useSceneProgress(scrollYProgress, 0.25, 0.50);
 *   // scene2 === 0 quando scroll está antes de 25%
 *   // scene2 === 1 quando scroll está após 50%
 */

import { useTransform, type MotionValue } from "framer-motion";

export function useSceneProgress(
  globalProgress: MotionValue<number>,
  start: number,
  end: number
): MotionValue<number> {
  return useTransform(globalProgress, [start, end], [0, 1], { clamp: true });
}

/**
 * useSceneOpacity
 *
 * Envelope completo: fade-in rápido, sustain, fade-out rápido.
 * Garante que cada cena não "sangre" visualmente para vizinhas.
 *
 * @param globalProgress  MotionValue global do useScroll
 * @param start           início da cena (ex: 0.25)
 * @param end             fim da cena (ex: 0.50)
 * @param fadeRatio       quanto do intervalo é gasto em fade (padrão: 0.12 = 12%)
 */
export function useSceneOpacity(
  globalProgress: MotionValue<number>,
  start: number,
  end: number,
  fadeRatio = 0.12
): MotionValue<number> {
  const span = end - start;
  const fadeIn = start + span * fadeRatio;
  const fadeOut = end - span * fadeRatio;

  return useTransform(
    globalProgress,
    [start, fadeIn, fadeOut, end],
    [0, 1, 1, 0],
    { clamp: true }
  );
}
