# CJSR Trivia Project Handoff

## Project

This repo contains the CJSR Volunteer Appreciation Trivia live multiplayer web app. It's also being developed as a white-label template for reselling to other trivia-night customers — see "Product Direction" below. `main` is the live, working CJSR instance; a `template` branch exists with CJSR-specific files stripped, periodically synced from `main`.

Stack:

- Vite
- React 18
- TypeScript
- Tailwind CSS
- Firebase Realtime Database
- Firebase Hosting

Primary routes:

- `/` - player join, question, reveal, and final standings flow
- `/host` - passphrase-protected host control desk
- `/host/questions` - passphrase-protected live question/answer editor, including bulk `.xlsx` import
- `/screen` - read-only projector display
- `/host/answer-key` - passphrase-protected printable answer key

Navigation:

- The player root route is intentionally clean and has no visible nav links.
- Host/admin nav appears only while on host routes and links to Host, Questions, Screen, and Answer key.
- The projector route intentionally hides the global app header; `/screen` owns its own logo/title/status header to avoid duplicated branding on the display.
- The global header row no longer force-stacks on mobile; it's a single wrapping flex row so the dark/light theme toggle sits beside the logo instead of dropping to its own row when there's no host nav to share space with.

Default game code:

- `main`

## Current Git State

Recent commits on `main` (newest first):

- `3c96d64 Make round structure data-driven: unlimited questions, dynamic rounds`
- `2e569a9 Add free-text team naming alongside the curated pun-name list`
- `6519d00 Document sudden-death and bulk-import bug fixes in CLAUDE.md`
- `b42801d Fix bugs found in full-project bug bash`
- `0fd7a8f Update CLAUDE.md for completed Phase 1 white-label work`

There is also a `template` branch (`f01b52b` as of last sync), branched from `main`, with CJSR-specific files removed (see "Product Direction"). It's periodically merged forward from `main` to pick up generic improvements — check its own git log for how current it is relative to `main`. As of this commit, `template` is fully caught up to `main` (everything through E1 is merged in).

Important: the live Firebase Hosting site is available at `https://cjsr-trivia.web.app`. It was redeployed after the initial red/logo rebrand, but everything since then — the dark/light theme system, the live question/answer editor, the printable answer key, all player-facing copy changes, overflow team names, the branding-config extraction, the bulk xlsx import, free-text team naming, the sudden-death fix, and the E1 dynamic-rounds refactor — has **not** been confirmed deployed to hosting. Re-run `npx firebase-tools deploy --only hosting` before relying on any of this live. (Database rules **have** been kept current via `npx firebase-tools deploy --only database` after every rules change this session, including the E1 bound loosening — that part is current as of `3c96d64`.)

This repo's git state has previously changed without an explicit `git commit`/`git push` from a session (some earlier commits with generic messages like `Fix` and `UI improvements` were made by a mechanism outside any Claude Code git command). More recent commits (the ones listed above) were made directly via normal `git commit`/`git push` in-session. Don't assume commit messages describe *why* something changed for the older, generically-named ones — check this file or the conversation history instead.

## Environment

The app expects Firebase browser config in `.env.local` using Vite env variables. Do not commit `.env.local`.

Expected variables:

```text
VITE_FIREBASE_API_KEY=
VITE_FIREBASE_AUTH_DOMAIN=
VITE_FIREBASE_DATABASE_URL=
VITE_FIREBASE_PROJECT_ID=
VITE_FIREBASE_APP_ID=
VITE_FIREBASE_STORAGE_BUCKET=
VITE_HOST_PASSPHRASE=
```

