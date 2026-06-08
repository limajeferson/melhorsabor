import * as Sentry from "@sentry/nextjs";

Sentry.init({
  dsn: process.env.NEXT_PUBLIC_SENTRY_DSN,

  // Performance: amostragem de 10% em produção, 100% em dev
  tracesSampleRate: process.env.NODE_ENV === "production" ? 0.1 : 1.0,

  // Session replay: 10% em produção
  replaysSessionSampleRate: 0.1,
  replaysOnErrorSampleRate: 1.0,

  // Não inicializa sem DSN configurado
  enabled: !!process.env.NEXT_PUBLIC_SENTRY_DSN,

  debug: process.env.NODE_ENV === "development",
});
