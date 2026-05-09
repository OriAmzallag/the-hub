/**
 * Business Discover Screen
 * Talent discovery interface for business users.
 * v2: New filters (content type, audience, language, age, gender),
 *     active filter chip bar, header filter button active state.
 */

import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { View, ScrollView, StyleSheet } from 'react-native';
import { useRouter } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { colors } from '@/constants/theme';
import {
  CATEGORIES,
  ROWS,
  TALENT,
  CONTENT_TYPES,
  AUDIENCE_TIERS,
  PLATFORMS,
  LANGUAGES,
  AGE_BRACKETS,
  GENDERS,
  SORT_OPTIONS,
  FILTER_DEFAULTS,
} from '@/constants/mockBusinessDiscover';

// Components
import {
  DiscoverHeader,
  CategoryChips,
  TalentRow,
  SkeletonRow,
  EmptyState,
  FilterSheet,
  ActiveFilterChipBar,
  type ActiveChip,
} from '@/components/business/discover';

type RenderState = 'loading' | 'content' | 'empty';

export default function DiscoverScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();

  // Render state
  const [renderState, setRenderState] = useState<RenderState>('loading');

  // UI state
  const [searchValue, setSearchValue] = useState('');
  const [activeCategory, setActiveCategory] = useState('All');
  const [filtersOpen, setFiltersOpen] = useState(false);

  // Filter values - v2 filter set
  const [filterContentTypes, setFilterContentTypes] = useState<string[]>([]);
  const [filterAudienceTiers, setFilterAudienceTiers] = useState<string[]>([]);
  const [filterPlatforms, setFilterPlatforms] = useState<string[]>([]);
  const [filterPriceMin, setFilterPriceMin] = useState<number>(FILTER_DEFAULTS.PRICE_MIN);
  const [filterPriceMax, setFilterPriceMax] = useState<number>(FILTER_DEFAULTS.PRICE_MAX);
  const [filterAvailableOnly, setFilterAvailableOnly] = useState(false);
  const [filterMinRating, setFilterMinRating] = useState(0);
  const [filterLanguages, setFilterLanguages] = useState<string[]>([]);
  const [filterAgeBrackets, setFilterAgeBrackets] = useState<string[]>([]);
  const [filterGenders, setFilterGenders] = useState<string[]>([]);
  const [filterSort, setFilterSort] = useState<string>(FILTER_DEFAULTS.SORT);

  // Detect price/sort changes from defaults
  const isPriceActive =
    filterPriceMin !== FILTER_DEFAULTS.PRICE_MIN ||
    filterPriceMax !== FILTER_DEFAULTS.PRICE_MAX;
  const isSortActive = filterSort !== FILTER_DEFAULTS.SORT;

  // Build active filter chips list
  const activeChips = useMemo<ActiveChip[]>(() => {
    const chips: ActiveChip[] = [];

    // Content types
    filterContentTypes.forEach((id) => {
      const opt = CONTENT_TYPES.find((o) => o.id === id);
      if (opt) {
        chips.push({
          key: `ct-${id}`,
          label: opt.label,
          remove: () => setFilterContentTypes((p) => p.filter((x) => x !== id)),
        });
      }
    });

    // Audience tiers
    filterAudienceTiers.forEach((id) => {
      const opt = AUDIENCE_TIERS.find((o) => o.id === id);
      if (opt) {
        chips.push({
          key: `at-${id}`,
          label: opt.label,
          remove: () => setFilterAudienceTiers((p) => p.filter((x) => x !== id)),
        });
      }
    });

    // Platforms
    filterPlatforms.forEach((id) => {
      const opt = PLATFORMS.find((o) => o.id === id);
      if (opt) {
        chips.push({
          key: `pl-${id}`,
          label: opt.label,
          remove: () => setFilterPlatforms((p) => p.filter((x) => x !== id)),
        });
      }
    });

    // Price range (single chip if changed from default)
    if (isPriceActive) {
      chips.push({
        key: 'price',
        label: `₪${filterPriceMin}–₪${filterPriceMax}`,
        remove: () => {
          setFilterPriceMin(FILTER_DEFAULTS.PRICE_MIN);
          setFilterPriceMax(FILTER_DEFAULTS.PRICE_MAX);
        },
      });
    }

    // Availability
    if (filterAvailableOnly) {
      chips.push({
        key: 'avail',
        label: 'Available now',
        remove: () => setFilterAvailableOnly(false),
      });
    }

    // Minimum rating
    if (filterMinRating > 0) {
      chips.push({
        key: 'rating',
        label: `${filterMinRating}+ ★`,
        remove: () => setFilterMinRating(0),
      });
    }

    // Languages
    filterLanguages.forEach((id) => {
      const opt = LANGUAGES.find((o) => o.id === id);
      if (opt) {
        chips.push({
          key: `lang-${id}`,
          label: opt.label,
          remove: () => setFilterLanguages((p) => p.filter((x) => x !== id)),
        });
      }
    });

    // Age brackets
    filterAgeBrackets.forEach((id) => {
      const opt = AGE_BRACKETS.find((o) => o.id === id);
      if (opt) {
        chips.push({
          key: `age-${id}`,
          label: opt.label,
          remove: () => setFilterAgeBrackets((p) => p.filter((x) => x !== id)),
        });
      }
    });

    // Genders
    filterGenders.forEach((id) => {
      const opt = GENDERS.find((o) => o.id === id);
      if (opt) {
        chips.push({
          key: `gen-${id}`,
          label: opt.label,
          remove: () => setFilterGenders((p) => p.filter((x) => x !== id)),
        });
      }
    });

    // Sort (single chip if not default)
    if (isSortActive) {
      const opt = SORT_OPTIONS.find((o) => o.id === filterSort);
      if (opt) {
        chips.push({
          key: 'sort',
          label: opt.label,
          remove: () => setFilterSort(FILTER_DEFAULTS.SORT),
        });
      }
    }

    return chips;
  }, [
    filterContentTypes,
    filterAudienceTiers,
    filterPlatforms,
    filterPriceMin,
    filterPriceMax,
    isPriceActive,
    filterAvailableOnly,
    filterMinRating,
    filterLanguages,
    filterAgeBrackets,
    filterGenders,
    filterSort,
    isSortActive,
  ]);

  const hasActiveFilters = activeChips.length > 0;
  const activeFilterCount = activeChips.length;

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

  // Clear all filters only (not search/category)
  const clearAllFilters = useCallback(() => {
    setFilterContentTypes([]);
    setFilterAudienceTiers([]);
    setFilterPlatforms([]);
    setFilterPriceMin(FILTER_DEFAULTS.PRICE_MIN);
    setFilterPriceMax(FILTER_DEFAULTS.PRICE_MAX);
    setFilterAvailableOnly(false);
    setFilterMinRating(0);
    setFilterLanguages([]);
    setFilterAgeBrackets([]);
    setFilterGenders([]);
    setFilterSort(FILTER_DEFAULTS.SORT);
  }, []);

  // Full reset including search/category
  const handleFullReset = useCallback(() => {
    setActiveCategory('All');
    setSearchValue('');
    clearAllFilters();
    setRenderState('content');
  }, [clearAllFilters]);

  // Navigate to talent storefront
  const handleTalentPress = useCallback((talentId: string) => {
    router.push(`/talent/${talentId}`);
  }, [router]);

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      {/* Header */}
      <DiscoverHeader
        searchValue={searchValue}
        onSearchChange={setSearchValue}
        onFilterPress={() => setFiltersOpen(true)}
        hasActiveFilters={hasActiveFilters}
        activeFilterCount={activeFilterCount}
      />

      {/* Category Chips */}
      <CategoryChips
        categories={CATEGORIES}
        activeCategory={activeCategory}
        onCategoryChange={setActiveCategory}
      />

      {/* Active Filter Chip Bar - only shown when filters are active */}
      {hasActiveFilters && (
        <ActiveFilterChipBar
          chips={activeChips}
          onClearAll={clearAllFilters}
        />
      )}

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
                onTalentPress={handleTalentPress}
              />
            ))}
          </>
        )}

        {/* Empty State */}
        {renderState === 'empty' && (
          <EmptyState onReset={handleFullReset} />
        )}

        {/* Bottom spacing */}
        <View style={styles.bottomSpacer} />
      </ScrollView>

      {/* Filter Sheet */}
      <FilterSheet
        isOpen={filtersOpen}
        onClose={() => setFiltersOpen(false)}
        contentTypes={filterContentTypes}
        setContentTypes={setFilterContentTypes}
        audienceTiers={filterAudienceTiers}
        setAudienceTiers={setFilterAudienceTiers}
        platforms={filterPlatforms}
        setPlatforms={setFilterPlatforms}
        priceMin={filterPriceMin}
        setPriceMin={setFilterPriceMin}
        priceMax={filterPriceMax}
        setPriceMax={setFilterPriceMax}
        availableOnly={filterAvailableOnly}
        setAvailableOnly={setFilterAvailableOnly}
        minRating={filterMinRating}
        setMinRating={setFilterMinRating}
        languages={filterLanguages}
        setLanguages={setFilterLanguages}
        ageBrackets={filterAgeBrackets}
        setAgeBrackets={setFilterAgeBrackets}
        genders={filterGenders}
        setGenders={setFilterGenders}
        sort={filterSort}
        setSort={setFilterSort}
        onReset={clearAllFilters}
        activeCount={activeFilterCount}
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
