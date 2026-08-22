// Self-check for multi-meaning translations. Run: npx tsx shared/utils/quiz.check.ts
import assert from 'node:assert/strict'
import { checkAnswer, getDisplayTranslation, getTranslationMeanings, toMeanings } from './quiz'
import { vocabListMeanings, vocabWordTranslations } from '../content/vocab'
import type { VocabWord } from '../content/vocab/types'

// --- legacy single-string data keeps working, unchanged ---
const legacy = { de: 'Haus', en: 'house' }
assert.equal(getDisplayTranslation(legacy, 'de'), 'Haus', 'de locale → German')
assert.equal(getDisplayTranslation(legacy, 'en'), 'house', 'en locale → English')
assert.equal(getDisplayTranslation(legacy, 'es'), 'Haus', 'missing es → falls back (de before en)')
assert.equal(getDisplayTranslation({ en: 'house' }, 'de'), 'house', 'missing de → falls back to en')
assert.equal(getDisplayTranslation(legacy), 'Haus', 'no locale arg → legacy de→en behavior')

// --- multi-meaning ---
const bank = { de: ['Bank', 'Sitzbank'], en: ['bank', 'bench'] }
assert.equal(getDisplayTranslation(bank, 'de'), 'Bank', 'display shows the PRIMARY meaning only')
assert.deepEqual(getTranslationMeanings(bank, 'de'), ['Bank', 'Sitzbank'], 'meanings returns all')
assert.deepEqual(getTranslationMeanings(legacy, 'de'), ['Haus'], 'string data → single-element list')
assert.deepEqual(getTranslationMeanings({}, 'de'), [], 'empty translations → empty list')

// --- grading: ANY meaning counts. This is the assertion that catches an unwinnable quiz. ---
assert.ok(checkAnswer('Bank', bank.de), 'primary meaning accepted')
assert.ok(checkAnswer('Sitzbank', bank.de), 'NON-primary meaning accepted')
assert.ok(checkAnswer('die Sitzbank', bank.de), 'leading article still stripped')
assert.ok(!checkAnswer('Tisch', bank.de), 'wrong answer still rejected')
assert.ok(!checkAnswer('   ', bank.de), 'blank answer rejected')
assert.ok(checkAnswer('Haus', 'Haus'), 'plain-string correctAnswer still supported')

// --- shape coercion ---
assert.deepEqual(toMeanings(['a', '', '  ']), ['a'], 'blank entries dropped')
assert.deepEqual(toMeanings(undefined), [], 'undefined → empty')

// --- curated CEFR lists: the reported bug was English showing in a German app ---
const word: VocabWord = { es: 'el banco', de: ['die Bank', 'die Sitzbank'], en: 'bank', pos: 'n', rank: 1 }
assert.deepEqual(vocabListMeanings(word, 'de'), ['die Bank', 'die Sitzbank'], 'de locale → German, all senses')
assert.deepEqual(vocabListMeanings(word, 'en'), ['bank'], 'en locale → English')
assert.deepEqual(vocabListMeanings(word, 'es'), ['bank'], 'es locale → English, NOT German (no es glosses exist)')

const germanOnly: VocabWord = { es: 'la mesa', de: 'der Tisch', pos: 'n', rank: 2 }
assert.deepEqual(vocabListMeanings(germanOnly, 'en'), ['der Tisch'], 'missing en → falls back to de')

assert.deepEqual(
    vocabWordTranslations(word),
    { de: ['die Bank', 'die Sitzbank'], en: 'bank' },
    'adding to the notebook carries every meaning, not just the first',
)
assert.ok(checkAnswer('Sitzbank', vocabWordTranslations(word).de), 'list word stays answerable on any sense')

console.log('✓ quiz translation checks passed')
