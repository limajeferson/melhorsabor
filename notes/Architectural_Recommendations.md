# 🏗️ Recomendações Arquiteturais — APM & Observabilidade

> 🔗 Navegação: [[INDEX]] | [[docs/BLUEPRINT]] | [[notes/Insights_Missao3]] | [[notes/Insights_Missao4]]

**Data:** 2026-06-07  
**Autor:** Claude Code (Agente de Arquitetura)  
**Contexto:** Missão 3 — Custo operacional zero, escala inicial < 10k usuários  
**Decisão:** Pesquisa e proposta. **Nada instalado ainda.**

---

## TL;DR — Recomendação em 3 Camadas

| Camada | Ferramenta | Custo | Quando ativar |
|--------|-----------|-------|---------------|
| Web Analytics | **Vercel Analytics** | $0 (Hobby) | Imediato — zero config |
| Product Analytics + Session Replay | **PostHog** | $0 (até 1M eventos/mês) | Missão 4 (pós-deploy) |
| Error Monitoring | **Sentry** | $0 (5K erros/mês) | Missão 4 (pós-deploy) |

---

## 1. Análise de Opções

### 1.1 Vercel Analytics (Web Analytics nativo)

**O que é:** Ferramenta de page-view analytics integrada ao painel da Vercel.

**Free tier:** Incluído no plano Hobby. Coleta de eventos pausa ao atingir o limite mensal (sem cobrança automática).

**Prós:**
- Zero configuração — ativado com um toggle no painel Vercel
- Nenhuma dependência de código, nenhuma biblioteca instalada
- Dados de Core Web Vitals (LCP, CLS, FID) por padrão
- Privacy-first: sem cookies de rastreamento

**Contras:**
- Apenas page views e performance — sem eventos customizados
- Sem funis, sem session replay
- Limite de eventos no Hobby (exato não divulgado)

**Veredito:** ✅ Ativar imediatamente. É gratuito e já está disponível.

---

### 1.2 PostHog (Product Analytics + Session Replay + Feature Flags)

**O que é:** Suite completa de product analytics, open-source, com plano cloud gratuito generoso.

**Free tier (2026):**
- 1.000.000 events/mês (analytics)
- 5.000 session recordings/mês
- 1.000.000 feature flag requests/mês
- 1.500 survey responses/mês
- 100.000 error tracking exceptions/mês
- Retenção: 1 ano
- Sem cartão de crédito obrigatório

**Prós:**
- Substitui Google Analytics + Hotjar + LaunchDarkly no free tier
- SDK Next.js oficial, compatível com App Router
- Self-hostable (se quisermos custo zero absoluto no futuro)
- Análises de funil — fundamental para otimizar a waitlist

**Contras:**
- 1M eventos soa muito, mas um usuário ativo gera ~50–100 eventos/sessão
- Interface pode ser complexa para quem não é analista
- Dados vão para servidores nos EUA (PostHog Cloud) — precisa de DPA para LGPD

**Veredito:** ✅ Recomendado para Missão 4. Mais poderoso que GA para um produto orientado a produto.

---

### 1.3 Sentry (Error Monitoring + Performance Tracing)

**O que é:** Plataforma de rastreamento de erros em produção, com performance monitoring.

**Free tier (2026 — Developer Plan):**
- 5.000 errors/mês
- 10.000 spans (performance traces)
- 50 session replays
- 50 profiling hours
- Sem cobrança por overage — para de coletar ao atingir o limite

**Prós:**
- SDK Next.js oficial com suporte a App Router, Server Actions e Edge Runtime
- Alertas de erros em tempo real (e-mail/Slack)
- Source maps automáticos na Vercel
- Stack traces com contexto de código

**Contras:**
- 5K erros/mês é baixo para produção com tráfego real
- Upgrade para Team custa $26/mês ao adicionar mais 1 membro
- Source maps requerem `SENTRY_AUTH_TOKEN` no CI

**Veredito:** ✅ Recomendado para Missão 4. Indispensável para detectar erros em produção antes que usuários reclamem.

---

### 1.4 OpenTelemetry + SigNoz (Alternativa Self-Hosted)

