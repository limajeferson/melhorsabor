"use client";

import { motion } from "framer-motion";
import { BookOpen, ChefHat, Leaf, Zap, ArrowRight, Star } from "lucide-react";
import Link from "next/link";

const SAMPLE_CHAPTERS = [
  { icon: Zap,       text: "Alimentação e energia real no dia a dia" },
  { icon: ChefHat,   text: "30 receitas rápidas (menos de 20 minutos)" },
  { icon: Leaf,      text: "Como montar seu prato por perfil" },
];

export function EbookSection() {
  return (
    <section
      id="ebook"
      aria-label="Guia gratuito personalizado"
      className="bg-nude py-20 px-4"
    >
      <div className="max-w-4xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 32 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
          className="flex flex-col md:flex-row items-center gap-10 bg-white rounded-3xl p-8 md:p-12 shadow-sm border border-peach"
        >
          {/* Mockup visual do guia */}
          <div className="w-full md:w-5/12 flex justify-center flex-shrink-0">
            <motion.div
              initial={{ rotate: -4, scale: 0.95 }}
              whileInView={{ rotate: 0, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1], delay: 0.1 }}
              className="relative w-52 h-64 md:w-56 md:h-72"
            >
              {/* Sombra do livro */}
              <div className="absolute inset-0 translate-x-3 translate-y-3 rounded-2xl bg-apricot/40 blur-sm" />
              {/* Capa */}
              <div className="relative h-full rounded-2xl bg-gradient-to-br from-tomato via-apricot to-honey flex flex-col items-center justify-between p-6 shadow-xl">
                <div className="flex items-center gap-1.5 self-start">
                  <ChefHat className="w-4 h-4 text-white/80" />
                  <span className="text-[10px] font-bold text-white/80 uppercase tracking-widest">
                    MelhorSabor
                  </span>
                </div>
                <BookOpen className="w-16 h-16 text-white/90" strokeWidth={1.5} />
                <div className="text-center">
                  <p className="text-white font-extrabold text-base leading-tight">
                    Guia de Nutrição
                  </p>
                  <p className="text-white/70 text-xs mt-1">Personalizado para você</p>
                </div>
              </div>
              {/* Badge grátis */}
              <motion.div
                animate={{ rotate: [0, 4, -4, 0] }}
                transition={{ duration: 3, repeat: Infinity, ease: "easeInOut", repeatDelay: 2 }}
                className="absolute -top-3 -right-3 w-12 h-12 rounded-full bg-sage flex items-center justify-center shadow-md"
              >
                <Star className="w-5 h-5 text-white fill-white" />
              </motion.div>
            </motion.div>
          </div>

          {/* Texto */}
          <div className="flex-1 text-center md:text-left">
            <span className="inline-block px-3 py-1 bg-sage/20 text-sage font-bold text-xs uppercase tracking-widest rounded-full mb-4">
              Material Gratuito
            </span>

            <h2 className="text-2xl md:text-3xl font-extrabold text-gray-900 mb-3 leading-tight">
              Seu guia de nutrição{" "}
              <span className="text-tomato">personalizado</span> — de graça
            </h2>

            <p className="text-warm-gray text-sm leading-relaxed mb-6 max-w-md">
              Ao fazer o teste de 2 minutos, nosso sistema monta um guia único
              para o seu perfil, objetivo e rotina. Sem fórmulas genéricas —
              só o que funciona para você.
            </p>

            <ul className="space-y-2 mb-8">
              {SAMPLE_CHAPTERS.map(({ icon: Icon, text }) => (
                <li key={text} className="flex items-center gap-2.5 text-sm text-gray-700">
                  <span className="w-6 h-6 rounded-full bg-honey/40 flex items-center justify-center flex-shrink-0">
                    <Icon className="w-3.5 h-3.5 text-paprika" />
                  </span>
                  {text}
                </li>
              ))}
            </ul>

            <Link
              href="/onboarding"
              className="inline-flex items-center gap-2 bg-tomato hover:bg-paprika text-white px-8 py-4 rounded-full font-bold text-sm shadow-md shadow-tomato/20 transition-colors duration-200"
            >
              Receber meu guia grátis
              <ArrowRight className="w-4 h-4" />
            </Link>

            <p className="text-xs text-warm-gray/60 mt-3">
              Leva 2 minutos · 100% gratuito · Sem cartão de crédito
            </p>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
