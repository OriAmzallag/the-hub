/**
 * ActiveFilterChipBar Component
 * Displays active filter chips with remove functionality.
 */

import React from 'react';
import { View, Text, Pressable, ScrollView, StyleSheet } from 'react-native';
import { X } from 'lucide-react-native';
import { colors, typography, radii } from '@/constants/theme';
import type { PerkFilterState } from '@/types/perk';
import { getActiveFilterChips, hasActiveFilters, countActiveFilters } from '@/lib/perkFilters';

interface ActiveFilterChipBarProps {
  filters: PerkFilterState;
  onRemoveFilter: (chipKey: string) => void;
  onClearAll: () => void;
}

export function ActiveFilterChipBar({
  filters,
  onRemoveFilter,
  onClearAll,
}: ActiveFilterChipBarProps) {
  if (!hasActiveFilters(filters)) {
    return null;
  }

  const chips = getActiveFilterChips(filters);
  const activeCount = countActiveFilters(filters);

  return (
    <View style={styles.container}>
      {/* Header row */}
      <View style={styles.headerRow}>
        <Text style={styles.filterCount}>{activeCount} FILTERS ACTIVE</Text>
        <Pressable onPress={onClearAll} accessibilityRole="button">
          <Text style={styles.clearAll}>CLEAR ALL</Text>
        </Pressable>
      </View>

      {/* Chips scroll */}
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.chipsScroll}
      >
        {chips.map((chip) => (
          <Pressable
            key={chip.key}
            style={styles.chip}
            onPress={() => onRemoveFilter(chip.key)}
            accessibilityLabel={`${chip.label}, tap to remove`}
          >
            <Text style={styles.chipLabel}>{chip.label}</Text>
            <X size={12} strokeWidth={2.5} color={colors.accent} />
          </Pressable>
        ))}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 16,
    paddingTop: 4,
    paddingBottom: 14,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  filterCount: {
    ...typography.monoStatusWide,
    color: colors.accent,
  },
  clearAll: {
    ...typography.monoTab,
    color: colors.inkMuted,
  },
  chipsScroll: {
    gap: 8,
  },
  chip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingVertical: 8,
    paddingLeft: 12,
    paddingRight: 10,
    backgroundColor: colors.accentSoft,
    borderWidth: 1,
    borderColor: colors.accentBorder,
    borderRadius: radii.pill,
  },
  chipLabel: {
    fontFamily: 'InterTight-SemiBold',
    fontSize: 12,
    fontWeight: '600',
    color: colors.accent,
  },
});
