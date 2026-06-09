import { Leaf, Zap, Users, Store } from "lucide-react";
import {
  FadeInView,
  StaggerContainer,
  StaggerItem,
} from "@/components/ui/motion";

const features = [
  {
    icon: Leaf,
    title: "Curadoria com IA",
    description:
      "Receitas selecionadas com base nos seus objetivos, preferências e restrições alimentares.",
    bg: "bg-sage/20",
    fg: "text-sage",
  },
  {
    icon: Zap,
    title: "Performance humana",
    description:
      "Nutrição de precisão para energia, foco e bem-estar. Seu prato como ferramenta de alta performance.",
    bg: "bg-honey/40",
    fg: "text-tomato",
  },
  {
    icon: Users,
    title: "Comunidade ativa",
    description:
      "Um feed social onde você compartilha conquistas e cresce junto com quem busca o mesmo.",
    bg: "bg-peach",
    fg: "text-paprika",
  },
  {
    icon: Store,
    title: "Marketplace de criadores",
    description:
      "Chefs e nutricionistas compartilham e monetizam receitas verificadas por especialistas.",
    bg: "bg-apricot/40",
    fg: "text-paprika",
  },
];

export function Features() {
  return (
    <section className="py-24 px-4 bg-cream">
      <div className="max-w-6xl mx-auto">
        <FadeInView>
          <h2 className="text-3xl md:text-4xl font-bold text-center text-gray-900 mb-4">
            Um ecossistema completo
          </h2>
          <p className="text-center text-gray-600 mb-14 max-w-xl mx-auto text-lg">
            Tudo o que você precisa para comer com inteligência — num só lugar.
          </p>
        </FadeInView>

        <StaggerContainer className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {features.map((f) => {
            const Icon = f.icon;
            return (
              <StaggerItem key={f.title}>
                <div className="h-full flex flex-col items-start p-7 rounded-3xl bg-white border border-peach/60 shadow-sm hover:shadow-lg hover:-translate-y-1 transition-all group">
                  <div
                    className={`mb-5 p-3.5 rounded-2xl ${f.bg} group-hover:scale-110 transition-transform`}
                  >
                    <Icon className={`w-7 h-7 ${f.fg}`} />
                  </div>
                  <h3 className="text-base font-semibold text-gray-900 mb-2">
                    {f.title}
                  </h3>
                  <p className="text-sm text-gray-600 leading-relaxed">
                    {f.description}
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
