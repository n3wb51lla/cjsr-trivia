import { get, onValue, push, ref, remove, runTransaction, serverTimestamp, set, update, type Unsubscribe } from 'firebase/database';
import type { Answer, Game, GameState, Team } from '../types';
import { firebaseServices } from './firebase';
import {
  answerPath, gameMetaPath, gamePath, teamNameReservationPath, teamPath,
} from './firebasePaths';

export type FirebaseGameMeta = Omit<Game, 'id'> & {
  readonly code: string;
};

export type FirebaseTeam = Omit<Team, 'id' | 'gameId'>;

export type FirebaseAnswer = Omit<Answer, 'id' | 'gameId'>;

export interface JoinTeamInput {
  readonly teamName: string;
  readonly playerCount: 1 | 2 | 3 | 4;
}

export interface SubmitAnswerInput {
  readonly choiceIndex: 0 | 1 | 2 | 3 | null;
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
        lockedAt: parseNumber(answer.lockedAt, 0),
        timeToLockMs: parseNullableNumber(answer.timeToLockMs),
        isCorrect: typeof answer.isCorrect === 'boolean' ? answer.isCorrect : null,
        pointsAwarded: parseNumber(answer.pointsAwarded, 0),
      })),
    ),
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
  if (value === 1 || value === 2 || value === 3 || value === 4 || value === 5 || value === 6) return value;
  return null;
}

function parsePlayerCount(value: unknown): Team['playerCount'] {
  if (value === 1 || value === 2 || value === 3 || value === 4) return value;
  return 1;
}

function parseChoice(value: unknown): Answer['choiceIndex'] {
  if (value === 0 || value === 1 || value === 2 || value === 3) return value;
  return null;
}

function parseNullableNumber(value: unknown): number | null {
  return typeof value === 'number' && Number.isFinite(value) ? value : null;
}

function parseNumber(value: unknown, fallback: number): number {
  return typeof value === 'number' && Number.isFinite(value) ? value : fallback;
}
