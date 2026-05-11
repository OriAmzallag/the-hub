/**
 * Influencer Discover Screen
 *
 * Perks marketplace browser where influencers browse offers from businesses.
 * A "perk" is a defined exchange: the influencer performs a social action
 * (e.g., "3 IG Stories") in return for value (food, classes, products).
 */

import React, { useState, useMemo, useEffect } from 'react';
import { View, ScrollView, StyleSheet } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { colors } from '@/constants/theme';
import {
  PERKS,
  PERK_ROWS,
  VIEWER_REACH,
  getPerksForRow,
} from '@/constants/mockInfluencerPerks';
import type { PerkFilterState, Perk } from '@/types/perk';
import {
  DEFAULT_FILTERS,
  applyFilters,
  sortPerks,
  countActiveFilters,
  hasActiveFilters,
  removeFilter,
} from '@/lib/perkFilters';
import {
  DiscoverHeader,
  CategoryChips,
  ActiveFilterChipBar,
  PerkRow,
  PerkFilterSheet,
  EmptyState,
  SkeletonRow,
} from '@/components/influencer/discover';

export default function InfluencerDiscoverScreen() {
  const insets = useSafeAreaInsets();

  // Screen state
  const [isLoading, setIsLoading] = useState(true);
  const [isFilterSheetOpen, setIsFilterSheetOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [filters, setFilters] = useState<PerkFilterState>(DEFAULT_FILTERS);

  // Simulate loading delay
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 1200);
    return () => clearTimeout(timer);
  }, []);

  // Filter all perks based on category and filter state
  const filteredPerks = useMemo(() => {
    return applyFilters(PERKS, selectedCategory, filters, VIEWER_REACH);
  }, [selectedCategory, filters]);

  // Count active filters for badge
  const activeFilterCount = useMemo(() => {
    return countActiveFilters(filters);
  }, [filters]);

  // Check if any filters are active (for chip bar visibility)
  const showActiveFilters = useMemo(() => {
    return hasActiveFilters(filters) && !isLoading;
  }, [filters, isLoading]);

  // Build rows with filtered perks
  const displayRows = useMemo(() => {
    return PERK_ROWS.map((row) => {
      const rowPerks = getPerksForRow(row);
      // Filter the row's perks
      const filtered = rowPerks.filter((perk) =>
        filteredPerks.some((fp) => fp.id === perk.id)
      );
      // Sort within row
      const sorted = sortPerks(filtered, filters.sort);
      return { row, perks: sorted };
    }).filter(({ perks }) => perks.length > 0);
  }, [filteredPerks, filters.sort]);

  // Check if we have any perks to show
  const isEmpty = !isLoading && displayRows.length === 0;

  // Reset all filters (including category chip)
  const handleResetAll = () => {
    setSelectedCategory('All');
    setFilters(DEFAULT_FILTERS);
  };

  // Reset only sheet filters (keep category chip)
  const handleResetFilters = () => {
    setFilters(DEFAULT_FILTERS);
  };

  // Remove individual filter from chip bar
  const handleRemoveFilter = (chipKey: string) => {
    setFilters(removeFilter(filters, chipKey));
  };

  return (
    <View style={styles.container}>
      {/* Header with filter button */}
      <DiscoverHeader
        activeFilterCount={activeFilterCount}
        onFilterPress={() => setIsFilterSheetOpen(true)}
      />

      {/* Category chips */}
      <CategoryChips
        selected={selectedCategory}
        onSelect={setSelectedCategory}
      />

      {/* Active filter chip bar */}
      {showActiveFilters && (
        <ActiveFilterChipBar
          filters={filters}
          onRemoveFilter={handleRemoveFilter}
          onClearAll={handleResetFilters}
        />
      )}

      {/* Body */}
      {isLoading ? (
        // Loading state - skeleton rows
        <ScrollView
          style={styles.body}
          contentContainerStyle={[
            styles.bodyContent,
            { paddingBottom: insets.bottom + 100 },
          ]}
          showsVerticalScrollIndicator={false}
        >
          {[0, 1, 2].map((index) => (
            <SkeletonRow key={index} rowIndex={index} />
          ))}
        </ScrollView>
      ) : isEmpty ? (
        // Empty state
        <View style={[styles.emptyContainer, { paddingBottom: insets.bottom + 100 }]}>
          <EmptyState onReset={handleResetAll} />
        </View>
      ) : (
        // Content state - perk rows
        <ScrollView
          style={styles.body}
          contentContainerStyle={[
            styles.bodyContent,
            { paddingBottom: insets.bottom + 100 },
          ]}
          showsVerticalScrollIndicator={false}
        >
          {displayRows.map(({ row, perks }) => (
            <PerkRow
              key={row.id}
              row={row}
              perks={perks}
              viewerReach={VIEWER_REACH}
            />
          ))}
        </ScrollView>
      )}

      {/* Filter sheet */}
      <PerkFilterSheet
        isOpen={isFilterSheetOpen}
        onClose={() => setIsFilterSheetOpen(false)}
        filters={filters}
        setFilters={setFilters}
        onReset={handleResetFilters}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.bg,
  },
  body: {
    flex: 1,
  },
  bodyContent: {
    paddingTop: 4,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
  },
});
