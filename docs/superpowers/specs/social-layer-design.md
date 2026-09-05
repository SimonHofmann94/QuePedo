<!-- Saved 2026-08-23 from the plan-phase design. Corrections vs. the draft:
     migrations renumbered 027-030 (025=admin, 026=grammar games are applied);
     the create_challenge LANGUAGE typo fixed; ban hooks point at
     auth.users.banned_until (no banned_at profile column — Workstream A
     shipped the ban via Supabase Auth). -->

# QuePedo Social Layer — Design Spec

**Status:** Approved for later implementation. No code in this commit.
**Platforms:** Web (Next.js server actions → RPC) + Mobile (Expo → RPC directly). Because mobile calls Supabase without a server hop, **every integrity rule lives in SQL** (SECURITY DEFINER RPCs), never in a server action.
**House pattern (migrations 020/022/024):** `SECURITY DEFINER SET search_path TO 'public'`, first-line guard, validation inside SQL, `REVOKE ALL ... FROM PUBLIC, anon; GRANT EXECUTE ... TO authenticated`. Tables written only through RPCs get **no** client INSERT/UPDATE/DELETE policies.
**Migration numbers:** 027–030 as written (025 = admin ban/delete, 026 = grammar games — both applied to prod). Renumber to the next free numbers at implementation time.
**UI voice:** `Amigos`, `Retos`, `Compartir`, `Avisos` (bell). Mexican Spanish per `voice`.

## 0. Decisions at a glance

| Question | Decision | Why |
|---|---|---|
| Friendship row shape | One row per pair, `requester_id`/`addressee_id`, status `pending/accepted/declined` | No two-row sync; who-asked is needed for the inbox; pair uniqueness via `LEAST/GREATEST` index |
| Blocks | Separate `user_blocks` table, **phase 1** | Every social RPC carries a block guard; retrofitting later means touching every RPC twice |
| Search | Exact username only, phase 1 | Prefix search = discoverability = abuse surface; ship when there are enough users to need it |
| Avatar | Phase 1: initials on a username-hash color (pure fn). Phase 2: Storage bucket | Uploads add a moderation surface before there is a moderator |
| `country` | Any ISO-3166-1 alpha-2 (home country) | A learner lives in DE/US/etc. The culture-21 enum applies to `travel_countries` (destinations), not home |
| Challenge word source | Curated CEFR level only; the challenger's exact term list stored on the row | "Mi cuaderno" words are private and unreplicable; stored terms survive bundle re-curation |
| Taco stakes | **No** | `taco_balance` is still client-writable (020 F1 remainder blocked); inter-user transfer = two-account farming + undermines the paywall currency |
| Notifications | In-app table, polled every 60s | No email/push infra exists; Realtime off everywhere |
| Expiry | Lazy (computed at read) | No cron, no pg_cron dependency |

---

## 1. Identity

### Columns added to `user_profiles`

| Column | Type | Rule |
|---|---|---|
| `username` | `text UNIQUE` nullable | `^[a-z0-9_]{3,20}$`, stored lowercase, reserved list, changeable once per 30 days |
| `username_changed_at` | `timestamptz` | cooldown anchor |
| `display_name` | `text` | 1–30 chars after trim; defaults to `first_name` at claim time |
| `bio` | `text` | ≤ 160 chars |
| `country` | `text` | `^[A-Z]{2}$`; app validates against full ISO list |
| `visibility` | `text NOT NULL DEFAULT 'friends'` | `public / friends / private` |
| `avatar_url` | existing, revived | Phase 1: stays NULL (initials avatar). Phase 2: public Storage URL |

`first_name`, `location`, email, `learning_goals`, tier, tacos, streak raw data: **never** leave `user_profiles` self-scope. The dashboard `email.split("@")[0]` fallback is for the self-greeting only; every cross-user read goes through the `public_profile` projection below, which has no email path.

### Visibility matrix

| Field | Self | Friend | Stranger (exact-username lookup) | Stranger, target `private` |
|---|---|---|---|---|
| `username`, `display_name`, `avatar` | yes | yes | yes | **not found** |
| `bio`, `country` | yes | yes | only if target `public` | no |
| `streak`, `active_today` | yes | yes | no | no |
| `member_since` (month) | yes | yes | only if `public` | no |
| games personal bests | yes | yes | no | no |

`private` = not findable, existing friends still see the friend card. Blocked-in-either-direction = not found, always.

### Username claim flow (existing users)

1. Every social RPC starts with `PERFORM require_username()` which raises `username required` when the caller has none. The web/mobile error map turns this into a redirect to the claim screen.
2. Claim screen lives on `/profile` ("Elige tu nombre de usuario") and as a banner on `/amigos`. Suggestion = slugified `first_name` + 3 random digits, **never** derived from email.
3. `set_username(p_username)` RPC: regex, reserved-word check (`admin, chingon, quepedo, support, soporte, ayuda, mod, null, undefined, api, root`), uniqueness (unique index makes it race-safe), cooldown.
4. Onboarding gets the username step later (phase 2); phase 1 is opt-in at first social action.

### Avatar storage (phase 2 spec)

- Bucket `avatars`, public read, `file_size_limit = 524288`, `allowed_mime_types = {image/jpeg,image/png,image/webp}`.
- Path `{auth.uid()}/avatar.{ext}`; one object per user (upsert).
- Storage policies on `storage.objects` for bucket `avatars`: SELECT `true`; INSERT/UPDATE/DELETE `(storage.foldername(name))[1] = auth.uid()::text`.
- Client resizes to 256×256 before upload (web: canvas; mobile: expo-image-manipulator). `avatar_url` = the public object URL + `?v=<updated_at epoch>` for cache busting.
- Admin: `admin_clear_avatar(p_user_id)` deletes object + nulls the column (moderation).

### Shared TS (phase 1)

```ts
// shared/social/types.ts
export const USERNAME_RE = /^[a-z0-9_]{3,20}$/
export const RESERVED_USERNAMES = ['admin','chingon','quepedo','support','soporte','ayuda','mod','null','undefined','api','root'] as const
export const VISIBILITY = ['public','friends','private'] as const
export type Visibility = (typeof VISIBILITY)[number]

export const usernameSchema = z.string().trim().toLowerCase().regex(USERNAME_RE)
  .refine((u) => !(RESERVED_USERNAMES as readonly string[]).includes(u), 'reserved')

export const publicProfileSchema = z.object({
  id: z.string().uuid(),
  username: z.string(),
  display_name: z.string(),
  avatar_url: z.string().nullable(),
  bio: z.string().nullable(),          // null when not visible to caller
  country: z.string().nullable(),      // null when not visible to caller
  member_since: z.string().nullable(), // 'YYYY-MM'
  relation: z.enum(['self','friend','pending_out','pending_in','none']),
})
export type PublicProfile = z.infer<typeof publicProfileSchema>

/** Deterministic initials avatar — same on web and mobile. */
export function avatarFallback(username: string, displayName: string) {
  let h = 0
  for (const c of username) h = (h * 31 + c.charCodeAt(0)) >>> 0
  const families = ['chili','rosa','jade','cielo','maiz','jacaranda'] as const
  return { family: families[h % families.length], initials: displayName.trim().slice(0, 2).toUpperCase() }
}
```

---

## 2. Friend graph

### Shape: one row per pair

`friendships(requester_id, addressee_id, status, created_at, responded_at)` with `status IN ('pending','accepted','declined')` and a unique index on `(LEAST(requester_id, addressee_id), GREATEST(requester_id, addressee_id))`.

- **Accept**: status → `accepted`, `responded_at = now()`.
- **Decline**: status → `declined`, row kept. Same requester cannot re-request the same person for **30 days** (`responded_at + 30d`). The declined party can request back at any time (the RPC flips requester/addressee on the existing row).
- **Unfriend**: row deleted by either side. Re-request allowed immediately (rate limits bound it).
- **Block**: separate table (below). Blocking deletes the friendship row and all pending challenges/shares/notifications between the pair.

Rejected alternative: two symmetric rows. Two writers per edge means two chances to diverge and doubled RLS reasoning for a graph that stays small.

### RLS

- `friendships` SELECT: `auth.uid() IN (requester_id, addressee_id)`. No client writes.
- `user_blocks` SELECT: `auth.uid() = blocker_id`. No client writes. The blocked party never learns they are blocked (RPCs return the same generic error as "user not found").

### Rate limits (inside RPC, count-based, no extra table)

| Action | Limit |
|---|---|
| `send_friend_request` | ≤ 20 outstanding `pending` where requester = me; ≤ 20 requests per rolling 24h (`created_at`) |
| `create_challenge` | ≤ 10 per rolling 24h; ≤ 3 pending per pair |
| `share_vocab` | ≤ 10 per rolling 24h; ≤ 100 items per share |
| `report_user` | ≤ 5 per rolling 24h |

### RPC surface

```
set_username(p_username text) → boolean
update_public_profile(p_display_name, p_bio, p_country, p_visibility) → boolean   -- self-scope
send_friend_request(p_username text) → uuid
respond_friend_request(p_friendship_id uuid, p_accept boolean) → boolean
unfriend(p_user_id uuid) → boolean
block_user(p_user_id uuid) → boolean
unblock_user(p_user_id uuid) → boolean
list_friends() → TABLE(public_profile + streak int + active_today bool)
list_friend_requests() → TABLE(friendship_id, direction 'in'|'out', public_profile, created_at)
```

---

## 3. Find users

