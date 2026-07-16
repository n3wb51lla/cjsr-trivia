# CJSR Volunteer Appreciation Trivia

This repository is being built from the Codex implementation brief supplied in the task attachment.

The working method is intentionally phase-based:

1. Document the implementation plan before building.
2. Build one vertical slice at a time.
3. Run `npm run build` and lint checks for each phase.
4. Update `PROGRESS.md` after each phase.
5. Prefer reliability, persistence, accessibility, and recovery over visual polish.

Phase 0 covers only the Vite React TypeScript foundation, routing, Tailwind setup, Firebase client configuration, environment validation, global CJSR theme variables, and an error boundary.

Backend pivot: the project now uses Firebase Realtime Database instead of Supabase because the event needs a temporary free/low-friction realtime backend.
