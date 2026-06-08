import posthog from "posthog-js";

/**
 * Taxonomia central de eventos do MelhorSabor.
 *
 * Manter os nomes de eventos aqui — e não como strings soltas pelo código —
 * é o que permite funis confiáveis, segmentação e campanhas no PostHog.
 * Cada string nova e inconsistente quebra um funil silenciosamente.
 */
export const AnalyticsEvent = {
  WaitlistJoined: "waitlist_joined",
  OnboardingStarted: "onboarding_started",
  OnboardingStepAnswered: "onboarding_step_answered",
  OnboardingCompleted: "onboarding_completed",
} as const;

export type AnalyticsEvent =
  (typeof AnalyticsEvent)[keyof typeof AnalyticsEvent];

/** Dispara um evento. No-op se o PostHog não estiver inicializado (sem key). */
export function track(
  event: AnalyticsEvent,
  properties?: Record<string, unknown>,
): void {
  if (!posthog.__loaded) return;
  posthog.capture(event, properties);
}

/**
 * Associa os eventos a uma pessoa (CRM / segmentação).
 * Chamar quando o usuário se identifica — ex.: e-mail da waitlist, login.
 */
export function identify(
  distinctId: string,
  traits?: Record<string, unknown>,
): void {
  if (!posthog.__loaded) return;
  posthog.identify(distinctId, traits);
}
