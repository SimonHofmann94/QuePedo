import { GrammarLevel } from './types'

export const grammarA2: GrammarLevel = {
  level: 'A2',
  title: 'Elementary Spanish Grammar',
  chapters: [
    {
      id: 0,
      title: 'The Preterite Tense (Pretérito Indefinido)',
      sections: [
        {
          id: '1.1',
          title: 'Regular -AR Verbs in the Preterite',
          blocks: [
            {
              type: 'text',
              content:
                'The preterite (pretérito indefinido) describes completed actions in the past at a specific time.',
            },
            {
              type: 'table',
              headers: ['Person', 'Ending', 'Example'],
              rows: [
                ['yo', '-é', 'hablé'],
                ['tú', '-aste', 'hablaste'],
                ['él/ella/usted', '-ó', 'habló'],
                ['nosotros/as', '-amos', 'hablamos'],
                ['vosotros/as', '-asteis', 'hablasteis'],
                ['ellos/ellas/ustedes', '-aron', 'hablaron'],
              ],
            },
            {
              type: 'rules',
              items: [
                'The nosotros form is the same as the present tense — context clarifies the meaning',
                'The yo and él/ella forms carry written accents',
              ],
            },
            {
              type: 'examples',
              examples: [
                {
                  es: 'Ayer hablé con mi madre.',
                  en: 'Yesterday I spoke with my mother.',
                },
                {
                  es: 'Ella trabajó ocho horas.',
                  en: 'She worked eight hours.',
                },
                {
                  es: 'Compramos pan esta mañana.',
                  en: 'We bought bread this morning.',
                },
              ],
            },
          ],
        },
        {
          id: '1.2',
          title: 'Regular -ER and -IR Verbs in the Preterite',
          blocks: [
            {
              type: 'text',
              content: '-ER and -IR verbs share the same preterite endings.',
            },
            {
              type: 'table',
              headers: ['Person', 'Ending', 'comer', 'vivir'],
              rows: [
                ['yo', '-í', 'comí', 'viví'],
                ['tú', '-iste', 'comiste', 'viviste'],
                ['él/ella/usted', '-ió', 'comió', 'vivió'],
                ['nosotros/as', '-imos', 'comimos', 'vivimos'],
                ['vosotros/as', '-isteis', 'comisteis', 'vivisteis'],
                ['ellos/ellas/ustedes', '-ieron', 'comieron', 'vivieron'],
              ],
            },
            {
              type: 'examples',
              examples: [
                {
                  es: 'Comí una pizza anoche.',
                  en: 'I ate a pizza last night.',
                },
                {
                  es: '¿Escribiste el correo?',
                  en: 'Did you write the email?',
                },
                {
                  es: 'Vivieron en Barcelona dos años.',
                  en: 'They lived in Barcelona for two years.',
                },
              ],
            },
          ],
        },
        {
          id: '1.3',
          title: 'Irregular Preterites: Ser / Ir',
          blocks: [
            {
              type: 'text',
              content:
                '"Ser" and "ir" share the same preterite forms. Context determines the meaning.',
            },
            {
              type: 'table',
              headers: ['Person', 'Form'],
              rows: [
                ['yo', 'fui'],
                ['tú', 'fuiste'],
                ['él/ella/usted', 'fue'],
                ['nosotros/as', 'fuimos'],
                ['vosotros/as', 'fuisteis'],
                ['ellos/ellas/ustedes', 'fueron'],
              ],
            },
            {
              type: 'examples',
              examples: [
                {
                  es: 'Fui al supermercado.',
                  en: 'I went to the supermarket. (ir)',
                },
                {
                  es: 'Fue una fiesta increíble.',
                  en: 'It was an incredible party. (ser)',
                },
                {
                  es: 'Fuimos a la playa el domingo.',
                  en: 'We went to the beach on Sunday. (ir)',
                },
              ],
            },
          ],
        },
        {
          id: '1.4',
          title:
            'Irregular Preterites: Estar, Tener, Hacer, Poder, Poner, Saber, Querer, Venir, Decir, Traer',
          blocks: [
            {
              type: 'text',
              content:
                'These high-frequency verbs have irregular stems and a special set of unstressed endings (no accents on yo or él/ella).',
            },
            {
              type: 'table',
              headers: ['Person', 'Ending'],
              rows: [
                ['yo', '-e'],
                ['tú', '-iste'],
                ['él/ella/usted', '-o'],
                ['nosotros/as', '-imos'],
                ['vosotros/as', '-isteis'],
                ['ellos/ellas/ustedes', '-ieron / -eron'],
              ],
            },
            {
              type: 'table',
              headers: ['Infinitive', 'Stem', 'yo form'],
              rows: [
                ['estar', 'estuv-', 'estuve'],
                ['tener', 'tuv-', 'tuve'],
                ['hacer', 'hic-/hiz-', 'hice'],
                ['poder', 'pud-', 'pude'],
                ['poner', 'pus-', 'puse'],
                ['saber', 'sup-', 'supe'],
                ['querer', 'quis-', 'quise'],
                ['venir', 'vin-', 'vine'],
                ['decir', 'dij-', 'dije'],
                ['traer', 'traj-', 'traje'],
              ],
            },
            {
              type: 'rules',
              items: [
                '"Hacer" changes c to z in the él/ella form: "hizo" (to preserve the /s/ sound)',
                '"Decir" and "traer" use -eron (not -ieron) in the ellos form: dijeron, trajeron',
              ],
            },
            {
              type: 'examples',
              examples: [
                {
                  es: 'Estuve en casa todo el día.',
                  en: 'I was at home all day.',
                },
                {
                  es: 'Tuve un examen difícil.',
                  en: 'I had a difficult exam.',
                },
                {
                  es: 'Hizo mucho calor ayer.',
                  en: 'It was very hot yesterday.',
                },
                {
                  es: 'No pude dormir anoche.',
                  en: "I couldn't sleep last night.",
                },
                { es: '¿Qué dijiste?', en: 'What did you say?' },
              ],
            },
          ],
        },
        {
          id: '1.5',
          title: 'Preterite Time Markers',
          blocks: [
            {
              type: 'table',
              headers: ['Marker', 'Meaning'],
              rows: [
                ['ayer', 'yesterday'],
                ['anoche', 'last night'],
                ['la semana pasada', 'last week'],
                ['el mes pasado', 'last month'],
                ['el año pasado', 'last year'],
                ['hace dos días', 'two days ago'],
                ['el lunes (pasado)', '(last) Monday'],
                ['una vez', 'once'],
                ['de repente', 'suddenly'],
                ['en ese momento', 'at that moment'],
              ],
            },
            {
              type: 'examples',
              examples: [
                {
                  es: 'La semana pasada viajé a Madrid.',
                  en: 'Last week I traveled to Madrid.',
                },
                {
                  es: 'Hace tres años estudié en Londres.',
                  en: 'Three years ago I studied in London.',
                },
              ],
            },
          ],
        },
      ],
    },
    {
      id: 1,
      title: 'The Imperfect Tense (Pretérito Imperfecto)',
      sections: [
        {
          id: '2.1',
          title: 'Regular -AR Verbs in the Imperfect',
          blocks: [
            {
              type: 'text',
              content:
                'The imperfect describes habitual, repeated, or ongoing past actions, as well as descriptions and background in the past.',
            },
            {
              type: 'table',
              headers: ['Person', 'Ending', 'Example'],
              rows: [
                ['yo', '-aba', 'hablaba'],
                ['tú', '-abas', 'hablabas'],
                ['él/ella/usted', '-aba', 'hablaba'],
                ['nosotros/as', '-ábamos', 'hablábamos'],
                ['vosotros/as', '-abais', 'hablabais'],
                ['ellos/ellas/ustedes', '-aban', 'hablaban'],
              ],
            },
            {
              type: 'rules',
              items: [
                'Only the nosotros form carries a written accent',
                'The yo and él/ella forms are identical — context clarifies',
              ],
            },
          ],
        },
        {
          id: '2.2',
          title: 'Regular -ER and -IR Verbs in the Imperfect',
          blocks: [
            {
              type: 'table',
              headers: ['Person', 'Ending', 'comer', 'vivir'],
              rows: [
                ['yo', '-ía', 'comía', 'vivía'],
                ['tú', '-ías', 'comías', 'vivías'],
                ['él/ella/usted', '-ía', 'comía', 'vivía'],
                ['nosotros/as', '-íamos', 'comíamos', 'vivíamos'],
                ['vosotros/as', '-íais', 'comíais', 'vivíais'],
                ['ellos/ellas/ustedes', '-ían', 'comían', 'vivían'],
              ],
            },
          ],
        },
        {
          id: '2.3',
          title: 'Irregular Verbs in the Imperfect',
          blocks: [
            {
              type: 'text',
              content: 'Only three verbs are irregular in the imperfect.',
            },
            {
              type: 'table',
              headers: ['Person', 'Ser', 'Ir', 'Ver'],
              rows: [
                ['yo', 'era', 'iba', 'veía'],
                ['tú', 'eras', 'ibas', 'veías'],
                ['él/ella/usted', 'era', 'iba', 'veía'],
                ['nosotros/as', 'éramos', 'íbamos', 'veíamos'],
                ['vosotros/as', 'erais', 'ibais', 'veíais'],
                ['ellos/ellas/ustedes', 'eran', 'iban', 'veían'],
              ],
            },
          ],
        },
        {
          id: '2.4',
          title: 'Uses of the Imperfect',
          blocks: [
            {
              type: 'rules',
              items: [
                'Habitual past actions: "De niño, jugaba en el parque." (As a child, I used to play in the park.)',
                'Descriptions in the past: "La casa era grande y tenía un jardín." (The house was big and had a garden.)',
                'Ongoing actions: "Mientras comíamos, llovía." (While we were eating, it was raining.)',
                'Age, time, and weather in the past: "Tenía diez años." / "Eran las tres." / "Hacía frío."',
                'Physical and emotional states: "Estaba cansado y tenía hambre." (I was tired and hungry.)',
              ],
            },
            {
              type: 'table',
              headers: ['Marker', 'Meaning'],
              rows: [
                ['siempre', 'always'],
                ['a menudo', 'often'],
                ['todos los días', 'every day'],
                ['cada semana', 'every week'],
                ['de niño/a', 'as a child'],
                ['antes', 'before / in the past'],
                ['generalmente', 'generally'],
                ['normalmente', 'normally'],
                ['mientras', 'while'],
                ['en esa época', 'at that time'],
              ],
            },
            {
              type: 'examples',
              examples: [
                {
                  es: 'Cuando era joven, iba a la playa todos los veranos.',
                  en: 'When I was young, I used to go to the beach every summer.',
                },
                {
                  es: 'Mi abuela siempre cocinaba los domingos.',
                  en: 'My grandmother always cooked on Sundays.',
                },
                {
                  es: 'Eran las ocho y hacía mucho frío.',
                  en: 'It was eight o\'clock and it was very cold.',
                },
              ],
            },
          ],
        },
        {
          id: '2.5',
          title: 'Preterite vs. Imperfect — Basic Contrast',
          blocks: [
            {
              type: 'table',
              headers: ['Preterite', 'Imperfect'],
              rows: [
                [
                  'Completed action at a specific time',
                  'Ongoing or habitual action',
                ],
                ['What happened', 'What was happening'],
                ['Advances the story', 'Sets the scene / background'],
                ['Single event', 'Repeated or continuous'],
              ],
            },
            {
              type: 'examples',
              examples: [
                {
                  es: 'Ayer llovió.',
                  en: 'Yesterday it rained. (completed event)',
                },
                {
                  es: 'Ayer llovía cuando salí.',
                  en: 'Yesterday it was raining when I left. (background + event)',
                },
                {
                  es: 'Comí a las dos.',
                  en: 'I ate at two. (completed)',
                },
                {
                  es: 'Siempre comía a las dos.',
                  en: 'I always used to eat at two. (habitual)',
                },
              ],
            },
          ],
        },
      ],
    },
    {
      id: 2,
      title: 'Direct Object Pronouns',
      sections: [
        {
          id: '3.1',
          title: 'What Are Direct Object Pronouns?',
          blocks: [
            {
              type: 'text',
              content:
                'Direct object pronouns replace the noun that directly receives the action of the verb ("What?" or "Whom?").',
            },
            {
              type: 'table',
              headers: ['Person', 'Pronoun'],
              rows: [
                ['yo', 'me'],
                ['tú', 'te'],
                ['él / usted (masc.)', 'lo'],
                ['ella / usted (fem.)', 'la'],
                ['nosotros/as', 'nos'],
                ['vosotros/as', 'os'],
                ['ellos / ustedes (masc.)', 'los'],
                ['ellas / ustedes (fem.)', 'las'],
              ],
            },
          ],
        },
        {
          id: '3.2',
          title: 'Placement Rules',
          blocks: [
            {
              type: 'rules',
              items: [
                'Before a conjugated verb: "Lo veo." (I see it/him.)',
                'Attached to the end of an infinitive: "Quiero verlo." (I want to see it.)',
                'Attached to the end of a gerund: "Estoy comiéndola." (I am eating it.)',
                'Attached to the end of an affirmative command: "Cómelo." (Eat it.)',
                'Before a negative command: "No lo comas." (Don\'t eat it.)',
                'When there is a conjugated verb + infinitive/gerund, the pronoun can go before the conjugated verb instead: "Lo quiero ver." / "La estoy comiendo."',
              ],
            },
            {
              type: 'examples',
              examples: [
                {
                  es: '¿Tienes el libro? — Sí, lo tengo.',
                  en: 'Do you have the book? — Yes, I have it.',
                },
                {
                  es: '¿Ves a María? — Sí, la veo.',
                  en: 'Do you see Maria? — Yes, I see her.',
                },
                {
                  es: '¿Compraste las manzanas? — Sí, las compré.',
                  en: 'Did you buy the apples? — Yes, I bought them.',
                },
                {
                  es: 'Voy a llamar a Pedro. — Voy a llamarlo. / Lo voy a llamar.',
                  en: "I'm going to call Pedro. — I'm going to call him.",
                },
              ],
            },
          ],
        },
        {
          id: '3.3',
          title: 'Personal "a" with Direct Objects',
          blocks: [
            {
              type: 'text',
              content:
                'When the direct object is a specific person (or personified entity), use the preposition "a" before it.',
            },
            {
              type: 'rules',
              items: [
                '"Veo a María." — I see Maria. (specific person = personal a)',
                '"Veo la película." — I see the movie. (thing = no personal a)',
                '"Busco a mi hermano." — I\'m looking for my brother.',
                '"Busco un taxi." — I\'m looking for a taxi.',
                'Also used with pets: "Quiero a mi perro." — I love my dog.',
              ],
            },
          ],
        },
      ],
    },
    {
      id: 3,
      title: 'Indirect Object Pronouns',
      sections: [
        {
          id: '4.1',
          title: 'What Are Indirect Object Pronouns?',
          blocks: [
            {
              type: 'text',
              content:
                'Indirect object pronouns indicate to whom or for whom the action is done ("To whom?" / "For whom?").',
            },
            {
              type: 'table',
              headers: ['Person', 'Pronoun'],
              rows: [
                ['yo', 'me'],
                ['tú', 'te'],
                ['él/ella/usted', 'le'],
                ['nosotros/as', 'nos'],
                ['vosotros/as', 'os'],
                ['ellos/ellas/ustedes', 'les'],
              ],
            },
          ],
        },
        {
          id: '4.2',
          title: 'Uses and Placement',
          blocks: [
            {
              type: 'text',
              content:
                'Indirect object pronouns follow the same placement rules as direct object pronouns.',
            },
            {
              type: 'rules',
              items: [
                'A clarifying phrase with "a" is often added: "Le doy el libro a María."',
                'Redundancy is normal and required in many cases: "A mí me gusta." / "A ella le duele."',
                'Indirect objects are very common with verbs like dar, decir, preguntar, enviar, escribir, comprar, regalar, enseñar, explicar, pedir, contar',
              ],
            },
            {
              type: 'examples',
              examples: [
                {
                  es: 'Le escribo una carta a mi abuela.',
                  en: 'I write a letter to my grandmother.',
                },
                {
                  es: '¿Me puedes dar un vaso de agua?',
                  en: 'Can you give me a glass of water?',
                },
                {
                  es: 'Les expliqué el problema.',
                  en: 'I explained the problem to them.',
                },
                {
                  es: 'Te compré un regalo.',
                  en: 'I bought you a gift.',
                },
                {
                  es: 'Nos enseñó la ciudad.',
                  en: 'He showed us the city.',
                },
              ],
            },
          ],
        },
        {
          id: '4.3',
          title: 'Combining Direct and Indirect Pronouns (Introduction)',
          blocks: [
            {
              type: 'text',
              content:
                'When both appear together, the indirect object pronoun comes first.',
            },
            {
              type: 'rules',
              items: [
                'me/te/nos/os + lo/la/los/las: "Me lo dio." (He gave it to me.)',
                'When le/les is followed by lo/la/los/las, le/les changes to "se": "Le di el libro." → "Se lo di." (I gave it to him/her.)',
              ],
            },
            {
              type: 'examples',
              examples: [
                {
                  es: '¿Me prestas tu bolígrafo? — Te lo presto.',
                  en: 'Can you lend me your pen? — I\'ll lend it to you.',
                },
                {
                  es: 'Le di las flores a Ana. → Se las di.',
                  en: 'I gave the flowers to Ana. → I gave them to her.',
                },
                {
                  es: '¿Nos traes el café? — Os lo traigo ahora.',
                  en: 'Will you bring us the coffee? — I\'ll bring it to you now.',
                },
              ],
            },
          ],
        },
      ],
    },
    {
      id: 4,
      title: 'The Imperative (Commands)',
      sections: [
        {
          id: '5.1',
          title: 'Affirmative Tú Commands — Regular',
          blocks: [
            {
              type: 'text',
              content:
                'Affirmative tú commands use the él/ella form of the present indicative.',
            },
            {
              type: 'table',
              headers: ['Infinitive', 'Tú Command', 'Meaning'],
              rows: [
                ['hablar', 'habla', 'speak'],
                ['comer', 'come', 'eat'],
                ['escribir', 'escribe', 'write'],
                ['abrir', 'abre', 'open'],
                ['leer', 'lee', 'read'],
              ],
            },
            {
              type: 'examples',
              examples: [
                {
                  es: 'Habla más despacio, por favor.',
                  en: 'Speak more slowly, please.',
                },
                {
                  es: 'Come tu verdura.',
                  en: 'Eat your vegetables.',
                },
                {
                  es: 'Abre la ventana.',
                  en: 'Open the window.',
                },
              ],
            },
          ],
        },
        {
          id: '5.2',
          title: 'Affirmative Tú Commands — Irregular',
          blocks: [
            {
              type: 'text',
              content:
                'Eight common verbs have irregular affirmative tú commands.',
            },
            {
              type: 'table',
              headers: ['Infinitive', 'Command'],
              rows: [
                ['decir', 'di'],
                ['hacer', 'haz'],
                ['ir', 've'],
                ['poner', 'pon'],
                ['salir', 'sal'],
                ['ser', 'sé'],
                ['tener', 'ten'],
                ['venir', 'ven'],
              ],
            },
            {
              type: 'examples',
              examples: [
                { es: 'Haz la tarea.', en: 'Do the homework.' },
                { es: 'Ven aquí.', en: 'Come here.' },
                { es: 'Sal de la habitación.', en: 'Leave the room.' },
                { es: 'Pon la mesa.', en: 'Set the table.' },
                { es: 'Di la verdad.', en: 'Tell the truth.' },
              ],
            },
          ],
        },
        {
          id: '5.3',
          title: 'Negative Tú Commands',
          blocks: [
            {
              type: 'text',
              content:
                'Negative tú commands use the present subjunctive tú form.',
            },
            {
              type: 'text',
              content: 'Formation: No + present subjunctive (tú form)',
            },
            {
              type: 'table',
              headers: ['Infinitive', 'Negative Command'],
              rows: [
                ['hablar', 'no hables'],
                ['comer', 'no comas'],
                ['escribir', 'no escribas'],
                ['ir', 'no vayas'],
                ['hacer', 'no hagas'],
                ['decir', 'no digas'],
                ['ser', 'no seas'],
                ['tener', 'no tengas'],
              ],
            },
            {
              type: 'examples',
              examples: [
                {
                  es: 'No hables con la boca llena.',
                  en: "Don't talk with your mouth full.",
                },
                {
                  es: 'No comas tan rápido.',
                  en: "Don't eat so fast.",
                },
                { es: 'No vayas solo.', en: "Don't go alone." },
                { es: 'No seas malo.', en: "Don't be bad." },
              ],
            },
          ],
        },
        {
          id: '5.4',
          title: 'Usted / Ustedes Commands',
          blocks: [
            {
              type: 'text',
              content:
                'Formal commands (usted/ustedes) always use the present subjunctive, for both affirmative and negative.',
            },
            {
              type: 'table',
              headers: ['Infinitive', 'Usted', 'Ustedes'],
              rows: [
                ['hablar', 'hable / no hable', 'hablen / no hablen'],
                ['comer', 'coma / no coma', 'coman / no coman'],
                ['escribir', 'escriba / no escriba', 'escriban / no escriban'],
                ['ir', 'vaya / no vaya', 'vayan / no vayan'],
                ['tener', 'tenga / no tenga', 'tengan / no tengan'],
              ],
            },
            {
              type: 'examples',
              examples: [
                {
                  es: 'Pase, por favor.',
                  en: 'Come in, please.',
                },
                {
                  es: 'No se preocupe.',
                  en: "Don't worry.",
                },
                {
                  es: 'Siéntense, por favor.',
                  en: 'Sit down, please.',
                },
              ],
            },
          ],
        },
        {
          id: '5.5',
          title: 'Pronouns with Commands',
          blocks: [
            {
              type: 'rules',
              items: [
                'Affirmative commands: pronouns attach to the end — "Dime." (Tell me.) / "Cómelo." (Eat it.)',
                'Negative commands: pronouns go before the verb — "No me digas." (Don\'t tell me.) / "No lo comas." (Don\'t eat it.)',
                'When attaching pronouns, add a written accent to maintain the original stress: "Diga" → "Dígame" / "Come" → "Cómelo"',
              ],
            },
            {
              type: 'examples',
              examples: [
                {
                  es: 'Dáselo a tu hermano.',
                  en: 'Give it to your brother.',
                },
                {
                  es: 'No se lo digas a nadie.',
                  en: "Don't tell it to anyone.",
                },
                {
                  es: 'Escríbeme cuando llegues.',
                  en: 'Write to me when you arrive.',
                },
              ],
            },
          ],
        },
      ],
    },
    {
      id: 5,
      title: 'Comparatives and Superlatives',
      sections: [
        {
          id: '6.1',
          title: 'Comparatives of Inequality',
          blocks: [
            {
              type: 'text',
              content:
                'más + adjective/noun/adverb + que = more ... than\nmenos + adjective/noun/adverb + que = less ... than',
            },
            {
              type: 'examples',
              examples: [
                {
                  es: 'Madrid es más grande que Sevilla.',
                  en: 'Madrid is bigger than Seville.',
                },
                {
                  es: 'Este libro es menos interesante que el otro.',
                  en: 'This book is less interesting than the other one.',
                },
                {
                  es: 'Tengo más amigos que tú.',
                  en: 'I have more friends than you.',
                },
                {
                  es: 'Habla más rápido que yo.',
                  en: 'He speaks faster than me.',
                },
              ],
            },
          ],
        },
        {
          id: '6.2',
          title: 'Comparatives of Equality',
          blocks: [
            {
              type: 'text',
              content:
                'tan + adjective/adverb + como = as ... as\ntanto/a/os/as + noun + como = as much/many ... as\nverb + tanto como = as much as',
            },
            {
              type: 'rules',
              items: [
                '"Tan" does not change form',
                '"Tanto" agrees with the noun: tanto dinero, tanta comida, tantos libros, tantas casas',
              ],
            },
            {
              type: 'examples',
              examples: [
                {
                  es: 'Soy tan alto como mi padre.',
                  en: 'I am as tall as my father.',
                },
                {
                  es: 'No tengo tantos libros como tú.',
                  en: "I don't have as many books as you.",
                },
                {
                  es: 'Ella trabaja tanto como yo.',
                  en: 'She works as much as I do.',
                },
              ],
            },
          ],
        },
        {
          id: '6.3',
          title: 'Irregular Comparatives',
          blocks: [
            {
              type: 'table',
              headers: ['Adjective', 'Comparative'],
              rows: [
                ['bueno (good)', 'mejor (better)'],
                ['malo (bad)', 'peor (worse)'],
                ['grande (old)', 'mayor (older)'],
                ['pequeño (young)', 'menor (younger)'],
              ],
            },
            {
              type: 'rules',
              items: [
                'Never say "más bueno" for "better" — use "mejor"',
                'Never say "más malo" for "worse" — use "peor"',
                '"Más grande" / "más pequeño" refer to physical size; "mayor" / "menor" refer to age',
              ],
            },
            {
              type: 'examples',
              examples: [
                {
                  es: 'Mi hermano es mayor que yo.',
                  en: 'My brother is older than me.',
                },
                {
                  es: 'Esta película es mejor que la otra.',
                  en: 'This movie is better than the other one.',
                },
                {
                  es: 'Hoy me siento peor que ayer.',
                  en: 'Today I feel worse than yesterday.',
                },
              ],
            },
          ],
        },
        {
          id: '6.4',
          title: 'Superlatives',
          blocks: [
            {
              type: 'text',
              content:
                'Relative superlative: el/la/los/las + más/menos + adjective + de\n\nAbsolute superlative: adjective + -ísimo/a/os/as',
            },
            {
              type: 'rules',
              items: [
                '"De" is used instead of "en" (unlike English "in"): "Es el más alto de la clase." (He is the tallest in the class.)',
                'Remove the final vowel before -ísimo: grande → grandísimo, bueno → buenísimo',
              ],
            },
            {
              type: 'examples',
              examples: [
                {
                  es: 'Es la ciudad más bonita de España.',
                  en: "It's the most beautiful city in Spain.",
                },
                {
                  es: 'Es el restaurante más caro del barrio.',
                  en: "It's the most expensive restaurant in the neighborhood.",
                },
                {
                  es: 'La comida estaba riquísima.',
                  en: 'The food was extremely delicious.',
                },
                {
                  es: 'Estoy cansadísimo.',
                  en: 'I am extremely tired.',
                },
              ],
            },
          ],
        },
      ],
    },
    {
      id: 6,
      title: 'The Present Perfect (Pretérito Perfecto)',
      sections: [
        {
          id: '7.1',
          title: 'Formation',
          blocks: [
            {
              type: 'text',
              content:
                'The present perfect is formed with the present tense of "haber" + past participle.',
            },
            {
              type: 'table',
              headers: ['Person', 'Form'],
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
              type: 'rules',
              items: [
                '-ar → -ado: hablar → hablado, comprar → comprado',
                '-er → -ido: comer → comido, beber → bebido',
                '-ir → -ido: vivir → vivido, salir → salido',
              ],
            },
          ],
        },
        {
          id: '7.2',
          title: 'Irregular Past Participles',
          blocks: [
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
          ],
        },
        {
          id: '7.3',
          title: 'Uses',
          blocks: [
            {
              type: 'rules',
              items: [
                'Actions completed in a period of time connected to the present: hoy (today), esta semana (this week), este año (this year)',
                'Life experiences: "¿Has estado en México?" (Have you been to Mexico?)',
                'Recent past with "ya" (already) and "todavía no" (not yet)',
                'The past participle never changes for gender or number in compound tenses',
              ],
            },
            {
              type: 'examples',
              examples: [
                {
                  es: 'Hoy he trabajado mucho.',
                  en: 'Today I have worked a lot.',
                },
                {
                  es: '¿Has comido ya?',
                  en: 'Have you eaten already?',
                },
                {
                  es: 'Todavía no he terminado.',
                  en: "I haven't finished yet.",
                },
                {
                  es: 'Este año hemos viajado a Italia.',
                  en: 'This year we have traveled to Italy.',
                },
                {
                  es: 'Nunca he visto esa película.',
                  en: 'I have never seen that movie.',
                },
                {
                  es: '¿Alguna vez has probado la paella?',
                  en: 'Have you ever tried paella?',
                },
              ],
            },
          ],
        },
        {
          id: '7.4',
          title: 'Present Perfect vs. Preterite',
          blocks: [
            {
              type: 'text',
              content:
                'In Spain, the present perfect is used for recent or same-day events; the preterite is used for completed past events. In Latin America, the preterite is more common for both.',
            },
            {
              type: 'table',
              headers: ['Spain (present perfect)', 'Latin America (preterite)'],
              rows: [
                ['Hoy he comido paella.', 'Hoy comí paella.'],
                [
                  'Esta mañana he ido al médico.',
                  'Esta mañana fui al médico.',
                ],
              ],
            },
          ],
        },
      ],
    },
    {
      id: 7,
      title: 'Prepositions — Expanded',
      sections: [
        {
          id: '8.1',
          title: 'Por vs. Para — Core Distinction',
          blocks: [
            {
              type: 'text',
              content: 'Por — use for:',
            },
            {
              type: 'rules',
              items: [
                'Cause / reason: "Gracias por tu ayuda." (Thanks for your help.)',
                'Duration: "Estudié por dos horas." (I studied for two hours.)',
                'Exchange: "Lo compré por diez euros." (I bought it for ten euros.)',
                'Movement through: "Caminé por el parque." (I walked through the park.)',
                'Time of day (general): "Por la mañana estudio." (In the morning I study.)',
                'Per: "Tres veces por semana." (Three times per week.)',
              ],
            },
            {
              type: 'text',
              content: 'Para — use for:',
            },
            {
              type: 'rules',
              items: [
                'Purpose / goal: "Estudio para aprender." (I study to learn.)',
                'Recipient: "Este regalo es para ti." (This gift is for you.)',
                'Destination: "Salgo para México." (I\'m leaving for Mexico.)',
                'Deadline: "Es para el viernes." (It\'s for/due Friday.)',
                'Opinion: "Para mí, es fácil." (For me, it\'s easy.)',
                'Comparison: "Para un niño, cocina muy bien." (For a child, he cooks very well.)',
              ],
            },
          ],
        },
        {
          id: '8.2',
          title: 'Common Prepositional Phrases',
          blocks: [
            {
              type: 'table',
              headers: ['Phrase', 'Meaning'],
              rows: [
                ['al lado de', 'next to'],
                ['delante de', 'in front of'],
                ['detrás de', 'behind'],
                ['encima de', 'on top of'],
                ['debajo de', 'under'],
                ['dentro de', 'inside'],
                ['fuera de', 'outside'],
                ['cerca de', 'near'],
                ['lejos de', 'far from'],
                ['enfrente de', 'across from / facing'],
                ['a la derecha de', 'to the right of'],
                ['a la izquierda de', 'to the left of'],
              ],
            },
            {
              type: 'examples',
              examples: [
                {
                  es: 'El banco está al lado del supermercado.',
                  en: 'The bank is next to the supermarket.',
                },
                {
                  es: 'Mi casa está cerca de la estación.',
                  en: 'My house is near the station.',
                },
                {
                  es: 'El gato está debajo de la mesa.',
                  en: 'The cat is under the table.',
                },
              ],
            },
          ],
        },
      ],
    },
    {
      id: 8,
      title: 'Connectors and Sentence Structure',
      sections: [
        {
          id: '9.1',
          title: 'Cause and Reason',
          blocks: [
            {
              type: 'table',
              headers: ['Connector', 'Meaning', 'Example'],
              rows: [
                ['porque', 'because', 'No fui porque estaba enfermo.'],
                [
                  'como (beginning of sentence)',
                  'since / as',
                  'Como llovía, me quedé en casa.',
                ],
                [
                  'ya que',
                  'since / given that',
                  'Ya que estás aquí, ayúdame.',
                ],
                [
                  'por eso',
                  "that's why",
                  'Estaba cansado, por eso no salí.',
                ],
              ],
            },
          ],
        },
        {
          id: '9.2',
          title: 'Contrast',
          blocks: [
            {
              type: 'table',
              headers: ['Connector', 'Meaning', 'Example'],
              rows: [
                ['pero', 'but', 'Es caro, pero muy bueno.'],
                ['aunque', 'although', 'Aunque llueve, voy a salir.'],
                [
                  'sin embargo',
                  'however',
                  'Es difícil. Sin embargo, lo intentaré.',
                ],
              ],
            },
          ],
        },
        {
          id: '9.3',
          title: 'Consequence',
          blocks: [
            {
              type: 'table',
              headers: ['Connector', 'Meaning', 'Example'],
              rows: [
                ['por eso', "that's why", 'No estudié, por eso suspendí.'],
                ['así que', 'so', 'No había taxis, así que caminé.'],
                [
                  'entonces',
                  'then / so',
                  'No tenía hambre, entonces no comí.',
                ],
              ],
            },
          ],
        },
        {
          id: '9.4',
          title: 'Sequence',
          blocks: [
            {
              type: 'table',
              headers: ['Connector', 'Meaning'],
              rows: [
                ['primero', 'first'],
                ['luego / después', 'then / afterwards'],
                ['más tarde', 'later'],
                ['por último / finalmente', 'finally'],
                ['al final', 'in the end'],
              ],
            },
            {
              type: 'examples',
              examples: [
                {
                  es: 'Primero desayuné, luego fui al trabajo y finalmente cené con amigos.',
                  en: 'First I had breakfast, then I went to work, and finally I had dinner with friends.',
                },
              ],
            },
          ],
        },
      ],
    },
    {
      id: 9,
      title: 'The Near Future and Other Verb Structures',
      sections: [
        {
          id: '10.1',
          title: 'Ir a + Infinitive (Review)',
          blocks: [
            {
              type: 'text',
              content:
                'Used for plans, intentions, and near-future actions.',
            },
            {
              type: 'examples',
              examples: [
                {
                  es: 'Voy a estudiar esta noche.',
                  en: "I'm going to study tonight.",
                },
                {
                  es: '¿Qué vas a hacer mañana?',
                  en: 'What are you going to do tomorrow?',
                },
                {
                  es: 'Vamos a viajar a México.',
                  en: "We're going to travel to Mexico.",
                },
              ],
            },
          ],
        },
        {
          id: '10.2',
          title: 'Acabar de + Infinitive (Just Did)',
          blocks: [
            {
              type: 'text',
              content: 'Expresses an action that just happened.',
            },
            {
              type: 'text',
              content: 'Structure: acabar (present) + de + infinitive',
            },
            {
              type: 'examples',
              examples: [
                { es: 'Acabo de llegar.', en: 'I just arrived.' },
                { es: 'Acabamos de comer.', en: 'We just ate.' },
                {
                  es: 'Acaba de llamar tu madre.',
                  en: 'Your mother just called.',
                },
              ],
            },
          ],
        },
        {
          id: '10.3',
          title: 'Estar + Gerund (Present Progressive Review)',
          blocks: [
            {
              type: 'text',
              content: 'For actions happening right now.',
            },
            {
              type: 'examples',
              examples: [
                { es: 'Estoy estudiando.', en: 'I am studying.' },
                {
                  es: '¿Qué estás haciendo?',
                  en: 'What are you doing?',
                },
                {
                  es: 'Están jugando en el parque.',
                  en: 'They are playing in the park.',
                },
              ],
            },
          ],
        },
        {
          id: '10.4',
          title: 'Soler + Infinitive (To Usually Do)',
          blocks: [
            {
              type: 'text',
              content: 'Expresses habitual actions.',
            },
            {
              type: 'examples',
              examples: [
                {
                  es: 'Suelo desayunar a las ocho.',
                  en: 'I usually have breakfast at eight.',
                },
                {
                  es: '¿Qué sueles hacer los fines de semana?',
                  en: 'What do you usually do on weekends?',
                },
                {
                  es: 'Solíamos ir al campo de niños.',
                  en: 'We used to go to the countryside as children. (imperfect of soler)',
                },
              ],
            },
          ],
        },
        {
          id: '10.5',
          title: 'Volver a + Infinitive (To Do Again)',
          blocks: [
            {
              type: 'examples',
              examples: [
                { es: 'Volvió a llamar.', en: 'He called again.' },
                {
                  es: 'No vuelvas a llegar tarde.',
                  en: "Don't be late again.",
                },
                {
                  es: 'Volví a leer el libro.',
                  en: 'I read the book again.',
                },
              ],
            },
          ],
        },
        {
          id: '10.6',
          title: 'Empezar a / Terminar de + Infinitive',
          blocks: [
            {
              type: 'examples',
              examples: [
                {
                  es: 'Empecé a estudiar a las tres.',
                  en: 'I started studying at three.',
                },
                {
                  es: 'Terminé de leer el libro.',
                  en: 'I finished reading the book.',
                },
                {
                  es: 'Cuando empezó a llover, entramos en casa.',
                  en: 'When it started to rain, we went inside.',
                },
              ],
            },
          ],
        },
      ],
    },
    {
      id: 10,
      title: 'Reflexive Verbs — Expanded',
      sections: [
        {
          id: '11.1',
          title: 'Review of Daily Routine Reflexive Verbs',
          blocks: [
            {
              type: 'text',
              content:
                'levantarse (to get up), acostarse (to go to bed), ducharse (to shower), lavarse (to wash), vestirse (to get dressed), peinarse (to comb), despertarse (to wake up)',
            },
          ],
        },
        {
          id: '11.2',
          title: 'Reflexive Verbs for Emotions and States',
          blocks: [
            {
              type: 'text',
              content:
                'Many verbs that express emotions, states, or changes use reflexive pronouns.',
            },
            {
              type: 'table',
              headers: ['Verb', 'Meaning'],
              rows: [
                ['sentirse', 'to feel'],
                ['divertirse', 'to have fun'],
                ['aburrirse', 'to get bored'],
                ['enfadarse / enojarse', 'to get angry'],
                ['preocuparse', 'to worry'],
                ['alegrarse', 'to be glad'],
                ['asustarse', 'to get scared'],
                ['enamorarse', 'to fall in love'],
                ['cansarse', 'to get tired'],
                ['equivocarse', 'to make a mistake'],
              ],
            },
            {
              type: 'examples',
              examples: [
                {
                  es: 'Me siento muy bien hoy.',
                  en: 'I feel very good today.',
                },
                {
                  es: 'Nos divertimos mucho en la fiesta.',
                  en: 'We had a lot of fun at the party.',
                },
                {
                  es: 'Se enfadó con su hermano.',
                  en: 'He got angry with his brother.',
                },
                {
                  es: 'Me preocupo por mi familia.',
                  en: 'I worry about my family.',
                },
                {
                  es: 'Se enamoró de ella en la universidad.',
                  en: 'He fell in love with her at university.',
                },
              ],
            },
          ],
        },
        {
          id: '11.3',
          title: 'Reflexive Pronouns in the Preterite and Imperfect',
          blocks: [
            {
              type: 'text',
              content:
                'Reflexive pronouns follow the same placement rules in past tenses.',
            },
            {
              type: 'examples',
              examples: [
                {
                  es: 'Me levanté a las siete.',
                  en: 'I got up at seven. (preterite)',
                },
                {
                  es: 'Se duchaba todos los días.',
                  en: 'He used to shower every day. (imperfect)',
                },
                {
                  es: 'Nos divertimos mucho el sábado.',
                  en: 'We had a lot of fun on Saturday. (preterite)',
                },
              ],
            },
          ],
        },
      ],
    },
    {
      id: 11,
      title: 'Describing People, Places, and Experiences',
      sections: [
        {
          id: '12.1',
          title: 'Physical Descriptions',
          blocks: [
            {
              type: 'text',
              content:
                'Common adjectives: alto/a (tall), bajo/a (short), delgado/a (thin), gordo/a (fat), guapo/a (handsome/pretty), joven (young), viejo/a (old), rubio/a (blonde), moreno/a (dark-haired), calvo/a (bald)',
            },
            {
              type: 'rules',
              items: [
                'Ser for physical traits: "Es alto y moreno." (He is tall and dark-haired.)',
                'Tener for features: "Tiene los ojos azules." (He has blue eyes.) / "Tiene el pelo largo." (She has long hair.)',
              ],
            },
          ],
        },
        {
          id: '12.2',
          title: 'Character and Personality',
          blocks: [
            {
              type: 'table',
              headers: ['Adjective', 'Meaning', 'Opposite'],
              rows: [
                ['simpático/a', 'nice, friendly', 'antipático/a (unpleasant)'],
                ['amable', 'kind', 'maleducado/a (rude)'],
                ['generoso/a', 'generous', 'tacaño/a (stingy)'],
                [
                  'trabajador/a',
                  'hard-working',
                  'perezoso/a / vago/a (lazy)',
                ],
                ['inteligente', 'intelligent', 'tonto/a (silly)'],
                ['divertido/a', 'fun, funny', 'aburrido/a (boring)'],
                ['tímido/a', 'shy', 'extrovertido/a (outgoing)'],
                ['tranquilo/a', 'calm', 'nervioso/a (nervous)'],
                ['responsable', 'responsible', 'irresponsable (irresponsible)'],
                ['honesto/a', 'honest', 'mentiroso/a (dishonest)'],
              ],
            },
          ],
        },
        {
          id: '12.3',
          title: 'Describing Places',
          blocks: [
            {
              type: 'text',
              content:
                'Useful vocabulary: grande/pequeño (big/small), bonito/feo (pretty/ugly), moderno/antiguo (modern/old), ruidoso/tranquilo (noisy/quiet), limpio/sucio (clean/dirty), seguro/peligroso (safe/dangerous)',
            },
            {
              type: 'examples',
              examples: [
                {
                  es: 'Mi barrio es muy tranquilo y tiene muchos parques.',
                  en: 'My neighborhood is very quiet and has many parks.',
                },
                {
                  es: 'La ciudad es grande y moderna, pero un poco ruidosa.',
                  en: 'The city is big and modern, but a little noisy.',
                },
              ],
            },
          ],
        },
        {
          id: '12.4',
          title: 'Describing Experiences',
          blocks: [
            {
              type: 'text',
              content:
                'Useful verbs and structures:\n- fue + adjective: "Fue increíble." (It was incredible.)\n- Lo mejor fue... : "Lo mejor fue la comida." (The best part was the food.)\n- Lo peor fue... : "Lo peor fue el tráfico." (The worst part was the traffic.)\n- Lo pasé muy bien / mal: "Lo pasé genial." (I had a great time.)',
            },
            {
              type: 'examples',
              examples: [
                {
                  es: 'El viaje fue maravilloso. Lo mejor fue visitar las playas. Lo pasé muy bien.',
                  en: 'The trip was wonderful. The best part was visiting the beaches. I had a great time.',
                },
              ],
            },
          ],
        },
      ],
    },
    {
      id: 12,
      title: 'Weather and Nature',
      sections: [
        {
          id: '13.1',
          title: 'Weather Expressions',
          blocks: [
            {
              type: 'text',
              content:
                'Most weather expressions use "hacer" (3rd person singular).',
            },
            {
              type: 'table',
              headers: ['Expression', 'Meaning'],
              rows: [
                ['Hace calor.', "It's hot."],
                ['Hace frío.', "It's cold."],
                ['Hace sol.', "It's sunny."],
                ['Hace viento.', "It's windy."],
                ['Hace buen/mal tiempo.', 'The weather is good/bad.'],
                ['Llueve. / Está lloviendo.', "It's raining."],
                ['Nieva. / Está nevando.', "It's snowing."],
                ['Hay niebla.', "It's foggy."],
                ['Hay tormenta.', "There's a storm."],
                ['Está nublado.', "It's cloudy."],
              ],
            },
            {
              type: 'examples',
              examples: [
                {
                  es: 'Ayer hizo mucho calor.',
                  en: 'Yesterday it was very hot.',
                },
                {
                  es: 'Cuando era niño, nevaba mucho.',
                  en: 'When I was a child, it used to snow a lot.',
                },
                {
                  es: 'Hacía sol cuando salimos.',
                  en: 'It was sunny when we went out.',
                },
              ],
            },
          ],
        },
      ],
    },
    {
      id: 13,
      title: 'Numbers, Quantities, and Expressions',
      sections: [
        {
          id: '14.1',
          title: 'Numbers 100–1,000,000',
          blocks: [
            {
              type: 'table',
              headers: ['Number', 'Spanish'],
              rows: [
                ['100', 'cien / ciento'],
                ['200', 'doscientos/as'],
                ['300', 'trescientos/as'],
                ['400', 'cuatrocientos/as'],
                ['500', 'quinientos/as'],
                ['600', 'seiscientos/as'],
                ['700', 'setecientos/as'],
                ['800', 'ochocientos/as'],
                ['900', 'novecientos/as'],
                ['1.000', 'mil'],
                ['2.000', 'dos mil'],
                ['1.000.000', 'un millón'],
              ],
            },
            {
              type: 'rules',
              items: [
                '"Cien" is used alone or before nouns: "cien personas" (100 people)',
                '"Ciento" is used when followed by additional numbers: "ciento cincuenta" (150)',
                'Hundreds agree in gender with the noun: "doscientas personas" (200 people, fem.)',
                '"Mil" does not change: "dos mil", "tres mil"',
                '"Millón" requires "de" before nouns: "un millón de euros"',
              ],
            },
          ],
        },
        {
          id: '14.2',
          title: 'Expressing Quantity',
          blocks: [
            {
              type: 'table',
              headers: ['Expression', 'Meaning'],
              rows: [
                ['un poco de', 'a little of'],
                ['mucho/a', 'a lot of'],
                ['poco/a', 'little / not much'],
                ['bastante', 'quite a lot'],
                ['demasiado/a', 'too much'],
                ['suficiente', 'enough'],
                ['varios/as', 'several'],
                ['algunos/as', 'some'],
                ['ningún / ninguna', 'no / not any'],
              ],
            },
            {
              type: 'examples',
              examples: [
                {
                  es: 'Quiero un poco de agua.',
                  en: 'I want a little water.',
                },
                {
                  es: 'Hay demasiada gente.',
                  en: 'There are too many people.',
                },
                {
                  es: '¿Tienes suficiente dinero?',
                  en: 'Do you have enough money?',
                },
              ],
            },
          ],
        },
      ],
    },
  ],
}
