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

Add:

```text
VITE_SUPABASE_URL=...
VITE_SUPABASE_ANON_KEY=...
```

Do not put a Supabase service-role key in any `VITE_` variable.

The host passphrase is a UI gate only. Privileged database actions must be protected through Supabase RPC functions or serverless routes in later phases.

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
