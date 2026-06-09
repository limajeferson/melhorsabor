"use client";

import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion, type Variants } from "framer-motion";
import { ChefHat, ArrowRight, ArrowLeft, Check, Mail, Loader2 } from "lucide-react";
import Link from "next/link";
import { AnalyticsEvent, track } from "@/lib/analytics";
import { supabase } from "@/lib/supabase";

// ---------------------------------------------------------------------------
// Tipos
// ---------------------------------------------------------------------------
type OptionId = string;

interface Option {
  id: OptionId;
  label: string;
  emoji: string;
  description?: string;
}

interface StepBase {
  id: string;
  question: string;
  subtitle?: string;
  section?: string; // cabeçalho de seção mostrado antes da pergunta
}

interface SingleStep extends StepBase {
  type: "single";
  options: Option[];
}

interface MultiStep extends StepBase {
  type: "multi";
  options: Option[];
}

type Step = SingleStep | MultiStep;

interface Answers {
  [stepId: string]: OptionId | OptionId[]; // single = string, multi = string[]
}

// ---------------------------------------------------------------------------
// Definição dos passos (Etapa 1 + Etapa 2)
// ---------------------------------------------------------------------------
const STEPS: Step[] = [
  // — Etapa 1: Qualificação inicial —
  {
    id: "objetivo",
    type: "single",
    section: "Etapa 1 — Seus objetivos",
    question: "Qual é o seu principal objetivo?",
    subtitle: "Isso define as receitas e dicas que vamos mostrar pra você.",
    options: [
      { id: "emagrecer", label: "Emagrecer", emoji: "🔥", description: "Reduzir peso com saúde" },
      { id: "massa", label: "Ganhar massa", emoji: "💪", description: "Crescimento muscular" },
      { id: "manter", label: "Manter o peso", emoji: "⚖️", description: "Equilíbrio e consistência" },
      { id: "energia", label: "Mais energia", emoji: "⚡", description: "Foco e disposição no dia" },
      { id: "saude", label: "Saúde preventiva", emoji: "🩺", description: "Reduzir riscos e melhorar exames" },
    ],
  },
  {
    id: "academia",
    type: "single",
    question: "Você tem acesso a uma academia ou espaço para treino?",
    subtitle: "Vamos adaptar as receitas ao seu nível de atividade física.",
    options: [
      { id: "sim", label: "Sim, treino regularmente", emoji: "🏋️" },
      { id: "as_vezes", label: "Às vezes", emoji: "🚶" },
      { id: "nao", label: "Não, fico em casa", emoji: "🏠" },
    ],
  },
  {
    id: "cozinha",
    type: "single",
    question: "Você consegue cozinhar em casa?",
    subtitle: "Isso define a complexidade das receitas que vamos sugerir.",
    options: [
      { id: "sempre", label: "Sim, cozinho sempre", emoji: "👨‍🍳" },
      { id: "as_vezes", label: "Às vezes, quando dá", emoji: "🍳" },
      { id: "nao", label: "Raramente ou nunca", emoji: "🍱" },
    ],
  },
  {
    id: "refeicao",
    type: "single",
    question: "Como você prefere se alimentar?",
    subtitle: "Sem julgamento — só queremos entregar o mais útil pra você.",
    options: [
      { id: "casa", label: "Prefiro comer em casa", emoji: "🏡" },
      { id: "fora", label: "Como fora com frequência", emoji: "🍽️" },
      { id: "misto", label: "Mistura dos dois", emoji: "🔄" },
    ],
  },

  // — Etapa 2: Perfil físico —
  {
    id: "idade_range",
    type: "single",
    section: "Etapa 2 — Seu perfil físico",
    question: "Qual é a sua faixa etária?",
    subtitle: "As necessidades nutricionais mudam com a idade.",
    options: [
      { id: "18-25", label: "18 – 25 anos", emoji: "🌱" },
      { id: "26-35", label: "26 – 35 anos", emoji: "🌿" },
      { id: "36-45", label: "36 – 45 anos", emoji: "🌳" },
      { id: "46+", label: "46 anos ou mais", emoji: "🍀" },
    ],
  },
  {
    id: "biotipo",
    type: "single",
    question: "Qual biotipo mais se aproxima do seu corpo?",
    subtitle: "Não existe certo ou errado — cada biotipo tem um metabolismo diferente.",
    options: [
      { id: "ectomorfo", label: "Ectomorfo", emoji: "🦴", description: "Corpo magro, dificuldade de ganhar massa" },
      { id: "mesomorfo", label: "Mesomorfo", emoji: "💪", description: "Corpo atlético, ganha e perde peso com facilidade" },
      { id: "endomorfo", label: "Endomorfo", emoji: "🌊", description: "Corpo mais robusto, tendência a acumular gordura" },
    ],
  },
  {
    id: "atividade",
    type: "single",
    question: "Qual é o seu nível de atividade física atual?",
    subtitle: "Considerando treinos, caminhadas e rotina diária.",
    options: [
      { id: "sedentario", label: "Sedentário", emoji: "🛋️", description: "Pouco ou nenhum exercício" },
      { id: "leve", label: "Levemente ativo", emoji: "🚶", description: "Exercício leve 1–3x por semana" },
      { id: "moderado", label: "Moderadamente ativo", emoji: "🏃", description: "Exercício moderado 3–5x por semana" },
      { id: "intenso", label: "Muito ativo", emoji: "🏋️", description: "Treino intenso 6–7x por semana" },
    ],
  },
  {
    id: "restricoes",
    type: "multi",
    question: "Você tem alguma restrição alimentar?",
    subtitle: "Selecione todas que se aplicam. Vamos excluir ingredientes incompatíveis.",
    options: [
      { id: "nenhuma", label: "Nenhuma", emoji: "✅", description: "Como de tudo" },
      { id: "lactose", label: "Intolerância à lactose", emoji: "🥛" },
      { id: "gluten", label: "Intolerância ao glúten", emoji: "🌾" },
      { id: "vegetariano", label: "Vegetariano", emoji: "🥦" },
      { id: "vegano", label: "Vegano", emoji: "🌱" },
    ],
  },
];

