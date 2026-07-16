export function gamePath(gameCode: string): string {
  return `games/${gameCode}`;
}

export function gameMetaPath(gameCode: string): string {
  return `${gamePath(gameCode)}/meta`;
}

export function teamsPath(gameCode: string): string {
  return `${gamePath(gameCode)}/teams`;
}

export function teamPath(gameCode: string, teamId: string): string {
  return `${teamsPath(gameCode)}/${teamId}`;
}

export function answersPath(gameCode: string): string {
  return `${gamePath(gameCode)}/answers`;
}

export function teamAnswersPath(gameCode: string, teamId: string): string {
  return `${answersPath(gameCode)}/${teamId}`;
}

export function answerPath(gameCode: string, teamId: string, questionId: number): string {
  return `${teamAnswersPath(gameCode, teamId)}/${questionId}`;
}

