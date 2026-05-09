/**
 * ActiveFilterChipBar Component
 * Shows count of active filters with removable chips.
 * Appears between CategoryChips and content when filters are active.
 */

import React from 'react';
import { View, Text, Pressable, ScrollView, StyleSheet } from 'react-native';
import Animated, { FadeInUp } from 'react-native-reanimated';
import { X } from 'lucide-react-native';
import { colors } from '@/constants/theme';

export interface ActiveChip {
  key: string;
  label: string;
  remove: () => void;
}

interface ActiveFilterChipBarProps {
  chips: ActiveChip[];
  onClearAll: () => void;
}

export function ActiveFilterChipBar({ chips, onClearAll }: ActiveFilterChipBarProps) {
  if (chips.length === 0) return null;

  return (
    <Animated.View entering={FadeInUp.duration(250)} style={styles.container}>
      {/* Header row: count + clear all */}
      <View style={styles.headerRow}>
        <Text style={styles.countLabel}>
          {chips.length} {chips.length === 1 ? 'filter' : 'filters'} active
        </Text>
        <Pressable onPress={onClearAll} hitSlop={8}>
          <Text style={styles.clearAllText}>Clear all</Text>
        </Pressable>
      </View>

      {/* Chips row: horizontal scroll */}
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.chipsContent}
      >
        {chips.map((chip) => (
          <Animated.View
            key={chip.key}
            entering={FadeInUp.duration(200).delay(50)}
          >
            <Pressable style={styles.chip} onPress={chip.remove}>
              <Text style={styles.chipLabel}>{chip.label}</Text>
              <X size={11} strokeWidth={2.6} color={colors.accent} />
            </Pressable>
          </Animated.View>
        ))}
      </ScrollView>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 16,
    paddingBottom: 12,
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 8,
    marginBottom: 8,
  },
  countLabel: {
    fontFamily: 'JetBrainsMono-SemiBold',
    fontSize: 9.5,
    letterSpacing: 1.71, // 0.18em
    textTransform: 'uppercase',
    color: colors.accent,
  },
  clearAllText: {
    fontFamily: 'JetBrainsMono-Medium',
    fontSize: 9.5,
    fontWeight: '500',
    letterSpacing: 1.425, // 0.15em
    textTransform: 'uppercase',
    color: colors.inkMuted,
  },
  chipsContent: {
    gap: 6,
    flexDirection: 'row',
  },
  chip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 7,
    paddingVertical: 6,
    paddingLeft: 12,
    paddingRight: 10,
    backgroundColor: colors.accentSoft,
    borderWidth: 1,
    borderColor: colors.accentBorder,
    borderRadius: 100,
  },
  chipLabel: {
    fontFamily: 'InterTight-SemiBold',
    fontSize: 12,
    fontWeight: '600',
    letterSpacing: -0.12, // -0.01em
    color: colors.accent,
  },
});
