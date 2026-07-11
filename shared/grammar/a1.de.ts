import { GrammarLevel } from './types'

// ponytail: mock/partial German A1 — only Chapter 1 is authored, to prove the
// locale switch (getGrammarLevel('a1','de') → this) and the fallback (A2+ and
// later A1 chapters resolve to the English base). Fill in remaining chapters as
// real German content is authored. Example `en` fields hold the German gloss —
// the Block renderer shows that field as the secondary line (see index.ts note).
export const grammarA1De: GrammarLevel = {
  level: 'A1',
  title: 'Spanische Grammatik für Anfänger',
  chapters: [
    {
      id: 0,
      title: 'Alphabet, Aussprache & grundlegende Phonetik',
      sections: [
        {
          id: '1.1',
          title: 'Das spanische Alphabet',
          blocks: [
            {
              type: 'text',
              content:
                'Das spanische Alphabet hat 27 Buchstaben. Wichtige Unterschiede zum Deutschen: der Buchstabe „ñ" sowie Buchstaben wie „h" (immer stumm), „v"/„b" (gleicher Laut) und „c"/„z"/„s" (regional unterschiedliche Aussprache).',
            },
            {
              type: 'rules',
              items: [
                '„h" ist immer stumm: „hola" wird „ola" ausgesprochen',
                '„ll" und „y" klingen ähnlich (wie das deutsche „j" in „ja")',
                '„j" und „g" (vor e/i) klingen wie ein hartes „ch" in „Bach"',
                'Die Betonung liegt standardmäßig auf der vorletzten Silbe; Akzente heben das auf',
              ],
            },
            {
              type: 'examples',
              examples: [
                { es: 'Hola, me llamo Ana.', en: 'Hallo, ich heiße Ana.' },
                { es: 'La jirafa es un animal.', en: 'Die Giraffe ist ein Tier.' },
              ],
            },
          ],
        },
        {
          id: '1.2',
          title: 'Betonung und geschriebene Akzente',
          blocks: [
            {
              type: 'text',
              content:
                'Geschriebene Akzente (tildes) markieren die Betonung und unterscheiden gleich klingende Wörter.',
            },
            {
              type: 'rules',
              items: [
                'Wörter, die auf einen Vokal, -n oder -s enden, werden auf der vorletzten Silbe betont',
                'Akzente auf Frage-/Ausrufewörtern: qué, cómo, dónde, cuándo, quién, cuánto',
                'Akzente unterscheiden: tú (du) vs. tu (dein), él (er) vs. el (der), sí (ja) vs. si (wenn)',
              ],
            },
            {
              type: 'examples',
              examples: [
                { es: '¿Cómo te llamas?', en: 'Wie heißt du?' },
                { es: 'Él tiene tu libro.', en: 'Er hat dein Buch.' },
              ],
            },
          ],
        },
      ],
    },
  ],
}
