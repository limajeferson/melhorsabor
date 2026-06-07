# 🍽️ MelhorSabor

> Super-plataforma de receitas com IA — melhorsabor.com.br

[![Status](https://img.shields.io/badge/status-em%20desenvolvimento-yellow)]()
[![Custo Operacional](https://img.shields.io/badge/custo-R%240%2Fmês-brightgreen)]()
[![Stack](https://img.shields.io/badge/stack-Next.js%20%2B%20Supabase-blue)]()

---

## 🎯 Sobre

MelhorSabor é uma plataforma de receitas com IA que combina:

- 🤖 **Curadoria inteligente** de receitas via IA
- 📊 **Performance humana** — nutrição, bem-estar, energia
- 🛒 **Marketplace** de criadores de conteúdo culinário
- 💰 **Monetização** via afiliados, AdSense e assinaturas

## 🛠 Stack

| Camada | Tecnologia |
|--------|-----------|
| Frontend | Next.js 14+ + Tailwind + shadcn/ui |
| Backend | FastAPI (Python) |
| Database | Supabase / PostgreSQL |
| Deploy | Vercel (frontend) + Render (backend) |
| CI/CD | GitHub Actions |

**Custo mensal: R$ 0** (tiers gratuitos)

## 📁 Estrutura

```
melhorsabor/
├── apps/
│   ├── frontend/     ← Next.js (App Router)
│   └── backend/      ← FastAPI
├── docs/             ← Arquitetura e decisões
├── notes/            ← Insights de cada missão
└── scripts/          ← Helpers e automações
```

## 🚀 Como Rodar (Dev)

```bash
# Clonar o repositório
git clone https://github.com/SEU_USER/melhorsabor.git
cd melhorsabor

# Copiar variáveis de ambiente
cp .env.example .env.local

# Instalar dependências do frontend
cd apps/frontend
npm install

# Rodar em modo dev
npm run dev
```

Acesse em: http://localhost:3000

## 📋 Roadmap

Ver [`CLAUDE_CODE_MASTER_PLAN.md`](./CLAUDE_CODE_MASTER_PLAN.md) para o roadmap completo.

## 📜 Licença

Proprietário — todos os direitos reservados.

---

*Construído com ❤️ usando Claude Code + Next.js + Supabase*
