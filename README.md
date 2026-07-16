# CJSR Volunteer Appreciation Trivia

Mobile-first multiplayer trivia app for a one-night CJSR volunteer appreciation event.

Brand direction: CJSR 88.5 FM, Edmonton's independent radio. The interface uses a near-black background, #f01d4f accent, high-contrast type, and mobile-first controls.

## Phase 0 Setup

Install dependencies:

```bash
npm install
```

Create local environment values:

```bash
cp .env.example .env.local
```

Add Firebase web app values:

```text
VITE_FIREBASE_API_KEY=...
VITE_FIREBASE_AUTH_DOMAIN=...
VITE_FIREBASE_DATABASE_URL=...
VITE_FIREBASE_PROJECT_ID=...
VITE_FIREBASE_APP_ID=...
VITE_HOST_PASSPHRASE=...
```

Do not put Firebase Admin SDK credentials or private keys in any `VITE_` variable.

The host passphrase is a UI gate only. Privileged database actions must be protected through Vercel serverless routes with Firebase Admin credentials, or carefully scoped Firebase Realtime Database rules.

## Firebase Setup

1. Create a Firebase project.
2. Add a Web App and copy its config into `.env.local`.
3. Enable Realtime Database.
4. Start in locked mode, then publish this repo's `database.rules.json` once reviewed.
5. Keep Firebase Admin credentials out of the browser. If later phases need admin actions, put those credentials in Vercel environment variables only.

Run locally:

```bash
npm run dev
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

- `/` player placeholder
- `/host` host placeholder
- `/screen` projector placeholder
- `/host/answer-key` printable answer key placeholder

## QR Code Guidance

Generate the join QR code at high error correction, level H. Export at 1000x1000px minimum and place it on a plain high-contrast slide so phones can scan it from about five metres away.
