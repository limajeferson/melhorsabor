### CONTEXT_SYNC.md: Missão 6 — Sincronização de Contexto, Auth e Onboarding Etapa 2

#### 1. Status Atual
- Missão 5 e manutenções concluídas: Build 100% verde (SWC corrigido) e `omnistack-agent` instalado como Skill sob demanda [1].
- O PostHog está no código de forma elegante, mas operando em fallback seguro (no-op) [2]. Estamos aguardando os servidores deles normalizarem para criar a conta e gerar as chaves [3].
- Documentação central da governança atualizada.

#### 2. Objetivo da Tarefa
- Sincronizar a memória do agente com as últimas atualizações de arquitetura e governança.
- Implementar a autenticação de usuários via Supabase Auth.
- Conectar o fluxo de Onboarding atual ao banco de dados (tabela `user_profiles`).
- Evoluir o Onboarding com a "Etapa 2" (Biotipo, Idade, Restrições) [4].

#### 3. Próximos Passos (Action para Claude Code)
1. **Sincronização Obrigatória:** Leia os seguintes arquivos antes de escrever qualquer código: `INDEX.md`, `docs/ECOSYSTEM_GUIDE.md`, `docs/POSTHOG_GUIDE.md` e `notes/Insights_Missao5.md`. Isso alinhará sua memória com a nossa taxonomia e a regra de uso da skill `omnistack-agent` [5].
2. **Autenticação (Supabase Auth):** Implemente um fluxo simples (OTP/Magic Link ou Email/Senha) para que o usuário seja autenticado ao iniciar ou finalizar o onboarding.
3. **Persistência de Dados:** Atualize o schema/migration para a tabela `user_profiles`. O componente final da Etapa 1 do `/onboarding` deve fazer um INSERT das respostas (objetivo, acesso à academia, hábito de cozinhar) [6].
4. **Onboarding (Etapa 2):** Baseado no `Product_Vision_Notes.md`, expanda o fluxo utilizando framer-motion para coletar: Idade, Peso, Altura, Biotipo (ectomorfo, mesomorfo, endomorfo), Nível de atividade e Restrições alimentares [4].
5. **Ponte de Entrada:** Na Landing Page, adicione um CTA claro direcionando para `/onboarding`.
6. **Encerramento:** Gere as tipagens do Supabase, confirme o build e crie `notes/Insights_Missao6.md`.