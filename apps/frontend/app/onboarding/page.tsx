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
  MessageCircle,
  Heart,
  Camera,
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
  description?: string;
  legend?: string;
}

interface StepBase {
  id: string;
  question: string;
  subtitle?: string;
  section?: string;
}

interface SingleStep extends StepBase { type: "single"; options: Option[] }
interface MultiStep extends StepBase { type: "multi"; options: Option[] }
interface NoticeStep extends StepBase { type: "notice"; body: string }

type Step = SingleStep | MultiStep | NoticeStep;

interface Answers {
  [stepId: string]: OptionId | OptionId[];
}

// ---------------------------------------------------------------------------
// Passos do quiz (idênticos à versão anterior)
// ---------------------------------------------------------------------------
const AUDIENCE_STEP: SingleStep = {
  id: "publico",
  type: "single",
  section: "Vamos te conhecer",
  question: "Para quem você quer melhorar a alimentação?",
  subtitle: "Responda com sinceridade — é assim que acertamos as recomendações certas pra você.",
  options: [
    { id: "para_si", label: "Para mim", description: "Quero cuidar da minha alimentação e dos meus objetivos" },
    { id: "para_casa", label: "Para minha casa e família", description: "Sou eu quem organiza as refeições da casa" },
    { id: "ambos", label: "Para mim e para a minha família", description: "Cuido de mim e também da rotina da casa" },
  ],
};

