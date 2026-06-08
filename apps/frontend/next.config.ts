import type { NextConfig } from "next";
import { withSentryConfig } from "@sentry/nextjs";

const nextConfig: NextConfig = {
  // Otimizacoes para producao
  compress: true,
  poweredByHeader: false,

  // Turbopack: config vazia para silenciar erro no Next.js 16 (Turbopack é default)
  // withSentryConfig injeta webpack config; turbopack:{} diz que estamos cientes
  turbopack: {},

  // Imagens externas (adicionar dominios quando necessario)
  images: {
    formats: ["image/avif", "image/webp"],
    remotePatterns: [],
  },

  // Headers de seguranca
  async headers() {
    return [
      {
        source: "/(.*)",
        headers: [
          { key: "X-Frame-Options", value: "DENY" },
          { key: "X-Content-Type-Options", value: "nosniff" },
          { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
        ],
      },
    ];
  },
};

export default withSentryConfig(nextConfig, {
  // Silencia logs do Sentry no build
  silent: true,

  // Source maps — só faz upload se SENTRY_AUTH_TOKEN estiver configurado
  authToken: process.env.SENTRY_AUTH_TOKEN,

  // Desativa telemetria e wizards automáticos do Sentry
  telemetry: false,
  disableLogger: true,
});
