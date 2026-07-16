import type { FirebaseGameMeta } from './firebaseData';
import type { Question } from '../types';
import { getNextGameState, getQuestionByIndex, getRoundForQuestion } from './triviaData';

export const DEFAULT_GAME_CODE = 'main';

export function makeInitialGameMeta(gameCode = DEFAULT_GAME_CODE): FirebaseGameMeta {
  const now = Date.now();
  return {
    code: gameCode,
    phase: 'lobby',
    currentQuestionIndex: null,
    currentRound: null,
    questionStartedAt: null,
    startedAt: null,
    createdAt: now,
  };
}

export function getHostAdvanceMeta(current: FirebaseGameMeta | null, questions: readonly Question[], gameCode = DEFAULT_GAME_CODE): FirebaseGameMeta {
  const base = current ?? makeInitialGameMeta(gameCode);
  const phase = base.phase === 'sudden_death' ? 'final' : base.phase;
  const nextPhase = getNextGameState(phase, base.currentQuestionIndex);
  const nextQuestionIndex = getNextQuestionIndex(base.currentQuestionIndex, base.phase, nextPhase);
  const nextRound = nextQuestionIndex ? getRoundForQuestion(questions, nextQuestionIndex) : null;
  const now = Date.now();

  return {
    ...base,
    code: gameCode,
    phase: nextPhase,
    currentQuestionIndex: nextQuestionIndex,
    currentRound: nextRound === undefined ? null : nextRound,
    questionStartedAt: nextPhase === 'question' && nextQuestionIndex ? now : null,
    startedAt: base.startedAt ?? (nextPhase === 'question' ? now : null),
    createdAt: base.createdAt || now,
  };
}

export function getHostButtonLabel(meta: FirebaseGameMeta | null): string {
  if (!meta || meta.phase === 'lobby') return 'Start question 1';
  if (meta.phase === 'question') return 'Reveal answer';
  if (meta.phase === 'reveal') {
    if ((meta.currentQuestionIndex ?? 0) >= 30) return 'Go to finals';
    if (meta.currentQuestionIndex !== null && meta.currentQuestionIndex % 5 === 0) return 'Show standings';
    return `Start question ${(meta.currentQuestionIndex ?? 0) + 1}`;
  }
  if (meta.phase === 'break') return `Start question ${(meta.currentQuestionIndex ?? 0) + 1}`;
  return 'Finals';
}

export function getCurrentQuestionSummary(questions: readonly Question[], questionIndex: number | null) {
  if (questionIndex === null) return null;
  return getQuestionByIndex(questions, questionIndex) ?? null;
}

function getNextQuestionIndex(currentQuestionIndex: number | null, currentPhase: FirebaseGameMeta['phase'], nextPhase: FirebaseGameMeta['phase']): number | null {
  if (nextPhase === 'final') return currentQuestionIndex;
  if (nextPhase !== 'question') return currentQuestionIndex;
  if (currentQuestionIndex === null || currentPhase === 'lobby') return 1;
  return Math.min(currentQuestionIndex + 1, 30);
}
