/**
 * Perk Filter Utilities
 * Helpers for filtering and sorting perks.
 */

import type {
  Perk,
  PerkFilterState,
  ViewerReach,
  PerkSortOption,
  PerkCategory,
} from '@/types/perk';
import { qualifiesForPerk } from './perkQualification';

/**
 * "No sort applied" sentinel. Doesn't match any sort option id, so the
 * PerkFilterSheet's Sort section opens with no option highlighted on
 * initial load. Per project_see_all_decisions, initial state = Discover
 * with no filter or sort applied.
 */
export const NO_SORT = '' as PerkSortOption;

/**
 * Default filter state. `sort` starts at NO_SORT (the sentinel above),
 * not 'recommended', so a user who hasn't picked a sort sees no option
 * highlighted in the filter sheet.
 */
export const DEFAULT_FILTERS: PerkFilterState = {
  categories: [],
  valueMin: 0,
  valueMax: 1000,
  qualifyOnly: false,
  expiringSoonOnly: false,
  sort: NO_SORT,
};

/**
 * Apply all filters to a perk array.
 */
export function applyFilters(
  perks: Perk[],
  topCategory: string, // from category chips ("All" or specific)
  filters: PerkFilterState,
  viewerReach: ViewerReach
): Perk[] {
  return perks.filter((perk) => {
    // Top category chip filter
    if (topCategory !== 'All' && perk.category !== topCategory) {
      return false;
    }
    // Sheet category filter (if any selected)
    if (
      filters.categories.length > 0 &&
      !filters.categories.includes(perk.category)
    ) {
      return false;
    }
    // Value range
    if (perk.value < filters.valueMin || perk.value > filters.valueMax) {
      return false;
    }
    // Qualify only — uses updated qualifiesForPerk that checks all deliverables
    if (filters.qualifyOnly && !qualifiesForPerk(perk, viewerReach)) {
      return false;
    }
    // Expiring soon only
    if (filters.expiringSoonOnly && !perk.expiringSoon) {
      return false;
    }
    return true;
  });
}

/**
 * Sort perks within a row based on sort option.
 */
export function sortPerks(perks: Perk[], sort: PerkSortOption): Perk[] {
  if (sort === 'recommended') {
    return perks; // preserve original order
  }
  const sorted = [...perks];
  switch (sort) {
    case 'value_high':
      return sorted.sort((a, b) => b.value - a.value);
    case 'newest':
      // For MVP, sort by badge="New" first, then by id (proxy for recency)
      return sorted.sort((a, b) => {
        if (a.badge === 'New' && b.badge !== 'New') return -1;
        if (b.badge === 'New' && a.badge !== 'New') return 1;
        return a.id.localeCompare(b.id);
      });
    case 'expiring':
      return sorted.sort((a, b) => {
        if (a.expiringSoon && !b.expiringSoon) return -1;
        if (b.expiringSoon && !a.expiringSoon) return 1;
        return 0;
      });
    default:
      return perks;
  }
}

/**
 * Count active filters for badge display.
 */
export function countActiveFilters(filters: PerkFilterState): number {
  let count = 0;
  if (filters.categories.length > 0) count += filters.categories.length;
  if (filters.valueMin !== 0 || filters.valueMax !== 1000) count += 1;
  if (filters.qualifyOnly) count += 1;
  if (filters.expiringSoonOnly) count += 1;
  if (filters.sort !== NO_SORT) count += 1;
  return count;
}

/**
 * Check if any filters are active.
 */
export function hasActiveFilters(filters: PerkFilterState): boolean {
  return countActiveFilters(filters) > 0;
}

/**
 * Generate active filter chip data for display.
 */
export function getActiveFilterChips(
  filters: PerkFilterState
): { key: string; label: string }[] {
  const chips: { key: string; label: string }[] = [];

  // Categories
  filters.categories.forEach((cat) => {
    chips.push({ key: `category-${cat}`, label: cat });
  });

  // Value range (only if non-default)
  if (filters.valueMin !== 0 || filters.valueMax !== 1000) {
    chips.push({
      key: 'value-range',
      label: `₪${filters.valueMin} → ₪${filters.valueMax}`,
    });
  }

  // Qualify only
  if (filters.qualifyOnly) {
    chips.push({ key: 'qualify', label: 'I qualify' });
  }

  // Expiring soon
  if (filters.expiringSoonOnly) {
    chips.push({ key: 'expiring', label: 'Expiring soon' });
  }

  // Sort (only if non-default)
  if (filters.sort !== NO_SORT) {
    const sortLabels: Record<PerkSortOption, string> = {
      recommended: 'Best match',
      value_high: 'Value: high → low',
      newest: 'Newest',
      expiring: 'Expiring soonest',
    };
    chips.push({ key: 'sort', label: sortLabels[filters.sort] });
  }

  return chips;
}

/**
 * Remove a filter by chip key.
 */
export function removeFilter(
  filters: PerkFilterState,
  chipKey: string
): PerkFilterState {
  const newFilters = { ...filters };

  if (chipKey.startsWith('category-')) {
    const category = chipKey.replace('category-', '') as PerkCategory;
    newFilters.categories = filters.categories.filter((c) => c !== category);
  } else if (chipKey === 'value-range') {
    newFilters.valueMin = 0;
    newFilters.valueMax = 1000;
  } else if (chipKey === 'qualify') {
    newFilters.qualifyOnly = false;
  } else if (chipKey === 'expiring') {
    newFilters.expiringSoonOnly = false;
  } else if (chipKey === 'sort') {
    newFilters.sort = NO_SORT;
  }

  return newFilters;
}
