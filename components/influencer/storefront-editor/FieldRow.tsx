/**
 * FieldRow Component
 * Surface card with mono label and value text.
 */

import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { colors, typography, recipes } from '@/constants/theme';

interface FieldRowProps {
  label: string;
  value: string;
  charCount?: { current: number; max: number };
  multiline?: boolean;
}

export function FieldRow({ label, value, charCount, multiline }: FieldRowProps) {
  return (
    <View style={styles.container}>
      <Text style={styles.label}>{label}</Text>
      {charCount && (
        <Text style={styles.charCount}>
          {charCount.current}/{charCount.max}
        </Text>
      )}
      <Text style={styles.value} numberOfLines={multiline ? 4 : 1}>
        {value}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    ...recipes.surfaceTile,
    paddingVertical: 14,
    paddingHorizontal: 16,
    position: 'relative',
  },
  label: {
    ...typography.monoTimestamp,
    color: colors.inkMuted,
    textTransform: 'uppercase',
  },
  charCount: {
    ...typography.monoTimestamp,
    color: colors.inkSubtle,
    position: 'absolute',
    top: 14,
    right: 16,
  },
  value: {
    ...typography.bodyPreview,
    color: colors.ink,
    marginTop: 6,
  },
});
