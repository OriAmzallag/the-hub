/**
 * See All — Perks (Influencer)
 *
 * Unified grid destination for all curated perk rows on the Discover surface.
 * Route param `entry` drives the initial sort; subsequent changes come from
 * the filter sheet. Reuses PerkCard and PerkFilterSheet — no rewrites.
 *
 * Locked decisions (DO NOT NEGOTIATE):
 * 1. One screen, not many — entry param drives initial sort only
 * 2. Reuse PerkCard, PerkFilterSheet — no duplication
 * 3. Entry-point→sort mapping: best_match→best_match, expiring→expiring, new→newest, near_you→best_match
 * 4. Sort taxonomy: Best match, Expires soonest, Newest, Value: high → low, Value: low → high
 * 5. Subtitle = live sort label (not entry label)
 * 6. Filter badge count includes sort when ≠ best_match
 */

import React, { useState, useMemo, useCallback, useEffect, useRef } from 'react';
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
import { PerkCard } from '@/components/influencer/discover/PerkCard';
import { PerkFilterSheet } from '@/components/influencer/discover/PerkFilterSheet';
import {
  PERKS,
  VIEWER_REACH,
} from '@/constants/mockInfluencerPerks';
import type { Perk, PerkFilterState, PerkSortOption } from '@/types/perk';
import { qualifiesForPerk } from '@/lib/perkQualification';

const { width: SCREEN_WIDTH } = Dimensions.get('window');
const GRID_GAP = 12;
const GRID_PADDING = 16;
const CARD_WIDTH = (SCREEN_WIDTH - GRID_PADDING * 2 - GRID_GAP) / 2;

// Entry-point → initial sort mapping (LOCKED)
const ENTRY_SORT_MAP: Record<string, PerkSortOption> = {
  best_match: 'recommended',
  expiring: 'expiring',
  new: 'newest',
  near_you: 'recommended',
  // Row IDs from PERK_ROWS
  'row-match': 'recommended',
  'row-expiring': 'expiring',
  'row-new': 'newest',
  'row-tlv': 'recommended',
};

// Sort ID → display label (LOCKED)
const SORT_LABELS: Record<PerkSortOption, string> = {
  recommended: 'Best match',
  expiring: 'Expires soonest',
  newest: 'Newest',
  value_high: 'Value: high → low',
};

// Default filter state
const DEFAULT_FILTERS: PerkFilterState = {
  categories: [],
  valueMin: 0,
  valueMax: 1000,
  qualifyOnly: false,
  expiringSoonOnly: false,
  sort: 'recommended',
};

export default function SeeAllPerksScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { entry } = useLocalSearchParams<{ entry?: string }>();

  // Derive initial sort from entry param
  const initialSort = entry ? ENTRY_SORT_MAP[entry] || 'recommended' : 'recommended';

  // State
  const [search, setSearch] = useState('');
  const [filters, setFilters] = useState<PerkFilterState>({
    ...DEFAULT_FILTERS,
    sort: initialSort,
  });
  const [isFilterSheetOpen, setIsFilterSheetOpen] = useState(false);

  // Apply entry-driven sort exactly once when `entry` resolves. useState only
  // captures the initial value; on native, useLocalSearchParams can populate
  // async after first render, which would leave sort stuck at the default.
  const entrySortAppliedRef = useRef(false);
  useEffect(() => {
    if (!entry || entrySortAppliedRef.current) return;
    const mapped = ENTRY_SORT_MAP[entry];
    if (!mapped) return;
    entrySortAppliedRef.current = true;
    setFilters((prev) =>
      prev.sort === mapped ? prev : { ...prev, sort: mapped }
    );
  }, [entry]);

  // Filter + sort logic
  const visiblePerks = useMemo(() => {
    let result = [...PERKS];

    // Search filter
    if (search.trim()) {
      const term = search.toLowerCase().trim();
      result = result.filter(
        (perk) =>
          perk.title.toLowerCase().includes(term) ||
          perk.business.toLowerCase().includes(term)
      );
    }

    // Category filter
    if (filters.categories.length > 0) {
      result = result.filter((perk) => filters.categories.includes(perk.category));
    }

    // Value range
    result = result.filter(
      (perk) => perk.value >= filters.valueMin && perk.value <= filters.valueMax
    );

    // Qualify only
    if (filters.qualifyOnly) {
      result = result.filter((perk) => qualifiesForPerk(perk, VIEWER_REACH));
    }

    // Expiring soon only
    if (filters.expiringSoonOnly) {
      result = result.filter((perk) => perk.expiringSoon);
    }

    // Sort
    switch (filters.sort) {
      case 'expiring':
        result.sort((a, b) => (b.expiringSoon ? 1 : 0) - (a.expiringSoon ? 1 : 0));
        break;
      case 'newest':
        result.sort((a, b) => {
          if (a.badge === 'New' && b.badge !== 'New') return -1;
          if (b.badge === 'New' && a.badge !== 'New') return 1;
          return 0;
        });
        break;
      case 'value_high':
        result.sort((a, b) => b.value - a.value);
        break;
      default:
        // recommended — keep original order
        break;
    }

    return result;
  }, [search, filters]);

  // Active count: filters + 1 if sort ≠ default
  const activeCount = useMemo(() => {
    let count = 0;
    if (filters.categories.length > 0) count += filters.categories.length;
    if (filters.valueMin > 0 || filters.valueMax < 1000) count += 1;
    if (filters.qualifyOnly) count += 1;
    if (filters.expiringSoonOnly) count += 1;
    if (filters.sort !== 'recommended') count += 1;
    return count;
  }, [filters]);

  // Live subtitle = current sort label + count
  const sortLabel = SORT_LABELS[filters.sort] || 'Best match';
  const countLabel = `${visiblePerks.length} ${visiblePerks.length === 1 ? 'perk' : 'perks'}`;
  const subtitle = `${sortLabel} · ${countLabel}`;

  // Reset all
  const handleReset = useCallback(() => {
    setSearch('');
    setFilters({ ...DEFAULT_FILTERS, sort: 'recommended' });
  }, []);

  // Render card with grid width
  const renderItem = useCallback(
    ({ item }: { item: Perk }) => (
      <View style={styles.cardWrapper}>
        <PerkCard
          perk={item}
          viewerReach={VIEWER_REACH}
          style={styles.cardFlex}
        />
      </View>
    ),
    []
  );

  const keyExtractor = useCallback((item: Perk) => item.id, []);

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
          <Text style={styles.title}>All perks</Text>
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
            placeholder="Search perks or business..."
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
      {visiblePerks.length === 0 ? (
        <View style={styles.emptyContainer}>
          <Text style={styles.emptyTitle}>NOTHING MATCHES</Text>
          <Text style={styles.emptyBody}>
            Drop a filter or clear the search to see more perks.
          </Text>
          <Pressable style={styles.resetButton} onPress={handleReset}>
            <Text style={styles.resetButtonText}>Reset filters</Text>
          </Pressable>
        </View>
      ) : (
        <FlatList
          data={visiblePerks}
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
      <PerkFilterSheet
        isOpen={isFilterSheetOpen}
        onClose={() => setIsFilterSheetOpen(false)}
        filters={filters}
        setFilters={setFilters}
        onReset={() => setFilters({ ...DEFAULT_FILTERS, sort: 'recommended' })}
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
