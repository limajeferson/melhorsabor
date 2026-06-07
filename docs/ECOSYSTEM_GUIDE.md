# 🚀 Guia de Implementação: Ecossistema de Produtividade IA (Custo Zero)

Este guia detalha como configurar e usar o **Obsidian**, **NotebookLM** e
**Claude Code** de forma integrada para otimizar seu fluxo de
desenvolvimento, economizar tokens e maximizar a performance do projeto
PromoBest.

> **Atualizado em 2026-06-06** — adicionadas Dieta de Tokens, Skills sob demanda, Regra de Agentes e §12 Escada de Recursos (Workflows).

---

## 🎯 Filosofia

Transformar o Claude Code de "resolvedor de problemas" em "engenheiro de
execução": ele recebe contexto pré-digerido para focar 100% dos tokens na
lógica de programação.

**Princípio operacional:** cada ferramenta tem uma única responsabilidade.
Quando há sobreposição, a hierarquia abaixo desempata.

---

## 📁 1. Hierarquia dos arquivos de governança

| Arquivo | Carregado | Função | Quem mantém | Quando atualiza |
|---------|-----------|--------|-------------|------------------|
| `.claude/CLAUDE.md` | **Sempre** | Convenções rígidas (stack, regras globais, restrições) | Você | Raramente — só quando mudam invariantes do projeto |
| `CLAUDE_CODE_MASTER_PLAN.md` | Sob demanda | Visão estratégica, arquitetura de agentes, roadmap macro | Você | A cada sprint ou marco |
| `CONTEXT_SYNC.md` | Sob demanda | Briefing da tarefa **atual** | Você (com auxílio do NotebookLM) | A cada tarefa nova |
| `docs/STATUS_YYYY-MM-DD.md` | Sob demanda | Snapshot técnico completo (handoff) | Você + Claude | A cada sprint relevante; arquiva no nome anterior |
| `docs/ECOSYSTEM_GUIDE.md` | Sob demanda | Este manual | Você | Raramente |
| Auto-memory do Claude Code | **Sempre** | Memórias persistentes geradas pelo Claude entre sessões | Claude (automático) | A cada conversa, quando aprende algo durável |

**Regra de ouro:** quando dois arquivos discordam, vale a hierarquia de
cima pra baixo. `CLAUDE.md` > `STATUS` (estado atual) > `MASTER_PLAN`
(visão futura) > `CONTEXT_SYNC` (escopo do momento).

---

## 🛠 2. Configuração das ferramentas

### 2.1 Obsidian (Sua Biblioteca de Conhecimento)

