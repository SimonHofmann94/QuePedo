import type { VocabWord } from '../content/vocab/types'
import type { DecisionItem } from './decisionItems'
import type { CEFR } from './types'

// Spanish noun gender — ONE source of truth for two consumers:
//   • scripts/backfill-gender.mjs derives the `gender` field for ~4,300 curated
//     nouns that never had one (63 of 4,354 did).
//   • ¿El o La? builds its items from that field, and uses the same rule tag
//     to explain a wrong answer.
//
// ponytail: ending heuristics + exception lists, ~95 % hit rate. The backfill
// writes `unsure` rows to a review file instead of guessing; rows that stay
// unsure after review get no gender and are simply never served.
// Upgrade path if the residue grows: a Wiktionary dump lookup.

export type Gender = 'm' | 'f' | 'mf'
export type GenderConfidence = 'sure' | 'likely' | 'unsure'

export type GenderRuleTag =
  | 'exception'
  | 'greek_ma'
  | 'ending_cion_sion'
  | 'ending_dad_tad_tud'
  | 'ending_umbre_ie_eza'
  | 'ending_or_aje'
  | 'ending_an_in_on'
  | 'ending_o'
  | 'ending_a'
  | 'ending_l_r'
  | 'german_article'
  | 'agent_noun'
  | 'unknown'

export interface GenderGuess {
  gender: Gender | null
  rule: GenderRuleTag
  confidence: GenderConfidence
}

// ── Exception lists ──────────────────────────────────────────────────────

/** Masculine despite -a (Greek -ma and friends). */
const GREEK_MA = new Set([
  'problema', 'tema', 'sistema', 'programa', 'clima', 'idioma', 'drama', 'poema', 'dilema',
  'esquema', 'síntoma', 'fantasma', 'diploma', 'enigma', 'emblema', 'aroma', 'panorama',
  'trauma', 'teorema', 'diagrama', 'lema', 'telegrama', 'crucigrama', 'dogma', 'axioma',
  'carisma', 'cisma', 'coma', 'genoma', 'holograma', 'magma', 'plasma', 'prisma', 'reuma',
  'sofá', 'día', 'mapa', 'planeta', 'tranvía', 'cometa', 'gorila', 'pijama', 'yoga', 'bambú',
])

/** Feminine despite -o. */
const FEM_O = new Set(['mano', 'foto', 'moto', 'radio', 'libido', 'disco'])

/** Feminine nouns ending in a consonant that the -l/-r/-n rules would call masculine. */
const FEM_CONSONANT = new Set([
  'flor', 'labor', 'sal', 'piel', 'cárcel', 'miel', 'señal', 'sed', 'red', 'pared', 'salud',
  'virtud', 'juventud', 'edad', 'verdad', 'merced', 'vid', 'col', 'cal', 'hiel', 'luz', 'paz',
  'voz', 'nariz', 'cruz', 'raíz', 'vez', 'tez', 'perdiz', 'lombriz', 'cicatriz', 'nuez',
  'imagen', 'orden', 'razón', 'sazón', 'sartén', 'crin', 'sien', 'tos', 'res', 'mies',
])

/** Masculine -z / -s nouns (the defaults lean feminine for -z). */
const MASC_Z_S = new Set([
  'pez', 'lápiz', 'arroz', 'maíz', 'ajedrez', 'disfraz', 'matiz', 'tapiz', 'barniz', 'antifaz',
  'análisis', 'énfasis', 'paréntesis', 'oasis', 'autobús', 'mes', 'país', 'interés', 'revés',
  'compás', 'gas', 'lunes', 'martes', 'miércoles', 'jueves', 'viernes', 'adiós', 'cumpleaños',
  'paraguas', 'sacacorchos', 'virus', 'campus', 'bonus',
])

/** Masculine despite -ción/-sión-like or -dad-like surface. */
const MASC_MISC = new Set(['camión', 'avión', 'corazón', 'bastión', 'guión', 'sermón', 'champión'])

/**
 * Feminine nouns that take `el` in the singular (stressed initial a-/ha-).
 * Correct answer is "el" but the gender is f — a trick question for a
 * reflex game, so ¿El o La? never serves them.
 */
export const STRESSED_A_FEMININES: ReadonlySet<string> = new Set([
  'agua', 'águila', 'alma', 'ala', 'área', 'arma', 'aula', 'hacha', 'hambre', 'asma', 'ancla',
  'arca', 'arpa', 'asa', 'ave', 'haba', 'hada', 'habla', 'acta', 'alga', 'ansia', 'aya',
])

