/**
 * Home — MelhorSabor
 *
 * Server Component (sem "use client") para SEO maximo.
 * As animacoes scroll-telling ficam em <ScrollStory> (Client Component).
 */

import type { Metadata } from "next";
import { ScrollStory } from "@/components/landing/scroll-story";
import { SiteFooter } from "@/components/landing/site-footer";

export const metadata: Metadata = {
  title: "MelhorSabor",
  description: "Diagnostico gratuito com IA, receitas personalizadas e comunidade de apoio.",
};

export default function HomePage() {
  return (
    <main className="flex flex-col min-h-screen bg-cream overflow-x-hidden">
      <h1 className="sr-only">MelhorSabor</h1>
      <ScrollStory />
      <SiteFooter />
    </main>
  );
}
