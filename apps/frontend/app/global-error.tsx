"use client";

import * as Sentry from "@sentry/nextjs";
import { useEffect } from "react";

/**
 * Handler global de erros de render (App Router).
 * Reporta ao Sentry e mostra um fallback amigável no lugar da tela branca.
 */
export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    Sentry.captureException(error);
  }, [error]);

  return (
    <html lang="pt-BR">
      <body
        style={{
          minHeight: "100vh",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          fontFamily: "sans-serif",
          background: "#fffaf3",
          color: "#1f2937",
          padding: "0 16px",
          textAlign: "center",
        }}
      >
        <h1 style={{ fontSize: 22, fontWeight: 700, marginBottom: 8 }}>
          Algo deu errado por aqui
        </h1>
        <p style={{ fontSize: 14, color: "#7a6f69", marginBottom: 24 }}>
          Já fomos avisados do problema. Tente recarregar a página.
        </p>
        <button
          onClick={reset}
          style={{
            background: "#f47b3a",
            color: "#fff",
            border: "none",
            borderRadius: 9999,
            padding: "12px 28px",
            fontSize: 14,
            fontWeight: 600,
            cursor: "pointer",
          }}
        >
          Tentar novamente
        </button>
      </body>
    </html>
  );
}
