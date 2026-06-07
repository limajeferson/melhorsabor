import { ChefHat, Leaf, Zap, Users } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  FadeUp,
  FadeInView,
  StaggerContainer,
  StaggerItem,
} from "@/components/ui/motion";
import { WaitlistForm } from "@/components/waitlist-form";

export default function HomePage() {
  return (
    <main className="flex flex-col min-h-screen">
      {/* Hero */}
      <section className="relative flex flex-col items-center justify-center flex-1 px-4 py-28 text-center overflow-hidden bg-gradient-to-b from-white via-green-50/60 to-white">
        <div
          aria-hidden
          className="pointer-events-none absolute -top-40 left-1/2 -translate-x-1/2 w-[700px] h-[700px] rounded-full opacity-20"
          style={{
            background:
              "radial-gradient(circle at 50% 50%, #52b788 0%, transparent 70%)",
          }}
        />

        <FadeUp delay={0}>
          <div className="flex items-center gap-3 mb-8">
            <div className="w-12 h-12 rounded-full bg-[hsl(var(--primary))] flex items-center justify-center shadow-lg">
              <ChefHat className="w-6 h-6 text-white" />
            </div>
            <span className="text-2xl font-bold text-[hsl(var(--primary))]">
              MelhorSabor
            </span>
          </div>
        </FadeUp>

        <FadeUp delay={0.1}>
          <span className="inline-block mb-5 px-4 py-1.5 rounded-full text-xs font-semibold tracking-widest uppercase bg-green-100 text-[hsl(var(--primary))] border border-green-200">
            Em breve · Junte-se à lista de espera
          </span>
        </FadeUp>

        <FadeUp delay={0.2}>
          <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight text-gray-900 max-w-3xl mb-6 leading-tight">
            O alimento é o{" "}
            <span className="text-[hsl(var(--primary))]">código-fonte</span>
            <br />
            da sua performance.
          </h1>
        </FadeUp>

        <FadeUp delay={0.3}>
          <p className="text-lg md:text-xl text-gray-500 max-w-xl mb-10 leading-relaxed">
            Receitas com IA, personalizadas para sua saúde, energia e bem-estar.
            Descubra o que o seu corpo precisa hoje.
          </p>
        </FadeUp>

        <FadeUp delay={0.42}>
          <WaitlistForm />
        </FadeUp>

        <FadeUp delay={0.52}>
          <p className="mt-5 text-sm text-gray-400">
            Sem spam. Só o essencial. Cancele quando quiser.
          </p>
        </FadeUp>
      </section>

      {/* Features */}
      <section className="py-24 px-4 bg-white">
        <div className="max-w-5xl mx-auto">
          <FadeInView>
            <h2 className="text-3xl font-bold text-center text-gray-900 mb-4">
              Performance começa no prato
            </h2>
            <p className="text-center text-gray-500 mb-14 max-w-lg mx-auto">
              Uma plataforma construída para quem leva saúde a sério — e quer
              prazer à mesa.
            </p>
          </FadeInView>

          <StaggerContainer className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <StaggerItem>
              <FeatureCard
                icon={<Leaf className="w-7 h-7 text-[hsl(var(--primary))]" />}
                title="Curadoria com IA"
                description="Receitas selecionadas com base nos seus objetivos de saúde, preferências e restrições alimentares."
                bg="bg-green-50"
              />
            </StaggerItem>
            <StaggerItem>
              <FeatureCard
                icon={<Zap className="w-7 h-7 text-[hsl(var(--accent))]" />}
                title="Performance Humana"
                description="Nutrição de precisão para energia, foco e bem-estar. Seu prato como ferramenta de alta performance."
                bg="bg-orange-50"
              />
            </StaggerItem>
            <StaggerItem>
              <FeatureCard
                icon={<Users className="w-7 h-7 text-[hsl(var(--primary))]" />}
                title="Marketplace de Criadores"
                description="Chefs e nutricionistas compartilham e monetizam receitas. Conteúdo verificado por especialistas."
                bg="bg-green-50"
              />
            </StaggerItem>
          </StaggerContainer>
        </div>
      </section>

      {/* CTA final */}
      <section className="py-20 px-4 bg-[hsl(var(--primary))]">
        <FadeInView className="max-w-2xl mx-auto text-center">
          <h2 className="text-3xl font-bold text-white mb-4">
            Pronto para comer com inteligência?
          </h2>
          <p className="text-green-200 mb-8 text-lg">
            Entre na lista de espera e seja um dos primeiros a experimentar.
          </p>
          <Button
            size="lg"
            className="bg-white text-[hsl(var(--primary))] hover:bg-green-50 px-10 py-6 text-base rounded-full font-semibold shadow-lg"
            asChild
          >
            <a href="#waitlist">Quero entrar na lista</a>
          </Button>
        </FadeInView>
      </section>

      {/* Footer */}
      <footer className="py-8 px-4 border-t border-gray-100 bg-white">
        <div className="max-w-5xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4 text-sm text-gray-400">
          <p>© 2026 MelhorSabor · melhorsabor.com.br</p>
          <div className="flex gap-6">
            <a href="/termos" className="hover:text-gray-600 transition-colors">
              Termos de Uso
            </a>
            <a
              href="/privacidade"
              className="hover:text-gray-600 transition-colors"
            >
              Privacidade
            </a>
          </div>
        </div>
      </footer>
    </main>
  );
}

function FeatureCard({
  icon,
  title,
  description,
  bg,
}: {
  icon: React.ReactNode;
  title: string;
  description: string;
  bg: string;
}) {
  return (
    <div className="flex flex-col items-start p-7 rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition-shadow bg-white group">
      <div className={`mb-5 p-3 rounded-xl ${bg} group-hover:scale-110 transition-transform`}>
        {icon}
      </div>
      <h3 className="text-base font-semibold text-gray-900 mb-2">{title}</h3>
      <p className="text-sm text-gray-500 leading-relaxed">{description}</p>
    </div>
  );
}
