"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { ChefHat, Loader2, AlertCircle } from "lucide-react";
import Link from "next/link";
import { supabase } from "@/lib/supabase";

type Status = "loading" | "saving" | "success" | "error";

export default function OnboardingCallbackPage() {
  const router = useRouter();
  const [status, setStatus] = useState<Status>("loading");
  const [errorMsg, setErrorMsg] = useState("");

  useEffect(() => {
    async function handleCallback() {
      try {
        // Supabase coloca access_token no hash da URL após Magic Link
        // O SDK detecta automaticamente o hash e estabelece a sessão
        const {
          data: { session },
          error: sessionError,
        } = await supabase.auth.getSession();

        if (sessionError || !session) {
          // Aguarda brevemente — o SDK pode estar processando o hash
          await new Promise((res) => setTimeout(res, 1500));

          const retry = await supabase.auth.getSession();

          if (retry.error || !retry.data.session) {
            throw new Error("Sessão não encontrada após autenticação.");
          }
        }

        const {
          data: { session: finalSession },
        } = await supabase.auth.getSession();

        if (!finalSession) {
          throw new Error("Sessão inválida.");
        }

        setStatus("saving");

        // Recupera respostas do localStorage
        const raw = localStorage.getItem("onboarding_answers");
        const answers: Record<string, string | string[]> = raw
          ? JSON.parse(raw)
          : {};

        // Helpers para normalizar single (string) e multi (string[])
        const str = (v: unknown) => (typeof v === "string" ? v : null);
        const arr = (v: unknown) =>
          Array.isArray(v) ? (v as string[]) : v ? [v as string] : [];

        // Monta o payload para user_profiles (trilha pessoal + trilha casa/família)
        const profile = {
          id: finalSession.user.id,
          email: finalSession.user.email ?? null,
          publico: str(answers.publico),
          // Trilha pessoal
          objetivo: str(answers.objetivo),
          pratica: str(answers.pratica),
          academia: str(answers.academia),
          nivel: str(answers.nivel),
          cozinha: str(answers.cozinha),
          refeicao: str(answers.refeicao),
          animo: str(answers.animo),
          idade_range: str(answers.idade_range),
          biotipo: str(answers.biotipo),
          atividade: str(answers.atividade),
          restricoes: arr(answers.restricoes),
          // Trilha casa/família
          objetivo_casa: str(answers.objetivo_casa),
          tamanho_casa: str(answers.tamanho_casa),
          criancas: str(answers.criancas),
          tempo_preparo: str(answers.tempo_preparo),
          rotina_casa: str(answers.rotina_casa),
          restricoes_casa: arr(answers.restricoes_casa),
          desafio_casa: str(answers.desafio_casa),
          // Snapshot bruto (à prova de evolução do questionário)
          raw_answers: answers,
          updated_at: new Date().toISOString(),
        };

        const { error: upsertError } = await supabase
          .from("user_profiles")
          .upsert(profile, { onConflict: "id" });

        if (upsertError) {
          throw new Error(upsertError.message);
        }

        // Limpa o localStorage após salvar com sucesso
        localStorage.removeItem("onboarding_answers");

        setStatus("success");

        // Redireciona para /planos para o usuário escolher e pagar
        setTimeout(() => router.replace("/planos"), 2000);
      } catch (err) {
        const msg =
          err instanceof Error ? err.message : "Erro desconhecido.";
        setErrorMsg(msg);
        setStatus("error");
      }
    }

    handleCallback();
  }, [router]);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-4 bg-gradient-to-b from-white via-green-50/60 to-white">
      <Link
        href="/"
        className="flex items-center gap-2 text-green-800 font-semibold text-sm mb-10"
      >
        <ChefHat className="w-5 h-5" />
        MelhorSabor
      </Link>

      <div className="text-center max-w-sm">
        {(status === "loading" || status === "saving") && (
          <>
            <Loader2 className="w-10 h-10 text-green-600 animate-spin mx-auto mb-5" />
            <h2 className="text-xl font-bold text-gray-900 mb-2">
              {status === "loading" ? "Verificando acesso…" : "Salvando seu perfil…"}
            </h2>
            <p className="text-gray-500 text-sm">Só um momento.</p>
          </>
        )}

        {status === "success" && (
          <>
            <div className="text-5xl mb-5">🎉</div>
            <h2 className="text-xl font-bold text-gray-900 mb-2">
              Perfil salvo com sucesso!
            </h2>
            <p className="text-gray-500 text-sm">
              Redirecionando para a plataforma…
            </p>
          </>
        )}

        {status === "error" && (
          <>
            <AlertCircle className="w-10 h-10 text-red-500 mx-auto mb-5" />
            <h2 className="text-xl font-bold text-gray-900 mb-2">
              Algo deu errado
            </h2>
            <p className="text-gray-500 text-sm mb-5">{errorMsg}</p>
            <Link
              href="/onboarding"
              className="inline-block bg-green-700 hover:bg-green-800 text-white text-sm px-6 py-3 rounded-full font-semibold transition"
            >
              Tentar novamente
            </Link>
          </>
        )}
      </div>
    </div>
  );
}
