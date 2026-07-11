// Run: npx tsx shared/games/loteria.check.ts
import assert from 'node:assert'
import { initLoteria, currentCall, onTap, completedLines } from './loteria'
import type { SessionWord } from './types'

const pool: SessionWord[] = Array.from({ length: 20 }, (_, i) => ({
  id: `${i}`, es: `palabra${i}`, display: `Wort${i}`, srsWeight: 1,
}))

let s = initLoteria(pool)
assert.equal(s.board.length, 16, 'board is 4×4')
assert.equal(new Set(s.board.map((w) => w.es)).size, 16, '16 unique words')
assert.equal(new Set(s.callOrder).size, 16, 'call order is a permutation')

// Wrong tap: penalty, call unchanged, no mark
const call = currentCall(s)!
const wrongCell = s.board.findIndex((w) => w.es !== call.es)
s = onTap(s, wrongCell)
assert.equal(s.wrongTaps, 1)
assert.equal(currentCall(s)!.es, call.es, 'call stays active after wrong tap')
assert.ok(!s.marked[wrongCell])
assert.equal(s.score, 0, 'penalty floors at 0')

// Play the full session with correct taps
for (let i = 0; i < 16; i++) {
  const c = currentCall(s)!
  const cell = s.board.findIndex((w) => w.es === c.es)
  s = onTap(s, cell)
}
assert.ok(s.over, 'over after 16 calls')
assert.ok(s.marked.every(Boolean), 'full board marked')
assert.equal(s.linesCompleted, 8, 'all 4 rows + 4 columns complete')
assert.equal(s.wrongTaps, 1, 'only the one deliberate wrong tap')

// completedLines: single row / single column
const rowOnly = new Array(16).fill(false)
for (let c = 0; c < 4; c++) rowOnly[1 * 4 + c] = true
assert.equal(completedLines(rowOnly), 1, 'one completed row detected')
const colOnly = new Array(16).fill(false)
for (let r = 0; r < 4; r++) colOnly[r * 4 + 2] = true
assert.equal(completedLines(colOnly), 1, 'one completed column detected')

// Too-small pool throws
let threw = false
try { initLoteria(pool.slice(0, 10)) } catch { threw = true }
assert.ok(threw, 'rejects pool < 16')

console.log('✓ loteria OK')
