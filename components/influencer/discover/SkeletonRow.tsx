/**
 * SkeletonRow Component
 * Loading skeleton for perk rows with shimmer animation.
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
import { colors, radii } from '@/constants/theme';

interface SkeletonRowProps {
  rowIndex: number;
}

const SHIMMER_COLORS = {
  base: colors.surface,
  mid: colors.surfaceAlt,
  light: '#34302a',
};

function ShimmerBlock({
  width,
  height,
  borderRadius,
  style,
}: {
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
  const cardNameWidths: DimensionValue[] = ['70%', '55%'];
  const cardActionWidths: DimensionValue[] = ['40%', '30%'];

  return (
    <View style={styles.container}>
      {/* Header skeleton */}
      <View style={styles.header}>
        <ShimmerBlock width={headerWidth} height={22} borderRadius={6} />
        <ShimmerBlock width={50} height={12} borderRadius={4} />
      </View>

      {/* Cards skeleton - 2 visible cards */}
      <View style={styles.cardsContainer}>
        {[0, 1].map((cardIndex) => (
          <View key={cardIndex} style={styles.card}>
            <ShimmerBlock width={200} height={250} borderRadius={radii.card} />
            <ShimmerBlock
              width={cardNameWidths[cardIndex]}
              height={13}
              borderRadius={4}
              style={styles.nameBlock}
            />
            <ShimmerBlock
              width={cardActionWidths[cardIndex]}
              height={9}
              borderRadius={3}
              style={styles.actionBlock}
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
    width: 200,
    gap: 8,
  },
  nameBlock: {
    marginLeft: 2,
  },
  actionBlock: {
    marginLeft: 2,
  },
});
