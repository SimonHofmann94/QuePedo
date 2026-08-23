import { z } from 'zod'
import { CEFR_LEVELS, type CEFR } from './types'

// ── The one item shape every grammar-decision game consumes ──────────────
// "Prompt with a blank, N options in a FIXED order, one is right." El/La
// items are derived at runtime from vocab gender; the three sentence games
// read baked JSON banks. Either way the renderer sees exactly this.

export const decisionItemSchema = z.object({
  /** Stable id: bank items `${game}:${level}:${n}`, gender items `gender:${es}` */
  id: z.string().min(1),
  /** Spanish only, exactly one `___`. El/La: "___ casa" */
  prompt: z.string().includes('___'),
  /**
   * Canonical, never shuffled — position = gender/tense/mood, which builds
   * muscle memory. The bank check keeps `correct` balanced across positions
   * so the position itself can't be gamed.
   */
  options: z.array(z.string().min(1)).min(2).max(4),
  /** Index into `options` */
  correct: z.number().int().min(0),
  /** Validated against RULE_TAGS[game] by the bank check */
  ruleTag: z.string().min(1),
  level: z.enum(CEFR_LEVELS),
  /** One sentence, du-register, Mexican usage. Shown on a wrong answer. */
  explanation_de: z.string().min(1),
})

export type DecisionItem = z.infer<typeof decisionItemSchema>

/**
 * Efraimidis–Spirakis weighted sample: sort by random^(1/weight), descending.
 * Shared with wordPool's SRS shuffle; lifted here so both pools use one impl.
 */
export function weightedShuffle<T>(items: T[], weightOf: (item: T) => number): T[] {
  return items
    .map((item) => ({ item, key: Math.pow(Math.random(), 1 / Math.max(weightOf(item), 1e-6)) }))
    .sort((a, b) => b.key - a.key)
    .map((x) => x.item)
}

/**
 * Level-filtered, weighted sample without replacement. The level IS the
 * difficulty dial (mirrors useGameWords). `weights` by ruleTag is the hook
 * for per-user weakness later — today every tag weighs 1.
 */
export function buildDecisionPool(opts: {
  items: DecisionItem[]
  level: CEFR
  count: number
  weights?: Record<string, number>
}): DecisionItem[] {
  const eligible = opts.items.filter((it) => it.level === opts.level)
  const shuffled = weightedShuffle(eligible, (it) => opts.weights?.[it.ruleTag] ?? 1)
  return shuffled.slice(0, opts.count)
}
