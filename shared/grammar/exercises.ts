import type { GrammarQuestion, MultipleChoiceQuestion, FillInBlankQuestion } from './exerciseTypes'
import { getBakedExercises } from '../content/grammar-exercises'

type ExercisePair = [MultipleChoiceQuestion, FillInBlankQuestion]

const exerciseMap: Record<string, ExercisePair> = {
  // Chapter 1: Alphabet, Pronunciation & Basic Phonetics
  a1_0: [
    {
      type: 'multiple_choice',
      prompt: 'Which letter is always silent in Spanish?',
      options: ['h', 'j', 'ñ', 'v'],
      correctAnswer: 'h',
      explanation: 'The letter "h" is always silent in Spanish. For example, "hola" is pronounced "ola".',
    },
    {
      type: 'fill_in_blank',
      sentenceWithBlank: 'The accent mark in "tú" distinguishes it from "tu". "Tú" means ___ and "tu" means "your".',
      correctAnswer: 'you',
      acceptableAnswers: ['you'],
      hint: 'It\'s a subject pronoun',
      explanation: 'Accent marks distinguish homophones: tú (you) vs. tu (your), él (he) vs. el (the).',
    },
  ],

  // Chapter 2: Nouns and Articles
  a1_1: [
    {
      type: 'multiple_choice',
      prompt: 'Which article correctly completes: "___ ciudad es bonita"?',
      options: ['La', 'El', 'Un', 'Los'],
      correctAnswer: 'La',
      explanation: '"Ciudad" ends in -dad, which makes it feminine. The feminine singular definite article is "la".',
    },
    {
      type: 'fill_in_blank',
      sentenceWithBlank: 'To form the plural of "ciudad", you add -es: ___',
      correctAnswer: 'ciudades',
      acceptableAnswers: ['ciudades'],
      hint: 'Nouns ending in a consonant add -es',
      explanation: 'Nouns ending in a consonant form their plural by adding -es: ciudad → ciudades.',
    },
  ],

  // Chapter 3: Personal Pronouns
  a1_2: [
    {
      type: 'multiple_choice',
      prompt: 'Which pronoun would you use to formally address a stranger?',
      options: ['usted', 'tú', 'vosotros', 'él'],
      correctAnswer: 'usted',
      explanation: '"Usted" is the formal "you", used with strangers, elders, and in professional contexts.',
    },
    {
      type: 'fill_in_blank',
      sentenceWithBlank: '¿Cómo ___ llamas? (informal "you")',
      correctAnswer: 'te',
      acceptableAnswers: ['te'],
      hint: 'Informal second person',
      explanation: '"¿Cómo te llamas?" uses "te" for informal address. The formal version would be "¿Cómo se llama usted?"',
    },
  ],

  // Chapter 4: Ser and Estar
  a1_3: [
    {
      type: 'multiple_choice',
      prompt: 'Which sentence correctly uses "estar"?',
      options: [
        'Estoy cansado.',
        'Estoy de México.',
        'Estoy médico.',
        'Estoy español.',
      ],
      correctAnswer: 'Estoy cansado.',
      explanation: '"Estar" is used for temporary states and feelings. "Estoy cansado" = "I am tired" (temporary state). Origin, profession, and nationality use "ser".',
    },
    {
      type: 'fill_in_blank',
      sentenceWithBlank: 'Ella ___ de Colombia. (origin — use ser)',
      correctAnswer: 'es',
      acceptableAnswers: ['es'],
      hint: 'Third person singular of "ser"',
      explanation: '"Ser" is used for origin and nationality. Ella es = She is (permanent/inherent characteristic).',
    },
  ],

  // Chapter 5: Regular and Irregular Verbs in the Present Tense
  a1_4: [
    {
      type: 'multiple_choice',
      prompt: 'What is the correct conjugation of "hablar" for "nosotros"?',
      options: ['hablamos', 'hablais', 'hablan', 'hablas'],
      correctAnswer: 'hablamos',
      explanation: 'Regular -AR verbs use the ending -amos for nosotros: habl- + -amos = hablamos.',
    },
    {
      type: 'fill_in_blank',
      sentenceWithBlank: 'Yo ___ al supermercado. (ir — present tense)',
      correctAnswer: 'voy',
      acceptableAnswers: ['voy'],
      hint: '"Ir" is completely irregular',
      explanation: '"Ir" (to go) is irregular: yo voy, tú vas, él va, nosotros vamos, ellos van.',
    },
  ],

  // Chapter 6: Reflexive Verbs
  a1_5: [
    {
      type: 'multiple_choice',
      prompt: 'Which reflexive pronoun completes: "Ella ___ ducha por la mañana"?',
      options: ['se', 'me', 'te', 'nos'],
      correctAnswer: 'se',
      explanation: 'The reflexive pronoun for él/ella/usted is "se". "Ella se ducha" = She showers (herself).',
    },
    {
      type: 'fill_in_blank',
      sentenceWithBlank: '___ levanto a las siete. (I get up)',
      correctAnswer: 'Me',
      acceptableAnswers: ['Me', 'me'],
      hint: 'First person singular reflexive pronoun',
      explanation: '"Me" is the reflexive pronoun for "yo". "Me levanto" = I get (myself) up.',
    },
  ],

  // Chapter 7: Key Grammatical Structures
  a1_6: [
    {
      type: 'multiple_choice',
      prompt: 'How do you say "I am going to study" using the near future?',
      options: [
        'Voy a estudiar.',
        'Estoy estudiando.',
        'Estudio.',
        'Estudié.',
      ],
      correctAnswer: 'Voy a estudiar.',
      explanation: 'The near future is formed with ir (conjugated) + a + infinitive: "Voy a estudiar."',
    },
    {
      type: 'fill_in_blank',
      sentenceWithBlank: '___ un restaurante en esta calle. (There is)',
      correctAnswer: 'Hay',
      acceptableAnswers: ['Hay', 'hay'],
      hint: 'Impersonal form meaning "there is/there are"',
      explanation: '"Hay" is the impersonal form of haber, used for both singular and plural: "Hay un restaurante" / "Hay tres estudiantes".',
    },
  ],

  // Chapter 8: Adjectives and Adverbs
  a1_7: [
    {
      type: 'multiple_choice',
      prompt: 'Which is the correct adjective agreement for "Las casas son ___"?',
      options: ['rojas', 'rojo', 'roja', 'rojos'],
      correctAnswer: 'rojas',
      explanation: 'Adjectives must agree in gender and number. "Casas" is feminine plural, so "rojo" becomes "rojas".',
    },
    {
      type: 'fill_in_blank',
      sentenceWithBlank: 'Es un ___ estudiante. (good — shortened form before masculine singular noun)',
      correctAnswer: 'buen',
      acceptableAnswers: ['buen'],
      hint: '"Bueno" shortens before masculine singular nouns',
      explanation: '"Bueno" shortens to "buen" before a masculine singular noun: "un buen estudiante".',
    },
  ],

  // Chapter 9: Question Formation and Negation
  a1_8: [
    {
      type: 'multiple_choice',
      prompt: 'Which question word means "How much?"',
      options: ['¿Cuánto?', '¿Cuándo?', '¿Cómo?', '¿Dónde?'],
      correctAnswer: '¿Cuánto?',
      explanation: '¿Cuánto? = How much?, ¿Cuándo? = When?, ¿Cómo? = How?, ¿Dónde? = Where?',
    },
    {
      type: 'fill_in_blank',
      sentenceWithBlank: 'No tengo ___. (nothing — double negative is correct in Spanish)',
      correctAnswer: 'nada',
      acceptableAnswers: ['nada'],
      hint: 'A negative word meaning "nothing"',
      explanation: 'Double negatives are grammatically correct in Spanish: "No tengo nada" = I have nothing.',
    },
  ],

  // Chapter 10: Prepositions, Numbers, and Time Expressions
  a1_9: [
    {
      type: 'multiple_choice',
      prompt: 'What is the contraction of "a + el"?',
      options: ['al', 'del', 'a el', 'a la'],
      correctAnswer: 'al',
      explanation: 'When "a" precedes the masculine singular article "el", they contract to "al": "Voy al mercado."',
    },
    {
      type: 'fill_in_blank',
      sentenceWithBlank: 'Son las tres y ___. (half past)',
      correctAnswer: 'media',
      acceptableAnswers: ['media'],
      hint: 'The word for "half" in telling time',
      explanation: '"Y media" means "half past" in telling time: "Son las tres y media" = It\'s half past three.',
    },
  ],
}

