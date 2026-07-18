import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import type { ChoiceIndex, LeaderboardEntry, Question, Team } from '../types';
import { useGameSubscription } from '../hooks/useGameSubscription';
import { useQuestionTimer } from '../hooks/useQuestionTimer';
import { joinTeam, makeTeamNameKey, submitAnswerIfMissing } from '../lib/firebaseData';
import { buildLeaderboard } from '../lib/leaderboard';
import { DEFAULT_GAME_CODE } from '../lib/hostState';
import { clearStoredTeamId, getStoredTeamId, storeTeamId } from '../lib/storage';
import { getPointsForQuestion, getQuestionByIndex, OVERFLOW_TEAM_NAMES, resolveQuestions, TEAM_NAMES } from '../lib/triviaData';
import { siteConfig } from '../config/site';

type PlayerCount = number;

export function PlayerPage() {
  const [storedTeamId, setStoredTeamId] = useState<string | null>(getStoredTeamId);
  const [playerCount, setPlayerCount] = useState<PlayerCount | null>(null);
  const [joiningName, setJoiningName] = useState<string | null>(null);
  const [customName, setCustomName] = useState('');
  const [message, setMessage] = useState<string | null>(null);
  const { gameState, status, error } = useGameSubscription(DEFAULT_GAME_CODE);
  const questions = useMemo(() => resolveQuestions(gameState), [gameState]);

  const currentTeam = useMemo(
    () => gameState?.teams.find(team => team.id === storedTeamId && team.isActive) ?? null,
    [gameState?.teams, storedTeamId],
  );
  const takenNames = useMemo(() => new Set(gameState?.teams.filter(team => team.isActive).map(team => makeTeamNameKey(team.teamName)) ?? []), [gameState?.teams]);
  const isPrimaryListFull = useMemo(() => TEAM_NAMES.length > 0 && TEAM_NAMES.every(name => takenNames.has(makeTeamNameKey(name))), [takenNames]);
  const availableTeamNames = isPrimaryListFull ? [...TEAM_NAMES, ...OVERFLOW_TEAM_NAMES] : TEAM_NAMES;
  const customNameKey = makeTeamNameKey(customName);
  const isCustomNameTaken = customNameKey !== '' && takenNames.has(customNameKey);
  const phase = gameState?.game.phase ?? 'lobby';
  const canJoin = phase === 'lobby' || phase === 'reveal' || phase === 'break';
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
            answerChoiceIndexes={currentAnswer?.choiceIndexes ?? undefined}
            answerText={currentAnswer?.textAnswer ?? undefined}
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
            answerChoiceIndexes={currentAnswer?.choiceIndexes ?? null}
            answerText={currentAnswer?.textAnswer ?? null}
            isCorrect={currentAnswer?.isCorrect ?? null}
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
          <p className="text-sm font-black uppercase tracking-wide text-brand-red-light">Question in progress</p>
          <h1 className="mt-3 font-display text-4xl leading-tight">You'll be able to join as soon as this question wraps up.</h1>
          <p className="mt-4 text-lg text-brand-paper">
            Keep this page open. It will update automatically when joining reopens.
          </p>
        </section>
      </PlayerShell>
    );
  }

  return (
    <PlayerShell status={status} error={error?.message ?? null}>
      <section className="page-card p-5 sm:p-6">
        <p className="text-sm font-black uppercase tracking-wide text-brand-red-light">Player join</p>
        <h1 className="mt-3 font-display text-4xl leading-tight">{siteConfig.joinHeadline}</h1>
        <p className="mt-4 max-w-2xl text-lg text-brand-paper">
          {siteConfig.joinDescription}
        </p>

        <fieldset className="mt-6">
          <legend className="font-display text-2xl">How many players?</legend>
          <div className="mt-3 grid gap-2" style={{ gridTemplateColumns: `repeat(${siteConfig.maxPlayersPerTeam}, minmax(0, 1fr))` }}>
            {Array.from({ length: siteConfig.maxPlayersPerTeam }, (_, index) => index + 1).map(count => (
              <button
                key={count}
                type="button"
                className={`min-h-14 border-2 px-3 py-2 text-xl font-black ${playerCount === count ? 'border-brand-red bg-brand-red text-white' : 'border-brand-ink bg-brand-surface text-brand-ink'}`}
                onClick={() => setPlayerCount(count)}
                aria-pressed={playerCount === count}
              >
                {count}
              </button>
            ))}
          </div>
        </fieldset>

        {TEAM_NAMES.length > 0 && (
          <section className="mt-7">
            <h2 className="font-display text-2xl">Choose a team name</h2>
            {isPrimaryListFull && (
              <p className="mt-2 text-sm font-bold text-brand-paper">More names unlocked because the first 20 are full.</p>
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
                    className="min-h-14 border-2 border-brand-ink bg-brand-surface px-4 py-3 text-left font-bold text-brand-ink disabled:border-brand-paper/40 disabled:bg-brand-surface disabled:text-brand-paper/70"
                  >
                    <span>{teamName}</span>
                    {taken && <span className="ml-2 text-sm uppercase tracking-wide">(taken)</span>}
                    {joiningName === teamName && <span className="ml-2 text-sm uppercase tracking-wide">(joining...)</span>}
                  </button>
                );
              })}
            </div>
          </section>
        )}

        <section className="mt-7">
          <h2 className="font-display text-2xl">{TEAM_NAMES.length > 0 ? 'Or name your own team' : 'Name your team'}</h2>
          <form
            className="mt-3 flex flex-col gap-2 sm:flex-row"
            onSubmit={event => {
              event.preventDefault();
              const trimmed = customName.trim();
              if (!trimmed) {
                setMessage('Type a team name first.');
                return;
              }
              void handleJoin(trimmed);
            }}
          >
            <label className="sr-only" htmlFor="custom-team-name">Team name</label>
            <input
              id="custom-team-name"
              type="text"
              value={customName}
              onChange={event => setCustomName(event.target.value)}
              maxLength={40}
              placeholder="Type your own team name"
              disabled={!playerCount || joiningName !== null}
              className="min-h-14 flex-1 border-2 border-brand-ink bg-brand-surface px-4 py-3 text-brand-ink disabled:border-brand-paper/40 disabled:bg-brand-surface disabled:text-brand-paper/70"
            />
            <button
              type="submit"
              disabled={!playerCount || joiningName !== null || !customName.trim() || isCustomNameTaken}
              className="min-h-14 border-2 border-brand-red bg-brand-red px-5 py-3 font-black text-white disabled:border-brand-paper/40 disabled:bg-brand-surface disabled:text-brand-paper/70"
            >
              {joiningName === customName.trim() ? 'Joining...' : 'Join'}
            </button>
          </form>
          {isCustomNameTaken && <p className="mt-2 text-sm font-bold text-brand-paper">That name is taken.</p>}
        </section>

        {message && <p className="mt-4 font-bold text-brand-red-light" role="status">{message}</p>}
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
      <p className="text-sm font-black uppercase tracking-wide text-brand-red-light">Final standings</p>
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
            className={`grid grid-cols-[3rem_1fr_auto] items-center gap-3 border-2 p-3 ${entry.teamId === team?.id ? 'border-brand-red bg-brand-red text-white' : 'border-brand-ink/50 bg-brand-surface text-brand-ink'}`}
          >
            <span className="text-xl font-black">#{entry.rank}</span>
            <span className="min-w-0 font-bold">{entry.teamName}</span>
            <span className="font-black">{entry.score}</span>
          </li>
        ))}
      </ol>
      {leaderboard.length === 0 && <p className="mt-4 text-lg text-brand-paper">No teams joined this game.</p>}
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
  answerChoiceIndexes,
  answerText,
  lockedAnswerExists,
  lockedCount,
  teamCount,
}: {
  gameCode: string;
  team: Team;
  questions: readonly Question[];
  questionIndex: number;
  questionStartedAt: number | null;
  answerChoice: ChoiceIndex | null | undefined;
  answerChoiceIndexes: readonly ChoiceIndex[] | null | undefined;
  answerText: string | null | undefined;
  lockedAnswerExists: boolean;
  lockedCount: number;
  teamCount: number;
}) {
  const question = getQuestionByIndex(questions, questionIndex);
  const [selectedChoice, setSelectedChoice] = useState<ChoiceIndex | null>(answerChoice ?? null);
  const [selectedChoices, setSelectedChoices] = useState<ChoiceIndex[]>(answerChoiceIndexes ? [...answerChoiceIndexes] : []);
  const [textInput, setTextInput] = useState(answerText ?? '');
  const [lockMessage, setLockMessage] = useState<string | null>(null);
  const [isLocking, setIsLocking] = useState(false);
  const timer = useQuestionTimer(questionStartedAt);
  const choiceButtonRefs = useRef<(HTMLButtonElement | null)[]>([]);

  useEffect(() => {
    if (answerChoice !== undefined) setSelectedChoice(answerChoice);
  }, [answerChoice]);

  useEffect(() => {
    if (answerChoiceIndexes !== undefined) setSelectedChoices(answerChoiceIndexes ? [...answerChoiceIndexes] : []);
  }, [answerChoiceIndexes]);

  useEffect(() => {
    if (answerText !== undefined) setTextInput(answerText ?? '');
  }, [answerText]);

  const lockAnswer = useCallback(async (choice: ChoiceIndex | null, choiceIndexes: readonly ChoiceIndex[] | null, text: string | null, timedOut = false) => {
    if (lockedAnswerExists || isLocking) return;
    setIsLocking(true);
    setLockMessage(null);
    try {
      await submitAnswerIfMissing(gameCode, team.id, questionIndex, {
        choiceIndex: choice,
        choiceIndexes,
        textAnswer: text,
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
    void lockAnswer(null, null, null, true);
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
  const isMultiSelect = question.type === 'multi_select';
  const isFreeText = question.type === 'free_text';
  const hasSelection = isFreeText ? textInput.trim().length > 0 : isMultiSelect ? selectedChoices.length > 0 : selectedChoice !== null;

  function toggleChoice(index: ChoiceIndex) {
    if (isMultiSelect) {
      setSelectedChoices(previous => (previous.includes(index) ? previous.filter(value => value !== index) : [...previous, index]));
    } else {
      setSelectedChoice(index);
    }
  }

  function handleChoiceKeyDown(event: React.KeyboardEvent<HTMLButtonElement>, index: number) {
    if (isMultiSelect) return;
    const total = 4; // MultipleChoiceQuestion and MultiSelectQuestion both always have exactly 4 choices
    let nextIndex: number | null = null;
    if (event.key === 'ArrowDown' || event.key === 'ArrowRight') nextIndex = (index + 1) % total;
    else if (event.key === 'ArrowUp' || event.key === 'ArrowLeft') nextIndex = (index - 1 + total) % total;
    if (nextIndex === null) return;
    event.preventDefault();
    setSelectedChoice(nextIndex as ChoiceIndex);
    choiceButtonRefs.current[nextIndex]?.focus();
  }

  function submitLock() {
    if (isFreeText) {
      void lockAnswer(null, null, textInput.trim());
    } else if (isMultiSelect) {
      void lockAnswer(null, selectedChoices, null);
    } else {
      void lockAnswer(selectedChoice, null, null);
    }
  }

  return (
    <section className="page-card p-5 sm:p-6" aria-live="polite">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <p className="text-sm font-black uppercase tracking-wide text-brand-red-light">Question {questionIndex}</p>
          <h1 className="mt-2 text-3xl font-bold leading-tight">{question.text}</h1>
        </div>
        <span className="border-2 border-brand-red px-3 py-2 font-black text-brand-red-light">Worth {pointValue} point{pointValue !== 1 ? 's' : ''}</span>
      </div>

      {question.media?.type === 'image' && (
        <img src={question.media.url} alt={question.media.altText} className="mt-4 max-h-64 w-full border-2 border-brand-ink object-contain" />
      )}

      <div className="mt-5" role="timer" aria-label={`${timer.secondsRemaining} seconds remaining`}>
        <div className="flex items-center justify-between text-sm font-bold uppercase tracking-wide">
          <span>Timer</span>
          <span>{timer.secondsRemaining}s</span>
        </div>
        <div className="mt-2 h-4 border-2 border-brand-ink bg-brand-black">
          <div className="h-full bg-brand-red transition-[width]" style={{ width: `${Math.round(timer.progress * 100)}%` }} />
        </div>
      </div>

      {isMultiSelect && <p className="mt-4 text-sm font-bold uppercase tracking-wide text-brand-paper">Select all that apply</p>}

      {isFreeText ? (
        <div className="mt-6">
          <label className="sr-only" htmlFor="free-text-answer">Your answer</label>
          <input
            id="free-text-answer"
            type="text"
            value={textInput}
            disabled={locked || timer.isExpired}
            onChange={event => setTextInput(event.target.value)}
            maxLength={200}
            placeholder="Type your answer"
            className="min-h-14 w-full border-2 border-brand-ink bg-brand-surface px-4 py-3 text-lg text-brand-ink disabled:opacity-55"
          />
        </div>
      ) : (
        <div
          className="mt-6 grid gap-3"
          role={isMultiSelect ? undefined : 'radiogroup'}
          aria-label={isMultiSelect ? undefined : 'Choose your answer'}
        >
          {question.choices.map((choice, index) => {
            const choiceIndex = index as ChoiceIndex;
            const selected = isMultiSelect ? selectedChoices.includes(choiceIndex) : selectedChoice === choiceIndex;
            const isTabStop = isMultiSelect || selected || (selectedChoice === null && index === 0);
            return (
              <button
                key={choice}
                ref={el => { choiceButtonRefs.current[index] = el; }}
                type="button"
                role={isMultiSelect ? undefined : 'radio'}
                aria-checked={isMultiSelect ? undefined : selected}
                aria-pressed={isMultiSelect ? selected : undefined}
                tabIndex={isMultiSelect ? undefined : (isTabStop ? 0 : -1)}
                disabled={locked || timer.isExpired}
                onClick={() => toggleChoice(choiceIndex)}
                onKeyDown={event => handleChoiceKeyDown(event, index)}
                className={`min-h-16 border-2 px-4 py-3 text-left text-lg font-bold disabled:opacity-55 ${selected ? 'border-brand-red bg-brand-red text-white' : 'border-brand-ink bg-brand-surface text-brand-ink'}`}
              >
                <span className="mr-3 font-black">{String.fromCharCode(65 + index)}.</span>
                {choice}
              </button>
            );
          })}
        </div>
      )}

      <button
        type="button"
        disabled={locked || !hasSelection || timer.isExpired || isLocking}
        onClick={submitLock}
        className="mt-5 min-h-14 w-full border-2 border-brand-red bg-brand-red px-5 py-3 text-xl font-black text-white disabled:border-brand-paper/40 disabled:bg-brand-surface disabled:text-brand-paper/70"
      >
        {isLocking ? 'LOCKING...' : locked ? 'LOCKED' : 'LOCK IN'}
      </button>

      <p className="mt-4 font-bold text-brand-paper" role="status">
        {lockMessage ?? (lockedAnswerExists ? 'Locked. Waiting for the room...' : `${lockedCount} / ${teamCount} teams locked`)}
      </p>
    </section>
  );
}

function RevealPanel({ team, questions, questionIndex, answerChoice, answerChoiceIndexes, answerText, isCorrect, pointsAwarded }: {
  team: Team;
  questions: readonly Question[];
  questionIndex: number;
  answerChoice: ChoiceIndex | null;
  answerChoiceIndexes: readonly ChoiceIndex[] | null;
  answerText: string | null;
  isCorrect: boolean | null;
  pointsAwarded: number;
}) {
  const question = getQuestionByIndex(questions, questionIndex);
  if (!question) return null;

  if (question.type === 'free_text') {
    const timedOut = answerText === null;
    const correct = !timedOut && (isCorrect ?? false);
    const displayPointsAwarded = correct ? Math.max(pointsAwarded, getPointsForQuestion(questions, questionIndex)) : 0;
    return (
      <section className="page-card p-6" aria-live="polite">
        <p className="text-sm font-black uppercase tracking-wide text-brand-red-light">Reveal</p>
        <h1 className="mt-3 text-3xl font-bold">{question.text}</h1>
        {question.media?.type === 'image' && (
          <img src={question.media.url} alt={question.media.altText} className="mt-4 max-h-64 w-full border-2 border-brand-ink object-contain" />
        )}
        <p className="mt-5 text-lg text-brand-paper">
          Accepted answer{question.acceptedAnswers.length !== 1 ? 's' : ''}: {question.acceptedAnswers.join(', ')}
        </p>
        {answerText !== null && <p className="mt-2 text-lg font-bold">Your answer: {answerText || '(blank)'}</p>}
        <p className="mt-5 text-2xl font-black">{timedOut ? 'Timed out.' : correct ? 'Correct!' : 'Not this time.'}</p>
        <p className="mt-2 text-xl">+{displayPointsAwarded} points - Running total: {team.score}</p>
      </section>
    );
  }

  const isMultiSelect = question.type === 'multi_select';
  const correctSet = new Set<ChoiceIndex>(isMultiSelect ? question.answers : [question.answer]);
  const teamSet = new Set<ChoiceIndex>(isMultiSelect ? (answerChoiceIndexes ?? []) : (answerChoice === null ? [] : [answerChoice]));
  const timedOut = isMultiSelect ? answerChoiceIndexes === null : answerChoice === null;
  const correct = !timedOut && correctSet.size === teamSet.size && [...correctSet].every(value => teamSet.has(value));
  const displayPointsAwarded = correct ? Math.max(pointsAwarded, getPointsForQuestion(questions, questionIndex)) : 0;
  return (
    <section className="page-card p-6" aria-live="polite">
      <p className="text-sm font-black uppercase tracking-wide text-brand-red-light">Reveal</p>
      <h1 className="mt-3 text-3xl font-bold">{question.text}</h1>
      {question.media?.type === 'image' && (
        <img src={question.media.url} alt={question.media.altText} className="mt-4 max-h-64 w-full border-2 border-brand-ink object-contain" />
      )}
      <div className="mt-5 grid gap-2">
        {question.choices.map((choice, index) => {
          const choiceIndex = index as ChoiceIndex;
          const isCorrect = correctSet.has(choiceIndex);
          const isTeamChoice = teamSet.has(choiceIndex);
          return (
            <div key={choice} className={`border-2 p-3 font-bold ${isCorrect ? 'border-brand-correct text-brand-correct' : isTeamChoice ? 'border-brand-red text-brand-red-light' : 'border-brand-ink/50 text-brand-paper'}`}>
              {String.fromCharCode(65 + index)}. {choice}
              {isCorrect && ' (correct)'}
              {isTeamChoice && !isCorrect && ' (your answer)'}
            </div>
          );
        })}
      </div>
      <p className="mt-5 text-2xl font-black">{timedOut ? 'Timed out.' : correct ? 'Correct!' : 'Not this time.'}</p>
      <p className="mt-2 text-xl">+{displayPointsAwarded} points - Running total: {team.score}</p>
    </section>
  );
}

function PlayerShell({ children, status, error }: { children: React.ReactNode; status: string; error: string | null }) {
  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center gap-2 text-sm" aria-live="polite">
        <span className="border border-brand-red px-2 py-1 font-bold uppercase tracking-wide">Connection: {status}</span>
        {error && <span className="text-brand-red-light">{error}</span>}
      </div>
      {children}
    </div>
  );
}

function LobbyPanel({ team, phase, canLeave, onLeave }: { team: Team; phase: string; canLeave: boolean; onLeave: () => void }) {
  return (
    <section className="page-card p-6" aria-live="polite">
      <p className="text-sm font-black uppercase tracking-wide text-brand-red-light">You're in</p>
      <h1 className="mt-3 font-display text-4xl leading-tight">{team.teamName}</h1>
      <p className="mt-4 text-lg text-brand-paper">
        {team.playerCount} player{team.playerCount !== 1 ? 's' : ''}. Watch the screen for the next instruction.
      </p>
      <p className="mt-4 text-sm uppercase tracking-wide text-brand-paper">Current game state: {phase}</p>
      <button
        type="button"
        disabled={!canLeave}
        onClick={onLeave}
        className="mt-6 min-h-11 border-2 border-brand-red px-4 py-2 font-bold text-brand-ink disabled:border-neutral-600 disabled:text-neutral-500"
      >
        Leave / change team
      </button>
      {!canLeave && <p className="mt-3 text-sm text-brand-paper">Team changes are locked outside the lobby.</p>}
      <TerritoryText />
    </section>
  );
}

function TerritoryText() {
  if (!siteConfig.territoryText) return null;
  return (
    <p className="mt-6 max-w-3xl text-sm text-brand-paper">
      {siteConfig.territoryText}
    </p>
  );
}
