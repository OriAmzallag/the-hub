/**
 * See All — Talent (Business)
 *
 * Unified grid destination for all curated talent rows on the Discover surface.
 * Route param `entry` drives the initial sort; subsequent changes come from
 * the filter sheet. Reuses InfluencerCard and FilterSheet — no rewrites.
 *
 * Locked decisions (DO NOT NEGOTIATE):
 * 1. One screen, not many — entry param drives initial sort only
 * 2. Reuse InfluencerCard, FilterSheet — no duplication
 * 3. Entry-point→sort mapping: top_match→best_match, trending→best_match, top_rated→rating, new→newest, available→best_match
 * 4. Sort taxonomy: Best match, Highest rated, Newest, Available first
 * 5. Subtitle = live sort label (not entry label)
 * 6. Filter badge count includes sort when ≠ best_match
 * 7. TalentCard has NO pulse-dot (removed in production)
 */

import React, { useState, useMemo, useCallback } from 'react';
import {
  View,
  Text,
  Pressable,
  FlatList,
  TextInput,
  StyleSheet,
  Dimensions,
} from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Animated, { FadeInUp, Easing } from 'react-native-reanimated';
import { ChevronLeft, Search, SlidersHorizontal, X } from 'lucide-react-native';
import { colors, radii } from '@/constants/theme';
import { InfluencerCard } from '@/components/business/discover/InfluencerCard';
import { FilterSheet } from '@/components/business/discover/FilterSheet';
import {
  INFLUENCER,
  CONTENT_TYPES,
  FILTER_DEFAULTS,
} from '@/constants/mockBusinessDiscover';
import type { Influencer } from '@/constants/mockBusinessDiscover';

const { width: SCREEN_WIDTH } = Dimensions.get('window');
const GRID_GAP = 12;
const GRID_PADDING = 16;
const CARD_WIDTH = (SCREEN_WIDTH - GRID_PADDING * 2 - GRID_GAP) / 2;

// Default sort ID (matches SORT_OPTIONS in mockBusinessDiscover)
const DEFAULT_SORT = 'recommended';

// Entry-point → initial sort mapping (LOCKED)
// Maps row entry IDs to sort option IDs from SORT_OPTIONS
const ENTRY_SORT_MAP: Record<string, string> = {
  top_match: 'recommended',
  trending: 'recommended',
  top_rated: 'rating',
  new: 'newest',
  available: 'recommended',
  // Row IDs from ROWS
  'row-match': 'recommended',
  'row-trending': 'recommended',
  'row-toprated': 'rating',
  'row-new': 'newest',
  'row-available': 'recommended',
};

// Sort ID → display label (LOCKED)
const SORT_LABELS: Record<string, string> = {
  recommended: 'Best match',
  rating: 'Highest rated',
  newest: 'Newest',
  price_low: 'Price: low to high',
  price_high: 'Price: high to low',
};

