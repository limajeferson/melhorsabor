# 🏛️ BLUEPRINT — Arquitetura MelhorSabor

> 🔗 Navegação: [[INDEX]] | [[CLAUDE_CODE_MASTER_PLAN]] | [[notes/Architectural_Recommendations]] | [[notes/Product_Vision_Notes]]

> Documento de referência arquitetônica. Atualizar sempre que houver decisões estruturais.

**Versão:** 1.0  
**Data:** 2026-06-07  
**Status:** Fase 1 (Fundação)

---

## 🎯 Visão do Produto

MelhorSabor é uma plataforma de receitas com IA organizada em 3 pilares:

1. **Curadoria Inteligente** — IA seleciona e organiza receitas por contexto (objetivo, ingredientes, restrições)
2. **Performance Humana** — receitas focadas em resultados: energia, saúde, bem-estar
3. **Marketplace de Criadores** — chefs e creators publicam e monetizam conteúdo

---

## 🏗️ Arquitetura Geral

```
┌─────────────────────────────────────────────────────────┐
│                    USUÁRIO (Browser/App)                  │
└────────────────────────┬────────────────────────────────┘
                         │
                         ▼
┌─────────────────────────────────────────────────────────┐
│              FRONTEND — Next.js 14 (Vercel)              │
│  App Router | Tailwind | shadcn/ui | TypeScript          │
│                                                           │
│  /app                                                     │
│  ├── (marketing)/     ← landing, blog, SEO               │
│  ├── (app)/           ← área logada, receitas             │
│  ├── (auth)/          ← login, cadastro                   │
│  └── api/             ← API routes simples                │
└────────────┬────────────────────────┬────────────────────┘
             │                        │
             ▼                        ▼
┌────────────────────┐   ┌────────────────────────────────┐
│  SUPABASE          │   │  FASTAPI — Backend (Render)     │
│  PostgreSQL + RLS  │   │  Agentes IA, scraping, tarefas  │
│  Auth              │   │  pesadas                        │
│  Storage           │   │                                 │
│  Realtime          │   │  /app/api/v1/                   │
└────────────────────┘   │  /app/agents/                   │
                         └────────────────────────────────┘
```

---

## 📊 Schema de Banco (v1 — Fase 2)

```sql
-- Usuários (gerenciado pelo Supabase Auth)
profiles (id, username, bio, avatar_url, role, created_at)

-- Receitas
recipes (
  id, title, slug, description,
  ingredients jsonb,      -- [{name, amount, unit}]
  instructions jsonb,     -- [{step, text, image_url}]
  nutrition jsonb,        -- {calories, protein, carbs, fat}
  category_id, author_id,
  prep_time, cook_time, servings,
  difficulty, tags text[],
  status,                 -- draft | published | archived
  created_at, updated_at
)

-- Categorias
categories (id, name, slug, description, image_url)

-- Afiliados tracking
affiliate_clicks (id, recipe_id, user_id_hash, product_url, clicked_at)

-- Analytics (privacy-first)
page_views (id, path, user_id_hash, session_id_hash, created_at)
```

---

## 🔐 Segurança & LGPD

### Row Level Security (Supabase)
- `profiles`: usuário vê apenas o próprio perfil
- `recipes`: leitura pública (publicadas), escrita apenas pelo autor
- `affiliate_clicks`: apenas service role pode inserir/ler
- `page_views`: apenas service role (analytics)

### Privacy-First
- IPs nunca armazenados em plain text → SHA-256
- Cookies somente com consentimento (LGPD)
- Direito ao esquecimento: `DELETE CASCADE` nas tabelas relacionadas
- Dados de analytics: sem PII, apenas hashes anônimos

---

## 🚀 Deploy & Infraestrutura

| Serviço | Plataforma | Tier | Custo |
|---------|-----------|------|-------|
| Frontend | Vercel | Free | $0 |
| Backend | Render.com | Free (com sleep) | $0 |
| Banco | Supabase | Free | $0 |
| Storage | Supabase | 1GB free | $0 |
| CI/CD | GitHub Actions | 2000 min/mês | $0 |
| Domínio | Registro.br | ~R$40/ano | R$40/ano |

**Total mensal: ~R$3,33** (apenas domínio, amortizado)

---

## 🤖 Arquitetura de IA

### Fase 3 — Agentes Planejados

```
Claude API (Anthropic)
├── RecipeCurator      ← seleciona e organiza receitas
├── NutritionAnalyzer  ← analisa macros e micros
├── TagGenerator       ← gera tags automáticas
└── ContentReviewer    ← revisa qualidade do conteúdo

FastAPI (orquestração)
├── /agents/curator/   ← endpoint do agente curador
├── /agents/nutrition/ ← endpoint do analisador
└── /webhooks/         ← eventos assíncronos
```

---

## 📡 API Design (RESTful)

```
GET    /api/v1/recipes              ← lista paginada
GET    /api/v1/recipes/:slug        ← receita individual
POST   /api/v1/recipes              ← criar (auth required)
PUT    /api/v1/recipes/:id          ← atualizar (auth required)
DELETE /api/v1/recipes/:id          ← arquivar (auth required)

GET    /api/v1/categories           ← lista categorias
GET    /api/v1/categories/:slug     ← categoria + receitas

POST   /api/v1/auth/register        ← cadastro
POST   /api/v1/auth/login           ← login (Supabase Auth)
```

---

## 🔄 Fluxo de Dados (Receita)

```
Creator posta receita
       ↓
API Route valida + sanitiza
       ↓
Supabase (status=draft)
       ↓
FastAPI Agent (nutrição + tags automáticos)
       ↓
Supabase (status=published)
       ↓
Página SEO gerada (Next.js SSG/ISR)
       ↓
Usuário vê receita + links afiliados
```

---

## 📐 Decisões Arquiteturais (ADRs)

### ADR-001: Monorepo único (não microrepos)
- **Decisão:** Um único repositório `melhorsabor/`
- **Motivo:** Time pequeno (1 dev + IA), menor overhead
- **Trade-off:** Sem isolamento total entre frontend/backend

### ADR-002: Next.js App Router (não Pages Router)
- **Decisão:** App Router com Server Components
- **Motivo:** Performance superior, melhor SEO, futuro do Next.js
- **Trade-off:** Curva de aprendizado maior, menos exemplos disponíveis

### ADR-003: Supabase como BaaS (não backend próprio no início)
- **Decisão:** Supabase para auth, banco e storage nas fases 1-3
- **Motivo:** Velocidade de desenvolvimento + custo zero
- **Trade-off:** Vendor lock-in moderado, migração possível depois

### ADR-004: FastAPI apenas para lógica pesada
- **Decisão:** FastAPI só quando Next.js API Routes não bastam (agentes IA)
- **Motivo:** Simplicidade, custo zero do tier gratuito
- **Trade-off:** Latência fria no Render.com (~30s sleep)

---

*Última atualização: 2026-06-07 | Próxima revisão: ao final da Missão 2*
