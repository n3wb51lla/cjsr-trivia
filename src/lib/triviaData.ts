import questionsJson from '../data/questions.json';
import schedule from '../data/schedule.json';
import scoring from '../data/scoring.json';
import teamNames from '../data/teamNames.json';
import overflowTeamNames from '../data/teamNamesOverflow.json';
import type { GameState, Question, QuestionRound, RoundNumber } from '../types';

export const SEED_QUESTIONS = parseQuestions(questionsJson);
export const TEAM_NAMES = teamNames as readonly string[];
export const OVERFLOW_TEAM_NAMES = overflowTeamNames as readonly string[];
export const SUDDEN_DEATH_POINTS = 5;
export const ROUND_ORDER: readonly QuestionRound[] = [1, 2, 3, 4, 5, 6, 'suddenDeath'];

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

export function getPointsForRound(round: RoundNumber): number {
  return scoring[String(round) as keyof typeof scoring];
}

export function isBreakAfterQuestion(index: number): boolean {
  return (schedule.breaksAfterQuestions as number[]).includes(index);
}

export function getNextGameState(current: 'lobby' | 'question' | 'reveal' | 'break' | 'final', questionIndex: number | null): 'question' | 'reveal' | 'break' | 'final' {
  if (current === 'lobby') return 'question';
  if (current === 'question') return 'reveal';
  if (current === 'break') return 'question';
  if (current === 'final') return 'final';
  if (questionIndex === null) return 'question';
  if (questionIndex >= schedule.regularQuestionCount) return 'final';
  if (isBreakAfterQuestion(questionIndex)) return 'break';
  return 'question';
}

export function getQuestionDurationMs(): number {
  return schedule.questionDurationSeconds * 1000;
}

export function getSuddenDeathQuestionId(): number {
  return schedule.suddenDeathQuestionId;
}

function parseQuestions(value: unknown): readonly Question[] {
  if (!Array.isArray(value)) throw new Error('questions.json must contain an array.');
  return value.map(parseQuestion);
}

function parseQuestion(value: unknown): Question {
  if (!isRecord(value)) throw new Error('Question must be an object.');
  const { id, round, text, choices, answer } = value;
  if (typeof id !== 'number' || !Number.isInteger(id)) throw new Error('Question id must be an integer.');
  if (!isQuestionRound(round)) throw new Error(`Question ${id} has invalid round.`);
  if (typeof text !== 'string') throw new Error(`Question ${id} text must be a string.`);
  if (!isFourChoices(choices)) throw new Error(`Question ${id} must have four choices.`);
  if (!isAnswerIndex(answer)) throw new Error(`Question ${id} has invalid answer index.`);
  return { id, round, text, choices, answer };
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null;
}

function isQuestionRound(value: unknown): value is QuestionRound {
  return value === 'suddenDeath' || value === 1 || value === 2 || value === 3 || value === 4 || value === 5 || value === 6;
}

function isFourChoices(value: unknown): value is readonly [string, string, string, string] {
  return Array.isArray(value) && value.length === 4 && value.every(choice => typeof choice === 'string');
}

function isAnswerIndex(value: unknown): value is 0 | 1 | 2 | 3 {
  return value === 0 || value === 1 || value === 2 || value === 3;
}
