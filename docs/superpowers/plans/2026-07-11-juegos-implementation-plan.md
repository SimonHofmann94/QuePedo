# Implementation Plan: Juegos — Snackable Language Games

**Date:** 2026-07-11
**Spec:** `docs/superpowers/specs/2026-07-11-juegos-games-design.md`
**Status:** Pending user confirmation

## Requirements (restatement)

Three solo, replayable, 2–3 minute arcade games fed by the learner's own vocabulary, on **both web and mobile**, shared-first. Games are a **retention layer**, not a learning pillar. Scope:

- **3 games**: Chili Rush (falling-word reflex, tap the right of 3 baskets), Lotería de Palabras (4×4 board, TTS-called words), Construye la Palabra (scramble tiles to spell the Spanish word).
- **Word pool**: SRS-weighted selection from the user's `user_vocabulary`, blended with curated `getVocabList(level)` when the user has too few words; locale-aware display via `getDisplayTranslation`; distractors that don't collide with the answer.
- **Rewards**: streak credit, capped daily taco payouts (full for sessions 1–3/day, half 4–6, zero after; plays unlimited), a new `games` achievement group.
- **Free tier** (overrides the current mobile `locked: !isPremium`).
- **Data**: one new `game_results` table; personal best = `max(score)`; a Zod-validated submit path that plausibility-checks, inserts, awards tacos, records activity, checks achievements.
- **3-PR rollout**: (1) shared logic + web + migration; (2) mobile; (3) achievements + polish. Each independently shippable.

### Verified facts (do not re-derive)

| Question | Answer (verified) |
| --- | --- |
| Activity type / CHECK constraint | **No such column.** `record_user_activity(p_user_id)` (RPC, no type arg); `user_activity` is `activity_date`-keyed, idempotent (one row/day). Games get streak credit by calling the existing `recordActivity()` (`web/src/actions/activity.ts`). **Spec step 3 ("extend the activity-type CHECK constraint") is stale — dropped. No activity migration.** |
| Taco storage / debit | Column `user_profiles.taco_balance`. Debit RPC `consume_taco(p_user_id)` (mobile `mobile/services/subscription.ts` → `consumeTaco`). **No credit RPC exists** → PR1 adds `award_tacos(p_user_id, p_amount)` incrementing the same column (honors "no new ledger"). |
| Nav entries | Web: `navigationItems` in `web/src/lib/navigation.ts`; label resolves via `useTranslations("nav")` against the shared catalog, auto-rendered by Sidebar + BottomNav. Mobile: hub card **already exists** in `mobile/app/(tabs)/exercises/index.tsx` (~L56–61) with empty `onPress` + `locked: !isPremium`. |
| Curated data location | `shared/content/vocab/{a1,a2,b1,b2,c1,c2}.json`, read via `getVocabList(level)` from `@chingon/shared`, typed `VocabWord = { es, de, en?, pos, rank, gender?, example?, tags? }` (FLAT). User vocab uses `translations` JSONB. wordPool normalizes both. |

### Spec reconciliations baked into this plan

1. Streak credit reuses `recordActivity()` — **no activity-type migration**.
2. Taco credit needs a **new `award_tacos` RPC** (only debit existed).
3. **Games are free** — remove `'games'` from `PREMIUM_FEATURES`; unlock the mobile tile.
4. `scoring.ts` (shared TS) owns payout + daily-cap + plausibility math; the only new DB primitives are `game_results` + `award_tacos`. Submit orchestration is a thin duplicated layer per platform (web action + mobile service), same as achievements already does.

## Architecture changes

- New shared module `shared/games/` (pure logic + types + Zod submit schema + scoring), exported through the barrel `shared/index.ts`.
- New web route group `web/src/app/(main)/games/` (hub + 3 game pages, client components) + server action `web/src/actions/games.ts`.
- New mobile screens `mobile/app/(tabs)/games/` + service `mobile/services/games.ts`; wire the existing exercises-hub tile.
- One migration: `game_results` table (RLS) + `award_tacos` function.
- Extend `shared/constants/achievements.ts` (`games` group, +6 defs), `shared/constants/subscription.ts` (drop `games` from premium), `shared/i18n/{en,de,es}.ts` (`nav.games`), and the achievements trigger union in `web/src/actions/achievements.ts`.

