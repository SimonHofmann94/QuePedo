// Run: npx tsx shared/content/culture/culture.check.ts
// Validates schema completeness, locale coverage and EDITORIAL floors for every
// country file. Deliberately stricter than schema.ts: zod also parses rows an
// admin saved before v2 existed and must stay permissive, while this check runs
// over bundled JSON only and can demand real content.
//
import assert from 'node:assert'
import { CULTURE_COUNTRIES, type CultureImage, type LocalizedText } from './index'

export const EXPECTED_IDS = [
  'mx', 'es', 'ar', 'co', 'pe', 'cl', 'cu', 've', 'ec', 'gt', 'bo',
  'do', 'hn', 'py', 'sv', 'ni', 'cr', 'pa', 'uy', 'pr', 'gq',
] as const

const ALLOWED_WIDTHS = /\/(120|250|500|960|1280|1920|3840)px-/
const ALLOWED_LICENSE = /^(CC0|Public domain|CC BY(-SA)? [1-4]\.\d)$/i

// The point of v2. A filler hit is a REWRITE, not a synonym swap — the phrase is
// a symptom of having nothing concrete to say. This is a floor, not a ceiling:
// it catches phrases, not vacuousness. The real bar is the proper-noun swap test
// (spec §3) — if the sentence stays true with the names replaced, it says nothing.
const FILLER = [
  /\bvibrant\b/i, /\bbustling\b/i, /\bpicturesque\b/i, /\bbreathtaking\b/i,
  /\bnestled\b/i, /\bhidden gem\b/i, /\bmust[- ]see\b/i, /\brich (?:history|culture|heritage)\b/i,
  /\bsomething for everyone\b/i, /\bfeast for the senses\b/i, /\b(?:jewel|pearl|gem) of\b/i,
  /\bunforgettable\b/i, /\btruly unique\b/i, /\boff the beaten (?:path|track)\b/i,
  /\bpulsierend/i, /\bmalerisch/i, /\batemberaubend/i, /\beingebettet\b/i,
  /\bGeheimtipp\b/i, /\bein Muss\b/i, /\breiche (?:Geschichte|Kultur)\b/i,
  /\bfür jeden etwas\b/i, /\bunvergesslich/i, /\bPerle (?:des|der)\b/i,
  /\babseits der ausgetretenen Pfade\b/i,
  /\bloved by locals and (?:visitors|tourists)\b/i, /\blocals and visitors alike\b/i,
  /\bbei Einheimischen wie (?:Besuchern|Touristen)\b/i,
]

function assertText(t: LocalizedText | undefined, where: string): asserts t is LocalizedText {
  assert.ok(t && typeof t.en === 'string' && t.en.trim().length > 0, `${where}: missing en`)
  assert.ok(typeof t!.de === 'string' && t!.de.trim().length > 0, `${where}: missing de`)
}

function assertLen(t: LocalizedText | undefined, min: number, max: number, where: string) {
  assertText(t, where)
  for (const [loc, s] of Object.entries(t) as ['en' | 'de', string][]) {
    assert.ok(s.length >= min, `${where}.${loc}: ${s.length} chars, need >= ${min}`)
    assert.ok(s.length <= max, `${where}.${loc}: ${s.length} chars, need <= ${max}`)
  }
  if (t.en.length > 60) {
    const r = t.de.length / t.en.length
    assert.ok(
      r >= 0.75 && r <= 1.35,
      `${where}: de/en length ratio ${r.toFixed(2)} — de looks like a placeholder or a truncation`,
    )
  }
}

function assertNoFiller(t: LocalizedText, where: string) {
  for (const [loc, s] of Object.entries(t) as ['en' | 'de', string][]) {
    for (const re of FILLER) {
      const m = s.match(re)
      assert.ok(!m, `${where}.${loc}: filler phrase "${m?.[0]}" — rewrite with something concrete`)
    }
  }
}

