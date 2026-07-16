# CJSR Trivia Progress

## Phase Checklist

- [x] Phase 0: Repository and build foundation
- [x] Phase 1: Static data and shared types
- [x] Phase 2: Firebase Realtime Database rules and data access
- [ ] Phase 3: Shared synchronization layer
- [x] Phase 4: Player join, rejoin, and lobby
- [x] Phase 5: Server-authoritative question timer
- [x] Phase 6: Answer selection, locking, and recovery
- [x] Phase 7: Host control screen
- [ ] Phase 8: Scoring, ranking, and reveal
- [ ] Phase 9: Breaks, finals, projector, and answer key
- [ ] Phase 10: Host pacing and schedule support
- [ ] Phase 11: Sudden death
- [ ] Accessibility pass
- [ ] Reliability and failure dry run

## Current Status

Phase 0 is complete.

Implemented:

- Vite React TypeScript foundation.
- React Router routes for `/`, `/host`, `/screen`, and `/host/answer-key`.
- Tailwind and CJSR theme variables.
- Firebase browser client configuration with readable missing-env warning.
- Global error boundary.
- Placeholder pages for player, host, projector, and answer key.
- Lint and production build scripts.

Verification:

- `npm run lint` passed.
- `npm run build` passed.

Known follow-up:

- `npm install` reported 2 npm audit findings. Do not run `npm audit fix --force` blindly before the event; review dependency impact first.

## Phase 1

Implemented:

- Authoritative JSON files for team names, scoring, schedule, and 31 questions.
- Shared TypeScript domain types for games, teams, answers, questions, game state, and leaderboard entries.
- Trivia data helpers for question lookup, point lookup, round lookup, break detection, next-state derivation, and question duration.
- `npm run validate:data` script for question/team/scoring validation.

Verification:

- `npm run validate:data` passed.
- `npm run lint` passed.
- `npm run build` passed.

Context correction:

- Updated team names to the exact 20 supplied in the added brief.
- Updated `scoring.json` to the specified round-to-points shape.
- Updated `questions.json` to the specified `{ id, round, text, choices, answer }` shape.
- Updated brand colors toward near-black, #f01d4f, white/#e5e5e5.

## Backend Pivot

Decision:

- Use Firebase Realtime Database instead of Supabase for the event backend.

Implemented:

- Replaced Supabase dependency with Firebase.
- Replaced Supabase env vars with Firebase web config env vars.
- Added Firebase client initialization in `src/lib/firebase.ts`.
- Added typed Firebase path helpers in `src/lib/firebasePaths.ts`.
- Added early Firebase data-access helpers in `src/lib/firebaseData.ts`.
- Added `firebase.json` and `database.rules.json` starter rules.

Known follow-up:

- Host mutations, scoring, reset, and game-state advancement should use Vercel serverless functions with Firebase Admin credentials, or much tighter Firebase rules.
- Team-name uniqueness should be enforced with a canonical reservation path in the join-flow phase.

## Phase 2

Implemented:

- Firebase Realtime Database path helpers for game meta, teams, team-name reservations, and answers.
- Typed data-access helpers for fetching game state, subscribing to game state, joining a team, submitting an answer idempotently, and reading Firebase server time offset.
- Starter database rules that allow public reads, anonymous one-time team creation, anonymous one-time answer creation, and block direct game-state writes.
- Firebase-friendly timestamp/domain model updates.
- Initial `useGameSubscription` hook with realtime listener, stale-listener detection, focus/online recovery, and 2-second polling fallback.
- Initial `useServerTimeOffset` hook.

Verification:

- `npm run validate:data` passed.
- `npm run lint` passed.
- `npm run build` passed.

Known follow-up:

- Host controls still need protected serverless actions before they can mutate game state, score answers, or reset a dry run.
- Team-name reservation is represented in the data model now; the Phase 4 join UI must write both the team and reservation path.

## Phase 4

Implemented:

- Mobile-first player join page.
- Game code field with localStorage persistence.
- Player count selection with 44px+ touch targets.
- Exact team-name list with taken names disabled.
- Firebase-backed join flow using team-name reservation plus team record creation.
- `team_id` localStorage persistence and rejoin restoration.
- Lobby state showing team name and player count.
- Leave/change-team control while the game is in lobby.
- Friendly hold screen outside lobby/break for new teams.
- Connection status display from the shared Firebase subscription hook.

Verification:

- `npm run validate:data` passed.
- `npm run lint` passed.
- `npm run build` passed.

Known follow-up:

- Late join null historical answers will be added once host progression/scoring exists.
- Leave/change currently clears only this phone's local team link; deleting/deactivating Firebase team records needs protected host/server logic.

## Phase 7

Implemented:

- Host passphrase gate using `VITE_HOST_PASSPHRASE`.
- Host control desk for `games/main`.
- Lobby initialization.
- Basic advance flow: lobby -> question -> reveal -> break/final.
- Current question and correct-answer display.
- Team count and joined-team list.
- Skip-to-finals control.
- State reset back to lobby while preserving joined teams.

Verification:

- `npm run validate:data` passed.
- `npm run lint` passed.
- `npm run build` passed.

Known follow-up:

- This first host slice uses passphrase-gated browser writes to game metadata. It is suitable for local/event MVP testing, but protected serverless host actions remain the safer production architecture.
- Updated Firebase rules must be deployed before the host buttons can write game metadata.

## Phase 5 / 6

Implemented:

- Player question screen with full question text and point-value badge.
- Server-derived countdown based on Firebase-stored `questionStartedAt` plus `.info/serverTimeOffset`.
- Visual timer bar and numeric seconds.
- Four large answer cards with selected state.
- Separate full-width `LOCK IN` button.
- One-time Firebase answer write using the transaction-backed `submitAnswerIfMissing` helper.
- Locked waiting state with live room lock count.
- Null auto-lock when timer reaches zero and no answer exists.
- Reveal screen highlighting correct answer, team answer, points for the question, and running total.

Verification:

- `npm run validate:data` passed.
- `npm run lint` passed.
- `npm run build` passed.

Known follow-up:

- Scoring finalization is not implemented yet, so reveal currently shows `pointsAwarded` from Firebase, which remains zero until the scoring slice updates answers/team totals.
- Host advance enablement does not yet wait for all teams locked or timer expiry.

## Notes

- Existing files `build_question_bank.py` and `CJSR_Volunteer_Appreciation_Trivia_Question_Bank.docx` predate the app scaffold and are left untouched.
- Firebase Admin credentials must never be exposed through `VITE_` variables.
