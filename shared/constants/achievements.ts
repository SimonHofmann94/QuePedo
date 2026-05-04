// ¡Qué Pedo! — Achievement definitions
// Single source of truth for both web and mobile.
// Color values are color-family keys ("chili", "jade"…) from `design/tokens.ts`.

import type { ColorFamily } from '../design/tokens'

export type AchievementGroup =
  | 'streak'
  | 'vocab'
  | 'quiz'
  | 'grammar'
  | 'cultural'
  | 'special'

export type Achievement = {
  id: string
  emoji: string
  label: string
  description: string
  color: ColorFamily
  group: AchievementGroup
}

// Group → color family. Keep in sync with task spec:
//   streak→maiz, vocab→cielo, quiz→jade, grammar→chili,
//   cultural→jacaranda, special→rosa
const GROUP_COLOR: Record<AchievementGroup, ColorFamily> = {
  streak: 'maiz',
  vocab: 'cielo',
  quiz: 'jade',
  grammar: 'chili',
  cultural: 'jacaranda',
  special: 'rosa',
}

const def = (
  id: string,
  group: AchievementGroup,
  emoji: string,
  label: string,
  description: string,
): Achievement => ({
  id,
  emoji,
  label,
  description,
  color: GROUP_COLOR[group],
  group,
})

export const ACHIEVEMENTS: readonly Achievement[] = [
  // STREAK
  def('streak_first_day',  'streak', '🔥',  'Primer día',   'Día uno: empezaste, ¡chingón!'),
  def('streak_week',       'streak', '🔥',  'Una semana',   '7 días seguidos sin fallar.'),
  def('streak_two_weeks',  'streak', '🔥🔥','Dos semanas',  '14 días seguidos. Imparable.'),
  def('streak_month',      'streak', '🌵',  'Un mes',       '30 días de racha. Leyenda.'),

  // VOCABULARY
  def('vocab_first_word',  'vocab',  '📚',  'Primera palabra', 'Añadiste tu primera palabra.'),
  def('vocab_hundred',     'vocab',  '📚',  'Centena',         '100 palabras en tu vocabulario.'),
  def('vocab_five_hundred','vocab',  '📚',  'Quinientos',      '500 palabras. Vocabulario premium.'),
  def('vocab_ai_master',   'vocab',  '🤖',  'Maestro IA',      '50 palabras generadas con IA.'),

  // QUIZ
  def('quiz_first',        'quiz',   '🎯',  'Primer quiz',  'Completaste tu primer quiz.'),
  def('quiz_perfect',      'quiz',   '🎯',  'Perfecto',     '10 de 10 en un quiz.'),
  def('quiz_streak',       'quiz',   '🎯',  'Implacable',   '10 quizzes seguidos aprobados.'),

  // GRAMMAR
  def('grammar_first_chapter', 'grammar', '📖', 'Primera lección', 'Abriste tu primer capítulo.'),
  def('grammar_a1_complete',   'grammar', '🏆', 'A1 completo',     'Tests de A1 todos aprobados.'),
  def('grammar_a2_complete',   'grammar', '🏆', 'A2 completo',     'Tests de A2 todos aprobados.'),
  def('grammar_premium',       'grammar', '🌶', 'Premium unlocked','Desbloqueaste B1+ con Premium.'),

  // CULTURAL
  def('culture_explorer',    'cultural', '🗺', 'Explorador',  '5 lecciones de cultura abiertas.'),
  def('culture_pan_america', 'cultural', '🌍', 'Pan-América', '3 países diferentes explorados.'),

  // SPECIAL
  def('welcome', 'special', '🎉', 'Bienvenido',       'Completaste el onboarding.'),
  def('premium', 'special', '💎', 'Chingón Premium',  'Te volviste Premium.'),
] as const

if (process.env.NODE_ENV !== 'production' && ACHIEVEMENTS.length !== 19) {
  // Sanity check during dev — task spec says exactly 19.
  // eslint-disable-next-line no-console
  console.warn(`ACHIEVEMENTS length is ${ACHIEVEMENTS.length}, expected 19.`)
}

const ACHIEVEMENT_BY_ID: Record<string, Achievement> = ACHIEVEMENTS.reduce(
  (acc, a) => {
    acc[a.id] = a
    return acc
  },
  {} as Record<string, Achievement>,
)

export function getAchievementById(id: string): Achievement | undefined {
  return ACHIEVEMENT_BY_ID[id]
}

export type AchievementId = (typeof ACHIEVEMENTS)[number]['id']
