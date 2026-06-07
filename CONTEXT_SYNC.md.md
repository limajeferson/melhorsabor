### CONTEXT_SYNC.md: Missão 2 — Next.js Bootstrap

#### 1. Status Atual
- Missão 1 (Fundação) concluída. 
- Bloqueio do `gh CLI` resolvido: Repositório GitHub remoto já foi criado e linkado pelo usuário.
- Escopo atual listado nos insights da Missão 1.

#### 2. Objetivo da Tarefa
- Realizar o bootstrap estrutural do frontend com Next.js, Tailwind e shadcn/ui.
- Conectar a base do projeto para o primeiro deploy na Vercel.

#### 3. Próximos Passos (Action para Claude Code)
1. Inicialize um projeto Next.js 14 (App Router, TypeScript, Tailwind) na pasta `apps/frontend/`.
2. Configure a base do `shadcn/ui` para iniciar o design system.
3. Configure os metadados do layout base (`app/layout.tsx`), além do `next.config.js` e `tsconfig.json`.
4. Crie uma página inicial provisória (`app/page.tsx`) anunciando a Plataforma MelhorSabor com o conceito: "O alimento é o código-fonte".
5. Faça o commit de fundação e o push para a branch `main`.
6. Tente inicializar a conexão com a Vercel via CLI. Se pedir autenticação interativa ou falhar no ambiente sandbox, apenas pule esta etapa para o usuário fazer manualmente, mas deixe o código pronto.
7. Encerre gerando o arquivo `notes/Insights_Missao2.md`.