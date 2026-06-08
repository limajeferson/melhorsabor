# 📊 Guia PostHog — MelhorSabor

> 🔗 Navegação: [[INDEX]] | [[notes/Architectural_Recommendations]] | [[notes/Insights_Missao5]]

**Data:** 2026-06-08
**Status:** ✅ Ativo (reimplementado na Missão 5)
**Decisão do Founder:** manter o PostHog como ferramenta terceira *estratégica* — não é "mais uma ferramenta", é a base de validação de público e produto.

---

## 🎯 Por que o PostHog existe no projeto

O MelhorSabor está em fase **Fundação → MVP**, com waitlist + onboarding. A pergunta crítica desta fase não é "o código funciona?" — é **"existe público e o produto converte?"**. O PostHog responde exatamente isso.

Diferença essencial para o **Vercel Analytics** (que também usamos):

| | Vercel Analytics | PostHog |
|---|---|---|
| O que mede | Page views + Core Web Vitals | **Comportamento**: eventos, funis, conversão |
| Eventos customizados | ❌ | ✅ |
| Funil (passo a passo) | ❌ | ✅ |
| Segmentação de público | ❌ | ✅ |
| CRM / identificação de pessoa | ❌ | ✅ (`identify`) |
| Teste de campanha / A-B | ❌ | ✅ (feature flags) |
| Session replay | ❌ | ✅ |
| Custo | $0 | $0 (1M eventos/mês) |

**Resumo:** Vercel diz *quantos* entraram; PostHog diz *quem*, *de onde*, *o que fizeram* e *onde desistiram*.

---

## 🧩 Casos de uso no MelhorSabor

1. **Validação de público** — quantos visitantes viram a landing e quantos entraram na waitlist (taxa de conversão real, não achismo).
2. **Funil de conversão** — `$pageview` (landing) → `waitlist_joined` → `onboarding_started` → `onboarding_completed`. Mostra a % que cai em cada degrau.
3. **Segmentação** — agrupar usuários por resposta do onboarding (objetivo: emagrecer vs. massa; cozinha em casa vs. fora). Base para personalizar receitas e e-mails.
4. **CRM** — `identify(email)` liga todos os eventos de uma pessoa a um perfil. Permite listas de reativação e cohorts.
5. **Teste de campanha** — feature flags para testar headlines/CTAs diferentes e medir qual converte mais (sem deploy).
6. **Onde abandonam** — `onboarding_step_answered` por etapa revela em qual pergunta as pessoas desistem.

---

## 🛠 Como está implementado

| Arquivo | Função |
|---|---|
| `apps/frontend/components/providers/PostHogProvider.tsx` | Inicializa o SDK + captura `$pageview` por rota (isolado em `<Suspense>`) |
| `apps/frontend/lib/analytics.ts` | **Taxonomia central de eventos** + helpers `track()` e `identify()` |
| `apps/frontend/app/layout.tsx` | Envolve o app no `<PostHogProvider>` |
| `apps/frontend/components/waitlist-form.tsx` | `identify(email)` + `waitlist_joined` |
| `apps/frontend/app/onboarding/page.tsx` | `onboarding_started` / `_step_answered` / `_completed` |

### Regra de ouro: nomes de evento só em `lib/analytics.ts`

Nunca dispare `posthog.capture("string_solta")` espalhado pelo código. Toda string de evento vive no enum `AnalyticsEvent`. **Motivo:** um nome inconsistente (`waitlist_joined` vs `waitlistJoined`) quebra um funil silenciosamente e só se descobre semanas depois com dados perdidos.

### Taxonomia atual de eventos

| Evento | Quando dispara | Propriedades-chave |
|---|---|---|
| `$pageview` | toda mudança de rota | `$current_url` |
| `waitlist_joined` | submit com sucesso da waitlist | `source` |
| `onboarding_started` | abre `/onboarding` | `total_steps` |
| `onboarding_step_answered` | avança cada etapa | `step_id`, `step_index`, `answer` |
| `onboarding_completed` | conclui a última etapa | todas as respostas |

---

## ⚙️ Configuração (variáveis de ambiente)

```bash
NEXT_PUBLIC_POSTHOG_KEY=phc_xxx              # Project API Key (Settings → Project)
NEXT_PUBLIC_POSTHOG_HOST=https://us.i.posthog.com   # ou https://eu.i.posthog.com
```

- **Sem a key, o PostHog não inicializa** (`track`/`identify` viram no-op). Dev local roda sem analytics por padrão — comportamento intencional.
- Definir as duas variáveis no painel da **Vercel** (Production + Preview) para ativar em produção.

### `person_profiles: "identified_only"`

Só cria perfil de pessoa após `identify()`. Visitante anônimo não consome cota de perfil (MTU). Economiza o free tier e reduz dados pessoais armazenados (alinhado a LGPD).

---

## 🛡 LGPD

- A landing/`onboarding` deve manter o disclaimer e, idealmente, **consentimento** antes de session replay.
- Dados vão para servidores nos EUA (PostHog Cloud US). Para minimizar exposição, considerar o host **EU** (`eu.i.posthog.com`) e firmar o DPA do PostHog.
- A política de privacidade (`app/(legal)/privacidade/page.tsx`) já cita "PostHog Inc." como subprocessador — **manter atualizada**.
- Nenhum dado sensível (senha, saúde detalhada) deve ir como propriedade de evento. Respostas de onboarding são preferências, não dado sensível — ok.

---

## 📈 Próximos passos (quando houver tráfego)

- [ ] Criar o funil `landing → waitlist → onboarding` no painel PostHog.
- [ ] Definir cohort "objetivo = emagrecer" para primeira campanha de e-mail.
- [ ] Avaliar feature flag para testar 2 headlines da landing.
- [ ] Ligar session replay com banner de consentimento (LGPD).

---

**Mantra:** "Simples > Complexo. Rápido > Perfeito. Documentado > Secreto."
