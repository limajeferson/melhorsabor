import { ArrowRight } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { FadeInView } from "@/components/ui/motion";

export function FinalCta() {
  return (
    <section className="relative py-24 px-4 overflow-hidden bg-gradient-to-b from-cream to-peach/50">
      <div
        aria-hidden
        className="pointer-events-none absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[300px] rounded-full bg-honey/30 blur-3xl"
      />
      <FadeInView className="relative z-10 max-w-2xl mx-auto text-center">
        <h2 className="text-3xl md:text-5xl font-extrabold text-gray-900 mb-5 leading-tight">
          Descubra o que o seu corpo precisa
        </h2>
        <p className="text-gray-700 mb-10 text-lg md:text-xl">
          Faça o teste gratuito agora e receba seu plano alimentar personalizado
          em minutos.
        </p>
        <Button
          size="lg"
          className="bg-tomato hover:bg-paprika text-white px-10 py-7 text-lg rounded-full font-semibold shadow-xl shadow-tomato/30 transition-colors"
          asChild
        >
          <Link href="/onboarding">
            Fazer o teste gratuito
            <ArrowRight className="w-5 h-5 ml-1" />
          </Link>
        </Button>
        <p className="mt-5 text-sm text-gray-500">
          Leva 2 minutos · 100% gratuito · Sem cartão de crédito
        </p>
      </FadeInView>
    </section>
  );
}
