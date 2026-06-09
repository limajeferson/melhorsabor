"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { AnimatePresence, motion, type Variants } from "framer-motion";
import {
  ChefHat,
  ArrowRight,
  ArrowLeft,
  Check,
  Mail,
  Loader2,
  HeartPulse,
  Gift,
  Users,
  Sparkles,
  ShieldCheck,
} from "lucide-react";
import Link from "next/link";
import { AnalyticsEvent, track } from "@/lib/analytics";
import { supabase } from "@/lib/supabase";
import {
  PLANS,
  type Plan,
  brl,
  monthlyEquivalent,
  discountPercent,
  deriveBonus,
} from "@/lib/offer";

// ---------------------------------------------------------------------------
// Tipos
// ---------------------------------------------------------------------------
type OptionId = string;

interface Option {
  id: OptionId;
  label: string;
  description?: string; // linha de apoio abaixo do label
  legend?: string; // legenda discreta (ex.: nome técnico do biotipo)
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

interface NoticeStep extends StepBase {
  type: "notice"; // tela informativa, não exige resposta
  body: string;
}

type Step = SingleStep | MultiStep | NoticeStep;

interface Answers {
  [stepId: string]: OptionId | OptionId[]; // single = string, multi = string[]
}

// ---------------------------------------------------------------------------
// Blocos de perguntas
//
// O onboarding é montado dinamicamente a partir das respostas (buildSteps).
// Isso permite segmentar o fluxo por público (você / casa / ambos), ramificar
// por atividade física e inserir avisos contextuais sem inflar uma lista fixa.
// ---------------------------------------------------------------------------

// — Pergunta de entrada: para quem é a jornada —
const AUDIENCE_STEP: SingleStep = {
  id: "publico",
  type: "single",
  section: "Vamos te conhecer",
  question: "Para quem você quer melhorar a alimentação?",
  subtitle:
    "Responda com sinceridade — é assim que acertamos as recomendações certas pra você.",
  options: [
    {
      id: "para_si",
      label: "Para mim",
      description: "Quero cuidar da minha alimentação e dos meus objetivos",
    },
    {
      id: "para_casa",
      label: "Para minha casa e família",
      description: "Sou eu quem organiza as refeições da casa",
    },
    {
      id: "ambos",
      label: "Para mim e para a minha família",
      description: "Cuido de mim e também da rotina da casa",
    },
  ],
};

// — Bloco pessoal (público "para mim" e "ambos") —
const SELF_STEPS: Step[] = [
  {
    id: "objetivo",
    type: "single",
    section: "Sobre você",
    question: "Qual é o seu principal objetivo?",
    subtitle: "Isso define as receitas e dicas que vamos mostrar pra você.",
    options: [
      { id: "emagrecer", label: "Emagrecer", description: "Reduzir peso com saúde" },
      { id: "massa", label: "Ganhar massa", description: "Crescimento muscular" },
      { id: "manter", label: "Manter o peso", description: "Equilíbrio e consistência" },
      { id: "energia", label: "Ter mais energia", description: "Foco e disposição no dia a dia" },
      { id: "saude", label: "Saúde preventiva", description: "Reduzir riscos e melhorar exames" },
    ],
  },
  {
    id: "pratica",
    type: "single",
    question: "Você pratica atividade física atualmente?",
    subtitle: "Não tem resposta errada — só queremos entender seu ponto de partida.",
    options: [
      { id: "sim", label: "Sim, com regularidade" },
      { id: "as_vezes", label: "De vez em quando" },
      { id: "nao", label: "Não pratico no momento" },
    ],
  },
  // academia | nivel são inseridos dinamicamente conforme a resposta de "pratica"
  {
    id: "cozinha",
    type: "single",
    question: "Você consegue cozinhar pra você?",
    subtitle: "Isso define a complexidade das receitas que vamos sugerir.",
    options: [
      { id: "sempre", label: "Sim, cozinho com frequência" },
      { id: "as_vezes", label: "Às vezes, quando dá tempo" },
      { id: "nao", label: "Raramente ou nunca" },
    ],
  },
  {
    id: "refeicao",
    type: "single",
    question: "Como você costuma se alimentar no dia a dia?",
    subtitle: "Sem julgamento — só queremos entregar o mais útil pra você.",
    options: [
      { id: "casa", label: "Quase sempre em casa" },
      { id: "fora", label: "Como fora com frequência", description: "Restaurantes, refeitório, marmita" },
      { id: "fastfood", label: "Peço muito fast food e delivery", description: "Praticidade no corre do dia" },
      { id: "misto", label: "Um pouco de cada" },
    ],
  },
  {
    id: "animo",
    type: "single",
    question: "Como tem sido a sua disposição ultimamente?",
    subtitle: "Energia e humor andam junto com a alimentação.",
    options: [
      { id: "bem", label: "Bem disposto, com energia de sobra" },
      { id: "oscila", label: "Oscila bastante ao longo da semana" },
      { id: "cansado", label: "Quase sempre cansado" },
      { id: "desmotivado", label: "Sem ânimo, meio desmotivado" },
    ],
  },
  // aviso médico (notice) é inserido aqui dinamicamente quando há sinais de risco
  {
    id: "idade_range",
    type: "single",
    question: "Qual é a sua faixa etária?",
    subtitle: "As necessidades nutricionais mudam com a idade.",
    options: [
      { id: "18-25", label: "18 a 25 anos" },
      { id: "26-35", label: "26 a 35 anos" },
      { id: "36-45", label: "36 a 45 anos" },
      { id: "46+", label: "46 anos ou mais" },
    ],
  },
  {
    id: "biotipo",
    type: "single",
    question: "Qual descrição mais combina com o seu corpo?",
    subtitle: "Não existe certo ou errado — cada corpo tem um metabolismo diferente.",
    options: [
      {
        id: "ectomorfo",
        label: "Magro, com dificuldade de ganhar peso ou massa",
        legend: "Ectomorfo",
      },
      {
        id: "mesomorfo",
        label: "Atlético, ganha e perde peso com facilidade",
        legend: "Mesomorfo",
      },
      {
        id: "endomorfo",
        label: "Mais robusto, tende a acumular gordura com facilidade",
        legend: "Endomorfo",
      },
      {
        id: "nao_sei",
        label: "Não tenho certeza",
        legend: "Tudo bem — a gente identifica com o tempo",
      },
    ],
  },
  {
    id: "restricoes",
    type: "multi",
    question: "Você tem alguma restrição alimentar?",
    subtitle: "Selecione todas que se aplicam. Vamos excluir ingredientes incompatíveis.",
    options: [
      { id: "nenhuma", label: "Nenhuma", description: "Como de tudo" },
      { id: "lactose", label: "Intolerância à lactose" },
      { id: "gluten", label: "Intolerância ao glúten" },
      { id: "vegetariano", label: "Vegetariano" },
      { id: "vegano", label: "Vegano" },
    ],
  },
];

// Ramificação de atividade física (entra entre "pratica" e "cozinha")
const GYM_STEP: SingleStep = {
  id: "academia",
  type: "single",
  question: "Você tem acesso a um espaço para se exercitar?",
  subtitle: "Vamos sugerir o caminho mais realista pra começar a se mover.",
  options: [
    { id: "sim", label: "Sim, tenho acesso a uma academia" },
    { id: "casa", label: "Só consigo treinar em casa" },
    { id: "nao", label: "Não tenho acesso no momento" },
  ],
};

const LEVEL_STEP: SingleStep = {
  id: "nivel",
  type: "single",
  question: "Com que intensidade você treina?",
  subtitle: "Assim ajustamos as calorias e a recuperação.",
  options: [
    { id: "leve", label: "Leve", description: "1 a 2x por semana" },
    { id: "moderado", label: "Moderado", description: "3 a 4x por semana" },
    { id: "intenso", label: "Intenso", description: "5x por semana ou mais" },
  ],
};

// — Bloco da casa/família (público "para_casa" e "ambos") —
const HOME_STEPS: Step[] = [
  {
    id: "objetivo_casa",
    type: "single",
    section: "Sobre a sua casa",
    question: "O que você mais quer mudar na rotina alimentar da casa?",
    subtitle: "Responda com sinceridade — é assim que montamos o cardápio certo.",
    options: [
      { id: "rotina_saudavel", label: "Deixar a rotina da casa mais saudável" },
      { id: "tempo", label: "Economizar tempo no preparo das refeições" },
      { id: "agradar", label: "Agradar todo mundo sem cozinhar várias coisas" },
      { id: "economia", label: "Comer melhor gastando menos" },
      { id: "variar", label: "Sair da mesmice e variar o cardápio" },
    ],
  },
  {
    id: "tamanho_casa",
    type: "single",
    question: "Quantas pessoas você costuma alimentar?",
    subtitle: "Vamos ajustar as porções e as listas de compras.",
    options: [
      { id: "casal", label: "Eu e mais uma pessoa" },
      { id: "pequena", label: "3 a 4 pessoas" },
      { id: "grande", label: "5 pessoas ou mais" },
    ],
  },
  {
    id: "criancas",
    type: "single",
    question: "Tem crianças na casa?",
    subtitle: "Crianças pedem estratégias diferentes pra comer bem.",
    options: [
      { id: "pequenas", label: "Sim, pequenas (até 10 anos)" },
      { id: "maiores", label: "Sim, maiores de 10 anos" },
      { id: "nao", label: "Não tem crianças" },
    ],
  },
  {
    id: "tempo_preparo",
    type: "single",
    question: "Quanto tempo você costuma ter para cozinhar?",
    subtitle: "Vamos respeitar a sua realidade no dia a dia.",
    options: [
      { id: "corrido", label: "Bem pouco, vivo no corre" },
      { id: "medio", label: "Um tempo razoável na maioria dos dias" },
      { id: "tranquilo", label: "Tenho tempo e gosto de cozinhar" },
    ],
  },
  {
    id: "rotina_casa",
    type: "single",
    question: "Como funcionam as refeições da casa hoje?",
    subtitle: "Esse é o ponto de partida pra mudar com leveza.",
    options: [
      { id: "caseiro", label: "Cozinho quase tudo em casa" },
      { id: "misto", label: "Mistura de caseiro com pedidos" },
      { id: "delivery", label: "Pedimos delivery ou fast food com frequência" },
    ],
  },
  {
    id: "restricoes_casa",
    type: "multi",
    question: "Alguém da casa tem restrição alimentar?",
    subtitle: "Selecione todas que se aplicam.",
    options: [
      { id: "nenhuma", label: "Ninguém tem restrição" },
      { id: "lactose", label: "Intolerância à lactose" },
      { id: "gluten", label: "Intolerância ao glúten" },
      { id: "vegetariano", label: "Vegetariano(s) na casa" },
      { id: "alergias", label: "Alergias específicas" },
      { id: "seletivas", label: "Crianças que comem pouca variedade" },
    ],
  },
  {
    id: "desafio_casa",
    type: "single",
    question: "Qual é o seu maior desafio na cozinha hoje?",
    subtitle: "Vamos atacar isso primeiro.",
    options: [
      { id: "falta_tempo", label: "Falta de tempo" },
      { id: "falta_ideias", label: "Falta de ideias e variedade" },
      { id: "agradar_todos", label: "Agradar gostos diferentes" },
      { id: "orcamento", label: "Encaixar tudo no orçamento" },
    ],
  },
];

const MEDICAL_NOTICE: NoticeStep = {
  id: "aviso_saude",
  type: "notice",
  question: "Um cuidado a mais com você",
  body:
    "Cuidar da alimentação vai além do prato. Pelo que você compartilhou, pode valer a pena conversar com um profissional de saúde da sua confiança — não para te limitar, mas para que o seu progresso seja seguro e sustentável. Você pode continuar normalmente; isso é só um lembrete de quem se importa de verdade com você.",
};

// ---------------------------------------------------------------------------
// Montagem dinâmica do fluxo
// ---------------------------------------------------------------------------
function hasMedicalSignals(answers: Answers): boolean {
  let score = 0;
  if (answers.pratica === "nao" || answers.atividade === "sedentario") score++;
  if (answers.refeicao === "fastfood") score++;
  if (answers.cozinha === "nao") score++;
  if (answers.animo === "desmotivado" || answers.animo === "cansado") score++;
  return score >= 3;
}

function buildSteps(answers: Answers): Step[] {
  const steps: Step[] = [AUDIENCE_STEP];

  const audience = answers.publico as string | undefined;
  if (!audience) return steps; // só revela o resto após escolher o público

  const includeSelf = audience === "para_si" || audience === "ambos";
  const includeHome = audience === "para_casa" || audience === "ambos";

  if (includeSelf) {
    for (const s of SELF_STEPS) {
      steps.push(s);

      // Ramificação de atividade física logo após "pratica"
      if (s.id === "pratica") {
        if (answers.pratica === "nao") steps.push(GYM_STEP);
        else if (answers.pratica === "sim" || answers.pratica === "as_vezes")
          steps.push(LEVEL_STEP);
      }

      // Aviso de saúde contextual logo após "animo"
      if (s.id === "animo" && hasMedicalSignals(answers)) {
        steps.push(MEDICAL_NOTICE);
      }
    }
  }

  if (includeHome) {
    for (const s of HOME_STEPS) steps.push(s);
  }

  return steps;
}

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
  if (step.type === "notice") return true; // tela informativa não exige resposta
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

