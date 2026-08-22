# Culture Content v2 — Spec

**Status**: approved, ready to execute · **Date**: 2026-08-22
**Audience**: (a) the research swarm filling in 21 country JSONs, (b) the frontend agent building the editorial layout, (c) whoever moves the schema.

---

## 0. Why

21 countries × ~7 KB of visibly templated content. Every country has **exactly 5 sights with ~130-character descriptions** (measured: min 97, median 131, max 170). Zero images anywhere. It reads as a database dump.

v2 fixes three things:

1. **Photos.** Real CC-licensed Wikimedia Commons images: one hero per country, one per sight.
2. **Depth over breadth.** 8–10 sights with real 2–3-sentence descriptions, plus three new sections that earn their place (food, festivals, etiquette).
3. **Mechanical floors that catch filler**, not just missing keys — `culture.check.ts` grows length minimums, image checks, and a filler-phrase blocklist.

### Non-goals (decided, do not revisit)

- Spanish (`es`) prose is **not** authored. `ct()` falls back to `en`. Author `en` + `de` only.
- No music section. Without audio it renders as a thin text list — exactly what we are eliminating. Fold one music fact into `intro` or `funFact` instead.
- No new sight metadata beyond an image (no `region`, no `openingHours`, no `ticketPrice`) — it is a learning app, not a guidebook.
- No `es` field on `CultureImage.alt`. Alt text follows the same `{en, de}` + `ct()` pattern as everything else.

---

## 1. Types and schema

### 1.1 The two hard constraints (read this before touching anything)

**Constraint A — every new field is `.optional()` in `cultureCountrySchema`.**
`web/src/lib/culture.ts` and `mobile/services/culture.ts` `safeParse` the DB row and **silently fall back to the bundled JSON on failure**. A required new field would make every already-saved admin edit vanish, with no error shown to anyone. This includes `image` *inside* the sight object — DB rows already exist with imageless sights.

**Constraint B — zod strips unknown keys.**
`adminSaveCultureCountry` parses through the schema before the RPC, so any field not in the schema is dropped on the admin's next save. Schema, CMS editor and renderers move together (§6).

**The reconciliation**: the schema stays permissive; **`culture.check.ts` enforces richness**. This is already the house pattern — schema allows `sights.min(1)`, the check requires `>= 3`. v2 just raises the check floors. Editorial requirements live in the check file, never in zod.

> A field present in the schema but with no editor UI still round-trips safely (`initial` → spread → save → zod keeps it), so the CMS can ship a minimal image UI without data loss. Schema inclusion, however, is non-negotiable.

### 1.2 `shared/content/culture/types.ts` — full proposed file

```ts
// Culture content — one file per Spanish-speaking country, consumed by the
// web world map / country pages and the mobile country grid.
//
// Localization: structured per-field {en, de} records (unlike grammar's
// file-per-locale overlay — this is data, not prose documents). `es` UI
// locale falls back to English via ct() until Spanish copy is authored.

export interface LocalizedText {
  en: string
  de: string
}

/** NEW — a CC-licensed photo from Wikimedia Commons. See spec §4. */
export interface CultureImage {
  /** Thumbnail URL on upload.wikimedia.org. Allowlisted width, no query string. */
  url: string
  /** The Commons `File:` description page — where the license lives. */
  sourcePage: string
  /** Plain-text author/photographer, HTML stripped. Rendered in the credit line. */
  author: string
  /** e.g. "CC BY-SA 4.0", "CC BY 2.0", "CC0", "Public domain". */
  license: string
  /** Pixel dimensions OF THE THUMBNAIL — next/image and RN <Image> need both. */
  width: number
  height: number
  alt: LocalizedText
}

/** Country-specific slang expression (the star content). */
export interface CultureSlang {
  /** The expression as locals say it, e.g. "¡No manches!" */
  term: string
  meaning: LocalizedText
  /** Optional Spanish example sentence using the term. */
  example?: string
}

/** Country-specific vocabulary — words that differ from "textbook" Spanish. */
export interface CultureVocab {
  es: string
  translation: LocalizedText
  /** e.g. "elsewhere: autobús" */
  note?: LocalizedText
}

export interface CultureSight {
  name: string
  description: LocalizedText
  /** WGS84 coordinates — rendered as pins on the web country map. */
  lat: number
  lng: number
  emoji: string
  /** NEW — optional in the schema, required by culture.check.ts. */
  image?: CultureImage
}

/** NEW — a dish worth ordering by name. */
export interface CultureDish {
  /** Spanish/local name as you would say it to a waiter, e.g. "el mole negro". */
  name: string
  description: LocalizedText
  image?: CultureImage
}

/** NEW — a festival a learner could actually plan a trip around. */
export interface CultureFestival {
  /** Local name, e.g. "Día de Muertos". */
  name: string
  /** Short when-string, localized: "1–2 November" / "1.–2. November". */
  when: LocalizedText
  description: LocalizedText
  image?: CultureImage
}

/** NEW — one social norm, phrased as advice. */
export interface CultureEtiquette {
  /** Short Spanish label used as the card heading, e.g. "El saludo". */
  title: string
  text: LocalizedText
}

export interface CultureCountry {
  /** ISO 3166-1 alpha-2, lowercase — route id; uppercase it for amCharts. */
  id: string
  flag: string
  name: LocalizedText
  /** Country name in Spanish, shown as flavor subtitle. */
  nameEs: string
  capital: string
  /** Display string, e.g. "130 M" */
  population: string
  /** NEW — one-line deck over the hero photo and on the country card. */
  tagline?: LocalizedText
  /** NEW — full-bleed hero photo. Landscape. */
  heroImage?: CultureImage
  intro: LocalizedText
  funFact: LocalizedText
  slang: CultureSlang[]
  vocabulary: CultureVocab[]
  sights: CultureSight[]
  /** NEW */
  food?: CultureDish[]
  /** NEW */
  festivals?: CultureFestival[]
  /** NEW */
  etiquette?: CultureEtiquette[]
}

/** Resolve a localized field for the active app locale (es → en for now). */
export function ct(t: LocalizedText, locale?: string): string {
  return (locale === "de" ? t.de : t.en) || t.en
}
```

**Six new field slots total**: `tagline`, `heroImage`, `sight.image`, `food`, `festivals`, `etiquette`. All optional. Nothing existing changes shape.

> Judgement call: `food` and `festivals` stay two concrete arrays rather than one generic `highlights[]` with a `kind` discriminator — they render differently (photo grid vs. date-led cards) and a discriminated union makes the CMS form worse for zero gain.

> Judgement call: `tagline` is added even though it is "just more text" — the editorial hero needs a deck under the big country name, and the country grid card needs something better than a slang teaser. One line, high visibility, cheap.

### 1.3 `shared/content/culture/schema.ts` — full proposed file

