import { GrammarLevel } from './types'

export const grammarA1: GrammarLevel = {
  level: 'A1',
  title: 'Beginner Spanish Grammar',
  chapters: [
    {
      id: 0,
      title: 'Alphabet, Pronunciation & Basic Phonetics',
      sections: [
        {
          id: '1.1',
          title: 'The Spanish Alphabet',
          blocks: [
            {
              type: 'text',
              content: 'The Spanish alphabet has 27 letters. Key differences from English: the letter "ñ", and letters like "h" (always silent), "v"/"b" (same sound), "c"/"z"/"s" (regional pronunciation variation).',
            },
            {
              type: 'rules',
              items: [
                '"h" is always silent: "hola" is pronounced "ola"',
                '"ll" and "y" sound similar (like English "y")',
                '"j" and "g" (before e/i) sound like a strong English "h"',
                'Stress falls on the second-to-last syllable by default; accents override this',
              ],
            },
            {
              type: 'examples',
              examples: [
                { es: 'Hola, me llamo Ana.', en: 'Hello, my name is Ana.' },
                { es: 'La jirafa es un animal.', en: 'The giraffe is an animal.' },
              ],
            },
          ],
        },
        {
          id: '1.2',
          title: 'Accentuation and Written Accents',
          blocks: [
            {
              type: 'text',
              content: 'Written accent marks (tildes) signal stress and distinguish homophones.',
            },
            {
              type: 'rules',
              items: [
                'Words ending in a vowel, -n, or -s are stressed on the second-to-last syllable',
                'Written accents on question/exclamation words: qué, cómo, dónde, cuándo, quién, cuánto',
                'Accent marks distinguish: tú (you) vs. tu (your), él (he) vs. el (the), sí (yes) vs. si (if)',
              ],
            },
            {
              type: 'examples',
              examples: [
                { es: '¿Cómo te llamas?', en: 'What is your name?' },
                { es: 'Él tiene tu libro.', en: 'He has your book.' },
              ],
            },
          ],
        },
      ],
    },
    {
      id: 1,
      title: 'Nouns and Articles',
      sections: [
        {
          id: '2.1',
          title: 'Grammatical Gender — Masculine and Feminine Nouns',
          blocks: [
            {
              type: 'text',
              content: 'Every Spanish noun has a grammatical gender: masculine or feminine. Articles, adjectives, and pronouns must agree.',
            },
            {
              type: 'rules',
              items: [
                'Most nouns ending in -o are masculine: el libro (the book), el niño (the boy)',
                'Most nouns ending in -a are feminine: la casa (the house), la niña (the girl)',
                'Exceptions: el día (day), el mapa (map) — masculine despite -a ending; la mano (hand), la foto — feminine despite -o ending',
                'Nouns ending in -ión, -dad, -tad, -tud, -umbre are usually feminine: la nación, la ciudad',
                'Nouns ending in -or, -aje are usually masculine: el color, el viaje',
              ],
            },
            {
              type: 'examples',
              examples: [
                { es: 'El perro es grande.', en: 'The dog is big.' },
                { es: 'La ciudad es bonita.', en: 'The city is beautiful.' },
                { es: 'El problema es difícil.', en: 'The problem is difficult.' },
              ],
            },
          ],
        },
        {
          id: '2.2',
          title: 'Plural Formation',
          blocks: [
            {
              type: 'rules',
              items: [
                'Nouns ending in a vowel → add -s: libro → libros, casa → casas',
                'Nouns ending in a consonant → add -es: ciudad → ciudades, color → colores',
                'Nouns ending in -z → change z to c and add -es: lápiz → lápices',
                'Nouns ending in an accented vowel + consonant may lose the accent: nación → naciones',
              ],
            },
            {
              type: 'examples',
              examples: [
                { es: 'Tengo dos libros.', en: 'I have two books.' },
                { es: 'Hay muchas ciudades bonitas.', en: 'There are many beautiful cities.' },
              ],
            },
          ],
        },
        {
          id: '2.3',
          title: 'Definite Articles — el, la, los, las',
          blocks: [
            {
              type: 'text',
              content: 'Used when referring to something specific or already known.',
            },
            {
              type: 'table',
              headers: ['', 'Masculine', 'Feminine'],
              rows: [
                ['Singular', 'el', 'la'],
                ['Plural', 'los', 'las'],
              ],
            },
            {
              type: 'text',
              content: '"el" is used before feminine nouns starting with stressed a-/ha-: el agua, el hacha (but: las aguas)',
            },
            {
              type: 'examples',
              examples: [
                { es: 'El gato duerme.', en: 'The cat sleeps.' },
                { es: 'La profesora habla español.', en: 'The teacher speaks Spanish.' },
                { es: 'Los niños juegan en el parque.', en: 'The children play in the park.' },
                { es: 'Las manzanas son rojas.', en: 'The apples are red.' },
              ],
            },
          ],
        },
        {
          id: '2.4',
          title: 'Indefinite Articles — un, una, unos, unas',
          blocks: [
            {
              type: 'text',
              content: 'Used when introducing something for the first time or referring to something non-specific.',
            },
            {
              type: 'table',
              headers: ['', 'Masculine', 'Feminine'],
              rows: [
                ['Singular', 'un', 'una'],
                ['Plural', 'unos', 'unas'],
              ],
            },
            {
              type: 'text',
              content: 'Indefinite articles are omitted after "ser" with professions: "Soy médico" (I am a doctor), not "Soy un médico"',
            },
            {
              type: 'examples',
              examples: [
                { es: 'Tengo un perro.', en: 'I have a dog.' },
                { es: 'Ella es una estudiante.', en: 'She is a student.' },
                { es: 'Hay unos libros en la mesa.', en: 'There are some books on the table.' },
              ],
            },
          ],
        },
        {
          id: '2.5',
          title: 'Contracted Articles — al and del',
          blocks: [
            {
              type: 'rules',
              items: [
                'a + el = al (never "a el")',
                'de + el = del (never "de el")',
                'No contraction with "él" (the pronoun): "Hablo de él" (I speak about him)',
              ],
            },
            {
              type: 'examples',
              examples: [
                { es: 'Voy al mercado.', en: "I'm going to the market." },
                { es: 'Es el libro del profesor.', en: "It's the teacher's book." },
              ],
            },
          ],
        },
      ],
    },
    {
      id: 2,
      title: 'Personal Pronouns',
      sections: [
        {
          id: '3.1',
          title: 'Subject Pronouns',
          blocks: [
            {
              type: 'table',
              headers: ['Person', 'Singular', 'Plural'],
              rows: [
                ['1st', 'yo (I)', 'nosotros/nosotras (we)'],
                ['2nd', 'tú (you, informal) / usted (you, formal)', 'vosotros/vosotras (you all, Spain) / ustedes (you all)'],
                ['3rd', 'él (he) / ella (she)', 'ellos/ellas (they)'],
              ],
            },
            {
              type: 'rules',
              items: [
                'Subject pronouns are often omitted because the verb ending reveals the subject: "Hablo" = "I speak"',
                'Use them for emphasis or contrast: "Yo hablo español, pero ella habla inglés."',
              ],
            },
            {
              type: 'examples',
              examples: [
                { es: 'Yo soy estudiante.', en: 'I am a student.' },
                { es: 'Ella vive en Madrid.', en: 'She lives in Madrid.' },
                { es: 'Nosotros hablamos español.', en: 'We speak Spanish.' },
              ],
            },
          ],
        },
        {
          id: '3.2',
          title: 'Tú vs. Usted — Informal vs. Formal "You"',
          blocks: [
            {
              type: 'rules',
              items: [
                'tú — used with friends, family, peers, children (informal)',
                'usted (abbreviated Ud.) — used with strangers, elders, authority figures, professional contexts (formal)',
                'vosotros — used in Spain for informal plural "you"',
                'ustedes — used in Latin America for all plural "you" (formal and informal)',
              ],
            },
            {
              type: 'examples',
              examples: [
                { es: '¿Cómo te llamas?', en: "What's your name? (informal)" },
                { es: '¿Cómo se llama usted?', en: "What's your name? (formal)" },
              ],
            },
          ],
        },
      ],
    },
    {
      id: 3,
      title: 'The Verb "Ser" and "Estar" (To Be)',
      sections: [
        {
          id: '4.1',
          title: 'Ser — Permanent / Inherent Characteristics',
          blocks: [
            {
              type: 'text',
              content: '"Ser" expresses identity, origin, nationality, profession, material, relationships, time, and inherent qualities.',
            },
            {
              type: 'table',
              headers: ['Person', 'Conjugation'],
              rows: [
                ['yo', 'soy'],
                ['tú', 'eres'],
                ['él/ella/usted', 'es'],
                ['nosotros', 'somos'],
                ['vosotros', 'sois'],
                ['ellos/ustedes', 'son'],
              ],
            },
            {
              type: 'rules',
              items: [
                'Identity/name: "Soy Ana."',
                'Origin/nationality: "Soy de México." / "Es española."',
                'Profession: "Ella es médica."',
                'Material: "La mesa es de madera."',
                'Relationship: "Él es mi hermano."',
                'Time/date: "Son las tres." / "Hoy es lunes."',
                'Physical/personality traits: "Él es alto." / "Ella es simpática."',
              ],
            },
            {
              type: 'examples',
              examples: [
                { es: 'Soy estudiante de español.', en: 'I am a Spanish student.' },
                { es: 'Somos de Colombia.', en: 'We are from Colombia.' },
                { es: 'Hoy es martes, 5 de marzo.', en: 'Today is Tuesday, March 5th.' },
              ],
            },
          ],
        },
        {
          id: '4.2',
          title: 'Estar — Location / Temporary States',
          blocks: [
            {
              type: 'text',
              content: '"Estar" expresses location, temporary states, conditions, and ongoing actions.',
            },
            {
              type: 'table',
              headers: ['Person', 'Conjugation'],
              rows: [
                ['yo', 'estoy'],
                ['tú', 'estás'],
                ['él/ella/usted', 'está'],
                ['nosotros', 'estamos'],
                ['vosotros', 'estáis'],
                ['ellos/ustedes', 'están'],
              ],
            },
            {
              type: 'rules',
              items: [
                'Location: "El banco está en la calle mayor."',
                'Temporary state/feeling: "Estoy cansado." / "Ella está triste."',
                'Ongoing action (with gerund): "Estoy estudiando."',
              ],
            },
            {
              type: 'examples',
              examples: [
                { es: '¿Dónde está el hotel?', en: 'Where is the hotel?' },
                { es: 'Estamos en casa.', en: 'We are at home.' },
                { es: 'El café está frío.', en: 'The coffee is cold.' },
              ],
            },
          ],
        },
        {
          id: '4.3',
          title: 'Ser vs. Estar — Key Contrasts',
          blocks: [
            {
              type: 'text',
              content: 'Many adjectives change meaning depending on whether they are used with ser or estar.',
            },
            {
              type: 'table',
              headers: ['Adjective', 'With ser', 'With estar'],
              rows: [
                ['bueno', 'Es bueno. (He\'s a good person.)', 'Está bueno. (It tastes good.)'],
                ['malo', 'Es malo. (He\'s bad/evil.)', 'Está malo. (He\'s sick.)'],
                ['aburrido', 'Es aburrido. (It\'s boring.)', 'Está aburrido. (He\'s bored.)'],
                ['listo', 'Es listo. (He\'s clever.)', 'Está listo. (He\'s ready.)'],
                ['seguro', 'Es seguro. (It\'s safe.)', 'Está seguro. (He\'s sure.)'],
              ],
            },
          ],
        },
      ],
    },
    {
      id: 4,
      title: 'Regular and Irregular Verbs in the Present Tense',
      sections: [
        {
          id: '5.1',
          title: 'Regular -AR Verbs',
          blocks: [
            {
              type: 'text',
              content: 'The most common verb group. Remove -ar and add the endings.',
            },
            {
              type: 'table',
              headers: ['Person', 'Ending'],
              rows: [
                ['yo', '-o'],
                ['tú', '-as'],
                ['él/ella/usted', '-a'],
                ['nosotros', '-amos'],
                ['vosotros', '-áis'],
                ['ellos/ustedes', '-an'],
              ],
            },
            {
              type: 'text',
              content: 'Common verbs: hablar (to speak), trabajar (to work), estudiar (to study), caminar (to walk), escuchar (to listen), mirar (to look), bailar (to dance), comprar (to buy)',
            },
            {
              type: 'examples',
              examples: [
                { es: 'Yo hablo español todos los días.', en: 'I speak Spanish every day.' },
                { es: 'Ella trabaja en un banco.', en: 'She works in a bank.' },
                { es: 'Nosotros estudiamos mucho.', en: 'We study a lot.' },
              ],
            },
          ],
        },
        {
          id: '5.2',
          title: 'Regular -ER Verbs',
          blocks: [
            {
              type: 'table',
              headers: ['Person', 'Ending'],
              rows: [
                ['yo', '-o'],
                ['tú', '-es'],
                ['él/ella/usted', '-e'],
                ['nosotros', '-emos'],
                ['vosotros', '-éis'],
                ['ellos/ustedes', '-en'],
              ],
            },
            {
              type: 'text',
              content: 'Common verbs: comer (to eat), beber (to drink), leer (to read), aprender (to learn), vender (to sell), correr (to run)',
            },
            {
              type: 'examples',
              examples: [
                { es: 'Como una manzana.', en: 'I eat an apple.' },
                { es: '¿Bebes café o té?', en: 'Do you drink coffee or tea?' },
                { es: 'Aprendemos mucho en clase.', en: 'We learn a lot in class.' },
              ],
            },
          ],
        },
        {
          id: '5.3',
          title: 'Regular -IR Verbs',
          blocks: [
            {
              type: 'table',
              headers: ['Person', 'Ending'],
              rows: [
                ['yo', '-o'],
                ['tú', '-es'],
                ['él/ella/usted', '-e'],
                ['nosotros', '-imos'],
                ['vosotros', '-ís'],
                ['ellos/ustedes', '-en'],
              ],
            },
            {
              type: 'text',
              content: 'Common verbs: vivir (to live), escribir (to write), abrir (to open), recibir (to receive), subir (to go up)',
            },
            {
              type: 'examples',
              examples: [
                { es: 'Vivo en una ciudad grande.', en: 'I live in a big city.' },
                { es: 'Él escribe una carta.', en: 'He writes a letter.' },
              ],
            },
          ],
        },
        {
          id: '5.4',
          title: 'Irregular Verb: Tener (To Have)',
          blocks: [
            {
              type: 'table',
              headers: ['Person', 'Conjugation'],
              rows: [
                ['yo', 'tengo'],
                ['tú', 'tienes'],
                ['él/ella/usted', 'tiene'],
                ['nosotros', 'tenemos'],
                ['vosotros', 'tenéis'],
                ['ellos/ustedes', 'tienen'],
              ],
            },
            {
              type: 'rules',
              items: [
                'tener + age: "Tengo veinte años." (I am twenty years old.)',
                'tener hambre/sed — hungry/thirsty',
                'tener frío/calor — cold/hot',
                'tener miedo — afraid',
                'tener razón — to be right',
                'tener sueño — sleepy',
                'tener prisa — to be in a hurry',
              ],
            },
            {
              type: 'examples',
              examples: [
                { es: '¿Cuántos años tienes?', en: 'How old are you?' },
                { es: 'Tengo hambre. ¿Y tú?', en: "I'm hungry. What about you?" },
              ],
            },
          ],
        },
        {
          id: '5.5',
          title: 'Irregular Verb: Ir (To Go)',
          blocks: [
            {
              type: 'text',
              content: 'Completely irregular. Also used to form the near future.',
            },
            {
              type: 'table',
              headers: ['Person', 'Conjugation'],
              rows: [
                ['yo', 'voy'],
                ['tú', 'vas'],
                ['él/ella/usted', 'va'],
                ['nosotros', 'vamos'],
                ['vosotros', 'vais'],
                ['ellos/ustedes', 'van'],
              ],
            },
            {
              type: 'examples',
              examples: [
                { es: 'Voy al supermercado.', en: "I'm going to the supermarket." },
                { es: '¿Adónde vas?', en: 'Where are you going?' },
                { es: '¡Vamos!', en: "Let's go!" },
              ],
            },
          ],
        },
        {
          id: '5.6',
          title: 'Irregular Verb: Hacer (To Do / To Make)',
          blocks: [
            {
              type: 'text',
              content: 'Irregular in the yo form only in the present tense. Also used for weather: "Hace frío." (It\'s cold.) / "Hace sol." (It\'s sunny.)',
            },
            {
              type: 'table',
              headers: ['Person', 'Conjugation'],
              rows: [
                ['yo', 'hago'],
                ['tú', 'haces'],
                ['él/ella/usted', 'hace'],
                ['nosotros', 'hacemos'],
                ['vosotros', 'hacéis'],
                ['ellos/ustedes', 'hacen'],
              ],
            },
            {
              type: 'examples',
              examples: [
                { es: 'Hago ejercicio por la mañana.', en: 'I exercise in the morning.' },
                { es: '¿Qué haces los fines de semana?', en: 'What do you do on weekends?' },
              ],
            },
          ],
        },
        {
          id: '5.7',
          title: 'Irregular Verb: Dar (To Give)',
          blocks: [
            {
              type: 'table',
              headers: ['Person', 'Conjugation'],
              rows: [
                ['yo', 'doy'],
                ['tú', 'das'],
                ['él/ella/usted', 'da'],
                ['nosotros', 'damos'],
                ['vosotros', 'dais'],
                ['ellos/ustedes', 'dan'],
              ],
            },
            {
              type: 'examples',
              examples: [
                { es: 'Le doy el libro a la profesora.', en: 'I give the book to the teacher.' },
                { es: '¿Me das tu número de teléfono?', en: 'Can you give me your phone number?' },
              ],
            },
          ],
        },
        {
          id: '5.8',
          title: 'Stem-Changing Verbs (e → ie)',
          blocks: [
            {
              type: 'text',
              content: 'The stem vowel "e" changes to "ie" in all forms except nosotros and vosotros (boot verbs).',
            },
            {
              type: 'text',
              content: 'Common verbs: querer (to want/love), entender (to understand), preferir (to prefer), empezar (to start), pensar (to think)',
            },
            {
              type: 'table',
              headers: ['Person', 'Querer'],
              rows: [
                ['yo', 'quiero'],
                ['tú', 'quieres'],
                ['él/ella/usted', 'quiere'],
                ['nosotros', 'queremos'],
                ['vosotros', 'queréis'],
                ['ellos/ustedes', 'quieren'],
              ],
            },
            {
              type: 'examples',
              examples: [
                { es: 'Quiero un café, por favor.', en: 'I want a coffee, please.' },
                { es: 'Ella prefiere el té.', en: 'She prefers tea.' },
                { es: 'La clase empieza a las nueve.', en: 'The class starts at nine.' },
              ],
            },
          ],
        },
        {
          id: '5.9',
          title: 'Stem-Changing Verbs (o → ue)',
          blocks: [
            {
              type: 'text',
              content: 'The stem vowel "o" changes to "ue" in all forms except nosotros and vosotros.',
            },
            {
              type: 'text',
              content: 'Common verbs: poder (to be able to/can), dormir (to sleep), volver (to return), costar (to cost), encontrar (to find), jugar (u → ue)',
            },
            {
              type: 'table',
              headers: ['Person', 'Poder'],
              rows: [
                ['yo', 'puedo'],
                ['tú', 'puedes'],
                ['él/ella/usted', 'puede'],
                ['nosotros', 'podemos'],
                ['vosotros', 'podéis'],
                ['ellos/ustedes', 'pueden'],
              ],
            },
            {
              type: 'examples',
              examples: [
                { es: '¿Puedes ayudarme?', en: 'Can you help me?' },
                { es: 'No puedo dormir.', en: "I can't sleep." },
                { es: '¿Cuánto cuesta?', en: 'How much does it cost?' },
              ],
            },
          ],
        },
        {
          id: '5.10',
          title: 'Stem-Changing Verbs (e → i)',
          blocks: [
            {
              type: 'text',
              content: 'The stem vowel "e" changes to "i". Only in -ir verbs.',
            },
            {
              type: 'text',
              content: 'Common verbs: pedir (to ask for/order), seguir (to follow/continue), repetir (to repeat), servir (to serve)',
            },
            {
              type: 'table',
              headers: ['Person', 'Pedir'],
              rows: [
                ['yo', 'pido'],
                ['tú', 'pides'],
                ['él/ella/usted', 'pide'],
                ['nosotros', 'pedimos'],
                ['vosotros', 'pedís'],
                ['ellos/ustedes', 'piden'],
              ],
            },
            {
              type: 'examples',
              examples: [
                { es: 'Pido una ensalada.', en: 'I order a salad.' },
                { es: 'Él siempre pide la cuenta.', en: 'He always asks for the bill.' },
              ],
            },
          ],
        },
      ],
    },
    {
      id: 5,
      title: 'Reflexive Verbs',
      sections: [
        {
          id: '6.1',
          title: 'Reflexive Verbs and Daily Routines',
          blocks: [
            {
              type: 'text',
              content: 'Reflexive verbs indicate the subject performs the action on themselves. They use reflexive pronouns placed before the conjugated verb.',
            },
            {
              type: 'table',
              headers: ['Subject', 'Pronoun'],
              rows: [
                ['yo', 'me'],
                ['tú', 'te'],
                ['él/ella/usted', 'se'],
                ['nosotros', 'nos'],
                ['vosotros', 'os'],
                ['ellos/ustedes', 'se'],
              ],
            },
            {
              type: 'rules',
              items: [
                'With body parts, use definite articles (not possessives): "Me lavo las manos" (I wash my hands), NOT "Me lavo mis manos."',
              ],
            },
            {
              type: 'text',
              content: 'Common reflexive verbs: llamarse (to be called), levantarse (to get up), acostarse (to go to bed, o→ue), despertarse (to wake up, e→ie), ducharse (to shower), lavarse (to wash oneself), vestirse (to get dressed, e→i), peinarse (to comb one\'s hair), sentarse (to sit down, e→ie), sentirse (to feel, e→ie)',
            },
            {
              type: 'examples',
              examples: [
                { es: 'Me llamo Carlos.', en: 'My name is Carlos.' },
                { es: 'Me levanto a las siete.', en: 'I get up at seven.' },
                { es: 'Ella se ducha por la mañana.', en: 'She showers in the morning.' },
                { es: 'Nos acostamos tarde los viernes.', en: 'We go to bed late on Fridays.' },
              ],
            },
          ],
        },
      ],
    },
    {
      id: 6,
      title: 'Key Grammatical Structures',
      sections: [
        {
          id: '7.1',
          title: 'Hay — There Is / There Are',
          blocks: [
            {
              type: 'text',
              content: '"Hay" is an impersonal form of haber used to express existence. It is invariable — the same form for singular and plural.',
            },
            {
              type: 'rules',
              items: [
                'Hay + indefinite article + noun: "Hay un banco cerca."',
                'Hay + number + noun: "Hay tres estudiantes."',
                'Negation: "No hay agua."',
              ],
            },
            {
              type: 'examples',
              examples: [
                { es: 'Hay un restaurante en esta calle.', en: 'There is a restaurant on this street.' },
                { es: '¿Hay hoteles baratos aquí?', en: 'Are there cheap hotels here?' },
                { es: 'No hay problema.', en: 'There is no problem.' },
              ],
            },
          ],
        },
        {
          id: '7.2',
          title: 'Near Future: Ir a + Infinitive',
          blocks: [
            {
              type: 'text',
              content: 'Used to talk about plans, intentions, and future events.',
            },
            {
              type: 'rules',
              items: [
                'Structure: ir (conjugated) + a + infinitive',
              ],
            },
            {
              type: 'examples',
              examples: [
                { es: 'Voy a estudiar esta tarde.', en: "I'm going to study this afternoon." },
                { es: '¿Qué vas a hacer el fin de semana?', en: 'What are you going to do this weekend?' },
                { es: 'Ella va a viajar a México.', en: 'She is going to travel to Mexico.' },
                { es: 'Van a llegar mañana.', en: 'They are going to arrive tomorrow.' },
              ],
            },
          ],
        },
        {
          id: '7.3',
          title: 'Present Progressive: Estar + Gerund',
          blocks: [
            {
              type: 'text',
              content: 'Used to describe an action happening right now.',
            },
            {
              type: 'rules',
              items: [
                '-ar verbs → -ando: hablar → hablando',
                '-er/-ir verbs → -iendo: comer → comiendo, vivir → viviendo',
                'Irregular gerunds: leer → leyendo, ir → yendo, dormir → durmiendo',
              ],
            },
            {
              type: 'examples',
              examples: [
                { es: 'Estoy comiendo.', en: 'I am eating.' },
                { es: '¿Qué estás haciendo?', en: 'What are you doing?' },
                { es: 'Ella está estudiando para el examen.', en: 'She is studying for the exam.' },
              ],
            },
          ],
        },
        {
          id: '7.4',
          title: 'Modal Verbs with Infinitive',
          blocks: [
            {
              type: 'text',
              content: 'Modal verbs express ability, desire, or obligation. They are conjugated and followed by an infinitive.',
            },
            {
              type: 'rules',
              items: [
                'poder (can): "Puedo hablar español."',
                'querer (to want): "Quiero aprender."',
                'deber (should/must): "Debes estudiar más."',
                'necesitar (to need): "Necesito ayuda."',
              ],
            },
            {
              type: 'examples',
              examples: [
                { es: '¿Puedo abrir la ventana?', en: 'Can I open the window?' },
                { es: 'Quiero aprender a bailar salsa.', en: 'I want to learn to dance salsa.' },
              ],
            },
          ],
        },
        {
          id: '7.5',
          title: 'Tener que + Infinitive (Obligation)',
          blocks: [
            {
              type: 'text',
              content: '"Tener que" + infinitive expresses obligation or necessity.',
            },
            {
              type: 'examples',
              examples: [
                { es: 'Tengo que trabajar mañana.', en: 'I have to work tomorrow.' },
                { es: 'Ella tiene que estudiar más.', en: 'She has to study more.' },
                { es: 'Tenemos que comprar comida.', en: 'We have to buy food.' },
              ],
            },
          ],
        },
        {
          id: '7.6',
          title: 'Gustar and Similar Verbs',
          blocks: [
            {
              type: 'text',
              content: '"Gustar" (to like) has a reverse structure: the thing liked is the subject; the person is the indirect object.',
            },
            {
              type: 'rules',
              items: [
                'Structure: (A mí/ti/él...) + me/te/le/nos/os/les + gusta/gustan + noun/infinitive',
                'gusta + singular noun or infinitive',
                'gustan + plural noun',
                'Related verbs: encantar (to love), doler (to hurt), molestar (to bother), interesar (to interest)',
              ],
            },
            {
              type: 'examples',
              examples: [
                { es: 'Me gusta el fútbol.', en: 'I like football.' },
                { es: '¿Te gustan las películas de acción?', en: 'Do you like action movies?' },
                { es: 'Le encanta bailar.', en: 'He/she loves to dance.' },
                { es: 'Me duele la cabeza.', en: 'My head hurts.' },
              ],
            },
          ],
        },
      ],
    },
    {
      id: 7,
      title: 'Adjectives and Adverbs',
      sections: [
        {
          id: '8.1',
          title: 'Descriptive Adjectives — Gender and Number Agreement',
          blocks: [
            {
              type: 'text',
              content: 'Adjectives must agree in gender and number with the noun they describe. They generally follow the noun.',
            },
            {
              type: 'rules',
              items: [
                'Adjectives ending in -o change: bueno/buena/buenos/buenas',
                "Adjectives ending in -e or consonant don't change for gender: grande, azul",
                'Adjectives of nationality do change: español/española',
              ],
            },
            {
              type: 'examples',
              examples: [
                { es: 'El coche rojo.', en: 'The red car.' },
                { es: 'La casa roja.', en: 'The red house.' },
                { es: 'Un estudiante inteligente.', en: 'An intelligent student.' },
              ],
            },
          ],
        },
        {
          id: '8.2',
          title: 'Position of Adjectives',
          blocks: [
            {
              type: 'text',
              content: 'Most adjectives follow the noun; some come before and may shorten.',
            },
            {
              type: 'rules',
              items: [
                'bueno → buen (before masc. sing.): "Es un buen estudiante."',
                'grande → gran (before any sing. noun, meaning "great"): "Es un gran hombre."',
                'malo → mal, primero → primer, tercero → tercer',
              ],
            },
          ],
        },
        {
          id: '8.3',
          title: 'Demonstrative Adjectives — Este, Ese, Aquel',
          blocks: [
            {
              type: 'text',
              content: 'Indicate distance from the speaker.',
            },
            {
              type: 'table',
              headers: ['Distance', 'Masc. sing.', 'Fem. sing.', 'Masc. pl.', 'Fem. pl.'],
              rows: [
                ['Close (this)', 'este', 'esta', 'estos', 'estas'],
                ['Mid (that)', 'ese', 'esa', 'esos', 'esas'],
                ['Far (that over there)', 'aquel', 'aquella', 'aquellos', 'aquellas'],
              ],
            },
            {
              type: 'examples',
              examples: [
                { es: 'Este libro es interesante.', en: 'This book is interesting.' },
                { es: 'Ese restaurante es bueno.', en: 'That restaurant is good.' },
                { es: 'Aquella montaña es muy alta.', en: 'That mountain over there is very tall.' },
              ],
            },
          ],
        },
        {
          id: '8.4',
          title: 'Possessive Adjectives',
          blocks: [
            {
              type: 'table',
              headers: ['Person', 'Singular', 'Plural'],
              rows: [
                ['yo', 'mi', 'mis'],
                ['tú', 'tu', 'tus'],
                ['él/ella/usted', 'su', 'sus'],
                ['nosotros', 'nuestro/nuestra', 'nuestros/nuestras'],
                ['vosotros', 'vuestro/vuestra', 'vuestros/vuestras'],
                ['ellos/ustedes', 'su', 'sus'],
              ],
            },
            {
              type: 'rules',
              items: [
                'mi/tu/su do NOT change for gender',
                'nuestro/vuestro DO change: nuestro libro / nuestra casa',
              ],
            },
            {
              type: 'examples',
              examples: [
                { es: 'Mi casa es grande.', en: 'My house is big.' },
                { es: 'Nuestra profesora es simpática.', en: 'Our teacher is nice.' },
              ],
            },
          ],
        },
        {
          id: '8.5',
          title: 'Quantifiers and Intensifiers',
          blocks: [
            {
              type: 'rules',
              items: [
                'mucho/a/os/as — much/many',
                'poco/a/os/as — little/few',
                'bastante/s — quite a lot',
                'todo/a/os/as — all/every',
                'cada — each (invariable)',
                'muy — very (before adjectives/adverbs)',
                'mucho — a lot (after verbs)',
              ],
            },
            {
              type: 'examples',
              examples: [
                { es: 'Tengo mucho trabajo.', en: 'I have a lot of work.' },
                { es: 'Esta sopa está muy buena.', en: 'This soup is very good.' },
                { es: 'Me gusta mucho la música.', en: 'I like music a lot.' },
              ],
            },
          ],
        },
        {
          id: '8.6',
          title: 'Basic Adverbs',
          blocks: [
            {
              type: 'rules',
              items: [
                'Time: hoy (today), mañana (tomorrow), ayer (yesterday), ahora (now), siempre (always), nunca (never), a veces (sometimes), luego (later), pronto (soon)',
                'Place: aquí (here), allí (there), cerca (nearby), lejos (far)',
                'Manner: bien (well), mal (badly), despacio (slowly), rápido (quickly)',
                '-mente adverbs: formed from feminine adjective + -mente: rápida → rápidamente, fácil → fácilmente',
              ],
            },
            {
              type: 'examples',
              examples: [
                { es: 'Ella siempre llega tarde.', en: 'She always arrives late.' },
                { es: 'Habla muy despacio, por favor.', en: 'Please speak very slowly.' },
              ],
            },
          ],
        },
      ],
    },
    {
      id: 8,
      title: 'Question Formation and Negation',
      sections: [
        {
          id: '9.1',
          title: 'Forming Questions',
          blocks: [
            {
              type: 'text',
              content: 'Questions use inverted question marks (¿...?). Word order is often the same as statements with rising intonation. No auxiliary verb needed (unlike English "do/does").',
            },
            {
              type: 'examples',
              examples: [
                { es: '¿Hablas español?', en: 'Do you speak Spanish?' },
                { es: '¿Tienes un bolígrafo?', en: 'Do you have a pen?' },
              ],
            },
          ],
        },
        {
          id: '9.2',
          title: 'Question Words (Interrogatives)',
          blocks: [
            {
              type: 'text',
              content: 'All question words carry a written accent mark.',
            },
            {
              type: 'table',
              headers: ['Question word', 'Meaning', 'Example'],
              rows: [
                ['¿Qué?', 'What?', '¿Qué haces?'],
                ['¿Quién? / ¿Quiénes?', 'Who?', '¿Quién es ella?'],
                ['¿Cuál? / ¿Cuáles?', 'Which? / What?', '¿Cuál es tu nombre?'],
                ['¿Dónde?', 'Where?', '¿Dónde vives?'],
                ['¿Adónde?', '(To) where?', '¿Adónde vas?'],
                ['¿Cuándo?', 'When?', '¿Cuándo es tu cumpleaños?'],
                ['¿Cómo?', 'How?', '¿Cómo estás?'],
                ['¿Por qué?', 'Why?', '¿Por qué estudias español?'],
                ['¿Cuánto/a?', 'How much?', '¿Cuánto cuesta?'],
                ['¿Cuántos/as?', 'How many?', '¿Cuántos años tienes?'],
              ],
            },
            {
              type: 'text',
              content: 'Use "qué" with nouns ("¿Qué libro lees?"), use "cuál" when choosing among options ("¿Cuál es tu dirección?")',
            },
          ],
        },
        {
          id: '9.3',
          title: 'Negation',
          blocks: [
            {
              type: 'text',
              content: 'Place "no" directly before the verb. Double negatives are correct in Spanish.',
            },
            {
              type: 'rules',
              items: [
                'no — no/not',
                'nada — nothing',
                'nadie — nobody',
                'nunca / jamás — never',
                'ningún/ninguno/ninguna — none',
                'tampoco — neither',
              ],
            },
            {
              type: 'examples',
              examples: [
                { es: 'No entiendo.', en: "I don't understand." },
                { es: 'No tengo nada.', en: 'I have nothing.' },
                { es: 'Nunca llego tarde.', en: 'I never arrive late.' },
                { es: 'A mí tampoco me gusta.', en: "I don't like it either." },
              ],
            },
          ],
        },
      ],
    },
    {
      id: 9,
      title: 'Prepositions, Numbers, and Time Expressions',
      sections: [
        {
          id: '10.1',
          title: 'Core Prepositions',
          blocks: [
            {
              type: 'table',
              headers: ['Preposition', 'Meaning', 'Example'],
              rows: [
                ['a', 'to, at', 'Voy a Madrid.'],
                ['de', 'of, from', 'Soy de España.'],
                ['en', 'in, on, at', 'Vivo en una ciudad.'],
                ['con', 'with', 'Voy con mi amigo.'],
                ['sin', 'without', 'Café sin azúcar.'],
                ['por', 'for, by, through', 'Gracias por todo.'],
                ['para', 'for (purpose/recipient)', 'Este regalo es para ti.'],
                ['sobre', 'on, about', 'El libro está sobre la mesa.'],
                ['entre', 'between', 'Está entre la farmacia y el banco.'],
                ['hasta', 'until', 'Hasta luego.'],
                ['desde', 'from, since', 'Vivo aquí desde enero.'],
                ['hacia', 'towards', 'Camina hacia el norte.'],
              ],
            },
          ],
        },
        {
          id: '10.2',
          title: 'Por vs. Para — Key Distinction',
          blocks: [
            {
              type: 'rules',
              items: [
                'Por — Duration: "Estudié por dos horas."',
                'Por — Exchange: "Lo compré por diez euros."',
                'Por — Cause/reason: "No puedo salir por el frío."',
                'Por — Movement through: "Pasamos por el parque."',
              ],
            },
            {
              type: 'rules',
              items: [
                'Para — Purpose/goal: "Estudio para aprender."',
                'Para — Recipient: "Este café es para usted."',
                'Para — Destination: "Salgo para México mañana."',
                'Para — Deadline: "Lo necesito para el lunes."',
              ],
            },
          ],
        },
        {
          id: '10.3',
          title: 'Numbers 0–100',
          blocks: [
            {
              type: 'table',
              headers: ['0–9', '10–19', '20–29', '30–100'],
              rows: [
                ['0 — cero', '10 — diez', '20 — veinte', '30 — treinta'],
                ['1 — uno', '11 — once', '21 — veintiuno', '40 — cuarenta'],
                ['2 — dos', '12 — doce', '22 — veintidós', '50 — cincuenta'],
                ['3 — tres', '13 — trece', '23 — veintitrés', '60 — sesenta'],
                ['4 — cuatro', '14 — catorce', '24 — veinticuatro', '70 — setenta'],
                ['5 — cinco', '15 — quince', '25 — veinticinco', '80 — ochenta'],
                ['6 — seis', '16 — dieciséis', '26 — veintiséis', '90 — noventa'],
                ['7 — siete', '17 — diecisiete', '27 — veintisiete', '100 — cien'],
                ['8 — ocho', '18 — dieciocho', '28 — veintiocho', ''],
                ['9 — nueve', '19 — diecinueve', '29 — veintinueve', ''],
              ],
            },
            {
              type: 'rules',
              items: [
                'From 31 onwards: treinta y uno, treinta y dos, etc.',
                '"Uno" shortens to "un" before masculine nouns: "veintiún estudiantes"',
                '"Cien" becomes "ciento" before additional numbers: "ciento uno" (101)',
              ],
            },
          ],
        },
        {
          id: '10.4',
          title: 'Ordinal Numbers (1st–10th)',
          blocks: [
            {
              type: 'table',
              headers: ['Ordinal', 'Masc.', 'Fem.'],
              rows: [
                ['1st', 'primero (primer)', 'primera'],
                ['2nd', 'segundo', 'segunda'],
                ['3rd', 'tercero (tercer)', 'tercera'],
                ['4th', 'cuarto', 'cuarta'],
                ['5th', 'quinto', 'quinta'],
                ['6th', 'sexto', 'sexta'],
                ['7th', 'séptimo', 'séptima'],
                ['8th', 'octavo', 'octava'],
                ['9th', 'noveno', 'novena'],
                ['10th', 'décimo', 'décima'],
              ],
            },
          ],
        },
        {
          id: '10.5',
          title: 'Telling the Time',
          blocks: [
            {
              type: 'rules',
              items: [
                '"¿Qué hora es?" — What time is it?',
                '"Es la una." — It is one o\'clock. (singular)',
                '"Son las dos/tres/cuatro..." — It is two/three/four...',
                '"Son las tres y media." — Half past three.',
                '"Son las cuatro y cuarto." — Quarter past four.',
                '"Son las cinco menos cuarto." — Quarter to five.',
                '"de la mañana" (a.m.) / "de la tarde" (afternoon) / "de la noche" (evening)',
              ],
            },
            {
              type: 'examples',
              examples: [
                { es: 'La clase empieza a las nueve de la mañana.', en: 'The class starts at nine in the morning.' },
              ],
            },
          ],
        },
        {
          id: '10.6',
          title: 'Days of the Week',
          blocks: [
            {
              type: 'text',
              content: 'lunes, martes, miércoles, jueves, viernes, sábado, domingo',
            },
            {
              type: 'rules',
              items: [
                'Days are lowercase and masculine',
                '"el lunes" = on Monday (single), "los lunes" = on Mondays (habitual)',
              ],
            },
          ],
        },
        {
          id: '10.7',
          title: 'Months and Dates',
          blocks: [
            {
              type: 'text',
              content: 'enero, febrero, marzo, abril, mayo, junio, julio, agosto, septiembre, octubre, noviembre, diciembre',
            },
            {
              type: 'rules',
              items: [
                'Months are lowercase',
                '"Hoy es el cinco de marzo." — Today is the fifth of March.',
                'Use cardinal numbers except "el primero" for the 1st',
              ],
            },
          ],
        },
        {
          id: '10.8',
          title: 'Common Conjunctions',
          blocks: [
            {
              type: 'table',
              headers: ['Conjunction', 'Meaning', 'Example'],
              rows: [
                ['y / e (before i-/hi-)', 'and', 'Hablo español y francés.'],
                ['o / u (before o-/ho-)', 'or', '¿Café o té?'],
                ['pero', 'but', 'Me gusta, pero es caro.'],
                ['porque', 'because', 'No puedo ir porque estoy enfermo.'],
                ['que', 'that / which', 'Creo que sí.'],
                ['si', 'if', 'Si tienes tiempo, llámame.'],
                ['cuando', 'when', 'Cuando llego a casa, como.'],
              ],
            },
          ],
        },
      ],
    },
  ],
}
