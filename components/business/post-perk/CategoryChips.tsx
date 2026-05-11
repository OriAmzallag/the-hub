/**
 * CategoryChips Component
 * Multi-select pill grid with max 3 selection. First selected = primary with index.
 */

import React from 'react';
import { View, Text, Pressable, StyleSheet } from 'react-native';
import { colors, radii, typography } from '@/constants/theme';
import type { PerkCategory } from '@/types/perk';
import { CATEGORY_OPTIONS } from './types';

interface CategoryChipsProps {
  selected: PerkCategory[];
  onChange: (categories: PerkCategory[]) => void;
}

const MAX_CATEGORIES = 3;

export function CategoryChips({ selected, onChange }: CategoryChipsProps) {
  const handleToggle = (category: PerkCategory) => {
    if (selected.includes(category)) {
      // Remove
      onChange(selected.filter((c) => c !== category));
    } else if (selected.length < MAX_CATEGORIES) {
      // Add
      onChange([...selected, category]);
    }
  };

  return (
    <View style={styles.container}>
      {/* Section header */}
      <View style={styles.headerRow}>
        <Text style={styles.sectionHeader}>CATEGORIES</Text>
        <Text style={styles.hint}>(choose up to 3)</Text>
      </View>

      {/* Chips grid */}
      <View style={styles.grid}>
        {CATEGORY_OPTIONS.map((category) => {
          const isSelected = selected.includes(category);
          const isPrimary = selected[0] === category;
          const index = selected.indexOf(category);

          return (
            <Pressable
              key={category}
              style={[
                styles.chip,
                isSelected && styles.chipSelected,
              ]}
              onPress={() => handleToggle(category)}
              accessibilityRole="button"
              accessibilityLabel={`Select ${category} category`}
            >
              {isPrimary && (
                <Text style={styles.indexLabel}>
                  {String(index + 1).padStart(2, '0')}
                </Text>
              )}
              <Text
                style={[
                  styles.chipText,
                  isSelected && styles.chipTextSelected,
                ]}
              >
                {category}
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
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  sectionHeader: {
    ...typography.monoGreeting,
    color: colors.accent,
  },
  hint: {
    ...typography.monoTimestamp,
    color: colors.inkMuted,
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  chip: {
    flexDirection: 'row',
    alignItems: 'center',
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
  indexLabel: {
    ...typography.monoTimestamp,
    color: colors.accent,
    marginRight: 6,
  },
  chipText: {
    fontFamily: 'InterTight-SemiBold',
    fontSize: 13,
    fontWeight: '600',
    letterSpacing: -0.26,
    color: colors.inkMuted,
  },
  chipTextSelected: {
    color: colors.accent,
  },
});
