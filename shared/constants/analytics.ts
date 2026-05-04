/**
 * Shared analytics event taxonomy.
 *
 * Event names stay in English snake_case for consistency in PostHog
 * dashboards across web and mobile. UI-facing strings remain Mexican Spanish.
 */
export const AnalyticsEvent = {
  SIGNUP_STARTED: 'signup_started',
  ONBOARDING_COMPLETED: 'onboarding_completed',
  QUIZ_STARTED: 'quiz_started',
  QUIZ_COMPLETED: 'quiz_completed',
  QUIZ_ABANDONED: 'quiz_abandoned',
  PAYWALL_VIEWED: 'paywall_viewed',
  PAYWALL_PURCHASE_STARTED: 'paywall_purchase_started',
  PAYWALL_PURCHASE_COMPLETED: 'paywall_purchase_completed',
  PAYWALL_DISMISSED: 'paywall_dismissed',
  VOCAB_ADDED: 'vocab_added',
  GRAMMAR_CHAPTER_OPENED: 'grammar_chapter_opened',
  ACHIEVEMENT_UNLOCKED: 'achievement_unlocked',
} as const

export type AnalyticsEventName = (typeof AnalyticsEvent)[keyof typeof AnalyticsEvent]

/** Generic event property bag — keep flat, JSON-serializable values only. */
export type AnalyticsProps = Record<string, string | number | boolean | null>
