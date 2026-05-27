// X2 Global Blocks — Game Screen
// Core gameplay with grid, block dropping, merging, and HUD
import React, { useEffect, useCallback, useRef, useState } from 'react';
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  Dimensions,
  Alert,
  Modal,
} from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
  withTiming,
  withSequence,
  runOnJS,
} from 'react-native-reanimated';
import { LinearGradient } from 'expo-linear-gradient';
import { COLORS, GRADIENTS } from '../constants/colors';
import { useGameStore } from '../store/gameStore';
import { useProgressStore } from '../store/progressStore';
import { GameGrid } from '../components/GameGrid';
import { ScoreBar } from '../components/ScoreBar';
import { NextBlockPreview } from '../components/NextBlockPreview';
import { getComboMessage } from '../engine/scoreEngine';
import { audioManager } from '../engine/audioManager';

const { width } = Dimensions.get('window');

interface GameScreenProps {
  navigation: any;
  route: any;
}

export const GameScreen: React.FC<GameScreenProps> = ({ navigation, route }) => {
  const { levelId } = route.params;

  const {
    grid,
    score,
    movesUsed,
    timeRemaining,
    currentBlock,
    nextBlock,
    comboCount,
    gameStatus,
    highestTile,
    currentLevel,
    starsEarned,
    initLevel,
    performDrop,
    setGameStatus,
    decrementTime,
    resetGame,
  } = useGameStore();

  const completeLevel = useProgressStore((s) => s.completeLevel);

  const [highlightCol, setHighlightCol] = useState<number | undefined>(undefined);
  const [showPauseModal, setShowPauseModal] = useState(false);
  const [comboMessage, setComboMessage] = useState('');
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  // Combo animation
  const comboScale = useSharedValue(0);
  const comboOpacity = useSharedValue(0);

  // Init level
  useEffect(() => {
    initLevel(levelId);
    // Switch to gameplay music
    audioManager.playMusic('gameplay');
    return () => {
      audioManager.stopMusic();
    };
  }, [levelId]);

  // Timer for timed levels
  useEffect(() => {
    if (currentLevel?.timeLimit && gameStatus === 'playing') {
      timerRef.current = setInterval(() => {
        decrementTime();
      }, 1000);
    }
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [currentLevel, gameStatus]);

  // Handle win/lose
  useEffect(() => {
    if (gameStatus === 'won') {
      if (timerRef.current) clearInterval(timerRef.current);
      const winBonus = currentLevel?.winPoints || 50;
      const totalScore = score + winBonus;
      completeLevel(levelId, totalScore, starsEarned);
      setTimeout(() => {
        navigation.replace('Victory', {
          levelId,
          score: totalScore,
          stars: starsEarned,
          highestTile,
          winBonus,
        });
      }, 600);
    } else if (gameStatus === 'lost') {
      if (timerRef.current) clearInterval(timerRef.current);
      audioManager.stopMusic();
      audioManager.playSfx('gameover');
      setTimeout(() => {
        navigation.replace('GameOver', {
          levelId,
          score,
          highestTile,
          goalTile: currentLevel?.goalTile || 0,
        });
      }, 600);
    }
  }, [gameStatus]);

  // Show combo message
  useEffect(() => {
    if (comboCount >= 1) {
      audioManager.playSfx('merge');
    }
    if (comboCount >= 2) {
      audioManager.playSfx('combo');
      const msg = getComboMessage(comboCount);
      setComboMessage(msg);
      comboScale.value = withSequence(
        withSpring(1.3, { damping: 5 }),
        withSpring(1, { damping: 8 })
      );
      comboOpacity.value = withSequence(
        withTiming(1, { duration: 100 }),
        withTiming(1, { duration: 800 }),
        withTiming(0, { duration: 300 })
      );
    }
  }, [comboCount]);

  const handleColumnPress = useCallback(
    (col: number) => {
      if (gameStatus !== 'playing') return;
      performDrop(col);
      audioManager.playSfx('drop');
      setHighlightCol(undefined);
    },
    [gameStatus, performDrop]
  );

  const handlePause = useCallback(() => {
    if (gameStatus === 'playing') {
      setGameStatus('paused');
      setShowPauseModal(true);
      audioManager.pauseMusic();
      if (timerRef.current) clearInterval(timerRef.current);
    }
  }, [gameStatus]);

  const handleResume = useCallback(() => {
    setShowPauseModal(false);
    setGameStatus('playing');
    audioManager.resumeMusic();
  }, []);

  const handleRestart = useCallback(() => {
    setShowPauseModal(false);
    resetGame();
  }, []);

  const handleQuit = useCallback(() => {
    setShowPauseModal(false);
    navigation.goBack();
  }, []);

  const comboStyle = useAnimatedStyle(() => ({
    transform: [{ scale: comboScale.value }],
    opacity: comboOpacity.value,
  }));

  if (!currentLevel || grid.length === 0) {
    return (
      <LinearGradient colors={GRADIENTS.game as [string, string]} style={styles.loadingContainer}>
        <Text style={styles.loadingText}>Loading...</Text>
      </LinearGradient>
    );
  }

  return (
    <LinearGradient colors={GRADIENTS.game as [string, string]} style={styles.container}>
      {/* HUD */}
      <View style={styles.hudContainer}>
        <ScoreBar
          level={currentLevel.id}
          score={score}
          goalTile={currentLevel.goalTile}
          movesUsed={movesUsed}
          moveLimit={currentLevel.moveLimit}
          timeRemaining={timeRemaining}
          highestTile={highestTile}
          onPause={handlePause}
        />
      </View>

      {/* Next block preview */}
      <NextBlockPreview currentBlock={currentBlock} nextBlock={nextBlock} />

      {/* Combo message */}
      <View style={styles.comboContainer}>
        <Animated.Text style={[styles.comboText, comboStyle]}>
          {comboMessage}
        </Animated.Text>
      </View>

      {/* Game Grid */}
      <View style={styles.gridWrapper}>
        <GameGrid
          grid={grid}
          onColumnPress={handleColumnPress}
          highlightCol={highlightCol}
          cols={currentLevel.gridSize.cols}
          rows={currentLevel.gridSize.rows}
        />
      </View>

      {/* Level description */}
      <View style={styles.descriptionContainer}>
        <Text style={styles.descriptionText}>
          {currentLevel.description}
        </Text>
      </View>

      {/* Pause Modal */}
      <Modal visible={showPauseModal} transparent animationType="fade">
        <View style={styles.modalOverlay}>
          <View style={styles.pauseModal}>
            <Text style={styles.pauseTitle}>PAUSED</Text>
            <Text style={styles.pauseLevelText}>
              Level {currentLevel.id} — {currentLevel.name}
            </Text>

            <TouchableOpacity
              style={styles.modalButton}
              onPress={handleResume}
            >
              <LinearGradient
                colors={['#4dc9f6', '#9b59f5'] as [string, string]}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 0 }}
                style={styles.modalButtonGradient}
              >
                <Text style={styles.modalButtonText}>▶  RESUME</Text>
              </LinearGradient>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.modalButtonSecondary}
              onPress={handleRestart}
            >
              <Text style={styles.modalButtonSecondaryText}>🔄  RESTART</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.modalButtonSecondary}
              onPress={handleQuit}
            >
              <Text style={styles.modalButtonSecondaryText}>🏠  HOME</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 50,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    color: COLORS.textPrimary,
    fontSize: 18,
    fontWeight: '600',
  },
  hudContainer: {
    marginBottom: 4,
  },
  comboContainer: {
    height: 30,
    justifyContent: 'center',
    alignItems: 'center',
  },
  comboText: {
    color: COLORS.gold,
    fontSize: 22,
    fontWeight: '900',
    textShadowColor: 'rgba(255, 215, 0, 0.6)',
    textShadowOffset: { width: 0, height: 0 },
    textShadowRadius: 15,
  },
  gridWrapper: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  descriptionContainer: {
    paddingBottom: 30,
    alignItems: 'center',
  },
  descriptionText: {
    color: COLORS.textMuted,
    fontSize: 12,
    fontWeight: '500',
    letterSpacing: 0.5,
  },
  // Pause Modal
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(10, 14, 39, 0.9)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  pauseModal: {
    backgroundColor: COLORS.bgCard,
    borderRadius: 24,
    padding: 32,
    width: width * 0.8,
    alignItems: 'center',
    borderWidth: 2,
    borderColor: COLORS.gridBorder,
    elevation: 10,
  },
  pauseTitle: {
    color: COLORS.textPrimary,
    fontSize: 32,
    fontWeight: '900',
    letterSpacing: 4,
    marginBottom: 8,
  },
  pauseLevelText: {
    color: COLORS.textMuted,
    fontSize: 14,
    marginBottom: 24,
    fontWeight: '500',
  },
  modalButton: {
    width: '100%',
    borderRadius: 16,
    overflow: 'hidden',
    marginBottom: 12,
    elevation: 4,
  },
  modalButtonGradient: {
    paddingVertical: 14,
    alignItems: 'center',
    borderRadius: 16,
  },
  modalButtonText: {
    color: COLORS.textPrimary,
    fontSize: 16,
    fontWeight: '800',
    letterSpacing: 2,
  },
  modalButtonSecondary: {
    width: '100%',
    backgroundColor: COLORS.gridBg,
    borderRadius: 16,
    paddingVertical: 14,
    alignItems: 'center',
    marginBottom: 8,
    borderWidth: 1,
    borderColor: COLORS.gridBorder,
  },
  modalButtonSecondaryText: {
    color: COLORS.textSecondary,
    fontSize: 14,
    fontWeight: '700',
    letterSpacing: 1,
  },
});
