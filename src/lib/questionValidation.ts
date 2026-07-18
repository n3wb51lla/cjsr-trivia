import type { Question } from '../types';

const MAX_TEXT_LENGTH = 140;
const ANSWER_LETTERS = ['A', 'B', 'C', 'D'] as const;

export interface QuestionRowInput {
  readonly rowNumber: number;
  readonly id: unknown;
  readonly round: unknown;
  readonly text: unknown;
  readonly choiceA: unknown;
  readonly choiceB: unknown;
  readonly choiceC: unknown;
  readonly choiceD: unknown;
  readonly correctAnswer: unknown;
}

export interface QuestionRowResult {
  readonly rowNumber: number;
  readonly id: number | null;
  readonly text: string;
  readonly question: Question | null;
  readonly errors: readonly string[];
}

export function validateQuestionRow(row: QuestionRowInput, existingQuestions: readonly Question[]): QuestionRowResult {
  const errors: string[] = [];
  const text = typeof row.text === 'string' ? row.text.trim() : '';

  const id = toInteger(row.id);
  if (id === null) {
    errors.push('Question id must be an integer.');
    return { rowNumber: row.rowNumber, id: null, text, question: null, errors };
  }

  const existing = existingQuestions.find(question => question.id === id);
  if (!existing) {
    errors.push(`No existing question with id ${id}. Import only edits existing questions, it can't add new ones.`);
    return { rowNumber: row.rowNumber, id, text, question: null, errors };
  }

  const round = normalizeRound(row.round);
  if (round === undefined) {
    errors.push('Round is missing or invalid.');
  } else if (round !== existing.round) {
    errors.push(`Round must be ${formatRound(existing.round)} for question ${id} (round is fixed, not editable via import).`);
  }

  if (!text) errors.push('Question text is required.');
  if (text.length > MAX_TEXT_LENGTH) errors.push(`Question text must be ${MAX_TEXT_LENGTH} characters or fewer.`);

  const choices = [row.choiceA, row.choiceB, row.choiceC, row.choiceD].map(choice => (typeof choice === 'string' ? choice.trim() : ''));
  choices.forEach((choice, index) => {
    if (!choice) errors.push(`Choice ${ANSWER_LETTERS[index]} is required.`);
  });

  const answerLetter = typeof row.correctAnswer === 'string' ? row.correctAnswer.trim().toUpperCase() : '';
  const answerIndex = ANSWER_LETTERS.indexOf(answerLetter as (typeof ANSWER_LETTERS)[number]);
  if (answerIndex === -1) errors.push('Correct answer must be A, B, C, or D.');

  if (errors.length > 0) {
    return { rowNumber: row.rowNumber, id, text, question: null, errors };
  }

  return {
    rowNumber: row.rowNumber,
    id,
    text,
    question: {
      id,
      round: existing.round,
      text,
      choices: choices as [string, string, string, string],
      answer: answerIndex as 0 | 1 | 2 | 3,
    },
    errors: [],
  };
}

function toInteger(value: unknown): number | null {
  const num = typeof value === 'number' ? value : Number(value);
  return Number.isInteger(num) ? num : null;
}

function normalizeRound(value: unknown): Question['round'] | undefined {
  if (typeof value === 'string' && value.trim().toLowerCase().replace(/\s+/g, '') === 'suddendeath') return 'suddenDeath';
  const num = toInteger(value);
  if (num !== null && num >= 1 && num <= 6) return num as 1 | 2 | 3 | 4 | 5 | 6;
  return undefined;
}

function formatRound(round: Question['round']): string {
  return round === 'suddenDeath' ? 'Sudden Death' : `Round ${round}`;
}
