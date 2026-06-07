-- Migration: criar tabela waitlist_emails
-- Data: 2026-06-07
-- Missão: 3

create table if not exists public.waitlist_emails (
  id          uuid primary key default gen_random_uuid(),
  email       text not null unique,
  source      text,                          -- ex: 'landing_hero', 'cta_footer'
  created_at  timestamptz not null default now()
);

-- Índice para buscas rápidas por email
create unique index if not exists waitlist_emails_email_idx
  on public.waitlist_emails (lower(email));

-- RLS: tabela de escrita pública (anon pode inserir), leitura apenas service_role
alter table public.waitlist_emails enable row level security;

-- Qualquer visitante pode se inscrever
create policy "Anon pode inserir na waitlist"
  on public.waitlist_emails
  for insert
  to anon
  with check (true);

-- Apenas serviço autenticado pode ler
create policy "Service role pode ler waitlist"
  on public.waitlist_emails
  for select
  to service_role
  using (true);

-- Comentário na tabela para documentação
comment on table public.waitlist_emails is
  'Lista de espera do MelhorSabor. Emails coletados antes do lançamento.';
