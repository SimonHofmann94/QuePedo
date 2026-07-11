// Self-check for locale-aware content resolution. Run: npx tsx shared/grammar/localeContent.check.ts
// Covers the two branchy functions this feature added logic to:
// getDisplayTranslation (vocab) and getGrammarLevel (grammar) + fallback.
import assert from 'node:assert'
import { getDisplayTranslation } from '../utils/quiz'
import { getGrammarLevel, getChapter } from './index'

// --- Vocabulary: pick the translation matching the active locale ---
const tr = { de: 'Haus', en: 'house' }
assert.equal(getDisplayTranslation(tr, 'de'), 'Haus', 'de locale → German')
assert.equal(getDisplayTranslation(tr, 'en'), 'house', 'en locale → English (was the bug: showed German)')
assert.equal(getDisplayTranslation(tr, 'es'), 'Haus', 'missing es → falls back (de before en)')
assert.equal(getDisplayTranslation({ en: 'house' }, 'de'), 'house', 'missing de → falls back to en')
assert.equal(getDisplayTranslation(tr), 'Haus', 'no locale arg → legacy de→en behavior unchanged')

// --- Grammar: German file loads for de; missing levels fall back to English base ---
assert.equal(getGrammarLevel('a1', 'de')?.title, 'Spanische Grammatik für Anfänger', 'a1/de → German content')
assert.equal(getGrammarLevel('a2', 'de')?.title, getGrammarLevel('a2')?.title, 'a2/de → English base (no German file yet)')
assert.equal(getGrammarLevel('a1', 'en')?.title, 'Beginner Spanish Grammar', 'a1/en → English baseline unchanged')
assert.equal(getGrammarLevel('a1')?.title, 'Beginner Spanish Grammar', 'a1 no locale → English base unchanged')

// --- Partial German file must NOT hide existing English chapters (merge, no regression) ---
const baseA1 = getGrammarLevel('a1')!
const deA1 = getGrammarLevel('a1', 'de')!
assert.equal(deA1.chapters.length, baseA1.chapters.length, 'de/a1 keeps full base chapter set (no content loss)')
assert.equal(getChapter('a1', 0, 'de')?.title, 'Alphabet, Aussprache & grundlegende Phonetik', 'ch0 translated → German')
assert.equal(getChapter('a1', 1, 'de')?.title, getChapter('a1', 1)?.title, 'ch1 untranslated → English base (no 404)')

console.log('✓ locale-aware vocab + grammar resolution OK')
