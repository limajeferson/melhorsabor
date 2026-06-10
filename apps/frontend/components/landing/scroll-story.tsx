"use client";

/**
 * ScrollStory — Landing Page Scroll-Telling
 *
 * Experiência imersiva estilo Apple: wrapper alto (400vh) com um container
 * sticky que exibe 4 cenas controladas por useScroll + useTransform.
 *
 * Cena 1 (0–25%):  Hero — atletas saem para as bordas
 * Cena 2 (25–50%): Troca do Prato — hambúrguer gira e cede lugar à salada
 * Cena 3 (50–75%): Comunidade — feed cards sobem com depoimentos
 * Cena 4 (75–100%): Gamificação + CTA — trilha de badges + waitlist
 *
 * Performance:
 * - Todos os valores animados são MotionValues (zero re-renders React)
 * - `useReducedMotion` desabilita animações de scroll para a11y
 */

import { useRef } from "react";
import {
  motion,
  useScroll,
  useTransform,
  useSpring,
  useReducedMotion,
} from "framer-motion";
import {
  Dumbbell,
  Pizza,
  Salad,
  Sprout,
  Leaf,
  TreePine,
  Apple,
  ArrowRight,
  Flame,
  Heart,
  Star,
  ChefHat,
  Zap,
} from "lucide-react";
import Link from "next/link";
import { AnimatedGradientText } from "@/components/magic-ui/animated-gradient-text";
import { ShimmerButton } from "@/components/magic-ui/shimmer-button";
import { NumberTicker } from "@/components/magic-ui/number-ticker";
import { MagicCard } from "@/components/magic-ui/magic-card";
import { BorderBeam } from "@/components/magic-ui/border-beam";
import { Particles } from "@/components/magic-ui/particles";
import { WaitlistForm } from "@/components/waitlist-form";
import { useSceneProgress, useSceneOpacity } from "@/hooks/use-scene-progress";

// ---------------------------------------------------------------------------
// Dados estáticos
// ---------------------------------------------------------------------------
const TESTIMONIALS = [
  {
    name: "Ana C.",
    role: "Nutricionista",
    text: "Perdi 8kg em 3 meses com receitas que minha família inteira amou. Nunca me senti privada.",
    color: "bg-tomato",
    icon: Heart,
  },
  {
    name: "Marcos T.",
    role: "Desenvolvedor",
    text: "Meu foco no trabalho melhorou absurdamente. Não sabia que a alimentação impactava tanto.",
    color: "bg-sage",
    icon: Zap,
  },
  {
    name: "Carla M.",
    role: "Mãe de 2 filhos",
    text: "Finalmente uma plataforma que entende minha rotina corrida. As receitas levam 20 minutos!",
    color: "bg-apricot",
    icon: Star,
  },
];

const JOURNEY_PHASES = [
  { id: "semente", label: "Semente", icon: Sprout, color: "text-sage", bg: "bg-sage/20" },
  { id: "broto", label: "Broto", icon: Leaf, color: "text-emerald-500", bg: "bg-emerald-100" },
  { id: "raiz", label: "Raiz", icon: TreePine, color: "text-teal-600", bg: "bg-teal-100" },
  { id: "colheita", label: "Colheita", icon: Apple, color: "text-tomato", bg: "bg-tomato/10" },
];

