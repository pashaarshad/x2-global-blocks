// X2 Global Blocks — Score Engine

export interface ScoreResult {
  baseScore: number;
  comboBonus: number;
  totalScore: number;
}

/**
 * Calculate score for a merge event
 */
export function calculateMergeScore(mergedValue: number, comboCount: number): ScoreResult {
  const baseScore = mergedValue * 10;
  const comboMultiplier = Math.max(1, comboCount * 1.5);
  const comboBonus = comboCount > 1 ? Math.floor(baseScore * (comboMultiplier - 1)) : 0;
  const totalScore = Math.floor(baseScore * comboMultiplier);

  return { baseScore, comboBonus, totalScore };
}

/**
 * Calculate star rating based on score and thresholds
 */
export function calculateStars(
  score: number,
  thresholds: [number, number, number]
): number {
  if (score >= thresholds[2]) return 3;
  if (score >= thresholds[1]) return 2;
  if (score >= thresholds[0]) return 1;
  return 1; // Minimum 1 star for completing
}

/**
 * Format score with comma separators
 */
export function formatScore(score: number): string {
  return score.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
}

/**
 * Get a motivational message based on combo count
 */
export function getComboMessage(comboCount: number): string {
  if (comboCount >= 5) return '🔥 INCREDIBLE!';
  if (comboCount >= 4) return '⚡ AMAZING!';
  if (comboCount >= 3) return '💥 AWESOME!';
  if (comboCount >= 2) return '✨ GREAT!';
  return '';
}

/**
 * Get encouraging message for game over
 */
export function getGameOverMessage(score: number, goalTile: number, highestTile: number): string {
  const ratio = highestTile / goalTile;
  if (ratio >= 0.5) return 'So close! Try again!';
  if (ratio >= 0.25) return 'Getting there! Keep going!';
  return 'Every try makes you better!';
}
