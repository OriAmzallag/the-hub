/**
 * CategoryChips Component
 * Horizontal single-select category chips for filtering perks.
 */

import React from 'react';
import { View, Text, Pressable, ScrollView, StyleSheet, Platform } from 'react-native';
import { colors, radii } from '@/constants/theme';
import { CATEGORIES_CHIPS } from '@/constants/mockInfluencerPerks';

interface CategoryChipsProps {
  selected: string;
  onSelect: (category: string) => void;
}

export function CategoryChips({ selected, onSelect }: CategoryChipsProps) {
  return (
    <View style={styles.container}>
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {CATEGORIES_CHIPS.map((category) => {
          const isActive = selected === category;
          return (
            <Pressable
              key={category}
              style={[
                styles.chip,
                isActive && styles.chipActive,
                isActive && Platform.OS === 'ios' && styles.chipActiveShadow,
              ]}
              onPress={() => onSelect(category)}
              accessibilityRole="button"
              accessibilityState={{ selected: isActive }}
            >
              <Text style={[styles.chipText, isActive && styles.chipTextActive]}>
                {category}
              </Text>
            </Pressable>
          );
        })}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingTop: 2,
    paddingBottom: 12,
  },
  scrollContent: {
    paddingHorizontal: 16,
    gap: 8,
  },
  chip: {
    paddingVertical: 10,
    paddingHorizontal: 16,
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: radii.pill,
  },
  chipActive: {
    backgroundColor: colors.accent,
    borderColor: colors.accent,
  },
  chipActiveShadow: {
    shadowColor: colors.accentShadow,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 1,
    shadowRadius: 12,
    elevation: 4,
  },
  chipText: {
    fontFamily: 'InterTight-SemiBold',
    fontSize: 13,
    fontWeight: '600',
    letterSpacing: -0.13,
    color: colors.ink,
  },
  chipTextActive: {
    color: colors.bg,
  },
});