const SELF_STEPS: Step[] = [
  {
    id: "objetivo", type: "single", section: "Sobre você",
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
    id: "pratica", type: "single",
    question: "Você pratica atividade física atualmente?",
    subtitle: "Não tem resposta errada — só queremos entender seu ponto de partida.",
    options: [
      { id: "sim", label: "Sim, com regularidade" },
      { id: "as_vezes", label: "De vez em quando" },
      { id: "nao", label: "Não pratico no momento" },
    ],
  },
  {
    id: "cozinha", type: "single",
    question: "Você consegue cozinhar pra você?",
    subtitle: "Isso define a complexidade das receitas que vamos sugerir.",
    options: [
      { id: "sempre", label: "Sim, cozinho com frequência" },
      { id: "as_vezes", label: "Às vezes, quando dá tempo" },
      { id: "nao", label: "Raramente ou nunca" },
    ],
  },
  {
    id: "refeicao", type: "single",
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
    id: "animo", type: "single",
    question: "Como tem sido a sua disposição ultimamente?",
    subtitle: "Energia e humor andam junto com a alimentação.",
    options: [
      { id: "bem", label: "Bem disposto, com energia de sobra" },
      { id: "oscila", label: "Oscila bastante ao longo da semana" },
      { id: "cansado", label: "Quase sempre cansado" },
      { id: "desmotivado", label: "Sem ânimo, meio desmotivado" },
    ],
  },
  {
    id: "idade_range", type: "single",
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
    id: "biotipo", type: "single",
    question: "Qual descrição mais combina com o seu corpo?",
    subtitle: "Não existe certo ou errado — cada corpo tem um metabolismo diferente.",
    options: [
      { id: "ectomorfo", label: "Magro, com dificuldade de ganhar peso ou massa", legend: "Ectomorfo" },
      { id: "mesomorfo", label: "Atlético, ganha e perde peso com facilidade", legend: "Mesomorfo" },
      { id: "endomorfo", label: "Mais robusto, tende a acumular gordura com facilidade", legend: "Endomorfo" },
      { id: "nao_sei", label: "Não tenho certeza", legend: "Tudo bem — a gente identifica com o tempo" },
    ],
  },
  {
    id: "restricoes", type: "multi",
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

const GYM_STEP: SingleStep = {
  id: "academia", type: "single",
  question: "Você tem acesso a um espaço para se exercitar?",
  subtitle: "Vamos sugerir o caminho mais realista pra começar a se mover.",
  options: [
    { id: "sim", label: "Sim, tenho acesso a uma academia" },
    { id: "casa", label: "Só consigo treinar em casa" },
    { id: "nao", label: "Não tenho acesso no momento" },
  ],
};

const LEVEL_STEP: SingleStep = {
  id: "nivel", type: "single",
  question: "Com que intensidade você treina?",
  subtitle: "Assim ajustamos as calorias e a recuperação.",
  options: [
    { id: "leve", label: "Leve", description: "1 a 2x por semana" },
    { id: "moderado", label: "Moderado", description: "3 a 4x por semana" },
    { id: "intenso", label: "Intenso", description: "5x por semana ou mais" },
  ],
};

const HOME_STEPS: Step[] = [
  {
    id: "objetivo_casa", type: "single", section: "Sobre a sua casa",
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
    id: "tamanho_casa", type: "single",
    question: "Quantas pessoas você costuma alimentar?",
    subtitle: "Vamos ajustar as porções e as listas de compras.",
    options: [
      { id: "casal", label: "Eu e mais uma pessoa" },
      { id: "pequena", label: "3 a 4 pessoas" },
      { id: "grande", label: "5 pessoas ou mais" },
    ],
  },
  {
    id: "criancas", type: "single",
    question: "Tem crianças na casa?",
    subtitle: "Crianças pedem estratégias diferentes pra comer bem.",
    options: [
      { id: "pequenas", label: "Sim, pequenas (até 10 anos)" },
      { id: "maiores", label: "Sim, maiores de 10 anos" },
      { id: "nao", label: "Não tem crianças" },
    ],
  },
  {
    id: "tempo_preparo", type: "single",
    question: "Quanto tempo você costuma ter para cozinhar?",
    subtitle: "Vamos respeitar a sua realidade no dia a dia.",
    options: [
      { id: "corrido", label: "Bem pouco, vivo no corre" },
      { id: "medio", label: "Um tempo razoável na maioria dos dias" },
      { id: "tranquilo", label: "Tenho tempo e gosto de cozinhar" },
    ],
  },
  {
    id: "rotina_casa", type: "single",
    question: "Como funcionam as refeições da casa hoje?",
    subtitle: "Esse é o ponto de partida pra mudar com leveza.",
    options: [
      { id: "caseiro", label: "Cozinho quase tudo em casa" },
      { id: "misto", label: "Mistura de caseiro com pedidos" },
      { id: "delivery", label: "Pedimos delivery ou fast food com frequência" },
    ],
  },
  {
    id: "restricoes_casa", type: "multi",
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
    id: "desafio_casa", type: "single",
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
  id: "aviso_saude", type: "notice",
  question: "Um cuidado a mais com você",
  body: "Cuidar da alimentação vai além do prato. Pelo que você compartilhou, pode valer a pena conversar com um profissional de saúde da sua confiança — não para te limitar, mas para que o seu progresso seja seguro e sustentável. Você pode continuar normalmente; isso é só um lembrete de quem se importa de verdade com você.",
};

function hasMedicalSignals(answers: Answers): boolean {
  let score = 0;
  if (answers.pratica === "nao") score++;
  if (answers.refeicao === "fastfood") score++;
  if (answers.cozinha === "nao") score++;
  if (answers.animo === "desmotivado" || answers.animo === "cansado") score++;
  return score >= 3;
}

function buildSteps(answers: Answers): Step[] {
  const steps: Step[] = [AUDIENCE_STEP];
  const audience = answers.publico as string | undefined;
  if (!audience) return steps;

  const includeSelf = audience === "para_si" || audience === "ambos";
  const includeHome = audience === "para_casa" || audience === "ambos";

  if (includeSelf) {
    for (const s of SELF_STEPS) {
      steps.push(s);
      if (s.id === "pratica") {
        if (answers.pratica === "nao") steps.push(GYM_STEP);
        else if (answers.pratica === "sim" || answers.pratica === "as_vezes") steps.push(LEVEL_STEP);
      }
      if (s.id === "animo" && hasMedicalSignals(answers)) steps.push(MEDICAL_NOTICE);
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
  center: { x: 0, opacity: 1, transition: { duration: 0.35, ease: [0.22, 1, 0.36, 1] } },
  exit: (dir: number) => ({ x: dir > 0 ? -60 : 60, opacity: 0, transition: { duration: 0.25, ease: "easeIn" } }),
};

function isAnswered(step: Step, answers: Answers): boolean {
  if (step.type === "notice") return true;
  const val = answers[step.id];
  if (step.type === "multi") return Array.isArray(val) && val.length > 0;
  return typeof val === "string" && val.length > 0;
}

// ---------------------------------------------------------------------------
// Componente principal
// ---------------------------------------------------------------------------
export default function OnboardingPage() {
  const [currentStep, setCurrentStep] = useState(0);
  const [answers, setAnswers] = useState<Answers>({});
  const [direction, setDirection] = useState(1);

  // Fases: steps → offer → auth → plans → email-sent
  const [phase, setPhase] = useState<"steps" | "offer" | "auth" | "plans" | "email-sent">("steps");
  const [selectedPlan, setSelectedPlan] = useState<Plan["id"]>("anual");
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [authLoading, setAuthLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);
  const [authError, setAuthError] = useState("");
  const emailRef = useRef<HTMLInputElement>(null);

  const bonus = useMemo(() => deriveBonus(answers), [answers]);
  const steps = useMemo(() => buildSteps(answers), [answers]);
  const TOTAL_STEPS = steps.length;
  const step = steps[currentStep];
  const progress = (currentStep / TOTAL_STEPS) * 100;
  const isLast = currentStep === TOTAL_STEPS - 1;
  const answered = step ? isAnswered(step, answers) : false;

  useEffect(() => { track(AnalyticsEvent.OnboardingStarted); }, []);

  useEffect(() => {
    if (step?.type === "notice") track(AnalyticsEvent.OnboardingMedicalNoticeShown, { step_id: step.id });
  }, [step?.id, step?.type]);

  useEffect(() => {
    if (phase === "auth") emailRef.current?.focus();
  }, [phase]);

  function selectOption(optionId: OptionId) {
    if (!step || step.type === "notice") return;
    if (step.type === "multi") {
      setAnswers((prev) => {
        const current = (prev[step.id] as OptionId[] | undefined) ?? [];
        if (optionId === "nenhuma") return { ...prev, [step.id]: ["nenhuma"] };
        const filtered = current.filter((id) => id !== "nenhuma");
        const already = filtered.includes(optionId);
        return { ...prev, [step.id]: already ? filtered.filter((id) => id !== optionId) : [...filtered, optionId] };
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

  function saveAnswers() {
    try {
      const saved = { ...answers };
      if (name) saved._name = name;
      saved.selected_plan = selectedPlan;
      localStorage.setItem("onboarding_answers", JSON.stringify(saved));
    } catch { /* silently fail */ }
  }

  function goNext() {
    if (!answered || !step) return;
    if (step.type !== "notice") {
      track(AnalyticsEvent.OnboardingStepAnswered, { step_id: step.id, step_index: currentStep, answer: answers[step.id] });
      if (step.id === "publico") track(AnalyticsEvent.OnboardingAudienceSelected, { audience: answers.publico });
    }
    if (isLast) {
      localStorage.setItem("onboarding_answers", JSON.stringify(answers));
      track(AnalyticsEvent.OnboardingOfferViewed, { audience: answers.publico, objetivo: answers.objetivo, bonus: bonus.title });
      setPhase("offer");
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

  // ----- Google OAuth -----
  async function signInWithGoogle() {
    setGoogleLoading(true);
    setAuthError("");
    const redirectTo = typeof window !== "undefined" ? `${window.location.origin}/onboarding/callback` : "/onboarding/callback";
    saveAnswers();
    const { error } = await supabase.auth.signInWithOAuth({
      provider: "google",
      options: { redirectTo },
    });
    if (error) {
      setAuthError("Não foi possível conectar com o Google. Tente novamente.");
      setGoogleLoading(false);
    }
    // se ok, o browser redireciona automaticamente
  }

  // ----- Magic Link -----
  async function sendMagicLink(e: React.FormEvent) {
    e.preventDefault();
    if (!email) return;
    setAuthLoading(true);
    setAuthError("");
    const redirectTo = typeof window !== "undefined" ? `${window.location.origin}/onboarding/callback` : "/onboarding/callback";
    saveAnswers();
    const { error } = await supabase.auth.signInWithOtp({ email, options: { emailRedirectTo: redirectTo } });
    setAuthLoading(false);
    if (error) { setAuthError("Não conseguimos enviar o e-mail. Tente novamente."); return; }
    track(AnalyticsEvent.OnboardingCompleted, {
      ...Object.fromEntries(Object.entries(answers).map(([k, v]) => [k, Array.isArray(v) ? v.join(",") : v])),
    });
    setPhase("email-sent");
  }

  function choosePlan(planId: Plan["id"]) {
    setSelectedPlan(planId);
    track(AnalyticsEvent.OnboardingPlanSelected, { plan: planId });
  }

  // ---------------------------------------------------------------------------
  // Render: Email enviado
  // ---------------------------------------------------------------------------
  if (phase === "email-sent") {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center px-4 bg-gradient-to-b from-cream via-peach/40 to-cream">
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
          className="text-center max-w-sm"
        >
          <div className="w-20 h-20 bg-apricot/40 rounded-full flex items-center justify-center mx-auto mb-6">
            <Mail className="w-10 h-10 text-tomato" />
          </div>
          <h1 className="text-2xl font-bold text-gray-900 mb-3">Verifique seu e-mail</h1>
          <p className="text-gray-500 text-sm mb-6 leading-relaxed">
            Enviamos um link mágico para <strong className="text-gray-700">{email}</strong>.
            Clique nele para entrar na comunidade e ver seus planos.
          </p>
          <p className="text-xs text-gray-400 leading-relaxed">Não encontrou? Verifique a pasta de spam.</p>
        </motion.div>
      </div>
    );
  }

  // ---------------------------------------------------------------------------
  // Render: Planos (após cadastro)
  // ---------------------------------------------------------------------------
  if (phase === "plans") {
    return (
      <div className="min-h-screen flex flex-col bg-gradient-to-b from-cream via-nude/60 to-cream">
        <header className="flex items-center justify-between px-6 py-5 max-w-3xl mx-auto w-full">
          <Link href="/" className="flex items-center gap-2 text-gray-800 font-semibold text-sm">
            <ChefHat className="w-5 h-5 text-tomato" />
            MelhorSabor
          </Link>
        </header>
        <div className="w-full bg-gray-100 h-1"><div className="h-1 bg-tomato w-full" /></div>

        <main className="flex-1 px-4 py-10">
          <div className="w-full max-w-3xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="text-center mb-8"
            >
              <span className="inline-flex items-center gap-2 mb-4 px-4 py-1.5 rounded-full text-xs font-semibold uppercase tracking-wide bg-white text-tomato border border-peach shadow-sm">
                <Sparkles className="w-3.5 h-3.5" />
                Bem-vindo à comunidade!
              </span>
              <h1 className="text-3xl sm:text-4xl font-extrabold text-gray-900 mb-3 leading-tight">
                Escolha como você quer continuar
              </h1>
              <p className="text-gray-500 text-sm max-w-lg mx-auto">
                Todos os planos incluem acesso à comunidade e ao seu bônus personalizado enviado por e-mail após a confirmação.
              </p>
            </motion.div>

            {/* Bônus */}
            <motion.div
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="flex items-start gap-4 p-5 mb-8 rounded-2xl bg-white border-2 border-dashed border-apricot"
            >
              <div className="w-10 h-10 rounded-xl bg-honey/40 flex items-center justify-center flex-shrink-0">
                <Gift className="w-5 h-5 text-paprika" />
              </div>
              <div>
                <p className="text-[11px] uppercase tracking-widest font-bold text-paprika mb-0.5">Bônus de entrada · grátis em qualquer plano</p>
                <h3 className="font-bold text-gray-900 text-sm">{bonus.title}</h3>
                <p className="text-gray-500 text-xs mt-0.5">{bonus.subtitle}</p>
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
                    transition={{ delay: 0.1 + i * 0.07 }}
                    className={`relative text-left rounded-2xl border-2 p-5 transition-all duration-200 ${
                      sel ? "border-tomato bg-white shadow-lg scale-[1.02]" : "border-gray-200 bg-white/70 hover:border-apricot hover:bg-white"
                    } ${plan.highlight ? "sm:-mt-2" : ""}`}
                  >
                    {plan.badge && (
                      <span className="absolute -top-3 left-1/2 -translate-x-1/2 whitespace-nowrap px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider bg-tomato text-white shadow">
                        {plan.badge}
                      </span>
                    )}
                    <div className="flex items-center justify-between mb-3">
                      <span className="font-bold text-gray-900">{plan.name}</span>
                      <span className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${sel ? "border-tomato bg-tomato" : "border-gray-300"}`}>
                        {sel && <Check className="w-3 h-3 text-white" />}
                      </span>
                    </div>
                    <div className="mb-1">
                      <span className="text-2xl font-extrabold text-gray-900">{brl(plan.price)}</span>
                      {plan.months > 1 && <span className="text-xs text-gray-400"> /{plan.months} meses</span>}
                    </div>
                    <p className="text-xs text-gray-500">
                      Equivale a <strong className="text-gray-700">{brl(mensal)}</strong>/mês
                    </p>
                    {desc > 0 ? (
                      <span className="inline-block mt-3 px-2 py-0.5 rounded-md text-[11px] font-bold bg-sage/20 text-green-800">
                        Economize {desc}%
                      </span>
                    ) : (
                      <span className="inline-block mt-3 px-2 py-0.5 rounded-md text-[11px] font-medium text-gray-400">Plano base</span>
                    )}
                    <p className="mt-2 text-[11px] text-gray-400 flex items-center gap-1">
                      <Gift className="w-3 h-3 text-paprika" />
                      Bônus incluso
                    </p>
                  </motion.button>
                );
              })}
            </div>

            <div className="max-w-md mx-auto">
              <button
                onClick={() => {
                  track(AnalyticsEvent.OnboardingPlanSelected, { plan: selectedPlan, confirmed: true });
                  saveAnswers();
                  // TODO: integrar gateway de pagamento
                  alert(`Plano ${selectedPlan} selecionado! Integração de pagamento em breve.`);
                }}
                className="w-full flex items-center justify-center gap-2 bg-tomato hover:bg-paprika text-white px-6 py-4 rounded-full text-base font-bold shadow-md shadow-tomato/20 transition"
              >
                Assinar plano {selectedPlan}
                <ArrowRight className="w-5 h-5" />
              </button>
              <p className="text-center text-xs text-gray-400 mt-4">
                Após o pagamento confirmado, seu bônus chega por e-mail. Cancele quando quiser.
              </p>
            </div>
          </div>
        </main>
      </div>
    );
  }

  // ---------------------------------------------------------------------------
  // Render: Auth (Google + e-mail)
  // ---------------------------------------------------------------------------
  if (phase === "auth") {
    return (
      <div className="min-h-screen flex flex-col bg-gradient-to-b from-cream via-peach/30 to-cream">
        <header className="flex items-center justify-between px-6 py-5 max-w-2xl mx-auto w-full">
          <Link href="/" className="flex items-center gap-2 text-gray-800 font-semibold text-sm">
            <ChefHat className="w-5 h-5 text-tomato" />
            MelhorSabor
          </Link>
        </header>
        <div className="w-full bg-gray-100 h-1"><div className="h-1 bg-tomato w-full" /></div>

        <main className="flex-1 flex flex-col items-center justify-center px-4 py-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
            className="w-full max-w-sm"
          >
            <div className="mb-8 text-center">
              <div className="w-14 h-14 bg-apricot/30 rounded-full flex items-center justify-center mx-auto mb-5">
                <Users className="w-7 h-7 text-tomato" />
              </div>
              <h2 className="text-2xl font-bold text-gray-900 mb-2">Criar sua conta</h2>
              <p className="text-gray-500 text-sm leading-relaxed">
                É rápido. Só precisamos de algumas informações básicas para personalizar a sua experiência.
              </p>
            </div>

            {/* Campo nome */}
            <div className="mb-4">
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Como você quer ser chamado?"
                className="w-full px-5 py-3.5 rounded-full border border-gray-200 bg-white text-gray-900 placeholder-gray-400 text-sm focus:outline-none focus:ring-2 focus:ring-tomato/40 focus:border-transparent shadow-sm transition"
              />
            </div>

            {/* Google */}
            <button
              onClick={signInWithGoogle}
              disabled={googleLoading}
              className="w-full flex items-center justify-center gap-3 bg-white hover:bg-nude border border-gray-200 text-gray-800 px-6 py-3.5 rounded-full text-sm font-semibold shadow-sm transition mb-4"
            >
              {googleLoading ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <svg className="w-4 h-4" viewBox="0 0 24 24" aria-hidden>
                  <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                  <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                  <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z"/>
                  <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                </svg>
              )}
              Entrar com Google
            </button>

            <div className="flex items-center gap-3 mb-4">
              <div className="flex-1 h-px bg-gray-200" />
              <span className="text-xs text-gray-400">ou use seu e-mail</span>
              <div className="flex-1 h-px bg-gray-200" />
            </div>

            {/* Magic Link */}
            <form onSubmit={sendMagicLink} className="flex flex-col gap-3">
              <input
                ref={emailRef}
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="seu@email.com"
                className="w-full px-5 py-3.5 rounded-full border border-gray-200 bg-white text-gray-900 placeholder-gray-400 text-sm focus:outline-none focus:ring-2 focus:ring-tomato/40 focus:border-transparent shadow-sm transition"
              />
              {authError && <p className="text-xs text-red-500 text-center">{authError}</p>}
              <button
                type="submit"
                disabled={authLoading || !email}
                className="flex items-center justify-center gap-2 bg-tomato hover:bg-paprika disabled:bg-gray-200 disabled:text-gray-400 text-white px-6 py-3.5 rounded-full text-sm font-semibold transition"
              >
                {authLoading ? <><Loader2 className="w-4 h-4 animate-spin" />Enviando…</> : <><Mail className="w-4 h-4" />Receber link por e-mail</>}
              </button>
            </form>

            <p className="text-center text-xs text-gray-400 mt-5 leading-relaxed">
              Sem spam. Sem senha. Seus dados são protegidos.
            </p>
            <button
              onClick={() => setPhase("offer")}
              className="w-full mt-3 text-xs text-gray-400 hover:text-gray-600 transition text-center"
            >
              ← Voltar
            </button>
          </motion.div>
        </main>
      </div>
    );
  }

  // ---------------------------------------------------------------------------
  // Render: Tela de Oferta (comunidade + mock social + CTA de entrada)
  // ---------------------------------------------------------------------------
  if (phase === "offer") {
    return (
      <div className="min-h-screen flex flex-col bg-gradient-to-b from-cream via-peach/30 to-cream">
        <header className="flex items-center justify-between px-6 py-5 max-w-3xl mx-auto w-full">
          <Link href="/" className="flex items-center gap-2 text-gray-800 font-semibold text-sm">
            <ChefHat className="w-5 h-5 text-tomato" />
            MelhorSabor
          </Link>
          <button onClick={() => setPhase("steps")} className="text-xs text-gray-400 hover:text-gray-600 transition">
            ← Revisar respostas
          </button>
        </header>
        <div className="w-full bg-gray-100 h-1"><div className="h-1 bg-tomato w-full" /></div>

        <main className="flex-1 px-4 py-10">
          <div className="w-full max-w-2xl mx-auto">

            {/* Cabeçalho */}
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }} className="text-center mb-8">
              <span className="inline-flex items-center gap-2 mb-5 px-4 py-1.5 rounded-full text-xs font-semibold uppercase tracking-wide bg-white text-tomato border border-peach shadow-sm">
                <Sparkles className="w-3.5 h-3.5" />
                Seu diagnóstico está pronto
              </span>
              <h1 className="text-3xl sm:text-4xl font-extrabold text-gray-900 mb-4 leading-tight">
                Você não precisa{" "}
                <span className="text-tomato">mudar sozinho.</span>
              </h1>
              <p className="text-gray-600 text-base max-w-lg mx-auto leading-relaxed">
                A <strong>comunidade MelhorSabor</strong> reúne pessoas com os mesmos objetivos que você — se apoiando, trocando receitas e crescendo juntas todos os dias.
              </p>
            </motion.div>

            {/* Pilares */}
            <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-8">
              <CommunityPillar icon={<Users className="w-5 h-5 text-tomato" />} title="Feed social" text="Poste seus pratos, veja o que a galera está fazendo, curta e comente." />
              <CommunityPillar icon={<Sparkles className="w-5 h-5 text-tomato" />} title="Rotina personalizada" text="Café, almoço e jantar organizados com receitas do seu perfil, todo dia." />
              <CommunityPillar icon={<ShieldCheck className="w-5 h-5 text-tomato" />} title="Progresso real" text="Sua jornada registrada, seu histórico visível, seu avanço celebrado." />
            </motion.div>

            {/* Mocks dinâmicos de postagem — dois cards lado a lado */}
            <motion.div initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="mb-8">
              <p className="text-xs uppercase tracking-widest font-semibold text-warm-gray mb-4 text-center">
                Veja como funciona na prática
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <CommunityMockPost />
                <CommunityMockPostAchievement />
              </div>
            </motion.div>

            {/* Bônus */}
            <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }} className="flex items-start gap-4 p-5 mb-8 rounded-2xl bg-white border-2 border-dashed border-apricot shadow-sm">
              <div className="w-11 h-11 rounded-xl bg-honey/40 flex items-center justify-center flex-shrink-0">
                <Gift className="w-5 h-5 text-paprika" />
              </div>
              <div>
                <p className="text-[11px] uppercase tracking-widest font-bold text-paprika mb-0.5">Bônus de entrada · grátis</p>
                <h3 className="font-bold text-gray-900 text-sm sm:text-base">{bonus.title}</h3>
                <p className="text-gray-500 text-sm mt-0.5">{bonus.subtitle}</p>
                <p className="text-xs text-gray-400 mt-1">Enviado por e-mail após confirmar o acesso.</p>
              </div>
            </motion.div>

            {/* CTA de entrada — convite, não venda */}
            <div className="max-w-md mx-auto text-center">
              <button
                onClick={() => setPhase("auth")}
                className="w-full flex items-center justify-center gap-2 bg-tomato hover:bg-paprika text-white px-6 py-4 rounded-full text-base font-bold shadow-md shadow-tomato/20 transition mb-3"
              >
                <Users className="w-5 h-5" />
                Quero fazer parte da comunidade
              </button>
              <p className="text-xs text-gray-400 leading-relaxed">
                Crie sua conta gratuitamente. Os planos aparecem depois do cadastro.
              </p>
            </div>

          </div>
        </main>
      </div>
    );
  }

  // ---------------------------------------------------------------------------
  // Render: Steps do quiz
  // ---------------------------------------------------------------------------
  const showSectionHeader =
    step?.section !== undefined &&
    (currentStep === 0 || steps[currentStep - 1].section !== step.section);

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-b from-white via-green-50/30 to-white">
      <header className="flex items-center justify-between px-6 py-5 max-w-2xl mx-auto w-full">
        <Link href="/" className="flex items-center gap-2 text-gray-800 font-semibold text-sm">
          <ChefHat className="w-5 h-5 text-tomato" />
          MelhorSabor
        </Link>
        <span className="text-xs text-gray-400">{currentStep + 1} de {TOTAL_STEPS}</span>
      </header>

      <div className="w-full bg-gray-100 h-1">
        <motion.div className="h-1 bg-tomato" initial={false} animate={{ width: `${progress}%` }} transition={{ duration: 0.4, ease: "easeOut" }} />
      </div>

      <main className="flex-1 flex flex-col items-center justify-center px-4 py-10">
        <div className="w-full max-w-lg">

          <AnimatePresence>
            {showSectionHeader && step?.section && (
              <motion.div key={`section-${step.section}`} initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} transition={{ duration: 0.3 }} className="mb-6 text-center">
                <span className="inline-block px-4 py-1.5 rounded-full text-xs font-semibold tracking-widest uppercase bg-apricot/30 text-paprika border border-apricot/60">
                  {step.section}
                </span>
              </motion.div>
            )}
          </AnimatePresence>

          <AnimatePresence mode="wait" custom={direction}>
            <motion.div key={step?.id} custom={direction} variants={slideVariants} initial="enter" animate="center" exit="exit">
              {step?.type === "notice" ? (
                <div className="text-center">
                  <div className="w-16 h-16 bg-honey/30 rounded-full flex items-center justify-center mx-auto mb-6 border border-apricot/40">
                    <HeartPulse className="w-8 h-8 text-tomato" />
                  </div>
                  <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-4">{step.question}</h2>
                  <p className="text-gray-500 text-sm leading-relaxed max-w-md mx-auto">{step.body}</p>
                </div>
              ) : (
                <>
                  <div className="mb-8 text-center">
                    <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-2">{step?.question}</h2>
                    {step?.subtitle && <p className="text-gray-500 text-sm">{step.subtitle}</p>}
                    {step?.type === "multi" && <p className="text-xs text-tomato/80 mt-1 font-medium">Pode selecionar mais de uma opção</p>}
                  </div>

                  <div className="flex flex-col gap-3">
                    {step?.options.map((option) => {
                      const sel = isSelected(option.id);
                      return (
                        <button
                          key={option.id}
                          onClick={() => selectOption(option.id)}
                          className={`flex items-center gap-4 px-5 py-4 rounded-2xl border-2 text-left transition-all duration-200 ${
                            sel ? "border-tomato bg-peach/30 shadow-sm" : "border-gray-200 bg-white hover:border-apricot hover:bg-peach/10"
                          }`}
                        >
                          <div className="flex-1 min-w-0">
                            <span className={`font-semibold text-sm block ${sel ? "text-paprika" : "text-gray-800"}`}>{option.label}</span>
                            {option.description && <span className="text-xs text-gray-400 block mt-0.5">{option.description}</span>}
                            {option.legend && <span className="text-[11px] uppercase tracking-wide text-tomato/60 block mt-1 font-medium">{option.legend}</span>}
                          </div>
                          {sel && (
                            <div className="w-5 h-5 rounded-full bg-tomato flex items-center justify-center flex-shrink-0">
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

          <div className="flex items-center justify-between mt-8">
            <button onClick={goBack} disabled={currentStep === 0} className="flex items-center gap-2 text-sm text-gray-400 hover:text-gray-700 disabled:opacity-0 transition">
              <ArrowLeft className="w-4 h-4" />
              Voltar
            </button>
            <button
              onClick={goNext}
              disabled={!answered}
              className="flex items-center gap-2 bg-tomato hover:bg-paprika disabled:bg-gray-200 disabled:text-gray-400 text-white px-6 py-3 rounded-full text-sm font-semibold transition"
            >
              {step?.type === "notice" ? "Entendi, continuar" : isLast ? "Ver meu resultado" : "Continuar"}
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>

          <p className="text-center text-xs text-gray-400 mt-6 leading-relaxed max-w-sm mx-auto">
            As recomendações do MelhorSabor têm caráter informativo e não substituem orientação de nutricionista, médico ou personal trainer.
          </p>
        </div>
      </main>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Componentes auxiliares
// ---------------------------------------------------------------------------
function CommunityPillar({ icon, title, text }: { icon: React.ReactNode; title: string; text: string }) {
  return (
    <div className="flex flex-col gap-2 p-4 rounded-2xl bg-white/80 border border-peach">
      <div className="w-9 h-9 rounded-xl bg-peach/60 flex items-center justify-center">{icon}</div>
      <h3 className="font-semibold text-sm text-gray-900">{title}</h3>
      <p className="text-xs text-gray-500 leading-relaxed">{text}</p>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Post 1 — prato com comentários em loop
// ---------------------------------------------------------------------------
const FOOD_COMMENTS = [
  { initial: "R", name: "Rafael T.", color: "from-sage/60 to-sage", text: "Que inspiração! Eu também tô na semana 3. Mandou bem! 🙌" },
  { initial: "C", name: "Camila O.", color: "from-apricot to-honey", text: "Adoro quinoa! Me manda a receita depois? 😍" },
  { initial: "P", name: "Pedro A.", color: "from-peach to-apricot", text: "15 minutos?? Preciso aprender isso!" },
  { initial: "J", name: "Juliana M.", color: "from-sage to-sage/80", text: "Minha terapeuta alimentar aprovaria essa escolha ✅" },
];

function CommunityMockPost() {
  const [liked, setLiked] = useState(false);
  const [commentIndex, setCommentIndex] = useState(0);
  const [visible, setVisible] = useState(false);

  // Primeiro comentário aparece após 1.5s, depois troca a cada 3s com fade
  useEffect(() => {
    const show = setTimeout(() => setVisible(true), 1500);
    return () => clearTimeout(show);
  }, []);

  useEffect(() => {
    if (!visible) return;
    const interval = setInterval(() => {
      setVisible(false);
      setTimeout(() => {
        setCommentIndex((i) => (i + 1) % FOOD_COMMENTS.length);
        setVisible(true);
      }, 350);
    }, 3000);
    return () => clearInterval(interval);
  }, [visible]);

  const comment = FOOD_COMMENTS[commentIndex];

  return (
    <div className="bg-white rounded-2xl border border-peach shadow-sm overflow-hidden flex flex-col">
      <div className="flex items-center gap-3 px-4 pt-4 pb-3">
        <div className="w-9 h-9 rounded-full bg-gradient-to-br from-apricot to-honey flex items-center justify-center text-white font-bold text-sm flex-shrink-0">M</div>
        <div>
          <p className="text-sm font-semibold text-gray-900">Mariana S.</p>
          <p className="text-[11px] text-gray-400">Objetivo: emagrecer · Semana 3</p>
        </div>
      </div>

      <div className="w-full h-36 bg-gradient-to-br from-honey/40 via-apricot/30 to-peach/50 flex items-center justify-center px-4">
        <div className="text-center">
          <Camera className="w-7 h-7 text-apricot mx-auto mb-1" />
          <p className="text-xs text-warm-gray font-medium">Salada de quinoa com legumes</p>
          <p className="text-[10px] text-gray-400 mt-0.5">Preparei em 15 min seguindo a sugestão do app!</p>
        </div>
      </div>

      <div className="flex items-center gap-4 px-4 py-2.5 border-t border-peach/50">
        <button onClick={() => setLiked((v) => !v)} className={`flex items-center gap-1.5 text-xs font-medium transition-colors ${liked ? "text-tomato" : "text-gray-400 hover:text-tomato"}`}>
          <Heart className={`w-4 h-4 transition-all ${liked ? "fill-tomato scale-110" : ""}`} />
          {liked ? "24" : "23"}
        </button>
        <span className="flex items-center gap-1.5 text-xs text-gray-400">
          <MessageCircle className="w-4 h-4" />
          {FOOD_COMMENTS.length} comentários
        </span>
      </div>

      {/* Comentário em loop com fade */}
      <div className="px-4 pb-4 min-h-[56px] flex items-start">
        <AnimatePresence mode="wait">
          {visible && (
            <motion.div
              key={commentIndex}
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -6 }}
              transition={{ duration: 0.3 }}
              className="flex gap-2 items-start w-full"
            >
              <div className={`w-7 h-7 rounded-full bg-gradient-to-br ${comment.color} flex items-center justify-center text-white font-bold text-[10px] flex-shrink-0`}>
                {comment.initial}
              </div>
              <div className="bg-nude rounded-xl px-3 py-2 flex-1">
                <p className="text-[11px] font-semibold text-gray-700">{comment.name}</p>
                <p className="text-xs text-gray-600 mt-0.5">{comment.text}</p>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Post 2 — conquista/evolução com comentários motivacionais em loop
// ---------------------------------------------------------------------------
const ACHIEVEMENT_COMMENTS = [
  { initial: "A", name: "Ana Paula", color: "from-tomato/60 to-paprika/80", text: "PARABÉNS! Você é uma inspiração pra mim 💪🔥" },
  { initial: "L", name: "Lucas F.", color: "from-sage to-sage/80", text: "Que jornada incrível! Tô começando agora e isso me motiva demais 🙏" },
  { initial: "B", name: "Beatriz N.", color: "from-honey to-apricot", text: "Meta batida! Você prova que é possível com consistência ✨" },
  { initial: "T", name: "Tiago R.", color: "from-apricot/70 to-peach", text: "Isso é resultado de semanas de foco e dedicação. Arrasou! 🎯" },
];

function CommunityMockPostAchievement() {
  const [commentIndex, setCommentIndex] = useState(0);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const show = setTimeout(() => setVisible(true), 2200);
    return () => clearTimeout(show);
  }, []);

  useEffect(() => {
    if (!visible) return;
    const interval = setInterval(() => {
      setVisible(false);
      setTimeout(() => {
        setCommentIndex((i) => (i + 1) % ACHIEVEMENT_COMMENTS.length);
        setVisible(true);
      }, 350);
    }, 3000);
    return () => clearInterval(interval);
  }, [visible]);

  const comment = ACHIEVEMENT_COMMENTS[commentIndex];

  return (
    <div className="bg-white rounded-2xl border border-peach shadow-sm overflow-hidden flex flex-col">
      <div className="flex items-center gap-3 px-4 pt-4 pb-3">
        <div className="w-9 h-9 rounded-full bg-gradient-to-br from-sage to-sage/70 flex items-center justify-center text-white font-bold text-sm flex-shrink-0">F</div>
        <div>
          <p className="text-sm font-semibold text-gray-900">Fernanda C.</p>
          <p className="text-[11px] text-gray-400">Objetivo: emagrecer · Semana 12</p>
        </div>
      </div>

      <div className="w-full h-36 bg-gradient-to-br from-sage/20 via-peach/30 to-honey/20 flex items-center justify-center px-4">
        <div className="text-center">
          <div className="flex items-center justify-center gap-3 mb-2">
            <div className="text-center">
              <p className="text-[10px] text-gray-400 uppercase tracking-wide">Início</p>
              <p className="text-xl font-extrabold text-gray-700">78 kg</p>
            </div>
            <ArrowRight className="w-5 h-5 text-tomato" />
            <div className="text-center">
              <p className="text-[10px] text-gray-400 uppercase tracking-wide">Agora</p>
              <p className="text-xl font-extrabold text-tomato">68 kg</p>
            </div>
          </div>
          <p className="text-xs text-warm-gray font-medium">Meta alcançada!</p>
          <p className="text-[10px] text-gray-400 mt-0.5">12 semanas com o MelhorSabor</p>
        </div>
      </div>

      <div className="flex items-center gap-4 px-4 py-2.5 border-t border-peach/50">
        <span className="flex items-center gap-1.5 text-xs font-medium text-tomato">
          <Heart className="w-4 h-4 fill-tomato" />
          147
        </span>
        <span className="flex items-center gap-1.5 text-xs text-gray-400">
          <MessageCircle className="w-4 h-4" />
          {ACHIEVEMENT_COMMENTS.length} comentários
        </span>
      </div>

      <div className="px-4 pb-4 min-h-[56px] flex items-start">
        <AnimatePresence mode="wait">
          {visible && (
            <motion.div
              key={commentIndex}
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -6 }}
              transition={{ duration: 0.3 }}
              className="flex gap-2 items-start w-full"
            >
              <div className={`w-7 h-7 rounded-full bg-gradient-to-br ${comment.color} flex items-center justify-center text-white font-bold text-[10px] flex-shrink-0`}>
                {comment.initial}
              </div>
              <div className="bg-nude rounded-xl px-3 py-2 flex-1">
                <p className="text-[11px] font-semibold text-gray-700">{comment.name}</p>
                <p className="text-xs text-gray-600 mt-0.5">{comment.text}</p>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
