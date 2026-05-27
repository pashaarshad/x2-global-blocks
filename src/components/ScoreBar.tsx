// X2 Global Blocks — Score Bar / HUD Component
import React from 'react';
import { StyleSheet, Text, View, TouchableOpacity } from 'react-native';
import { COLORS, getBlockColor } from '../constants/colors';
import { formatScore } from '../engine/scoreEngine';

interface ScoreBarProps {
  level: number;
  score: number;
  goalTile: number;
  movesUsed: number;
  moveLimit: number | null;
  timeRemaining: number | null;
  highestTile: number;
  onPause: () => void;
}

export const ScoreBar: React.FC<ScoreBarProps> = ({
  level,
  score,
  goalTile,
  movesUsed,
  moveLimit,
  timeRemaining,
  highestTile,
  onPause,
}) => {
  const goalColors = getBlockColor(goalTile);
  const progressRatio = Math.min(1, highestTile / goalTile);

  const formatTime = (seconds: number): string => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <View style={styles.container}>
      {/* Top row: Level + Score + Pause */}
      <View style={styles.topRow}>
        <View style={styles.levelBadge}>
          <Text style={styles.levelLabel}>LEVEL</Text>
          <Text style={styles.levelNumber}>{level}</Text>
        </View>

        <View style={styles.scoreContainer}>
          <Text style={styles.scoreLabel}>SCORE</Text>
          <Text style={styles.scoreValue}>{formatScore(score)}</Text>
        </View>

        <TouchableOpacity style={styles.pauseButton} onPress={onPause}>
          <Text style={styles.pauseIcon}>⏸</Text>
        </TouchableOpacity>
      </View>

      {/* Bottom row: Goal + Moves/Time */}
      <View style={styles.bottomRow}>
        {/* Goal display */}
        <View style={styles.goalContainer}>
          <Text style={styles.goalLabel}>GOAL</Text>
          <View style={[styles.goalTile, { backgroundColor: goalColors.bg }]}>
            <Text style={[styles.goalTileText, { color: goalColors.text }]}>
              {goalTile}
            </Text>
          </View>
          {/* Progress bar */}
          <View style={styles.progressBarBg}>
            <View
              style={[
                styles.progressBarFill,
                {
                  width: `${progressRatio * 100}%`,
                  backgroundColor:
                    progressRatio >= 1 ? COLORS.success : COLORS.neonBlue,
                },
              ]}
            />
          </View>
        </View>

        {/* Moves or Time */}
        <View style={styles.constraintContainer}>
          {moveLimit && (
            <View style={styles.constraintBox}>
              <Text style={styles.constraintLabel}>MOVES</Text>
              <Text
                style={[
                  styles.constraintValue,
                  {
                    color:
                      moveLimit - movesUsed <= 5
                        ? COLORS.danger
                        : COLORS.textPrimary,
                  },
                ]}
              >
                {moveLimit - movesUsed}
              </Text>
            </View>
          )}
          {timeRemaining !== null && (
            <View style={styles.constraintBox}>
              <Text style={styles.constraintLabel}>TIME</Text>
              <Text
                style={[
                  styles.constraintValue,
                  {
                    color:
                      timeRemaining <= 15
                        ? COLORS.danger
                        : COLORS.textPrimary,
                  },
                ]}
              >
                {formatTime(timeRemaining)}
              </Text>
            </View>
          )}
          {!moveLimit && timeRemaining === null && (
            <View style={styles.constraintBox}>
              <Text style={styles.constraintLabel}>BEST</Text>
              <Text style={styles.constraintValue}>{highestTile}</Text>
            </View>
          )}
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 20,
    paddingVertical: 8,
  },
  topRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  levelBadge: {
    backgroundColor: COLORS.bgCard,
    borderRadius: 12,
    paddingHorizontal: 14,
    paddingVertical: 6,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: COLORS.neonPurple,
  },
  levelLabel: {
    color: COLORS.textMuted,
    fontSize: 10,
    fontWeight: '600',
    letterSpacing: 1,
  },
  levelNumber: {
    color: COLORS.textPrimary,
    fontSize: 20,
    fontWeight: '900',
  },
  scoreContainer: {
    alignItems: 'center',
    flex: 1,
    marginHorizontal: 12,
  },
  scoreLabel: {
    color: COLORS.textMuted,
    fontSize: 10,
    fontWeight: '600',
    letterSpacing: 1,
  },
  scoreValue: {
    color: COLORS.gold,
    fontSize: 24,
    fontWeight: '900',
  },
  pauseButton: {
    backgroundColor: COLORS.bgCard,
    borderRadius: 12,
    width: 44,
    height: 44,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: COLORS.gridBorder,
  },
  pauseIcon: {
    fontSize: 18,
  },
  bottomRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  goalContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  goalLabel: {
    color: COLORS.textMuted,
    fontSize: 10,
    fontWeight: '700',
    letterSpacing: 1,
    marginRight: 8,
  },
  goalTile: {
    width: 40,
    height: 40,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 4,
    marginRight: 10,
  },
  goalTileText: {
    fontWeight: '900',
    fontSize: 12,
  },
  progressBarBg: {
    flex: 1,
    height: 6,
    backgroundColor: COLORS.gridBorder,
    borderRadius: 3,
    overflow: 'hidden',
  },
  progressBarFill: {
    height: '100%',
    borderRadius: 3,
  },
  constraintContainer: {
    marginLeft: 12,
    flexDirection: 'row',
  },
  constraintBox: {
    backgroundColor: COLORS.bgCard,
    borderRadius: 10,
    paddingHorizontal: 12,
    paddingVertical: 4,
    alignItems: 'center',
    marginLeft: 6,
    borderWidth: 1,
    borderColor: COLORS.gridBorder,
  },
  constraintLabel: {
    color: COLORS.textMuted,
    fontSize: 9,
    fontWeight: '700',
    letterSpacing: 0.5,
  },
  constraintValue: {
    color: COLORS.textPrimary,
    fontSize: 16,
    fontWeight: '900',
  },
});
