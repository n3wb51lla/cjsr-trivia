# CJSR Trivia Progress

## Phase Checklist

- [x] Phase 0: Repository and build foundation
- [x] Phase 1: Static data and shared types
- [ ] Phase 2: Supabase schema, policies, and data access
- [ ] Phase 3: Shared synchronization layer
- [ ] Phase 4: Player join, rejoin, and lobby
- [ ] Phase 5: Server-authoritative question timer
- [ ] Phase 6: Answer selection, locking, and recovery
- [ ] Phase 7: Host control screen
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
- Supabase browser client configuration with readable missing-env warning.
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

## Notes

- Existing files `build_question_bank.py` and `CJSR_Volunteer_Appreciation_Trivia_Question_Bank.docx` predate the app scaffold and are left untouched.
- Supabase service-role secrets must never be exposed through `VITE_` variables.
