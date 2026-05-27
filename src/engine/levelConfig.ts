// X2 Global Blocks — Level Configuration
// 40+ levels with progressive difficulty

export interface LevelConfig {
  id: number;
  name: string;
  difficulty: 'beginner' | 'easy' | 'medium' | 'hard' | 'expert';
  goalTile: number;
  gridSize: { cols: number; rows: number };
  moveLimit: number | null;
  timeLimit: number | null; // seconds
  starThresholds: [number, number, number]; // score for 1, 2, 3 stars
  blockPool: number[];
  initialBlocks: { row: number; col: number; value: number }[];
  description: string;
}

export const LEVELS: LevelConfig[] = [
  // === BEGINNER (Levels 1-10) — Goal: 32-64 ===
  {
    id: 1, name: 'Warm Up', difficulty: 'beginner',
    goalTile: 32, gridSize: { cols: 4, rows: 6 },
    moveLimit: null, timeLimit: null,
    starThresholds: [100, 300, 600],
    blockPool: [2, 2, 2, 4],
    initialBlocks: [],
    description: 'Merge blocks to reach 32!',
  },
  {
    id: 2, name: 'Getting Started', difficulty: 'beginner',
    goalTile: 32, gridSize: { cols: 4, rows: 6 },
    moveLimit: null, timeLimit: null,
    starThresholds: [150, 400, 800],
    blockPool: [2, 2, 4, 4],
    initialBlocks: [],
    description: 'Reach 32 with mixed blocks!',
  },
  {
    id: 3, name: 'First Steps', difficulty: 'beginner',
    goalTile: 32, gridSize: { cols: 4, rows: 6 },
    moveLimit: 30, timeLimit: null,
    starThresholds: [200, 500, 1000],
    blockPool: [2, 2, 2, 4],
    initialBlocks: [],
    description: 'Reach 32 in 30 moves!',
  },
  {
    id: 4, name: 'Quick Merge', difficulty: 'beginner',
    goalTile: 32, gridSize: { cols: 4, rows: 6 },
    moveLimit: 25, timeLimit: null,
    starThresholds: [250, 600, 1200],
    blockPool: [2, 2, 4, 4],
    initialBlocks: [],
    description: 'Merge fast to reach 32!',
  },
  {
    id: 5, name: 'Level Up', difficulty: 'beginner',
    goalTile: 64, gridSize: { cols: 4, rows: 6 },
    moveLimit: null, timeLimit: null,
    starThresholds: [300, 800, 1500],
    blockPool: [2, 2, 4, 4],
    initialBlocks: [],
    description: 'Aim for 64!',
  },
  {
    id: 6, name: 'Combo Start', difficulty: 'beginner',
    goalTile: 64, gridSize: { cols: 5, rows: 6 },
    moveLimit: null, timeLimit: null,
    starThresholds: [400, 1000, 1800],
    blockPool: [2, 2, 2, 4, 4],
    initialBlocks: [],
    description: 'Create combos to reach 64!',
  },
  {
    id: 7, name: 'Strategic Drop', difficulty: 'beginner',
    goalTile: 64, gridSize: { cols: 5, rows: 6 },
    moveLimit: 35, timeLimit: null,
    starThresholds: [500, 1200, 2000],
    blockPool: [2, 4, 4, 8],
    initialBlocks: [],
    description: 'Think before you drop!',
  },
  {
    id: 8, name: 'Number Climb', difficulty: 'beginner',
    goalTile: 64, gridSize: { cols: 4, rows: 7 },
    moveLimit: null, timeLimit: null,
    starThresholds: [500, 1200, 2200],
    blockPool: [2, 2, 4, 4, 8],
    initialBlocks: [],
    description: 'Climb to 64!',
  },
  {
    id: 9, name: 'Grid Master', difficulty: 'beginner',
    goalTile: 64, gridSize: { cols: 5, rows: 7 },
    moveLimit: 40, timeLimit: null,
    starThresholds: [600, 1400, 2500],
    blockPool: [2, 4, 4, 8],
    initialBlocks: [],
    description: 'Master the bigger grid!',
  },
  {
    id: 10, name: 'Beginner Boss', difficulty: 'beginner',
    goalTile: 128, gridSize: { cols: 5, rows: 7 },
    moveLimit: null, timeLimit: null,
    starThresholds: [800, 1800, 3000],
    blockPool: [2, 2, 4, 4, 8],
    initialBlocks: [],
    description: 'Reach 128 to complete beginner!',
  },

  // === EASY (Levels 11-20) — Goal: 128-256 ===
  {
    id: 11, name: 'New Chapter', difficulty: 'easy',
    goalTile: 128, gridSize: { cols: 5, rows: 7 },
    moveLimit: 40, timeLimit: null,
    starThresholds: [1000, 2000, 3500],
    blockPool: [2, 4, 4, 8],
    initialBlocks: [],
    description: 'Welcome to Easy mode!',
  },
  {
    id: 12, name: 'Block Party', difficulty: 'easy',
    goalTile: 128, gridSize: { cols: 5, rows: 7 },
    moveLimit: null, timeLimit: 120,
    starThresholds: [1200, 2500, 4000],
    blockPool: [2, 2, 4, 4, 8],
    initialBlocks: [],
    description: 'Reach 128 before time runs out!',
  },
  {
    id: 13, name: 'Stacked Up', difficulty: 'easy',
    goalTile: 128, gridSize: { cols: 5, rows: 7 },
    moveLimit: 35, timeLimit: null,
    starThresholds: [1500, 3000, 4500],
    blockPool: [2, 4, 8, 8],
    initialBlocks: [
      { row: 6, col: 0, value: 4 },
      { row: 6, col: 4, value: 4 },
    ],
    description: 'Start with some blocks!',
  },
  {
    id: 14, name: 'Merge Rush', difficulty: 'easy',
    goalTile: 128, gridSize: { cols: 5, rows: 7 },
    moveLimit: null, timeLimit: 90,
    starThresholds: [1500, 3000, 5000],
    blockPool: [2, 4, 4, 8, 8],
    initialBlocks: [],
    description: 'Rush to 128 in 90 seconds!',
  },
  {
    id: 15, name: 'Double Trouble', difficulty: 'easy',
    goalTile: 256, gridSize: { cols: 5, rows: 7 },
    moveLimit: null, timeLimit: null,
    starThresholds: [2000, 4000, 6000],
    blockPool: [2, 4, 4, 8],
    initialBlocks: [],
    description: 'Double up to 256!',
  },
  {
    id: 16, name: 'Tower Builder', difficulty: 'easy',
    goalTile: 256, gridSize: { cols: 4, rows: 8 },
    moveLimit: 50, timeLimit: null,
    starThresholds: [2500, 5000, 7000],
    blockPool: [2, 4, 8, 16],
    initialBlocks: [],
    description: 'Build your tower to 256!',
  },
  {
    id: 17, name: 'Speed Merge', difficulty: 'easy',
    goalTile: 256, gridSize: { cols: 5, rows: 7 },
    moveLimit: null, timeLimit: 120,
    starThresholds: [2500, 5000, 8000],
    blockPool: [4, 4, 8, 8, 16],
    initialBlocks: [],
    description: 'Timed challenge for 256!',
  },
  {
    id: 18, name: 'Cascade King', difficulty: 'easy',
    goalTile: 256, gridSize: { cols: 5, rows: 7 },
    moveLimit: 45, timeLimit: null,
    starThresholds: [3000, 6000, 9000],
    blockPool: [2, 4, 4, 8, 16],
    initialBlocks: [],
    description: 'Create cascading merges!',
  },
  {
    id: 19, name: 'Almost There', difficulty: 'easy',
    goalTile: 256, gridSize: { cols: 5, rows: 8 },
    moveLimit: null, timeLimit: 150,
    starThresholds: [3500, 7000, 10000],
    blockPool: [2, 4, 8, 8, 16],
    initialBlocks: [],
    description: 'One more before the boss!',
  },
  {
    id: 20, name: 'Easy Boss', difficulty: 'easy',
    goalTile: 512, gridSize: { cols: 5, rows: 8 },
    moveLimit: 60, timeLimit: null,
    starThresholds: [4000, 8000, 12000],
    blockPool: [2, 4, 8, 16],
    initialBlocks: [],
    description: 'Reach 512 to conquer Easy!',
  },

  // === MEDIUM (Levels 21-30) — Goal: 512-1024 ===
  {
    id: 21, name: 'Medium Heat', difficulty: 'medium',
    goalTile: 512, gridSize: { cols: 5, rows: 8 },
    moveLimit: 50, timeLimit: null,
    starThresholds: [5000, 10000, 15000],
    blockPool: [2, 4, 8, 16],
    initialBlocks: [
      { row: 7, col: 1, value: 8 },
      { row: 7, col: 3, value: 8 },
    ],
    description: 'The heat is on!',
  },
  {
    id: 22, name: 'Tight Space', difficulty: 'medium',
    goalTile: 512, gridSize: { cols: 4, rows: 7 },
    moveLimit: null, timeLimit: 120,
    starThresholds: [5500, 11000, 16000],
    blockPool: [4, 8, 8, 16],
    initialBlocks: [],
    description: 'Small grid, big goal!',
  },
  {
    id: 23, name: 'Number Crunch', difficulty: 'medium',
    goalTile: 512, gridSize: { cols: 5, rows: 8 },
    moveLimit: 45, timeLimit: null,
    starThresholds: [6000, 12000, 18000],
    blockPool: [2, 4, 8, 16, 32],
    initialBlocks: [],
    description: 'Crunch those numbers!',
  },
  {
    id: 24, name: 'Under Pressure', difficulty: 'medium',
    goalTile: 512, gridSize: { cols: 5, rows: 8 },
    moveLimit: null, timeLimit: 90,
    starThresholds: [6000, 12000, 20000],
    blockPool: [4, 8, 16, 16],
    initialBlocks: [],
    description: 'Beat the clock!',
  },
  {
    id: 25, name: 'Half K', difficulty: 'medium',
    goalTile: 1024, gridSize: { cols: 5, rows: 8 },
    moveLimit: null, timeLimit: null,
    starThresholds: [8000, 16000, 25000],
    blockPool: [2, 4, 8, 16, 32],
    initialBlocks: [],
    description: 'Reach 1024 — halfway to 2048!',
  },
  {
    id: 26, name: 'Grid Tactics', difficulty: 'medium',
    goalTile: 1024, gridSize: { cols: 5, rows: 8 },
    moveLimit: 55, timeLimit: null,
    starThresholds: [9000, 18000, 28000],
    blockPool: [4, 8, 16, 32],
    initialBlocks: [
      { row: 7, col: 0, value: 16 },
      { row: 7, col: 4, value: 16 },
    ],
    description: 'Use tactics to reach 1024!',
  },
  {
    id: 27, name: 'Speed Demon', difficulty: 'medium',
    goalTile: 1024, gridSize: { cols: 5, rows: 8 },
    moveLimit: null, timeLimit: 120,
    starThresholds: [10000, 20000, 30000],
    blockPool: [4, 8, 8, 16, 32],
    initialBlocks: [],
    description: 'Fast merges to 1024!',
  },
  {
    id: 28, name: 'Precision Drop', difficulty: 'medium',
    goalTile: 1024, gridSize: { cols: 4, rows: 8 },
    moveLimit: 50, timeLimit: null,
    starThresholds: [10000, 20000, 32000],
    blockPool: [8, 16, 16, 32],
    initialBlocks: [],
    description: 'Every drop counts!',
  },
  {
    id: 29, name: 'Approaching 2K', difficulty: 'medium',
    goalTile: 1024, gridSize: { cols: 5, rows: 8 },
    moveLimit: null, timeLimit: 150,
    starThresholds: [12000, 24000, 35000],
    blockPool: [4, 8, 16, 32],
    initialBlocks: [],
    description: 'Getting close to the big leagues!',
  },
  {
    id: 30, name: 'Medium Boss', difficulty: 'medium',
    goalTile: 2048, gridSize: { cols: 5, rows: 8 },
    moveLimit: 70, timeLimit: null,
    starThresholds: [15000, 30000, 45000],
    blockPool: [4, 8, 16, 32],
    initialBlocks: [],
    description: 'The legendary 2048!',
  },

  // === HARD (Levels 31-40) — Goal: 2048-4096+ ===
  {
    id: 31, name: 'Hard Mode', difficulty: 'hard',
    goalTile: 2048, gridSize: { cols: 5, rows: 8 },
    moveLimit: 60, timeLimit: null,
    starThresholds: [18000, 35000, 50000],
    blockPool: [4, 8, 16, 32],
    initialBlocks: [
      { row: 7, col: 2, value: 32 },
    ],
    description: 'Only pros reach here!',
  },
  {
    id: 32, name: 'Narrow Path', difficulty: 'hard',
    goalTile: 2048, gridSize: { cols: 4, rows: 8 },
    moveLimit: 50, timeLimit: null,
    starThresholds: [20000, 40000, 55000],
    blockPool: [8, 16, 16, 32, 64],
    initialBlocks: [],
    description: 'Small grid, massive goal!',
  },
  {
    id: 33, name: 'Time Crisis', difficulty: 'hard',
    goalTile: 2048, gridSize: { cols: 5, rows: 8 },
    moveLimit: null, timeLimit: 120,
    starThresholds: [20000, 40000, 60000],
    blockPool: [8, 16, 32, 32],
    initialBlocks: [],
    description: '2 minutes to 2048!',
  },
  {
    id: 34, name: 'Obstacle Course', difficulty: 'hard',
    goalTile: 2048, gridSize: { cols: 5, rows: 8 },
    moveLimit: 55, timeLimit: null,
    starThresholds: [22000, 44000, 65000],
    blockPool: [4, 8, 16, 32, 64],
    initialBlocks: [
      { row: 7, col: 0, value: 2 },
      { row: 7, col: 4, value: 2 },
      { row: 6, col: 2, value: 4 },
    ],
    description: 'Navigate around obstacles!',
  },
  {
    id: 35, name: 'Chain Master', difficulty: 'hard',
    goalTile: 2048, gridSize: { cols: 5, rows: 8 },
    moveLimit: null, timeLimit: 90,
    starThresholds: [25000, 50000, 70000],
    blockPool: [8, 16, 32, 64],
    initialBlocks: [],
    description: 'Chain reactions are key!',
  },
  {
    id: 36, name: 'Beyond 2K', difficulty: 'hard',
    goalTile: 4096, gridSize: { cols: 5, rows: 8 },
    moveLimit: null, timeLimit: null,
    starThresholds: [30000, 60000, 90000],
    blockPool: [8, 16, 32, 64],
    initialBlocks: [],
    description: 'Push beyond 2048!',
  },
  {
    id: 37, name: 'Sprint Mode', difficulty: 'hard',
    goalTile: 4096, gridSize: { cols: 5, rows: 8 },
    moveLimit: null, timeLimit: 180,
    starThresholds: [35000, 70000, 100000],
    blockPool: [16, 32, 32, 64],
    initialBlocks: [],
    description: '3 minutes to reach 4096!',
  },
  {
    id: 38, name: 'Tiny Grid', difficulty: 'hard',
    goalTile: 4096, gridSize: { cols: 4, rows: 7 },
    moveLimit: 60, timeLimit: null,
    starThresholds: [35000, 70000, 110000],
    blockPool: [16, 32, 64, 64],
    initialBlocks: [],
    description: 'Tiny space, giant goal!',
  },
  {
    id: 39, name: 'Final Push', difficulty: 'expert',
    goalTile: 4096, gridSize: { cols: 5, rows: 8 },
    moveLimit: 50, timeLimit: 150,
    starThresholds: [40000, 80000, 120000],
    blockPool: [8, 16, 32, 64, 128],
    initialBlocks: [],
    description: 'Timed AND limited moves!',
  },
  {
    id: 40, name: 'Ultimate Goal', difficulty: 'expert',
    goalTile: 8192, gridSize: { cols: 5, rows: 8 },
    moveLimit: null, timeLimit: null,
    starThresholds: [50000, 100000, 150000],
    blockPool: [8, 16, 32, 64, 128],
    initialBlocks: [],
    description: 'The ultimate challenge!',
  },
];

export function getLevelConfig(levelId: number): LevelConfig | undefined {
  return LEVELS.find(l => l.id === levelId);
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
    default: return '#95a5a6';
  }
}