## Phase 1 — PR 1: Shared logic + web + migration

### 1.1 `shared/games/types.ts` (create)
Define `GameId = 'chili_rush' | 'loteria' | 'construye'`. Define `SessionWord` — the normalized shape both curated and user vocab collapse into: `{ id: string; es: string; display: string; pos?: string; srsWeight: number }` (`display` = `getDisplayTranslation(...)`, locale-resolved by the caller who passes `locale`). Define per-game config constants (`CHILI_MIN = 15`, `LOTERIA_SIZE = 16`, `CONSTRUYE_ROUNDS = 10`, speed-ramp interval = 5 catches, combo cap ×5, session limits 90 s / 16 calls / 10 rounds). Define `GameResult` payload type (mirrors the submit schema in 1.6). *Risk: Low.*

### 1.2 `shared/games/wordPool.ts` (create)
`buildSessionPool({ userWords, curatedFallback, minCount, locale }): SessionWord[]`. Normalize `userWords` (`user_vocabulary` rows: `translations` JSONB → `display` via `getDisplayTranslation(translations, locale)`, `srsWeight` from SRS state) and `curatedFallback` (`VocabWord`: `{es,de,en}` → `display` via `getDisplayTranslation({de,en}, locale)`, `srsWeight = 1`) into one `SessionWord[]`. SRS-weighted sample (due/weak words over-represented). If user pool < `minCount`, top up from curated at the user's level (A1 default). `pickDistractors(pool, correct, n)` excludes words whose `display` normalizes equal to the correct answer (reuse `normalizeAnswer` from `shared/utils/quiz.ts`). Pure — takes already-fetched arrays; **no DB calls** (fetching stays in platform code). *Deps: 1.1. Risk: Medium — two-shape normalization is the trickiest logic; SRS weighting must degrade gracefully when `user_word_progress` is empty.*

### 1.3 `shared/games/chiliRush.ts` (create)
Pure reducer. `initChiliRush(pool)` → state (3 lives, combo ×1, speed level 1, score 0, spawn queue). `onCatch(state, basketIndex)` → new state: correct tap → +score (`catches × speedLevel × combo`), combo up to ×5, speed +1 every 5 catches; wrong/miss → −1 life, combo reset to ×1. `isOver(state)` → 0 lives or elapsed ≥ 90 s (elapsed passed in by UI). Basket generator: 1 correct + 2 distractors (via `pickDistractors`). *Deps: 1.1, 1.2. Risk: Low.*

### 1.4 `shared/games/loteria.ts` (create)
`generateBoard(pool)` → 16 unique `SessionWord`s (4×4). `nextCall(state)` → next translation prompt + the Spanish word for TTS (spoken by platform code, not here). `onTap(state, cellIndex)` → correct marks cell; wrong deducts points. `detectLotería(marked)` → true when any full row/column complete (fires ¡LOTERÍA! bonus). Session = 16 calls. *Deps: 1.1, 1.2. Risk: Low.*

### 1.5 `shared/games/construye.ts` (create)
`scramble(word)` → letter-tile array **guaranteed ≠ solution** (re-shuffle until different; single-letter words are a trivial exception — mark solved). Accented chars (é, ñ, …) are their own tiles, kept as-is. `revealHint(state)` → reveals next letter, flags `hintUsed` (UI charges 1 taco via `consume_taco`). `checkComplete(assembled, target)` → strict `===` (no normalization — per spec). Score by word length + no-hint bonus per word; 10 rounds. *Deps: 1.1, 1.2. Risk: Medium — infinite-loop guard on scramble for short/repeated-letter words.*

