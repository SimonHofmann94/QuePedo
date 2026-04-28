# Base CEFR Vocabulary Lists

Bundled vocabulary lists for A1–C2 CEFR levels, surfaced in the app at
`/vocabulary/lists/{level}` (web) and the equivalent mobile screen.

## Source & License

The Spanish lemmas come from [doozan/spanish_data](https://github.com/doozan/spanish_data)
(CC-BY-4.0), which itself derives its frequency data from
[hermitdave/FrequencyWords](https://github.com/hermitdave/FrequencyWords)
based on OpenSubtitles. We bucket the top 7,500 content words (nouns,
verbs, adjectives, adverbs, numbers, interjections, phrases) into CEFR
levels by frequency rank:

| Level | Rank range | Approx word count |
| ----- | ---------- | ----------------- |
| A1    | 1–300      | 300               |
| A2    | 301–800    | 500               |
| B1    | 801–1800   | 1,000             |
| B2    | 1801–3200  | 1,400             |
| C1    | 3201–5000  | 1,800             |
| C2    | 5001–7500  | 2,500             |

The first slot (A1) and parts of A2 are **hand-curated** — frequency
rank alone misses important early vocabulary like color/family/day-of-week.

German translations are produced by Gemini Flash via
`scripts/build-vocab.mjs`.

## Files

- `a1.json` — 120 hand-curated essentials (greetings, family, numbers, basic verbs, days, colors)
- `a2.json` — 80 hand-curated extensions (travel, restaurant, descriptions)
- `b1.json` … `c2.json` — placeholders, fill via the script below

## Regenerating B1–C2

```bash
# from repo root
GEMINI_API_KEY=xxx node scripts/build-vocab.mjs           # all levels
GEMINI_API_KEY=xxx node scripts/build-vocab.mjs b1 b2     # only some
node scripts/build-vocab.mjs --dry-run                    # preview, no API calls
```

The script:
1. Downloads `frequency.csv` from doozan (cached at `/tmp/qp-spanish-frequency.csv`)
2. Filters out grammar particles, keeps content words
3. Buckets by frequency rank
4. Calls Gemini in batches of 50 with `responseMimeType: 'application/json'`
5. Writes `{level}.json` with the schema in `types.ts`

Cost: ~150 batches at Gemini Flash pricing → roughly $1–2 to generate
all six levels.

## Premium Gating

In the app, A1 and A2 are free (teaser); B1–C2 are premium-only. The
gate is enforced in
`web/src/app/(main)/vocabulary/lists/[level]/page.tsx` and the mobile
equivalent. Backend RLS + `subscription_tier` should mirror this for
production.

## Schema

See `types.ts`. Each `VocabWord` has:
- `es` — Spanish lemma
- `de` — German translation (German native speakers, Schweizer Hochdeutsch ist OK)
- `en` — Optional English translation
- `pos` — Part of speech (`n` `v` `adj` `adv` `pron` `prep` `conj` `num` `art` `interj` `phrase`)
- `rank` — Frequency rank in source corpus (1 = most common)
- `gender` — Optional `m` | `f` | `mf` for nouns
- `example` — Optional Spanish sentence using the word
