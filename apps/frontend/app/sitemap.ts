import type { MetadataRoute } from "next";

const APP_URL = process.env.NEXT_PUBLIC_APP_URL ?? "https://melhorsabor.com.br";

export default function sitemap(): MetadataRoute.Sitemap {
  return [
    {
      url: APP_URL,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 1,
    },
    {
      url: `${APP_URL}/termos`,
      lastModified: new Date("2026-06-07"),
      changeFrequency: "monthly",
      priority: 0.3,
    },
    {
      url: `${APP_URL}/privacidade`,
      lastModified: new Date("2026-06-07"),
      changeFrequency: "monthly",
      priority: 0.3,
    },
  ];
}
