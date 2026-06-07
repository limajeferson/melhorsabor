# 🚀 Passo-a-Passo: Ativar MelhorSabor no Claude Cowork

**Data:** 2026-06-07  
**Objetivo:** Do zero até primeira mensagem enviada ao Claude Code  
**Tempo estimado:** 30-45 minutos  

---

## ✅ PRÉ-REQUISITOS (Você Já Tem)

- [x] Cowork Project "melhorsabor" criado
- [x] Pasta local `C:\Users\jefer\Documents\Projetos\melhorsabor` criada
- [x] GitHub CLI instalada e configurada
- [x] Acesso ao NotebookLM (Google One AI Premium)
- [x] Arquivos estratégicos do PromoBest salvos

---

## 📋 PASSO 1: Preparar Documentos para NotebookLM (5 min)

### 1.1 Criar pasta `docs-notebooklm` localmente

Crie uma pasta temporária onde você vai colar os documentos:
```
C:\Users\jefer\Downloads\docs-notebooklm\
```

### 1.2 Salve os arquivos nessa pasta

Você precisa ter esses 4 arquivos prontos:

```
docs-notebooklm/
├── NOTEBOOKLM_INSTRUCOES_MELHORSABOR.md  ← (você criou este)
├── projeto-info-produto.md               ← (você já tem — upload do PromoBest)
├── ECOSYSTEM_GUIDE.md                    ← (você já tem — do PromoBest, adaptado)
└── DESIGN_AUDIT_2026-05-22.md            ← (referência de padrão)
```

**Nota:** Os últimos 3 você já tem dos uploads anteriores. Apenas o primeiro é novo.

---

## 📱 PASSO 2: Enviar Documentos ao NotebookLM (5 min)

### 2.1 Abrir NotebookLM

- Acesse: https://notebooklm.google.com
- Clique em "Create new notebook"

### 2.2 Dar um nome

```
Nome: MelhorSabor — Briefing & Governance
Descrição: Projeto novo começando do zero (clone da estratégia do PromoBest)
```

### 2.3 Fazer upload dos 4 arquivos

Você pode:
- **Arrastar e soltar** os 4 arquivos na interface
- **Ou:** Copiar o conteúdo de cada um e colar como "Documento de texto"

### 2.4 Aguardar o processamento

NotebookLM vai processar em ~30-60 segundos. Você verá um checkmark quando estiver pronto.

---

## 💬 PASSO 3: Pedir o Primeiro Briefing ao NotebookLM (10 min)

### 3.1 Na interface do NotebookLM, clique em "Ask" (ou ícone de chat)

### 3.2 Cole este prompt exato:

```
Você é um analista estratégico de IA especializado em startups tech.

CONTEXTO:
- Projeto novo: MelhorSabor (super app de receitas com IA)
- Stack: Next.js, FastAPI, Supabase, Vercel, GitHub Actions
- Custo operacional: Zero
- Ferramentas disponíveis: Claude Code (Cowork), GitHub CLI
- Documentação: Copiada da estratégia do PromoBest

TAREFA:
Gere um arquivo CONTEXT_SYNC.md pronto para enviar ao Claude Code no Cowork.

ESTRUTURA ESPERADA:

# CONTEXT_SYNC.md: Dogfooding Missão 1 — Fundação & Estrutura

## 1. Status Atual / Resumo
- Projeto criado do zero no Cowork
- Objetivo: Criar estrutura base até "Hello World" rodando

## 2. Objetivo Atual da Tarefa
[Descrever o que Missão 1 vai fazer]

## 3. Próximos Passos / Ação Esperada do Claude Code
[Passo-a-passo claro, com as ações específicas que Claude Code vai fazer]

## 4. Perguntas para o Usuário
[Se houver bloqueadores (ex: GitHub token, caminho das pastas)]

---

OBS IMPORTANTES:
- Você está gerando um briefing, não código
- O Claude Code vai ler este arquivo no Cowork
- Seja específico nos "Próximos Passos" (use ✅ para tarefas concretas)
- Assuma que o usuário só tem: Claude Code, GitHub CLI, pastó local pronta

Gere agora.
```