function assertImage(img: CultureImage | undefined, where: string, urls: Set<string>) {
  assert.ok(img, `${where}: missing image`)
  const { url, sourcePage, author, license, width, height } = img!

  assert.ok(
    url.startsWith('https://upload.wikimedia.org/wikipedia/commons/thumb/'),
    `${where}.url: must be a Commons thumbnail (the /wikipedia/en/ tree is non-free)`,
  )
  assert.ok(!url.includes('?'), `${where}.url: strip the API's ?utm_* query string`)
  assert.match(url, ALLOWED_WIDTHS, `${where}.url: width not on Wikimedia's allowlist — any other width returns HTTP 400`)
  assert.match(url, /\.(jpe?g|png)$/i, `${where}.url: must end .jpg/.jpeg/.png`)
  assert.ok(!urls.has(url), `${where}.url: duplicate image within this country`)
  urls.add(url)

  assert.ok(
    sourcePage.startsWith('https://commons.wikimedia.org/wiki/File:'),
    `${where}.sourcePage: must be the Commons File: page`,
  )
  assert.ok(author.trim().length >= 2, `${where}.author: attribution is a license obligation`)
  assert.ok(license.trim().length >= 2, `${where}.license: missing`)
  assert.match(license, ALLOWED_LICENSE, `${where}.license: "${license}" is not a permitted license (no NC, ND, GFDL-only)`)
  assert.ok(width > 0 && height > 0, `${where}: width/height must be positive`)
  assertLen(img!.alt, 20, 140, `${where}.alt`)
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

  for (const s of c.slang) {
    assert.ok(s.term.trim(), `${w}.slang: term`)
    assertText(s.meaning, `${w}.slang[${s.term}].meaning`)
  }
  for (const v of c.vocabulary) {
    assert.ok(v.es.trim(), `${w}.vocabulary: es`)
    assertText(v.translation, `${w}.vocab[${v.es}].translation`)
    if (v.note) assertText(v.note, `${w}.vocab[${v.es}].note`)
  }
  for (const s of c.sights) {
    assert.ok(s.name.trim() && s.emoji.trim(), `${w}.sights: name/emoji`)
    assertText(s.description, `${w}.sight[${s.name}].description`)
    assert.ok(s.lat >= -90 && s.lat <= 90 && s.lng >= -180 && s.lng <= 180, `${w}.sight[${s.name}]: coords out of range`)
    assert.ok(Math.abs(s.lat) + Math.abs(s.lng) > 0.1, `${w}.sight[${s.name}]: null-island coords`)
  }

  const urls = new Set<string>()

  assertLen(c.tagline, 45, 120, `${w}.tagline`)
  assertNoFiller(c.tagline!, `${w}.tagline`)
  assertLen(c.intro, 400, 750, `${w}.intro`)
  assertNoFiller(c.intro, `${w}.intro`)
  assertLen(c.funFact, 120, 260, `${w}.funFact`)

  assertImage(c.heroImage, `${w}.heroImage`, urls)
  const hero = c.heroImage!
  assert.ok(hero.width > hero.height, `${w}.heroImage: must be landscape — it runs full-bleed behind a title`)
  assert.ok(
    hero.width / hero.height >= 1.3,
    `${w}.heroImage: aspect ${(hero.width / hero.height).toFixed(2)} too square, need >= 1.3`,
  )

  assert.ok(c.slang.length >= 6, `${w}: needs ≥6 slang entries (has ${c.slang.length})`)
  assert.ok(c.vocabulary.length >= 7, `${w}: needs ≥7 vocabulary entries (has ${c.vocabulary.length})`)
  for (const s of c.slang) assertLen(s.meaning, 20, 180, `${w}.slang[${s.term}].meaning`)
  for (const v of c.vocabulary) {
    assertLen(v.translation, 3, 120, `${w}.vocab[${v.es}].translation`)
    if (v.note) assertLen(v.note, 10, 140, `${w}.vocab[${v.es}].note`)
  }

  assert.ok(
    c.sights.length >= 8 && c.sights.length <= 10,
    `${w}: needs 8–10 sights (has ${c.sights.length})`,
  )
  for (const s of c.sights) {
    assertLen(s.description, 200, 420, `${w}.sight[${s.name}].description`)
    assertNoFiller(s.description, `${w}.sight[${s.name}].description`)
    assertImage(s.image, `${w}.sight[${s.name}].image`, urls)
  }
  // Catches 9 pins stacked on the capital. 0.5° not 1°: Puerto Rico spans
  // ~0.6°×~1.6° and a 1° grid would be unreachable there by anything but luck.
  const buckets = new Set(c.sights.map((s) => `${Math.round(s.lat * 2)}:${Math.round(s.lng * 2)}`))
  assert.ok(buckets.size >= 4, `${w}: sights cluster in ${buckets.size} area(s) — spread them across ≥4 regions`)

  const food = c.food ?? []
  assert.ok(food.length >= 4 && food.length <= 6, `${w}.food: needs 4–6 dishes (has ${food.length})`)
  for (const d of food) {
    assert.ok(d.name.trim(), `${w}.food: name`)
    assertLen(d.description, 130, 320, `${w}.food[${d.name}].description`)
    assertNoFiller(d.description, `${w}.food[${d.name}].description`)
    if (d.image) assertImage(d.image, `${w}.food[${d.name}].image`, urls)
  }
  assert.ok(
    food.filter((d) => d.image).length >= 2,
    `${w}.food: at least 2 dishes need a photo (has ${food.filter((d) => d.image).length})`,
  )

  const festivals = c.festivals ?? []
  assert.ok(festivals.length >= 2 && festivals.length <= 3, `${w}.festivals: needs 2–3 (has ${festivals.length})`)
  for (const f of festivals) {
    assert.ok(f.name.trim(), `${w}.festivals: name`)
    assertLen(f.when, 5, 45, `${w}.festival[${f.name}].when`)
    assertLen(f.description, 150, 320, `${w}.festival[${f.name}].description`)
    assertNoFiller(f.description, `${w}.festival[${f.name}].description`)
    if (f.image) assertImage(f.image, `${w}.festival[${f.name}].image`, urls)
  }

  const etiquette = c.etiquette ?? []
  assert.ok(etiquette.length >= 4 && etiquette.length <= 6, `${w}.etiquette: needs 4–6 (has ${etiquette.length})`)
  for (const e of etiquette) {
    assert.ok(
      e.title.trim().length >= 3 && e.title.trim().length <= 28,
      `${w}.etiquette[${e.title}]: title must be 3–28 chars`,
    )
    assertLen(e.text, 80, 200, `${w}.etiquette[${e.title}].text`)
    assertNoFiller(e.text, `${w}.etiquette[${e.title}].text`)
  }
}

const missing = EXPECTED_IDS.filter((id) => !seen.has(id))
assert.equal(missing.length, 0, `missing countries: ${missing.join(', ')}`)

console.log(
  `✓ culture content OK — ${CULTURE_COUNTRIES.length} countries, en+de complete, all v2`,
)
