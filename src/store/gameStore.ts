// X2 Global Blocks — Game State Store (Zustand)
import { create } from 'zustand';
import {
  Grid,
  createGrid,
  dropBlock,
  isGridFull,
  hasValue,
  getRandomBlock,
  getHighestValue,
  generateCellId,
} from '../engine/gridEngine';
import { LevelConfig, getLevelConfig } from '../engine/levelConfig';
import { calculateStars } from '../engine/scoreEngine';

export type GameStatus = 'idle' | 'playing' | 'paused' | 'won' | 'lost';

interface GameState {
  // Current game state
  grid: Grid;
  score: number;
  movesUsed: number;
  timeRemaining: number | null;
  currentBlock: number;
  nextBlock: number;
  comboCount: number;
  gameStatus: GameStatus;
  highestTile: number;

  // Level info
  currentLevel: LevelConfig | null;
  starsEarned: number;

  // Actions
  initLevel: (levelId: number) => void;
  performDrop: (col: number) => void;
  setGameStatus: (status: GameStatus) => void;
  decrementTime: () => void;
  resetGame: () => void;
}

export const useGameStore = create<GameState>((set, get) => ({
  // Initial state
  grid: [],
  score: 0,
  movesUsed: 0,
  timeRemaining: null,
  currentBlock: 2,
  nextBlock: 2,
  comboCount: 0,
  gameStatus: 'idle',
  highestTile: 0,
  currentLevel: null,
  starsEarned: 0,

  initLevel: (levelId: number) => {
    const level = getLevelConfig(levelId);
    if (!level) return;

    const grid = createGrid(level.gridSize.cols, level.gridSize.rows);

    // Place initial blocks if any
    for (const block of level.initialBlocks) {
      if (block.row < level.gridSize.rows && block.col < level.gridSize.cols) {
        grid[block.row][block.col] = {
          value: block.value,
          id: generateCellId(),
        };
      }
    }

    set({
      grid,
      score: 0,
      movesUsed: 0,
      timeRemaining: level.timeLimit,
      currentBlock: getRandomBlock(level.blockPool),
      nextBlock: getRandomBlock(level.blockPool),
      comboCount: 0,
      gameStatus: 'playing',
      highestTile: 0,
      currentLevel: level,
      starsEarned: 0,
    });
  },

  performDrop: (col: number) => {
    const state = get();
    if (state.gameStatus !== 'playing' || !state.currentLevel) return;

    // Check move limit
    if (
      state.currentLevel.moveLimit &&
      state.movesUsed >= state.currentLevel.moveLimit
    ) {
      set({ gameStatus: 'lost' });
      return;
    }

    const result = dropBlock(state.grid, col, state.currentBlock);

    if (result.landedRow === -1) {
      // Column is full, invalid move — do nothing
      return;
    }

    const newScore = state.score + result.scoreGained;
    const newMovesUsed = state.movesUsed + 1;
    const newHighest = Math.max(state.highestTile, result.highestMergedValue, getHighestValue(result.grid));

    // Check win condition
    if (hasValue(result.grid, state.currentLevel.goalTile)) {
      const stars = calculateStars(newScore, state.currentLevel.starThresholds);
      set({
        grid: result.grid,
        score: newScore,
        movesUsed: newMovesUsed,
        comboCount: result.comboCount,
        highestTile: newHighest,
        gameStatus: 'won',
        starsEarned: stars,
        currentBlock: state.nextBlock,
        nextBlock: getRandomBlock(state.currentLevel.blockPool),
      });
      return;
    }

    // Check game over (grid full)
    if (isGridFull(result.grid)) {
      set({
        grid: result.grid,
        score: newScore,
        movesUsed: newMovesUsed,
        comboCount: result.comboCount,
        highestTile: newHighest,
        gameStatus: 'lost',
      });
      return;
    }

    // Check move limit
    if (
      state.currentLevel.moveLimit &&
      newMovesUsed >= state.currentLevel.moveLimit
    ) {
      // Last move used, check if goal reached
      if (!hasValue(result.grid, state.currentLevel.goalTile)) {
        set({
          grid: result.grid,
          score: newScore,
          movesUsed: newMovesUsed,
          comboCount: result.comboCount,
          highestTile: newHighest,
          gameStatus: 'lost',
        });
        return;
      }
    }

    // Normal move — continue playing
    set({
      grid: result.grid,
      score: newScore,
      movesUsed: newMovesUsed,
      comboCount: result.comboCount,
      highestTile: newHighest,
      currentBlock: state.nextBlock,
      nextBlock: getRandomBlock(state.currentLevel.blockPool),
    });
  },

  setGameStatus: (status: GameStatus) => {
    set({ gameStatus: status });
  },

  decrementTime: () => {
    const state = get();
    if (state.timeRemaining === null || state.gameStatus !== 'playing') return;

    const newTime = state.timeRemaining - 1;
    if (newTime <= 0) {
      set({ timeRemaining: 0, gameStatus: 'lost' });
    } else {
      set({ timeRemaining: newTime });
    }
  },

  resetGame: () => {
    const state = get();
    if (state.currentLevel) {
      get().initLevel(state.currentLevel.id);
    }
  },
}));