```ts
// Zod schema for culture content — the server-side write gate for the CMS.
// Mirrors types.ts exactly; keep both in sync (schema validates, interfaces
// type the bundled JSON and the app code).
//
// EVERY v2 FIELD IS .optional() ON PURPOSE. This schema also parses rows that
// admins saved before v2 existed; a required new field would make those rows
// fail safeParse in lib/culture.ts + services/culture.ts, which silently fall
// back to the bundled JSON — i.e. the admin's edits vanish with no error.
// Editorial floors (sight counts, image presence, lengths) live in
// culture.check.ts, which runs over the bundled JSON only.
import { z } from 'zod'

const localizedText = z.object({
  en: z.string().trim().min(1),
  de: z.string().trim().min(1),
})

// NEW. Deliberately loose: host/width/license correctness is enforced by
// culture.check.ts for bundled content. Here we only stop obvious garbage,
// because an admin fixing a typo must never be blocked from saving.
const cultureImage = z.object({
  url: z.string().url().startsWith('https://upload.wikimedia.org/wikipedia/commons/'),
  sourcePage: z.string().url().startsWith('https://commons.wikimedia.org/wiki/File:'),
  author: z.string().trim().min(1),
  license: z.string().trim().min(1),
  width: z.number().int().positive(),
  height: z.number().int().positive(),
  alt: localizedText,
})

export const cultureCountrySchema = z.object({
  id: z.string().regex(/^[a-z]{2}$/),
  flag: z.string().trim().min(1),
  name: localizedText,
  nameEs: z.string().trim().min(1),
  capital: z.string().trim().min(1),
  population: z.string().trim().min(1),
  tagline: localizedText.optional(),                 // NEW, optional
  heroImage: cultureImage.optional(),                // NEW, optional
  intro: localizedText,
  funFact: localizedText,
  slang: z
    .array(
      z.object({
        term: z.string().trim().min(1),
        meaning: localizedText,
        example: z.string().optional(),
      }),
    )
    .min(1),
  vocabulary: z
    .array(
      z.object({
        es: z.string().trim().min(1),
        translation: localizedText,
        note: localizedText.optional(),
      }),
    )
    .min(1),
  sights: z
    .array(
      z.object({
        name: z.string().trim().min(1),
        description: localizedText,
        lat: z.number().min(-90).max(90),
        lng: z.number().min(-180).max(180),
        emoji: z.string().trim().min(1),
        image: cultureImage.optional(),              // NEW, optional
      }),
    )
    .min(1),
  food: z                                            // NEW, optional
    .array(
      z.object({
        name: z.string().trim().min(1),
        description: localizedText,
        image: cultureImage.optional(),
      }),
    )
    .optional(),
  festivals: z                                       // NEW, optional
    .array(
      z.object({
        name: z.string().trim().min(1),
        when: localizedText,
        description: localizedText,
        image: cultureImage.optional(),
      }),
    )
    .optional(),
  etiquette: z                                       // NEW, optional
    .array(
      z.object({
        title: z.string().trim().min(1),
        text: localizedText,
      }),
    )
    .optional(),
})

export type CultureCountryInput = z.infer<typeof cultureCountrySchema>
```

### 1.4 Size budget

A fully-populated country lands at **~30–40 KB** of JSON (9 sights × ~1.3 KB, 5 dishes × ~0.9 KB, 3 festivals × ~1 KB, 6 etiquette × ~0.4 KB, slang/vocab ~6 KB, hero + intro ~2.5 KB). The RPC caps at **256 KB**. Six-fold headroom — do not re-derive this. Image URLs only; **base64 data URIs are forbidden** and would blow the cap immediately.

---

## 2. What each country needs

### 2.1 Section inventory and counts

| Section | Field | Count | Images |
|---|---|---|---|
| Deck | `tagline` | 1 | — |
| Hero | `heroImage` | 1 | **required**, landscape |
| Portrait | `intro` | 1 | — |
| Fun fact | `funFact` | 1 | — |
| Slang | `slang` | **6–10** (target 8) | — |
| Local words | `vocabulary` | **7–10** (target 8) | — |
| Places | `sights` | **8–10** (target 9) | **required on every sight** |
| Food | `food` | **4–6** (target 5) | encouraged, ≥2 per country |
| Festivals | `festivals` | **2–3** | encouraged |
| Etiquette | `etiquette` | **4–6** | none (text cards) |

### 2.2 Per-field character budgets

Budgets are for **`en`**. Write `de` as a real translation, not a gloss — German runs ~4 % longer in the current corpus (median ratio 1.04, max 1.10), so **`de` must land within 0.75×–1.35× the `en` length**. Anything outside that band is a placeholder or a truncation and the check will fail it.

| Field | Min | Max | Notes |
|---|---:|---:|---|
| `tagline.{en,de}` | 45 | 120 | One clause. No verb required. Sits over the hero. |
| `intro.{en,de}` | 400 | 750 | 3–5 sentences. Expanded from today's ~445 median. |
| `funFact.{en,de}` | 120 | 260 | One surprising, checkable fact. Unchanged in spirit. |
| `sight.description.{en,de}` | 200 | 420 | **Expanded from ~130.** 2–3 sentences. |
| `dish.description.{en,de}` | 130 | 320 | What it is, what it tastes of, when it is eaten. |
| `festival.when.{en,de}` | 5 | 45 | "1–2 November", "the week before Easter". |
| `festival.description.{en,de}` | 150 | 320 | What actually happens, concretely. |
| `etiquette.text.{en,de}` | 80 | 200 | One norm, phrased as advice to a visitor. |
| `etiquette.title` | 3 | 28 | Short Spanish label: "El saludo", "La propina". |
| `image.alt.{en,de}` | 20 | 140 | Describes the photo, not the place. See §4.6. |
| `slang.meaning.{en,de}` | 20 | 180 | Unchanged. |
| `vocab.translation.{en,de}` | 3 | 120 | Unchanged. |
| `vocab.note.{en,de}` | 10 | 140 | Unchanged. |

### 2.3 What goes in each section

**`tagline`** — the single most specific true thing about the country, compressed. Not a slogan. `en: "Two official languages, and 90 % of the country speaks the indigenous one."`

**`intro`** — expanded from today. Must contain: (1) what makes *this* country's Spanish distinctive, (2) one concrete cultural anchor a learner has heard of, (3) one thing they have not. This is where a music fact goes if you have one.

**`sights`** — 8–10, and **geographically spread**: do not stack all nine in the capital. Aim for at least four distinct regions; the amCharts country map renders them as pins and a clustered map looks broken. Mix registers deliberately: ruins/nature/city/one weird one. The "one weird one" is the most memorable card on the page — a specific market, a cable car, a cemetery, a lake with a story.

**Photo availability is a selection criterion.** A sight or dish with no acceptable Commons photo (§4.1) gets swapped for one that has one. Check the photo before you write 300 characters about the place — this is the order of operations, not a fallback.

**`food`** — 4–6 dishes named the way you would order them (`"el mole negro"`, `"la chipa"`). Include at least one street food and one thing people drink. Photograph what photographs: a dish with an image beats a dish without.

**`festivals`** — 2–3 only. A festival card without a date is a paragraph; with a date it is a plan. Prefer festivals that are locally significant over ones that are internationally famous *if you must choose*, but do not skip the famous one to seem clever.

**`etiquette`** — 4–6 norms that would actually change a visitor's behaviour, especially language-adjacent ones: `tú`/`usted`/`vos` boundaries, greeting-kiss rules, tipping, punctuality, taboo gestures, whether to bargain. This is the section a learner screenshots.

**Cut and why**: music (no audio → thin list), history timelines (Wikipedia does it better), "practical info" / visas / currency (goes stale, wrong app).

---

## 3. Editorial voice guide

The UI chrome is playful Mexican Spanish (`¡Dale!`, `Cocinando…`, `¡Órale!`). **The culture prose is not.** It is warm, specific, and concrete — the register of a friend who has actually been there, in English and German. Ban the travel-brochure voice entirely.

### Rules

