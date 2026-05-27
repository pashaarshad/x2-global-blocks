// X2 Global Blocks — Progress Store (AsyncStorage-backed)
import { create } from 'zustand';
import AsyncStorage from '@react-native-async-storage/async-storage';

const STORAGE_KEY = '@x2_global_blocks_progress';

interface Settings {
  soundEnabled: boolean;
  musicEnabled: boolean;
  hapticsEnabled: boolean;
  theme: 'dark-blue' | 'purple' | 'black';
}

interface ProgressState {
  // Progress data
  levelsCompleted: number[];
  levelStars: Record<number, number>;
  levelBestScores: Record<number, number>;
  globalHighScore: number;
  lastPlayedLevel: number;

  // Settings
  settings: Settings;

  // Loading
  isLoaded: boolean;

  // Actions
  loadProgress: () => Promise<void>;
  saveProgress: () => Promise<void>;
  completeLevel: (levelId: number, score: number, stars: number) => void;
  updateSettings: (settings: Partial<Settings>) => void;
  getNextLevel: () => number;
  isLevelUnlocked: (levelId: number) => boolean;
  resetAllProgress: () => void;
}

export const useProgressStore = create<ProgressState>((set, get) => ({
  levelsCompleted: [],
  levelStars: {},
  levelBestScores: {},
  globalHighScore: 0,
  lastPlayedLevel: 1,
  settings: {
    soundEnabled: true,
    musicEnabled: true,
    hapticsEnabled: true,
    theme: 'dark-blue',
  },
  isLoaded: false,

  loadProgress: async () => {
    try {
      const json = await AsyncStorage.getItem(STORAGE_KEY);
      if (json) {
        const data = JSON.parse(json);
        set({
          levelsCompleted: data.levelsCompleted || [],
          levelStars: data.levelStars || {},
          levelBestScores: data.levelBestScores || {},
          globalHighScore: data.globalHighScore || 0,
          lastPlayedLevel: data.lastPlayedLevel || 1,
          settings: { ...get().settings, ...data.settings },
          isLoaded: true,
        });
      } else {
        set({ isLoaded: true });
      }
    } catch (e) {
      console.warn('Failed to load progress:', e);
      set({ isLoaded: true });
    }
  },

  saveProgress: async () => {
    try {
      const state = get();
      const data = {
        levelsCompleted: state.levelsCompleted,
        levelStars: state.levelStars,
        levelBestScores: state.levelBestScores,
        globalHighScore: state.globalHighScore,
        lastPlayedLevel: state.lastPlayedLevel,
        settings: state.settings,
      };
      await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(data));
    } catch (e) {
      console.warn('Failed to save progress:', e);
    }
  },

  completeLevel: (levelId: number, score: number, stars: number) => {
    const state = get();

    const newCompleted = state.levelsCompleted.includes(levelId)
      ? state.levelsCompleted
      : [...state.levelsCompleted, levelId];

    const existingStars = state.levelStars[levelId] || 0;
    const newStars = { ...state.levelStars, [levelId]: Math.max(existingStars, stars) };

    const existingScore = state.levelBestScores[levelId] || 0;
    const newScores = { ...state.levelBestScores, [levelId]: Math.max(existingScore, score) };

    const newHighScore = Math.max(state.globalHighScore, score);

    set({
      levelsCompleted: newCompleted,
      levelStars: newStars,
      levelBestScores: newScores,
      globalHighScore: newHighScore,
      lastPlayedLevel: levelId,
    });

    // Auto-save
    get().saveProgress();
  },

  updateSettings: (newSettings: Partial<Settings>) => {
    const state = get();
    set({
      settings: { ...state.settings, ...newSettings },
    });
    get().saveProgress();
  },

  getNextLevel: () => {
    const state = get();
    if (state.levelsCompleted.length === 0) return 1;

    const maxCompleted = Math.max(...state.levelsCompleted);
    return maxCompleted + 1;
  },

  isLevelUnlocked: (levelId: number) => {
    const state = get();
    if (levelId === 1) return true;
    return state.levelsCompleted.includes(levelId - 1);
  },

  resetAllProgress: () => {
    set({
      levelsCompleted: [],
      levelStars: {},
      levelBestScores: {},
      globalHighScore: 0,
      lastPlayedLevel: 1,
    });
    get().saveProgress();
  },
}));
