# 📋 Briefing Missão 7 — Para o NotebookLM passar ao Claude Code

> Este documento serve dois propósitos:
> 1. Informar o NotebookLM sobre tudo que evoluiu no projeto
> 2. Dar o passo a passo exato de como o NotebookLM deve comunicar a próxima missão ao Claude Code

---

## 📰 O que evoluiu desde a última atualização das fontes

### Missão 6 (2026-06-08)
- Supabase Auth implementada via Magic Link
- Tabela `user_profiles` criada com respostas do onboarding
- Callback pós-auth salva perfil no banco

### Missão 6.1 (2026-06-09) — grande salto estratégico
- **Onboarding reescrito** como funil de quiz dinâmico segmentado por público:
  - Trilha "Para mim" — saúde pessoal, biotipo, atividade física
  - Trilha "Para minha casa/família" — mães/donas de casa, rotina, crianças, desafios
  - Trilha "Ambos" — combina as duas
- **Tela de Oferta** implementada (Inversão de Oferta):
  - Vende acesso à COMUNIDADE (não produto avulso)
  - Bônus hiper-segmentado derivado das respostas (grátis de entrada)
  - Mock social animado com dois posts lado a lado e comentários em loop
- **Google OAuth** + Magic Link + campo nome na tela de auth
- **Pricing table** pós-cadastro: Mensal R$47 / Trim R$139 / Sem R$276 / Anual R$477
- **Landing page** completamente redesenhada (8 seções animadas, CTA de diagnóstico)
- **Paleta de cores** atualizada: laranja-vitalidade (#f47b3a) substituiu vermelho; palette pastel/nude
- **Migration Supabase** aplicada: colunas segmentadas + `raw_answers jsonb`
- **DNS** melhorsabor.com.br propagado; PostHog (região EU) keys ativas na Vercel
- **Gamificação** — visão completa documentada em `docs/GAMIFICATION_VISION.md`:
  - Filosofia: progresso íntimo, não competitivo
  - Calendário de check-ins (dias coloridos, sem streak punitivo)
  - Badges privados (só a pessoa vê as próprias conquistas)
  - Fases ocultas da jornada (Semente → Broto → Raiz → Colheita)
  - Motivação horizontal na comunidade (sem ranking)

---

## 🎯 Objetivo da Missão 7

**Dois eixos principais:**

### Eixo 1: Gateway de Pagamento
O botão "Assinar plano" hoje tem um `alert()` de placeholder.
Precisamos integrar um gateway real. Opções a avaliar: **Stripe** (internacional, melhor DX) ou **Mercado Pago** (Brasil, maior conversão nacional).

### Eixo 2: Gamificação — Fase 1
Implementar a base da gamificação conforme `docs/GAMIFICATION_VISION.md`:
- Modelo de dados no Supabase
- Calendário de check-ins
- Primeiros badges desbloqueáveis
- Página `/perfil` protegida

---

## 📋 Passo a passo para o NotebookLM passar ao Claude Code

### O que o NotebookLM deve fazer antes de chamar o Claude Code:

1. **Ler as fontes atualizadas** (ver lista abaixo) para entender o estado atual
2. **Gerar um CONTEXT_SYNC.md atualizado** com o briefing da Missão 7
3. **Escrever o comando de missão** seguindo o template abaixo

### Template exato do comando para enviar ao Claude Code:

```
Leia CONTEXT_SYNC.md e notes/Insights_Missao6_1.md antes de começar.

--- MISSÃO 7: Gamificação + Gateway de Pagamento ---

CONTEXTO ESTRATÉGICO:
O onboarding está completo e operacional com funil de quiz segmentado, 
tela de oferta com comunidade, Google OAuth e pricing table.
O botão de assinatura tem um alert() de placeholder — precisa de gateway real.
A visão de gamificação está documentada em docs/GAMIFICATION_VISION.md.

ENTREGÁVEIS DESTA MISSÃO:

1. GATEWAY DE PAGAMENTO
   - Avaliar Stripe vs Mercado Pago para o mercado brasileiro
   - Integrar o gateway escolhido no botão "Assinar plano" da tela de planos
   - Redirecionar para checkout externo ou implementar checkout embutido
   - Webhook para confirmar pagamento e desbloquear acesso
   - Enviar bônus por e-mail após confirmação (pode ser trigger no Supabase)

2. GAMIFICAÇÃO — FASE 1
   Seguindo a filosofia de docs/GAMIFICATION_VISION.md (íntima, não competitiva):
   - Migration Supabase: tabelas user_checkins e user_badges
   - UI do calendário mensal de check-ins (paleta honey/apricot/cream)
   - Primeiros 4 badges implementados (Primeira Refeição, Semana Inteira, 
     Silêncio Produtivo, Mês Colorido)
   - Lógica de badge: função que avalia condições ao salvar check-in

3. CALLBACK E PERFIL
   - Atualizar /onboarding/callback para redirecionar para /planos após cadastro
   - Criar página /perfil (protegida por auth) com:
     - Calendário de check-ins
     - Badges conquistados (privados)
     - Fase atual da jornada

RESTRIÇÕES:
- Manter custo operacional zero onde possível
- Não alterar RLS do Supabase sem confirmar
- Não quebrar o fluxo atual de onboarding
- Commitar por etapas (pagamento separado de gamificação)

Ao fim, gerar notes/Insights_Missao7.md com o que foi feito.
```

---

## 📁 Arquivos para atualizar nas fontes do NotebookLM

Substitua ou adicione os seguintes arquivos no NotebookLM:

### Remover (versão antiga):
- `INDEX.md` (versão antiga)
- `CLAUDE_CODE_MASTER_PLAN.md` (versão antiga)
- `notes/Insights_Missao5.md` (pode manter, mas não é mais a mais recente)

### Adicionar/substituir:
| Arquivo | Por que |
|---------|---------|
| `INDEX.md` | Atualizado com status real (v1.7) |
| `CLAUDE_CODE_MASTER_PLAN.md` | Missões 6 e 6.1 marcadas como concluídas; Missão 7 definida |
| `CONTEXT_SYNC.md` | Criado do zero — briefing atual do projeto |
| `notes/Insights_Missao6_1.md` | Última missão executada — mais importante |
| `docs/GAMIFICATION_VISION.md` | Novo — visão de gamificação íntima |
| `notes/Product_Vision_Notes.md` | Se quiser manter o contexto de produto original |

### Arquivos opcionais (contexto adicional):
| Arquivo | Por que |
|---------|---------|
| `apps/frontend/app/onboarding/page.tsx` | Código completo do funil (útil para o NotebookLM entender o que foi construído) |
| `apps/frontend/lib/offer.ts` | Lógica de planos e bônus |
| `supabase/migrations/20260608_002_onboarding_segmentation.sql` | Schema atual |

---

## 🔄 Ciclo de trabalho (lembrete)

```
1. Jeferson tem insight / feedback
       ↓
2. Anota no NotebookLM (brainstorm, validação)
       ↓
3. NotebookLM gera CONTEXT_SYNC.md atualizado
       ↓
4. Jeferson abre Claude Code e envia o comando de missão
       ↓
5. Claude Code executa, commita, faz push
       ↓
6. Claude Code gera notes/Insights_MissaoX.md
       ↓
7. Jeferson sobe os arquivos atualizados nas fontes do NotebookLM
       ↓
(volta ao passo 1)
```

---

*Criado em: 2026-06-09 | Para uso do NotebookLM na preparação da Missão 7*
