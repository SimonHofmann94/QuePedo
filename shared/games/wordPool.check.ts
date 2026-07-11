// Run: npx tsx shared/games/wordPool.check.ts
import assert from 'node:assert'
import type { VocabWord } from '../content/vocab/types'
import { buildSessionPool, pickDistractors, type UserWordInput } from './wordPool'

const user = (id: string, term: string, de: string, extra?: Partial<UserWordInput>): UserWordInput => ({
  id, term, translations: { de }, ...extra,
})
const curated = (es: string, de: string): VocabWord => ({ es, de, pos: 'n', rank: 1 })

// Fallback blending fills to minCount from curated
const pool = buildSessionPool({
  userWords: [user('1', 'el perro', 'Hund'), user('2', 'el gato', 'Katze')],
  curatedFallback: [curated('la casa', 'Haus'), curated('el sol', 'Sonne'), curated('la luna', 'Mond')],
  minCount: 4,
})
assert.equal(pool.length, 4, 'topped up to minCount')
assert.equal(pool.filter((w) => w.id.startsWith('curated:')).length, 2, 'exactly 2 curated fills')

// Dedup: user word wins over curated with same es
const dedup = buildSessionPool({
  userWords: [user('1', 'la casa', 'Haus (meins)')],
  curatedFallback: [curated('la casa', 'Haus'), curated('el sol', 'Sonne')],
  minCount: 2,
})
assert.equal(dedup.length, 2)
assert.equal(dedup.find((w) => w.es === 'la casa')?.id, '1', 'user word wins dedup')

// Locale resolves display
const localePool = buildSessionPool({
  userWords: [user('1', 'el perro', 'Hund', { translations: { de: 'Hund', en: 'dog' } })],
  curatedFallback: [],
  minCount: 1,
  locale: 'en',
})
assert.equal(localePool[0].display, 'dog', 'locale=en shows English')

// SRS weighting: due words get weight 3, weak 2, default 1
const now = new Date('2026-07-11T12:00:00Z')
const weighted = buildSessionPool({
  userWords: [
    user('due', 'a', 'A', { progress: { next_review_at: '2026-07-10T00:00:00Z', box_level: 4 } }),
    user('weak', 'b', 'B', { progress: { next_review_at: '2026-08-01T00:00:00Z', box_level: 1 } }),
    user('plain', 'c', 'C'),
  ],
  curatedFallback: [],
  minCount: 1,
  now,
})
assert.equal(weighted.find((w) => w.id === 'due')?.srsWeight, 3)
assert.equal(weighted.find((w) => w.id === 'weak')?.srsWeight, 2)
assert.equal(weighted.find((w) => w.id === 'plain')?.srsWeight, 1)

// Distractors never collide with the correct answer (term or display)
const big = buildSessionPool({
  userWords: [
    user('1', 'el perro', 'Hund'),
    user('2', 'el can', 'Hund'), // same display as correct → must be excluded
    user('3', 'el gato', 'Katze'),
    user('4', 'el sol', 'Sonne'),
    user('5', 'la luna', 'Mond'),
  ],
  curatedFallback: [],
  minCount: 1,
})
const correct = big.find((w) => w.es === 'el perro')!
for (let i = 0; i < 50; i++) {
  const ds = pickDistractors(big, correct, 2)
  assert.equal(ds.length, 2)
  for (const d of ds) {
    assert.notEqual(d.es, 'el perro', 'never the correct word')
    assert.notEqual(d.display, 'Hund', 'never a colliding translation')
  }
}

console.log('✓ wordPool OK')