`VITE_FIREBASE_STORAGE_BUCKET` is optional, unlike the other `VITE_FIREBASE_*` vars — `src/lib/firebase.ts` only calls `getStorage()` (and only the host question editor's media-upload button appears) when it's set. Leaving it blank is a valid, fully-supported deployment state (this is CJSR's current state — see "Firebase Notes"), not a broken one.

`.env.local` now only holds deployment-specific/secret values. `VITE_SITE_TITLE`, `VITE_THEME_COLOR`, and `VITE_THEME_STORAGE_KEY` used to live here but were retired as part of the wizard-roadmap "Stage 1" config consolidation — see "Setup Wizard Roadmap" under "Product Direction" below. Branding now lives entirely in `src/config/instance.config.json`.

Do not expose Firebase Admin credentials through any `VITE_` variable.

## Commands

Use these before commits:

```bash
npm run validate:data
npm run lint
npm run build
```

`npm run build` now also runs `validate:data` automatically via a `prebuild` script — `instance.config.json` and the data files can't silently drift out of shape into a shipped build.

Firebase deploy commands:

```bash
npx firebase-tools deploy --only database
npx firebase-tools deploy --only hosting
```

Global `firebase` CLI was not available in this shell, so `npx firebase-tools` was used.

## Firebase Notes

Backend was pivoted from Supabase to Firebase Realtime Database.

Current Firebase project:

- `cjsr-trivia`
- RTDB rules target: `cjsr-trivia-default-rtdb`

Rules already deployed:

- Initial database rules
- Host metadata write rules
- Scoring write rules
- Reset rules allowing host reset to clear the answers tree
- Kick rules allowing host kick to clear a team-name reservation
- `questions/$questionId` write rule (shape-validated: id/round/text/choices/answer, and now an optional `media` object — see E6 under "Product Direction"), enabling the live question editor at `/host/questions` and bulk `.xlsx` import (same rule covers both — import writes are a multi-location `update()` fanned out to individual `$questionId` paths, each independently validated by this rule)

Firebase Storage (E6, image/video clue questions): wired up in code (`src/lib/firebase.ts`, `src/lib/storageMedia.ts`, `storage.rules`, `firebase.json`'s new `storage` block) but **not yet enabled for CJSR** — `VITE_FIREBASE_STORAGE_BUCKET` is intentionally left blank in `.env.local`, so `getStorage()` never initializes and the host question editor shows "Media upload is not configured for this deployment" instead of an upload button. Enabling it for real requires: turning on Storage for the `cjsr-trivia` Firebase project in the console (not yet done), filling in the bucket name, and running `npx firebase-tools deploy --only storage` to push `storage.rules`. Zero behavior change for CJSR as shipped — see E6 under "Product Direction" for how this was verified against the real production game.

Hosting already deployed:

- Latest confirmed UI deploy to `https://cjsr-trivia.web.app` predates the theme system and everything listed under "Current Git State" above — see that section before assuming any specific feature is live.

## Architecture

Key files:

- `src/config/instance.config.json` - the single source of truth for all customer-facing branding: copy (site title, header text, headlines, join-screen description, land acknowledgment or `null` to omit it), storage keys (team-id, theme), `maxPlayersPerTeam`, and the full light/dark color palette (`colors.<token>.dark` / `.light`, `#rrggbb` hex). This is the file a new customer edits now — see "Setup Wizard Roadmap" under "Product Direction" for why this replaced `site.ts` literals + `styles.css` hardcoded colors + 3 env vars.
- `src/config/site.ts` - now a thin typed/validated loader over `instance.config.json`, not a place to hand-edit values. Throws a clear error at import time if the config is malformed (same shape-validation philosophy as `triviaData.ts`'s `parseQuestion`). Exports `siteConfig: SiteConfig` (unchanged public shape/import path, so every existing consumer — `PlayerPage.tsx`, `HostPage.tsx`, `ScreenPage.tsx`, `AnswerKeyPage.tsx`, `firebaseData.ts`'s `parsePlayerCount` — needed zero changes) plus `instanceBranding: InstanceConfig` for the fuller shape (colors, siteTitle, themeStorageKey) that `useTheme.ts` and `vite.config.ts` need.
- `vite.config.ts` - a custom `instance-branding` plugin hooks `transformIndexHtml` (with `order: 'pre'`, required — otherwise Vite's built-in HTML plugin parses the `__BRAND_COLORS__` placeholder as literal CSS before this plugin ever runs, since it extracts `<style>` tag content into the CSS pipeline ahead of normal-order hooks) to inject the page `<title>`, `<meta name="theme-color">`, and a generated `:root { --color-brand-*: ...; } :root[data-theme='light'] { ...overrides only... }` block into `index.html`'s `<head>`, all sourced from `instance.config.json`. Runs identically in `npm run dev` and `npm run build`.
- `src/lib/firebase.ts` - Firebase browser initialization and missing-env handling; also conditionally initializes Firebase Storage (`getStorage()`) when `VITE_FIREBASE_STORAGE_BUCKET` is set — `firebaseServices.storage` is `null` otherwise
- `src/lib/storageMedia.ts` - Firebase Storage upload helper for question media (`uploadQuestionMedia`, `isMediaUploadConfigured`); throws if Storage isn't configured for the deployment. Deliberately has no delete/cleanup helper yet — see "Known Follow-Ups"
- `src/lib/textMatching.ts` - fuzzy/normalized string matching (`isFuzzyMatch`, `normalizeAnswerText`) used to auto-grade free-text questions (E2b); no external dependency, plain Levenshtein distance with a tolerance scaled to answer length
- `src/lib/firebasePaths.ts` - typed path helpers for game, teams, reservations, answers, questions
- `src/lib/firebaseData.ts` - Firebase read/write helpers, including `writeQuestion`/`ensureQuestionsSeeded`/`bulkWriteQuestions`
- `src/lib/hostState.ts` - host game-state transitions
- `src/lib/triviaData.ts` - question/scoring/schedule helpers; `SEED_QUESTIONS` is the static build-time fallback, `resolveQuestions(gameState)` prefers live Firebase-backed questions when present
- `src/lib/questionValidation.ts` - pure validation for a single question row (used by both the bulk `.xlsx` import preview and, implicitly, matches the shape the database rule enforces server-side)
- `src/lib/questionImport.ts` - SheetJS-backed `.xlsx` template generation and upload parsing for `/host/questions`; both functions dynamically `import('xlsx')` so the ~500KB library is only fetched when a host actually uses import/export, not bundled into what every player downloads on join
- `src/lib/leaderboard.ts` - leaderboard ranking helper
- `src/hooks/useGameSubscription.ts` - realtime subscription with fallback behavior; the single `GameState` blob now also carries `questions`
- `src/hooks/useServerTimeOffset.ts` - Firebase server time offset
- `src/hooks/useQuestionTimer.ts` - server-derived question countdown
- `src/pages/PlayerPage.tsx` - player join/play/reveal/final UI
- `src/pages/HostPage.tsx` - host controls
- `src/pages/HostQuestionsPage.tsx` - live question/answer editor (text, 4 choices, correct answer per question; round/points fixed, no add/delete) plus the bulk import panel
- `src/pages/ScreenPage.tsx` - projector display
- `src/pages/AnswerKeyPage.tsx` - printable, host-gated answer key; reads the same live question data as everything else
- `src/components/host/HostGate.tsx` - shared passphrase-unlock gate, used by `/host`, `/host/questions`, and `/host/answer-key`
- `src/hooks/useTheme.ts` - dark/light theme state; storage key comes from `instanceBranding.themeStorageKey` (`src/config/site.ts`) so it matches `index.html`'s inline pre-paint script, which can't import TS and instead gets the same key injected directly into the HTML by the `instance-branding` Vite plugin at build/dev time. These two previously read the same env var independently; a stage-1 wizard-roadmap refactor moved the value into `instance.config.json` but initially only updated the HTML side, leaving `useTheme.ts` silently falling back to a different default key (`'trivia-theme'`) than what the pre-paint script used (`'cjsr-theme'`) — caught by live verification (the theme toggle stopped persisting to `localStorage`) before it shipped. Worth remembering if this pattern (one value consumed from two different places, one that can import TS and one that can't) comes up again.
- `src/components/common/ThemeToggle.tsx` - header theme-toggle button (upside-down cross for dark, right-side-up cross for light)
- `src/assets/logo.png` - the app/brand logo (renamed from `cjsr-logo.png` to a generic filename so a new customer can drop in a replacement without touching code); used in the app header and the projector top bar
- `src/styles.css` - the `brand-*` Tailwind color tokens' actual hex values no longer live here (see `instance.config.json`/`vite.config.ts` above) — this file now only has the shared, non-branded CSS (`.page-card`, `.nav-link`, focus rings, etc.) plus the `--font-display`/`--font-body` custom properties, which are still hardcoded (not yet part of `instance.config.json` — fonts were judged out of scope for the wizard-roadmap stage-1 pass, add them later if a customer needs custom fonts)
- `tailwind.config.js` - maps the `brand-*` Tailwind color classes to the CSS custom properties above
- `scripts/simulateFullGame.mjs` - deterministic full-game stress simulation
- `scripts/validateQuestions.mjs` - validates `questions.json`, `teamNames.json`, and `teamNamesOverflow.json` (including cross-file duplicate name checks)
- `database.rules.json` - Realtime Database rules
- `storage.rules` - Firebase Storage security rules (question media uploads); shape/size-only validation (image or video content type, under 50MB), same low-stakes-MVP posture as `database.rules.json` — no auth, matches the accepted risk already documented under "Known Follow-Ups"
- `firebase.json` - Firebase hosting/database/storage config

## Data Model

Game data lives under:

```text
games/{gameCode}
```

Main children:

- `meta` - phase, current question, round, timestamps
- `teams` - team records
- `teamNames` - reservation map for unique team names
- `answers` - answer records by team and question
- `questions` - live question bank, keyed by question id; only exists once a host has opened `/host/questions` at least once (it self-seeds from `src/data/questions.json` on first load via `ensureQuestionsSeeded`). Until seeded, every page transparently falls back to the static seed file, so gameplay works either way. Shape: id, round, text, optional `media: { type: 'image'|'video', url } | null`, plus a `type`-discriminated union for everything else — `type: 'multiple_choice'` has `choices` (4-tuple) + `answer: ChoiceIndex` (single correct index); `type: 'multi_select'` has `choices` + `answers: readonly ChoiceIndex[]` (1-4 correct indexes, `ChoiceIndex = 0|1|2|3`); `type: 'free_text'` has no `choices` at all, just `acceptedAnswers: readonly string[]` (fuzzy-matched, see E2b under "Product Direction"). `media` and `type` both default gracefully when absent from stored/seed data (`media: null`, `type: 'multiple_choice'`) — CJSR's real 31 questions have neither field, zero behavior change.

Team records are not deleted when kicked. They are marked:

```json
{ "isActive": false }
```

This preserves history while removing the team from active play and player rejoin.

## Implemented Features

Foundation:

- Vite React TypeScript app
- React Router routes
- Tailwind and configurable brand theme (`src/config/site.ts` + `brand-*` tokens)
- Global error boundary
- Firebase Hosting config
- Data validation script for questions/team names/overflow team names

Trivia data:

- 30 real event questions plus 1 sudden-death question, defined in `src/data/questions.json` as the seed/fallback
- Live-editable via `/host/questions`: once a host opens that page, the question bank is copied into Firebase (`games/{gameCode}/questions`) and becomes the live source of truth for every connected client (Player, Screen, Host, Answer key) in realtime. Only text/choices/correct-answer are editable; round and point value are fixed by design.
- Bulk `.xlsx` import/export on the same page: download a template (pre-filled with each question's fixed id/round from the current structure), fill in text/choices/correctAnswer (letter A-D), upload it back. Import only edits existing question ids — it can't add/remove/reorder. Every row must pass validation before the Import button enables; blank rows in the template are skipped so a host only needs to fill in what they're changing.
- 20 official team names in `src/data/teamNames.json` (pub-quiz pun names: `Quizzy McQuizface`, `Agatha Quiztie`, `Les Quizerables`, etc.)
- 15 additional "overflow" team names in `src/data/teamNamesOverflow.json`, same pun style. Hidden on the player join screen until all 20 primary names are taken, then revealed automatically (with a short "More names unlocked" note) so the event can scale past 20 teams without a code change on the night.
- Round-based scoring, dynamically defined: `schedule.json`'s `rounds` array is a list of `{ id, questionCount, points, breakAfter }` objects — round count, per-round question count, per-round points, and break placement are all just data now, not hardcoded (this event runs 6 rounds of 5, points 1-2-3-4-5-5, one continuous ~1 hour block with no breaks — every round has `breakAfter: false`). `src/data/scoring.json` no longer exists; points live on each round. `schedule.json` also has `suddenDeath: { enabled, points }` — a customer can fully disable sudden death, not just leave it unreachable.
- `src/lib/triviaData.ts` derives everything from `schedule.rounds` at module load: `getRegularQuestionCount()` (sum of `questionCount`), `getLastRoundId()`, `isBreakAfterQuestion()` (via precomputed cumulative round boundaries), `getSuddenDeathQuestionId()` (regular count + 1, or `null` if disabled). Nothing in the codebase hardcodes `30` or `6` anymore — grep for those literals before assuming a number is safe to change only in one place.
- Shared domain types; `RoundNumber` is now `type RoundNumber = number` (was a fixed `1|2|3|4|5|6` union) — kept as a semantic alias so signatures didn't need rewriting, but it's no longer a compile-time guarantee of a bounded round count.

Player flow:

- Default `main` game code with no player-facing game-code field
- Team join with 1-4 players
- Team name reservation and taken-name disabling, with the 15-name overflow pool unlocking once the primary 20 are full
- `team_id` localStorage rejoin
- Lobby screen
- Join-screen copy (headline, description, prize, land acknowledgment) all sourced from `src/config/site.ts`
- Question screen with server-derived timer
- Answer selection and one-time lock-in
- Auto-lock null answer on timeout
- Reveal screen with correct answer, team answer, awarded points, running score
- Final standings on phones when host enters finals
- Late join: players can join during `lobby` or `reveal` phases (not mid-question), so joining isn't locked out for the whole event after the lobby closes

Host flow:

- Passphrase gate via `VITE_HOST_PASSPHRASE` (shared `HostGate` component across all host-only routes)
- Initialize lobby
- Advance lobby -> question -> reveal -> break/final
- Current question and correct answer display
- Live timer and lock count
- Waiting-team list during questions
- Normal reveal disabled until all active teams lock or timer expires
- Force reveal override
- Scoring finalized on reveal
- Skip to finals
- Sudden death: after question 30's reveal, if there's a tie for first place, the primary advance button becomes "Start sudden death" instead of "Go to finals" and starts question 31 (the pre-authored sudden-death question, `schedule.suddenDeathQuestionId`). Reveal/scoring/advance-to-finals afterward reuse the existing generic machinery unchanged (they were already index-agnostic — the only actual gap was ever *getting to* question 31, which is what this adds). "Skip to finals" still bypasses it entirely if the host doesn't want to use it. This was fully unreachable before a bug-bash session found and fixed it — the data/UI (question editor, answer key) always presented sudden death as real, but no host action ever advanced into it.
- Full reset to lobby while preserving joined teams, clearing scores, lock times, and answers
- Lobby-only kick button for active teams
- Host team list shows active teams only; kicked teams remain in Firebase but are hidden from the sidebar
- Host scorekeeper panel shows leaderboard-ranked teams and allows manual score correction with `-1`, `+1`, or direct numeric entry
- Question editor (`/host/questions`): grouped by round, per-question text/choices/correct-answer editing with a per-row Save button, plus the bulk import panel; changes are live immediately for all connected clients
- The "next question" button label is derived from `isBreakAfterQuestion()` (schedule-driven), not a hardcoded `% 5 === 0` guess, so it never mislabels itself as "Show standings" when breaks are actually turned off

Answer key:

- `/host/answer-key` is a passphrase-gated, printable (black-on-white, print-friendly CSS) listing of every question grouped by round with the correct answer marked, plus a point value per round. Reads the same live question data as gameplay, so edits made in the question editor (including bulk import) show up here automatically.

Projector screen:

- Does not render the global app shell header, so the projector view only shows one logo/title.
- Lobby joined-team count and team list; lobby headline sourced from `src/config/site.ts`
- Live question text, **the four multiple-choice options**, point value, timer, and lock count (the options were missing from the live-question screen for a while — projector only showed text/timer while phones showed the choices; fixed)
- Reveal answer, correct-team count, and leaderboard
- Standings checkpoint screen with scores and next question number
- Final winner and standings
- Waiting state says "Waiting for host"

Leaderboard:

- Active teams ranked by score descending
- Ties ordered by fastest cumulative lock time
- Tied scores flagged for UI messaging

Branding & theming:

- All `cjsr-*` Tailwind color tokens renamed to `brand-*` (`tailwind.config.js`, `src/styles.css`, and every component using `text-brand-*`/`bg-brand-*`/`border-brand-*`) — a new customer only ever edits hex values in `styles.css`, never component code, to rebrand.
- Brand accent is `--color-brand-red` (`#6F0B00` in this deployment, CJSR's actual brand red), used for backgrounds, borders, and buttons in both themes.
- A separate `--color-brand-red-light` token exists for text/labels on dark surfaces, since the dark brand red doesn't have enough contrast to use as text on a dark background (`#FF3B30` in dark mode, `#8a0f00` in light mode).
- `--color-brand-correct` token for "this is the correct answer" UI (reveal screens, host status text) — Tailwind's default `green-300` was previously hardcoded there and was nearly invisible (~1.4:1 contrast) against the light theme's white cards.
- `--color-brand-ink` token replaces hardcoded `text-white`/`border-white` utility classes so text/borders flip correctly between themes. Do not reintroduce literal `text-white`/`border-white` in new code — use `text-brand-ink`/`border-brand-ink` instead, **except** on anything sitting on a `bg-brand-red` background, which should stay literal `text-white` since that background never changes between themes (this exact mismatch caused a real black-text-on-dark-red bug twice in one session — see Known Follow-Ups).
- Logo (background removed) added to the app header (`src/App.tsx`) and the projector top bar (`src/pages/ScreenPage.tsx`); asset lives at `src/assets/logo.png`.
- Dark/light theme toggle in the header on `/`, `/host*`, and `/screen` (the projector screen has its own copy in `ScreenShell` since it doesn't share the global header, so the host can dial the projector brightness to the venue rather than being stuck on one theme). Defaults to dark, persists to `localStorage` (key from `VITE_THEME_STORAGE_KEY`) shared across routes, applied before first paint via an inline script in `index.html` to avoid a flash of the wrong theme. Icon is an upside-down cross for dark mode, right-side-up for light mode (CJSR branding request, not a bug — a new customer may want a different icon).
- Faint `/30`-opacity dividers (leaderboard rows, list separators) were bumped to `/50` opacity — the original value was under the WCAG 3:1 non-text contrast guideline in both themes.

Stress simulation:

- `scripts/simulateFullGame.mjs` runs deterministic full-game simulations.
- Usage (question count is no longer a CLI arg — it's derived from `schedule.json`'s `rounds`):

```bash
node scripts/simulateFullGame.mjs 500 20
```

- Latest run simulated 500 games, 20 teams, 30 regular questions (derived from `schedule.json`), and 300,000 answer records.
- Result: all simulation invariants passed.
- Latest observed output included:
  - Correct answer rate: `40.54%`
  - Timeout/null answer rate: `3.46%`
  - Winning score range: `48 - 78`
  - All team score range: `7 - 78`
- This sim is pinned to exactly 20 teams by design and does not model the overflow team-name pool; it exercises the primary 20-team path only.

## Current Behavior Details

Scoring:

- Scores are finalized when the host advances from `question` to `reveal`.
- Missing active-team answers are filled as null/timed-out answers.
- Correct answers receive the round point value.
- Team `score` and `cumulativeLockMs` are updated in Firebase.

Reset:

- Host reset now writes fresh lobby meta.
- Keeps team rows.
- Sets all team scores to `0`.
- Sets all cumulative lock times to `0`.
- Deletes `answers`.
- Does not touch `questions` — question edits (including bulk import) persist across resets.

Kick:

- Only enabled in lobby.
- Marks team inactive.
- Resets that team score/lock time.
- Deletes the team-name reservation so the name can be picked again.
- The host sidebar renders active teams only, so kicked teams disappear from the visible lobby list.
- Required Firebase rules have been deployed.
- This is the moderation mechanism for free-text team naming (see Player flow) — scan the lobby before starting and kick anything inappropriate, rather than dedicated moderation tooling.
- Important operational/testing note: **team rows can never be fully deleted via client writes, only marked inactive.** The `teams/$teamId` rule's `.write` condition starts with `newData.exists() && ...`, which is only true for writes that set a value — a delete (`newData.val() === null`) makes `newData.exists()` false, so the whole condition short-circuits to `false` and the rule rejects it. Combined with kick only working in the `lobby` phase, this means a team joined outside the lobby (including via a live smoke test against the real "main" game) **cannot be removed at all** once created — not kicked (wrong phase), not deleted (rule blocks it). Never run a live join test against the production game unless it's currently in `lobby` phase; verify client-side behavior (rendering, validation, "taken" checks) without actually submitting instead.

Manual score corrections:

- Host scorekeeper controls are available in the Host view.
- `-1` and `+1` buttons update immediately.
- Direct score input commits on blur or Enter.
- Scores are clamped to whole numbers at or above zero.
- This uses the existing team write rule by writing the full team record with an updated score.

Question editing:

- `/host/questions` seeds `games/{gameCode}/questions` from `SEED_QUESTIONS` the first time it's opened (no-op if already seeded, so host edits are never clobbered by a later visit).
- Per-question Save writes only that question via a `set()` at its exact path; the seed step and bulk import both use a multi-location `update()` across all affected question paths rather than a single `set()` on the parent node, because a Firebase RTDB `.write` rule defined only on the `$questionId` child does not authorize a `set()` on its parent — this is the same multi-location-update pattern already used by `finalizeQuestionScores`/`resetGameForReplay`. `ensureQuestionsSeeded` and `bulkWriteQuestions` in `firebaseData.ts` share the same update-building logic.
- Round and question id are fixed everywhere (single-row editor and bulk import both); only text, the 4 choices, and the correct-answer index are editable.
- Bulk import UI (`ImportPanel` in `HostQuestionsPage.tsx`): download template button (generates client-side via SheetJS, one row per current question with id/round pre-filled), file upload, a preview table showing per-row validation status, and an Import button disabled until every row is valid. Watch out if touching this code: the "success message" state and the "clear the loaded file" state must not both call the same reset function, or the success message gets wiped before it renders — this exact bug shipped once and was caught by a live Playwright test, not by lint/build/typecheck.
- A row is only treated as "the host is editing this" if it has actual content in text/choices/answer — a row with just the pre-filled id/round (i.e. untouched from the downloaded template) is skipped, not validated. `questionImport.ts`'s `parseQuestionWorkbook` reads the sheet cell-by-cell via its decoded range rather than relying on `sheet_to_json`'s default row handling, specifically so a blank row in the middle of the file doesn't shift every subsequent row's reported row number — both of these were real bugs (the "skip untouched rows" claim was false, and error messages could point at the wrong physical spreadsheet row) caught by a bug-bash session and fixed; get the git history on `questionImport.ts` before re-deriving this logic from scratch.

UI repetition cleanup:

- `src/App.tsx` now wraps routes in `AppLayout`, which hides the global header on `/screen`.
- The global header remains on `/` and `/host*`; host/admin nav still appears only on `/host*`.
- Host unlocked headline was shortened to "Control desk" because the global header already supplies the trivia context.
- Screen waiting/lobby copy was shortened so the projector experience does not stack multiple branding/Trivia labels.

## Product Direction: White-Label Template

After the CJSR event, the owner decided to turn this codebase into a resellable trivia-night product rather than a one-off CJSR app: clone the repo per customer, reconfigure, redeploy under the customer's own Firebase project. Not a multi-tenant SaaS — no auth/tenant-isolation work is planned. A detailed implementation plan exists (was last saved to a local Claude Code plan file during a planning session; if that's not available, this section plus a fresh audit of any remaining CJSR-specific content is enough to reconstruct it). Two phases:

**Phase 1 — branding/copy/import/team-naming: DONE.**

- ✅ All CJSR-specific copy centralized into `src/config/site.ts` instead of scattered literal strings across `App.tsx`/`ScreenPage.tsx`/`PlayerPage.tsx`. Zero visible change for the current CJSR event — verified live.
- ✅ `cjsr-*` Tailwind tokens renamed to `brand-*` everywhere (`tailwind.config.js`, `src/styles.css`, 9 components). Verified live — dark/light theme, colors, all copy unchanged.
- ✅ Logo asset renamed to generic `src/assets/logo.png`.
- ✅ `template` branch created off `main` with CJSR-specific root files (`CJSR LOGO.jpg`, question-bank docx/generator script) and internal docs (this file, `PROGRESS.md`, `IMPLEMENTATION_PLAN.md`, `cjsr-trivia-codex-prompt.md`) removed. `main` keeps everything untouched as the live CJSR instance. README updated with a "Setting up for a new customer" checklist. `template` is periodically merged forward from `main` to inherit generic (non-CJSR-specific) improvements — it is **not** automatically kept in sync, check its log.
- ✅ Bulk `.xlsx` question import/export shipped on `/host/questions` (see "Question editing" above for the mechanism). Uses `xlsx` (SheetJS) installed from `https://cdn.sheetjs.com/...` rather than the npm registry — the latest npm-published version (0.18.5) has two unpatched high-severity CVEs (prototype pollution, ReDoS) that matter here because this code parses untrusted host-uploaded files. The CDN-installed version (0.20.3 as of this writing) is patched. If bumping this dependency, get the current version+URL from SheetJS's own docs, not just `npm update` (npm's registry copy won't move past 0.18.5). The `xlsx` import is also dynamically `import()`ed (not a static top-level import) so it code-splits into its own chunk and isn't downloaded by every player joining on `/` — it was originally static and nearly doubled the main bundle (447KB → 947KB) before this was caught and fixed during the same session.
- ✅ Free-text team naming: a "name your own team" text input sits alongside the curated-name buttons on `/`, calling the same `handleJoin`. If `TEAM_NAMES` is empty, only the text input renders (no separate mode flag). Shows an instant client-side "(taken)" check against the live roster before submitting. `database.rules.json`'s team-write rule got one addition, a 40-char cap on `teamName` (`newData.child('teamName').val().length <= 40`), matching the existing pattern used for question text. Moderation leans on the existing kick feature, not new tooling.

**Phase 2 — structural flexibility (bigger, touches types/DB rules/scoring):**

- ✅ **E1 done**: unlimited questions and dynamic round definitions. `schedule.json`'s `rounds: [{ id, questionCount, points, breakAfter }]` array replaced the old fixed `questionsPerRound`/`regularQuestionCount`/`breaksAfterQuestions` fields and `scoring.json` entirely (deleted). `RoundNumber` is now `type RoundNumber = number`, no longer a `1|2|3|4|5|6` union. `database.rules.json`'s round bound (was 1-6) and question-index bound (was 1-31) loosened to generous static ceilings (200 and 1000) rather than exact limits, since the rules' job is shape/sanity validation and the host UI is the real enforcement layer. **Scope was deliberately JSON-config-only, no new live host UI** — a customer edits `schedule.json` once during event setup, same as they already hand-edit `questions.json`/`teamNames.json`; the round structure isn't something a host tweaks live mid-event. Verified as a zero-visible-behavior-change refactor for CJSR's actual event (same 6 rounds of 5, same points, same no-breaks, same sudden death) via `simulateFullGame.mjs` output matching byte-for-byte and isolated `tsx` checks importing the real functions — **not** via a live test against the production game, since `games/main` still holds CJSR's actual final results and can't be safely experimented on (see the note under "Kick" above). A second isolated check proved the new flexibility itself works, by temporarily swapping in a completely different round shape (3 rounds of 3/8/2 questions, points 2/10/100, sudden death disabled, 20s timer) and confirming every derived value adapted correctly, then restoring the real file.
- E2 was split into two increments given its size: **both are now done.**
  - ✅ **E2a done**: multi-select questions (more than one correct choice). `Question` is now a real discriminated union — `MultipleChoiceQuestion` (`type: 'multiple_choice'`, `answer: ChoiceIndex`) or `MultiSelectQuestion` (`type: 'multi_select'`, `answers: readonly ChoiceIndex[]`), where `ChoiceIndex = 0|1|2|3`. Existing stored/seed questions with no `type` field parse as `multiple_choice` by default (same backward-compat pattern as `media`), so CJSR's real 31 questions are unaffected. `Answer` gained `choiceIndexes: readonly ChoiceIndex[] | null` alongside the existing `choiceIndex` — exactly one of the two is populated depending on the question's type. Scoring (`finalizeQuestionScores` in `firebaseData.ts`, now takes the resolved `Question` instead of a bare correct-index number) does exact-set-match for multi-select: every correct choice selected, no incorrect ones, or zero points — no partial credit. A question's `type` is treated as fixed/structural, like `round`/`id` already were — it's set once when the question is authored (seed JSON or, in principle, a future add-question flow) and is not editable live via either the single-row host editor or bulk `.xlsx` import; this is a deliberate deviation from the original design sketch (which proposed a live type-toggle in the editor) made during implementation, for consistency with the pre-existing "round and id are fixed, only content is host-editable" rule and because there's no live "add a new question" flow to make a type-picker meaningful mid-event. The single-row editor still renders differently per type — checkboxes for multi-select, radio buttons for multiple-choice — it just can't change which one a question is. Bulk import's `correctAnswer` column now accepts comma-separated letters ("A,C") for multi-select rows (validated against the question's existing type via the row's `existing.type` lookup, not a new column), and the downloaded template gained a read-only `type` column so hosts can see which rows are which (ignored on upload). `database.rules.json`'s question rule now branches on `type` to require either `answer` or `answers` (1-4 entries, membership-only — cardinality is bounded but individual values aren't range-checked, matching the existing looseness of the `choices` field validation); the answer-write rule gained a matching loose bound on `choiceIndexes`. All 4 render surfaces (player answering/reveal, screen question/reveal, host's "Correct:" line, the printable answer key) got type-aware branches — multi-select renders as toggleable buttons/checkboxes instead of single-select, and reveal marks every correct choice instead of one. Verified: the exact-set-match scoring function was unit-tested in isolation via `vite-node` (not plain `tsx` — `firebaseData.ts` reads `import.meta.env` at module load, which only resolves under Vite's runtime) covering reordered-selection, missing-one, over-selection, and empty-selection edge cases, all passing; a temporary throwaway preview route exercised the real host-editor row component with fake multi-select and multiple-choice questions (checkboxes vs. radios, correct toggle behavior, correct saved shape), then was fully deleted; the real production `/screen` and `/host/answer-key` were re-screenshotted against CJSR's actual live game state and confirmed pixel-identical with zero console errors, proving no regression for the 31 real (implicitly multiple-choice) questions.
  - ✅ **E2b done**: free-text questions with fuzzy-matched auto-grading and a host review step. `Question` gained a third union member, `FreeTextQuestion` (`type: 'free_text'`, `acceptedAnswers: readonly string[]`) — this forced `choices` out of the shared `QuestionBase` and onto `MultipleChoiceQuestion`/`MultiSelectQuestion` only (free-text questions have none), which rippled through every file that previously read `question.choices` unconditionally, the same set of files E2a touched. `Answer` gained `textAnswer: string | null`. New `src/lib/textMatching.ts` (`isFuzzyMatch`, `normalizeAnswerText`) does normalization (lowercase/trim/strip punctuation/collapse whitespace) plus a Levenshtein-distance tolerance scaled to the accepted answer's length (`min(2, floor(length/4))`) — no per-question tunability, the review step is the actual safety net, not algorithm tuning. `finalizeQuestionScores` grades free-text questions through this matcher exactly like the other two types, still synchronously at the `question`→`reveal` transition — **no new game phase was added**, matching the mechanism agreed on before implementation. The host-review workflow lives entirely in a new `FreeTextReviewPanel` on `HostPage.tsx` (stacked below the existing scorekeeper): a dropdown picks any free-text question that has at least one answer (defaults to the current question if it's free-text), lists each team's submitted text with a Correct/Incorrect/Pending badge, and two toggle buttons wired to a new `setAnswerCorrectness(gameCode, team, answer, points, isCorrect)` in `firebaseData.ts`. That function reconstructs the *entire* answer record before writing — Firebase's multi-location `update()` replaces whole nodes at a given path rather than merging, the same reason `setTeamScore`/`kickTeamFromLobby` always rebuild the full object — and adjusts `team.score` by the delta between the old and new `pointsAwarded`. Toggle buttons are disabled until an answer has actually been graded (`isCorrect !== null`, i.e. the question has been through at least one `finalizeQuestionScores` pass) to avoid a confusing pre-finalize override. Because every write goes through the same live-subscribed `answers/$teamId/$questionId` path, a host correcting a grade after the fact automatically updates that team's already-rendered reveal screen and final standings — no extra plumbing needed. Editor: free-text rows show a second textarea ("Accepted answers, one per line") instead of the 4-choice grid; bulk `.xlsx` import reuses the `correctAnswer` column with semicolon-separated accepted variants for free-text rows (no new column). `database.rules.json`'s question rule gained a `type === 'free_text'` branch requiring `acceptedAnswers` (1-10 entries) instead of `choices`/`answer`; the answer rule gained a `textAnswer` length bound (≤200 chars). All 4 render surfaces got a free-text branch: player gets a text `<input>` instead of choice buttons and a reveal showing accepted answers + their own submitted text (trusting the *stored* `isCorrect`/`pointsAwarded` rather than recomputing client-side, specifically so a host's manual correction is reflected — unlike MC/multi-select, which intentionally recompute client-side as a defensive guard against a previously-fixed stale-points bug, see `simulateFullGame.mjs`'s `getRevealDisplayPoints` assertion); screen shows accepted answers on reveal instead of a choice grid; host's "Correct:" line becomes "Accepted:"; the answer key shows "(free text, auto-graded)" plus the accepted-answer list. Verified: `isFuzzyMatch` unit-tested via `vite-node` across 12 cases (typo tolerance, case/punctuation normalization, a too-different string correctly rejected — the one test failure during verification was a wrong test expectation on my part, not a code bug, confirmed by hand-computing the actual edit distance); `isAnswerCorrect`'s free-text branch unit-tested the same way (exact match, fuzzy typo, wrong answer, timeout, empty string); a temporary throwaway preview route exercised the real `QuestionEditorRow` (free-text textarea vs. MC radios, correct saved shape) and the real `FreeTextReviewPanel` (three fake teams — correct/incorrect/pending — confirmed correct badge colors, confirmed the pending row's toggle buttons are disabled, confirmed clicking "Mark correct" fires the override with the right point value), then was fully deleted; all 4 real production routes (`/screen`, `/host`, `/host/questions`, `/host/answer-key`) were re-checked against CJSR's actual live game with zero console errors, confirming the `choices`-out-of-base-type restructuring didn't break anything for the 31 real (implicitly multiple-choice) questions.
- Per-round and per-question customizable scoring — per-round points already done as part of E1; a per-question override was never built for E2, since none of CJSR's real questions need it (all 31 use each round's shared point value). Would be straightforward to add now that the question-type union exists.
- ✅ **E5 done**: configurable max players per team. `Team['playerCount']` (and the matching `JoinTeamInput` field) loosened from the fixed `1|2|3|4` union to `number`; the real limit now lives in a new `SiteConfig.maxPlayersPerTeam` field (`src/config/site.ts`), set to `4` for CJSR — zero behavior change. The join-screen button row and its grid (`src/pages/PlayerPage.tsx`) are generated from that config value instead of a hardcoded `[1,2,3,4]` tuple + `grid-cols-4` class (Tailwind can't dynamically construct `grid-cols-N` at build time since it purges unused classes, so the grid uses an inline `gridTemplateColumns` style instead). `database.rules.json`'s `playerCount` bound loosened from `<= 4` to a generous `<= 20` static ceiling, same reasoning as E1's round/question-index bounds — not yet deployed (`npx firebase-tools deploy --only database` still pending, harmless to leave undeployed since the old `<=4` bound still accepts CJSR's real data). Verified live by temporarily setting `maxPlayersPerTeam: 6` against the real dev server and confirming the button row/grid adapted correctly, then restoring `4`.
- ✅ **E6 done**: image and video clue questions via Firebase Storage. `Question` gained a `media: { type: 'image'|'video'; url: string } | null` field (required-but-nullable, not optional-undefined, since Firebase RTDB writes reject `undefined`) — every construction site (seed JSON parsing, Firebase read/write, xlsx import/validation, the host editor) was updated to carry it through explicitly. Firebase Storage is wired up (`src/lib/firebase.ts`, new `src/lib/storageMedia.ts`, new `storage.rules`, new `storage` block in `firebase.json`) but gated behind the new optional `VITE_FIREBASE_STORAGE_BUCKET` env var — left blank for CJSR, so `firebaseServices.storage` stays `null` and the host editor shows "Media upload is not configured for this deployment" instead of an upload button. Rendering: `/screen` (`ScreenPage.tsx`) renders both image and video (video with standard `controls`+`autoPlay`, since the projector is the only place playing audio in the room); `/` and `/host` render image only, never video, per the roadmap's original design note; `/host/answer-key` shows a text note ("(image/video clue)") rather than embedding media in the print layout. The host editor (`/host/questions`) gained a per-row "Upload image/video" button (hidden, with an explanatory message, when Storage isn't configured) that uploads straight to Storage and stores the resulting URL on local row state — the host still has to click the existing Save button to persist it, consistent with every other field in that editor. Bulk `.xlsx` import gained two new optional columns, `mediaType`/`mediaUrl`, for pasting an already-hosted URL — bulk import does **not** support uploading binary files through the spreadsheet, only the single-row editor's button does real uploads. `database.rules.json`'s question rule and `scripts/validateQuestions.mjs` both gained matching shape validation for the optional `media` object. Verified live: a temporary throwaway dev-only route/component proved the actual `MediaClue` rendering logic (image/video/null) works, then was fully deleted; the real production `/screen` (still showing CJSR's actual final question 30 in `reveal` phase) was screenshotted and confirmed pixel-identical to before with zero console errors, proving no regression for the 31 real media-less questions; `/host/questions` was confirmed to show the "not configured" message correctly. Not built (deferred, not forgotten): deleting the old Storage file when a host replaces or removes a question's media — orphaned files are an accepted gap, not cleaned up automatically; also no rollback if a host uploads media and then never clicks Save (the file stays in Storage, unreferenced by any question).

Phase 1 is fully done. Phase 2 is now fully done too: E1 (dynamic rounds), E5 (team cap), E6 (media questions), E2a (multi-select), and E2b (free-text) are all shipped. Nothing on the original roadmap remains unscoped — any further work is net-new scope the user hasn't asked for yet, so scope it fresh (design + explicit confirm with the user) before implementing, same as every part so far.

### Setup Wizard Roadmap

A separate, later roadmap (external plan, reviewed and refined in-session — not the E1-E6 roadmap above) aims at making white-labeling itself easy: a guided setup wizard instead of hand-editing files per the README checklist. Deliberately **one deployment per customer** — no multi-tenant SaaS work planned until/unless multiple customers genuinely need to share infrastructure. To avoid colliding with the "Phase 1"/"Phase 2" labels already used above for the E1-E6 roadmap, this one is numbered as **Stage 0-6**:

- Stage 0: stable baseline (`template` merged forward, caught up to `main`).
- ✅ **Stage 1 done**: machine-editable instance configuration. New `src/config/instance.config.json` consolidates what used to be spread across `src/config/site.ts` (hardcoded literals), `src/styles.css` (hardcoded `:root`/`:root[data-theme='light']` hex values), and three env vars (`VITE_SITE_TITLE`, `VITE_THEME_COLOR`, `VITE_THEME_STORAGE_KEY`) into one validated JSON file: copy, storage keys, `maxPlayersPerTeam`, and the full 9-token light/dark color palette. `site.ts` is now a thin typed/validated loader over it (throws a clear error at import time on malformed config, same philosophy as `triviaData.ts`'s `parseQuestion`) — critically, `siteConfig`'s public shape and import path are unchanged, so every existing consumer needed zero edits. A new `instance-branding` Vite plugin (`vite.config.ts`) injects the page `<title>`, `<meta name="theme-color">`, and a generated CSS-variable `<style>` block into `index.html`'s `<head>` at build/dev time, sourced from the same JSON — this replaces Vite's old built-in `%VITE_VAR%` HTML interpolation for those 3 values, so they're retired from `.env.local` entirely (`.env.local` now holds only genuinely deployment-specific/secret values: Firebase config + the host passphrase). The plugin's `transformIndexHtml` hook **must** use `order: 'pre'` — without it, Vite's built-in HTML plugin extracts `<style>` tag content into the CSS pipeline and tries to parse the literal `__BRAND_COLORS__` placeholder text as CSS before this plugin ever runs, a real build failure hit and fixed during implementation. `scripts/validateQuestions.mjs` (still that filename despite validating more than questions — not renamed, not worth the extra diff) gained shape validation for `instance.config.json` (required strings, `territoryText` string-or-null, positive `maxPlayersPerTeam`, all 9 color tokens present as `{dark, light}` hex pairs), and `npm run build` now runs it automatically via a new `prebuild` script, so a malformed config can't silently reach a shipped build. `schedule.json`/`questions.json`/`teamNames*.json` and the logo (`src/assets/logo.png`) were deliberately **not** relocated into new `data/`/`branding/` folders like the original plan's file-tree diagram suggested — they already satisfied "wizard edits data, not code" (JSON files, or a file the wizard just overwrites at a fixed path with zero code changes), so moving them would only have added diff and import-path churn for no benefit. Fonts (`--font-display`/`--font-body`) are still hardcoded in `styles.css`, out of scope for this stage. Verified: `validate:data`/`lint`/`build` all pass (including a deliberate malformed-config test that confirmed the validator's error messages, then reverted); live-checked against real production `/screen` and `/`, `/host`, `/host/questions`, `/host/answer-key` — title, `theme-color` meta, both themes' colors, and dark/light toggle all pixel/value-matched the pre-refactor site with zero console errors. That live check caught a real bug before it shipped: `src/hooks/useTheme.ts` independently read `VITE_THEME_STORAGE_KEY` for its own `localStorage` persistence (separate from `index.html`'s inline pre-paint script, which can't import TS) — after retiring that env var, `useTheme.ts` silently fell back to a different default key (`'trivia-theme'`) than the pre-paint script now used (`'cjsr-theme'` via the plugin), so the theme toggle stopped persisting. Fixed by pointing `useTheme.ts` at `instanceBranding.themeStorageKey` from the new loader instead. README's "Setting up for a new customer" checklist updated to match (one JSON file instead of 3 source files + 3 env vars).
- Stage 2: local browser setup wizard (`npm run setup`, local-only, writes `instance.config.json`/data files/logo; no `/setup` route ships in production builds). Not started. Its "Questions" step will need a type picker (multiple-choice/multi-select/free-text) that doesn't exist in any current UI — the live question editor deliberately treats a question's `type` as fixed-at-authoring (see E2a above), so the wizard is the intended place for that to finally live.
- Stage 3: guided Firebase provisioning/deployment (`npm run launch`). Not started.
- Stage 4: real authentication (Firebase Auth replacing `HostGate`, privileged mutations behind a trusted server boundary, anonymous player identities + ownership-based rules instead of shape-only validation). Not started — this is where the security gap already documented under "Known Follow-Ups > Security/architecture" actually gets fixed. Explicitly flagged as needing a deliberate decision, not a default: Stages 2-3 make it easy to spin up more customer deployments that still ship with today's passphrase-only/shape-only-rules posture, so whether that's acceptable before Stage 4 lands is a call for whoever's selling deployments, not something to assume either way.
- Stage 5: multi-event-per-customer (`events/{eventCode}/{config,questions,runtime}` replacing the current single `games/{gameCode}`, an authenticated `/host/events` dashboard). Not started.
- Stage 6: multi-tenant SaaS conversion. Deliberately deferred indefinitely — "closer to a product rewrite than a wizard feature," per the plan that proposed it; only worth doing if multiple customers genuinely need to share one deployment.

## Known Follow-Ups

High priority:

- Keep real event questions in `src/data/questions.json` (or via `/host/questions` once seeded, including bulk import) and run validation after edits to the seed file.
- Run a final dry run after real questions are loaded.
- Re-run `npx firebase-tools deploy --only hosting` — everything under "Current Git State" above is still only on the dev server / GitHub, not on the live site.
- Do a live-browser smoke test of the theme toggle and the reveal screens in both themes before the next event; verification so far has been build/lint plus live Playwright-driven checks of individual features as they were built, not a full click-through of a live event end-to-end.
- No terminal or local process needs to run during the event itself — hosting is a static `dist` build served from Firebase's CDN, and the Realtime Database is a fully managed cloud service. `npm run dev` is local-preview only. The one prerequisite is the hosting redeploy above, done ahead of time.

Security/architecture:

- Host actions currently use passphrase-gated browser writes and permissive-enough Firebase rules for event MVP testing.
- Safer production architecture would move host mutations, scoring, reset, and kicking into serverless functions using Firebase Admin credentials.
- There is no auth; `VITE_HOST_PASSPHRASE` ships in the client bundle and any Firebase write that matches the shape rules in `database.rules.json` is accepted regardless of who sends it (e.g. a team could edit its own score from the browser console, or anyone could edit questions without knowing the passphrase if they call the Firebase write directly). Acceptable for a low-stakes volunteer event, not for anything higher-stakes without real auth — worth prioritizing over further feature work once this is being sold to paying customers.

Feature follow-ups:

- Host tie indicators (leaderboard already flags ties and the sudden-death trigger reacts to a top-place tie; a more visible in-UI indicator is still just a nice-to-have).
- Host pacing and schedule support.
- Reliability/failure dry run.
- Question editor/import currently support edit-only (text/choices/answer); add/delete/reorder was explicitly deferred to avoid disturbing round-count and sudden-death invariants (this is also exactly what Phase 2's dynamic-rounds work would unlock).

Accessibility:

- A contrast-focused a11y pass has been done (see Branding & theming above) covering the correct-answer color, disabled-state colors, and faint dividers across both themes.
- Not yet done: a real screen-reader pass and automated tooling (axe/Lighthouse) against the live, running app.
- Watch for the `bg-brand-red` + theme-flippable-text mismatch described above; it's the specific bug pattern that recurred twice in this project (black text on dark red in light mode).

## Git / Repo Gotchas

The user previously had trouble with GitHub Desktop creating or looking for an extra nested `cjsr-trivia` folder. The actual working repo root is:

```text
C:\Users\ericn\Documents\CJSR Trivia
```

Git sometimes warns:

```text
warning: unable to access 'C:\Users\ericn/.config/git/ignore': Permission denied
```

This warning has not blocked commits.

Windows line-ending warnings have also appeared and are normal for this repo:

```text
LF will be replaced by CRLF the next time Git touches it
```

Firebase Hosting creates `.firebase/hosting.ZGlzdA.cache` during deploy. `ZGlzdA` is base64 for `dist`; it is a deploy cache for the built output. It can be left alone, but ideally `.firebase/` should be ignored if future commits should avoid cache churn.

This file (`CLAUDE.md`) only exists on `main`, not on `template` (it's one of the files stripped for the resellable template). Treat it as a helpful summary, not ground truth — when in doubt, check the actual source files or `git log` rather than assuming this document is exhaustive or current.

## Files Left Untouched

These predate the app scaffold and were intentionally left alone on `main` (removed on the `template` branch):

- `build_question_bank.py`
- `CJSR_Volunteer_Appreciation_Trivia_Question_Bank.docx`
