import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { PostHogProvider } from "@/components/providers/PostHogProvider";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const APP_URL = process.env.NEXT_PUBLIC_APP_URL ?? "https://melhorsabor.com.br";

export const metadata: Metadata = {
  title: {
    default: "MelhorSabor — O alimento é o código-fonte",
    template: "%s | MelhorSabor",
  },
  description:
    "Super-plataforma de receitas com IA. Descubra receitas personalizadas para sua saúde, energia e bem-estar.",
  keywords: ["receitas", "culinária", "saúde", "nutrição", "IA", "bem-estar"],
  authors: [{ name: "MelhorSabor" }],
  creator: "MelhorSabor",
  metadataBase: new URL(APP_URL),
  // Imagens OG/Twitter vêm da convenção app/opengraph-image.tsx
  openGraph: {
    type: "website",
    locale: "pt_BR",
    url: APP_URL,
    siteName: "MelhorSabor",
    title: "MelhorSabor — O alimento é o código-fonte",
    description:
      "Receitas com IA para potencializar sua saúde e performance humana.",
  },
  twitter: {
    card: "summary_large_image",
    title: "MelhorSabor",
    description: "Receitas com IA para potencializar sua performance.",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="pt-BR"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col bg-background text-foreground">
        <PostHogProvider>{children}</PostHogProvider>
      </body>
    </html>
  );
}
