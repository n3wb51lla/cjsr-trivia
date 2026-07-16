import type { LeaderboardEntry, Team } from '../types';

export function buildLeaderboard(teams: readonly Team[]): LeaderboardEntry[] {
  const activeTeams = teams.filter(team => team.isActive);
  const scoreCounts = new Map<number, number>();

  for (const team of activeTeams) {
    scoreCounts.set(team.score, (scoreCounts.get(team.score) ?? 0) + 1);
  }

  const sortedTeams = [...activeTeams].sort((first, second) => {
    if (second.score !== first.score) return second.score - first.score;
    if (first.cumulativeLockMs !== second.cumulativeLockMs) return first.cumulativeLockMs - second.cumulativeLockMs;
    return first.teamName.localeCompare(second.teamName);
  });

  let lastScore: number | null = null;
  let lastRank = 0;

  return sortedTeams.map((team, index) => {
    const rank = team.score === lastScore ? lastRank : index + 1;
    lastScore = team.score;
    lastRank = rank;

    return {
      teamId: team.id,
      teamName: team.teamName,
      rank,
      score: team.score,
      cumulativeLockMs: team.cumulativeLockMs,
      isTiedOnScore: (scoreCounts.get(team.score) ?? 0) > 1,
    };
  });
}
