# CJSR Volunteer Appreciation Trivia

Mobile-first multiplayer trivia app for a one-night CJSR volunteer appreciation event.

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

