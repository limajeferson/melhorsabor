# MelhorSabor — Descrição do Projeto (Claude Cowork)

## 🍳 O Projeto

**MelhorSabor** é uma super-plataforma de receitas com inteligência artificial que combina:

- **Comunidade de receitas** validadas por nutricionistas e pediatras
- **5 rotas de monetização** (marketplace de criadores, afiliados, communities premium, ads contextual, e-books)
- **9 camadas de negócio** (receitas clássicas → fit → bebê → contextuais → autores → marketplace)
- **Zero custo operacional** (Vercel, Supabase, GitHub Actions gratuitos)
- **Criatividade regulatória como moat** — cada categoria de receita tem sua própria estratégia compliance

**Domínio:** melhorsabor.com.br  
**Fase atual:** Começando do zero  
**Timeline:** 80 horas de trabalho concentradas para MVP

---

## 🎯 Objetivo da Fase 1

Criar a fundação técnica do projeto:
1. Estrutura de pastas e governança
2. Repositório no GitHub
3. Landing page inicial (Hello World)
4. Setup de banco de dados (Supabase)
5. Primeiras automações (agentes de IA para curadoria)

---

## 🔧 Stack Técnico

- **Frontend:** Next.js 14+ (App Router) + Tailwind CSS + shadcn/ui
- **Backend:** FastAPI + Python (para agentes autônomos)
- **Database:** Supabase (PostgreSQL gratuito)
- **Hosting:** Vercel (frontend) + Render.com (backend, se necessário)
- **CI/CD:** GitHub Actions
- **Versionamento:** GitHub
- **Desenvolvimento:** Claude Code (Cowork)

---

## 📁 Estrutura de Pastas (Será Criada)

```
melhorsabor/
├── .claude/                    # Governança & config IA
│   ├── CLAUDE.md              # Regras globais do projeto
│   └── workflows/             # Workflows do Cowork (futuros)
├── .github/
│   └── workflows/             # CI/CD (GitHub Actions)
├── apps/
│   ├── frontend/              # Next.js (receitas, comunidade)
│   │   ├── app/
│   │   ├── components/
│   │   ├── public/
│   │   └── package.json
│   └── backend/               # FastAPI (agentes, validação)
│       ├── app/
│       ├── agents/
│       └── requirements.txt
├── docs/                      # Documentação estratégica
│   ├── BLUEPRINT.md          # Arquitetura geral
│   ├── STATUS_YYYY-MM-DD.md  # Snapshots periódicos
│   └── ECOSYSTEM_GUIDE.md    # Manual de workflow
├── notes/                     # Insights de IA (gerados)
│   ├── Insights_Missao1.md
│   ├── Insights_Missao2.md
│   └── ...
├── .gitignore
├── docker-compose.yml         # (opcional, para desenvolvimento local)
├── INDEX.md                   # Painel de controle (links)
├── CONTEXT_SYNC.md            # Briefing atual (NotebookLM gera)
├── CLAUDE_CODE_MASTER_PLAN.md # Roadmap macro (adaptado do PromoBest)
├── README.md
└── package.json               # (monorepo, se necessário)
```

---

## 🚀 Como Claude Code Vai Trabalhar

1. **Leitura de Governança:** `.claude/CLAUDE.md` (regras globais)
2. **Recebimento de Briefing:** `CONTEXT_SYNC.md` (NotebookLM gera, você fornece)
3. **Autonomia:** Claude Code planeja, codifica e faz commit automaticamente
4. **Aprovação:** Você valida checkpoints críticos (design, segurança, RLS no banco)
5. **Documentação:** Claude gera insights em `/notes` a cada missão

---

## 📋 Fases do Desenvolvimento

| Fase | Focus | Duração | Quem |
|------|-------|---------|------|
| **1 — Fundação** | Estrutura, setup, Hello World | 10h | Claude Code |
| **2 — MVP Receitas** | Landing, listagem, filtros | 20h | Claude Code |
| **3 — Validação** | Auditoria, testes, refactoring | 15h | Claude Code |
| **4 — Monetização** | Afiliados, ads, marketplace | 20h | Claude Code + Gemini CLI (SEO/marketing) |
| **5 — Escala** | Automação, agentes, growth | 15h | Claude Code |

---

## ⚡ Regime de Trabalho

- **Promoção Cowork:** 2x mais tokens até 5 de julho — APROVEITE AGORA
- **Velocidade:** Uma missão (briefing) a cada dia de desenvolvimento
- **Cadência:** NotebookLM (análise) → Claude Code (execução) → Você (aprovação)
- **Objetivo:** MVP pronto em ~2 semanas se mantém ritmo

---

## 🔐 Princípios Não-Negociáveis

1. ✅ **Custo Zero:** Só usar serviços gratuitos (Vercel, Supabase free tier, GitHub Actions)
2. ✅ **Segurança:** LGPD compliance — nenhum IP cru, dados sensíveis criptografados
3. ✅ **Code Quality:** Tipagem rigorosa, sem overengineering, foco em simplicidade
4. ✅ **Rastreabilidade:** Cada commit tem contexto, cada decisão está documentada
5. ✅ **Autonomia Supervisionada:** Claude Code é autônomo, mas você aprova pontos críticos

---

## 🎯 Sucesso = O que Significa Terminar Fase 1?

- [x] Repositório criado no GitHub
- [x] Estrutura de pastas implementada
- [x] `.claude/CLAUDE.md` criado e validado
- [x] `docs/BLUEPRINT.md` documentando arquitetura
- [x] Landing page ("MelhorSabor em Breve") rodando no Vercel
- [x] Supabase configurado (schema básico de receitas)
- [x] Primeiro `notes/Insights_Missao1.md` gerado
- [x] Tudo versionado no GitHub

---

## 📞 Contato & Suporte

- **Claude Code** trabalha no Cowork — você envia mensagens como "Leia CONTEXT_SYNC.md e execute Missão X"
- **NotebookLM** gera briefings — você envia este documento + as fontes estratégicas
- **Você** aprova e faz decisões críticas (design, segurança, direção do produto)

---

## 🎬 Próximo Passo (Agora)

1. Copie este arquivo e o `NOTEBOOKLM_INSTRUCOES_MELHORSABOR.md` para o projeto local
2. Envie os dois + as fontes estratégicas ao NotebookLM
3. NotebookLM vai gerar o primeiro `CONTEXT_SYNC.md`
4. Você copia esse briefing e envia como primeira mensagem ao Claude Cowork

**Timeline:** ~2h para estar tudo pronto e o Claude Code começar a trabalhar.

---

**Validado e assinado por:** Claude (decisão arquitetônica final)  
**Data:** 2026-06-07  
**Versão:** 1.0