/** Same form for both genders — the article depends on the referent. Excluded from the game. */
const COMMON_GENDER = new Set([
  'estudiante', 'joven', 'turista', 'periodista', 'artista', 'cantante', 'deportista',
  'dentista', 'taxista', 'policía', 'guía', 'testigo', 'modelo', 'soldado', 'atleta',
  'paciente', 'cliente', 'agente', 'gerente', 'presidente', 'representante', 'adolescente',
  'inmigrante', 'amante', 'colega', 'espía', 'víctima', 'persona', 'bebé',
])

// ── Heuristic ────────────────────────────────────────────────────────────

function stripArticle(es: string): string {
  return es.trim().toLowerCase().replace(/^(el|la|los|las|un|una|unos|unas)\s+/, '')
}

function germanArticle(de?: string | string[]): Gender | null {
  const first = Array.isArray(de) ? de[0] : de
  if (!first) return null
  const m = /^(der|die|das)\s/i.exec(first.trim())
  if (!m) return null
  const art = m[1].toLowerCase()
  return art === 'der' ? 'm' : art === 'die' ? 'f' : null // das tells us nothing about Spanish
}

/**
 * Derive gender from the Spanish lemma, with the German translation's article
 * as a tiebreaker. German article ≠ Spanish gender in general (die Sonne /
 * el sol), so it only ever adjusts CONFIDENCE on the ambiguous endings —
 * it never overrides a sure ending rule.
 */
export function deriveGender(es: string, de?: string | string[]): GenderGuess {
  const w = stripArticle(es)
  if (!w || /\s/.test(w)) return { gender: null, rule: 'unknown', confidence: 'unsure' }

  // Explicit lists first — they exist precisely because the endings lie.
  if (COMMON_GENDER.has(w)) return { gender: 'mf', rule: 'agent_noun', confidence: 'sure' }
  // -ista is reliably common-gender (el/la artista). -ante/-ente is NOT
  // (la gente, el puente) — only the listed ones count.
  if (/ista$/.test(w)) return { gender: 'mf', rule: 'agent_noun', confidence: 'likely' }
  if (GREEK_MA.has(w)) return { gender: 'm', rule: 'greek_ma', confidence: 'sure' }
  if (FEM_O.has(w)) return { gender: 'f', rule: 'exception', confidence: 'sure' }
  if (FEM_CONSONANT.has(w)) return { gender: 'f', rule: 'exception', confidence: 'sure' }
  if (MASC_Z_S.has(w)) return { gender: 'm', rule: 'exception', confidence: 'sure' }
  if (MASC_MISC.has(w)) return { gender: 'm', rule: 'exception', confidence: 'sure' }

  // Sure endings.
  if (/(ción|sión|xión|zón)$/.test(w) && !/^(corazón|buzón|tazón|pezón)$/.test(w)) {
    return { gender: 'f', rule: 'ending_cion_sion', confidence: 'sure' }
  }
  if (/(dad|tad|tud)$/.test(w)) return { gender: 'f', rule: 'ending_dad_tad_tud', confidence: 'sure' }
  if (/(umbre|ie|eza|anza|ncia)$/.test(w)) return { gender: 'f', rule: 'ending_umbre_ie_eza', confidence: 'sure' }
  if (/(aje|or)$/.test(w)) return { gender: 'm', rule: 'ending_or_aje', confidence: 'sure' }
  if (/(án|ín|ón)$/.test(w)) return { gender: 'm', rule: 'ending_an_in_on', confidence: 'sure' }

  // -o / -a are ~99 % reliable ON THEIR OWN. German gender is unrelated to
  // Spanish gender (el minuto / die Minute, el equipo / die Mannschaft), so
  // the German article must never demote these — an earlier version did,
  // and sent 600 correct answers to review. The exceptions that break -o/-a
  // are enumerated above, not inferred.
  const deGender = germanArticle(de)
  if (/o$/.test(w)) return { gender: 'm', rule: 'ending_o', confidence: 'sure' }
  if (/a$/.test(w)) return { gender: 'f', rule: 'ending_a', confidence: 'sure' }

  // -l / -r lean masculine but with real feminine traffic (la cárcel, la flor
  // are listed; others aren't). Agreement with German promotes, disagreement
  // is a genuine review signal here.
  if (/[lr]$/.test(w)) {
    if (deGender === 'm') return { gender: 'm', rule: 'ending_l_r', confidence: 'sure' }
    if (deGender === 'f') return { gender: 'm', rule: 'ending_l_r', confidence: 'unsure' }
    return { gender: 'm', rule: 'ending_l_r', confidence: 'likely' }
  }

  // -e and the rest carry no usable ending signal. The German article is a
  // coin-flip-plus here (der Name / el nombre, but die Leute / la gente is
  // luck) — take it as a guess and send to review.
  if (deGender) return { gender: deGender, rule: 'german_article', confidence: 'unsure' }
  return { gender: null, rule: 'unknown', confidence: 'unsure' }
}

