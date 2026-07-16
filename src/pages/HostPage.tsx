import { useMemo, useState } from 'react';
import { useGameSubscription } from '../hooks/useGameSubscription';
import { getOptionalEnv } from '../lib/env';
import { patchGameMeta, writeGameMeta, type FirebaseGameMeta } from '../lib/firebaseData';
import { DEFAULT_GAME_CODE, getCurrentQuestionSummary, getHostAdvanceMeta, getHostButtonLabel, makeInitialGameMeta } from '../lib/hostState';
import { getPointsForQuestion } from '../lib/triviaData';

export function HostPage() {
  const [isUnlocked, setIsUnlocked] = useState(false);
  const [passphrase, setPassphrase] = useState('');
  const [message, setMessage] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);
  const { gameState, status, error } = useGameSubscription(DEFAULT_GAME_CODE);

  const meta = useMemo<FirebaseGameMeta | null>(() => gameState ? { ...gameState.game, code: DEFAULT_GAME_CODE } : null, [gameState]);
  const teams = gameState?.teams ?? [];
  const question = getCurrentQuestionSummary(meta?.currentQuestionIndex ?? null);
  const pointValue = meta?.currentQuestionIndex ? getPointsForQuestion(meta.currentQuestionIndex) : null;

  function unlock(event: React.FormEvent) {
    event.preventDefault();
    const expected = getOptionalEnv('VITE_HOST_PASSPHRASE');
    if (!expected) {
      setMessage('Missing VITE_HOST_PASSPHRASE in .env.local.');
      return;
    }
    if (passphrase !== expected) {
      setMessage('Incorrect host passphrase.');
      return;
    }
    setIsUnlocked(true);
    setMessage(null);
  }

  async function initializeLobby() {
    await runHostAction('Lobby initialized.', () => writeGameMeta(DEFAULT_GAME_CODE, makeInitialGameMeta(DEFAULT_GAME_CODE)));
  }

  async function advance() {
    await runHostAction('Advanced game state.', () => writeGameMeta(DEFAULT_GAME_CODE, getHostAdvanceMeta(meta, DEFAULT_GAME_CODE)));
  }

  async function skipToFinals() {
    const now = Date.now();
    await runHostAction('Skipped to finals.', () => patchGameMeta(DEFAULT_GAME_CODE, {
      code: DEFAULT_GAME_CODE,
      phase: 'final',
      currentQuestionIndex: meta?.currentQuestionIndex ?? 30,
      currentRound: meta?.currentRound ?? 6,
      questionStartedAt: null,
      startedAt: meta?.startedAt ?? now,
      createdAt: meta?.createdAt ?? now,
    }));
  }

  async function resetStateOnly() {
    await runHostAction('Game state reset to lobby. Joined teams are kept for now.', () => writeGameMeta(DEFAULT_GAME_CODE, makeInitialGameMeta(DEFAULT_GAME_CODE)));
  }

  async function runHostAction(success: string, action: () => Promise<void>) {
    setBusy(true);
    setMessage(null);
    try {
      await action();
      setMessage(success);
    } catch (caught) {
      setMessage(caught instanceof Error ? caught.message : 'Host action failed.');
    } finally {
      setBusy(false);
    }
  }

  if (!isUnlocked) {
    return (
      <section className="page-card p-6">
        <p className="text-sm font-black uppercase tracking-wide text-cjsr-magenta">Host controls</p>
        <h1 className="mt-3 font-display text-4xl leading-tight">Unlock control desk</h1>
        <form className="mt-6 max-w-sm" onSubmit={unlock}>
          <label className="block text-sm font-bold uppercase tracking-wide" htmlFor="host-passphrase">Host passphrase</label>
          <input
            id="host-passphrase"
            type="password"
            className="mt-2 min-h-11 w-full border-2 border-cjsr-magenta bg-cjsr-black px-3 py-2 text-white"
            value={passphrase}
            onChange={event => setPassphrase(event.target.value)}
          />
          <button type="submit" className="mt-4 min-h-11 border-2 border-cjsr-magenta bg-cjsr-magenta px-5 py-2 font-black text-cjsr-black">
            Unlock host
          </button>
        </form>
        {message && <p className="mt-4 font-bold text-cjsr-magenta" role="alert">{message}</p>}
      </section>
    );
  }

  return (
    <div className="grid gap-4 lg:grid-cols-[2fr_1fr]">
      <section className="page-card p-6">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <p className="text-sm font-black uppercase tracking-wide text-cjsr-magenta">Host controls</p>
            <h1 className="mt-2 font-display text-4xl leading-tight">Trivia control desk</h1>
          </div>
          <ConnectionBadge status={status} error={error?.message ?? null} />
        </div>

        <div className="mt-6 grid gap-3 sm:grid-cols-3">
          <Stat label="State" value={meta?.phase ?? 'not initialized'} />
          <Stat label="Question" value={meta?.currentQuestionIndex ? `Q${meta.currentQuestionIndex} of 30` : 'none'} />
          <Stat label="Point value" value={pointValue ? `${pointValue} points` : '-'} />
        </div>

        {question ? (
          <section className="mt-6 border-2 border-white p-4">
            <p className="text-sm font-black uppercase tracking-wide text-cjsr-magenta">Current question</p>
            <h2 className="mt-2 text-2xl font-bold">{question.text}</h2>
            <p className="mt-3 text-lg text-green-300">Correct: {question.choices[question.answer]}</p>
          </section>
        ) : (
          <p className="mt-6 text-lg text-cjsr-paper">Initialize the lobby, then start question 1.</p>
        )}

        <div className="mt-6 flex flex-wrap gap-3">
          <button type="button" disabled={busy} onClick={initializeLobby} className="min-h-11 border-2 border-white px-5 py-2 font-bold disabled:opacity-50">
            Initialize lobby
          </button>
          <button type="button" disabled={busy} onClick={advance} className="min-h-11 border-2 border-cjsr-magenta bg-cjsr-magenta px-5 py-2 font-black text-cjsr-black disabled:opacity-50">
            {getHostButtonLabel(meta)}
          </button>
          <button type="button" disabled={busy} onClick={skipToFinals} className="min-h-11 border-2 border-white px-5 py-2 font-bold disabled:opacity-50">
            Skip to finals
          </button>
          <button type="button" disabled={busy} onClick={resetStateOnly} className="min-h-11 border-2 border-cjsr-magenta px-5 py-2 font-bold text-cjsr-magenta disabled:opacity-50">
            Reset state
          </button>
        </div>
        {message && <p className="mt-4 font-bold text-cjsr-magenta" role="status">{message}</p>}
      </section>

      <aside className="page-card p-5">
        <h2 className="font-display text-2xl">Teams joined</h2>
        <p className="mt-1 text-cjsr-paper">{teams.length} team{teams.length !== 1 ? 's' : ''}</p>
        <ol className="mt-4 space-y-2">
          {teams.map(team => (
            <li key={team.id} className="border border-white/30 p-3">
              <span className="font-bold">{team.teamName}</span>
              <span className="block text-sm text-cjsr-paper">{team.playerCount} player{team.playerCount !== 1 ? 's' : ''}</span>
            </li>
          ))}
        </ol>
      </aside>
    </div>
  );
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div className="border-2 border-white p-3">
      <p className="text-xs font-black uppercase tracking-wide text-cjsr-magenta">{label}</p>
      <p className="mt-1 text-xl font-bold">{value}</p>
    </div>
  );
}

function ConnectionBadge({ status, error }: { status: string; error: string | null }) {
  return (
    <div className="text-right text-sm" aria-live="polite">
      <p className="font-black uppercase tracking-wide">Connection: {status}</p>
      {error && <p className="text-cjsr-magenta">{error}</p>}
    </div>
  );
}
