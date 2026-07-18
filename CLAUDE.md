# CJSR Trivia Project Handoff

## Project

This repo contains the CJSR Volunteer Appreciation Trivia live multiplayer web app.

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
- `/host/questions` - passphrase-protected live question/answer editor
- `/screen` - read-only projector display
- `/host/answer-key` - passphrase-protected printable answer key

Navigation:

- The player root route is intentionally clean and has no visible nav links.
- Host/admin nav appears only while on host routes and links to Host, Questions, Screen, and Answer key.
- The projector route intentionally hides the global app header; `/screen` owns its own logo/title/status header to avoid duplicated CJSR branding on the display.
- The global header row no longer force-stacks on mobile; it's a single wrapping flex row so the dark/light theme toggle sits beside the logo instead of dropping to its own row when there's no host nav to share space with.

Default game code:

- `main`

## Current Git State

Recent commits (newest first):

- `3058d57 New copy`
- `fbd51e3 Fix`
- `ff71baf Copy changes`
- `ba1be41 Extra team names`
- `ede1b1c Description change`
- `425c5f6 Edit state`
- `de2c389 Changes to copy`
- `dd78b09 Answer Key`
- `4119a5d screen dark mode`
- `ea4a5e9 Claude.md`
- `317730e Claude.md`
- `43bf5d3 Fix`
- `2394914 Dark light mode`

Important: the live Firebase Hosting site is available at `https://cjsr-trivia.web.app`. It was redeployed (`npx firebase-tools deploy --only hosting`) after the initial red/logo rebrand (commit `1900d1f`), but everything since — the dark/light theme system, contrast fixes, mobile header layout fix, the live question/answer editor, the printable answer key, all player-facing copy changes, and the overflow team names — has **not** been confirmed deployed to hosting as of the last session. Re-run the hosting deploy command before the event. (Database rules, including the new `questions` write rule, **have** been deployed live via `npx firebase-tools deploy --only database` — that part is current.)

This repo's git state changes without an explicit `git commit`/`git push` from a session. Something in this environment (observed to be outside of any Claude Code git command) auto-commits and auto-pushes working-tree changes to `origin/main`, using generic messages like `Fix` and `UI improvements`. Practically this means: assume every edit lands on GitHub immediately, don't rely on commit messages here to describe *why* something changed (check the conversation/PROGRESS notes instead), and don't assume `git status` being clean means nothing changed recently — always diff against what you expect.

## Environment

The app expects Firebase browser config in `.env.local` using Vite env variables. Do not commit `.env.local`.

Expected variables:

```text
VITE_FIREBASE_API_KEY=
VITE_FIREBASE_AUTH_DOMAIN=
VITE_FIREBASE_DATABASE_URL=
VITE_FIREBASE_PROJECT_ID=
VITE_FIREBASE_STORAGE_BUCKET=
VITE_FIREBASE_MESSAGING_SENDER_ID=
VITE_FIREBASE_APP_ID=
VITE_HOST_PASSPHRASE=
```

Do not expose Firebase Admin credentials through any `VITE_` variable.

## Commands

Use these before commits:

```bash
npm run validate:data
npm run lint
npm run build
```

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
- `questions/$questionId` write rule (shape-validated: id/round/text/choices/answer), enabling the live question editor at `/host/questions`

Hosting already deployed:

- Latest confirmed UI deploy to `https://cjsr-trivia.web.app` predates the theme system and everything listed under "Current Git State" above — see that section before assuming any specific feature is live.

## Architecture

Key files:

