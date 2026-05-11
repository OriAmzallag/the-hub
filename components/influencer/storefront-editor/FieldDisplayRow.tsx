/**
 * FieldDisplayRow Component
 * Non-editable preview row: mono uppercase label on top, bold ink
 * values joined with " · " below, ChevronRight on the right.
 */

import React, { Fragment } from 'react';
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
      accessibilityLabel={`Edit ${label}, ${values.join(', ')}`}
    >
      <View style={styles.content}>
        <Text style={styles.label}>{label}</Text>
        <View style={styles.valuesRow}>
          {values.map((value, index) => (
            <Fragment key={`${label}-${value}`}>
              {index > 0 && <Text style={styles.separator}>·</Text>}
              <Text style={styles.valueText}>{value}</Text>
            </Fragment>
          ))}
        </View>
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
  content: {
    flex: 1,
  },
  label: {
    ...typography.monoStatus,
    color: colors.inkMuted,
    marginBottom: 8,
  },
  valuesRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    alignItems: 'center',
  },
  valueText: {
    ...typography.rowTitle,
    color: colors.ink,
  },
  separator: {
    ...typography.rowTitle,
    color: colors.inkSubtle,
    marginHorizontal: 8,
  },
});
