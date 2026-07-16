# CJSR Trivia Implementation Plan

## Build Approach

This project will be built in narrow, testable phases. Phase 0 establishes the application shell only; trivia gameplay, Firebase Realtime Database rules, synchronization, joining, timers, answers, scoring, and host controls are deliberately left for later phases.

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
database.rules.json
firebase.json
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
3. Firebase listener reliability under venue Wi-Fi load, with polling fallback that does not duplicate intervals.
4. Host privilege boundaries without trusting browser-only passphrases.
5. Rejoin and late-join recovery when players refresh, lose network, or open multiple tabs.

## Security Concerns

- `VITE_` environment variables are public in the browser bundle and must contain only Firebase web config, never private admin credentials.
- A host passphrase can gate UI access, but privileged mutations should use Vercel serverless routes with Firebase Admin credentials, or narrowly scoped database rules.
- Anonymous clients should not be able to directly mutate game state, scoring, or reset data.
- Firebase rules and path design must prevent duplicate answers. Team-name reservation should be represented as a canonical key path, not checked only in UI.
- Firebase Admin credentials must stay in Vercel environment variables only.

## Synchronization Plan

`useGameSubscription` will fetch the current game immediately, subscribe to Firebase Realtime Database listeners, and expose connection state. If the listener disconnects, errors, or goes stale, `usePollingFallback` will poll every two seconds until the listener is healthy again. Focus, visibility, and online events will trigger immediate refetches. Cleanup must unsubscribe listeners and clear intervals.

## Server-Authoritative Timer Plan

Clients will derive remaining time from `question_started_at`, not component mount time. Where practical, Firebase server timestamps and `.info/serverTimeOffset` will calculate clock offset:

```text
remaining = max(0, questionDuration - ((Date.now() + serverOffset) - questionStartedAt))
```

Visibility changes, reconnects, and game updates will recalculate immediately. Timer announcements will be throttled for screen readers.

## Answer Idempotency Plan

Answers will be inserted with a unique `(team_id, question_index)` database constraint. Duplicate inserts will be treated as successful prior submissions: the client should fetch and display the existing answer. Timer expiration inserts a null answer only when no answer exists.

## Reconnect Flow

The player page will store `team_id` in localStorage. On load, it will validate that team against Firebase, recover the current game state, restore any locked answer, and show the appropriate lobby/question/reveal/break/final state. Invalid stored teams will be cleared with a readable recovery path.

## Phase 0 Scope

Phase 0 implements:

- Vite React TypeScript foundation.
- React Router routes for `/`, `/host`, `/screen`, and `/host/answer-key`.
- Tailwind configuration.
- Firebase client creation with readable environment warnings.
- Global CJSR theme variables.
- Global error boundary.
- Placeholder pages only.
- Lint and production build scripts.
