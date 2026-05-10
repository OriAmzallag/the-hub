# Feature: Business Discover Screen - Technical Plan

**Date**: 2026-05-09  
**Author**: Tech Lead Agent  
**Status**: APPROVED

---

## 1. Overview

This technical plan covers two parts:
1. **Part 1**: Rename `business` -> `business` across the codebase (route group, components, types, mocks)
2. **Part 2**: Implement the Business Discover screen

---

## 2. Part 1: Rename business -> business

### 2.1 Files to Rename (using git mv)

| Old Path | New Path |
|----------|----------|
| `app/(business)/` | `app/(business)/` |
| `app/(business)/_layout.tsx` | `app/(business)/_layout.tsx` |
| `app/(business)/index.tsx` | `app/(business)/index.tsx` |
| `app/(business)/discover.tsx` | `app/(business)/discover.tsx` |
| `app/(business)/inquiries.tsx` | `app/(business)/inquiries.tsx` |
| `app/(business)/profile.tsx` | `app/(business)/profile.tsx` |
| `components/business/` | `components/business/` |
| `types/business.ts` | `types/business.ts` |
| `constants/mockBusinessDashboard.ts` | `constants/mockBusinessDashboard.ts` |

### 2.2 Symbol Renames (in migrated files)

| Old Symbol | New Symbol | Files Affected |
|------------|------------|----------------|
| `BusinessLayout` | `BusinessLayout` | `app/(business)/_layout.tsx` |
| `BusinessDashboardScreen` | `BusinessDashboardScreen` | `app/(business)/index.tsx` |
| `Business` (interface) | `Business` | `types/business.ts` |
| `BusinessStats` | `BusinessStats` | `types/business.ts` |
| `BusinessDashboardData` | `BusinessDashboardData` | `types/business.ts` |
| `MOCK_BUSINESS_DASHBOARD` | `MOCK_BUSINESS_DASHBOARD` | `constants/mockBusinessDashboard.ts` |
| `MOCK_BUSINESS_DASHBOARD_EMPTY` | `MOCK_BUSINESS_DASHBOARD_EMPTY` | `constants/mockBusinessDashboard.ts` |

### 2.3 Import Updates

| File | Old Import | New Import |
|------|------------|------------|
| `app/(business)/_layout.tsx` | `@/components/business/CustomTabBar` | `@/components/business/CustomTabBar` |
| `app/(business)/index.tsx` | `@/constants/mockBusinessDashboard` | `@/constants/mockBusinessDashboard` |
| `app/(business)/index.tsx` | `@/components/business/*` | `@/components/business/*` |
| `components/business/TopBar.tsx` | `@/types/business` | `@/types/business` |
| `components/business/AttentionBanner.tsx` | `@/types/business` | `@/types/business` |
| `components/business/DealRow.tsx` | `@/types/business` | `@/types/business` |
| `components/business/PerkRow.tsx` | `@/types/business` | `@/types/business` |
| `constants/mockBusinessDashboard.ts` | `@/types/business` | `@/types/business` |

### 2.4 Files NOT to Rename (Scope Leak Prevention)

- `types/models.ts` - `BusinessProfile` entity stays as-is (database model)
- `supabase/migrations/0004_create_business_profiles.sql` - Database schema unchanged
- `references/business-dashboard.reference.jsx` - Historical reference file
- `stores/authStore.ts` - `selectIsHunter` selector stays (checks role='business')
- `stores/index.ts` - Export of `selectIsHunter` stays
- `feature-business-dashboard-*.md` - Historical docs, filenames stay

### 2.5 Comment Updates

Update doc comments in renamed files:
- "Business Dashboard" -> "Business Dashboard"
- "business (business) users" -> "business users"
- "business-specific components" -> "business-specific components"
- "Business (business) dashboard" -> "Business dashboard"

---

## 3. Part 2: Business Discover Implementation

### 3.1 New File Structure

```
app/(business)/
  discover.tsx                    # Main Discover screen (replaces placeholder)

components/business/discover/     # NEW directory
  index.ts                        # Barrel export
  DiscoverHeader.tsx              # Search bar + filter button
  CategoryChips.tsx               # Horizontal category chip list
  InfluencerCard.tsx                  # Individual influencer card
  InfluencerRow.tsx                   # Row with title + horizontal scroll of cards
  SkeletonRow.tsx                 # Loading skeleton variant
  EmptyState.tsx                  # No results hero
  FilterSheet.tsx                 # Bottom sheet container
  FilterSection.tsx               # Section header + hint + body wrapper
  RangeSlider.tsx                 # Custom slider for location

constants/
  mockBusinessDiscover.ts         # NEW - Mock INFLUENCER, ROWS, CATEGORIES, PLATFORMS, SORT_OPTIONS
```

### 3.2 Component Hierarchy

