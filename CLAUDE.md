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
- `/screen` - read-only projector display
- `/host/answer-key` - answer key route

Navigation:

- The player root route is intentionally clean and has no visible nav links.
- Host/admin nav appears only while on host routes and links to Host, Screen, and Answer key.
- The projector route intentionally hides the global app header; `/screen` owns its own logo/title/status header to avoid duplicated CJSR branding on the display.
- The global header row no longer force-stacks on mobile; it's a single wrapping flex row so the dark/light theme toggle sits beside the logo instead of dropping to its own row when there's no host nav to share space with.

Default game code:

- `main`

## Current Git State

Recent commits (newest first):

- `317730e Claude.md`
- `43bf5d3 Fix`
- `2394914 Dark light mode`
- `e2e3e52 Fix`
- `2ed8ca0 UI improvements`
- `7f587b5 UI improvements`
- `1900d1f Updates`
- `6e19a9c Update teamNames.json`
- `f396df7 fix: derive reveal points for correct answers`
- `0f07216 data: load real event questions`
- `91f3d3f fix: make scoreboard rows responsive`

Important: the live Firebase Hosting site is available at `https://cjsr-trivia.web.app`. It was redeployed (`npx firebase-tools deploy --only hosting`) after the initial red/logo rebrand (commit `1900d1f`), but the later dark/light theme system, contrast fixes, and mobile header layout fix have **not** been confirmed deployed as of the last session — re-run the hosting deploy command before the event if those changes need to be live.

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

Hosting already deployed:

- Latest UI deploy completed successfully to `https://cjsr-trivia.web.app`

## Architecture

Key files:

- `src/lib/firebase.ts` - Firebase browser initialization and missing-env handling
- `src/lib/firebasePaths.ts` - typed path helpers for game, teams, reservations, answers
- `src/lib/firebaseData.ts` - Firebase read/write helpers
- `src/lib/hostState.ts` - host game-state transitions
- `src/lib/triviaData.ts` - question/scoring/schedule helpers
- `src/lib/leaderboard.ts` - leaderboard ranking helper
- `src/hooks/useGameSubscription.ts` - realtime subscription with fallback behavior
- `src/hooks/useServerTimeOffset.ts` - Firebase server time offset
- `src/hooks/useQuestionTimer.ts` - server-derived question countdown
- `src/pages/PlayerPage.tsx` - player join/play/reveal/final UI
- `src/pages/HostPage.tsx` - host controls
- `src/pages/ScreenPage.tsx` - projector display
- `src/hooks/useTheme.ts` - dark/light theme state, persisted to `localStorage` under `cjsr-theme`, applied via `data-theme` on `<html>`
- `src/components/common/ThemeToggle.tsx` - header theme-toggle button (upside-down cross for dark, right-side-up cross for light)
- `src/assets/cjsr-logo.png` - CJSR star logo with the white background removed (flood-fill from image edges so the white "cjsr" lettering stayed intact); used in the app header and the projector top bar
- `src/styles.css` - CSS custom properties for the `cjsr-*` color tokens; dark values live on `:root`, light overrides live on `:root[data-theme='light']`
- `tailwind.config.js` - maps the `cjsr-*` Tailwind color classes to the CSS custom properties above
- `scripts/simulateFullGame.mjs` - deterministic full-game stress simulation
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
- Data validation script for questions/team names

Trivia data:

- 30 real event questions plus 1 sudden-death question
- 20 official team names in `src/data/teamNames.json`, currently pub-quiz pun names (`Quizzy McQuizface`, `Agatha Quiztie`, `Les Quizerables`, etc.) after an earlier Canadian-music-pun theme was tried and replaced
- Round-based scoring
- Schedule/break metadata
- Shared domain types

Player flow:

- Default `main` game code with no player-facing game-code field
- Team join with 1-4 players
- Team name reservation and taken-name disabling
- `team_id` localStorage rejoin
- Lobby screen
- Question screen with server-derived timer
- Answer selection and one-time lock-in
- Auto-lock null answer on timeout
- Reveal screen with correct answer, team answer, awarded points, running score
- Final standings on phones when host enters finals

Host flow:

- Passphrase gate via `VITE_HOST_PASSPHRASE`
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

Projector screen:

- Does not render the global app shell header, so the projector view only shows one CJSR logo/title.
- Lobby joined-team count and team list
- Live question text, point value, timer, and lock count
- Reveal answer, correct-team count, and leaderboard
- Standings checkpoint screen with scores and next question number
- Final winner and standings
- Waiting state now says "Waiting for host" instead of repeating "CJSR Trivia Night".
- Lobby headline now says "Volunteer Appreciation" instead of repeating "Trivia".

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
- Dark/light theme toggle in the header (hidden on `/screen` so no one can accidentally flip the projector mid-game). Defaults to dark, persists to `localStorage`, applied before first paint via an inline script in `index.html` to avoid a flash of the wrong theme. Icon is an upside-down cross for dark mode, right-side-up for light mode (CJSR branding request, not a bug).
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

UI repetition cleanup:

- `src/App.tsx` now wraps routes in `AppLayout`, which hides the global header on `/screen`.
- The global header remains on `/` and `/host*`; host/admin nav still appears only on `/host*`.
- Player join headline was shortened to "Join Volunteer Appreciation" because the global header already supplies "CJSR Trivia".
- Host unlocked headline was shortened to "Control desk" because the global header already supplies the trivia context.
- Screen waiting/lobby copy was shortened so the projector experience does not stack multiple CJSR/Trivia labels.

## Known Follow-Ups

High priority:

- Keep real event questions in `src/data/questions.json` and run validation after edits.
- Run a final dry run after real questions are loaded.
- Re-run `npx firebase-tools deploy --only hosting` — the dark/light theme system, contrast fixes, and mobile header fix landed after the last confirmed deploy.
- Do a live-browser smoke test of the theme toggle and the reveal screens in both themes before the event; verification so far has been build/lint plus isolated CSS-swatch screenshots (see below), not a full click-through of the live Firebase-connected app.

Security/architecture:

- Host actions currently use passphrase-gated browser writes and permissive-enough Firebase rules for event MVP testing.
- Safer production architecture would move host mutations, scoring, reset, and kicking into serverless functions using Firebase Admin credentials.
- There is no auth; `VITE_HOST_PASSPHRASE` ships in the client bundle and any Firebase write that matches the shape rules in `database.rules.json` is accepted regardless of who sends it (e.g. a team could edit its own score from the browser console). Acceptable for a low-stakes volunteer event, not for anything higher-stakes without real auth.

Feature follow-ups:

- Host tie indicators.
- Better finals/sudden-death handling.
- Host pacing and schedule support.
- Late-join historical null answers if needed.
- Reliability/failure dry run.

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
