# Influencer Discover (Perks) - Technical Plan

**Feature:** Influencer Discover Tab  
**Version:** 1.0 (MVP)  
**Date:** 2026-05-11  
**Status:** APPROVED

---

## Architecture Overview

### Screen Location
- **Route:** `app/(influencer)/discover.tsx` (replaces existing stub)
- **Components:** `components/influencer/discover/`

### Data Flow
```
Screen State (filters, category, loading)
    |
    v
Filter Logic (lib/perkFilters.ts)
    |
    v
Mock Data (constants/mockInfluencerPerks.ts)
    |
    v
Qualification Check (lib/perkQualification.ts)
    |
    v
Rendered UI
```

---

## Data Models

### types/perk.ts

```typescript
/**
 * Platform identifiers for reach/qualification checks.
 * Maps to MAYA_COHEN.platforms[].name in a normalized form.
 */
export type PerkPlatform = 'IG' | 'TikTok' | 'YouTube';

/**
 * Category options for perks.
 */
export type PerkCategory = 
  | 'Food' 
  | 'Fitness' 
  | 'Beauty' 
  | 'Lifestyle' 
  | 'Wellness' 
  | 'Drinks';

/**
 * A single perk offer from a business.
 */
export interface Perk {
  id: string;
  title: string;
  business: string;
  businessMonogram: string;
  value: number; // NIS
  cover: string; // image URL
  requiredAction: string; // e.g., "3 IG Stories"
  requiredPlatform: PerkPlatform;
  requiredFollowers: number; // minimum followers needed
  category: PerkCategory;
  slotsLeft: number;
  slotsTotal: number;
  badge: string | null; // "Top match", "New", etc.
  expiringSoon: boolean;
}

/**
 * A curated row of perks (for "Top match", "Expiring soon", etc.)
 */
export interface PerkRow {
  id: string;
  title: string;
  subtitle: string | null;
  perkIds: string[];
}

/**
 * Viewer reach data for qualification checks.
 * Keys match PerkPlatform type.
 */
export interface ViewerReach {
  IG: number;
  TikTok: number;
  YouTube: number;
}

/**
 * Sort options for the filter sheet.
 */
export type PerkSortOption = 
  | 'recommended' 
  | 'value_high' 
  | 'newest' 
  | 'expiring';

/**
 * Filter state shape for the Discover screen.
 */
export interface PerkFilterState {
  categories: PerkCategory[];
  valueMin: number;
  valueMax: number;
  qualifyOnly: boolean;
  expiringSoonOnly: boolean;
  sort: PerkSortOption;
}
```

---

## File Structure

```
app/(influencer)/
  discover.tsx                    # Main screen (replaces stub)

components/influencer/discover/
  DiscoverHeader.tsx              # Title + filter button with badge
  CategoryChips.tsx               # Horizontal single-select chips
  ActiveFilterChipBar.tsx         # Removable filter chips below categories
  PerkRow.tsx                     # Section row with title + horizontal scroll
  PerkCard.tsx                    # Individual perk card (200px wide)
  PerkFilterSheet.tsx             # Bottom sheet with all filter options
  FilterSection.tsx               # Reusable section wrapper for sheet
  EmptyState.tsx                  # No results state
  SkeletonRow.tsx                 # Loading skeleton row

constants/
  mockInfluencerPerks.ts          # Mock perk data + rows + viewer reach

types/
  perk.ts                         # Perk, PerkRow, ViewerReach, filter types

lib/
  perkQualification.ts            # qualifies(perk, viewerReach) helper
  perkFilters.ts                  # applyFilters, sortPerks utilities
```

---

## Component Breakdown

### DiscoverHeader
- Props: `activeFilterCount: number`, `onFilterPress: () => void`
- Renders title "Discover" + filter button
- Filter button shows count badge when `activeFilterCount > 0`

### CategoryChips
- Props: `selected: string`, `onSelect: (category: string) => void`
- Options: ["All", "Food", "Fitness", "Beauty", "Lifestyle", "Wellness", "Drinks"]
- Single-select behavior

### ActiveFilterChipBar
- Props: `filters: PerkFilterState`, `onRemoveFilter: (key) => void`, `onClearAll: () => void`
- Only renders when `hasActiveFilters` is true
- Generates chips based on filter state

### PerkRow
- Props: `row: PerkRow`, `perks: Perk[]`, `viewerReach: ViewerReach`
- Renders title, optional subtitle, SEE ALL button, horizontal card scroll

### PerkCard
- Props: `perk: Perk`, `viewerReach: ViewerReach`
- 200px width, 4:5 cover, frosted badges, qualification status

### PerkFilterSheet
- Props: `isOpen`, `onClose`, `filters`, `setFilters`, `onReset`
- Bottom sheet with pan-to-dismiss
- All filter sections + sticky footer

### EmptyState
- Props: `onReset: () => void`
- Headline, caption, body, reset button

### SkeletonRow
- Props: `rowIndex: number`
- Shimmer animation, 2 visible cards

---

## State Management

All state lives in the main screen component:

