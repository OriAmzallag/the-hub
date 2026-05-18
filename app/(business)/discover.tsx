/**
 * Business Discover Screen
 * Influencer discovery interface for business users.
 * v2: New filters (content type, audience, language, age, gender),
 *     active filter chip bar, header filter button active state.
 */

import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { View, ScrollView, FlatList, StyleSheet } from 'react-native';
import { useRouter } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { colors } from '@/constants/theme';
import {
  CATEGORIES,
  ROWS,
  INFLUENCER,
  CONTENT_TYPES,
  AUDIENCE_TIERS,
  PLATFORMS,
  LANGUAGES,
  AGE_BRACKETS,
  GENDERS,
  FILTER_DEFAULTS,
} from '@/constants/mockBusinessDiscover';

// Components
import {
  DiscoverHeader,
  CategoryChips,
  InfluencerRow,
  InfluencerCard,
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

    // NOTE: Sort intentionally does NOT produce a chip. Sort is a view
    // setting, not a filter — it affects the badge count below and the
    // Refine-mode trigger, but never renders as a removable chip.

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
  ]);

  // Chip-rail visibility = at least one removable (non-sort) chip.
  const hasActiveFilters = activeChips.length > 0;
  // Badge count = removable chips + 1 if sort is non-default.
  const activeFilterCount = activeChips.length + (isSortActive ? 1 : 0);
  // Refine mode: switch from curated rows to a flat 2-up grid of
  // matching cards whenever the user has narrowed by search, filter,
  // sort, or category. Clearing all reverts to rows.
  const isRefineMode =
    !!searchValue.trim() ||
    hasActiveFilters ||
    isSortActive ||
    activeCategory !== 'All';

  // Refine-mode result list — filter the flat INFLUENCER set, then sort.
  // Mirrors the see-all filter/sort logic so Discover→Refine→See All
  // all read consistently.
  const refineList = useMemo(() => {
    let result = [...INFLUENCER];

    if (searchValue.trim()) {
      const term = searchValue.toLowerCase().trim();
      result = result.filter(
        (t) =>
          t.name.toLowerCase().includes(term) ||
          t.categories.some((c) => c.toLowerCase().includes(term))
      );
    }
    if (activeCategory !== 'All') {
      result = result.filter((t) => t.categories.includes(activeCategory));
    }
    if (filterContentTypes.length > 0) {
      result = result.filter((t) =>
        filterContentTypes.some((id) => {
          const opt = CONTENT_TYPES.find((o) => o.id === id);
          return opt && t.categories.includes(opt.label);
        })
      );
    }
    if (filterAvailableOnly) {
      result = result.filter((t) => t.available);
    }
    if (filterMinRating > 0) {
      result = result.filter((t) => t.rating != null && t.rating >= filterMinRating);
    }

    switch (filterSort) {
      case 'rating':
        result.sort((a, b) => (b.rating || 0) - (a.rating || 0));
        break;
      case 'newest':
        result.sort((a, b) => {
          if (a.badge === 'New' && b.badge !== 'New') return -1;
          if (b.badge === 'New' && a.badge !== 'New') return 1;
          return 0;
        });
        break;
      case 'available':
        result.sort((a, b) => (b.available ? 1 : 0) - (a.available ? 1 : 0));
        break;
      default:
        // NO_SORT or unrecognized — preserve fixture order.
        break;
    }

    return result;
  }, [
    searchValue,
    activeCategory,
    filterContentTypes,
    filterAvailableOnly,
    filterMinRating,
    filterSort,
  ]);

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
    // 2. Active category doesn't match any influencer
    const categoryHasNoInfluencer =
      activeCategory !== 'All' &&
      !INFLUENCER.some((t) => t.categories.includes(activeCategory));

    const priceIsTooLow = filterPriceMax < 50;

    if (categoryHasNoInfluencer || priceIsTooLow) {
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

  // Navigate to influencer storefront
  const handleInfluencerPress = useCallback((influencerId: string) => {
    router.push(`/influencer/${influencerId}`);
  }, [router]);

  return (
    <View style={styles.container}>
      {/* Header handles its own safe-area top inset */}
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
      {renderState === 'loading' ? (
        <ScrollView
          style={styles.scrollView}
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          <SkeletonRow rowIndex={0} />
          <SkeletonRow rowIndex={1} />
          <SkeletonRow rowIndex={2} />
          <View style={styles.bottomSpacer} />
        </ScrollView>
      ) : renderState === 'empty' ? (
        <ScrollView
          style={styles.scrollView}
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          <EmptyState onReset={handleFullReset} />
          <View style={styles.bottomSpacer} />
        </ScrollView>
      ) : isRefineMode ? (
        // Refine mode — flat 2-up grid of all matching talent
        <FlatList
          data={refineList}
          keyExtractor={(t) => t.id}
          renderItem={({ item }) => (
            <View style={styles.gridCell}>
              <InfluencerCard
                influencer={item}
                onPress={() => handleInfluencerPress(item.id)}
              />
            </View>
          )}
          numColumns={2}
          columnWrapperStyle={styles.gridRow}
          style={styles.scrollView}
          contentContainerStyle={[
            styles.gridContent,
            { paddingBottom: insets.bottom + 100 },
          ]}
          showsVerticalScrollIndicator={false}
          ListEmptyComponent={<EmptyState onReset={handleFullReset} />}
        />
      ) : (
        // Browse mode — curated rows (default state)
        <ScrollView
          style={styles.scrollView}
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          {ROWS.map((row, index) => (
            <InfluencerRow
              key={row.id}
              row={row}
              delayIndex={index}
              onInfluencerPress={handleInfluencerPress}
            />
          ))}
          <View style={styles.bottomSpacer} />
        </ScrollView>
      )}

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
  // Refine-mode grid — matches the See All grid spacing (16px outer
  // padding, 12px between cells) so visual continuity holds when the
  // user toggles filters from Discover.
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