  // Phases: steps → offer → auth → email-sent
  const [phase, setPhase] = useState<"steps" | "offer" | "auth" | "email-sent">(
    "steps",
  );
  const [selectedPlan, setSelectedPlan] = useState<Plan["id"]>("anual");
  const [email, setEmail] = useState("");
  const [authLoading, setAuthLoading] = useState(false);
  const [authError, setAuthError] = useState("");
  const emailRef = useRef<HTMLInputElement>(null);

  const bonus = useMemo(() => deriveBonus(answers), [answers]);

  const steps = useMemo(() => buildSteps(answers), [answers]);
  const TOTAL_STEPS = steps.length;
  const step = steps[currentStep];
  const progress = (currentStep / TOTAL_STEPS) * 100;
  const isLast = currentStep === TOTAL_STEPS - 1;
  const answered = step ? isAnswered(step, answers) : false;

  // Dispara evento de início na primeira renderização
  useEffect(() => {
    track(AnalyticsEvent.OnboardingStarted);
  }, []);

  // Registra exibição do aviso de saúde (etapa do funil)
  useEffect(() => {
    if (step?.type === "notice") {
      track(AnalyticsEvent.OnboardingMedicalNoticeShown, { step_id: step.id });
    }
  }, [step?.id, step?.type]);

