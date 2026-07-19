# Trivia Knight

Trivia night software for building questions, running a live host desk, collecting team answers, presenting the room display, and tracking scores in real time.

The product interface follows the Trivia Knight design system: deep navy, warm gold, off-white content surfaces, Archivo display type, IBM Plex Sans body type, moderate radii, and soft elevation. Branding is text-only until the redesigned logo is supplied.

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
- `/marketing` — public Trivia Knight marketing page
- `/demo` — local, clickable player/host/projector product walkthrough
- `/host` — passphrase-protected host control desk
- `/host/brand` — passphrase-protected name, logo, and color builder with local draft preview
- `/host/questions` — passphrase-protected live question/answer editor
- `/screen` — read-only projector display
- `/host/answer-key` — passphrase-protected printable answer key

## Customizing an event

Trivia Knight currently supports one configured event per deployment. Use the host brand builder for a safe local preview, then update the instance files before deployment.

1. Edit `src/config/instance.config.json` for product copy, storage keys, team size, and the deployment color mapping.
2. Edit `src/data/schedule.json` to set the round structure and scoring.
3. Edit or bulk-import `src/data/questions.json` through `/host/questions`.
4. Optionally replace the sample team-name lists in `src/data/teamNames.json` and `teamNamesOverflow.json`.
5. Set the Firebase connection and host passphrase in `.env.local`.
6. Run the data validation and production build before deploying.

## QR Code Guidance

Generate the join QR code at high error correction, level H. Export at 1000x1000px minimum and place it on a plain high-contrast slide so phones can scan it from about five metres away.
