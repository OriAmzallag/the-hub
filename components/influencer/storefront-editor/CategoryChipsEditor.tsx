/**
 * CategoryChipsEditor Component
 * Chip grid with order badges, remove buttons, and add chip.
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
      {categories.map((category, index) => (
        <View key={category} style={styles.chip}>
          {index === 0 && (
            <View style={styles.orderBadge}>
              <Text style={styles.orderBadgeText}>01</Text>
            </View>
          )}
          <Text style={styles.chipLabel}>{category}</Text>
          <Pressable
            onPress={() => onRemove(index)}
            hitSlop={8}
            accessibilityRole="button"
            accessibilityLabel={`Remove ${category}`}
          >
            <X size={14} color={colors.inkMuted} />
          </Pressable>
        </View>
      ))}
      {categories.length < 3 && (
        <Pressable
          style={styles.addChip}
          onPress={onAdd}
          accessibilityRole="button"
          accessibilityLabel="Add category"
        >
          <Plus size={14} color={colors.inkMuted} />
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
  orderBadge: {
    width: 18,
    height: 18,
    borderRadius: 9,
    backgroundColor: colors.accent,
    alignItems: 'center',
    justifyContent: 'center',
  },
  orderBadgeText: {
    ...typography.monoBadge,
    color: colors.bg,
  },
  chipLabel: {
    ...typography.rowSecondary,
    color: colors.ink,
  },
  addChip: {
    paddingVertical: 8,
    paddingHorizontal: 14,
    borderRadius: radii.pill,
    borderWidth: 1.5,
    borderColor: colors.borderStrong,
    borderStyle: 'dashed',
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  pressed: {
    opacity: 0.7,
  },
  addChipLabel: {
    ...typography.rowSecondary,
    color: colors.inkMuted,
  },
});
