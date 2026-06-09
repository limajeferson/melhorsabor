import { ChefHat, ArrowRight, Sparkles } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { FadeUp } from "@/components/ui/motion";

export function Hero() {
  return (
    <section className="relative flex flex-col items-center justify-center px-4 pt-28 pb-24 text-center overflow-hidden bg-gradient-to-b from-cream via-peach/40 to-cream">
      {/* Blobs decorativos */}
      <div
        aria-hidden
        className="pointer-events-none absolute -top-32 -left-24 w-[480px] h-[480px] rounded-full bg-honey/40 blur-3xl"
      />
      <div
        aria-hidden
        className="pointer-events-none absolute -bottom-40 -right-24 w-[520px] h-[520px] rounded-full bg-apricot/30 blur-3xl"
      />
      <div
        aria-hidden
        className="pointer-events-none absolute top-1/3 left-1/2 -translate-x-1/2 w-[360px] h-[360px] rounded-full bg-sage/20 blur-3xl"
      />

      <div className="relative z-10 flex flex-col items-center">
        <FadeUp delay={0}>
          <div className="flex items-center gap-3 mb-8">
            <div className="w-12 h-12 rounded-2xl bg-tomato flex items-center justify-center shadow-lg shadow-tomato/30">
              <ChefHat className="w-6 h-6 text-white" />
            </div>
            <span className="text-2xl font-bold tracking-tight text-gray-900">
              MelhorSabor
            </span>
          </div>
        </FadeUp>

        <FadeUp delay={0.1}>
          <span className="inline-flex items-center gap-2 mb-6 px-4 py-1.5 rounded-full text-xs font-semibold tracking-wide uppercase bg-white/70 backdrop-blur text-tomato border border-peach">
            <Sparkles className="w-3.5 h-3.5" />
            Diagnóstico gratuito com IA
          </span>
        </FadeUp>

        <FadeUp delay={0.2}>
          <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight text-gray-900 max-w-3xl mb-6 leading-[1.08]">
            O alimento é o{" "}
            <span className="text-tomato">código-fonte</span>
            <br className="hidden sm:block" /> da sua performance.
          </h1>
        </FadeUp>

        <FadeUp delay={0.3}>
          <p className="text-lg md:text-xl text-gray-600 max-w-xl mb-10 leading-relaxed">
            Descubra o que o seu corpo precisa hoje. Faça o teste gratuito e
            receba um plano alimentar personalizado — com receitas, comunidade e
            performance num só lugar.
          </p>
        </FadeUp>

        <FadeUp delay={0.42}>
          <div className="flex flex-col sm:flex-row gap-4 items-center justify-center">
            <Button
              size="lg"
              className="bg-tomato hover:bg-paprika text-white px-9 py-6 text-base rounded-full font-semibold shadow-lg shadow-tomato/30 transition-colors"
              asChild
            >
              <Link href="/onboarding">
                Fazer o teste gratuito
                <ArrowRight className="w-4 h-4 ml-1" />
              </Link>
            </Button>
            <Button
              size="lg"
              variant="outline"
              className="border-peach bg-white/70 text-gray-800 hover:bg-white px-8 py-6 text-base rounded-full font-semibold backdrop-blur transition-colors"
              asChild
            >
              <a href="#waitlist">Entrar na lista de espera</a>
            </Button>
          </div>
        </FadeUp>

        <FadeUp delay={0.52}>
          <p className="mt-6 text-sm text-gray-500">
            Leva 2 minutos · 100% gratuito · Sem cartão de crédito
          </p>
        </FadeUp>
      </div>
    </section>
  );
}
