# Insights — Missão 5: PostHog reimplementado (analytics de produto)

> 🔗 Navegação: [[INDEX]] | [[CLAUDE_CODE_MASTER_PLAN]] | ← [[notes/Insights_Missao4]] | [[docs/POSTHOG_GUIDE]]

**Data:** 2026-06-08
**Status:** ✅ Concluída (código + docs) · ⏳ pendente `npm install` + vars na Vercel

---

## 🎯 Contexto da decisão

Na Missão 4 o PostHog foi instalado, depois **removido** (commit `4675925`) sob a premissa de "minimizar ferramentas terceiras". A remoção aconteceu **sem que o Founder entendesse o que o PostHog faz** — nem o NotebookLM nem o Claude Cowork explicaram o papel da ferramenta (validação de público, funil, segmentação, CRM, teste de campanha).

Após explicação, o Founder decidiu **reimplementar conscientemente**. PostHog não é "mais uma ferramenta" — é a base para responder a pergunta central da fase MVP: *existe público e o produto converte?*. Sentry mantido.

**Lição de processo:** remover ferramenta sem entender o trade-off é tão arriscado quanto adicionar sem justificar. Documentar o "porquê" (em [[docs/POSTHOG_GUIDE]]) evita repetir esse ciclo.

---

## 🎯 O que foi entregue

### 1. PostHog reimplementado — melhor que o original
- `components/providers/PostHogProvider.tsx` recriado **com captura de `$pageview`** por rota (o original desligava pageview e nunca capturava — sem isso não há funil). Pageview tracker isolado em `<Suspense>` (gotcha do `useSearchParams` no App Router).
- `person_profiles: "identified_only"` — anônimo não consome cota de perfil; menos dado pessoal armazenado (LGPD).

### 2. Taxonomia central de eventos — `lib/analytics.ts` (novo)
- Enum `AnalyticsEvent` + helpers `track()` e `identify()`.
- **Regra:** nenhuma string de evento solta no código. Nome inconsistente quebra funil silenciosamente.
- No-op quando não há key (dev local roda sem analytics).

### 3. Instrumentação do funil
- `waitlist-form.tsx`: `identify(email)` (CRM) + `waitlist_joined`.
- `onboarding/page.tsx`: `onboarding_started`, `onboarding_step_answered` (por etapa → mostra abandono), `onboarding_completed`.

### 4. Documentação (foco do pedido do Founder)
- `docs/POSTHOG_GUIDE.md` (novo) — o quê/por quê/como, casos de uso, taxonomia, LGPD.
- `INDEX.md`, `ECOSYSTEM_GUIDE.md` (sources NotebookLM) e `.env.example` atualizados.

---

## ⚠️ Pendências para ativar

1. **`npm install`** em `apps/frontend/` (reinstala `posthog-js`). Fechar VS Code/node antes (file locks no Windows — ver [[notes/Insights_Missao4]]).
2. **`npm run build`** para validar.
3. **Vars na Vercel** (Production + Preview): `NEXT_PUBLIC_POSTHOG_KEY`, `NEXT_PUBLIC_POSTHOG_HOST`.
4. Sem a key, o app funciona normal — só não envia analytics.

---

## 🧠 Decisões técnicas

| Decisão | Motivo |
|---|---|
| Pageview manual + `<Suspense>` | Padrão oficial PostHog p/ App Router; evita de-opt da árvore RSC |
| `identified_only` profiles | Economia de cota + menos dado pessoal (LGPD) |
| Taxonomia em `lib/analytics.ts` | Funis confiáveis; impede strings divergentes |
| `identify` por e-mail na waitlist | Liga eventos a pessoa → base de CRM/cohorts |
| Manter Sentry | Decisão do Founder: error monitoring tem valor próprio |

---

**Mantra:** "Simples > Complexo. Rápido > Perfeito. Documentado > Secreto."
