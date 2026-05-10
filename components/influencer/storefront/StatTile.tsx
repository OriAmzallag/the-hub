/**
 * StatTile Component
 * Single stat card for the bento grid (Reach, Rating, Reviews).
 */

import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Star } from 'lucide-react-native';
import { colors } from '@/constants/theme';

interface StatTileProps {
  label: string;
  value: string | number;
  showStar?: boolean;
}

export function StatTile({ label, value, showStar = false }: StatTileProps) {
  return (
    <View style={styles.container}>
      <Text style={styles.label}>{label}</Text>
      <View style={styles.valueRow}>
        <Text style={styles.value}>{value}</Text>
        {showStar && (
          <Star
            size={14}
            fill={colors.accent}
            color={colors.accent}
            strokeWidth={0}
          />
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 14,
    padding: 14,
    minHeight: 86,
    justifyContent: 'space-between',
  },
  label: {
    fontFamily: 'JetBrainsMono-Medium',
    fontSize: 9.5,
    fontWeight: '500',
    letterSpacing: 1.425,
    lineHeight: 12.35,
    textTransform: 'uppercase',
    color: colors.inkMuted,
  },
  valueRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  value: {
    fontFamily: 'InterTight-ExtraBold',
    fontSize: 26,
    fontWeight: '800',
    letterSpacing: -1.04,
    color: colors.ink,
  },
});
