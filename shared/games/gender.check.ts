// Run: npx tsx shared/games/gender.check.ts
import assert from 'node:assert/strict'
import { deriveGender, pluralize, buildGenderItems, STRESSED_A_FEMININES } from './gender'
import type { VocabWord } from '../content/vocab/types'

const g = (es: string, de?: string) => deriveGender(es, de)

// sure ending rules
assert.equal(g('nación').gender, 'f'); assert.equal(g('nación').confidence, 'sure')
assert.equal(g('ciudad').gender, 'f'); assert.equal(g('ciudad').rule, 'ending_dad_tad_tud')
assert.equal(g('viaje').gender, 'm'); assert.equal(g('viaje').rule, 'ending_or_aje')
assert.equal(g('color').gender, 'm')
assert.equal(g('corazón').gender, 'm', '-zón exception inside the -ción rule')
assert.equal(g('camión').gender, 'm', 'MASC_MISC wins over -ión')

// exceptions beat endings
assert.equal(g('problema').gender, 'm'); assert.equal(g('problema').rule, 'greek_ma')
assert.equal(g('mano').gender, 'f'); assert.equal(g('día').gender, 'm')
assert.equal(g('flor').gender, 'f'); assert.equal(g('lápiz').gender, 'm')

// -o / -a are sure regardless of the German article (the bug that sent 600 to review)
assert.equal(g('minuto', 'die Minute').confidence, 'sure')
assert.equal(g('minuto', 'die Minute').gender, 'm')
assert.equal(g('equipo', 'die Mannschaft').gender, 'm')
assert.equal(g('casa', 'das Haus').gender, 'f')

// -l/-r: German agreement promotes, disagreement demotes
assert.equal(g('papel', 'das Papier').confidence, 'likely')
assert.equal(g('mujer', 'die Frau').confidence, 'unsure', 'la mujer must reach review')

// no signal → unsure, never a confident wrong answer
assert.equal(g('coche').confidence, 'unsure')
assert.equal(g('nombre', 'der Name').gender, 'm'); assert.equal(g('nombre', 'der Name').confidence, 'unsure')

// common gender excluded
assert.equal(g('estudiante').gender, 'mf'); assert.equal(g('artista').gender, 'mf')

// plurals
assert.equal(pluralize('casa'), 'casas'); assert.equal(pluralize('nación'), 'naciones')
assert.equal(pluralize('lápiz'), 'lápices'); assert.equal(pluralize('ciudad'), 'ciudades')
assert.equal(pluralize('lunes'), null, 'invariant'); assert.equal(pluralize('alemán'), null, 'accent shift — skip')

// item builder
const words: VocabWord[] = [
  { es: 'casa', de: 'das Haus', pos: 'n', rank: 1, gender: 'f' },
  { es: 'libro', de: 'das Buch', pos: 'n', rank: 2, gender: 'm' },
  { es: 'agua', de: 'das Wasser', pos: 'n', rank: 3, gender: 'f' },       // stressed-a → excluded
  { es: 'artista', de: 'der Künstler', pos: 'n', rank: 4, gender: 'mf' }, // common → excluded
  { es: 'correr', de: 'laufen', pos: 'v', rank: 5 },                       // not a noun
  { es: 'mesa', de: 'der Tisch', pos: 'n', rank: 6 },                      // no gender → excluded
]
const a1 = buildGenderItems(words, 'A1')
assert.deepEqual(a1.map((i) => i.id).sort(), ['gender:casa', 'gender:libro'])
assert.ok(a1.every((i) => i.options.length === 2), 'A1 = singular only')
assert.equal(a1.find((i) => i.id === 'gender:casa')!.correct, 1, 'la = index 1')
assert.equal(a1.find((i) => i.id === 'gender:libro')!.correct, 0, 'el = index 0')
assert.ok(a1.every((i) => i.prompt.startsWith('___ ')))
assert.ok(!a1.some((i) => STRESSED_A_FEMININES.has(i.prompt.slice(4))))

const a2 = buildGenderItems(words, 'A2')
assert.ok(a2.every((i) => i.options.length === 4), 'A2+ = four options')
for (const it of a2) {
  if (it.id.endsWith(':pl')) assert.ok(it.correct >= 2, 'plural items point at los/las')
  else assert.ok(it.correct <= 1, 'singular items point at el/la')
}

console.log('✓ gender OK')

// plural-form lemmas never get served (reviewer finding: `___ pantalones` would demand "el")
{
  const plurals: VocabWord[] = [
    { es: 'pantalones', de: 'die Hose', pos: 'n', rank: 1, gender: 'm' },
    { es: 'gafas', de: 'die Brille', pos: 'n', rank: 2, gender: 'f' },
    { es: 'lunes', de: 'der Montag', pos: 'n', rank: 3, gender: 'm' },   // invariant singular — allowed
    { es: 'crisis', de: 'die Krise', pos: 'n', rank: 4, gender: 'f' },  // invariant singular — allowed
  ]
  const ids = buildGenderItems(plurals, 'A1').map((i) => i.id)
  assert.ok(!ids.includes('gender:pantalones'), 'plural lemma excluded')
  assert.ok(!ids.includes('gender:gafas'), 'plural lemma excluded')
  assert.ok(ids.includes('gender:lunes'), 'invariant singular allowed')
  assert.ok(ids.includes('gender:crisis'), 'invariant singular allowed')
}
console.log('✓ plural-lemma guard OK')
