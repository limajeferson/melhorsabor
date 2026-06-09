# 📡 CONTEXT_SYNC — MelhorSabor

> Briefing para o Claude Code. Ler no início de cada sessão antes de qualquer ação.
> Gerado/atualizado pelo NotebookLM após cada ciclo de missões.

**Última atualização:** 2026-06-09
**Missão mais recente concluída:** 6.1
**Próxima missão:** 7 — Gamificação + Integração de Pagamento

---

## 🚦 Estado atual do projeto

| Componente | Status | Detalhe |
|---|---|---|
| Repositório GitHub | ✅ | limajeferson/melhorsabor |
| Deploy Vercel | ✅ | melhorsabor.com.br · DNS propagado |
| Next.js 16 + App Router | ✅ | apps/frontend/ |
| Supabase (projeto ljboadzbqzutwwogzmbq) | ✅ | Auth + user_profiles + waitlist |
| Google OAuth | ✅ | Ativo no Supabase + código integrado |
| Magic Link (email) | ✅ | Fluxo completo operacional |
| PostHog analytics (região EU) | ✅ | Keys configuradas na Vercel + .env.local |
| Sentry error monitoring | ✅ | v8, client + server |
| Landing page dinâmica | ✅ | 8 seções animadas, paleta apetite/pastel |
| Onboarding segmentado | ✅ | Quiz dinâmico por público (você/casa/família) |
| Tela de oferta (comunidade) | ✅ | Mock social com comentários em loop |
| Tela de auth (Google + email) | ✅ | Campo nome + Google OAuth + Magic Link |
| Tela de planos | ✅ | Pricing table pós-cadastro (sem gateway ainda) |
| Supabase user_profiles | ✅ | Colunas segmentadas + raw_answers jsonb |
| Gamificação | 📄 | Visão documentada — não implementada |
| Gateway de pagamento | ⏳ | Missão 7 |
| Sistema de receitas | ⏳ | Fase 3 |

---

## 🎨 Design system atual

**Paleta ativa** (globals.css):
- `cream` #fffaf3 — fundo pastel quente
- `peach` #ffe8d6 — pêssego
- `apricot` #ffc985 — damasco
- `honey` #ffd27d — mel/alegria
- `tomato` #f47b3a — **laranja-vitalidade** (CTA, não vermelho)
- `paprika` #d95f1a — laranja escuro (hover)
- `sage` #7ab8a0 — verde-sálvia (saúde)
- `nude` #f5ede3 — nude pastel (cards)
- `warm-gray` #7a6f69 — texto secundário

Verde marca original (`--primary`) mantido para elementos institucionais (header, seção de features).

---

## 🔄 Fluxo do onboarding (atual)

```
Landing ("Fazer o teste gratuito")
  → /onboarding (quiz dinâmico por público)
    → Tela de Oferta (comunidade + mock social + bônus segmentado)
      → Tela de Auth (Google OAuth ou Magic Link + nome)
        → Tela de Planos (pricing table: mensal/trimestral/semestral/anual)
          → (gateway de pagamento — pendente)
            → /onboarding/callback (salva perfil no Supabase → redirect /)
```

---

## 💡 Decisões estratégicas tomadas (Missão 6.1)

1. **Inversão de oferta:** vende-se acesso à COMUNIDADE; infoproduto segmentado = bônus grátis
2. **Comunidade como produto:** pertencimento → aversão à perda → baixo reembolso
3. **Público ampliado:** trilha para mães/donas de casa que organizam a rotina da família
4. **Gamificação íntima:** sem pontos/ranking público; badges privados + calendário + fases ocultas
5. **Pricing:** R$47/mês · R$139/trim · R$276/sem · R$477/ano (anual em destaque "Mais assinado")
6. **PostHog região EU** (validado — melhor para LGPD)

---

## 📋 O que está pendente para a Missão 7

### Prioridade alta
- [ ] **Gateway de pagamento** — integrar Stripe ou Mercado Pago nos planos (botão hoje tem `alert()`)
- [ ] **Gamificação — fase 1:** modelo de dados (`user_checkins`, `user_badges`) + UI do calendário + primeiros badges

### Prioridade média
- [ ] Página `/perfil` (protegida por auth) — mostrar conquistas, badges, histórico
- [ ] Callback atualizado para redirecionar para `/planos` em vez de `/`
- [ ] Receitas básicas (primeiras 10, seed no Supabase)

### Prioridade baixa / próximas missões
- [ ] Sistema completo de receitas
- [ ] IA para sugestão de receitas
- [ ] SEO programático

---

## 📂 Arquivos críticos para contexto

```
CONTEXT_SYNC.md                          ← este arquivo
INDEX.md                                 ← mapa de documentos
CLAUDE_CODE_MASTER_PLAN.md               ← roadmap macro
notes/Insights_Missao6_1.md              ← última missão executada
docs/GAMIFICATION_VISION.md              ← visão de gamificação (novo)
apps/frontend/app/onboarding/page.tsx    ← fluxo completo do onboarding
apps/frontend/lib/offer.ts               ← lógica de planos e bônus
apps/frontend/app/globals.css            ← design system + paleta
supabase/migrations/                     ← histórico de schema
```

---

*Ciclo: NotebookLM (briefing) → Claude Code (execução) → GitHub → Vercel → NotebookLM (revisão)*
*Versão: 2.0 | Data: 2026-06-09*
