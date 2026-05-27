// X2 Global Blocks — Level Configuration
// 1000 levels generated programmatically with doubling goals

export interface LevelConfig {
  id: number;
  name: string;
  difficulty: 'beginner' | 'easy' | 'medium' | 'hard' | 'expert' | 'master' | 'legend';
  goalTile: number;
  gridSize: { cols: number; rows: number };
  moveLimit: number | null;
  timeLimit: number | null;
  starThresholds: [number, number, number];
  blockPool: number[];
  initialBlocks: { row: number; col: number; value: number }[];
  description: string;
  winPoints: number; // Points awarded just for completing
}

// Difficulty tiers based on level ranges
function getDifficulty(level: number): LevelConfig['difficulty'] {
  if (level <= 50) return 'beginner';
  if (level <= 150) return 'easy';
  if (level <= 300) return 'medium';
  if (level <= 500) return 'hard';
  if (level <= 700) return 'expert';
  if (level <= 900) return 'master';
  return 'legend';
}

// Goal tile doubles in cycles: 32 → 64 → 128 → 256 → 512 → 1024 → 2048
// Then repeats with harder constraints
function getGoalTile(level: number): number {
  const goals = [32, 64, 128, 256, 512, 1024, 2048];
  const cycle = Math.floor((level - 1) / goals.length);
  const index = (level - 1) % goals.length;
  // After first full cycle, goals get capped at higher values
  if (cycle >= 3) return goals[Math.min(index + 3, goals.length - 1)];
  if (cycle >= 1) return goals[Math.min(index + 1, goals.length - 1)];
  return goals[index];
}

// Points: beginner=50, easy=75, medium=100, hard=150, expert=200, master=300, legend=500
function getWinPoints(difficulty: LevelConfig['difficulty']): number {
  switch (difficulty) {
    case 'beginner': return 50;
    case 'easy': return 75;
    case 'medium': return 100;
    case 'hard': return 150;
    case 'expert': return 200;
    case 'master': return 300;
    case 'legend': return 500;
  }
}

// Grid size varies by difficulty
function getGridSize(level: number, difficulty: string): { cols: number; rows: number } {
  // Vary grid sizes for variety
  const variant = level % 5;
  switch (difficulty) {
    case 'beginner':
      return variant < 3 ? { cols: 4, rows: 6 } : { cols: 5, rows: 6 };
    case 'easy':
      return variant < 2 ? { cols: 5, rows: 7 } : variant < 4 ? { cols: 4, rows: 7 } : { cols: 5, rows: 6 };
    case 'medium':
      return variant < 2 ? { cols: 5, rows: 8 } : variant < 4 ? { cols: 4, rows: 8 } : { cols: 5, rows: 7 };
    case 'hard':
      return variant < 2 ? { cols: 5, rows: 8 } : variant < 4 ? { cols: 4, rows: 7 } : { cols: 5, rows: 7 };
    case 'expert':
      return variant < 3 ? { cols: 5, rows: 8 } : { cols: 4, rows: 8 };
    case 'master':
      return variant < 2 ? { cols: 4, rows: 8 } : { cols: 5, rows: 8 };
    case 'legend':
      return variant < 3 ? { cols: 4, rows: 7 } : { cols: 5, rows: 8 };
    default:
      return { cols: 5, rows: 8 };
  }
}

// Block pool varies by goal and difficulty
function getBlockPool(goalTile: number, difficulty: string): number[] {
  if (goalTile <= 32) return [2, 2, 2, 4];
  if (goalTile <= 64) return [2, 2, 4, 4];
  if (goalTile <= 128) {
    return difficulty === 'beginner' ? [2, 4, 4, 8] : [2, 2, 4, 8];
  }
  if (goalTile <= 256) return [2, 4, 8, 8, 16];
  if (goalTile <= 512) return [4, 8, 8, 16, 32];
  if (goalTile <= 1024) return [4, 8, 16, 32, 32];
  return [8, 16, 32, 32, 64]; // 2048 goal
}

// Move limit — some levels have it, some don't
function getMoveLimit(level: number, difficulty: string): number | null {
  const pattern = level % 4;
  if (pattern === 0) return null; // No limit — free play
  if (pattern === 1) return null;

  // Move-limited levels
  switch (difficulty) {
    case 'beginner': return 30 + Math.floor(level / 10) * 2;
    case 'easy': return 35 + Math.floor(level / 15);
    case 'medium': return 40 + Math.floor(level / 20);
    case 'hard': return 45;
    case 'expert': return 50;
    case 'master': return 55;
    case 'legend': return 60;
    default: return null;
  }
}

// Time limit — some levels have it
function getTimeLimit(level: number, difficulty: string): number | null {
  const pattern = level % 5;
  if (pattern !== 3) return null; // Only every 5th level is timed

  switch (difficulty) {
    case 'beginner': return 120;
    case 'easy': return 120;
    case 'medium': return 100;
    case 'hard': return 90;
    case 'expert': return 80;
    case 'master': return 70;
    case 'legend': return 60;
    default: return null;
  }
}

// Star thresholds scale with level and goal
function getStarThresholds(level: number, goalTile: number): [number, number, number] {
  const base = goalTile * 5;
  const multiplier = 1 + Math.floor(level / 50) * 0.2;
  return [
    Math.floor(base * multiplier),
    Math.floor(base * 2.5 * multiplier),
    Math.floor(base * 5 * multiplier),
  ];
}