`find_user_by_username(p_username text) → SETOF public_profile` (0 or 1 row). Exact match only, lowercase. Returns nothing when: target has no username, target `visibility = 'private'` (unless already friends), a block exists in either direction, target is banned (hook: `auth.users.banned_until` read directly inside the SECURITY DEFINER function (no profile column needed — 022's `admin_list_users` already joins `auth.users`); leave a marked `-- TODO(ban)` in the SQL). Because the function is SECURITY DEFINER, **all of these filters are in the SQL**, not RLS.

Prefix/fuzzy search, "people you may know", and contact import are explicitly later and each needs its own privacy review.

---

## 4. Async game challenges ("Supera mi puntaje")

### Flow

1. Challenger plays any game with a **curated CEFR level** source (`VocabPicker` kind `curated`). "Mi cuaderno" sessions show no challenge button.
2. On `ResultCard`, "Retar a un amigo" → pick friend → `create_challenge(p_result_id, p_addressee_id, p_level, p_pool_terms)`. SQL verifies the result row belongs to the caller and was created < 1 h ago, the pair is `accepted` friends, no block, rate limits. Stores `challenger_score` copied from `game_results`, `expires_at = now() + 7 days`. Inserts a `challenge_received` notification.
3. Addressee's inbox (`/games` hub, section "Retos", polled with the bell) shows: game, level, challenger card, **challenger's score** (it is "beat my score" — the target is visible), time left.
4. Addressee taps "Jugar" → `accept_challenge(p_id)` sets `accepted_at`, status `accepted`, returns `pool_terms`. Client resolves terms against its bundled curated list for the level (`getVocabList(level).words` matched on `es`, display via `getDisplayTranslation` in the **recipient's** locale). If resolved count < `GAME_CONFIG[game].minWords` (bundle drifted), client calls `void_challenge(p_id)` → status `expired`, notification to challenger. **No top-up from the list** — that would silently break comparability.
5. Addressee plays, `submitGameResult` inserts `game_results` as today, then `complete_challenge(p_id, p_result_id)`.
6. `complete_challenge` guard (this is the anti-retry rule, in SQL so mobile is covered): status `accepted`, `addressee_result_id IS NULL`, result belongs to caller, `game_id` matches, **and `p_result_id` is the earliest `game_results` row for `(auth.uid(), game_id)` with `created_at > accepted_at`**. Playing three times and submitting the best one fails the guard. Sets `addressee_score`, `completed_at`, status `completed`; notification `challenge_completed` to challenger.
7. Decline: `decline_challenge(p_id)` → `declined`. Expiry: `status = 'pending' AND expires_at < now()` is rendered as `expired` by the list RPC; no cron.

Premium scope: **accepting a B1+ challenge lets a free recipient play that one challenge** (the challenge page skips `VocabPicker` and the `FREE_GAME_LEVELS` gate). This is a deliberate conversion hook; the 10/day cap bounds the leak. Do not re-gate.

Comparability: same game, same level, same term set. Game-internal shuffles (Chili Rush spawn order, Lotería board layout, Construye scramble) still use `Math.random` — order differs, word set doesn't, which is fair enough for "beat my score". `// ponytail: pool_terms only; add a `seed` column + mulberry32 in shared/games if fairness complaints appear.`

### State machine

```
pending ──accept──▶ accepted ──complete──▶ completed
   │                    │
   ├──decline──▶ declined
   └──(expires_at passes, lazy)──▶ expired ◀──void (unresolvable pool)──┘
```

### What both players see

| Viewer | pending | accepted | completed | declined/expired |
|---|---|---|---|---|
| Challenger | "Esperando a @x", own score | "@x está jugando" | both scores, winner badge, "Revancha" (creates a new challenge, same level) | greyed, reason |
| Addressee | challenger card + score to beat, Jugar/Rechazar | play screen | both scores, winner badge | greyed |

Winner = higher score; tie = `draw`. Win counts are derived (`count(*) WHERE winner_id = me`), no counter column.

### Shared TS

```ts
// shared/social/challenges.ts
export const CHALLENGE_STATUS = ['pending','accepted','completed','declined','expired'] as const
export type ChallengeStatus = (typeof CHALLENGE_STATUS)[number]

export interface Challenge {
  id: string
  game_id: GameId
  level: 'A1'|'A2'|'B1'|'B2'|'C1'|'C2'
  challenger: PublicProfile
  addressee: PublicProfile
  challenger_score: number
  addressee_score: number | null
  status: ChallengeStatus           // list RPC already applied lazy expiry
  winner_id: string | null          // null = not finished or draw
  created_at: string
  expires_at: string
}

/** Resolve a stored term list against the bundled curated level, in the viewer's locale. */
export function resolveChallengePool(level: string, terms: string[], locale?: string): SessionWord[] {
  const list = getVocabList(level)?.words ?? []
  const byEs = new Map(list.map((w) => [w.es.toLowerCase(), w]))
  return terms.flatMap((t) => {
    const w = byEs.get(t.toLowerCase())
    const display = w && getDisplayTranslation(vocabWordTranslations(w), locale)
    return w && display ? [{ id: `curated:${w.es}`, es: w.es, display, pos: w.pos, srsWeight: 1 }] : []
  })
}
```

---

## 5. Vocabulary sharing

Share a tag slice of `user_vocabulary`; recipient accepts → copies land in their notebook with `source = 'shared'`. Copy, not link: the recipient owns the rows from then on; sender edits/deletions never propagate; sender account deletion leaves the recipient's notebook intact.

- `share_vocab(p_recipient_id, p_tag, p_item_ids uuid[])`: caller must own every item (`SELECT count(*) ... WHERE user_id = auth.uid() AND id = ANY(p_item_ids)` equals `array_length`), ≤ 100 items, accepted friends, no block, rate limit. Snapshots `term, translations, context_sentence, difficulty_rating, synonyms, tags` into `items jsonb` (size cap 256 KB via `pg_column_size`). Status `pending`. Notification `share_received`.
- `accept_vocab_share(p_share_id)`: recipient only, status `pending`. Inserts into `user_vocabulary` with `source = 'shared'`, `notes = 'Compartido por @<username>'`, skipping items where the recipient already has `lower(term)`. Returns `{added, skipped}`. Status `accepted`, stores `added_count`.
- `dismiss_vocab_share(p_share_id)` → `dismissed`.
- `user_vocabulary.source` CHECK is extended with `'shared'`. The web `addVocabulary(source: 'manual' | 'ai_generated')` type union gains `'shared'` for the TS type only; the copy itself is done in SQL.

Why a tag, not `vocabulary_sets`: `vocabulary_sets` has no owner and no code references; `tags text[]` is what users actually populate (AI generation fills it). Leave `vocabulary_sets` dead; do not build on it.

---

## 6. Activity / presence lite — prerequisite

Friend list shows `streak` and `active_today`. This requires `user_activity` (003) and `user_achievements` (018) to actually exist in prod, which they do not. **Migration 027 deploys them with the 020-style hardening** that 003 lacks:

- `record_user_activity(p_user_id)`: add `IF auth.uid() IS NULL OR p_user_id <> auth.uid() THEN RAISE` first line; `SET search_path TO 'public'`; `REVOKE ALL FROM PUBLIC, anon; GRANT TO authenticated`.
- `get_user_streak(p_user_id)`: keep SECURITY INVOKER (RLS makes it self-only for direct calls), pin `search_path`. Inside SECURITY DEFINER `list_friends` the nested call runs as definer and can read friends' rows — intended, and the only path that exposes a friend's streak.
- `active_today` = `EXISTS (SELECT 1 FROM user_activity WHERE user_id = f.id AND activity_date = CURRENT_DATE)`.

No "online now" indicator. That would need Realtime presence; nothing in the product needs it.

---

## 7. Notifications

`notifications(id, user_id, kind, actor_id, ref_id, read_at, created_at)`; kinds: `friend_request, friend_accepted, challenge_received, challenge_completed, challenge_voided, share_received`. Written only inside the RPCs above. Client: SELECT own; `mark_notifications_read(p_ids uuid[])` RPC (self-scope) for reads. `list_notifications(p_limit)` joins the actor's `username/display_name/avatar_url` (nothing else) so the client renders text from `kind` + actor.

Web: `NotificationBell` client component in `Sidebar` (next to the logout control), polls `list_notifications` + unread count every 60 s and on window focus; badge = unread count. Mobile: same component on the dashboard header. Friend requests and challenges also appear in their own inboxes; the bell is the aggregator.

Email (Resend) and push (expo-notifications) are explicitly later; when added, they are fan-out from this table (a DB webhook on INSERT), so nothing here changes.

---

## 8. Travel buddies — schema now, feature later

Added to `user_profiles` in 027 so no later row migration is needed:

| Column | Type | Now |
|---|---|---|
| `travel_status` | `text CHECK IN ('there','planning','just_learning')` | backfilled from `location` strings |
| `travel_countries` | `text[] NOT NULL DEFAULT '{}'` CHECK `<@` the 21 lowercase culture ids | editable on profile (phase 2), unused in matching until phase 4 |
| `travel_from`, `travel_to` | `date` | two columns, not `daterange` — trivial for PostgREST + Zod |
| `open_to_buddies` | `boolean NOT NULL DEFAULT false` | opt-in only |

Backfill: `'Ya estoy en España / LatAm' → 'there'`, `'Estoy planeando ir' → 'planning'`, `'Solo aprendiendo por gusto' → 'just_learning'`, else NULL. `location` stays (onboarding still writes it); the profile editor writes `travel_status` directly once the onboarding step is migrated.

Later RPC (signature only): `find_travel_buddies(p_country text, p_from date, p_to date, p_limit int) → SETOF public_profile` — requires caller and candidates to have `open_to_buddies`, `visibility = 'public'`, account age ≥ 14 days, onboarding completed, no blocks, no bans; overlap on `daterange(travel_from, travel_to, '[]')`.

Safety rules written now, binding on the later phase: country-level location only (never city/coords); no DMs in this spec — a messaging feature is a separate spec with its own moderation design; the only contact path is a friend request; `report_user` reason `travel_safety` routes to admin with elevated priority; minimum account age enforced in SQL, not UI; travel fields are hidden from everyone until `open_to_buddies = true`.

---

## 9. Moderation & abuse

- `user_reports(id, reporter_id, reported_id, reason, details, context_kind, context_id, status, created_at, resolved_by, resolved_at, resolution_note)`. `reason IN ('spam','harassment','impersonation','inappropriate_content','travel_safety','other')`, `details ≤ 500`, `context_kind IN ('profile','challenge','share','friend_request')`. `report_user(...)` RPC: no self-report, rate limit, one open report per (reporter, reported).
- Admin RPCs (gated `is_caller_admin()`): `admin_list_reports(p_status, p_limit, p_offset)` returning both parties' `username/display_name/email/created_at`, reason, details, context, report counts against the reported user (last 90 days); `admin_resolve_report(p_id, p_status IN ('actioned','dismissed'), p_note)`. `admin_set_username(p_user_id, p_username)` for impersonation takedowns; `admin_set_visibility(p_user_id, 'private')` as a soft quarantine.
- Admin panel: new "Reportes" tab at `/admin/reports` with an open-reports badge in the admin nav. Row actions: ver perfil, marcar resuelto, and a **hook button "Suspender"** that calls the ban RPC from the parallel admin workstream — `admin_resolve_report` does not depend on it; wire it when that RPC lands (`-- TODO(ban)` markers in SQL show where banned users must be filtered: `find_user_by_username`, `list_friends`, `create_challenge`, `share_vocab`).
- Block hides both directions (search, requests, challenges, shares, notifications). Admin ban (later) hides the banned user from every social read and rejects every social write in `require_username()` — one choke point.
- `admin_stats()` gains `open_reports` and `friendships_7d`.

---

## 10. Privacy / GDPR

- Every new table FKs `auth.users(id) ON DELETE CASCADE` on both user columns. `auth.admin.deleteUser()` (admin workstream) therefore removes: profile, friendships, blocks, challenges (both roles), shares (both roles), notifications (as recipient and as actor), reports (as reporter and as reported — keep admin audit via `resolution_note`, not the FK).
- A deleted user simply disappears for former friends: friend row gone, completed challenges gone from history, notifications from them gone. Recipients' copied vocab stays (it carries no FK to the sender; the `notes` string holds only the username at share time). This is erasure-maximal by design; no tombstone "usuario eliminado" rows.
- Export: `export_my_social_data() → jsonb` (self-scope) = public profile fields, friends (usernames + since), pending requests, challenges (both roles, scores), shares sent/received (tag, counts, item snapshot for sent), notifications, reports I filed (not reports about me). Wire into the future account-settings export alongside vocab.
- Privacy defaults: `visibility = 'friends'`, `open_to_buddies = false`, no avatar upload in phase 1, exact-username-only discovery, bio/country hidden from strangers unless `public`.

---

## 11. Migration plan (SQL)

> **Renumber before building.** `027_grammar_exercise_pool.sql` (grammar pool +
> per-user progress) took 027 on 2026-09-05. The four migrations below shift to
> **028–031**; their content is unaffected.

### 027_activity_prereq.sql (phase 1, deploy FIRST)

```sql
-- 026: Deploy user_activity (003) + user_achievements (018) to prod with 020-style
-- hardening. Idempotent: both may already exist in a dev DB.

CREATE TABLE IF NOT EXISTS user_activity (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    activity_date date NOT NULL,
    activity_count integer NOT NULL DEFAULT 1,
    created_at timestamptz NOT NULL DEFAULT now(),
    UNIQUE (user_id, activity_date)
);
CREATE INDEX IF NOT EXISTS idx_user_activity_user_date ON user_activity (user_id, activity_date DESC);
ALTER TABLE user_activity ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Users can view their own activity" ON user_activity;
CREATE POLICY "Users can view their own activity" ON user_activity FOR SELECT USING (auth.uid() = user_id);
-- No INSERT policy: writes go through record_user_activity only.
DROP POLICY IF EXISTS "Users can insert their own activity" ON user_activity;

CREATE TABLE IF NOT EXISTS user_achievements (
    user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE,
    achievement_id text NOT NULL,
    earned_at timestamptz NOT NULL DEFAULT now(),
    PRIMARY KEY (user_id, achievement_id)
);
ALTER TABLE user_achievements ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "users read own achievements" ON user_achievements;
CREATE POLICY "users read own achievements" ON user_achievements FOR SELECT USING (auth.uid() = user_id);
DROP POLICY IF EXISTS "users insert own achievements" ON user_achievements;
CREATE POLICY "users insert own achievements" ON user_achievements FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE OR REPLACE FUNCTION public.record_user_activity(p_user_id uuid)
RETURNS void LANGUAGE plpgsql SECURITY DEFINER SET search_path TO 'public'
AS $$
BEGIN
  IF auth.uid() IS NULL OR p_user_id <> auth.uid() THEN
    RAISE EXCEPTION 'cannot act on behalf of another user';
  END IF;
  INSERT INTO user_activity (user_id, activity_date) VALUES (p_user_id, CURRENT_DATE)
  ON CONFLICT (user_id, activity_date)
  DO UPDATE SET activity_count = user_activity.activity_count + 1;
END;
$$;
REVOKE ALL ON FUNCTION public.record_user_activity(uuid) FROM PUBLIC, anon;
GRANT EXECUTE ON FUNCTION public.record_user_activity(uuid) TO authenticated;

-- SECURITY INVOKER on purpose: direct calls are bounded by user_activity RLS (self),
-- while list_friends (SECURITY DEFINER, 027) can evaluate it for friends.
CREATE OR REPLACE FUNCTION public.get_user_streak(p_user_id uuid)
RETURNS integer LANGUAGE plpgsql SET search_path TO 'public'
AS $$
DECLARE v_streak integer := 0; v_cursor date := CURRENT_DATE; v_d date;
BEGIN
  IF NOT EXISTS (SELECT 1 FROM user_activity WHERE user_id = p_user_id AND activity_date >= CURRENT_DATE - 1) THEN
    RETURN 0;
  END IF;
  -- Streak counted from yesterday if today has no activity yet.
  IF NOT EXISTS (SELECT 1 FROM user_activity WHERE user_id = p_user_id AND activity_date = CURRENT_DATE) THEN
    v_cursor := CURRENT_DATE - 1;
  END IF;
  FOR v_d IN SELECT activity_date FROM user_activity WHERE user_id = p_user_id AND activity_date <= v_cursor ORDER BY activity_date DESC LOOP
    EXIT WHEN v_d <> v_cursor;
    v_streak := v_streak + 1; v_cursor := v_cursor - 1;
  END LOOP;
  RETURN v_streak;
END;
$$;
REVOKE ALL ON FUNCTION public.get_user_streak(uuid) FROM PUBLIC, anon;
GRANT EXECUTE ON FUNCTION public.get_user_streak(uuid) TO authenticated;
```

(Note: the original 003 `get_user_streak` returned 0 for a user whose last activity was yesterday even though it first checks "today or yesterday" — the loop starts at today and exits immediately. The version above fixes that; the dashboard streak number will change for users who haven't studied yet today, which is the correct behavior.)

### 028_social_core.sql (phase 1)

```sql
-- 027: Social core — public identity, friend graph, blocks, reports,
-- notifications, travel columns. House pattern: all cross-user reads/writes
-- through SECURITY DEFINER RPCs; cross-user tables have SELECT-only policies.

-- ---------------------------------------------------------------------------
-- Identity + travel columns on user_profiles (self-scope RLS unchanged).
ALTER TABLE user_profiles
  ADD COLUMN IF NOT EXISTS username text,
  ADD COLUMN IF NOT EXISTS username_changed_at timestamptz,
  ADD COLUMN IF NOT EXISTS display_name text,
  ADD COLUMN IF NOT EXISTS bio text,
  ADD COLUMN IF NOT EXISTS country text,
  ADD COLUMN IF NOT EXISTS visibility text NOT NULL DEFAULT 'friends',
  ADD COLUMN IF NOT EXISTS travel_status text,
  ADD COLUMN IF NOT EXISTS travel_countries text[] NOT NULL DEFAULT '{}',
  ADD COLUMN IF NOT EXISTS travel_from date,
  ADD COLUMN IF NOT EXISTS travel_to date,
  ADD COLUMN IF NOT EXISTS open_to_buddies boolean NOT NULL DEFAULT false;

ALTER TABLE user_profiles
  ADD CONSTRAINT user_profiles_username_check CHECK (username IS NULL OR username ~ '^[a-z0-9_]{3,20}$'),
  ADD CONSTRAINT user_profiles_display_name_check CHECK (display_name IS NULL OR char_length(display_name) BETWEEN 1 AND 30),
  ADD CONSTRAINT user_profiles_bio_check CHECK (bio IS NULL OR char_length(bio) <= 160),
  ADD CONSTRAINT user_profiles_country_check CHECK (country IS NULL OR country ~ '^[A-Z]{2}$'),
  ADD CONSTRAINT user_profiles_visibility_check CHECK (visibility IN ('public', 'friends', 'private')),
  ADD CONSTRAINT user_profiles_travel_status_check CHECK (travel_status IS NULL OR travel_status IN ('there', 'planning', 'just_learning')),
  ADD CONSTRAINT user_profiles_travel_countries_check CHECK (
    travel_countries <@ ARRAY['mx','es','ar','co','pe','cl','cu','ve','ec','gt','bo','do','hn','py','sv','ni','cr','pa','uy','pr','gq']::text[]
  ),
  ADD CONSTRAINT user_profiles_travel_window_check CHECK (travel_from IS NULL OR travel_to IS NULL OR travel_from <= travel_to);

CREATE UNIQUE INDEX IF NOT EXISTS idx_user_profiles_username ON user_profiles (username);

-- Backfill travel_status from the onboarding display strings (exact values in
-- web/src/app/onboarding/page.tsx). `location` is left in place.
UPDATE user_profiles SET travel_status = CASE location
  WHEN 'Ya estoy en España / LatAm'  THEN 'there'
  WHEN 'Estoy planeando ir'          THEN 'planning'
  WHEN 'Solo aprendiendo por gusto'  THEN 'just_learning'
  END
WHERE travel_status IS NULL AND location IS NOT NULL;

-- username/visibility are changed only via RPCs below (cooldown + reserved
-- list live there). Extend the 020 trigger so a direct PostgREST UPDATE can't
-- bypass them. service_role / dashboard still pass (auth.role() IS NULL).
CREATE OR REPLACE FUNCTION public.protect_privileged_profile_columns()
RETURNS TRIGGER LANGUAGE plpgsql SECURITY INVOKER SET search_path = ''
AS $$
BEGIN
  IF auth.role() IN ('anon', 'authenticated') THEN
    IF NEW.is_admin IS DISTINCT FROM OLD.is_admin THEN
      RAISE EXCEPTION 'modifying is_admin is not permitted';
    END IF;
    IF NEW.username IS DISTINCT FROM OLD.username OR NEW.username_changed_at IS DISTINCT FROM OLD.username_changed_at THEN
      RAISE EXCEPTION 'use set_username()';
    END IF;
  END IF;
  RETURN NEW;
END;
$$;

-- ---------------------------------------------------------------------------
-- Friend graph
CREATE TABLE friendships (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    requester_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    addressee_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    status text NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'accepted', 'declined')),
    created_at timestamptz NOT NULL DEFAULT now(),
    responded_at timestamptz,
    CHECK (requester_id <> addressee_id)
);
CREATE UNIQUE INDEX idx_friendships_pair
  ON friendships (LEAST(requester_id, addressee_id), GREATEST(requester_id, addressee_id));
CREATE INDEX idx_friendships_requester ON friendships (requester_id, status);
CREATE INDEX idx_friendships_addressee ON friendships (addressee_id, status);
ALTER TABLE friendships ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Parties can view their friendships" ON friendships FOR SELECT
  USING (auth.uid() IN (requester_id, addressee_id));

CREATE TABLE user_blocks (
    blocker_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    blocked_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    created_at timestamptz NOT NULL DEFAULT now(),
    PRIMARY KEY (blocker_id, blocked_id),
    CHECK (blocker_id <> blocked_id)
);
CREATE INDEX idx_user_blocks_blocked ON user_blocks (blocked_id);
ALTER TABLE user_blocks ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Blockers can view own blocks" ON user_blocks FOR SELECT USING (auth.uid() = blocker_id);

-- ---------------------------------------------------------------------------
-- Notifications — written only by RPCs; client reads own, marks read via RPC.
CREATE TABLE notifications (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    kind text NOT NULL CHECK (kind IN ('friend_request','friend_accepted','challenge_received','challenge_completed','challenge_voided','share_received')),
    actor_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    ref_id uuid,
    read_at timestamptz,
    created_at timestamptz NOT NULL DEFAULT now()
);
CREATE INDEX idx_notifications_user_unread ON notifications (user_id, created_at DESC) WHERE read_at IS NULL;
CREATE INDEX idx_notifications_user ON notifications (user_id, created_at DESC);
ALTER TABLE notifications ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can view own notifications" ON notifications FOR SELECT USING (auth.uid() = user_id);

-- ---------------------------------------------------------------------------
-- Reports
CREATE TABLE user_reports (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    reporter_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    reported_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    reason text NOT NULL CHECK (reason IN ('spam','harassment','impersonation','inappropriate_content','travel_safety','other')),
    details text CHECK (details IS NULL OR char_length(details) <= 500),
    context_kind text CHECK (context_kind IS NULL OR context_kind IN ('profile','challenge','share','friend_request')),
    context_id uuid,
    status text NOT NULL DEFAULT 'open' CHECK (status IN ('open','actioned','dismissed')),
    created_at timestamptz NOT NULL DEFAULT now(),
    resolved_by uuid REFERENCES auth.users(id) ON DELETE SET NULL,
    resolved_at timestamptz,
    resolution_note text,
    CHECK (reporter_id <> reported_id)
);
CREATE INDEX idx_user_reports_status ON user_reports (status, created_at DESC);
CREATE INDEX idx_user_reports_reported ON user_reports (reported_id, created_at DESC);
ALTER TABLE user_reports ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Reporters can view own reports" ON user_reports FOR SELECT USING (auth.uid() = reporter_id);

-- ---------------------------------------------------------------------------
-- Helpers (private: not granted to authenticated; callable from definer RPCs)

CREATE OR REPLACE FUNCTION public.require_username()
RETURNS uuid LANGUAGE plpgsql SECURITY DEFINER SET search_path TO 'public'
AS $$
DECLARE v_uid uuid := auth.uid(); v_username text;
BEGIN
  IF v_uid IS NULL THEN RAISE EXCEPTION 'not authenticated'; END IF;
  SELECT username INTO v_username FROM user_profiles WHERE id = v_uid;
  -- TODO(ban): also RAISE 'account suspended' when banned — read auth.users.banned_until
  -- directly (SECURITY DEFINER functions can join auth.users; admin_list_users in 022
  -- already does). No profile column needed.
  IF v_username IS NULL THEN RAISE EXCEPTION 'username required'; END IF;
  RETURN v_uid;
END;
$$;
REVOKE ALL ON FUNCTION public.require_username() FROM PUBLIC, anon, authenticated;

CREATE OR REPLACE FUNCTION public.is_blocked_between(p_a uuid, p_b uuid)
RETURNS boolean LANGUAGE sql SECURITY DEFINER SET search_path TO 'public'
AS $$
  SELECT EXISTS (SELECT 1 FROM user_blocks
    WHERE (blocker_id = p_a AND blocked_id = p_b) OR (blocker_id = p_b AND blocked_id = p_a))
$$;
REVOKE ALL ON FUNCTION public.is_blocked_between(uuid, uuid) FROM PUBLIC, anon, authenticated;

CREATE OR REPLACE FUNCTION public.are_friends(p_a uuid, p_b uuid)
RETURNS boolean LANGUAGE sql SECURITY DEFINER SET search_path TO 'public'
AS $$
  SELECT EXISTS (SELECT 1 FROM friendships WHERE status = 'accepted'
    AND LEAST(requester_id, addressee_id) = LEAST(p_a, p_b)
    AND GREATEST(requester_id, addressee_id) = GREATEST(p_a, p_b))
$$;
REVOKE ALL ON FUNCTION public.are_friends(uuid, uuid) FROM PUBLIC, anon, authenticated;

CREATE OR REPLACE FUNCTION public.notify(p_user_id uuid, p_kind text, p_actor_id uuid, p_ref_id uuid)
RETURNS void LANGUAGE sql SECURITY DEFINER SET search_path TO 'public'
AS $$
  INSERT INTO notifications (user_id, kind, actor_id, ref_id) VALUES (p_user_id, p_kind, p_actor_id, p_ref_id)
$$;
REVOKE ALL ON FUNCTION public.notify(uuid, text, uuid, uuid) FROM PUBLIC, anon, authenticated;

-- Projection type returned by every cross-user read. Fields the viewer may
-- not see come back NULL; the row itself is omitted when the target is
-- invisible (private & not friends, blocked either way, no username).
DROP TYPE IF EXISTS public_profile CASCADE;
CREATE TYPE public_profile AS (
  id uuid, username text, display_name text, avatar_url text,
  bio text, country text, member_since text, relation text
);

CREATE OR REPLACE FUNCTION public.project_profile(p_viewer uuid, p_target uuid)
RETURNS public_profile LANGUAGE plpgsql SECURITY DEFINER SET search_path TO 'public'
AS $$
DECLARE p user_profiles%ROWTYPE; r public_profile; v_rel text; v_full boolean;
BEGIN
  SELECT * INTO p FROM user_profiles WHERE id = p_target;
  IF NOT FOUND OR p.username IS NULL THEN RETURN NULL; END IF;
  -- TODO(ban): RETURN NULL when the target is banned — check auth.users.banned_until > now().
  IF p_viewer <> p_target AND is_blocked_between(p_viewer, p_target) THEN RETURN NULL; END IF;

  v_rel := CASE
    WHEN p_viewer = p_target THEN 'self'
    WHEN are_friends(p_viewer, p_target) THEN 'friend'
    WHEN EXISTS (SELECT 1 FROM friendships WHERE status = 'pending' AND requester_id = p_viewer AND addressee_id = p_target) THEN 'pending_out'
    WHEN EXISTS (SELECT 1 FROM friendships WHERE status = 'pending' AND requester_id = p_target AND addressee_id = p_viewer) THEN 'pending_in'
    ELSE 'none' END;

  IF p.visibility = 'private' AND v_rel NOT IN ('self', 'friend') THEN RETURN NULL; END IF;
  v_full := v_rel IN ('self', 'friend') OR p.visibility = 'public';

  r.id := p.id; r.username := p.username;
  r.display_name := COALESCE(p.display_name, p.username);
  r.avatar_url := p.avatar_url;
  r.bio := CASE WHEN v_full THEN p.bio END;
  r.country := CASE WHEN v_full THEN p.country END;
  r.member_since := CASE WHEN v_full THEN to_char(p.created_at, 'YYYY-MM') END;
  r.relation := v_rel;
  RETURN r;
END;
$$;
REVOKE ALL ON FUNCTION public.project_profile(uuid, uuid) FROM PUBLIC, anon, authenticated;

-- ---------------------------------------------------------------------------
-- Identity RPCs

CREATE OR REPLACE FUNCTION public.set_username(p_username text)
RETURNS boolean LANGUAGE plpgsql SECURITY DEFINER SET search_path TO 'public'
AS $$
DECLARE v_uid uuid := auth.uid(); v_name text := lower(trim(p_username)); v_changed timestamptz; v_first text;
BEGIN
  IF v_uid IS NULL THEN RAISE EXCEPTION 'not authenticated'; END IF;
  IF v_name !~ '^[a-z0-9_]{3,20}$' THEN RAISE EXCEPTION 'invalid username'; END IF;
  IF v_name IN ('admin','chingon','quepedo','support','soporte','ayuda','mod','null','undefined','api','root') THEN
    RAISE EXCEPTION 'username reserved';
  END IF;
  SELECT username_changed_at, first_name INTO v_changed, v_first FROM user_profiles WHERE id = v_uid;
  IF v_changed IS NOT NULL AND v_changed > now() - interval '30 days' THEN
    RAISE EXCEPTION 'username cooldown';
  END IF;
  UPDATE user_profiles
     SET username = v_name,
         username_changed_at = now(),
         display_name = COALESCE(display_name, NULLIF(trim(v_first), ''), v_name),
         updated_at = now()
   WHERE id = v_uid;
  RETURN true;
EXCEPTION WHEN unique_violation THEN
  RAISE EXCEPTION 'username taken';
END;
$$;
REVOKE ALL ON FUNCTION public.set_username(text) FROM PUBLIC, anon;
GRANT EXECUTE ON FUNCTION public.set_username(text) TO authenticated;

CREATE OR REPLACE FUNCTION public.update_public_profile(
  p_display_name text DEFAULT NULL, p_bio text DEFAULT NULL, p_country text DEFAULT NULL, p_visibility text DEFAULT NULL
) RETURNS boolean LANGUAGE plpgsql SECURITY DEFINER SET search_path TO 'public'
AS $$
DECLARE v_uid uuid := auth.uid();
BEGIN
  IF v_uid IS NULL THEN RAISE EXCEPTION 'not authenticated'; END IF;
  -- CHECK constraints on the table validate lengths/enums; NULL = unchanged.
  UPDATE user_profiles
     SET display_name = COALESCE(NULLIF(trim(p_display_name), ''), display_name),
         bio          = COALESCE(NULLIF(trim(p_bio), ''), bio),
         country      = COALESCE(upper(p_country), country),
         visibility   = COALESCE(p_visibility, visibility),
         updated_at   = now()
   WHERE id = v_uid;
  RETURN FOUND;
END;
$$;
REVOKE ALL ON FUNCTION public.update_public_profile(text, text, text, text) FROM PUBLIC, anon;
GRANT EXECUTE ON FUNCTION public.update_public_profile(text, text, text, text) TO authenticated;

CREATE OR REPLACE FUNCTION public.find_user_by_username(p_username text)
RETURNS SETOF public_profile LANGUAGE plpgsql SECURITY DEFINER SET search_path TO 'public'
AS $$
DECLARE v_uid uuid := require_username(); v_target uuid; v_row public_profile;
BEGIN
  SELECT id INTO v_target FROM user_profiles WHERE username = lower(trim(p_username));
  IF NOT FOUND THEN RETURN; END IF;
  v_row := project_profile(v_uid, v_target);
  IF v_row.id IS NOT NULL THEN RETURN NEXT v_row; END IF;
END;
$$;
REVOKE ALL ON FUNCTION public.find_user_by_username(text) FROM PUBLIC, anon;
GRANT EXECUTE ON FUNCTION public.find_user_by_username(text) TO authenticated;

-- ---------------------------------------------------------------------------
-- Friend RPCs

CREATE OR REPLACE FUNCTION public.send_friend_request(p_username text)
RETURNS uuid LANGUAGE plpgsql SECURITY DEFINER SET search_path TO 'public'
AS $$
DECLARE v_uid uuid := require_username(); v_target uuid; v_existing friendships%ROWTYPE; v_id uuid;
BEGIN
  SELECT id INTO v_target FROM user_profiles WHERE username = lower(trim(p_username));
  -- Same error for "no such user", private, and blocked: never reveal which.
  IF NOT FOUND OR v_target = v_uid OR (project_profile(v_uid, v_target)).id IS NULL THEN
    RAISE EXCEPTION 'user not available';
  END IF;

  IF (SELECT count(*) FROM friendships WHERE requester_id = v_uid AND status = 'pending') >= 20
     OR (SELECT count(*) FROM friendships WHERE requester_id = v_uid AND created_at > now() - interval '24 hours') >= 20 THEN
    RAISE EXCEPTION 'rate limited';
  END IF;

  SELECT * INTO v_existing FROM friendships
   WHERE LEAST(requester_id, addressee_id) = LEAST(v_uid, v_target)
     AND GREATEST(requester_id, addressee_id) = GREATEST(v_uid, v_target);

  IF FOUND THEN
    IF v_existing.status = 'accepted' THEN RAISE EXCEPTION 'already friends'; END IF;
    IF v_existing.status = 'pending' THEN
      IF v_existing.requester_id = v_uid THEN RAISE EXCEPTION 'request pending'; END IF;
      -- They already asked us: treat as accept.
      PERFORM respond_friend_request(v_existing.id, true);
      RETURN v_existing.id;
    END IF;
    -- declined: requester cooldown; the decliner may reach out any time.
    IF v_existing.requester_id = v_uid AND v_existing.responded_at > now() - interval '30 days' THEN
      RAISE EXCEPTION 'user not available';
    END IF;
    UPDATE friendships SET requester_id = v_uid, addressee_id = v_target, status = 'pending',
           created_at = now(), responded_at = NULL WHERE id = v_existing.id;
    v_id := v_existing.id;
  ELSE
    INSERT INTO friendships (requester_id, addressee_id) VALUES (v_uid, v_target) RETURNING id INTO v_id;
  END IF;

  PERFORM notify(v_target, 'friend_request', v_uid, v_id);
  RETURN v_id;
END;
$$;
REVOKE ALL ON FUNCTION public.send_friend_request(text) FROM PUBLIC, anon;
GRANT EXECUTE ON FUNCTION public.send_friend_request(text) TO authenticated;

CREATE OR REPLACE FUNCTION public.respond_friend_request(p_friendship_id uuid, p_accept boolean)
RETURNS boolean LANGUAGE plpgsql SECURITY DEFINER SET search_path TO 'public'
AS $$
DECLARE v_uid uuid := require_username(); v_row friendships%ROWTYPE;
BEGIN
  SELECT * INTO v_row FROM friendships WHERE id = p_friendship_id AND addressee_id = v_uid AND status = 'pending' FOR UPDATE;
  IF NOT FOUND THEN RAISE EXCEPTION 'request not found'; END IF;
  UPDATE friendships SET status = CASE WHEN p_accept THEN 'accepted' ELSE 'declined' END, responded_at = now()
   WHERE id = p_friendship_id;
  IF p_accept THEN PERFORM notify(v_row.requester_id, 'friend_accepted', v_uid, p_friendship_id); END IF;
  RETURN true;
END;
$$;
REVOKE ALL ON FUNCTION public.respond_friend_request(uuid, boolean) FROM PUBLIC, anon;
GRANT EXECUTE ON FUNCTION public.respond_friend_request(uuid, boolean) TO authenticated;

CREATE OR REPLACE FUNCTION public.unfriend(p_user_id uuid)
RETURNS boolean LANGUAGE plpgsql SECURITY DEFINER SET search_path TO 'public'
AS $$
DECLARE v_uid uuid := require_username();
BEGIN
  DELETE FROM friendships
   WHERE LEAST(requester_id, addressee_id) = LEAST(v_uid, p_user_id)
     AND GREATEST(requester_id, addressee_id) = GREATEST(v_uid, p_user_id);
  RETURN FOUND;
END;
$$;
REVOKE ALL ON FUNCTION public.unfriend(uuid) FROM PUBLIC, anon;
GRANT EXECUTE ON FUNCTION public.unfriend(uuid) TO authenticated;

CREATE OR REPLACE FUNCTION public.block_user(p_user_id uuid)
RETURNS boolean LANGUAGE plpgsql SECURITY DEFINER SET search_path TO 'public'
AS $$
DECLARE v_uid uuid := auth.uid();  -- blocking must work even without a username
BEGIN
  IF v_uid IS NULL THEN RAISE EXCEPTION 'not authenticated'; END IF;
  IF p_user_id = v_uid THEN RAISE EXCEPTION 'cannot block self'; END IF;
  INSERT INTO user_blocks (blocker_id, blocked_id) VALUES (v_uid, p_user_id) ON CONFLICT DO NOTHING;
  PERFORM unfriend(p_user_id);
  DELETE FROM notifications WHERE (user_id = v_uid AND actor_id = p_user_id) OR (user_id = p_user_id AND actor_id = v_uid);
  -- 028/029 append: cancel pending challenges + shares between the pair.
  RETURN true;
END;
$$;
REVOKE ALL ON FUNCTION public.block_user(uuid) FROM PUBLIC, anon;
GRANT EXECUTE ON FUNCTION public.block_user(uuid) TO authenticated;

CREATE OR REPLACE FUNCTION public.unblock_user(p_user_id uuid)
RETURNS boolean LANGUAGE sql SECURITY DEFINER SET search_path TO 'public'
AS $$
  DELETE FROM user_blocks WHERE blocker_id = auth.uid() AND blocked_id = p_user_id RETURNING true
$$;
REVOKE ALL ON FUNCTION public.unblock_user(uuid) FROM PUBLIC, anon;
GRANT EXECUTE ON FUNCTION public.unblock_user(uuid) TO authenticated;

CREATE OR REPLACE FUNCTION public.list_friends()
RETURNS TABLE (profile public_profile, streak integer, active_today boolean, friends_since timestamptz)
LANGUAGE plpgsql SECURITY DEFINER SET search_path TO 'public'
AS $$
DECLARE v_uid uuid := require_username(); f record;
BEGIN
  FOR f IN
    SELECT CASE WHEN requester_id = v_uid THEN addressee_id ELSE requester_id END AS other_id, responded_at
      FROM friendships WHERE status = 'accepted' AND v_uid IN (requester_id, addressee_id)
  LOOP
    profile := project_profile(v_uid, f.other_id);
    IF profile.id IS NULL THEN CONTINUE; END IF;  -- banned / profile gone
    streak := get_user_streak(f.other_id);         -- runs as definer: reads friend's rows
    active_today := EXISTS (SELECT 1 FROM user_activity WHERE user_id = f.other_id AND activity_date = CURRENT_DATE);
    friends_since := f.responded_at;
    RETURN NEXT;
  END LOOP;
END;
$$;
REVOKE ALL ON FUNCTION public.list_friends() FROM PUBLIC, anon;
GRANT EXECUTE ON FUNCTION public.list_friends() TO authenticated;

CREATE OR REPLACE FUNCTION public.list_friend_requests()
RETURNS TABLE (friendship_id uuid, direction text, profile public_profile, created_at timestamptz)
LANGUAGE plpgsql SECURITY DEFINER SET search_path TO 'public'
AS $$
DECLARE v_uid uuid := require_username(); f record;
BEGIN
  FOR f IN SELECT * FROM friendships WHERE status = 'pending' AND v_uid IN (requester_id, addressee_id) ORDER BY friendships.created_at DESC LOOP
    friendship_id := f.id;
    direction := CASE WHEN f.requester_id = v_uid THEN 'out' ELSE 'in' END;
    profile := project_profile(v_uid, CASE WHEN f.requester_id = v_uid THEN f.addressee_id ELSE f.requester_id END);
    IF profile.id IS NULL THEN CONTINUE; END IF;
    created_at := f.created_at;
    RETURN NEXT;
  END LOOP;
END;
$$;
REVOKE ALL ON FUNCTION public.list_friend_requests() FROM PUBLIC, anon;
GRANT EXECUTE ON FUNCTION public.list_friend_requests() TO authenticated;

-- ---------------------------------------------------------------------------
-- Notification RPCs

CREATE OR REPLACE FUNCTION public.list_notifications(p_limit integer DEFAULT 30)
RETURNS TABLE (id uuid, kind text, ref_id uuid, read_at timestamptz, created_at timestamptz,
               actor_username text, actor_display_name text, actor_avatar_url text)
LANGUAGE sql SECURITY DEFINER SET search_path TO 'public'
AS $$
  SELECT n.id, n.kind, n.ref_id, n.read_at, n.created_at,
         p.username, COALESCE(p.display_name, p.username), p.avatar_url
    FROM notifications n JOIN user_profiles p ON p.id = n.actor_id
   WHERE n.user_id = auth.uid()
   ORDER BY n.created_at DESC
   LIMIT LEAST(GREATEST(p_limit, 1), 100)
$$;
REVOKE ALL ON FUNCTION public.list_notifications(integer) FROM PUBLIC, anon;
GRANT EXECUTE ON FUNCTION public.list_notifications(integer) TO authenticated;

CREATE OR REPLACE FUNCTION public.mark_notifications_read(p_ids uuid[] DEFAULT NULL)
RETURNS integer LANGUAGE plpgsql SECURITY DEFINER SET search_path TO 'public'
AS $$
DECLARE v_n integer;
BEGIN
  IF auth.uid() IS NULL THEN RAISE EXCEPTION 'not authenticated'; END IF;
  UPDATE notifications SET read_at = now()
   WHERE user_id = auth.uid() AND read_at IS NULL AND (p_ids IS NULL OR id = ANY(p_ids));
  GET DIAGNOSTICS v_n = ROW_COUNT;
  RETURN v_n;
END;
$$;
REVOKE ALL ON FUNCTION public.mark_notifications_read(uuid[]) FROM PUBLIC, anon;
GRANT EXECUTE ON FUNCTION public.mark_notifications_read(uuid[]) TO authenticated;

-- ---------------------------------------------------------------------------
-- Reports

CREATE OR REPLACE FUNCTION public.report_user(
  p_user_id uuid, p_reason text, p_details text DEFAULT NULL, p_context_kind text DEFAULT NULL, p_context_id uuid DEFAULT NULL
) RETURNS uuid LANGUAGE plpgsql SECURITY DEFINER SET search_path TO 'public'
AS $$
DECLARE v_uid uuid := auth.uid(); v_id uuid;
BEGIN
  IF v_uid IS NULL THEN RAISE EXCEPTION 'not authenticated'; END IF;
  IF p_user_id = v_uid THEN RAISE EXCEPTION 'cannot report self'; END IF;
  IF (SELECT count(*) FROM user_reports WHERE reporter_id = v_uid AND created_at > now() - interval '24 hours') >= 5 THEN
    RAISE EXCEPTION 'rate limited';
  END IF;
  IF EXISTS (SELECT 1 FROM user_reports WHERE reporter_id = v_uid AND reported_id = p_user_id AND status = 'open') THEN
    RAISE EXCEPTION 'report already open';
  END IF;
  INSERT INTO user_reports (reporter_id, reported_id, reason, details, context_kind, context_id)
  VALUES (v_uid, p_user_id, p_reason, NULLIF(trim(p_details), ''), p_context_kind, p_context_id)
  RETURNING id INTO v_id;
  RETURN v_id;
END;
$$;
REVOKE ALL ON FUNCTION public.report_user(uuid, text, text, text, uuid) FROM PUBLIC, anon;
GRANT EXECUTE ON FUNCTION public.report_user(uuid, text, text, text, uuid) TO authenticated;

CREATE OR REPLACE FUNCTION public.admin_list_reports(p_status text DEFAULT 'open', p_limit integer DEFAULT 50, p_offset integer DEFAULT 0)
RETURNS TABLE (
  id uuid, reason text, details text, context_kind text, context_id uuid, status text, created_at timestamptz,
  reporter_id uuid, reporter_username text, reporter_email text,
  reported_id uuid, reported_username text, reported_email text, reported_open_reports bigint,
  resolved_at timestamptz, resolution_note text
) LANGUAGE plpgsql SECURITY DEFINER SET search_path TO 'public'
AS $$
BEGIN
  IF NOT is_caller_admin() THEN RAISE EXCEPTION 'admin only'; END IF;
  RETURN QUERY
  SELECT r.id, r.reason, r.details, r.context_kind, r.context_id, r.status, r.created_at,
         r.reporter_id, rp.username, ru.email::text,
         r.reported_id, dp.username, du.email::text,
         (SELECT count(*) FROM user_reports x WHERE x.reported_id = r.reported_id AND x.created_at > now() - interval '90 days'),
         r.resolved_at, r.resolution_note
    FROM user_reports r
    JOIN user_profiles rp ON rp.id = r.reporter_id JOIN auth.users ru ON ru.id = r.reporter_id
    JOIN user_profiles dp ON dp.id = r.reported_id JOIN auth.users du ON du.id = r.reported_id
   WHERE p_status IS NULL OR r.status = p_status
   ORDER BY r.created_at DESC
   LIMIT LEAST(GREATEST(p_limit, 1), 200) OFFSET GREATEST(p_offset, 0);
END;
$$;
REVOKE ALL ON FUNCTION public.admin_list_reports(text, integer, integer) FROM PUBLIC, anon;
GRANT EXECUTE ON FUNCTION public.admin_list_reports(text, integer, integer) TO authenticated;

CREATE OR REPLACE FUNCTION public.admin_resolve_report(p_id uuid, p_status text, p_note text DEFAULT NULL)
RETURNS boolean LANGUAGE plpgsql SECURITY DEFINER SET search_path TO 'public'
AS $$
BEGIN
  IF NOT is_caller_admin() THEN RAISE EXCEPTION 'admin only'; END IF;
  IF p_status NOT IN ('actioned', 'dismissed') THEN RAISE EXCEPTION 'invalid status'; END IF;
  UPDATE user_reports SET status = p_status, resolved_by = auth.uid(), resolved_at = now(), resolution_note = p_note
   WHERE id = p_id AND status = 'open';
  RETURN FOUND;
END;
$$;
REVOKE ALL ON FUNCTION public.admin_resolve_report(uuid, text, text) FROM PUBLIC, anon;
GRANT EXECUTE ON FUNCTION public.admin_resolve_report(uuid, text, text) TO authenticated;

CREATE OR REPLACE FUNCTION public.admin_set_username(p_user_id uuid, p_username text)
RETURNS boolean LANGUAGE plpgsql SECURITY DEFINER SET search_path TO 'public'
AS $$
BEGIN
  IF NOT is_caller_admin() THEN RAISE EXCEPTION 'admin only'; END IF;
  UPDATE user_profiles SET username = lower(p_username), username_changed_at = now(), updated_at = now() WHERE id = p_user_id;
  RETURN FOUND;
END;
$$;
REVOKE ALL ON FUNCTION public.admin_set_username(uuid, text) FROM PUBLIC, anon;
GRANT EXECUTE ON FUNCTION public.admin_set_username(uuid, text) TO authenticated;
```

### 029_challenges.sql (phase 1)

```sql
-- 028: Async "Supera mi puntaje" challenges between accepted friends.
-- Integrity rules live here because mobile calls these RPCs directly.

CREATE TABLE challenges (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    challenger_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    addressee_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    game_id text NOT NULL CHECK (game_id IN ('chili_rush', 'loteria', 'construye')),
    level text NOT NULL CHECK (level IN ('A1','A2','B1','B2','C1','C2')),
    pool_terms text[] NOT NULL CHECK (array_length(pool_terms, 1) BETWEEN 10 AND 60),
    challenger_result_id uuid NOT NULL REFERENCES game_results(id) ON DELETE CASCADE,
    challenger_score integer NOT NULL CHECK (challenger_score >= 0),
    addressee_result_id uuid REFERENCES game_results(id) ON DELETE SET NULL,
    addressee_score integer CHECK (addressee_score IS NULL OR addressee_score >= 0),
    status text NOT NULL DEFAULT 'pending' CHECK (status IN ('pending','accepted','completed','declined','expired')),
    created_at timestamptz NOT NULL DEFAULT now(),
    expires_at timestamptz NOT NULL DEFAULT now() + interval '7 days',
    accepted_at timestamptz,
    completed_at timestamptz,
    CHECK (challenger_id <> addressee_id)
);
CREATE INDEX idx_challenges_addressee ON challenges (addressee_id, status, created_at DESC);
CREATE INDEX idx_challenges_challenger ON challenges (challenger_id, status, created_at DESC);
ALTER TABLE challenges ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Parties can view their challenges" ON challenges FOR SELECT
  USING (auth.uid() IN (challenger_id, addressee_id));

CREATE OR REPLACE FUNCTION public.create_challenge(p_result_id uuid, p_addressee_id uuid, p_level text, p_pool_terms text[])
RETURNS uuid LANGUAGE plpgsql SECURITY DEFINER SET search_path TO 'public'
AS $$
DECLARE v_uid uuid := require_username(); v_res game_results%ROWTYPE; v_id uuid;
BEGIN
  IF NOT are_friends(v_uid, p_addressee_id) OR is_blocked_between(v_uid, p_addressee_id) THEN
    RAISE EXCEPTION 'user not available';
  END IF;
  SELECT * INTO v_res FROM game_results WHERE id = p_result_id AND user_id = v_uid AND created_at > now() - interval '1 hour';
  IF NOT FOUND THEN RAISE EXCEPTION 'result not found'; END IF;
  IF (SELECT count(*) FROM challenges WHERE challenger_id = v_uid AND created_at > now() - interval '24 hours') >= 10
     OR (SELECT count(*) FROM challenges WHERE challenger_id = v_uid AND addressee_id = p_addressee_id AND status IN ('pending','accepted') AND expires_at > now()) >= 3 THEN
    RAISE EXCEPTION 'rate limited';
  END IF;

  INSERT INTO challenges (challenger_id, addressee_id, game_id, level, pool_terms, challenger_result_id, challenger_score)
  VALUES (v_uid, p_addressee_id, v_res.game_id, p_level, p_pool_terms, p_result_id, v_res.score)
  RETURNING id INTO v_id;
  PERFORM notify(p_addressee_id, 'challenge_received', v_uid, v_id);
  RETURN v_id;
END;
$$;
REVOKE ALL ON FUNCTION public.create_challenge(uuid, uuid, text, text[]) FROM PUBLIC, anon;
GRANT EXECUTE ON FUNCTION public.create_challenge(uuid, uuid, text, text[]) TO authenticated;

CREATE OR REPLACE FUNCTION public.accept_challenge(p_id uuid)
RETURNS TABLE (game_id text, level text, pool_terms text[], challenger_score integer)
LANGUAGE plpgsql SECURITY DEFINER SET search_path TO 'public'
AS $$
DECLARE v_uid uuid := require_username();
BEGIN
  UPDATE challenges c SET status = 'accepted', accepted_at = COALESCE(c.accepted_at, now())
   WHERE c.id = p_id AND c.addressee_id = v_uid AND c.status IN ('pending', 'accepted') AND c.expires_at > now();
  IF NOT FOUND THEN RAISE EXCEPTION 'challenge not available'; END IF;
  RETURN QUERY SELECT c.game_id, c.level, c.pool_terms, c.challenger_score FROM challenges c WHERE c.id = p_id;
END;
$$;
REVOKE ALL ON FUNCTION public.accept_challenge(uuid) FROM PUBLIC, anon;
GRANT EXECUTE ON FUNCTION public.accept_challenge(uuid) TO authenticated;

-- Anti-retry: the submitted result must be the FIRST result of that game the
-- addressee produced after accepting. Play-three-times-keep-the-best fails here.
CREATE OR REPLACE FUNCTION public.complete_challenge(p_id uuid, p_result_id uuid)
RETURNS boolean LANGUAGE plpgsql SECURITY DEFINER SET search_path TO 'public'
AS $$
DECLARE v_uid uuid := require_username(); c challenges%ROWTYPE; r game_results%ROWTYPE; v_first uuid;
BEGIN
  SELECT * INTO c FROM challenges WHERE id = p_id AND addressee_id = v_uid AND status = 'accepted' AND addressee_result_id IS NULL FOR UPDATE;
  IF NOT FOUND THEN RAISE EXCEPTION 'challenge not available'; END IF;
  SELECT * INTO r FROM game_results WHERE id = p_result_id AND user_id = v_uid AND game_id = c.game_id;
  IF NOT FOUND THEN RAISE EXCEPTION 'result not found'; END IF;
  SELECT id INTO v_first FROM game_results
   WHERE user_id = v_uid AND game_id = c.game_id AND created_at > c.accepted_at
   ORDER BY created_at ASC LIMIT 1;
  IF v_first IS DISTINCT FROM p_result_id THEN RAISE EXCEPTION 'result is not the first attempt'; END IF;

  UPDATE challenges SET addressee_result_id = p_result_id, addressee_score = r.score, status = 'completed', completed_at = now()
   WHERE id = p_id;
  PERFORM notify(c.challenger_id, 'challenge_completed', v_uid, p_id);
  RETURN true;
END;
$$;
REVOKE ALL ON FUNCTION public.complete_challenge(uuid, uuid) FROM PUBLIC, anon;
GRANT EXECUTE ON FUNCTION public.complete_challenge(uuid, uuid) TO authenticated;

CREATE OR REPLACE FUNCTION public.decline_challenge(p_id uuid)
RETURNS boolean LANGUAGE sql SECURITY DEFINER SET search_path TO 'public'
AS $$
  UPDATE challenges SET status = 'declined' WHERE id = p_id AND addressee_id = auth.uid() AND status = 'pending' RETURNING true
$$;
REVOKE ALL ON FUNCTION public.decline_challenge(uuid) FROM PUBLIC, anon;
GRANT EXECUTE ON FUNCTION public.decline_challenge(uuid) TO authenticated;

-- Recipient's bundle could not resolve enough terms (curated list changed).
CREATE OR REPLACE FUNCTION public.void_challenge(p_id uuid)
RETURNS boolean LANGUAGE plpgsql SECURITY DEFINER SET search_path TO 'public'
AS $$
DECLARE c challenges%ROWTYPE;
BEGIN
  UPDATE challenges SET status = 'expired' WHERE id = p_id AND addressee_id = auth.uid() AND status IN ('pending','accepted') RETURNING * INTO c;
  IF NOT FOUND THEN RETURN false; END IF;
  PERFORM notify(c.challenger_id, 'challenge_voided', auth.uid(), p_id);
  RETURN true;
END;
$$;
REVOKE ALL ON FUNCTION public.void_challenge(uuid) FROM PUBLIC, anon;
GRANT EXECUTE ON FUNCTION public.void_challenge(uuid) TO authenticated;

-- Inbox + history with lazy expiry applied. Both parties projected.
CREATE OR REPLACE FUNCTION public.list_challenges(p_limit integer DEFAULT 50)
RETURNS TABLE (id uuid, game_id text, level text, status text, challenger public_profile, addressee public_profile,
               challenger_score integer, addressee_score integer, winner_id uuid, created_at timestamptz, expires_at timestamptz)
LANGUAGE plpgsql SECURITY DEFINER SET search_path TO 'public'
AS $$
DECLARE v_uid uuid := require_username(); c record;
BEGIN
  FOR c IN SELECT * FROM challenges x WHERE v_uid IN (x.challenger_id, x.addressee_id)
           ORDER BY x.created_at DESC LIMIT LEAST(GREATEST(p_limit, 1), 200) LOOP
    challenger := project_profile(v_uid, c.challenger_id);
    addressee  := project_profile(v_uid, c.addressee_id);
    IF challenger.id IS NULL OR addressee.id IS NULL THEN CONTINUE; END IF;
    id := c.id; game_id := c.game_id; level := c.level;
    status := CASE WHEN c.status IN ('pending','accepted') AND c.expires_at < now() THEN 'expired' ELSE c.status END;
    challenger_score := c.challenger_score; addressee_score := c.addressee_score;
    winner_id := CASE WHEN c.status <> 'completed' OR c.addressee_score = c.challenger_score THEN NULL
                      WHEN c.addressee_score > c.challenger_score THEN c.addressee_id ELSE c.challenger_id END;
    created_at := c.created_at; expires_at := c.expires_at;
    RETURN NEXT;
  END LOOP;
END;
$$;
REVOKE ALL ON FUNCTION public.list_challenges(integer) FROM PUBLIC, anon;
GRANT EXECUTE ON FUNCTION public.list_challenges(integer) TO authenticated;

-- block_user hook: cancel open challenges between the pair.
CREATE OR REPLACE FUNCTION public.block_user(p_user_id uuid)
RETURNS boolean LANGUAGE plpgsql SECURITY DEFINER SET search_path TO 'public'
AS $$
DECLARE v_uid uuid := auth.uid();
BEGIN
  IF v_uid IS NULL THEN RAISE EXCEPTION 'not authenticated'; END IF;
  IF p_user_id = v_uid THEN RAISE EXCEPTION 'cannot block self'; END IF;
  INSERT INTO user_blocks (blocker_id, blocked_id) VALUES (v_uid, p_user_id) ON CONFLICT DO NOTHING;
  PERFORM unfriend(p_user_id);
  DELETE FROM notifications WHERE (user_id = v_uid AND actor_id = p_user_id) OR (user_id = p_user_id AND actor_id = v_uid);
  UPDATE challenges SET status = 'declined' WHERE status IN ('pending','accepted')
     AND LEAST(challenger_id, addressee_id) = LEAST(v_uid, p_user_id) AND GREATEST(challenger_id, addressee_id) = GREATEST(v_uid, p_user_id);
  RETURN true;
END;
$$;
```

(Typo guard for the implementer: `LANGUAGE plpgsql` in `create_challenge` above must read `plpgsql`.)

### 030_vocab_shares.sql (phase 2)

```sql
-- 029: Share a tag slice of user_vocabulary with a friend. Snapshot on send,
-- copy on accept; recipient owns the copies (source = 'shared').

ALTER TABLE user_vocabulary DROP CONSTRAINT IF EXISTS user_vocabulary_source_check;
ALTER TABLE user_vocabulary ADD CONSTRAINT user_vocabulary_source_check
  CHECK (source IN ('manual', 'ai_generated', 'shared'));

CREATE TABLE vocab_shares (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    sender_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    recipient_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    tag text NOT NULL CHECK (char_length(tag) BETWEEN 1 AND 40),
    items jsonb NOT NULL,                 -- [{term, translations, context_sentence, difficulty_rating, synonyms, tags}]
    item_count integer NOT NULL CHECK (item_count BETWEEN 1 AND 100),
    status text NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'accepted', 'dismissed')),
    added_count integer,
    created_at timestamptz NOT NULL DEFAULT now(),
    responded_at timestamptz,
    CHECK (sender_id <> recipient_id)
);
CREATE INDEX idx_vocab_shares_recipient ON vocab_shares (recipient_id, status, created_at DESC);
ALTER TABLE vocab_shares ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Parties can view their shares" ON vocab_shares FOR SELECT USING (auth.uid() IN (sender_id, recipient_id));

CREATE OR REPLACE FUNCTION public.share_vocab(p_recipient_id uuid, p_tag text, p_item_ids uuid[])
RETURNS uuid LANGUAGE plpgsql SECURITY DEFINER SET search_path TO 'public'
AS $$
DECLARE v_uid uuid := require_username(); v_items jsonb; v_n integer; v_id uuid;
BEGIN
  IF NOT are_friends(v_uid, p_recipient_id) OR is_blocked_between(v_uid, p_recipient_id) THEN RAISE EXCEPTION 'user not available'; END IF;
  IF array_length(p_item_ids, 1) IS NULL OR array_length(p_item_ids, 1) > 100 THEN RAISE EXCEPTION 'invalid item count'; END IF;
  IF (SELECT count(*) FROM vocab_shares WHERE sender_id = v_uid AND created_at > now() - interval '24 hours') >= 10 THEN RAISE EXCEPTION 'rate limited'; END IF;

  SELECT jsonb_agg(jsonb_build_object('term', term, 'translations', translations, 'context_sentence', context_sentence,
                   'difficulty_rating', difficulty_rating, 'synonyms', synonyms, 'tags', tags)), count(*)
    INTO v_items, v_n
    FROM user_vocabulary WHERE user_id = v_uid AND id = ANY(p_item_ids);
  IF v_n <> array_length(p_item_ids, 1) THEN RAISE EXCEPTION 'items not owned'; END IF;
  IF pg_column_size(v_items) > 262144 THEN RAISE EXCEPTION 'share too large'; END IF;

  INSERT INTO vocab_shares (sender_id, recipient_id, tag, items, item_count) VALUES (v_uid, p_recipient_id, trim(p_tag), v_items, v_n) RETURNING id INTO v_id;
  PERFORM notify(p_recipient_id, 'share_received', v_uid, v_id);
  RETURN v_id;
END;
$$;
REVOKE ALL ON FUNCTION public.share_vocab(uuid, text, uuid[]) FROM PUBLIC, anon;
GRANT EXECUTE ON FUNCTION public.share_vocab(uuid, text, uuid[]) TO authenticated;

CREATE OR REPLACE FUNCTION public.accept_vocab_share(p_share_id uuid)
RETURNS json LANGUAGE plpgsql SECURITY DEFINER SET search_path TO 'public'
AS $$
DECLARE v_uid uuid := require_username(); s vocab_shares%ROWTYPE; v_sender text; v_added integer;
BEGIN
  SELECT * INTO s FROM vocab_shares WHERE id = p_share_id AND recipient_id = v_uid AND status = 'pending' FOR UPDATE;
  IF NOT FOUND THEN RAISE EXCEPTION 'share not available'; END IF;
  SELECT username INTO v_sender FROM user_profiles WHERE id = s.sender_id;

  INSERT INTO user_vocabulary (user_id, term, translations, context_sentence, difficulty_rating, synonyms, tags, source, notes)
  SELECT v_uid, i->>'term', COALESCE(i->'translations', '{}'::jsonb), i->>'context_sentence',
         COALESCE((i->>'difficulty_rating')::int, 1),
         COALESCE(ARRAY(SELECT jsonb_array_elements_text(i->'synonyms')), '{}'),
         COALESCE(ARRAY(SELECT jsonb_array_elements_text(i->'tags')), '{}'),
         'shared', 'Compartido por @' || COALESCE(v_sender, '?')
    FROM jsonb_array_elements(s.items) i
   WHERE NOT EXISTS (SELECT 1 FROM user_vocabulary v WHERE v.user_id = v_uid AND lower(v.term) = lower(i->>'term'));
  GET DIAGNOSTICS v_added = ROW_COUNT;

  UPDATE vocab_shares SET status = 'accepted', added_count = v_added, responded_at = now() WHERE id = p_share_id;
  RETURN json_build_object('added', v_added, 'skipped', s.item_count - v_added);
END;
$$;
REVOKE ALL ON FUNCTION public.accept_vocab_share(uuid) FROM PUBLIC, anon;
GRANT EXECUTE ON FUNCTION public.accept_vocab_share(uuid) TO authenticated;

CREATE OR REPLACE FUNCTION public.dismiss_vocab_share(p_share_id uuid)
RETURNS boolean LANGUAGE sql SECURITY DEFINER SET search_path TO 'public'
AS $$
  UPDATE vocab_shares SET status = 'dismissed', responded_at = now()
   WHERE id = p_share_id AND recipient_id = auth.uid() AND status = 'pending' RETURNING true
$$;
REVOKE ALL ON FUNCTION public.dismiss_vocab_share(uuid) FROM PUBLIC, anon;
GRANT EXECUTE ON FUNCTION public.dismiss_vocab_share(uuid) TO authenticated;

-- list_vocab_shares(p_limit) — same projection pattern as list_challenges; omitted for brevity.
-- block_user: append `UPDATE vocab_shares SET status='dismissed' WHERE status='pending' AND pair matches`.
```

### Later-phase signatures (no SQL yet)

```
-- phase 2
admin_clear_avatar(p_user_id uuid) → boolean
export_my_social_data() → jsonb
-- phase 3
search_users(p_prefix text, p_limit int) → SETOF public_profile     -- public visibility only, ≥ 3 chars
-- phase 4
find_travel_buddies(p_country text, p_from date, p_to date, p_limit int) → SETOF public_profile
```

### Verification checklist per migration (mirrors 020's footer)

- authenticated A: `find_user_by_username` for private/blocked/banned B → 0 rows.
- A requests B, B declines, A re-requests → `user not available`; B requests A → succeeds (row flipped).
- Direct `UPDATE user_profiles SET username` via PostgREST → trigger rejects.
- `complete_challenge` with the second result after `accepted_at` → `result is not the first attempt`.
- `get_user_streak(other_uid)` direct → 0; via `list_friends` → real value.
- `notifications` INSERT via PostgREST → no policy, rejected.

---

## 12. Phasing

**Phase 1 — smallest shippable slice (migrations 027, 028, 029):** username claim, public profile (display name, bio, country, visibility, initials avatar), exact-username lookup, friend request/accept/decline/unfriend, block, report, notifications bell, challenges on all three games. Web first: `/amigos` page (list + requests + lookup box), `NotificationBell` in `Sidebar`, "Retar a un amigo" on `ResultCard`, "Retos" section on the games hub, `/games/reto/[id]` play route that resolves `pool_terms` and skips the vocab picker, `/admin/reports`. Server actions in `web/src/actions/social.ts` are thin RPC wrappers with whitelisted error messages (022 pattern). Shared code: `shared/social/` (types, zod, `avatarFallback`, `resolveChallengePool`) exported from `shared/index.ts`.

**Phase 2:** vocab sharing (030) with a "Compartir etiqueta" action on the vocabulary page; avatar upload bucket; `export_my_social_data`; username step in onboarding; mobile screens (friends tab card on dashboard, challenge inbox on exercises tab, bell on dashboard header).

**Phase 3:** prefix search, `social` achievements group (first friend, 5 wins, 10 challenges), "Revancha" shortcut, win/loss tally on the friend card, email/push fan-out from `notifications` when Resend/expo-notifications are adopted.

**Phase 4 (travel buddies, own spec):** profile travel section editing `travel_*` columns, `find_travel_buddies`, `travel_safety` report priority, account-age gate. Messaging is a separate spec and is not implied by anything here.

Skipped on purpose: realtime, leaderboards, taco stakes, DMs, two-row friendships, `vocabulary_sets`, cron-based expiry. Each has a one-line upgrade path above if the need materializes.

### Critical Files for Implementation
- /Users/simonhofmann/Projects/QuePedo/supabase/migrations/ (new 026–029; pattern source: 020_security_hardening.sql, 022_admin.sql)
- /Users/simonhofmann/Projects/QuePedo/shared/index.ts and a new /Users/simonhofmann/Projects/QuePedo/shared/social/ (types, zod, `avatarFallback`, `resolveChallengePool`)
- /Users/simonhofmann/Projects/QuePedo/web/src/actions/games.ts (challenge hooks around `submitGameResult`) plus new /Users/simonhofmann/Projects/QuePedo/web/src/actions/social.ts
- /Users/simonhofmann/Projects/QuePedo/web/src/app/(main)/games/useGameWords.ts and ResultCard.tsx (curated-only challenge source, pool resolution, "Retar" CTA)
- /Users/simonhofmann/Projects/QuePedo/web/src/components/layout/Sidebar.tsx and /Users/simonhofmann/Projects/QuePedo/web/src/actions/admin.ts (bell, reports tab)