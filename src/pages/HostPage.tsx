import { useEffect, useMemo, useState } from 'react';
import { HostGate } from '../components/host/HostGate';
import { useGameSubscription } from '../hooks/useGameSubscription';
import { useQuestionTimer } from '../hooks/useQuestionTimer';
import { finalizeQuestionScores, kickTeamFromLobby, patchGameMeta, resetGameForReplay, setAnswerCorrectness, setTeamScore, writeGameMeta, type FirebaseGameMeta } from '../lib/firebaseData';
import { DEFAULT_GAME_CODE, getCurrentQuestionSummary, getHostAdvanceMeta, getHostButtonLabel, isSuddenDeathAvailable, makeInitialGameMeta } from '../lib/hostState';
import { buildLeaderboard } from '../lib/leaderboard';
import { getLastRoundId, getPointsForQuestion, getRegularQuestionCount, getSuddenDeathQuestionId, resolveQuestions } from '../lib/triviaData';
import type { Answer, FreeTextQuestion, LeaderboardEntry, Question, Team } from '../types';

const EMPTY_TEAMS: Team[] = [];
const EMPTY_ANSWERS: Answer[] = [];

export function HostPage() {
  const [message, setMessage] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);
  const { gameState, status, error } = useGameSubscription(DEFAULT_GAME_CODE);

  const meta = useMemo<FirebaseGameMeta | null>(() => gameState ? { ...gameState.game, code: DEFAULT_GAME_CODE } : null, [gameState]);
  const questions = useMemo(() => resolveQuestions(gameState), [gameState]);
  const teams = gameState?.teams ?? EMPTY_TEAMS;
  const activeTeams = useMemo(() => teams.filter(team => team.isActive), [teams]);
  const leaderboard = useMemo(() => buildLeaderboard(activeTeams), [activeTeams]);
  const question = getCurrentQuestionSummary(questions, meta?.currentQuestionIndex ?? null);
  const pointValue = meta?.currentQuestionIndex ? getPointsForQuestion(questions, meta.currentQuestionIndex) : null;
  const timer = useQuestionTimer(meta?.questionStartedAt ?? null);
  const currentQuestionIndex = meta?.currentQuestionIndex ?? null;
  const currentAnswers = useMemo(
    () => gameState?.answers.filter(answer => answer.questionIndex === currentQuestionIndex) ?? [],
    [gameState?.answers, currentQuestionIndex],
  );
  const lockedTeamIds = useMemo(() => new Set(currentAnswers.map(answer => answer.teamId)), [currentAnswers]);
  const lockedCount = activeTeams.filter(team => lockedTeamIds.has(team.id)).length;
  const unlockedTeams = activeTeams.filter(team => !lockedTeamIds.has(team.id));
  const isQuestionLive = meta?.phase === 'question';
  const allTeamsLocked = activeTeams.length > 0 && lockedCount >= activeTeams.length;
  const canAdvance = !isQuestionLive || allTeamsLocked || timer.isExpired;
  const hasTopTie = leaderboard[0]?.isTiedOnScore ?? false;
  const suddenDeathAvailable = isSuddenDeathAvailable(meta, hasTopTie);

  async function initializeLobby() {
    await runHostAction('Lobby initialized.', () => writeGameMeta(DEFAULT_GAME_CODE, makeInitialGameMeta(DEFAULT_GAME_CODE)));
  }

  async function advance(force = false) {
    if (!force && !canAdvance) return;
    if (!force && suddenDeathAvailable) {
      await startSuddenDeath();
      return;
    }
    await runHostAction(force ? 'Forced advance and finalized open answers.' : 'Advanced game state.', async () => {
      if (gameState && meta?.phase === 'question' && meta.currentQuestionIndex && question) {
        await finalizeQuestionScores(DEFAULT_GAME_CODE, gameState, question, getPointsForQuestion(questions, meta.currentQuestionIndex));
      }
      await writeGameMeta(DEFAULT_GAME_CODE, getHostAdvanceMeta(meta, questions, DEFAULT_GAME_CODE));
    });
  }

  async function startSuddenDeath() {
    const now = Date.now();
    await runHostAction('Sudden death started - tiebreaker question is live.', () => writeGameMeta(DEFAULT_GAME_CODE, {
      code: DEFAULT_GAME_CODE,
      phase: 'question',
      currentQuestionIndex: getSuddenDeathQuestionId(),
      currentRound: 'suddenDeath',
      questionStartedAt: now,
      startedAt: meta?.startedAt ?? now,
      createdAt: meta?.createdAt ?? now,
    }));
  }

  async function skipToFinals() {
    const now = Date.now();
    await runHostAction('Skipped to finals.', () => patchGameMeta(DEFAULT_GAME_CODE, {
      code: DEFAULT_GAME_CODE,
      phase: 'final',
      currentQuestionIndex: meta?.currentQuestionIndex ?? getRegularQuestionCount(),
      currentRound: meta?.currentRound ?? getLastRoundId(),
      questionStartedAt: null,
      startedAt: meta?.startedAt ?? now,
      createdAt: meta?.createdAt ?? now,
    }));
  }

  async function resetStateOnly() {
    await runHostAction('Game reset to lobby. Joined teams were kept, scores and answers were cleared.', async () => {
      const nextMeta = makeInitialGameMeta(DEFAULT_GAME_CODE);
      if (!gameState) {
        await writeGameMeta(DEFAULT_GAME_CODE, nextMeta);
        return;
      }
      await resetGameForReplay(DEFAULT_GAME_CODE, gameState, nextMeta);
    });
  }

  async function kickTeam(team: Team) {
    if (meta?.phase !== 'lobby') {
      setMessage('Teams can only be kicked while the game is in the lobby.');
      return;
    }
    await runHostAction(`${team.teamName} was removed from the lobby.`, () => kickTeamFromLobby(DEFAULT_GAME_CODE, team));
  }

  async function updateScore(team: Team, nextScore: number) {
    await runHostAction(`${team.teamName} score updated to ${Math.max(0, Math.trunc(nextScore))}.`, () => setTeamScore(DEFAULT_GAME_CODE, team, nextScore));
  }

  async function overrideAnswer(team: Team, answer: Answer, points: number, isCorrect: boolean) {
    await runHostAction(`${team.teamName}'s answer marked ${isCorrect ? 'correct' : 'incorrect'}.`, () => setAnswerCorrectness(DEFAULT_GAME_CODE, team, answer, points, isCorrect));
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

  return (
    <HostGate title="Unlock control desk">
    <div className="grid gap-4 lg:grid-cols-[2fr_1fr]">
      <section className="page-card p-6">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <p className="text-sm font-black uppercase tracking-wide text-brand-red-light">Host controls</p>
            <h1 className="mt-2 font-display text-4xl leading-tight">Control desk</h1>
          </div>
          <ConnectionBadge status={status} error={error?.message ?? null} />
        </div>

        <div className="mt-6 grid gap-3 sm:grid-cols-3">
          <Stat label="State" value={meta?.phase ?? 'not initialized'} />
          <Stat
            label="Question"
            value={
              meta?.currentQuestionIndex
                ? meta.currentQuestionIndex === getSuddenDeathQuestionId()
                  ? 'Sudden death'
                  : `Q${meta.currentQuestionIndex} of ${getRegularQuestionCount()}`
                : 'none'
            }
          />
          <Stat label="Point value" value={pointValue ? `${pointValue} points` : '-'} />
        </div>

        {isQuestionLive && (
          <section className="mt-6 border-2 border-brand-ink p-4" aria-live="polite">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div>
                <p className="text-sm font-black uppercase tracking-wide text-brand-red-light">Live lock status</p>
                <h2 className="mt-1 text-2xl font-bold">{lockedCount} / {activeTeams.length} teams locked</h2>
              </div>
              <div className="text-right">
                <p className="text-sm font-black uppercase tracking-wide text-brand-red-light">Timer</p>
                <p className="text-3xl font-black">{timer.secondsRemaining}s</p>
              </div>
            </div>
            <div className="mt-4 h-4 border-2 border-brand-ink bg-brand-black" role="timer" aria-label={`${timer.secondsRemaining} seconds remaining`}>
              <div className="h-full bg-brand-red transition-[width]" style={{ width: `${Math.round(timer.progress * 100)}%` }} />
            </div>
            {unlockedTeams.length > 0 ? (
              <p className="mt-3 text-sm font-bold text-brand-paper">
                Waiting on: {unlockedTeams.map(team => team.teamName).join(', ')}
              </p>
            ) : (
              <p className="mt-3 text-sm font-bold text-brand-correct">All active teams are locked.</p>
            )}
            {!canAdvance && <p className="mt-3 text-sm font-bold text-brand-paper">Advance unlocks when all teams lock or the timer expires.</p>}
          </section>
        )}

        {question ? (
          <section className="mt-6 border-2 border-brand-ink p-4">
            <p className="text-sm font-black uppercase tracking-wide text-brand-red-light">Current question</p>
            <h2 className="mt-2 text-2xl font-bold">{question.text}</h2>
            {question.media?.type === 'image' && (
              <img src={question.media.url} alt={question.media.altText} className="mt-3 max-h-40 border border-brand-ink/50 object-contain" />
            )}
            {question.media?.type === 'video' && (
              <p className="mt-3 text-sm font-bold text-brand-paper">This question has a video clue — it plays on the projector screen only.</p>
            )}
            <p className="mt-3 text-lg text-brand-correct">
              {question.type === 'free_text'
                ? `Accepted: ${question.acceptedAnswers.join(', ')}`
                : `Correct: ${(question.type === 'multi_select' ? question.answers : [question.answer]).map(index => question.choices[index]).join(', ')}`}
            </p>
          </section>
        ) : (
          <p className="mt-6 text-lg text-brand-paper">Initialize the lobby, then start question 1.</p>
        )}

        <div className="mt-6 flex flex-wrap gap-3">
          <button type="button" disabled={busy} onClick={initializeLobby} className="min-h-11 border-2 border-brand-ink px-5 py-2 font-bold disabled:opacity-50">
            Initialize lobby
          </button>
          <button type="button" disabled={busy || !canAdvance} onClick={() => void advance()} className="min-h-11 border-2 border-brand-red bg-brand-red px-5 py-2 font-black text-white disabled:opacity-50">
            {getHostButtonLabel(meta, hasTopTie)}
          </button>
          {isQuestionLive && (
            <button type="button" disabled={busy} onClick={() => void advance(true)} className="min-h-11 border-2 border-brand-ink px-5 py-2 font-bold disabled:opacity-50">
              Force reveal
            </button>
          )}
          <button type="button" disabled={busy} onClick={skipToFinals} className="min-h-11 border-2 border-brand-ink px-5 py-2 font-bold disabled:opacity-50">
            Skip to finals
          </button>
          <button type="button" disabled={busy} onClick={resetStateOnly} className="min-h-11 border-2 border-brand-red px-5 py-2 font-bold text-brand-red-light disabled:opacity-50">
            Reset game
          </button>
        </div>
        {message && <p className="mt-4 font-bold text-brand-red-light" role="status">{message}</p>}
      </section>

      <div className="space-y-4">
        <ScorekeeperPanel
          busy={busy}
          canKick={meta?.phase === 'lobby'}
          leaderboard={leaderboard}
          teams={activeTeams}
          onKick={kickTeam}
          onScoreChange={updateScore}
        />
        <FreeTextReviewPanel
          busy={busy}
          questions={questions}
          teams={activeTeams}
          answers={gameState?.answers ?? EMPTY_ANSWERS}
          currentQuestionIndex={currentQuestionIndex}
          onSetCorrectness={overrideAnswer}
        />
      </div>
    </div>
    </HostGate>
  );
}

