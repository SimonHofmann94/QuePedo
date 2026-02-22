import { GrammarLevel } from './types'

export const grammarC1: GrammarLevel = {
  level: 'C1',
  title: 'Advanced Spanish Grammar',
  chapters: [
    {
      id: 0,
      title: 'Advanced Subjunctive Use',
      sections: [
        {
          id: '1.1',
          title: 'Subjunctive in Independent Clauses',
          blocks: [
            {
              type: 'text',
              content:
                'At C1, the subjunctive is not limited to subordinate clauses. It also appears in independent clauses to express wishes, doubt, or emotional reactions.',
            },
            {
              type: 'table',
              headers: ['Expression', 'Meaning', 'Example'],
              rows: [
                [
                  'Ojala + present subj.',
                  'I hope (possible)',
                  'Ojala llueva manana. -- I hope it rains tomorrow.',
                ],
                [
                  'Ojala + imperfect subj.',
                  'I wish (unlikely present)',
                  'Ojala tuviera mas tiempo. -- I wish I had more time.',
                ],
                [
                  'Ojala + pluperfect subj.',
                  'I wish (impossible past)',
                  'Ojala hubiera estudiado mas. -- I wish I had studied more.',
                ],
                [
                  'Que + present subj.',
                  'May... / Let...',
                  'Que te vaya bien! -- May it go well for you!',
                ],
                [
                  'Quien + imperfect subj.',
                  'If only I could...',
                  'Quien pudiera volar! -- If only one could fly!',
                ],
                [
                  'Quien + pluperfect subj.',
                  'If only I had...',
                  'Quien lo hubiera sabido! -- If only I had known!',
                ],
                [
                  'Asi + present subj.',
                  'I hope (colloquial curse)',
                  'Asi le vaya mal! -- I hope it goes badly for him!',
                ],
              ],
            },
            {
              type: 'examples',
              examples: [
                {
                  es: 'Ojala no haya mucho trafico.',
                  en: "I hope there isn't much traffic.",
                },
                {
                  es: 'Ojala pudiera volver a esos tiempos.',
                  en: 'I wish I could go back to those times.',
                },
                {
                  es: 'Que tengas un buen dia!',
                  en: 'Have a good day!',
                },
                {
                  es: 'Quien pudiera estar en la playa ahora!',
                  en: 'If only I could be at the beach right now!',
                },
              ],
            },
          ],
        },
        {
          id: '1.2',
          title: 'Subjunctive After Expressions of Probability',
          blocks: [
            {
              type: 'text',
              content:
                'The choice between indicative and subjunctive with probability expressions depends on the degree of certainty.',
            },
            {
              type: 'rules',
              items: [
                'Indicative (high certainty): Es evidente que... / Es obvio que... / Es cierto que... / Esta claro que...',
                '"Es evidente que tiene razon." -- It is evident he is right.',
              ],
            },
            {
              type: 'rules',
              items: [
                'Subjunctive (doubt, low certainty): Es posible que... / Es probable que... / Puede que... / Es dudoso que...',
                '"Es posible que venga manana." -- It\'s possible he\'ll come tomorrow.',
                '"Puede que llueva esta tarde." -- It might rain this afternoon.',
              ],
            },
            {
              type: 'rules',
              items: [
                'Negated certainty triggers subjunctive',
                '"No es cierto que sea asi." -- It\'s not true that it\'s like that.',
                '"No esta claro que vayan a ganar." -- It\'s not clear they\'re going to win.',
              ],
            },
          ],
        },
        {
          id: '1.3',
          title: 'Subjunctive in Concessive Clauses',
          blocks: [
            {
              type: 'text',
              content:
                'Concessive clauses admit a contrasting point while asserting the main idea. The mood depends on whether the conceded fact is real or hypothetical.',
            },
            {
              type: 'rules',
              items: [
                'Aunque + Indicative (fact): "Aunque esta lloviendo, salgo." -- Although it IS raining, I\'m going out.',
                'Aunque + Subjunctive (hypothetical): "Aunque este lloviendo, saldre." -- Even if it IS raining, I\'ll go out.',
              ],
            },
            {
              type: 'table',
              headers: ['Expression', 'Meaning', 'Example'],
              rows: [
                [
                  'por mas que',
                  'no matter how much',
                  'Por mas que lo intente, no lo consigo.',
                ],
                [
                  'por mucho que',
                  'no matter how much',
                  'Por mucho que estudie, no aprueba.',
                ],
                [
                  'por poco que',
                  'no matter how little',
                  'Por poco que haga, siempre ayuda.',
                ],
                [
                  'por muy + adj. + que',
                  'however (adj.)',
                  'Por muy cansado que este, sigue trabajando.',
                ],
                [
                  'aun cuando',
                  'even when / even if',
                  'Aun cuando lo sepa, no dira nada.',
                ],
                [
                  'si bien',
                  'while, even though',
                  'Si bien es dificil, no es imposible.',
                ],
                [
                  'a sabiendas de que',
                  'knowing full well',
                  'Lo hizo a sabiendas de que estaba mal.',
                ],
              ],
            },
            {
              type: 'examples',
              examples: [
                {
                  es: 'Por mas que le explique el problema, no lo entendio.',
                  en: "No matter how much I explained the problem, he didn't understand it.",
                },
                {
                  es: 'Por muy inteligente que sea, comete errores.',
                  en: 'However intelligent he may be, he makes mistakes.',
                },
              ],
            },
          ],
        },
        {
          id: '1.4',
          title: 'Subjunctive in Temporal Clauses -- Nuances',
          blocks: [
            {
              type: 'text',
              content:
                'At C1, temporal conjunctions reveal subtle shifts between indicative and subjunctive.',
            },
            {
              type: 'table',
              headers: [
                'Conjunction',
                'Indicative (past/present fact)',
                'Subjunctive (future/hypothetical)',
              ],
              rows: [
                [
                  'cuando',
                  'Cuando llegue, llovia.',
                  'Cuando llegues, llamame.',
                ],
                [
                  'en cuanto / tan pronto como',
                  'En cuanto lo vi, lo reconoci.',
                  'En cuanto lo vea, se lo dire.',
                ],
                [
                  'hasta que',
                  'Espere hasta que llego.',
                  'Espera hasta que llegue.',
                ],
                [
                  'despues de que',
                  'Despues de que termino, se fue.',
                  'Despues de que termine, iremos.',
                ],
                [
                  'mientras',
                  'Mientras estudiaba, escuchaba musica.',
                  'Mientras vivas aqui, respeta las normas.',
                ],
                [
                  'antes de que',
                  '(always subjunctive)',
                  'Sal antes de que llueva.',
                ],
                [
                  'una vez que',
                  'Una vez que lo supo, actuo.',
                  'Una vez que lo sepas, dime.',
                ],
              ],
            },
            {
              type: 'rules',
              items: [
                '"Antes de que" ALWAYS takes the subjunctive, because the action in the subordinate clause hasn\'t happened yet by definition.',
              ],
            },
          ],
        },
        {
          id: '1.5',
          title: 'Subjunctive After Value Judgments',
          blocks: [
            {
              type: 'text',
              content:
                'Impersonal expressions that convey a value judgment trigger the subjunctive.',
            },
            {
              type: 'table',
              headers: ['Expression', 'Example'],
              rows: [
                ['Es normal que + subj.', 'Es normal que estes nervioso.'],
                ['Es logico que + subj.', 'Es logico que quiera irse.'],
                [
                  'Es justo que + subj.',
                  'Es justo que reciban un premio.',
                ],
                ['Es ridiculo que + subj.', 'Es ridiculo que piense asi.'],
                [
                  'Es una pena que + subj.',
                  'Es una pena que no puedas venir.',
                ],
                [
                  'Es extrano que + subj.',
                  'Es extrano que no haya llamado.',
                ],
                [
                  'Es sorprendente que + subj.',
                  'Es sorprendente que haya ganado.',
                ],
                [
                  'Esta bien / mal que + subj.',
                  'Esta mal que no diga la verdad.',
                ],
                ['Mas vale que + subj.', 'Mas vale que te des prisa.'],
              ],
            },
          ],
        },
      ],
    },
    {
      id: 1,
      title: 'Advanced Conditional Structures',
      sections: [
        {
          id: '2.1',
          title: 'Review: Three Main Types + Mixed',
          blocks: [
            {
              type: 'table',
              headers: ['Type', 'Si-clause', 'Result clause', 'Meaning'],
              rows: [
                [
                  '1 (real)',
                  'present indicative',
                  'future / present / imperative',
                  'possible',
                ],
                [
                  '2 (hypothetical)',
                  'imperfect subjunctive',
                  'conditional',
                  'unlikely present',
                ],
                [
                  '3 (counterfactual)',
                  'pluperfect subjunctive',
                  'conditional perfect',
                  'impossible past',
                ],
                [
                  'Mixed A',
                  'pluperfect subjunctive',
                  'conditional',
                  'past cause -> present result',
                ],
                [
                  'Mixed B',
                  'imperfect subjunctive',
                  'conditional perfect',
                  'present cause -> past result',
                ],
              ],
            },
          ],
        },
        {
          id: '2.2',
          title: 'De + Infinitive as a Conditional Alternative',
          blocks: [
            {
              type: 'text',
              content:
                '"De + infinitive" can replace "si + conjugated verb" in formal or literary registers.',
            },
            {
              type: 'rules',
              items: [
                '"De + infinitive" = si + present/imperfect subjunctive (hypothetical)',
                '"De + haber + past participle" = si + pluperfect subjunctive (counterfactual)',
                'More common in written Spanish',
              ],
            },
            {
              type: 'examples',
              examples: [
                {
                  es: 'De tener mas tiempo, estudiaria mas.',
                  en: 'If I had more time, I would study more.',
                },
                {
                  es: 'De haberlo sabido, no habria venido.',
                  en: "Had I known, I wouldn't have come.",
                },
                {
                  es: 'De ser posible, me gustaria cambiar de horario.',
                  en: "If it were possible, I'd like to change my schedule.",
                },
                {
                  es: 'De no llover, iremos a la playa.',
                  en: "If it doesn't rain, we'll go to the beach.",
                },
              ],
            },
          ],
        },
        {
          id: '2.3',
          title: 'Como + Subjunctive (Conditional Warning/Threat)',
          blocks: [
            {
              type: 'text',
              content:
                '"Como" + present subjunctive functions as a conditional warning or threat, equivalent to "if (you do)..."',
            },
            {
              type: 'examples',
              examples: [
                {
                  es: 'Como no estudies, suspenderas.',
                  en: "If you don't study, you'll fail.",
                },
                {
                  es: 'Como vuelvas a llegar tarde, te despiden.',
                  en: "If you're late again, they'll fire you.",
                },
                {
                  es: 'Como me entere de que mientes, se acabo.',
                  en: "If I find out you're lying, it's over.",
                },
              ],
            },
          ],
        },
        {
          id: '2.4',
          title: 'Con + Infinitive / Con que + Subjunctive (Provided That)',
          blocks: [
            {
              type: 'text',
              content:
                '"Con + infinitive" and "con que + subjunctive" express a sufficient condition.',
            },
            {
              type: 'examples',
              examples: [
                {
                  es: 'Con estudiar un poco mas, aprobaras.',
                  en: "By studying a bit more, you'll pass.",
                },
                {
                  es: 'Con que vengas a las ocho, es suficiente.',
                  en: "As long as you come at eight, that's enough.",
                },
              ],
            },
          ],
        },
        {
          id: '2.5',
          title: 'A no ser que / Excepto que / Salvo que (Unless)',
          blocks: [
            {
              type: 'text',
              content:
                'All three mean "unless" and take the subjunctive.',
            },
            {
              type: 'examples',
              examples: [
                {
                  es: 'Ire a no ser que llueva.',
                  en: "I'll go unless it rains.",
                },
                {
                  es: 'Te esperare, salvo que me digas lo contrario.',
                  en: "I'll wait for you, unless you tell me otherwise.",
                },
                {
                  es: 'Llegaremos a tiempo, excepto que haya mucho trafico.',
                  en: "We'll arrive on time, unless there's a lot of traffic.",
                },
              ],
            },
          ],
        },
      ],
    },
    {
      id: 2,
      title: 'Advanced Passive and Impersonal Constructions',
      sections: [
        {
          id: '3.1',
          title: 'Passive Reflex (se) vs. Impersonal se -- Refined Distinction',
          blocks: [
            {
              type: 'text',
              content:
                'At C1, learners must distinguish precisely between these two "se" constructions.',
            },
            {
              type: 'rules',
              items: [
                'Passive se (pasiva refleja): The thing acted upon is the grammatical subject; the verb agrees with it',
                '"Se venden pisos." -- Apartments are sold. (pisos = subject, plural verb)',
                '"Se habla espanol." -- Spanish is spoken. (espanol = subject, singular verb)',
              ],
            },
            {
              type: 'rules',
              items: [
                'Impersonal se: No grammatical subject; verb is always 3rd person singular',
                '"Se trabaja mucho aqui." -- People work a lot here.',
                '"Se vive bien en Espana." -- One lives well in Spain.',
                'When the object is a person, use "a" + singular verb: "Se busco a los responsables." -- The responsible parties were sought.',
              ],
            },
            {
              type: 'rules',
              items: [
                'Common error: "Se buscan a los culpables." (person + plural = wrong)',
                'Correct: "Se busca a los culpables." (person -> singular + personal a)',
              ],
            },
          ],
        },
        {
          id: '3.2',
          title:
            'Estar + Past Participle (Resultant State) vs. Ser + Past Participle (Action)',
          blocks: [
            {
              type: 'table',
              headers: ['Construction', 'Focus', 'Example'],
              rows: [
                [
                  'ser + participle',
                  'The action itself (who/what caused it)',
                  'La ventana fue rota por el nino. -- The window was broken by the boy.',
                ],
                [
                  'estar + participle',
                  'The resulting state',
                  'La ventana esta rota. -- The window is broken.',
                ],
              ],
            },
            {
              type: 'examples',
              examples: [
                {
                  es: 'El informe ya esta terminado.',
                  en: 'The report is already finished. (state)',
                },
                {
                  es: 'El informe fue terminado ayer por el equipo.',
                  en: 'The report was finished yesterday by the team. (action)',
                },
                {
                  es: 'Las luces estan encendidas.',
                  en: 'The lights are on. (state)',
                },
                {
                  es: 'Las luces fueron encendidas por el portero.',
                  en: 'The lights were turned on by the doorman. (action)',
                },
              ],
            },
          ],
        },
        {
          id: '3.3',
          title: 'Other Impersonal Constructions',
          blocks: [
            {
              type: 'table',
              headers: ['Construction', 'Meaning', 'Example'],
              rows: [
                [
                  'uno/una',
                  'one (personal)',
                  'Uno nunca sabe que puede pasar.',
                ],
                [
                  'la gente',
                  'people',
                  'La gente no respeta las normas.',
                ],
                [
                  '3rd person plural (no subject)',
                  'they (unspecified)',
                  'Dicen que va a llover. -- They say it\'s going to rain.',
                ],
                [
                  'hay que + infinitive',
                  'one must',
                  'Hay que tener paciencia.',
                ],
                [
                  'se debe + infinitive',
                  'one should',
                  'Se debe respetar a los demas.',
                ],
                [
                  'conviene + infinitive',
                  'it is advisable',
                  'Conviene llegar temprano.',
                ],
                [
                  'basta con + infinitive',
                  'it is enough to',
                  'Basta con llamar para reservar.',
                ],
              ],
            },
          ],
        },
      ],
    },
    {
      id: 3,
      title: 'Advanced Tense Use -- Nuances',
      sections: [
        {
          id: '4.1',
          title: 'The Historical Present (Presente Historico)',
          blocks: [
            {
              type: 'text',
              content:
                'The present tense can narrate past events vividly, as if the listener were watching them happen.',
            },
            {
              type: 'examples',
              examples: [
                {
                  es: 'En 1492, Colon llega a America.',
                  en: 'In 1492, Columbus arrives in America.',
                },
                {
                  es: 'Estaba en casa tranquilo y, de repente, suena el telefono y me dice que...',
                  en: 'I was at home relaxing and suddenly the phone rings and he tells me that...',
                },
              ],
            },
          ],
        },
        {
          id: '4.2',
          title: 'The Future of Conjecture (Present Probability)',
          blocks: [
            {
              type: 'text',
              content:
                'The simple future expresses speculation about the present.',
            },
            {
              type: 'examples',
              examples: [
                {
                  es: 'Donde estara Juan?',
                  en: 'Where can Juan be? (I wonder)',
                },
                {
                  es: 'Seran las ocho.',
                  en: 'It must be about eight.',
                },
                {
                  es: 'Tendra unos cuarenta anos.',
                  en: 'He must be about forty.',
                },
                {
                  es: 'Costara unos cien euros.',
                  en: 'It probably costs about a hundred euros.',
                },
              ],
            },
          ],
        },
        {
          id: '4.3',
          title: 'The Conditional of Conjecture (Past Probability)',
          blocks: [
            {
              type: 'text',
              content:
                'The conditional expresses speculation about the past.',
            },
            {
              type: 'examples',
              examples: [
                {
                  es: 'Serian las tres cuando llegamos.',
                  en: 'It must have been about three when we arrived.',
                },
                {
                  es: 'Tendria unos veinte anos cuando se caso.',
                  en: 'She must have been about twenty when she got married.',
                },
                {
                  es: 'Estaria enfermo, por eso no vino.',
                  en: "He was probably sick, that's why he didn't come.",
                },
              ],
            },
          ],
        },
        {
          id: '4.4',
          title: 'The Future Perfect of Conjecture (Recent Past Probability)',
          blocks: [
            {
              type: 'text',
              content:
                'The future perfect speculates about a recently completed action.',
            },
            {
              type: 'examples',
              examples: [
                {
                  es: 'Ya habra llegado.',
                  en: 'He must have arrived by now.',
                },
                {
                  es: 'Que le habra pasado?',
                  en: 'What can have happened to him?',
                },
                {
                  es: 'Se habran perdido.',
                  en: 'They must have gotten lost.',
                },
              ],
            },
          ],
        },
        {
          id: '4.5',
          title:
            'The Conditional Perfect of Conjecture (Past-before-past Probability)',
          blocks: [
            {
              type: 'text',
              content:
                'The conditional perfect speculates about an action prior to another past event.',
            },
            {
              type: 'examples',
              examples: [
                {
                  es: 'Habrian salido antes de que empezara a llover.',
                  en: 'They must have left before it started raining.',
                },
                {
                  es: 'Habria terminado el trabajo antes de irse.',
                  en: 'He must have finished the work before leaving.',
                },
              ],
            },
          ],
        },
        {
          id: '4.6',
          title: 'Temporal Clauses with Compound Tenses',
          blocks: [
            {
              type: 'rules',
              items: [
                'In temporal clauses referring to the future, use the subjunctive -- including compound forms.',
              ],
            },
            {
              type: 'examples',
              examples: [
                {
                  es: 'Cuando hayas terminado, llamame.',
                  en: 'When you have finished, call me. (present perfect subjunctive)',
                },
                {
                  es: 'No salgas hasta que haya dejado de llover.',
                  en: "Don't go out until it has stopped raining.",
                },
                {
                  es: 'En cuanto hayamos cenado, nos iremos.',
                  en: "As soon as we have had dinner, we'll leave.",
                },
              ],
            },
          ],
        },
      ],
    },
    {
      id: 4,
      title: 'Relative Clauses -- Advanced',
      sections: [
        {
          id: '5.1',
          title: 'The Subjunctive in Relative Clauses',
          blocks: [
            {
              type: 'text',
              content:
                'The mood in relative clauses depends on whether the antecedent is known or hypothetical.',
            },
            {
              type: 'rules',
              items: [
                'Indicative (known/existing antecedent): "Tengo un amigo que habla japones." -- I have a friend who speaks Japanese. (he exists)',
              ],
            },
            {
              type: 'rules',
              items: [
                'Subjunctive (unknown/nonexistent/desired antecedent):',
                '"Busco a alguien que hable japones." -- I\'m looking for someone who speaks Japanese. (I don\'t know if they exist)',
                '"Necesito un piso que tenga tres habitaciones." -- I need an apartment that has three bedrooms. (I haven\'t found it yet)',
                '"No hay nadie que sepa la respuesta." -- There\'s no one who knows the answer.',
              ],
            },
          ],
        },
        {
          id: '5.2',
          title: 'El que / Quien in Generalizations',
          blocks: [
            {
              type: 'text',
              content:
                '"El que" / "quien" + subjunctive creates generalizations (whoever, anyone who).',
            },
            {
              type: 'examples',
              examples: [
                {
                  es: 'El que quiera participar, que levante la mano.',
                  en: 'Whoever wants to participate, raise your hand.',
                },
                {
                  es: 'Quien no este de acuerdo puede irse.',
                  en: 'Whoever disagrees can leave.',
                },
                {
                  es: 'Los que lleguen tarde no podran entrar.',
                  en: "Those who arrive late won't be able to enter.",
                },
              ],
            },
          ],
        },
        {
          id: '5.3',
          title: 'Lo que / Lo cual -- Referring to Clauses',
          blocks: [
            {
              type: 'text',
              content:
                '"Lo que" and "lo cual" refer back to an entire idea or clause.',
            },
            {
              type: 'rules',
              items: [
                '"Lo que" is versatile and common',
                '"Lo cual" is used only in non-restrictive (explanatory) clauses and is more formal',
              ],
            },
            {
              type: 'examples',
              examples: [
                {
                  es: 'Aprobo el examen, lo que nos alegro mucho.',
                  en: 'He passed the exam, which made us very happy.',
                },
                {
                  es: 'No contesto al telefono, lo cual me preocupo.',
                  en: "She didn't answer the phone, which worried me.",
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
          id: '5.4',
          title: 'Cuyo/a/os/as -- "Whose"',
          blocks: [
            {
              type: 'text',
              content:
                '"Cuyo" agrees with the possessed noun, not the possessor. It is formal and more common in writing.',
            },
            {
              type: 'examples',
              examples: [
                {
                  es: 'El autor cuyo libro gano el premio es chileno.',
                  en: 'The author whose book won the prize is Chilean.',
                },
                {
                  es: 'La empresa cuyas oficinas visitamos esta en crisis.',
                  en: 'The company whose offices we visited is in crisis.',
                },
                {
                  es: 'Los paises cuyos gobiernos invirtieron en educacion prosperaron.',
                  en: 'The countries whose governments invested in education prospered.',
                },
              ],
            },
          ],
        },
      ],
    },
    {
      id: 5,
      title: 'Advanced Verb Periphrases',
      sections: [
        {
          id: '6.1',
          title: 'Periphrases with Infinitive',
          blocks: [
            {
              type: 'table',
              headers: ['Periphrasis', 'Meaning', 'Example'],
              rows: [
                [
                  'deber + inf.',
                  'obligation / moral duty',
                  'Debes ser mas puntual.',
                ],
                [
                  'deber de + inf.',
                  'probability / conjecture',
                  'Debe de estar en casa.',
                ],
                [
                  'tener que + inf.',
                  'strong obligation',
                  'Tengo que irme ya.',
                ],
                [
                  'haber de + inf.',
                  'mild obligation / expectation (literary)',
                  'Has de saber que no fue facil.',
                ],
                [
                  'haber que + inf.',
                  'impersonal obligation',
                  'Hay que tener cuidado.',
                ],
                [
                  'venir a + inf.',
                  'to end up / approximately',
                  'Viene a costar unos cien euros.',
                ],
                [
                  'llegar a + inf.',
                  'to manage to / to get to the point of',
                  'Llego a ser presidente.',
                ],
                [
                  'alcanzar a + inf.',
                  'to manage to (barely)',
                  'No alcance a verle.',
                ],
                [
                  'acertar a + inf.',
                  'to happen to / to manage to',
                  'No acerto a decir nada.',
                ],
                [
                  'echarse a + inf.',
                  'to burst into (sudden)',
                  'Se echo a llorar.',
                ],
                [
                  'romper a + inf.',
                  'to burst into (sudden, emphatic)',
                  'Rompio a reir.',
                ],
                [
                  'ponerse a + inf.',
                  'to start (spontaneous)',
                  'Se puso a llover.',
                ],
                [
                  'meterse a + inf.',
                  'to get involved in',
                  'Se metio a arreglar la casa.',
                ],
                [
                  'tardar en + inf.',
                  'to take time to',
                  'Tardo en contestar.',
                ],
                [
                  'acabar por + inf.',
                  'to end up (doing)',
                  'Acabo por aceptar.',
                ],
                [
                  'dejar de + inf.',
                  'to stop (doing)',
                  'Dejo de fumar hace un ano.',
                ],
                [
                  'no dejar de + inf.',
                  'to not fail to',
                  'No dejes de visitar el museo.',
                ],
                [
                  'pasar a + inf.',
                  'to proceed to',
                  'Pasemos a analizar los datos.',
                ],
              ],
            },
          ],
        },
        {
          id: '6.2',
          title: 'Periphrases with Gerund',
          blocks: [
            {
              type: 'table',
              headers: ['Periphrasis', 'Meaning', 'Example'],
              rows: [
                [
                  'estar + gerundio',
                  'action in progress',
                  'Estoy trabajando.',
                ],
                [
                  'seguir / continuar + gerundio',
                  'to keep on',
                  'Sigue lloviendo.',
                ],
                [
                  'llevar + time + gerundio',
                  'to have been -ing for',
                  'Llevo tres horas esperando.',
                ],
                [
                  'ir + gerundio',
                  'gradual progression',
                  'Va mejorando poco a poco.',
                ],
                [
                  'venir + gerundio',
                  'ongoing from past to present',
                  'Viene quejandose desde hace meses.',
                ],
                [
                  'andar + gerundio',
                  'to go around -ing (informal/negative)',
                  'Anda diciendo mentiras.',
                ],
                [
                  'quedarse + gerundio',
                  'to stay/remain -ing',
                  'Se quedo mirandome sin decir nada.',
                ],
                [
                  'acabar / terminar + gerundio',
                  'to end up -ing',
                  'Acabe aceptando la oferta.',
                ],
                [
                  'salir + gerundio',
                  'to come out -ing (often unexpected result)',
                  'Salio ganando al final.',
                ],
              ],
            },
          ],
        },
        {
          id: '6.3',
          title: 'Periphrases with Past Participle',
          blocks: [
            {
              type: 'table',
              headers: ['Periphrasis', 'Meaning', 'Example'],
              rows: [
                [
                  'tener + participle',
                  'completed result (participle agrees)',
                  'Tengo hechos los deberes.',
                ],
                [
                  'llevar + participle',
                  'accumulated total (participle agrees)',
                  'Llevo leidos tres capitulos.',
                ],
                [
                  'dejar + participle',
                  'to leave in a state (participle agrees)',
                  'Deje la puerta cerrada.',
                ],
                [
                  'quedar + participle',
                  'to be left in a state',
                  'La cena quedo preparada.',
                ],
                [
                  'dar por + participle',
                  'to consider as',
                  'Doy por terminada la reunion.',
                ],
              ],
            },
            {
              type: 'rules',
              items: [
                'In these constructions, the past participle agrees in gender and number with the direct object.',
              ],
            },
            {
              type: 'examples',
              examples: [
                {
                  es: 'Tengo escritas tres cartas.',
                  en: 'I have three letters written. (cartas = fem. pl.)',
                },
                {
                  es: 'Llevo leidas cien paginas.',
                  en: 'I have read a hundred pages (so far).',
                },
                {
                  es: 'Damos por cerrado el debate.',
                  en: 'We consider the debate closed.',
                },
              ],
            },
          ],
        },
      ],
    },
    {
      id: 6,
      title: 'Advanced Ser vs. Estar',
      sections: [
        {
          id: '7.1',
          title:
            'Estar for Subjective/Temporary Perception vs. Ser for Objective Classification',
          blocks: [
            {
              type: 'text',
              content:
                'At C1, learners master the use of estar to express a subjective reaction, surprise, or noticeable change.',
            },
            {
              type: 'examples',
              examples: [
                {
                  es: 'Que guapa estas hoy!',
                  en: 'How pretty you look today! (noticeable change)',
                },
                {
                  es: 'El nino esta muy alto.',
                  en: 'The boy is really tall (now). (perceived growth)',
                },
                {
                  es: 'Esta sopa esta muy salada.',
                  en: 'This soup is very salty. (tasting it now, subjective)',
                },
                {
                  es: 'La habitacion esta muy pequena con todos estos muebles.',
                  en: 'The room feels very small with all this furniture. (subjective impression)',
                },
              ],
            },
          ],
        },
        {
          id: '7.2',
          title: 'Ser with Events and Locations of Events',
          blocks: [
            {
              type: 'text',
              content:
                '"Ser" is used for the location of events (not objects/people).',
            },
            {
              type: 'examples',
              examples: [
                {
                  es: 'La reunion es en la sala 3.',
                  en: 'The meeting is in room 3.',
                },
                {
                  es: 'La fiesta sera en mi casa.',
                  en: 'The party will be at my house.',
                },
                {
                  es: 'El concierto fue en el estadio.',
                  en: 'The concert was at the stadium.',
                },
              ],
            },
            {
              type: 'text',
              content:
                'Compare with estar for objects/people: "Juan esta en la sala 3." -- Juan is in room 3.',
            },
          ],
        },
        {
          id: '7.3',
          title: 'Ser/Estar + Past Participle -- Complete System',
          blocks: [
            {
              type: 'table',
              headers: [
                'Construction',
                'Meaning',
                'Agreement',
                'Example',
              ],
              rows: [
                [
                  'ser + participle',
                  'passive action (by agent)',
                  'agrees with subject',
                  'El libro fue escrito por Cervantes.',
                ],
                [
                  'estar + participle',
                  'resulting state',
                  'agrees with subject',
                  'El libro esta escrito en espanol.',
                ],
                [
                  'tener + participle',
                  'completed action with emphasis on result',
                  'agrees with direct object',
                  'Tengo leidas tres novelas.',
                ],
                [
                  'llevar + participle',
                  'accumulated result',
                  'agrees with direct object',
                  'Llevo escritas cinco paginas.',
                ],
              ],
            },
          ],
        },
      ],
    },
    {
      id: 7,
      title: 'Discourse and Text Organization',
      sections: [
        {
          id: '8.1',
          title: 'Advanced Connectors by Function',
          blocks: [
            {
              type: 'text',
              content: 'Introducing a topic:',
            },
            {
              type: 'rules',
              items: [
                'En cuanto a... / En lo que se refiere a... / Con respecto a... / En relacion con...',
                '"En cuanto a la economia, la situacion ha mejorado." -- Regarding the economy, the situation has improved.',
              ],
            },
            {
              type: 'text',
              content: 'Adding information:',
            },
            {
              type: 'rules',
              items: [
                'Ademas / Asimismo / Por otra parte / Es mas / Incluso / No solo... sino tambien',
                '"Es mas, el informe demuestra que los resultados son positivos." -- What\'s more, the report shows the results are positive.',
              ],
            },
            {
              type: 'text',
              content: 'Contrasting:',
            },
            {
              type: 'rules',
              items: [
                'Sin embargo / No obstante / Ahora bien / En cambio / Por el contrario / Con todo',
                '"Con todo, hay que reconocer que el esfuerzo ha valido la pena." -- All things considered, one must recognize the effort has been worth it.',
              ],
            },
            {
              type: 'text',
              content: 'Expressing consequence:',
            },
            {
              type: 'rules',
              items: [
                'Por lo tanto / Por consiguiente / En consecuencia / De ahi que (+ subjunctive) / Asi pues',
                '"De ahi que muchos jovenes emigren." -- Hence many young people emigrate. (subjunctive)',
              ],
            },
            {
              type: 'text',
              content: 'Reformulating:',
            },
            {
              type: 'rules',
              items: [
                'Es decir / O sea / En otras palabras / Mejor dicho / Dicho de otro modo',
                '"Mejor dicho, no es que no quiera, sino que no puede." -- Or rather, it\'s not that he doesn\'t want to, but that he can\'t.',
              ],
            },
            {
              type: 'text',
              content: 'Summarizing / Concluding:',
            },
            {
              type: 'rules',
              items: [
                'En resumen / En conclusion / En definitiva / Para terminar / En pocas palabras / Al fin y al cabo',
                '"Al fin y al cabo, lo importante es que estamos juntos." -- At the end of the day, the important thing is we\'re together.',
              ],
            },
          ],
        },
        {
          id: '8.2',
          title: 'De ahi que + Subjunctive',
          blocks: [
            {
              type: 'text',
              content:
                '"De ahi que" introduces a consequence and always takes the subjunctive.',
            },
            {
              type: 'examples',
              examples: [
                {
                  es: 'No estudio lo suficiente; de ahi que suspendiera.',
                  en: "He didn't study enough; hence he failed.",
                },
                {
                  es: 'La situacion es complicada; de ahi que necesitemos mas tiempo.',
                  en: 'The situation is complicated; hence we need more time.',
                },
              ],
            },
          ],
        },
        {
          id: '8.3',
          title: 'Hedging and Softening',
          blocks: [
            {
              type: 'text',
              content:
                'C1 speakers soften opinions and statements for politeness and precision.',
            },
            {
              type: 'table',
              headers: ['Expression', 'Meaning', 'Example'],
              rows: [
                [
                  'Diria que...',
                  'I would say that...',
                  'Diria que es una buena idea.',
                ],
                [
                  'Me atreveria a decir que...',
                  'I would dare to say...',
                  'Me atreveria a decir que es el mejor.',
                ],
                [
                  'En mi opinion / A mi juicio',
                  'In my opinion',
                  'A mi juicio, deberiamos esperar.',
                ],
                [
                  'Por lo visto / Segun parece',
                  'Apparently',
                  'Por lo visto, van a cerrar la empresa.',
                ],
                [
                  'Que yo sepa',
                  'As far as I know',
                  'Que yo sepa, no han cambiado nada.',
                ],
                [
                  'Al parecer',
                  'Apparently',
                  'Al parecer, el director ha dimitido.',
                ],
                [
                  'Cabe senalar que',
                  'It is worth noting that',
                  'Cabe senalar que los datos son incompletos.',
                ],
              ],
            },
          ],
        },
      ],
    },
    {
      id: 8,
      title: 'Nominal Clauses -- Advanced Patterns',
      sections: [
        {
          id: '9.1',
          title: 'Verbs of Communication + Indicative/Subjunctive',
          blocks: [
            {
              type: 'text',
              content:
                'The mood depends on whether the verb conveys information or influence.',
            },
            {
              type: 'rules',
              items: [
                'Indicative (reporting information): decir, afirmar, declarar, confesar, reconocer, admitir + que + indicative',
                '"Dice que viene manana." -- He says he\'s coming tomorrow.',
                '"Reconocio que se habia equivocado." -- He admitted he had made a mistake.',
              ],
            },
            {
              type: 'rules',
              items: [
                'Subjunctive (exerting influence/command): decir, pedir, ordenar, rogar, exigir, suplicar + que + subjunctive',
                '"Dice que vengas manana." -- He says (for you) to come tomorrow.',
                '"Le pidio que se callara." -- He asked him to be quiet.',
              ],
            },
            {
              type: 'examples',
              examples: [
                {
                  es: 'Le dijo que estaba enfermo.',
                  en: 'He told him he was sick. (information -> indicative)',
                },
                {
                  es: 'Le dijo que fuera al medico.',
                  en: 'He told him to go to the doctor. (command -> subjunctive)',
                },
              ],
            },
          ],
        },
        {
          id: '9.2',
          title: 'Verbs of Thinking/Believing -- Mood Alternation',
          blocks: [
            {
              type: 'table',
              headers: ['Affirmative (indicative)', 'Negative (subjunctive)'],
              rows: [
                [
                  'Creo que es verdad.',
                  'No creo que sea verdad.',
                ],
                [
                  'Pienso que tiene razon.',
                  'No pienso que tenga razon.',
                ],
                [
                  'Me parece que esta bien.',
                  'No me parece que este bien.',
                ],
                [
                  'Estoy seguro de que vendra.',
                  'No estoy seguro de que venga.',
                ],
              ],
            },
            {
              type: 'rules',
              items: [
                'In questions (depends on expected answer):',
                '"Crees que es verdad?" -- Do you think it\'s true? (neutral -> indicative)',
                '"No crees que sea verdad?" -- Don\'t you think it might be true? (doubt -> subjunctive)',
              ],
            },
          ],
        },
        {
          id: '9.3',
          title: 'El hecho de que + Indicative/Subjunctive',
          blocks: [
            {
              type: 'text',
              content:
                '"El hecho de que" (the fact that) can take either mood: indicative when the speaker treats it as an established fact, subjunctive when the speaker adds judgment or when the clause is new information.',
            },
            {
              type: 'examples',
              examples: [
                {
                  es: 'El hecho de que trabaja mucho es evidente.',
                  en: 'The fact that he works a lot is evident. (established)',
                },
                {
                  es: 'El hecho de que trabaje mucho no significa que sea eficiente.',
                  en: "The fact that he works a lot doesn't mean he's efficient. (judgment)",
                },
              ],
            },
          ],
        },
      ],
    },
    {
      id: 9,
      title: 'Word Order and Emphasis',
      sections: [
        {
          id: '10.1',
          title: 'Topicalization (Fronting)',
          blocks: [
            {
              type: 'text',
              content:
                'Moving an element to the beginning of the sentence for emphasis or topic-setting.',
            },
            {
              type: 'examples',
              examples: [
                {
                  es: 'Eso no lo sabia.',
                  en: "That, I didn't know. (fronted direct object with redundant pronoun)",
                },
                {
                  es: 'A Juan le regale un libro.',
                  en: 'To Juan, I gave a book. (fronted indirect object)',
                },
                {
                  es: 'En esa casa vivieron mis abuelos.',
                  en: 'In that house my grandparents lived. (fronted adverbial)',
                },
                {
                  es: 'Cansado estoy, pero no me rindo.',
                  en: "Tired I am, but I don't give up. (fronted predicate)",
                },
              ],
            },
          ],
        },
        {
          id: '10.2',
          title: 'Cleft Sentences (Oraciones Hendidas)',
          blocks: [
            {
              type: 'text',
              content:
                'Used to highlight a specific element of the sentence.',
            },
            {
              type: 'rules',
              items: [
                'Structure: Ser + highlighted element + el/la/lo que/quien + rest',
              ],
            },
            {
              type: 'examples',
              examples: [
                {
                  es: 'Fue Juan el que lo hizo.',
                  en: 'It was Juan who did it.',
                },
                {
                  es: 'Es la economia lo que mas me preocupa.',
                  en: "It's the economy that worries me most.",
                },
                {
                  es: 'Fueron ellos quienes decidieron.',
                  en: 'It was they who decided.',
                },
                {
                  es: 'Es aqui donde todo empezo.',
                  en: "It's here where everything started.",
                },
              ],
            },
          ],
        },
        {
          id: '10.3',
          title: 'Reduplication for Emphasis',
          blocks: [
            {
              type: 'text',
              content: 'Repeating a word for emphatic effect.',
            },
            {
              type: 'examples',
              examples: [
                {
                  es: 'Lo que es es.',
                  en: 'It is what it is.',
                },
                {
                  es: 'Eso si que es verdad.',
                  en: 'That really is true.',
                },
                {
                  es: 'Trabajar, trabajamos mucho.',
                  en: 'As for working, we work a lot. (infinitive fronted + conjugated form)',
                },
              ],
            },
          ],
        },
      ],
    },
    {
      id: 10,
      title: 'Advanced Uses of "Se"',
      sections: [
        {
          id: '11.1',
          title: 'Complete Inventory of "Se"',
          blocks: [
            {
              type: 'text',
              content:
                'At C1, learners must identify all functions of "se."',
            },
            {
              type: 'table',
              headers: ['Function', 'Example', 'Explanation'],
              rows: [
                [
                  'Reflexive',
                  'Se lava las manos.',
                  'He washes his (own) hands.',
                ],
                [
                  'Reciprocal',
                  'Se quieren mucho.',
                  'They love each other.',
                ],
                [
                  'Passive se',
                  'Se venden pisos.',
                  'Apartments are sold.',
                ],
                [
                  'Impersonal se',
                  'Se vive bien aqui.',
                  'One lives well here.',
                ],
                [
                  'Pronominal verb',
                  'Se arrepintio.',
                  'He regretted it. (inherent se)',
                ],
                [
                  'Indirect object replacement',
                  'Se lo di. (= le lo di)',
                  'I gave it to him.',
                ],
                [
                  'Aspectual / intensive se',
                  'Se comio toda la pizza.',
                  'He ate the whole pizza. (emphatic completion)',
                ],
                [
                  'Dative of interest',
                  'Se me cayo el vaso.',
                  'The glass fell on me. (involuntary)',
                ],
              ],
            },
          ],
        },
        {
          id: '11.2',
          title: 'Involuntary / Accidental "Se" (Se me / Se te / Se le...)',
          blocks: [
            {
              type: 'text',
              content:
                'This construction removes blame from the subject, presenting the action as accidental or involuntary.',
            },
            {
              type: 'rules',
              items: [
                'Structure: Se + indirect object pronoun + verb (3rd person, agrees with the thing) + subject (thing)',
              ],
            },
            {
              type: 'examples',
              examples: [
                {
                  es: 'Se me olvidaron las llaves.',
                  en: 'I forgot the keys. (lit: The keys forgot themselves on me.)',
                },
                {
                  es: 'Se le rompio el telefono.',
                  en: 'His phone broke. (involuntary)',
                },
                {
                  es: 'Se nos acabo el tiempo.',
                  en: 'We ran out of time.',
                },
                {
                  es: 'Se te cayo el cafe.',
                  en: 'You dropped the coffee.',
                },
                {
                  es: 'Se me ha ocurrido una idea.',
                  en: 'An idea occurred to me.',
                },
              ],
            },
            {
              type: 'text',
              content:
                'Common verbs in this construction: olvidar, romper, perder, caer, acabar, ocurrir, escapar, quemar, estropear',
            },
          ],
        },
        {
          id: '11.3',
          title: 'Aspectual / Intensive "Se" (Se comio, se bebio...)',
          blocks: [
            {
              type: 'text',
              content:
                'Adding "se" to certain transitive verbs emphasizes completeness of the action.',
            },
            {
              type: 'examples',
              examples: [
                {
                  es: 'Comio una pizza.',
                  en: 'He ate a pizza. (neutral)',
                },
                {
                  es: 'Se comio toda la pizza.',
                  en: 'He ate the whole pizza. (completeness emphasized)',
                },
                {
                  es: 'Leyo el libro.',
                  en: 'She read the book. (neutral)',
                },
                {
                  es: 'Se leyo el libro entero en una noche.',
                  en: 'She read the entire book in one night. (emphatic)',
                },
                {
                  es: 'Bebio tres cervezas.',
                  en: 'He drank three beers.',
                },
                {
                  es: 'Se bebio tres cervezas de un trago.',
                  en: 'He drank three beers in one go.',
                },
              ],
            },
          ],
        },
      ],
    },
    {
      id: 11,
      title: 'Register and Style',
      sections: [
        {
          id: '12.1',
          title: 'Formal vs. Informal Register',
          blocks: [
            {
              type: 'text',
              content:
                'C1 speakers adjust their language depending on context.',
            },
            {
              type: 'table',
              headers: ['Feature', 'Informal', 'Formal'],
              rows: [
                ['Address', 'tu / vosotros', 'usted / ustedes'],
                [
                  'Greetings',
                  'Hola! Que tal?',
                  'Buenos dias. Como esta usted?',
                ],
                [
                  'Requests',
                  'Me ayudas?',
                  'Seria tan amable de ayudarme?',
                ],
                [
                  'Expressions',
                  'la verdad es que...',
                  'cabe destacar que...',
                ],
                [
                  'Connectors',
                  'o sea, bueno, pues',
                  'es decir, por consiguiente',
                ],
                [
                  'Subjunctive in -ra vs. -se',
                  '-ra form dominant',
                  '-se form also appears',
                ],
                [
                  'Vocabulary',
                  'curro (job), molar (to be cool)',
                  'trabajo, resultar agradable',
                ],
              ],
            },
          ],
        },
        {
          id: '12.2',
          title: 'Colloquial Intensifiers and Markers',
          blocks: [
            {
              type: 'table',
              headers: ['Expression', 'Meaning', 'Example'],
              rows: [
                [
                  'Que va!',
                  'No way!',
                  'Estas enfadado? -- Que va!',
                ],
                [
                  'Venga!',
                  'Come on! / OK!',
                  'Venga, vamonos!',
                ],
                [
                  'Anda!',
                  'Wow! / Come on!',
                  'Anda, no lo sabia!',
                ],
                [
                  'o sea',
                  'I mean / that is',
                  'O sea, no me parece bien.',
                ],
                ['bueno', 'well', 'Bueno, que hacemos?'],
                ['pues', 'well / so', 'Pues no se que decirte.'],
                [
                  'es que',
                  'the thing is',
                  'Es que no tengo tiempo.',
                ],
                [
                  'total que',
                  'so in the end',
                  'Total que nos quedamos en casa.',
                ],
                [
                  'resulta que',
                  'it turns out that',
                  'Resulta que ya lo sabia.',
                ],
              ],
            },
          ],
        },
        {
          id: '12.3',
          title: 'Euphemisms and Politeness Strategies',
          blocks: [
            {
              type: 'table',
              headers: ['Direct', 'Softened'],
              rows: [
                [
                  'No puedo.',
                  'Me resulta imposible / Me temo que no va a ser posible.',
                ],
                [
                  'Estas equivocado.',
                  'Creo que habria que reconsiderar esa idea.',
                ],
                [
                  'Es malo.',
                  'No es del todo satisfactorio / Deja bastante que desear.',
                ],
                [
                  'Dime la verdad.',
                  'Me gustaria que fueras sincero conmigo.',
                ],
                [
                  'Hazlo.',
                  'Te importaria hacerlo? / Serias tan amable de...?',
                ],
              ],
            },
          ],
        },
      ],
    },
  ],
}