- `src/lib/firebase.ts` - Firebase browser initialization and missing-env handling
- `src/lib/firebasePaths.ts` - typed path helpers for game, teams, reservations, answers, questions
- `src/lib/firebaseData.ts` - Firebase read/write helpers, including `writeQuestion`/`ensureQuestionsSeeded`
- `src/lib/hostState.ts` - host game-state transitions
- `src/lib/triviaData.ts` - question/scoring/schedule helpers; `SEED_QUESTIONS` is the static build-time fallback, `resolveQuestions(gameState)` prefers live Firebase-backed questions when present
- `src/lib/leaderboard.ts` - leaderboard ranking helper
- `src/hooks/useGameSubscription.ts` - realtime subscription with fallback behavior; the single `GameState` blob now also carries `questions`
- `src/hooks/useServerTimeOffset.ts` - Firebase server time offset
- `src/hooks/useQuestionTimer.ts` - server-derived question countdown
- `src/pages/PlayerPage.tsx` - player join/play/reveal/final UI
- `src/pages/HostPage.tsx` - host controls
- `src/pages/HostQuestionsPage.tsx` - live question/answer editor (text, 4 choices, correct answer per question; round/points fixed, no add/delete)
- `src/pages/ScreenPage.tsx` - projector display
- `src/pages/AnswerKeyPage.tsx` - printable, host-gated answer key; reads the same live question data as everything else
- `src/components/host/HostGate.tsx` - shared passphrase-unlock gate, used by `/host`, `/host/questions`, and `/host/answer-key`
- `src/hooks/useTheme.ts` - dark/light theme state, persisted to `localStorage` under `cjsr-theme`, applied via `data-theme` on `<html>`
- `src/components/common/ThemeToggle.tsx` - header theme-toggle button (upside-down cross for dark, right-side-up cross for light)
- `src/assets/cjsr-logo.png` - CJSR star logo with the white background removed (flood-fill from image edges so the white "cjsr" lettering stayed intact); used in the app header and the projector top bar
- `src/styles.css` - CSS custom properties for the `cjsr-*` color tokens; dark values live on `:root`, light overrides live on `:root[data-theme='light']`
- `tailwind.config.js` - maps the `cjsr-*` Tailwind color classes to the CSS custom properties above
- `scripts/simulateFullGame.mjs` - deterministic full-game stress simulation
- `scripts/validateQuestions.mjs` - validates `questions.json`, `teamNames.json`, and `teamNamesOverflow.json` (including cross-file duplicate name checks)
- `database.rules.json` - Realtime Database rules
- `firebase.json` - Firebase hosting/database config

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
- `questions` - live question bank (id, round, text, 4 choices, correct answer index), keyed by question id; only exists once a host has opened `/host/questions` at least once (it self-seeds from `src/data/questions.json` on first load via `ensureQuestionsSeeded`). Until seeded, every page transparently falls back to the static seed file, so gameplay works either way.

Team records are not deleted when kicked. They are marked:

```json
{ "isActive": false }
```

This preserves history while removing the team from active play and player rejoin.

## Implemented Features

Foundation:

- Vite React TypeScript app
- React Router routes
- Tailwind and CJSR visual theme
- Global error boundary
- Firebase Hosting config
- Data validation script for questions/team names/overflow team names

Trivia data:

- 30 real event questions plus 1 sudden-death question, defined in `src/data/questions.json` as the seed/fallback
- Live-editable via `/host/questions`: once a host opens that page, the question bank is copied into Firebase (`games/{gameCode}/questions`) and becomes the live source of truth for every connected client (Player, Screen, Host, Answer key) in realtime. Only text/choices/correct-answer are editable; round and point value are fixed by design.
- 20 official team names in `src/data/teamNames.json` (pub-quiz pun names: `Quizzy McQuizface`, `Agatha Quiztie`, `Les Quizerables`, etc.)
- 15 additional "overflow" team names in `src/data/teamNamesOverflow.json`, same pun style. Hidden on the player join screen until all 20 primary names are taken, then revealed automatically (with a short "More names unlocked" note) so the event can scale past 20 teams without a code change on the night.
- Round-based scoring
- Schedule/break metadata (this event runs as one continuous ~1 hour block with no scheduled breaks — see `schedule.json`)
- Shared domain types

Player flow:

