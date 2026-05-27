// X2 Global Blocks — Level Select Screen
import React from 'react';
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  ScrollView,
  Dimensions,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { COLORS, GRADIENTS, getBlockColor } from '../constants/colors';
import { LEVELS, getDifficultyColor } from '../engine/levelConfig';
import { useProgressStore } from '../store/progressStore';
import { StarRating } from '../components/StarRating';

const { width } = Dimensions.get('window');

interface LevelSelectScreenProps {
  navigation: any;
}

const DIFFICULTY_LABELS: Record<string, string> = {
  beginner: '🌱 BEGINNER',
  easy: '🎯 EASY',
  medium: '🔥 MEDIUM',
  hard: '💀 HARD',
  expert: '👑 EXPERT',
};

export const LevelSelectScreen: React.FC<LevelSelectScreenProps> = ({
  navigation,
}) => {
  const isLevelUnlocked = useProgressStore((s) => s.isLevelUnlocked);
  const levelStars = useProgressStore((s) => s.levelStars);
  const levelsCompleted = useProgressStore((s) => s.levelsCompleted);

  // Group levels by difficulty
  const grouped = LEVELS.reduce((acc, level) => {
    if (!acc[level.difficulty]) acc[level.difficulty] = [];
    acc[level.difficulty].push(level);
    return acc;
  }, {} as Record<string, typeof LEVELS>);

  const difficulties = ['beginner', 'easy', 'medium', 'hard', 'expert'];

  const tileSize = (width - 60 - 30) / 4; // 4 columns with gaps

  return (
    <LinearGradient
      colors={GRADIENTS.splash as [string, string]}
      style={styles.container}
    >
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => navigation.goBack()}
        >
          <Text style={styles.backButtonText}>←</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>SELECT LEVEL</Text>
        <View style={styles.headerRight}>
          <Text style={styles.completedText}>
            {levelsCompleted.length}/{LEVELS.length}
          </Text>
        </View>
      </View>

      {/* Level grid */}
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {difficulties.map((diff) => {
          const levels = grouped[diff];
          if (!levels) return null;

          return (
            <View key={diff} style={styles.difficultySection}>
              {/* Difficulty header */}
              <View
                style={[
                  styles.difficultyHeader,
                  {
                    borderLeftColor: getDifficultyColor(diff),
                  },
                ]}
              >
                <Text style={styles.difficultyLabel}>
                  {DIFFICULTY_LABELS[diff] || diff.toUpperCase()}
                </Text>
                <View
                  style={[
                    styles.difficultyLine,
                    { backgroundColor: getDifficultyColor(diff) },
                  ]}
                />
              </View>

              {/* Level tiles grid */}
              <View style={styles.levelGrid}>
                {levels.map((level) => {
                  const unlocked = isLevelUnlocked(level.id);
                  const completed = levelsCompleted.includes(level.id);
                  const stars = levelStars[level.id] || 0;
                  const goalColors = getBlockColor(level.goalTile);

                  return (
                    <TouchableOpacity
                      key={level.id}
                      style={[
                        styles.levelTile,
                        {
                          width: tileSize,
                          height: tileSize + 20,
                          opacity: unlocked ? 1 : 0.4,
                        },
                      ]}
                      disabled={!unlocked}
                      onPress={() =>
                        navigation.navigate('Game', { levelId: level.id })
                      }
                      activeOpacity={0.7}
                    >
                      <LinearGradient
                        colors={
                          completed
                            ? ([goalColors.bg, goalColors.glow] as [string, string])
                            : unlocked
                            ? (['#1e2255', '#2a2f5a'] as [string, string])
                            : (['#151833', '#1a1e3a'] as [string, string])
                        }
                        style={styles.levelTileGradient}
                      >
                        {/* Lock icon */}
                        {!unlocked && (
                          <Text style={styles.lockIcon}>🔒</Text>
                        )}

                        {/* Level number */}
                        {unlocked && (
                          <>
                            <Text
                              style={[
                                styles.levelNumber,
                                completed && { color: '#fff' },
                              ]}
                            >
                              {level.id}
                            </Text>

                            {/* Goal tile */}
                            <View
                              style={[
                                styles.goalMini,
                                { backgroundColor: goalColors.bg },
                              ]}
                            >
                              <Text style={styles.goalMiniText}>
                                {level.goalTile}
                              </Text>
                            </View>

                            {/* Stars */}
                            {completed && (
                              <View style={styles.starsContainer}>
                                <StarRating stars={stars} size={12} />
                              </View>
                            )}

                            {/* Mode indicators */}
                            <View style={styles.modeIndicators}>
                              {level.moveLimit && (
                                <Text style={styles.modeIcon}>🎯</Text>
                              )}
                              {level.timeLimit && (
                                <Text style={styles.modeIcon}>⏰</Text>
                              )}
                            </View>
                          </>
                        )}
                      </LinearGradient>
                    </TouchableOpacity>
                  );
                })}
              </View>
            </View>
          );
        })}

        <View style={styles.bottomPadding} />
      </ScrollView>
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingTop: 50,
    paddingHorizontal: 20,
    paddingBottom: 16,
  },
  backButton: {
    width: 44,
    height: 44,
    borderRadius: 12,
    backgroundColor: COLORS.bgCard,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: COLORS.gridBorder,
  },
  backButtonText: {
    color: COLORS.textPrimary,
    fontSize: 22,
    fontWeight: '700',
  },
  headerTitle: {
    color: COLORS.textPrimary,
    fontSize: 20,
    fontWeight: '900',
    letterSpacing: 3,
  },
  headerRight: {
    backgroundColor: COLORS.bgCard,
    borderRadius: 12,
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderWidth: 1,
    borderColor: COLORS.gridBorder,
  },
  completedText: {
    color: COLORS.neonGreen,
    fontSize: 14,
    fontWeight: '800',
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: 20,
  },
  difficultySection: {
    marginBottom: 24,
  },
  difficultyHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
    borderLeftWidth: 3,
    paddingLeft: 10,
  },
  difficultyLabel: {
    color: COLORS.textPrimary,
    fontSize: 14,
    fontWeight: '800',
    letterSpacing: 2,
  },
  difficultyLine: {
    flex: 1,
    height: 1,
    marginLeft: 12,
    opacity: 0.3,
  },
  levelGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'flex-start',
    gap: 10,
  },
  levelTile: {
    borderRadius: 14,
    overflow: 'hidden',
    elevation: 4,
  },
  levelTileGradient: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 14,
    borderWidth: 1,
    borderColor: COLORS.gridBorder,
    padding: 4,
  },
  lockIcon: {
    fontSize: 24,
  },
  levelNumber: {
    color: COLORS.textSecondary,
    fontSize: 22,
    fontWeight: '900',
  },
  goalMini: {
    borderRadius: 6,
    paddingHorizontal: 6,
    paddingVertical: 2,
    marginTop: 4,
  },
  goalMiniText: {
    color: '#fff',
    fontSize: 10,
    fontWeight: '800',
  },
  starsContainer: {
    marginTop: 4,
  },
  modeIndicators: {
    flexDirection: 'row',
    position: 'absolute',
    top: 4,
    right: 4,
  },
  modeIcon: {
    fontSize: 10,
    marginLeft: 2,
  },
  bottomPadding: {
    height: 40,
  },
});
