-- ============================================================
-- Missão 7.1 — Proteção das colunas de assinatura + advisors
--
-- ⚠️ STATUS: PENDENTE DE APROVAÇÃO — NÃO APLICADA NO BANCO.
-- Aplicar somente após confirmação explícita (regra CLAUDE.md:
-- nunca alterar RLS/segurança do Supabase sem aprovação).
--
-- Motivo: a política user_profiles_update_own permite que o
-- próprio usuário atualize QUALQUER coluna da sua linha — incluindo
-- subscription_status. Hoje, qualquer usuário autenticado consegue
-- se marcar como assinante ativo pelo console do browser, sem pagar.
-- O frontend já foi corrigido para nunca gravar essas colunas, mas a
-- única proteção real é no banco.
-- ============================================================

-- ─────────────────────────────────────────────────────────────
-- 1. Trigger: bloqueia alteração das colunas de pagamento por
--    usuários comuns. Requisições com a service key (webhook/API
--    routes) continuam liberadas — a distinção é feita pelo claim
--    de role do JWT da requisição.
-- ─────────────────────────────────────────────────────────────
CREATE OR REPLACE FUNCTION public.protect_subscription_columns()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  -- service_role (API routes/webhook com a service key) pode tudo
  IF current_setting('request.jwt.claims', true)::jsonb->>'role' = 'service_role'
     OR current_user = 'postgres' THEN
    RETURN NEW;
  END IF;

  -- Usuário comum: colunas de pagamento são imutáveis
  IF NEW.subscription_status IS DISTINCT FROM OLD.subscription_status
     OR NEW.selected_plan     IS DISTINCT FROM OLD.selected_plan
     OR NEW.mp_preference_id  IS DISTINCT FROM OLD.mp_preference_id
     OR NEW.mp_payment_id     IS DISTINCT FROM OLD.mp_payment_id
     OR NEW.subscribed_at     IS DISTINCT FROM OLD.subscribed_at THEN
    RAISE EXCEPTION 'Colunas de assinatura só podem ser alteradas pelo servidor.';
  END IF;

  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS trg_protect_subscription ON public.user_profiles;
CREATE TRIGGER trg_protect_subscription
  BEFORE UPDATE ON public.user_profiles
  FOR EACH ROW
  EXECUTE FUNCTION public.protect_subscription_columns();

-- ─────────────────────────────────────────────────────────────
-- 2. Advisors do Supabase (security lints)
-- ─────────────────────────────────────────────────────────────

-- 2a. set_updated_at sem search_path fixo (function_search_path_mutable)
ALTER FUNCTION public.set_updated_at() SET search_path = public;

-- 2b. rls_auto_enable é SECURITY DEFINER executável por anon/authenticated
--     (anon_security_definer_function_executable). Função utilitária de
--     setup — não deve ser exposta via PostgREST.
REVOKE EXECUTE ON FUNCTION public.rls_auto_enable() FROM anon, authenticated;