- Default `main` game code with no player-facing game-code field
- Team join with 1-4 players
- Team name reservation and taken-name disabling, with the 15-name overflow pool unlocking once the primary 20 are full
- `team_id` localStorage rejoin
- Lobby screen
- Join-screen copy covers format (30 questions, 1 hour, no breaks, rising stakes), the 15-second answer-and-lock-in window, Canadian-music theme, and the prize (CJSR swag and glory)
- Question screen with server-derived timer
- Answer selection and one-time lock-in
- Auto-lock null answer on timeout
- Reveal screen with correct answer, team answer, awarded points, running score
- Final standings on phones when host enters finals

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
- Full reset to lobby while preserving joined teams, clearing scores, lock times, and answers
- Lobby-only kick button for active teams
- Host team list shows active teams only; kicked teams remain in Firebase but are hidden from the sidebar
- Host scorekeeper panel shows leaderboard-ranked teams and allows manual score correction with `-1`, `+1`, or direct numeric entry
- Question editor (`/host/questions`): grouped by round, per-question text/choices/correct-answer editing with a per-row Save button; changes are live immediately for all connected clients

Answer key:

- `/host/answer-key` is a passphrase-gated, printable (black-on-white, print-friendly CSS) listing of every question grouped by round with the correct answer marked, plus a point value per round. Reads the same live question data as gameplay, so edits made in the question editor show up here automatically.

Projector screen:

- Does not render the global app shell header, so the projector view only shows one CJSR logo/title.
- Lobby joined-team count and team list; lobby headline reads "Volunteer Appreciation Trivia"
- Live question text, point value, timer, and lock count
- Reveal answer, correct-team count, and leaderboard
- Standings checkpoint screen with scores and next question number
- Final winner and standings
- Waiting state says "Waiting for host"

Leaderboard:

- Active teams ranked by score descending
- Ties ordered by fastest cumulative lock time
- Tied scores flagged for UI messaging

Branding & theming:

