-- Migration: segmentação do onboarding (público você/casa/família)
-- Data: 2026-06-08
-- Missão: 6 (Funil de Quiz segmentado)
--
-- Aditiva: apenas adiciona colunas em user_profiles. NÃO altera RLS nem
-- políticas existentes — as novas colunas herdam o RLS já configurado na tabela.

alter table public.user_profiles
  -- Segmentação de público (define a trilha do onboarding)
  add column if not exists publico         text,   -- para_si | para_casa | ambos

  -- Trilha pessoal (substitui o antigo "atividade" por pratica + nivel)
  add column if not exists pratica         text,   -- sim | as_vezes | nao
  add column if not exists nivel           text,   -- leve | moderado | intenso
  add column if not exists animo           text,   -- bem | oscila | cansado | desmotivado

  -- Trilha da casa/família
  add column if not exists objetivo_casa   text,
  add column if not exists tamanho_casa    text,
  add column if not exists criancas        text,
  add column if not exists tempo_preparo   text,
  add column if not exists rotina_casa     text,
  add column if not exists restricoes_casa text[],
  add column if not exists desafio_casa    text,

  -- Snapshot completo das respostas (à prova de evolução do questionário)
  add column if not exists raw_answers     jsonb;

comment on column public.user_profiles.publico is
  'Público escolhido no onboarding: para_si | para_casa | ambos. Base da segmentação de oferta.';
comment on column public.user_profiles.raw_answers is
  'Snapshot bruto de todas as respostas do onboarding (jsonb), preserva campos novos sem migração.';