const TOTAL_STEPS = STEPS.length;

// ---------------------------------------------------------------------------
// Animações
// ---------------------------------------------------------------------------
const slideVariants: Variants = {
  enter: (dir: number) => ({ x: dir > 0 ? 60 : -60, opacity: 0 }),
  center: {
    x: 0,
    opacity: 1,
    transition: { duration: 0.35, ease: [0.22, 1, 0.36, 1] },
  },
  exit: (dir: number) => ({
    x: dir > 0 ? -60 : 60,
    opacity: 0,
    transition: { duration: 0.25, ease: "easeIn" },
  }),
};

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------
function isAnswered(step: Step, answers: Answers): boolean {
  const val = answers[step.id];
  if (step.type === "multi") {
    return Array.isArray(val) && val.length > 0;
  }
  return typeof val === "string" && val.length > 0;
}

// ---------------------------------------------------------------------------
// Componente principal
// ---------------------------------------------------------------------------
export default function OnboardingPage() {
  const [currentStep, setCurrentStep] = useState(0);
  const [answers, setAnswers] = useState<Answers>({});
  const [direction, setDirection] = useState(1);

  // Phases: steps → auth → email-sent
  const [phase, setPhase] = useState<"steps" | "auth" | "email-sent">("steps");
  const [email, setEmail] = useState("");
  const [authLoading, setAuthLoading] = useState(false);
  const [authError, setAuthError] = useState("");
  const emailRef = useRef<HTMLInputElement>(null);

  const step = STEPS[currentStep];
  const progress = ((currentStep) / TOTAL_STEPS) * 100;
  const isLast = currentStep === TOTAL_STEPS - 1;
  const answered = step ? isAnswered(step, answers) : false;

  // Dispara evento de início na primeira renderização
  useEffect(() => {
    track(AnalyticsEvent.OnboardingStarted);
  }, []);

  // Foca o input de email quando entra na fase auth
  useEffect(() => {
    if (phase === "auth") emailRef.current?.focus();
  }, [phase]);

  // ----- Seleção de opção -----
  function selectOption(optionId: OptionId) {
    if (!step) return;

    if (step.type === "multi") {
      setAnswers((prev) => {
        const current = (prev[step.id] as OptionId[] | undefined) ?? [];

        // "nenhuma" é exclusivo
        if (optionId === "nenhuma") {
          return { ...prev, [step.id]: ["nenhuma"] };
        }
        // Se tinha "nenhuma", substitui
        const filtered = current.filter((id) => id !== "nenhuma");
        const already = filtered.includes(optionId);
        return {
          ...prev,
          [step.id]: already
            ? filtered.filter((id) => id !== optionId)
            : [...filtered, optionId],
        };
      });
    } else {
      setAnswers((prev) => ({ ...prev, [step.id]: optionId }));
    }
  }

  function isSelected(optionId: OptionId): boolean {
    if (!step) return false;
    const val = answers[step.id];
    if (step.type === "multi") return Array.isArray(val) && val.includes(optionId);
    return val === optionId;
  }

  // ----- Navegação -----
  function goNext() {
    if (!answered) return;

    track(AnalyticsEvent.OnboardingStepAnswered, {
      step_id: step.id,
      step_index: currentStep,
      answer: answers[step.id],
    });

    if (isLast) {
      // Salva respostas no localStorage para o callback pós-auth recuperar
      const finalAnswers = { ...answers };
      localStorage.setItem("onboarding_answers", JSON.stringify(finalAnswers));
      setPhase("auth");
      return;
    }

    setDirection(1);
    setCurrentStep((s) => s + 1);
  }

  function goBack() {
    if (currentStep === 0) return;
    setDirection(-1);
    setCurrentStep((s) => s - 1);
  }

  // ----- Auth: Magic Link -----
  async function sendMagicLink(e: React.FormEvent) {
    e.preventDefault();
    if (!email) return;

    setAuthLoading(true);
    setAuthError("");

    const redirectTo =
      typeof window !== "undefined"
        ? `${window.location.origin}/onboarding/callback`
        : "/onboarding/callback";

    const { error } = await supabase.auth.signInWithOtp({
      email,
      options: { emailRedirectTo: redirectTo },
    });

    setAuthLoading(false);

    if (error) {
      setAuthError("Não conseguimos enviar o e-mail. Tente novamente.");
      return;
    }

    track(AnalyticsEvent.OnboardingCompleted, {
      ...Object.fromEntries(
        Object.entries(answers).map(([k, v]) => [k, Array.isArray(v) ? v.join(",") : v])
      ),
    });

    setPhase("email-sent");
  }

  // ---------------------------------------------------------------------------
  // Render: Email enviado
  // ---------------------------------------------------------------------------
  if (phase === "email-sent") {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center px-4 bg-gradient-to-b from-white via-green-50/60 to-white">
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
          className="text-center max-w-sm"
        >
          <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <Mail className="w-10 h-10 text-green-600" />
          </div>
          <h1 className="text-2xl font-bold text-gray-900 mb-3">
            Verifique seu e-mail 📬
          </h1>
          <p className="text-gray-500 text-sm mb-6 leading-relaxed">
            Enviamos um link mágico para{" "}
            <strong className="text-gray-700">{email}</strong>. Clique nele para
            salvar seu perfil e começar a receber receitas personalizadas.
          </p>
          <p className="text-xs text-gray-400 leading-relaxed">
            Não encontrou? Verifique a pasta de spam.
          </p>
        </motion.div>
      </div>
    );
  }

  // ---------------------------------------------------------------------------
  // Render: Tela de criação de conta (auth)
  // ---------------------------------------------------------------------------
  if (phase === "auth") {
    return (
      <div className="min-h-screen flex flex-col bg-gradient-to-b from-white via-green-50/40 to-white">
        <header className="flex items-center justify-between px-6 py-5 max-w-2xl mx-auto w-full">
          <Link href="/" className="flex items-center gap-2 text-green-800 font-semibold text-sm">
            <ChefHat className="w-5 h-5" />
            MelhorSabor
          </Link>
        </header>

        {/* Barra de progresso — 100% */}
        <div className="w-full bg-gray-100 h-1">
          <div className="h-1 bg-green-600 w-full" />
        </div>

        <main className="flex-1 flex flex-col items-center justify-center px-4 py-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
            className="w-full max-w-sm"
          >
            <div className="mb-8 text-center">
              <div className="w-14 h-14 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-5">
                <Check className="w-7 h-7 text-green-600" />
              </div>
              <h2 className="text-2xl font-bold text-gray-900 mb-2">
                Perfil montado! 🌿
              </h2>
              <p className="text-gray-500 text-sm leading-relaxed">
                Insira seu e-mail para salvar suas preferências e receber
                receitas personalizadas.
              </p>
            </div>

            <form onSubmit={sendMagicLink} className="flex flex-col gap-4">
              <input
                ref={emailRef}
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="seu@email.com"
                className="w-full px-5 py-3.5 rounded-full border border-gray-200 bg-white text-gray-900 placeholder-gray-400 text-sm focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent shadow-sm transition"
              />

              {authError && (
                <p className="text-xs text-red-500 text-center">{authError}</p>
              )}

              <button
                type="submit"
                disabled={authLoading || !email}
                className="flex items-center justify-center gap-2 bg-green-700 hover:bg-green-800 disabled:bg-gray-200 disabled:text-gray-400 text-white px-6 py-3.5 rounded-full text-sm font-semibold transition"
              >
                {authLoading ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    Enviando…
                  </>
                ) : (
                  <>
                    Salvar perfil
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>
            </form>

            <p className="text-center text-xs text-gray-400 mt-5 leading-relaxed">
              Vamos te enviar um link de acesso por e-mail. Sem senha, sem spam.
            </p>

            <button
              onClick={() => setPhase("steps")}
              className="w-full mt-3 text-xs text-gray-400 hover:text-gray-600 transition text-center"
            >
              ← Voltar e revisar respostas
            </button>
          </motion.div>
        </main>
      </div>
    );
  }

  // ---------------------------------------------------------------------------
  // Render: Steps do onboarding
  // ---------------------------------------------------------------------------
  const showSectionHeader =
    step?.section !== undefined &&
    (currentStep === 0 || STEPS[currentStep - 1].section !== step.section);

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-b from-white via-green-50/40 to-white">
      {/* Header */}
      <header className="flex items-center justify-between px-6 py-5 max-w-2xl mx-auto w-full">
        <Link href="/" className="flex items-center gap-2 text-green-800 font-semibold text-sm">
          <ChefHat className="w-5 h-5" />
          MelhorSabor
        </Link>
        <span className="text-xs text-gray-400">
          {currentStep + 1} de {TOTAL_STEPS}
        </span>
      </header>

      {/* Barra de progresso */}
      <div className="w-full bg-gray-100 h-1">
        <motion.div
          className="h-1 bg-green-600"
          initial={false}
          animate={{ width: `${progress}%` }}
          transition={{ duration: 0.4, ease: "easeOut" }}
        />
      </div>

      {/* Conteúdo */}
      <main className="flex-1 flex flex-col items-center justify-center px-4 py-10">
        <div className="w-full max-w-lg">

          {/* Cabeçalho de seção (aparece na primeira pergunta de cada etapa) */}
          <AnimatePresence>
            {showSectionHeader && (
              <motion.div
                key={`section-${step.section}`}
                initial={{ opacity: 0, y: -8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.3 }}
                className="mb-6 text-center"
              >
                <span className="inline-block px-4 py-1.5 rounded-full text-xs font-semibold tracking-widest uppercase bg-green-100 text-green-800 border border-green-200">
                  {step.section}
                </span>
              </motion.div>
            )}
          </AnimatePresence>

          <AnimatePresence mode="wait" custom={direction}>
            <motion.div
              key={step.id}
              custom={direction}
              variants={slideVariants}
              initial="enter"
              animate="center"
              exit="exit"
            >
              {/* Pergunta */}
              <div className="mb-8 text-center">
                <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-2">
                  {step.question}
                </h2>
                {step.subtitle && (
                  <p className="text-gray-500 text-sm">{step.subtitle}</p>
                )}
                {step.type === "multi" && (
                  <p className="text-xs text-green-700 mt-1 font-medium">
                    Pode selecionar mais de uma opção
                  </p>
                )}
              </div>

              {/* Opções */}
              <div className="flex flex-col gap-3">
                {step.options.map((option) => {
                  const sel = isSelected(option.id);
                  return (
                    <button
                      key={option.id}
                      onClick={() => selectOption(option.id)}
                      className={`flex items-center gap-4 px-5 py-4 rounded-2xl border-2 text-left transition-all duration-200 ${
                        sel
                          ? "border-green-600 bg-green-50 shadow-sm"
                          : "border-gray-200 bg-white hover:border-green-300 hover:bg-green-50/40"
                      }`}
                    >
                      <span className="text-2xl flex-shrink-0">{option.emoji}</span>
                      <div className="flex-1 min-w-0">
                        <span
                          className={`font-semibold text-sm block ${
                            sel ? "text-green-800" : "text-gray-800"
                          }`}
                        >
                          {option.label}
                        </span>
                        {option.description && (
                          <span className="text-xs text-gray-400 block mt-0.5">
                            {option.description}
                          </span>
                        )}
                      </div>
                      {sel && (
                        <div className="w-5 h-5 rounded-full bg-green-600 flex items-center justify-center flex-shrink-0">
                          <Check className="w-3 h-3 text-white" />
                        </div>
                      )}
                    </button>
                  );
                })}
              </div>
            </motion.div>
          </AnimatePresence>

          {/* Navegação */}
          <div className="flex items-center justify-between mt-8">
            <button
              onClick={goBack}
              disabled={currentStep === 0}
              className="flex items-center gap-2 text-sm text-gray-400 hover:text-gray-700 disabled:opacity-0 transition"
            >
              <ArrowLeft className="w-4 h-4" />
              Voltar
            </button>

            <button
              onClick={goNext}
              disabled={!answered}
              className="flex items-center gap-2 bg-green-700 hover:bg-green-800 disabled:bg-gray-200 disabled:text-gray-400 text-white px-6 py-3 rounded-full text-sm font-semibold transition"
            >
              {isLast ? "Finalizar" : "Continuar"}
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>

          {/* Disclaimer legal */}
          <p className="text-center text-xs text-gray-400 mt-6 leading-relaxed max-w-sm mx-auto">
            As recomendações do MelhorSabor têm caráter informativo e não substituem
            orientação de nutricionista, médico ou personal trainer.
          </p>
        </div>
      </main>
    </div>
  );
}
