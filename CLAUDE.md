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

Default game code:

- `main`

## Current Git State

Recent local commits:

- `de664a2 test: add full game stress simulation`
- `04ce3e0 Create hosting.ZGlzdA.cache`
- `d4f6210 fix: hide removed teams in host list`
- `3cbafe7 docs: add project handoff notes`
- `2da6453 feat: allow kicking lobby teams`
- `94fed8d fix: fully reset game state`
- `dc4d00b fix: show finals on player phones`
- `2c02b41 feat: build projector screen`
- `5b44309 feat: add host lock tracking`
- `331b42b feat: finalize scoring on reveal`
- `110cc76 feat: add player question timer and answer locking`
- `39ad850 feat: add host control foundation`

Important: the live Firebase Hosting site was deployed after the host-list cleanup and is available at:

- `https://cjsr-trivia.web.app`

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

- 31 questions
- 20 official team names
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

- Lobby joined-team count and team list
- Live question text, point value, timer, and lock count
- Reveal answer, correct-team count, and leaderboard
- Standings checkpoint screen with scores and next question number
- Final winner and standings

Leaderboard:

- Active teams ranked by score descending
- Ties ordered by fastest cumulative lock time
- Tied scores flagged for UI messaging

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

## Known Follow-Ups

High priority:

- Keep real event questions in `src/data/questions.json` and run validation after edits.
- Run a final dry run after real questions are loaded.
- Push any local commits if GitHub is behind.

Security/architecture:

- Host actions currently use passphrase-gated browser writes and permissive-enough Firebase rules for event MVP testing.
- Safer production architecture would move host mutations, scoring, reset, and kicking into serverless functions using Firebase Admin credentials.

Feature follow-ups:

- Host tie indicators.
- Better finals/sudden-death handling.
- Host pacing and schedule support.
- Late-join historical null answers if needed.
- Accessibility pass.
- Reliability/failure dry run.

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

## Files Left Untouched

These predate the app scaffold and were intentionally left alone:

- `build_question_bank.py`
- `CJSR_Volunteer_Appreciation_Trivia_Question_Bank.docx`
