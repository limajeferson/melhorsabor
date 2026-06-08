"use client";

import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { ChefHat, ArrowRight, ArrowLeft, Check } from "lucide-react";
import Link from "next/link";

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

interface Step {
  id: string;
  question: string;
  subtitle?: string;
  options: Option[];
}

interface Answers {
  [stepId: string]: OptionId;
}

// ---------------------------------------------------------------------------
// Dados das perguntas (baseado em Product_Vision_Notes.md)
// ---------------------------------------------------------------------------
const STEPS: Step[] = [
  {
    id: "objetivo",
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
    question: "Como você prefere se alimentar?",
    subtitle: "Sem julgamento — só queremos entregar o mais útil pra você.",
    options: [
      { id: "casa", label: "Prefiro comer em casa", emoji: "🏡" },
      { id: "fora", label: "Como fora com frequência", emoji: "🍽️" },
      { id: "misto", label: "Mistura dos dois", emoji: "🔄" },
    ],
  },
];

// ---------------------------------------------------------------------------
// Animações
// ---------------------------------------------------------------------------
const slideVariants = {
  enter: (dir: number) => ({
    x: dir > 0 ? 60 : -60,
    opacity: 0,
  }),
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
// Componente
// ---------------------------------------------------------------------------
export default function OnboardingPage() {
  const [currentStep, setCurrentStep] = useState(0);
  const [answers, setAnswers] = useState<Answers>({});
  const [direction, setDirection] = useState(1);
  const [completed, setCompleted] = useState(false);

  const step = STEPS[currentStep];
  const progress = ((currentStep) / STEPS.length) * 100;
  const selectedOption = answers[step?.id];
  const isLast = currentStep === STEPS.length - 1;

  function selectOption(optionId: OptionId) {
    setAnswers((prev) => ({ ...prev, [step.id]: optionId }));
  }

  function goNext() {
    if (!selectedOption) return;

    if (isLast) {
      setCompleted(true);
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

  // ---- Tela de conclusão ----
  if (completed) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center px-4 bg-gradient-to-b from-white via-green-50/60 to-white">
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
          className="text-center max-w-sm"
        >
          <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <Check className="w-10 h-10 text-green-600" />
          </div>
          <h1 className="text-2xl font-bold text-gray-900 mb-3">
            Perfil criado! 🌿
          </h1>
          <p className="text-gray-500 text-sm mb-8 leading-relaxed">
            Em breve você vai receber receitas e dicas personalizadas para o seu
            objetivo. Fique de olho no e-mail!
          </p>
          <Link
            href="/"
            className="inline-flex items-center gap-2 bg-green-700 hover:bg-green-800 text-white px-6 py-3 rounded-full text-sm font-semibold transition"
          >
            Voltar para o início
          </Link>
        </motion.div>
      </div>
    );
  }

  // ---- Tela de pergunta ----
  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-b from-white via-green-50/40 to-white">
      {/* Header */}
      <header className="flex items-center justify-between px-6 py-5 max-w-2xl mx-auto w-full">
        <Link href="/" className="flex items-center gap-2 text-green-800 font-semibold text-sm">
          <ChefHat className="w-5 h-5" />
          MelhorSabor
        </Link>
        <span className="text-xs text-gray-400">
          {currentStep + 1} de {STEPS.length}
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
              </div>

              {/* Opções */}
              <div className="flex flex-col gap-3">
                {step.options.map((option) => {
                  const isSelected = selectedOption === option.id;
                  return (
                    <button
                      key={option.id}
                      onClick={() => selectOption(option.id)}
                      className={`flex items-center gap-4 px-5 py-4 rounded-2xl border-2 text-left transition-all duration-200 ${
                        isSelected
                          ? "border-green-600 bg-green-50 shadow-sm"
                          : "border-gray-200 bg-white hover:border-green-300 hover:bg-green-50/40"
                      }`}
                    >
                      <span className="text-2xl flex-shrink-0">{option.emoji}</span>
                      <div className="flex-1 min-w-0">
                        <span
                          className={`font-semibold text-sm block ${
                            isSelected ? "text-green-800" : "text-gray-800"
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
                      {isSelected && (
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
              disabled={!selectedOption}
              className="flex items-center gap-2 bg-green-700 hover:bg-green-800 disabled:bg-gray-200 disabled:text-gray-400 text-white px-6 py-3 rounded-full text-sm font-semibold transition"
            >
              {isLast ? "Concluir" : "Continuar"}
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
