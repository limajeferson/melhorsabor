import { ChefHat } from "lucide-react";

export function SiteFooter() {
  return (
    <footer className="py-10 px-4 border-t border-peach/60 bg-cream">
      <div className="max-w-6xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4 text-sm text-gray-500">
        <div className="flex items-center gap-2">
          <span
            className="flex items-center justify-center w-7 h-7 rounded-lg bg-tomato"
            aria-hidden
          >
            <ChefHat className="w-4 h-4 text-white" />
          </span>
          <p>© 2026 MelhorSabor · melhorsabor.com.br</p>
        </div>
        <div className="flex gap-6">
          <a href="/termos" className="hover:text-tomato transition-colors">
            Termos de Uso
          </a>
          <a href="/privacidade" className="hover:text-tomato transition-colors">
            Privacidade
          </a>
        </div>
      </div>
    </footer>
  );
}
