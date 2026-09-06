// Self-check for the typed-answer grader.
// Run: npx tsx shared/grammar/answer.check.ts
import assert from 'node:assert'
import { checkGrammarAnswer, normalizeGrammarAnswer } from './answer'

// ── the two bugs this grader replaces ────────────────────────────────────
// Mobile used the vocabulary grader, which accepts a substring ≥4 chars.
assert.equal(
  checkGrammarAnswer('habría', 'habría viajado'),
  false,
  'a bare auxiliary is NOT the compound form',
)
assert.equal(checkGrammarAnswer('habría viajado', 'habría viajado'), true)

// …and which strips a leading article, so an article-only answer normalized to
// "" and could never be right. Three shipped items answer exactly that.
assert.equal(checkGrammarAnswer('las', 'las'), true, 'an article is a valid whole answer')
assert.equal(checkGrammarAnswer('La', 'la'), true, 'case-insensitive')

// ── whitespace ───────────────────────────────────────────────────────────
assert.equal(checkGrammarAnswer('había  ido', 'había ido'), true, 'inner runs collapse')
assert.equal(checkGrammarAnswer('  habría aprobado ', 'habría aprobado'), true, 'outer trims')
assert.equal(normalizeGrammarAnswer('Él  dijo.'), 'él dijo', 'lowercase + collapse + strip punctuation')

// ── accents stay significant ─────────────────────────────────────────────
assert.equal(checkGrammarAnswer('viajaria', 'viajaría'), false, 'missing tilde is wrong')
assert.equal(
  checkGrammarAnswer('hablará', 'hablara'),
  false,
  'hablara (imp. subj.) vs hablará (future) differ only by the tilde',
)

// ── acceptableAnswers ────────────────────────────────────────────────────
assert.equal(
  checkGrammarAnswer('hubiese aprobado', 'habría aprobado', ['hubiera aprobado', 'hubiese aprobado']),
  true,
  '-se variant counts when listed',
)
assert.equal(checkGrammarAnswer('fuese', 'fuera', ['fuese']), true)
assert.equal(checkGrammarAnswer('iría', 'fuera', ['fuese']), false, 'a wrong form stays wrong')

// ── empty / punctuation-only input ───────────────────────────────────────
assert.equal(checkGrammarAnswer('', 'fuera'), false)
assert.equal(checkGrammarAnswer('   ', 'fuera'), false)
assert.equal(checkGrammarAnswer('.', 'fuera'), false, 'punctuation-only is empty, not a match')
assert.equal(checkGrammarAnswer('«fuera».', 'fuera'), true, 'quotes and stops are ignored')

console.log('✓ answer.check.ts — no substring, no article strip, tildes count, whitespace collapsed')
