# 📋 INDEX — MelhorSabor

> Painel de controle do projeto. Primeira leitura obrigatória em qualquer nova sessão do Claude.
> Atualizado ao fim de cada missão.

**Data:** 2026-06-08 | **Fase:** 1 → 2 (transição) | **Missão concluída:** 4 ✅

---

## 🚦 Status Geral

| Componente | Status | Detalhe |
|------------|--------|---------|
| Repositório GitHub | ✅ | [limajeferson/melhorsabor](https://github.com/limajeferson/melhorsabor) |
| Deploy Vercel | ✅ | melhorsabor.com.br |
| Next.js 16 + App Router | ✅ | `apps/frontend/` |
| Supabase (São Paulo) | ✅ | `ljboadzbqzutwwogzmbq` |
| Waitlist funcional | ✅ | tabela `waitlist_emails` |
| PostHog analytics | ✅ | reimplementado (M5) c/ pageview + funil onboarding · ver [[docs/POSTHOG_GUIDE]] |
| Sentry error monitoring | ✅ | v8, client + server |
| Tipos Supabase (auto) | ✅ | `types/database.types.ts` |
| Landing Page animada | ✅ | framer-motion |
| LGPD (`/termos`, `/privacidade`) | ✅ | |
| Onboarding UI (`/onboarding`) | ✅ | 4 etapas qualificação |
| Supabase Auth | ⏳ | Missão 5 |
| Tabela `user_profiles` | ⏳ | Missão 5 |
| Sistema de receitas | ⏳ | Fase 3 |

---

## 🗺️ Mapa de Documentos

### Governança e Estratégia
- [[CLAUDE_CODE_MASTER_PLAN]] — roadmap macro 5 fases, **ler antes de qualquer missão nova**
- [[CONTEXT_SYNC.md]] — briefing atual gerado pelo NotebookLM, **ler no início de cada sessão**
- [[.claude/CLAUDE.md]] — regras não-negociáveis do projeto

### Arquitetura
- [[docs/BLUEPRINT]] — stack técnico, decisões arquiteturais, diagrama de camadas
- [[notes/Architectural_Recommendations]] — ADR: PostHog vs Mixpanel, Sentry vs Datadog
- [[docs/POSTHOG_GUIDE]] — por que/como do PostHog: funil, segmentação, CRM, eventos

### Visão de Produto
- [[notes/Product_Vision_Notes]] — posicionamento, onboarding, LGPD, afiliados, roadmap de features
- [[docs/RESUMO_EXECUTIVO_MELHORSABOR]] — pitch executivo do produto
- [[docs/ROADMAP_EXECUCAO]] — roadmap detalhado de execução
- [[docs/CARTA_ESTRATEGICA]] — carta estratégica fundacional

### Ecossistema de Ferramentas
- [[docs/ECOSYSTEM_GUIDE]] — guia de uso Claude + NotebookLM + Cowork
- [[docs/ECOSSISTEMA_EXPANDIDO]] — visão expandida do ecossistema
- [[docs/MULTIPLOS_MODELOS]] — estratégia multi-model
- [[docs/NOTEBOOKLM_INSTRUCOES_MELHORSABOR]] — instruções para o NotebookLM
- [[docs/CLAUDE_TEMPLATE_MELHORSABOR]] — template base para prompts

### Histórico de Missões
- [[notes/Insights_Missao1]] — setup inicial, estrutura de pastas, git
- [[notes/Insights_Missao2]] — Next.js, shadcn/ui, Tailwind, deploy Vercel
- [[notes/Insights_Missao3]] — landing animada, waitlist, LGPD, favicon, Supabase conectado
- [[notes/Insights_Missao4]] — PostHog, Sentry, tipos Supabase, onboarding UI
- [[notes/Insights_Missao5]] — PostHog reimplementado: funil, taxonomia de eventos, identify/CRM ← **mais recente**

---

## 🔄 Ciclo de Trabalho

```
NotebookLM → CONTEXT_SYNC.md → Claude Code → commit/push → Vercel deploy
     ↑                                                            ↓
  Jeferson ←←←←←←←← notes/Insights_MissaoX.md ←←←←←←←←←←←←←←←←←
```

---

## 📂 Estrutura de Pastas Chave

```
melhorsabor/
├── .claude/CLAUDE.md          ← regras do projeto
├── CONTEXT_SYNC.md.md         ← briefing atual (NotebookLM)
├── CLAUDE_CODE_MASTER_PLAN.md ← roadmap macro
├── INDEX.md                   ← este arquivo
├── apps/frontend/             ← Next.js 16 App Router
│   ├── app/
│   │   ├── onboarding/page.tsx
│   │   └── (legal)/termos|privacidade
│   ├── components/
│   │   ├── providers/PostHogProvider.tsx
│   │   └── waitlist-form.tsx
│   ├── types/database.types.ts ← gerado via Supabase MCP
│   ├── instrumentation.ts      ← Sentry server-side
│   └── .npmrc                  ← legacy-peer-deps (Sentry v8 + Next 16)
├── docs/                      ← documentos estratégicos
└── notes/                     ← insights por missão
```

---

## ⚡ Contexto Mínimo para Nova Sessão

Para iniciar qualquer sessão com contexto suficiente, ler nesta ordem:
1. `INDEX.md` (este arquivo) — estado atual
2. `CONTEXT_SYNC.md.md` — missão em andamento
3. `notes/Insights_MissaoX.md` (a mais recente) — o que foi feito

*Atualizado: 2026-06-08 | Versão: 1.5*
