# Insights — Missão 6.1: Funil de Quiz Segmentado + Oferta + Landing Dinâmica

> 🔗 Navegação: [[INDEX]] | [[CLAUDE_CODE_MASTER_PLAN]] | ← [[notes/Insights_Missao6]] | [[docs/POSTHOG_GUIDE]]

**Data:** 2026-06-09
**Status:** ✅ Concluída

---

## 🎯 O que foi entregue

### 1. Onboarding reescrito como funil de quiz segmentado
`apps/frontend/app/onboarding/page.tsx` — fluxo agora é **montado dinamicamente** (`buildSteps(answers)`) em vez de lista fixa.

- **Públicos segmentados** (1ª pergunta): `para_si` / `para_casa` / `ambos`. Define a(s) trilha(s):
  - **Trilha pessoal:** objetivo → pratica atividade? → (ramo: academia se NÃO pratica | nível se pratica) → cozinha → como se alimenta (inclui *fast food/delivery*) → ânimo → faixa etária → biotipo → restrições.
  - **Trilha casa/família** (mães/donas de casa/quem organiza a rotina): objetivo da casa → nº de pessoas → crianças → tempo de preparo → rotina atual → restrições da família → maior desafio.
- **Sem emojis** em todas as perguntas/opções.
- **Biotipo:** descrição como texto principal, nome técnico como legenda discreta (+ opção "Não tenho certeza").
- **Aviso médico contextual** (`type: "notice"`): genérico, sem especificar especialidade (sem certificação legal). Disparado por score de risco (sedentário/não pratica + fast food + não cozinha + desânimo) **no meio do fluxo**, não só no fim. Gera escassez e responsabilidade.
- Opções com lógicas distintas entre perguntas; pedido de sinceridade nos subtítulos de entrada.

### 2. Tela de Oferta (Inversão de Oferta)
Nova fase `offer` entre o quiz e o auth. `apps/frontend/lib/offer.ts`:
- Vende **acesso à comunidade/plataforma**; infoproduto segmentado = **bônus grátis**.
- **Bônus hiper-segmentado** derivado das respostas (`deriveBonus`): ex. "Guia de Sobrevivência em Restaurantes", "Cardápio da Família Descomplicado".
- **Pricing table** com ancoragem: Mensal R$47 / Trimestral R$139 / Semestral R$276 / **Anual R$477 (destaque "Mais assinado")**. Desconto % calculado na UI (`discountPercent`) e equivalente mensal exibido.
- Plano escolhido vai para `localStorage` → `raw_answers.selected_plan`.

### 3. Persistência (Supabase)
Migration **aplicada via MCP**: `supabase/migrations/20260608_002_onboarding_segmentation.sql`.
- Aditiva (sem tocar RLS): colunas `publico, pratica, nivel, animo, objetivo_casa, tamanho_casa, criancas, tempo_preparo, rotina_casa, restricoes_casa[], desafio_casa` + **`raw_answers jsonb`** (snapshot à prova de evolução do questionário).
- Callback atualizado para persistir todos os campos + `raw_answers`. Types ajustados.

### 4. Landing page dinâmica (via subagente)
`app/page.tsx` reescrito compondo seções em `components/landing/`: `hero`, `how-it-works`, `audiences`, `community`, `features`, `waitlist-section`, `final-cta`, `site-footer`.
- CTA primário = "Fazer o teste gratuito" → `/onboarding` (estratégia de diagnóstico gratuito).
- Seção de comunidade e de públicos (você vs família).

### 5. Design system — paleta "Apetite + Pastel"
`app/globals.css`: tokens `cream, peach, apricot, honey, tomato, paprika, sage` expostos como utilitários Tailwind. Psicologia das cores: quentes (tomate/mel) estimulam apetite e viram cor de CTA; pastéis dão leveza; verde-sálvia = saúde.

### 6. PostHog — região EU validada
Default do provider corrigido para `https://eu.i.posthog.com` (LGPD/GDPR). Novos eventos: `onboarding_audience_selected`, `onboarding_medical_notice_shown`, `onboarding_offer_viewed`, `onboarding_plan_selected`.

---

## ⚠️ Pendências
1. **Vercel/.env.local:** `NEXT_PUBLIC_POSTHOG_KEY` e `NEXT_PUBLIC_POSTHOG_HOST=https://eu.i.posthog.com` (Production + Preview).
2. **Checkout real:** o CTA "Desbloquear meu acesso" hoje leva ao auth (Magic Link); falta integrar gateway de pagamento para cobrar os planos.
3. **DNS melhorsabor.com.br:** aguardando propagação (registro.br + Vercel).

---

**Mantra:** "Simples > Complexo. Rápido > Perfeito. Documentado > Secreto."

*Versão: 1.0 | Data: 2026-06-09*
