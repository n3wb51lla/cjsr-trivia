import type { ChoiceIndex, Question } from '../types';

const MAX_TEXT_LENGTH = 140;
const MAX_MEDIA_URL_LENGTH = 2048;
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
  readonly mediaType: unknown;
  readonly mediaUrl: unknown;
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

  const mediaType = typeof row.mediaType === 'string' ? row.mediaType.trim().toLowerCase() : '';
  const mediaUrl = typeof row.mediaUrl === 'string' ? row.mediaUrl.trim() : '';
  let media: Question['media'] = null;
  if (mediaType || mediaUrl) {
    if (mediaType !== 'image' && mediaType !== 'video') errors.push('Media type must be "image" or "video".');
    if (!mediaUrl) errors.push('Media URL is required when a media type is provided.');
    if (mediaUrl.length > MAX_MEDIA_URL_LENGTH) errors.push(`Media URL must be ${MAX_MEDIA_URL_LENGTH} characters or fewer.`);
    if ((mediaType === 'image' || mediaType === 'video') && mediaUrl && mediaUrl.length <= MAX_MEDIA_URL_LENGTH) {
      media = { type: mediaType, url: mediaUrl };
    }
  }

  if (existing.type === 'free_text') {
    const acceptedAnswers = typeof row.correctAnswer === 'string'
      ? row.correctAnswer.split(';').map(answer => answer.trim()).filter(answer => answer !== '')
      : [];
    if (acceptedAnswers.length === 0) errors.push('At least one accepted answer is required, separated by semicolons (this question is free-text).');
    if (acceptedAnswers.some(answer => answer.length > MAX_TEXT_LENGTH)) errors.push(`Each accepted answer must be ${MAX_TEXT_LENGTH} characters or fewer.`);

    if (errors.length > 0) {
      return { rowNumber: row.rowNumber, id, text, question: null, errors };
    }

    return {
      rowNumber: row.rowNumber,
      id,
      text,
      question: { id, round: existing.round, text, media, type: 'free_text', acceptedAnswers },
      errors: [],
    };
  }

  const choices = [row.choiceA, row.choiceB, row.choiceC, row.choiceD].map(choice => (typeof choice === 'string' ? choice.trim() : ''));
  choices.forEach((choice, index) => {
    if (!choice) errors.push(`Choice ${ANSWER_LETTERS[index]} is required.`);
  });

  const answerLetters = typeof row.correctAnswer === 'string'
    ? row.correctAnswer.split(',').map(letter => letter.trim().toUpperCase()).filter(letter => letter !== '')
    : [];
  const answerIndexes = [...new Set(answerLetters.map(letter => ANSWER_LETTERS.indexOf(letter as (typeof ANSWER_LETTERS)[number])))] as ChoiceIndex[];
  const hasInvalidLetter = answerLetters.length === 0 || answerIndexes.includes(-1 as ChoiceIndex);

  if (existing.type === 'multi_select') {
    if (hasInvalidLetter) errors.push('Correct answer must be one or more of A, B, C, D separated by commas (this question is multi-select).');
  } else if (hasInvalidLetter || answerIndexes.length !== 1) {
    errors.push('Correct answer must be a single letter: A, B, C, or D.');
  }

  if (errors.length > 0) {
    return { rowNumber: row.rowNumber, id, text, question: null, errors };
  }

  const questionBase = {
    id,
    round: existing.round,
    text,
    choices: choices as [string, string, string, string],
    media,
  };

  return {
    rowNumber: row.rowNumber,
    id,
    text,
    question: existing.type === 'multi_select'
      ? { ...questionBase, type: 'multi_select' as const, answers: answerIndexes }
      : { ...questionBase, type: 'multiple_choice' as const, answer: answerIndexes[0] },
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
  if (num !== null && num >= 1) return num;
  return undefined;
}

function formatRound(round: Question['round']): string {
  return round === 'suddenDeath' ? 'Sudden Death' : `Round ${round}`;
}