**Configuração inicial:**
1. **Cofre (Vault):** aponte o Obsidian para `C:\Users\jefer\Documents\Projetos\promobest\`.
2. **Excluir pastas pesadas:** `Settings → Files & Links → Excluded files`. Adicione:
   `node_modules`, `.venv`, `.next`, `.git`, `build`, `dist`, `*.lock`, `package-lock.json`.
   *Sem isso, o grafo do Obsidian fica lento e a busca polui com vendor.*

**Organização:**
1. **`INDEX.md` na raiz** — um único painel de links curtos pra todos os
   docs estratégicos (não duplica conteúdo). Estrutura sugerida:
   ```markdown
   # PromoBest — Index
   ## Estratégico
   - [[CLAUDE_CODE_MASTER_PLAN]] — roadmap macro
   - [[CONTEXT_SYNC]] — tarefa atual
   ## Operacional
   - [[docs/STATUS_2026-05-22]] — snapshot mais recente
   - [[docs/DESIGN_AUDIT_2026-05-22]] — auditoria de design
   - [[docs/ECOSYSTEM_GUIDE]] — este manual
   - [[.claude/CLAUDE]] — convenções do projeto
   ## Notas de pesquisa (gerados via NotebookLM)
   - (criar pasta `notes/` e linkar conforme surgem)
   ```
2. **Notas de insights:** quando o NotebookLM gerar análise técnica, salve
   em `notes/Insights_<topic>.md` e linke do `INDEX.md`. Não polua a raiz.
3. **Canvas:** use pra mapear o ecossistema (PromoBest ↔ AchAI ↔ agentes).
   Útil pra você e pra screenshots em handoffs.

### 2.2 NotebookLM (Seu Analista Estratégico)

**Sources a carregar** (Google One AI Premium / Pro ativo até ago/2027 →
até 300 sources × 500k chars cada, Audio Overviews ilimitados, share com
colaboradores). Validado em 2026-05-23.

#### ✅ Internos — sempre subir (core do projeto)

| Arquivo | Por que | Re-upload quando |
|---------|---------|-------------------|
| `CLAUDE_CODE_MASTER_PLAN.md` | Roadmap macro + tabela de agentes + fase atual | A cada V_X+1 (rev. macro) |
| `docs/STATUS_<data>.md` (o **mais recente** apenas) | Snapshot técnico canônico — fonte de verdade do estado | A cada novo snapshot (semanal/sprint) |
| `docs/ECOSYSTEM_GUIDE.md` (este) | Manual de operação do fluxo | Quando esta seção mudar |
| `docs/DESIGN_AUDIT_<data>.md` (o mais recente) | 10 frentes auditadas + matriz severidade×esforço | A cada nova auditoria |
| `docs/roadmap.md` | Roadmap detalhado V2 (Fase 4 com blocos Dogfooding → Design → Produto → Marketing) | A cada revisão do roadmap |
| `.claude/CLAUDE.md` | Convenções rígidas (stack, regras globais) — não muda muito | Raramente |

#### ✅ Internos — subir conforme tópico relevante

| Arquivo | Quando subir |
|---------|--------------|
| `docs/SHOPEE_ML_API_GUIDE.md` | Quando for trabalhar com afiliados / CNPJ / Shopee / ML |
| `docs/analytics.md` | Quando for trabalhar com analytics/KPIs/RFM/A-B |

#### ❌ Internos — **não subir** (conflitam ou estão obsoletos)

| Arquivo | Por quê |
|---------|---------|
| `docs/arquitetura.md` | **Stack listada está errada** (menciona Cloudflare Workers, PostHog, Resend — nada disso é a stack real). Usar `STATUS_<data>.md` como fonte de verdade. |
| `docs/STATUS_2026-05-21.md` e snapshots antigos | Substituídos pelo mais recente. Manter no repo como histórico, mas fora do NotebookLM evita confusão. |
| `CONTEXT_SYNC.md` | Muda a cada tarefa — manter no Obsidian (vault local), não vale subir e re-uploadar toda vez. |

#### 🌐 Externos — subir conforme tópico

- AliExpress Affiliate API (Hot Products + Smart Match) → docs oficiais
- Supabase RLS / Postgres 15 / pg_options → docs Supabase
- Next.js 16 (App Router, Server Components, `unstable_cache`, ISR) → docs Vercel
- Tailwind CSS v4 (`@theme inline`, custom variants) → docs Tailwind

#### Re-upload — quando fazer

- **Sempre** que aparecer um `STATUS_<nova-data>.md` no `docs/` → remove o anterior do NotebookLM e sobe o novo.
- **Sempre** que o `CLAUDE_CODE_MASTER_PLAN.md` ganhar uma nova versão (V4 → V5).
- A cada início de mês, rodar o checklist §10 deste guide.

**Função:** ler centenas de páginas de doc externa e extrair resumo
técnico conciso (3-10 linhas) que vai pro `CONTEXT_SYNC.md`.

**Limitação importante:** NotebookLM **não vê o código** nem o git log. Não
peça pra ele "auditar o repo" — peça pra resumir docs/conceitos e te ajudar
a formar perguntas pro Claude.

**Quando re-uploadar:** o STATUS muda (snapshot novo) ou o MASTER_PLAN é
revisado. Notas internas (CONTEXT_SYNC) mudam muito — não vale subir.

### 2.3 Claude Code (Seu Engenheiro de Execução)

**Como consome contexto, por prioridade:**
1. `.claude/CLAUDE.md` (sempre)
2. Auto-memory (`~/.claude/projects/.../memory/MEMORY.md` — sempre)
3. `CONTEXT_SYNC.md` (você instrui a ler)
4. Demais docs (ler sob demanda quando necessário)
5. Código (lê só quando relevante)

**Interação típica:**
> *"Claude, atualizei o `CONTEXT_SYNC.md`. Leia e execute, referenciando
> `CLAUDE_CODE_MASTER_PLAN.md` e `docs/STATUS_<data>.md` quando precisar."*

**Atualização do roadmap:** ao concluir uma fase grande, instrua o Claude
a abrir um PR atualizando o `CLAUDE_CODE_MASTER_PLAN.md` (marcando itens
concluídos). Evita o doc estratégico apodrecer.

#### Hábitos de terminal para economizar tokens

| Comando | Quando usar |
|---------|-------------|
| `/clear` | **Início de toda tarefa nova** — limpa o contexto da sessão anterior |
| `/compact` | Quando o contexto atingir ~20 mensagens ou antes de tarefa longa |
| `Shift+Tab` (Plan Mode) | Antes de qualquer tarefa arquitetural — alinha abordagem antes de escrever código |
| `/encerrar-missao` | Ao concluir uma tarefa: gera Insights, atualiza INDEX, entrega handoff |
| `/auditoria-periodica` | A cada 3 missões ou ao fechar uma fase — delega ao subagente `auditor` |

**Regra prática:** um `CONTEXT_SYNC` específico e enxuto (< 60 linhas) economiza mais tokens do que qualquer outro hábito. Contexto residual de sessão anterior é o maior desperdício.

#### Dieta de Tokens — governança do CLAUDE.md

O `CLAUDE.md` global (`.claude/CLAUDE.md`) deve ser mantido **enxuto (< 200 linhas)**. Conteúdo volumoso carregado em toda conversa consome tokens mesmo quando irrelevante.

**Como manter enxuto:**
- Regras globais (stack, proibições, restrições de custo) ficam no `CLAUDE.md`.
- Regras específicas de uma pasta ficam em `CLAUDE.md` com escopo `paths:` ou em `apps/frontend/CLAUDE.md` / `apps/backend/CLAUDE.md` (carregados apenas quando o Claude trabalha naquela subárvore).
- Decisões arquiteturais pontuais ficam em `notes/Insights_*.md` (acesso sob demanda, não automático).
- Preferências do usuário e fatos aprendidos ficam na auto-memory — não no `CLAUDE.md`.

**Exemplo de regra path-scoped:**
```markdown
# apps/frontend/CLAUDE.md
- affiliate_url nunca exposta ao cliente — CTAs sempre via /go/{id}
- unstable_cache: nunca retornar null/[] — sempre throw + wrapper externo
```

Esse bloco carrega apenas quando o Claude abre arquivos dentro de `apps/frontend/`, não em toda conversa.

---

## 🧠 3. Auto-memory do Claude Code

O Claude Code mantém memória persistente entre sessões em
`~/.claude/projects/<project>/memory/MEMORY.md`. Algumas decisões viram
memória automaticamente e **não precisam** estar no `CONTEXT_SYNC`:

| Vai pra auto-memory | Vai pro `CONTEXT_SYNC` | Vai pro `CLAUDE.md` |
|---------------------|------------------------|----------------------|
| Preferências pontuais ("prefere PR única em vez de várias") | Tarefa específica do momento | Convenções imutáveis do projeto |
| Origem de fatos ("YEAR=2025 é intencional, projeto começou como AchAI") | Briefing técnico imediato | Stack, padrões de arquitetura |
| Resumos de sprint que ficam úteis depois | Decisões em aberto pra esta tarefa | Restrições de custo, compliance |

**Como saber o que já está em memória:** rode `/memory list` no Claude Code,
ou olhe `C:\Users\jefer\.claude\projects\C--Users-jefer-Documents-Projetos-promobest\memory\MEMORY.md`.

**Implicação prática:** se você já contou algo ao Claude numa sessão
anterior e ele "lembrou" automaticamente, não precisa repetir no
`CONTEXT_SYNC`. Foca o sync no que é específico da próxima tarefa.

---

## 🔄 4. Fluxo de trabalho diário

```
┌─────────────────────────────────────────────────────────────┐
│                  CICLO DE UMA TAREFA                        │
└─────────────────────────────────────────────────────────────┘

