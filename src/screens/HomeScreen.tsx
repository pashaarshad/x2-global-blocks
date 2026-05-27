// X2 Global Blocks — Home Screen
// Main menu with animated background and neon arcade style
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
  withRepeat,
  withTiming,
  withDelay,
  withSpring,
  withSequence,
  Easing,
} from 'react-native-reanimated';
import { LinearGradient } from 'expo-linear-gradient';
import { COLORS, GRADIENTS } from '../constants/colors';
import { useProgressStore } from '../store/progressStore';

const { width, height } = Dimensions.get('window');

interface HomeScreenProps {
  navigation: any;
}

// Floating background block
const FloatingBgBlock: React.FC<{
  value: number;
  x: number;
  y: number;
  size: number;
  delay: number;
  color: string;
}> = ({ value, x, y, size, delay, color }) => {
  const translateY = useSharedValue(0);
  const opacity = useSharedValue(0.15);

  useEffect(() => {
    translateY.value = withDelay(
      delay,
      withRepeat(
        withSequence(
          withTiming(-30, { duration: 3000, easing: Easing.inOut(Easing.ease) }),
          withTiming(30, { duration: 3000, easing: Easing.inOut(Easing.ease) })
        ),
        -1,
        true
      )
    );
    opacity.value = withDelay(
      delay,
      withRepeat(
        withSequence(
          withTiming(0.25, { duration: 2000 }),
          withTiming(0.1, { duration: 2000 })
        ),
        -1,
        true
      )
    );
  }, []);

  const style = useAnimatedStyle(() => ({
    transform: [{ translateY: translateY.value }],
    opacity: opacity.value,
  }));

  return (
    <Animated.View
      style={[
        style,
        {
          position: 'absolute',
          left: x,
          top: y,
          width: size,
          height: size,
          borderRadius: size * 0.2,
          backgroundColor: color,
          justifyContent: 'center',
          alignItems: 'center',
        },
      ]}
    >
      <Text style={{ color: 'rgba(255,255,255,0.5)', fontWeight: '900', fontSize: size * 0.35 }}>
        {value}
      </Text>
    </Animated.View>
  );
};

