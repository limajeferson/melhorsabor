import { Button } from "@/components/ui/button";
import { ChefHat, Leaf, Zap, Users } from "lucide-react";

export default function HomePage() {
  return (
    <main className="flex flex-col min-h-screen">
      {/* Hero */}
      <section className="flex flex-col items-center justify-center flex-1 px-4 py-24 text-center bg-gradient-to-b from-white to-green-50">
        <div className="flex items-center gap-3 mb-8">
          <div className="w-12 h-12 rounded-full bg-[hsl(var(--primary))] flex items-center justify-center">
            <ChefHat className="w-6 h-6 text-white" />
          </div>
          <span className="text-2xl font-bold text-[hsl(var(--primary))]">
            MelhorSabor
          </span>
        </div>

        <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight text-gray-900 max-w-3xl mb-6">
          O alimento e o{" "}
          <span className="text-[hsl(var(--primary))]">codigo-fonte</span>
          <br />
          da sua performance.
        </h1>

        <p className="text-lg md:text-xl text-gray-600 max-w-xl mb-10">
          Receitas com IA personalizadas para sua saude, energia e bem-estar.
          Descubra o que o seu corpo precisa hoje.
        </p>

        <div className="flex flex-col sm:flex-row gap-4 mb-16">
          <Button
            size="lg"
            className="bg-[hsl(var(--primary))] hover:bg-[hsl(var(--primary))]/90 text-white px-8 py-6 text-base rounded-full"
          >
            Quero entrar na lista de espera
          </Button>
          <Button
            size="lg"
            variant="outline"
            className="border-[hsl(var(--primary))] text-[hsl(var(--primary))] px-8 py-6 text-base rounded-full hover:bg-green-50"
          >
            Saiba mais
          </Button>
        </div>

        <p className="text-sm text-gray-400">
          Em breve - junte-se a centenas na lista de espera
        </p>
      </section>

      {/* Features */}
      <section className="py-20 px-4 bg-white">
        <div className="max-w-5xl mx-auto">
          <h2 className="text-3xl font-bold text-center text-gray-900 mb-12">
            Performance comeca no prato
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <FeatureCard
              icon={<Leaf className="w-8 h-8 text-[hsl(var(--primary))]" />}
              title="Curadoria com IA"
              description="Receitas selecionadas por inteligencia artificial com base nos seus objetivos de saude e preferencias."
            />
            <FeatureCard
              icon={<Zap className="w-8 h-8 text-[hsl(var(--accent))]" />}
              title="Performance Humana"
              description="Nutricao de precisao para energia, foco e bem-estar. Seu prato como ferramenta de alta performance."
            />
            <FeatureCard
              icon={<Users className="w-8 h-8 text-[hsl(var(--primary))]" />}
              title="Marketplace de Criadores"
              description="Chefs e nutricionistas compartilham e monetizam receitas. Conteudo verificado por especialistas."
            />
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-8 px-4 border-t border-gray-100 text-center text-sm text-gray-400">
        <p>2026 MelhorSabor - melhorsabor.com.br - Em desenvolvimento</p>
      </footer>
    </main>
  );
}

function FeatureCard({
  icon,
  title,
  description,
}: {
  icon: React.ReactNode;
  title: string;
  description: string;
}) {
  return (
    <div className="flex flex-col items-center text-center p-6 rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition-shadow">
      <div className="mb-4 p-3 rounded-full bg-green-50">{icon}</div>
      <h3 className="text-lg font-semibold text-gray-900 mb-2">{title}</h3>
      <p className="text-sm text-gray-500 leading-relaxed">{description}</p>
    </div>
  );
}
