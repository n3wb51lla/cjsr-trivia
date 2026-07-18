# CJSR Volunteer Appreciation Trivia

Mobile-first multiplayer trivia app, currently configured for a CJSR volunteer appreciation event. The codebase is built as a reusable template — see "Setting up for a new customer" below for how to reconfigure it for a different event/brand.

Branding, copy, colors, and content all live in a small number of well-known places (`src/config/instance.config.json`, `.env.local`, `src/assets/logo.png`, `src/data/*.json`) rather than scattered through component code. `src/config/site.ts` is a typed loader over `instance.config.json`, not something you edit directly.

## Setup

Install dependencies:

```bash
npm install
```

Create local environment values:

```bash
cp .env.example .env.local
```

Fill in `.env.local`:

```text
VITE_FIREBASE_API_KEY=...
VITE_FIREBASE_AUTH_DOMAIN=...
VITE_FIREBASE_DATABASE_URL=...
VITE_FIREBASE_PROJECT_ID=...
VITE_FIREBASE_APP_ID=...
VITE_FIREBASE_STORAGE_BUCKET=...
VITE_HOST_PASSPHRASE=...
```

`.env.local` only holds deployment-specific and secret values now (Firebase config, the host passphrase). Everything else — site copy, colors, browser tab title, storage keys, team size — lives in `src/config/instance.config.json` instead; see "Setting up for a new customer" below. `VITE_FIREBASE_STORAGE_BUCKET` is optional — leave it blank to disable question image/video uploads for this deployment.

Do not put Firebase Admin SDK credentials or private keys in any `VITE_` variable.

The host passphrase is a UI gate only — it is not real authentication. See "Security/architecture" in `CLAUDE.md` (on `main`, not the `template` branch) for the current security posture.

## Firebase Setup

1. Create a Firebase project.
2. Add a Web App and copy its config into `.env.local`.
3. Enable Realtime Database.
4. Deploy this repo's `database.rules.json`: `npx firebase-tools deploy --only database`.
5. Keep Firebase Admin credentials out of the browser entirely.

## Realtime Database Shape

```text
games/
  {gameCode}/
    meta/
      phase
      currentQuestionIndex
      currentRound
      questionStartedAt
      startedAt
      createdAt
    teams/
      {teamId}/
        teamName
        playerCount
        score
        cumulativeLockMs
        joinedAt
        isActive
    teamNames/
      {normalizedTeamName}: {teamId}
    answers/
      {teamId}/
        {questionId}/
          teamId
          questionIndex
          choiceIndex
          lockedAt
          timeToLockMs
          isCorrect
          pointsAwarded
    questions/
      {questionId}/
        id
        round
        text
        choices
        answer
```

`questions` only exists once a host opens `/host/questions`, which seeds it from `src/data/questions.json`. Until then, every page falls back to that same static file, so the game works either way.

Run locally:

```bash
npm run dev
```

Validate the static question/team-name data:

```bash
npm run validate:data
```

Check production build:

```bash
npm run build
```

Lint:

```bash
npm run lint
```

## Routes

- `/` — player join, question, reveal, and final standings flow
- `/host` — passphrase-protected host control desk
- `/host/questions` — passphrase-protected live question/answer editor
- `/screen` — read-only projector display
- `/host/answer-key` — passphrase-protected printable answer key

## Setting up for a new customer

This repo is meant to be cloned per customer/event rather than run as shared multi-tenant infrastructure. There's a `template` branch with the CJSR-specific assets and internal project docs already stripped out — start there instead of `main` if you're setting up a new event.

1. Edit `src/config/instance.config.json` — site title, header text, headlines, join-screen description, land acknowledgment (set `territoryText: null` to omit it entirely), storage keys, max players per team, and the full light/dark color palette (`colors.<token>.dark` / `.light`, each a `#rrggbb` hex string). This one file replaces what used to be spread across `site.ts`, `styles.css`, and three env vars. `npm run validate:data` checks its shape.
2. Replace `src/assets/logo.png` with the new logo, keeping the same filename so no code changes are needed.
3. Edit `src/data/schedule.json`'s `rounds` array to match the event's round structure — any number of rounds, each with its own `questionCount`, `points`, and `breakAfter`. Set `suddenDeath.enabled` to `false` if the event doesn't want a tiebreaker question.
4. Replace `src/data/questions.json` with the new event's question bank, matching the round structure from step 3 (or leave the default and use `/host/questions` to edit live, including bulk `.xlsx` import/export). Run `npm run validate:data` after editing.
5. Optionally replace `src/data/teamNames.json` / `teamNamesOverflow.json` with new pun/team names, or leave them empty to have players type their own team name.
6. Set `.env.local` — Firebase config for the new project and a new `VITE_HOST_PASSPHRASE`.
7. Update `package.json`'s `name` and `.firebaserc`'s project id to match the new customer's own Firebase project (create that project first, per "Firebase Setup" above).
8. `npm run validate:data && npm run lint && npm run build`.
9. `npx firebase-tools deploy --only database` then `npx firebase-tools deploy --only hosting`.

## QR Code Guidance

Generate the join QR code at high error correction, level H. Export at 1000x1000px minimum and place it on a plain high-contrast slide so phones can scan it from about five metres away.
