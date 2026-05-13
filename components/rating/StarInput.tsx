/**
 * StarInput Component
 * Interactive 5-star rating input with spring animation.
 */

import React from 'react';
import { View, Pressable, StyleSheet } from 'react-native';
import Animated, {
  SharedValue,
  useAnimatedStyle,
  withSpring,
  withDelay,
  useSharedValue,
} from 'react-native-reanimated';
import { Star } from 'lucide-react-native';
import { colors } from '@/constants/theme';
import type { StarRating } from '@/types/rating';

interface StarInputProps {
  value: StarRating | 0;
  onChange: (stars: StarRating) => void;
  size?: number;
  disabled?: boolean;
}

interface AnimatedStarProps {
  index: number;
  isActive: boolean;
  scale: SharedValue<number>;
  size: number;
  disabled: boolean;
  onPress: () => void;
}

const STAR_COUNT = 5;
const DEFAULT_SIZE = 42;
const SPRING_CONFIG = {
  damping: 12,
  stiffness: 180,
  overshootClamping: false,
};

function AnimatedStar({
  index,
  isActive,
  scale,
  size,
  disabled,
  onPress,
}: AnimatedStarProps) {
  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  return (
    <Pressable
      onPress={onPress}
      disabled={disabled}
      accessibilityRole="button"
      accessibilityLabel={`${index + 1} star${index === 0 ? '' : 's'}`}
      accessibilityState={{ selected: isActive }}
    >
      <Animated.View style={animatedStyle}>
        <Star
          size={size}
          strokeWidth={1.5}
          color={isActive ? colors.accent : colors.inkSubtle}
          fill={isActive ? colors.accent : 'transparent'}
        />
      </Animated.View>
    </Pressable>
  );
}

export function StarInput({
  value,
  onChange,
  size = DEFAULT_SIZE,
  disabled = false,
}: StarInputProps) {
  // Scale values for each star
  const scales = [
    useSharedValue(1),
    useSharedValue(1),
    useSharedValue(1),
    useSharedValue(1),
    useSharedValue(1),
  ];

  const handleStarPress = (index: number) => {
    if (disabled) return;

    const newValue = (index + 1) as StarRating;
    onChange(newValue);

    // Animate the pressed star
    scales[index].value = 0.7;
    scales[index].value = withSpring(1, SPRING_CONFIG);

    // Cascade animation for previous stars
    for (let i = 0; i < index; i++) {
      scales[i].value = withDelay((index - i) * 30, withSpring(1, SPRING_CONFIG));
    }
  };

  return (
    <View style={styles.container}>
      {Array.from({ length: STAR_COUNT }).map((_, index) => (
        <AnimatedStar
          key={index}
          index={index}
          isActive={index < value}
          scale={scales[index]}
          size={size}
          disabled={disabled}
          onPress={() => handleStarPress(index)}
        />
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
  },
});
