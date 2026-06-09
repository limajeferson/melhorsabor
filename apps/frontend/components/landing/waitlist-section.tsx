import { FadeInView } from "@/components/ui/motion";
import { WaitlistForm } from "@/components/waitlist-form";

export function WaitlistSection() {
  return (
    <section className="py-24 px-4 bg-white">
      <FadeInView className="max-w-2xl mx-auto text-center flex flex-col items-center">
        <span className="inline-block mb-5 px-4 py-1.5 rounded-full text-xs font-semibold uppercase tracking-wide bg-peach text-paprika">
          Em breve
        </span>
        <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
          Entre na lista de espera
        </h2>
        <p className="text-gray-600 mb-8 text-lg max-w-md">
          Seja um dos primeiros a acessar o MelhorSabor e garanta vantagens
          exclusivas de fundador.
        </p>
        <WaitlistForm />
        <p className="mt-5 text-sm text-gray-500">
          Sem spam. Só o essencial. Cancele quando quiser.
        </p>
      </FadeInView>
    </section>
  );
}
