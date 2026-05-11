/**
 * DiscoverHeader Component
 * Header for the Influencer Discover screen with title and filter button.
 */

import React from 'react';
import { View, Text, Pressable, StyleSheet } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { SlidersHorizontal } from 'lucide-react-native';
import { colors, typography } from '@/constants/theme';

interface DiscoverHeaderProps {
  activeFilterCount: number;
  onFilterPress: () => void;
}

export function DiscoverHeader({
  activeFilterCount,
  onFilterPress,
}: DiscoverHeaderProps) {
  const insets = useSafeAreaInsets();
  const hasActiveFilters = activeFilterCount > 0;

  return (
    <View style={[styles.container, { paddingTop: insets.top + 16 }]}>
      <Text style={styles.title}>Discover</Text>
      <Pressable
        style={[
          styles.filterButton,
          hasActiveFilters && styles.filterButtonActive,
        ]}
        onPress={onFilterPress}
        accessibilityRole="button"
        accessibilityLabel={
          hasActiveFilters ? `Filters, ${activeFilterCount} active` : 'Filters'
        }
      >
        <SlidersHorizontal
          size={17}
          strokeWidth={2.2}
          color={hasActiveFilters ? colors.accent : colors.ink}
        />
        {hasActiveFilters && (
          <View style={styles.badge}>
            <Text style={styles.badgeText}>{activeFilterCount}</Text>
          </View>
        )}
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingBottom: 14,
  },
  title: {
    ...typography.sectionTitle,
    color: colors.ink,
  },
  filterButton: {
    width: 38,
    height: 38,
    borderRadius: 19,
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
    alignItems: 'center',
    justifyContent: 'center',
  },
  filterButtonActive: {
    backgroundColor: colors.accentSoft,
    borderColor: colors.accentBorder,
  },
  badge: {
    position: 'absolute',
    top: -4,
    right: -4,
    minWidth: 18,
    height: 18,
    borderRadius: 9,
    backgroundColor: colors.accent,
    paddingHorizontal: 5,
    alignItems: 'center',
    justifyContent: 'center',
  },
  badgeText: {
    fontFamily: 'JetBrainsMono-Bold',
    fontSize: 8,
    fontWeight: '700',
    color: colors.bg,
  },
});
