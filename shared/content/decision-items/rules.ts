import type { CEFR } from '../../games/types'

// Rule taxonomy for the three sentence-decision games, plus the German
// one-liner and grammar-chapter pointer shown after a wrong answer. The item
// banks tag every item with one of these; bank.check.ts rejects anything else.
//
// Terminology follows scripts/grammar-de-glossary.md: Spanish tense names as
// the head noun, glossed once, "du" register.

export interface RuleRef {
  /** One sentence, du-register. Shown under the item's own explanation. */
  rule: string
  /** Where "Mehr dazu →" goes: /grammar/{level}/{chapterId} */
  level: CEFR
  chapterId: number
}

export const RULE_TAGS = {
  ser_estar: [
    // → ser
    'identity_profession',
    'origin_nationality',
    'inherent_characteristic',
    'time_date',
    'possession_material',
    'event_location',
    // → estar
    'location',
    'temporary_state_emotion',
    'result_of_change',
    'progressive',
    // contrast (B1)
    'meaning_change_adjective',
    'passive_vs_resulting_state',
  ],
  pasado: [
    // → indefinido
    'completed_action',
    'sequence_of_events',
    'interrupting_action',
    // → imperfecto
    'habitual_past',
    'background_description',
    'ongoing_interrupted',
    'age_time_weather',
    // → pretérito perfecto (Mexican norm: open/experiential only)
    'life_experience',
    'still_open_result',
    // either, by meaning
    'meaning_change_verb',
  ],
  subjuntivo: [
    // → subjuntivo
    'wish_will',
    'emotion',
    'impersonal_expression',
    'recommendation_request',
    'doubt_denial',
    'ojala',
    'purpose_clause',
    'temporal_future',
    'indefinite_antecedent',
    'concession_unknown',
    // → indicativo
    'certainty_indicative',
    'reported_fact',
    'temporal_habitual',
    'definite_antecedent',
  ],
} as const

export type DecisionRuleTag = (typeof RULE_TAGS)[keyof typeof RULE_TAGS][number]

