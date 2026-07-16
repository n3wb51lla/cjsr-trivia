import { get, ref, serverTimestamp, set, update } from 'firebase/database';
import type { Answer, Game, Team } from '../types';
import { firebaseServices } from './firebase';
import { answerPath, gameMetaPath, teamPath } from './firebasePaths';

export type FirebaseGameMeta = Omit<Game, 'id'> & {
  readonly code: string;
};

export type FirebaseTeam = Omit<Team, 'id' | 'gameId'>;

export type FirebaseAnswer = Omit<Answer, 'id' | 'gameId'>;

export function requireDatabase() {
  if (!firebaseServices) {
    throw new Error('Firebase is not configured. Check .env.local.');
  }
  return firebaseServices.database;
}

export async function fetchGameMeta(gameCode: string): Promise<FirebaseGameMeta | null> {
  const snapshot = await get(ref(requireDatabase(), gameMetaPath(gameCode)));
  return snapshot.exists() ? snapshot.val() as FirebaseGameMeta : null;
}

export async function createOrUpdateGameMeta(gameCode: string, patch: Partial<FirebaseGameMeta>): Promise<void> {
  await update(ref(requireDatabase(), gameMetaPath(gameCode)), patch);
}

export async function createTeam(gameCode: string, teamId: string, team: FirebaseTeam): Promise<void> {
  await set(ref(requireDatabase(), teamPath(gameCode, teamId)), {
    ...team,
    joinedAt: team.joinedAt || serverTimestamp(),
  });
}

export async function writeAnswer(gameCode: string, teamId: string, questionId: number, answer: FirebaseAnswer): Promise<void> {
  await set(ref(requireDatabase(), answerPath(gameCode, teamId, questionId)), answer);
}