```
DiscoverScreen
  |-- DiscoverHeader
  |     |-- TextInput (search)
  |     |-- Pressable (filter button)
  |
  |-- CategoryChips (horizontal ScrollView)
  |     |-- Chip (mapped)
  |
  |-- ScrollView (body)
  |     |-- [loading state] SkeletonRow (x3)
  |     |-- [content state] InfluencerRow (x5)
  |     |     |-- InfluencerCard (mapped)
  |     |-- [empty state] EmptyState
  |
  |-- FilterSheet (Modal / absolute positioned)
  |     |-- Animated.View (overlay)
  |     |-- Animated.View (sheet)
  |           |-- Drag handle
  |           |-- Header (title + close)
  |           |-- ScrollView (body)
  |           |     |-- FilterSection (Location)
  |           |     |     |-- RangeSlider
  |           |     |-- FilterSection (Price)
  |           |     |     |-- NumberInput (x2)
  |           |     |-- FilterSection (Platform)
  |           |     |     |-- Chip (x4)
  |           |     |-- FilterSection (Rating)
  |           |     |     |-- RatingButton (x5)
  |           |     |-- FilterSection (Availability)
  |           |     |     |-- ToggleButton
  |           |     |-- FilterSection (Sort)
  |           |           |-- RadioCard (x5)
  |           |-- Sticky Footer
  |                 |-- Reset button
  |                 |-- Apply button
  |
  |-- CustomTabBar (from components/business/)
```

### 3.3 State Management

All state is local to `DiscoverScreen` (no Zustand for this PR):

```typescript
// Render state
const [renderState, setRenderState] = useState<'loading' | 'content' | 'empty'>('loading');

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
```

### 3.4 State Machine

```
MOUNT
  |
  v
[loading] --(setTimeout 800-1200ms)--> [content]
  |                                         |
  |                                         v
  |                               (check filters)
  |                                    /    \
  |                            matches?    no matches
  |                                |           |
  |                                v           v
  |                           [content]    [empty]
  |                                |           |
  |                                +-----+-----+
  |                                      |
  |                              (reset filters)
  |                                      |
  |                                      v
  +---------------------------------->[content]
```

Empty state trigger (deterministic for mock):
```typescript
const isEmptyState = 
  filterPriceMax < 50 || 
  (activeCategory !== 'All' && !INFLUENCER.some(t => t.categories.includes(activeCategory)));
```

### 3.5 Animation Strategy

Using `react-native-reanimated` v3.16 (worklet-safe):

| Animation | Implementation |
|-----------|----------------|
| pulse-dot | Existing `PulsingDot` component - reuse |
| fade-up | `useAnimatedStyle` + `withTiming` on mount, `entering={FadeInUp}` |
| shimmer | `useSharedValue` driving `LinearGradient` start/end positions via `useAnimatedProps` |
| sheet-rise | `useAnimatedStyle` + `withTiming` + custom cubic-bezier via `Easing.bezier` |
| overlay-fade | `useAnimatedStyle` + `withTiming` for opacity |

**Fade-up with stagger:**
```typescript
// InfluencerRow receives delayIndex prop
const entering = FadeInUp.delay(delayIndex * 50).duration(400).easing(Easing.out(Easing.ease));
```

**Shimmer animation:**
```typescript
const shimmerPosition = useSharedValue(-1);
useEffect(() => {
  shimmerPosition.value = withRepeat(
    withTiming(1, { duration: 1600, easing: Easing.linear }),
    -1,
    false
  );
}, []);
// Use shimmerPosition to interpolate LinearGradient locations
```

**Sheet animation:**
```typescript
const translateY = useSharedValue(screenHeight);
useEffect(() => {
  if (isOpen) {
    translateY.value = withTiming(0, {
      duration: 420,
      easing: Easing.bezier(0.32, 0.72, 0, 1),
    });
  }
}, [isOpen]);
```

### 3.6 Slider Dependency Decision

**Decision: Build custom slider with Reanimated**

Rationale:
- `@react-native-community/slider` requires native rebuild
- Custom slider matches design exactly (no platform-specific styling)
- Already have react-native-gesture-handler + reanimated

Implementation:
```typescript
// RangeSlider.tsx
// - PanGestureHandler for thumb drag
// - useAnimatedGestureHandler for position
// - Animated.View for track fill
// - Convert position to 1-50 value
```

### 3.7 Mock Data File

