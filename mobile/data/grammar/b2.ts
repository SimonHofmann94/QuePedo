import { GrammarLevel } from './types'

export const grammarB2: GrammarLevel = {
  level: 'B2',
  title: 'Upper-Intermediate Spanish Grammar',
  chapters: [
    {
      id: 0,
      title: 'Preterite vs. Imperfect — Advanced Narrative Use',
      sections: [
        {
          id: '1.1',
          title: 'Core Contrast in Extended Narratives',
          blocks: [
            {
              type: 'text',
              content:
                'At B2 level, learners must master the contrast between preterite and imperfect not just in isolated sentences but across extended narratives and discourse. The two tenses work together to build layered stories.',
            },
            {
              type: 'rules',
              items: [
                'The preterite (preterito indefinido) narrates completed, sequential events that advance the plot',
                'The imperfect (preterito imperfecto) describes ongoing background states, habitual past actions, and simultaneous conditions',
                'Within a single paragraph, both tenses typically coexist: the imperfect sets the scene, while the preterite moves the action forward',
              ],
            },
            {
              type: 'table',
              headers: ['Role', 'Tense', 'Function'],
              rows: [
                ['Background / scene-setting', 'Imperfect', 'Describes what was happening'],
                ['Main event / plot action', 'Preterite', 'Narrates what happened'],
                ['Interruption pattern', 'Imperfect + Preterite', 'Ongoing action interrupted by event'],
                ['Simultaneous background', 'Imperfect + Imperfect', 'Two concurrent background actions'],
              ],
            },
            {
              type: 'examples',
              examples: [
                {
                  es: 'Era una noche fría. Llovía mucho y no había nadie en la calle. De repente, un hombre entró en el bar y pidió un café.',
                  en: 'It was a cold night. It was raining hard and there was nobody on the street. Suddenly, a man entered the bar and ordered a coffee.',
                },
                {
                  es: 'Yo estudiaba cuando el teléfono sonó.',
                  en: 'I was studying when the phone rang.',
                },
                {
                  es: 'Conducíamos por la autopista cuando empezó a llover.',
                  en: 'We were driving on the highway when it started to rain.',
                },
              ],
            },
          ],
        },
        {
          id: '1.2',
          title: 'Simultaneous Actions with Mientras',
          blocks: [
            {
              type: 'text',
              content:
                'When two background actions happen at the same time, both use the imperfect.',
            },
            {
              type: 'examples',
              examples: [
                {
                  es: 'Yo cocinaba mientras mi hermano hacía la tarea.',
                  en: 'I was cooking while my brother was doing homework.',
                },
                {
                  es: 'Mi madre leía el periódico mientras mi padre preparaba el desayuno.',
                  en: 'My mother was reading the newspaper while my father was making breakfast.',
                },
              ],
            },
          ],
        },
        {
          id: '1.3',
          title: 'Contrast Between State and Turning Point',
          blocks: [
            {
              type: 'text',
              content:
                'The imperfect describes a prior state; the preterite marks the moment of change.',
            },
            {
              type: 'examples',
              examples: [
                {
                  es: 'Antes era tímido, pero un día decidí cambiar.',
                  en: 'I used to be shy, but one day I decided to change.',
                },
                {
                  es: 'Vivíamos en el campo hasta que mi padre encontró trabajo en la ciudad.',
                  en: 'We lived in the countryside until my father found work in the city.',
                },
              ],
            },
          ],
        },
        {
          id: '1.4',
          title: 'Verbs That Change Meaning by Tense',
          blocks: [
            {
              type: 'text',
              content:
                'Certain verbs carry different nuances depending on whether they appear in the preterite or imperfect.',
            },
            {
              type: 'table',
              headers: ['Verb', 'Imperfect meaning', 'Preterite meaning'],
              rows: [
                ['querer', 'wanted (ongoing desire)', 'tried to'],
                ['no querer', 'did not want', 'refused'],
                ['poder', 'was able to (general ability)', 'managed to / succeeded'],
                ['no poder', 'was unable to (general)', 'failed to (specific attempt)'],
                ['saber', 'knew (a fact)', 'found out / discovered'],
                ['tener', 'had / possessed', 'received / got'],
                ['conocer', 'knew (a person)', 'met (for the first time)'],
              ],
            },
            {
              type: 'examples',
              examples: [
                {
                  es: 'Quería ir a la fiesta, pero no pude encontrar un taxi.',
                  en: "I wanted to go to the party, but I couldn't find a taxi.",
                },
                {
                  es: 'Conocía a María desde la infancia, pero conocí a su hermana ayer.',
                  en: 'I had known Maria since childhood, but I met her sister yesterday.',
                },
                {
                  es: 'Ya sabía la verdad, pero ella supo la noticia esa mañana.',
                  en: 'I already knew the truth, but she found out the news that morning.',
                },
              ],
            },
          ],
        },
        {
          id: '1.5',
          title: 'Pluperfect Indicative — Review',
          blocks: [
            {
              type: 'text',
              content:
                'The pluperfect (preterito pluscuamperfecto) expresses an action completed before another past action. It establishes a "past-before-the-past" timeline.',
            },
            {
              type: 'text',
              content: 'Formation: imperfect of haber + past participle',
            },
            {
              type: 'table',
              headers: ['Person', 'Haber (imperfect)', 'Example'],
              rows: [
                ['yo', 'había', 'había comido'],
                ['tú', 'habías', 'habías llegado'],
                ['él/ella/usted', 'había', 'había salido'],
                ['nosotros/as', 'habíamos', 'habíamos visto'],
                ['vosotros/as', 'habíais', 'habíais dormido'],
                ['ellos/ellas/ustedes', 'habían', 'habían terminado'],
              ],
            },
            {
              type: 'rules',
              items: [
                'Common irregular past participles: dicho (decir), hecho (hacer), escrito (escribir), visto (ver), puesto (poner), vuelto (volver), abierto (abrir), roto (romper), muerto (morir), cubierto (cubrir)',
                'The past participle does not change in gender or number in compound tenses',
              ],
            },
            {
              type: 'examples',
              examples: [
                {
                  es: 'Cuando llegué a la fiesta, todos ya se habían ido.',
                  en: 'When I arrived at the party, everyone had already left.',
                },
                {
                  es: 'No había comido nada desde la mañana.',
                  en: 'He had not eaten anything since morning.',
                },
                {
                  es: 'Ella ya había terminado el informe cuando su jefe se lo pidió.',
                  en: 'She had already finished the report when her boss asked for it.',
                },
              ],
            },
          ],
        },
      ],
    },
    {
      id: 1,
      title: 'The Subjunctive Mood — All Tenses',
      sections: [
        {
          id: '2.1',
          title: 'Present Subjunctive — Full Review and WEIRDO Triggers',
          blocks: [
            {
              type: 'text',
              content:
                'The present subjunctive is the foundation for the entire subjunctive system. At B2, learners must use it fluently and automatically.',
            },
            {
              type: 'text',
              content:
                'Formation: Take the yo form of the present indicative, drop the -o, and add the "opposite vowel" endings. -AR verbs: -e, -es, -e, -emos, -eis, -en. -ER / -IR verbs: -a, -as, -a, -amos, -ais, -an.',
            },
            {
              type: 'table',
              headers: ['Person', 'hablar', 'comer', 'vivir'],
              rows: [
                ['yo', 'hable', 'coma', 'viva'],
                ['tú', 'hables', 'comas', 'vivas'],
                ['él/ella/usted', 'hable', 'coma', 'viva'],
                ['nosotros/as', 'hablemos', 'comamos', 'vivamos'],
                ['vosotros/as', 'habléis', 'comáis', 'viváis'],
                ['ellos/ellas/ustedes', 'hablen', 'coman', 'vivan'],
              ],
            },
            {
              type: 'table',
              headers: ['Infinitive', 'yo form (pres. subj.)', 'Full paradigm'],
              rows: [
                ['ser', 'sea', 'sea, seas, sea, seamos, seáis, sean'],
                ['estar', 'esté', 'esté, estés, esté, estemos, estéis, estén'],
                ['haber', 'haya', 'haya, hayas, haya, hayamos, hayáis, hayan'],
                ['ir', 'vaya', 'vaya, vayas, vaya, vayamos, vayáis, vayan'],
                ['saber', 'sepa', 'sepa, sepas, sepa, sepamos, sepáis, sepan'],
                ['dar', 'dé', 'dé, des, dé, demos, deis, den'],
                ['ver', 'vea', 'vea, veas, vea, veamos, veáis, vean'],
                ['tener', 'tenga', 'tenga, tengas, tenga, tengamos, tengáis, tengan'],
                ['venir', 'venga', 'venga, vengas, venga, vengamos, vengáis, vengan'],
                ['decir', 'diga', 'diga, digas, diga, digamos, digáis, digan'],
                ['poner', 'ponga', 'ponga, pongas, ponga, pongamos, pongáis, pongan'],
              ],
            },
            {
              type: 'table',
              headers: ['Letter', 'Category', 'Example trigger verbs/expressions'],
              rows: [
                ['W', 'Wishes / Desires', 'querer, desear, esperar, preferir, necesitar'],
                ['E', 'Emotions', 'alegrarse de, temer, sorprender, molestar, lamentar'],
                ['I', 'Impersonal Expressions', 'es importante, es necesario, es posible, es bueno'],
                ['R', 'Recommendations', 'recomendar, aconsejar, sugerir, pedir, insistir en'],
                ['D', 'Doubt / Denial', 'dudar, no creer, no pensar, negar, no estar seguro'],
                ['O', 'Ojala', 'ojala (+ subjunctive always)'],
              ],
            },
            {
              type: 'rules',
              items: [
                'The subjunctive is required when the subject of the main clause and the subordinate clause are different',
                'When both subjects are the same, use the infinitive instead',
              ],
            },
            {
              type: 'examples',
              examples: [
                {
                  es: 'Quiero que tú estudies.',
                  en: 'I want you to study. (different subjects)',
                },
                {
                  es: 'Quiero estudiar.',
                  en: 'I want to study. (same subject — infinitive)',
                },
                {
                  es: 'Espero que llegues a tiempo.',
                  en: 'I hope you arrive on time.',
                },
                {
                  es: 'Es importante que comas bien.',
                  en: 'It is important that you eat well.',
                },
                {
                  es: 'No creo que sea verdad.',
                  en: "I don't think it's true.",
                },
                {
                  es: 'Ojala pueda venir mañana.',
                  en: 'I hope I can come tomorrow.',
                },
              ],
            },
          ],
        },
        {
          id: '2.2',
          title: 'Imperfect Subjunctive (Preterito Imperfecto de Subjuntivo)',
          blocks: [
            {
              type: 'text',
              content:
                'This is a core B2 topic. The imperfect subjunctive is required whenever the subjunctive is needed but the context is past, conditional, or hypothetical.',
            },
            {
              type: 'text',
              content:
                'Formation rule: Take the 3rd person plural (ellos) of the preterite, remove -ron, and add the imperfect subjunctive endings.',
            },
            {
              type: 'table',
              headers: ['Person', '-ra endings', '-se endings'],
              rows: [
                ['yo', '-ra', '-se'],
                ['tú', '-ras', '-ses'],
                ['él/ella/usted', '-ra', '-se'],
                ['nosotros/as', '-ramos', '-semos'],
                ['vosotros/as', '-rais', '-seis'],
                ['ellos/ellas/ustedes', '-ran', '-sen'],
              ],
            },
            {
              type: 'rules',
              items: [
                'The nosotros form always carries a written accent on the vowel before the ending: hablaramos, comieramos',
                'All irregular preterite stems carry over: tener (tuvieron) becomes tuviera, ser/ir (fueron) becomes fuera, etc.',
              ],
            },
            {
              type: 'table',
              headers: ['Verb', 'Preterite ellos', 'Imp. subj. yo (-ra)', 'Imp. subj. ellos (-ra)'],
              rows: [
                ['hablar', 'hablaron', 'hablara', 'hablaran'],
                ['comer', 'comieron', 'comiera', 'comieran'],
                ['vivir', 'vivieron', 'viviera', 'vivieran'],
                ['tener', 'tuvieron', 'tuviera', 'tuvieran'],
                ['estar', 'estuvieron', 'estuviera', 'estuvieran'],
                ['ser / ir', 'fueron', 'fuera', 'fueran'],
                ['hacer', 'hicieron', 'hiciera', 'hicieran'],
                ['poder', 'pudieron', 'pudiera', 'pudieran'],
                ['querer', 'quisieron', 'quisiera', 'quisieran'],
                ['saber', 'supieron', 'supiera', 'supieran'],
                ['poner', 'pusieron', 'pusiera', 'pusieran'],
                ['venir', 'vinieron', 'viniera', 'vinieran'],
                ['decir', 'dijeron', 'dijera', 'dijeran'],
                ['traer', 'trajeron', 'trajera', 'trajeran'],
                ['dormir', 'durmieron', 'durmiera', 'durmieran'],
                ['pedir', 'pidieron', 'pidiera', 'pidieran'],
              ],
            },
            {
              type: 'text',
              content:
                'When to use the imperfect subjunctive: 1) When the main clause verb is in the past, conditional, or pluperfect, and the subordinate clause requires subjunctive. 2) After si in hypothetical (Type 2) conditionals. 3) In polite requests with querer, poder, deber. 4) After como si (as if) — always requires imperfect or pluperfect subjunctive. 5) After ojala for present-time wishes considered unlikely.',
            },
            {
              type: 'examples',
              examples: [
                {
                  es: 'Queria que viniera pronto.',
                  en: 'He wanted her to come soon.',
                },
                {
                  es: 'Era importante que estudiaran.',
                  en: 'It was important that they study.',
                },
                {
                  es: 'Si tuviera dinero, viajaria.',
                  en: 'If I had money, I would travel.',
                },
                {
                  es: 'Quisiera un cafe, por favor.',
                  en: 'I would like a coffee, please.',
                },
                {
                  es: 'Habla como si lo supiera todo.',
                  en: 'He speaks as if he knew everything.',
                },
                {
                  es: 'Ojala tuviera mas tiempo.',
                  en: 'If only I had more time.',
                },
              ],
            },
          ],
        },
        {
          id: '2.3',
          title: 'Present Perfect Subjunctive (Preterito Perfecto de Subjuntivo)',
          blocks: [
            {
              type: 'text',
              content:
                'Used when the main clause is in the present or future and the subordinate action has already been completed.',
            },
            {
              type: 'text',
              content: 'Formation: present subjunctive of haber + past participle',
            },
            {
              type: 'table',
              headers: ['Person', 'Form'],
              rows: [
                ['yo', 'haya + participio'],
                ['tú', 'hayas + participio'],
                ['él/ella/usted', 'haya + participio'],
                ['nosotros/as', 'hayamos + participio'],
                ['vosotros/as', 'hayáis + participio'],
                ['ellos/ellas/ustedes', 'hayan + participio'],
              ],
            },
            {
              type: 'examples',
              examples: [
                {
                  es: 'Espero que hayas dormido bien.',
                  en: 'I hope you slept well.',
                },
                {
                  es: 'No creo que hayan llegado todavia.',
                  en: "I don't think they have arrived yet.",
                },
                {
                  es: 'Me alegra que hayas aprobado el examen.',
                  en: "I'm glad you passed the exam.",
                },
                {
                  es: 'Es posible que ya hayan salido.',
                  en: "It's possible they have already left.",
                },
              ],
            },
          ],
        },
        {
          id: '2.4',
          title: 'Pluperfect Subjunctive (Preterito Pluscuamperfecto de Subjuntivo)',
          blocks: [
            {
              type: 'text',
              content:
                'The pluperfect subjunctive expresses a hypothetical or wished-for action that took place before another past event.',
            },
            {
              type: 'text',
              content: 'Formation: imperfect subjunctive of haber + past participle',
            },
            {
              type: 'table',
              headers: ['Person', '-ra form', '-se form'],
              rows: [
                ['yo', 'hubiera', 'hubiese'],
                ['tú', 'hubieras', 'hubieses'],
                ['él/ella/usted', 'hubiera', 'hubiese'],
                ['nosotros/as', 'hubieramos', 'hubiesemos'],
                ['vosotros/as', 'hubierais', 'hubieseis'],
                ['ellos/ellas/ustedes', 'hubieran', 'hubiesen'],
              ],
            },
            {
              type: 'text',
              content: 'Add past participle: hubiera + hablado / comido / vivido',
            },
            {
              type: 'text',
              content:
                'Main uses: 1) In Type 3 (past counterfactual) conditionals. 2) After WEIRDO verbs in a past main clause, referring to an action before it. 3) After como si. 4) After ojala for impossible past wishes.',
            },
            {
              type: 'examples',
              examples: [
                {
                  es: 'Si hubiera estudiado mas, habria sacado mejores notas.',
                  en: 'If I had studied more, I would have gotten better grades.',
                },
                {
                  es: 'Me alegre de que hubiera llegado sano.',
                  en: 'I was glad he had arrived safely.',
                },
                {
                  es: 'Era una lastima que no hubieras venido.',
                  en: "It was a shame you hadn't come.",
                },
                {
                  es: 'Actuo como si no hubiera pasado nada.',
                  en: 'He acted as if nothing had happened.',
                },
                {
                  es: 'Ojala hubiera podido ayudarte.',
                  en: 'If only I could have helped you.',
                },
              ],
            },
          ],
        },
        {
          id: '2.5',
          title: 'Sequence of Tenses (La Concordancia Temporal)',
          blocks: [
            {
              type: 'text',
              content:
                'This governs which subjunctive tense to use based on the main clause tense. Mastering this system is essential for B2.',
            },
            {
              type: 'rules',
              items: [
                'Present/future/imperative in the main clause triggers present or present perfect subjunctive',
                'Past/conditional in the main clause triggers imperfect or pluperfect subjunctive',
                'The choice between simple and compound (perfect) depends on whether the subordinate action is simultaneous/future or prior to the main clause action',
              ],
            },
            {
              type: 'table',
              headers: ['Main clause tense', 'Subordinate subjunctive', 'Time relationship'],
              rows: [
                ['Present / Future / Imperative', 'Present subjunctive', 'Same time or future'],
                ['Present / Future / Imperative', 'Present perfect subjunctive', 'Prior to main clause'],
                ['Preterite / Imperfect / Conditional / Pluperfect', 'Imperfect subjunctive', 'Same time or future'],
                ['Preterite / Imperfect / Conditional / Pluperfect', 'Pluperfect subjunctive', 'Prior to main clause'],
              ],
            },
            {
              type: 'examples',
              examples: [
                {
                  es: 'Quiero que estudies.',
                  en: 'I want you to study. (present + present subj.)',
                },
                {
                  es: 'Queria que estudiaras.',
                  en: 'I wanted you to study. (imperfect + imperfect subj.)',
                },
                {
                  es: 'Ha pedido que hayas terminado antes de las tres.',
                  en: 'He has asked you to have finished before three. (present perfect + present perfect subj.)',
                },
                {
                  es: 'Habia pedido que hubieras terminado antes.',
                  en: 'He had asked you to have finished before. (pluperfect + pluperfect subj.)',
                },
                {
                  es: 'Seria mejor que vinieras temprano.',
                  en: 'It would be better if you came early. (conditional + imperfect subj.)',
                },
                {
                  es: 'Me gustaria que pudieras ayudarme.',
                  en: 'I would like you to be able to help me. (conditional + imperfect subj.)',
                },
              ],
            },
          ],
        },
      ],
    },
    {
      id: 2,
      title: 'Conditional Sentences (Oraciones Condicionales / Clausulas con Si)',
      sections: [
        {
          id: '3.1',
          title: 'Type 1 — Real / Open Conditions',
          blocks: [
            {
              type: 'text',
              content:
                'Expresses a condition that is possible or likely. The si-clause states something that may well happen.',
            },
            {
              type: 'text',
              content: 'Structure: si + present indicative + present / future / imperative',
            },
            {
              type: 'rules',
              items: [
                'Never use the present subjunctive after si in Type 1 conditionals',
                'The result clause can be in the present (general truths), future (predictions), or imperative (commands)',
              ],
            },
            {
              type: 'examples',
              examples: [
                {
                  es: 'Si estudias, aprobaras el examen.',
                  en: 'If you study, you will pass the exam.',
                },
                {
                  es: 'Si llueve, nos quedamos en casa.',
                  en: 'If it rains, we stay home.',
                },
                {
                  es: 'Si terminas pronto, ven a ayudarme.',
                  en: 'If you finish early, come help me.',
                },
                {
                  es: 'Si tienes hambre, hay comida en la nevera.',
                  en: "If you're hungry, there's food in the fridge.",
                },
              ],
            },
          ],
        },
        {
          id: '3.2',
          title: 'Type 2 — Hypothetical / Unlikely Conditions',
          blocks: [
            {
              type: 'text',
              content:
                'Expresses an unlikely or contrary-to-fact present situation. The speaker considers the condition improbable or imaginary.',
            },
            {
              type: 'text',
              content: 'Structure: si + imperfect subjunctive + conditional simple',
            },
            {
              type: 'rules',
              items: [
                'The si-clause always uses the imperfect subjunctive (-ra or -se form)',
                'The result clause uses the conditional simple (hablar + ia endings)',
                'Never use the conditional in the si-clause itself',
              ],
            },
            {
              type: 'table',
              headers: ['Person', 'Conditional of hablar', 'Conditional of comer', 'Conditional of vivir'],
              rows: [
                ['yo', 'hablaria', 'comeria', 'viviria'],
                ['tú', 'hablarias', 'comerias', 'vivirias'],
                ['él/ella/usted', 'hablaria', 'comeria', 'viviria'],
                ['nosotros/as', 'hablariamos', 'comeriamos', 'viviriamos'],
                ['vosotros/as', 'hablariais', 'comeriais', 'viviriais'],
                ['ellos/ellas/ustedes', 'hablarian', 'comerian', 'vivirian'],
              ],
            },
            {
              type: 'table',
              headers: ['Infinitive', 'Stem', 'Conditional yo'],
              rows: [
                ['tener', 'tendr-', 'tendria'],
                ['poder', 'podr-', 'podria'],
                ['saber', 'sabr-', 'sabria'],
                ['querer', 'querr-', 'querria'],
                ['haber', 'habr-', 'habria'],
                ['hacer', 'har-', 'haria'],
                ['decir', 'dir-', 'diria'],
                ['salir', 'saldr-', 'saldria'],
                ['venir', 'vendr-', 'vendria'],
                ['poner', 'pondr-', 'pondria'],
              ],
            },
            {
              type: 'examples',
              examples: [
                {
                  es: 'Si tuviera mas dinero, viajaria por todo el mundo.',
                  en: 'If I had more money, I would travel the whole world.',
                },
                {
                  es: 'Si fuera mas alto, jugaria al baloncesto.',
                  en: 'If I were taller, I would play basketball.',
                },
                {
                  es: 'Si pudiera elegir, viviria en el campo.',
                  en: 'If I could choose, I would live in the countryside.',
                },
                {
                  es: 'Si hablara chino, podria trabajar en Pekin.',
                  en: 'If I spoke Chinese, I could work in Beijing.',
                },
              ],
            },
          ],
        },
        {
          id: '3.3',
          title: 'Type 3 — Impossible / Past Counterfactual Conditions',
          blocks: [
            {
              type: 'text',
              content:
                'Expresses a condition contrary to past facts. The event did not happen, and you are speculating about what would have been different.',
            },
            {
              type: 'text',
              content: 'Structure: si + pluperfect subjunctive + conditional perfect',
            },
            {
              type: 'rules',
              items: [
                'The si-clause uses the pluperfect subjunctive (hubiera/hubiese + past participle)',
                'The result clause uses the conditional perfect (habria + past participle)',
                'In spoken Spanish, the pluperfect subjunctive (-ra form) can sometimes replace the conditional perfect in the result clause: Si hubiera estudiado, hubiera aprobado',
              ],
            },
            {
              type: 'examples',
              examples: [
                {
                  es: 'Si hubiera estudiado mas, habria aprobado.',
                  en: 'If I had studied more, I would have passed.',
                },
                {
                  es: 'Si hubieran salido antes, habrian llegado a tiempo.',
                  en: 'If they had left earlier, they would have arrived on time.',
                },
                {
                  es: 'Si hubieras llamado, te habria ayudado.',
                  en: 'If you had called, I would have helped you.',
                },
                {
                  es: 'Si no hubiera llovido, habriamos ido a la playa.',
                  en: "If it hadn't rained, we would have gone to the beach.",
                },
              ],
            },
          ],
        },
        {
          id: '3.4',
          title: 'Mixed Conditionals',
          blocks: [
            {
              type: 'text',
              content:
                'A mixed conditional combines elements of Types 2 and 3 — a past condition with a present result, or a present condition with a past result.',
            },
            {
              type: 'text',
              content: 'Past condition with present result — Structure: si + pluperfect subjunctive + conditional simple',
            },
            {
              type: 'examples',
              examples: [
                {
                  es: 'Si hubiera estudiado medicina, seria medico ahora.',
                  en: 'If I had studied medicine, I would be a doctor now.',
                },
                {
                  es: 'Si no hubiera llovido ayer, el jardin estaria seco.',
                  en: 'If it hadn\'t rained yesterday, the garden would be dry.',
                },
                {
                  es: 'Si hubieramos comprado esa casa, viviriamos cerca del mar.',
                  en: 'If we had bought that house, we would live near the sea.',
                },
              ],
            },
            {
              type: 'text',
              content: 'Present condition with past result — Structure: si + imperfect subjunctive + conditional perfect',
            },
            {
              type: 'examples',
              examples: [
                {
                  es: 'Si fuera mas inteligente, habria resuelto el problema ayer.',
                  en: 'If I were smarter, I would have solved the problem yesterday.',
                },
                {
                  es: 'Si no tuviera miedo a volar, habria viajado a Australia.',
                  en: "If I weren't afraid of flying, I would have traveled to Australia.",
                },
              ],
            },
          ],
        },
        {
          id: '3.5',
          title: 'Conditional Sentence Summary Table',
          blocks: [
            {
              type: 'table',
              headers: ['Type', 'Si-clause tense', 'Main clause tense', 'Meaning'],
              rows: [
                ['Type 1 (real)', 'Present indicative', 'Present / Future / Imperative', 'Possible / likely'],
                ['Type 2 (hypothetical)', 'Imperfect subjunctive', 'Conditional simple', 'Unlikely / unreal present'],
                ['Type 3 (counterfactual)', 'Pluperfect subjunctive', 'Conditional perfect', 'Impossible past'],
                ['Mixed (past cause, present result)', 'Pluperfect subjunctive', 'Conditional simple', 'Past cause, present result'],
                ['Mixed (present cause, past result)', 'Imperfect subjunctive', 'Conditional perfect', 'Present cause, past result'],
              ],
            },
          ],
        },
      ],
    },
    {
      id: 3,
      title: 'Advanced Compound Tenses',
      sections: [
        {
          id: '4.1',
          title: 'Conditional Perfect (Condicional Compuesto)',
          blocks: [
            {
              type: 'text',
              content:
                'The conditional perfect expresses actions that would have happened but did not.',
            },
            {
              type: 'text',
              content: 'Formation: conditional of haber + past participle',
            },
            {
              type: 'table',
              headers: ['Person', 'Haber (conditional)', 'Example'],
              rows: [
                ['yo', 'habria', 'habria comido'],
                ['tú', 'habrias', 'habrias llegado'],
                ['él/ella/usted', 'habria', 'habria ido'],
                ['nosotros/as', 'habriamos', 'habriamos sabido'],
                ['vosotros/as', 'habriais', 'habriais visto'],
                ['ellos/ellas/ustedes', 'habrian', 'habrian hecho'],
              ],
            },
            {
              type: 'text',
              content:
                'Uses: 1) Main clause of Type 3 conditionals (actions that would have happened but did not). 2) Speculation / probability about a past action (wondering what must have happened). 3) Polite disagreement or softened opinions about past events.',
            },
            {
              type: 'examples',
              examples: [
                {
                  es: 'Si me lo hubieran dicho, habria ido a la reunion.',
                  en: 'If they had told me, I would have gone to the meeting.',
                },
                {
                  es: 'Habria preferido quedarme en casa.',
                  en: 'I would have preferred to stay at home.',
                },
                {
                  es: '¿Tu que habrias hecho en mi lugar?',
                  en: 'What would you have done in my place?',
                },
                {
                  es: 'Habria llegado alrededor de las diez.',
                  en: 'He must have arrived around ten.',
                },
                {
                  es: 'Habrian salido antes de que empezara a llover.',
                  en: 'They must have left before it started raining.',
                },
                {
                  es: 'Yo habria hecho las cosas de otra manera.',
                  en: 'I would have done things differently.',
                },
              ],
            },
          ],
        },
        {
          id: '4.2',
          title: 'Future Perfect (Futuro Compuesto)',
          blocks: [
            {
              type: 'text',
              content:
                'The future perfect expresses an action that will have been completed by a future point in time.',
            },
            {
              type: 'text',
              content: 'Formation: future of haber + past participle',
            },
            {
              type: 'table',
              headers: ['Person', 'Haber (future)', 'Example'],
              rows: [
                ['yo', 'habre', 'habre terminado'],
                ['tú', 'habras', 'habras comido'],
                ['él/ella/usted', 'habra', 'habra llegado'],
                ['nosotros/as', 'habremos', 'habremos visto'],
                ['vosotros/as', 'habreis', 'habreis hecho'],
                ['ellos/ellas/ustedes', 'habran', 'habran salido'],
              ],
            },
            {
              type: 'text',
              content:
                'Uses: 1) An action completed before a future deadline or reference point. 2) Speculation about a recently completed past action (strong probability / conjecture).',
            },
            {
              type: 'examples',
              examples: [
                {
                  es: 'Para el viernes, habre terminado el informe.',
                  en: 'By Friday, I will have finished the report.',
                },
                {
                  es: 'Cuando llegues, ya habre cocinado.',
                  en: 'When you arrive, I will have already cooked.',
                },
                {
                  es: 'Para las ocho, ya habran cenado.',
                  en: 'By eight, they will have already eaten dinner.',
                },
                {
                  es: 'Habra perdido el autobus.',
                  en: 'He must have missed the bus.',
                },
                {
                  es: 'Habran llegado ya, ¿no?',
                  en: 'They must have arrived by now, right?',
                },
                {
                  es: '¿Que le habra pasado?',
                  en: 'What can have happened to him?',
                },
              ],
            },
            {
              type: 'rules',
              items: [
                'The future perfect of conjecture is an alternative to expressions like "probablemente ya ha..." or "seguramente ya ha..."',
                'In temporal clauses with cuando, para cuando, etc., the future perfect often pairs with the present subjunctive: Para cuando llegues, ya habre salido. — By the time you arrive, I will have already left.',
              ],
            },
          ],
        },
      ],
    },
    {
      id: 4,
      title: 'Passive Voice (La Voz Pasiva)',
      sections: [
        {
          id: '5.1',
          title: 'Passive with Ser (La Pasiva con Ser)',
          blocks: [
            {
              type: 'text',
              content:
                'The true passive voice, equivalent to English "was/were + past participle." Used primarily in formal, written, and journalistic Spanish.',
            },
            {
              type: 'text',
              content:
                'Structure: subject + ser (conjugated) + past participle (agrees with subject) + por + agent (optional)',
            },
            {
              type: 'rules',
              items: [
                'The past participle must agree in gender and number with the subject',
                'The agent (who performs the action) is introduced by "por"',
                'This construction is far more common in written than spoken Spanish',
              ],
            },
            {
              type: 'table',
              headers: ['Tense', 'Example'],
              rows: [
                ['Present', 'El libro es leido por miles de personas. — The book is read by thousands of people.'],
                ['Preterite', 'El contrato fue firmado ayer. — The contract was signed yesterday.'],
                ['Imperfect', 'La ley era aplicada estrictamente. — The law was applied strictly.'],
                ['Future', 'El proyecto sera presentado mañana. — The project will be presented tomorrow.'],
                ['Conditional', 'El informe seria enviado pronto. — The report would be sent soon.'],
                ['Present perfect', 'El problema ha sido resuelto. — The problem has been solved.'],
              ],
            },
            {
              type: 'examples',
              examples: [
                {
                  es: 'Los documentos fueron firmados por Carmen.',
                  en: 'The documents were signed by Carmen.',
                },
                {
                  es: 'El edificio fue construido por arquitectos famosos.',
                  en: 'The building was built by famous architects.',
                },
                {
                  es: 'La decision fue tomada por unanimidad.',
                  en: 'The decision was made unanimously.',
                },
              ],
            },
          ],
        },
        {
          id: '5.2',
          title: 'Passive Se (La Pasiva Refleja)',
          blocks: [
            {
              type: 'text',
              content:
                'Used to express passive meaning without specifying an agent. This is much more common in everyday spoken Spanish than the ser-passive.',
            },
            {
              type: 'text',
              content:
                'Structure: se + 3rd person verb (singular or plural, agreeing with the grammatical subject)',
            },
            {
              type: 'rules',
              items: [
                'The verb agrees with the grammatical subject (the thing being acted upon)',
                'If the subject is singular, the verb is singular; if plural, the verb is plural',
                'The agent is never mentioned in this construction',
              ],
            },
            {
              type: 'examples',
              examples: [
                {
                  es: 'Se vende un apartamento.',
                  en: 'An apartment is for sale. (singular)',
                },
                {
                  es: 'Se venden apartamentos.',
                  en: 'Apartments are for sale. (plural)',
                },
                {
                  es: 'Se habla español aqui.',
                  en: 'Spanish is spoken here.',
                },
                {
                  es: 'Se alquilan habitaciones.',
                  en: 'Rooms are rented.',
                },
                {
                  es: 'Aqui se fabrican coches.',
                  en: 'Cars are manufactured here.',
                },
                {
                  es: 'Se necesitan camareros.',
                  en: 'Waiters are needed.',
                },
              ],
            },
          ],
        },
        {
          id: '5.3',
          title: 'Impersonal Se (La Se Impersonal)',
          blocks: [
            {
              type: 'text',
              content:
                'Refers to people in general — equivalent to English "one," "you," "they," or "people" used impersonally.',
            },
            {
              type: 'text',
              content: 'Structure: se + 3rd person singular verb (always singular)',
            },
            {
              type: 'rules',
              items: [
                'The verb is always 3rd person singular, regardless of what follows',
                'There is no specific grammatical subject',
                'Used for general statements, rules, and norms',
              ],
            },
            {
              type: 'examples',
              examples: [
                {
                  es: 'Se come bien en España.',
                  en: 'People eat well in Spain.',
                },
                {
                  es: 'Se debe respetar las normas.',
                  en: 'One must respect the rules.',
                },
                {
                  es: '¿Se puede fumar aqui?',
                  en: 'Can one smoke here?',
                },
                {
                  es: 'En España se cena tarde.',
                  en: 'In Spain, people eat dinner late.',
                },
                {
                  es: 'Se vive bien en esta ciudad.',
                  en: 'One lives well in this city.',
                },
              ],
            },
            {
              type: 'table',
              headers: ['Construction', 'Key test', 'Example'],
              rows: [
                ['Passive se', 'Verb agrees with noun (sing/plur); noun is the grammatical subject', 'Se venden pisos. (plural agreement)'],
                ['Impersonal se', 'Verb always singular; no specific noun subject', 'Se vive bien aqui. (always singular)'],
              ],
            },
          ],
        },
        {
          id: '5.4',
          title: 'Passive Se with a Person as Object',
          blocks: [
            {
              type: 'text',
              content:
                'When the logical object of a passive-se sentence is a person, Spanish avoids making a person "agree" with se (to prevent confusion with a reflexive meaning). Instead, the verb stays singular and a redundant indirect object pronoun (le/les) is added.',
            },
            {
              type: 'text',
              content: 'Structure: se + le/les + verb (3rd person singular) + a + person',
            },
            {
              type: 'examples',
              examples: [
                {
                  es: 'Se le busca por robo.',
                  en: 'He is wanted for robbery.',
                },
                {
                  es: 'Se les notificara mañana.',
                  en: 'They will be notified tomorrow.',
                },
                {
                  es: 'Se le considera un experto.',
                  en: 'He is considered an expert.',
                },
                {
                  es: 'Se les invito a la ceremonia.',
                  en: 'They were invited to the ceremony.',
                },
              ],
            },
          ],
        },
      ],
    },
    {
      id: 5,
      title: 'Subjunctive in Subordinate Clauses',
      sections: [
        {
          id: '6.1',
          title: 'Subjunctive in Relative Clauses (Clausulas de Relativo)',
          blocks: [
            {
              type: 'text',
              content:
                'The choice between indicative and subjunctive in relative clauses depends on whether the antecedent (the noun being described) is known/specific or unknown/hypothetical.',
            },
            {
              type: 'rules',
              items: [
                'Indicative = the antecedent is known, specific, or definitely exists',
                'Subjunctive = the antecedent is unknown, hypothetical, desired but not yet found, or negated',
                'The definite article (el/la) signals a known entity; the indefinite article (un/una) or negative (nadie, nada, ningun) signals an unknown/hypothetical one',
              ],
            },
            {
              type: 'text',
              content: 'Indicative (known antecedent):',
            },
            {
              type: 'examples',
              examples: [
                {
                  es: 'Busco al hombre que habla chino.',
                  en: "I'm looking for the (specific) man who speaks Chinese. (I know who he is.)",
                },
                {
                  es: 'Tengo un coche que consume poco.',
                  en: 'I have a car that uses little fuel. (It exists.)',
                },
                {
                  es: 'Conozco a alguien que puede ayudarte.',
                  en: 'I know someone who can help you.',
                },
              ],
            },
            {
              type: 'text',
              content: 'Subjunctive (unknown / nonexistent antecedent):',
            },
            {
              type: 'examples',
              examples: [
                {
                  es: 'Busco un hombre que hable chino.',
                  en: "I'm looking for a man who speaks Chinese. (I don't know if such a man exists.)",
                },
                {
                  es: 'Necesito un coche que consuma poco.',
                  en: "I need a car that uses little fuel. (I haven't found one yet.)",
                },
                {
                  es: 'No hay nadie que sepa la respuesta.',
                  en: 'There is no one who knows the answer.',
                },
                {
                  es: '¿Hay alguien que pueda ayudarme?',
                  en: 'Is there anyone who can help me?',
                },
              ],
            },
            {
              type: 'text',
              content: 'After negated expressions (always subjunctive):',
            },
            {
              type: 'examples',
              examples: [
                {
                  es: 'No conozco a nadie que hable cinco idiomas.',
                  en: "I don't know anyone who speaks five languages.",
                },
                {
                  es: 'No existe ningun lugar que sea perfecto.',
                  en: 'There is no place that is perfect.',
                },
                {
                  es: 'No hay nada que me guste en esta tienda.',
                  en: 'There is nothing I like in this shop.',
                },
              ],
            },
          ],
        },
        {
          id: '6.2',
          title: 'Subjunctive in Adverbial Clauses — Always-Subjunctive Conjunctions',
          blocks: [
            {
              type: 'text',
              content:
                'Certain conjunctions ALWAYS require the subjunctive in the clause that follows them, regardless of tense or certainty.',
            },
            {
              type: 'table',
              headers: ['Conjunction', 'Meaning', 'Example'],
              rows: [
                ['para que', 'so that, in order that', 'Habla despacio para que te entendamos.'],
                ['a fin de que', 'so that', 'Te lo explico a fin de que lo comprendas.'],
                ['antes de que', 'before', 'Llama antes de que cierren.'],
                ['a menos que', 'unless', 'No ire a menos que me inviten.'],
                ['con tal (de) que', 'provided that', 'Lo hare con tal de que me pagues.'],
                ['sin que', 'without', 'Salio sin que nadie lo viera.'],
                ['en caso de que', 'in case', 'Lleva paraguas en caso de que llueva.'],
                ['a no ser que', 'unless', 'Vendremos a no ser que llueva.'],
              ],
            },
            {
              type: 'examples',
              examples: [
                {
                  es: 'Estudio mucho para que mis padres esten orgullosos.',
                  en: 'I study hard so that my parents are proud.',
                },
                {
                  es: 'Termina el trabajo antes de que llegue el jefe.',
                  en: 'Finish the work before the boss arrives.',
                },
                {
                  es: 'Podemos salir a menos que estes cansado.',
                  en: 'We can go out unless you are tired.',
                },
              ],
            },
          ],
        },
        {
          id: '6.3',
          title: 'Mood-Alternating Conjunctions (Indicative or Subjunctive)',
          blocks: [
            {
              type: 'text',
              content:
                'Several conjunctions take the indicative when referring to known/habitual facts and the subjunctive when referring to anticipated or uncertain future events.',
            },
            {
              type: 'text',
              content:
                'Cuando (when): Indicative = habitual/past fact: Cuando llueve, me quedo en casa. Subjunctive = anticipated future: Cuando llegues, llamame.',
            },
            {
              type: 'text',
              content:
                'Aunque (although / even if): Indicative = known fact: Lo hare aunque no le gusta. (I know this.) Subjunctive = uncertain/hypothetical: Lo hare aunque no le guste. (I\'m not sure.)',
            },
            {
              type: 'text',
              content:
                'Hasta que (until): Indicative = habitual/past: Siempre espera hasta que llegan. (habitual) Subjunctive = anticipated future: Espera hasta que lleguen. (future)',
            },
            {
              type: 'text',
              content:
                'Mientras (while / as long as): Indicative = ongoing fact: Mientras trabajas, yo cocino. Subjunctive = condition/as long as: Mientras estudies, aprobaras.',
            },
            {
              type: 'text',
              content:
                'En cuanto / Tan pronto como (as soon as): Always subjunctive when referring to a future event.',
            },
            {
              type: 'examples',
              examples: [
                {
                  es: 'En cuanto llegue, te avisare.',
                  en: "As soon as I arrive, I'll let you know.",
                },
                {
                  es: 'Tan pronto como termine, sal de alli.',
                  en: 'As soon as you finish, get out of there.',
                },
              ],
            },
            {
              type: 'text',
              content:
                'Desde que (since): Indicative = past fact: Desde que llegaste, todo ha cambiado. Subjunctive = hypothetical future: Desde que termine, estare libre.',
            },
          ],
        },
        {
          id: '6.4',
          title: 'Purpose Clauses vs. Infinitive Alternatives',
          blocks: [
            {
              type: 'text',
              content:
                'When the subject of both clauses is the same, use an infinitive construction instead of que + subjunctive. The "que" is dropped and replaced by a simple preposition + infinitive.',
            },
            {
              type: 'table',
              headers: ['Two different subjects (subjunctive)', 'Same subject (infinitive)'],
              rows: [
                ['Lo hago para que tú aprendas.', 'Lo hago para aprender yo tambien.'],
                ['Salio sin que nadie lo viera.', 'Salio sin decir nada.'],
                ['Llama antes de que cierren.', 'Llama antes de dormir.'],
                ['Estudia a fin de que apruebes.', 'Estudia a fin de aprobar.'],
              ],
            },
            {
              type: 'examples',
              examples: [
                {
                  es: 'Trabajo mucho para ganar dinero.',
                  en: 'I work a lot to earn money. (same subject)',
                },
                {
                  es: 'Trabajo mucho para que mis hijos tengan una vida mejor.',
                  en: 'I work a lot so that my children have a better life. (different subjects)',
                },
              ],
            },
          ],
        },
      ],
    },
    {
      id: 6,
      title: 'Reported Speech (El Estilo Indirecto)',
      sections: [
        {
          id: '7.1',
          title: 'What Is Reported Speech?',
          blocks: [
            {
              type: 'text',
              content:
                'Reported speech (estilo indirecto) is used to relay what someone else said, without quoting them directly. It requires adapting tenses, pronouns, and time/place expressions.',
            },
            {
              type: 'rules',
              items: [
                'The reporting verb (decir, afirmar, explicar, etc.) introduces the reported clause with "que"',
                'If the reporting verb is in the present, no tense shift occurs',
                'If the reporting verb is in the past, tenses shift back (backshifting)',
              ],
            },
            {
              type: 'text',
              content:
                'Common introducing verbs: decir (to say), afirmar (to state), explicar (to explain), comentar (to comment), preguntar (to ask), pedir (to request), ordenar (to order), sugerir (to suggest), responder (to reply), confesar (to confess), prometer (to promise)',
            },
          ],
        },
        {
          id: '7.2',
          title: 'Tense Backshifting',
          blocks: [
            {
              type: 'text',
              content:
                'When the reporting verb is in the past, the original tense shifts back one step.',
            },
            {
              type: 'table',
              headers: ['Original tense (direct speech)', 'Reported tense (indirect speech)'],
              rows: [
                ['Present indicative (habla)', 'Imperfect (hablaba)'],
                ['Preterite (hablo)', 'Pluperfect (habia hablado)'],
                ['Present perfect (ha hablado)', 'Pluperfect (habia hablado)'],
                ['Imperfect (hablaba)', 'Imperfect (hablaba) — no change'],
                ['Future (hablara)', 'Conditional (hablaria)'],
                ['Conditional (hablaria)', 'Conditional (hablaria) — no change'],
                ['Imperative (habla)', 'Imperfect subjunctive (hablara)'],
                ['Present subjunctive (hable)', 'Imperfect subjunctive (hablara)'],
              ],
            },
            {
              type: 'examples',
              examples: [
                {
                  es: '"Estoy cansada." -> Dijo que estaba cansada.',
                  en: 'She said she was tired.',
                },
                {
                  es: '"Llegare tarde." -> Dijo que llegaria tarde.',
                  en: 'He said he would arrive late.',
                },
                {
                  es: '"He perdido las llaves." -> Dijo que habia perdido las llaves.',
                  en: 'She said she had lost the keys.',
                },
                {
                  es: '"Ven aqui." -> Le dijo que fuera alli.',
                  en: 'He told him to go there.',
                },
                {
                  es: '"No lo hagas." -> Le dijo que no lo hiciera.',
                  en: 'She told him not to do it.',
                },
              ],
            },
            {
              type: 'text',
              content: 'When reporting verb is present (no tense shift):',
            },
            {
              type: 'examples',
              examples: [
                {
                  es: '"Estoy cansada." -> Dice que esta cansada.',
                  en: 'She says she is tired.',
                },
                {
                  es: '"Llegare tarde." -> Dice que llegara tarde.',
                  en: 'He says he will arrive late.',
                },
              ],
            },
          ],
        },
        {
          id: '7.3',
          title: 'Changes in Pronouns and Time/Place Expressions',
          blocks: [
            {
              type: 'text',
              content:
                'When converting to reported speech, pronouns and deictic expressions (words that point to time, place, and person) must be adjusted to match the new perspective.',
            },
            {
              type: 'table',
              headers: ['Direct speech', 'Reported speech'],
              rows: [
                ['yo', 'el / ella'],
                ['tú', 'yo / el / ella (context-dependent)'],
                ['mi/mis', 'su/sus'],
                ['tu/tus', 'mi/mis or su/sus'],
                ['aqui / aca', 'alli / alla'],
                ['hoy', 'ese dia / aquel dia'],
                ['ayer', 'el dia anterior'],
                ['mañana', 'al dia siguiente'],
                ['ahora', 'entonces / en ese momento'],
                ['esta semana', 'esa semana'],
                ['este (demonstrative)', 'ese / aquel'],
                ['la semana que viene', 'la semana siguiente'],
              ],
            },
            {
              type: 'examples',
              examples: [
                {
                  es: '"Hoy estoy muy ocupado." -> Dijo que ese dia estaba muy ocupado.',
                  en: 'He said that day he was very busy.',
                },
                {
                  es: '"Ven aqui mañana." -> Me dijo que fuera alli al dia siguiente.',
                  en: 'He told me to go there the next day.',
                },
                {
                  es: '"Te llamo esta noche." -> Dijo que me llamaria esa noche.',
                  en: 'She said she would call me that night.',
                },
              ],
            },
          ],
        },
        {
          id: '7.4',
          title: 'Reporting Questions',
          blocks: [
            {
              type: 'text',
              content:
                'Questions are reported differently depending on whether they are yes/no questions or information questions.',
            },
            {
              type: 'text',
              content: 'Yes/no questions — use "si":',
            },
            {
              type: 'examples',
              examples: [
                {
                  es: '"¿Tienes trabajo?" -> Pregunto si tenia trabajo.',
                  en: 'She asked if I had work.',
                },
                {
                  es: '"¿Vienes mañana?" -> Pregunto si vendria al dia siguiente.',
                  en: 'He asked if I would come the next day.',
                },
                {
                  es: '"¿Has terminado?" -> Pregunto si habia terminado.',
                  en: 'She asked if I had finished.',
                },
              ],
            },
            {
              type: 'text',
              content: 'Information questions — keep the question word (with accent):',
            },
            {
              type: 'examples',
              examples: [
                {
                  es: '"¿Donde vives?" -> Pregunto donde vivia.',
                  en: 'He asked where I lived.',
                },
                {
                  es: '"¿Cuando llegara?" -> Pregunto cuando llegaria.',
                  en: 'She asked when he would arrive.',
                },
                {
                  es: '"¿Que haces?" -> Pregunto que hacia.',
                  en: 'He asked what I was doing.',
                },
                {
                  es: '"¿Por que no viniste?" -> Pregunto por que no habia ido.',
                  en: "She asked why I hadn't gone.",
                },
              ],
            },
            {
              type: 'rules',
              items: [
                'Reported questions never use question marks',
                'The word order in reported questions follows declarative sentence order (no inversion)',
                'Reporting requests: pedir que + subjunctive: "Dame el libro." -> Me pidio que le diera el libro.',
              ],
            },
          ],
        },
      ],
    },
    {
      id: 7,
      title: 'Advanced Relative Clauses',
      sections: [
        {
          id: '8.1',
          title: 'Full Inventory of Relative Pronouns at B2',
          blocks: [
            {
              type: 'table',
              headers: ['Pronoun', 'Use', 'Example'],
              rows: [
                ['que', 'Most common; refers to people and things', 'El libro que lei era excelente.'],
                ['quien / quienes', 'Refers to people, especially after prepositions', 'La persona con quien hable es medico.'],
                ['el que / la que / los que / las que', 'People and things, after prepositions; also for emphasis', 'Aqui esta el que te recomende.'],
                ['lo que', 'Abstract ideas, situations, entire clauses', 'Lo que dijiste me sorprendio.'],
                ['lo cual', 'Same as lo que but more formal; used after comma', 'Llego tarde, lo cual me molesto.'],
                ['cuyo / cuya / cuyos / cuyas', 'Possessive relative (whose)', 'El autor cuyos libros me gustan.'],
                ['donde', 'Refers to places', 'El lugar donde naci es pequeño.'],
                ['cuando', 'Refers to times', 'El momento cuando todo cambio.'],
                ['como', 'Refers to manner', 'La forma como habla es curiosa.'],
              ],
            },
          ],
        },
        {
          id: '8.2',
          title: 'Cuyo — Possessive Relative Pronoun',
          blocks: [
            {
              type: 'text',
              content:
                '"Cuyo" means "whose" and agrees in gender and number with the noun it modifies (the thing possessed), NOT with the possessor.',
            },
            {
              type: 'table',
              headers: ['', 'Singular', 'Plural'],
              rows: [
                ['Masculine', 'cuyo', 'cuyos'],
                ['Feminine', 'cuya', 'cuyas'],
              ],
            },
            {
              type: 'rules',
              items: [
                'Cuyo is relatively formal and more common in written than spoken Spanish',
                'In spoken Spanish, "que su..." is sometimes used instead, though it is grammatically frowned upon',
                'Cuyo can never stand alone — it always precedes the noun it modifies',
              ],
            },
            {
              type: 'examples',
              examples: [
                {
                  es: 'El escritor cuya novela gano el premio es colombiano.',
                  en: 'The writer whose novel won the prize is Colombian. (novela = fem. sing.)',
                },
                {
                  es: 'Los estudiantes cuyos examenes corregi sacaron buenas notas.',
                  en: 'The students whose exams I corrected got good grades. (examenes = masc. plur.)',
                },
                {
                  es: 'La empresa cuyos directivos dimitieron esta en crisis.',
                  en: 'The company whose directors resigned is in crisis.',
                },
                {
                  es: 'La mujer cuyo hijo estudia aqui es profesora.',
                  en: 'The woman whose son studies here is a teacher. (hijo = masc. sing.)',
                },
              ],
            },
          ],
        },
        {
          id: '8.3',
          title: 'Lo que / Lo cual — Referring to Entire Clauses',
          blocks: [
            {
              type: 'text',
              content:
                '"Lo que" and "lo cual" refer back to an entire clause, idea, or situation — not to a specific noun. They translate as "which" when referring to a whole proposition.',
            },
            {
              type: 'rules',
              items: [
                '"Lo que" is used in both restrictive and non-restrictive clauses; it is more versatile and common',
                '"Lo cual" is used only in non-restrictive (explanatory) clauses and is more formal',
                'Both are invariable (they do not change for gender or number)',
              ],
            },
            {
              type: 'examples',
              examples: [
                {
                  es: 'Llego tarde, lo que me molesto mucho.',
                  en: 'He arrived late, which annoyed me a lot.',
                },
                {
                  es: 'Aprobo el examen, lo cual nos alegro.',
                  en: 'She passed the exam, which made us happy.',
                },
                {
                  es: 'No se lo que quiere decir.',
                  en: "I don't know what that means.",
                },
                {
                  es: 'Hizo todo lo que pudo.',
                  en: 'He did everything he could.',
                },
                {
                  es: 'Cancelaron el concierto, lo cual fue una decepcion.',
                  en: 'They cancelled the concert, which was a disappointment.',
                },
              ],
            },
            {
              type: 'text',
              content: 'Lo que at the beginning of a sentence (what = the thing that):',
            },
            {
              type: 'examples',
              examples: [
                {
                  es: 'Lo que mas me gusta es viajar.',
                  en: 'What I like most is traveling.',
                },
                {
                  es: 'Lo que necesitas es descansar.',
                  en: 'What you need is to rest.',
                },
              ],
            },
          ],
        },
        {
          id: '8.4',
          title: 'Relative Clauses with Prepositions',
          blocks: [
            {
              type: 'text',
              content:
                'In Spanish, the preposition always comes BEFORE the relative pronoun. Unlike in English, prepositions never "dangle" at the end of a clause.',
            },
            {
              type: 'rules',
              items: [
                'After prepositions, use "el que / la que / los que / las que" or "quien(es)" for people',
                '"Que" alone cannot follow most prepositions (except in a few fixed phrases)',
                'The article (el/la/los/las) must agree with the antecedent',
              ],
            },
            {
              type: 'examples',
              examples: [
                {
                  es: 'La ciudad en la que vivo es grande.',
                  en: 'The city (in which) I live is big.',
                },
                {
                  es: 'El problema con el que me encontre era grave.',
                  en: 'The problem I came across was serious.',
                },
                {
                  es: 'La persona a quien admiro es mi madre.',
                  en: 'The person (whom) I admire is my mother.',
                },
                {
                  es: 'El tema sobre el que escribiste era interesante.',
                  en: 'The subject you wrote about was interesting.',
                },
                {
                  es: 'La silla en la que estas sentado es vieja.',
                  en: "The chair you're sitting on is old.",
                },
                {
                  es: 'Los amigos con los que fui de viaje son de Colombia.',
                  en: 'The friends I went traveling with are from Colombia.',
                },
              ],
            },
          ],
        },
      ],
    },
    {
      id: 8,
      title: 'Ser vs. Estar — Advanced Uses',
      sections: [
        {
          id: '9.1',
          title: 'Core Distinction at B2 — Identity vs. Status',
          blocks: [
            {
              type: 'text',
              content:
                'Beyond the basic permanent/temporary distinction taught at A1-B1, B2 learners must understand the deeper semantic categories.',
            },
            {
              type: 'rules',
              items: [
                'Ser expresses identity — what something fundamentally IS (classification, definition, essence)',
                'Estar expresses status or condition — how something IS at a given moment (state, location, result of change)',
              ],
            },
            {
              type: 'text',
              content: 'Full ser uses:',
            },
            {
              type: 'table',
              headers: ['Use', 'Example'],
              rows: [
                ['Identity / definition', 'Soy medico. — I am a doctor.'],
                ['Origin / nationality', 'Es de Madrid. — He is from Madrid.'],
                ['Material', 'La mesa es de madera. — The table is made of wood.'],
                ['Relationship', 'Es mi hermano. — He is my brother.'],
                ['Time / date', 'Son las tres. Hoy es lunes.'],
                ['Passive voice (with ser)', 'El informe fue firmado. — The report was signed.'],
                ['Inherent characteristics', 'Es muy inteligente. — She is very intelligent.'],
                ['Events / location of events', 'La fiesta es en mi casa. — The party is at my house.'],
                ['Price', '¿Cuanto es? — How much is it?'],
              ],
            },
            {
              type: 'text',
              content: 'Full estar uses:',
            },
            {
              type: 'table',
              headers: ['Use', 'Example'],
              rows: [
                ['Location (of objects/people)', 'Esta en casa. — She is at home.'],
                ['Condition / state', 'Esta cansado. — He is tired.'],
                ['Emotion / feeling', 'Estoy contento. — I am happy.'],
                ['Progressive tenses', 'Estoy comiendo. — I am eating.'],
                ['Result of a change', 'Esta casado. — He is married. (result of getting married)'],
                ['Appearance / subjective impression', 'Esta guapisima hoy. — She looks gorgeous today.'],
                ['Dead / alive', 'Esta muerto. — He is dead. (current state)'],
              ],
            },
          ],
        },
        {
          id: '9.2',
          title: 'Adjectives That Change Meaning with Ser / Estar',
          blocks: [
            {
              type: 'text',
              content:
                'Many adjectives carry completely different meanings depending on whether they are used with ser or estar. This is one of the trickiest aspects of Spanish at B2.',
            },
            {
              type: 'table',
              headers: ['Adjective', 'Con ser', 'Con estar'],
              rows: [
                ['aburrido', 'boring (personality/nature)', 'bored (feeling)'],
                ['bueno', 'good (moral quality/type)', 'tasty / feeling well'],
                ['malo', 'bad / evil', 'ill / sick'],
                ['listo', 'clever, smart', 'ready'],
                ['seguro', 'safe (objectively)', 'sure / certain'],
                ['rico', 'wealthy, rich', 'delicious'],
                ['vivo', 'lively (personality)', 'alive (living)'],
                ['muerto', 'dead (as defining trait, lifeless)', 'dead (state — has died)'],
                ['libre', 'free (concept, independent)', 'free / available (unoccupied)'],
                ['abierto', 'open-minded', 'open (physically)'],
                ['cerrado', 'narrow-minded, stubborn', 'closed (physically)'],
                ['verde', 'green (color)', 'unripe'],
                ['negro', 'black (color)', 'furious (colloquial)'],
                ['atento', 'attentive, thoughtful (personality)', 'paying attention (right now)'],
                ['despierto', 'sharp, bright (personality)', 'awake'],
                ['organizado', 'organized (by nature)', 'organized (as current state)'],
                ['claro', 'clear, obvious (inherent)', 'clear, understood (right now)'],
              ],
            },
            {
              type: 'examples',
              examples: [
                {
                  es: 'Juan es muy listo.',
                  en: 'Juan is very clever.',
                },
                {
                  es: 'Juan esta listo para salir.',
                  en: 'Juan is ready to leave.',
                },
                {
                  es: 'Esta sopa es buena para la salud.',
                  en: 'This soup is good for your health.',
                },
                {
                  es: 'Esta sopa esta buenisima.',
                  en: 'This soup is delicious. (tasting it now)',
                },
                {
                  es: 'La pelicula es aburrida.',
                  en: 'The movie is boring.',
                },
                {
                  es: 'Los estudiantes estan aburridos.',
                  en: 'The students are bored.',
                },
                {
                  es: 'Mi vecino es muy vivo.',
                  en: 'My neighbor is very lively.',
                },
                {
                  es: 'El gato esta vivo.',
                  en: 'The cat is alive.',
                },
              ],
            },
          ],
        },
        {
          id: '9.3',
          title: 'Estar with Adjectives to Express Surprise or Subjective Perception',
          blocks: [
            {
              type: 'text',
              content:
                'At B2, learners discover that estar can be used with adjectives that normally go with ser to express a changed state, surprise, or subjective impression that contrasts with the expected norm.',
            },
            {
              type: 'rules',
              items: [
                'Using estar + a typically "ser" adjective implies that the speaker perceives a change or finds something noteworthy',
                'This usage often conveys surprise, emphasis, or a temporary impression',
                'It suggests "more than usual" or "more than expected"',
              ],
            },
            {
              type: 'examples',
              examples: [
                {
                  es: 'Estas muy guapo hoy.',
                  en: 'You look very handsome today. (different from usual — subjective reaction)',
                },
                {
                  es: 'El bebe esta muy grande.',
                  en: 'The baby is so big! (has grown — perceived change)',
                },
                {
                  es: 'Esta muy antipatico ultimamente.',
                  en: "He's been very unfriendly lately. (change from usual behavior)",
                },
                {
                  es: 'Estas muy delgada. ¿Has estado enferma?',
                  en: "You're very thin. Have you been sick? (noticeable change)",
                },
                {
                  es: 'La ciudad esta muy bonita con las luces de Navidad.',
                  en: 'The city looks very pretty with the Christmas lights. (temporary state, subjective)',
                },
              ],
            },
          ],
        },
      ],
    },
    {
      id: 9,
      title: 'Vocabulary and Structure — Advanced Topics',
      sections: [
        {
          id: '10.1',
          title: 'Verbs of Change (Verbos de Cambio)',
          blocks: [
            {
              type: 'text',
              content:
                'Spanish has multiple verbs that translate as "to become" in English, each used for a different type of change. They are not interchangeable.',
            },
            {
              type: 'table',
              headers: ['Verb', 'Type of change', 'Followed by', 'Example'],
              rows: [
                ['ponerse', 'Sudden, involuntary, temporary change (emotion, physical state)', 'adjective', 'Se puso rojo de verguenza. — He turned red with shame.'],
                ['quedarse', 'End result of a change; focus on final state (often negative)', 'adjective / sin + noun', 'Se quedo sin trabajo. — She ended up without a job.'],
                ['volverse', 'Gradual, involuntary personality or character change; often irreversible', 'adjective', 'Se volvio muy agresivo. — He became very aggressive.'],
                ['hacerse', 'Deliberate, voluntary change (profession, ideology, religion, social status)', 'noun / adjective', 'Se hizo medico. — She became a doctor.'],
                ['convertirse en', 'Radical, complete transformation', 'noun', 'El agua se convirtio en hielo. — The water turned into ice.'],
                ['llegar a ser', 'To eventually become (after effort and time over a long period)', 'noun / adjective', 'Llego a ser director. — He eventually became director.'],
              ],
            },
            {
              type: 'table',
              headers: ['Type of change', 'Verb to use'],
              rows: [
                ['Temporary emotion or physical state', 'ponerse'],
                ['Final state / result (often loss)', 'quedarse'],
                ['Involuntary personality shift', 'volverse'],
                ['Deliberate social identity change', 'hacerse'],
                ['Complete transformation into something else', 'convertirse en'],
                ['Achievement over time through effort', 'llegar a ser'],
              ],
            },
            {
              type: 'examples',
              examples: [
                {
                  es: 'Se puso nervioso antes del examen.',
                  en: 'He got nervous before the exam.',
                },
                {
                  es: 'Se quedo sorprendido al oir la noticia.',
                  en: 'He was left surprised upon hearing the news.',
                },
                {
                  es: 'Se quedo dormido en el sofa.',
                  en: 'He fell asleep on the sofa.',
                },
                {
                  es: 'Con los años se volvio mas tolerante.',
                  en: 'Over the years he became more tolerant.',
                },
                {
                  es: 'Se hizo rico con su negocio.',
                  en: 'He got rich with his business.',
                },
                {
                  es: 'La oruga se convirtio en mariposa.',
                  en: 'The caterpillar turned into a butterfly.',
                },
                {
                  es: 'Llego a ser presidenta de la empresa.',
                  en: 'She eventually became president of the company.',
                },
              ],
            },
          ],
        },
        {
          id: '10.2',
          title: 'Verbal Periphrases with Gerund (Perifrasis Verbales)',
          blocks: [
            {
              type: 'text',
              content:
                'At B2, learners use a range of aspect-marking periphrases beyond simple "estar + gerundio."',
            },
            {
              type: 'table',
              headers: ['Periphrasis', 'Meaning', 'Example'],
              rows: [
                ['estar + gerundio', 'Action in progress', 'Estoy estudiando. — I am studying.'],
                ['seguir / continuar + gerundio', 'Continuing action', 'Sigue lloviendo. — It\'s still raining.'],
                ['llevar + time + gerundio', 'Duration of ongoing action (how long)', 'Llevo tres horas trabajando. — I\'ve been working for three hours.'],
                ['andar + gerundio', 'Aimless, scattered, or habitual ongoing action', 'Anda buscando trabajo. — He\'s going around looking for work.'],
                ['venir + gerundio', 'Ongoing action developing over time from past to present', 'Viene diciendo eso desde hace años. — He\'s been saying that for years.'],
                ['ir + gerundio', 'Gradual progressive action', 'La situacion va mejorando. — The situation is gradually improving.'],
              ],
            },
            {
              type: 'rules',
              items: [
                '"Llevar + gerundio" is never used with "desde hace." Say "Llevo dos horas esperando" (NOT "Llevo dos horas esperando desde hace...")',
                '"Ir + gerundio" emphasizes gradual, step-by-step progression',
                '"Andar + gerundio" often carries a slightly negative or dismissive tone',
              ],
            },
            {
              type: 'examples',
              examples: [
                {
                  es: 'Seguimos esperando una respuesta.',
                  en: "We're still waiting for an answer.",
                },
                {
                  es: 'Llevo toda la mañana intentando llamarte.',
                  en: "I've been trying to call you all morning.",
                },
                {
                  es: 'Los precios van subiendo poco a poco.',
                  en: 'Prices are going up little by little.',
                },
                {
                  es: 'Anda contando mentiras a todo el mundo.',
                  en: 'He goes around telling lies to everyone.',
                },
              ],
            },
          ],
        },
        {
          id: '10.3',
          title: 'Verbal Periphrases with Infinitive',
          blocks: [
            {
              type: 'table',
              headers: ['Periphrasis', 'Meaning', 'Example'],
              rows: [
                ['tener que + inf.', 'Obligation (personal)', 'Tengo que estudiar. — I have to study.'],
                ['haber que + inf.', 'Obligation (impersonal)', 'Hay que trabajar. — One must work.'],
                ['deber + inf.', 'Moral obligation / should', 'Debes ser mas amable. — You should be kinder.'],
                ['deber de + inf.', 'Conjecture / probability', 'Debe de ser las tres. — It must be about three.'],
                ['acabar de + inf.', 'Just completed action', 'Acabo de comer. — I just ate.'],
                ['volver a + inf.', 'To do again / repetition', 'Volvio a llamar. — He called again.'],
                ['dejar de + inf.', 'To stop doing', 'Dejo de fumar. — She stopped smoking.'],
                ['ponerse a + inf.', 'To begin doing (suddenly, often spontaneously)', 'Se puso a llover. — It started to rain.'],
                ['empezar / comenzar a + inf.', 'To begin doing', 'Empezo a hablar. — He started to speak.'],
                ['soler + inf.', 'To usually do / to tend to', 'Suelo desayunar a las ocho. — I usually have breakfast at eight.'],
                ['ir a + inf.', 'Near future / intention', 'Voy a estudiar. — I\'m going to study.'],
                ['llegar a + inf.', 'To manage to / to get to the point of', 'Llego a pensar que era mentira. — I got to the point of thinking it was a lie.'],
              ],
            },
          ],
        },
        {
          id: '10.4',
          title: 'Infinitive After Prepositions',
          blocks: [
            {
              type: 'text',
              content:
                'In Spanish, after any preposition, the only possible verbal form is the infinitive. This contrasts with English, which often uses the gerund (-ing form) after prepositions.',
            },
            {
              type: 'rules',
              items: [
                'Spanish NEVER uses a gerund after a preposition',
                'Where English says "without saying," Spanish says "sin decir"; where English says "after eating," Spanish says "despues de comer"',
              ],
            },
            {
              type: 'table',
              headers: ['Structure', 'Meaning', 'Example'],
              rows: [
                ['al + infinitive', 'Upon / when (simultaneous)', 'Al llegar, lo vio. — Upon arriving, he saw it.'],
                ['antes de + infinitive', 'Before', 'Antes de salir, apaga la luz. — Before leaving, turn off the light.'],
                ['despues de + infinitive', 'After', 'Despues de comer, salimos. — After eating, we left.'],
                ['sin + infinitive', 'Without', 'Salio sin decir nada. — He left without saying anything.'],
                ['para + infinitive', 'In order to', 'Estudio para aprender. — I study in order to learn.'],
                ['por + infinitive', 'Because of / for (cause)', 'Le multaron por conducir rapido. — He was fined for driving fast.'],
                ['a pesar de + infinitive', 'Despite', 'A pesar de estar cansado, siguio. — Despite being tired, he continued.'],
                ['en lugar de / en vez de + infinitive', 'Instead of', 'En lugar de quejarse, actua. — Instead of complaining, act.'],
                ['ademas de + infinitive', 'In addition to', 'Ademas de hablar español, habla frances. — In addition to speaking Spanish, she speaks French.'],
              ],
            },
            {
              type: 'text',
              content: 'The "al + infinitive" construction (temporal clause):',
            },
            {
              type: 'examples',
              examples: [
                {
                  es: 'Al abrir la puerta, encontre un paquete.',
                  en: 'Upon opening the door, I found a package.',
                },
                {
                  es: 'Al enterarse de la noticia, se puso a llorar.',
                  en: 'Upon hearing the news, she started to cry.',
                },
              ],
            },
          ],
        },
        {
          id: '10.5',
          title: 'Word Formation — Nominalisation and Suffixes',
          blocks: [
            {
              type: 'text',
              content:
                'B2 learners are expected to recognize and produce derived words using common suffixes. This expands vocabulary efficiently and helps with reading comprehension.',
            },
            {
              type: 'text',
              content: 'Noun-forming suffixes from verbs:',
            },
            {
              type: 'table',
              headers: ['Suffix', 'Meaning', 'Examples'],
              rows: [
                ['-cion / -sion', 'Action / result', 'traduccion, presentacion, decision, comprension'],
                ['-miento / -mento', 'Process / result', 'conocimiento, entretenimiento, descubrimiento'],
                ['-aje', 'Collective / process', 'aprendizaje, paisaje, montaje, aterrizaje'],
                ['-ura', 'Quality / state', 'lectura, escritura, apertura'],
                ['-ancia / -encia', 'Quality', 'importancia, presencia, paciencia'],
              ],
            },
            {
              type: 'text',
              content: 'Noun-forming suffixes from adjectives:',
            },
            {
              type: 'table',
              headers: ['Suffix', 'Meaning', 'Examples'],
              rows: [
                ['-dad / -tad', 'Quality / abstract state', 'libertad, dificultad, capacidad, felicidad'],
                ['-eza', 'Abstract quality', 'belleza, tristeza, naturaleza, grandeza'],
                ['-ura', 'Quality / state', 'altura, dulzura, locura, frescura'],
                ['-ia', 'Abstract quality / place', 'alegria, energia, panaderia, libreria'],
              ],
            },
            {
              type: 'text',
              content: 'Adjective-forming suffixes:',
            },
            {
              type: 'table',
              headers: ['Suffix', 'Meaning', 'Examples'],
              rows: [
                ['-oso / -osa', 'Full of / having quality', 'peligroso, famoso, cuidadoso'],
                ['-able / -ible', 'Capable of', 'comprensible, razonable, confiable'],
                ['-al', 'Related to', 'natural, digital, formal, cultural'],
                ['-ivo / -iva', 'Tending to', 'creativo, educativo, activo, productivo'],
                ['-ista', 'Person with occupation / ideology', 'periodista, artista, futbolista, optimista'],
              ],
            },
            {
              type: 'text',
              content: 'Person-denoting suffixes:',
            },
            {
              type: 'table',
              headers: ['Suffix', 'Meaning', 'Examples'],
              rows: [
                ['-ista', 'Occupation / ideology', 'periodista, artista, dentista'],
                ['-ero / -era', 'Occupation / associated with', 'panadero, enfermero, cajero'],
                ['-dor / -dora', 'Agent (person who does)', 'trabajador, vendedor, escritor'],
                ['-ante / -ente', 'Agent', 'estudiante, cantante, asistente'],
              ],
            },
          ],
        },
        {
          id: '10.6',
          title: 'Discourse Connectors (Conectores Discursivos)',
          blocks: [
            {
              type: 'text',
              content:
                'At B2, learners must produce cohesive extended texts using a range of connectors organized by function.',
            },
            {
              type: 'text',
              content: 'Addition:',
            },
            {
              type: 'table',
              headers: ['Connector', 'Meaning', 'Register'],
              rows: [
                ['ademas', 'furthermore, besides', 'neutral'],
                ['tambien', 'also', 'neutral'],
                ['asimismo', 'likewise, also', 'formal'],
                ['incluso', 'even', 'neutral'],
                ['por otra parte', 'on the other hand', 'formal'],
                ['es mas', "what's more", 'neutral'],
              ],
            },
            {
              type: 'text',
              content: 'Contrast:',
            },
            {
              type: 'table',
              headers: ['Connector', 'Meaning', 'Register'],
              rows: [
                ['pero', 'but', 'neutral'],
                ['sin embargo', 'however, nevertheless', 'formal/written'],
                ['no obstante', 'nevertheless', 'formal'],
                ['aunque', 'although, even though', 'neutral'],
                ['a pesar de (que)', 'despite (the fact that)', 'neutral'],
                ['en cambio', 'on the other hand', 'neutral'],
                ['por el contrario', 'on the contrary', 'formal'],
                ['ahora bien', 'that said, however', 'formal'],
              ],
            },
            {
              type: 'text',
              content: 'Cause and Reason:',
            },
            {
              type: 'table',
              headers: ['Connector', 'Meaning', 'Register'],
              rows: [
                ['porque', 'because', 'neutral'],
                ['ya que', 'since, given that', 'neutral/formal'],
                ['puesto que', 'since, given that', 'formal'],
                ['debido a (que)', 'due to (the fact that)', 'formal'],
                ['a causa de', 'because of', 'neutral'],
                ['dado que', 'given that', 'formal'],
                ['como (at start of sentence)', 'since, as', 'neutral'],
              ],
            },
            {
              type: 'text',
              content: 'Consequence / Result:',
            },
            {
              type: 'table',
              headers: ['Connector', 'Meaning', 'Register'],
              rows: [
                ['por eso', "that's why", 'neutral'],
                ['por lo tanto', 'therefore', 'formal'],
                ['asi que', 'so', 'neutral'],
                ['en consecuencia', 'consequently', 'formal'],
                ['de ahi que (+ subjunctive)', 'hence, which is why', 'formal'],
                ['por consiguiente', 'consequently', 'formal'],
              ],
            },
            {
              type: 'text',
              content: 'Sequence / Ordering:',
            },
            {
              type: 'table',
              headers: ['Connector', 'Meaning'],
              rows: [
                ['en primer lugar / primero', 'firstly'],
                ['en segundo lugar / despues', 'secondly / then'],
                ['a continuacion', 'next, below'],
                ['por ultimo / finalmente', 'finally'],
                ['antes de nada / ante todo', 'first of all'],
              ],
            },
            {
              type: 'text',
              content: 'Exemplification:',
            },
            {
              type: 'table',
              headers: ['Connector', 'Meaning'],
              rows: [
                ['por ejemplo', 'for example'],
                ['es decir', 'that is to say'],
                ['o sea', 'that is, I mean'],
                ['como', 'such as'],
                ['en concreto / concretamente', 'specifically, in particular'],
              ],
            },
            {
              type: 'text',
              content: 'Reformulation:',
            },
            {
              type: 'table',
              headers: ['Connector', 'Meaning'],
              rows: [
                ['es decir', 'that is (to say)'],
                ['o sea', 'that is, in other words'],
                ['en otras palabras', 'in other words'],
                ['mejor dicho', 'or rather, more precisely'],
                ['esto es', 'that is'],
                ['dicho de otro modo', 'put another way'],
              ],
            },
            {
              type: 'text',
              content: 'Concession:',
            },
            {
              type: 'table',
              headers: ['Connector', 'Meaning', 'Note'],
              rows: [
                ['aunque + indicative', 'although (fact)', 'Lo hizo aunque era dificil.'],
                ['aunque + subjunctive', 'even if (uncertain)', 'Lo hare aunque sea dificil.'],
                ['a pesar de que', 'despite the fact that', 'neutral'],
                ['si bien', 'even though, while', 'formal'],
                ['por mas que (+ subjunctive)', 'no matter how much', 'Por mas que lo intente, no puedo.'],
                ['por mucho que (+ subjunctive)', 'no matter how much', 'Por mucho que estudie, no aprueba.'],
              ],
            },
          ],
        },
        {
          id: '10.7',
          title: 'Double Object Pronouns and Leismo / Laismo',
          blocks: [
            {
              type: 'text',
              content:
                'At B2, learners must handle sentences with two object pronouns and understand regional variation in pronoun usage.',
            },
            {
              type: 'text',
              content: 'Standard double pronoun order: Indirect Object + Direct Object + Verb',
            },
            {
              type: 'rules',
              items: [
                'When two object pronouns appear together, the indirect always comes first',
                'The order is: me/te/le/nos/os/les + lo/la/los/las',
                'When both pronouns are 3rd person (le/les + lo/la/los/las), le/les changes to "se"',
              ],
            },
            {
              type: 'table',
              headers: ['Indirect', '+ Direct', 'Example'],
              rows: [
                ['me', 'lo/la/los/las', 'Me lo dio. — He gave it to me.'],
                ['te', 'lo/la/los/las', 'Te la explico. — She explained it to you.'],
                ['se (= le/les)', 'lo/la/los/las', 'Se lo dije. — I told it to him/her/them.'],
                ['nos', 'lo/la/los/las', 'Nos los mandaron. — They sent them to us.'],
                ['os', 'lo/la/los/las', 'Os las doy. — I give them to you all.'],
              ],
            },
            {
              type: 'text',
              content:
                'The le -> se rule: Le doy el libro -> Se lo doy. (NOT: Le lo doy.) Les explico la idea -> Se la explico. Because "se" can refer to many people (el, ella, ellos, ellas, usted, ustedes), add "a el/ella/ellos..." for clarity: Se lo di a ella. — I gave it to her.',
            },
            {
              type: 'text',
              content: 'Pronoun placement:',
            },
            {
              type: 'rules',
              items: [
                'Before conjugated verbs: Me lo da. — He gives it to me.',
                'Attached to infinitives: Va a darmelo. — He\'s going to give it to me. (or: Me lo va a dar.)',
                'Attached to gerunds: Esta dandomelo. — He\'s giving it to me. (or: Me lo esta dando.)',
                'Attached to affirmative imperatives: Damelo. — Give it to me.',
                'Before negative imperatives: No me lo des. — Don\'t give it to me.',
              ],
            },
            {
              type: 'text',
              content:
                'Leismo (Spanish peninsular variation): Using le/les as a direct object pronoun for masculine persons. This is widely accepted in Spain, especially central/northern regions, and the Real Academia Española considers "le" for a male person acceptable.',
            },
            {
              type: 'examples',
              examples: [
                {
                  es: 'Le vi ayer.',
                  en: 'I saw him yesterday. (Standard peninsular; Latin American standard: Lo vi.)',
                },
                {
                  es: 'A Juan le llame esta mañana.',
                  en: 'I called Juan this morning.',
                },
              ],
            },
            {
              type: 'text',
              content:
                'Laismo (incorrect — avoid): Using la/las as an indirect object pronoun. This occurs in parts of central Spain but is considered incorrect by the RAE. Incorrect: La dije la verdad. Correct: Le dije la verdad. — I told her the truth.',
            },
            {
              type: 'text',
              content:
                'Loismo (incorrect — avoid): Using lo/los as an indirect object pronoun. Very rare and always considered incorrect. Incorrect: Lo dije que viniera. Correct: Le dije que viniera. — I told him to come.',
            },
          ],
        },
      ],
    },
  ],
}
