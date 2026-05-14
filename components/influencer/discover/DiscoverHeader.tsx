/**
 * DiscoverHeader Component
 * Header for the Influencer Discover screen.
 *
 * Wraps the canonical `ScreenHeader` and passes a filter button as
 * the right slot so the title position + safe-area handling stay in
 * sync with every other tab-level header in the app.
 */

import React from 'react';
import { View, Text, Pressable, StyleSheet } from 'react-native';
import { SlidersHorizontal } from 'lucide-react-native';
import { colors } from '@/constants/theme';
import { ScreenHeader } from '@/components/ui';

interface DiscoverHeaderProps {
  activeFilterCount: number;
  onFilterPress: () => void;
}

export function DiscoverHeader({
  activeFilterCount,
  onFilterPress,
}: DiscoverHeaderProps) {
  const hasActiveFilters = activeFilterCount > 0;

  const filterButton = (
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
  );

  return <ScreenHeader title="Discover" rightSlot={filterButton} />;
}

const styles = StyleSheet.create({
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
