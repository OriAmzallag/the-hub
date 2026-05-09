/**
 * SkeletonRow Component
 * Loading skeleton variant with shimmer animation.
 */

import React, { useEffect } from 'react';
import { View, StyleSheet, DimensionValue } from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withRepeat,
  withTiming,
  Easing,
  interpolate,
} from 'react-native-reanimated';
import { colors } from '@/constants/theme';

interface SkeletonRowProps {
  rowIndex: number;
}

const SHIMMER_COLORS = {
  base: colors.surface,
  mid: colors.surfaceAlt,
  light: '#34302a',
};

function ShimmerBlock({ width, height, borderRadius, style }: {
  width: DimensionValue;
  height: number;
  borderRadius: number;
  style?: object;
}) {
  const shimmerPosition = useSharedValue(0);

  useEffect(() => {
    shimmerPosition.value = withRepeat(
      withTiming(1, { duration: 1600, easing: Easing.linear }),
      -1,
      false
    );
  }, [shimmerPosition]);

  const animatedStyle = useAnimatedStyle(() => {
    const opacity = interpolate(
      shimmerPosition.value,
      [0, 0.3, 0.5, 0.7, 1],
      [0.6, 0.8, 1, 0.8, 0.6]
    );
    return { opacity };
  });

  return (
    <Animated.View
      style={[
        {
          width,
          height,
          borderRadius,
          backgroundColor: SHIMMER_COLORS.mid,
        },
        animatedStyle,
        style,
      ]}
    />
  );
}

export function SkeletonRow({ rowIndex }: SkeletonRowProps) {
  const headerWidth = rowIndex === 0 ? 200 : 140;
  const cardNameWidths: DimensionValue[] = ['70%', '55%', '80%'];

  return (
    <View style={styles.container}>
      {/* Header skeleton */}
      <View style={styles.header}>
        <ShimmerBlock width={headerWidth} height={22} borderRadius={6} />
        <ShimmerBlock width={50} height={12} borderRadius={4} />
      </View>

      {/* Cards skeleton */}
      <View style={styles.cardsContainer}>
        {[0, 1, 2].map((cardIndex) => (
          <View key={cardIndex} style={styles.card}>
            <ShimmerBlock
              width={168}
              height={210}
              borderRadius={14}
            />
            <ShimmerBlock
              width={cardNameWidths[cardIndex]}
              height={14}
              borderRadius={4}
              style={styles.nameBlock}
            />
          </View>
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginTop: 22,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    marginBottom: 12,
  },
  cardsContainer: {
    flexDirection: 'row',
    gap: 10,
    paddingHorizontal: 16,
    overflow: 'hidden',
  },
  card: {
    width: 168,
    gap: 10,
  },
  nameBlock: {
    marginLeft: 2,
  },
});
