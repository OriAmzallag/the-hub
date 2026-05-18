/**
 * DiscoverHeader Component
 * Header for the Influencer Discover screen.
 *
 * Wraps the canonical `ScreenHeader` and passes a right slot with:
 * 1. NotificationBell (38x38) - navigates to /notifications
 * 2. Filter button (38x38) - opens filter sheet
 *
 * Layout: [Title] ... [Bell] [8px gap] [Filter]
 *
 * The title position + safe-area handling stay in sync with every other
 * tab-level header in the app via the shared ScreenHeader primitive.
 */

import React from 'react';
import { View, Text, Pressable, StyleSheet } from 'react-native';
import { SlidersHorizontal } from 'lucide-react-native';
import { colors } from '@/constants/theme';
import { ScreenHeader, NotificationBell } from '@/components/ui';

interface DiscoverHeaderProps {
  activeFilterCount: number;
  onFilterPress: () => void;
}

export function DiscoverHeader({
  activeFilterCount,
  onFilterPress,
}: DiscoverHeaderProps) {
  const hasActiveFilters = activeFilterCount > 0;

  const rightSlot = (
    <View style={styles.rightSlot}>
      <NotificationBell />
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

  return <ScreenHeader title="Discover" rightSlot={rightSlot} />;
}

const styles = StyleSheet.create({
  rightSlot: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
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
