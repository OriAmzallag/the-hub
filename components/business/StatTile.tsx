/**
 * StatTile Component
 * Single stat card in the overview grid.
 *
 * Supports:
 * - Basic: label + value
 * - Starred: value with accent Star icon (for ratings)
 * - Hint: value with mono hint text below (for counts with unit labels)
 */

import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Star } from 'lucide-react-native';
import { colors, typography, borderRadius } from '@/constants/theme';

interface StatTileProps {
  label: string;
  value: string | number;
  /** Show an accent Star icon next to the value (for ratings) */
  starred?: boolean;
  /** Mono hint text below the value (e.g., "DEALS") */
  hint?: string;
}

export function StatTile({ label, value, starred, hint }: StatTileProps) {
  return (
    <View style={styles.container}>
      <Text style={styles.label}>{label}</Text>
      <View style={styles.valueContainer}>
        <View style={styles.valueRow}>
          <Text style={styles.value}>{value}</Text>
          {starred && (
            <Star
              size={11}
              fill={colors.accent}
              color={colors.accent}
              strokeWidth={0}
              style={styles.starIcon}
            />
          )}
        </View>
        {hint && <Text style={styles.hint}>{hint}</Text>}
      </View>
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
  valueContainer: {
    marginTop: 8,
  },
  valueRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  value: {
    ...typography.displayLg,
    color: colors.ink,
  },
  starIcon: {
    marginLeft: 4,
    marginBottom: 2, // Optical alignment with baseline
  },
  hint: {
    ...typography.monoStatus,
    color: colors.inkMuted,
    marginTop: 2,
  },
});
