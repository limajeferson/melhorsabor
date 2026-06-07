import Link from "next/link";
import { ChefHat } from "lucide-react";

export default function LegalLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen flex flex-col bg-white">
      <header className="border-b border-gray-100 py-4 px-6">
        <Link
          href="/"
          className="flex items-center gap-2 w-fit hover:opacity-80 transition-opacity"
        >
          <div className="w-8 h-8 rounded-full bg-[hsl(var(--primary))] flex items-center justify-center">
            <ChefHat className="w-4 h-4 text-white" />
          </div>
          <span className="font-bold text-[hsl(var(--primary))] text-lg">
            MelhorSabor
          </span>
        </Link>
      </header>

      <main className="flex-1 max-w-3xl mx-auto w-full px-6 py-12">
        {children}
      </main>

      <footer className="border-t border-gray-100 py-6 px-6 text-center text-sm text-gray-400">
        <p>© 2026 MelhorSabor · melhorsabor.com.br</p>
        <div className="flex justify-center gap-6 mt-2">
          <Link href="/termos" className="hover:text-gray-600 transition-colors">
            Termos de Uso
          </Link>
          <Link
            href="/privacidade"
            className="hover:text-gray-600 transition-colors"
          >
            Política de Privacidade
          </Link>
        </div>
      </footer>
    </div>
  );
}
