### CONTEXT_SYNC.md: Missão 4 — Telemetria, Supabase Types e UI de Onboarding

#### 1. Status Atual
- Missão 3 concluída: Landing animada, Waitlist integrada, LGPD pronta.
- Projeto Supabase criado e conectado com sucesso (migration executada).
- Nova Visão de Produto documentada em `Product_Vision_Notes.md` (Foco em performance humana e onboarding gamificado).

#### 2. Objetivo da Tarefa
- Substituir as tipagens manuais do Supabase por tipos gerados automaticamente via CLI.
- Instalar e configurar a stack de APM (PostHog para eventos + Sentry para erros).
- Construir o scaffold (UI inicial) do "Onboarding de Qualificação" ditado na visão do produto.

#### 3. Próximos Passos (Action para Claude Code)
1. **Supabase Gen Types:** Utilize a CLI do Supabase (via `npx`) para gerar o arquivo `types/database.types.ts` atualizado diretamente do projeto remoto. Substitua os tipos manuais atuais pela tipagem oficial.
2. **Setup PostHog & Sentry:** Instale os SDKs oficiais. Configure o Sentry para captura de erros no Next.js (App Router) e o PostHog via provider global. Adicione variáveis mockadas no `.env.example`.
3. **Tracking de Conversão:** Injete um evento do PostHog (ex: `waitlist_joined`) dentro da Server Action ou da UI de sucesso do componente de Waitlist.
4. **Onboarding UI (Fase 2):** Leia o `Product_Vision_Notes.md`. Crie a rota `/onboarding` contendo a "Etapa 1 - Landing de Qualificação" (perguntas sobre objetivo, acesso à academia e hábito de cozinhar). Use `framer-motion` para transições suaves entre as perguntas.
5. **Encerramento:** Ao finalizar o fluxo e garantir build limpo, crie o arquivo `notes/Insights_Missao4.md`.