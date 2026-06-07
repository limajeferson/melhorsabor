# 💡 Insights — Missão 3: Landing Dinâmica, Waitlist & Fundações Legais

**Data:** 2026-06-07  
**Status:** ✅ Concluída  
**Build:** ✅ 0 erros · 0 warnings · 7 rotas geradas  
**Próxima:** Missão 4 — Supabase real + PostHog + Sentry

---

## ✅ O Que Foi Entregue

### 1. framer-motion — Design Humanizado
- `components/ui/motion.tsx` — biblioteca de primitivos de animação reutilizáveis
- `FadeUp` — para heroes e títulos (fade + slide de baixo)
- `FadeInView` — scroll reveal ao entrar no viewport
- `ScaleIn` — cards e badges com scale suave
- `StaggerContainer` + `StaggerItem` — entrada sequencial de listas
- Landing Page completamente reanimada: blob decorativo, badge "Em breve", hero animado, features em stagger, seção CTA verde final
- Todos os componentes de animação são `"use client"` — zero impacto no SSR

### 2. Waitlist + Supabase
- `components/waitlist-form.tsx` — formulário inline (email + botão), usa `useActionState` do React 19
- `app/actions/waitlist.ts` — Server Action com validação Zod v4, verificação de duplicata, mensagens humanizadas
- `lib/supabase.ts` — cliente browser + `createServerClient()` com tipagem genérica `SupabaseClient<Database>`
- `types/database.ts` — tipos manuais para a tabela `waitlist_emails` (substituto até `supabase gen types` na M4)
- `supabase/migrations/20260607_001_waitlist_emails.sql` — migration pronta com RLS: anon pode inserir, service_role pode ler
- **Status:** código completo, pronto para conectar. Falta criar o projeto no Supabase Dashboard.

### 3. Compliance Legal (LGPD)
- `app/(legal)/layout.tsx` — layout compartilhado com header e footer para páginas legais
- `app/(legal)/termos/page.tsx` — Termos de Uso: 8 seções cobrindo uso aceitável, IP, limitação de responsabilidade, foro SP
- `app/(legal)/privacidade/page.tsx` — Política de Privacidade: tabela de finalidades com base legal LGPD, DPO, direitos do titular, cookies, segurança
- `robots: { index: false }` nas páginas legais — não indexadas por buscadores
- Compliance com: art. 7º I e IX LGPD, art. 18 (direitos do titular), art. 33 (transferência internacional), Lei 9.610/98

### 4. APM Research
- `notes/Architectural_Recommendations.md` — documento completo com análise de 5 opções
- **Decisão:** stack de 3 camadas: Vercel Analytics (grátis imediato) + PostHog (1M eventos/mês) + Sentry (5K erros/mês)
- Projeção: suficiente para 10K usuários/mês sem custo
- OpenTelemetry reservado para Fase 4 (escala)

### 5. Assets & SEO
- `app/icon.svg` — favicon SVG com identidade MelhorSabor (folha verde)
- `app/sitemap.ts` — sitemap dinâmico Next.js para `/`, `/termos`, `/privacidade`
- `app/robots.ts` — robots.txt gerado programaticamente
- Footer com links para `/termos` e `/privacidade` no layout principal

---

## 💡 Decisões Técnicas

### React 19 `useActionState` em vez de `useState` + fetch
- `useActionState` é o padrão recomendado no Next.js App Router com Server Actions
- Zero estado manual, zero `fetch` no cliente, zero endpoint API exposto
- Estado de loading (`isPending`) gerenciado automaticamente pelo React

### Zod v4 — `.issues` em vez de `.errors`
- Zod v4 (instalada como dep transitiva) removeu o alias `.errors`
- Mudança: `parsed.error.errors[0]` → `parsed.error.issues[0]`
- Documentado como breaking change no migration guide do Zod v4

### Supabase TypeScript — `Relationships: []` obrigatório
- Supabase v2 exige campo `Relationships` na definição de cada tabela
- Sem ele, `from("tableName")` resolve para `never` → build quebra
- Correção: adicionar `Relationships: []` ao tipo manual da tabela

### Route Group `(legal)` para layout isolado
- Next.js route groups `(nome)` permitem layouts diferentes sem afetar a URL
- `/termos` e `/privacidade` têm header/footer próprios sem poluir o layout raiz

---

## ⚠️ Pendências para o Usuário

### 🔴 Criar projeto no Supabase (15 minutos)
1. Acesse https://app.supabase.com → New Project
2. Nome: `melhorsabor` | Região: South America (São Paulo)
3. Copie `Project URL` e `anon key` → adicione no painel Vercel:
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - `SUPABASE_SERVICE_ROLE_KEY`
4. No SQL Editor do Supabase, execute o conteúdo de:
   `supabase/migrations/20260607_001_waitlist_emails.sql`

### 🟡 Ativar Vercel Analytics
- Vercel Dashboard → seu projeto → Analytics → Enable
- Zero código necessário

---

## 📈 Métricas da Missão

| Métrica | Valor |
|---------|-------|
| Arquivos criados | 14 |
| Arquivos modificados | 5 |
| Rotas no build | 7 |
| Build: erros | 0 |
| Build: warnings | 0 |
| Custo operacional | R$0 |
| Bugs TypeScript corrigidos | 2 |

---

*Gerado por: Claude Code (Cowork) | Missão 3 | 2026-06-07*
