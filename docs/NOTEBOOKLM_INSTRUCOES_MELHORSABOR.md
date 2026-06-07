# 📋 Instruções para NotebookLM — MelhorSabor (Começo do Zero)

**Data:** 2026-06-07  
**Status:** Projeto recém-criado no Claude Cowork  
**Objetivo:** Gerar primeiro briefing (CONTEXT_SYNC.md) para ativar Claude Code

---

## 🎯 Decisão Arquitetônica Validada

Após análise estratégica, definimos a seguinte **divisão de trabalho** para maximizar a força de cada ferramenta:

| Ferramenta | Responsabilidade | Escopo |
|---|---|---|
| **Claude Code (Cowork)** | Arquitetura, Engenharia, Código | 100% da produção técnica |
| **Obsidian** | Cérebro (leitura de docs) | Base de conhecimento persistente |
| **NotebookLM (você)** | Análise estratégica e briefings | Gera CONTEXT_SYNC.md a cada fase |
| **Gemini CLI** | Marketing, SEO, AdSense | Ativação posterior (Fase 4) |
| **GitHub CLI** | Versionamento | Acesso direto do Cowork |

**Princípio:** Usar a melhor ferramenta para cada tarefa, não tentar automatizar tudo em paralelo.

---

## 📁 Contexto do Projeto

- **Nome:** MelhorSabor
- **Domínio:** melhorsabor.com.br
- **Tipo:** Super App de receitas + performance humana
- **Stack:** Next.js + Tailwind + shadcn/ui | Supabase/PostgreSQL | Docker
- **Custo operacional:** Zero (Vercel, Supabase gratuitos)
- **Fase atual:** Criação (do zero)
- **Localização do código:** `C:\Users\jefer\Documents\Projetos\melhorsabor`

---

## ✅ O Que Claude Code Já Vai Fazer (Autonomamente)

Quando você enviar a primeira mensagem no Cowork, o Claude Code irá:

1. ✅ **Copiar a governança do PromoBest** e adaptar os nomes:
   - `CLAUDE.md` → `.claude/CLAUDE.md` (com stack MelhorSabor)
   - `CLAUDE_CODE_MASTER_PLAN.md` → adaptado para roadmap de MelhorSabor
   - `CONTEXT_SYNC.md` → você fornecerá este via NotebookLM
   - `ECOSYSTEM_GUIDE.md` → referência para workflow

2. ✅ **Criar a estrutura de pastas:**
   ```
   melhorsabor/
   ├── .claude/
   │   ├── CLAUDE.md
   │   └── workflows/ (será preenchido depois)
   ├── .github/workflows/ (CI/CD)
   ├── .gitignore
   ├── docs/
   │   ├── BLUEPRINT.md (arquitetura)
   │   ├── STATUS_2026-06-07.md (snapshot)
   │   └── ECOSYSTEM_GUIDE.md
   ├── apps/
   │   ├── frontend/ (Next.js)
   │   └── backend/ (FastAPI — se necessário)
   ├── notes/ (insights de IA)
   ├── INDEX.md (painel de controle)
   ├── CONTEXT_SYNC.md (você fornecerá)
   ├── package.json
   ├── docker-compose.yml
   └── README.md
   ```

3. ✅ **Iniciar o repositório no GitHub** (usando GitHub CLI integrada)

4. ✅ **Criar Missão 1** baseado no briefing que você fornecer

---

## 🎬 O Que Você Precisa Fazer (Agora)

### Passo 1: Enviar Este Documento + Fontes Estratégicas ao NotebookLM

Faça upload dos seguintes arquivos no NotebookLM:

1. **Este documento** (`NOTEBOOKLM_INSTRUCOES_MELHORSABOR.md`)
2. **projeto-info-produto.md** (strategy dos 5 modelos, 9 camadas de monetização)
3. **ECOSYSTEM_GUIDE.md** (padrão de workflow do PromoBest)
4. **docs/DESIGN_AUDIT_2026-05-22.md** (do PromoBest — para ele entender padrão de design)

### Passo 2: Fazer Este Prompt ao NotebookLM