1. **One concrete noun beats three adjectives.** "5,000 wooden dolls" > "a fascinating collection".
2. **A number, a name, or a sensory detail in every description.** If you cannot name anything, you do not know enough about the place — research more or pick a different sight.
3. **No filler phrases.** Blocked mechanically in §7: *vibrant, bustling, picturesque, breathtaking, nestled, hidden gem, must-see, rich history, something for everyone, a feast for the senses, jewel/pearl of…*; DE: *pulsierend, malerisch, atemberaubend, eingebettet, Geheimtipp, Muss/ein Muss, reiche Geschichte, hat für jeden etwas zu bieten, Perle*.
4. **No second person imperative tourism** ("visit the…", "don't miss the…"). Describe; the reader decides.
5. **Present tense, active voice.** Say what is there now.
6. **German is translated, not transliterated.** Idioms become German idioms. Keep the local Spanish proper nouns in Spanish in both languages.
7. **Length is a floor, not a target.** Hitting 200 characters with nothing in them fails the spirit and, usually, the filler blocklist too.

### Examples

**Example 1 — Salar de Uyuni, Bolivia**

❌ Bad (en): *"The world-famous salt flats are a breathtaking natural wonder and a must-see highlight of any trip to Bolivia, offering visitors truly unforgettable views."*
Why: zero facts. Every clause is an opinion. Would fail the filler blocklist three times over.

✅ Good (en): *"Ten thousand square kilometres of salt crust, flat to within a metre across its whole width — NASA uses it to calibrate satellites. In the rainy months a few centimetres of water turn the whole thing into a mirror, and the horizon stops existing. The hotels at the edge are built from salt blocks, floor included."*
(377 chars)

✅ Good (de): *„Zehntausend Quadratkilometer Salzkruste, über die gesamte Breite auf einen Meter genau eben — die NASA kalibriert damit ihre Satelliten. In der Regenzeit stehen ein paar Zentimeter Wasser darauf, alles wird zum Spiegel, und der Horizont verschwindet einfach. Die Hotels am Rand sind aus Salzblöcken gebaut, den Fußboden eingeschlossen."*
(334 chars — within 0.75×–1.35× of the English)

**Example 2 — Isla de las Muñecas, Mexico**

❌ Bad (de): *„Diese einzigartige Insel ist ein echter Geheimtipp und bietet Besuchern ein unvergessliches Erlebnis abseits der ausgetretenen Pfade."*
Why: „Geheimtipp", „unvergesslich", „abseits der ausgetretenen Pfade" — three brochure phrases and not one fact. The reader learns nothing they could repeat.

✅ Good (en): *"A chinampa island in the canals of Xochimilco, hung with hundreds of weathered dolls. The caretaker, Julián Santana, started nailing them to the trees in the 1950s after a girl drowned nearby; he kept going for fifty years. He drowned in the same canal in 2001. You reach it only by trajinera, about two hours from the docks."*
(322 chars)

✅ Good (de): *„Eine Chinampa-Insel in den Kanälen von Xochimilco, behängt mit Hunderten verwitterter Puppen. Der Hüter Julián Santana begann in den 1950ern damit, sie an die Bäume zu nageln, nachdem in der Nähe ein Mädchen ertrunken war — fünfzig Jahre lang. 2001 ertrank er im selben Kanal. Erreichbar nur per Trajinera, etwa zwei Stunden ab den Anlegern."*
(340 chars)

**Example 3 — a dish (`food`), Paraguay**

❌ Bad (en): *"Chipa is a traditional Paraguayan snack that is loved by locals and visitors alike and can be found throughout the country."*
Why: "traditional", "loved by locals and visitors alike", "throughout the country" — says nothing about what it *is*. You could swap the noun for any food in any country.

✅ Good (en): *"A chewy ring of cassava starch and salty Paraguay cheese, baked until the outside cracks. Chiperas board the long-distance buses with baskets of them still warm, calling 'chipa, chipa' down the aisle — it is the country's Holy Week food, but it is sold every single day."*
(268 chars)

✅ Good (de): *„Ein zäher Ring aus Maniokstärke und salzigem Paraguay-Käse, gebacken bis die Kruste aufreißt. Chiperas steigen mit noch warmen Körben in die Überlandbusse und rufen „chipa, chipa" durch den Gang — offiziell ein Karwochen-Gebäck, tatsächlich gibt es sie jeden Tag."*
(261 chars)

---

## 4. Image sourcing rules

### 4.1 Source and licenses

**Only Wikimedia Commons.** Only these licenses, exactly as `LicenseShortName` reports them:

| Accepted | Rejected — do not record, do not "just this once" |
|---|---|
| `CC0` | anything containing **NC** (NonCommercial) |
| `Public domain` (any PD tag) | anything containing **ND** (NoDerivatives) |
| `CC BY 1.0` … `CC BY 4.0` | **fair use / non-free** of any kind |
| `CC BY-SA 1.0` … `CC BY-SA 4.0` | **GFDL-only** (GFDL *dual-licensed with* a CC BY/BY-SA is fine — record the CC one) |
| | files with an open deletion request or "no permission since" tag |

**Host is the non-free filter.** Non-free files live under `upload.wikimedia.org/wikipedia/**en**/…`. Commons free files live under `upload.wikimedia.org/wikipedia/**commons**/…`. Requiring the `commons` path (enforced in §7) mechanically excludes fair-use uploads. Never hand-edit `/en/` into `/commons/`.

**File types**: `image/jpeg` and `image/png` only. No `.svg` (renders as `…svg.png`; these are flags and diagrams, not photographs), no `.tif`, no `.pdf`, no `.webp`.

### 4.2 The thumbnail URL form — and the width trap

Record the **thumbnail** URL, never the original (originals run 5–15 MB):

```
https://upload.wikimedia.org/wikipedia/commons/thumb/<h1>/<h1h2>/<File_name>/<WIDTH>px-<File_name>
```

**Wikimedia enforces an allowlist of thumbnail widths.** Any other width returns **HTTP 400** (`"Use thumbnail sizes listed on https://w.wiki/GHai"`), not a resized image. Verified empirically on 2026-08-22 across multiple files:

```
 OK: 120, 250, 500, 960, 1280, 1920, 3840
400: 160 200 220 300 320 400 440 480 512 600 640 660 800 1024 1200 1360 1500 1600 1800 2048 2560 3000
```

**Use these widths:**

| Use | Width |
|---|---|
| `heroImage` | **1920** (or 1280 if the original is narrower) |
| `sight.image`, `dish.image`, `festival.image` | **960** |

Never record a width outside `{120, 250, 500, 960, 1280, 1920, 3840}`. Never record a URL that still carries a `?` query string — the API appends `?utm_source=commons.wikimedia.org&utm_campaign=imageinfo&utm_content=thumbnail`; **strip everything from `?` onward**.

Never record a thumbnail wider than the original (it upscales into mush). The API returns the original `width` — check it.

### 4.2b Field notes from the first research run (2026-08-22)

Three things bit a research agent that §4.2 did not cover:

- **When the original file is *exactly* the width you request, the API returns the
  ORIGINAL url, not a `/thumb/…/960px-` one.** It therefore fails both the thumbnail-prefix
  and width-token assertions in §7. Seen on a 960px-wide original. Fix: request a
  different allowlisted width (500), or detect the missing `/thumb/` and re-request.
- **`upload.wikimedia.org` rate-limits hard (HTTP 429) when several agents verify in
  parallel.** A batch of 18 concurrent HEAD checks failed wholesale. Use exponential
  backoff (5s × n, ~6 tries) plus a ~1.5s delay between requests; that took one agent
  from total failure to 48/48 clean.
