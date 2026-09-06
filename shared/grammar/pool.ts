// Grammar exercise pool: how baked JSON and the `grammar_exercises` DB layer
// (migration 027) become one session's worth of questions.
//
// Pure functions only — the Supabase reads live in web/src/lib/grammarPool.ts
// and mobile/services/grammarPool.ts, which both end here.
import type { GrammarQuestion } from './exerciseTypes'
import { exerciseKey } from './exercises'

/** How many questions one practice session serves. */
export const EXERCISES_PER_SESSION = 12

const TYPES = [
  'multiple_choice',
  'fill_in_blank',
  'sentence_reorder',
  'error_correction',
] as const

/** The row shape `add_grammar_exercises` expects. */
export interface GrammarPoolItem {
  content_key: string
  type: GrammarQuestion['type']
  payload: GrammarQuestion
}

export function toPoolItems(exercises: GrammarQuestion[]): GrammarPoolItem[] {
  return exercises.map((ex) => ({
    content_key: exerciseKey(ex),
    type: ex.type,
    payload: ex,
  }))
}

/** Fisher–Yates. `sort(() => Math.random() - 0.5)` is biased; this isn't. */
function shuffle<T>(input: readonly T[]): T[] {
  const a = [...input]
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[a[i], a[j]] = [a[j], a[i]]
  }
  return a
}

/**
 * Baked (hand-curated + JSON) ∪ DB pool, deduped on exerciseKey.
 * Baked wins on collision — it is the reviewed copy.
 */
export function mergePool(
  baked: readonly GrammarQuestion[],
  fromDb: readonly GrammarQuestion[],
): GrammarQuestion[] {
  const seen = new Set<string>()
  const out: GrammarQuestion[] = []
  for (const ex of [...baked, ...fromDb]) {
    const k = exerciseKey(ex)
    if (seen.has(k)) continue
    seen.add(k)
    out.push(ex)
  }
  return out
}

/**
 * One session out of the pool: unseen items first, balanced across the four
 * types, shuffled for presentation.
 *
 * `seen` holds the content_keys from user_grammar_progress. Without it this
 * degrades to "balanced + random", which is still better than the fixed-order
 * slice the screens used before the pool existed.
 *
 * `types` narrows the session to those question types — that is what the
 * focused drills (condicional, estilo indirecto) use. With a filter the 4-way
 * balance is skipped entirely: balancing a single-type session is a no-op that
 * only happens to work via the top-up branch.
 */
export function selectSession(
  pool: readonly GrammarQuestion[],
  count: number = EXERCISES_PER_SESSION,
  seen?: ReadonlySet<string>,
  types?: readonly GrammarQuestion['type'][],
): GrammarQuestion[] {
  const src = types && types.length > 0 ? pool.filter((ex) => types.includes(ex.type)) : pool
  if (src.length <= count) return shuffle(src)

  // 0 = unseen, 1 = already met. Shuffle first, then a STABLE sort by rank:
  // random order survives inside each rank group.
  const rank = (ex: GrammarQuestion) => (seen?.has(exerciseKey(ex)) ? 1 : 0)
  const ordered = (list: readonly GrammarQuestion[]) =>
    shuffle(list).sort((a, b) => rank(a) - rank(b))

  if (types && types.length > 0) return shuffle(ordered(src).slice(0, count))

  const perType = Math.floor(count / TYPES.length)
  const picked: GrammarQuestion[] = []
  for (const type of TYPES) {
    picked.push(...ordered(src.filter((ex) => ex.type === type)).slice(0, perType))
  }

  // A chapter can be short on one type (or count may not divide by 4) — top up
  // from whatever is left, unseen first.
  if (picked.length < count) {
    const used = new Set(picked)
    picked.push(...ordered(src.filter((ex) => !used.has(ex))).slice(0, count - picked.length))
  }

  return shuffle(picked)
}
