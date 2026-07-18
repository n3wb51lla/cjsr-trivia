import { get, onValue, push, ref, remove, runTransaction, serverTimestamp, set, update, type Unsubscribe } from 'firebase/database';
import type { Answer, ChoiceIndex, Game, GameState, Question, QuestionMedia, Team } from '../types';
import { siteConfig } from '../config/site';
import { isFuzzyMatch } from './textMatching';
import { firebaseServices } from './firebase';
import {
  answerPath, answersPath, gameMetaPath, gamePath, questionPath, questionsPath, teamCumulativeLockMsPath, teamNameReservationPath, teamPath, teamScorePath,
} from './firebasePaths';

export type FirebaseGameMeta = Omit<Game, 'id'> & {
  readonly code: string;
};

export type FirebaseTeam = Omit<Team, 'id' | 'gameId'>;

export type FirebaseAnswer = Omit<Answer, 'id' | 'gameId'>;

export interface JoinTeamInput {
  readonly teamName: string;
  readonly playerCount: number;
}

export interface SubmitAnswerInput {
  readonly choiceIndex: ChoiceIndex | null;
  readonly choiceIndexes: readonly ChoiceIndex[] | null;
  readonly textAnswer: string | null;
  readonly timeToLockMs: number | null;
}

export function requireDatabase() {
  if (!firebaseServices) {
    throw new Error('Firebase is not configured. Check .env.local.');
  }
  return firebaseServices.database;
}

export function makeTeamNameKey(teamName: string): string {
  return teamName.trim().toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
}

export function newFirebaseKey(path = 'ids'): string {
  const key = push(ref(requireDatabase(), path)).key;
  if (!key) throw new Error('Could not allocate Firebase key.');
  return key;
}

export async function fetchGameState(gameCode: string): Promise<GameState | null> {
  const snapshot = await get(ref(requireDatabase(), gamePath(gameCode)));
  if (!snapshot.exists()) return null;
  return parseGameState(gameCode, snapshot.val());
}

export function subscribeGameState(
  gameCode: string,
  onNext: (state: GameState | null) => void,
  onError?: (error: Error) => void,
): Unsubscribe {
  return onValue(
    ref(requireDatabase(), gamePath(gameCode)),
    snapshot => onNext(snapshot.exists() ? parseGameState(gameCode, snapshot.val()) : null),
    error => onError?.(error),
  );
}

export async function fetchGameMeta(gameCode: string): Promise<FirebaseGameMeta | null> {
  const snapshot = await get(ref(requireDatabase(), gameMetaPath(gameCode)));
  return snapshot.exists() ? snapshot.val() as FirebaseGameMeta : null;
}

export async function writeGameMeta(gameCode: string, meta: FirebaseGameMeta): Promise<void> {
  await set(ref(requireDatabase(), gameMetaPath(gameCode)), meta);
}

export async function patchGameMeta(gameCode: string, patch: Partial<FirebaseGameMeta>): Promise<void> {
  await update(ref(requireDatabase(), gameMetaPath(gameCode)), patch);
}

export async function joinTeam(gameCode: string, input: JoinTeamInput): Promise<Team> {
  const teamId = newFirebaseKey(`games/${gameCode}/teams`);
  const teamNameKey = makeTeamNameKey(input.teamName);
  if (!teamNameKey) throw new Error('Team name cannot be blank.');

  const team: FirebaseTeam = {
    teamName: input.teamName,
    playerCount: input.playerCount,
    score: 0,
    cumulativeLockMs: 0,
    joinedAt: Date.now(),
    isActive: true,
  };

  const reservationRef = ref(requireDatabase(), teamNameReservationPath(gameCode, teamNameKey));
  const reservation = await runTransaction(reservationRef, current => {
    if (current !== null) return current;
    return teamId;
  }, { applyLocally: false });

  if (reservation.snapshot.val() !== teamId) {
    throw new Error('That team name is already taken.');
  }

  try {
    await set(ref(requireDatabase(), teamPath(gameCode, teamId)), team);
  } catch (error) {
    await remove(reservationRef);
    throw error;
  }

  return { id: teamId, gameId: gameCode, ...team };
}