// Chapter anchors (0-based ids in shared/grammar/{level}.ts):
//   A1 ch3  Ser/Estar basics          B1 ch7  Ser vs. Estar advanced
//   A2 ch0  Indefinido  · ch1 Imperfecto · ch6 Pretérito Perfecto
//   B1 ch0  Indefinido vs. Imperfecto · ch5 Subjuntivo Presente · ch6 Subj. Imperfecto
//   B2 ch1  Subjuntivo all tenses      · ch5 Subj. in subordinate clauses
export const RULES_DE: Record<DecisionRuleTag, RuleRef> = {
  // ── ser / estar ────────────────────────────────────────────────────────
  identity_profession: { rule: 'Identität und Beruf sind Wesen, nicht Zustand — also ser.', level: 'A1', chapterId: 3 },
  origin_nationality: { rule: 'Herkunft und Nationalität stehen mit ser.', level: 'A1', chapterId: 3 },
  inherent_characteristic: { rule: 'Dauerhafte Eigenschaften (Aussehen, Charakter) nehmen ser.', level: 'A1', chapterId: 3 },
  time_date: { rule: 'Uhrzeit, Datum und Wochentag stehen mit ser.', level: 'A1', chapterId: 3 },
  possession_material: { rule: 'Besitz und Material drückst du mit ser aus.', level: 'A1', chapterId: 3 },
  event_location: { rule: 'Wo ein Ereignis stattfindet, steht mit ser — wo sich etwas befindet, mit estar.', level: 'B1', chapterId: 7 },
  location: { rule: 'Der Ort von Personen und Dingen steht mit estar.', level: 'A1', chapterId: 3 },
  temporary_state_emotion: { rule: 'Vorübergehende Zustände und Gefühle nehmen estar.', level: 'A1', chapterId: 3 },
  result_of_change: { rule: 'Das Ergebnis einer Veränderung (abierto, roto, cansado) steht mit estar.', level: 'B1', chapterId: 7 },
  progressive: { rule: 'Die Verlaufsform estar + Gerundio beschreibt, was gerade passiert.', level: 'A1', chapterId: 3 },
  meaning_change_adjective: { rule: 'Manche Adjektive ändern die Bedeutung: ser listo (klug) vs. estar listo (bereit).', level: 'B1', chapterId: 7 },
  passive_vs_resulting_state: { rule: 'ser + Participio ist der Vorgang, estar + Participio der Zustand danach.', level: 'B1', chapterId: 7 },

  // ── pasado ─────────────────────────────────────────────────────────────
  completed_action: { rule: 'Eine abgeschlossene Handlung zu einem bestimmten Zeitpunkt steht im Indefinido.', level: 'A2', chapterId: 0 },
  sequence_of_events: { rule: 'Aufeinanderfolgende Ereignisse einer Erzählung stehen im Indefinido.', level: 'B1', chapterId: 0 },
  interrupting_action: { rule: 'Die Handlung, die etwas unterbricht, steht im Indefinido — der Hintergrund im Imperfecto.', level: 'B1', chapterId: 0 },
  habitual_past: { rule: 'Gewohnheiten und Wiederholtes in der Vergangenheit stehen im Imperfecto.', level: 'A2', chapterId: 1 },
  background_description: { rule: 'Beschreibungen von Personen, Orten und Stimmung stehen im Imperfecto.', level: 'A2', chapterId: 1 },
  ongoing_interrupted: { rule: 'Was gerade im Gange war, als etwas passierte, steht im Imperfecto.', level: 'B1', chapterId: 0 },
  age_time_weather: { rule: 'Alter, Uhrzeit und Wetter in der Vergangenheit stehen im Imperfecto.', level: 'A2', chapterId: 1 },
  life_experience: { rule: 'Erfahrungen bis heute (alguna vez, nunca, todavía no) stehen im Pretérito Perfecto.', level: 'A2', chapterId: 6 },
  still_open_result: { rule: 'Ein Ergebnis, das jetzt noch gilt (ya, últimamente), steht im Pretérito Perfecto — in Mexiko sonst fast immer Indefinido.', level: 'A2', chapterId: 6 },
  meaning_change_verb: { rule: 'Saber, conocer, querer, poder ändern im Indefinido die Bedeutung: supe = ich erfuhr, sabía = ich wusste.', level: 'B1', chapterId: 0 },

  // ── subjuntivo ─────────────────────────────────────────────────────────
  wish_will: { rule: 'Nach Wunsch und Wille (querer que, esperar que) steht der Subjuntivo.', level: 'B1', chapterId: 5 },
  emotion: { rule: 'Nach Gefühlsausdrücken (me alegra que, es una pena que) steht der Subjuntivo.', level: 'B1', chapterId: 5 },
  impersonal_expression: { rule: 'Nach unpersönlichen Wertungen (es importante que, es mejor que) steht der Subjuntivo.', level: 'B1', chapterId: 5 },
  recommendation_request: { rule: 'Nach Rat und Bitte (te recomiendo que, pido que) steht der Subjuntivo.', level: 'B1', chapterId: 5 },
  doubt_denial: { rule: 'Nach Zweifel und Verneinung (no creo que, dudo que) steht der Subjuntivo.', level: 'B1', chapterId: 5 },
  ojala: { rule: 'Nach ojalá steht immer der Subjuntivo.', level: 'B1', chapterId: 5 },
  purpose_clause: { rule: 'Nach para que und a fin de que steht der Subjuntivo.', level: 'B2', chapterId: 5 },
  temporal_future: { rule: 'Zeitliche Nebensätze, die in die Zukunft weisen (cuando, en cuanto, hasta que), nehmen den Subjuntivo.', level: 'B2', chapterId: 5 },
  indefinite_antecedent: { rule: 'Ein unbestimmtes oder gesuchtes Bezugswort (busco alguien que…) verlangt den Subjuntivo.', level: 'B2', chapterId: 5 },
  concession_unknown: { rule: 'Aunque mit Subjuntivo: die Einräumung ist unsicher oder hypothetisch.', level: 'B2', chapterId: 5 },
  certainty_indicative: { rule: 'Nach Gewissheit (creo que, es verdad que, está claro que) steht der Indikativ.', level: 'B1', chapterId: 5 },
  reported_fact: { rule: 'Berichtete Tatsachen (dice que, sé que) stehen im Indikativ.', level: 'B1', chapterId: 5 },
  temporal_habitual: { rule: 'Zeitliche Nebensätze über Gewohnheit oder Vergangenheit (cuando + Gewohnheit) stehen im Indikativ.', level: 'B2', chapterId: 5 },
  definite_antecedent: { rule: 'Ein bekanntes, konkretes Bezugswort (conozco a alguien que…) nimmt den Indikativ.', level: 'B2', chapterId: 5 },
}
