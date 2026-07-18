import { siteConfig } from '../config/site';

const TEAM_ID_KEY = siteConfig.teamIdStorageKey;

export function getStoredTeamId(): string | null {
  return window.localStorage.getItem(TEAM_ID_KEY);
}

export function storeTeamId(teamId: string): void {
  window.localStorage.setItem(TEAM_ID_KEY, teamId);
}

export function clearStoredTeamId(): void {
  window.localStorage.removeItem(TEAM_ID_KEY);
}
