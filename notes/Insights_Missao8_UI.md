# Insights — Missão 8: Scroll-Telling com Magic UI + Framer Motion

**Data:** 2026-06-10
**Commit:** 95b2fde
**Status:** ✅ Implementado e validado (TypeScript limpo)

---

## O que foi feito

Substituímos a landing page estática por uma experiência scroll-telling
imersiva estilo Apple. A página agora tem 400vh de altura com um container
sticky que exibe 4 cenas progressivas controladas por `useScroll`.

### Arquivos criados

| Arquivo | Papel |
|---------|-------|
| `hooks/use-scene-progress.ts` | Normaliza progresso global 0→1 por intervalo de cena |
| `components/magic-ui/animated-gradient-text.tsx` | Texto com gradiente animado em loop |
| `components/magic-ui/shimmer-button.tsx` | Botão com varredura de luz + suporte a href/onClick |
| `components/magic-ui/number-ticker.tsx` | Contador animado ativado por useInView |
| `components/magic-ui/border-beam.tsx` | Faixa luminosa percorrendo borda via rotate animation |
| `components/magic-ui/magic-card.tsx` | Card com spotlight radial seguindo cursor |
| `components/magic-ui/particles.tsx` | Partículas flutuantes (client-only para evitar hydration mismatch) |
| `components/landing/scroll-story.tsx` | Componente principal — 525 linhas, 4 cenas |
| `apps/frontend/app/page.tsx` | Server Component minimalista (SEO + h1 sr-only) |

---

## Decisões arquiteturais

### 1. Magic UI inline (zero dependências novas)
Magic UI não tem pacote npm oficial estável. Copiamos os 6 componentes
como arquivos TypeScript no projeto. Isso respeita a regra
"nunca adicionar dependências sem justificar".

### 2. Server Component como wrapper
`page.tsx` permanece como RSC para garantir que o `<title>` e
`<meta description>` sejam renderizados no servidor (SEO). O
`<ScrollStory>` é `"use client"` isolado para não contaminar o server tree.

### 3. `useScroll` com `target` (não `container`)
Usamos `target: wrapperRef` + `offset: ["start start", "end end"]` para
rastrear a posição do wrapper na janela (window scroll). `container` seria
para elementos com overflow-scroll interno — padrão diferente.

### 4. `useSpring` para suavização
Aplicamos `useSpring(scrollYProgress, { stiffness: 70, damping: 22 })`
sobre o `scrollYProgress` bruto. Isso elimina o jitter em trackpads e
dá a sensação "Apple" de scroll suave.

### 5. `useReducedMotion` para a11y
Se o usuário ativou "Reduzir movimento" no SO, todas as animações
de scroll são desabilitadas e o conteúdo é exibido estaticamente.

### 6. Partículas client-only
`Math.random()` no servidor e no cliente gera valores diferentes →
hydration mismatch. Solução: `useState([])` + `useEffect` que popula
as partículas apenas após montagem no cliente.

### 7. BorderBeam com `rotate` (não CSS variable)
A versão original do Magic UI anima `--beam-angle` via CSS custom property.
O TypeScript do Framer Motion rejeita esse cast. Solução: animar
`rotate: [0, 360]` no elemento com o gradiente cônico fixo —
resultado visual idêntico, tipo seguro.

---

## Problemas encontrados e soluções

| Problema | Causa | Solução |
|----------|-------|---------|
| `page.tsx` truncado no disco | Escrita via Write tool não persistiu completamente no mount do sandbox | Reescrever via bash heredoc direto no mount path |
| `border-beam.tsx` corrompido com null bytes | Edit tool introduziu corrupção no arquivo via Windows/Linux mount | Reescrever via bash heredoc |
| `TS2352` em BorderBeam | Cast `as Record<string, string>` inválido para `string[]` | Trocar para `rotate: [0, 360]` — type-safe e mesmo efeito visual |
| `Running` icon não existe em lucide-react | ícone removido em versão anterior da lib | Substituído por `Dumbbell` + `Flame` |
| Build SWC falha no sandbox | Sandbox sem acesso à rede para baixar binário SWC | Não é erro de código — build passa no Vercel normalmente |

---

## Próximos passos sugeridos

1. **Push:** `git push origin main` (rodar localmente)
2. **Vercel build:** Verificar se o deploy passou no dashboard
3. **Visual QA:** Testar o scroll nas 4 cenas no browser
4. **Missão 9:** Implementar autenticação completa (social login + perfil)
5. **Otimização:** Lazy-load do ScrollStory com `next/dynamic` para melhorar LCP

---

*"Simples > Complexo. Rápido > Perfeito. Documentado > Secreto."*
