// X2 Global Blocks — Game Over Screen
import React, { useEffect } from 'react';
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  Dimensions,
} from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
  withDelay,
  withTiming,
  withSequence,
  withRepeat,
} from 'react-native-reanimated';
import { LinearGradient } from 'expo-linear-gradient';
import { COLORS, GRADIENTS } from '../constants/colors';
import { formatScore, getGameOverMessage } from '../engine/scoreEngine';

const { width } = Dimensions.get('window');

interface GameOverScreenProps {
  navigation: any;
  route: any;
}

export const GameOverScreen: React.FC<GameOverScreenProps> = ({
  navigation,
  route,
}) => {
  const { levelId, score, highestTile, goalTile } = route.params;
  const encouragement = getGameOverMessage(score, goalTile, highestTile);

  // Animations
  const overlayOpacity = useSharedValue(0);
  const titleScale = useSharedValue(0.3);
  const titleOpacity = useSharedValue(0);
  const shakeX = useSharedValue(0);
  const contentOpacity = useSharedValue(0);
  const buttonsTranslateY = useSharedValue(40);
  const buttonsOpacity = useSharedValue(0);
  const iconScale = useSharedValue(0);

  useEffect(() => {
    // Screen shake
    shakeX.value = withSequence(
      withTiming(-10, { duration: 50 }),
      withTiming(10, { duration: 50 }),
      withTiming(-8, { duration: 50 }),
      withTiming(8, { duration: 50 }),
      withTiming(-4, { duration: 50 }),
      withTiming(0, { duration: 50 })
    );

    // Overlay fade in
    overlayOpacity.value = withTiming(1, { duration: 500 });

    // Title entrance
    titleScale.value = withDelay(400, withSpring(1, { damping: 5 }));
    titleOpacity.value = withDelay(400, withTiming(1, { duration: 300 }));

    // Icon
    iconScale.value = withDelay(600, withSpring(1, { damping: 6, stiffness: 120 }));

    // Content
    contentOpacity.value = withDelay(800, withTiming(1, { duration: 400 }));

    // Buttons
    buttonsTranslateY.value = withDelay(1000, withSpring(0, { damping: 8 }));
    buttonsOpacity.value = withDelay(1000, withTiming(1, { duration: 400 }));
  }, []);

  const overlayStyle = useAnimatedStyle(() => ({
    opacity: overlayOpacity.value,
  }));

  const shakeStyle = useAnimatedStyle(() => ({
    transform: [{ translateX: shakeX.value }],
  }));

  const titleStyle = useAnimatedStyle(() => ({
    opacity: titleOpacity.value,
    transform: [{ scale: titleScale.value }],
  }));

  const iconStyle = useAnimatedStyle(() => ({
    transform: [{ scale: iconScale.value }],
  }));

  const contentStyle = useAnimatedStyle(() => ({
    opacity: contentOpacity.value,
  }));

  const buttonsStyle = useAnimatedStyle(() => ({
    opacity: buttonsOpacity.value,
    transform: [{ translateY: buttonsTranslateY.value }],
  }));

  return (
    <Animated.View style={[styles.outerContainer, shakeStyle]}>
      <LinearGradient
        colors={GRADIENTS.gameOver as [string, string, string]}
        style={styles.container}
      >
        <Animated.View style={[StyleSheet.absoluteFill, styles.overlay, overlayStyle]} />

        {/* Sad icon */}
        <Animated.View style={[styles.iconContainer, iconStyle]}>
          <Text style={styles.iconText}>😔</Text>
        </Animated.View>

        {/* Title */}
        <Animated.View style={[styles.titleContainer, titleStyle]}>
          <Text style={styles.titleText}>GAME OVER</Text>
        </Animated.View>

        {/* Encouragement */}
        <Animated.View style={[styles.encourageContainer, contentStyle]}>
          <Text style={styles.encourageText}>{encouragement}</Text>
        </Animated.View>

        {/* Stats */}
        <Animated.View style={[styles.statsContainer, contentStyle]}>
          <View style={styles.statBox}>
            <Text style={styles.statLabel}>SCORE</Text>
            <Text style={styles.statValue}>{formatScore(score)}</Text>
          </View>
          <View style={styles.statDivider} />
          <View style={styles.statBox}>
            <Text style={styles.statLabel}>HIGHEST</Text>
            <Text style={styles.statValue}>{highestTile}</Text>
          </View>
          <View style={styles.statDivider} />
          <View style={styles.statBox}>
            <Text style={styles.statLabel}>GOAL</Text>
            <Text style={[styles.statValue, { color: COLORS.danger }]}>{goalTile}</Text>
          </View>
        </Animated.View>

        {/* Progress indicator */}
        <Animated.View style={[styles.progressContainer, contentStyle]}>
          <Text style={styles.progressLabel}>Progress to goal</Text>
          <View style={styles.progressBarBg}>
            <View
              style={[
                styles.progressBarFill,
                {
                  width: `${Math.min(100, (highestTile / goalTile) * 100)}%`,
                },
              ]}
            />
          </View>
          <Text style={styles.progressPercent}>
            {Math.min(100, Math.round((highestTile / goalTile) * 100))}%
          </Text>
        </Animated.View>

        {/* Buttons */}
        <Animated.View style={[styles.buttonsContainer, buttonsStyle]}>
          <TouchableOpacity
            style={styles.retryButton}
            onPress={() => navigation.replace('Game', { levelId })}
            activeOpacity={0.8}
          >
            <LinearGradient
              colors={['#e74c3c', '#c0392b'] as [string, string]}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}
              style={styles.retryGradient}
            >
              <Text style={styles.retryText}>🔄  TRY AGAIN</Text>
            </LinearGradient>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.homeButton}
            onPress={() => navigation.navigate('Home')}
            activeOpacity={0.8}
          >
            <Text style={styles.homeButtonText}>🏠  HOME</Text>
          </TouchableOpacity>
        </Animated.View>
      </LinearGradient>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  outerContainer: {
    flex: 1,
  },
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 30,
  },
  overlay: {
    backgroundColor: 'rgba(231, 76, 60, 0.05)',
  },
  iconContainer: {
    marginBottom: 16,
  },
  iconText: {
    fontSize: 80,
  },
  titleContainer: {
    marginBottom: 12,
  },
  titleText: {
    color: COLORS.danger,
    fontSize: 40,
    fontWeight: '900',
    letterSpacing: 6,
    textShadowColor: 'rgba(231, 76, 60, 0.5)',
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 15,
  },
  encourageContainer: {
    marginBottom: 24,
  },
  encourageText: {
    color: COLORS.textSecondary,
    fontSize: 16,
    fontWeight: '600',
    textAlign: 'center',
  },
  statsContainer: {
    flexDirection: 'row',
    backgroundColor: COLORS.bgCard,
    borderRadius: 16,
    padding: 16,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: COLORS.gridBorder,
  },
  statBox: {
    flex: 1,
    alignItems: 'center',
  },
  statLabel: {
    color: COLORS.textMuted,
    fontSize: 10,
    fontWeight: '700',
    letterSpacing: 1,
    marginBottom: 4,
  },
  statValue: {
    color: COLORS.textPrimary,
    fontSize: 22,
    fontWeight: '900',
  },
  statDivider: {
    width: 1,
    backgroundColor: COLORS.gridBorder,
    marginHorizontal: 8,
  },
  progressContainer: {
    width: '100%',
    backgroundColor: COLORS.bgCard,
    borderRadius: 12,
    padding: 12,
    marginBottom: 28,
    borderWidth: 1,
    borderColor: COLORS.gridBorder,
    alignItems: 'center',
  },
  progressLabel: {
    color: COLORS.textMuted,
    fontSize: 11,
    fontWeight: '600',
    marginBottom: 8,
  },
  progressBarBg: {
    width: '100%',
    height: 8,
    backgroundColor: COLORS.gridBorder,
    borderRadius: 4,
    overflow: 'hidden',
  },
  progressBarFill: {
    height: '100%',
    backgroundColor: COLORS.neonOrange,
    borderRadius: 4,
  },
  progressPercent: {
    color: COLORS.neonOrange,
    fontSize: 14,
    fontWeight: '800',
    marginTop: 6,
  },
  buttonsContainer: {
    width: '100%',
  },
  retryButton: {
    borderRadius: 18,
    overflow: 'hidden',
    marginBottom: 12,
    elevation: 6,
  },
  retryGradient: {
    paddingVertical: 16,
    alignItems: 'center',
    borderRadius: 18,
  },
  retryText: {
    color: COLORS.textPrimary,
    fontSize: 18,
    fontWeight: '900',
    letterSpacing: 3,
  },
  homeButton: {
    backgroundColor: COLORS.bgCard,
    borderRadius: 14,
    paddingVertical: 14,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: COLORS.gridBorder,
  },
  homeButtonText: {
    color: COLORS.textSecondary,
    fontSize: 15,
    fontWeight: '700',
  },
});
