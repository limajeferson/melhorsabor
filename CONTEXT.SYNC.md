### CONTEXT_SYNC.md: Missão 7 — Gateway de Pagamento e Gamificação (Fase 1)

#### 1. Status Atual
- Missão 6.1 concluída com sucesso: Onboarding dinâmico, PostHog (EU) implementado e Tela de Oferta (Inversão de Oferta) com UI de planos no ar.
- Tabela `user_profiles` operando com respostas salvas em `raw_answers` via JSONB.
- Documentação atualizada (INDEX v1.7, GAMIFICATION_VISION.md criada).

#### 2. Objetivo da Tarefa
- **Eixo 1:** Integrar um Gateway de Pagamento real (substituindo o alert atual) para viabilizar a assinatura dos planos oferecidos.
- **Eixo 2:** Construir a infraestrutura e a UI inicial do nosso motor de retenção: a "Gamificação Íntima".

#### 3. Próximos Passos (Action para Claude Code)
1. **Gateway de Pagamento:** Avalie e implemente a integração de pagamento (Stripe ou Mercado Pago) na nossa Pricing Table. O objetivo é que o botão "Assinar" inicie uma sessão de checkout real para os planos (Mensal, Trimestral, Semestral, Anual).
2. **Modelo de Dados (Gamificação):** Crie e aplique as migrations no Supabase para suportar a Gamificação: tabelas `user_checkins`, `user_badges` e `user_journey_phase` (conforme descrito em docs/GAMIFICATION_VISION.md).
3. **Página de Perfil e Calendário:** Crie a rota protegida `/perfil`. Nela, implemente a UI do calendário mensal de check-ins diários (usando a paleta de gradiente mel/damasco). Lembre-se: não há "streak" punitivo, apenas a marcação dos dias de sucesso.
4. **Badges Iniciais:** Implemente a lógica dos primeiros badges privados (ex: "Primeira Refeição", "Semana Inteira"). Eles devem aparecer na página de perfil do usuário.
5. **Ajuste de Fluxo:** Atualize o callback de auth para redirecionar o usuário para a página `/planos` (oferta) em vez da home `/` após o cadastro no onboarding.
6. **Encerramento:** Confirme o build, tipe o banco de dados (se alterado via migration) e gere o `notes/Insights_Missao7.md`.

--------------------------------------------------------------------------------
