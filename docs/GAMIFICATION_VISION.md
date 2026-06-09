# Visão de Gamificação — MelhorSabor

> Princípio: a gamificação deve ser **invisível por fora, significativa por dentro**.
> Sem pontos explícitos, sem ranking público, sem pressão — só a pessoa e o próprio progresso.

---

## Filosofia central

A maioria dos apps de saúde falha porque transforma saúde em competição.
O MelhorSabor faz o oposto: o progresso é **íntimo e acumulado**, não comparativo.

A pessoa não "ganha pontos" — ela **deixa rastros da própria jornada**.

---

## 1. Agenda Cumprida (Check-ins diários)

A pessoa marca o que fez no dia — sem obrigação, sem streak que "quebra".

- Café da manhã seguido ✓
- Almoço em casa ✓
- Evitei o fast food hoje ✓
- Bebi água suficiente ✓

**Como aparece na UI:**
Calendário mensal com células coloridas (gradiente mel/damasco) nos dias com check-in.
Dias vazios não são "falhas" — são silêncio. A visão do mês cheio vira motivação natural.
Não há contador de "dias seguidos perdidos" — só o padrão visual do que foi feito.

---

## 2. Badges Privados (Conquistas ocultas)

Cada badge é desbloqueado silenciosamente — a pessoa descobre ao abrir seu perfil privado.
**Nenhum badge é visível para outros membros.** É só dela.

### Exemplos de badges (nomes evocativos, não técnicos):

| Badge | Condição | Tom |
|-------|----------|-----|
| **Primeira Refeição** | Primeira receita salva/preparada | Acolhimento |
| **Semana Inteira** | Check-in em 7 dias do mesmo mês | Consistência |
| **Explorador** | Testou receitas de 3 categorias diferentes | Curiosidade |
| **Silêncio Produtivo** | Ficou 3 dias sem fast food | Autoconhecimento |
| **Cozinhou pra Casa** | Marcou "cozinhei pra família" 5 vezes | Cuidado |
| **Mês Colorido** | 20+ check-ins em um mês | Presença |
| **Constância Tranquila** | 3 meses com pelo menos 10 check-ins cada | Maturidade |
| **Voz da Comunidade** | Comentou em 10 posts de outras pessoas | Generosidade |
| **Primeira Conquista** | Atingiu um objetivo declarado no onboarding | Realização |

Badges são revelados com uma animação suave — sem fanfarra, sem notificação push.
A pessoa encontra quando abre o próprio painel de conquistas.

---

## 3. Fases da Jornada (Progressão invisível)

A pessoa avança por fases sem saber que existem "fases".
Ela só percebe que o app está respondendo diferente — receitas mais desafiadoras, mensagens mais maduras, visual do perfil mais rico.

| Fase | Nome interno | Gatilho | O que muda |
|------|-------------|---------|------------|
| 1 | Semente | Onboarding completo | Receitas básicas, mensagens de boas-vindas |
| 2 | Broto | 2 semanas de check-ins | Receitas intermediárias, acesso a séries temáticas |
| 3 | Raiz | 1 mês consistente | Conteúdo avançado, acesso a desafios mensais |
| 4 | Colheita | Objetivo do onboarding atingido | Badge especial, destaque opcional na comunidade |

---

## 4. Motivação entre membros (sem competição)

Na comunidade, a gamificação é **horizontal** — pessoas motivando umas às outras, não competindo.

- Comentários com emojis de incentivo geram "energia" visual no post (não é contagem pública)
- Quando alguém posta uma conquista, membros com objetivo similar recebem uma notificação gentil: *"Alguém com o mesmo objetivo que você acabou de compartilhar algo."*
- Não há ranking, top X, ou destaque por volume de posts

---

## 5. Calendário como espelho

O calendário mensal é o principal objeto de gamificação.
No fim de cada mês, a pessoa vê um "retrato do mês" — um mosaico visual dos dias marcados.
Isso não é punição pelos dias vazios — é celebração dos dias vividos.

Pode virar uma imagem para compartilhar (opcional, sem dados sensíveis).

---

## Implementação futura (não agora)

- [ ] Modelo de dados: `user_checkins`, `user_badges`, `user_journey_phase`
- [ ] Lógica de badges: função serverless que avalia condições ao salvar check-in
- [ ] UI: painel privado "Minha Jornada" — calendário + badges + fase atual
- [ ] Notificações: trigger gentil de conquista (sem push agressivo)

---

## Princípio de design

> "O app não recompensa você por usar o app. Ele registra que você está cuidando de você."

---

*Criado em: 2026-06-09 | Status: Visão de produto — pré-implementação*
