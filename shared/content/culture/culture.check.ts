// Run: npx tsx shared/content/culture/culture.check.ts
// Validates schema completeness + locale coverage for every country file.
import assert from 'node:assert'
import { CULTURE_COUNTRIES, type LocalizedText } from './index'

export const EXPECTED_IDS = [
  'mx', 'es', 'ar', 'co', 'pe', 'cl', 'cu', 've', 'ec', 'gt', 'bo',
  'do', 'hn', 'py', 'sv', 'ni', 'cr', 'pa', 'uy', 'pr', 'gq',
] as const

function assertText(t: LocalizedText | undefined, where: string) {
  assert.ok(t && typeof t.en === 'string' && t.en.trim().length > 0, `${where}: missing en`)
  assert.ok(typeof t.de === 'string' && t.de.trim().length > 0, `${where}: missing de`)
}

const seen = new Set<string>()
for (const c of CULTURE_COUNTRIES) {
  const w = `culture[${c.id}]`
  assert.match(c.id, /^[a-z]{2}$/, `${w}: id must be ISO-2 lowercase`)
  assert.ok(!seen.has(c.id), `${w}: duplicate id`)
  seen.add(c.id)
  assert.ok(c.flag.trim(), `${w}: flag`)
  assert.ok(c.nameEs.trim() && c.capital.trim() && c.population.trim(), `${w}: nameEs/capital/population`)
  assertText(c.name, `${w}.name`)
  assertText(c.intro, `${w}.intro`)
  assertText(c.funFact, `${w}.funFact`)
  assert.ok(c.intro.en.length > 120, `${w}.intro.en too short — needs a real paragraph`)

  assert.ok(c.slang.length >= 5, `${w}: needs ≥5 slang entries (has ${c.slang.length})`)
  for (const s of c.slang) {
    assert.ok(s.term.trim(), `${w}.slang: term`)
    assertText(s.meaning, `${w}.slang[${s.term}].meaning`)
  }

  assert.ok(c.vocabulary.length >= 5, `${w}: needs ≥5 vocabulary entries (has ${c.vocabulary.length})`)
  for (const v of c.vocabulary) {
    assert.ok(v.es.trim(), `${w}.vocabulary: es`)
    assertText(v.translation, `${w}.vocab[${v.es}].translation`)
    if (v.note) assertText(v.note, `${w}.vocab[${v.es}].note`)
  }

  assert.ok(c.sights.length >= 3, `${w}: needs ≥3 sights (has ${c.sights.length})`)
  for (const s of c.sights) {
    assert.ok(s.name.trim() && s.emoji.trim(), `${w}.sights: name/emoji`)
    assertText(s.description, `${w}.sight[${s.name}].description`)
    assert.ok(s.lat >= -90 && s.lat <= 90 && s.lng >= -180 && s.lng <= 180, `${w}.sight[${s.name}]: coords out of range`)
    assert.ok(Math.abs(s.lat) + Math.abs(s.lng) > 0.1, `${w}.sight[${s.name}]: null-island coords`)
  }
}

const missing = EXPECTED_IDS.filter((id) => !seen.has(id))
assert.equal(missing.length, 0, `missing countries: ${missing.join(', ')}`)

console.log(`✓ culture content OK — ${CULTURE_COUNTRIES.length} countries, en+de complete`)
