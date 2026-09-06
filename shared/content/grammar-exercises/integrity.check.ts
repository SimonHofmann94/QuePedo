// Structural contract for EVERY baked grammar exercise, all six levels.
// Run: npx tsx shared/content/grammar-exercises/integrity.check.ts
//
// Written after a cleanup run that found 131 broken items in the Gemini bake:
// reorder puzzles missing a word, "corrections" of already-correct sentences,
// multiple-choice items with the same option twice, a soft hyphen inside a
// word. None of it is visible by reading the JSON — but each one hands the
// learner an exercise that cannot be solved or that teaches the wrong thing.
import assert from 'node:assert'
import { getBakedExercises } from './index'
import { grammarQuestionSchema } from '../../grammar/exerciseSchema'

const LEVELS = ['a1', 'a2', 'b1', 'b2', 'c1', 'c2']
const CHAPTERS_PER_LEVEL = 25 // upper bound; missing ids are skipped
const INVISIBLE = /[\u00ad\u200b\u200e\u200f\ufeff\u00a0]/
const PUNCT = /^[.,;:!?\u00bf\u00a1\u00ab\u00bb"\u2026]+|[.,;:!?\u00bf\u00a1\u00ab\u00bb"\u2026]+$/g

/**
 * Accents are significant everywhere in this app: «hablara» (imperfect
 * subjunctive) and «hablará» (future) are different words. An alternative that
 * differs from the answer only by a tilde therefore silently makes one chapter
 * lenient while every other chapter is strict.
 */
const noAccents = (s: string) => s.normalize('NFD').replace(/\p{Mn}/gu, '').toLowerCase()

function assertNoAccentTwin(at: string, answer: string, alternatives: readonly string[]) {
  for (const alt of alternatives) {
    if (alt === answer) continue
    assert.notEqual(
      noAccents(alt), noAccents(answer),
      `${at}: «${alt}» differs from «${answer}» only by accents — either it is a different word or it must not be accepted`,
    )
  }
}

/** Tiles must be the sentence's words — punctuation is not a tile. */
const words = (sentence: string) =>
  sentence.split(/\s+/).map((w) => w.replace(PUNCT, '')).filter(Boolean)

let checked = 0
for (const level of LEVELS) {
  for (let id = 0; id < CHAPTERS_PER_LEVEL; id++) {
    for (const q of getBakedExercises(level, id) ?? []) {
      const at = `${level}/${id} [${q.type}]`
      checked++

      assert.ok(grammarQuestionSchema.safeParse(q).success, `${at}: fails the schema`)
      assert.ok(
        !INVISIBLE.test(JSON.stringify(q)),
        `${at}: invisible character (soft hyphen, ZWSP, NBSP…) — makes the item unsolvable`,
      )

      switch (q.type) {
        case 'multiple_choice': {
          assert.equal(q.options.length, 4, `${at}: needs exactly 4 options`)
          assert.equal(
            new Set(q.options).size, 4,
            `${at}: the same option twice — ${JSON.stringify(q.options)}`,
          )
          assert.ok(
            q.options.includes(q.correctAnswer),
            `${at}: correctAnswer «${q.correctAnswer}» is not among the options`,
          )
          break
        }
        case 'fill_in_blank': {
          assert.equal(
            q.sentenceWithBlank.split('___').length - 1, 1,
            `${at}: needs exactly one «___» — every renderer splits once and drops the rest`,
          )
          assert.ok(q.correctAnswer.trim().length > 0, `${at}: empty correctAnswer`)
          if (q.acceptableAnswers?.length) {
            assert.ok(
              q.acceptableAnswers.includes(q.correctAnswer),
              `${at}: correctAnswer «${q.correctAnswer}» missing from acceptableAnswers`,
            )
            assertNoAccentTwin(at, q.correctAnswer, q.acceptableAnswers)
          }
          break
        }
        case 'sentence_reorder': {
          const want = words(q.correctSentence)
          assert.deepEqual(
            [...q.shuffledWords].sort(), [...want].sort(),
            `${at}: the tiles do not spell «${q.correctSentence}»`,
          )
          assert.notDeepEqual(
            q.shuffledWords, want,
            `${at}: tiles are already in sentence order — the puzzle is pre-solved`,
          )
          break
        }
        case 'error_correction': {
          assert.ok(
            q.sentenceWithError.includes(q.errorWord),
            `${at}: errorWord «${q.errorWord}» does not appear in the sentence`,
          )
          assert.notEqual(
            q.errorWord, q.correctedWord,
            `${at}: «${q.sentenceWithError}» contains no error to find`,
          )
          if (q.acceptableCorrections?.length) {
            assert.ok(
              q.acceptableCorrections.includes(q.correctedWord),
              `${at}: correctedWord missing from acceptableCorrections`,
            )
            assertNoAccentTwin(at, q.correctedWord, q.acceptableCorrections)
          }
          break
        }
      }
    }
  }
}

console.log(`✓ integrity.check.ts — ${checked} baked exercises across ${LEVELS.length} levels`)