- **`extmetadata.Artist` contains HTML entities**, not just tags — `Brian Johnson &amp;amp;
  Dane Kantner`. Strip tags *and* `html.unescape`.

**Mechanical gates do not judge photographs.** The same agent downloaded every candidate
at 250px and looked at it before writing, which caught four files that passed every check
in §7 and were still unusable: a national-park *entrance sign*, a "Río Celeste" shot that
was actually a farmhouse, a photo with a camera date-stamp burned into the corner, and a
volcano frame that was mostly an empty green hill. Look at the image.

**Known content gaps** (real, not laziness): Nicaraguan festival photos (La Purísima /
La Gritería / Palo de Mayo) are effectively unavailable on Commons — every file is small
or portrait. Darién National Park and Barro Colorado Island have no freely-licensed
photos. Panamanian dishes do not surface via search at all; browse
`Category:Cuisine of Panama` directly.

### 4.3 The prescribed method: one API call

Do not scrape Commons HTML. One `imageinfo` call returns the thumbnail URL, the description page, the author and the license together:

```bash
curl -s -A 'QuePedo-culture-research/1.0 (simon.hofmann1995@gmail.com)' \
  --get 'https://commons.wikimedia.org/w/api.php' \
  --data-urlencode 'action=query' \
  --data-urlencode 'format=json' \
  --data-urlencode 'prop=imageinfo' \
  --data-urlencode 'iiprop=url|size|mime|extmetadata' \
  --data-urlencode 'iiurlwidth=960' \
  --data-urlencode 'titles=File:Right border sun temple.jpg'
```

Field mapping:

| JSON path | → `CultureImage` |
|---|---|
| `imageinfo[0].thumburl` **with `?…` stripped** | `url` |
| `imageinfo[0].descriptionurl` (record verbatim) | `sourcePage` |
| `extmetadata.Artist.value` **with HTML tags stripped** | `author` |
| `extmetadata.LicenseShortName.value` | `license` |
| `imageinfo[0].thumbwidth` / `thumbheight` | `width` / `height` |
| `imageinfo[0].width` (original) | must be `>= ` the requested width |
| `imageinfo[0].mime` | must be `image/jpeg` or `image/png` |

`Artist` comes back as HTML (`<a href="//commons.wikimedia.org/wiki/User:Daniel_Case" …>Daniel Case</a>`). Strip tags, collapse whitespace, trim to 80 chars. If it is empty (common on PD scans), use the named creator from the file page, or `"Unknown author"` — never leave it blank.

Always send a descriptive User-Agent. Anonymous bulk requests get throttled.

### 4.4 Finding candidates

Search the File namespace, bitmaps only, and read the license before you fall in love with a photo:

```bash
curl -s -A 'QuePedo-culture-research/1.0 (simon.hofmann1995@gmail.com)' \
  --get 'https://commons.wikimedia.org/w/api.php' \
  --data-urlencode 'action=query' --data-urlencode 'format=json' \
  --data-urlencode 'generator=search' \
  --data-urlencode 'gsrsearch=filetype:bitmap Chichen Itza El Castillo pyramid' \
  --data-urlencode 'gsrnamespace=6' --data-urlencode 'gsrlimit=10' \
  --data-urlencode 'prop=imageinfo' \
  --data-urlencode 'iiprop=url|size|extmetadata' --data-urlencode 'iiurlwidth=960'
```

Also good: the `Category:` pages for the place, and the images already used on the Spanish Wikipedia article for the sight.

**Choose for the layout, not for the subject**: landscape orientation, the subject readable at card size, no watermarks, no tourist selfies, no heavy HDR. Hero images must be landscape (`width > height`) with aspect ≥ 1.3 — they run full-bleed behind a title.

### 4.5 The verification command (mandatory, every URL)

Every recorded `url` must be verified. Non-negotiable — if Wikimedia shifts the width allowlist again, this is what catches it instead of shipping 400s to users:

```bash
curl -sIL -o /dev/null -w '%{http_code} %{content_type}\n' \
  -A 'QuePedo-culture-research/1.0 (simon.hofmann1995@gmail.com)' \
  'https://upload.wikimedia.org/wikipedia/commons/thumb/b/b4/Right_border_sun_temple.jpg/1280px-Right_border_sun_temple.jpg'
# expected: 200 image/jpeg
```

Anything other than `200` plus a `image/*` content-type → the URL does not go in the JSON. Batch check a finished country file:

```bash
python3 -c '
import json,sys,urllib.request
UA={"User-Agent":"QuePedo-culture-research/1.0 (simon.hofmann1995@gmail.com)"}
d=json.load(open(sys.argv[1])); urls=[]
def walk(o):
    if isinstance(o,dict):
        if "url" in o and "sourcePage" in o: urls.append(o["url"])
        for v in o.values(): walk(v)
    elif isinstance(o,list):
        for v in o: walk(v)
walk(d)
bad=0
for u in urls:
    try:
        r=urllib.request.urlopen(urllib.request.Request(u,method="HEAD",headers=UA),timeout=30)
        ok = r.status==200 and r.headers.get("content-type","").startswith("image/")
    except Exception as e:
        ok=False; r=e
    print(("OK  " if ok else "FAIL"), u)
    bad += 0 if ok else 1
sys.exit(1 if bad else 0)
' shared/content/culture/mx.json
```

### 4.6 Alt text and attribution

**`alt`** describes **the photograph**, for a screen-reader user who cannot see it — not the place, which the surrounding prose already covers. 20–140 chars, both locales.
❌ `"Chichén Itzá is a Mayan pyramid in Yucatán"` (that is the description)
✅ `"The stepped pyramid of El Castillo seen across mown grass under a clear sky"` / `„Die Stufenpyramide El Castillo über gemähtem Rasen vor wolkenlosem Himmel"`

**Attribution must render.** CC BY and CC BY-SA require credit at the point of use — that is the entire reason `author` and `license` exist in the shape. Every displayed image carries a visible credit line:

```
{author} · {license} · Wikimedia Commons
```

rendered as a small caption or a bottom-corner overlay, mono font, `ink-400` on light / white at 70 % opacity over photos, linked to `sourcePage` (`target="_blank" rel="noopener noreferrer"`) wherever a link is possible. On mobile, the credit line is plain text under the image — no link required. Do not build a lightbox that shows the image without its credit.

---

## 5. The JSON contract

> ⚠ **The image URLs below are shape examples, not approved photos.** Two of the four
> originally used here were found to show the *wrong subject* while passing every
> mechanical gate: a "Pyramid of the Sun" file that is a bare grey slope, and a
> "Santo Domingo de Guzmán" file that is an interior doorway with tourists in it.
> Both were caught only by downloading the thumbnail and looking at it.
> **Copy the shape, source your own photos, and view every one.** A URL that passes
> license, mime, width and HTTP 200 has proven nothing about what is in the frame.

> Swarm note: agents share the session scratchpad. Namespace your working files
> (`scratchpad/<your-countries>/`) — a sibling agent overwrote a shared `commons.py`
> mid-run. And add retry/backoff to any Commons helper: `upload.wikimedia.org`
> returns 429 under parallel load and a whole batch fails silently without it.

Below is a complete, valid country file. **The `slang`, `vocabulary`, `sights`, `food`, `festivals` and `etiquette` arrays are shown abbreviated** — 2 of 8 slang, 2 of 8 vocabulary, **3 of 9 sights**, 2 of 5 dishes, 1 of 3 festivals, 2 of 5 etiquette. JSON has no comment syntax, so nothing marks the elisions inside the file: the real counts are the ones in §2.1 and §7, not the ones you can count here. All **four** image blocks (hero + 3 sights) are real and verified. **No dish here carries an image, but §7 requires `>= 2` food images per country** — do not pattern-match that omission.

