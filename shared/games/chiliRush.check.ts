// Run: npx tsx shared/games/chiliRush.check.ts
import assert from 'node:assert'
import { initChiliRush, onAnswer, isOver } from './chiliRush'
import type { SessionWord } from './types'

const pool: SessionWord[] = Array.from({ length: 20 }, (_, i) => ({
  id: `${i}`, es: `palabra${i}`, display: `Wort${i}`, srsWeight: 1,
}))

let s = initChiliRush(pool)
assert.equal(s.lives, 3)
assert.equal(s.combo, 1)
assert.ok(s.current, 'first drop spawned')
assert.equal(s.current!.options.length, 3, '3 baskets')
assert.equal(s.current!.options[s.current!.correctIndex], s.current!.word.display, 'correctIndex points at the word')

// 12 correct catches: combo caps at ×5, speed ramps every 5
for (let i = 0; i < 12; i++) s = onAnswer(s, s.current!.correctIndex)
assert.equal(s.catches, 12)
assert.equal(s.combo, 5, 'combo capped at ×5')
assert.equal(s.maxCombo, 5)
assert.equal(s.speedLevel, 1 + Math.floor(12 / 5), 'speed ramped every 5 catches')
assert.ok(s.score > 0)

// Miss: life lost, combo resets
const scoreBefore = s.score
s = onAnswer(s, null)
assert.equal(s.lives, 2)
assert.equal(s.combo, 1, 'combo reset on miss')
assert.equal(s.score, scoreBefore, 'no score change on miss')

// Wrong basket also costs a life
const wrongIndex = (s.current!.correctIndex + 1) % 3
s = onAnswer(s, wrongIndex)
assert.equal(s.lives, 1)

// Last life → over
s = onAnswer(s, null)
assert.equal(s.lives, 0)
assert.ok(s.over, 'over at 0 lives')
assert.ok(isOver(s, 0), 'isOver reflects lives')

// Clock end
const fresh = initChiliRush(pool)
assert.ok(!isOver(fresh, 89_999))
assert.ok(isOver(fresh, 90_000), 'isOver at 90s')

console.log('✓ chiliRush OK')
