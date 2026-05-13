/**
 * StarInput Component
 * Interactive 5-star rating input with spring animation.
 */

import React from 'react';
import { View, Pressable, StyleSheet } from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
  withDelay,
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

const STAR_COUNT = 5;
const DEFAULT_SIZE = 42;
const SPRING_CONFIG = {
  damping: 12,
  stiffness: 180,
  overshootClamping: false,
};

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
      {Array.from({ length: STAR_COUNT }).map((_, index) => {
        const isActive = index < value;

        const animatedStyle = useAnimatedStyle(() => ({
          transform: [{ scale: scales[index].value }],
        }));

        return (
          <Pressable
            key={index}
            onPress={() => handleStarPress(index)}
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
      })}
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
