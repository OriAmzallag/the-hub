/**
 * MiniStat Component
 * Single stat tile with value and label.
 */

import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Star } from 'lucide-react-native';
import { colors, typography } from '@/constants/theme';

interface MiniStatProps {
  value: string;
  label: string;
  hasAccentStar?: boolean;
}

export function MiniStat({ value, label, hasAccentStar }: MiniStatProps) {
  return (
    <View style={styles.container}>
      <View style={styles.valueRow}>
        <Text style={styles.value}>{value}</Text>
        {hasAccentStar && (
          <Star
            size={14}
            color={colors.accent}
            fill={colors.accent}
            style={styles.star}
          />
        )}
      </View>
      <Text style={styles.label}>{label}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
  },
  valueRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  value: {
    ...typography.displayLg,
    color: colors.ink,
  },
  star: {
    marginLeft: 4,
  },
  label: {
    ...typography.monoStatLabel,
    color: colors.inkMuted,
    marginTop: 4,
  },
});
