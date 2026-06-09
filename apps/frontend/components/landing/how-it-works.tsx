import { ClipboardList, Sparkles, Salad, TrendingUp } from "lucide-react";
import {
  FadeInView,
  StaggerContainer,
  StaggerItem,
} from "@/components/ui/motion";

const steps = [
  {
    icon: ClipboardList,
    title: "1. Faça o diagnóstico",
    description:
      "Responda um teste rápido sobre seus objetivos, rotina e preferências. Leva só 2 minutos.",
    bg: "bg-honey/40",
    fg: "text-tomato",
  },
  {
    icon: Sparkles,
    title: "2. A IA monta seu plano",
    description:
      "Nossa inteligência cruza seus dados e gera um plano alimentar sob medida para o seu corpo.",
    bg: "bg-peach",
    fg: "text-paprika",
  },
  {
    icon: Salad,
    title: "3. Receba suas receitas",
    description:
      "Receitas segmentadas para o seu objetivo, fáceis de preparar e gostosas de verdade.",
    bg: "bg-sage/25",
    fg: "text-sage",
  },
  {
    icon: TrendingUp,
    title: "4. Evolua em comunidade",
    description:
      "Acompanhe sua jornada e cresça junto com pessoas que buscam o mesmo objetivo que você.",
    bg: "bg-apricot/40",
    fg: "text-paprika",
  },
];

export function HowItWorks() {
  return (
    <section className="py-24 px-4 bg-cream">
      <div className="max-w-6xl mx-auto">
        <FadeInView>
          <h2 className="text-3xl md:text-4xl font-bold text-center text-gray-900 mb-4">
            Do diagnóstico ao prato em 4 passos
          </h2>
          <p className="text-center text-gray-600 mb-14 max-w-xl mx-auto text-lg">
            Um caminho simples e personalizado — pensado para o seu corpo e a sua
            rotina.
          </p>
        </FadeInView>

        <StaggerContainer className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {steps.map((step) => {
            const Icon = step.icon;
            return (
              <StaggerItem key={step.title}>
                <div className="h-full flex flex-col items-start p-7 rounded-3xl bg-white border border-peach/60 shadow-sm hover:shadow-lg hover:-translate-y-1 transition-all group">
                  <div
                    className={`mb-5 p-3.5 rounded-2xl ${step.bg} group-hover:scale-110 transition-transform`}
                  >
                    <Icon className={`w-7 h-7 ${step.fg}`} />
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">
                    {step.title}
                  </h3>
                  <p className="text-sm text-gray-600 leading-relaxed">
                    {step.description}
                  </p>
                </div>
              </StaggerItem>
            );
          })}
        </StaggerContainer>
      </div>
    </section>
  );
}
