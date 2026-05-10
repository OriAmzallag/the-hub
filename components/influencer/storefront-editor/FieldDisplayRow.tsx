/**
 * FieldDisplayRow Component
 * Preview row with label, value pills, and chevron.
 */

import React from 'react';
import { View, Text, Pressable, StyleSheet } from 'react-native';
import { ChevronRight } from 'lucide-react-native';
import { colors, typography, recipes } from '@/constants/theme';

interface FieldDisplayRowProps {
  label: string;
  values: string[];
  onPress: () => void;
}

export function FieldDisplayRow({ label, values, onPress }: FieldDisplayRowProps) {
  return (
    <Pressable
      style={styles.container}
      onPress={onPress}
      accessibilityRole="button"
      accessibilityLabel={`Edit ${label}`}
    >
      <Text style={styles.label}>{label}</Text>
      <View style={styles.valuesContainer}>
        {values.map((value, index) => (
          <View key={index} style={styles.valuePill}>
            <Text style={styles.valueText}>{value}</Text>
          </View>
        ))}
      </View>
      <ChevronRight size={18} color={colors.inkSubtle} />
    </Pressable>
  );
}

const styles = StyleSheet.create({
  container: {
    ...recipes.surfaceTile,
    paddingVertical: 14,
    paddingHorizontal: 16,
    flexDirection: 'row',
    alignItems: 'center',
  },
  pressed: {
    opacity: 0.7,
  },
  label: {
    ...typography.monoTimestamp,
    color: colors.inkMuted,
    textTransform: 'uppercase',
    width: 100,
  },
  valuesContainer: {
    flex: 1,
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 6,
  },
  valuePill: {
    paddingVertical: 4,
    paddingHorizontal: 10,
    borderRadius: 8,
    backgroundColor: colors.surfaceAlt,
  },
  valueText: {
    ...typography.bodyPreview,
    color: colors.ink,
  },
});
