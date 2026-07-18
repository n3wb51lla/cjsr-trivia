import questionsJson from '../data/questions.json';
import schedule from '../data/schedule.json';
import teamNames from '../data/teamNames.json';
import overflowTeamNames from '../data/teamNamesOverflow.json';
import type { GameState, Question, QuestionMedia, QuestionRound, RoundNumber } from '../types';

export interface RoundConfig {
  readonly id: RoundNumber;
  readonly questionCount: number;
  readonly points: number;
  readonly breakAfter: boolean;
}

interface RoundBoundary {
  readonly round: RoundConfig;
  readonly startId: number;
  readonly endId: number;
}

const ROUNDS: readonly RoundConfig[] = schedule.rounds;
const SUDDEN_DEATH_ENABLED: boolean = schedule.suddenDeath.enabled;
const ROUND_BOUNDARIES: readonly RoundBoundary[] = computeRoundBoundaries(ROUNDS);

export const SEED_QUESTIONS = parseQuestions(questionsJson);
export const TEAM_NAMES = teamNames as readonly string[];
export const OVERFLOW_TEAM_NAMES = overflowTeamNames as readonly string[];
export const SUDDEN_DEATH_POINTS = schedule.suddenDeath.points;
export const ROUND_ORDER: readonly QuestionRound[] = [
  ...ROUNDS.map(round => round.id),
  ...(SUDDEN_DEATH_ENABLED ? (['suddenDeath'] as const) : []),
];

export function resolveQuestions(gameState: GameState | null): readonly Question[] {
  return gameState?.questions.length ? gameState.questions : SEED_QUESTIONS;
}

export function getQuestionByIndex(questions: readonly Question[], index: number): Question | undefined {
  return questions.find(question => question.id === index);
}

export function getRoundForQuestion(questions: readonly Question[], index: number): QuestionRound | undefined {
  return getQuestionByIndex(questions, index)?.round;
}

export function getPointsForQuestion(questions: readonly Question[], index: number): number {
  const round = getRoundForQuestion(questions, index);
  if (round === 'suddenDeath') return SUDDEN_DEATH_POINTS;
  if (round === undefined) throw new Error(`Unknown question index: ${index}`);
  return getPointsForRound(round);
}

export function getPointsForRound(roundId: RoundNumber): number {
  const round = ROUNDS.find(candidate => candidate.id === roundId);
  if (!round) throw new Error(`Unknown round: ${roundId}`);
  return round.points;
}

export function getRegularQuestionCount(): number {
  return ROUNDS.reduce((sum, round) => sum + round.questionCount, 0);
}

export function getLastRoundId(): RoundNumber | null {
  return ROUNDS.length > 0 ? ROUNDS[ROUNDS.length - 1].id : null;
}

export function isBreakAfterQuestion(index: number): boolean {
  return ROUND_BOUNDARIES.some(boundary => boundary.endId === index && boundary.round.breakAfter);
}

export function isSuddenDeathEnabled(): boolean {
  return SUDDEN_DEATH_ENABLED;
}

export function getSuddenDeathQuestionId(): number | null {
  return SUDDEN_DEATH_ENABLED ? getRegularQuestionCount() + 1 : null;
}

export function getNextGameState(current: 'lobby' | 'question' | 'reveal' | 'break' | 'final', questionIndex: number | null): 'question' | 'reveal' | 'break' | 'final' {
  if (current === 'lobby') return 'question';
  if (current === 'question') return 'reveal';
  if (current === 'break') return 'question';
  if (current === 'final') return 'final';
  if (questionIndex === null) return 'question';
  if (questionIndex >= getRegularQuestionCount()) return 'final';
  if (isBreakAfterQuestion(questionIndex)) return 'break';
  return 'question';
}

export function getQuestionDurationMs(): number {
  return schedule.questionDurationSeconds * 1000;
}

function computeRoundBoundaries(rounds: readonly RoundConfig[]): readonly RoundBoundary[] {
  let cursor = 1;
  return rounds.map(round => {
    const startId = cursor;
    const endId = cursor + round.questionCount - 1;
    cursor = endId + 1;
    return { round, startId, endId };
  });
}

function parseQuestions(value: unknown): readonly Question[] {
  if (!Array.isArray(value)) throw new Error('questions.json must contain an array.');
  return value.map(parseQuestion);
}

function parseQuestion(value: unknown): Question {
  if (!isRecord(value)) throw new Error('Question must be an object.');
  const { id, round, text, choices, answer, answers, acceptedAnswers, media, type } = value;
  if (typeof id !== 'number' || !Number.isInteger(id)) throw new Error('Question id must be an integer.');
  if (!isQuestionRound(round)) throw new Error(`Question ${id} has invalid round.`);
  if (typeof text !== 'string') throw new Error(`Question ${id} text must be a string.`);
  if (media !== undefined && media !== null && !isQuestionMedia(media)) throw new Error(`Question ${id} has invalid media.`);
  const mediaValue: QuestionMedia | null = isQuestionMedia(media)
    ? { type: media.type, url: media.url, altText: media.altText, captionsUrl: media.captionsUrl ?? null }
    : null;

  if (type === 'free_text') {
    if (!isAcceptedAnswers(acceptedAnswers)) throw new Error(`Question ${id} has invalid acceptedAnswers.`);
    return { id, round, text, type: 'free_text', acceptedAnswers, media: mediaValue };
  }
  if (!isFourChoices(choices)) throw new Error(`Question ${id} must have four choices.`);
  if (type === 'multi_select') {
    if (!isAnswerIndexArray(answers)) throw new Error(`Question ${id} has invalid answers array.`);
    return { id, round, text, choices, type: 'multi_select', answers, media: mediaValue };
  }
  if (!isAnswerIndex(answer)) throw new Error(`Question ${id} has invalid answer index.`);
  return { id, round, text, choices, type: 'multiple_choice', answer, media: mediaValue };
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null;
}

function isQuestionRound(value: unknown): value is QuestionRound {
  return value === 'suddenDeath' || (typeof value === 'number' && Number.isInteger(value) && value >= 1);
}

function isFourChoices(value: unknown): value is readonly [string, string, string, string] {
  return Array.isArray(value) && value.length === 4 && value.every(choice => typeof choice === 'string');
}

function isAnswerIndexArray(value: unknown): value is readonly (0 | 1 | 2 | 3)[] {
  return Array.isArray(value) && value.length >= 1 && value.length <= 4 && value.every(isAnswerIndex);
}

function isAcceptedAnswers(value: unknown): value is readonly string[] {
  return Array.isArray(value) && value.length >= 1 && value.every(entry => typeof entry === 'string' && entry.trim().length > 0);
}

function isAnswerIndex(value: unknown): value is 0 | 1 | 2 | 3 {
  return value === 0 || value === 1 || value === 2 || value === 3;
}

function isQuestionMedia(value: unknown): value is QuestionMedia {
  if (!isRecord(value)) return false;
  if (value.type !== 'image' && value.type !== 'video') return false;
  if (typeof value.url !== 'string' || value.url.length === 0) return false;
  if (typeof value.altText !== 'string' || value.altText.trim().length === 0) return false;
  if (value.captionsUrl !== null && value.captionsUrl !== undefined && typeof value.captionsUrl !== 'string') return false;
  return true;
}