1. [Obsidian]    Abra INDEX.md → MASTER_PLAN → identifica próxima tarefa
                                                              │
2. [NotebookLM]  Pergunta dirigida sobre como executar       │
                 (ex.: "Como funciona useOptimistic + Supabase
                  RPC pra contadores atômicos?")               │
                                                              ▼
3. [Obsidian]    Atualiza CONTEXT_SYNC.md com:
                 - Status Atual (copiado do encerramento anterior)
                 - Objetivo em 1-2 frases
                 - 3-5 bullets de contexto relevante
                 - Resumo do NotebookLM (se aplicável)
                 - Próximos passos esperados                  │
                                                              ▼
4. [Terminal]    "Claude, atualizei o CONTEXT_SYNC, executa"
                 Claude lê → planeja → implementa → testa     │
                                                              ▼
5. [Claude]      ★ PROTOCOLO DE ENCERRAMENTO (obrigatório) ★
                 a) Cria notes/Insights_[NomeDaMissao].md
                    com alterações técnicas, arquivos e aprendizados
                 b) Adiciona link no INDEX.md (seção "Notas de pesquisa")
                 c) Atualiza MASTER_PLAN / roadmap se fase concluída
                 d) Entrega ao usuário o texto exato para o campo
                    "## 1. Status Atual" do próximo CONTEXT_SYNC    │
                                                              ▼
