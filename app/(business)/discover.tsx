/**
 * Business Discover Screen
 * Talent discovery interface for business users.
 */

import React, { useState, useEffect, useCallback } from 'react';
import { View, ScrollView, StyleSheet } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { colors } from '@/constants/theme';
import {
  CATEGORIES,
  ROWS,
  TALENT,
} from '@/constants/mockBusinessDiscover';

// Components
import {
  DiscoverHeader,
  CategoryChips,
  TalentRow,
  SkeletonRow,
  EmptyState,
  FilterSheet,
} from '@/components/business/discover';

type RenderState = 'loading' | 'content' | 'empty';

export default function DiscoverScreen() {
  const insets = useSafeAreaInsets();

  // Render state
  const [renderState, setRenderState] = useState<RenderState>('loading');

  // UI state
  const [searchValue, setSearchValue] = useState('');
  const [activeCategory, setActiveCategory] = useState('All');
  const [filtersOpen, setFiltersOpen] = useState(false);

  // Filter values
  const [filterRadius, setFilterRadius] = useState(10);
  const [filterPriceMin, setFilterPriceMin] = useState(50);
  const [filterPriceMax, setFilterPriceMax] = useState(2000);
  const [filterPlatforms, setFilterPlatforms] = useState<string[]>([]);
  const [filterMinRating, setFilterMinRating] = useState(0);
  const [filterAvailableOnly, setFilterAvailableOnly] = useState(false);
  const [filterSort, setFilterSort] = useState('recommended');

  // Simulate initial loading
  useEffect(() => {
    const loadTime = 800 + Math.random() * 400; // 800-1200ms
    const timer = setTimeout(() => {
      setRenderState('content');
    }, loadTime);

    return () => clearTimeout(timer);
  }, []);

  // Determine empty state based on filters (deterministic for mock)
  useEffect(() => {
    if (renderState === 'loading') return;

    // Empty state trigger conditions:
    // 1. Price max is too low (< 50)
    // 2. Active category doesn't match any talent
    const categoryHasNoTalent =
      activeCategory !== 'All' &&
      !TALENT.some((t) => t.categories.includes(activeCategory));

    const priceIsTooLow = filterPriceMax < 50;

    if (categoryHasNoTalent || priceIsTooLow) {
      setRenderState('empty');
    } else {
      setRenderState('content');
    }
  }, [activeCategory, filterPriceMax, renderState]);

  // Reset all filters
  const handleResetFilters = useCallback(() => {
    setActiveCategory('All');
    setSearchValue('');
    setFilterRadius(10);
    setFilterPriceMin(50);
    setFilterPriceMax(2000);
    setFilterPlatforms([]);
    setFilterMinRating(0);
    setFilterAvailableOnly(false);
    setFilterSort('recommended');
    setRenderState('content');
  }, []);

  // Reset filter panel values only
  const handleResetFilterPanel = useCallback(() => {
    setFilterRadius(10);
    setFilterPriceMin(50);
    setFilterPriceMax(2000);
    setFilterPlatforms([]);
    setFilterMinRating(0);
    setFilterAvailableOnly(false);
    setFilterSort('recommended');
  }, []);

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      {/* Header */}
      <DiscoverHeader
        searchValue={searchValue}
        onSearchChange={setSearchValue}
        onFilterPress={() => setFiltersOpen(true)}
      />

      {/* Category Chips */}
      <CategoryChips
        categories={CATEGORIES}
        activeCategory={activeCategory}
        onCategoryChange={setActiveCategory}
      />

      {/* Body */}
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Loading State */}
        {renderState === 'loading' && (
          <>
            <SkeletonRow rowIndex={0} />
            <SkeletonRow rowIndex={1} />
            <SkeletonRow rowIndex={2} />
          </>
        )}

        {/* Content State */}
        {renderState === 'content' && (
          <>
            {ROWS.map((row, index) => (
              <TalentRow
                key={row.id}
                row={row}
                delayIndex={index}
                onSeeAllPress={() => {
                  // TODO: Navigate to full list
                }}
                onTalentPress={(talentId) => {
                  // TODO: Navigate to talent profile
                }}
              />
            ))}
          </>
        )}

        {/* Empty State */}
        {renderState === 'empty' && (
          <EmptyState onReset={handleResetFilters} />
        )}

        {/* Bottom spacing */}
        <View style={styles.bottomSpacer} />
      </ScrollView>

      {/* Filter Sheet */}
      <FilterSheet
        isOpen={filtersOpen}
        onClose={() => setFiltersOpen(false)}
        radius={filterRadius}
        setRadius={setFilterRadius}
        priceMin={filterPriceMin}
        setPriceMin={setFilterPriceMin}
        priceMax={filterPriceMax}
        setPriceMax={setFilterPriceMax}
        platforms={filterPlatforms}
        setPlatforms={setFilterPlatforms}
        minRating={filterMinRating}
        setMinRating={setFilterMinRating}
        availableOnly={filterAvailableOnly}
        setAvailableOnly={setFilterAvailableOnly}
        sort={filterSort}
        setSort={setFilterSort}
        onReset={handleResetFilterPanel}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.bg,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: 100, // Room for tab bar
  },
  bottomSpacer: {
    height: 24,
  },
});