export async function kickTeamFromLobby(gameCode: string, team: Team): Promise<void> {
  const teamNameKey = makeTeamNameKey(team.teamName);
  const kickedTeam: FirebaseTeam = {
    teamName: team.teamName,
    playerCount: team.playerCount,
    score: 0,
    cumulativeLockMs: 0,
    joinedAt: team.joinedAt,
    isActive: false,
  };
  const updates: Record<string, unknown> = {
    [teamPath(gameCode, team.id)]: kickedTeam,
  };

  if (teamNameKey) {
    updates[teamNameReservationPath(gameCode, teamNameKey)] = null;
  }

  await update(ref(requireDatabase()), updates);
}

export async function setTeamScore(gameCode: string, team: Team, score: number): Promise<void> {
  if (!Number.isFinite(score)) throw new Error('Score must be a number.');
  const nextScore = Math.max(0, Math.trunc(score));
  const nextTeam: FirebaseTeam = {
    teamName: team.teamName,
    playerCount: team.playerCount,
    score: nextScore,
    cumulativeLockMs: team.cumulativeLockMs,
    joinedAt: team.joinedAt,
    isActive: team.isActive,
  };

  await set(ref(requireDatabase(), teamPath(gameCode, team.id)), nextTeam);
}

export async function submitAnswerIfMissing(
  gameCode: string,
  teamId: string,
  questionId: number,
  input: SubmitAnswerInput,
): Promise<FirebaseAnswer> {
  const path = answerPath(gameCode, teamId, questionId);
  const answer: FirebaseAnswer = {
    teamId,
    questionIndex: questionId,
    choiceIndex: input.choiceIndex,
    choiceIndexes: input.choiceIndexes,
    textAnswer: input.textAnswer,
    lockedAt: Date.now(),
    timeToLockMs: input.timeToLockMs,
    isCorrect: null,
    pointsAwarded: 0,
  };

  const result = await runTransaction(ref(requireDatabase(), path), current => {
    if (current !== null) return current;
    return answer;
  }, { applyLocally: false });

  const saved = result.snapshot.val();
  if (!saved) throw new Error('Answer was not saved.');
  return saved as FirebaseAnswer;
}

export async function finalizeQuestionScores(gameCode: string, state: GameState, question: Question, points: number): Promise<void> {
  const activeTeams = state.teams.filter(team => team.isActive);
  const updates: Record<string, unknown> = {};

  for (const team of activeTeams) {
    const existing = state.answers.find(answer => answer.teamId === team.id && answer.questionIndex === question.id);
    const choiceIndex = existing?.choiceIndex ?? null;
    const choiceIndexes = existing?.choiceIndexes ?? null;
    const textAnswer = existing?.textAnswer ?? null;
    const isCorrect = isAnswerCorrect(question, choiceIndex, choiceIndexes, textAnswer);
    const pointsAwarded = isCorrect ? points : 0;
    const timeToLockMs = existing?.timeToLockMs ?? null;
    const finalizedAnswer: FirebaseAnswer = {
      teamId: team.id,
      questionIndex: question.id,
      choiceIndex,
      choiceIndexes,
      textAnswer,
      lockedAt: existing?.lockedAt ?? Date.now(),
      timeToLockMs,
      isCorrect,
      pointsAwarded,
    };

    updates[answerPath(gameCode, team.id, question.id)] = finalizedAnswer;
    updates[teamScorePath(gameCode, team.id)] = team.score + pointsAwarded;
    updates[teamCumulativeLockMsPath(gameCode, team.id)] = team.cumulativeLockMs + (timeToLockMs ?? 0);
  }

  if (Object.keys(updates).length > 0) {
    await update(ref(requireDatabase()), updates);
  }
}

function isAnswerCorrect(question: Question, choiceIndex: ChoiceIndex | null, choiceIndexes: readonly ChoiceIndex[] | null, textAnswer: string | null): boolean {
  if (question.type === 'multi_select') {
    const selected = new Set(choiceIndexes ?? []);
    return selected.size === question.answers.length && question.answers.every(answer => selected.has(answer));
  }
  if (question.type === 'free_text') {
    return textAnswer !== null && isFuzzyMatch(textAnswer, question.acceptedAnswers);
  }
  return choiceIndex === question.answer;
}

export async function setAnswerCorrectness(gameCode: string, team: Team, answer: Answer, points: number, isCorrect: boolean): Promise<void> {
  const pointsAwarded = isCorrect ? points : 0;
  const scoreDelta = pointsAwarded - answer.pointsAwarded;
  const updatedAnswer: FirebaseAnswer = {
    teamId: answer.teamId,
    questionIndex: answer.questionIndex,
    choiceIndex: answer.choiceIndex,
    choiceIndexes: answer.choiceIndexes,
    textAnswer: answer.textAnswer,
    lockedAt: answer.lockedAt,
    timeToLockMs: answer.timeToLockMs,
    isCorrect,
    pointsAwarded,
  };

  const updates: Record<string, unknown> = {
    [answerPath(gameCode, team.id, answer.questionIndex)]: updatedAnswer,
    [teamScorePath(gameCode, team.id)]: Math.max(0, team.score + scoreDelta),
  };

  await update(ref(requireDatabase()), updates);
}

