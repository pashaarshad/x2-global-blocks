// X2 Global Blocks — Star Rating Component
import React, { useEffect } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withDelay,
  withSpring,
  withSequence,
  withTiming,
} from 'react-native-reanimated';

interface StarRatingProps {
  stars: number; // 0-3
  size?: number;
  animated?: boolean;
}

const AnimatedStar: React.FC<{
  filled: boolean;
  index: number;
  size: number;
  animated: boolean;
}> = ({ filled, index, size, animated }) => {
  const scale = useSharedValue(animated ? 0 : 1);
  const rotation = useSharedValue(animated ? -30 : 0);

  useEffect(() => {
    if (animated && filled) {
      scale.value = withDelay(
        index * 300 + 200,
        withSequence(
          withSpring(1.4, { damping: 5, stiffness: 300 }),
          withSpring(1, { damping: 8 })
        )
      );
      rotation.value = withDelay(
        index * 300 + 200,
        withSequence(
          withTiming(15, { duration: 100 }),
          withSpring(0, { damping: 6 })
        )
      );
    }
  }, [animated, filled]);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [
      { scale: scale.value },
      { rotate: `${rotation.value}deg` },
    ],
  }));

  return (
    <Animated.View style={[styles.starWrapper, animatedStyle]}>
      <Text style={[styles.star, { fontSize: size }]}>
        {filled ? '⭐' : '☆'}
      </Text>
    </Animated.View>
  );
};

export const StarRating: React.FC<StarRatingProps> = ({
  stars,
  size = 32,
  animated = false,
}) => {
  return (
    <View style={styles.container}>
      {[0, 1, 2].map((idx) => (
        <AnimatedStar
          key={idx}
          filled={idx < stars}
          index={idx}
          size={size}
          animated={animated}
        />
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  starWrapper: {
    marginHorizontal: 4,
  },
  star: {
    textShadowColor: 'rgba(255, 215, 0, 0.5)',
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 6,
  },
});
