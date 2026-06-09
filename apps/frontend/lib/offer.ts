/**
 * Oferta final do onboarding — "Inversão de Oferta".
 *
 * O usuário não compra um infoproduto solto: ele desbloqueia o ACESSO à
 * comunidade/plataforma, e o guia hiper-segmentado entra como BÔNUS gratuito.
 * A tabela de preços usa ancoragem (plano anual em destaque) para puxar o LTV.
 */

export interface Plan {
  id: "mensal" | "trimestral" | "semestral" | "anual";
  name: string;
  price: number; // total cobrado no período (R$)
  months: number;
  highlight?: boolean;
  badge?: string;
}

/** Plano mensal é a âncora a partir da qual o desconto dos demais é calculado. */
export const PLANS: Plan[] = [
  { id: "mensal", name: "Mensal", price: 47, months: 1 },
  { id: "trimestral", name: "Trimestral", price: 139, months: 3 },
  { id: "semestral", name: "Semestral", price: 276, months: 6 },
  {
    id: "anual",
    name: "Anual",
    price: 477,
    months: 12,
    highlight: true,
    badge: "Mais assinado",
  },
];

const MONTHLY_ANCHOR = PLANS[0].price;

/** Equivalente mensal do plano, em reais. */
export function monthlyEquivalent(plan: Plan): number {
  return plan.price / plan.months;
}

/** Desconto percentual (inteiro) frente ao equivalente mensal do plano âncora. */
export function discountPercent(plan: Plan): number {
  if (plan.months === 1) return 0;
  const pct = 1 - monthlyEquivalent(plan) / MONTHLY_ANCHOR;
  return Math.round(pct * 100);
}

/** Formata reais em pt-BR (R$ 47 / R$ 46,33). */
export function brl(value: number): string {
  return value.toLocaleString("pt-BR", {
    style: "currency",
    currency: "BRL",
    minimumFractionDigits: Number.isInteger(value) ? 0 : 2,
    maximumFractionDigits: 2,
  });
}

export interface Bonus {
  title: string;
  subtitle: string;
}

/**
 * Deriva o bônus hiper-segmentado a partir das respostas do onboarding.
 * É a "isca irresistível" personalizada — fala da dor específica do usuário.
 */
export function deriveBonus(
  answers: Record<string, string | string[]>,
): Bonus {
  const get = (k: string) => (typeof answers[k] === "string" ? (answers[k] as string) : "");
  const publico = get("publico");
  const objetivo = get("objetivo");
  const refeicao = get("refeicao");
  const cozinha = get("cozinha");

  // Trilha casa/família tem prioridade quando é o público escolhido
  if (publico === "para_casa") {
    return {
      title: "Cardápio da Família Descomplicado",
      subtitle: "Refeições que agradam todo mundo sem você cozinhar três pratos diferentes.",
    };
  }
  if (publico === "ambos") {
    return {
      title: "Plano Você + Família em Equilíbrio",
      subtitle: "Cuide dos seus objetivos enquanto transforma a rotina da casa toda.",
    };
  }

  if (objetivo === "emagrecer" && (refeicao === "fora" || refeicao === "fastfood")) {
    return {
      title: "Guia de Sobrevivência em Restaurantes",
      subtitle: "Como emagrecer comendo fora, sem passar vontade e sem culpa.",
    };
  }
  if (objetivo === "massa" && (cozinha === "sempre" || cozinha === "as_vezes")) {
    return {
      title: "Projeto Massa na Cozinha de Casa",
      subtitle: "Receitas práticas e calóricas certas para ganhar massa de verdade.",
    };
  }
  if (objetivo === "energia") {
    return {
      title: "Cardápio Antifadiga",
      subtitle: "O que comer para ter energia e foco do começo ao fim do dia.",
    };
  }
  if (objetivo === "saude") {
    return {
      title: "Mesa Preventiva",
      subtitle: "Comer hoje pensando nos seus exames e na sua longevidade.",
    };
  }

  return {
    title: "Seu Guia Personalizado MelhorSabor",
    subtitle: "Montado a partir das suas respostas, do seu jeito e da sua rotina.",
  };
}
