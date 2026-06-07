# 🗺️ CLAUDE CODE MASTER PLAN — MelhorSabor

> Roadmap macro das 5 fases de desenvolvimento.
> Este documento é a bússola estratégica — atualizar a cada fase concluída.

**Data de criação:** 2026-06-07  
**Status atual:** Fase 1 — Fundação ✅

---

## 📊 Visão Geral das Fases

| Fase | Nome | Status | Estimativa |
|------|------|--------|-----------|
| 1 | Fundação & Estrutura | 🔄 Em andamento | 1 semana |
| 2 | MVP — Landing + Schema BD | ⏳ Pendente | 2 semanas |
| 3 | Core Features — Receitas + IA | ⏳ Pendente | 3 semanas |
| 4 | Monetização + SEO + Marketing | ⏳ Pendente | 2 semanas |
| 5 | Escala + Performance + Analytics | ⏳ Pendente | contínuo |

---

## 🏗 Fase 1 — Fundação & Estrutura

**Objetivo:** Repositório, governança e estrutura base prontos.

### Missão 1: Setup Inicial
- [x] Criar `.claude/CLAUDE.md` com regras do projeto
- [x] Criar `CLAUDE_CODE_MASTER_PLAN.md`
- [x] Estruturar pastas: `apps/`, `docs/`, `notes/`, `scripts/`
- [x] `.gitignore`, `.env.example`, `package.json`, `README.md`
- [x] GitHub Actions CI (`lint + build`)
- [ ] Inicializar git + criar repositório no GitHub
- [x] `docs/BLUEPRINT.md` (arquitetura)
- [x] `notes/Insights_Missao1.md`

### Missão 2: Next.js Bootstrap
- [ ] Inicializar Next.js 14 com App Router
- [ ] Configurar Tailwind + shadcn/ui
- [ ] Layout base + tema MelhorSabor (verde/laranja)
- [ ] Página inicial (placeholder)
- [ ] Deploy no Vercel

---

## 🎯 Fase 2 — MVP

**Objetivo:** Landing page funcional + schema do banco de dados.

### Missão 3: Landing Page
- [ ] Hero section com proposta de valor
- [ ] Formulário de captura de email (waitlist)
- [ ] SEO básico (meta tags, Open Graph)
- [ ] Deploy na Vercel com domínio melhorsabor.com.br

### Missão 4: Schema do Banco
- [ ] Criar projeto no Supabase
- [ ] Schema: users, recipes, categories, tags
- [ ] RLS policies iniciais
- [ ] Autenticação (Supabase Auth)
- [ ] Tipos TypeScript gerados do schema

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
