/**
 * PerkHero Component
 * 4:3 hero image with badge and value chip overlays.
 */

import React from 'react';
import { View, Text, Image, StyleSheet, Dimensions } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { colors, radii, typography } from '@/constants/theme';

interface PerkHeroProps {
  cover: string;
  value: number;
  badge: string | null;
}

const { width: SCREEN_WIDTH } = Dimensions.get('window');
const HERO_HEIGHT = SCREEN_WIDTH * 0.75; // 4:3 aspect ratio

export function PerkHero({ cover, value, badge }: PerkHeroProps) {
  const insets = useSafeAreaInsets();
  const badgeLabel = badge?.toUpperCase();

  return (
    <View style={styles.container}>
      <Image source={{ uri: cover }} style={styles.image} />

      {/* Top badge — offset by the safe-area inset + the back-button
          height so it sits below the top bar instead of behind it. */}
      {badgeLabel && (
        <View style={[styles.badge, { top: insets.top + 56 }]}>
          <Text style={styles.badgeText}>{badgeLabel}</Text>
        </View>
      )}

      {/* Bottom gradient scrim */}
      <LinearGradient
        colors={['transparent', 'rgba(0,0,0,0.6)']}
        style={styles.scrim}
      />

      {/* Value chip */}
      <View style={styles.valueChip}>
        <Text style={styles.valueText}>₪{value}</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: SCREEN_WIDTH,
    height: HERO_HEIGHT,
    position: 'relative',
  },
  image: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
  badge: {
    position: 'absolute',
    left: 16,
    paddingVertical: 6,
    paddingHorizontal: 10,
    backgroundColor: colors.bgOverlay85,
    borderWidth: 1,
    borderColor: colors.accentBorder,
    borderRadius: radii.pill,
  },
  badgeText: {
    ...typography.monoStatusWide,
    color: colors.accent,
  },
  scrim: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: 100,
  },
  valueChip: {
    position: 'absolute',
    bottom: 16,
    left: 16,
    paddingVertical: 8,
    paddingHorizontal: 14,
    backgroundColor: colors.bgOverlay85,
    borderRadius: radii.pill,
  },
  valueText: {
    fontFamily: 'InterTight-Bold',
    fontSize: 16,
    fontWeight: '700',
    letterSpacing: -0.4,
    color: colors.ink,
  },
});