  // Foca o input de email quando entra na fase auth
  useEffect(() => {
    if (phase === "auth") emailRef.current?.focus();
  }, [phase]);

  // ----- Seleção de opção -----
  function selectOption(optionId: OptionId) {
    if (!step || step.type === "notice") return;

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
    if (!step || step.type === "notice") return false;
    const val = answers[step.id];
    if (step.type === "multi") return Array.isArray(val) && val.includes(optionId);
    return val === optionId;
  }

  // ----- Navegação -----
  function goNext() {
    if (!answered || !step) return;

    if (step.type !== "notice") {
      track(AnalyticsEvent.OnboardingStepAnswered, {
        step_id: step.id,
        step_index: currentStep,
        answer: answers[step.id],
      });

      // Marca o público escolhido para segmentação de campanhas
      if (step.id === "publico") {
        track(AnalyticsEvent.OnboardingAudienceSelected, {
          audience: answers.publico,
        });
      }
    }

    if (isLast) {
      // Salva respostas no localStorage para o callback pós-auth recuperar
      const finalAnswers = { ...answers };
      localStorage.setItem("onboarding_answers", JSON.stringify(finalAnswers));
      track(AnalyticsEvent.OnboardingOfferViewed, {
        audience: answers.publico,
        objetivo: answers.objetivo,
        bonus: bonus.title,
      });
      setPhase("offer");
      return;
    }

    setDirection(1);
    setCurrentStep((s) => s + 1);
  }