- Brand accent renamed from the original `cjsr-magenta` (`#ff4f78`) token to `cjsr-red` (`#6F0B00`, CJSR's actual brand red), used for backgrounds, borders, and buttons in both themes.
- A separate `cjsr-red-light` token exists for text/labels on dark surfaces, since the dark brand red doesn't have enough contrast to use as text on a dark background (`#FF3B30` in dark mode, `#8a0f00` in light mode).
- `cjsr-correct` token added for "this is the correct answer" UI (reveal screens, host status text) — Tailwind's default `green-300` was previously hardcoded there and was nearly invisible (~1.4:1 contrast) against the light theme's white cards.
- `cjsr-ink` token added to replace hardcoded `text-white`/`border-white` utility classes so text/borders flip correctly between themes. Do not reintroduce literal `text-white`/`border-white` in new code — use `text-cjsr-ink`/`border-cjsr-ink` instead, **except** on anything sitting on a `bg-cjsr-red` background, which should stay literal `text-white` since that background never changes between themes (this exact mismatch caused a real black-text-on-dark-red bug twice in one session — see Known Follow-Ups).
- CJSR star logo (background removed) added to the app header (`src/App.tsx`) and the projector top bar (`src/pages/ScreenPage.tsx`).
- Dark/light theme toggle in the header on `/`, `/host*`, and `/screen` (the projector screen has its own copy in `ScreenShell` since it doesn't share the global header, so the host can dial the projector brightness to the venue rather than being stuck on one theme). Defaults to dark, persists to `localStorage` shared across routes, applied before first paint via an inline script in `index.html` to avoid a flash of the wrong theme. Icon is an upside-down cross for dark mode, right-side-up for light mode (CJSR branding request, not a bug).
- Faint `/30`-opacity dividers (leaderboard rows, list separators) were bumped to `/50` opacity — the original value was under the WCAG 3:1 non-text contrast guideline in both themes.

Stress simulation:

- `scripts/simulateFullGame.mjs` runs deterministic full-game simulations.
- Usage:

```bash
node scripts/simulateFullGame.mjs 500 20 30
```

- Latest run simulated 500 games, 20 teams, 30 regular questions, and 300,000 answer records.
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
- Does not touch `questions` — question edits persist across resets.

Kick:

- Only enabled in lobby.
- Marks team inactive.
- Resets that team score/lock time.
- Deletes the team-name reservation so the name can be picked again.
- The host sidebar renders active teams only, so kicked teams disappear from the visible lobby list.
- Required Firebase rules have been deployed.

Manual score corrections:

- Host scorekeeper controls are available in the Host view.
- `-1` and `+1` buttons update immediately.
- Direct score input commits on blur or Enter.
- Scores are clamped to whole numbers at or above zero.
- This uses the existing team write rule by writing the full team record with an updated score.

Question editing:

- `/host/questions` seeds `games/{gameCode}/questions` from `SEED_QUESTIONS` the first time it's opened (no-op if already seeded, so host edits are never clobbered by a later visit).
- Per-question Save writes only that question via a `set()` at its exact path; the seed step uses a multi-location `update()` across all question paths rather than a single `set()` on the parent node, because a Firebase RTDB `.write` rule defined only on the `$questionId` child does not authorize a `set()` on its parent — this is the same multi-location-update pattern already used by `finalizeQuestionScores`/`resetGameForReplay`.
- Round and question id are fixed; only text, the 4 choices, and the correct-answer index are editable.

UI repetition cleanup:

- `src/App.tsx` now wraps routes in `AppLayout`, which hides the global header on `/screen`.
- The global header remains on `/` and `/host*`; host/admin nav still appears only on `/host*`.
- Host unlocked headline was shortened to "Control desk" because the global header already supplies the trivia context.
- Screen waiting/lobby copy was shortened so the projector experience does not stack multiple CJSR/Trivia labels.

## Product Direction: White-Label Template

After the CJSR event, the owner decided to turn this codebase into a resellable trivia-night product rather than a one-off CJSR app: clone the repo per customer, reconfigure, redeploy under the customer's own Firebase project. Not a multi-tenant SaaS — no auth/tenant-isolation work is planned. A detailed implementation plan for this exists (was last saved to a local Claude Code plan file during a planning session; if that's not available, this section plus a fresh CJSR-specific-content audit is enough to reconstruct it). Two phases:

**Phase 1 — branding/copy/import (smaller, not yet started):**

- Centralize all CJSR-specific copy (site name, headlines, join-screen description, land acknowledgment, prize copy) into a single config file instead of scattered literal strings across `App.tsx`/`ScreenPage.tsx`/`PlayerPage.tsx`.
- Let players type their own team name instead of only picking from the curated pun list — the data layer (`joinTeam`, `database.rules.json`'s team-write rule) already accepts any non-empty string, so this is a `PlayerPage.tsx`-only change: add a text input alongside the existing name buttons, and make the curated list itself optional (empty list = text-input-only). Moderation leans on the existing lobby kick feature rather than new tooling.
- Rename the `cjsr-*` Tailwind color tokens (`tailwind.config.js`, `src/styles.css`, and every `text-cjsr-*`/`bg-cjsr-*`/`border-cjsr-*` class across ~9 component files) to generic `brand-*` tokens, so future customers only ever edit hex values in `styles.css`, never component code.
- Strip CJSR-specific root files (`CJSR LOGO.jpg`, the question-bank docx/script) and internal handoff docs (this file, `PROGRESS.md`, `IMPLEMENTATION_PLAN.md`, `cjsr-trivia-codex-prompt.md`) before reselling.
- Bulk question import: host downloads an `.xlsx` template (generated client-side via SheetJS, matching the event's current round structure), fills it in, uploads it back on `/host/questions`; validated client-side then bulk-written to Firebase with the same multi-location-`update()` pattern already used by `ensureQuestionsSeeded`.

**Phase 2 — structural flexibility (bigger, touches types/DB rules/scoring, not yet started):**

- Unlimited questions and dynamic round definitions (host configures a list of rounds, each with its own question count, point value, and whether a break follows) — replaces the current fixed `RoundNumber = 1|2|3|4|5|6` type and the `questionsPerRound`/`regularQuestionCount`/`breaksAfterQuestions` fields in `schedule.json`.
- New question types beyond multiple-choice: free-text answers with fuzzy/typo-tolerant matching (plus a host review step before scoring is trusted, since auto-grading free text is inherently imperfect) and multi-select (multiple correct choices).
- Per-round and per-question customizable scoring (falls out of the dynamic-round-config work above).
- Configurable max players per team (currently hardcoded `1|2|3|4`).
- Image and video clue questions via Firebase Storage (not currently used anywhere in this app) — recommended default is video renders on `/screen` only (shared projector), not autoplaying independently on every player's phone, to avoid audio chaos in the room; images can render on both.
- `database.rules.json` currently hardcodes round bounds (1-6), question-index bounds (1-31), and player-count bounds (1-4) directly in rule expressions — going unlimited/dynamic means loosening these to generous static ceilings rather than trying to have rules read dynamic config, since the rules' job is shape/sanity validation and the host UI is the real enforcement layer.

Recommended sequencing: ship Phase 1 and confirm it live before starting Phase 2, and within Phase 2, dynamic rounds before question types (question types are the highest-effort/highest-risk piece — new domain-type shape, new scoring branches, new UI in every page).

## Known Follow-Ups

High priority:

- Keep real event questions in `src/data/questions.json` (or via `/host/questions` once seeded) and run validation after edits to the seed file.
- Run a final dry run after real questions are loaded.
- Re-run `npx firebase-tools deploy --only hosting` — everything under "Current Git State" above is still only on the dev server / GitHub, not on the live site.
- Do a live-browser smoke test of the theme toggle and the reveal screens in both themes before the event; verification so far has been build/lint plus isolated CSS-swatch screenshots (see below), not a full click-through of the live Firebase-connected app.
- No terminal or local process needs to run during the event itself — hosting is a static `dist` build served from Firebase's CDN, and the Realtime Database is a fully managed cloud service. `npm run dev` is local-preview only. The one prerequisite is the hosting redeploy above, done ahead of time.

Security/architecture:

- Host actions currently use passphrase-gated browser writes and permissive-enough Firebase rules for event MVP testing.
- Safer production architecture would move host mutations, scoring, reset, and kicking into serverless functions using Firebase Admin credentials.
- There is no auth; `VITE_HOST_PASSPHRASE` ships in the client bundle and any Firebase write that matches the shape rules in `database.rules.json` is accepted regardless of who sends it (e.g. a team could edit its own score from the browser console, or anyone could edit questions without knowing the passphrase if they call the Firebase write directly). Acceptable for a low-stakes volunteer event, not for anything higher-stakes without real auth.

Feature follow-ups:

- Host tie indicators.
- Better finals/sudden-death handling.
- Host pacing and schedule support.
- Late-join historical null answers if needed.
- Reliability/failure dry run.
- Question editor currently supports edit-only (text/choices/answer); add/delete/reorder was explicitly deferred to avoid disturbing round-count and sudden-death invariants this close to the event.

Accessibility:

- A contrast-focused a11y pass has been done (see Branding & theming above) covering the correct-answer color, disabled-state colors, and faint dividers across both themes.
- Not yet done: a real screen-reader pass and automated tooling (axe/Lighthouse) against the live, running app — everything so far has been static analysis of the CSS/JSX plus isolated visual screenshots, not a live assistive-tech check.
- Watch for the `bg-cjsr-red` + theme-flippable-text mismatch described above; it's the specific bug pattern that recurred twice in this project (black text on dark red in light mode).

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

This file (`CLAUDE.md`) has been observed to get auto-edited between sessions by the same mechanism described in "Current Git State" above, and past edits have been incomplete (e.g. documented the header/`AppLayout` change but missed the theming and a11y work from the same session). Treat this file as a helpful summary, not ground truth — when in doubt, check the actual source files or `git log` rather than assuming this document is exhaustive or current.

## Files Left Untouched

These predate the app scaffold and were intentionally left alone:

- `build_question_bank.py`
- `CJSR_Volunteer_Appreciation_Trivia_Question_Bank.docx`