### 3.3 Aguarde a resposta

NotebookLM vai gerar um briefing detalhado. Deve levar 2-5 minutos.

---

## 📥 PASSO 4: Copiar o Briefing (5 min)

### 4.1 Quando NotebookLM terminar, copie TODA a resposta

Selecione o texto inteiro (Ctrl+A dentro da resposta) e copie (Ctrl+C).

### 4.2 Crie um novo arquivo local:

```
C:\Users\jefer\Documents\Projetos\melhorsabor\CONTEXT_SYNC.md
```

### 4.3 Cole o conteúdo do NotebookLM nesse arquivo

Salve (Ctrl+S).

### 4.4 (Opcional) Comite no Git

```bash
cd C:\Users\jefer\Documents\Projetos\melhorsabor
git add CONTEXT_SYNC.md
git commit -m "feat: CONTEXT_SYNC.md — Missão 1 (NotebookLM)"
git push
```

---

## 🔓 PASSO 5: Ir para o Claude Cowork (10 min)

### 5.1 Abrir o projeto no Cowork

- Vá para: https://claude.ai/cowork (ou a URL do seu Cowork)
- Procure pelo projeto "melhorsabor"
- Clique para abrir

### 5.2 Verificar se o projeto está sincronizado com a pasta

Na interface do Cowork, você deve ver:
- Pasta local: `C:\Users\jefer\Documents\Projetos\melhorsabor`
- Status: "Connected" ou "Synced"

Se não estiver, clique em "Connect folder" e aponte para a pasta correta.

### 5.3 Verificar se GitHub está conectado

- Verifique as configurações do projeto (⚙️ ou "Settings")
- Você deve ver: "GitHub repository: <seu-usuario>/melhorsabor"
- Se não, clique em "Connect GitHub" e autorize a CLI

---

## 🚀 PASSO 6: Enviar Primeira Mensagem ao Claude Code (5 min)

### 6.1 Na interface do Cowork, abra o chat

Procure por um ícone de "Chat" ou "Mensagem" no projeto.

### 6.2 Copie e envie este prompt:

```
Você é o Claude Code, engenheiro-chefe de MelhorSabor.

Leia o arquivo CONTEXT_SYNC.md na pasta do projeto.

Seu objetivo: Executar a Missão 1 conforme descrito.

Regras Obrigatórias:
1. Antes de começar, leia .claude/CLAUDE.md (ainda não existe — você vai criar)
2. Crie a governança primeiro (pastas .claude/, CLAUDE.md, CLAUDE_CODE_MASTER_PLAN.md)
3. Use GitHub CLI para fazer commits automaticamente
4. Ao final de cada tarefa, crie um arquivo notes/Insights_Missao1.md com resumo
5. Nunca faça push sem confirmar que o código está testado

Você tem total autonomia para tomar decisões técnicas.
Aproveite os 2x mais tokens no Cowork até 5 de julho.

Comece agora.
```

### 6.3 Pressione Enter

Claude Code vai começar a trabalhar. Você verá:
- "Lendo CONTEXT_SYNC.md..."
- "Criando estrutura..."
- Progressão de tarefas em tempo real

---

## ⏳ PASSO 7: Monitorar e Aprovar (Contínuo)

### 7.1 Claude Code Vai Fazer:

- [x] Ler CONTEXT_SYNC.md
- [x] Criar pasta `.claude/` com CLAUDE.md
- [x] Adaptar CLAUDE_CODE_MASTER_PLAN.md do PromoBest
- [x] Criar estrutura de pastas (apps/, docs/, notes/)
- [x] Inicializar repositório no GitHub (usando GitHub CLI)
- [x] Criar primeiro README.md e package.json
- [x] Fazer commits e push automaticamente

### 7.2 O Que Você Faz:

