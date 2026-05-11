/**
 * PerkStatsRow Component
 * 3-up bento grid showing slots, value, and expiration.
 */

import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { colors, radii, textScale, typography } from '@/constants/theme';

interface PerkStatsRowProps {
  slotsLeft: number;
  slotsTotal: number;
  value: number;
  expiresOn: string;
}

interface StatTileProps {
  value: string;
  label: string;
}

function StatTile({ value, label }: StatTileProps) {
  // Match the reference exactly: label pinned to the top edge, value
  // anchored to the bottom edge of the tile, with `space-between`
  // pushing them apart vertically. Padding + minHeight set the bounds.
  return (
    <View style={styles.tile}>
      <Text style={styles.tileLabel}>{label}</Text>
      <Text style={styles.tileValue}>{value}</Text>
    </View>
  );
}

export function PerkStatsRow({
  slotsLeft,
  slotsTotal,
  value,
  expiresOn,
}: PerkStatsRowProps) {
  return (
    <View style={styles.container}>
      <StatTile value={`${slotsLeft}/${slotsTotal}`} label="SLOTS" />
      <StatTile value={`₪${value}`} label="VALUE" />
      <StatTile value={expiresOn} label="EXPIRES" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    gap: 8,
    marginHorizontal: 16,
    marginTop: 20,
  },
  tile: {
    flex: 1,
    flexDirection: 'column',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    paddingVertical: 14,
    paddingHorizontal: 14,
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: radii.card,
    minHeight: 86,
  },
  tileLabel: {
    ...typography.monoStatLabel,
    color: colors.inkMuted,
  },
  tileValue: {
    ...textScale.displayM,
    color: colors.ink,
    marginTop: 6,
  },
});
