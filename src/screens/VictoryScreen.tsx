// X2 Global Blocks — Victory Screen
// Inspired by the golden trophy reference image
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
  Easing,
} from 'react-native-reanimated';
import { LinearGradient } from 'expo-linear-gradient';
import { COLORS, GRADIENTS } from '../constants/colors';
import { StarRating } from '../components/StarRating';
import { formatScore } from '../engine/scoreEngine';
import { getLevelConfig, getTotalLevels } from '../engine/levelConfig';

const { width, height } = Dimensions.get('window');

interface VictoryScreenProps {
  navigation: any;
  route: any;
}

// Confetti particle
const ConfettiParticle: React.FC<{
  x: number;
  delay: number;
  color: string;
  size: number;
}> = ({ x, delay, color, size }) => {
  const translateY = useSharedValue(-50);
  const translateX = useSharedValue(0);
  const rotation = useSharedValue(0);
  const opacity = useSharedValue(0);

  useEffect(() => {
    const xDrift = (Math.random() - 0.5) * 100;
    translateY.value = withDelay(
      delay,
      withTiming(height + 50, { duration: 3000, easing: Easing.in(Easing.quad) })
    );
    translateX.value = withDelay(
      delay,
      withTiming(xDrift, { duration: 3000 })
    );
    rotation.value = withDelay(
      delay,
      withTiming(Math.random() * 720, { duration: 3000 })
    );
    opacity.value = withDelay(delay, withSequence(
      withTiming(1, { duration: 200 }),
      withTiming(1, { duration: 2000 }),
      withTiming(0, { duration: 800 })
    ));
  }, []);

  const style = useAnimatedStyle(() => ({
    transform: [
      { translateY: translateY.value },
      { translateX: translateX.value },
      { rotate: `${rotation.value}deg` },
    ],
    opacity: opacity.value,
  }));

  return (
    <Animated.View
      style={[
        style,
        {
          position: 'absolute',
          left: x,
          top: 0,
          width: size,
          height: size * 0.6,
          backgroundColor: color,
          borderRadius: 2,
        },
      ]}
    />
  );
};

