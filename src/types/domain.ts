export type GamePhase = 'lobby' | 'question' | 'reveal' | 'break' | 'final' | 'sudden_death';

export type RoundNumber = number;
export type QuestionRound = RoundNumber | 'suddenDeath';

export interface QuestionMedia {
  readonly type: 'image' | 'video';
  readonly url: string;
  readonly altText: string;
  readonly captionsUrl: string | null;
}

export type ChoiceIndex = 0 | 1 | 2 | 3;

interface QuestionBase {
  readonly id: number;
  readonly round: QuestionRound;
  readonly text: string;
  readonly media: QuestionMedia | null;
}

export interface MultipleChoiceQuestion extends QuestionBase {
  readonly type: 'multiple_choice';
  readonly choices: readonly [string, string, string, string];
  readonly answer: ChoiceIndex;
}

export interface MultiSelectQuestion extends QuestionBase {
  readonly type: 'multi_select';
  readonly choices: readonly [string, string, string, string];
  readonly answers: readonly ChoiceIndex[];
}

export interface FreeTextQuestion extends QuestionBase {
  readonly type: 'free_text';
  readonly acceptedAnswers: readonly string[];
}

export type Question = MultipleChoiceQuestion | MultiSelectQuestion | FreeTextQuestion;

export interface Team {
  readonly id: string;
  readonly gameId: string;
  readonly teamName: string;
  readonly playerCount: number;
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
  readonly choiceIndex: ChoiceIndex | null;
  readonly choiceIndexes: readonly ChoiceIndex[] | null;
  readonly textAnswer: string | null;
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
  readonly questions: readonly Question[];
}

export interface LeaderboardEntry {
  readonly teamId: string;
  readonly teamName: string;
  readonly rank: number;
  readonly score: number;
  readonly cumulativeLockMs: number;
  readonly isTiedOnScore: boolean;
}
