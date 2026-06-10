import type { MetadataRoute } from "next";

const APP_URL = process.env.NEXT_PUBLIC_APP_URL ?? "https://melhorsabor.com.br";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
      // Páginas privadas/transacionais não devem ser indexadas
      disallow: ["/api/", "/_next/", "/perfil", "/planos", "/onboarding/callback"],
    },
    sitemap: `${APP_URL}/sitemap.xml`,
  };
}