### 1.6 `shared/games/scoring.ts` (create)
`tacoPayout(score, accuracy)` → base payout formula. `dailyCapMultiplier(sessionsToday)` → 1.0 for sessions 1–3, 0.5 for 4–6, 0 beyond. `finalTacos(score, accuracy, sessionsToday)` = `round(tacoPayout × dailyCapMultiplier)`. `isPlausible(result)` → reject `score > maxAchievable(correct, total)`, `duration_ms` outside 10 000–600 000, or `correct > total`. **Also** the Zod `gameResultSchema` lives here or in `types.ts` so both platforms validate identically. *Deps: 1.1. Risk: Medium — the cap curve and plausibility bounds are the anti-farming surface; must be exact.*

### 1.7 `shared/games/index.ts` + barrel wiring
Barrel re-exporting all of the above. Add `export * from './games'` to `shared/index.ts`. *Deps: 1.1–1.6. Risk: Low.*

### 1.8 Self-checks (create, one per non-trivial module)
- `wordPool.check.ts` — fallback blending fills to `minCount`; distractors never collide; locale resolves `display`.
- `chiliRush.check.ts` — combo caps ×5 and resets on miss; speed +1 every 5 catches; life loss; `isOver` at 0 lives.
- `loteria.check.ts` — board has exactly 16 unique words; completed row and column each trigger `detectLotería`.
- `construye.check.ts` — `scramble(word) !== word` over many trials (short + repeated-letter words); `checkComplete` exact (accented mismatch fails).
- `scoring.check.ts` — cap curve 1.0/0.5/0 at sessions 3/6/7; `isPlausible` rejects over-max score, sub-10 s / over-10 min durations, `correct > total`.

Pattern: standalone `assert`-based tsx like `shared/grammar/localeContent.check.ts`. *Risk: Low.*

### 1.9 Migration: `game_results` + `award_tacos` (create `supabase/migrations/<next>_games.sql`)
`CREATE TABLE game_results (id uuid pk default gen_random_uuid(), user_id uuid references auth.users, game_id text, score int, correct int, total int, duration_ms int, tacos_earned int, created_at timestamptz default now())`. RLS: `user_id = auth.uid()` for select/insert. Index `(user_id, game_id, created_at)`. `CREATE FUNCTION award_tacos(p_user_id uuid, p_amount int)` updating `user_profiles.taco_balance`; `SECURITY DEFINER`, `search_path` pinned. **Decision: no clamp on game payouts** (daily cap already limits farming) — document in migration comment. Use next sequential migration number; **verify `user_profiles.taco_balance` and `record_user_activity` exist in the target DB before merging** (prod schema drift warning). *Risk: High — RLS + SECURITY DEFINER + drift.*

### 1.10 `web/src/actions/games.ts` (create) — `submitGameResult`
`"use server"`. (1) `gameResultSchema.safeParse`; (2) `isPlausible` — reject if false; (3) count today's `game_results` → `finalTacos(...)`; (4) insert row; (5) `award_tacos` RPC; (6) `recordActivity()` (existing) for streak; (7) `checkAchievements({ type: 'game_completed', payload })` in try/catch (no-op until PR3). Return `{ saved, score, tacosEarned, newBest }`. `getPersonalBest(gameId)` = `max(score)` query. *Deps: 1.6, 1.9. Risk: Medium — clean failure so UI can show "score not saved" + retry.*

### 1.11 Web hub + 3 game pages (create under `web/src/app/(main)/games/`)
- `page.tsx` — hub: 3 game cards + personal bests (server component).
- `chili-rush/page.tsx`, `loteria/page.tsx`, `construye/page.tsx` — `"use client"` game screens. Each: fetch session vocab (user vocab + `getVocabList` fallback), `buildSessionPool` with `locale` from `useLocale()`, run loop/timer/animation locally, drive state through the shared reducer, on end `submitGameResult`. Lotería speaks via `window.speechSynthesis`. Construye hint calls taco debit. Design-token styling (chunky buttons, maíz accent). *Deps: 1.1–1.7, 1.10. Risk: Medium — game loops are the bulk of the effort; keep all scoring in shared reducers.*

