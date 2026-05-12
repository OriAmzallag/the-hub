/**
 * PerkClaimRow Component
 * Active perk claim card showing delivery deadline.
 *
 * Reference spec:
 * - Card: padding 14/16, radius 14, surface bg, 1px border
 * - Monogram tile: 40x40, radius 12, surfaceAlt bg, borderStrong border
 * - Title: display 15 weight 700, ink
 * - Deadline: mono 9.5 / 0.15em, accent
 * - Chevron: size 16, accent
 */

import React, { memo } from 'react';
import { View, Text, Pressable, StyleSheet } from 'react-native';
import { ChevronRight } from 'lucide-react-native';
import { colors, typography, borderRadius } from '@/constants/theme';
import type { PerkClaim } from '@/types/influencerDashboard';

interface PerkClaimRowProps {
  claim: PerkClaim;
  onPress?: () => void;
}

function PerkClaimRowComponent({ claim, onPress }: PerkClaimRowProps) {
  return (
    <Pressable
      style={styles.container}
      onPress={onPress}
      accessibilityRole="button"
      accessibilityLabel={`${claim.title}, ${claim.deadline}`}
    >
      {/* Business monogram */}
      <View style={styles.monogramTile}>
        <Text style={styles.monogramText}>{claim.monogram}</Text>
      </View>

      {/* Title + deadline */}
      <View style={styles.content}>
        <Text style={styles.title} numberOfLines={1}>
          {claim.title}
        </Text>
        <Text style={styles.deadline}>{claim.deadline}</Text>
      </View>

      {/* Chevron */}
      <ChevronRight size={16} strokeWidth={2.2} color={colors.accent} />
    </Pressable>
  );
}

export const PerkClaimRow = memo(PerkClaimRowComponent);

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: borderRadius.xl,
    padding: 14,
    paddingHorizontal: 16,
    gap: 12,
  },

  // Monogram
  monogramTile: {
    width: 40,
    height: 40,
    borderRadius: borderRadius.lg,
    backgroundColor: colors.surfaceAlt,
    borderWidth: 1,
    borderColor: colors.borderStrong,
    alignItems: 'center',
    justifyContent: 'center',
  },
  monogramText: {
    ...typography.rowTitle,
    color: colors.ink,
  },

  // Content
  content: {
    flex: 1,
    minWidth: 0,
  },
  title: {
    ...typography.rowTitle,
    color: colors.ink,
    marginBottom: 4,
  },
  deadline: {
    ...typography.monoStatus,
    color: colors.accent,
  },
});