6. [Obsidian]    Cola o "Status Atual" no topo do CONTEXT_SYNC.md
                 Marca tarefa como concluída no MASTER_PLAN
```

> **Por que o passo 5 é obrigatório e não "opcional":**
> O arquivo `notes/Insights_*.md` é o único registro durável do que foi feito e por quê. Sem ele, a próxima sessão começa "cega" — o `CONTEXT_SYNC` descreve o que fazer, mas não o que já foi feito. O "Status Atual" entregue pelo Claude é o elo entre sessões: elimina a necessidade de `--resume` ou de reler o histórico de chat.

---

## ✍️ 5. Como escrever um bom CONTEXT_SYNC

**Princípios:**
- 1 tarefa por vez. Se aparecer outra durante a execução, abre PR e
  atualiza o CONTEXT_SYNC pra próxima.
- < 60 linhas. Se passar, a info nova provavelmente cabe em `notes/`.
- Fala da TAREFA, não do PROJETO. Convenções globais vivem no `CLAUDE.md`.
- Sempre cita arquivos/linhas (`apps/frontend/components/OfferCard.tsx:93`)
  quando souber.

### ✅ Bom exemplo

```markdown
# CONTEXT_SYNC — Migrar SkeletonGrid pra componente reusable

## Objetivo
Extrair função SkeletonGrid duplicada em app/page.tsx:16 e app/loading.tsx
pra componente único em components/offers/SkeletonGrid.tsx.

## Contexto
- Apareceu como item §10 do docs/DESIGN_AUDIT_2026-05-22.md
- Severidade 🟢 baixa, esforço S
- Sem mudança visual — só refactor

## Insight relevante (NotebookLM)
Em Next 16 + RSC, componentes de skeleton podem ser Server Components
puros (não precisam de "use client") — reduz bundle do cliente em ~1KB.