// ── Plural ───────────────────────────────────────────────────────────────

/**
 * Regular plural only. Returns null for anything irregular (stress shifts,
 * invariants like `lunes`) — those nouns simply aren't offered as plurals.
 */
export function pluralize(es: string): string | null {
  const w = stripArticle(es)
  if (!w || /\s/.test(w)) return null
  if (/(s|x)$/.test(w) && !/[áéíóú]s$/.test(w)) return null // lunes, tórax — invariant or irregular
  if (/z$/.test(w)) return w.slice(0, -1) + 'ces'
  if (/ión$/.test(w)) return w.slice(0, -3) + 'iones'
  if (/[áéíóú]n$/.test(w)) return null // alemán → alemanes (accent drops) — skip
  if (/[aeiouáéíóú]$/.test(w)) return /[íú]$/.test(w) ? null : w + 's'
  return w + 'es'
}

// ── Item builder ─────────────────────────────────────────────────────────

const GENDER_RULE_LABEL: Record<GenderRuleTag, string> = {
  exception: 'Ausnahme — das muss man sich merken.',
  greek_ma: 'Griechische Wörter auf -ma sind maskulin (el problema, el tema).',
  ending_cion_sion: 'Substantive auf -ción/-sión sind feminin.',
  ending_dad_tad_tud: 'Substantive auf -dad/-tad/-tud sind feminin.',
  ending_umbre_ie_eza: 'Substantive auf -umbre/-ie/-eza/-anza sind feminin.',
  ending_or_aje: 'Substantive auf -or/-aje sind meist maskulin.',
  ending_an_in_on: 'Substantive auf -án/-ín/-ón sind maskulin.',
  ending_o: 'Substantive auf -o sind meist maskulin.',
  ending_a: 'Substantive auf -a sind meist feminin.',
  ending_l_r: 'Substantive auf -l/-r sind meist maskulin.',
  german_article: 'Kein Endungsmuster — hier hilft nur Merken.',
  agent_noun: 'Gleiche Form für beide Genera; der Artikel richtet sich nach der Person.',
  unknown: 'Kein Endungsmuster — hier hilft nur Merken.',
}

/**
 * ¿El o La? items from curated nouns that carry a gender.
 * A1: singular only, `el · la`. A2+: `el · la · los · las`, ~30 % plural.
 * Never serves `mf` nouns or the stressed-a feminines.
 */
export function buildGenderItems(words: VocabWord[], level: CEFR): DecisionItem[] {
  const withPlural = level !== 'A1'
  const options = withPlural ? ['el', 'la', 'los', 'las'] : ['el', 'la']
  const out: DecisionItem[] = []

  for (const w of words) {
    if (w.pos !== 'n' || !w.gender || w.gender === 'mf') continue
    const lemma = stripArticle(w.es)
    if (!lemma || /\s/.test(lemma) || STRESSED_A_FEMININES.has(lemma)) continue
    // Plural-form lemmas (pantalones, gafas, bienes): the singular article would
    // be a wrong question. Only names that can't also be singular are skipped —
    // `lunes`/`crisis` are invariant singulars and pluralize() handles those.
    if (/[^aeiouáéíóú]es$|[aeiou]s$/.test(lemma) && !/^(lunes|martes|miércoles|jueves|viernes|crisis|análisis|tesis|dosis|virus|campus)$/.test(lemma)) continue

    const { rule } = deriveGender(w.es, w.de)
    const explanation = GENDER_RULE_LABEL[rule]
    const g = w.gender

    // Deterministic per word so a session is reproducible for the same pool:
    // plural when the lemma's char-code sum lands in the bottom ~30 %.
    const hash = Array.from(lemma).reduce((h, c) => (h * 31 + c.charCodeAt(0)) >>> 0, 7)
    const usePlural = withPlural && hash % 10 < 3
    const plural = usePlural ? pluralize(lemma) : null

    if (plural) {
      out.push({
        id: `gender:${lemma}:pl`,
        prompt: `___ ${plural}`,
        options,
        correct: g === 'm' ? 2 : 3,
        ruleTag: rule,
        level,
        explanation_de: `${explanation} Plural: ${g === 'm' ? 'los' : 'las'}.`,
      })
    } else {
      out.push({
        id: `gender:${lemma}`,
        prompt: `___ ${lemma}`,
        options,
        correct: g === 'm' ? 0 : 1,
        ruleTag: rule,
        level,
        explanation_de: explanation,
      })
    }
  }
  return out
}
