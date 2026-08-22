// Live check for AI vocabulary generation. Hits Gemini, so it needs a key:
//   GEMINI_API_KEY=… npx tsx web/src/lib/vocabPrompt.check.ts
// Imports the REAL prompt and schema the server action uses, so it can't drift
// from what ships. Asserts the two things the feature promises: every language
// present, and genuinely polysemous words coming back with several meanings.
import assert from 'node:assert/strict'
import { MODEL, RESPONSE_SCHEMA, buildPrompt } from './vocabPrompt'
import { generatedVocabularySchema } from '../../../shared/types/schemas'
import { z } from 'zod'

async function main() {
  const apiKey = process.env.GEMINI_API_KEY
  if (!apiKey) {
    console.error('✗ GEMINI_API_KEY not set')
    process.exit(1)
  }

  const prompt = buildPrompt('el banco, el tiempo, la carta', 3, 'de')

  const res = await fetch(
    `https://generativelanguage.googleapis.com/v1beta/models/${MODEL}:generateContent?key=${apiKey}`,
    {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        contents: [{ parts: [{ text: prompt }] }],
        generationConfig: {
          responseMimeType: 'application/json',
          responseSchema: RESPONSE_SCHEMA,
        },
      }),
    },
  )
  // Read the body ONCE — an assert message is evaluated eagerly, so awaiting
  // res.text() inside it consumes the stream even on success.
  const bodyText = await res.text()
  assert.ok(res.ok, `Gemini ${res.status}: ${bodyText.slice(0, 200)}`)

  const raw = JSON.parse(bodyText).candidates?.[0]?.content?.parts?.[0]?.text ?? '[]'
  const words = z.array(generatedVocabularySchema).parse(JSON.parse(raw))

  assert.ok(words.length > 0, 'model returned no words')
  for (const w of words) {
    for (const loc of ['de', 'en', 'es'] as const) {
      assert.ok(
        w.translations[loc].length > 0,
        `${w.term}: missing ${loc} — the UI can't follow app_locale without all three`,
      )
    }
  }

  // The whole point of the change: polysemous words must carry several senses.
  const multi = words.filter((w) => w.translations.de.length > 1)
  assert.ok(
    multi.length > 0,
    'no word came back with multiple German meanings — banco/tiempo/carta are all polysemous, so the prompt is not working',
  )

  for (const w of words) {
    console.log(`  ${w.term}`)
    console.log(`    de: ${w.translations.de.join(' · ')}`)
    console.log(`    en: ${w.translations.en.join(' · ')}`)
    console.log(`    es: ${w.translations.es.join(' · ')}`)
  }
  console.log(`\n✓ AI vocab generation OK — ${words.length} words, ${multi.length} with multiple German meanings`)
}

main().catch((e) => {
  console.error('✗', e.message)
  process.exit(1)
})
