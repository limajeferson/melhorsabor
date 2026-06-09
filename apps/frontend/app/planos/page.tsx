"use client";

/**
 * /planos — Página de assinatura
 *
 * Acessada após o onboarding/callback ou diretamente por usuários logados.
 * Mostra a tabela de preços e integra com Mercado Pago Checkout Pro.
 *
 * Fluxo:
 *  1. Verifica sessão → redireciona para /onboarding se não logado
 *  2. Se já assinante ativo → redireciona para /perfil
 *  3. Exibe planos + botão "Assinar" → POST /api/checkout → redirect para MP
 *  4. Retorno do MP: URL params ?status=approved|rejected|pending → trata resultado
 */

import { useEffect, useState, useCallback } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { ChefHat, Check, Gift, Sparkles, Loader2, ArrowRight, ShieldCheck, AlertCircle } from "lucide-react";
import Link from "next/link";
import { supabase } from "@/lib/supabase";
import { PLANS, type Plan, brl, monthlyEquivalent, discountPercent, deriveBonus } from "@/lib/offer";
import type { User } from "@supabase/supabase-js";

type CheckoutStatus = "idle" | "loading" | "redirecting" | "error";
type PaymentStatus = "none" | "approved" | "rejected" | "pending" | "sandbox";

export default function PlanosPage() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [user, setUser] = useState<User | null>(null);
  const [sessionReady, setSessionReady] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState<Plan["id"]>("anual");
  const [checkoutStatus, setCheckoutStatus] = useState<CheckoutStatus>("idle");
  const [checkoutError, setCheckoutError] = useState("");
  const [paymentStatus, setPaymentStatus] = useState<PaymentStatus>("none");
  const [answers, setAnswers] = useState<Record<string, string | string[]>>({});

  // Lê status de retorno do MP (back_urls)
  useEffect(() => {
    const status = searchParams.get("status") as PaymentStatus | null;
    const plan = searchParams.get("plan");
    if (status && status !== "none") {
      setPaymentStatus(status);
      if (plan && PLANS.find((p) => p.id === plan)) {
        setSelectedPlan(plan as Plan["id"]);
      }
    }
  }, [searchParams]);

  // Recupera answers do localStorage para o bônus personalizado
  useEffect(() => {
    try {
      const raw = localStorage.getItem("onboarding_answers");
      if (raw) setAnswers(JSON.parse(raw));
    } catch { /* silently fail */ }
  }, []);

  // Verifica sessão
  useEffect(() => {
    supabase.auth.getSession().then(async ({ data: { session } }) => {
      if (!session) {
        router.replace("/onboarding");
        return;
      }
      setUser(session.user);

      // Se já tem assinatura ativa, vai para /perfil
      const { data: profile } = await supabase
        .from("user_profiles")
        .select("subscription_status")
        .eq("id", session.user.id)
        .single();

      if (profile?.subscription_status === "active") {
        router.replace("/perfil");
        return;
      }

      setSessionReady(true);
    });
  }, [router]);

  const handlePaymentApproved = useCallback(async (paymentId: string | null) => {
    if (!user) return;
    // Atualiza perfil via client (webhook fará o mesmo, mas é bom ter confirmação imediata)
    await supabase.from("user_profiles").update({
      subscription_status: "active",
      selected_plan: selectedPlan,
      ...(paymentId ? { mp_payment_id: paymentId } : {}),
      subscribed_at: new Date().toISOString(),
    }).eq("id", user.id);
  }, [user, selectedPlan]);

  useEffect(() => {
    if (paymentStatus === "approved") {
      const paymentId = searchParams.get("payment_id");
      handlePaymentApproved(paymentId);
    }
  }, [paymentStatus, searchParams, handlePaymentApproved]);

  async function handleCheckout() {
    if (!user) return;
    setCheckoutStatus("loading");
    setCheckoutError("");
    try {
      const res = await fetch("/api/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          planId: selectedPlan,
          userId: user.id,
          userEmail: user.email ?? "",
        }),
      });
      const data = (await res.json()) as { init_point?: string; sandbox?: boolean; error?: string };
      if (!res.ok || data.error) {
        setCheckoutError(data.error ?? "Erro ao iniciar pagamento. Tente novamente.");
        setCheckoutStatus("error");
        return;
      }
      if (data.sandbox) {
        // Sem token configurado — simula sandbox local
        setPaymentStatus("sandbox");
        setCheckoutStatus("idle");
        return;
      }
      setCheckoutStatus("redirecting");
      window.location.href = data.init_point!;
    } catch {
      setCheckoutError("Falha de conexão. Verifique sua internet e tente novamente.");
      setCheckoutStatus("error");
    }
  }

  const bonus = deriveBonus(answers);

  // ─── Loading / redirect ───────────────────────────────────────────────────
  if (!sessionReady && paymentStatus === "none") {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-cream to-peach/30">
        <Loader2 className="w-8 h-8 text-tomato animate-spin" />
      </div>
    );
  }

  // ─── Retorno do MP: Pagamento aprovado ────────────────────────────────────
  if (paymentStatus === "approved" || paymentStatus === "sandbox") {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center px-4 bg-gradient-to-b from-cream via-honey/20 to-cream">
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
          className="text-center max-w-sm"
        >
          <div className="text-6xl mb-6">🎉</div>
          <h1 className="text-2xl font-bold text-gray-900 mb-3">
            {paymentStatus === "sandbox" ? "Modo sandbox ativado!" : "Acesso liberado!"}
          </h1>
          <p className="text-gray-500 text-sm mb-8 leading-relaxed">
            {paymentStatus === "sandbox"
              ? "O token do Mercado Pago ainda não está configurado. Configure MERCADOPAGO_ACCESS_TOKEN na Vercel para ir a produção."
              : `Seu plano ${selectedPlan} está ativo. Bem-vindo à comunidade MelhorSabor!`}
          </p>
          <Link
            href="/perfil"
            className="inline-flex items-center gap-2 bg-tomato hover:bg-paprika text-white px-8 py-3.5 rounded-full text-sm font-bold shadow-md shadow-tomato/20 transition"
          >
            Ir para meu perfil <ArrowRight className="w-4 h-4" />
          </Link>
        </motion.div>
      </div>
    );
  }

  // ─── Retorno do MP: Pagamento rejeitado ───────────────────────────────────
  if (paymentStatus === "rejected") {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center px-4 bg-gradient-to-b from-cream to-peach/30">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center max-w-sm"
        >
          <AlertCircle className="w-12 h-12 text-red-400 mx-auto mb-5" />
          <h1 className="text-xl font-bold text-gray-900 mb-2">Pagamento não aprovado</h1>
          <p className="text-gray-500 text-sm mb-6">
            Verifique os dados do cartão ou tente outro meio de pagamento.
          </p>
          <button
            onClick={() => setPaymentStatus("none")}
            className="bg-tomato hover:bg-paprika text-white px-6 py-3 rounded-full text-sm font-semibold transition"
          >
            Tentar novamente
          </button>
        </motion.div>
      </div>
    );
  }

  // ─── Retorno do MP: Pagamento pendente ────────────────────────────────────
  if (paymentStatus === "pending") {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center px-4 bg-gradient-to-b from-cream to-peach/30">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center max-w-sm"
        >
          <div className="text-5xl mb-5">⏳</div>
          <h1 className="text-xl font-bold text-gray-900 mb-2">Pagamento em processamento</h1>
          <p className="text-gray-500 text-sm mb-6 leading-relaxed">
            Seu pagamento está sendo analisado. Assim que for confirmado, seu acesso será liberado.
          </p>
          <Link href="/" className="text-sm text-tomato hover:text-paprika font-medium transition">
            Voltar para a home
          </Link>
        </motion.div>
      </div>
    );
  }

  // ─── Tela principal de planos ─────────────────────────────────────────────
  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-b from-cream via-nude/60 to-cream">
      <header className="flex items-center justify-between px-6 py-5 max-w-3xl mx-auto w-full">
        <Link href="/" className="flex items-center gap-2 text-gray-800 font-semibold text-sm">
          <ChefHat className="w-5 h-5 text-tomato" />
          MelhorSabor
        </Link>
        <Link href="/perfil" className="text-xs text-gray-400 hover:text-gray-600 transition">
          Ir para meu perfil →
        </Link>
      </header>
      <div className="w-full bg-gray-100 h-1">
        <div className="h-1 bg-tomato w-full" />
      </div>

      <main className="flex-1 px-4 py-10">
        <div className="w-full max-w-3xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="text-center mb-8"
          >
            <span className="inline-flex items-center gap-2 mb-4 px-4 py-1.5 rounded-full text-xs font-semibold uppercase tracking-wide bg-white text-tomato border border-peach shadow-sm">
              <Sparkles className="w-3.5 h-3.5" />
              Bem-vindo à comunidade!
            </span>
            <h1 className="text-3xl sm:text-4xl font-extrabold text-gray-900 mb-3 leading-tight">
              Escolha como você quer continuar
            </h1>
            <p className="text-gray-500 text-sm max-w-lg mx-auto">
              Todos os planos incluem acesso à comunidade e ao seu bônus personalizado enviado por e-mail após a confirmação.
            </p>
          </motion.div>

          {/* Bônus personalizado */}
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="flex items-start gap-4 p-5 mb-8 rounded-2xl bg-white border-2 border-dashed border-apricot"
          >
            <div className="w-10 h-10 rounded-xl bg-honey/40 flex items-center justify-center flex-shrink-0">
              <Gift className="w-5 h-5 text-paprika" />
            </div>
            <div>
              <p className="text-[11px] uppercase tracking-widest font-bold text-paprika mb-0.5">
                Bônus de entrada · grátis em qualquer plano
              </p>
              <h3 className="font-bold text-gray-900 text-sm">{bonus.title}</h3>
              <p className="text-gray-500 text-xs mt-0.5">{bonus.subtitle}</p>
            </div>
          </motion.div>

          {/* Tabela de preços */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
            {PLANS.map((plan, i) => {
              const sel = selectedPlan === plan.id;
              const desc = discountPercent(plan);
              const mensal = monthlyEquivalent(plan);
              return (
                <motion.button
                  key={plan.id}
                  type="button"
                  onClick={() => setSelectedPlan(plan.id)}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.1 + i * 0.07 }}
                  className={`relative text-left rounded-2xl border-2 p-5 transition-all duration-200 ${
                    sel
                      ? "border-tomato bg-white shadow-lg scale-[1.02]"
                      : "border-gray-200 bg-white/70 hover:border-apricot hover:bg-white"
                  } ${plan.highlight ? "sm:-mt-2" : ""}`}
                >
                  {plan.badge && (
                    <span className="absolute -top-3 left-1/2 -translate-x-1/2 whitespace-nowrap px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider bg-tomato text-white shadow">
                      {plan.badge}
                    </span>
                  )}
                  <div className="flex items-center justify-between mb-3">
                    <span className="font-bold text-gray-900">{plan.name}</span>
                    <span
                      className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${
                        sel ? "border-tomato bg-tomato" : "border-gray-300"
                      }`}
                    >
                      {sel && <Check className="w-3 h-3 text-white" />}
                    </span>
                  </div>
                  <div className="mb-1">
                    <span className="text-2xl font-extrabold text-gray-900">{brl(plan.price)}</span>
                    {plan.months > 1 && (
                      <span className="text-xs text-gray-400"> /{plan.months} meses</span>
                    )}
                  </div>
                  <p className="text-xs text-gray-500">
                    Equivale a <strong className="text-gray-700">{brl(mensal)}</strong>/mês
                  </p>
                  {desc > 0 ? (
                    <span className="inline-block mt-3 px-2 py-0.5 rounded-md text-[11px] font-bold bg-sage/20 text-green-800">
                      Economize {desc}%
                    </span>
                  ) : (
                    <span className="inline-block mt-3 px-2 py-0.5 rounded-md text-[11px] font-medium text-gray-400">
                      Plano base
                    </span>
                  )}
                  <p className="mt-2 text-[11px] text-gray-400 flex items-center gap-1">
                    <Gift className="w-3 h-3 text-paprika" />
                    Bônus incluso
                  </p>
                </motion.button>
              );
            })}
          </div>

          {/* CTA de pagamento */}
          <div className="max-w-md mx-auto">
            <AnimatePresence>
              {checkoutStatus === "error" && checkoutError && (
                <motion.p
                  initial={{ opacity: 0, y: -4 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0 }}
                  className="text-sm text-red-500 text-center mb-3"
                >
                  {checkoutError}
                </motion.p>
              )}
            </AnimatePresence>

            <button
              onClick={handleCheckout}
              disabled={checkoutStatus === "loading" || checkoutStatus === "redirecting"}
              className="w-full flex items-center justify-center gap-2 bg-tomato hover:bg-paprika disabled:bg-gray-200 disabled:text-gray-400 text-white px-6 py-4 rounded-full text-base font-bold shadow-md shadow-tomato/20 transition"
            >
              {checkoutStatus === "loading" && <Loader2 className="w-5 h-5 animate-spin" />}
              {checkoutStatus === "redirecting" && <Loader2 className="w-5 h-5 animate-spin" />}
              {checkoutStatus === "idle" || checkoutStatus === "error"
                ? <>Assinar plano {selectedPlan} <ArrowRight className="w-5 h-5" /></>
                : checkoutStatus === "loading"
                ? "Preparando pagamento…"
                : "Redirecionando para Mercado Pago…"}
            </button>

            <div className="flex items-center justify-center gap-4 mt-4">
              <span className="flex items-center gap-1 text-xs text-gray-400">
                <ShieldCheck className="w-3.5 h-3.5 text-sage" />
                Pagamento seguro
              </span>
              <span className="text-xs text-gray-300">·</span>
              <span className="text-xs text-gray-400">Cancele quando quiser</span>
            </div>
            <p className="text-center text-xs text-gray-400 mt-2">
              Após o pagamento confirmado, seu bônus chega por e-mail.
            </p>
          </div>
        </div>
      </main>
    </div>
  );
}