  // ----- Oferta: seleção de plano -----
  function choosePlan(planId: Plan["id"]) {
    setSelectedPlan(planId);
    track(AnalyticsEvent.OnboardingPlanSelected, { plan: planId });
  }

  function goToCheckout() {
    track(AnalyticsEvent.OnboardingPlanSelected, {
      plan: selectedPlan,
      confirmed: true,
    });
    // Anexa o plano escolhido às respostas salvas (entra no raw_answers do perfil)
    try {
      const raw = localStorage.getItem("onboarding_answers");
      const saved = raw ? JSON.parse(raw) : { ...answers };
      saved.selected_plan = selectedPlan;
      localStorage.setItem("onboarding_answers", JSON.stringify(saved));
    } catch {
      /* localStorage indisponível — segue mesmo assim */
    }
    setPhase("auth");
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
            Verifique seu e-mail
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
  // Render: Oferta final (comunidade + bônus + tabela de preços)
  // ---------------------------------------------------------------------------
  if (phase === "offer") {
    return (
      <div className="min-h-screen flex flex-col bg-gradient-to-b from-cream via-peach/40 to-cream">
        <header className="flex items-center justify-between px-6 py-5 max-w-3xl mx-auto w-full">
          <Link href="/" className="flex items-center gap-2 text-green-800 font-semibold text-sm">
            <ChefHat className="w-5 h-5" />
            MelhorSabor
          </Link>
          <button
            onClick={() => setPhase("steps")}
            className="text-xs text-gray-400 hover:text-gray-600 transition"
          >
            ← Revisar respostas
          </button>
        </header>

        <div className="w-full bg-gray-100 h-1">
          <div className="h-1 bg-tomato w-full" />
        </div>

        <main className="flex-1 px-4 py-10">
          <div className="w-full max-w-3xl mx-auto">
            {/* Cabeçalho da oferta */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
              className="text-center mb-10"
            >
              <span className="inline-flex items-center gap-2 mb-5 px-4 py-1.5 rounded-full text-xs font-semibold tracking-widest uppercase bg-white text-tomato border border-peach shadow-sm">
                <Sparkles className="w-3.5 h-3.5" />
                Seu plano está pronto
              </span>
              <h1 className="text-3xl sm:text-4xl font-extrabold text-gray-900 mb-4 leading-tight">
                Você não está{" "}
                <span className="text-tomato">sozinho</span> nessa jornada.
              </h1>
              <p className="text-gray-600 text-base max-w-xl mx-auto leading-relaxed">
                Desbloqueie o acesso à <strong>comunidade MelhorSabor</strong>: um
                lugar de pessoas com o mesmo objetivo que o seu, crescendo juntas
                — com receitas, rotina diária e apoio de verdade.
              </p>
            </motion.div>

            {/* Pilares da comunidade */}
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-8"
            >
              <CommunityPillar
                icon={<Users className="w-5 h-5 text-tomato" />}
                title="Comunidade"
                text="Feed para postar seus pratos e acompanhar quem busca o mesmo que você."
              />
              <CommunityPillar
                icon={<Sparkles className="w-5 h-5 text-tomato" />}
                title="Rotina diária"
                text="Manhã, tarde e noite organizadas com receitas e dicas personalizadas."
              />
              <CommunityPillar
                icon={<ShieldCheck className="w-5 h-5 text-tomato" />}
                title="Acompanhamento"
                text="Sua jornada registrada e evoluindo a partir do seu perfil."
              />
            </motion.div>

            {/* Bônus segmentado */}
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.15 }}
              className="flex items-start gap-4 p-5 mb-10 rounded-2xl bg-white border-2 border-dashed border-apricot shadow-sm"
            >
              <div className="w-11 h-11 rounded-xl bg-honey/40 flex items-center justify-center flex-shrink-0">
                <Gift className="w-5 h-5 text-paprika" />
              </div>
              <div className="min-w-0">
                <p className="text-[11px] uppercase tracking-widest font-bold text-paprika mb-0.5">
                  Bônus de entrada · grátis
                </p>
                <h3 className="font-bold text-gray-900 text-sm sm:text-base">
                  {bonus.title}
                </h3>
                <p className="text-gray-500 text-sm mt-0.5">{bonus.subtitle}</p>
              </div>
            </motion.div>

            {/* Tabela de preços */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
              {PLANS.map((plan, i) => {
                const sel = selectedPlan === plan.id;
                const desc = discountPercent(plan);
                const mensal = monthlyEquivalent(plan);
                return (
                  <motion.button
                    key={plan.id}
                    type="button"
                    onClick={() => choosePlan(plan.id)}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.45, delay: 0.1 + i * 0.07 }}
                    className={`relative text-left rounded-2xl border-2 p-5 transition-all duration-200 ${
                      sel
                        ? "border-tomato bg-white shadow-lg scale-[1.02]"
                        : "border-gray-200 bg-white/70 hover:border-apricot hover:bg-white"
                    } ${plan.highlight ? "sm:-mt-2" : ""}`}
                  >
                    {plan.badge && (
                      <span className="absolute -top-3 left-1/2 -translate-x-1/2 whitespace-nowrap px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider bg-tomato text-white shadow">
                        {plan.badge}
                      </span>
                    )}

                    <div className="flex items-center justify-between mb-3">
                      <span className="font-bold text-gray-900">{plan.name}</span>
                      <span
                        className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${
                          sel ? "border-tomato bg-tomato" : "border-gray-300"
                        }`}
                      >
                        {sel && <Check className="w-3 h-3 text-white" />}
                      </span>
                    </div>

                    <div className="mb-1">
                      <span className="text-2xl font-extrabold text-gray-900">
                        {brl(plan.price)}
                      </span>
                      {plan.months > 1 && (
                        <span className="text-xs text-gray-400">
                          {" "}
                          /{plan.months} meses
                        </span>
                      )}
                    </div>

                    <p className="text-xs text-gray-500">
                      Equivale a{" "}
                      <strong className="text-gray-700">{brl(mensal)}</strong>/mês
                    </p>

                    {desc > 0 ? (
                      <span className="inline-block mt-3 px-2 py-0.5 rounded-md text-[11px] font-bold bg-sage/20 text-green-800">
                        Economize {desc}%
                      </span>
                    ) : (
                      <span className="inline-block mt-3 px-2 py-0.5 rounded-md text-[11px] font-medium text-gray-400">
                        Plano base
                      </span>
                    )}

                    <p className="mt-3 text-[11px] text-gray-400 flex items-center gap-1">
                      <Gift className="w-3 h-3 text-paprika" />
                      Inclui o bônus grátis
                    </p>
                  </motion.button>
                );
              })}
            </div>

            {/* CTA */}
            <div className="max-w-md mx-auto">
              <button
                onClick={goToCheckout}
                className="w-full flex items-center justify-center gap-2 bg-tomato hover:bg-paprika text-white px-6 py-4 rounded-full text-base font-bold shadow-lg shadow-tomato/20 transition"
              >
                Desbloquear meu acesso
                <ArrowRight className="w-5 h-5" />
              </button>
              <p className="text-center text-xs text-gray-400 mt-4 leading-relaxed">
                Acesso à comunidade, à plataforma diária e ao seu bônus
                personalizado. Cancele quando quiser.
              </p>
            </div>
          </div>
        </main>
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
                Perfil montado!
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
    (currentStep === 0 || steps[currentStep - 1].section !== step.section);

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
            {showSectionHeader && step?.section && (
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
              key={step?.id}
              custom={direction}
              variants={slideVariants}
              initial="enter"
              animate="center"
              exit="exit"
            >
              {step?.type === "notice" ? (
                /* Tela informativa (ex.: aviso de saúde) */
                <div className="text-center">
                  <div className="w-16 h-16 bg-amber-50 rounded-full flex items-center justify-center mx-auto mb-6 border border-amber-100">
                    <HeartPulse className="w-8 h-8 text-amber-500" />
                  </div>
                  <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-4">
                    {step.question}
                  </h2>
                  <p className="text-gray-500 text-sm leading-relaxed max-w-md mx-auto">
                    {step.body}
                  </p>
                </div>
              ) : (
                <>
                  {/* Pergunta */}
                  <div className="mb-8 text-center">
                    <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-2">
                      {step?.question}
                    </h2>
                    {step?.subtitle && (
                      <p className="text-gray-500 text-sm">{step.subtitle}</p>
                    )}
                    {step?.type === "multi" && (
                      <p className="text-xs text-green-700 mt-1 font-medium">
                        Pode selecionar mais de uma opção
                      </p>
                    )}
                  </div>

                  {/* Opções */}
                  <div className="flex flex-col gap-3">
                    {step?.options.map((option) => {
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
                            {option.legend && (
                              <span className="text-[11px] uppercase tracking-wide text-green-600/70 block mt-1 font-medium">
                                {option.legend}
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
                </>
              )}
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
              {step?.type === "notice"
                ? "Entendi, continuar"
                : isLast
                ? "Ver meu plano"
                : "Continuar"}
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

// ---------------------------------------------------------------------------
// Pilar da comunidade (tela de oferta)
// ---------------------------------------------------------------------------
function CommunityPillar({
  icon,
  title,
  text,
}: {
  icon: React.ReactNode;
  title: string;
  text: string;
}) {
  return (
    <div className="flex flex-col gap-2 p-4 rounded-2xl bg-white/70 border border-peach">
      <div className="w-9 h-9 rounded-xl bg-peach/60 flex items-center justify-center">
        {icon}
      </div>
      <h3 className="font-semibold text-sm text-gray-900">{title}</h3>
      <p className="text-xs text-gray-500 leading-relaxed">{text}</p>
    </div>
  );
}
