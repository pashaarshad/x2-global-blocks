// X2 Global Blocks — Splash Screen
// AP Programming Tech branded intro with loading animation
import React, { useEffect } from 'react';
import { StyleSheet, Text, View, Dimensions } from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
  withTiming,
  withDelay,
  withSequence,
  Easing,
} from 'react-native-reanimated';
import { LinearGradient } from 'expo-linear-gradient';
import { COLORS, GRADIENTS } from '../constants/colors';
import { useProgressStore } from '../store/progressStore';

const { width, height } = Dimensions.get('window');

interface SplashScreenProps {
  navigation: any;
}

// Floating block particle
const FloatingBlock: React.FC<{ value: number; startX: number; delay: number }> = ({
  value,
  startX,
  delay,
}) => {
  const translateY = useSharedValue(height * 0.8);
  const opacity = useSharedValue(0);

  useEffect(() => {
    translateY.value = withDelay(
      delay,
      withTiming(-100, { duration: 6000, easing: Easing.inOut(Easing.ease) })
    );
    opacity.value = withDelay(delay, withSequence(
      withTiming(0.2, { duration: 800 }),
      withTiming(0.15, { duration: 3500 }),
      withTiming(0, { duration: 1700 })
    ));
  }, []);

  const style = useAnimatedStyle(() => ({
    transform: [
      { translateY: translateY.value },
    ],
    opacity: opacity.value,
    position: 'absolute',
    left: startX,
  }));

  const colors: Record<number, string> = {
    2: '#e74c3c',
    4: '#2ecc71',
    8: '#f39c12',
    16: '#3498db',
    32: '#9b59b6',
    64: '#e84393',
  };

  return (
    <Animated.View
      style={[
        style,
        {
          width: 32,
          height: 32,
          borderRadius: 7,
          backgroundColor: colors[value] || '#e74c3c',
          justifyContent: 'center',
          alignItems: 'center',
        },
      ]}
    >
      <Text style={{ color: 'rgba(255,255,255,0.7)', fontWeight: '900', fontSize: 12 }}>
        {value}
      </Text>
    </Animated.View>
  );
};

