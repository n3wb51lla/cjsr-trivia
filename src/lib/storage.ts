const TEAM_ID_KEY = 'cjsr-trivia.teamId';
const GAME_CODE_KEY = 'cjsr-trivia.gameCode';

export function getStoredTeamId(): string | null {
  return window.localStorage.getItem(TEAM_ID_KEY);
}

export function storeTeamId(teamId: string): void {
  window.localStorage.setItem(TEAM_ID_KEY, teamId);
}

export function clearStoredTeamId(): void {
  window.localStorage.removeItem(TEAM_ID_KEY);
}

export function getStoredGameCode(): string {
  return window.localStorage.getItem(GAME_CODE_KEY) ?? 'main';
}

export function storeGameCode(gameCode: string): void {
  window.localStorage.setItem(GAME_CODE_KEY, gameCode);
}

