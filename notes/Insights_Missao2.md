# 💡 Insights — Missão 2: Next.js Bootstrap

**Data:** 2026-06-07  
**Duração:** ~1 sessão  
**Status:** ✅ Concluída  
**Próxima:** Missão 3 — Landing Page + Formulário de Captura de Emails

---

## ✅ O Que Foi Feito

### Next.js inicializado
- `apps/frontend/` — Next.js **16.2.7** (versão mais recente) com App Router
- TypeScript strict, Tailwind v4, ESLint configurados
- Build de produção validado: **✅ 0 erros, 0 warnings**

### shadcn/ui configurado manualmente
- O CLI `npx shadcn@latest init` é incompatível com Next.js 16 + Tailwind v4 (muito recentes)
- Solução: configuração manual criando `components.json`, `lib/utils.ts` e `components/ui/button.tsx`
- Deps instaladas: `class-variance-authority`, `clsx`, `tailwind-merge`, `lucide-react`, `@radix-ui/react-slot`

### Design System MelhorSabor
- `app/globals.css` — variáveis CSS do tema definidas:
  - **Verde primário:** `hsl(152, 55%, 30%)` (#2d6a4f)
  - **Laranja acento:** `hsl(25, 95%, 53%)` (laranja vitalidade)
  - Dark mode preparado (variáveis `.dark`)
- Fonte: Geist Sans (moderna, legível)

### Página Inicial (landing placeholder)
- Hero com tagline: *"O alimento é o código-fonte da sua performance"*
- Dois CTAs: "Lista de espera" + "Saiba mais"
- 3 feature cards: Curadoria IA | Performance Humana | Marketplace
- Footer com "Em desenvolvimento"

### Metadados SEO (layout.tsx)
- `title` com template: `"Página | MelhorSabor"`
- Open Graph (pt-BR), Twitter Card
- `robots` configurado para indexação
- `metadataBase` usando `NEXT_PUBLIC_APP_URL`
- Headers de segurança: `X-Frame-Options`, `X-Content-Type-Options`

### Vercel (próximo passo manual)
- `vercel.json` criado em `apps/frontend/`
- Vercel CLI disponível no sistema (`v54.9.1`)
- Auth requer navegador — etapa para o usuário

### Commits
- `feat(frontend)`: bootstrap Next.js 16
- `feat(frontend)`: shadcn/ui config manual
- `chore`: package-lock + CONTEXT_SYNC

---

## 💡 Decisões Tomadas

### Next.js 16 em vez de 14
- `create-next-app` instalou a versão mais recente (16.2.7 + React 19)
- **Mantido:** a arquitetura App Router é idêntica, compatibilidade futura melhor
- **Impacto:** shadcn CLI incompatível (resolvido com config manual)

### Tailwind v4 (diferença da v3)
- Usa `@import "tailwindcss"` (não `@tailwind base/components/utilities`)
- Configuração via CSS (`@theme inline`) em vez de `tailwind.config.js`
- Não há `tailwind.config.js` no projeto — isso é esperado e correto

### shadcn/ui Manual vs CLI
- CLI falhou com `ERR_INVALID_ARG_TYPE` (issue de compatibilidade com Next 16)
- Instalação manual é mais robusta e evita "magia negra" de CLI
- Componentes adicionais podem ser adicionados sob demanda nas próximas missões

---

## ⚠️ Pendências para o Usuário

### 🔴 Deploy na Vercel (5 minutos)
Conectar o repositório GitHub à Vercel:

**Opção A — Interface Web (recomendado):**
1. Acesse https://vercel.com/new
2. Importe `limajeferson/melhorsabor`
3. Em "Root Directory", defina: `apps/frontend`
4. Clique "Deploy"

**Opção B — CLI:**
```bash
cd C:\Users\jefer\Documents\Projetos\melhorsabor\apps\frontend
npx vercel --prod
# Seguir as instruções de autenticação no navegador
```

### 🟡 Variáveis de Ambiente na Vercel
Após conectar, adicionar em Vercel → Settings → Environment Variables:
```
NEXT_PUBLIC_APP_URL = https://melhorsabor.com.br
# (Supabase será adicionado na Missão 4)
```

---

## 📈 Métricas da Missão

| Métrica | Valor |
|---------|-------|
| Arquivos criados | 25+ |
| Build: erros | 0 |
| Build: warnings | 0 |
| Commits | 3 |
| Custo operacional | R$0 |
| Deps novas | 5 (shadcn base) |

---

## 🎯 Próxima Missão (3): Landing Page Real

Escopo sugerido para o próximo briefing ao NotebookLM:

1. Formulário de captura de email (waitlist) com Supabase
2. Animações com Framer Motion (se aprovado)
3. Página de receita placeholder (demonstração)
4. SEO: meta tags dinâmicas + sitemap.xml
5. `favicon.ico` e `og-image.png` com a identidade MelhorSabor

**Pré-requisito:** Deploy na Vercel (ver pendência acima)

---

*Gerado por: Claude Code (Cowork) | Missão 2 | 2026-06-07*