export const HomeScreen: React.FC<HomeScreenProps> = ({ navigation }) => {
  const getNextLevel = useProgressStore((s) => s.getNextLevel);
  const globalHighScore = useProgressStore((s) => s.globalHighScore);

  // Entrance animations
  const titleScale = useSharedValue(0.8);
  const titleOpacity = useSharedValue(0);
  const btnPlayScale = useSharedValue(0);
  const btnLevelsScale = useSharedValue(0);
  const btnSettingsScale = useSharedValue(0);

  // Title glow pulse
  const glowPulse = useSharedValue(0.5);

  useEffect(() => {
    titleScale.value = withSpring(1, { damping: 8 });
    titleOpacity.value = withTiming(1, { duration: 500 });

    btnPlayScale.value = withDelay(300, withSpring(1, { damping: 8, stiffness: 150 }));
    btnLevelsScale.value = withDelay(500, withSpring(1, { damping: 8, stiffness: 150 }));
    btnSettingsScale.value = withDelay(700, withSpring(1, { damping: 8, stiffness: 150 }));

    glowPulse.value = withRepeat(
      withSequence(
        withTiming(1, { duration: 1500 }),
        withTiming(0.5, { duration: 1500 })
      ),
      -1,
      true
    );
  }, []);

  const titleStyle = useAnimatedStyle(() => ({
    transform: [{ scale: titleScale.value }],
    opacity: titleOpacity.value,
  }));

  const glowStyle = useAnimatedStyle(() => ({
    opacity: glowPulse.value,
  }));

  const playBtnStyle = useAnimatedStyle(() => ({
    transform: [{ scale: btnPlayScale.value }],
  }));

  const levelsBtnStyle = useAnimatedStyle(() => ({
    transform: [{ scale: btnLevelsScale.value }],
  }));

  const settingsBtnStyle = useAnimatedStyle(() => ({
    transform: [{ scale: btnSettingsScale.value }],
  }));

  const bgBlocks = [
    { value: 2, x: 30, y: 100, size: 44, delay: 0, color: '#e74c3c' },
    { value: 16, x: width - 90, y: height * 0.3, size: 40, delay: 600, color: '#3498db' },
    { value: 64, x: 50, y: height * 0.6, size: 38, delay: 300, color: '#e84393' },
    { value: 128, x: width - 80, y: height * 0.7, size: 42, delay: 900, color: '#e67e22' },
  ];

  return (
    <LinearGradient
      colors={GRADIENTS.home as [string, string, string]}
      style={styles.container}
    >
      {/* Floating background blocks */}
      {bgBlocks.map((b, i) => (
        <FloatingBgBlock key={i} {...b} />
      ))}

      {/* Title area */}
      <Animated.View style={[styles.titleContainer, titleStyle]}>
        <Animated.View style={[styles.titleGlow, glowStyle]} />
        <Text style={styles.titleX2}>X2</Text>
        <Text style={styles.titleGlobal}>GLOBAL BLOCKS</Text>
        <Text style={styles.tagline}>✨ Reach New Goals ✨</Text>
      </Animated.View>

      {/* High score */}
      {globalHighScore > 0 && (
        <View style={styles.highScoreContainer}>
          <Text style={styles.highScoreLabel}>HIGH SCORE</Text>
          <Text style={styles.highScoreValue}>{globalHighScore.toLocaleString()}</Text>
        </View>
      )}

      {/* Buttons */}
      <View style={styles.buttonContainer}>
        <Animated.View style={playBtnStyle}>
          <TouchableOpacity
            style={styles.playButton}
            onPress={() => {
              const nextLevel = getNextLevel();
              navigation.navigate('Game', { levelId: nextLevel });
            }}
            activeOpacity={0.8}
          >
            <LinearGradient
              colors={['#4dc9f6', '#9b59f5'] as [string, string]}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}
              style={styles.playButtonGradient}
            >
              <Text style={styles.playButtonText}>▶  PLAY</Text>
            </LinearGradient>
          </TouchableOpacity>
        </Animated.View>

        <View style={styles.smallButtonsRow}>
          <Animated.View style={[levelsBtnStyle, { flex: 1, marginRight: 8 }]}>
            <TouchableOpacity
              style={styles.smallButton}
              onPress={() => navigation.navigate('LevelSelect')}
              activeOpacity={0.8}
            >
              <Text style={styles.smallButtonIcon}>📋</Text>
              <Text style={styles.smallButtonText}>LEVELS</Text>
            </TouchableOpacity>
          </Animated.View>

          <Animated.View style={[settingsBtnStyle, { flex: 1, marginLeft: 8 }]}>
            <TouchableOpacity
              style={styles.smallButton}
              onPress={() => navigation.navigate('Settings')}
              activeOpacity={0.8}
            >
              <Text style={styles.smallButtonIcon}>⚙️</Text>
              <Text style={styles.smallButtonText}>SETTINGS</Text>
            </TouchableOpacity>
          </Animated.View>
        </View>
      </View>

      {/* Footer */}
      <View style={styles.footer}>
        <Text style={styles.footerText}>AP Programming Tech</Text>
        <Text style={styles.versionText}>v1.0.0</Text>
      </View>
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 30,
  },
  titleContainer: {
    alignItems: 'center',
    marginBottom: 30,
    marginTop: -20,
  },
  titleGlow: {
    position: 'absolute',
    width: 250,
    height: 250,
    borderRadius: 125,
    backgroundColor: 'rgba(77, 201, 246, 0.1)',
    top: -80,
  },
  titleX2: {
    color: COLORS.gold,
    fontSize: 80,
    fontWeight: '900',
    letterSpacing: 6,
    textShadowColor: 'rgba(255, 215, 0, 0.6)',
    textShadowOffset: { width: 0, height: 0 },
    textShadowRadius: 25,
  },
  titleGlobal: {
    color: COLORS.textPrimary,
    fontSize: 30,
    fontWeight: '800',
    letterSpacing: 8,
    marginTop: -10,
    textShadowColor: 'rgba(255, 255, 255, 0.2)',
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 10,
  },
  tagline: {
    color: COLORS.neonGreen,
    fontSize: 14,
    fontWeight: '600',
    letterSpacing: 2,
    marginTop: 12,
  },
  highScoreContainer: {
    backgroundColor: 'rgba(255, 215, 0, 0.1)',
    borderRadius: 16,
    paddingHorizontal: 24,
    paddingVertical: 8,
    borderWidth: 1,
    borderColor: 'rgba(255, 215, 0, 0.3)',
    marginBottom: 30,
    alignItems: 'center',
  },
  highScoreLabel: {
    color: COLORS.gold,
    fontSize: 10,
    fontWeight: '700',
    letterSpacing: 2,
  },
  highScoreValue: {
    color: COLORS.gold,
    fontSize: 22,
    fontWeight: '900',
  },
  buttonContainer: {
    width: '100%',
    alignItems: 'center',
    marginTop: 20,
    paddingHorizontal: 10,
  },
  playButton: {
    width: '100%',
    marginBottom: 16,
    borderRadius: 20,
    overflow: 'hidden',
    elevation: 8,
    shadowColor: COLORS.neonBlue,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.4,
    shadowRadius: 12,
  },
  playButtonGradient: {
    paddingVertical: 20,
    paddingHorizontal: 24,
    alignItems: 'center',
    borderRadius: 22,
  },
  playButtonText: {
    color: COLORS.textPrimary,
    fontSize: 24,
    fontWeight: '900',
    letterSpacing: 4,
  },
  smallButtonsRow: {
    flexDirection: 'row',
    width: '100%',
    marginTop: 4,
  },
  smallButton: {
    backgroundColor: COLORS.bgCard,
    borderRadius: 16,
    paddingVertical: 16,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: COLORS.gridBorder,
    elevation: 4,
  },
  smallButtonIcon: {
    fontSize: 24,
    marginBottom: 4,
  },
  smallButtonText: {
    color: COLORS.textPrimary,
    fontSize: 13,
    fontWeight: '700',
    letterSpacing: 1,
  },
  footer: {
    position: 'absolute',
    bottom: 30,
    alignItems: 'center',
  },
  footerText: {
    color: COLORS.textMuted,
    fontSize: 12,
    fontWeight: '500',
    letterSpacing: 1,
  },
  versionText: {
    color: COLORS.textMuted,
    fontSize: 10,
    marginTop: 2,
    opacity: 0.5,
  },
});
