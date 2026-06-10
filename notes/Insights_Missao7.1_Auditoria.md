# 🔍 Insights — Missão 7.1: Auditoria Geral (Performance, Segurança, UX)

**Data:** 2026-06-09
**Escopo:** Auditoria completa do frontend, fluxo de pagamento, banco (RLS), CI/CD, SEO e observabilidade — com correções aplicadas.

---

## 🔴 Achados críticos (corrigidos no código)

### 1. Auto-ativação de assinatura pelo browser (grave)
- `/planos` gravava `subscription_status: "active"` direto do client após o redirect do MP.
- A política RLS `user_profiles_update_own` permite ao usuário atualizar **qualquer coluna** da própria linha — ou seja, qualquer pessoa logada conseguia se tornar "assinante ativa" pelo console do browser, sem pagar.
- **Correção (código):** ativação agora é exclusiva do webhook (server-side, service role). O client nunca grava colunas de pagamento.
- **Correção (banco):** preparada em `supabase/migrations/20260609_004_protect_subscription_columns.sql` — **pendente de aprovação** (regra: não alterar segurança do Supabase sem confirmação).

### 2. `/api/checkout` confiava no body
- Recebia `userId`/`userEmail` do client → permitia criar checkout (e gravar `selected_plan`/`mp_preference_id`) em nome de outro usuário.
- **Correção:** rota agora exige `Authorization: Bearer <access_token>` e deriva usuário/e-mail do token validado via `getUserFromToken()` (`lib/supabase-server.ts`).

### 3. Webhook do Mercado Pago sem validação de assinatura
- **Correção:** validação HMAC-SHA256 do header `x-signature` (manifesto oficial do MP) quando `MERCADOPAGO_WEBHOOK_SECRET` estiver configurada. Sem a secret, mantém o comportamento anterior (re-consulta o pagamento na API do MP — defesa secundária que já existia).

### 4. Build de produção quebrado sem env
- `lib/supabase.ts` criava o client no escopo do módulo → `next build` falhava ("supabaseUrl is required") em qualquer ambiente sem env (local, CI).
- **Correção:** client do browser com inicialização lazy (Proxy); client de servidor movido para `lib/supabase-server.ts` (separação browser/server). `.env.local` preenchido com URL + anon key (valores públicos).

### 5. CI nunca funcionou
- Node 18 (Next 16 exige ≥20.9), `npm ci` dentro de `apps/frontend` (sem lockfile — o lockfile é da raiz, via workspaces) e `cache-dependency-path` apontando para arquivo inexistente.
- **Correção:** Node 20, install/lint/build a partir da raiz. `engines` da raiz atualizado para `>=20.9.0`.

### 6. Sentry inativo em produção
- O build usava Turbopack e o Sentry v8 **não carrega no browser** com Turbopack → zero monitoramento de erros em prod (o dev já usava `--webpack`).
- **Correção:** `build: next build --webpack`. (Alternativa futura: upgrade para @sentry/nextjs v10+, que suporta Turbopack.)

---

## 🟡 Achados médios (corrigidos)

- **Código morto no onboarding:** a fase "plans" (~120 linhas, com `alert("Integração de pagamento em breve")`) era inalcançável — o fluxo real vai para `/planos` após o callback. Removida, junto com imports/estado órfãos.
- **`useSearchParams` sem Suspense em `/planos`:** padrão exigido pelo App Router; página envolvida em boundary próprio.
- **Lint vermelho (4 erros):** aspas sem escape em `/privacidade` e `setState` síncrono em effects no `/planos` (convertidos para lazy initializers). Lint agora verde.
- **Timezone do check-in (`/perfil`):** `toISOString()` usa UTC — depois das 21h no Brasil o check-in caía no dia seguinte. Corrigido com data local.
- **OG image fantasma:** `metadata` apontava para `/og-image.png` que nunca existiu → compartilhamentos sem imagem. Substituída por `app/opengraph-image.tsx` (gerada em build, zero asset).
- **Callback do onboarding com paleta antiga (verde):** atualizado para a paleta apetite/pastel.
- **PostHog sem `identify()`:** funil quebrava na conversão (eventos anônimos ≠ pessoa). `identify(user.id, { email })` adicionado no callback; novos eventos `plans_viewed`, `checkout_started`, `payment_approved/rejected/pending` instrumentados em `/planos`.
- **SEO:** `/onboarding` adicionado ao sitemap; `/perfil`, `/planos` e `/onboarding/callback` bloqueados no robots; SVGs default do template Next removidos de `public/`.

---

## 📋 Lições

1. **RLS "update own row" é permissão por linha, não por coluna.** Toda coluna sensível gravada pelo servidor (status de pagamento, plano) precisa de proteção adicional (trigger ou view) — o frontend nunca é a barreira.
2. **CI que nunca rodou verde é pior que sem CI** — dá sensação de proteção. Os 4 erros de lint entraram na main porque o pipeline quebrava antes do lint.
3. **Turbopack vs. ecossistema:** Next 16 usa Turbopack por default, mas Sentry v8 não o suporta. Sempre conferir warnings de build — o aviso estava lá desde a Missão 4.
4. **Client de DB em escopo de módulo** quebra build/prerender. Lazy-init é o padrão seguro para SDKs que dependem de env.

---

## ⏭️ Próximos passos sugeridos

- Aplicar a migração 004 (após aprovação) — é a única barreira real contra fraude de assinatura.
- Configurar `MERCADOPAGO_WEBHOOK_SECRET` no painel do MP + Vercel.
- Considerar upgrade do Sentry para v10 (suporte a Turbopack) quando houver folga.
- Testes E2E do funil (onboarding → auth → planos → sandbox) na Missão 8+.
