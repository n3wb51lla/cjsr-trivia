import { useMemo, useState } from 'react';
import type { Team } from '../types';
import { useGameSubscription } from '../hooks/useGameSubscription';
import { joinTeam, makeTeamNameKey } from '../lib/firebaseData';
import { clearStoredTeamId, getStoredGameCode, getStoredTeamId, storeGameCode, storeTeamId } from '../lib/storage';
import { TEAM_NAMES } from '../lib/triviaData';

type PlayerCount = 1 | 2 | 3 | 4;

export function PlayerPage() {
  const [gameCode, setGameCode] = useState(getStoredGameCode);
  const [storedTeamId, setStoredTeamId] = useState<string | null>(getStoredTeamId);
  const [playerCount, setPlayerCount] = useState<PlayerCount | null>(null);
  const [joiningName, setJoiningName] = useState<string | null>(null);
  const [message, setMessage] = useState<string | null>(null);
  const { gameState, status, error } = useGameSubscription(gameCode);

  const currentTeam = useMemo(
    () => gameState?.teams.find(team => team.id === storedTeamId && team.isActive) ?? null,
    [gameState?.teams, storedTeamId],
  );
  const takenNames = useMemo(() => new Set(gameState?.teams.filter(team => team.isActive).map(team => makeTeamNameKey(team.teamName)) ?? []), [gameState?.teams]);
  const phase = gameState?.game.phase ?? 'lobby';
  const canJoin = phase === 'lobby' || phase === 'break';

  function updateGameCode(next: string) {
    const normalized = next.trim() || 'main';
    setGameCode(normalized);
    storeGameCode(normalized);
    setMessage(null);
  }

  function leaveTeam() {
    clearStoredTeamId();
    setStoredTeamId(null);
    setPlayerCount(null);
    setMessage('Team cleared on this phone. You can choose again while the game is in lobby.');
  }

  async function handleJoin(teamName: string) {
    if (!playerCount) {
      setMessage('Choose how many players are on your team first.');
      return;
    }
    setJoiningName(teamName);
    setMessage(null);
    try {
      const team = await joinTeam(gameCode, { teamName, playerCount });
      storeTeamId(team.id);
      setStoredTeamId(team.id);
      setMessage(`You're in as ${team.teamName}.`);
    } catch (caught) {
      const next = caught instanceof Error ? caught.message : 'Could not join with that team name.';
      setMessage(next);
    } finally {
      setJoiningName(null);
    }
  }

  if (currentTeam) {
    return (
      <PlayerShell status={status} error={error?.message ?? null}>
        <LobbyPanel team={currentTeam} phase={phase} canLeave={phase === 'lobby'} onLeave={leaveTeam} />
      </PlayerShell>
    );
  }

  if (!canJoin) {
    return (
      <PlayerShell status={status} error={error?.message ?? null}>
        <section className="page-card p-6" aria-live="polite">
          <p className="text-sm font-black uppercase tracking-wide text-cjsr-magenta">Round in progress</p>
          <h1 className="mt-3 font-display text-4xl leading-tight">You'll be able to join at the next break.</h1>
          <p className="mt-4 text-lg text-cjsr-paper">
            Keep this page open. It will update automatically when joining reopens.
          </p>
        </section>
      </PlayerShell>
    );
  }

  return (
    <PlayerShell status={status} error={error?.message ?? null}>
      <section className="page-card p-5 sm:p-6">
        <p className="text-sm font-black uppercase tracking-wide text-cjsr-magenta">Player join</p>
        <h1 className="mt-3 font-display text-4xl leading-tight">Join CJSR Volunteer Appreciation Trivia</h1>
        <p className="mt-4 max-w-2xl text-lg text-cjsr-paper">
          Edmonton's independent radio 88.5 FM. Listener-supported, volunteer-powered.
        </p>

        <label className="mt-6 block text-sm font-bold uppercase tracking-wide" htmlFor="game-code">
          Game code
        </label>
        <input
          id="game-code"
          className="mt-2 min-h-11 w-full max-w-xs border-2 border-cjsr-magenta bg-cjsr-black px-3 py-2 text-white"
          value={gameCode}
          onChange={event => updateGameCode(event.target.value)}
          autoCapitalize="none"
        />

        <fieldset className="mt-6">
          <legend className="font-display text-2xl">How many players?</legend>
          <div className="mt-3 grid grid-cols-4 gap-2">
            {([1, 2, 3, 4] as const).map(count => (
              <button
                key={count}
                type="button"
                className={`min-h-14 border-2 px-3 py-2 text-xl font-black ${playerCount === count ? 'border-cjsr-magenta bg-cjsr-magenta text-cjsr-black' : 'border-white bg-cjsr-surface text-white'}`}
                onClick={() => setPlayerCount(count)}
                aria-pressed={playerCount === count}
              >
                {count}
              </button>
            ))}
          </div>
        </fieldset>

        <section className="mt-7">
          <h2 className="font-display text-2xl">Choose a team name</h2>
          <div className="mt-3 grid gap-2 sm:grid-cols-2">
            {TEAM_NAMES.map(teamName => {
              const taken = takenNames.has(makeTeamNameKey(teamName));
              return (
                <button
                  key={teamName}
                  type="button"
                  disabled={taken || !playerCount || joiningName !== null}
                  onClick={() => void handleJoin(teamName)}
                  className="min-h-14 border-2 border-white bg-cjsr-surface px-4 py-3 text-left font-bold text-white disabled:border-neutral-600 disabled:bg-neutral-900 disabled:text-neutral-500"
                >
                  <span>{teamName}</span>
                  {taken && <span className="ml-2 text-sm uppercase tracking-wide">(taken)</span>}
                  {joiningName === teamName && <span className="ml-2 text-sm uppercase tracking-wide">(joining...)</span>}
                </button>
              );
            })}
          </div>
        </section>

        {message && <p className="mt-4 font-bold text-cjsr-magenta" role="status">{message}</p>}
        <TerritoryText />
      </section>
    </PlayerShell>
  );
}