export const VictoryScreen: React.FC<VictoryScreenProps> = ({
  navigation,
  route,
}) => {
  const { levelId, score, stars, highestTile } = route.params;
  const nextLevelId = levelId + 1;
  const hasNextLevel = nextLevelId <= getTotalLevels();
  const currentLevel = getLevelConfig(levelId);

  // Animations
  const trophyScale = useSharedValue(0);
  const trophyRotation = useSharedValue(-15);
  const titleOpacity = useSharedValue(0);
  const titleScale = useSharedValue(0.5);
  const scoreOpacity = useSharedValue(0);
  const buttonsOpacity = useSharedValue(0);
  const buttonsTranslateY = useSharedValue(30);
  const raysRotation = useSharedValue(0);
  const bannerScale = useSharedValue(0);

  useEffect(() => {
    // Trophy entrance
    trophyScale.value = withDelay(300, withSpring(1, { damping: 5, stiffness: 100 }));
    trophyRotation.value = withDelay(300, withSequence(
      withSpring(10, { damping: 3 }),
      withSpring(0, { damping: 4 })
    ));

    // Title
    titleOpacity.value = withDelay(800, withTiming(1, { duration: 400 }));
    titleScale.value = withDelay(800, withSpring(1, { damping: 6 }));

    // Score
    scoreOpacity.value = withDelay(1200, withTiming(1, { duration: 400 }));

    // Buttons
    buttonsOpacity.value = withDelay(1800, withTiming(1, { duration: 400 }));
    buttonsTranslateY.value = withDelay(1800, withSpring(0, { damping: 8 }));

    // Rotating rays
    raysRotation.value = withRepeat(
      withTiming(360, { duration: 10000, easing: Easing.linear }),
      -1,
      false
    );

    // Banner
    bannerScale.value = withDelay(2200, withSpring(1, { damping: 8 }));
  }, []);

  const trophyStyle = useAnimatedStyle(() => ({
    transform: [
      { scale: trophyScale.value },
      { rotate: `${trophyRotation.value}deg` },
    ],
  }));

  const titleStyle = useAnimatedStyle(() => ({
    opacity: titleOpacity.value,
    transform: [{ scale: titleScale.value }],
  }));

  const scoreStyle = useAnimatedStyle(() => ({
    opacity: scoreOpacity.value,
  }));

  const buttonsStyle = useAnimatedStyle(() => ({
    opacity: buttonsOpacity.value,
    transform: [{ translateY: buttonsTranslateY.value }],
  }));

  const raysStyle = useAnimatedStyle(() => ({
    transform: [{ rotate: `${raysRotation.value}deg` }],
  }));

  const bannerStyle = useAnimatedStyle(() => ({
    transform: [{ scale: bannerScale.value }],
  }));

  // Generate confetti
  const confettiColors = ['#e74c3c', '#2ecc71', '#3498db', '#ffd700', '#e84393', '#9b59f5', '#f39c12'];
  const confetti = Array.from({ length: 30 }, (_, i) => ({
    x: Math.random() * width,
    delay: Math.random() * 1000 + 500,
    color: confettiColors[i % confettiColors.length],
    size: Math.random() * 8 + 6,
  }));

  return (
    <LinearGradient
      colors={GRADIENTS.victory as [string, string, string]}
      style={styles.container}
    >
      {/* Confetti */}
      {confetti.map((c, i) => (
        <ConfettiParticle key={i} {...c} />
      ))}

      {/* Rotating light rays */}
      <Animated.View style={[styles.raysContainer, raysStyle]}>
        {Array.from({ length: 12 }, (_, i) => (
          <View
            key={i}
            style={[
              styles.ray,
              {
                transform: [{ rotate: `${i * 30}deg` }],
              },
            ]}
          />
        ))}
      </Animated.View>

      {/* Title */}
      <Animated.View style={[styles.titleContainer, titleStyle]}>
        <Text style={styles.titleLine1}>
          {score > 0 ? 'NEW HIGH' : 'LEVEL'}
        </Text>
        <Text style={styles.titleLine2}>
          {score > 0 ? 'SCORE!' : 'COMPLETE!'}
        </Text>
      </Animated.View>

      {/* Trophy */}
      <Animated.View style={[styles.trophyContainer, trophyStyle]}>
        <Text style={styles.trophyEmoji}>🏆</Text>
      </Animated.View>

      {/* Stars */}
      <View style={styles.starsContainer}>
        <StarRating stars={stars} size={40} animated />
      </View>

      {/* Score display */}
      <Animated.View style={[styles.scoreContainer, scoreStyle]}>
        <Text style={styles.scoreLabel}>SCORE</Text>
        <Text style={styles.scoreValue}>{formatScore(score)}</Text>
        <Text style={styles.levelInfo}>
          Level {levelId} — {currentLevel?.name}
        </Text>
        <Text style={styles.highestTileText}>
          Highest Tile: {highestTile}
        </Text>
      </Animated.View>

      {/* Buttons */}
      <Animated.View style={[styles.buttonsContainer, buttonsStyle]}>
        {hasNextLevel && (
          <TouchableOpacity
            style={styles.nextLevelButton}
            onPress={() =>
              navigation.replace('Game', { levelId: nextLevelId })
            }
            activeOpacity={0.8}
          >
            <LinearGradient
              colors={['#2ecc71', '#27ae60'] as [string, string]}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}
              style={styles.nextLevelGradient}
            >
              <Text style={styles.nextLevelText}>NEXT LEVEL →</Text>
            </LinearGradient>
          </TouchableOpacity>
        )}

        <View style={styles.secondaryButtons}>
          <TouchableOpacity
            style={styles.secondaryButton}
            onPress={() => navigation.replace('Game', { levelId })}
            activeOpacity={0.8}
          >
            <Text style={styles.secondaryButtonText}>🔄 REPLAY</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.secondaryButton}
            onPress={() => navigation.navigate('Home')}
            activeOpacity={0.8}
          >
            <Text style={styles.secondaryButtonText}>🏠 HOME</Text>
          </TouchableOpacity>
        </View>
      </Animated.View>

      {/* Reach New Goals banner */}
      <Animated.View style={[styles.bannerContainer, bannerStyle]}>
        <LinearGradient
          colors={['#1a1a4e', '#2d1b69'] as [string, string]}
          style={styles.banner}
        >
          <Text style={styles.bannerReach}>REACH</Text>
          <Text style={styles.bannerGoals}>NEW GOALS</Text>
        </LinearGradient>
      </Animated.View>
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  raysContainer: {
    position: 'absolute',
    width: 500,
    height: 500,
    justifyContent: 'center',
    alignItems: 'center',
  },
  ray: {
    position: 'absolute',
    width: 3,
    height: 250,
    backgroundColor: 'rgba(255, 215, 0, 0.08)',
    borderRadius: 2,
  },
  titleContainer: {
    alignItems: 'center',
    marginTop: -20,
    marginBottom: 10,
  },
  titleLine1: {
    color: COLORS.gold,
    fontSize: 36,
    fontWeight: '900',
    letterSpacing: 4,
    textShadowColor: 'rgba(255, 215, 0, 0.5)',
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 15,
  },
  titleLine2: {
    color: COLORS.neonGreen,
    fontSize: 40,
    fontWeight: '900',
    letterSpacing: 4,
    marginTop: -4,
    textShadowColor: 'rgba(46, 204, 113, 0.5)',
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 15,
  },
  trophyContainer: {
    marginBottom: 10,
  },
  trophyEmoji: {
    fontSize: 100,
    textShadowColor: 'rgba(255, 215, 0, 0.5)',
    textShadowOffset: { width: 0, height: 4 },
    textShadowRadius: 20,
  },
  starsContainer: {
    marginBottom: 16,
  },
  scoreContainer: {
    alignItems: 'center',
    marginBottom: 24,
    backgroundColor: 'rgba(30, 34, 85, 0.7)',
    borderRadius: 16,
    paddingHorizontal: 32,
    paddingVertical: 12,
    borderWidth: 1,
    borderColor: COLORS.gridBorder,
  },
  scoreLabel: {
    color: COLORS.textMuted,
    fontSize: 12,
    fontWeight: '700',
    letterSpacing: 2,
  },
  scoreValue: {
    color: COLORS.gold,
    fontSize: 36,
    fontWeight: '900',
  },
  levelInfo: {
    color: COLORS.textSecondary,
    fontSize: 12,
    fontWeight: '500',
    marginTop: 4,
  },
  highestTileText: {
    color: COLORS.neonBlue,
    fontSize: 12,
    fontWeight: '600',
    marginTop: 2,
  },
  buttonsContainer: {
    width: width * 0.75,
    alignItems: 'center',
  },
  nextLevelButton: {
    width: '100%',
    borderRadius: 18,
    overflow: 'hidden',
    marginBottom: 12,
    elevation: 6,
  },
  nextLevelGradient: {
    paddingVertical: 16,
    alignItems: 'center',
    borderRadius: 18,
  },
  nextLevelText: {
    color: COLORS.textPrimary,
    fontSize: 18,
    fontWeight: '900',
    letterSpacing: 3,
  },
  secondaryButtons: {
    flexDirection: 'row',
    width: '100%',
    gap: 10,
  },
  secondaryButton: {
    flex: 1,
    backgroundColor: COLORS.bgCard,
    borderRadius: 14,
    paddingVertical: 14,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: COLORS.gridBorder,
  },
  secondaryButtonText: {
    color: COLORS.textSecondary,
    fontSize: 14,
    fontWeight: '700',
  },
  bannerContainer: {
    position: 'absolute',
    bottom: 30,
    width: width * 0.85,
  },
  banner: {
    borderRadius: 16,
    paddingVertical: 14,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: COLORS.gridBorder,
  },
  bannerReach: {
    color: COLORS.neonGreen,
    fontSize: 22,
    fontWeight: '900',
    letterSpacing: 3,
  },
  bannerGoals: {
    color: COLORS.textPrimary,
    fontSize: 18,
    fontWeight: '700',
    letterSpacing: 2,
    marginTop: -2,
  },
});
