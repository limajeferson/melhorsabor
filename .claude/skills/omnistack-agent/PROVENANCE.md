# Proveniência — omnistack-agent

**Origem:** [Ricar66/omnistack-agent](https://github.com/Ricar66/omnistack-agent) · arquivo `adapters/claude/SKILL.md`
**Licença:** MIT · zero dependências NPM · Node ≥ 18 (apenas para recompilar no upstream)
**Instalado em:** 2026-06-08 (Missão 5)
**Auditoria de segurança:** ✅ limpa (sem injeção de prompt, sem rede/credenciais/telemetria, sem automação de git; guardrails próprios "No destructive actions without confirmation"). Ver [[notes/Insights_Missao5]].

## Por que está aqui (governança)

Instalado como **Skill sob demanda** (Degrau 2 da Escada de Recursos — ver `docs/ECOSYSTEM_GUIDE.md §12`), e **não** como regra global. O corpo (~2k linhas) só carrega no contexto quando a skill é invocada — apenas a `description` do frontmatter pesa no dia a dia. Respeita a Dieta de Tokens. O `.claude/CLAUDE.md` principal **não** foi alterado.

## Como invocar

`/omnistack-agent` — quando precisar de raciocínio aprofundado de Arquiteto, DBA, DevOps, QA ou revisão de design full-stack. Para tarefas pontuais do dia a dia, continue usando o fluxo normal (não invoque — gastaria tokens à toa).

## Como atualizar

`SKILL.md` é **gerado** no upstream (`core/ + knowledge/`, `npm run build`) — não editar manualmente. Para atualizar, rebaixar o arquivo da origem e re-auditar antes de substituir:

```bash
gh api repos/Ricar66/omnistack-agent/contents/adapters/claude/SKILL.md --jq '.content' | base64 -d > .claude/skills/omnistack-agent/SKILL.md
```
