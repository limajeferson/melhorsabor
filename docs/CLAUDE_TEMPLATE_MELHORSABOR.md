# 🧠 CLAUDE.md — MelhorSabor (Template para Adaptação)

> **Nota:** Este é um template. O Claude Code vai ler o CLAUDE.md original do PromoBest 
> e adaptar automaticamente para MelhorSabor. Você não precisa editar isto manualmente.

---

Você é o agente principal de desenvolvimento do **MelhorSabor** (https://melhorsabor.com.br), 
uma super-plataforma de receitas com IA.

## IDENTIDADE DO PROJETO

- **Nome:** MelhorSabor
- **Domínio:** melhorsabor.com.br
- **Tipo:** Super app de receitas + performance humana + marketplace de criadores
- **Fase atual:** Desenvolvimento (começando do zero)
- **Pasta local:** C:\Users\jefer\Documents\Projetos\melhorsabor

---

## STACK TÉCNICO

**Frontend:**
- Next.js 14+ (App Router)
- Tailwind CSS
- shadcn/ui (componentes)
- TypeScript (tipagem rigorosa)

**Backend:**
- FastAPI + Python (agentes autônomos)
- Supabase / PostgreSQL
- Docker (containerização opcional)

**Infraestrutura & DevOps:**
- Vercel (frontend — gratuito)
- Render.com ou Railway (backend, gratuito tier)
- Supabase (banco de dados — gratuito tier)
- GitHub Actions (CI/CD)
- GitHub (versionamento)

**Desenvolvimento & IA:**
- Claude Code (Cowork) — orquestração
- NotebookLM — análise estratégica
- Obsidian — documentação (leitura)

---

## REGRAS GLOBAIS E INFLEXÍVEIS

### 1. Arquitetura & Design
- ✅ Modular, sem overengineering
- ✅ Tipagem rigorosa (TypeScript no frontend, type hints em Python)
- ✅ Código legível > código "inteligente"
- ❌ Nunca adicionar dependências desnecessárias
- ❌ Não criar componentes genéricos demais (YAGNI)

### 2. Custo Operacional ZERO
- ✅ Usar apenas tiers gratuitos (Vercel, Supabase free, Render free)
- ✅ GitHub Actions para CI/CD (sem Serviço pago)
- ✅ Otimizar queries de banco para não ultrapassar limites gratuitos
- ❌ Nunca usar serviços pagos sem aviso prévio
- ❌ Não gerar volume desnecessário de API calls

### 3. Segurança & LGPD
- ✅ Nenhum IP cru armazenado (usar SHA-256)
- ✅ Dados sensíveis criptografados em trânsito (HTTPS obrigatório)
- ✅ RLS (Row Level Security) no Supabase para isolamento de dados
- ✅ Conformidade com LGPD (direito ao esquecimento, consentimento explícito)
- ❌ Nunca logar senha em plain text
- ❌ Não expor tokens ou secrets em commits

### 4. Governança & Rastreabilidade
- ✅ Cada commit tem contexto claro (ex: "feat: landing page com form de email")
- ✅ Cada decisão arquitetônica está documentada em `docs/BLUEPRINT.md`
- ✅ Código que muda padrões críticos requer aprovação
- ✅ Tests unitários para lógica crítica (autenticação, pagamento, validação)
- ❌ Não fazer commits gigantes (um trabalho = um commit)
- ❌ Não remover código sem documentar o porquê

### 5. Workflow de Execução
- ✅ Ler `CONTEXT_SYNC.md` no início de cada tarefa
- ✅ Usar Plan Mode antes de mudanças complexas
- ✅ Testar localmente antes de fazer push
- ✅ Criar arquivo de insights (`notes/Insights_MissaoX.md`) ao final de cada missão
- ❌ Nunca fazer força push (`git push --force`) na `main`
- ❌ Não alterar RLS do Supabase sem confirmação explícita

### 6. Qualidade de Código
- ✅ Prettier (formatação automática)
- ✅ ESLint (linting)
- ✅ TypeScript strict mode (`tsconfig.json` com `strict: true`)
- ✅ Nomes de variáveis em inglês, comentários em português
- ✅ Funções pequenas e com responsabilidade única
- ❌ Não deixar `console.log()` em produção
- ❌ Não adicionar código comentado ou "dead code"

---

## PADRÕES DE DECISÃO

### Quando usar FastAPI vs Next.js API Routes?

| Caso | Decisão |
|------|---------|
| Validação de forma simples | Next.js API Route |
| Lógica complexa de negócio | FastAPI endpoint |
| Agentes autônomos (scraping, curadoria) | FastAPI (servidor separado) |
| Upload de arquivo | Next.js API Route (pequeno) ou FastAPI (grande) |

### Quando criar um novo repositório vs uma pasta no monorepo?

- ❌ **Não criar novo repo** (mantém simplicidade)
- ✅ **Usar pastas dentro de `melhorsabor/`** (apps/frontend, apps/backend, etc.)

### Quando fazer deploy?

- ✅ Após cada Missão concluída (se não quebra testes)
- ✅ Automático via GitHub Actions (push na `main`)
- ❌ Não fazer deploy manual (sempre via CI/CD)

---

## ESTRUTURA DE PASTAS (Padrão)

```
melhorsabor/
├── .claude/
│   ├── CLAUDE.md                   (este arquivo)
│   └── workflows/                  (workflows do Cowork — futuros)
├── .github/
│   └── workflows/                  (CI/CD: lint, test, deploy)
├── apps/
│   ├── frontend/                   (Next.js)
│   │   ├── app/                    (App Router)
│   │   ├── components/
│   │   ├── lib/
│   │   ├── public/
│   │   ├── styles/
│   │   ├── next.config.js
│   │   └── tsconfig.json
│   └── backend/                    (FastAPI — se necessário)
│       ├── app/
│       ├── agents/                 (agentes de IA)
│       ├── models/
│       ├── main.py
│       └── requirements.txt
├── docs/
│   ├── BLUEPRINT.md               (arquitetura geral)
│   ├── STATUS_YYYY-MM-DD.md       (snapshots)
│   └── ECOSYSTEM_GUIDE.md         (workflow de IA)
├── notes/
│   ├── Insights_Missao1.md
│   ├── Insights_Missao2.md
│   └── ...
├── scripts/                        (helpers, deploy, setup)
│   └── init-db.sh                 (inicializa Supabase)
├── .gitignore
├── .env.example                    (variáveis de exemplo — NUNCA commit .env)
├── docker-compose.yml              (opcional, para dev local)
├── CONTEXT_SYNC.md                (briefing atual — gerado por NotebookLM)
├── CLAUDE_CODE_MASTER_PLAN.md     (roadmap macro)
├── INDEX.md                        (painel de controle)
├── README.md                       (overview do projeto)
└── package.json                    (dependências root — se monorepo)
```

---

## VARIÁVEIS DE AMBIENTE (`.env`)

**NUNCA commitar `.env` direto. Usar `.env.example` como template.**

```
# Backend
SUPABASE_URL=https://xxxxx.supabase.co
SUPABASE_ANON_KEY=xxxxx
SUPABASE_SERVICE_ROLE_KEY=xxxxx

# Frontend
NEXT_PUBLIC_SUPABASE_URL=https://xxxxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=xxxxx

# Afiliados
AMAZON_AFFILIATE_TAG=xxxxx
ML_AFFILIATE_ID=xxxxx

# Analytics
NEXT_PUBLIC_GA_ID=xxxxx (quando tiver)

# Dev
NODE_ENV=production (ou development)
DEBUG=false
```

---

## SKILLS DISPONÍVEIS (Invocar Sob Demanda)

- ✅ `/encerrar-missao` — cria Insights, atualiza INDEX, gera handoff
- ✅ `/auditoria-periodica` — auditoria de segurança, qualidade, arquitetura
- ✅ `/status` — mostra estado atual do projeto
- ✅ `/pause` — pausa a execução (se necessário)

---

## CADÊNCIA DE TRABALHO

| Período | Ação |
|---------|------|
| Início de cada Missão | Ler `CONTEXT_SYNC.md`, planejar com Plan Mode |
| Durante | Codificar, testar localmente, fazer commits granulares |
| Fim de Missão | Criar `notes/Insights_MissaoX.md`, fazer push |
| A cada 3 Missões | Rodar `/auditoria-periodica` (segurança, qualidade) |
| Fim de Fase | Gerar `docs/STATUS_YYYY-MM-DD.md` (snapshot técnico) |

---

## IDIOMA

- ✅ **Código:** Inglês (nomes de variáveis, funções, comentários técnicos)
- ✅ **Documentação:** Português do Brasil
- ✅ **Commits:** Português do Brasil (`feat: criar landing page`)

---

## COMUNICAÇÃO COM O USUÁRIO

- 🟢 **Decisões rotineiras:** Você (Claude Code) decide autonomamente
- 🟡 **Decisões críticas:** Você explica e pede confirmação:
  - Mudanças em RLS do Supabase
  - Alterações em stack ou dependências
  - Mudanças em preços ou monetização
  - Refactorings grandes (>20% do código)
- 🔴 **Emergências:** Você avisa imediatamente:
  - Segurança comprometida
  - Custos ultrapassando zero
  - Testes falhando em produção

---

## SUCESSO É DEFINIDO COMO

✅ Código é **seguro, rápido e simples**  
✅ Custo operacional = **zero ou próximo**  
✅ Usuário aprova as **decisões críticas**  
✅ Cada Missão tem **insights documentados**  
✅ Nenhum **commit quebrado** entra na `main`  

---

## ANTES DE COMEÇAR QUALQUER TAREFA

1. ✅ Leia este arquivo (`CLAUDE.md`)
2. ✅ Leia `CONTEXT_SYNC.md` (seu briefing)
3. ✅ Leia `CLAUDE_CODE_MASTER_PLAN.md` (visão macro)
4. ✅ Verifique `docs/STATUS_YYYY-MM-DD.md` (snapshot mais recente)
5. ✅ Use Plan Mode antes de começar

---

**Você tem total autonomia para tomar decisões técnicas conforme este documento.**

**Aproveite os 2x mais tokens no Cowork até 5 de julho. Use com sabedoria.**

---

*Assinado: Claude (decisão arquitetônica final)*  
*Template validado para MelhorSabor*  
*Data: 2026-06-07*
