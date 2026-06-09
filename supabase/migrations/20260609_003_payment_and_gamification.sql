-- ============================================================
-- Missão 7 — Gateway de Pagamento + Gamificação
-- Aplicado via Supabase MCP em 2026-06-09
-- ============================================================

-- ─────────────────────────────────────────────────────────────
-- 1. Colunas de pagamento/assinatura em user_profiles
-- ─────────────────────────────────────────────────────────────
ALTER TABLE public.user_profiles
  ADD COLUMN IF NOT EXISTS selected_plan        text,
  ADD COLUMN IF NOT EXISTS subscription_status  text NOT NULL DEFAULT 'free',
  ADD COLUMN IF NOT EXISTS mp_preference_id     text,
  ADD COLUMN IF NOT EXISTS mp_payment_id        text,
  ADD COLUMN IF NOT EXISTS subscribed_at        timestamptz;

CREATE INDEX IF NOT EXISTS idx_user_profiles_mp_payment_id
  ON public.user_profiles (mp_payment_id)
  WHERE mp_payment_id IS NOT NULL;

-- ─────────────────────────────────────────────────────────────
-- 2. user_checkins — registros diários do usuário
-- ─────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS public.user_checkins (
  id         uuid        PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id    uuid        NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  date       date        NOT NULL,
  items      text[]      NOT NULL DEFAULT '{}',
  created_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE (user_id, date)
);

ALTER TABLE public.user_checkins ENABLE ROW LEVEL SECURITY;

CREATE POLICY "checkins_select_own"
  ON public.user_checkins FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "checkins_insert_own"
  ON public.user_checkins FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "checkins_update_own"
  ON public.user_checkins FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "checkins_delete_own"
  ON public.user_checkins FOR DELETE
  USING (auth.uid() = user_id);

CREATE INDEX IF NOT EXISTS idx_user_checkins_user_date
  ON public.user_checkins (user_id, date DESC);

-- ─────────────────────────────────────────────────────────────
-- 3. user_badges — conquistas desbloqueadas
-- ─────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS public.user_badges (
  id          uuid        PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id     uuid        NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  badge_id    text        NOT NULL,
  unlocked_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE (user_id, badge_id)
);

ALTER TABLE public.user_badges ENABLE ROW LEVEL SECURITY;

CREATE POLICY "badges_select_own"
  ON public.user_badges FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "badges_insert_service"
  ON public.user_badges FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE INDEX IF NOT EXISTS idx_user_badges_user_id
  ON public.user_badges (user_id);