**O que é:** Next.js suporta OpenTelemetry nativamente (`instrumentation.ts`). SigNoz é um backend open-source para receber traces e métricas.

**Free tier:** Ilimitado se self-hosted (custo de infra ~$5–10/mês no Railway/Fly.io).

**Prós:**
- Vendor lock-in zero — mesmos dados, qualquer backend
- Traces distribuídos end-to-end (frontend → API → banco)
- SigNoz tem UI moderna, próxima ao Datadog

**Contras:**
- Requer manutenção de infraestrutura (SigNoz + ClickHouse)
- Complexidade alta para fase inicial
- Contraria o princípio "Simples > Complexo" do projeto

**Veredito:** ⏳ Guardar para Fase 4 (Escala). Quando o tráfego exigir traces distribuídos, migrar o código é fácil porque Next.js já suporta OTel nativamente.

---

### 1.5 Opções Descartadas

| Ferramenta | Motivo da exclusão |
|-----------|-------------------|
| Google Analytics 4 | Problemas com LGPD/GDPR, complexidade desnecessária |
| Datadog | Pago, não alinha com custo zero |
| New Relic | Plano gratuito com 1 usuário — limitado para times |
| Mixpanel | Free tier mais restrito que PostHog (20M eventos mas só 90 dias retenção) |
| Grafana Cloud | Excelente mas mais complexo que PostHog para um MVP |

---

## 2. Arquitetura de Observabilidade Recomendada

```
                    ┌─────────────────────────────┐
                    │   MelhorSabor (Next.js)      │
                    │                              │
  Usuário ──────►  │  ┌──────────┐  ┌──────────┐ │
                    │  │  Pages   │  │   APIs   │ │
                    │  │ (RSC)    │  │ (Actions)│ │
                    │  └────┬─────┘  └────┬─────┘ │
                    └───────┼─────────────┼───────┘
                            │             │
               ┌────────────▼─────┐  ┌───▼──────────────┐
               │ Vercel Analytics  │  │  Sentry (errors)  │
               │ (Web vitals,      │  │  5K erros/mês     │
               │  page views)      │  │  free             │
               └───────────────────┘  └──────────────────┘
                            │
               ┌────────────▼──────────────────────────────┐
               │  PostHog (product analytics)               │
               │  1M events/mês · session replay · flags    │
               └───────────────────────────────────────────┘
```

---

## 3. Plano de Implementação

### Missão 4 (próxima): Ativar Vercel Analytics
```bash
# No painel Vercel: Settings → Analytics → Enable
# Nenhum código necessário
```

### Missão 4: Instalar PostHog
```bash
npm install posthog-js posthog-node
```
```typescript
// app/providers.tsx — PostHogProvider (client component)
// Apenas 1 arquivo de setup + variável de ambiente
```

### Missão 4: Instalar Sentry
```bash
npx @sentry/wizard@latest -i nextjs
# Wizard configura automaticamente:
# - sentry.client.config.ts
# - sentry.server.config.ts
# - instrumentation.ts
# - next.config.ts (withSentryConfig)
```

---

## 4. Estimativa de Uso — MelhorSabor Early Stage

| Métrica | Estimativa 6 meses | PostHog free? | Sentry free? |
|---------|-------------------|---------------|--------------|
| Usuários únicos/mês | 500–2.000 | ✅ | ✅ |
| Eventos analytics/mês | 50K–200K | ✅ (limite 1M) | — |
| Erros JS/mês | ~200–500 | — | ✅ (limite 5K) |
| Session replays/mês | 500–1.500 | ✅ (limite 5K) | — |

**Conclusão:** As três ferramentas cobrem confortavelmente o crescimento até ~10K usuários mensais sem custo.

---

## 5. Decisão Final

> **Ativar agora:** Vercel Analytics (zero config, zero custo)  
> **Implementar na Missão 4:** PostHog + Sentry  
> **Guardar para Fase 4:** OpenTelemetry + SigNoz  

Essa stack cobre 100% das necessidades de observabilidade de um MVP, mantém custo zero e é reversível a qualquer momento.

---

*Pesquisa: Claude Code | Missão 3 | 2026-06-07*
