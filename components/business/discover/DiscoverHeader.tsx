/**
 * DiscoverHeader Component
 * Search bar with notification bell and filter icon button.
 *
 * Layout: [Search Bar (flex)] [8px] [Bell 38x38] [8px] [Filter 42x42]
 *
 * The bell sits between search and filter. Both buttons follow similar
 * chrome but different sizes (bell is 38px to feel slightly lighter
 * than the primary filter action at 42px).
 */

import React from 'react';
import { View, Text, TextInput, Pressable, StyleSheet } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Search, Sliders } from 'lucide-react-native';
import { colors } from '@/constants/theme';
import { NotificationBell } from '@/components/ui';

interface DiscoverHeaderProps {
  searchValue: string;
  onSearchChange: (value: string) => void;
  onFilterPress: () => void;
  hasActiveFilters?: boolean;
  activeFilterCount?: number;
}

export function DiscoverHeader({
  searchValue,
  onSearchChange,
  onFilterPress,
  hasActiveFilters = false,
  activeFilterCount = 0,
}: DiscoverHeaderProps) {
  const hasText = searchValue.length > 0;
  const insets = useSafeAreaInsets();

  return (
    <View style={[styles.container, { paddingTop: insets.top + 16 }]}>
      <View style={[styles.searchBar, hasText && styles.searchBarActive]}>
        <Search
          size={16}
          strokeWidth={2.2}
          color={hasText ? colors.ink : colors.inkMuted}
        />
        <TextInput
          style={styles.input}
          value={searchValue}
          onChangeText={onSearchChange}
          placeholder="Search influencer or category..."
          placeholderTextColor={colors.inkMuted}
          returnKeyType="search"
          autoCorrect={false}
          autoCapitalize="none"
        />
      </View>
      {/* Order: filter first, bell last. The bell is always pinned
          to the far-right edge of the header per the notifications
          locked spec — any existing right-slot button (filter here)
          sits to its LEFT. */}
      <Pressable
        style={[styles.filterButton, hasActiveFilters && styles.filterButtonActive]}
        onPress={onFilterPress}
        accessibilityRole="button"
        accessibilityLabel={hasActiveFilters ? `Filters, ${activeFilterCount} active` : 'Filters'}
      >
        <Sliders
          size={17}
          strokeWidth={2.2}
          color={hasActiveFilters ? colors.accent : colors.ink}
        />
        {hasActiveFilters && activeFilterCount > 0 && (
          <View style={styles.badge}>
            <Text style={styles.badgeText}>{activeFilterCount}</Text>
          </View>
        )}
      </Pressable>
      <NotificationBell />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    // paddingTop is applied inline (insets.top + 16) so this header
    // aligns with the canonical ScreenHeader recipe used everywhere
    // else (Profile / Inquiries / History / Summary / Influencer
    // Discover).
    paddingHorizontal: 20,
    paddingBottom: 14,
    gap: 8,
  },
  searchBar: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 100,
    paddingVertical: 10,
    paddingHorizontal: 14,
    gap: 10,
  },
  searchBarActive: {
    borderColor: colors.borderStrong,
  },
  input: {
    flex: 1,
    fontFamily: 'InterTight-Medium',
    fontSize: 14,
    letterSpacing: 0,
    color: colors.ink,
    padding: 0,
    margin: 0,
  },
  filterButton: {
    width: 42,
    height: 42,
    borderRadius: 21,
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
    top: -3,
    right: -3,
    minWidth: 16,
    height: 16,
    borderRadius: 8,
    backgroundColor: colors.accent,
    borderWidth: 2,
    borderColor: colors.bg,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 4,
  },
  badgeText: {
    fontFamily: 'JetBrainsMono-Bold',
    fontSize: 9,
    fontWeight: '700',
    color: colors.bg,
  },
});
