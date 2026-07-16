export type GamePhase = 'lobby' | 'question' | 'reveal' | 'break' | 'final' | 'sudden_death';

export type RoundNumber = 1 | 2 | 3 | 4 | 5 | 6;
export type QuestionRound = RoundNumber | 'suddenDeath';

export interface Question {
  readonly id: number;
  readonly round: QuestionRound;
  readonly text: string;
  readonly choices: readonly [string, string, string, string];
  readonly answer: 0 | 1 | 2 | 3;
}

export interface Team {
  readonly id: string;
  readonly gameId: string;
  readonly teamName: string;
  readonly playerCount: 1 | 2 | 3 | 4;
  readonly score: number;
  readonly cumulativeLockMs: number;
  readonly joinedAt: number;
  readonly isActive: boolean;
}

export interface Answer {
  readonly id: string;
  readonly gameId: string;
  readonly teamId: string;
  readonly questionIndex: number;
  readonly choiceIndex: 0 | 1 | 2 | 3 | null;
  readonly lockedAt: number;
  readonly timeToLockMs: number | null;
  readonly isCorrect: boolean | null;
  readonly pointsAwarded: number;
}

export interface Game {
  readonly id: string;
  readonly phase: GamePhase;
  readonly currentQuestionIndex: number | null;
  readonly currentRound: RoundNumber | 'suddenDeath' | null;
  readonly questionStartedAt: number | null;
  readonly startedAt: number | null;
  readonly createdAt: number;
}

export interface GameState {
  readonly game: Game;
  readonly teams: readonly Team[];
  readonly answers: readonly Answer[];
}

export interface LeaderboardEntry {
  readonly teamId: string;
  readonly teamName: string;
  readonly rank: number;
  readonly score: number;
  readonly cumulativeLockMs: number;
  readonly isTiedOnScore: boolean;
}
