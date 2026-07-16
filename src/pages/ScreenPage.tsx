import { useMemo } from 'react';
import { useGameSubscription } from '../hooks/useGameSubscription';
import { useQuestionTimer } from '../hooks/useQuestionTimer';
import { DEFAULT_GAME_CODE } from '../lib/hostState';
import { buildLeaderboard } from '../lib/leaderboard';
import { getPointsForQuestion, getQuestionByIndex } from '../lib/triviaData';
import type { Answer, LeaderboardEntry } from '../types';
import cjsrLogo from '../assets/cjsr-logo.png';
import { ThemeToggle } from '../components/common/ThemeToggle';

export function ScreenPage() {
  const { gameState, status, error } = useGameSubscription(DEFAULT_GAME_CODE);
  const leaderboard = useMemo(() => buildLeaderboard(gameState?.teams ?? []), [gameState?.teams]);
  const phase = gameState?.game.phase ?? 'lobby';
  const questionIndex = gameState?.game.currentQuestionIndex ?? null;
  const question = questionIndex === null ? null : getQuestionByIndex(questionIndex);
  const timer = useQuestionTimer(gameState?.game.questionStartedAt ?? null);
  const currentAnswers = gameState?.answers.filter(answer => answer.questionIndex === questionIndex) ?? [];
  const activeTeamCount = gameState?.teams.filter(team => team.isActive).length ?? 0;

  if (!gameState) {
    return (
      <ScreenShell status={status} error={error?.message ?? null}>
        <section className="border-2 border-cjsr-red bg-cjsr-surface p-8 text-center">
          <p className="text-sm font-black uppercase tracking-wide text-cjsr-red-light">Projector screen</p>
          <h1 className="mt-3 font-display text-5xl leading-tight">Waiting for host</h1>
          <p className="mt-4 text-xl text-cjsr-paper">Waiting for the host to initialize the lobby.</p>
        </section>
      </ScreenShell>
    );
  }

  return (
    <ScreenShell status={status} error={error?.message ?? null}>
      {phase === 'question' && question ? (
        <QuestionScreen
          questionIndex={question.id}
          questionText={question.text}
          points={getPointsForQuestion(question.id)}
          secondsRemaining={timer.secondsRemaining}
          progress={timer.progress}
          lockedCount={currentAnswers.length}
          activeTeamCount={activeTeamCount}
        />
      ) : phase === 'reveal' && question ? (
        <RevealScreen
          questionText={question.text}
          choices={question.choices}
          correctAnswer={question.answer}
          answers={currentAnswers}
          leaderboard={leaderboard}
        />
      ) : phase === 'break' ? (
        <BreakScreen leaderboard={leaderboard} nextQuestion={(questionIndex ?? 0) + 1} />
      ) : phase === 'final' ? (
        <FinalScreen leaderboard={leaderboard} />
      ) : (
        <LobbyScreen teamCount={activeTeamCount} leaderboard={leaderboard} />
      )}
    </ScreenShell>
  );
}

function ScreenShell({ status, error, children }: { status: string; error: string | null; children: React.ReactNode }) {
  return (
    <div className="min-h-[calc(100vh-9rem)]">
      <div className="mb-5 flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <img src={cjsrLogo} alt="" className="h-12 w-12" />
          <p className="font-display text-3xl uppercase text-cjsr-ink">CJSR Trivia</p>
        </div>
        <div className="flex items-center gap-4">
          <div className="text-right text-sm font-bold uppercase tracking-wide text-cjsr-paper" aria-live="polite">
            <p>Connection: {status}</p>
            {error && <p className="text-cjsr-red-light">{error}</p>}
          </div>
          <ThemeToggle />
        </div>
      </div>
      {children}
    </div>
  );
}

function LobbyScreen({ teamCount, leaderboard }: { teamCount: number; leaderboard: LeaderboardEntry[] }) {
  return (
    <div className="grid min-h-[62vh] gap-5 lg:grid-cols-[1.4fr_1fr]">
      <section className="flex flex-col justify-center border-2 border-cjsr-red bg-cjsr-surface p-8">
        <p className="text-sm font-black uppercase tracking-wide text-cjsr-red-light">Lobby</p>
        <h1 className="mt-3 font-display text-6xl leading-none">Volunteer Appreciation</h1>
        <p className="mt-6 text-2xl text-cjsr-paper">{teamCount} team{teamCount !== 1 ? 's' : ''} joined</p>
      </section>
      <LeaderboardPanel leaderboard={leaderboard} title="Teams" />
    </div>
  );
}

function QuestionScreen({
  questionIndex,
  questionText,
  points,
  secondsRemaining,
  progress,
  lockedCount,
  activeTeamCount,
}: {
  questionIndex: number;
  questionText: string;
  points: number;
  secondsRemaining: number;
  progress: number;
  lockedCount: number;
  activeTeamCount: number;
}) {
  return (
    <section className="border-2 border-cjsr-red bg-cjsr-surface p-8">
      <div className="flex flex-wrap items-start justify-between gap-6">
        <div>
          <p className="text-sm font-black uppercase tracking-wide text-cjsr-red-light">Question {questionIndex}</p>
          <h1 className="mt-4 max-w-5xl text-5xl font-black leading-tight">{questionText}</h1>
        </div>
        <div className="border-2 border-cjsr-ink px-5 py-4 text-center">
          <p className="text-sm font-black uppercase tracking-wide text-cjsr-red-light">Worth</p>
          <p className="text-4xl font-black">{points}</p>
        </div>
      </div>

      <div className="mt-10" role="timer" aria-label={`${secondsRemaining} seconds remaining`}>
        <div className="flex items-end justify-between gap-4">
          <p className="font-display text-6xl">{secondsRemaining}s</p>
          <p className="text-2xl font-bold text-cjsr-paper">{lockedCount} / {activeTeamCount} teams locked</p>
        </div>
        <div className="mt-4 h-8 border-2 border-cjsr-ink bg-cjsr-black">
          <div className="h-full bg-cjsr-red transition-[width]" style={{ width: `${Math.round(progress * 100)}%` }} />
        </div>
      </div>
    </section>
  );
}

