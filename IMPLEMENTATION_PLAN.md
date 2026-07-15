# CJSR Trivia Implementation Plan

## Build Approach

This project will be built in narrow, testable phases. Phase 0 establishes the application shell only; trivia gameplay, Supabase schema, synchronization, joining, timers, answers, scoring, and host controls are deliberately left for later phases.

## Proposed Folder Structure

```text
public/
src/
  components/
    common/
    host/
    player/
    screen/
  data/
  hooks/
  lib/
  pages/
  types/
  App.tsx
  main.tsx
supabase/
```

## Shared Domain Types

Later phases should add shared types in `src/types/index.ts` for:

- `Game`
- `Team`
- `Answer`
- `Question`
- `GameState`
- `LeaderboardEntry`
- round and phase discriminated unions

Shared rules should live outside React components in `src/lib/`, including question lookup, scoring, ranking, state transitions, timer calculations, and answer idempotency helpers.

## Highest-Risk Technical Areas

1. Server-authoritative timing across phones with inaccurate clocks or suspended browsers.
2. Race-safe answer locking, especially manual lock versus timer-expired null answers.
3. Supabase Realtime reliability under venue Wi-Fi load, with polling fallback that does not duplicate intervals.
4. Host privilege boundaries without exposing service-role secrets or trusting browser-only passphrases.
5. Rejoin and late-join recovery when players refresh, lose network, or open multiple tabs.

## Security Concerns

- `VITE_` environment variables are public in the browser bundle and must not contain Supabase service-role keys.
- A host passphrase can gate UI access, but privileged mutations should use protected Supabase RPC functions or Vercel serverless routes.
- Anonymous clients should not be able to directly mutate game state, scoring, or reset data.
- Database constraints must be the final authority for duplicate team names and duplicate answers.
- Row-level security must allow player reads/inserts while blocking privileged host operations from normal clients.

## Synchronization Plan

`useGameSubscription` will fetch the current game immediately, subscribe to Supabase Realtime channels, and expose connection state. If Realtime disconnects, errors, or goes stale, `usePollingFallback` will poll every two seconds until Realtime is healthy again. Focus, visibility, and online events will trigger immediate refetches. Cleanup must unsubscribe channels and clear intervals.

## Server-Authoritative Timer Plan

Clients will derive remaining time from `question_started_at`, not component mount time. Where practical, a Supabase server-time fetch will calculate clock offset:

```text
remaining = max(0, questionDuration - ((Date.now() + serverOffset) - questionStartedAt))
```

Visibility changes, reconnects, and game updates will recalculate immediately. Timer announcements will be throttled for screen readers.

## Answer Idempotency Plan

Answers will be inserted with a unique `(team_id, question_index)` database constraint. Duplicate inserts will be treated as successful prior submissions: the client should fetch and display the existing answer. Timer expiration inserts a null answer only when no answer exists.

## Reconnect Flow

The player page will store `team_id` in localStorage. On load, it will validate that team against Supabase, recover the current game state, restore any locked answer, and show the appropriate lobby/question/reveal/break/final state. Invalid stored teams will be cleared with a readable recovery path.

## Phase 0 Scope

Phase 0 implements:

- Vite React TypeScript foundation.
- React Router routes for `/`, `/host`, `/screen`, and `/host/answer-key`.
- Tailwind configuration.
- Supabase client creation with readable environment warnings.
- Global CJSR theme variables.
- Global error boundary.
- Placeholder pages only.
- Lint and production build scripts.

