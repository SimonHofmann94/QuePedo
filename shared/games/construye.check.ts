// Run: npx tsx shared/games/construye.check.ts
import assert from 'node:assert'
import { scramble, checkComplete, scoreRound, initConstruye, applyHint, completeRound } from './construye'
import type { SessionWord } from './types'

// scramble ≠ solution over many trials, incl. short + repeated-letter words
for (const word of ['leche', 'sol', 'ala', 'casa', 'ññé', 'ab']) {
  for (let i = 0; i < 100; i++) {
    const tiles = scramble(word)
    assert.notEqual(tiles.join(''), word, `scramble(${word}) differs from solution`)
    assert.deepEqual([...tiles].sort(), Array.from(word).sort(), `scramble(${word}) preserves letters`)
  }
}
// All-identical letters can't differ — returned as-is (trivially solved)
assert.equal(scramble('aa').join(''), 'aa')
assert.equal(scramble('a').join(''), 'a')

// Unicode: accented letters are single tiles
assert.equal(scramble('café').length, 4, 'é is one tile')

// checkComplete is strict — accent mismatch fails
assert.ok(checkComplete('café', 'café'))
assert.ok(!checkComplete('cafe', 'café'), 'accent mismatch fails')
assert.ok(!checkComplete('Café', 'café'), 'case mismatch fails')

// Scoring: length × 10, +20 no-hint bonus
const w = (es: string): SessionWord => ({ id: es, es, display: 'x', srsWeight: 1 })
assert.equal(scoreRound(w('leche'), 0), 5 * 10 + 20)
assert.equal(scoreRound(w('leche'), 2), 5 * 10)

// Full state flow: hints tracked, no-hint counter, over after last round
let s = initConstruye([w('sol'), w('mar')])
assert.equal(s.rounds.length, 2)
const hinted = applyHint(s)
assert.equal(hinted.nextLetter, 's', 'first hint reveals first letter')
s = hinted.state
assert.equal(s.rounds[0].hintsUsed, 1)
s = completeRound(s) // round 1 solved with a hint
assert.equal(s.solvedNoHints, 0)
assert.equal(s.score, 3 * 10)
s = completeRound(s) // round 2 solved clean
assert.equal(s.solvedNoHints, 1)
assert.equal(s.score, 3 * 10 + 3 * 10 + 20)
assert.ok(s.over, 'over after final round')

console.log('✓ construye OK')
