/**
 * StatTile Component
 * Single stat card in the overview grid.
 */

import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { colors, typography, borderRadius } from '@/constants/theme';

interface StatTileProps {
  label: string;
  value: string | number;
}

export function StatTile({ label, value }: StatTileProps) {
  return (
    <View style={styles.container}>
      <Text style={styles.label}>{label}</Text>
      <Text style={styles.value}>{value}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1, // Fill grid cell
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: borderRadius.xl,
    padding: 14,
    minHeight: 86,
    justifyContent: 'space-between',
  },
  label: {
    ...typography.monoStatLabel,
    color: colors.inkMuted,
  },
  value: {
    ...typography.displayLg,
    color: colors.ink,
    marginTop: 8,
  },
});