export const SplashScreen: React.FC<SplashScreenProps> = ({ navigation }) => {
  const loadProgress = useProgressStore((s) => s.loadProgress);

  // Animation values
  const studioScale = useSharedValue(0);
  const studioOpacity = useSharedValue(0);
  const presentsOpacity = useSharedValue(0);
  const titleScale = useSharedValue(0.3);
  const titleOpacity = useSharedValue(0);
  const taglineOpacity = useSharedValue(0);
  const loadingWidth = useSharedValue(0);
  const glowOpacity = useSharedValue(0);

  useEffect(() => {
    // Load saved progress
    loadProgress();

    // Sequence of animations
    // 1. Studio name appears
    studioScale.value = withDelay(300, withSpring(1, { damping: 8, stiffness: 120 }));
    studioOpacity.value = withDelay(300, withTiming(1, { duration: 600 }));

    // 2. "Presents" fades in
    presentsOpacity.value = withDelay(1200, withTiming(1, { duration: 500 }));

    // 3. Game title scales up
    titleScale.value = withDelay(2000, withSpring(1, { damping: 6, stiffness: 100 }));
    titleOpacity.value = withDelay(2000, withTiming(1, { duration: 500 }));

    // 4. Glow effect
    glowOpacity.value = withDelay(2500, withSequence(
      withTiming(1, { duration: 300 }),
      withTiming(0.5, { duration: 500 }),
      withTiming(1, { duration: 500 }),
    ));

    // 5. Tagline
    taglineOpacity.value = withDelay(2800, withTiming(1, { duration: 500 }));

    // 6. Loading bar
    loadingWidth.value = withDelay(1000, withTiming(100, { duration: 3500, easing: Easing.out(Easing.quad) }));

    // Navigate after splash
    const timer = setTimeout(() => {
      navigation.replace('Home');
    }, 4500);

    return () => clearTimeout(timer);
  }, []);

  const studioStyle = useAnimatedStyle(() => ({
    transform: [{ scale: studioScale.value }],
    opacity: studioOpacity.value,
  }));

  const presentsStyle = useAnimatedStyle(() => ({
    opacity: presentsOpacity.value,
  }));

  const titleStyle = useAnimatedStyle(() => ({
    transform: [{ scale: titleScale.value }],
    opacity: titleOpacity.value,
  }));

  const taglineStyle = useAnimatedStyle(() => ({
    opacity: taglineOpacity.value,
  }));

  const loadingStyle = useAnimatedStyle(() => ({
    width: `${loadingWidth.value}%`,
  }));

  const glowStyle = useAnimatedStyle(() => ({
    opacity: glowOpacity.value,
  }));

  // Floating particle positions — subtle, just 3 particles
  const particles = [
    { value: 2, x: width * 0.12, delay: 500 },
    { value: 8, x: width * 0.5, delay: 1000 },
    { value: 32, x: width * 0.82, delay: 1500 },
  ];

  return (
    <LinearGradient
      colors={GRADIENTS.splash as [string, string]}
      style={styles.container}
    >
      {/* Floating particles */}
      {particles.map((p, i) => (
        <FloatingBlock key={i} value={p.value} startX={p.x} delay={p.delay} />
      ))}

      {/* Center content */}
      <View style={styles.content}>
        {/* Studio name */}
        <Animated.View style={[styles.studioContainer, studioStyle]}>
          <Text style={styles.studioName}>AP Programming Tech</Text>
        </Animated.View>

        {/* Presents */}
        <Animated.Text style={[styles.presents, presentsStyle]}>
          PRESENTS
        </Animated.Text>

        {/* Game title */}
        <Animated.View style={[styles.titleContainer, titleStyle]}>
          <Animated.View style={[styles.titleGlow, glowStyle]} />
          <Text style={styles.titleX2}>X2</Text>
          <Text style={styles.titleGlobal}>GLOBAL BLOCKS</Text>
        </Animated.View>

        {/* Tagline */}
        <Animated.Text style={[styles.tagline, taglineStyle]}>
          ✨ Reach New Goals ✨
        </Animated.Text>
      </View>

      {/* Loading bar */}
      <View style={styles.loadingContainer}>
        <View style={styles.loadingBg}>
          <Animated.View style={[styles.loadingFill, loadingStyle]}>
            <LinearGradient
              colors={['#4dc9f6', '#9b59f5'] as [string, string]}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}
              style={StyleSheet.absoluteFill}
            />
          </Animated.View>
        </View>
        <Text style={styles.loadingText}>Loading...</Text>
      </View>
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  content: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  studioContainer: {
    marginBottom: 12,
  },
  studioName: {
    color: COLORS.neonBlue,
    fontSize: 22,
    fontWeight: '700',
    letterSpacing: 2,
    textShadowColor: 'rgba(77, 201, 246, 0.5)',
    textShadowOffset: { width: 0, height: 0 },
    textShadowRadius: 15,
  },
  presents: {
    color: COLORS.textMuted,
    fontSize: 12,
    fontWeight: '600',
    letterSpacing: 4,
    marginBottom: 30,
  },
  titleContainer: {
    alignItems: 'center',
    marginBottom: 16,
  },
  titleGlow: {
    position: 'absolute',
    width: 200,
    height: 200,
    borderRadius: 100,
    backgroundColor: 'rgba(77, 201, 246, 0.15)',
    top: -60,
  },
  titleX2: {
    color: COLORS.gold,
    fontSize: 72,
    fontWeight: '900',
    letterSpacing: 4,
    textShadowColor: 'rgba(255, 215, 0, 0.6)',
    textShadowOffset: { width: 0, height: 0 },
    textShadowRadius: 20,
  },
  titleGlobal: {
    color: COLORS.textPrimary,
    fontSize: 28,
    fontWeight: '800',
    letterSpacing: 6,
    marginTop: -8,
    textShadowColor: 'rgba(255, 255, 255, 0.3)',
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 8,
  },
  tagline: {
    color: COLORS.neonGreen,
    fontSize: 16,
    fontWeight: '600',
    letterSpacing: 2,
    marginTop: 8,
  },
  loadingContainer: {
    position: 'absolute',
    bottom: 80,
    width: width * 0.6,
    alignItems: 'center',
  },
  loadingBg: {
    width: '100%',
    height: 4,
    backgroundColor: COLORS.gridBorder,
    borderRadius: 2,
    overflow: 'hidden',
  },
  loadingFill: {
    height: '100%',
    borderRadius: 2,
    overflow: 'hidden',
  },
  loadingText: {
    color: COLORS.textMuted,
    fontSize: 12,
    marginTop: 8,
    letterSpacing: 1,
  },
});
