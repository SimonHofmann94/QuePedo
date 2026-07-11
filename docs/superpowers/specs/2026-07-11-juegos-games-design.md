# Juegos — Snackable Language Games

**Date:** 2026-07-11
**Status:** Approved design, pending implementation plan
**Platforms:** Web (Next.js) + Mobile (Expo), shared-first

## Purpose

A new **Juegos** section: short (2–3 minute), replayable, solo arcade games fed by the
learner's own vocabulary. The job of the games is daily retention — the fun reason to
open the app and keep the streak alive. They are not a new learning pillar; they recycle
existing vocab/SRS data into play.

## Scope decisions

| Decision | Choice |
| --- | --- |
| Positioning | Snackable retention layer, new Juegos section |
| Social | Solo only — score + personal best. No leaderboards, no duels (later) |
| Rewards | Full integration: streak credit, taco payouts, new `games` achievement group |
| Platforms | Both from day 1; game logic in `shared/`, thin UI per platform |
| Launch size | 3 games |
| Pricing | All games free tier; taco payouts capped daily (plays unlimited) |
| Mobile nav | Hub card on the exercises tab — **no new mobile tab in v1** |

## The three games

### 1. Chili Rush (arcade reflex — vocab recognition)

- Spanish words fall from the top, one at a time; 3 baskets at the bottom show
  translations (1 correct + 2 distractors drawn from the session word pool).
- Tap the right basket before the word lands. Miss or wrong tap = lose one of 3 🌶 lives.
- Fall speed ramps every 5 catches. Combo multiplier ×1→×5 on consecutive catches;
  a miss resets it.
- Session ends at 0 lives or 90 seconds. Score = catches × speed level × combo.

### 2. Lotería de Palabras (steady rounds — listening + vocab)

- 4×4 board of 16 Spanish words from the session pool.
- Prompts are "called" one at a time: the translation as text; after each answer the
  Spanish word is spoken via platform TTS (expo-speech / Web Speech — same path as
  existing listening features).
- Tap the matching card. Wrong taps deduct points. Completing a row or column fires a
  ¡LOTERÍA! bonus.
- Session = 16 calls (~2 minutes).

### 3. Construye la Palabra (thinky — spelling/production)

- 10 rounds. Each round shows the translation; the player taps scrambled letter tiles
  to spell the Spanish word. Accented letters (é, ñ, …) are their own tiles.
- Hint (reveal next letter) costs 1 taco.
- Score by word length, with a no-hint bonus per word. Completion check: assembled
  string === target word.

## Word pool (shared across games)

`shared/games/wordPool.ts` builds each session's word set:

- **SRS-weighted selection** from the user's vocabulary — due/weak words
  (`user_word_progress`) appear more often.
- **Curated-list blending:** when the user's vocabulary is smaller than the game's
  minimum (Chili Rush ~15, Lotería 16, Construye 10), fill from curated master lists at
  the user's level (A1 default). A brand-new user can play immediately.
- **Locale-aware display:** every translation shown uses
  `getDisplayTranslation(translations, locale)` — games follow `app_locale` from day 1.
- **Distractor picker** excludes words whose translation collides with the correct
  answer.

## Architecture

Follows the established shared-first pattern (`shared/speaking/`, `shared/listening/`):

```
shared/games/
├── types.ts        # GameId ('chili_rush' | 'loteria' | 'construye'),
│                   # GameResult, per-game configs
├── wordPool.ts     # session word selection (above)
├── chiliRush.ts    # pure logic: spawn order, baskets, speed/lives/combo/score
├── loteria.ts      # board generation, call sequence, row/col detection, score
├── construye.ts    # scramble (guaranteed ≠ solution), hint, score
└── scoring.ts      # single taco-payout formula for all games + daily cap
```

Shared modules are pure functions — "given this tap, what is the new state" — testable
without a UI. Game loops, timers, and animations live in platform UI code.

- **Web:** `web/src/app/(main)/games/` — hub page + 3 game pages (client components);
  server action `web/src/actions/games.ts` → `submitGameResult()`. "Juegos" entry in
  the sidebar.
- **Mobile:** `mobile/app/(tabs)/games/` — same screens in React Native; entry via a
  hub card on the exercises tab.

## Data & backend

One new table (RLS: `user_id = auth.uid()`; index `(user_id, game_id, created_at)`):

```sql
game_results (
  id uuid primary key,
  user_id uuid references auth.users,
  game_id text,          -- 'chili_rush' | 'loteria' | 'construye'
  score integer,
  correct integer,
  total integer,
  duration_ms integer,
  tacos_earned integer,
  created_at timestamptz
)
```

Personal best = `max(score)` query — no separate stats table.

`submitGameResult()` (Zod-validated) performs, in order:

1. Plausibility check — reject impossible results (score > maximum achievable for the
   reported `correct`/`total`; `duration_ms` outside 10 s – 10 min).
2. Insert into `game_results`.
3. Record `user_activity` with a new `'game'` activity type (streak credit). The
   activity-type constraint in the existing migration must be extended.
4. Award tacos through the **existing** taco-balance mechanism (the same path other
   features debit/credit) — no new ledger.
5. Check `games` achievements (no-op until PR 3 ships the group).

### Taco payout & daily cap (`scoring.ts`)

Payout derives from score and accuracy. Anti-farming: full payout for the first 3 game
sessions per day (across all games), half for sessions 4–6, zero beyond. Plays remain
unlimited — only the payout caps.

### Achievements (new `games` group)

`shared/constants/achievements.ts` gains a `games` group (color family: `maiz` —
arcade-gold; color reuse across groups is fine):

- first game played
- 10 game sessions
- all 3 games in one day
- Chili Rush: reach combo ×5
- Lotería: perfect board (no wrong taps)
- Construye: 10/10 words with no hints

## Edge cases & failure handling

- **Small vocabulary:** curated-list blending (see Word pool) — no empty-state wall.
- **Failed submission:** games play fully client-side; if `submitGameResult()` fails,
  show "score not saved" with a retry button. No offline queue in v1.
- **Anti-cheat:** plausibility check only. Solo game, low stakes — no real anti-cheat.
- **Accents:** Construye tiles carry accented characters as-is; correctness is by string
  equality, no normalization.

## Testing

- Each shared module gets a `tsx` self-check (pattern: `shared/grammar/localeContent.check.ts`):
  scramble ≠ solution, board has 16 unique words, scoring math, combo reset, wordPool
  fallback blending, daily-cap curve.
- Platform UIs: `tsc` + lint + manual run-through on both platforms.

## Rollout

1. **PR 1:** `shared/games/` logic + web (hub, 3 games, server action, migration)
2. **PR 2:** mobile screens
3. **PR 3:** achievements group + polish (sounds, celebration states)

Each phase independently shippable.

## Out of scope (v1)

- Leaderboards, duels, any multiplayer
- El Mercado and other game concepts (candidates for v2)
- New mobile tab
- Offline result queue
- Real anti-cheat