- 👀 **Monitorar:** Veja a barra de progresso no Cowork
- ✅ **Aprovar checkpoints:** Se Claude Code pedir confirmação (rare, mas pode acontecer em RLS ou setup de BD)
- 🛑 **Parar se necessário:** Use `/stop` ou `/pause` se algo errado acontecer

### 7.3 Quando Claude Code Terminar:

Você verá:
```
✅ Missão 1 Concluída
- Estrutura de pastas criada
- Repositório no GitHub (pode ver em: https://github.com/seu-usuario/melhorsabor)
- Primeiro commit feito
- Arquivo de insights gerado: notes/Insights_Missao1.md
```

---

## 🎯 CHECKLIST FINAL (Verificação)

Quando Missão 1 terminar, verifique:

- [ ] Pasta `C:\Users\jefer\Documents\Projetos\melhorsabor` tem subpastas: `.claude/`, `apps/`, `docs/`, `notes/`
- [ ] Arquivo `.claude/CLAUDE.md` existe e tem regras do projeto
- [ ] Arquivo `CLAUDE_CODE_MASTER_PLAN.md` existe na raiz
- [ ] Arquivo `CONTEXT_SYNC.md` está na raiz
- [ ] Arquivo `INDEX.md` foi criado (painel de controle)
- [ ] GitHub repositório existe e está público (se desejar): https://github.com/seu-usuario/melhorsabor
- [ ] Pelo menos 2-3 commits no repositório
- [ ] Arquivo `notes/Insights_Missao1.md` foi gerado
- [ ] Tudo é sincronizado no Cowork (status "synced")

---

## 🔄 PRÓXIMAS MISSÕES (Depois de Missão 1)

Quando Missão 1 estiver 100% concluída:

### Passo A: Peça novo briefing ao NotebookLM

Na interface do NotebookLM, pergunte:
```
A Missão 1 foi concluída com sucesso. 
Leia o arquivo notes/Insights_Missao1.md (já está salvo na pasta).
Gere agora o briefing para Missão 2, que deve começar a implementar 
o esquema de banco de dados e a landing page inicial.
```

### Passo B: Copie o novo CONTEXT_SYNC para Missão 2

```
C:\Users\jefer\Documents\Projetos\melhorsabor\CONTEXT_SYNC.md
```

(Sobrescreva o anterior com o novo briefing)

### Passo C: Envie ao Claude Code

```
Leia o novo CONTEXT_SYNC.md e execute a Missão 2.
```

**Repita este ciclo a cada dia de desenvolvimento.**

---

## 📊 Timeline Esperada

| Missão | Descrição | Tempo | Data |
|--------|-----------|-------|------|
| **1** | Fundação & estrutura | 8-10h | 7 jun |
| **2** | Schema BD + landing | 12-15h | 8-9 jun |
| **3** | Auditoria & refactor | 10-12h | 10 jun |
| **4** | Afiliados & monetização | 15-20h | 11-13 jun |
| **5** | Agentes & automação | 10-15h | 14-15 jun |

**Total:** ~80 horas = ~2 semanas (se mantém ritmo)

---

## 🎬 Status Atual (Agora)

```
✅ Cowork Project criado
✅ Pasta local pronta
✅ Documentação estratégica pronta
⏳ NotebookLM gera briefing (próximo)
⏳ Claude Code começa a trabalhar (depois)
```

---

## 🆘 Se Algo Ficar Bloqueado

| Problema | Solução |
|----------|---------|
| "GitHub CLI não funciona" | Verifique: `gh auth status` no terminal |
| "Pasta não está sincronizada no Cowork" | Reconecte: Settings → Connect Folder |
| "Claude Code não consegue ler CONTEXT_SYNC.md" | Certifique-se que está na raiz da pasta |
| "Notificação de erro de RLS no Supabase" | Pause Claude Code, configure RLS manualmente, depois continue |

**Dúvida? Volte aqui e explique o erro.**

---

**Pronto para começar?**

Siga os passos acima na ordem. Se ficar travado em algum passo, avise qual e eu desbloqueia.

🚀
