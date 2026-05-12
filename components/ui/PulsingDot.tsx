/**
 * PulsingDot Component
 * Animated status indicator with pulsing opacity effect.
 */

import React, { useEffect } from 'react';
import { StyleSheet, ViewStyle } from 'react-native';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withRepeat,
  withTiming,
  Easing,
} from 'react-native-reanimated';
import { colors, shadows } from '@/constants/theme';

interface PulsingDotProps {
  size?: number;
  color?: string;
  style?: ViewStyle;
}

export function PulsingDot({
  size = 8,
  color = colors.accent,
  style,
}: PulsingDotProps) {
  const opacity = useSharedValue(1);

  useEffect(() => {
    opacity.value = withRepeat(
      withTiming(0.4, {
        duration: 1000,
        easing: Easing.inOut(Easing.ease),
      }),
      -1, // infinite
      true // reverse (ping-pong)
    );
  }, [opacity]);

  const animatedStyle = useAnimatedStyle(() => ({
    opacity: opacity.value,
  }));

  return (
    <Animated.View
      style={[
        styles.dot,
        {
          width: size,
          height: size,
          borderRadius: size / 2,
          backgroundColor: color,
          borderWidth: 2,
          borderColor: colors.bg,
        },
        shadows.statusDotGlow,
        animatedStyle,
        style,
      ]}
    />
  );
}

const styles = StyleSheet.create({
  dot: {
    position: 'absolute',
  },
});
