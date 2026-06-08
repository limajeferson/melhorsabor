# Insights — Missão 4: Telemetria + Tipos + Onboarding

**Data:** 2026-06-07  
**Status:** ✅ Concluída (npm install pendente no Windows — instruções abaixo)

---

## 🎯 O que foi entregue

### 1. Tipos Supabase (auto-gerados via MCP)
- Criado `apps/frontend/types/database.types.ts` com tipos oficiais gerados pelo MCP Supabase
- Removido `apps/frontend/types/database.ts` (manual, substituído)
- `lib/supabase.ts` atualizado para importar do novo arquivo
- **Decisão:** usar MCP em vez de CLI foi mais rápido e não requer autenticação separada

### 2. PostHog (analytics)
- Instalado `posthog-js ^1.257.0`
- Criado `components/providers/PostHogProvider.tsx` — wrapper client-side
- Integrado em `app/layout.tsx` envolvendo todo o app
- Evento `waitlist_joined` disparado em `components/waitlist-form.tsx` com `useRef` para evitar duplicatas
- **Custo:** 0 (free tier: 1M eventos/mês)

### 3. Sentry (error monitoring)
- Instalado `@sentry/nextjs ^8.0.0` (v9 descartada por conflito com Next.js 16.2.7 peer deps)
- Criados `sentry.client.config.ts` e `sentry.server.config.ts`
- `instrumentation.ts` configurado para hook server-side do App Router
- `next.config.ts` atualizado com `withSentryConfig` + `experimental.instrumentationHook`
- **Custo:** 0 (free tier: 5K erros/mês)

### 4. Onboarding UI (`/onboarding`)
- Criado `apps/frontend/app/onboarding/page.tsx` — componente `"use client"`
- 4 etapas com AnimatePresence do framer-motion para transições suaves
- Perguntas baseadas em `Product_Vision_Notes.md`:
  1. Objetivo (emagrecer, massa, manter, energia, saúde preventiva)
  2. Academia/treino (sim, às vezes, não)
  3. Cozinha em casa (sempre, às vezes, raramente)
  4. Preferência alimentar (casa, fora, misto)
- Barra de progresso animada com `motion.div`
- Tela de conclusão com animação de scale
- Evento `onboarding_completed` disparado no PostHog com todas as respostas
- Disclaimer legal obrigatório (LGPD: não substitui orientação profissional)

---

## ⚠️ Pendência: npm install

Os pacotes `posthog-js` e `@sentry/nextjs` foram adicionados ao `package.json` mas o `npm install` precisa ser rodado manualmente no Windows (o processo ficou bloqueado por file locks no `node_modules`).

**Para completar a instalação:**
```bash
# Feche o VS Code e qualquer terminal com node rodando
# Depois execute:
cd C:\Users\jefer\Documents\Projetos\melhorsabor\apps\frontend
npm install
```

---

## 🧠 Decisões técnicas

| Decisão | Alternativa | Motivo da escolha |
|---------|-------------|-------------------|
| Sentry v8 | v9 | Conflito de peer deps com Next.js 16.2.7 |
| Tipos via MCP | supabase CLI | Sem autenticação adicional, resultado idêntico |
| `useRef` para dedup PostHog | sem controle | Evita disparar evento 2x em re-renders |
| framer-motion AnimatePresence | CSS transitions | Já instalado, mais robusto para multi-step |
| Onboarding client-only | server component | Precisa de estado local + animações |

---

## 🐛 Problemas encontrados

1. **`npm install` bloqueado no Windows:** `ENOTEMPTY` no `node_modules/core-js` por lock de processo. Solução: criar arquivos sem instalar, diferir install para o usuário.

2. **`@sentry/nextjs@^9` conflito:** ERESOLVE com Next.js 16.2.7. Downgrade para v8 resolveu.

3. **`package.json` truncado pelo Edit tool:** Em uma tentativa anterior, o Edit tool cortou o arquivo na metade. Solução: reescrever via `cat` heredoc no bash.

4. **Bash sandbox com cache stale:** O sandbox Linux leu versões desatualizadas dos arquivos via mount. Os arquivos no disco Windows estão corretos (verificado via Read tool). O `tsc --noEmit` no bash não é confiável neste ambiente — usar `npm run build` diretamente no Windows.

---

## 📋 Próximas missões (sugestão para Missão 5)

- [ ] Rodar `npm install` e validar build sem erros (`npx next build`)
- [ ] Configurar variáveis de ambiente no Vercel (`NEXT_PUBLIC_POSTHOG_KEY`, `NEXT_PUBLIC_SENTRY_DSN`)
- [ ] Conectar onboarding ao Supabase: salvar respostas na tabela `user_profiles`
- [ ] Adicionar link "Monte seu perfil" na landing page apontando para `/onboarding`
- [ ] Implementar autenticação (Supabase Auth) para persistir perfil do usuário
- [ ] Criar Etapa 2 do onboarding (restrições alimentares, biotipo)

---

**Mantra:** "Simples > Complexo. Rápido > Perfeito. Documentado > Secreto."
