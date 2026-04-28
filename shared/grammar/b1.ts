import { GrammarLevel } from './types'

export const grammarB1: GrammarLevel = {
  level: 'B1',
  title: 'Intermediate Spanish Grammar',
  chapters: [
    {
      id: 0,
      title: 'Preterite vs. Imperfect — Advanced Contrast',
      sections: [
        {
          id: '1.1',
          title: 'Review: Core Difference',
          blocks: [
            {
              type: 'text',
              content: 'The preterite describes completed actions at a specific point in time. The imperfect describes ongoing, habitual, or background actions in the past with no defined endpoint.',
            },
            {
              type: 'rules',
              items: [
                'Preterite = a snapshot: what happened (completed event)',
                'Imperfect = a video: what was happening (ongoing or repeated)',
                'In narration, preterite advances the story; imperfect sets the scene',
              ],
            },
            {
              type: 'examples',
              examples: [
                { es: 'Ayer comí en un restaurante.', en: 'Yesterday I ate at a restaurant. (completed)' },
                { es: 'De niño, comía en ese restaurante todos los viernes.', en: 'As a child, I used to eat at that restaurant every Friday. (habitual)' },
              ],
            },
          ],
        },
        {
          id: '1.2',
          title: 'Narration vs. Description',
          blocks: [
            {
              type: 'text',
              content: 'When telling a story, the imperfect provides background (weather, time, emotions, descriptions), and the preterite reports the events that happen against that background.',
            },
            {
              type: 'rules',
              items: [
                'Background/scene-setting = imperfect: time, weather, age, feelings, appearance, ongoing states',
                'Foreground events = preterite: specific actions that move the plot forward',
                'An ongoing action (imperfect) is often interrupted by a sudden event (preterite)',
              ],
            },
            {
              type: 'examples',
              examples: [
                { es: 'Llovía mucho cuando salí de casa.', en: 'It was raining a lot when I left the house.' },
                { es: 'Eran las diez de la noche. Todo estaba oscuro. De repente, sonó el teléfono.', en: 'It was ten at night. Everything was dark. Suddenly, the phone rang.' },
                { es: 'Mientras caminaba por la calle, vi a mi profesor.', en: 'While I was walking down the street, I saw my teacher.' },
              ],
            },
          ],
        },
        {
          id: '1.3',
          title: 'Verbs That Change Meaning',
          blocks: [
            {
              type: 'text',
              content: 'Some verbs take on different meanings depending on whether they are used in the preterite or the imperfect.',
            },
            {
              type: 'table',
              headers: ['Verb', 'Imperfect Meaning', 'Preterite Meaning'],
              rows: [
                ['conocer', 'knew / was acquainted with', 'met (for the first time)'],
                ['saber', 'knew (information)', 'found out / learned'],
                ['querer', 'wanted', 'tried to'],
                ['no querer', 'didn\'t want', 'refused'],
                ['poder', 'was able to / could', 'managed to / succeeded'],
                ['no poder', 'wasn\'t able to', 'failed to / couldn\'t (tried)'],
                ['tener', 'had / possessed', 'got / received'],
                ['haber (había)', 'there was/were (description)', '— (rarely used in preterite for "there was")'],
              ],
            },
            {
              type: 'examples',
              examples: [
                { es: 'Conocía a María desde 2010.', en: 'I knew Maria since 2010. (ongoing acquaintance)' },
                { es: 'Conocí a María en una fiesta.', en: 'I met Maria at a party. (first meeting)' },
                { es: 'No quería ir a la fiesta.', en: 'I didn\'t want to go to the party. (feeling)' },
                { es: 'No quise ir a la fiesta.', en: 'I refused to go to the party. (action)' },
                { es: 'Sabía la respuesta.', en: 'I knew the answer. (state)' },
                { es: 'Supe la respuesta cuando me lo explicaron.', en: 'I found out the answer when they explained it to me. (discovery)' },
              ],
            },
          ],
        },
        {
          id: '1.4',
          title: 'Time Markers',
          blocks: [
            {
              type: 'table',
              headers: ['Preterite Markers', 'Imperfect Markers'],
              rows: [
                ['ayer (yesterday)', 'siempre (always)'],
                ['anoche (last night)', 'a menudo (often)'],
                ['el lunes pasado (last Monday)', 'todos los días (every day)'],
                ['una vez (once)', 'de niño/a (as a child)'],
                ['de repente (suddenly)', 'mientras (while)'],
                ['en ese momento (at that moment)', 'generalmente (generally)'],
                ['hace dos años (two years ago)', 'cada verano (every summer)'],
              ],
            },
          ],
        },
      ],
    },
    {
      id: 1,
      title: 'Perfect Tenses',
      sections: [
        {
          id: '2.1',
          title: 'Pretérito Perfecto (Present Perfect)',
          blocks: [
            {
              type: 'text',
              content: 'The present perfect describes actions that have occurred in a time frame connected to the present, or life experiences up to now. It is formed with the present tense of "haber" + past participle.',
            },
            {
              type: 'text',
              content: 'Conjugation of haber (present):',
            },
            {
              type: 'table',
              headers: ['Person', 'Haber'],
              rows: [
                ['yo', 'he'],
                ['tú', 'has'],
                ['él/ella/usted', 'ha'],
                ['nosotros/as', 'hemos'],
                ['vosotros/as', 'habéis'],
                ['ellos/ellas/ustedes', 'han'],
              ],
            },
            {
              type: 'text',
              content: 'Regular past participles: -ar verbs: -ado (hablar → hablado), -er verbs: -ido (comer → comido), -ir verbs: -ido (vivir → vivido)',
            },
            {
              type: 'text',
              content: 'Irregular past participles:',
            },
            {
              type: 'table',
              headers: ['Infinitive', 'Past Participle'],
              rows: [
                ['abrir', 'abierto'],
                ['decir', 'dicho'],
                ['escribir', 'escrito'],
                ['hacer', 'hecho'],
                ['morir', 'muerto'],
                ['poner', 'puesto'],
                ['resolver', 'resuelto'],
                ['romper', 'roto'],
                ['ver', 'visto'],
                ['volver', 'vuelto'],
              ],
            },
            {
              type: 'rules',
              items: [
                '"Haber" and the participle are never separated: "He comido" (never "He ya comido")',
                'The past participle does not change for gender or number: "Ella ha comido", "Ellos han comido"',
                'Object pronouns go before "haber": "Lo he visto" (I have seen it)',
              ],
            },
            {
              type: 'examples',
              examples: [
                { es: 'Hoy he estudiado mucho.', en: 'Today I have studied a lot.' },
                { es: '¿Has estado alguna vez en México?', en: 'Have you ever been to Mexico?' },
                { es: 'Nunca he visto esa película.', en: 'I have never seen that movie.' },
                { es: 'Este año hemos viajado a tres países.', en: 'This year we have traveled to three countries.' },
              ],
            },
          ],
        },
        {
          id: '2.2',
          title: 'Pretérito Pluscuamperfecto (Past Perfect / Pluperfect)',
          blocks: [
            {
              type: 'text',
              content: 'The pluperfect describes an action that occurred before another past action. It is formed with the imperfect of "haber" + past participle.',
            },
            {
              type: 'text',
              content: 'Conjugation of haber (imperfect):',
            },
            {
              type: 'table',
              headers: ['Person', 'Haber'],
              rows: [
                ['yo', 'había'],
                ['tú', 'habías'],
                ['él/ella/usted', 'había'],
                ['nosotros/as', 'habíamos'],
                ['vosotros/as', 'habíais'],
                ['ellos/ellas/ustedes', 'habían'],
              ],
            },
            {
              type: 'rules',
              items: [
                'Use the pluperfect for the "earlier" of two past events',
                'Often used with "ya" (already), "todavía no" (not yet), "nunca" (never), "cuando" (when)',
                'The past participle rules are the same as in the present perfect',
              ],
            },
            {
              type: 'examples',
              examples: [
                { es: 'Cuando llegué, ella ya había salido.', en: 'When I arrived, she had already left.' },
                { es: 'No habíamos comido antes de ir al cine.', en: 'We hadn\'t eaten before going to the cinema.' },
                { es: 'Nunca había visto algo así.', en: 'I had never seen anything like that.' },
                { es: 'Dijo que había terminado el trabajo.', en: 'He said he had finished the work.' },
              ],
            },
          ],
        },
        {
          id: '2.3',
          title: 'Using Perfect Tenses Together',
          blocks: [
            {
              type: 'examples',
              examples: [
                { es: 'He visitado muchos países, pero nunca había estado en Japón hasta este año.', en: 'I have visited many countries, but I had never been to Japan until this year.' },
                { es: 'Ya habían cerrado la tienda cuando llegamos.', en: 'They had already closed the store when we arrived.' },
              ],
            },
          ],
        },
      ],
    },
    {
      id: 2,
      title: 'Future Tense',
      sections: [
        {
          id: '3.1',
          title: 'Formation of the Simple Future (Futuro Simple)',
          blocks: [
            {
              type: 'text',
              content: 'The future tense is formed by adding endings directly to the infinitive. The same endings apply to -ar, -er, and -ir verbs.',
            },
            {
              type: 'text',
              content: 'Regular future endings:',
            },
            {
              type: 'table',
              headers: ['Person', 'Ending', 'hablar', 'comer', 'vivir'],
              rows: [
                ['yo', '-é', 'hablaré', 'comeré', 'viviré'],
                ['tú', '-ás', 'hablarás', 'comerás', 'vivirás'],
                ['él/ella/usted', '-á', 'hablará', 'comerá', 'vivirá'],
                ['nosotros/as', '-emos', 'hablaremos', 'comeremos', 'viviremos'],
                ['vosotros/as', '-éis', 'hablaréis', 'comeréis', 'viviréis'],
                ['ellos/ellas/ustedes', '-án', 'hablarán', 'comerán', 'vivirán'],
              ],
            },
          ],
        },
        {
          id: '3.2',
          title: 'Irregular Future Stems',
          blocks: [
            {
              type: 'text',
              content: 'Twelve common verbs have irregular stems but use the same endings as regular verbs.',
            },
            {
              type: 'text',
              content: 'Drop the -e from the infinitive:',
            },
            {
              type: 'table',
              headers: ['Infinitive', 'Stem', 'Example (yo)'],
              rows: [
                ['caber', 'cabr-', 'cabré'],
                ['haber', 'habr-', 'habrá'],
                ['poder', 'podr-', 'podré'],
                ['querer', 'querr-', 'querré'],
                ['saber', 'sabr-', 'sabré'],
              ],
            },
            {
              type: 'text',
              content: 'Replace the vowel with -d-:',
            },
            {
              type: 'table',
              headers: ['Infinitive', 'Stem', 'Example (yo)'],
              rows: [
                ['poner', 'pondr-', 'pondré'],
                ['salir', 'saldr-', 'saldré'],
                ['tener', 'tendr-', 'tendré'],
                ['valer', 'valdr-', 'valdré'],
                ['venir', 'vendr-', 'vendré'],
              ],
            },
            {
              type: 'text',
              content: 'Unique irregular stems:',
            },
            {
              type: 'table',
              headers: ['Infinitive', 'Stem', 'Example (yo)'],
              rows: [
                ['decir', 'dir-', 'diré'],
                ['hacer', 'har-', 'haré'],
              ],
            },
          ],
        },
        {
          id: '3.3',
          title: 'Uses of the Future Tense',
          blocks: [
            {
              type: 'rules',
              items: [
                'Predictions and plans: actions expected to happen',
                'Promises and commitments',
                'Speculation or probability about the present ("I wonder...", "It must be...")',
                'Formal or emphatic future (less common in casual speech, where "ir a + infinitive" is preferred)',
              ],
            },
            {
              type: 'examples',
              examples: [
                { es: 'Mañana iremos al museo.', en: 'Tomorrow we will go to the museum.' },
                { es: 'Te llamaré esta noche.', en: 'I will call you tonight.' },
                { es: 'El año que viene viajará a España.', en: 'Next year she will travel to Spain.' },
                { es: '¿Dónde estará Juan?', en: 'Where could Juan be? / I wonder where Juan is. (speculation)' },
                { es: 'Serán las ocho.', en: 'It must be eight o\'clock. (probability)' },
                { es: '¿Quién será a esta hora?', en: 'Who could it be at this hour? (conjecture)' },
              ],
            },
          ],
        },
        {
          id: '3.4',
          title: 'Future of Probability',
          blocks: [
            {
              type: 'text',
              content: 'The future tense is commonly used to express guesses about the present moment. English uses "must be", "probably", or "I wonder".',
            },
            {
              type: 'examples',
              examples: [
                { es: 'Tendrá unos treinta años.', en: 'He must be about thirty years old.' },
                { es: 'Estará en casa.', en: 'She\'s probably at home.' },
                { es: '¿Qué hora será?', en: 'What time can it be? / I wonder what time it is.' },
              ],
            },
          ],
        },
      ],
    },
    {
      id: 3,
      title: 'Conditional Tense',
      sections: [
        {
          id: '4.1',
          title: 'Formation of the Conditional (Condicional Simple)',
          blocks: [
            {
              type: 'text',
              content: 'The conditional is formed exactly like the future tense: endings are added to the infinitive (or the same irregular stems as the future). The endings are identical for all verb types.',
            },
            {
              type: 'text',
              content: 'Conditional endings:',
            },
            {
              type: 'table',
              headers: ['Person', 'Ending', 'hablar', 'comer', 'vivir'],
              rows: [
                ['yo', '-ía', 'hablaría', 'comería', 'viviría'],
                ['tú', '-ías', 'hablarías', 'comerías', 'vivirías'],
                ['él/ella/usted', '-ía', 'hablaría', 'comería', 'viviría'],
                ['nosotros/as', '-íamos', 'hablaríamos', 'comeríamos', 'viviríamos'],
                ['vosotros/as', '-íais', 'hablaríais', 'comeríais', 'viviríais'],
                ['ellos/ellas/ustedes', '-ían', 'hablarían', 'comerían', 'vivirían'],
              ],
            },
          ],
        },
        {
          id: '4.2',
          title: 'Irregular Conditional Stems',
          blocks: [
            {
              type: 'text',
              content: 'The irregular stems are identical to those of the future tense.',
            },
            {
              type: 'table',
              headers: ['Infinitive', 'Stem', 'Example (yo)'],
              rows: [
                ['decir', 'dir-', 'diría'],
                ['hacer', 'har-', 'haría'],
                ['poder', 'podr-', 'podría'],
                ['poner', 'pondr-', 'pondría'],
                ['querer', 'querr-', 'querría'],
                ['saber', 'sabr-', 'sabría'],
                ['salir', 'saldr-', 'saldría'],
                ['tener', 'tendr-', 'tendría'],
                ['venir', 'vendr-', 'vendría'],
                ['haber', 'habr-', 'habría'],
                ['caber', 'cabr-', 'cabría'],
                ['valer', 'valdr-', 'valdría'],
              ],
            },
          ],
        },
        {
          id: '4.3',
          title: 'Uses of the Conditional',
          blocks: [
            {
              type: 'rules',
              items: [
                'Hypothetical situations: what would happen under certain conditions',
                'Polite requests and suggestions (softer than present tense)',
                'Desire or wishes',
                'Advice ("you should...")',
                'Speculation about the past ("I wondered...", "It was probably...")',
                'Reported speech: future of the past',
              ],
            },
            {
              type: 'examples',
              examples: [
                { es: 'Me gustaría viajar a Argentina.', en: 'I would like to travel to Argentina.' },
                { es: '¿Podrías ayudarme?', en: 'Could you help me?' },
                { es: 'Yo en tu lugar no haría eso.', en: 'In your place, I wouldn\'t do that.' },
                { es: 'Deberías estudiar más.', en: 'You should study more.' },
                { es: 'Dijo que vendría a las cinco.', en: 'He said he would come at five. (reported speech)' },
                { es: 'Serían las tres cuando llegamos.', en: 'It was probably three o\'clock when we arrived. (past probability)' },
              ],
            },
          ],
        },
      ],
    },
    {
      id: 4,
      title: 'Si-Clauses (Conditional Sentences)',
      sections: [
        {
          id: '5.1',
          title: 'Type 0 — General Truths',
          blocks: [
            {
              type: 'text',
              content: 'Condition and result are both in the present indicative. Describes general truths or habitual situations.',
            },
            {
              type: 'text',
              content: 'Structure: Si + present indicative, present indicative',
            },
            {
              type: 'examples',
              examples: [
                { es: 'Si llueve, me quedo en casa.', en: 'If it rains, I stay at home.' },
                { es: 'Si comes mucho, te duele el estómago.', en: 'If you eat a lot, your stomach hurts.' },
              ],
            },
          ],
        },
        {
          id: '5.2',
          title: 'Type 1 — Real / Likely Conditions',
          blocks: [
            {
              type: 'text',
              content: 'The condition is possible or likely. The si-clause uses the present indicative; the result clause uses the future, present, or imperative.',
            },
            {
              type: 'text',
              content: 'Structure: Si + present indicative, future / present / imperative',
            },
            {
              type: 'rules',
              items: [
                '"Si" is never followed by the present subjunctive in Type 1',
                'The si-clause can come first or second in the sentence',
              ],
            },
            {
              type: 'examples',
              examples: [
                { es: 'Si tengo tiempo, iré al gimnasio.', en: 'If I have time, I will go to the gym.' },
                { es: 'Si quieres, puedo ayudarte.', en: 'If you want, I can help you.' },
                { es: 'Llámame si necesitas algo.', en: 'Call me if you need something.' },
                { es: 'Si estudias, aprobarás el examen.', en: 'If you study, you will pass the exam.' },
              ],
            },
          ],
        },
        {
          id: '5.3',
          title: 'Type 2 — Unreal / Hypothetical Conditions (Present/Future)',
          blocks: [
            {
              type: 'text',
              content: 'The condition is unlikely or contrary to present reality. The si-clause uses the imperfect subjunctive; the result clause uses the conditional.',
            },
            {
              type: 'text',
              content: 'Structure: Si + imperfect subjunctive, conditional',
            },
            {
              type: 'rules',
              items: [
                '"Si" is never followed by the conditional',
                'The imperfect subjunctive has two forms (-ra and -se); both are correct, but -ra is more common',
                'Type 2 expresses situations imagined as unreal or improbable',
              ],
            },
            {
              type: 'examples',
              examples: [
                { es: 'Si tuviera dinero, viajaría por el mundo.', en: 'If I had money, I would travel the world.' },
                { es: 'Si fuera millonario, compraría una isla.', en: 'If I were a millionaire, I would buy an island.' },
                { es: 'Si pudiera volar, iría a la luna.', en: 'If I could fly, I would go to the moon.' },
                { es: '¿Qué harías si ganaras la lotería?', en: 'What would you do if you won the lottery?' },
              ],
            },
          ],
        },
        {
          id: '5.4',
          title: 'Summary of Si-Clause Types',
          blocks: [
            {
              type: 'table',
              headers: ['Type', 'Si-Clause', 'Result Clause', 'Meaning'],
              rows: [
                ['0', 'present indicative', 'present indicative', 'general truth'],
                ['1', 'present indicative', 'future / present / imperative', 'real / likely'],
                ['2', 'imperfect subjunctive', 'conditional', 'unreal / hypothetical'],
              ],
            },
          ],
        },
      ],
    },
    {
      id: 5,
      title: 'Present Subjunctive',
      sections: [
        {
          id: '6.1',
          title: 'Formation',
          blocks: [
            {
              type: 'text',
              content: 'The present subjunctive is formed by taking the "yo" form of the present indicative, dropping the -o, and adding the "opposite" vowel endings.',
            },
            {
              type: 'rules',
              items: [
                '-ar verbs use -e endings',
                '-er / -ir verbs use -a endings',
                'The yo form determines the stem (including irregular yo forms like tengo → teng-)',
              ],
            },
            {
              type: 'text',
              content: 'Regular present subjunctive:',
            },
            {
              type: 'table',
              headers: ['Person', '-ar (hablar)', '-er (comer)', '-ir (vivir)'],
              rows: [
                ['yo', 'hable', 'coma', 'viva'],
                ['tú', 'hables', 'comas', 'vivas'],
                ['él/ella/usted', 'hable', 'coma', 'viva'],
                ['nosotros/as', 'hablemos', 'comamos', 'vivamos'],
                ['vosotros/as', 'habléis', 'comáis', 'viváis'],
                ['ellos/ellas/ustedes', 'hablen', 'coman', 'vivan'],
              ],
            },
          ],
        },
        {
          id: '6.2',
          title: 'Irregular Verbs (DISHES)',
          blocks: [
            {
              type: 'text',
              content: 'Six verbs do not follow the yo-form pattern and must be memorized: Dar, Ir, Saber, Haber, Estar, Ser.',
            },
            {
              type: 'table',
              headers: ['Person', 'dar', 'ir', 'saber', 'haber', 'estar', 'ser'],
              rows: [
                ['yo', 'dé', 'vaya', 'sepa', 'haya', 'esté', 'sea'],
                ['tú', 'des', 'vayas', 'sepas', 'hayas', 'estés', 'seas'],
                ['él/ella/usted', 'dé', 'vaya', 'sepa', 'haya', 'esté', 'sea'],
                ['nosotros/as', 'demos', 'vayamos', 'sepamos', 'hayamos', 'estemos', 'seamos'],
                ['vosotros/as', 'deis', 'vayáis', 'sepáis', 'hayáis', 'estéis', 'seáis'],
                ['ellos/ellas/ustedes', 'den', 'vayan', 'sepan', 'hayan', 'estén', 'sean'],
              ],
            },
          ],
        },
        {
          id: '6.3',
          title: 'Stem-Changing Verbs in the Subjunctive',
          blocks: [
            {
              type: 'text',
              content: '-ar and -er stem-changers follow the same pattern as the indicative (change in all forms except nosotros and vosotros). -ir stem-changers have an additional change in the nosotros/vosotros forms: e→i or o→u.',
            },
            {
              type: 'table',
              headers: ['Person', 'pensar (e→ie)', 'volver (o→ue)', 'sentir (e→ie, e→i)', 'dormir (o→ue, o→u)'],
              rows: [
                ['yo', 'piense', 'vuelva', 'sienta', 'duerma'],
                ['tú', 'pienses', 'vuelvas', 'sientas', 'duermas'],
                ['él/ella', 'piense', 'vuelva', 'sienta', 'duerma'],
                ['nosotros', 'pensemos', 'volvamos', 'sintamos', 'durmamos'],
                ['vosotros', 'penséis', 'volváis', 'sintáis', 'durmáis'],
                ['ellos', 'piensen', 'vuelvan', 'sientan', 'duerman'],
              ],
            },
          ],
        },
        {
          id: '6.4',
          title: 'WEIRDO — When to Use the Subjunctive',
          blocks: [
            {
              type: 'text',
              content: 'The subjunctive is triggered when the main clause expresses one of the WEIRDO categories, followed by "que".',
            },
            {
              type: 'table',
              headers: ['Letter', 'Category', 'Example Triggers'],
              rows: [
                ['W', 'Wishes / Will', 'querer, desear, preferir, esperar, ojalá'],
                ['E', 'Emotions', 'alegrarse de, tener miedo de, sentir, sorprender'],
                ['I', 'Impersonal expressions', 'es importante, es necesario, es posible, es mejor'],
                ['R', 'Recommendations', 'recomendar, sugerir, aconsejar, pedir, decir (command)'],
                ['D', 'Doubt / Denial', 'dudar, no creer, no pensar, negar, es dudoso'],
                ['O', 'Ojalá / Other expressions', 'ojalá, para que, antes de que, sin que, a menos que'],
              ],
            },
            {
              type: 'rules',
              items: [
                'The subjunctive requires two clauses with two different subjects connected by "que"',
                'If both clauses have the same subject, use the infinitive instead: "Quiero ir" (not "Quiero que yo vaya")',
                '"Creer que" and "pensar que" use indicative in affirmative; subjunctive in negative',
              ],
            },
            {
              type: 'examples',
              examples: [
                { es: 'Quiero que vengas a la fiesta.', en: 'I want you to come to the party.' },
                { es: 'Es importante que estudies todos los días.', en: 'It\'s important that you study every day.' },
                { es: 'Dudo que él sepa la respuesta.', en: 'I doubt he knows the answer.' },
                { es: 'Me alegra que estés aquí.', en: 'I\'m glad you\'re here.' },
                { es: 'Ojalá que haga buen tiempo mañana.', en: 'I hope the weather is good tomorrow.' },
                { es: 'No creo que sea verdad.', en: 'I don\'t think it\'s true.' },
                { es: 'Te lo digo para que lo sepas.', en: 'I\'m telling you so that you know.' },
              ],
            },
          ],
        },
      ],
    },
    {
      id: 6,
      title: 'Imperfect Subjunctive',
      sections: [
        {
          id: '7.1',
          title: 'Formation',
          blocks: [
            {
              type: 'text',
              content: 'The imperfect subjunctive is formed from the third person plural (ellos) of the preterite. Remove -ron and add the -ra or -se endings.',
            },
            {
              type: 'rules',
              items: [
                'Both -ra and -se forms are grammatically correct',
                'The -ra form is more common in everyday speech',
                'The -se form is more literary/formal',
                'Irregular preterite stems carry over: tuvieron → tuvie- → tuviera/tuviese',
              ],
            },
            {
              type: 'text',
              content: 'Regular imperfect subjunctive:',
            },
            {
              type: 'table',
              headers: ['Person', 'hablar (hablaron)', 'comer (comieron)', 'vivir (vivieron)'],
              rows: [
                ['yo', 'hablara / hablase', 'comiera / comiese', 'viviera / viviese'],
                ['tú', 'hablaras / hablases', 'comieras / comieses', 'vivieras / vivieses'],
                ['él/ella/usted', 'hablara / hablase', 'comiera / comiese', 'viviera / viviese'],
                ['nosotros/as', 'habláramos / hablásemos', 'comiéramos / comiésemos', 'viviéramos / viviésemos'],
                ['vosotros/as', 'hablarais / hablaseis', 'comierais / comieseis', 'vivierais / vivieseis'],
                ['ellos/ellas/ustedes', 'hablaran / hablasen', 'comieran / comiesen', 'vivieran / viviesen'],
              ],
            },
          ],
        },
        {
          id: '7.2',
          title: 'Common Irregular Imperfect Subjunctive Forms',
          blocks: [
            {
              type: 'table',
              headers: ['Infinitive', 'Preterite (ellos)', 'Imperfect Subjunctive (yo)'],
              rows: [
                ['ser / ir', 'fueron', 'fuera / fuese'],
                ['tener', 'tuvieron', 'tuviera / tuviese'],
                ['estar', 'estuvieron', 'estuviera / estuviese'],
                ['hacer', 'hicieron', 'hiciera / hiciese'],
                ['poder', 'pudieron', 'pudiera / pudiese'],
                ['poner', 'pusieron', 'pusiera / pusiese'],
                ['saber', 'supieron', 'supiera / supiese'],
                ['querer', 'quisieron', 'quisiera / quisiese'],
                ['decir', 'dijeron', 'dijera / dijese'],
                ['haber', 'hubieron', 'hubiera / hubiese'],
                ['venir', 'vinieron', 'viniera / viniese'],
                ['dar', 'dieron', 'diera / diese'],
              ],
            },
          ],
        },
        {
          id: '7.3',
          title: 'Uses of the Imperfect Subjunctive',
          blocks: [
            {
              type: 'rules',
              items: [
                'After past-tense WEIRDO triggers: "Quería que vinieras" (I wanted you to come)',
                'In Type 2 si-clauses: "Si pudiera, lo haría" (If I could, I would do it)',
                'After "como si" (as if): always takes imperfect subjunctive',
                'Polite requests with "quisiera": softer than "querría" or "quiero"',
                'After "ojalá" for unlikely wishes: "Ojalá pudiera volar" (I wish I could fly)',
              ],
            },
            {
              type: 'examples',
              examples: [
                { es: 'Mi madre quería que yo estudiara medicina.', en: 'My mother wanted me to study medicine.' },
                { es: 'No creía que fuera posible.', en: 'I didn\'t think it was possible.' },
                { es: 'Habla como si fuera español.', en: 'He speaks as if he were Spanish.' },
                { es: 'Quisiera un café, por favor.', en: 'I would like a coffee, please.' },
                { es: 'Si yo fuera tú, no haría eso.', en: 'If I were you, I wouldn\'t do that.' },
                { es: 'Era necesario que todos participaran.', en: 'It was necessary for everyone to participate.' },
              ],
            },
          ],
        },
      ],
    },
    {
      id: 7,
      title: 'Ser vs. Estar — Advanced Uses',
      sections: [
        {
          id: '8.1',
          title: 'Review of Basic Distinction',
          blocks: [
            {
              type: 'rules',
              items: [
                'Ser: identity, origin, profession, material, time, inherent characteristics, passive voice (ser + participle)',
                'Estar: location, temporary states, emotions, conditions, results of actions (estar + participle)',
              ],
            },
          ],
        },
        {
          id: '8.2',
          title: 'Adjectives That Change Meaning with Ser / Estar',
          blocks: [
            {
              type: 'text',
              content: 'Many adjectives take on different meanings depending on which verb is used.',
            },
            {
              type: 'table',
              headers: ['Adjective', 'With Ser', 'With Estar'],
              rows: [
                ['aburrido', 'boring', 'bored'],
                ['bueno', 'good (character)', 'tasty / in good health'],
                ['malo', 'bad (character)', 'sick / in bad condition'],
                ['listo', 'clever / smart', 'ready'],
                ['rico', 'rich / wealthy', 'delicious'],
                ['seguro', 'safe (inherently)', 'sure / certain'],
                ['vivo', 'lively / sharp', 'alive'],
                ['verde', 'green (color)', 'unripe'],
                ['orgulloso', 'proud (arrogant)', 'proud (of something)'],
                ['atento', 'thoughtful / considerate', 'attentive / paying attention'],
                ['interesado', 'self-interested', 'interested (in something)'],
                ['despierto', 'bright / alert (personality)', 'awake'],
                ['cerrado', 'narrow-minded', 'closed'],
                ['abierto', 'open-minded', 'open (physically)'],
                ['negro', 'black (color)', 'furious (colloquial)'],
              ],
            },
            {
              type: 'examples',
              examples: [
                { es: 'Juan es aburrido.', en: 'Juan is boring. (personality)' },
                { es: 'Juan está aburrido.', en: 'Juan is bored. (temporary feeling)' },
                { es: 'La sopa es buena.', en: 'The soup is good. (quality)' },
                { es: 'La sopa está buena.', en: 'The soup tastes good. (right now)' },
                { es: 'María es lista.', en: 'Maria is clever.' },
                { es: 'María está lista.', en: 'Maria is ready.' },
                { es: 'El niño es vivo.', en: 'The boy is lively.' },
                { es: 'El niño está vivo.', en: 'The boy is alive.' },
              ],
            },
          ],
        },
        {
          id: '8.3',
          title: 'Ser and Estar with Past Participles',
          blocks: [
            {
              type: 'rules',
              items: [
                'Ser + participle = passive voice (action): "La puerta fue abierta por el guardia." (The door was opened by the guard.)',
                'Estar + participle = resulting state: "La puerta está abierta." (The door is open.)',
                'With estar, the participle acts as an adjective and agrees in gender and number',
              ],
            },
            {
              type: 'examples',
              examples: [
                { es: 'El libro fue escrito en 1990.', en: 'The book was written in 1990. (action)' },
                { es: 'El libro está escrito en español.', en: 'The book is written in Spanish. (state)' },
                { es: 'Las ventanas fueron rotas por la tormenta.', en: 'The windows were broken by the storm. (action)' },
                { es: 'Las ventanas están rotas.', en: 'The windows are broken. (current state)' },
              ],
            },
          ],
        },
      ],
    },
    {
      id: 8,
      title: 'Object Pronouns — Advanced Use',
      sections: [
        {
          id: '9.1',
          title: 'Direct and Indirect Object Pronouns — Review',
          blocks: [
            {
              type: 'table',
              headers: ['Person', 'Direct Object', 'Indirect Object'],
              rows: [
                ['yo', 'me', 'me'],
                ['tú', 'te', 'te'],
                ['él / usted (masc.)', 'lo', 'le'],
                ['ella / usted (fem.)', 'la', 'le'],
                ['nosotros/as', 'nos', 'nos'],
                ['vosotros/as', 'os', 'os'],
                ['ellos / ustedes (masc.)', 'los', 'les'],
                ['ellas / ustedes (fem.)', 'las', 'les'],
              ],
            },
          ],
        },
        {
          id: '9.2',
          title: 'Double Object Pronouns',
          blocks: [
            {
              type: 'text',
              content: 'When both indirect and direct object pronouns appear together, the indirect object always comes first.',
            },
            {
              type: 'rules',
              items: [
                'Order: Indirect + Direct + verb (or attached to infinitive/gerund/affirmative imperative)',
                'When both pronouns start with "l" (le/les + lo/la/los/las), the indirect "le/les" changes to "se"',
                '"Se lo" can mean "to him/her/you/them" — add clarifiers with "a él/ella/usted/ellos" if ambiguous',
              ],
            },
            {
              type: 'examples',
              examples: [
                { es: '¿Me das el libro? → ¿Me lo das?', en: 'Will you give it to me?' },
                { es: 'Le di el regalo a María. → Se lo di.', en: 'I gave it to her.' },
                { es: 'Nos contó la historia. → Nos la contó.', en: 'He told it to us.' },
                { es: 'Les envié las fotos. → Se las envié.', en: 'I sent them to them.' },
                { es: 'Se lo dije a ella.', en: 'I told it to her. (clarifier added)' },
              ],
            },
          ],
        },
        {
          id: '9.3',
          title: 'Pronoun Placement Rules',
          blocks: [
            {
              type: 'rules',
              items: [
                'Before conjugated verbs: "Lo veo." (I see it.)',
                'Before the conjugated verb in compound tenses: "Lo he visto." (I have seen it.)',
                'Attached to the end of affirmative imperatives: "Dímelo." (Tell it to me.)',
                'Attached to the end of infinitives: "Quiero verlo." / "Lo quiero ver." (I want to see it.) — both positions are correct',
                'Attached to the end of gerunds: "Estoy haciéndolo." / "Lo estoy haciendo." (I am doing it.) — both positions are correct',
                'Before negative imperatives: "No me lo digas." (Don\'t tell it to me.)',
                'When attached, add a written accent to maintain original stress: diga → dígame, diciendo → diciéndolo',
              ],
            },
            {
              type: 'examples',
              examples: [
                { es: 'Puedo explicártelo.', en: 'I can explain it to you.' },
                { es: 'Están preparándoselo.', en: 'They are preparing it for him/her.' },
                { es: 'No se lo cuentes a nadie.', en: 'Don\'t tell it to anyone.' },
                { es: 'Dáselo a tu hermano.', en: 'Give it to your brother.' },
              ],
            },
          ],
        },
      ],
    },
    {
      id: 9,
      title: 'Reflexive and Pronominal Verbs',
      sections: [
        {
          id: '10.1',
          title: 'Reflexive Verbs — Review',
          blocks: [
            {
              type: 'text',
              content: 'Reflexive verbs indicate the subject performs the action on itself. They use reflexive pronouns: me, te, se, nos, os, se.',
            },
            {
              type: 'text',
              content: 'Common reflexive verbs: levantarse (to get up), ducharse (to shower), vestirse (to get dressed), acostarse (to go to bed), sentarse (to sit down), llamarse (to be called)',
            },
          ],
        },
        {
          id: '10.2',
          title: 'Reciprocal Verbs',
          blocks: [
            {
              type: 'text',
              content: 'When used with plural subjects, reflexive pronouns can indicate a reciprocal action (each other / one another).',
            },
            {
              type: 'rules',
              items: [
                'Only possible with plural subjects (nosotros, vosotros, ellos)',
                'Context or clarifiers like "el uno al otro" / "mutuamente" help distinguish reflexive from reciprocal',
              ],
            },
            {
              type: 'examples',
              examples: [
                { es: 'Nos queremos.', en: 'We love each other.' },
                { es: 'Se escriben cartas.', en: 'They write letters to each other.' },
                { es: 'Os veis todos los viernes.', en: 'You see each other every Friday.' },
                { es: 'Se ayudan mutuamente.', en: 'They help each other.' },
                { es: 'Juan y María se conocieron en la universidad.', en: 'Juan and Maria met each other at university.' },
              ],
            },
          ],
        },
        {
          id: '10.3',
          title: 'Pronominal Verbs (No True Reflexive Meaning)',
          blocks: [
            {
              type: 'text',
              content: 'Some verbs always or often use the reflexive pronoun but do not imply a reflexive action. The pronoun is an inherent part of the verb.',
            },
            {
              type: 'text',
              content: 'Common pronominal verbs:',
            },
            {
              type: 'table',
              headers: ['Verb', 'Meaning'],
              rows: [
                ['arrepentirse (de)', 'to regret'],
                ['atreverse (a)', 'to dare'],
                ['quejarse (de)', 'to complain (about)'],
                ['enterarse (de)', 'to find out (about)'],
                ['darse cuenta (de)', 'to realize'],
                ['irse', 'to leave / go away'],
                ['morirse', 'to die (emphatic)'],
                ['caerse', 'to fall down'],
                ['olvidarse (de)', 'to forget (about)'],
                ['acordarse (de)', 'to remember'],
                ['negarse (a)', 'to refuse (to)'],
              ],
            },
            {
              type: 'examples',
              examples: [
                { es: 'Me arrepiento de lo que dije.', en: 'I regret what I said.' },
                { es: 'Se quejaron del servicio.', en: 'They complained about the service.' },
                { es: 'No me atreví a decírselo.', en: 'I didn\'t dare tell him/her.' },
                { es: 'Se enteró de la noticia por la radio.', en: 'He found out the news from the radio.' },
              ],
            },
          ],
        },
        {
          id: '10.4',
          title: 'Verbs of Change (Verbos de Cambio)',
          blocks: [
            {
              type: 'text',
              content: 'Spanish has several verbs meaning "to become", each used in different contexts.',
            },
            {
              type: 'table',
              headers: ['Verb', 'Use', 'Example'],
              rows: [
                ['ponerse + adjective', 'temporary physical/emotional change', 'ponerse rojo (to turn red)'],
                ['volverse + adjective', 'lasting personality/character change', 'volverse loco (to go crazy)'],
                ['hacerse + noun/adjective', 'deliberate effort or gradual process', 'hacerse médico (to become a doctor)'],
                ['convertirse en + noun', 'radical transformation', 'convertirse en mariposa (to become a butterfly)'],
                ['llegar a ser + noun', 'achievement after a long process', 'llegar a ser presidente (to become president)'],
                ['quedarse + adjective', 'resulting state (often involuntary)', 'quedarse ciego (to go blind)'],
              ],
            },
            {
              type: 'examples',
              examples: [
                { es: 'Se puso nerviosa cuando vio al profesor.', en: 'She got nervous when she saw the teacher.' },
                { es: 'Con los años, se volvió más tolerante.', en: 'Over the years, he became more tolerant.' },
                { es: 'Se hizo rico trabajando mucho.', en: 'He became rich by working hard.' },
                { es: 'La oruga se convirtió en mariposa.', en: 'The caterpillar became a butterfly.' },
                { es: 'Llegó a ser directora de la empresa.', en: 'She became the director of the company.' },
                { es: 'Se quedó sorprendido al oír la noticia.', en: 'He was surprised to hear the news.' },
              ],
            },
          ],
        },
      ],
    },
    {
      id: 10,
      title: 'Relative Pronouns',
      sections: [
        {
          id: '11.1',
          title: 'Que — The Most Common Relative Pronoun',
          blocks: [
            {
              type: 'text',
              content: '"Que" is the most versatile relative pronoun in Spanish. It can refer to people or things, as subject or direct object.',
            },
            {
              type: 'rules',
              items: [
                'Can replace "who", "whom", "that", "which" in English',
                'Never omitted in Spanish (unlike English where "that" can be dropped)',
                'Used in both defining and non-defining clauses',
              ],
            },
            {
              type: 'examples',
              examples: [
                { es: 'El hombre que vive aquí es profesor.', en: 'The man who lives here is a teacher.' },
                { es: 'El libro que compré es interesante.', en: 'The book (that) I bought is interesting.' },
                { es: 'La casa que vimos ayer era bonita.', en: 'The house (that) we saw yesterday was pretty.' },
              ],
            },
          ],
        },
        {
          id: '11.2',
          title: 'Quien / Quienes',
          blocks: [
            {
              type: 'text',
              content: '"Quien" (singular) and "quienes" (plural) refer only to people. They are used after prepositions and in non-defining clauses.',
            },
            {
              type: 'rules',
              items: [
                'Must agree in number with the antecedent',
                'Always used after prepositions when referring to people: "con quien", "para quien", "a quien"',
                'In non-defining clauses (set off by commas), "quien" can replace "que" for people',
              ],
            },
            {
              type: 'examples',
              examples: [
                { es: 'La persona con quien hablé era amable.', en: 'The person with whom I spoke was kind.' },
                { es: 'Mi hermana, quien vive en Madrid, vendrá mañana.', en: 'My sister, who lives in Madrid, will come tomorrow.' },
                { es: 'Los estudiantes a quienes enseño son trabajadores.', en: 'The students whom I teach are hard-working.' },
              ],
            },
          ],
        },
        {
          id: '11.3',
          title: 'El que / El cual (and variants)',
          blocks: [
            {
              type: 'text',
              content: 'These compound relative pronouns agree in gender and number: el que, la que, los que, las que / el cual, la cual, los cuales, las cuales.',
            },
            {
              type: 'rules',
              items: [
                'Used after prepositions (especially longer ones: detrás de, debajo de, por, sin, entre)',
                'More common in formal/written Spanish',
                '"El cual" is more formal than "el que"',
                'Can clarify which noun is the antecedent in complex sentences',
              ],
            },
            {
              type: 'examples',
              examples: [
                { es: 'El edificio detrás del cual hay un parque es muy antiguo.', en: 'The building behind which there is a park is very old.' },
                { es: 'Las razones por las cuales no vino son desconocidas.', en: 'The reasons for which he didn\'t come are unknown.' },
                { es: 'La empresa para la que trabajo es internacional.', en: 'The company for which I work is international.' },
              ],
            },
          ],
        },
        {
          id: '11.4',
          title: 'Lo que — "What" / "The thing that"',
          blocks: [
            {
              type: 'text',
              content: '"Lo que" is a neuter relative pronoun used when there is no specific noun antecedent. It translates as "what" or "the thing that".',
            },
            {
              type: 'rules',
              items: [
                'Used when referring to an idea, concept, or unspecified thing',
                'Never refers to a specific noun (use "el que" / "la que" instead)',
                'Very common in everyday speech',
              ],
            },
            {
              type: 'examples',
              examples: [
                { es: 'Lo que más me gusta es viajar.', en: 'What I like most is traveling.' },
                { es: 'No entiendo lo que dices.', en: 'I don\'t understand what you\'re saying.' },
                { es: 'Dime lo que piensas.', en: 'Tell me what you think.' },
                { es: 'Lo que pasó fue increíble.', en: 'What happened was incredible.' },
              ],
            },
          ],
        },
        {
          id: '11.5',
          title: 'Cuyo / Cuya / Cuyos / Cuyas — "Whose"',
          blocks: [
            {
              type: 'text',
              content: '"Cuyo" is a possessive relative pronoun meaning "whose". It agrees in gender and number with the noun it modifies (the thing possessed), not with the possessor.',
            },
            {
              type: 'rules',
              items: [
                'Agrees with the possessed noun: "cuyo libro" (whose book), "cuya casa" (whose house)',
                'More common in written/formal Spanish',
                'In spoken Spanish, often replaced by "que su" or restructured sentence',
              ],
            },
            {
              type: 'examples',
              examples: [
                { es: 'El autor cuyo libro leí es colombiano.', en: 'The author whose book I read is Colombian.' },
                { es: 'La mujer cuyas hijas estudian aquí es doctora.', en: 'The woman whose daughters study here is a doctor.' },
                { es: 'El país cuyos paisajes son impresionantes es Chile.', en: 'The country whose landscapes are impressive is Chile.' },
              ],
            },
          ],
        },
        {
          id: '11.6',
          title: 'Donde — "Where"',
          blocks: [
            {
              type: 'text',
              content: '"Donde" is a relative adverb used to indicate location. It replaces "en el que" / "en la que".',
            },
            {
              type: 'examples',
              examples: [
                { es: 'La ciudad donde nací es pequeña.', en: 'The city where I was born is small.' },
                { es: 'El restaurante donde comimos era excelente.', en: 'The restaurant where we ate was excellent.' },
              ],
            },
          ],
        },
      ],
    },
    {
      id: 11,
      title: 'Passive Voice',
      sections: [
        {
          id: '12.1',
          title: 'Passive with Ser (Voz Pasiva con Ser)',
          blocks: [
            {
              type: 'text',
              content: 'The true passive voice is formed with "ser" + past participle. The participle agrees with the subject in gender and number. The agent (doer) is introduced with "por".',
            },
            {
              type: 'text',
              content: 'Structure: Subject + ser (conjugated) + past participle (agrees with subject) + por + agent',
            },
            {
              type: 'rules',
              items: [
                'Ser can be in any tense',
                'The past participle agrees with the subject in gender and number',
                'More common in written and formal language',
                'In everyday speech, the active voice or "se" construction is preferred',
              ],
            },
            {
              type: 'examples',
              examples: [
                { es: 'El libro fue escrito por García Márquez.', en: 'The book was written by Garcia Marquez.' },
                { es: 'Las cartas son enviadas cada semana.', en: 'The letters are sent every week.' },
                { es: 'La decisión será tomada por el director.', en: 'The decision will be made by the director.' },
                { es: 'Los edificios fueron construidos en el siglo XIX.', en: 'The buildings were constructed in the 19th century.' },
              ],
            },
          ],
        },
        {
          id: '12.2',
          title: 'Passive with Estar (Resulting State)',
          blocks: [
            {
              type: 'text',
              content: '"Estar" + past participle describes the state resulting from an action, not the action itself. The agent is usually not mentioned.',
            },
            {
              type: 'rules',
              items: [
                'Focuses on the result, not the process',
                'The past participle agrees with the subject',
                'No agent phrase (no "por...")',
              ],
            },
            {
              type: 'examples',
              examples: [
                { es: 'La puerta está cerrada.', en: 'The door is closed. (result: it is in a closed state)' },
                { es: 'Los deberes ya están hechos.', en: 'The homework is already done.' },
                { es: 'La mesa está puesta.', en: 'The table is set.' },
                { es: 'La ventana está rota.', en: 'The window is broken.' },
              ],
            },
          ],
        },
        {
          id: '12.3',
          title: 'Passive "Se" (Pasiva Refleja)',
          blocks: [
            {
              type: 'text',
              content: 'This is the most common way to express the passive in Spanish, especially when the agent is unknown or unimportant. The verb agrees with the subject.',
            },
            {
              type: 'text',
              content: 'Structure: Se + verb (3rd person singular or plural) + subject',
            },
            {
              type: 'rules',
              items: [
                'The verb agrees with the grammatical subject: "Se vende una casa" / "Se venden casas"',
                'No agent is expressed',
                'Very common in signs, advertisements, and general statements',
                'Used when the subject is a thing (not a person)',
              ],
            },
            {
              type: 'examples',
              examples: [
                { es: 'Se habla español aquí.', en: 'Spanish is spoken here.' },
                { es: 'Se venden pisos.', en: 'Apartments are sold. / Apartments for sale.' },
                { es: 'Se necesitan profesores.', en: 'Teachers are needed.' },
                { es: 'Se construyó un puente nuevo.', en: 'A new bridge was built.' },
              ],
            },
          ],
        },
        {
          id: '12.4',
          title: 'Impersonal "Se"',
          blocks: [
            {
              type: 'text',
              content: 'When there is no identifiable subject, "se" + 3rd person singular verb creates an impersonal construction. This is used with intransitive verbs or when referring to people.',
            },
            {
              type: 'rules',
              items: [
                'Always 3rd person singular',
                'Used for general statements about people: "how things are done"',
                'Translates as "one", "people", "they", "you (general)"',
                'When the object is a person, use "a" (personal a): "Se invitó a los estudiantes"',
              ],
            },
            {
              type: 'examples',
              examples: [
                { es: 'Se vive bien en España.', en: 'One lives well in Spain. / Life is good in Spain.' },
                { es: 'Se trabaja mucho aquí.', en: 'People work a lot here.' },
                { es: 'En este país se come a las dos.', en: 'In this country, people eat at two.' },
                { es: 'Se castigó a los responsables.', en: 'The responsible parties were punished.' },
              ],
            },
          ],
        },
      ],
    },
    {
      id: 12,
      title: 'Reported Speech (Estilo Indirecto)',
      sections: [
        {
          id: '13.1',
          title: 'Basic Structure',
          blocks: [
            {
              type: 'text',
              content: 'Reported speech relays what someone else said without quoting directly. It requires a reporting verb (usually "decir") + "que" + reported content.',
            },
            {
              type: 'examples',
              examples: [
                { es: 'Juan dijo: "Tengo hambre."', en: 'Juan said: "I\'m hungry." (direct)' },
                { es: 'Juan dijo que tenía hambre.', en: 'Juan said (that) he was hungry. (reported)' },
              ],
            },
          ],
        },
        {
          id: '13.2',
          title: 'Tense Backshifting',
          blocks: [
            {
              type: 'text',
              content: 'When the reporting verb is in the past tense, the tenses in the reported clause shift back by one degree.',
            },
            {
              type: 'table',
              headers: ['Direct Speech Tense', 'Reported Speech Tense'],
              rows: [
                ['Presente (hablo)', 'Imperfecto (hablaba)'],
                ['Pretérito perfecto (he hablado)', 'Pluscuamperfecto (había hablado)'],
                ['Pretérito indefinido (hablé)', 'Pluscuamperfecto (había hablado)'],
                ['Futuro simple (hablaré)', 'Condicional (hablaría)'],
                ['Futuro perfecto (habré hablado)', 'Condicional perfecto (habría hablado)'],
                ['Imperativo (habla / hable)', 'Imperfecto de subjuntivo (hablara)'],
                ['Presente de subjuntivo (hable)', 'Imperfecto de subjuntivo (hablara)'],
              ],
            },
            {
              type: 'rules',
              items: [
                'Imperfect and pluperfect do not change: "Dijo que llovía" stays as "llovía"',
                'Conditional does not change: "Dijo que iría" stays as "iría"',
                'If the reporting verb is in the present ("dice que..."), no tense shift is needed',
              ],
            },
          ],
        },
        {
          id: '13.3',
          title: 'Other Changes in Reported Speech',
          blocks: [
            {
              type: 'table',
              headers: ['Direct Speech', 'Reported Speech'],
              rows: [
                ['yo', 'él/ella'],
                ['tú', 'yo / él/ella (depends on context)'],
                ['mi/mis', 'su/sus'],
                ['tu/tus', 'mi/mis or su/sus'],
                ['aquí', 'allí'],
                ['hoy', 'ese día / aquel día'],
                ['mañana', 'al día siguiente'],
                ['ayer', 'el día anterior'],
                ['ahora', 'entonces / en ese momento'],
                ['esta semana', 'esa semana / aquella semana'],
                ['este', 'ese / aquel'],
              ],
            },
          ],
        },
        {
          id: '13.4',
          title: 'Reporting Statements',
          blocks: [
            {
              type: 'examples',
              examples: [
                { es: '"Vivo en Barcelona." → Dijo que vivía en Barcelona.', en: 'He said he lived in Barcelona.' },
                { es: '"He terminado el proyecto." → Dijo que había terminado el proyecto.', en: 'He said he had finished the project.' },
                { es: '"Iré mañana." → Dijo que iría al día siguiente.', en: 'He said he would go the next day.' },
              ],
            },
          ],
        },
        {
          id: '13.5',
          title: 'Reporting Questions',
          blocks: [
            {
              type: 'text',
              content: 'Yes/no questions: reporting verb + "si" + reported clause. Information questions: reporting verb + question word (qué, dónde, cuándo, etc.) + reported clause. Question word loses its accent in reported speech (but retains it in most modern writing).',
            },
            {
              type: 'examples',
              examples: [
                { es: '"¿Tienes hambre?" → Me preguntó si tenía hambre.', en: 'He asked me if I was hungry.' },
                { es: '"¿Dónde vives?" → Me preguntó dónde vivía.', en: 'He asked me where I lived.' },
                { es: '"¿Cuándo llegarás?" → Me preguntó cuándo llegaría.', en: 'He asked me when I would arrive.' },
              ],
            },
          ],
        },
        {
          id: '13.6',
          title: 'Reporting Commands',
          blocks: [
            {
              type: 'text',
              content: 'Commands in reported speech use the subjunctive (imperfect subjunctive if the reporting verb is past).',
            },
            {
              type: 'examples',
              examples: [
                { es: '"Abre la puerta." → Me pidió que abriera la puerta.', en: 'He asked me to open the door.' },
                { es: '"No hables tan alto." → Me dijo que no hablara tan alto.', en: 'He told me not to speak so loud.' },
                { es: '"Estudien para el examen." → Les dijo que estudiaran para el examen.', en: 'He told them to study for the exam.' },
              ],
            },
          ],
        },
      ],
    },
    {
      id: 13,
      title: 'Por vs. Para — Comprehensive Guide',
      sections: [
        {
          id: '14.1',
          title: 'Uses of Por',
          blocks: [
            {
              type: 'table',
              headers: ['Use', 'Example'],
              rows: [
                ['Cause / reason', '"Llegué tarde por el tráfico." — I arrived late because of the traffic.'],
                ['Duration of time', '"Estudié por dos horas." — I studied for two hours.'],
                ['Exchange / substitution', '"Pagué veinte euros por el libro." — I paid twenty euros for the book.'],
                ['Movement through / along', '"Caminamos por el parque." — We walked through the park.'],
                ['Means of communication / transport', '"Te llamo por teléfono." — I\'ll call you by phone.'],
                ['Per / frequency', '"Tres veces por semana." — Three times per week.'],
                ['General time of day', '"Por la mañana estudio." — In the morning I study.'],
                ['Agent in passive voice', '"Fue escrito por Cervantes." — It was written by Cervantes.'],
                ['"On behalf of" / "in favor of"', '"Voto por este candidato." — I vote for this candidate.'],
                ['"In search of" (ir por)', '"Voy por agua." — I\'m going to get water.'],
                ['Approximate location', '"Vive por aquí." — He lives around here.'],
                ['Emotion/motivation', '"Lo hago por amor." — I do it out of love.'],
              ],
            },
          ],
        },
        {
          id: '14.2',
          title: 'Uses of Para',
          blocks: [
            {
              type: 'table',
              headers: ['Use', 'Example'],
              rows: [
                ['Purpose / goal', '"Estudio para aprender." — I study in order to learn.'],
                ['Recipient', '"Este regalo es para ti." — This gift is for you.'],
                ['Destination', '"Salgo para Madrid." — I\'m leaving for Madrid.'],
                ['Deadline', '"El informe es para el viernes." — The report is for/due on Friday.'],
                ['Opinion / perspective', '"Para mí, es fácil." — For me, it\'s easy.'],
                ['Comparison to expectations', '"Para ser niño, cocina muy bien." — For a child, he cooks very well.'],
                ['Employment', '"Trabajo para una empresa grande." — I work for a big company.'],
                ['"About to" (estar para)', '"El tren está para salir." — The train is about to leave.'],
              ],
            },
          ],
        },
        {
          id: '14.3',
          title: 'Common Contrasts',
          blocks: [
            {
              type: 'table',
              headers: ['Context', 'Por', 'Para'],
              rows: [
                ['Motivation', '"Lucho por mi familia." (I fight because of / for the sake of my family)', '"Lucho para mi familia." (I fight for the benefit of my family)'],
                ['Travel', '"Viajo por España." (I travel through Spain)', '"Viajo para España." (I travel to/toward Spain)'],
                ['Time', '"Estaré aquí por dos días." (I\'ll be here for two days — duration)', '"Lo necesito para el martes." (I need it by/for Tuesday — deadline)'],
                ['Work', '"Trabaja por su jefe." (Works in place of his boss — substitution)', '"Trabaja para su jefe." (Works for his boss — employment)'],
              ],
            },
          ],
        },
        {
          id: '14.4',
          title: 'Fixed Expressions',
          blocks: [
            {
              type: 'text',
              content: 'With por: por ejemplo (for example), por favor (please), por fin (finally), por lo menos (at least), por supuesto (of course), por eso (that\'s why), por cierto (by the way), por lo general (in general), por lo tanto (therefore)',
            },
            {
              type: 'text',
              content: 'With para: para siempre (forever), para colmo (to top it off), para nada (not at all), para entonces (by then), no es para tanto (it\'s not that big a deal)',
            },
          ],
        },
      ],
    },
    {
      id: 14,
      title: 'Comparatives and Superlatives',
      sections: [
        {
          id: '15.1',
          title: 'Comparatives of Inequality',
          blocks: [
            {
              type: 'text',
              content: 'Structure: más + adjective/noun/adverb + que = more ... than; menos + adjective/noun/adverb + que = less ... than',
            },
            {
              type: 'examples',
              examples: [
                { es: 'Madrid es más grande que Sevilla.', en: 'Madrid is bigger than Seville.' },
                { es: 'Tengo menos tiempo que tú.', en: 'I have less time than you.' },
                { es: 'Corre más rápido que yo.', en: 'He runs faster than me.' },
              ],
            },
          ],
        },
        {
          id: '15.2',
          title: 'Comparatives of Equality',
          blocks: [
            {
              type: 'text',
              content: 'Structure: tan + adjective/adverb + como = as ... as; tanto/a/os/as + noun + como = as much/many ... as; verb + tanto como = as much as',
            },
            {
              type: 'rules',
              items: [
                '"Tan" is used with adjectives and adverbs (does not change form)',
                '"Tanto" agrees in gender and number with the noun it modifies: tanto (masc. sing.), tanta (fem. sing.), tantos (masc. pl.), tantas (fem. pl.)',
              ],
            },
            {
              type: 'examples',
              examples: [
                { es: 'Soy tan alto como mi hermano.', en: 'I am as tall as my brother.' },
                { es: 'Tiene tantos libros como yo.', en: 'He has as many books as me.' },
                { es: 'No trabajo tanto como ella.', en: 'I don\'t work as much as her.' },
                { es: 'Es tan inteligente como bonita.', en: 'She is as intelligent as she is pretty.' },
              ],
            },
          ],
        },
        {
          id: '15.3',
          title: 'Irregular Comparatives',
          blocks: [
            {
              type: 'table',
              headers: ['Adjective', 'Comparative', 'Superlative'],
              rows: [
                ['bueno (good)', 'mejor (better)', 'el/la mejor (the best)'],
                ['malo (bad)', 'peor (worse)', 'el/la peor (the worst)'],
                ['grande (big/old)', 'mayor (older/bigger)', 'el/la mayor (the oldest/biggest)'],
                ['pequeño (small/young)', 'menor (younger/smaller)', 'el/la menor (the youngest/smallest)'],
                ['mucho (much)', 'más (more)', '—'],
                ['poco (little)', 'menos (less)', '—'],
              ],
            },
            {
              type: 'rules',
              items: [
                'Never say "más bueno" for "better" (use "mejor") or "más malo" for "worse" (use "peor")',
                '"Más grande" and "más pequeño" can be used for physical size; "mayor" and "menor" are preferred for age',
                '"Mayor" and "menor" do not have separate feminine forms: "la hermana mayor" (the older sister)',
              ],
            },
            {
              type: 'examples',
              examples: [
                { es: 'Esta película es mejor que la otra.', en: 'This movie is better than the other one.' },
                { es: 'Mi hermana es mayor que yo.', en: 'My sister is older than me.' },
                { es: 'Este es el peor restaurante de la ciudad.', en: 'This is the worst restaurant in the city.' },
              ],
            },
          ],
        },
        {
          id: '15.4',
          title: 'Superlatives',
          blocks: [
            {
              type: 'text',
              content: 'Relative superlative (the most/least ... of/in): el/la/los/las + más/menos + adjective + de',
            },
            {
              type: 'text',
              content: 'Absolute superlative (extremely / very): adjective + -ísimo/a/os/as. Remove the final vowel before adding -ísimo: rico → riquísimo, largo → larguísimo.',
            },
            {
              type: 'text',
              content: 'Spelling changes for -ísimo: -co → -quísimo: rico → riquísimo; -go → -guísimo: largo → larguísimo; -ble → -bilísimo: amable → amabilísimo.',
            },
            {
              type: 'examples',
              examples: [
                { es: 'Es la ciudad más bonita de España.', en: 'It\'s the most beautiful city in Spain.' },
                { es: 'Es el estudiante menos trabajador de la clase.', en: 'He is the least hard-working student in the class.' },
                { es: 'La comida estaba riquísima.', en: 'The food was extremely delicious.' },
                { es: 'Estoy cansadísimo.', en: 'I am extremely tired.' },
                { es: 'Es facilísimo.', en: 'It\'s extremely easy.' },
              ],
            },
          ],
        },
      ],
    },
    {
      id: 15,
      title: 'Adverbs',
      sections: [
        {
          id: '16.1',
          title: 'Formation of Adverbs with -mente',
          blocks: [
            {
              type: 'text',
              content: 'Most adverbs are formed by adding "-mente" to the feminine singular form of the adjective.',
            },
            {
              type: 'rules',
              items: [
                'If the adjective has a masculine/feminine distinction, use the feminine form: lento → lenta → lentamente',
                'If the adjective has one form for both genders, add -mente directly: fácil → fácilmente',
                'When two -mente adverbs are linked by "y" or "o", only the last one takes -mente: "lenta y cuidadosamente" (slowly and carefully)',
                'Written accents on the adjective are kept: rápida → rápidamente',
              ],
            },
            {
              type: 'table',
              headers: ['Adjective', 'Feminine', 'Adverb'],
              rows: [
                ['rápido', 'rápida', 'rápidamente (quickly)'],
                ['lento', 'lenta', 'lentamente (slowly)'],
                ['tranquilo', 'tranquila', 'tranquilamente (calmly)'],
                ['fácil', 'fácil', 'fácilmente (easily)'],
                ['difícil', 'difícil', 'difícilmente (with difficulty)'],
                ['frecuente', 'frecuente', 'frecuentemente (frequently)'],
                ['feliz', 'feliz', 'felizmente (happily)'],
              ],
            },
          ],
        },
        {
          id: '16.2',
          title: 'Common Adverbs by Category',
          blocks: [
            {
              type: 'text',
              content: 'Time:',
            },
            {
              type: 'table',
              headers: ['Adverb', 'Meaning'],
              rows: [
                ['ahora', 'now'],
                ['ya', 'already / now'],
                ['todavía / aún', 'still / yet'],
                ['siempre', 'always'],
                ['nunca / jamás', 'never'],
                ['antes', 'before'],
                ['después', 'after'],
                ['pronto', 'soon'],
                ['tarde', 'late'],
                ['temprano', 'early'],
                ['entonces', 'then'],
                ['mientras', 'meanwhile'],
                ['recién', 'recently / just'],
              ],
            },
            {
              type: 'text',
              content: 'Place:',
            },
            {
              type: 'table',
              headers: ['Adverb', 'Meaning'],
              rows: [
                ['aquí / acá', 'here'],
                ['ahí', 'there (near you)'],
                ['allí / allá', 'there (far away)'],
                ['cerca', 'near'],
                ['lejos', 'far'],
                ['arriba', 'above / upstairs'],
                ['abajo', 'below / downstairs'],
                ['dentro', 'inside'],
                ['fuera', 'outside'],
                ['delante', 'in front'],
                ['detrás', 'behind'],
              ],
            },
            {
              type: 'text',
              content: 'Quantity:',
            },
            {
              type: 'table',
              headers: ['Adverb', 'Meaning'],
              rows: [
                ['mucho', 'a lot'],
                ['poco', 'a little'],
                ['bastante', 'quite / enough'],
                ['demasiado', 'too much'],
                ['más', 'more'],
                ['menos', 'less'],
                ['casi', 'almost'],
                ['apenas', 'barely'],
                ['solo / solamente', 'only'],
              ],
            },
            {
              type: 'text',
              content: 'Manner:',
            },
            {
              type: 'table',
              headers: ['Adverb', 'Meaning'],
              rows: [
                ['bien', 'well'],
                ['mal', 'badly'],
                ['así', 'like this / so'],
                ['despacio', 'slowly'],
                ['deprisa', 'quickly'],
                ['mejor', 'better'],
                ['peor', 'worse'],
              ],
            },
          ],
        },
        {
          id: '16.3',
          title: 'Adverb Placement',
          blocks: [
            {
              type: 'rules',
              items: [
                'Adverbs of manner usually follow the verb: "Habla lentamente." (He speaks slowly.)',
                'Adverbs of time and frequency can begin or end the sentence: "Siempre llega tarde." / "Llega tarde siempre."',
                '"Ya", "todavía", "nunca", "siempre" go before the verb: "Ya he comido." (I have already eaten.)',
                'In compound tenses, adverbs go before or after the whole verb phrase: "No he comido todavía." / "Todavía no he comido."',
                '"Nunca" and "jamás" can go before the verb (no "no" needed) or after with "no": "Nunca he estado allí." = "No he estado allí nunca."',
              ],
            },
            {
              type: 'examples',
              examples: [
                { es: 'Normalmente desayuno a las ocho.', en: 'I normally have breakfast at eight.' },
                { es: 'Ya han llegado los invitados.', en: 'The guests have already arrived.' },
                { es: 'No ha llamado todavía.', en: 'He hasn\'t called yet.' },
                { es: 'Apenas pude dormir anoche.', en: 'I could barely sleep last night.' },
              ],
            },
          ],
        },
      ],
    },
    {
      id: 16,
      title: 'Gerund and Progressive Tenses',
      sections: [
        {
          id: '17.1',
          title: 'Formation of the Gerund (Gerundio)',
          blocks: [
            {
              type: 'table',
              headers: ['Verb Type', 'Rule', 'Example'],
              rows: [
                ['-ar verbs', '-ando', 'hablar → hablando'],
                ['-er verbs', '-iendo', 'comer → comiendo'],
                ['-ir verbs', '-iendo', 'vivir → viviendo'],
              ],
            },
            {
              type: 'text',
              content: 'Irregular gerunds:',
            },
            {
              type: 'table',
              headers: ['Infinitive', 'Gerund', 'Rule'],
              rows: [
                ['leer', 'leyendo', '-iendo → -yendo after vowel'],
                ['oír', 'oyendo', '-iendo → -yendo after vowel'],
                ['ir', 'yendo', 'irregular'],
                ['dormir', 'durmiendo', 'o→u stem change'],
                ['morir', 'muriendo', 'o→u stem change'],
                ['sentir', 'sintiendo', 'e→i stem change'],
                ['pedir', 'pidiendo', 'e→i stem change'],
                ['decir', 'diciendo', 'e→i stem change'],
                ['venir', 'viniendo', 'e→i stem change'],
                ['poder', 'pudiendo', 'o→u stem change'],
              ],
            },
          ],
        },
        {
          id: '17.2',
          title: 'Progressive Tenses (Estar + Gerundio)',
          blocks: [
            {
              type: 'text',
              content: 'The most common progressive construction uses "estar" + gerund to describe an action in progress at a specific moment.',
            },
            {
              type: 'rules',
              items: [
                'Present progressive: "Estoy comiendo." (I am eating right now.)',
                'Past progressive (imperfect): "Estaba comiendo." (I was eating.)',
                'Used for actions happening at the moment of speaking — more specific than simple tenses',
                'Not used for future plans (unlike English "I am going tomorrow" — use "Voy mañana" in Spanish)',
              ],
            },
            {
              type: 'examples',
              examples: [
                { es: '¿Qué estás haciendo?', en: 'What are you doing?' },
                { es: 'Estaba lloviendo cuando salimos.', en: 'It was raining when we went out.' },
                { es: 'Estuve trabajando toda la noche.', en: 'I was working all night. (completed period)' },
                { es: 'Estaremos esperándote.', en: 'We will be waiting for you.' },
              ],
            },
          ],
        },
        {
          id: '17.3',
          title: 'Other Verbs with Gerund',
          blocks: [
            {
              type: 'table',
              headers: ['Construction', 'Meaning', 'Example'],
              rows: [
                ['seguir + gerundio', 'to keep on / to continue', '"Sigue lloviendo." — It keeps raining.'],
                ['continuar + gerundio', 'to continue', '"Continúa estudiando." — He continues studying.'],
                ['llevar + time + gerundio', 'to have been doing for', '"Llevo dos horas esperando." — I\'ve been waiting for two hours.'],
                ['ir + gerundio', 'gradual progression', '"Voy entendiendo." — I\'m gradually understanding.'],
                ['andar + gerundio', 'to go around doing', '"Anda buscando trabajo." — He\'s going around looking for work.'],
                ['quedarse + gerundio', 'to stay/remain doing', '"Se quedó durmiendo." — He stayed sleeping.'],
                ['acabar + gerundio', 'to end up doing', '"Acabé aceptando la oferta." — I ended up accepting the offer.'],
              ],
            },
          ],
        },
        {
          id: '17.4',
          title: 'Llevar + Gerundio (Duration)',
          blocks: [
            {
              type: 'text',
              content: 'This construction expresses how long an action has been going on. There is no direct equivalent in English.',
            },
            {
              type: 'text',
              content: 'Structure: Llevar (conjugated) + time expression + gerundio',
            },
            {
              type: 'rules',
              items: [
                'Present tense of "llevar" for actions still ongoing',
                'Imperfect of "llevar" for actions that were ongoing at a point in the past',
                'Negative form: "Llevo dos meses sin fumar." (I haven\'t smoked for two months.) — uses "sin + infinitive" instead of gerund',
              ],
            },
            {
              type: 'examples',
              examples: [
                { es: 'Llevo tres años estudiando español.', en: 'I have been studying Spanish for three years.' },
                { es: '¿Cuánto tiempo llevas viviendo aquí?', en: 'How long have you been living here?' },
                { es: 'Llevábamos una hora esperando cuando llegó.', en: 'We had been waiting for an hour when he arrived.' },
                { es: 'Lleva dos semanas sin hablarme.', en: 'He hasn\'t spoken to me for two weeks.' },
              ],
            },
          ],
        },
      ],
    },
    {
      id: 17,
      title: 'Negation and Negative Words',
      sections: [
        {
          id: '18.1',
          title: 'Basic Negation',
          blocks: [
            {
              type: 'text',
              content: 'Place "no" before the conjugated verb to negate a sentence.',
            },
            {
              type: 'examples',
              examples: [
                { es: 'No hablo francés.', en: 'I don\'t speak French.' },
                { es: 'No he terminado.', en: 'I haven\'t finished.' },
                { es: 'No lo sé.', en: 'I don\'t know.' },
              ],
            },
          ],
        },
        {
          id: '18.2',
          title: 'Negative Words (Palabras Negativas)',
          blocks: [
            {
              type: 'table',
              headers: ['Negative', 'Affirmative Opposite', 'Meaning'],
              rows: [
                ['no', 'sí', 'no / not'],
                ['nada', 'algo', 'nothing / anything'],
                ['nadie', 'alguien', 'nobody / anybody'],
                ['nunca / jamás', 'siempre', 'never'],
                ['ninguno/a', 'alguno/a', 'no / none / any'],
                ['tampoco', 'también', 'neither / not either'],
                ['ni', 'o', 'nor / not even'],
                ['ni... ni', 'o... o', 'neither... nor'],
              ],
            },
          ],
        },
        {
          id: '18.3',
          title: 'Double Negation',
          blocks: [
            {
              type: 'text',
              content: 'Spanish uses double negation, which is grammatically correct and required when a negative word follows the verb.',
            },
            {
              type: 'rules',
              items: [
                'Negative word before verb: no "no" needed — "Nadie vino." (Nobody came.)',
                'Negative word after verb: "no" before verb is required — "No vino nadie." (Nobody came.)',
                'Both constructions are correct and mean the same thing',
                'Multiple negative words can appear in one sentence',
              ],
            },
            {
              type: 'examples',
              examples: [
                { es: 'Nunca he estado en China. / No he estado nunca en China.', en: 'I have never been to China.' },
                { es: 'Nadie sabe nada. / No sabe nadie nada.', en: 'Nobody knows anything.' },
                { es: 'Tampoco quiero ir. / No quiero ir tampoco.', en: 'I don\'t want to go either.' },
                { es: 'No vi a nadie en ningún lugar.', en: 'I didn\'t see anyone anywhere.' },
                { es: 'Nunca le dije nada a nadie.', en: 'I never said anything to anyone.' },
              ],
            },
          ],
        },
        {
          id: '18.4',
          title: 'Ninguno / Ninguna',
          blocks: [
            {
              type: 'text',
              content: '"Ninguno" is an adjective/pronoun meaning "no" / "none" / "not any". It agrees in gender but is almost always singular.',
            },
            {
              type: 'rules',
              items: [
                'Before a masculine singular noun, "ninguno" shortens to "ningún": "ningún libro" (no book)',
                'Feminine form: "ninguna": "ninguna casa" (no house)',
                'Rarely used in plural (only with nouns that are always plural: "ningunas gafas" — no glasses)',
                'As a pronoun: "Ninguno de ellos vino." (None of them came.)',
              ],
            },
            {
              type: 'examples',
              examples: [
                { es: 'No tengo ningún problema.', en: 'I don\'t have any problem.' },
                { es: 'No hay ninguna tienda cerca.', en: 'There is no store nearby.' },
                { es: 'Ninguno de mis amigos habla chino.', en: 'None of my friends speaks Chinese.' },
              ],
            },
          ],
        },
        {
          id: '18.5',
          title: 'Ni... ni (Neither... nor)',
          blocks: [
            {
              type: 'examples',
              examples: [
                { es: 'No bebo ni café ni té.', en: 'I drink neither coffee nor tea.' },
                { es: 'Ni él ni ella vinieron.', en: 'Neither he nor she came.' },
                { es: 'No quiero ni hablar de eso.', en: 'I don\'t even want to talk about that.' },
                { es: 'No tengo ni idea.', en: 'I have no idea. (I don\'t have even an idea.)' },
              ],
            },
          ],
        },
      ],
    },
    {
      id: 18,
      title: 'Concessive and Contrastive Conjunctions',
      sections: [
        {
          id: '19.1',
          title: 'Aunque (Although / Even if)',
          blocks: [
            {
              type: 'text',
              content: '"Aunque" can take either the indicative or the subjunctive, with different meanings.',
            },
            {
              type: 'rules',
              items: [
                'Aunque + indicative = acknowledged fact: "Although..." (the speaker accepts it as true)',
                'Aunque + subjunctive = hypothetical or conceded possibility: "Even if..." (unknown, unconfirmed, or irrelevant)',
              ],
            },
            {
              type: 'examples',
              examples: [
                { es: 'Aunque llueve, voy a salir.', en: 'Although it\'s raining (I know it\'s raining), I\'m going out.' },
                { es: 'Aunque llueva, voy a salir.', en: 'Even if it rains (it might or might not), I\'m going out.' },
                { es: 'Aunque estaba cansado, siguió trabajando.', en: 'Although he was tired, he kept working. (indicative — fact)' },
                { es: 'Aunque esté cansado, seguirá trabajando.', en: 'Even if he is tired, he will keep working. (subjunctive — hypothetical)' },
              ],
            },
          ],
        },
        {
          id: '19.2',
          title: 'Pero vs. Sino',
          blocks: [
            {
              type: 'text',
              content: 'Both mean "but", but they are not interchangeable.',
            },
            {
              type: 'rules',
              items: [
                '"Pero" introduces a contrasting idea after any statement (affirmative or negative): equivalent to "but" / "however"',
                '"Sino" corrects a negative statement with the true alternative: "not X but Y"',
                '"Sino" is only used after a negative clause',
                '"Sino que" is used when both clauses have conjugated verbs',
              ],
            },
            {
              type: 'examples',
              examples: [
                { es: 'Es inteligente, pero perezoso.', en: 'He\'s intelligent, but lazy.' },
                { es: 'No es español, sino mexicano.', en: 'He\'s not Spanish, but (rather) Mexican.' },
                { es: 'No quiero café, sino té.', en: 'I don\'t want coffee, but (rather) tea.' },
                { es: 'No solo habla inglés, sino que también habla francés.', en: 'He doesn\'t only speak English, but he also speaks French.' },
                { es: 'No fui al cine, sino que me quedé en casa.', en: 'I didn\'t go to the cinema, but (rather) I stayed at home.' },
              ],
            },
          ],
        },
        {
          id: '19.3',
          title: 'Sin embargo / No obstante (However / Nevertheless)',
          blocks: [
            {
              type: 'text',
              content: 'These formal connectors introduce a contrasting idea. They function as sentence adverbs.',
            },
            {
              type: 'rules',
              items: [
                'Usually placed at the beginning of a sentence or clause, followed by a comma',
                'More formal than "pero"',
                '"Sin embargo" is more common; "no obstante" is more literary',
              ],
            },
            {
              type: 'examples',
              examples: [
                { es: 'Estudió mucho. Sin embargo, no aprobó el examen.', en: 'He studied a lot. However, he didn\'t pass the exam.' },
                { es: 'Es caro. No obstante, vale la pena.', en: 'It\'s expensive. Nevertheless, it\'s worth it.' },
              ],
            },
          ],
        },
        {
          id: '19.4',
          title: 'A pesar de (que) — In spite of / Despite',
          blocks: [
            {
              type: 'rules',
              items: [
                '"A pesar de" + noun / infinitive / pronoun',
                '"A pesar de que" + clause (indicative for facts, subjunctive for hypothetical)',
              ],
            },
            {
              type: 'examples',
              examples: [
                { es: 'A pesar del frío, salieron a caminar.', en: 'Despite the cold, they went out for a walk.' },
                { es: 'A pesar de estar enfermo, fue a trabajar.', en: 'Despite being sick, he went to work.' },
                { es: 'A pesar de que llovía, jugamos al fútbol.', en: 'Despite the fact that it was raining, we played soccer.' },
              ],
            },
          ],
        },
        {
          id: '19.5',
          title: 'Mientras que / En cambio (While / On the other hand)',
          blocks: [
            {
              type: 'text',
              content: 'Used to contrast two different situations or people.',
            },
            {
              type: 'examples',
              examples: [
                { es: 'Yo prefiero el mar, mientras que mi hermano prefiere la montaña.', en: 'I prefer the sea, while my brother prefers the mountains.' },
                { es: 'Ana estudia mucho. En cambio, Pedro no estudia nada.', en: 'Ana studies a lot. On the other hand, Pedro doesn\'t study at all.' },
              ],
            },
          ],
        },
        {
          id: '19.6',
          title: 'Other Useful Conjunctions',
          blocks: [
            {
              type: 'table',
              headers: ['Conjunction', 'Meaning', 'Example'],
              rows: [
                ['por lo tanto', 'therefore', '"Llovía mucho; por lo tanto, nos quedamos en casa."'],
                ['por eso', 'that\'s why', '"Estaba cansado, por eso no salí."'],
                ['así que', 'so / therefore', '"No había taxis, así que caminamos."'],
                ['ya que / puesto que', 'since / given that', '"Ya que estás aquí, ayúdame."'],
                ['como (at start of sentence)', 'since / as', '"Como no tenía dinero, no fui."'],
                ['en caso de que + subj.', 'in case', '"Lleva un paraguas en caso de que llueva."'],
                ['con tal de que + subj.', 'as long as / provided that', '"Iré con tal de que vengas tú también."'],
                ['a menos que + subj.', 'unless', '"No iré a menos que me inviten."'],
              ],
            },
          ],
        },
      ],
    },
    {
      id: 19,
      title: 'Direct and Indirect Speech — Summary Reference',
      sections: [
        {
          id: '20.1',
          title: 'Direct Speech (Estilo Directo)',
          blocks: [
            {
              type: 'text',
              content: 'Direct speech quotes the speaker\'s exact words, enclosed in quotation marks or preceded by a colon.',
            },
            {
              type: 'examples',
              examples: [
                { es: 'María dijo: "Estoy cansada."', en: 'Maria said: "I\'m tired."' },
                { es: '"Vendré mañana", prometió Juan.', en: '"I\'ll come tomorrow," Juan promised.' },
              ],
            },
          ],
        },
        {
          id: '20.2',
          title: 'Indirect Speech (Estilo Indirecto) — Complete Reference',
          blocks: [
            {
              type: 'text',
              content: 'Indirect speech reports what was said, adjusting tenses, pronouns, and time/place references.',
            },
            {
              type: 'text',
              content: 'Reporting verbs:',
            },
            {
              type: 'table',
              headers: ['Verb', 'Use'],
              rows: [
                ['decir (que)', 'to say (that) — statements'],
                ['preguntar (si/qué/dónde...)', 'to ask (if/what/where...) — questions'],
                ['pedir (que + subjunctive)', 'to ask / request (that) — requests'],
                ['ordenar / mandar (que + subj.)', 'to order (that) — commands'],
                ['aconsejar (que + subjunctive)', 'to advise (that) — advice'],
                ['sugerir (que + subjunctive)', 'to suggest (that) — suggestions'],
                ['explicar (que)', 'to explain (that)'],
                ['contar (que)', 'to tell / relate (that)'],
                ['responder (que)', 'to reply (that)'],
                ['añadir (que)', 'to add (that)'],
                ['prometer (que)', 'to promise (that)'],
                ['confesar (que)', 'to confess (that)'],
              ],
            },
          ],
        },
        {
          id: '20.3',
          title: 'Complete Backshifting Table',
          blocks: [
            {
              type: 'table',
              headers: ['Direct Speech', 'Reported Speech (past reporting verb)', 'Example'],
              rows: [
                ['Presente: "Trabajo aquí."', 'Imperfecto: Dijo que trabajaba allí.', '—'],
                ['Pret. perfecto: "He comido."', 'Pluscuamperfecto: Dijo que había comido.', '—'],
                ['Pret. indefinido: "Comí."', 'Pluscuamperfecto: Dijo que había comido.', '—'],
                ['Imperfecto: "Llovía."', 'Imperfecto: Dijo que llovía. (no change)', '—'],
                ['Pluscuamperfecto: "Había comido."', 'Pluscuamperfecto: Dijo que había comido. (no change)', '—'],
                ['Futuro: "Vendré."', 'Condicional: Dijo que vendría.', '—'],
                ['Condicional: "Iría."', 'Condicional: Dijo que iría. (no change)', '—'],
                ['Imperativo: "Come."', 'Impf. subjuntivo: Dijo que comiera.', '—'],
                ['Pres. subjuntivo: "...que coma."', 'Impf. subjuntivo: ...que comiera.', '—'],
              ],
            },
          ],
        },
        {
          id: '20.4',
          title: 'Comprehensive Examples',
          blocks: [
            {
              type: 'text',
              content: 'Statements:',
            },
            {
              type: 'examples',
              examples: [
                { es: '"Tengo frío." → Dijo que tenía frío.', en: 'He said he was cold.' },
                { es: '"He perdido las llaves." → Dijo que había perdido las llaves.', en: 'He said he had lost the keys.' },
                { es: '"Llamaré mañana." → Dijo que llamaría al día siguiente.', en: 'He said he would call the next day.' },
              ],
            },
            {
              type: 'text',
              content: 'Questions:',
            },
            {
              type: 'examples',
              examples: [
                { es: '"¿Estás bien?" → Me preguntó si estaba bien.', en: 'He asked me if I was okay.' },
                { es: '"¿Qué hora es?" → Preguntó qué hora era.', en: 'He asked what time it was.' },
                { es: '"¿Cuántos años tienes?" → Me preguntó cuántos años tenía.', en: 'He asked me how old I was.' },
              ],
            },
            {
              type: 'text',
              content: 'Commands:',
            },
            {
              type: 'examples',
              examples: [
                { es: '"Cierra la ventana." → Me pidió que cerrara la ventana.', en: 'He asked me to close the window.' },
                { es: '"No corras." → Me dijo que no corriera.', en: 'He told me not to run.' },
                { es: '"Siéntense, por favor." → Les pidió que se sentaran.', en: 'He asked them to sit down.' },
              ],
            },
            {
              type: 'text',
              content: 'Suggestions and advice:',
            },
            {
              type: 'examples',
              examples: [
                { es: '"Deberías descansar." → Me aconsejó que descansara.', en: 'He advised me to rest.' },
                { es: '"¿Por qué no vas al médico?" → Me sugirió que fuera al médico.', en: 'He suggested I go to the doctor.' },
              ],
            },
          ],
        },
      ],
    },
  ],
}
