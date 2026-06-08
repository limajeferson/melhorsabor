// Next.js instrumentation hook — carregado no startup do servidor
// Usado pelo Sentry para captura de erros server-side (App Router)
export async function register() {
  if (process.env.NEXT_RUNTIME === "nodejs") {
    await import("./sentry.server.config");
  }

  if (process.env.NEXT_RUNTIME === "edge") {
    await import("./sentry.server.config");
  }
}