```typescript
// Screen state
const [isLoading, setIsLoading] = useState(true);
const [isFilterSheetOpen, setIsFilterSheetOpen] = useState(false);
const [selectedCategory, setSelectedCategory] = useState('All');
const [filters, setFilters] = useState<PerkFilterState>(DEFAULT_FILTERS);

// Derived state
const filteredPerks = useMemo(() => {
  return applyFilters(PERKS, selectedCategory, filters, VIEWER_REACH);
}, [selectedCategory, filters]);

const activeFilterCount = useMemo(() => {
  return countActiveFilters(filters);
}, [filters]);
```

---

## Qualification Logic

**File:** `lib/perkQualification.ts`

```typescript
import type { Perk, ViewerReach, PerkPlatform } from '@/types/perk';

/**
 * Check if viewer qualifies for a perk based on their reach.
 */
export function qualifiesForPerk(
  perk: Perk,
  viewerReach: ViewerReach
): boolean {
  const viewerFollowers = viewerReach[perk.requiredPlatform];
  return viewerFollowers >= perk.requiredFollowers;
}

/**
 * Format follower count for display (e.g., 47200 -> "47K")
 */
export function formatFollowers(count: number): string {
  if (count >= 1000000) {
    return `${(count / 1000000).toFixed(1).replace(/\.0$/, '')}M`;
  }
  if (count >= 1000) {
    return `${Math.floor(count / 1000)}K`;
  }
  return String(count);
}
```

---

## Filter Logic

**File:** `lib/perkFilters.ts`

```typescript
import type { Perk, PerkFilterState, ViewerReach, PerkSortOption } from '@/types/perk';
import { qualifiesForPerk } from './perkQualification';

export const DEFAULT_FILTERS: PerkFilterState = {
  categories: [],
  valueMin: 0,
  valueMax: 1000,
  qualifyOnly: false,
  expiringSoonOnly: false,
  sort: 'recommended',
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
    if (filters.categories.length > 0 && !filters.categories.includes(perk.category)) {
      return false;
    }
    // Value range
    if (perk.value < filters.valueMin || perk.value > filters.valueMax) {
      return false;
    }
    // Qualify only
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
  if (filters.sort !== 'recommended') count += 1;
  return count;
}
```

---

## Mock Data Location

**File:** `constants/mockInfluencerPerks.ts`

Contains:
- `PERKS: Perk[]` - Array of 6 mock perks
- `PERK_ROWS: PerkRow[]` - 4 curated rows
- `VIEWER_REACH: ViewerReach` - Maya's follower counts
- `CATEGORIES_CHIPS: string[]` - For top chips
- `CATEGORIES_FILTER: PerkCategory[]` - For sheet (no "All")
- `SORT_OPTIONS` - Sort option list for sheet

---

## Technical Decisions

### No Shared Components with Business Discover
Despite similar patterns (FilterSheet, SkeletonRow, EmptyState), the Influencer Discover creates its own components because:
1. Different data models (Perk vs Influencer)
2. Different filter facets (value range vs price range, qualify vs available)
3. Different card layouts (PerkCard has badges, scrim, qualification row)

Some low-level patterns can be observed (shimmer recipe, sheet animation), but components are not shared.

### ScreenHeader Extension
The existing `ScreenHeader` component accepts `rightCaption` (text), but the filter button needs an interactive right slot. Options:
1. Extend ScreenHeader with `rightSlot?: ReactNode`
2. Create bespoke DiscoverHeader

**Decision:** Create `DiscoverHeader` component that matches ScreenHeader's vertical metrics (paddingTop: safeArea + 16, paddingBottom: 14) for visual parity. This avoids modifying the shared component and keeps the filter button logic self-contained.

### Viewer Reach Hardcoding
For MVP, hardcode:
```typescript
const VIEWER_REACH: ViewerReach = { IG: 47200, TikTok: 82100, YouTube: 8400 };
```

**Follow-up:** Create `lib/reachParser.ts` to extract numeric values from `MAYA_COHEN.platforms`:
```typescript
// Future: parseFollowers("47.2K") -> 47200
```

---

## Performance Considerations

1. **Memoization:** Use `useMemo` for filtered/sorted perk arrays
2. **FlatList:** Use `FlatList` with `horizontal` for card scrolls (better than ScrollView for many items)
3. **Image optimization:** Perk covers use `?w=600&q=80` query params for reasonable size

---

## Testing Checklist

- [ ] TypeScript strict mode passes
- [ ] Loading state shows 3 skeleton rows
- [ ] Content state shows 4 perk rows
- [ ] Empty state triggers when filters yield zero perks
- [ ] Category chip selection filters perks
- [ ] Filter sheet opens/closes with animation
- [ ] Each filter facet works correctly
- [ ] Active filter chips appear and are removable
- [ ] Qualification status shows correctly per perk
- [ ] Sort reorders perks within rows

---

## Follow-up Items

1. **Reach parser utility** - Extract numeric follower counts from storefront platform strings
2. **SEE ALL navigation** - Wire up row buttons to filtered list view
3. **Perk detail screen** - Tap card to open detail/claim flow
4. **Real API integration** - Replace mock data with Supabase queries