export async function resetGameForReplay(gameCode: string, state: GameState, meta: FirebaseGameMeta): Promise<void> {
  const updates: Record<string, unknown> = {
    [gameMetaPath(gameCode)]: meta,
    [answersPath(gameCode)]: null,
  };

  for (const team of state.teams) {
    updates[teamScorePath(gameCode, team.id)] = 0;
    updates[teamCumulativeLockMsPath(gameCode, team.id)] = 0;
  }

  await update(ref(requireDatabase()), updates);
}

export async function writeQuestion(gameCode: string, question: Question): Promise<void> {
  await set(ref(requireDatabase(), questionPath(gameCode, question.id)), questionPayload(question));
}

export async function ensureQuestionsSeeded(gameCode: string, seedQuestions: readonly Question[]): Promise<void> {
  const snapshot = await get(ref(requireDatabase(), questionsPath(gameCode)));
  if (snapshot.exists()) return;
  await bulkWriteQuestions(gameCode, seedQuestions);
}

export async function bulkWriteQuestions(gameCode: string, questions: readonly Question[]): Promise<void> {
  const updates: Record<string, unknown> = {};
  for (const question of questions) {
    updates[questionPath(gameCode, question.id)] = questionPayload(question);
  }

  if (Object.keys(updates).length > 0) {
    await update(ref(requireDatabase()), updates);
  }
}

function questionPayload(question: Question): Record<string, unknown> {
  const base = {
    id: question.id,
    round: question.round,
    text: question.text,
    media: question.media,
    type: question.type,
  };
  if (question.type === 'free_text') {
    return { ...base, acceptedAnswers: question.acceptedAnswers };
  }
  if (question.type === 'multi_select') {
    return { ...base, choices: question.choices, answers: question.answers };
  }
  return { ...base, choices: question.choices, answer: question.answer };
}

export async function fetchServerTimeOffsetMs(): Promise<number> {
  const snapshot = await get(ref(requireDatabase(), '.info/serverTimeOffset'));
  return typeof snapshot.val() === 'number' ? snapshot.val() : 0;
}

export function firebaseServerTimestamp() {
  return serverTimestamp();
}

function parseGameState(gameCode: string, value: unknown): GameState {
  const root = isRecord(value) ? value : {};
  const meta = isRecord(root.meta) ? root.meta : {};
  return {
    game: {
      id: String(meta.id ?? gameCode),
      phase: parsePhase(meta.phase),
      currentQuestionIndex: parseNullableNumber(meta.currentQuestionIndex),
      currentRound: parseCurrentRound(meta.currentRound),
      questionStartedAt: parseNullableNumber(meta.questionStartedAt),
      startedAt: parseNullableNumber(meta.startedAt),
      createdAt: parseNumber(meta.createdAt, 0),
    },
    teams: parseRecordList<Team>(root.teams, (id, team) => ({
      id,
      gameId: gameCode,
      teamName: String(team.teamName ?? ''),
      playerCount: parsePlayerCount(team.playerCount),
      score: parseNumber(team.score, 0),
      cumulativeLockMs: parseNumber(team.cumulativeLockMs, 0),
      joinedAt: parseNumber(team.joinedAt, 0),
      isActive: team.isActive !== false,
    })),
    answers: Object.entries(isRecord(root.answers) ? root.answers : {}).flatMap(([teamId, teamAnswers]) =>
      parseRecordList<Answer>(teamAnswers, (questionId, answer) => ({
        id: `${teamId}:${questionId}`,
        gameId: gameCode,
        teamId,
        questionIndex: parseNumber(answer.questionIndex, Number(questionId)),
        choiceIndex: parseChoice(answer.choiceIndex),
        choiceIndexes: parseChoiceIndexes(answer.choiceIndexes),
        textAnswer: typeof answer.textAnswer === 'string' ? answer.textAnswer : null,
        lockedAt: parseNumber(answer.lockedAt, 0),
        timeToLockMs: parseNullableNumber(answer.timeToLockMs),
        isCorrect: typeof answer.isCorrect === 'boolean' ? answer.isCorrect : null,
        pointsAwarded: parseNumber(answer.pointsAwarded, 0),
      })),
    ),
    questions: parseRecordList<Question>(root.questions, parseQuestionRecord),
  };
}

