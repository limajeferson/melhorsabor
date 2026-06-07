import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Otimizacoes para producao
  compress: true,
  poweredByHeader: false,

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

export default nextConfig;
