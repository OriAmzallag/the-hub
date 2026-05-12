/**
 * ChipGrid Component
 * Generic multi-select or single-select chip grid.
 */

import React from 'react';
import { View, Text, Pressable, StyleSheet } from 'react-native';
import { colors, typography, radii } from '@/constants/theme';

interface ChipGridProps<T extends string> {
  /** Available options */
  options: T[];
  /** Currently selected options */
  selected: T[];
  /** Selection change handler */
  onChange: (selected: T[]) => void;
  /** Maximum selections allowed (undefined = unlimited) */
  max?: number;
  /** Single-select mode (default: false for multi-select) */
  singleSelect?: boolean;
  /** Show primary "01" prefix on first selection */
  showPrimaryIndex?: boolean;
  /** Optional header text */
  header?: string;
  /** Optional hint text */
  hint?: string;
}

export function ChipGrid<T extends string>({
  options,
  selected,
  onChange,
  max,
  singleSelect = false,
  showPrimaryIndex = false,
  header,
  hint,
}: ChipGridProps<T>) {
  const handleToggle = (option: T) => {
    if (singleSelect) {
      // Single-select: toggle or replace
      if (selected.includes(option)) {
        onChange([]);
      } else {
        onChange([option]);
      }
    } else {
      // Multi-select
      if (selected.includes(option)) {
        // Remove
        onChange(selected.filter((s) => s !== option));
      } else if (max === undefined || selected.length < max) {
        // Add
        onChange([...selected, option]);
      }
    }
  };

  return (
    <View style={styles.container}>
      {/* Header row */}
      {(header || hint) && (
        <View style={styles.headerRow}>
          {header && <Text style={styles.header}>{header}</Text>}
          {hint && <Text style={styles.hint}>{hint}</Text>}
        </View>
      )}

      {/* Chips grid */}
      <View style={styles.grid}>
        {options.map((option) => {
          const isSelected = selected.includes(option);
          const isPrimary = showPrimaryIndex && selected[0] === option;

          return (
            <Pressable
              key={option}
              style={[styles.chip, isSelected && styles.chipSelected]}
              onPress={() => handleToggle(option)}
              accessibilityRole="button"
              accessibilityLabel={`${isSelected ? 'Deselect' : 'Select'} ${option}`}
              accessibilityState={{ selected: isSelected }}
            >
              {isPrimary && <Text style={styles.indexLabel}>01</Text>}
              <Text
                style={[styles.chipText, isSelected && styles.chipTextSelected]}
              >
                {option}
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
  header: {
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
    fontFamily: 'JetBrainsMono-Bold',
    fontSize: 8.5,
    fontWeight: '700',
    letterSpacing: 0.13,
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
