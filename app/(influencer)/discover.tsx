/**
 * Influencer Discover Screen
 *
 * Perks marketplace browser where influencers browse offers from businesses.
 * A "perk" is a defined exchange: the influencer performs a social action
 * (e.g., "3 IG Stories") in return for value (food, classes, products).
 */

import React, { useState, useMemo, useEffect } from 'react';
import { View, ScrollView, FlatList, StyleSheet, Dimensions } from 'react-native';
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
  NO_SORT,
  applyFilters,
  sortPerks,
  countActiveFilters,
  hasActiveChips,
  removeFilter,
} from '@/lib/perkFilters';
import {
  DiscoverHeader,
  CategoryChips,
  ActiveFilterChipBar,
  PerkRow,
  PerkCard,
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

  // Chip rail shows only when at least one removable (non-sort) chip
  // is active. Sort never produces a chip, so its presence alone
  // doesn't reveal the rail.
  const chipsActive = useMemo(() => hasActiveChips(filters), [filters]);
  const showActiveFilters = chipsActive && !isLoading;

  // Refine mode: any of sheet filter, sort, or category != All flips
  // the screen from curated rows to a flat grid of all matching perks.
  // Clearing the inputs reverts to rows.
  const isRefineMode =
    chipsActive || filters.sort !== NO_SORT || selectedCategory !== 'All';

  // Refine-mode result list (flat grid of all matching perks, sorted)
  const refineList = useMemo(() => {
    return sortPerks(filteredPerks, filters.sort);
  }, [filteredPerks, filters.sort]);

  // Rows-mode list (current per-row layout)
  const displayRows = useMemo(() => {
    return PERK_ROWS.map((row) => {
      const rowPerks = getPerksForRow(row);
      const filtered = rowPerks.filter((perk) =>
        filteredPerks.some((fp) => fp.id === perk.id)
      );
      const sorted = sortPerks(filtered, filters.sort);
      return { row, perks: sorted };
    }).filter(({ perks }) => perks.length > 0);
  }, [filteredPerks, filters.sort]);

  // Empty depends on which mode we're in
  const isEmpty =
    !isLoading &&
    (isRefineMode ? refineList.length === 0 : displayRows.length === 0);

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
      ) : isRefineMode ? (
        // Refine mode — flat 2-up grid of all matching perks
        <FlatList
          data={refineList}
          keyExtractor={(p) => p.id}
          renderItem={({ item }) => (
            <View style={styles.gridCell}>
              <PerkCard perk={item} viewerReach={VIEWER_REACH} />
            </View>
          )}
          numColumns={2}
          columnWrapperStyle={styles.gridRow}
          style={styles.body}
          contentContainerStyle={[
            styles.gridContent,
            { paddingBottom: insets.bottom + 100 },
          ]}
          showsVerticalScrollIndicator={false}
        />
      ) : (
        // Browse mode — curated rows (default state)
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
  // Refine-mode grid — matches the See All grid spacing (16px outer
  // padding, 12px between cells) so the visual continuity holds when
  // the user toggles filters from Discover.
  gridContent: {
    paddingTop: 12,
    paddingHorizontal: 16,
  },
  gridRow: {
    gap: 12,
    marginBottom: 12,
  },
  gridCell: {
    flex: 1,
  },
});
