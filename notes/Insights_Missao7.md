# 📝 Insights — Missão 7: Gateway de Pagamento + Gamificação Íntima

**Data:** 2026-06-09
**Status:** Concluída ✅
**Commits:** a serem tagados após push

---

## 🎯 O que foi executado

### M7-A — Migrations Supabase
- Adicionadas 5 colunas em `user_profiles`: `selected_plan`, `subscription_status` (default `'free'`), `mp_preference_id`, `mp_payment_id`, `subscribed_at`
- Criada tabela `user_checkins` (id, user_id, date, items text[], created_at) com RLS full CRUD próprio
- Criada tabela `user_badges` (id, user_id, badge_id, unlocked_at) com RLS select + insert próprio
- Índices criados em `mp_payment_id` e `user_id, date DESC`

### M7-B — Integração Mercado Pago
**Decisão arquitetural:** Sem SDK externo — uso de `fetch` nativo para a API REST do MP. Isso elimina uma dependência e reduz o bundle. O SDK `mercadopago` é apenas um wrapper de fetch.

- `app/api/checkout/route.ts` — POST: cria preferência de pagamento no MP, salva `mp_preference_id` no perfil, retorna `init_point`
- `app/api/webhooks/mercadopago/route.ts` — POST: recebe notificação IPN, busca detalhes do pagamento, atualiza `subscription_status` → `active` (approved) ou `free` (rejected)
- Modo sandbox: se `MERCADOPAGO_ACCESS_TOKEN` não configurado, retorna URL de mock local (sem quebrar o fluxo)
- Variável `MERCADOPAGO_ACCESS_TOKEN` adicionada ao `.env.example` com documentação de como obter

### M7-C — Páginas /planos e /perfil
**`/planos`:**
- Nova rota dedicada (client component)
- Separação limpa: auth → planos → pagamento (ao invés de embutir no onboarding)
- Handles completos para todos os retornos do MP: `approved`, `rejected`, `pending`, `sandbox`
- Se usuário já tem `subscription_status === 'active'` → redirect para `/perfil`
- Callback atualizado: após salvar perfil, redireciona para `/planos` (antes era `/`)

**`/perfil`:**
- Auth-protected (client-side via RLS + anon key)
- **Calendário mensal:** grid 7×N, células com gradiente mel/damasco nos dias com check-in, navegação entre meses, dias vazios sem punição visual
- **Modal de check-in:** 6 opções selecionáveis, fecha ao clicar fora, feedback visual imediato
- **Fase da jornada:** Semente → Broto → Raiz → Colheita, barra de progresso visual
- **Grid de badges:** 9 badges definidos, bloqueados aparecem como ??? com Lock icon, desbloqueados com emoji + data
- **Avaliação de badges client-side:** semana_inteira (7+), mes_colorido (20+), cozinhou_pra_casa (5+ itens família) — MVP simples, pode migrar para Edge Function no futuro

---

## 💡 Decisões técnicas

| Decisão | Justificativa |
|---------|--------------|
| Sem SDK `mercadopago` | Evita dependência; a API REST é simples e estável |
| `/planos` como rota separada | Mantém o onboarding limpo; planos acessíveis diretamente |
| Avaliação de badges client-side | Adequado para MVP; migrar para Edge Function quando necessário |
| `subscription_status: 'free'` default | Permite diferenciar free vs active vs pending sem enum complexo |
| Webhook sempre retorna 200 | Evita que o MP reenvie notificações em caso de erro de processamento |

---

## 🔐 Segurança

- `MERCADOPAGO_ACCESS_TOKEN` é server-only (sem `NEXT_PUBLIC_` prefix)
- Webhook valida `external_reference` antes de atualizar qualquer perfil
- RLS garante que cada usuário só lê/escreve seus próprios check-ins e badges
- Sem SDK de terceiro instalado no bundle do cliente

---

## 🚀 Para ir a produção

1. **Criar conta no Mercado Pago** → https://www.mercadopago.com.br/developers/panel
2. **Configurar no Vercel:** `MERCADOPAGO_ACCESS_TOKEN=APP_USR-xxxxx`
3. **Configurar webhook no MP Dashboard:** URL = `https://melhorsabor.com.br/api/webhooks/mercadopago`, Topic = `payment`
4. **Testar em sandbox:** usar credenciais `TEST-xxxxx` e cartões de teste do MP
5. **Redirect URLs no MP:** confirmar que `back_urls` apontam para `melhorsabor.com.br/planos`

---

## 📋 Pendências para próximas missões

- [ ] **M8 — Receitas básicas:** seed de 10 receitas no Supabase + página `/receitas`
- [ ] **M8 — Edge Function para badges:** mover lógica do client para Supabase Edge Function `evaluate-badges`
- [ ] **M8 — Email pós-pagamento:** enviar bônus personalizado via Resend/Sendgrid após webhook `approved`
- [ ] **M9 — IA para sugestão de receitas:** integração com Claude API via Edge Function
- [ ] **M9 — SEO programático:** páginas de receitas geradas estaticamente

---

*Missão 7 fechada. Repositório limpo. Deploy na Vercel via push automático.*
