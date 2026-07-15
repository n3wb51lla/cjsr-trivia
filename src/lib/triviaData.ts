import questionsJson from '../data/questions.json';
import schedule from '../data/schedule.json';
import scoring from '../data/scoring.json';
import teamNames from '../data/teamNames.json';
import type { Question, QuestionRound, RoundNumber } from '../types';

export const QUESTIONS = parseQuestions(questionsJson);
export const TEAM_NAMES = teamNames as readonly string[];

export function getQuestionByIndex(index: number): Question | undefined {
  return QUESTIONS.find(question => question.index === index);
}

export function getRoundForQuestion(index: number): QuestionRound | undefined {
  return getQuestionByIndex(index)?.round;
}

export function getPointsForQuestion(index: number): number {
  const round = getRoundForQuestion(index);
  if (round === 'suddenDeath') return scoring.suddenDeath;
  if (round === undefined) throw new Error(`Unknown question index: ${index}`);
  return getPointsForRound(round);
}

export function getPointsForRound(round: RoundNumber): number {
  return scoring.rounds[String(round) as keyof typeof scoring.rounds];
}

export function isBreakAfterQuestion(index: number): boolean {
  return schedule.breaksAfterQuestions.includes(index);
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

function parseQuestions(value: unknown): readonly Question[] {
  if (!Array.isArray(value)) throw new Error('questions.json must contain an array.');
  return value.map(parseQuestion);
}

function parseQuestion(value: unknown): Question {
  if (!isRecord(value)) throw new Error('Question must be an object.');
  const { id, index, round, text, choices, answerIndex } = value;
  if (typeof id !== 'string') throw new Error('Question id must be a string.');
  if (typeof index !== 'number' || !Number.isInteger(index)) throw new Error(`Question ${id} index must be an integer.`);
  if (!isQuestionRound(round)) throw new Error(`Question ${id} has invalid round.`);
  if (typeof text !== 'string') throw new Error(`Question ${id} text must be a string.`);
  if (!isFourChoices(choices)) throw new Error(`Question ${id} must have four choices.`);
  if (!isAnswerIndex(answerIndex)) throw new Error(`Question ${id} has invalid answer index.`);
  return { id, index, round, text, choices, answerIndex };
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
