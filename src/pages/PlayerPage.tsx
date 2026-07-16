import { useCallback, useEffect, useMemo, useState } from 'react';
import type { LeaderboardEntry, Question, Team } from '../types';
import { useGameSubscription } from '../hooks/useGameSubscription';
import { useQuestionTimer } from '../hooks/useQuestionTimer';
import { joinTeam, makeTeamNameKey, submitAnswerIfMissing } from '../lib/firebaseData';
import { buildLeaderboard } from '../lib/leaderboard';
import { DEFAULT_GAME_CODE } from '../lib/hostState';
import { clearStoredTeamId, getStoredTeamId, storeTeamId } from '../lib/storage';
import { getPointsForQuestion, getQuestionByIndex, OVERFLOW_TEAM_NAMES, resolveQuestions, TEAM_NAMES } from '../lib/triviaData';

type PlayerCount = 1 | 2 | 3 | 4;

export function PlayerPage() {
  const [storedTeamId, setStoredTeamId] = useState<string | null>(getStoredTeamId);
  const [playerCount, setPlayerCount] = useState<PlayerCount | null>(null);
  const [joiningName, setJoiningName] = useState<string | null>(null);
  const [message, setMessage] = useState<string | null>(null);
  const { gameState, status, error } = useGameSubscription(DEFAULT_GAME_CODE);
  const questions = useMemo(() => resolveQuestions(gameState), [gameState]);

  const currentTeam = useMemo(
    () => gameState?.teams.find(team => team.id === storedTeamId && team.isActive) ?? null,
    [gameState?.teams, storedTeamId],
  );
  const takenNames = useMemo(() => new Set(gameState?.teams.filter(team => team.isActive).map(team => makeTeamNameKey(team.teamName)) ?? []), [gameState?.teams]);
  const isPrimaryListFull = useMemo(() => TEAM_NAMES.every(name => takenNames.has(makeTeamNameKey(name))), [takenNames]);
  const availableTeamNames = isPrimaryListFull ? [...TEAM_NAMES, ...OVERFLOW_TEAM_NAMES] : TEAM_NAMES;
  const phase = gameState?.game.phase ?? 'lobby';
  const canJoin = phase === 'lobby' || phase === 'break';
  const leaderboard = useMemo(() => buildLeaderboard(gameState?.teams ?? []), [gameState?.teams]);
  const currentAnswer = useMemo(
    () => gameState?.answers.find(answer => answer.teamId === storedTeamId && answer.questionIndex === gameState.game.currentQuestionIndex) ?? null,
    [gameState?.answers, gameState?.game.currentQuestionIndex, storedTeamId],
  );

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
      const team = await joinTeam(DEFAULT_GAME_CODE, { teamName, playerCount });
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
    if (phase === 'question' && gameState?.game.currentQuestionIndex) {
      return (
        <PlayerShell status={status} error={error?.message ?? null}>
          <QuestionPanel
            gameCode={DEFAULT_GAME_CODE}
            team={currentTeam}
            questions={questions}
            questionIndex={gameState.game.currentQuestionIndex}
            questionStartedAt={gameState.game.questionStartedAt}
            answerChoice={currentAnswer?.choiceIndex ?? undefined}
            lockedAnswerExists={currentAnswer !== null}
            lockedCount={gameState.answers.filter(answer => answer.questionIndex === gameState.game.currentQuestionIndex).length}
            teamCount={gameState.teams.filter(team => team.isActive).length}
          />
        </PlayerShell>
      );
    }

    if (phase === 'reveal' && gameState?.game.currentQuestionIndex) {
      return (
        <PlayerShell status={status} error={error?.message ?? null}>
          <RevealPanel
            team={currentTeam}
            questions={questions}
            questionIndex={gameState.game.currentQuestionIndex}
            answerChoice={currentAnswer?.choiceIndex ?? null}
            pointsAwarded={currentAnswer?.pointsAwarded ?? 0}
          />
        </PlayerShell>
      );
    }

    if (phase === 'final') {
      return (
        <PlayerShell status={status} error={error?.message ?? null}>
          <FinalPanel team={currentTeam} leaderboard={leaderboard} />
        </PlayerShell>
      );
    }

    return (
      <PlayerShell status={status} error={error?.message ?? null}>
        <LobbyPanel team={currentTeam} phase={phase} canLeave={phase === 'lobby'} onLeave={leaveTeam} />
      </PlayerShell>
    );
  }

  if (phase === 'final') {
    return (
      <PlayerShell status={status} error={error?.message ?? null}>
        <FinalPanel team={null} leaderboard={leaderboard} />
      </PlayerShell>
    );
  }

  if (!canJoin) {
    return (
      <PlayerShell status={status} error={error?.message ?? null}>
        <section className="page-card p-6" aria-live="polite">
          <p className="text-sm font-black uppercase tracking-wide text-cjsr-red-light">Round in progress</p>
          <h1 className="mt-3 font-display text-4xl leading-tight">You'll be able to join at the next standings checkpoint.</h1>
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
        <p className="text-sm font-black uppercase tracking-wide text-cjsr-red-light">Player join</p>
        <h1 className="mt-3 font-display text-4xl leading-tight">Join CJSR Volunteer Appreciation Trivia</h1>
        <p className="mt-4 max-w-2xl text-lg text-cjsr-paper">
          Thirty questions, one hour, no pee breaks. Stakes climb as we go, so pace yourself. Each team has 15 seconds to answer AND LOCK IN their answers. Don't forget to lock in your answers or they won't count and your huge brains will feel bad about it. We're dialed in on Canadian music from the deep past through to present day. As radio aficionados, you all SHOULD ace this. Don't let me down. Most points at the end take it all. The prizes are CJSR swag and glory, sweet sweet glory.
        </p>

        <fieldset className="mt-6">
          <legend className="font-display text-2xl">How many players?</legend>
          <div className="mt-3 grid grid-cols-4 gap-2">
            {([1, 2, 3, 4] as const).map(count => (
              <button
                key={count}
                type="button"
                className={`min-h-14 border-2 px-3 py-2 text-xl font-black ${playerCount === count ? 'border-cjsr-red bg-cjsr-red text-white' : 'border-cjsr-ink bg-cjsr-surface text-cjsr-ink'}`}
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
          {isPrimaryListFull && (
            <p className="mt-2 text-sm font-bold text-cjsr-paper">More names unlocked because the first 20 are full.</p>
          )}
          <div className="mt-3 grid gap-2 sm:grid-cols-2">
            {availableTeamNames.map(teamName => {
              const taken = takenNames.has(makeTeamNameKey(teamName));
              return (
                <button
                  key={teamName}
                  type="button"
                  disabled={taken || !playerCount || joiningName !== null}
                  onClick={() => void handleJoin(teamName)}
                  className="min-h-14 border-2 border-cjsr-ink bg-cjsr-surface px-4 py-3 text-left font-bold text-cjsr-ink disabled:border-cjsr-paper/40 disabled:bg-cjsr-surface disabled:text-cjsr-paper/70"
                >
                  <span>{teamName}</span>
                  {taken && <span className="ml-2 text-sm uppercase tracking-wide">(taken)</span>}
                  {joiningName === teamName && <span className="ml-2 text-sm uppercase tracking-wide">(joining...)</span>}
                </button>
              );
            })}
          </div>
        </section>

        {message && <p className="mt-4 font-bold text-cjsr-red-light" role="status">{message}</p>}
        <TerritoryText />
      </section>
    </PlayerShell>
  );
}

function FinalPanel({ team, leaderboard }: { team: Team | null; leaderboard: LeaderboardEntry[] }) {
  const teamEntry = team ? leaderboard.find(entry => entry.teamId === team.id) ?? null : null;
  const winner = leaderboard[0] ?? null;

  return (
    <section className="page-card p-6" aria-live="polite">
      <p className="text-sm font-black uppercase tracking-wide text-cjsr-red-light">Final standings</p>
      <h1 className="mt-3 font-display text-4xl leading-tight">
        {teamEntry ? `${teamEntry.teamName}: #${teamEntry.rank}` : winner ? `${winner.teamName} wins!` : 'Thanks for playing!'}
      </h1>
      {teamEntry && (
        <p className="mt-4 text-2xl font-black">
          {teamEntry.score} point{teamEntry.score !== 1 ? 's' : ''}
        </p>
      )}
      {winner && !teamEntry && <p className="mt-4 text-2xl font-black">{winner.score} point{winner.score !== 1 ? 's' : ''}</p>}

      <ol className="mt-6 space-y-2">
        {leaderboard.slice(0, 10).map(entry => (
          <li
            key={entry.teamId}
            className={`grid grid-cols-[3rem_1fr_auto] items-center gap-3 border-2 p-3 ${entry.teamId === team?.id ? 'border-cjsr-red bg-cjsr-red text-white' : 'border-cjsr-ink/50 bg-cjsr-surface text-cjsr-ink'}`}
          >
            <span className="text-xl font-black">#{entry.rank}</span>
            <span className="min-w-0 font-bold">{entry.teamName}</span>
            <span className="font-black">{entry.score}</span>
          </li>
        ))}
      </ol>
      {leaderboard.length === 0 && <p className="mt-4 text-lg text-cjsr-paper">No teams joined this game.</p>}
      <TerritoryText />
    </section>
  );
}

function QuestionPanel({
  gameCode,
  team,
  questions,
  questionIndex,
  questionStartedAt,
  answerChoice,
  lockedAnswerExists,
  lockedCount,
  teamCount,
}: {
  gameCode: string;
  team: Team;
  questions: readonly Question[];
  questionIndex: number;
  questionStartedAt: number | null;
  answerChoice: 0 | 1 | 2 | 3 | null | undefined;
  lockedAnswerExists: boolean;
  lockedCount: number;
  teamCount: number;
}) {
  const question = getQuestionByIndex(questions, questionIndex);
  const [selectedChoice, setSelectedChoice] = useState<0 | 1 | 2 | 3 | null>(answerChoice ?? null);
  const [lockMessage, setLockMessage] = useState<string | null>(null);
  const [isLocking, setIsLocking] = useState(false);
  const timer = useQuestionTimer(questionStartedAt);

  useEffect(() => {
    if (answerChoice !== undefined) setSelectedChoice(answerChoice);
  }, [answerChoice]);

  const lockAnswer = useCallback(async (choice: 0 | 1 | 2 | 3 | null, timedOut = false) => {
    if (lockedAnswerExists || isLocking) return;
    setIsLocking(true);
    setLockMessage(null);
    try {
      await submitAnswerIfMissing(gameCode, team.id, questionIndex, {
        choiceIndex: choice,
        timeToLockMs: questionStartedAt === null ? null : Math.max(0, timer.elapsedMs),
      });
      setLockMessage(timedOut ? 'Out of time.' : 'Locked. Waiting for the room...');
    } catch (caught) {
      setLockMessage(caught instanceof Error ? caught.message : 'Could not lock answer.');
    } finally {
      setIsLocking(false);
    }
  }, [gameCode, isLocking, lockedAnswerExists, questionIndex, questionStartedAt, team.id, timer.elapsedMs]);

  useEffect(() => {
    if (!timer.isExpired || lockedAnswerExists || isLocking) return;
    void lockAnswer(null, true);
  }, [timer.isExpired, lockedAnswerExists, isLocking, lockAnswer]);

  if (!question) {
    return (
      <section className="page-card p-6">
        <h1 className="font-display text-3xl">Question missing</h1>
      </section>
    );
  }

  const locked = lockedAnswerExists || lockMessage === 'Locked. Waiting for the room...' || lockMessage === 'Out of time.';
  const pointValue = getPointsForQuestion(questions, questionIndex);

  return (
    <section className="page-card p-5 sm:p-6" aria-live="polite">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <p className="text-sm font-black uppercase tracking-wide text-cjsr-red-light">Question {questionIndex}</p>
          <h1 className="mt-2 text-3xl font-bold leading-tight">{question.text}</h1>
        </div>
        <span className="border-2 border-cjsr-red px-3 py-2 font-black text-cjsr-red-light">Worth {pointValue} point{pointValue !== 1 ? 's' : ''}</span>
      </div>

      <div className="mt-5" role="timer" aria-label={`${timer.secondsRemaining} seconds remaining`}>
        <div className="flex items-center justify-between text-sm font-bold uppercase tracking-wide">
          <span>Timer</span>
          <span>{timer.secondsRemaining}s</span>
        </div>
        <div className="mt-2 h-4 border-2 border-cjsr-ink bg-cjsr-black">
          <div className="h-full bg-cjsr-red transition-[width]" style={{ width: `${Math.round(timer.progress * 100)}%` }} />
        </div>
      </div>

      <div className="mt-6 grid gap-3">
        {question.choices.map((choice, index) => {
          const choiceIndex = index as 0 | 1 | 2 | 3;
          const selected = selectedChoice === choiceIndex;
          return (
            <button
              key={choice}
              type="button"
              disabled={locked || timer.isExpired}
              onClick={() => setSelectedChoice(choiceIndex)}
              className={`min-h-16 border-2 px-4 py-3 text-left text-lg font-bold disabled:opacity-55 ${selected ? 'border-cjsr-red bg-cjsr-red text-white' : 'border-cjsr-ink bg-cjsr-surface text-cjsr-ink'}`}
              aria-pressed={selected}
            >
              <span className="mr-3 font-black">{String.fromCharCode(65 + index)}.</span>
              {choice}
            </button>
          );
        })}
      </div>

      <button
        type="button"
        disabled={locked || selectedChoice === null || timer.isExpired || isLocking}
        onClick={() => void lockAnswer(selectedChoice)}
        className="mt-5 min-h-14 w-full border-2 border-cjsr-red bg-cjsr-red px-5 py-3 text-xl font-black text-white disabled:border-cjsr-paper/40 disabled:bg-cjsr-surface disabled:text-cjsr-paper/70"
      >
        {isLocking ? 'LOCKING...' : locked ? 'LOCKED' : 'LOCK IN'}
      </button>

      <p className="mt-4 font-bold text-cjsr-paper" role="status">
        {lockMessage ?? (lockedAnswerExists ? 'Locked. Waiting for the room...' : `${lockedCount} / ${teamCount} teams locked`)}
      </p>
    </section>
  );
}

function RevealPanel({ team, questions, questionIndex, answerChoice, pointsAwarded }: { team: Team; questions: readonly Question[]; questionIndex: number; answerChoice: 0 | 1 | 2 | 3 | null; pointsAwarded: number }) {
  const question = getQuestionByIndex(questions, questionIndex);
  if (!question) return null;
  const correct = answerChoice === question.answer;
  const displayPointsAwarded = correct ? Math.max(pointsAwarded, getPointsForQuestion(questions, questionIndex)) : 0;
  return (
    <section className="page-card p-6" aria-live="polite">
      <p className="text-sm font-black uppercase tracking-wide text-cjsr-red-light">Reveal</p>
      <h1 className="mt-3 text-3xl font-bold">{question.text}</h1>
      <div className="mt-5 grid gap-2">
        {question.choices.map((choice, index) => {
          const isCorrect = index === question.answer;
          const isTeamChoice = index === answerChoice;
          return (
            <div key={choice} className={`border-2 p-3 font-bold ${isCorrect ? 'border-cjsr-correct text-cjsr-correct' : isTeamChoice ? 'border-cjsr-red text-cjsr-red-light' : 'border-cjsr-ink/50 text-cjsr-paper'}`}>
              {String.fromCharCode(65 + index)}. {choice}
              {isCorrect && ' (correct)'}
              {isTeamChoice && !isCorrect && ' (your answer)'}
            </div>
          );
        })}
      </div>
      <p className="mt-5 text-2xl font-black">{answerChoice === null ? 'Timed out.' : correct ? 'Correct!' : 'Not this time.'}</p>
      <p className="mt-2 text-xl">+{displayPointsAwarded} points - Running total: {team.score}</p>
    </section>
  );
}

function PlayerShell({ children, status, error }: { children: React.ReactNode; status: string; error: string | null }) {
  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center gap-2 text-sm" aria-live="polite">
        <span className="border border-cjsr-red px-2 py-1 font-bold uppercase tracking-wide">Connection: {status}</span>
        {error && <span className="text-cjsr-red-light">{error}</span>}
      </div>
      {children}
    </div>
  );
}

function LobbyPanel({ team, phase, canLeave, onLeave }: { team: Team; phase: string; canLeave: boolean; onLeave: () => void }) {
  return (
    <section className="page-card p-6" aria-live="polite">
      <p className="text-sm font-black uppercase tracking-wide text-cjsr-red-light">You're in</p>
      <h1 className="mt-3 font-display text-4xl leading-tight">{team.teamName}</h1>
      <p className="mt-4 text-lg text-cjsr-paper">
        {team.playerCount} player{team.playerCount !== 1 ? 's' : ''}. Watch the screen for the next instruction.
      </p>
      <p className="mt-4 text-sm uppercase tracking-wide text-cjsr-paper">Current game state: {phase}</p>
      <button
        type="button"
        disabled={!canLeave}
        onClick={onLeave}
        className="mt-6 min-h-11 border-2 border-cjsr-red px-4 py-2 font-bold text-cjsr-ink disabled:border-neutral-600 disabled:text-neutral-500"
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
      CJSR is located in amiskwaciy-waskahikan, the city of Edmonton, on Treaty 6 territory and region 4 of the Metis Nation of Alberta.
    </p>
  );
}