function PlayerShell({ children, status, error }: { children: React.ReactNode; status: string; error: string | null }) {
  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center gap-2 text-sm" aria-live="polite">
        <span className="border border-cjsr-magenta px-2 py-1 font-bold uppercase tracking-wide">Connection: {status}</span>
        {error && <span className="text-cjsr-magenta">{error}</span>}
      </div>
      {children}
    </div>
  );
}

function LobbyPanel({ team, phase, canLeave, onLeave }: { team: Team; phase: string; canLeave: boolean; onLeave: () => void }) {
  return (
    <section className="page-card p-6" aria-live="polite">
      <p className="text-sm font-black uppercase tracking-wide text-cjsr-magenta">You're in</p>
      <h1 className="mt-3 font-display text-4xl leading-tight">{team.teamName}</h1>
      <p className="mt-4 text-lg text-cjsr-paper">
        {team.playerCount} player{team.playerCount !== 1 ? 's' : ''}. Watch the screen for the next instruction.
      </p>
      <p className="mt-4 text-sm uppercase tracking-wide text-cjsr-paper">Current game state: {phase}</p>
      <button
        type="button"
        disabled={!canLeave}
        onClick={onLeave}
        className="mt-6 min-h-11 border-2 border-cjsr-magenta px-4 py-2 font-bold text-white disabled:border-neutral-600 disabled:text-neutral-500"
      >
        Leave / change team
      </button>
      {!canLeave && <p className="mt-3 text-sm text-cjsr-paper">Team changes are locked outside the lobby.</p>}
      <TerritoryText />
    </section>
  );
}

function TerritoryText() {
  return (
    <p className="mt-6 max-w-3xl text-sm text-cjsr-paper">
      CJSR is located in amiskwaciy-wâskahikan, the city of Edmonton, on Treaty 6 territory and region 4 of the Métis Nation of Alberta.
    </p>
  );
}
