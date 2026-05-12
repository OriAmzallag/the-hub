/**
 * InfluencerDealRow Component
 * Deal card showing business counterparty details.
 *
 * Reference spec:
 * - Card: padding 14/16, radius 14, surface bg, 1px border
 * - Monogram tile: 40x40, radius 12, surfaceAlt bg, borderStrong border
 * - Business name: display 15 weight 700, ink
 * - Status row: status label (accent if statusAccent, else inkMuted) + 3x3 dot + services
 * - Earnings: display 16 weight 700, ink
 * - Chevron: size 16, accent if statusAccent, else inkMuted
 */

import React, { memo } from 'react';
import { View, Text, Pressable, StyleSheet } from 'react-native';
import { ChevronRight } from 'lucide-react-native';
import { colors, typography, borderRadius } from '@/constants/theme';
import type { InfluencerDeal } from '@/types/influencerDashboard';

interface InfluencerDealRowProps {
  deal: InfluencerDeal;
  onPress?: () => void;
}

function InfluencerDealRowComponent({ deal, onPress }: InfluencerDealRowProps) {
  const statusColor = deal.statusAccent ? colors.accent : colors.inkMuted;
  const chevronColor = deal.statusAccent ? colors.accent : colors.inkMuted;

  return (
    <Pressable
      style={styles.container}
      onPress={onPress}
      accessibilityRole="button"
      accessibilityLabel={`Deal with ${deal.business.name}, ${deal.statusLabel}, ${deal.earnings} shekels`}
    >
      {/* Business monogram */}
      <View style={styles.monogramTile}>
        <Text style={styles.monogramText}>{deal.business.monogram}</Text>
      </View>

      {/* Business name + status */}
      <View style={styles.content}>
        <Text style={styles.name} numberOfLines={1}>
          {deal.business.name}
        </Text>
        <View style={styles.statusRow}>
          <Text style={[styles.status, { color: statusColor }]}>
            {deal.statusLabel}
          </Text>
          <View style={styles.dot} />
          <Text style={styles.services}>{deal.services}</Text>
        </View>
      </View>

      {/* Right side: earnings + chevron */}
      <View style={styles.rightSide}>
        <Text style={styles.earnings}>{'₪'}{deal.earnings}</Text>
        <ChevronRight size={16} strokeWidth={2.2} color={chevronColor} />
      </View>
    </Pressable>
  );
}

export const InfluencerDealRow = memo(InfluencerDealRowComponent);

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
  name: {
    ...typography.rowTitle,
    color: colors.ink,
    marginBottom: 4,
  },
  statusRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  status: {
    ...typography.monoStatus,
    // color is set dynamically
  },
  dot: {
    width: 3,
    height: 3,
    borderRadius: 1.5,
    backgroundColor: colors.inkSubtle,
  },
  services: {
    ...typography.monoStatus,
    color: colors.inkMuted,
  },

  // Right side
  rightSide: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  earnings: {
    ...typography.rowPrimary,
    color: colors.ink,
  },
});