### 1.12 Web nav entry (modify)
- `web/src/lib/navigation.ts`: add `{ titleKey: "games", href: "/games", icon: Gamepad2 }` after `exercises`.
- `shared/i18n/en.ts`, `de.ts`, `es.ts`: add `nav.games` in **all three** (en "Games", de "Spiele", es "Juegos") — `Messages = typeof en` makes a missing key fail typecheck. *Risk: Low.*

### 1.13 Free-tier flag (modify `shared/constants/subscription.ts`)
Remove `'games'` from `PREMIUM_FEATURES`. Grep for `isFeatureLocked('games')` consumers first (none found in scan; confirm). *Risk: Low.*

**PR1 verify:** `cd shared && npx tsc --noEmit` · `cd web && npx tsc --noEmit && npm run lint` · `npx tsx shared/games/*.check.ts` (each). Manual: play all 3 web games; confirm save, taco balance, streak.

## Phase 2 — PR 2: Mobile screens

### 2.1 `mobile/services/games.ts` (create)
Thin wrappers mirroring `mobile/services/subscription.ts`. `submitGameResult(payload)` re-implements the **orchestration** of 1.10 client-side: `gameResultSchema.parse` → `isPlausible` → count today's results → `finalTacos` → insert → `award_tacos` RPC → `record_user_activity` RPC → mobile achievements path. `getPersonalBest(gameId)`. All math from `scoring.ts` — **not re-implemented**. *Deps: PR1. Risk: Medium — parity with 1.10; only the ~10-line orchestration is duplicated, by design.*

### 2.2 Mobile game screens (create under `mobile/app/(tabs)/games/`)
`index.tsx` (hub) + `chili-rush.tsx`, `loteria.tsx`, `construye.tsx`. RN mirrors of 1.11. Locale via `i18n.language` → `buildSessionPool`. Lotería speaks via `expo-speech`. *Deps: PR1, 2.1. Risk: Medium — RN animation for Chili Rush is the hardest screen.*

### 2.3 Wire the existing exercises tile (modify `mobile/app/(tabs)/exercises/index.tsx`)
On the "Juegos" tile (~L56–61): `locked: !isPremium` → `locked: false`; `onPress: () => {}` → `router.push('/(tabs)/games')`. *Deps: 2.2. Risk: Low.*

**PR2 verify:** `cd mobile && npx tsc --noEmit && npm run lint`. Manual: exercises tab → Juegos → play all 3 on device/simulator; confirm save + streak/tacos against the same DB as web.

## Phase 3 — PR 3: Achievements group + polish

### 3.1 `shared/constants/achievements.ts` (modify)
Add `'games'` to `AchievementGroup` union and `GROUP_COLOR` (`games: 'maiz'`). Add 6 `def(...)` entries: `games_first_play`, `games_ten_sessions`, `games_all_three_day`, `games_chili_combo5`, `games_loteria_perfect`, `games_construye_nohints`. **Bump the length guard `ACHIEVEMENTS.length !== 19` → `!== 25`.** *Risk: Low.*

### 3.2 Achievements trigger logic (modify `web/src/actions/achievements.ts` + mobile equivalent)
Add `{ type: "game_completed"; payload?: { gameId?, combo?, perfectBoard?, noHints?, correct?, total? } }` to `TriggerContext`. `case "game_completed":` always pushes `games_first_play`; `games_chili_combo5` when `combo >= 5`; `games_loteria_perfect` when `perfectBoard`; `games_construye_nohints` when `noHints && correct === total`; counts `game_results` for `games_ten_sessions` (≥10) and distinct `game_id`s today for `games_all_three_day` (=3). Mirror on mobile. *Deps: 3.1 + PR1 trigger emission. Risk: Medium — date boundary + per-user counts.*

### 3.3 Polish (modify game screens both platforms)
Sounds (correct/wrong/¡LOTERÍA!/level-up), celebration states (¡Órale!, ¡chingón!, PapelPicado/Sunburst on personal best), "score not saved + retry" failure UI. Voice copy per `voice` tokens. *Risk: Low (additive).*

