// X2 Global Blocks — Block Tile Component
import React, { useEffect } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
  withSequence,
  withTiming,
  withDelay,
} from 'react-native-reanimated';
import { getBlockColor } from '../constants/colors';

interface BlockTileProps {
  value: number;
  size: number;
  isNew?: boolean;
  isMerging?: boolean;
  delay?: number;
}

export const BlockTile: React.FC<BlockTileProps> = ({
  value,
  size,
  isNew = false,
  isMerging = false,
  delay = 0,
}) => {
  const scale = useSharedValue(isNew ? 0.3 : 1);
  const opacity = useSharedValue(isNew ? 0 : 1);
  const glow = useSharedValue(0);

  const colors = getBlockColor(value);

  useEffect(() => {
    if (isNew) {
      scale.value = withDelay(
        delay,
        withSpring(1, { damping: 8, stiffness: 200 })
      );
      opacity.value = withDelay(delay, withTiming(1, { duration: 150 }));
    }

    if (isMerging) {
      scale.value = withSequence(
        withTiming(1.3, { duration: 100 }),
        withSpring(1, { damping: 6, stiffness: 250 })
      );
      glow.value = withSequence(
        withTiming(1, { duration: 100 }),
        withTiming(0, { duration: 300 })
      );
    }
  }, [isNew, isMerging]);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
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