function RevealScreen({
  questionText,
  choices,
  correctAnswer,
  answers,
  leaderboard,
}: {
  questionText: string;
  choices: readonly [string, string, string, string];
  correctAnswer: 0 | 1 | 2 | 3;
  answers: readonly Answer[];
  leaderboard: LeaderboardEntry[];
}) {
  const correctCount = answers.filter(answer => answer.isCorrect).length;
  return (
    <div className="grid gap-5 lg:grid-cols-[1.35fr_1fr]">
      <section className="border-2 border-cjsr-red bg-cjsr-surface p-8">
        <p className="text-sm font-black uppercase tracking-wide text-cjsr-red-light">Reveal</p>
        <h1 className="mt-3 text-4xl font-black leading-tight">{questionText}</h1>
        <div className="mt-7 grid gap-3">
          {choices.map((choice, index) => (
            <div key={choice} className={`border-2 p-4 text-2xl font-bold ${index === correctAnswer ? 'border-cjsr-correct text-cjsr-correct' : 'border-cjsr-ink/50 text-cjsr-paper'}`}>
              <span className="mr-3 font-black">{String.fromCharCode(65 + index)}.</span>
              {choice}
            </div>
          ))}
        </div>
        <p className="mt-6 text-2xl font-bold text-cjsr-paper">{correctCount} team{correctCount !== 1 ? 's' : ''} got it right</p>
      </section>
      <LeaderboardPanel leaderboard={leaderboard} title="Leaderboard" limit={8} />
    </div>
  );
}

function BreakScreen({ leaderboard, nextQuestion }: { leaderboard: LeaderboardEntry[]; nextQuestion: number }) {
  return (
    <ScoreboardScreen
      eyebrow="Standings"
      title="Scoreboard"
      detail={`Next up: question ${nextQuestion}`}
      leaderboard={leaderboard}
    />
  );
}

function FinalScreen({ leaderboard }: { leaderboard: LeaderboardEntry[] }) {
  const winner = leaderboard[0] ?? null;
  const detail = winner ? `${winner.teamName} leads with ${winner.score} points` : undefined;
  return <ScoreboardScreen eyebrow="Final" title="Final standings" detail={detail} leaderboard={leaderboard} />;
}

function ScoreboardScreen({
  eyebrow,
  title,
  detail,
  leaderboard,
}: {
  eyebrow: string;
  title: string;
  detail?: string;
  leaderboard: LeaderboardEntry[];
}) {
  return (
    <section className="border-2 border-cjsr-red bg-cjsr-surface p-6">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="text-sm font-black uppercase tracking-wide text-cjsr-red-light">{eyebrow}</p>
          <h1 className="mt-1 font-display text-5xl leading-none">{title}</h1>
        </div>
        {detail && <p className="text-right text-2xl font-bold text-cjsr-paper">{detail}</p>}
      </div>
      <LeaderboardPanel leaderboard={leaderboard} title="Scores" columns={2} projector />
    </section>
  );
}

function LeaderboardPanel({
  leaderboard,
  title,
  limit,
  columns = 1,
  compact = false,
  projector = false,
}: {
  leaderboard: LeaderboardEntry[];
  title: string;
  limit?: number;
  columns?: 1 | 2;
  compact?: boolean;
  projector?: boolean;
}) {
  const visibleRows = limit ? leaderboard.slice(0, limit) : leaderboard;
  return (
    <aside className={projector ? 'mt-6' : 'border-2 border-cjsr-red bg-cjsr-surface p-5'}>
      {!projector && <h2 className="font-display text-3xl">{title}</h2>}
      {visibleRows.length === 0 ? (
        <p className="mt-4 text-xl text-cjsr-paper">No teams yet.</p>
      ) : (
        <ol className={`${projector ? 'mt-0' : 'mt-4'} grid gap-3 ${columns === 2 ? 'lg:grid-cols-2' : ''}`}>
          {visibleRows.map(entry => (
            <li key={entry.teamId} className={`grid items-center gap-3 border border-cjsr-ink/50 ${projector ? 'grid-cols-[3rem_minmax(0,1fr)_3rem] p-3 lg:grid-cols-[4.5rem_minmax(0,1fr)_5rem] lg:p-4' : 'grid-cols-[3rem_minmax(0,1fr)_auto]'} ${compact ? 'p-2' : projector ? '' : 'p-3'}`}>
              <span className={`${projector ? 'text-2xl lg:text-4xl' : compact ? 'text-xl' : 'text-2xl'} font-black`}>#{entry.rank}</span>
              <span className={`min-w-0 font-bold leading-tight ${projector ? 'text-xl lg:text-3xl' : compact ? 'text-lg' : 'text-xl'}`}>{entry.teamName}</span>
              <span className={`${projector ? 'text-3xl lg:text-5xl' : compact ? 'text-xl' : 'text-2xl'} font-black text-cjsr-red-light`}>{entry.score}</span>
              {entry.isTiedOnScore && <span className="col-span-3 text-sm font-bold uppercase tracking-wide text-cjsr-paper">Tie-break: fastest total lock time</span>}
            </li>
          ))}
        </ol>
      )}
    </aside>
  );
}
