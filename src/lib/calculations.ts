/**
 * Calculate match result based on scores
 */
export function calculateResult(
  voltaScore: number,
  oppositionScore: number
): 'Win' | 'Draw' | 'Loss' {
  if (voltaScore > oppositionScore) return 'Win';
  if (voltaScore === oppositionScore) return 'Draw';
  return 'Loss';
}

/**
 * Format date for display
 */
export function formatMatchDate(dateString: string): string {
  const date = new Date(dateString);
  return date.toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });
}

/**
 * Format score for display
 */
export function formatScore(voltaScore: number, oppositionScore: number): string {
  return `${voltaScore}-${oppositionScore}`;
}

/**
 * Get years from matches for filter dropdown
 */
export function getYearsFromMatches(matches: { match_date: string }[]): number[] {
  const years = new Set(
    matches.map((match) => new Date(match.match_date).getFullYear())
  );
  return Array.from(years).sort((a, b) => b - a);
}

/**
 * Format goalscorers for display
 */
export function formatGoalscorers(
  matchGoals: Array<{ player: { name: string }; goals_count: number }>
): string {
  if (!matchGoals || matchGoals.length === 0) return 'No scorers';
  
  return matchGoals
    .map((mg) => `${mg.player.name} (${mg.goals_count})`)
    .join(', ');
}