// ---------------------------------------------------------------------------
// Componente principal
// ---------------------------------------------------------------------------
export function ScrollStory() {
  const wrapperRef = useRef<HTMLDivElement>(null);
  const prefersReduced = useReducedMotion();

  // Rastreia o wrapper inteiro no viewport
  const { scrollYProgress } = useScroll({
    target: wrapperRef,
    offset: ["start start", "end end"],
  });

  // Spring leve — sensação Apple: suave mas responsivo
  const smooth = useSpring(scrollYProgress, {
    stiffness: 70,
    damping: 22,
    restDelta: 0.001,
  });

  const progress = prefersReduced ? scrollYProgress : smooth;

  // ── Progresso por cena ────────────────────────────────────────────────────
  const scene1 = useSceneProgress(progress, 0.0, 0.25);
  const scene2 = useSceneProgress(progress, 0.25, 0.5);
  const scene3 = useSceneProgress(progress, 0.5, 0.75);
  const scene4 = useSceneProgress(progress, 0.75, 1.0);

  // ── Opacidades (envelope fade-in/out por cena) ────────────────────────────
  const opacity1 = useSceneOpacity(progress, 0.0, 0.25);
  const opacity2 = useSceneOpacity(progress, 0.25, 0.5);
  const opacity3 = useSceneOpacity(progress, 0.5, 0.75);
  const opacity4 = useSceneOpacity(progress, 0.75, 1.0);

  // ── Cena 1: atletas saem para as bordas ───────────────────────────────────
  const athleteLeftX  = useTransform(scene1, [0, 1], ["0vw", "-50vw"]);
  const athleteRightX = useTransform(scene1, [0, 1], ["0vw", "50vw"]);
  const athleteOpacity = useTransform(scene1, [0, 0.6, 1], [1, 1, 0]);
  const titleY = useTransform(scene1, [0, 1], ["0px", "-30px"]);

  // ── Cena 2: troca do prato ────────────────────────────────────────────────
  const unhealthyRotate  = useTransform(scene2, [0, 0.7, 1], [0, 180, 180]);
  const unhealthyOpacity = useTransform(scene2, [0, 0.1, 0.5, 0.75], [0, 1, 1, 0]);
  const healthyOpacity   = useTransform(scene2, [0.5, 0.8, 1], [0, 0, 1]);
  const healthyScale     = useTransform(scene2, [0.6, 1], [0.7, 1]);
  const scene2Title      = useTransform(scene2, [0, 0.15], [20, 0]);

  // ── Cena 3: feed de comunidade ────────────────────────────────────────────
  const card1Y  = useTransform(scene3, [0.0, 0.4], ["90px", "0px"]);
  const card2Y  = useTransform(scene3, [0.1, 0.5], ["90px", "0px"]);
  const card3Y  = useTransform(scene3, [0.2, 0.6], ["90px", "0px"]);
  const card1Op = useTransform(scene3, [0.0, 0.3], [0, 1]);
  const card2Op = useTransform(scene3, [0.1, 0.4], [0, 1]);
  const card3Op = useTransform(scene3, [0.2, 0.5], [0, 1]);

  // ── Cena 4: gamificação ───────────────────────────────────────────────────
  const trailWidth   = useTransform(scene4, [0, 0.8], ["0%", "100%"]);
  const badge1Scale  = useTransform(scene4, [0.0, 0.2], [0.5, 1]);
  const badge2Scale  = useTransform(scene4, [0.2, 0.4], [0.5, 1]);
  const badge3Scale  = useTransform(scene4, [0.4, 0.6], [0.5, 1]);
  const badge4Scale  = useTransform(scene4, [0.6, 0.8], [0.5, 1]);
  const ctaY         = useTransform(scene4, [0.6, 1.0], ["30px", "0px"]);
  const ctaOpacity   = useTransform(scene4, [0.6, 0.85], [0, 1]);

  // ── Cor de fundo do container (transição entre cenas) ─────────────────────
  const bgColor = useTransform(
    progress,
    [0, 0.25, 0.5, 0.75, 1],
    ["#fffaf3", "#fffaf3", "#ffe8d6", "#fffaf3", "#f5ede3"]
  );

  return (
    <section aria-label="Apresentação MelhorSabor" className="relative">
      {/* ── Wrapper de scroll (cria a "altura" para o scroll-jacking) ── */}
      <div ref={wrapperRef} className="h-[400vh] max-md:h-[380vh]">
        {/* ── Container sticky ── */}
        <motion.div
          style={{ backgroundColor: bgColor }}
          className="sticky top-0 h-screen overflow-hidden flex flex-col items-center justify-center"
        >
          {/* ══════════════════════════════════════════════════════════════
              CENA 1 — Hero
          ══════════════════════════════════════════════════════════════ */}
          <motion.div
            style={{ opacity: opacity1 }}
            className="absolute inset-0 flex flex-col items-center justify-center px-4"
            aria-hidden={false}
          >
            {/* Blobs de fundo */}
            <div
              aria-hidden
              className="pointer-events-none absolute -top-32 -left-24 w-[480px] h-[480px] rounded-full bg-honey/30 blur-3xl"
            />
            <div
              aria-hidden
              className="pointer-events-none absolute -bottom-32 -right-24 w-[440px] h-[440px] rounded-full bg-apricot/25 blur-3xl"
            />

            {/* Atleta esquerdo */}
            <motion.div
              style={{ x: athleteLeftX, opacity: athleteOpacity }}
              className="absolute left-1/4 -translate-x-1/2"
              aria-hidden
            >
              <div className="w-24 h-24 md:w-36 md:h-36 rounded-full bg-tomato/10 border-2 border-tomato/20 flex items-center justify-center">
                <Dumbbell className="w-12 h-12 md:w-20 md:h-20 text-tomato/60" />
              </div>
            </motion.div>

            {/* Atleta direito */}
            <motion.div
              style={{ x: athleteRightX, opacity: athleteOpacity }}
              className="absolute right-1/4 translate-x-1/2"
              aria-hidden
            >
              <div className="w-24 h-24 md:w-36 md:h-36 rounded-full bg-sage/20 border-2 border-sage/30 flex items-center justify-center">
                <Flame className="w-12 h-12 md:w-20 md:h-20 text-sage/70" />
              </div>
            </motion.div>

            {/* Texto central */}
            <motion.div
              style={{ y: titleY }}
              className="relative z-10 flex flex-col items-center text-center max-w-2xl"
            >
              {/* Chip badge */}
              <motion.div
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.2 }}
                className="flex items-center gap-2 mb-6 px-4 py-1.5 rounded-full bg-white/70 backdrop-blur border border-peach text-xs font-semibold text-tomato uppercase tracking-wider"
              >
                <ChefHat className="w-3.5 h-3.5" />
                Performance humana via nutrição
              </motion.div>

              <motion.h2
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.7, delay: 0.35, ease: [0.22, 1, 0.36, 1] }}
                className="text-4xl md:text-6xl font-extrabold tracking-tight text-gray-900 leading-[1.08] mb-4"
              >
                O alimento é o{" "}
                <AnimatedGradientText className="text-4xl md:text-6xl font-extrabold">
                  código-fonte
                </AnimatedGradientText>
                <br className="hidden sm:block" />
                da sua performance.
              </motion.h2>

              <motion.p
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.5 }}
                className="text-lg md:text-xl text-warm-gray max-w-lg mb-10 leading-relaxed"
              >
                Diagnóstico gratuito com IA · receitas personalizadas · comunidade de apoio.
                Tudo em um só lugar.
              </motion.p>

              <motion.div
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.65 }}
                className="flex flex-col sm:flex-row gap-4 items-center"
              >
                <ShimmerButton href="/onboarding">
                  Fazer o teste gratuito
                  <ArrowRight className="w-4 h-4" />
                </ShimmerButton>
                <a
                  href="#waitlist"
                  className="text-sm font-semibold text-warm-gray hover:text-tomato transition-colors underline underline-offset-4"
                >
                  Entrar na lista de espera
                </a>
              </motion.div>

              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.85 }}
                className="mt-5 text-xs text-warm-gray/70"
              >
                Leva 2 minutos · 100% gratuito · Sem cartão de crédito
              </motion.p>
            </motion.div>

            {/* Scroll hint */}
            <motion.div
              style={{ opacity: useTransform(scene1, [0, 0.3], [1, 0]) }}
              className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-1"
              aria-hidden
            >
              <span className="text-xs text-warm-gray/50 font-medium">Role para explorar</span>
              <motion.div
                animate={{ y: [0, 6, 0] }}
                transition={{ duration: 1.2, repeat: Infinity, ease: "easeInOut" }}
                className="w-5 h-8 border-2 border-warm-gray/30 rounded-full flex items-start justify-center pt-1"
              >
                <div className="w-1 h-2 bg-warm-gray/40 rounded-full" />
              </motion.div>
            </motion.div>
          </motion.div>

          {/* ══════════════════════════════════════════════════════════════
              CENA 2 — Troca do Prato
          ══════════════════════════════════════════════════════════════ */}
          <motion.div
            style={{ opacity: opacity2 }}
            className="absolute inset-0 flex flex-col items-center justify-center px-4 gap-10"
          >
            <motion.div style={{ y: scene2Title }}>
              <h2 className="text-3xl md:text-5xl font-extrabold text-center text-gray-900 max-w-lg leading-tight">
                Uma troca simples.{" "}
                <AnimatedGradientText className="text-3xl md:text-5xl font-extrabold">
                  Resultados reais.
                </AnimatedGradientText>
              </h2>
              <p className="text-center text-warm-gray mt-3 text-lg max-w-md mx-auto">
                Não é dieta. É aprender a comer com inteligência.
              </p>
            </motion.div>

            {/* Ícones sobrepostos */}
            <div className="relative w-48 h-48 md:w-64 md:h-64 flex items-center justify-center">
              {/* Prato não saudável */}
              <motion.div
                style={{
                  rotate: unhealthyRotate,
                  opacity: unhealthyOpacity,
                }}
                className="absolute flex flex-col items-center gap-3"
              >
                <div className="w-36 h-36 md:w-48 md:h-48 rounded-full bg-red-50 border-4 border-red-100 flex items-center justify-center shadow-xl">
                  <Pizza className="w-20 h-20 md:w-28 md:h-28 text-red-400" />
                </div>
                <span className="text-sm font-semibold text-red-400 tracking-wide">
                  Alimentação industrializada
                </span>
              </motion.div>

              {/* Prato saudável */}
              <motion.div
                style={{ opacity: healthyOpacity, scale: healthyScale }}
                className="absolute flex flex-col items-center gap-3"
              >
                <div className="w-36 h-36 md:w-48 md:h-48 rounded-full bg-sage/20 border-4 border-sage/40 flex items-center justify-center shadow-xl">
                  <Salad className="w-20 h-20 md:w-28 md:h-28 text-sage" />
                </div>
                <span className="text-sm font-semibold text-sage tracking-wide">
                  Nutrição que nutre de verdade
                </span>
              </motion.div>
            </div>

            {/* Stats horizontais */}
            <motion.div
              style={{ opacity: healthyOpacity }}
              className="flex gap-8 md:gap-16"
            >
              {[
                { value: 91, suffix: "%", label: "relatam mais energia" },
                { value: 78, suffix: "%", label: "dormem melhor" },
                { value: 84, suffix: "%", label: "perdem peso sem dieta" },
              ].map((stat) => (
                <div key={stat.label} className="text-center">
                  <div className="text-3xl md:text-4xl font-extrabold text-tomato">
                    <NumberTicker value={stat.value} suffix={stat.suffix} />
                  </div>
                  <div className="text-xs text-warm-gray mt-1 max-w-[80px] leading-tight">
                    {stat.label}
                  </div>
                </div>
              ))}
            </motion.div>
          </motion.div>

          {/* ══════════════════════════════════════════════════════════════
              CENA 3 — Comunidade
          ══════════════════════════════════════════════════════════════ */}
          <motion.div
            style={{ opacity: opacity3 }}
            className="absolute inset-0 flex flex-col items-center justify-center px-4 gap-6"
          >
            <motion.div
              style={{ opacity: useTransform(scene3, [0, 0.2], [0, 1]), y: useTransform(scene3, [0, 0.2], [20, 0]) }}
            >
              <h2 className="text-3xl md:text-4xl font-extrabold text-center text-gray-900 max-w-lg">
                Você não caminha{" "}
                <AnimatedGradientText className="text-3xl md:text-4xl font-extrabold">
                  sozinho.
                </AnimatedGradientText>
              </h2>
              <p className="text-center text-warm-gray mt-2 text-base max-w-sm mx-auto">
                Uma comunidade que se apoia — sem julgamentos, sem pressão.
              </p>
            </motion.div>

            {/* Feed de depoimentos */}
            <div className="w-full max-w-lg flex flex-col gap-3">
              {TESTIMONIALS.map((t, i) => {
                const yValues = [card1Y, card2Y, card3Y];
                const opValues = [card1Op, card2Op, card3Op];
                const Icon = t.icon;

                return (
                  <motion.div
                    key={t.name}
                    style={{ y: yValues[i], opacity: opValues[i] }}
                  >
                    <MagicCard className="relative overflow-hidden bg-white rounded-2xl border border-peach/60 p-4 flex gap-3 items-start shadow-sm">
                      <BorderBeam duration={4 + i} colorFrom="#f47b3a" colorTo="#ffd27d" />
                      <div
                        className={`w-10 h-10 rounded-full ${t.color} flex items-center justify-center flex-shrink-0`}
                      >
                        <Icon className="w-5 h-5 text-white" />
                      </div>
                      <div className="min-w-0">
                        <div className="flex items-baseline gap-2">
                          <span className="font-bold text-sm text-gray-900">{t.name}</span>
                          <span className="text-xs text-warm-gray">{t.role}</span>
                        </div>
                        <p className="text-sm text-gray-600 mt-1 leading-relaxed">{t.text}</p>
                      </div>
                    </MagicCard>
                  </motion.div>
                );
              })}
            </div>
          </motion.div>

          {/* ══════════════════════════════════════════════════════════════
              CENA 4 — Gamificação + CTA
          ══════════════════════════════════════════════════════════════ */}
          <motion.div
            style={{ opacity: opacity4 }}
            className="absolute inset-0 flex flex-col items-center justify-center px-4 gap-8 overflow-hidden"
          >
            <Particles count={20} color="#ffd27d" opacity={0.35} />

            <motion.div style={{ opacity: useTransform(scene4, [0, 0.2], [0, 1]) }}>
              <h2 className="text-3xl md:text-4xl font-extrabold text-center text-gray-900 max-w-lg">
                Sua jornada tem{" "}
                <AnimatedGradientText className="text-3xl md:text-4xl font-extrabold">
                  fases.
                </AnimatedGradientText>{" "}
                Como na natureza.
              </h2>
            </motion.div>

            {/* Trilha de badges */}
            <div className="relative w-full max-w-sm md:max-w-md">
              {/* Barra de progresso */}
              <div className="absolute top-1/2 left-0 w-full h-1.5 bg-nude rounded-full -translate-y-1/2 z-0">
                <motion.div
                  style={{ width: trailWidth }}
                  className="h-full bg-gradient-to-r from-sage via-tomato to-honey rounded-full"
                />
              </div>

              {/* Ícones dos badges */}
              <div className="relative z-10 flex justify-between">
                {JOURNEY_PHASES.map((phase, i) => {
                  const scales = [badge1Scale, badge2Scale, badge3Scale, badge4Scale];
                  const Icon = phase.icon;

                  return (
                    <motion.div
                      key={phase.id}
                      style={{ scale: scales[i] }}
                      className="flex flex-col items-center gap-1.5"
                    >
                      <div
                        className={`w-12 h-12 rounded-full ${phase.bg} border-2 border-white shadow-md flex items-center justify-center`}
                      >
                        <Icon className={`w-6 h-6 ${phase.color}`} />
                      </div>
                      <span className="text-xs font-semibold text-gray-700">
                        {phase.label}
                      </span>
                    </motion.div>
                  );
                })}
              </div>
            </div>

            {/* CTA + Waitlist */}
            <motion.div
              style={{ y: ctaY, opacity: ctaOpacity }}
              className="flex flex-col items-center gap-6 w-full max-w-sm"
            >
              <ShimmerButton href="/onboarding" className="w-full justify-center text-base py-4">
                Descubra seu perfil — Teste gratuito
                <ArrowRight className="w-5 h-5" />
              </ShimmerButton>

              {/* Divider */}
              <div className="flex items-center gap-3 w-full">
                <div className="flex-1 h-px bg-peach" />
                <span className="text-xs text-warm-gray">ou</span>
                <div className="flex-1 h-px bg-peach" />
              </div>

              {/* Waitlist */}
              <div id="waitlist" className="w-full space-y-3">
                <div className="text-center space-y-1">
                  <p className="text-xs font-bold text-paprika uppercase tracking-widest">
                    ⚡ Vagas limitadas por ciclo
                  </p>
                  <p className="text-xs text-warm-gray leading-relaxed max-w-xs mx-auto">
                    As janelas de inscrição são escassas. Quem entra primeiro tem acesso
                    vitalício às atualizações de cada nova fase.
                  </p>
                </div>
                <WaitlistForm />
              </div>

              {/* Social proof */}
              <div className="flex items-center gap-2 text-xs text-warm-gray">
                <div className="flex -space-x-1.5">
                  {["bg-tomato", "bg-sage", "bg-honey", "bg-apricot"].map((c, i) => (
                    <div
                      key={i}
                      className={`w-5 h-5 rounded-full ${c} border border-white`}
                    />
                  ))}
                </div>
                <span>
                  <NumberTicker value={847} className="font-bold text-gray-800" />
                  {" "}pessoas já na lista
                </span>
              </div>
            </motion.div>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}