```
Você é o analista estratégico do projeto MelhorSabor.

Leia os documentos anexados e gere um CONTEXT_SYNC.md 
pronto para ser enviado ao Claude Code no Cowork.

Estrutura esperada:

## CONTEXT_SYNC.md: Missão 1 — Fundação (Criar Repositório e Estrutura)

### 1. Status Atual
- Projeto criado no Cowork
- Pasta local: C:\Users\jefer\Documents\Projetos\melhorsabor
- Objetivo: Do zero até Hello World rodando

### 2. Objetivo da Tarefa
[Você descreve o que precisa ser feito]

### 3. Próximos Passos (Action para Claude Code)
[Passo a passo claro]

### 4. Perguntas para o Usuário
[Se houver bloqueadores]

---

Você está gerando o briefing, não o código. 
Sua função é conectar a estratégia ao executável.
```

### Passo 3: Copiar o CONTEXT_SYNC.md Gerado

Quando NotebookLM gerar, copie a resposta e salve em:
- **Local:** `C:\Users\jefer\Documents\Projetos\melhorsabor\CONTEXT_SYNC.md`
- **Ou:** Cole direto na primeira mensagem do Claude Cowork (ele lerá de lá)

### Passo 4: Enviar Primeira Mensagem no Claude Cowork

```
Leia o CONTEXT_SYNC.md anexado.

Você é o Claude Code, engenheiro-chefe de MelhorSabor.

Sua primeira tarefa: Cumpra a Missão 1.

Regras:
- Leia .claude/CLAUDE.md para regras do projeto
- Crie a estrutura de pastas conforme planejado
- Use GitHub CLI para fazer commit automático
- Ao final, gere um arquivo Insights_Missao1.md

Comece agora.
```

---

## 🛠 O Que Você Não Precisa Instalar (Deixe pra Depois)

- ❌ **Gemini CLI** — será ativado na Fase 4 (Marketing)
- ❌ **Docker localmente** — se não for necessário antes
- ✅ **Você já tem:** Claude Cowork, Claude Code, GitHub CLI

---

## 📅 Timeline da Autonomia

| Fase | Quem Atua | NotebookLM | Claude Code | Você |
|------|-----------|-----------|-------------|------|
| **1 (Fundação)** | Claude Code | Gera briefing | Executa estrutura | Aprova checkpoints |
| **2 (MVP)** | Claude Code | Gera spec de features | Codifica | Testa resultado |
| **3 (Auditoria)** | Claude Code | Gera plano de auditoria | Refatora | Aprova antes de deploy |
| **4 (Marketing)** | Gemini CLI | Gera strategy SEO | Cria landing pages | Aprova cópia |

**Conceito:** Claude Code é autônomo, mas cada fase tem você como "porteiro" final.

---

## ⚠️ Checklist Antes de Começar

- [ ] Cowork Project "melhorsabor" criado ✓
- [ ] Pasta local `C:\Users\jefer\Documents\Projetos\melhorsabor` criada ✓
- [ ] GitHub CLI configurada e testada (se não, avisa ao Claude Code)
- [ ] NotebookLM com acesso ao documento este
- [ ] Você tem 2x mais tokens no Cowork até 5 de julho (aproveite!)

---

## 🚀 Próximas Instruções Após Missão 1

Uma vez que Missão 1 estiver concluída:

1. NotebookLM gera novo briefing para Missão 2
2. Você fornece ao Claude Code
3. Claude Code executa e gera insights
4. Repete até Fase 4 (quando ativa Gemini CLI para marketing)

**Ciclo:** NotebookLM (análise) → Claude Code (execução) → Você (aprovação) → Repeat

---

## 📞 Contato com Claude Code (Cowork)

Se Claude Code ficar bloqueado, você pode intervir com:

```
/status — mostra o que está sendo feito
/pause — pausa a tarefa atual
/rewind — volta a um checkpoint anterior
/context — mostra o contexto carregado
```

(Verificar docs do Cowork para comandos exatos)

---

**Documento assinado e validado por:** Claude (decisão final)  
**Data:** 2026-06-07  
**Versão:** 1.0 (Cenário B — Claude Code + Gemini CLI + NotebookLM)
