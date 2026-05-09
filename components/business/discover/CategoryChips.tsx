/**
 * CategoryChips Component
 * Horizontal scrolling category filter chips.
 */

import React from 'react';
import { ScrollView, Pressable, Text, StyleSheet, Platform } from 'react-native';
import { colors } from '@/constants/theme';

interface CategoryChipsProps {
  categories: string[];
  activeCategory: string;
  onCategoryChange: (category: string) => void;
}

export function CategoryChips({
  categories,
  activeCategory,
  onCategoryChange,
}: CategoryChipsProps) {
  return (
    <ScrollView
      horizontal
      showsHorizontalScrollIndicator={false}
      contentContainerStyle={styles.container}
    >
      {categories.map((category) => {
        const isActive = category === activeCategory;
        return (
          <Pressable
            key={category}
            style={[
              styles.chip,
              isActive ? styles.chipActive : styles.chipInactive,
              isActive && Platform.OS === 'ios' && styles.chipActiveShadow,
            ]}
            onPress={() => onCategoryChange(category)}
            accessibilityRole="button"
            accessibilityState={{ selected: isActive }}
            accessibilityLabel={category}
          >
            <Text style={[styles.chipText, isActive && styles.chipTextActive]}>
              {category}
            </Text>
          </Pressable>
        );
      })}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingTop: 6,
    paddingHorizontal: 16,
    paddingBottom: 14,
    gap: 8,
  },
  chip: {
    paddingVertical: 8,
    paddingHorizontal: 14,
    borderRadius: 100,
    borderWidth: 1,
  },
  chipInactive: {
    backgroundColor: colors.surface,
    borderColor: colors.border,
  },
  chipActive: {
    backgroundColor: colors.accent,
    borderColor: colors.accent,
  },
  chipActiveShadow: {
    shadowColor: colors.accentShadow,
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 1,
    shadowRadius: 16,
    elevation: 6,
  },
  chipText: {
    fontFamily: 'InterTight-SemiBold',
    fontSize: 13,
    letterSpacing: -0.13,
    color: colors.ink,
  },
  chipTextActive: {
    color: colors.bg,
  },
});
