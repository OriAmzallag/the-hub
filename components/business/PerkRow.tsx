/**
 * PerkRow Component
 * Single perk item with progress bar.
 */

import React from 'react';
import { View, Text, Pressable, StyleSheet } from 'react-native';
import { colors, typography, borderRadius } from '@/constants/theme';
import type { Perk } from '@/types/business';

interface PerkRowProps {
  perk: Perk;
  onPress?: () => void;
}

export function PerkRow({ perk, onPress }: PerkRowProps) {
  const progress = (perk.claimed / perk.max) * 100;

  return (
    <Pressable
      style={styles.container}
      onPress={onPress}
      accessibilityRole="button"
      accessibilityLabel={`${perk.title}, ${perk.claimed} of ${perk.max} claimed`}
    >
      {/* Top row: title, expiry, and claim count */}
      <View style={styles.topRow}>
        <View style={styles.leftContent}>
          <Text style={styles.title}>{perk.title}</Text>
          <Text style={styles.expires}>Expires {perk.expires}</Text>
        </View>

        <View style={styles.claimInfo}>
          <Text style={styles.claimCount}>
            {perk.claimed}/{perk.max}
          </Text>
          <Text style={styles.claimedLabel}>claimed</Text>
        </View>
      </View>

      {/* Progress bar */}
      <View style={styles.progressTrack}>
        <View style={[styles.progressFill, { width: `${progress}%` }]} />
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: borderRadius.xl,
    padding: 14,
    paddingHorizontal: 16,
  },
  topRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 12,
    marginBottom: 10,
  },
  leftContent: {
    flex: 1,
    minWidth: 0,
  },
  title: {
    ...typography.rowTitle,
    color: colors.ink,
    marginBottom: 4,
  },
  expires: {
    ...typography.monoStatus,
    color: colors.inkMuted,
  },
  claimInfo: {
    flexDirection: 'row',
    alignItems: 'baseline',
    gap: 5,
    flexShrink: 0,
  },
  claimCount: {
    ...typography.rowSecondary,
    color: colors.ink,
  },
  claimedLabel: {
    ...typography.monoStatus,
    color: colors.inkMuted,
  },
  progressTrack: {
    width: '100%',
    height: 4,
    backgroundColor: colors.surfaceAlt,
    borderRadius: 2,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    backgroundColor: colors.accent,
    borderRadius: 2,
  },
});
