# 🗺️ CLAUDE CODE MASTER PLAN — MelhorSabor

> Roadmap macro das 5 fases de desenvolvimento.
> Este documento é a bússola estratégica — atualizar a cada fase concluída.

**Data de criação:** 2026-06-07 | **Última atualização:** 2026-06-08
**Status atual:** Fase 1 ✅ completa → entrando na Fase 2
**Leitura rápida:** ver [[INDEX]] para estado atual do projeto

---

## 📊 Visão Geral das Fases

| Fase | Nome | Status | Estimativa |
|------|------|--------|-----------|
| 1 | Fundação & Estrutura | ✅ Concluída | 1 semana |
| 2 | MVP — Onboarding + Auth + Receitas | 🔄 Em andamento | 2 semanas |
| 3 | Core Features — Receitas + IA | ⏳ Pendente | 3 semanas |
| 4 | Monetização + SEO + Marketing | ⏳ Pendente | 2 semanas |
| 5 | Escala + Performance + Analytics | ⏳ Pendente | contínuo |

---

## 🏗 Fase 1 — Fundação & Estrutura

**Objetivo:** Repositório, governança e estrutura base prontos.

### Missão 1: Setup Inicial ✅
- [x] Criar `.claude/CLAUDE.md` com regras do projeto
- [x] Criar `CLAUDE_CODE_MASTER_PLAN.md`
- [x] Estruturar pastas: `apps/`, `docs/`, `notes/`, `scripts/`
- [x] `.gitignore`, `.env.example`, `package.json`, `README.md`
- [x] GitHub Actions CI (`lint + build`)
- [x] Inicializar git + criar repositório no GitHub
- [x] `docs/BLUEPRINT.md` (arquitetura)
- [x] [[notes/Insights_Missao1]]

### Missão 2: Next.js Bootstrap ✅
- [x] Inicializar Next.js 16 com App Router
- [x] Configurar Tailwind v4 + shadcn/ui
- [x] Layout base + tema MelhorSabor (verde/laranja)
- [x] Página inicial com hero animado (framer-motion)
- [x] Deploy no Vercel
- [x] [[notes/Insights_Missao2]]

---

## 🎯 Fase 2 — MVP

**Objetivo:** Onboarding completo + auth + primeiras receitas.

### Missão 3: Landing Page + Waitlist ✅
- [x] Hero section animado com proposta de valor
- [x] Formulário de captura de email (waitlist → Supabase)
- [x] SEO básico (meta tags, Open Graph, sitemap.xml)
- [x] `/termos` e `/privacidade` (LGPD)
- [x] Supabase projeto criado (ref: `ljboadzbqzutwwogzmbq`)
- [x] [[notes/Insights_Missao3]]

### Missão 4: Telemetria + Onboarding UI ✅
- [x] Tipos Supabase auto-gerados (`types/database.types.ts`)
- [x] PostHog analytics (evento `waitlist_joined`)
- [x] Sentry error monitoring (v8, App Router)
- [x] `/onboarding` — 4 etapas com framer-motion
- [x] Evento `onboarding_completed` com perfil completo
- [x] [[notes/Insights_Missao4]]
- [x] [[notes/Product_Vision_Notes]] criado

### Missão 5: Auth + Perfil de Usuário ⏳
- [ ] Supabase Auth (email + OAuth Google)
- [ ] Tabela `user_profiles` com respostas do onboarding
- [ ] Salvar onboarding no banco ao finalizar
- [ ] Link "Monte seu perfil" na landing → `/onboarding`
- [ ] Página `/perfil` (proteção por autenticação)

---

## 🍽️ Fase 3 — Core Features

**Objetivo:** Produto funcional com receitas e IA.

### Missão 5: Sistema de Receitas
- [ ] CRUD de receitas (criador → plataforma)
- [ ] Upload de imagens (Supabase Storage)
- [ ] Busca e filtragem
- [ ] Paginação e infinite scroll

### Missão 6: IA Integrada
- [ ] Sugestão de receitas por ingredientes disponíveis
- [ ] Análise nutricional automática
- [ ] Tags automáticas via IA
- [ ] Curadoria editorial (Claude API)

### Missão 7: Usuário e Perfil
- [ ] Autenticação completa (email + OAuth)
- [ ] Perfil de criador vs consumidor
- [ ] Sistema de favoritos
- [ ] Histórico de receitas vistas

---

## 💰 Fase 4 — Monetização + Marketing

**Objetivo:** Primeiras receitas reais (R$).

### Missão 8: Afiliados
- [ ] Links de afiliado Amazon/ML nos ingredientes
- [ ] Tracking de cliques (analytics próprio)
- [ ] Relatório de conversões

### Missão 9: AdSense
- [ ] Integração Google AdSense
- [ ] Posicionamento estratégico (sem UX comprometida)
- [ ] A/B test de posicionamento

### Missão 10: SEO Programático
- [ ] Geração de páginas SEO para cada receita
- [ ] Sitemap automático
- [ ] Schema.org (Recipe markup)
- [ ] Blog com artigos gerados por IA (revisados)

---

## 🚀 Fase 5 — Escala

**Objetivo:** Crescimento sustentável, performance e dados.

### Missão 11+: Escala
- [ ] CDN para imagens (Cloudflare)
- [ ] Analytics avançado (eventos de usuário)
- [ ] Otimização de Core Web Vitals
- [ ] Marketplace de criadores (pagamentos Stripe)
- [ ] App mobile (React Native / Expo)

---

## 📐 Princípios Arquiteturais (Imutáveis)

1. **Custo Zero:** Tudo no tier gratuito enquanto possível
2. **LGPD Compliance:** Desde o dia 1
3. **Modular:** Cada feature é independente
4. **Tipado:** TypeScript strict no frontend
5. **Testado:** Lógica crítica tem testes

---

## 🔄 Ciclo de Trabalho

```
NotebookLM (briefing) → Claude Code (execução) → GitHub (commit) → Vercel (deploy)
       ↑                                                                    ↓
   Jeferson (aprovação) ←←←←←←←← notes/Insights_MissaoX.md ←←←←←←←←←←←←←
```

---

*Atualizado em: 2026-06-07 | Versão: 1.0*
