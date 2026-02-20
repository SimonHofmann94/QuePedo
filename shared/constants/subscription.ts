/** RevenueCat entitlement identifier — must match the dashboard config */
export const RC_ENTITLEMENT_ID = 'Qué-Pedo Premium'

export const FREE_TIER_LIMITS = {
  maxVocabulary: 50,
  maxTacos: 3,
  maxDailyQuizzes: 3,
  allowedExercises: ['vocabulary_quiz'],
} as const

export const PREMIUM_FEATURES = [
  'grammar',
  'culture',
  'writing_exercise',
  'speaking_exercise',
  'listening_exercise',
  'games',
  'ai_generation',
  'unlimited_vocabulary',
  'unlimited_quizzes',
] as const

export type FeatureId = (typeof PREMIUM_FEATURES)[number]