`constants/mockBusinessDiscover.ts`:
```typescript
export interface Influencer {
  id: string;
  name: string;
  photo: string;
  rating: number | null;
  badge: string | null;
  available: boolean;
  categories: string[];
}

export interface InfluencerRow {
  id: string;
  title: string;
  subtitle: string | null;
  influencerIds: string[];
}

export interface Platform {
  id: string;
  label: string;
  iconName: 'Instagram' | 'Music2' | 'Youtube' | 'CalendarClock';
}

export interface SortOption {
  id: string;
  label: string;
}

export const INFLUENCER: Influencer[] = [...]; // 7 items from reference
export const ROWS: InfluencerRow[] = [...]; // 5 items from reference
export const CATEGORIES: string[] = [...]; // 8 items
export const PLATFORMS: Platform[] = [...]; // 4 items
export const SORT_OPTIONS: SortOption[] = [...]; // 5 items
```

### 3.8 Key Implementation Details

**DiscoverHeader.tsx**
- `TextInput` with `returnKeyType="search"`
- Border color interpolates based on `searchValue.length > 0`
- Filter button uses `Pressable` with `accessibilityLabel="Filters"`

**CategoryChips.tsx**
- `ScrollView` with `horizontal` + `showsHorizontalScrollIndicator={false}`
- Chips use `Pressable` for tap handling
- Active chip: `backgroundColor: colors.accent`, `shadowColor: colors.accentShadow`

**InfluencerCard.tsx**
- `expo-image` for photo with `contentFit="cover"`
- `expo-blur` BlurView for badge pill background
- Gradient scrim via `LinearGradient` from expo-linear-gradient OR semi-transparent View
- **Note**: expo-linear-gradient not in deps - use View with semi-transparent gradient fallback

**InfluencerRow.tsx**
- Accepts `row` prop + `delayIndex` for stagger
- Uses Reanimated `entering` prop for fade-up
- Inner `ScrollView` horizontal for cards

**SkeletonRow.tsx**
- Static structure matching InfluencerRow layout
- Shimmer via Animated LinearGradient
- 3 rows with varying header widths (200/140/140)

**FilterSheet.tsx**
- Uses `Modal` with `transparent` OR absolute positioned overlay
- Reanimated for sheet slide + overlay fade
- `KeyboardAvoidingView` wraps sheet content
- `ScrollView` for body with `keyboardShouldPersistTaps="handled"`

**RangeSlider.tsx**
- `GestureDetector` from react-native-gesture-handler v2
- Gesture.Pan() for thumb drag
- `runOnJS` for state updates from worklet
- Track: full-width View with fill View inside
- Thumb: absolute positioned circle

---

## 4. File-by-File Implementation Plan

### 4.1 Part 1 Commits (Rename)

**Single commit**: `refactor: rename "business" -> "business" for SMB-side route group, components, types, mocks`

```bash
# 1. Rename directories
git mv app/\(business\) app/\(business\)
git mv components/business components/business

# 2. Rename files
git mv types/business.ts types/business.ts
git mv constants/mockBusinessDashboard.ts constants/mockBusinessDashboard.ts

# 3. Update file contents (symbol renames + imports)
# ... (manual edits)

# 4. Verify
npx tsc --noEmit

# 5. Commit
git add -A
git commit -m "refactor: rename \"business\" -> \"business\" for SMB-side route group, components, types, mocks"
```

### 4.2 Part 2 Commits (Discover Screen)

**Commit 1**: `feat(business): add mock data for Discover screen`
- Create `constants/mockBusinessDiscover.ts`

**Commit 2**: `feat(business): implement Discover screen components`
- Create `components/business/discover/` directory
- Implement all components
- Create barrel export

**Commit 3**: `feat(business): implement Discover screen`
- Replace `app/(business)/discover.tsx` placeholder
- Wire up all state and components

Or consolidate into single commit if cleaner:
`feat(business): implement Discover screen with filter panel and animations`

---

## 5. Testing Verification

After implementation:
```bash
npx tsc --noEmit  # Must pass clean
```

Manual verification (by user on iOS sim):
- Screen renders without crash
- Fonts display correctly
- Animations are smooth
- Filter sheet opens/closes
- Tab bar shows Discover as active

---

## 6. Risks and Mitigations

| Risk | Impact | Mitigation |
|------|--------|------------|
| LinearGradient not installed | Shimmer won't work | Use View with opacity layers OR add expo-linear-gradient |
| Slider gesture conflicts | Poor UX | Test on simulator, adjust hit slop |
| BlurView performance | Janky on low-end | Already have expo-blur, tested on dashboard |
| Large component file | Maintenance debt | Split into focused components as planned |

---

## 7. Dependencies Check

**Already installed** (package.json verified):
- react-native-reanimated: ~3.16.0
- react-native-gesture-handler: ~2.20.0
- expo-blur: ~14.0.0
- expo-image: ~2.0.0
- lucide-react-native: ^0.475.0

**May need** (decide during implementation):
- expo-linear-gradient: For shimmer effect. If not installed, use fallback.

**Checking expo-linear-gradient:**
Not in package.json - will implement shimmer using Reanimated opacity animation as fallback, or View layers.
