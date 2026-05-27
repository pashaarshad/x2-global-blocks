// X2 Global Blocks — Level Select Screen
// Handles 1000 levels with scrolling, grouped by difficulty tiers
import React, { useRef, useEffect } from 'react';
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
import { LEVELS, getDifficultyColor, getDifficultyLabel } from '../engine/levelConfig';
import { useProgressStore } from '../store/progressStore';
import { StarRating } from '../components/StarRating';
import { audioManager } from '../engine/audioManager';

const { width } = Dimensions.get('window');

interface LevelSelectScreenProps {
  navigation: any;
}

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

  const difficulties = ['beginner', 'easy', 'medium', 'hard', 'expert', 'master', 'legend'];

  const tileSize = (Math.min(width, 500) - 60 - 30) / 5; // 5 columns for 1000 levels

  return (
    <LinearGradient
      colors={GRADIENTS.splash as [string, string]}
      style={styles.container}
    >
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => {
            audioManager.playSfx('button');
            navigation.goBack();
          }}
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
                  {getDifficultyLabel(diff)}
                </Text>
                <View style={styles.difficultyMeta}>
                  <Text style={[styles.difficultyCount, { color: getDifficultyColor(diff) }]}>
                    {levels.length} levels
                  </Text>
                </View>
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
                          height: tileSize + 14,
                          opacity: unlocked ? 1 : 0.35,
                        },
                      ]}
                      disabled={!unlocked}
                      onPress={() => {
                        audioManager.playSfx('button');
                        navigation.navigate('Game', { levelId: level.id });
                      }}
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

                            {/* Goal tile badge */}
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
                                <StarRating stars={stars} size={10} />
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

        {/* Points info */}
        <View style={styles.pointsInfoCard}>
          <Text style={styles.pointsInfoTitle}>🏅 WIN BONUS POINTS</Text>
          <View style={styles.pointsGrid}>
            {[
              { label: '🌱 Beginner', pts: '50' },
              { label: '🎯 Easy', pts: '75' },
              { label: '🔥 Medium', pts: '100' },
              { label: '💀 Hard', pts: '150' },
              { label: '👑 Expert', pts: '200' },
              { label: '🏆 Master', pts: '300' },
              { label: '⚡ Legend', pts: '500' },
            ].map((item) => (
              <View key={item.label} style={styles.pointsRow}>
                <Text style={styles.pointsLabel}>{item.label}</Text>
                <Text style={styles.pointsValue}>+{item.pts}</Text>
              </View>
            ))}
          </View>
        </View>

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
  difficultyMeta: {
    marginLeft: 8,
  },
  difficultyCount: {
    fontSize: 11,
    fontWeight: '600',
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
    gap: 8,
  },
  levelTile: {
    borderRadius: 12,
    overflow: 'hidden',
    elevation: 4,
  },
  levelTileGradient: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: COLORS.gridBorder,
    padding: 3,
  },
  lockIcon: {
    fontSize: 18,
  },
  levelNumber: {
    color: COLORS.textSecondary,
    fontSize: 16,
    fontWeight: '900',
  },
  goalMini: {
    borderRadius: 4,
    paddingHorizontal: 5,
    paddingVertical: 1,
    marginTop: 2,
  },
  goalMiniText: {
    color: '#fff',
    fontSize: 8,
    fontWeight: '800',
  },
  starsContainer: {
    marginTop: 2,
  },
  modeIndicators: {
    flexDirection: 'row',
    position: 'absolute',
    top: 3,
    right: 3,
  },
  modeIcon: {
    fontSize: 8,
    marginLeft: 1,
  },
  pointsInfoCard: {
    backgroundColor: COLORS.bgCard,
    borderRadius: 16,
    padding: 20,
    marginTop: 8,
    borderWidth: 1,
    borderColor: COLORS.gridBorder,
  },
  pointsInfoTitle: {
    color: COLORS.gold,
    fontSize: 14,
    fontWeight: '800',
    letterSpacing: 1,
    textAlign: 'center',
    marginBottom: 12,
  },
  pointsGrid: {
    gap: 6,
  },
  pointsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 4,
    paddingHorizontal: 8,
  },
  pointsLabel: {
    color: COLORS.textSecondary,
    fontSize: 13,
    fontWeight: '600',
  },
  pointsValue: {
    color: COLORS.neonGreen,
    fontSize: 14,
    fontWeight: '800',
  },
  bottomPadding: {
    height: 40,
  },
});
