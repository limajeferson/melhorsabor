import { Dumbbell, Home, ArrowRight, Check } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { FadeInView } from "@/components/ui/motion";

const audiences = [
  {
    icon: Dumbbell,
    badge: "Para você",
    title: "Cuide do seu corpo e da sua energia",
    description:
      "Quer emagrecer, ganhar massa, ter mais foco ou simplesmente viver com saúde? Recebe um plano de precisão para o seu objetivo.",
    items: [
      "Emagrecimento e ganho de massa",
      "Mais energia e foco no dia a dia",
      "Receitas alinhadas ao seu treino",
    ],
    accent: "bg-tomato",
    chip: "bg-honey/50 text-paprika",
    iconBg: "bg-tomato/10 text-tomato",
  },
  {
    icon: Home,
    badge: "Para sua casa",
    title: "Organize a alimentação da família",
    description:
      "Para mães e quem cuida da rotina de todos: planeje as refeições da semana, economize tempo e agrade a casa inteira.",
    items: [
      "Cardápio semanal sem dor de cabeça",
      "Receitas práticas e econômicas",
      "Variedade que a família toda aprova",
    ],
    accent: "bg-sage",
    chip: "bg-sage/20 text-sage",
    iconBg: "bg-sage/15 text-sage",
  },
];

export function Audiences() {
  return (
    <section className="py-24 px-4 bg-white">
      <div className="max-w-6xl mx-auto">
        <FadeInView>
          <h2 className="text-3xl md:text-4xl font-bold text-center text-gray-900 mb-4">
            Feito para quem você é
          </h2>
          <p className="text-center text-gray-600 mb-14 max-w-xl mx-auto text-lg">
            Não importa o seu objetivo — o MelhorSabor se adapta a você.
          </p>
        </FadeInView>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {audiences.map((a, i) => {
            const Icon = a.icon;
            return (
              <FadeInView key={a.badge} delay={i * 0.1}>
                <div className="h-full flex flex-col p-8 rounded-3xl bg-cream border border-peach/60 shadow-sm hover:shadow-lg transition-shadow">
                  <div className="flex items-center gap-4 mb-5">
                    <div
                      className={`p-3.5 rounded-2xl ${a.iconBg}`}
                      aria-hidden
                    >
                      <Icon className="w-7 h-7" />
                    </div>
                    <span
                      className={`px-3 py-1 rounded-full text-xs font-semibold uppercase tracking-wide ${a.chip}`}
                    >
                      {a.badge}
                    </span>
                  </div>
                  <h3 className="text-2xl font-bold text-gray-900 mb-3">
                    {a.title}
                  </h3>
                  <p className="text-gray-600 leading-relaxed mb-6">
                    {a.description}
                  </p>
                  <ul className="space-y-3 mb-8">
                    {a.items.map((item) => (
                      <li
                        key={item}
                        className="flex items-center gap-3 text-sm text-gray-700"
                      >
                        <span
                          className={`flex items-center justify-center w-5 h-5 rounded-full ${a.accent} text-white shrink-0`}
                          aria-hidden
                        >
                          <Check className="w-3 h-3" />
                        </span>
                        {item}
                      </li>
                    ))}
                  </ul>
                  <Button
                    className="mt-auto self-start bg-gray-900 hover:bg-gray-800 text-white rounded-full px-7 font-semibold"
                    asChild
                  >
                    <Link href="/onboarding">
                      Fazer meu teste
                      <ArrowRight className="w-4 h-4 ml-1" />
                    </Link>
                  </Button>
                </div>
              </FadeInView>
            );
          })}
        </div>
      </div>
    </section>
  );
}
