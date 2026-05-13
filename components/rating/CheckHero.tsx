/**
 * CheckHero Component
 * Animated check circle for confirmation screens.
 */

import React, { useEffect } from 'react';
import { StyleSheet } from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
  withDelay,
} from 'react-native-reanimated';
import { Check } from 'lucide-react-native';
import { colors } from '@/constants/theme';

interface CheckHeroProps {
  size: number;
  delay?: number;
}

const SPRING_CONFIG = {
  damping: 12,
  stiffness: 180,
  overshootClamping: false,
};

export function CheckHero({ size, delay = 200 }: CheckHeroProps) {
  const scale = useSharedValue(0);

  useEffect(() => {
    scale.value = withDelay(delay, withSpring(1, SPRING_CONFIG));
  }, [delay, scale]);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  const iconSize = Math.round(size * 0.35);

  return (
    <Animated.View
      style={[
        styles.circle,
        {
          width: size,
          height: size,
          borderRadius: size / 2,
        },
        animatedStyle,
      ]}
    >
      <Check size={iconSize} strokeWidth={3} color={colors.bg} />
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  circle: {
    backgroundColor: colors.accent,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: colors.accent,
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.3,
    shadowRadius: 24,
    elevation: 8,
  },
});
