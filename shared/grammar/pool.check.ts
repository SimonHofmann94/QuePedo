// Self-check for the exercise pool merge + session selection.
// Run: npx tsx shared/grammar/pool.check.ts
import assert from 'node:assert'
import type { GrammarQuestion } from './exerciseTypes'
import { exerciseKey } from './exercises'
import { mergePool, selectSession, toPoolItems } from './pool'

const TYPES = ['multiple_choice', 'fill_in_blank', 'sentence_reorder', 'error_correction'] as const

function make(type: (typeof TYPES)[number], n: number): GrammarQuestion {
  switch (type) {
    case 'multiple_choice':
      return { type, prompt: `mc ${n}?`, options: ['a', 'b', 'c', 'd'], correctAnswer: 'a' }
    case 'fill_in_blank':
      return { type, sentenceWithBlank: `fib ${n} ___ x`, correctAnswer: `a${n}` }
    case 'sentence_reorder':
      return { type, correctSentence: `sr ${n} uno dos`, shuffledWords: ['dos', 'uno'] }
    case 'error_correction':
      return { type, sentenceWithError: `ec ${n} malo`, errorWord: 'malo', correctedWord: 'mala' }
  }
}

/** 10 of each type = 40 items. */
const pool: GrammarQuestion[] = TYPES.flatMap((t) => Array.from({ length: 10 }, (_, i) => make(t, i)))

// ── mergePool ────────────────────────────────────────────────────────────
const baked = [make('multiple_choice', 0), make('fill_in_blank', 0)]
const fromDb = [make('multiple_choice', 0), make('sentence_reorder', 7)] // first is a dupe of baked
const merged = mergePool(baked, fromDb)
assert.equal(merged.length, 3, 'identical item from DB collapses into the baked one')
assert.equal(merged[0], baked[0], 'baked copy wins on collision (it is the reviewed one)')
assert.equal(
  new Set(merged.map(exerciseKey)).size,
  merged.length,
  'merged pool holds no duplicate content_keys',
)

// ── selectSession: size, balance, uniqueness ─────────────────────────────
const session = selectSession(pool, 12)
assert.equal(session.length, 12, 'serves exactly the requested count')
assert.equal(new Set(session.map(exerciseKey)).size, 12, 'no item appears twice in one session')
for (const t of TYPES) {
  assert.equal(session.filter((q) => q.type === t).length, 3, `balanced: 3 × ${t}`)
}

// Short pool: everything is served, nothing invented.
const short = pool.slice(0, 5)
assert.equal(selectSession(short, 12).length, 5, 'pool smaller than count → serves what exists')

// Uneven count still fills up from the leftovers.
assert.equal(selectSession(pool, 10).length, 10, 'count not divisible by 4 still returns count')

// A type-starved chapter must still fill the session from other types.
const starved = [...pool.filter((q) => q.type === 'multiple_choice'), make('fill_in_blank', 99)]
const starvedSession = selectSession(starved, 8)
assert.equal(starvedSession.length, 8, 'missing types are topped up, not left as holes')

// ── selectSession: unseen first ──────────────────────────────────────────
// Mark everything seen except one item per type — those four MUST be served.
const unseen = TYPES.map((t) => make(t, 0))
const unseenKeys = new Set(unseen.map(exerciseKey))
const seen = new Set(pool.map(exerciseKey).filter((k) => !unseenKeys.has(k)))

for (let run = 0; run < 20; run++) {
  const s = selectSession(pool, 12, seen)
  for (const key of unseenKeys) {
    assert.ok(
      s.some((q) => exerciseKey(q) === key),
      'every unseen item is served before any seen one is repeated',
    )
  }
}

// With nothing seen yet the selection must not crash or shrink.
assert.equal(selectSession(pool, 12, new Set()).length, 12, 'empty seen-set behaves like no seen-set')

// ── toPoolItems: the RPC row shape ───────────────────────────────────────
const items = toPoolItems(baked)
assert.equal(items.length, 2)
assert.equal(items[0].content_key, exerciseKey(baked[0]), 'content_key IS exerciseKey — 027 dedupes on it')
assert.equal(items[0].type, baked[0].type, 'type column mirrors the payload discriminator')
assert.deepEqual(items[0].payload, baked[0], 'payload is the question verbatim')
assert.ok(items.every((i) => i.content_key.length <= 500), 'content_key fits the 027 CHECK')

// ── selectSession with a type filter (the focused drills) ────────────────
const onlyFib = selectSession(pool, 6, undefined, ['fill_in_blank'])
assert.equal(onlyFib.length, 6, 'filtered session still serves `count` items')
assert.ok(onlyFib.every((q) => q.type === 'fill_in_blank'), 'filter admits nothing else')
assert.equal(new Set(onlyFib.map(exerciseKey)).size, 6, 'no repeats inside a filtered session')

// Pool smaller than count: take what exists, no padding from other types.
const thin = selectSession(pool, 20, undefined, ['fill_in_blank'])
assert.equal(thin.length, 10, 'only 10 fill_in_blank items exist')
assert.ok(thin.every((q) => q.type === 'fill_in_blank'), 'short filtered pool stays pure')

const twoTypes = selectSession(pool, 12, undefined, ['fill_in_blank', 'error_correction'])
assert.equal(twoTypes.length, 12)
assert.ok(
  twoTypes.every((q) => q.type === 'fill_in_blank' || q.type === 'error_correction'),
  'a multi-type filter admits exactly those types',
)

// An empty filter must not starve the session — it means "no filter".
assert.equal(selectSession(pool, 12, undefined, []).length, 12, 'empty filter behaves as unfiltered')

// The unfiltered path is untouched: still 3 per type.
const balanced = selectSession(pool, 12)
for (const t of TYPES) {
  assert.equal(balanced.filter((q) => q.type === t).length, 3, `unfiltered session keeps 3 ${t}`)
}

// Unseen-first still applies under a filter.
const seenFib = new Set(
  Array.from({ length: 8 }, (_, i) => exerciseKey(make('fill_in_blank', i))),
)
for (let run = 0; run < 20; run++) {
  const picked = selectSession(pool, 2, seenFib, ['fill_in_blank'])
  assert.ok(
    picked.every((q) => !seenFib.has(exerciseKey(q))),
    'the 2 unseen fill_in_blank items win over the 8 seen ones',
  )
}

console.log('✓ pool.check.ts — merge, balance, type filter, unseen-first, RPC shape')
