import { GrammarLevel } from './types'

export const grammarC2: GrammarLevel = {
  level: 'C2',
  title: 'Mastery-Level Spanish Grammar',
  chapters: [
    {
      id: 0,
      title: 'The Subjunctive — Mastery',
      sections: [
        {
          id: '1.1',
          title: 'Subjunctive in Fixed and Idiomatic Expressions',
          blocks: [
            {
              type: 'text',
              content: 'At C2, the subjunctive appears in numerous fixed expressions, proverbs, and idiomatic constructions that must be recognized and produced naturally.',
            },
            {
              type: 'table',
              headers: ['Expression', 'Meaning', 'Example'],
              rows: [
                ['sea como sea', 'be that as it may', 'Sea como sea, hay que terminarlo.'],
                ['diga lo que diga', 'whatever he/she says', 'Diga lo que diga, no cambiaré de opinión.'],
                ['pase lo que pase', 'whatever happens', 'Pase lo que pase, estaré aquí.'],
                ['venga lo que venga', 'come what may', 'Venga lo que venga, estamos preparados.'],
                ['cueste lo que cueste', 'whatever it costs', 'Lo conseguiré, cueste lo que cueste.'],
                ['que yo sepa', 'as far as I know', 'Que yo sepa, no ha dimitido.'],
                ['que yo recuerde', 'as far as I remember', 'Que yo recuerde, nunca dijo eso.'],
                ['que digamos', 'so to speak / exactly', 'No es muy amable que digamos.'],
                ['no sea que / no vaya a ser que', 'lest / in case', 'Lleva paraguas, no sea que llueva.'],
                ['así sea', 'so be it / amen', 'Así sea.'],
              ],
            },
            {
              type: 'table',
              headers: ['Pattern', 'Meaning', 'Example'],
              rows: [
                ['quien + subj. + quien + subj.', 'whoever', 'Quien quiera que sea, no abras la puerta.'],
                ['donde + subj. + donde + subj.', 'wherever', 'Dondequiera que vayas, te encontraré.'],
                ['como + subj. + como + subj.', 'however', 'Comoquiera que lo hagas, estará bien.'],
                ['cuando + subj. + cuando + subj.', 'whenever', 'Cuando quiera que vengas, serás bienvenido.'],
              ],
            },
          ],
        },
        {
          id: '1.2',
          title: 'The -re Future Subjunctive (Futuro de Subjuntivo)',
          blocks: [
            {
              type: 'text',
              content: 'The future subjunctive is archaic in everyday Spanish but survives in legal texts, proverbs, and some fixed expressions. C2 learners should recognize it.',
            },
            {
              type: 'text',
              content: 'Formation: Same stem as the imperfect subjunctive (-ra form), with endings: -re, -res, -re, -remos, -reis, -ren',
            },
            {
              type: 'table',
              headers: ['Person', 'hablar', 'tener', 'ser/ir'],
              rows: [
                ['yo', 'hablare', 'tuviere', 'fuere'],
                ['tú', 'hablares', 'tuvieres', 'fueres'],
                ['él/ella/usted', 'hablare', 'tuviere', 'fuere'],
                ['nosotros/as', 'habláremos', 'tuviéremos', 'fuéremos'],
                ['vosotros/as', 'hablareis', 'tuviereis', 'fuereis'],
                ['ellos/ellas/ustedes', 'hablaren', 'tuvieren', 'fueren'],
              ],
            },
            {
              type: 'rules',
              items: [
                'Legal language: "El que infringiere esta ley será sancionado." — Whoever violates this law shall be sanctioned.',
                'Proverbs: "Adonde fueres, haz lo que vieres." — When in Rome, do as the Romans do.',
                'Fixed expressions: "Sea lo que fuere." — Be that as it may.',
              ],
            },
          ],
        },
        {
          id: '1.3',
          title: 'Alternation Between Indicative and Subjunctive in Nuanced Contexts',
          blocks: [
            {
              type: 'text',
              content: 'At C2, learners must handle borderline cases where either mood could be used, with subtle differences in meaning.',
            },
            {
              type: 'text',
              content: '"El hecho de que":',
            },
            {
              type: 'examples',
              examples: [
                { es: 'El hecho de que trabaja mucho es evidente.', en: 'Indicative — established fact' },
                { es: 'El hecho de que trabaje tanto no justifica su comportamiento.', en: 'Subjunctive — evaluative context' },
              ],
            },
            {
              type: 'text',
              content: '"No es que" (always subjunctive):',
            },
            {
              type: 'examples',
              examples: [
                { es: 'No es que no quiera, es que no puedo.', en: "It's not that I don't want to, it's that I can't." },
              ],
            },
            {
              type: 'text',
              content: '"Parece que" vs. "No parece que":',
            },
            {
              type: 'examples',
              examples: [
                { es: 'Parece que va a llover.', en: "It seems like it's going to rain. (indicative)" },
                { es: 'No parece que vaya a llover.', en: "It doesn't seem like it's going to rain. (subjunctive)" },
              ],
            },
            {
              type: 'text',
              content: '"Según" (depending on certainty):',
            },
            {
              type: 'examples',
              examples: [
                { es: 'Según dicen, va a llover.', en: "According to what they say, it's going to rain. (indicative — reported fact)" },
                { es: 'Según sea necesario.', en: 'As may be necessary. (subjunctive — contingent)' },
              ],
            },
          ],
        },
      ],
    },
    {
      id: 1,
      title: 'The Full Tense and Mood System — Integrated Mastery',
      sections: [
        {
          id: '2.1',
          title: 'Complete Tense/Mood Map',
          blocks: [
            {
              type: 'text',
              content: 'C2 requires complete command of every tense-mood combination.',
            },
            {
              type: 'text',
              content: 'Indicative tenses:',
            },
            {
              type: 'table',
              headers: ['Tense', 'Example (hablar)', 'Primary Use'],
              rows: [
                ['Presente', 'hablo', 'Current actions, habits, general truths'],
                ['Pretérito imperfecto', 'hablaba', 'Habitual past, description, ongoing past'],
                ['Pretérito indefinido', 'hablé', 'Completed past actions'],
                ['Pretérito perfecto', 'he hablado', 'Recent past, connection to present'],
                ['Pretérito pluscuamperfecto', 'había hablado', 'Past before another past'],
                ['Futuro simple', 'hablaré', 'Future, conjecture about present'],
                ['Futuro compuesto', 'habré hablado', 'Future perfect, conjecture about recent past'],
                ['Condicional simple', 'hablaría', 'Hypothetical, politeness, past conjecture'],
                ['Condicional compuesto', 'habría hablado', 'Past counterfactual, conjecture about remote past'],
              ],
            },
            {
              type: 'text',
              content: 'Subjunctive tenses:',
            },
            {
              type: 'table',
              headers: ['Tense', 'Example (hablar)', 'Primary Use'],
              rows: [
                ['Presente', 'hable', 'Present/future subjunctive contexts'],
                ['Pretérito imperfecto (-ra/-se)', 'hablara / hablase', 'Past subjunctive, hypothetical'],
                ['Pretérito perfecto', 'haya hablado', 'Completed action in subjunctive context'],
                ['Pretérito pluscuamperfecto', 'hubiera/hubiese hablado', 'Past counterfactual subjunctive'],
                ['Futuro (archaic)', 'hablare', 'Legal/literary/proverbial'],
              ],
            },
            {
              type: 'text',
              content: 'Imperative:',
            },
            {
              type: 'table',
              headers: ['Form', 'Example'],
              rows: [
                ['tú (affirmative)', 'habla'],
                ['tú (negative)', 'no hables'],
                ['usted', 'hable / no hable'],
                ['nosotros', 'hablemos / no hablemos'],
                ['vosotros (affirmative)', 'hablad'],
                ['vosotros (negative)', 'no habléis'],
                ['ustedes', 'hablen / no hablen'],
              ],
            },
          ],
        },
        {
          id: '2.2',
          title: 'The -ra Form as Conditional Alternative',
          blocks: [
            {
              type: 'text',
              content: 'In literary and journalistic Spanish, the imperfect subjunctive in -ra can replace the conditional or pluperfect indicative.',
            },
            {
              type: 'examples',
              examples: [
                { es: 'Quisiera hablar contigo.', en: 'Querría hablar contigo. — I would like to talk to you. (polite)' },
                { es: 'El presidente, que fuera elegido en 2020...', en: 'que fue elegido... — The president, who was elected in 2020... (journalistic)' },
                { es: 'Hubiera sido mejor no decir nada.', en: 'Habría sido mejor... — It would have been better not to say anything.' },
              ],
            },
          ],
        },
        {
          id: '2.3',
          title: 'Pretérito Anterior (Hubo + Past Participle)',
          blocks: [
            {
              type: 'text',
              content: 'The preterite perfect (pretérito anterior) is an archaic tense that survives in literary Spanish. It expresses an action completed immediately before another past action.',
            },
            {
              type: 'text',
              content: 'Formation: preterite of haber + past participle',
            },
            {
              type: 'table',
              headers: ['Person', 'Form'],
              rows: [
                ['yo', 'hube hablado'],
                ['tú', 'hubiste hablado'],
                ['él/ella/usted', 'hubo hablado'],
                ['nosotros/as', 'hubimos hablado'],
                ['vosotros/as', 'hubisteis hablado'],
                ['ellos/ellas/ustedes', 'hubieron hablado'],
              ],
            },
            {
              type: 'rules',
              items: [
                'Almost exclusively found in formal writing and literature',
                'Used after temporal conjunctions: en cuanto, apenas, tan pronto como, después de que, una vez que',
                'In modern speech, replaced by the pluperfect or simple preterite',
              ],
            },
            {
              type: 'examples',
              examples: [
                { es: 'Apenas hubo terminado, se marchó.', en: 'As soon as he had finished, he left.' },
                { es: 'En cuanto hubo recibido la noticia, llamó a su familia.', en: 'As soon as he had received the news, he called his family.' },
              ],
            },
          ],
        },
      ],
    },
    {
      id: 2,
      title: 'Advanced Sentence Structures',
      sections: [
        {
          id: '3.1',
          title: 'Absolute Constructions with Past Participle',
          blocks: [
            {
              type: 'text',
              content: 'The past participle can begin a clause with an absolute construction, equivalent to "once/with/having been + participle" in English.',
            },
            {
              type: 'text',
              content: 'Structure: Past participle (agreeing with noun) + noun + main clause',
            },
            {
              type: 'examples',
              examples: [
                { es: 'Terminada la reunión, todos se fueron.', en: 'The meeting being over, everyone left.' },
                { es: 'Una vez resuelto el problema, pudimos continuar.', en: 'Once the problem was resolved, we could continue.' },
                { es: 'Dicho esto, pasemos a otro tema.', en: "That said, let's move on to another topic." },
                { es: 'Vistas las pruebas, el juez dictó sentencia.', en: 'Having seen the evidence, the judge passed sentence.' },
                { es: 'Hechas las presentaciones, comenzó la cena.', en: 'Introductions having been made, dinner began.' },
              ],
            },
          ],
        },
        {
          id: '3.2',
          title: 'Absolute Constructions with Gerund',
          blocks: [
            {
              type: 'text',
              content: 'The gerund can also form absolute constructions indicating manner, cause, or simultaneity.',
            },
            {
              type: 'examples',
              examples: [
                { es: 'Habiendo terminado el trabajo, se fue a casa.', en: 'Having finished the work, he went home.' },
                { es: 'Siendo ya tarde, decidimos irnos.', en: 'It being late, we decided to leave.' },
                { es: 'No habiendo otra opción, aceptó.', en: 'There being no other option, he accepted.' },
              ],
            },
          ],
        },
        {
          id: '3.3',
          title: 'Advanced Cleft and Pseudo-Cleft Sentences',
          blocks: [
            {
              type: 'text',
              content: 'Cleft (oraciones hendidas):',
            },
            {
              type: 'examples',
              examples: [
                { es: 'Fue María la que lo descubrió.', en: 'It was Maria who discovered it.' },
                { es: 'Es en invierno cuando más llueve.', en: 'It is in winter when it rains the most.' },
                { es: 'Es por eso por lo que estoy aquí.', en: 'It is for that reason that I am here.' },
              ],
            },
            {
              type: 'text',
              content: 'Pseudo-cleft (oraciones pseudohendidas):',
            },
            {
              type: 'examples',
              examples: [
                { es: 'Lo que me preocupa es la economía.', en: 'What worries me is the economy.' },
                { es: 'Lo que hizo fue marcharse sin decir nada.', en: 'What he did was leave without saying anything.' },
                { es: 'Lo que necesitamos es más tiempo.', en: 'What we need is more time.' },
                { es: 'A quien buscan es a ti.', en: "The one they're looking for is you." },
              ],
            },
          ],
        },
        {
          id: '3.4',
          title: 'Correlative Structures',
          blocks: [
            {
              type: 'table',
              headers: ['Structure', 'Meaning', 'Example'],
              rows: [
                ['No solo... sino también', 'Not only... but also', 'No solo habla español, sino que también habla chino.'],
                ['Cuanto más... más', 'The more... the more', 'Cuanto más estudio, más aprendo.'],
                ['Cuanto menos... menos', 'The less... the less', 'Cuanto menos duermes, menos rindes.'],
                ['Cuanto más... menos', 'The more... the less', 'Cuanto más habla, menos le escuchan.'],
                ['Tanto... como', 'Both... and', 'Tanto los profesores como los alumnos están de acuerdo.'],
                ['Ni... ni', 'Neither... nor', 'Ni lo sé ni me importa.'],
                ['O... o', 'Either... or', 'O vienes ahora o te quedas.'],
                ['Ya... ya / Bien... bien', 'Whether... or', 'Ya llueva, ya haga sol, saldremos.'],
              ],
            },
          ],
        },
      ],
    },
    {
      id: 3,
      title: 'Stylistics and Rhetorical Devices',
      sections: [
        {
          id: '4.1',
          title: 'Rhetorical Questions',
          blocks: [
            {
              type: 'text',
              content: 'Questions used for effect rather than information.',
            },
            {
              type: 'examples',
              examples: [
                { es: '¿Acaso no lo dije yo desde el principio?', en: "Didn't I say so from the beginning?" },
                { es: '¿Quién no ha soñado alguna vez con viajar al espacio?', en: "Who hasn't dreamed of traveling to space?" },
                { es: '¿A quién le importa?', en: 'Who cares?' },
                { es: '¿Y qué más da?', en: 'And what does it matter?' },
              ],
            },
          ],
        },
        {
          id: '4.2',
          title: 'Litotes (Understatement through Negation)',
          blocks: [
            {
              type: 'text',
              content: 'Affirming something by negating its opposite.',
            },
            {
              type: 'examples',
              examples: [
                { es: 'No es mala idea.', en: "It's not a bad idea. (= it's a good idea)" },
                { es: 'No es poco lo que ha conseguido.', en: "What he has achieved is not little. (= it's impressive)" },
                { es: 'No deja de tener razón.', en: "He's not without reason. (= he has a point)" },
                { es: 'No me desagrada.', en: "It doesn't displease me. (= I like it)" },
              ],
            },
          ],
        },
        {
          id: '4.3',
          title: 'Hyperbaton (Altered Word Order for Effect)',
          blocks: [
            {
              type: 'text',
              content: 'Deliberately breaking normal word order for literary, poetic, or emphatic effect.',
            },
            {
              type: 'examples',
              examples: [
                { es: 'Grande fue su sorpresa.', en: 'Great was his surprise. (adjective fronted)' },
                { es: 'Del salón en el ángulo oscuro...', en: 'In the dark corner of the room... (Bécquer)' },
                { es: 'Triste estaba el rey.', en: 'Sad was the king.' },
              ],
            },
          ],
        },
        {
          id: '4.4',
          title: 'Ellipsis and Implied Elements',
          blocks: [
            {
              type: 'text',
              content: 'At C2, speakers use ellipsis freely, omitting elements recoverable from context.',
            },
            {
              type: 'examples',
              examples: [
                { es: '¿Vienes? — Sí (vengo).', en: 'Are you coming? — Yes (I am).' },
                { es: 'Yo quiero café y ella (quiere) té.', en: 'I want coffee and she (wants) tea.' },
                { es: 'Antes vivía en Madrid; ahora, (vivo) en Barcelona.', en: 'I used to live in Madrid; now, (I live) in Barcelona.' },
                { es: 'Los más jóvenes bailaban; los más viejos, (se sentaban y) observaban.', en: 'The younger ones danced; the older ones observed.' },
              ],
            },
          ],
        },
      ],
    },
    {
      id: 4,
      title: 'Modality and Evidentiality',
      sections: [
        {
          id: '5.1',
          title: 'Expressing Degrees of Certainty',
          blocks: [
            {
              type: 'text',
              content: 'C2 speakers modulate certainty with precision.',
            },
            {
              type: 'table',
              headers: ['Degree', 'Expression', 'Example'],
              rows: [
                ['Absolute certainty', 'Es evidente / indudable / innegable que + ind.', 'Es innegable que ha mejorado.'],
                ['High probability', 'Seguramente / probablemente / sin duda', 'Seguramente ya ha llegado.'],
                ['Moderate probability', 'Es probable que + subj. / Posiblemente', 'Es probable que venga.'],
                ['Low probability', 'Es poco probable que + subj. / Difícilmente', 'Es poco probable que apruebe.'],
                ['Mere possibility', 'Puede que + subj. / Quizá(s) / Tal vez', 'Puede que tenga razón.'],
                ['Speculation (present)', 'Future tense', 'Tendrá unos cuarenta años.'],
                ['Speculation (past)', 'Conditional tense', 'Serían las tres.'],
                ['Reported information', 'Según / Al parecer / Se dice que', 'Al parecer, han llegado a un acuerdo.'],
                ['Personal belief', 'A mi parecer / En mi opinión', 'A mi parecer, es una buena decisión.'],
                ['Disclaimer', 'Que yo sepa / Hasta donde sé', 'Que yo sepa, no ha cambiado nada.'],
              ],
            },
          ],
        },
        {
          id: '5.2',
          title: 'Quizá(s) / Tal vez / A lo mejor — Mood Choice',
          blocks: [
            {
              type: 'table',
              headers: ['Expression', 'Mood', 'Example'],
              rows: [
                ['quizá(s) / tal vez', 'indicative (more certainty) or subjunctive (less certainty)', 'Quizás viene. / Quizás venga.'],
                ['a lo mejor', 'always indicative', 'A lo mejor viene mañana.'],
                ['posiblemente / probablemente', 'indicative or subjunctive', 'Probablemente esté / está enfermo.'],
                ['igual (colloquial)', 'indicative', 'Igual viene mañana.'],
              ],
            },
            {
              type: 'rules',
              items: [
                '"A lo mejor" NEVER takes the subjunctive, unlike "quizás" and "tal vez."',
              ],
            },
          ],
        },
        {
          id: '5.3',
          title: 'Conditional Politeness — Full Range',
          blocks: [
            {
              type: 'table',
              headers: ['Less polite → More polite', 'Example'],
              rows: [
                ['Quiero...', 'Quiero un café.'],
                ['Querría...', 'Querría un café, por favor.'],
                ['Quisiera...', 'Quisiera un café, por favor.'],
                ['Me gustaría...', 'Me gustaría pedir un café.'],
                ['¿Podría...?', '¿Podría traerme un café?'],
                ['¿Sería tan amable de...?', '¿Sería tan amable de traerme un café?'],
                ['¿Le importaría...?', '¿Le importaría traerme un café?'],
                ['Si no es mucha molestia...', 'Si no es mucha molestia, ¿podría traerme un café?'],
              ],
            },
          ],
        },
      ],
    },
    {
      id: 5,
      title: 'Complex Reported Speech',
      sections: [
        {
          id: '6.1',
          title: 'Reported Speech with Multiple Tense Shifts',
          blocks: [
            {
              type: 'text',
              content: 'In extended reported speech, multiple tenses may shift simultaneously.',
            },
            {
              type: 'text',
              content: 'Direct: "Ayer fui al médico, me dijo que estaba bien, pero que debería hacer más ejercicio. Mañana empezaré."',
            },
            {
              type: 'text',
              content: 'Reported: Dijo que el día anterior había ido al médico, que le había dicho que estaba bien, pero que debería hacer más ejercicio. (Dijo) que al día siguiente empezaría.',
            },
          ],
        },
        {
          id: '6.2',
          title: 'Reported Speech with Subjunctive Commands',
          blocks: [
            {
              type: 'text',
              content: 'Commands, requests, and suggestions in reported speech always use the subjunctive.',
            },
            {
              type: 'examples',
              examples: [
                { es: '"Estudia más." → Le dijo que estudiara más.', en: 'Direct command reported with subjunctive' },
                { es: '"No hables tan alto." → Le pidió que no hablara tan alto.', en: 'Negative command reported with subjunctive' },
                { es: '"Sería mejor que descansaras." → Le sugirió que descansara.', en: 'Suggestion reported with subjunctive' },
                { es: '"¡Ojalá vengas!" → Expresó su deseo de que viniera.', en: 'Wish reported with subjunctive' },
              ],
            },
          ],
        },
        {
          id: '6.3',
          title: 'Reporting Verbs — Extended Inventory',
          blocks: [
            {
              type: 'table',
              headers: ['Verb', 'Register', 'Nuance'],
              rows: [
                ['manifestar', 'formal', 'to state / declare'],
                ['aseverar', 'formal', 'to assert / aver'],
                ['alegar', 'formal/legal', 'to allege'],
                ['matizar', 'formal', 'to qualify / nuance'],
                ['apostillar', 'formal', 'to annotate / add'],
                ['recalcar', 'neutral', 'to emphasize'],
                ['insinuar', 'neutral', 'to insinuate / hint'],
                ['reprochar', 'neutral', 'to reproach'],
                ['lamentarse de que', 'neutral', 'to lament'],
                ['jactarse de que', 'neutral', 'to boast'],
                ['advertir', 'neutral', 'to warn'],
                ['recriminar', 'neutral', 'to recriminate'],
              ],
            },
          ],
        },
      ],
    },
    {
      id: 6,
      title: 'Dialectal Variation',
      sections: [
        {
          id: '7.1',
          title: 'Voseo',
          blocks: [
            {
              type: 'text',
              content: '"Vos" replaces "tú" in Argentina, Uruguay, Paraguay, and parts of Central America and Colombia. Verb forms differ.',
            },
            {
              type: 'text',
              content: 'Present indicative (vos):',
            },
            {
              type: 'table',
              headers: ['Standard (tú)', 'Voseo (vos)'],
              rows: [
                ['hablas', 'hablás'],
                ['comes', 'comés'],
                ['vives', 'vivís'],
                ['tienes', 'tenés'],
                ['puedes', 'podés'],
                ['quieres', 'querés'],
                ['vienes', 'venís'],
                ['dices', 'decís'],
                ['eres', 'sos'],
              ],
            },
            {
              type: 'text',
              content: 'Imperative (vos):',
            },
            {
              type: 'table',
              headers: ['Standard (tú)', 'Voseo (vos)'],
              rows: [
                ['habla', 'hablá'],
                ['come', 'comé'],
                ['vive', 'viví'],
                ['ven', 'vení'],
                ['di', 'decí'],
                ['sal', 'salí'],
              ],
            },
            {
              type: 'rules',
              items: [
                'Voseo is standard and prestigious in Argentina and Uruguay',
                'In other regions it may be informal or regional',
                'Negative commands often revert to tú forms: "No hablés" (some regions) or "No hables" (others)',
              ],
            },
          ],
        },
        {
          id: '7.2',
          title: 'Seseo, Ceceo, and Distinción',
          blocks: [
            {
              type: 'table',
              headers: ['Pattern', 'Where', 'Description'],
              rows: [
                ['Distinción', 'Northern and central Spain', '"c" (before e/i) and "z" = /\u03B8/ (like "th"); "s" = /s/'],
                ['Seseo', 'Latin America, Canary Islands, parts of southern Spain', '"c" (before e/i), "z", and "s" are all pronounced /s/'],
                ['Ceceo', 'Some parts of southern Spain', '"c" (before e/i), "z", and "s" are all pronounced /\u03B8/'],
              ],
            },
          ],
        },
        {
          id: '7.3',
          title: 'Leísmo, Laísmo, Loísmo',
          blocks: [
            {
              type: 'table',
              headers: ['Phenomenon', 'What happens', 'Region', 'Acceptance'],
              rows: [
                ['Leísmo', '"le" used as masculine direct object for persons', 'Central Spain', 'Accepted by RAE (for masc. sing. person)'],
                ['Laísmo', '"la" used as feminine indirect object', 'Parts of central Spain', 'Not accepted by RAE'],
                ['Loísmo', '"lo" used as masculine indirect object', 'Very limited areas', 'Not accepted by RAE'],
              ],
            },
          ],
        },
        {
          id: '7.4',
          title: 'Ustedes vs. Vosotros',
          blocks: [
            {
              type: 'table',
              headers: ['Region', 'Informal plural "you"', 'Formal plural "you"'],
              rows: [
                ['Spain', 'vosotros/as', 'ustedes'],
                ['Latin America', 'ustedes', 'ustedes'],
              ],
            },
          ],
        },
        {
          id: '7.5',
          title: 'Pretérito Perfecto vs. Pretérito Indefinido',
          blocks: [
            {
              type: 'table',
              headers: ['Region', '"Hoy he comido paella."', '"Hoy comí paella."'],
              rows: [
                ['Spain (most)', 'Preferred for same-day events', 'Less common for today'],
                ['Latin America (most)', 'Less common', 'Preferred even for today'],
              ],
            },
          ],
        },
        {
          id: '7.6',
          title: 'Diminutives — Regional Variation',
          blocks: [
            {
              type: 'table',
              headers: ['Suffix', 'Region', 'Example'],
              rows: [
                ['-ito/a', 'Standard everywhere', 'casita, perrito'],
                ['-ico/a', 'Colombia, Costa Rica, Aragon', 'momentico, ratico'],
                ['-illo/a', 'Southern Spain', 'pueblecillo'],
                ['-iño/a', 'Galicia', 'pocoiño'],
                ['-ín/a', 'Asturias, León', 'pequeñín'],
              ],
            },
          ],
        },
      ],
    },
    {
      id: 7,
      title: 'Nominalization and Advanced Word Formation',
      sections: [
        {
          id: '8.1',
          title: 'Lo + Adjective (Nominalization)',
          blocks: [
            {
              type: 'text',
              content: '"Lo" + adjective creates an abstract noun meaning "the ... thing" or "what is ..."',
            },
            {
              type: 'examples',
              examples: [
                { es: 'Lo importante es la salud.', en: 'The important thing is health.' },
                { es: 'Lo bueno de vivir aquí es el clima.', en: 'The good thing about living here is the climate.' },
                { es: 'Lo peor ha pasado.', en: 'The worst is over.' },
                { es: 'Lo difícil es empezar.', en: 'The hard part is starting.' },
                { es: 'No sabes lo cansado que estoy.', en: "You don't know how tired I am." },
                { es: 'Admiro lo bien que habla.', en: 'I admire how well she speaks.' },
              ],
            },
          ],
        },
        {
          id: '8.2',
          title: 'Lo + Adverb / Lo + de',
          blocks: [
            {
              type: 'text',
              content: 'Lo + adverb:',
            },
            {
              type: 'examples',
              examples: [
                { es: 'Lo bien que cocina es impresionante.', en: 'How well she cooks is impressive.' },
                { es: 'No imaginas lo rápido que pasó el tiempo.', en: "You can't imagine how quickly time passed." },
              ],
            },
            {
              type: 'text',
              content: 'Lo de (the matter of / the thing about):',
            },
            {
              type: 'examples',
              examples: [
                { es: 'Lo de ayer fue un malentendido.', en: 'What happened yesterday was a misunderstanding.' },
                { es: '¿Qué sabes de lo de Juan?', en: 'What do you know about the Juan situation?' },
                { es: 'Lo de siempre.', en: 'The usual.' },
              ],
            },
          ],
        },
        {
          id: '8.3',
          title: 'Advanced Suffixes and Derivation',
          blocks: [
            {
              type: 'text',
              content: 'Augmentatives:',
            },
            {
              type: 'table',
              headers: ['Suffix', 'Connotation', 'Example'],
              rows: [
                ['-azo/a', 'large / impressive / blow', 'cochazo (huge car), portazo (door slam)'],
                ['-ón/ona', 'large / augmentative', 'casona (big house), solterón (confirmed bachelor)'],
                ['-ote/a', 'large (sometimes pejorative)', 'grandote (really big), amigote (close buddy)'],
              ],
            },
            {
              type: 'text',
              content: 'Pejoratives:',
            },
            {
              type: 'table',
              headers: ['Suffix', 'Connotation', 'Example'],
              rows: [
                ['-ucho/a', 'shabby / poor quality', 'casucha (hovel), periodicucho (rag newspaper)'],
                ['-ejo/a', 'slightly pejorative', 'animalejo (little creature), librejo (bad book)'],
                ['-astro/a', 'relationship (pejorative)', 'madrastra (stepmother), poetastro (bad poet)'],
              ],
            },
            {
              type: 'text',
              content: 'Verbs from nouns/adjectives:',
            },
            {
              type: 'table',
              headers: ['Pattern', 'Example'],
              rows: [
                ['-izar', 'modernizar, legalizar, hospitalizar'],
                ['-ificar', 'simplificar, intensificar, clasificar'],
                ['-ear', 'golpear (to hit), pasear (to stroll), teclear (to type)'],
                ['en-...-ar', 'engordar (to fatten), enfriar (to cool), endurecer (to harden)'],
                ['a-...-ar', 'agrupar (to group), acomodar (to accommodate)'],
              ],
            },
          ],
        },
      ],
    },
    {
      id: 8,
      title: 'Pragmatics and Communicative Functions',
      sections: [
        {
          id: '9.1',
          title: 'Expressing Agreement and Disagreement',
          blocks: [
            {
              type: 'text',
              content: 'Agreement (from mild to strong):',
            },
            {
              type: 'rules',
              items: [
                'Bueno, sí... / Puede ser... / Tienes razón...',
                'Desde luego / Sin duda / Por supuesto',
                'Totalmente de acuerdo / No podría estar más de acuerdo',
              ],
            },
            {
              type: 'text',
              content: 'Partial agreement:',
            },
            {
              type: 'rules',
              items: [
                'Sí, pero...',
                'En parte tienes razón, pero...',
                'Es cierto que..., sin embargo...',
                'Hasta cierto punto, sí, pero...',
              ],
            },
            {
              type: 'text',
              content: 'Disagreement (from mild to strong):',
            },
            {
              type: 'rules',
              items: [
                'No estoy del todo de acuerdo...',
                'No lo veo así... / Permíteme discrepar...',
                'No comparto esa opinión / Con todos los respetos, creo que...',
                'Me temo que no puedo estar de acuerdo / Lamento discrepar, pero...',
              ],
            },
          ],
        },
        {
          id: '9.2',
          title: 'Expressing Speculation and Hypothesis',
          blocks: [
            {
              type: 'text',
              content: 'About the present:',
            },
            {
              type: 'examples',
              examples: [
                { es: 'Estará en casa.', en: 'He must be at home.' },
                { es: 'Puede que esté enfermo.', en: 'He might be sick.' },
                { es: 'A lo mejor tiene razón.', en: "Maybe he's right." },
                { es: 'Supongo que vendrá.', en: "I suppose he'll come." },
                { es: 'Me imagino que estará cansado.', en: 'I imagine he must be tired.' },
              ],
            },
            {
              type: 'text',
              content: 'About the past:',
            },
            {
              type: 'examples',
              examples: [
                { es: 'Habría salido antes de la tormenta.', en: 'He must have left before the storm.' },
                { es: 'Puede que no lo supiera.', en: 'He may not have known.' },
                { es: 'Debió de ser difícil.', en: 'It must have been difficult.' },
              ],
            },
          ],
        },
        {
          id: '9.3',
          title: 'Expressing Cause, Purpose, and Consequence — Refined',
          blocks: [
            {
              type: 'text',
              content: 'Cause (because):',
            },
            {
              type: 'rules',
              items: [
                'porque / ya que / puesto que / dado que / visto que / en vista de que / habida cuenta de que / a causa de que / debido a que',
              ],
            },
            {
              type: 'examples',
              examples: [
                { es: 'Habida cuenta de las circunstancias, no tuvimos otra opción.', en: 'Given the circumstances, we had no other choice.' },
              ],
            },
            {
              type: 'text',
              content: 'Purpose (so that):',
            },
            {
              type: 'rules',
              items: [
                'para que + subj. / a fin de que + subj. / con el objeto de que + subj. / con vistas a que + subj. / de modo que + subj. (purpose) / de manera que + subj. (purpose)',
              ],
            },
            {
              type: 'examples',
              examples: [
                { es: 'Lo organizaron con vistas a que todos pudieran participar.', en: 'They organized it so that everyone could participate.' },
              ],
            },
            {
              type: 'text',
              content: 'Consequence (so that — result):',
            },
            {
              type: 'rules',
              items: [
                'de modo que + ind. / de manera que + ind. / de tal forma que / de ahí que + subj. / hasta tal punto que',
              ],
            },
            {
              type: 'examples',
              examples: [
                { es: 'Llovió tanto que se inundó la calle.', en: 'It rained so much that the street flooded.' },
                { es: 'Trabajó hasta tal punto que enfermó.', en: 'He worked to such an extent that he fell ill.' },
              ],
            },
          ],
        },
      ],
    },
    {
      id: 9,
      title: 'Text Types and Registers',
      sections: [
        {
          id: '10.1',
          title: 'Academic Register',
          blocks: [
            {
              type: 'text',
              content: 'C2 speakers produce formal academic prose.',
            },
            {
              type: 'text',
              content: 'Characteristic features:',
            },
            {
              type: 'rules',
              items: [
                'Impersonal constructions: "Se ha demostrado que..." / "Cabe señalar que..." / "Conviene destacar que..."',
                'Passive voice: "Ha sido ampliamente estudiado..."',
                'Nominal style (nominalizations): "la realización del proyecto" instead of "realizar el proyecto"',
                'Hedging: "parece indicar" / "sugiere que" / "cabría afirmar que"',
                'Formal connectors: "No obstante" / "Asimismo" / "En lo que concierne a" / "Por consiguiente"',
              ],
            },
            {
              type: 'text',
              content: 'Example passage:',
            },
            {
              type: 'examples',
              examples: [
                { es: 'El presente estudio tiene como objetivo analizar las variables que inciden en el rendimiento académico. Tal y como se ha demostrado en investigaciones previas, factores como la motivación y el entorno socioeconómico desempeñan un papel determinante. No obstante, conviene señalar que los resultados obtenidos no son concluyentes, habida cuenta de las limitaciones metodológicas del estudio.', en: 'Example of formal academic prose demonstrating impersonal constructions, hedging, and formal connectors.' },
              ],
            },
          ],
        },
        {
          id: '10.2',
          title: 'Journalistic Register',
          blocks: [
            {
              type: 'text',
              content: 'Characteristic features:',
            },
            {
              type: 'rules',
              items: [
                'Passive voice and impersonal se: "Se espera que..." / "Se ha confirmado que..."',
                'Reported speech with varied reporting verbs: "manifestó" / "declaró" / "recalcó" / "insinuó"',
                'Historical present for vividness',
                '-ra subjunctive as conditional: "El acuerdo, que lograra grandes avances..."',
                'Nominal phrases: "la toma de decisiones" / "el punto de inflexión"',
              ],
            },
          ],
        },
        {
          id: '10.3',
          title: 'Literary Register',
          blocks: [
            {
              type: 'text',
              content: 'Characteristic features:',
            },
            {
              type: 'rules',
              items: [
                'Hyperbaton: "Triste y solitaria quedó la casa."',
                'Subjective use of estar: "Estaba la noche oscura y silenciosa."',
                'Future subjunctive in proverbs: "Adonde fueres, haz lo que vieres."',
                'Rich use of gerund and participle clauses',
                'Pretérito anterior: "Apenas hubo hablado, se arrepintió."',
              ],
            },
          ],
        },
      ],
    },
    {
      id: 10,
      title: 'Error-Prone Areas at C2',
      sections: [
        {
          id: '11.1',
          title: 'Dequeísmo and Queísmo',
          blocks: [
            {
              type: 'text',
              content: 'Dequeísmo (incorrect): Adding "de" before "que" where it doesn\'t belong.',
            },
            {
              type: 'examples',
              examples: [
                { es: 'Incorrect: "Creo de que es verdad." → Correct: "Creo que es verdad."', en: 'Removing the incorrect "de"' },
                { es: 'Incorrect: "Pienso de que tiene razón." → Correct: "Pienso que tiene razón."', en: 'Removing the incorrect "de"' },
              ],
            },
            {
              type: 'text',
              content: 'Queísmo (incorrect): Omitting "de" before "que" where it\'s required.',
            },
            {
              type: 'examples',
              examples: [
                { es: 'Incorrect: "Me alegro que estés bien." → Correct: "Me alegro de que estés bien."', en: 'Adding the required "de"' },
                { es: 'Incorrect: "Estoy seguro que vendrá." → Correct: "Estoy seguro de que vendrá."', en: 'Adding the required "de"' },
              ],
            },
            {
              type: 'rules',
              items: [
                'Test: Replace the subordinate clause with "eso/algo" — if "de" is needed, keep it.',
                '"Me alegro de eso." → "Me alegro de que..." (de is needed)',
                '"Creo eso." → "Creo que..." (no de)',
              ],
            },
          ],
        },
        {
          id: '11.2',
          title: 'Concordancia (Agreement) in Complex Sentences',
          blocks: [
            {
              type: 'text',
              content: 'Subject-verb agreement with collective nouns:',
            },
            {
              type: 'examples',
              examples: [
                { es: 'La mayoría de los estudiantes aprobó/aprobaron.', en: 'Both singular and plural are accepted.' },
                { es: 'Un grupo de turistas visitó/visitaron el museo.', en: 'Both are accepted.' },
              ],
            },
            {
              type: 'rules',
              items: [
                'With "cada uno": always singular: "Cada uno de ellos tiene su opinión."',
                'Agreement with "uno de los que": "Es uno de los que más trabaja/trabajan." — Both accepted; plural is slightly preferred.',
              ],
            },
          ],
        },
        {
          id: '11.3',
          title: 'Ser vs. Estar — Final Subtleties',
          blocks: [
            {
              type: 'text',
              content: '"Ser listo" vs. "Estar listo": Most adjective pairs are well-established at B2, but C2 requires complete automaticity.',
            },
            {
              type: 'text',
              content: 'Estar + adjectives normally associated with ser (surprise/change):',
            },
            {
              type: 'examples',
              examples: [
                { es: '¡Estás muy guapa!', en: 'You look gorgeous! (changed state)' },
                { es: 'La ciudad está muy cambiada.', en: 'The city has changed a lot.' },
              ],
            },
            {
              type: 'text',
              content: 'Ser with "estar-type" adjectives for classification:',
            },
            {
              type: 'examples',
              examples: [
                { es: 'Eso es estar loco.', en: "That's (what it means) to be crazy. (defining)" },
              ],
            },
          ],
        },
      ],
    },
    {
      id: 11,
      title: 'Proverbs and Idiomatic Mastery',
      sections: [
        {
          id: '12.1',
          title: 'Common Proverbs (Refranes)',
          blocks: [
            {
              type: 'table',
              headers: ['Proverb', 'Meaning'],
              rows: [
                ['A buen entendedor, pocas palabras (bastan).', 'A word to the wise is sufficient.'],
                ['Más vale tarde que nunca.', 'Better late than never.'],
                ['No hay mal que por bien no venga.', 'Every cloud has a silver lining.'],
                ['En boca cerrada no entran moscas.', 'Silence is golden.'],
                ['Dime con quién andas y te diré quién eres.', 'A man is known by the company he keeps.'],
                ["A caballo regalado no le mires el diente.", "Don't look a gift horse in the mouth."],
                ['El que mucho abarca, poco aprieta.', 'Jack of all trades, master of none.'],
                ['Quien mucho duerme, poco aprende.', 'He who sleeps a lot, learns little.'],
                ['No por mucho madrugar amanece más temprano.', 'Things take time no matter how early you start.'],
                ['Más vale prevenir que curar.', 'Prevention is better than cure.'],
                ["A falta de pan, buenas son tortas.", "Beggars can't be choosers."],
                ['Donde fueres, haz lo que vieres.', 'When in Rome, do as the Romans do.'],
              ],
            },
          ],
        },
        {
          id: '12.2',
          title: 'Idiomatic Expressions — Advanced',
          blocks: [
            {
              type: 'table',
              headers: ['Expression', 'Meaning'],
              rows: [
                ['No tener pelos en la lengua', 'To not mince words'],
                ['Estar en las nubes', "To have one's head in the clouds"],
                ['Dar en el clavo', 'To hit the nail on the head'],
                ['Meter la pata', "To put one's foot in it"],
                ['Tomar el pelo a alguien', "To pull someone's leg"],
                ['Estar hasta las narices', 'To be fed up'],
                ['No dar pie con bola', 'To not get anything right'],
                ['Quedarse en blanco', 'To go blank'],
                ['Dar la vuelta a la tortilla', 'To turn the tables'],
                ['Ir al grano', 'To get to the point'],
                ['Ponerse las pilas', "To get one's act together"],
                ['Ser pan comido', 'To be a piece of cake'],
                ['Costar un ojo de la cara', 'To cost an arm and a leg'],
                ['Echar una mano', 'To lend a hand'],
                ['Dormir como un tronco', 'To sleep like a log'],
                ['Estar como una cabra', 'To be crazy'],
                ['Llover a cántaros', 'To rain cats and dogs'],
                ['No tener ni pies ni cabeza', 'To make no sense at all'],
              ],
            },
          ],
        },
      ],
    },
  ],
}