// Level names cycle through fun names
const LEVEL_NAMES: Record<string, string[]> = {
  beginner: [
    'Warm Up', 'Getting Started', 'First Steps', 'Quick Merge', 'Level Up',
    'Combo Start', 'Strategic Drop', 'Number Climb', 'Grid Master', 'Block Party',
    'Easy Does It', 'Simple Merge', 'Baby Steps', 'Gentle Start', 'Smooth Move',
  ],
  easy: [
    'New Chapter', 'Block Builder', 'Stacked Up', 'Merge Rush', 'Double Trouble',
    'Tower Builder', 'Speed Merge', 'Cascade King', 'Rising Star', 'On A Roll',
    'Momentum', 'Flow State', 'Getting Good', 'Steady Climb', 'Smooth Operator',
  ],
  medium: [
    'Medium Heat', 'Tight Space', 'Number Crunch', 'Under Pressure', 'Half K',
    'Grid Tactics', 'Speed Demon', 'Precision Drop', 'Hot Zone', 'Power Play',
    'Brain Teaser', 'Think Fast', 'Sharp Mind', 'Quick Thinker', 'Focused',
  ],
  hard: [
    'Hard Mode', 'Narrow Path', 'Time Crisis', 'Obstacle Course', 'Chain Master',
    'Beyond Limits', 'Sprint Mode', 'Tiny Grid', 'Fire Walk', 'Steel Nerves',
    'No Mercy', 'Danger Zone', 'Full Throttle', 'Last Stand', 'Iron Will',
  ],
  expert: [
    'Expert Zone', 'Pro League', 'Beast Mode', 'Ultra Focus', 'Lightning Round',
    'Elite Player', 'Crunch Time', 'No Mistakes', 'Razor Sharp', 'Peak Performance',
    'Maximum Power', 'Overdrive', 'Supersonic', 'Nuclear', 'Unstoppable',
  ],
  master: [
    'Master Class', 'Grandmaster', 'Perfect Storm', 'Infinite Power', 'God Mode',
    'Supreme Being', 'Untouchable', 'Legendary Play', 'Cosmic Force', 'Galaxy Brain',
    'Omega Level', 'Transcendent', 'Ascended', 'Enlightened', 'Nirvana',
  ],
  legend: [
    'Living Legend', 'Mythical', 'Immortal', 'Eternal', 'Ultimate',
    'Absolute Zero', 'Beyond All', 'Final Boss', 'End Game', 'Infinity',
    'Timeless', 'Unbreakable', 'Apex', 'Crown Jewel', 'Glory',
  ],
};

function getLevelName(level: number, difficulty: string): string {
  const names = LEVEL_NAMES[difficulty] || LEVEL_NAMES.beginner;
  return names[(level - 1) % names.length];
}

function getLevelDescription(goalTile: number, moveLimit: number | null, timeLimit: number | null): string {
  let desc = `Reach ${goalTile}!`;
  if (moveLimit && timeLimit) desc = `Reach ${goalTile} in ${moveLimit} moves & ${timeLimit}s!`;
  else if (moveLimit) desc = `Reach ${goalTile} in ${moveLimit} moves!`;
  else if (timeLimit) desc = `Reach ${goalTile} before ${timeLimit}s!`;
  return desc;
}

// Generate all 1000 levels
function generateAllLevels(): LevelConfig[] {
  const levels: LevelConfig[] = [];

  for (let i = 1; i <= 1000; i++) {
    const difficulty = getDifficulty(i);
    const goalTile = getGoalTile(i);
    const gridSize = getGridSize(i, difficulty);
    const moveLimit = getMoveLimit(i, difficulty);
    const timeLimit = getTimeLimit(i, difficulty);
    const blockPool = getBlockPool(goalTile, difficulty);
    const starThresholds = getStarThresholds(i, goalTile);
    const winPoints = getWinPoints(difficulty);
    const name = getLevelName(i, difficulty);
    const description = getLevelDescription(goalTile, moveLimit, timeLimit);

    levels.push({
      id: i,
      name,
      difficulty,
      goalTile,
      gridSize,
      moveLimit,
      timeLimit,
      starThresholds,
      blockPool,
      initialBlocks: [],
      description,
      winPoints,
    });
  }

  return levels;
}

// Cache the generated levels
export const LEVELS: LevelConfig[] = generateAllLevels();

export function getLevelConfig(levelId: number): LevelConfig | undefined {
  if (levelId < 1 || levelId > LEVELS.length) return undefined;
  return LEVELS[levelId - 1];
}

export function getTotalLevels(): number {
  return LEVELS.length;
}

export function getDifficultyColor(difficulty: string): string {
  switch (difficulty) {
    case 'beginner': return '#2ecc71';
    case 'easy': return '#3498db';
    case 'medium': return '#f39c12';
    case 'hard': return '#e74c3c';
    case 'expert': return '#9b59b6';
    case 'master': return '#e84393';
    case 'legend': return '#ffd700';
    default: return '#95a5a6';
  }
}

export function getDifficultyLabel(difficulty: string): string {
  switch (difficulty) {
    case 'beginner': return '🌱 BEGINNER';
    case 'easy': return '🎯 EASY';
    case 'medium': return '🔥 MEDIUM';
    case 'hard': return '💀 HARD';
    case 'expert': return '👑 EXPERT';
    case 'master': return '🏆 MASTER';
    case 'legend': return '⚡ LEGEND';
    default: return difficulty.toUpperCase();
  }
}