export default function SeeAllTalentScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { entry } = useLocalSearchParams<{ entry?: string }>();

  // Derive initial sort from entry param
  const initialSort = entry ? ENTRY_SORT_MAP[entry] || DEFAULT_SORT : DEFAULT_SORT;

  // State
  const [search, setSearch] = useState('');
  const [isFilterSheetOpen, setIsFilterSheetOpen] = useState(false);

  // Filter values (matching FilterSheet props)
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
  const [filterSort, setFilterSort] = useState<string>(initialSort);

  // Filter + sort logic
  const visibleTalent = useMemo(() => {
    let result = [...INFLUENCER];

    // Search filter
    if (search.trim()) {
      const term = search.toLowerCase().trim();
      result = result.filter(
        (talent) =>
          talent.name.toLowerCase().includes(term) ||
          talent.categories.some((c) => c.toLowerCase().includes(term))
      );
    }

    // Content type filter (maps to categories in mock)
    if (filterContentTypes.length > 0) {
      result = result.filter((talent) => {
        return filterContentTypes.some((ct) => {
          const opt = CONTENT_TYPES.find((o) => o.id === ct);
          return opt && talent.categories.includes(opt.label);
        });
      });
    }

    // Available only
    if (filterAvailableOnly) {
      result = result.filter((talent) => talent.available);
    }

    // Min rating
    if (filterMinRating > 0) {
      result = result.filter(
        (talent) => talent.rating !== null && talent.rating >= filterMinRating
      );
    }

    // Sort
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
        // recommended (best_match) — keep original order
        break;
    }

    return result;
  }, [search, filterContentTypes, filterAvailableOnly, filterMinRating, filterSort]);

  // Detect price/sort changes from defaults
  const isPriceActive =
    filterPriceMin !== FILTER_DEFAULTS.PRICE_MIN ||
    filterPriceMax !== FILTER_DEFAULTS.PRICE_MAX;
  const isSortActive = filterSort !== DEFAULT_SORT;

  // Active count: filters + 1 if sort ≠ default
  const activeCount = useMemo(() => {
    let count = 0;
    count += filterContentTypes.length;
    count += filterAudienceTiers.length;
    count += filterPlatforms.length;
    if (isPriceActive) count += 1;
    if (filterAvailableOnly) count += 1;
    if (filterMinRating > 0) count += 1;
    count += filterLanguages.length;
    count += filterAgeBrackets.length;
    count += filterGenders.length;
    if (isSortActive) count += 1;
    return count;
  }, [
    filterContentTypes,
    filterAudienceTiers,
    filterPlatforms,
    isPriceActive,
    filterAvailableOnly,
    filterMinRating,
    filterLanguages,
    filterAgeBrackets,
    filterGenders,
    isSortActive,
  ]);

  // Live subtitle = current sort label + count
  const sortLabel = SORT_LABELS[filterSort] || 'Best match';
  const countLabel = `${visibleTalent.length} ${visibleTalent.length === 1 ? 'creator' : 'creators'}`;
  const subtitle = `${sortLabel} · ${countLabel}`;

  // Reset all filters
  const handleReset = useCallback(() => {
    setSearch('');
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
    setFilterSort(DEFAULT_SORT);
  }, []);

  // Navigate to influencer storefront
  const handleTalentPress = useCallback(
    (talentId: string) => {
      router.push(`/influencer/${talentId}`);
    },
    [router]
  );

  // Render card with grid width
  const renderItem = useCallback(
    ({ item }: { item: Influencer }) => (
      <View style={styles.cardWrapper}>
        <InfluencerCard
          influencer={item}
          onPress={() => handleTalentPress(item.id)}
          style={styles.cardFlex}
        />
      </View>
    ),
    [handleTalentPress]
  );

  const keyExtractor = useCallback((item: Influencer) => item.id, []);

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      {/* Top bar */}
      <Animated.View
        style={styles.topBar}
        entering={FadeInUp.delay(0).duration(350).easing(Easing.out(Easing.ease))}
      >
        <Pressable
          style={styles.backButton}
          onPress={() => router.back()}
          accessibilityRole="button"
          accessibilityLabel="Go back"
          hitSlop={8}
        >
          <ChevronLeft size={18} strokeWidth={2.2} color={colors.ink} />
        </Pressable>

        <View style={styles.titleBlock}>
          <Text style={styles.title}>All talent</Text>
          <Text style={styles.subtitle}>{subtitle.toUpperCase()}</Text>
        </View>

        <Pressable
          style={[
            styles.filterButton,
            activeCount > 0 && styles.filterButtonActive,
          ]}
          onPress={() => setIsFilterSheetOpen(true)}
          accessibilityRole="button"
          accessibilityLabel="Open filters"
        >
          <SlidersHorizontal
            size={16}
            strokeWidth={2.2}
            color={activeCount > 0 ? colors.accent : colors.ink}
          />
          {activeCount > 0 && (
            <View style={styles.badge}>
              <Text style={styles.badgeText}>{activeCount}</Text>
            </View>
          )}
        </Pressable>
      </Animated.View>

      {/* Search bar */}
      <Animated.View
        style={styles.searchContainer}
        entering={FadeInUp.delay(50).duration(350).easing(Easing.out(Easing.ease))}
      >
        <View style={styles.searchPill}>
          <Search size={15} strokeWidth={2.2} color={colors.inkMuted} />
          <TextInput
            style={styles.searchInput}
            value={search}
            onChangeText={setSearch}
            placeholder="Search talent or category..."
            placeholderTextColor={colors.inkSubtle}
            autoCapitalize="none"
            autoCorrect={false}
            returnKeyType="search"
          />
          {search.length > 0 && (
            <Pressable
              style={styles.clearButton}
              onPress={() => setSearch('')}
              accessibilityRole="button"
              accessibilityLabel="Clear search"
              hitSlop={8}
            >
              <X size={12} strokeWidth={2.6} color={colors.inkMuted} />
            </Pressable>
          )}
        </View>
      </Animated.View>

      {/* Results grid */}
      {visibleTalent.length === 0 ? (
        <View style={styles.emptyContainer}>
          <Text style={styles.emptyTitle}>NOTHING MATCHES</Text>
          <Text style={styles.emptyBody}>
            Drop a filter or clear the search to see more talent.
          </Text>
          <Pressable style={styles.resetButton} onPress={handleReset}>
            <Text style={styles.resetButtonText}>Reset filters</Text>
          </Pressable>
        </View>
      ) : (
        <FlatList
          data={visibleTalent}
          renderItem={renderItem}
          keyExtractor={keyExtractor}
          numColumns={2}
          contentContainerStyle={[
            styles.gridContent,
            { paddingBottom: insets.bottom + 30 },
          ]}
          showsVerticalScrollIndicator={false}
          columnWrapperStyle={styles.gridRow}
        />
      )}

      {/* Filter sheet — full reuse */}
      <FilterSheet
        isOpen={isFilterSheetOpen}
        onClose={() => setIsFilterSheetOpen(false)}
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
        onReset={handleReset}
        activeCount={activeCount}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.bg,
  },
  topBar: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingTop: 14,
    paddingBottom: 10,
    gap: 12,
  },
  backButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
    alignItems: 'center',
    justifyContent: 'center',
  },
  titleBlock: {
    flex: 1,
    minWidth: 0,
  },
  title: {
    fontFamily: 'InterTight-ExtraBold',
    fontSize: 20,
    fontWeight: '800',
    letterSpacing: -0.7,
    lineHeight: 22,
    color: colors.ink,
  },
  subtitle: {
    fontFamily: 'JetBrainsMono-SemiBold',
    fontSize: 9.5,
    fontWeight: '600',
    letterSpacing: 1.71,
    textTransform: 'uppercase',
    color: colors.inkMuted,
    marginTop: 3,
  },
  filterButton: {
    position: 'relative',
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
    top: -3,
    right: -3,
    minWidth: 18,
    height: 18,
    paddingHorizontal: 4,
    borderRadius: 9,
    backgroundColor: colors.accent,
    borderWidth: 1.5,
    borderColor: colors.bg,
    alignItems: 'center',
    justifyContent: 'center',
  },
  badgeText: {
    fontFamily: 'JetBrainsMono-Bold',
    fontSize: 9.5,
    fontWeight: '700',
    color: colors.bg,
  },
  searchContainer: {
    paddingHorizontal: 16,
    paddingBottom: 12,
  },
  searchPill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    paddingVertical: 10,
    paddingHorizontal: 14,
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: radii.pill,
  },
  searchInput: {
    flex: 1,
    fontFamily: 'InterTight-Regular',
    fontSize: 14,
    fontWeight: '400',
    color: colors.ink,
    padding: 0,
  },
  clearButton: {
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: colors.surfaceAlt,
    alignItems: 'center',
    justifyContent: 'center',
  },
  gridContent: {
    paddingHorizontal: GRID_PADDING,
    paddingTop: 12,
  },
  gridRow: {
    justifyContent: 'space-between',
    marginBottom: GRID_GAP,
  },
  cardWrapper: {
    width: CARD_WIDTH,
  },
  cardFlex: {
    width: '100%',
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 22,
  },
  emptyTitle: {
    fontFamily: 'JetBrainsMono-SemiBold',
    fontSize: 10,
    fontWeight: '600',
    letterSpacing: 2.2,
    textTransform: 'uppercase',
    color: colors.inkMuted,
    marginBottom: 12,
  },
  emptyBody: {
    fontFamily: 'InterTight-Regular',
    fontSize: 14,
    fontWeight: '400',
    color: colors.ink,
    opacity: 0.7,
    lineHeight: 21,
    textAlign: 'center',
    maxWidth: 260,
    marginBottom: 22,
  },
  resetButton: {
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderWidth: 1,
    borderColor: colors.borderStrong,
    borderRadius: radii.pill,
  },
  resetButtonText: {
    fontFamily: 'InterTight-Bold',
    fontSize: 13,
    fontWeight: '700',
    letterSpacing: -0.195,
    color: colors.ink,
  },
});