**PR3 verify:** `tsc`/lint all workspaces. Manual: trigger each of the 6 achievements; length-guard warning gone.

## Dependencies (cross-step)

- 1.1 → everything in `shared/games/`. 1.2 → 1.3/1.4/1.5. 1.6 → 1.10 + 2.1. 1.9 → 1.10, 2.1. 1.7 → all web/mobile imports.
- PR2 depends on all of PR1 merged. PR3.2 depends on 3.1 + PR1 emitting `game_completed`. 3.3 depends on PR1/PR2 screens.

## Risks & mitigations

- **wordPool two-shape normalization + SRS weighting (High-ish).** Flat curated `{es,de,en}` vs JSONB `translations` is the most likely bug. Mitigation: `wordPool.check.ts` asserts both inputs collapse correctly; SRS weighting degrades to uniform when `user_word_progress` is empty.
- **Migration / prod drift (High).** Prod schema drifts from repo (known). Mitigation: verify `user_profiles.taco_balance` + `record_user_activity` in target DB before merging 1.9; pin `search_path` + `SECURITY DEFINER`; RLS from creation.
- **Taco clamp (Medium).** Decision: no clamp on game payouts; daily cap limits farming. Documented in migration.
- **Web/mobile submit divergence (Medium).** All math in shared `scoring.ts` with self-check; the two copies only sequence RPCs.
- **Scramble infinite loop (Medium).** Cap re-shuffle attempts; 1-letter words auto-solved; covered by check.
- **Chili Rush RN animation (Medium).** All scoring in shared reducer; UI supplies elapsed time + taps only.
- **`isFeatureLocked('games')` consumers (Low).** Confirm none before 1.13.

## Estimated complexity

- **PR1**: L (6 shared modules + 5 self-checks + migration + web action + 4 web pages + nav/i18n/flag edits). Web game loops dominate.
- **PR2**: M (1 service + 3–4 RN screens + 1 tile edit); RN animation is the cost.
- **PR3**: S–M (achievements additive + polish).

## Success criteria

- [ ] All 3 games playable on web and mobile from their nav entries, fed by user vocab with curated fallback for new users.
- [ ] Results save to `game_results`; personal best (`max(score)`) shown on the hub.
- [ ] Streak credit via existing `recordActivity()`; tacos via `award_tacos` with the daily cap (full 1–3, half 4–6, zero after); plays unlimited.
- [ ] Locale-aware display everywhere (`getDisplayTranslation`).
- [ ] Games are free tier (`games` removed from premium; mobile tile unlocked).
- [ ] All 6 `games` achievements unlock from real game state; length guard bumped to 25.
- [ ] Every shared module has a passing `npx tsx …check.ts`; `tsc --noEmit` clean in `shared/`, `web/`, `mobile/`; lint clean.

## Files to create

- `shared/games/{types,wordPool,chiliRush,loteria,construye,scoring,index}.ts` + `{wordPool,chiliRush,loteria,construye,scoring}.check.ts`
- `web/src/actions/games.ts`
- `web/src/app/(main)/games/page.tsx`, `.../games/{chili-rush,loteria,construye}/page.tsx`
- `supabase/migrations/<next>_games.sql`
- `mobile/services/games.ts`
- `mobile/app/(tabs)/games/{index,chili-rush,loteria,construye}.tsx`

## Files to modify

- `shared/index.ts` (barrel: `export * from './games'`)
- `shared/constants/achievements.ts` (group + 6 defs + length guard → 25)
- `shared/constants/subscription.ts` (drop `'games'` from `PREMIUM_FEATURES`)
- `shared/i18n/{en,de,es}.ts` (`nav.games` in all three)
- `web/src/lib/navigation.ts` (games nav item)
- `web/src/actions/achievements.ts` (+ mobile achievements path) — `game_completed` trigger
- `mobile/app/(tabs)/exercises/index.tsx` (~L56–61: unlock + wire onPress)

One deliberate simplification carried from the spec: no offline result queue and no real anti-cheat (plausibility only) — add if farming/data-loss shows up in practice.