function ScorekeeperPanel({
  busy,
  canKick,
  leaderboard,
  teams,
  onKick,
  onScoreChange,
}: {
  busy: boolean;
  canKick: boolean;
  leaderboard: LeaderboardEntry[];
  teams: readonly Team[];
  onKick: (team: Team) => Promise<void>;
  onScoreChange: (team: Team, nextScore: number) => Promise<void>;
}) {
  return (
    <aside className="page-card p-5">
      <h2 className="font-display text-2xl">Scores & teams</h2>
      <p className="mt-1 text-brand-paper">{teams.length} active team{teams.length !== 1 ? 's' : ''}</p>
      <ol className="mt-4 space-y-3">
        {leaderboard.map(entry => {
          const team = teams.find(candidate => candidate.id === entry.teamId);
          if (!team) return null;
          return (
            <li key={team.id} className="border border-brand-ink/50 p-3">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <span className="font-bold">#{entry.rank} {team.teamName}</span>
                  <span className="block text-sm text-brand-paper">
                    {team.playerCount} player{team.playerCount !== 1 ? 's' : ''}{entry.isTiedOnScore && ' - tied'}
                  </span>
                </div>
                <span className="text-2xl font-black text-brand-red-light">{team.score}</span>
              </div>
              <div className="mt-3 grid grid-cols-[auto_1fr_auto_auto] items-center gap-2">
                <button
                  type="button"
                  disabled={busy || team.score <= 0}
                  onClick={() => void onScoreChange(team, team.score - 1)}
                  className="min-h-10 border border-brand-ink px-3 py-1 font-black disabled:border-neutral-700 disabled:text-neutral-500"
                  aria-label={`Subtract one point from ${team.teamName}`}
                >
                  -1
                </button>
                <label className="sr-only" htmlFor={`score-${team.id}`}>{team.teamName} score</label>
                <input
                  key={`${team.id}-${team.score}`}
                  id={`score-${team.id}`}
                  type="number"
                  min={0}
                  defaultValue={team.score}
                  disabled={busy}
                  onBlur={event => {
                    if (event.currentTarget.value === '') {
                      event.currentTarget.value = String(team.score);
                      return;
                    }
                    const nextScore = event.currentTarget.valueAsNumber;
                    if (nextScore !== team.score) void onScoreChange(team, nextScore);
                  }}
                  onKeyDown={event => {
                    if (event.key === 'Enter') event.currentTarget.blur();
                  }}
                  className="min-h-10 w-full border border-brand-ink/50 bg-brand-black px-2 py-1 text-center font-bold text-brand-ink disabled:opacity-50"
                />
                <button
                  type="button"
                  disabled={busy}
                  onClick={() => void onScoreChange(team, team.score + 1)}
                  className="min-h-10 border border-brand-ink px-3 py-1 font-black disabled:border-neutral-700 disabled:text-neutral-500"
                  aria-label={`Add one point to ${team.teamName}`}
                >
                  +1
                </button>
                <button
                  type="button"
                  disabled={busy || !canKick}
                  onClick={() => void onKick(team)}
                  className="min-h-10 border border-brand-red px-2 py-1 text-xs font-black uppercase tracking-wide text-brand-red-light disabled:border-neutral-700 disabled:text-neutral-500"
                >
                  Kick
                </button>
              </div>
            </li>
          );
        })}
      </ol>
      {teams.length === 0 && <p className="mt-4 text-sm font-bold text-brand-paper">No active teams in the lobby.</p>}
      {!canKick && teams.length > 0 && <p className="mt-3 text-sm text-brand-paper">Kicking is available in the lobby only. Score edits are available any time.</p>}
    </aside>
  );
}