/**
 * Stable hash for deduping exercises across hand-curated + baked sources.
 * Uses prompt/sentence + correct answer as identity.
 */
function exerciseKey(ex: GrammarQuestion): string {
  switch (ex.type) {
    case 'multiple_choice':
      return `mc:${ex.prompt}::${ex.correctAnswer}`
    case 'fill_in_blank':
      return `fib:${ex.sentenceWithBlank}::${ex.correctAnswer}`
    case 'sentence_reorder':
      return `sr:${ex.correctSentence}`
    case 'error_correction':
      return `ec:${ex.sentenceWithError}::${ex.correctedWord}`
  }
}

/**
 * Returns the merged set of exercises for a chapter:
 *   hand-curated pairs (quality floor for A1) ∪ Gemini-baked exercises.
 * Returns null only when neither source has anything (truly missing chapter).
 */
export function getChapterExercises(level: string, chapterId: number): GrammarQuestion[] | null {
  const handCuratedKey = `${level.toLowerCase()}_${chapterId}`
  const handCurated: GrammarQuestion[] = exerciseMap[handCuratedKey] ?? []
  const baked: GrammarQuestion[] = getBakedExercises(level, chapterId) ?? []

  if (handCurated.length === 0 && baked.length === 0) return null

  const seen = new Set<string>()
  const merged: GrammarQuestion[] = []
  for (const ex of [...handCurated, ...baked]) {
    const k = exerciseKey(ex)
    if (seen.has(k)) continue
    seen.add(k)
    merged.push(ex)
  }
  return merged
}
