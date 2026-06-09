import { Heart, MessageCircle, Trophy, Users } from "lucide-react";
import {
  FadeInView,
  StaggerContainer,
  StaggerItem,
} from "@/components/ui/motion";

const highlights = [
  {
    icon: Users,
    title: "Feed de quem busca o mesmo",
    description:
      "Conecte-se com pessoas que compartilham o seu objetivo e troquem experiências de verdade.",
  },
  {
    icon: Trophy,
    title: "Conquistas em conjunto",
    description:
      "Celebre cada vitória. A jornada fica mais leve — e mais divertida — quando é coletiva.",
  },
  {
    icon: Heart,
    title: "Pertencimento real",
    description:
      "Aqui ninguém caminha sozinho. Apoio diário para você não desistir do seu plano.",
  },
];

export function Community() {
  return (
    <section className="relative py-24 px-4 overflow-hidden bg-gradient-to-br from-tomato via-paprika to-apricot">
      <div
        aria-hidden
        className="pointer-events-none absolute -top-24 -right-24 w-[400px] h-[400px] rounded-full bg-honey/30 blur-3xl"
      />
      <div className="relative z-10 max-w-6xl mx-auto">
        <FadeInView className="text-center">
          <span className="inline-flex items-center gap-2 mb-5 px-4 py-1.5 rounded-full text-xs font-semibold uppercase tracking-wide bg-white/20 text-white backdrop-blur">
            <MessageCircle className="w-3.5 h-3.5" />
            Comunidade
          </span>
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4 max-w-2xl mx-auto">
            Você não vai mudar seus hábitos sozinho
          </h2>
          <p className="text-white/90 mb-14 max-w-xl mx-auto text-lg">
            Mais do que receitas: um ecossistema onde pessoas com o mesmo
            objetivo crescem juntas, todos os dias.
          </p>
        </FadeInView>

        <StaggerContainer className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {highlights.map((h) => {
            const Icon = h.icon;
            return (
              <StaggerItem key={h.title}>
                <div className="h-full p-7 rounded-3xl bg-white/15 border border-white/20 backdrop-blur hover:bg-white/20 transition-colors">
                  <div className="mb-5 p-3.5 rounded-2xl bg-white/20 w-fit">
                    <Icon className="w-7 h-7 text-white" />
                  </div>
                  <h3 className="text-lg font-semibold text-white mb-2">
                    {h.title}
                  </h3>
                  <p className="text-sm text-white/85 leading-relaxed">
                    {h.description}
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
