// X2 Global Blocks — Game Grid Engine
// Core merge logic, block dropping, cascade system

export interface Cell {
  value: number;
  id: string; // Unique ID for animation tracking
  merging?: boolean;
  isNew?: boolean;
}

export type Grid = (Cell | null)[][];

let cellIdCounter = 0;

export function generateCellId(): string {
  return `cell_${Date.now()}_${cellIdCounter++}`;
}

export function createGrid(cols: number, rows: number): Grid {
  const grid: Grid = [];
  for (let r = 0; r < rows; r++) {
    grid.push(new Array(cols).fill(null));
  }
  return grid;
}

export function cloneGrid(grid: Grid): Grid {
  return grid.map(row => row.map(cell => (cell ? { ...cell } : null)));
}

export interface MergeEvent {
  fromRow: number;
  fromCol: number;
  toRow: number;
  toCol: number;
  newValue: number;
}

export interface DropResult {
  grid: Grid;
  landedRow: number;
  landedCol: number;
  mergeEvents: MergeEvent[];
  scoreGained: number;
  highestMergedValue: number;
  comboCount: number;
}

/**
 * Find the lowest empty row in a column (gravity — blocks fall down)
 */
export function findLowestEmptyRow(grid: Grid, col: number): number {
  const rows = grid.length;
  for (let r = rows - 1; r >= 0; r--) {
    if (grid[r][col] === null) {
      return r;
    }
  }
  return -1; // Column is full
}

/**
 * Drop a block into a specific column.
 * Returns the updated grid and all merge events that occurred.
 */
export function dropBlock(grid: Grid, col: number, value: number): DropResult {
  const newGrid = cloneGrid(grid);
  const row = findLowestEmptyRow(newGrid, col);

  if (row === -1) {
    // Column is full — invalid move
    return {
      grid: newGrid,
      landedRow: -1,
      landedCol: col,
      mergeEvents: [],
      scoreGained: 0,
      highestMergedValue: 0,
      comboCount: 0,
    };
  }

  // Place the block
  newGrid[row][col] = {
    value,
    id: generateCellId(),
    isNew: true,
  };

  // Process merges with cascading
  const allMergeEvents: MergeEvent[] = [];
  let totalScore = 0;
  let highestMerged = 0;
  let comboCount = 0;

  let mergeOccurred = true;
  while (mergeOccurred) {
    mergeOccurred = false;

    // Apply gravity first
    applyGravity(newGrid);

    // Check for merges across entire grid
    const mergeResult = findAndApplyMerges(newGrid);

    if (mergeResult.events.length > 0) {
      mergeOccurred = true;
      comboCount++;
      allMergeEvents.push(...mergeResult.events);
      totalScore += mergeResult.score * comboCount; // Combo multiplier
      if (mergeResult.highestValue > highestMerged) {
        highestMerged = mergeResult.highestValue;
      }
    }
  }

  return {
    grid: newGrid,
    landedRow: row,
    landedCol: col,
    mergeEvents: allMergeEvents,
    scoreGained: totalScore,
    highestMergedValue: highestMerged,
    comboCount,
  };
}

/**
 * Find merges — check adjacency (up, down, left, right)
 * Only merge one pair at a time to create sequential cascade
 */
function findAndApplyMerges(grid: Grid): {
  events: MergeEvent[];
  score: number;
  highestValue: number;
} {
  const rows = grid.length;
  const cols = grid[0].length;
  const events: MergeEvent[] = [];
  let score = 0;
  let highestValue = 0;
  const merged = new Set<string>();

  // Scan bottom-up, left-right for merges (prioritize lower blocks)
  for (let r = rows - 1; r >= 0; r--) {
    for (let c = 0; c < cols; c++) {
      const cell = grid[r][c];
      if (!cell || merged.has(`${r},${c}`)) continue;

      // Check neighbors: down, right, left, up
      const neighbors: [number, number][] = [
        [r + 1, c], // down
        [r, c + 1], // right
        [r, c - 1], // left
        [r - 1, c], // up
      ];

      for (const [nr, nc] of neighbors) {
        if (
          nr >= 0 && nr < rows &&
          nc >= 0 && nc < cols &&
          grid[nr][nc] &&
          !merged.has(`${nr},${nc}`) &&
          grid[nr][nc]!.value === cell.value
        ) {
          // Merge! The lower/rightmost cell absorbs the other
          const newValue = cell.value * 2;

          // Keep the cell at the lower position
          const keepR = Math.max(r, nr);
          const keepC = r === nr ? Math.max(c, nc) : (keepR === r ? c : nc);
          const removeR = keepR === r ? nr : r;
          const removeC = keepC === c ? nc : c;

          grid[keepR][keepC] = {
            value: newValue,
            id: generateCellId(),
            merging: true,
          };
          grid[removeR][removeC] = null;

          events.push({
            fromRow: removeR,
            fromCol: removeC,
            toRow: keepR,
            toCol: keepC,
            newValue,
          });

          score += newValue * 10;
          if (newValue > highestValue) highestValue = newValue;

          merged.add(`${keepR},${keepC}`);
          merged.add(`${removeR},${removeC}`);
          break; // Only one merge per cell per pass
        }
      }
    }
  }

  return { events, score, highestValue };
}

/**
 * Apply gravity — make blocks fall to fill empty spaces below
 */
export function applyGravity(grid: Grid): void {
  const rows = grid.length;
  const cols = grid[0].length;

  for (let c = 0; c < cols; c++) {
    // Collect all non-null cells in this column
    const cells: Cell[] = [];
    for (let r = 0; r < rows; r++) {
      if (grid[r][c] !== null) {
        cells.push(grid[r][c]!);
      }
    }

    // Fill from bottom
    for (let r = rows - 1; r >= 0; r--) {
      const idx = cells.length - (rows - r);
      grid[r][c] = idx >= 0 ? cells[idx] : null;
    }
  }
}

/**
 * Check if the grid is full (game over condition)
 */
export function isGridFull(grid: Grid): boolean {
  return grid[0].every(cell => cell !== null);
}

/**
 * Check if a specific value exists in the grid (goal reached)
 */
export function hasValue(grid: Grid, value: number): boolean {
  for (const row of grid) {
    for (const cell of row) {
      if (cell && cell.value >= value) {
        return true;
      }
    }
  }
  return false;
}

/**
 * Get the highest value on the grid
 */
export function getHighestValue(grid: Grid): number {
  let max = 0;
  for (const row of grid) {
    for (const cell of row) {
      if (cell && cell.value > max) {
        max = cell.value;
      }
    }
  }
  return max;
}

/**
 * Count occupied cells
 */
export function getOccupiedCount(grid: Grid): number {
  let count = 0;
  for (const row of grid) {
    for (const cell of row) {
      if (cell !== null) count++;
    }
  }
  return count;
}

/**
 * Generate a random block value from the pool
 */
export function getRandomBlock(pool: number[]): number {
  return pool[Math.floor(Math.random() * pool.length)];
}
