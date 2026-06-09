# Insights — Missão 6: Supabase Auth + Onboarding Etapa 2

> 🔗 Navegação: [[INDEX]] | [[CLAUDE_CODE_MASTER_PLAN]] | ← [[notes/Insights_Missao5]] | [[docs/POSTHOG_GUIDE]]

**Data:** 2026-06-08
**Commit:** `49e8065`
**Status:** ✅ Concluída

---

## 🎯 O que foi entregue

### 1. Onboarding Etapa 2 — 4 novos steps
`apps/frontend/app/onboarding/page.tsx` expandido de 4 → 8 steps.

| Step | ID | Tipo | Campo DB |
|------|---|------|----------|
| 5 | `idade_range` | single | `user_profiles.idade_range` |
| 6 | `biotipo` | single | `user_profiles.biotipo` |
| 7 | `atividade` | single | `user_profiles.atividade` |
| 8 | `restricoes` | **multi-select** | `user_profiles.restricoes` (text[]) |

**Multi-select** implementado nativamente: array no estado, lógica especial para opção "nenhuma" (exclusiva — desmarca as outras e vice-versa). Indicador visual "Pode selecionar mais de uma opção" só aparece nesse step.

**Cabeçalhos de seção** (`Etapa 1 — Seus objetivos` / `Etapa 2 — Seu perfil físico`) surgem com AnimatePresence quando o step é o primeiro de cada seção.

### 2. Fase Auth (Magic Link)
Após o último step, a máquina de estados passa para `phase: "auth"`:
- Input de email + botão "Salvar perfil"
- Chama `supabase.auth.signInWithOtp({ email, options: { emailRedirectTo: "/onboarding/callback" } })`
- Answers são salvas em `localStorage("onboarding_answers")` **antes** do OTP — garantia de que os dados não se perdem se o usuário fechar a aba
- `phase: "email-sent"` mostra confirmação sem redirecionar (Magic Link vem por e-mail)

### 3. Callback Page
`apps/frontend/app/onboarding/callback/page.tsx` — Client Component que:
1. Aguarda a sessão Supabase (SDK detecta hash `#access_token` automaticamente)
2. Retry com `setTimeout(1500)` se a sessão não estiver pronta ainda
3. Lê `localStorage("onboarding_answers")`
4. Faz `upsert` em `user_profiles` com `onConflict: "id"` — idempotente
5. Remove o localStorage após salvar
6. Redireciona para `/` em 2 segundos

Estados visuais: `loading` → `saving` → `success` | `error` (com link "Tentar novamente").

### 4. Landing Page CTA atualizado
Seção CTA final passou de um único botão para dois:
- **Primário (branco):** "Monte seu perfil gratuito" → `/onboarding`
- **Secundário (outline):** "Entrar na lista de espera" → `#waitlist`

Estratégia: usuários prontos para se identificar vão direto ao onboarding; os mais cautelosos ficam na waitlist.

### 5. Tipos Supabase regenerados
`types/database.types.ts` atualizado via MCP (`generate_typescript_types`) — `user_profiles` com todos os 11 campos tipados (Row/Insert/Update), `restricoes: string[] | null`.

---

## 🧠 Decisões técnicas

| Decisão | Motivo |
|---|---|
| localStorage antes do OTP | Usuário pode fechar a aba após enviar o e-mail; dados não se perdem na reconexão |
| `upsert` com `onConflict: "id"` | Idempotente: re-clicks no link mágico não duplicam dados |
| Retry de sessão (1500ms) | SDK do Supabase pode ter latência de ~100-500ms para processar o hash antes de `getSession()` retornar |
| Multi-select sem lib externa | Lógica simples de array; sem dependência extra |
| "nenhuma" exclusiva | Semanticamente incorreto ter "lactose + nenhuma" — limpa as outras ao selecionar "nenhuma" e vice-versa |
| Cabeçalho de seção animado | UX: usuário entende que entrou em um novo bloco temático sem ver um stepper numérico poluído |

---

## ⚠️ Pendências para ativar o fluxo completo

1. **Supabase Dashboard → Auth → URL Configuration:**
   - `Site URL`: `https://melhorsabor.com.br`
   - `Redirect URLs`: `https://melhorsabor.com.br/onboarding/callback`
   - Sem isso, o Magic Link redireciona para `localhost` em produção

2. **Vercel Environment Variables** (se ainda não configuradas):
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`

3. **PostHog** (pendente da Missão 5):
   - Criar conta em posthog.com
   - Adicionar `NEXT_PUBLIC_POSTHOG_KEY` e `NEXT_PUBLIC_POSTHOG_HOST` na Vercel

---

## 🔄 Fluxo completo do usuário

```
Landing Page
  → CTA "Monte seu perfil gratuito"
    → /onboarding (steps 1-8: objetivo → restrições)
      → Phase "auth" (email input)
        → signInWithOtp → e-mail enviado
          → Usuário clica no link
            → /onboarding/callback
              → Sessão estabelecida → upsert user_profiles → redirect /
```

---

## 📊 Arquivos alterados nesta missão

| Arquivo | Tipo | Descrição |
|---|---|---|
| `apps/frontend/app/onboarding/page.tsx` | MODIFIED | 8 steps + multi-select + fase auth |
| `apps/frontend/app/onboarding/callback/page.tsx` | NEW | Callback pós-Magic Link |
| `apps/frontend/app/page.tsx` | MODIFIED | CTA duplo → /onboarding |
| `apps/frontend/types/database.types.ts` | MODIFIED | user_profiles + waitlist_emails |

---

**Mantra:** "Simples > Complexo. Rápido > Perfeito. Documentado > Secreto."

---

*Versão: 1.0 | Data: 2026-06-08 | Commit: 49e8065*
