"use client";

import posthog from "posthog-js";
import { PostHogProvider as PHProvider, usePostHog } from "posthog-js/react";
import { Suspense, useEffect } from "react";
import { usePathname, useSearchParams } from "next/navigation";

/**
 * Captura $pageview manualmente a cada mudança de rota (App Router).
 *
 * Isolado em um componente próprio porque `useSearchParams()` força o
 * Next a renderizar a árvore no cliente. Envolvido em <Suspense> no
 * provider, o de-opt fica contido só aqui — o resto do app continua RSC.
 */
function PageviewTracker() {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const ph = usePostHog();

  useEffect(() => {
    if (!pathname || !ph) return;

    let url = window.origin + pathname;
    const qs = searchParams?.toString();
    if (qs) url += `?${qs}`;

    ph.capture("$pageview", { $current_url: url });
  }, [pathname, searchParams, ph]);

  return null;
}

export function PostHogProvider({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    const key = process.env.NEXT_PUBLIC_POSTHOG_KEY;
    const host =
      process.env.NEXT_PUBLIC_POSTHOG_HOST ?? "https://eu.i.posthog.com";

    if (!key) return; // não inicializa sem key (dev local sem .env)

    posthog.init(key, {
      api_host: host,
      capture_pageview: false, // controlamos manualmente via PageviewTracker
      capture_pageleave: true, // necessário para métricas de bounce/tempo
      persistence: "localStorage+cookie",
      person_profiles: "identified_only", // só cria perfil após identify() — economiza MTU/eventos
      loaded: (ph) => {
        if (process.env.NODE_ENV === "development") ph.debug();
      },
    });
  }, []);

  return (
    <PHProvider client={posthog}>
      <Suspense fallback={null}>
        <PageviewTracker />
      </Suspense>
      {children}
    </PHProvider>
  );
}