## Próximos passos
1. Criar components/offers/SkeletonGrid.tsx exportando função
2. Importar em app/page.tsx (remover def inline)
3. Importar em app/loading.tsx (substituir markup duplicado)
4. Rodar tsc --noEmit
```

### ❌ Anti-padrões

- **Repetir o que está no `CLAUDE.md`** — stack, convenções globais, custo zero. Já é carregado.
- **Briefing inflado** — listar 20 bullets de contexto pra uma tarefa de 30min.
- **Tarefas múltiplas no mesmo arquivo** — vira to-do list, confunde o
  Claude sobre o que é prioridade agora.
- **Estado obsoleto** — descrever como "pendente" coisa que já está em
  produção. Confirma com `STATUS_<data>.md` antes de escrever.
- **Repetir o que já está na auto-memory** — preferências do user,
  histórico de decisões.

---

## 📅 6. Versionamento de docs

### STATUS
- Naming: `docs/STATUS_YYYY-MM-DD.md`
- Cadência: semanal ou quando há mudança arquitetural relevante
- Quando criar um novo:
  1. Copie o anterior pra base
  2. Atualize seções (concluído / pendente / inconsistências)
  3. Mantenha o antigo em `docs/STATUS_YYYY-MM-DD.md` (referência histórica)
  4. Atualize todas as referências em `CLAUDE_CODE_MASTER_PLAN.md`, `INDEX.md`, sources do NotebookLM

### MASTER_PLAN
- Edite quando concluir uma Fase ou redefinir prioridades
- **Não** atualize com cada tarefa pequena — isso é trabalho do Git
- Use checkboxes `[x]` pra marcar itens concluídos (ou remova quando virar
  "óbvio que está feito")

### CONTEXT_SYNC
- Sobrescreve a cada tarefa — não é histórico
- Pode ser commitado ou .gitignore-ado conforme preferência (sugestão:
  commitado, pra ter referência da última tarefa)

---

## 🧪 7. Setup em 30 minutos (primeira vez)

1. **Obsidian:**
   - Instalar → abrir cofre na raiz do projeto → adicionar pastas excluídas
   - Criar `INDEX.md` com a estrutura sugerida em §2.1
   - Verificar que pasta `notes/` existe (cria se não)
2. **NotebookLM:**
   - notebooklm.google.com → New notebook → "PromoBest"
   - Add Source × N: enviar arquivos listados em §2.2
   - Testar com pergunta: "Qual o stack do PromoBest?" — deve responder
     citando o `STATUS_2026-05-22.md`
3. **Claude Code (já está rodando):**
   - Conferir auto-memory: `cat ~/.claude/projects/<project>/memory/MEMORY.md`
   - Conferir CLAUDE.md: já existe em `.claude/CLAUDE.md`
4. **Primeira tarefa:**
   - Escolhe um item pequeno do MASTER_PLAN
   - Escreve CONTEXT_SYNC seguindo o exemplo §5
   - Roda no Claude

---

## ⚠️ 8. Anti-padrões comuns

| Anti-padrão | Por que evitar | Solução |
|-------------|----------------|---------|
| Conteúdo duplicado entre `INDEX.md` e MASTER_PLAN | INDEX vira fonte concorrente de verdade | INDEX só tem links curtos, nunca conteúdo |
| MASTER_PLAN com 200 itens TODO | Vira lixeira, ninguém consulta | Itens detalhados vão pro `notes/`; MASTER_PLAN tem só os macro |
| CONTEXT_SYNC sem ser atualizado entre tarefas | Claude trabalha em escopo antigo | Hábito: 1ª coisa de cada sessão = revisar CONTEXT_SYNC |
| NotebookLM com sources velhos | Resume estado obsoleto e gera plano errado | Re-upload do STATUS toda vez que vira um novo `STATUS_<data>` |
| Tudo no `CLAUDE.md` | Carrega em toda conversa, custo de token alto | Só invariantes (stack, restrições). Resto vai pra docs sob demanda |

---

## 9. Estrutura de arquivos

| Arquivo | Localização | Função |
|---------|-------------|--------|
| `INDEX.md` | Raiz do vault | Painel de controle do Obsidian (só links) |
| `.claude/CLAUDE.md` | `.claude/` | Convenções rígidas do projeto |
| `CLAUDE_CODE_MASTER_PLAN.md` | Raiz | Roadmap estratégico e visão de agentes |
| `CONTEXT_SYNC.md` | Raiz | Briefing da tarefa atual |
| `STATUS_<data>.md` | `docs/` | Snapshot técnico (uma versão por sprint) |
| `DESIGN_AUDIT_<data>.md` | `docs/` | Auditorias periódicas de design/UX |
| `ECOSYSTEM_GUIDE.md` | `docs/` | Este manual |
| `notes/Insights_<topic>.md` | Raiz `notes/` | Análises do NotebookLM, lições aprendidas |

---

## 10. Checklist de saúde do ecossistema (mensal)

- [ ] STATUS está com data atual? (não > 30 dias)
- [ ] MASTER_PLAN não tem itens concluídos marcados como `[ ]`?
- [ ] CONTEXT_SYNC reflete a tarefa real do momento?
- [ ] NotebookLM tem o STATUS mais recente como source?
- [ ] INDEX.md aponta pros arquivos certos (sem links quebrados)?
- [ ] Auto-memory do Claude não tem facts desatualizados? (rodar `/memory list`)

---

---

## 11. Regra de Agentes Autônomos

Agentes Python autônomos (ex.: `blog_curator`, `blog_writer`, `blog_publisher`, `crm_reativacao`) **nunca devem commitar diretamente na branch `main`**.

**Fluxo obrigatório para agentes que alteram o repositório:**

```
agente executa tarefa
        │
        ▼
cria branch: agent/<nome>-<YYYY-MM-DD>
        │
        ▼
abre Pull Request no GitHub com:
  - título: "agent(<nome>): <descrição>"
  - body: lista do que foi gerado/alterado
        │
        ▼
