// X2 Global Blocks — Block Tile Component
// With smooth drop animation like a train/car moving to position
import React, { useEffect } from 'react';
import { StyleSheet, Text } from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
  withSequence,
  withTiming,
  Easing,
} from 'react-native-reanimated';
import { getBlockColor } from '../constants/colors';

interface BlockTileProps {
  value: number;
  size: number;
  isNew?: boolean;
  isMerging?: boolean;
  delay?: number;
  dropDistance?: number; // How many rows to animate the fall
}

export const BlockTile: React.FC<BlockTileProps> = ({
  value,
  size,
  isNew = false,
  isMerging = false,
  delay = 0,
  dropDistance = 0,
}) => {
  const scale = useSharedValue(1);
  const opacity = useSharedValue(1);
  const glow = useSharedValue(0);
  const translateY = useSharedValue(isNew && dropDistance > 0 ? -(dropDistance * size) : 0);

  const colors = getBlockColor(value);

  useEffect(() => {
    if (isNew && dropDistance > 0) {
      // Smooth drop animation — block travels from top like a train
      translateY.value = -(dropDistance * size);
      translateY.value = withTiming(0, {
        duration: Math.min(400, 80 + dropDistance * 50),
        easing: Easing.bezier(0.25, 0.1, 0.25, 1),
      });
      // Small bounce on landing
      scale.value = withSequence(
        withTiming(1, { duration: Math.min(400, 80 + dropDistance * 50) }),
        withTiming(1.15, { duration: 80 }),
        withSpring(1, { damping: 8, stiffness: 300 })
      );
    } else if (isNew) {
      // Fallback: scale-in animation for blocks without drop distance
      scale.value = 0.3;
      opacity.value = 0;
      scale.value = withSpring(1, { damping: 8, stiffness: 200 });
      opacity.value = withTiming(1, { duration: 150 });
    }

    if (isMerging) {
      // Merge: pop + glow effect
      scale.value = withSequence(
        withTiming(1.3, { duration: 100 }),
        withSpring(1, { damping: 6, stiffness: 250 })
      );
      glow.value = withSequence(
        withTiming(1, { duration: 100 }),
        withTiming(0, { duration: 300 })
      );
    }
  }, [isNew, isMerging, dropDistance]);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [
      { translateY: translateY.value },
      { scale: scale.value },
    ],
    opacity: opacity.value,
  }));

  const glowStyle = useAnimatedStyle(() => ({
    shadowOpacity: glow.value * 0.8,
    shadowRadius: glow.value * 12,
  }));

  const fontSize = value >= 1000 ? size * 0.25 : value >= 100 ? size * 0.3 : size * 0.38;

  return (
    <Animated.View
      style={[
        styles.container,
        animatedStyle,
        glowStyle,
        {
          width: size - 4,
          height: size - 4,
          backgroundColor: colors.bg,
          borderRadius: size * 0.18,
          shadowColor: colors.glow,
        },
      ]}
    >
      <Text
        style={[
          styles.text,
          {
            fontSize,
            color: colors.text,
          },
        ]}
        numberOfLines={1}
        adjustsFontSizeToFit
      >
        {value}
      </Text>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  container: {
    justifyContent: 'center',
    alignItems: 'center',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0,
    shadowRadius: 0,
    elevation: 4,
    margin: 2,
  },
  text: {
    fontWeight: '900',
    textAlign: 'center',
    textShadowColor: 'rgba(0, 0, 0, 0.3)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 2,
  },
});
