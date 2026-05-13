/**
 * TagChips Component
 * Role-specific tag selection for rating flow.
 * Centered wrap layout with Check icon on active chips.
 */

import React from 'react';
import { View, Text, Pressable, StyleSheet } from 'react-native';
import { Check } from 'lucide-react-native';
import { colors, typography, radii } from '@/constants/theme';
import type { RatingTag } from '@/types/rating';

interface TagChipsProps {
  tags: readonly RatingTag[];
  selected: RatingTag[];
  onChange: (selected: RatingTag[]) => void;
}

export function TagChips({ tags, selected, onChange }: TagChipsProps) {
  const handleToggle = (tag: RatingTag) => {
    if (selected.includes(tag)) {
      onChange(selected.filter((t) => t !== tag));
    } else {
      onChange([...selected, tag]);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.caption}>WHAT STOOD OUT · OPTIONAL</Text>
      <View style={styles.grid}>
        {tags.map((tag) => {
          const isSelected = selected.includes(tag);

          return (
            <Pressable
              key={tag}
              style={[styles.chip, isSelected && styles.chipSelected]}
              onPress={() => handleToggle(tag)}
              accessibilityRole="checkbox"
              accessibilityLabel={tag}
              accessibilityState={{ checked: isSelected }}
            >
              {isSelected && (
                <Check size={12} strokeWidth={2.5} color={colors.accent} />
              )}
              <Text
                style={[styles.chipText, isSelected && styles.chipTextSelected]}
              >
                {tag}
              </Text>
            </Pressable>
          );
        })}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    gap: 12,
  },
  caption: {
    ...typography.monoGreeting,
    color: colors.inkMuted,
    textAlign: 'center',
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    gap: 7,
  },
  chip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingVertical: 8,
    paddingHorizontal: 14,
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: radii.pill,
  },
  chipSelected: {
    backgroundColor: colors.accentSoft,
    borderColor: colors.accentBorder,
  },
  chipText: {
    fontFamily: 'InterTight-SemiBold',
    fontSize: 13,
    fontWeight: '600',
    letterSpacing: -0.26,
    color: colors.ink,
  },
  chipTextSelected: {
    color: colors.accent,
  },
});