Founder revisa → aprova → merge (ou rejeita)
```

**Por que:** agentes operam sem contexto completo do projeto. Um merge direto na `main` pode publicar conteúdo incorreto, quebrar tipagens ou introduzir dados sujos sem chance de revisão. O PR é o ponto de controle humano obrigatório.

**Exceção:** agentes que só escrevem em banco (Supabase) — como o `crm_reativacao` — não precisam de PR, pois o banco tem trilha de auditoria própria (`crm_sends`, `crm_optouts`).

---

---

## 12. Orquestração e Escada de Recursos (Workflows e Ultracode)

### A Escada de Recursos

Use **sempre a ferramenta mais barata que resolve o problema**. Suba um degrau apenas quando o degrau inferior for claramente insuficiente.

| Degrau | Ferramenta | Quando é suficiente |
|--------|-----------|---------------------|
| 1 | **Prompt direto** | 1 tarefa, 1 arquivo, resposta imediata |
| 2 | **Skills** (`/encerrar-missao`, `/auditoria-periodica`, etc.) | Tarefas recorrentes com protocolo definido |
| 3 | **Subagentes simples** (`Agent` tool) | Pesquisas paralelas independentes, exploração de codebase |
| 4 | **Agent Teams** (subagente `auditor`, `backend-engineer`, etc.) | Quando há debate de abordagem ou especialização de domínio |
| 5 | **Dynamic Workflows** | Trabalho massivo em paralelo — centenas de arquivos, deep research, traduções em escala |

**Regra prática:** se o `/go` (fluxo normal de tarefa) resolve, não invoque Workflows. A complexidade de orquestração tem custo de token, tempo de setup e risco de deriva.

---

### Quando usar Dynamic Workflows

✅ **Use para tarefas de "largura":**
- Varreduras em centenas de arquivos (ex.: atualizar todas as strings de texto do frontend)
- Deep research em múltiplas fontes em paralelo (ex.: benchmarking de 20 concorrentes simultaneamente)
- Traduções ou transformações em massa (ex.: i18n de todo o conteúdo do blog)
- Testes de carga distribuída ou cobertura de testes em paralelo

❌ **Não use para:**
- Tarefas de "profundidade" (bug específico, nova feature, refactor pontual) — o fluxo normal de tarefa resolve com mais contexto e menos custo
- Tarefas com interdependências fortes (um agente bloqueado por resultado de outro cria gargalo que desperdiça paralelismo)
- Qualquer tarefa que cabe em < 30 min de sessão

---

### Otimização de Custos — Regra do Haiku

Todo Workflow deve seguir o padrão **"Haiku extrai, Sonnet/Opus sintetiza"**:

```
[Agentes extratores/pesquisadores] → modelo: claude-haiku-4-5-20251001 (barato, rápido)
         │
         ▼ resultados intermediários
[Agente de síntese] → modelo: claude-sonnet-4-6 (ou opus, se a síntese exige raciocínio crítico)
```

Nunca instrua um Workflow a usar o modelo principal em todos os agentes — isso multiplica custo linear com o número de workers.

---

### Monitoramento Ativo

Antes de iniciar qualquer Workflow com > 5 agentes paralelos:

1. **Estime tokens:** defina um teto explícito na instrução do Workflow (ex.: "máx. 100k tokens por agente").
2. **Acompanhe em tempo real:** execute `/workflows` no terminal Claude Code para ver consumo e status de cada worker.
3. **Critério de parada:** se o consumo ultrapassar 2× a estimativa inicial, pare com `/workflows stop <id>` e revise o escopo.
4. **Teste primeiro em escala menor:** todo Workflow que altera código deve ser testado em uma subpasta ou amostra de 10% dos arquivos antes de rodar na base completa.

---

### Reuso — Pasta `.claude/workflows/`

Workflows maduros (testados, com boa relação custo/benefício) devem ser salvos em `.claude/workflows/<nome>.md` com:

- Descrição do problema que resolve
- Modelo recomendado por degrau (Haiku extrator / Sonnet síntese)
- Estimativa de tokens por execução
- Comando de invocação

Isso evita reescrever o mesmo Workflow em sessões futuras e permite revisão pela equipe antes de invocar.

---

### Integração com a Regra de Agentes (§11)

Subagentes gerados por Workflows que **alteram código** continuam obrigados a seguir a Regra de Agentes (§11):

- Criar branch `agent/<nome>-<YYYY-MM-DD>`
- Abrir Pull Request — nunca commitar direto na `main`
- O Founder revisa → aprova → merge

Workflows que só leem ou escrevem em banco (Supabase) não precisam de PR, mas devem registrar log de execução.

---

*Assinado: Manus AI — Estrategista de Ecossistemas IA*
*Revisado por Claude Code em 2026-06-06 — adicionadas Dieta de Tokens (CLAUDE.md path-scoped), Skills sob demanda (/encerrar-missao, /auditoria-periodica), Regra de Agentes (PR obrigatório, nunca direto na main) e §12 Escada de Recursos (Workflows, Regra do Haiku, monitoramento ativo).*