function parseRecordList<T>(value: unknown, map: (id: string, value: Record<string, unknown>) => T): T[] {
  if (!isRecord(value)) return [];
  return Object.entries(value)
    .filter(([, entry]) => isRecord(entry))
    .map(([id, entry]) => map(id, entry as Record<string, unknown>));
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null;
}

function parsePhase(value: unknown): Game['phase'] {
  if (value === 'question' || value === 'reveal' || value === 'break' || value === 'final' || value === 'sudden_death') return value;
  return 'lobby';
}

function parseCurrentRound(value: unknown): Game['currentRound'] {
  if (value === 'suddenDeath' || value === 'sudden_death') return 'suddenDeath';
  if (typeof value === 'number' && Number.isInteger(value) && value >= 1) return value;
  return null;
}

function parsePlayerCount(value: unknown): Team['playerCount'] {
  if (typeof value === 'number' && Number.isInteger(value) && value >= 1 && value <= siteConfig.maxPlayersPerTeam) return value;
  return 1;
}

function parseChoice(value: unknown): Answer['choiceIndex'] {
  if (value === 0 || value === 1 || value === 2 || value === 3) return value;
  return null;
}

function parseChoiceIndexes(value: unknown): Answer['choiceIndexes'] {
  if (!Array.isArray(value)) return null;
  const indexes = value.filter((entry): entry is ChoiceIndex => entry === 0 || entry === 1 || entry === 2 || entry === 3);
  return indexes.length > 0 ? indexes : null;
}

function parseQuestionRound(value: unknown): Question['round'] {
  if (value === 'suddenDeath') return value;
  if (typeof value === 'number' && Number.isInteger(value) && value >= 1) return value;
  return 1;
}

function parseQuestionRecord(id: string, question: Record<string, unknown>): Question {
  const base = {
    id: parseNumber(question.id, Number(id)),
    round: parseQuestionRound(question.round),
    text: typeof question.text === 'string' ? question.text : '',
    media: parseQuestionMedia(question.media),
  };
  if (question.type === 'free_text') {
    return { ...base, type: 'free_text', acceptedAnswers: parseAcceptedAnswers(question.acceptedAnswers) };
  }
  const choices = parseChoices(question.choices);
  if (question.type === 'multi_select') {
    return { ...base, type: 'multi_select', choices, answers: parseAnswerIndexes(question.answers) };
  }
  return { ...base, type: 'multiple_choice', choices, answer: parseChoice(question.answer) ?? 0 };
}

function parseAcceptedAnswers(value: unknown): readonly string[] {
  if (!Array.isArray(value)) return [''];
  const answers = value.filter((entry): entry is string => typeof entry === 'string' && entry.trim().length > 0);
  return answers.length > 0 ? answers : [''];
}

function parseAnswerIndexes(value: unknown): readonly ChoiceIndex[] {
  if (!Array.isArray(value)) return [0];
  const indexes = [...new Set(value.filter((entry): entry is ChoiceIndex => entry === 0 || entry === 1 || entry === 2 || entry === 3))];
  return indexes.length > 0 ? indexes : [0];
}

function parseQuestionMedia(value: unknown): QuestionMedia | null {
  if (!isRecord(value)) return null;
  if (value.type !== 'image' && value.type !== 'video') return null;
  if (typeof value.url !== 'string' || value.url.length === 0) return null;
  if (typeof value.altText !== 'string' || value.altText.trim().length === 0) return null;
  const captionsUrl = typeof value.captionsUrl === 'string' && value.captionsUrl.length > 0 ? value.captionsUrl : null;
  return { type: value.type, url: value.url, altText: value.altText, captionsUrl };
}

function parseChoices(value: unknown): readonly [string, string, string, string] {
  if (Array.isArray(value) && value.length === 4 && value.every(choice => typeof choice === 'string')) {
    return value as [string, string, string, string];
  }
  return ['', '', '', ''];
}

function parseNullableNumber(value: unknown): number | null {
  return typeof value === 'number' && Number.isFinite(value) ? value : null;
}

function parseNumber(value: unknown, fallback: number): number {
  return typeof value === 'number' && Number.isFinite(value) ? value : fallback;
}