Key order matters only for diff readability — match this order. Formatting: 2-space indent, one entry per line where it fits (as today's files do for `vocabulary`), UTF-8, no BOM, trailing newline.

```json
{
  "id": "mx",
  "flag": "🇲🇽",
  "name": { "en": "Mexico", "de": "Mexiko" },
  "nameEs": "México",
  "capital": "Ciudad de México",
  "population": "130 M",
  "tagline": {
    "en": "The country that gave the world its idea of Latin America — and this app its name.",
    "de": "Das Land, das der Welt ihr Bild von Lateinamerika gab — und dieser App ihren Namen."
  },
  "heroImage": {
    "url": "https://upload.wikimedia.org/wikipedia/commons/thumb/c/c3/Plaza_de_la_Constituci%C3%B3n_-_Z%C3%B3calo_de_la_Ciudad_de_M%C3%A9xico_-_6.jpg/1920px-Plaza_de_la_Constituci%C3%B3n_-_Z%C3%B3calo_de_la_Ciudad_de_M%C3%A9xico_-_6.jpg",
    "sourcePage": "https://commons.wikimedia.org/wiki/File:Plaza_de_la_Constituci%C3%B3n_-_Z%C3%B3calo_de_la_Ciudad_de_M%C3%A9xico_-_6.jpg",
    "author": "ProtoplasmaKid",
    "license": "CC BY-SA 4.0",
    "width": 1920,
    "height": 1080,
    "alt": {
      "en": "The Zócalo square in Mexico City filled with people, the Metropolitan Cathedral behind it",
      "de": "Der Zócalo in Mexiko-Stadt voller Menschen, dahinter die Metropolitan-Kathedrale"
    }
  },
  "intro": {
    "en": "Mexico is the largest Spanish-speaking country in the world — 130 million speakers, more than Spain and Argentina combined — and the home of the slang this app is named after. Mexican Spanish is playful, musical and full of double meanings: an entire conversation can be built around the single verb 'chingar'. It also carries more Nahuatl than any other variety, which is why the world says tomato, chocolate and avocado. From mariachi and street tacos to Frida Kahlo and Día de Muertos, Mexican culture has shaped how the whole planet pictures Latin America.",
    "de": "Mexiko ist das größte spanischsprachige Land der Welt — 130 Millionen Sprecher, mehr als Spanien und Argentinien zusammen — und die Heimat des Slangs, nach dem diese App benannt ist. Mexikanisches Spanisch ist verspielt, musikalisch und voller Doppeldeutigkeiten: Um das eine Verb 'chingar' lassen sich ganze Gespräche aufbauen. Es trägt außerdem mehr Nahuatl in sich als jede andere Variante — deshalb sagt die Welt Tomate, Schokolade und Avocado. Von Mariachi und Street-Tacos bis zu Frida Kahlo und dem Día de Muertos hat Mexikos Kultur geprägt, wie sich der ganze Planet Lateinamerika vorstellt."
  },
  "funFact": {
    "en": "Mexico City is sinking up to 50 cm per year — it was built on a drained lake where the Aztec capital Tenochtitlán once stood.",
    "de": "Mexiko-Stadt sinkt bis zu 50 cm pro Jahr — sie wurde auf einem trockengelegten See erbaut, wo einst die Azteken-Hauptstadt Tenochtitlán stand."
  },
  "slang": [
    {
      "term": "¿Qué onda?",
      "meaning": { "en": "What's up? — the universal Mexican greeting", "de": "Was geht? — die universelle mexikanische Begrüßung" },
      "example": "¿Qué onda, güey? ¿Vamos por unos tacos?"
    },
    {
      "term": "¡No manches!",
      "meaning": { "en": "No way! / You're kidding! (polite version of 'no mames')", "de": "Echt jetzt?! / Das gibt's nicht! (höfliche Version von 'no mames')" },
      "example": "¡No manches! ¿Ganaste la lotería?"
    }
  ],
  "vocabulary": [
    { "es": "el camión", "translation": { "en": "bus", "de": "Bus" }, "note": { "en": "elsewhere: el autobús — in Mexico 'camión' means city bus, not truck", "de": "anderswo: el autobús — in Mexiko ist 'camión' der Stadtbus, nicht der Lkw" } },
    { "es": "la chamba", "translation": { "en": "work, job", "de": "Arbeit, Job" }, "note": { "en": "elsewhere: el trabajo", "de": "anderswo: el trabajo" } }
  ],
  "sights": [
    {
      "name": "Chichén Itzá",
      "description": {
        "en": "El Castillo has 91 steps on each of its four sides; add the top platform and you get 365. Twice a year, at the equinoxes, the afternoon light throws a row of triangular shadows down the northern balustrade that resolves into a serpent sliding toward the carved stone head at the bottom. The ball court beside it carries an echo you can hear from one end to the other.",
        "de": "El Castillo hat auf jeder seiner vier Seiten 91 Stufen; mit der Plattform oben sind es 365. Zweimal im Jahr, zur Tagundnachtgleiche, wirft das Nachmittagslicht eine Reihe dreieckiger Schatten auf die Nordbalustrade, die sich zu einer Schlange fügt und auf den steinernen Schlangenkopf am Fuß zugleitet. Der Ballspielplatz daneben trägt ein Echo, das man von einem Ende zum anderen hört."
      },
      "lat": 20.6843,
      "lng": -88.5678,
      "emoji": "🐍",
      "image": {
        "url": "https://upload.wikimedia.org/wikipedia/commons/thumb/2/2b/Chichen_Itza%2C_El_Castillo_%2814180679857%29.jpg/960px-Chichen_Itza%2C_El_Castillo_%2814180679857%29.jpg",
        "sourcePage": "https://commons.wikimedia.org/wiki/File:Chichen_Itza,_El_Castillo_(14180679857).jpg",
        "author": "Arian Zwegers from Brussels, Belgium",
        "license": "CC BY 2.0",
        "width": 960,
        "height": 640,
        "alt": {
          "en": "The stepped pyramid of El Castillo on mown grass under a clear sky",
          "de": "Die Stufenpyramide El Castillo auf gemähtem Rasen unter klarem Himmel"
        }
      }
    },
    {
      "name": "Oaxaca de Juárez",
      "description": {
        "en": "The Zapotec-Mixtec capital of Mexican cooking: seven distinct moles, one of them black with burnt chilli seeds and chocolate, and mezcal distilled in villages an hour out of town. The Santo Domingo church interior is gold leaf floor to vault. At the end of October the cemeteries fill with marigolds and brass bands and nobody sleeps for three days.",
        "de": "Die zapotekisch-mixtekische Hauptstadt der mexikanischen Küche: sieben verschiedene Moles, einer davon schwarz von verbrannten Chilikernen und Schokolade, dazu Mezcal, gebrannt in Dörfern eine Stunde außerhalb. Das Innere der Kirche Santo Domingo ist vom Boden bis ins Gewölbe blattvergoldet. Ende Oktober füllen sich die Friedhöfe mit Ringelblumen und Blaskapellen, und drei Tage lang schläft niemand."
      },
      "lat": 17.0732,
      "lng": -96.7266,
      "emoji": "💀",
      "image": {
        "url": "https://upload.wikimedia.org/wikipedia/commons/thumb/8/84/Church_of_Santo_Domingo_de_Guzm%C3%A1n_%28Oaxaca%29_by_ovedc_01.jpg/960px-Church_of_Santo_Domingo_de_Guzm%C3%A1n_%28Oaxaca%29_by_ovedc_01.jpg",
        "sourcePage": "https://commons.wikimedia.org/wiki/File:Church_of_Santo_Domingo_de_Guzm%C3%A1n_(Oaxaca)_by_ovedc_01.jpg",
        "author": "Ovedc",
        "license": "CC BY-SA 4.0",
        "width": 960,
        "height": 541,
        "alt": {
          "en": "The twin-towered baroque facade of Santo Domingo church in Oaxaca",
          "de": "Die zweitürmige Barockfassade der Kirche Santo Domingo in Oaxaca"
        }
      }
    },
    {
      "name": "Teotihuacán",
      "description": {
        "en": "Nobody knows what its builders called themselves — 'Teotihuacán', city of the gods, is the name the Aztecs gave the ruins they found abandoned centuries later. At its height around 400 CE it held 125,000 people, making it one of the largest cities on Earth. The Avenue of the Dead runs two kilometres between the pyramids of the Sun and the Moon.",
        "de": "Niemand weiß, wie sich die Erbauer selbst nannten — 'Teotihuacán', Stadt der Götter, ist der Name, den die Azteken den Ruinen gaben, die sie Jahrhunderte später verlassen vorfanden. Auf ihrem Höhepunkt um 400 n. Chr. lebten hier 125.000 Menschen, eine der größten Städte der Erde. Die Straße der Toten läuft zwei Kilometer zwischen Sonnen- und Mondpyramide."
      },
      "lat": 19.6925,
      "lng": -98.8438,
      "emoji": "🛕",
      "image": {
        "url": "https://upload.wikimedia.org/wikipedia/commons/thumb/b/b4/Right_border_sun_temple.jpg/960px-Right_border_sun_temple.jpg",
        "sourcePage": "https://commons.wikimedia.org/wiki/File:Right_border_sun_temple.jpg",
        "author": "Cvmontuy",
        "license": "CC BY-SA 4.0",
        "width": 960,
        "height": 613,
        "alt": {
          "en": "The Pyramid of the Sun rising above dry scrub at Teotihuacán",
          "de": "Die Sonnenpyramide über trockenem Buschland in Teotihuacán"
        }
      }
    }
  ],
  "food": [
    {
      "name": "el mole negro",
      "description": {
        "en": "Oaxaca's darkest mole: chilhuacle chillies burnt almost to charcoal, plus sesame, plantain, spices and a little chocolate, ground down over hours into a sauce the colour of wet earth. It tastes smoky and barely sweet, never like chocolate. Served over turkey at weddings and funerals both.",
        "de": "Oaxacas dunkelster Mole: Chilhuacle-Chilis, fast zu Kohle geröstet, dazu Sesam, Kochbanane, Gewürze und etwas Schokolade, über Stunden zu einer Sauce von der Farbe nasser Erde vermahlen. Er schmeckt rauchig und kaum süß, nie nach Schokolade. Serviert wird er über Truthahn — auf Hochzeiten wie auf Beerdigungen."
      }
    },
    {
      "name": "el elote",
      "description": {
        "en": "Corn on the cob from a pushcart, rolled in mayonnaise, crumbled cotija, chilli powder and lime. Ask for it 'en vaso' and the vendor cuts the kernels into a plastic cup so you can eat it walking. The cart's steam whistle is the sound of a Mexican evening.",
        "de": "Maiskolben vom Handkarren, gewälzt in Mayonnaise, zerbröseltem Cotija, Chilipulver und Limette. Bestell ihn 'en vaso', dann schneidet der Verkäufer die Körner in einen Plastikbecher, damit du im Gehen essen kannst. Die Dampfpfeife des Karrens ist der Klang eines mexikanischen Abends."
      }
    }
  ],
  "festivals": [
    {
      "name": "Día de Muertos",
      "when": { "en": "1–2 November", "de": "1.–2. November" },
      "description": {
        "en": "Families build ofrendas — tiered altars with photographs, marigolds, salt, water and the dead person's favourite food and drink — then sit with them in the cemetery overnight. It is loud, not solemn: brass bands, card games, children eating sugar skulls with their own names iced on the forehead.",
        "de": "Familien bauen Ofrendas — mehrstöckige Altäre mit Fotos, Ringelblumen, Salz, Wasser und dem Lieblingsessen der Verstorbenen — und sitzen die Nacht über bei ihnen auf dem Friedhof. Es ist laut, nicht feierlich: Blaskapellen, Kartenspiele, Kinder, die Zuckerschädel mit dem eigenen Namen auf der Stirn essen."
      }
    }
  ],
  "etiquette": [
    {
      "title": "El saludo",
      "text": {
        "en": "One kiss on the right cheek between women, and between a woman and a man; men shake hands or half-hug. Skipping it and just saying hello reads as cold, even at work.",
        "de": "Ein Kuss auf die rechte Wange zwischen Frauen und zwischen Frau und Mann; Männer geben die Hand oder umarmen sich halb. Es einfach zu überspringen und nur Hallo zu sagen, wirkt kalt — auch im Büro."
      }
    },
    {
      "title": "Ahorita",
      "text": {
        "en": "'Ahorita' means right now, in an hour, or never, and the difference is carried entirely by tone. If you need a time, ask for a number — nobody will be offended.",
        "de": "'Ahorita' heißt sofort, in einer Stunde oder nie, und den Unterschied trägt allein der Tonfall. Wenn du eine Zeit brauchst, frag nach einer Uhrzeit — das nimmt niemand übel."
      }
    }
  ]
}
```

### Research agent checklist (per country)

1. Read the existing `shared/content/culture/<id>.json` — keep what is good, especially `slang` and `vocabulary`, which are already strong.
2. Write `tagline`; expand `intro` to 400–750 chars.
3. Get to **8–10 sights**, spread across ≥4 regions, each 200–420 chars. Rewrite the existing five; do not just append four.
4. Source and **verify** one image per sight + one hero (§4.5).
5. Add 4–6 dishes, 2–3 festivals, 4–6 etiquette entries.
6. Write `de` for everything, 0.75×–1.35× the `en` length.
7. Run `npx tsx shared/content/culture/culture.check.ts` and the batch URL check (§4.5). Both green or the country is not done. The check validates **your** country at full v2 strictness as soon as it has a `tagline` (§7 migration gate); countries still on v1 keep the old floors, so a green run does not mean everyone else is finished — and you must not touch their files.

---

## 6. Sync points — 6 places, plus 1 build prerequisite

A schema change that misses any of these either drops data silently or crashes a renderer.

**0. `web/next.config.ts` — build prerequisite, do this first.**
There is currently **no `images` block at all**. `next/image` hard-fails on an unconfigured remote host. Add:
```ts
images: {
  remotePatterns: [{ protocol: "https", hostname: "upload.wikimedia.org", pathname: "/wikipedia/commons/**" }],
},
```
Scoping `pathname` to `/wikipedia/commons/**` keeps the non-free `/wikipedia/en/**` tree unservable through the optimizer — the same guard as §4.1, enforced at the CDN layer.

**1. `shared/content/culture/types.ts`** — add `CultureImage`, `CultureDish`, `CultureFestival`, `CultureEtiquette`; add the six optional fields. Full file in §1.2. `ct()` is unchanged.

**2. `shared/content/culture/schema.ts`** — mirror it, **every new field `.optional()`**. Full file in §1.3. This is the file where a mistake destroys user data; review it twice.

**3. `shared/content/culture/culture.check.ts`** — the new floors. Full spec in §7. Runs over bundled JSON only, so it can be strict where zod cannot.

**4. The 21 JSONs** in `shared/content/culture/` — `ar bo cl co cr cu do ec es gq gt hn mx ni pa pe pr py sv uy ve`. The swarm's output. `index.ts` needs **no change** (it imports by filename and casts). `EXPECTED_IDS` in the check file already lists all 21.

**5. `web/src/app/(main)/admin/culture/[id]/CultureEditor.tsx`** — three things:
   - Add `Section` blocks for tagline, hero image, food, festivals, etiquette, and image sub-fields inside each sight row. A compact image editor (url / author / license / sourcePage / width / height / alt EN / alt DE) is enough — admins fix typos here, they do not source photos here.
   - **Extend `normalize()`.** It currently drops empty optionals only for `slang.example` and `vocab.note`. An image object whose fields the admin blanked out will fail zod's `min(1)`/`.url()` and the save errors out with a cryptic path. `normalize()` must drop an `image` whose `url` is empty, drop `tagline` if both locales are blank, and drop `food`/`festivals`/`etiquette` if empty arrays.
   - Fields in the schema but *without* UI still round-trip safely (`initial` → spread → save), so a partial editor is acceptable; a missing **schema** entry is not.

**6. Renderers — web and mobile.**
   - **Web**: `web/src/app/(main)/culture/[id]/page.tsx` (flatten and pass the new sections), `CountryTabs.tsx` (→ becomes the editorial section rail, see §8), `culture/page.tsx` + `CultureExplorer.tsx` (country cards gain `heroImage` + `tagline`). Keep the existing convention: **the server flattens `ct()` and components receive plain strings** — pass images as `{ url, width, height, author, license, sourcePage, alt: ct(img.alt, locale) }`.
   - **Mobile**: `mobile/app/(tabs)/culture/[id].tsx` and `index.tsx`. `expo-image` is **not** installed — use plain RN `<Image source={{ uri }} style={{ width: '100%', aspectRatio: w/h }} resizeMode="cover" />`. Do not add a dependency for this. Mobile calls `ct()` inline at render time (its existing pattern) — keep that.
   - Every image render site carries the credit line from §4.6.

**Deliberately NOT touched**: `web/src/lib/culture.ts`, `mobile/services/culture.ts`, `shared/content/culture/index.ts`, `supabase/migrations/*`. They are shape-agnostic (`safeParse` + fallback) and correct as-is. No migration is needed — `culture_content.content` is `jsonb`.

---

## 7. `culture.check.ts` — proposed floors

Add to the existing loop. All floors apply to **bundled JSON only** (the DB override path stays permissive by design). Keep using `node:assert` and the existing `${w}` message style — no test framework.

### Counts
| Assertion | Value |
|---|---|
| `sights.length` | `>= 8 && <= 10` (was `>= 3`) |
| `slang.length` | `>= 6` (was `>= 5`) |
| `vocabulary.length` | `>= 7` (was `>= 5`) |
| `food.length` | `>= 4 && <= 6` |
| `festivals.length` | `>= 2 && <= 3` |
| `etiquette.length` | `>= 4 && <= 6` |

### Presence
- `tagline` present, both locales non-empty.
- `heroImage` present.
- **Every** `sights[i].image` present.
- `>= 2` of `food[i].image` present per country.
- Sights spread: `>= 4` distinct **0.5°-rounded** `(lat, lng)` buckets — catches nine pins stacked on the capital. 0.5° not 1°: Puerto Rico spans ~0.6° × ~1.6° and a 1° grid would make the floor unreachable there by anything but luck (8 realistic PR sights give 5 buckets at 0.5°).

### Lengths
Assert both `en` and `de` against the §2.2 table, and additionally `0.75 <= de.length / en.length <= 1.35` on every `LocalizedText` longer than 60 chars. Write one helper:
```ts
function assertLen(t: LocalizedText, min: number, max: number, where: string) {
  assertText(t, where)
  for (const [loc, s] of Object.entries(t) as ['en' | 'de', string][]) {
    assert.ok(s.length >= min, `${where}.${loc}: ${s.length} chars, need >= ${min}`)
    assert.ok(s.length <= max, `${where}.${loc}: ${s.length} chars, need <= ${max}`)
  }
  if (t.en.length > 60) {
    const r = t.de.length / t.en.length
    assert.ok(r >= 0.75 && r <= 1.35, `${where}: de/en length ratio ${r.toFixed(2)} — de looks like a placeholder or a truncation`)
  }
}
```

### Images
For every `CultureImage` anywhere in the tree:
- `url` starts with `https://upload.wikimedia.org/wikipedia/commons/thumb/` — this is the non-free filter (§4.1).
- `url` has **no** `?` — the API's `utm_*` query must be stripped.
- `url` matches `/\/(120|250|500|960|1280|1920|3840)px-/` — the verified width allowlist; any other width is HTTP 400.
- `url` ends `.jpg`, `.jpeg` or `.png` (case-insensitive).
- `sourcePage` starts with `https://commons.wikimedia.org/wiki/File:`.
- `author.trim().length >= 2` and `license.trim().length >= 2` — attribution is a license obligation, not a nicety.
- `license` matches `/^(CC0|Public domain|CC BY(-SA)? [1-4]\.\d)$/i` — rejects NC, ND, GFDL-only, fair use.
- `width > 0 && height > 0`.
- `heroImage.width > heroImage.height` and `width / height >= 1.3` — it runs full-bleed behind a title.
- `alt` 20–140 chars both locales.
- No duplicate `url` within one country.

### Filler blocklist
The point of v2. Case-insensitive, over `intro`, `tagline`, every `sight.description`, `dish.description`, `festival.description`, `etiquette.text`, in both locales:

```ts
const FILLER = [
  /\bvibrant\b/i, /\bbustling\b/i, /\bpicturesque\b/i, /\bbreathtaking\b/i,
  /\bnestled\b/i, /\bhidden gem\b/i, /\bmust[- ]see\b/i, /\brich (?:history|culture|heritage)\b/i,
  /\bsomething for everyone\b/i, /\bfeast for the senses\b/i, /\b(?:jewel|pearl|gem) of\b/i,
  /\bunforgettable\b/i, /\btruly unique\b/i, /\boff the beaten (?:path|track)\b/i,
  /\bpulsierend/i, /\bmalerisch/i, /\batemberaubend/i, /\beingebettet\b/i,
  /\bGeheimtipp\b/i, /\bein Muss\b/i, /\breiche (?:Geschichte|Kultur)\b/i,
  /\bfür jeden etwas\b/i, /\bunvergesslich/i, /\bPerle (?:des|der)\b/i,
  /\babseits der ausgetretenen Pfade\b/i,
  /\bloved by locals and (?:visitors|tourists)\b/i, /\blocals and visitors alike\b/i,
  /\bbei Einheimischen wie (?:Besuchern|Touristen)\b/i,
]
```
Fail with the matched phrase in the message so the author knows what to rewrite. **A filler hit is a rewrite, not a synonym swap** — the phrase is a symptom of having nothing concrete to say.

**The blocklist is a floor, not a ceiling.** It catches phrases, not vacuousness. The third ❌ Bad example in §3 (*"Chipa is a traditional Paraguayan snack that is loved by locals and visitors alike…"*) originally passed all 25 regexes and is still worthless copy — you could swap the noun for any food in any country and the sentence survives. **That swap test is the real bar**: if your sentence stays true with the proper nouns replaced, it says nothing. No regex enforces that; §3 does, and you do.

### Migration gate — read before you edit this file

`culture.check.ts` loops over **all 21 countries**, but the swarm lands them one at a time. If the v2 floors applied unconditionally, the first 20 agents to finish could never see a green check — and a cold-executing agent would either conclude its own work failed or start "fixing" other countries. So the floors are **marker-gated on `tagline`**, which only v2 countries have:

```ts
const isV2 = c.tagline !== undefined
if (isV2) {
  // all v2 floors above
} else {
  // legacy v1 floors, unchanged: sights >= 3, slang >= 5, vocabulary >= 5,
  // intro.en > 120, no image or length checks
}
```

Each country tightens to v2 strictness the moment it grows a `tagline`; the check stays green at every intermediate state. **Delete the legacy branch (and the `isV2` gate) once all 21 are v2** — that deletion is the last commit of this project, not an optional cleanup.

### Escape hatch
None. If a floor is wrong, change the floor in this file and say why in the commit — do not add a per-country exemption list.

---

## 8. Layout notes for the frontend agent

Content architecture, not CSS. The 21 country cards and the country page.

**Country page** — replace the three-tab `Segment` with a **full-bleed hero + sticky section rail**. Tabs hide two thirds of the content behind a click; the whole point of v2 is that there is now enough to scroll through.

| Rail label (Spanish, app chrome voice) | Content |
|---|---|
| `Retrato` | hero photo + `tagline` overlay, flag, `nameEs`, capital/population badges, `intro`, `funFact` (maíz callout, as today) |
| `Así se habla` | `slang` (chili cards) + `vocabulary` (jade table) — unchanged styling |
| `Qué visitar` | `CountrySightsMap` + 8–10 sight cards, **photo on top**, 2-col on `sm`, 3-col on `lg` |
| `A la mesa` | `food` — photo grid where images exist, text card where they do not |
| `Fiestas` | `festivals` — date-led cards, `when` as a mono badge |
| `Buenas maneras` | `etiquette` — compact text cards, `title` as heading, no images |

Sections with no data are omitted entirely (every new field is optional — the renderer must not assume presence).

**Country grid card** (`CultureExplorer`, mobile `index.tsx`): `heroImage` at 250px or 500px width as the card top, flag + name over/under it, `tagline` clamped to two lines. Drop the slang teaser from the card — it now competes with the photo.

**Hero**: `heroImage` at 1920, `next/image` with `priority` on the country page only, `sizes="100vw"`, dark ink gradient bottom-up so the title stays legible. Credit line bottom-right at 70 % white.

**Sight cards**: image at 960, `aspectRatio: 3/2` crop, credit line as a small mono caption under the photo.

Design tokens per `shared/design/tokens.ts` and the CLAUDE.md design system — no new colors. Culture keeps its `cielo` accent for places, `chili` for slang, `jade` for vocabulary; **`maíz` for food, `rosa` for festivals, `jacaranda` for etiquette.**

---

## 9. Appendix — `commons.py`

Tested against Commons on 2026-08-22. Write it to your own scratchpad (it is **not** a repo file) and use it rather than re-deriving the license filter 21 times. It enforces §4.1 (licenses, mime), §4.2 (width allowlist, query stripping, no upscale), §4.3 (field mapping, HTML stripping) and §4.5 (HEAD verification) in one place, and prints a `CultureImage` block ready to paste — with `alt` left as `TODO` because only you can write that.

```python
#!/usr/bin/env python3
"""commons.py — find a Commons photo and emit a CultureImage JSON block.

  python3 commons.py search "Cartagena Colombia walled city"
  python3 commons.py image  "File:City walls of Cartagena 01.jpg" 960
"""
import json, re, sys, urllib.parse, urllib.request

UA = "QuePedo-culture-research/1.0 (simon.hofmann1995@gmail.com)"
API = "https://commons.wikimedia.org/w/api.php"
WIDTHS = {120, 250, 500, 960, 1280, 1920, 3840}
OK_LICENSE = re.compile(r"^(CC0|Public domain|CC BY(-SA)? [1-4]\.\d)$", re.I)

def api(**params):
    params.setdefault("format", "json"); params.setdefault("action", "query")
    req = urllib.request.Request(API + "?" + urllib.parse.urlencode(params),
                                 headers={"User-Agent": UA})
    with urllib.request.urlopen(req, timeout=30) as r:
        return json.load(r)

def strip_html(s):
    return re.sub(r"\s+", " ", re.sub(r"<[^>]+>", "", s or "")).strip()

def search(q):
    d = api(generator="search", gsrsearch=f"filetype:bitmap {q}", gsrnamespace=6,
            gsrlimit=10, prop="imageinfo", iiprop="url|size|extmetadata", iiurlwidth=960)
    for p in (d.get("query", {}).get("pages") or {}).values():
        ii = p["imageinfo"][0]; em = ii.get("extmetadata", {})
        lic = strip_html(em.get("LicenseShortName", {}).get("value", ""))
        print(f"{'OK ' if OK_LICENSE.match(lic) else 'NO '} {p['title']}")
        print(f"    {ii['width']}x{ii['height']}  {lic}  "
              f"by {strip_html(em.get('Artist', {}).get('value', ''))[:60]}")

def head(url):
    req = urllib.request.Request(url, method="HEAD", headers={"User-Agent": UA})
    try:
        with urllib.request.urlopen(req, timeout=30) as r:
            return r.status, r.headers.get("content-type", "")
    except urllib.error.HTTPError as e:
        return e.code, e.headers.get("content-type", "")

def image(title, width=960):
    width = int(width)
    assert width in WIDTHS, f"width must be one of {sorted(WIDTHS)}"
    d = api(titles=title, prop="imageinfo", iiprop="url|size|mime|extmetadata", iiurlwidth=width)
    page = list(d["query"]["pages"].values())[0]
    assert "imageinfo" in page, f"no such file: {title}"
    ii = page["imageinfo"][0]; em = ii.get("extmetadata", {})
    lic = strip_html(em.get("LicenseShortName", {}).get("value", ""))
    assert OK_LICENSE.match(lic), f"REJECT license: {lic!r}"
    assert ii["mime"] in ("image/jpeg", "image/png"), f"REJECT mime: {ii['mime']}"
    assert ii["width"] >= width, f"REJECT: original {ii['width']}px < {width}px (would upscale)"
    url = ii["thumburl"].split("?")[0]          # strip the API's utm_* query
    assert url.startswith("https://upload.wikimedia.org/wikipedia/commons/thumb/"), url
    status, ctype = head(url)
    assert status == 200 and ctype.startswith("image/"), f"REJECT: {status} {ctype}"
    print(json.dumps({
        "url": url,
        "sourcePage": ii["descriptionurl"],
        "author": (strip_html(em.get("Artist", {}).get("value", "")) or "Unknown author")[:80],
        "license": lic,
        "width": ii["thumbwidth"],
        "height": ii["thumbheight"],
        "alt": {"en": "TODO", "de": "TODO"},
    }, ensure_ascii=False, indent=2))

if __name__ == "__main__":
    cmd, *rest = sys.argv[1:]
    (search if cmd == "search" else image)(*rest)
```

Every assertion is a rejection you must respect. If a photo you love fails the license test, find another photo — there is no override.