function FreeTextReviewPanel({
  busy,
  questions,
  teams,
  answers,
  currentQuestionIndex,
  onSetCorrectness,
}: {
  busy: boolean;
  questions: readonly Question[];
  teams: readonly Team[];
  answers: readonly Answer[];
  currentQuestionIndex: number | null;
  onSetCorrectness: (team: Team, answer: Answer, points: number, isCorrect: boolean) => Promise<void>;
}) {
  const freeTextQuestions = useMemo(() => questions.filter((candidate): candidate is FreeTextQuestion => candidate.type === 'free_text'), [questions]);
  const [selectedId, setSelectedId] = useState<number | null>(null);

  useEffect(() => {
    if (freeTextQuestions.length === 0) {
      setSelectedId(null);
      return;
    }
    setSelectedId(previous => {
      if (previous !== null && freeTextQuestions.some(question => question.id === previous)) return previous;
      const current = freeTextQuestions.find(question => question.id === currentQuestionIndex);
      return (current ?? freeTextQuestions[0]).id;
    });
  }, [freeTextQuestions, currentQuestionIndex]);

  if (freeTextQuestions.length === 0) return null;

  const selectedQuestion = freeTextQuestions.find(question => question.id === selectedId) ?? freeTextQuestions[0];
  const points = getPointsForQuestion(questions, selectedQuestion.id);
  const rows = teams
    .map(team => ({ team, answer: answers.find(candidate => candidate.teamId === team.id && candidate.questionIndex === selectedQuestion.id) ?? null }))
    .filter((row): row is { team: Team; answer: Answer } => row.answer !== null);

  return (
    <aside className="page-card p-5">
      <h2 className="font-display text-2xl">Free-text review</h2>
      <p className="mt-1 text-brand-paper">Accepted: {selectedQuestion.acceptedAnswers.join(', ')}</p>

      <label className="mt-3 block text-sm font-bold uppercase tracking-wide text-brand-paper" htmlFor="free-text-question-select">Question</label>
      <select
        id="free-text-question-select"
        value={selectedQuestion.id}
        onChange={event => setSelectedId(Number(event.target.value))}
        className="mt-1 min-h-10 w-full border-2 border-brand-ink bg-brand-black px-2 py-1 text-brand-ink"
      >
        {freeTextQuestions.map(question => (
          <option key={question.id} value={question.id}>
            Q{question.id}. {question.text.slice(0, 40)}{question.text.length > 40 ? '...' : ''}
          </option>
        ))}
      </select>

      <ol className="mt-4 space-y-3">
        {rows.map(({ team, answer }) => {
          const graded = answer.isCorrect !== null;
          return (
            <li key={team.id} className="border border-brand-ink/50 p-3">
              <div className="flex items-start justify-between gap-3">
                <span className="font-bold">{team.teamName}</span>
                <span className={`text-sm font-black uppercase tracking-wide ${!graded ? 'text-brand-paper' : answer.isCorrect ? 'text-brand-correct' : 'text-brand-red-light'}`}>
                  {graded ? (answer.isCorrect ? 'Correct' : 'Incorrect') : 'Pending'}
                </span>
              </div>
              <p className="mt-1 text-brand-paper">{answer.textAnswer ? `"${answer.textAnswer}"` : '(no answer)'}</p>
              <div className="mt-2 flex gap-2">
                <button
                  type="button"
                  disabled={busy || !graded || answer.isCorrect === true}
                  onClick={() => void onSetCorrectness(team, answer, points, true)}
                  className="min-h-9 border border-brand-correct px-3 py-1 text-sm font-bold text-brand-correct disabled:border-neutral-700 disabled:text-neutral-500"
                >
                  Mark correct
                </button>
                <button
                  type="button"
                  disabled={busy || !graded || answer.isCorrect === false}
                  onClick={() => void onSetCorrectness(team, answer, points, false)}
                  className="min-h-9 border border-brand-red px-3 py-1 text-sm font-bold text-brand-red-light disabled:border-neutral-700 disabled:text-neutral-500"
                >
                  Mark incorrect
                </button>
              </div>
            </li>
          );
        })}
      </ol>
      {rows.length === 0 && <p className="mt-4 text-sm font-bold text-brand-paper">No answers submitted yet for this question.</p>}
    </aside>
  );
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div className="border-2 border-brand-ink p-3">
      <p className="text-xs font-black uppercase tracking-wide text-brand-red-light">{label}</p>
      <p className="mt-1 text-xl font-bold">{value}</p>
    </div>
  );
}

function ConnectionBadge({ status, error }: { status: string; error: string | null }) {
  return (
    <div className="text-right text-sm" aria-live="polite">
      <p className="font-black uppercase tracking-wide">Connection: {status}</p>
      {error && <p className="text-brand-red-light">{error}</p>}
    </div>
  );
}
