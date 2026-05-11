/**
 * CategoryChipsEditor Component
 * Chip grid with primary "01" tag, remove buttons, and dashed add chip.
 */

import React from 'react';
import { View, Text, Pressable, StyleSheet } from 'react-native';
import { X, Plus } from 'lucide-react-native';
import { colors, typography, radii } from '@/constants/theme';

interface CategoryChipsEditorProps {
  categories: string[];
  onRemove: (index: number) => void;
  onAdd: () => void;
}

export function CategoryChipsEditor({
  categories,
  onRemove,
  onAdd,
}: CategoryChipsEditorProps) {
  return (
    <View style={styles.container}>
      {categories.map((category, index) => {
        const isPrimary = index === 0;
        return (
          <View
            key={category}
            style={[styles.chip, isPrimary && styles.chipPrimary]}
          >
            {isPrimary && <Text style={styles.orderTag}>01</Text>}
            <Text style={[styles.chipLabel, isPrimary && styles.chipLabelPrimary]}>
              {category}
            </Text>
            <Pressable
              onPress={() => onRemove(index)}
              hitSlop={8}
              accessibilityRole="button"
              accessibilityLabel={`Remove ${category}`}
            >
              <X size={14} color={isPrimary ? colors.accent : colors.inkMuted} />
            </Pressable>
          </View>
        );
      })}
      {categories.length < 3 && (
        <Pressable
          style={styles.addChip}
          onPress={onAdd}
          accessibilityRole="button"
          accessibilityLabel="Add category"
        >
          <Plus size={13} color={colors.inkMuted} />
          <Text style={styles.addChipLabel}>Add</Text>
        </Pressable>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  chip: {
    paddingVertical: 8,
    paddingHorizontal: 14,
    borderRadius: radii.pill,
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  chipPrimary: {
    backgroundColor: colors.accentSoft,
    borderColor: colors.accentBorder,
  },
  orderTag: {
    fontFamily: 'JetBrainsMono-Bold',
    fontSize: 8.5,
    fontWeight: '700',
    letterSpacing: 0.13,
    color: colors.accent,
  },
  chipLabel: {
    ...typography.rowSecondary,
    color: colors.ink,
  },
  chipLabelPrimary: {
    color: colors.accent,
  },
  addChip: {
    paddingVertical: 8,
    paddingLeft: 10,
    paddingRight: 14,
    borderRadius: radii.pill,
    borderWidth: 1.5,
    borderColor: colors.borderStrong,
    borderStyle: 'dashed',
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  addChipLabel: {
    ...typography.rowSecondary,
    fontSize: 13,
    color: colors.inkMuted,
  },
});
