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
 * @param options.fadeRatio  quanto do intervalo é gasto em fade (padrão: 0.12 = 12%)
 * @param options.fadeIn     false para a cena já nascer visível (primeira cena)
 * @param options.fadeOut    false para a cena permanecer visível no fim (última cena)
 */
export function useSceneOpacity(
  globalProgress: MotionValue<number>,
  start: number,
  end: number,
  options: { fadeRatio?: number; fadeIn?: boolean; fadeOut?: boolean } = {}
): MotionValue<number> {
  const { fadeRatio = 0.12, fadeIn = true, fadeOut = true } = options;
  const span = end - start;
  const fadeInEnd = start + span * fadeRatio;
  const fadeOutStart = end - span * fadeRatio;

  const input: number[] = [];
  const output: number[] = [];

  input.push(start);
  output.push(fadeIn ? 0 : 1);
  if (fadeIn) {
    input.push(fadeInEnd);
    output.push(1);
  }
  if (fadeOut) {
    input.push(fadeOutStart);
    output.push(1);
  }
  input.push(end);
  output.push(fadeOut ? 0 : 1);

  return useTransform(globalProgress, input, output, { clamp: true });
}
