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
  // Value first (top), label second (bottom). flexDirection / alignItems
  // are stated explicitly so the layout can't be ambiguous on rebuild.
  return (
    <View style={styles.tile}>
      <Text style={styles.tileValue}>{value}</Text>
      <Text style={styles.tileLabel}>{label}</Text>
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
    justifyContent: 'flex-start',
    alignItems: 'flex-start',
    paddingVertical: 14,
    paddingHorizontal: 14,
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: radii.card,
    minHeight: 84,
  },
  tileValue: {
    ...textScale.displayM,
    color: colors.ink,
    marginBottom: 6,
  },
  tileLabel: {
    ...typography.monoStatLabel,
    color: colors.inkMuted,
  },
});
