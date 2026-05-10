# Feature: Influencer Storefront
**Technical Plan**
Generated: 2026-05-09
Author: Tech Lead Agent

---

## Architecture Overview

The Influencer Storefront is a shared route (`app/influencer/[id].tsx`) accessible from any tab group. It uses Reanimated v3 for scroll-aware animations and gesture-driven carousel, following existing patterns from the codebase.

---

## File Structure

```
app/
  influencer/
    [id].tsx                     # Main screen component

components/
  influencer/
    storefront/
      TopBar.tsx                 # Scroll-aware sticky header
      HeroCarousel.tsx           # Gesture-driven image pager
      HeaderBlock.tsx            # Status, name, categories, bio
      BentoStats.tsx             # 3-column stats + platforms row
      StatTile.tsx               # Individual stat tile
      PlatformsTile.tsx          # Full-width platforms display
      ServicesList.tsx           # Multi-select service picker
      ServiceRow.tsx             # Individual service row
      ReviewsPreview.tsx         # 2-card preview section
      ReviewCard.tsx             # Individual review card
      StickyCTA.tsx              # Bottom action bar
      SectionHeader.tsx          # Display title + optional action
      index.ts                   # Barrel export

constants/
  mockInfluencerStorefront.ts        # Maya Cohen mock data

types/
  influencer.ts                      # Storefront-specific UI types
```

---

## Route Configuration

### Dynamic Route: `app/influencer/[id].tsx`

Per Expo Router conventions, this is a shared route not nested under any tab group. The `[id]` param is extracted via `useLocalSearchParams()`.

```typescript
import { useLocalSearchParams } from 'expo-router';

export default function InfluencerStorefrontScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  // TODO: For MVP, always shows Maya regardless of id
  // Future: fetch influencer by id from Supabase
}
```

### Navigation from Discover

Modify `app/(business)/discover.tsx` to wire up navigation:

```typescript
import { useRouter } from 'expo-router';

// In component:
const router = useRouter();

// In InfluencerRow callback:
onInfluencerPress={(influencerId) => router.push(`/influencer/${influencerId}`)}
```

---

## Key Implementation Details

### 1. Scroll-Aware TopBar

Use `useAnimatedScrollHandler` from Reanimated to track scroll position and drive animations.

```typescript
// In [id].tsx
const scrollY = useSharedValue(0);
const scrollHandler = useAnimatedScrollHandler({
  onScroll: (event) => {
    scrollY.value = event.contentOffset.y;
  },
});

// Pass to Animated.ScrollView
<Animated.ScrollView onScroll={scrollHandler} scrollEventThrottle={16}>

// In TopBar.tsx - receive scrollY as prop
const backgroundOpacity = useDerivedValue(() => {
  return interpolate(scrollY.value, [260, 280], [0, 1], Extrapolation.CLAMP);
});

const nameOpacity = useDerivedValue(() => {
  return interpolate(scrollY.value, [260, 280], [0, 1], Extrapolation.CLAMP);
});

// Apply with useAnimatedStyle
const animatedBgStyle = useAnimatedStyle(() => ({
  backgroundColor: `rgba(26,24,21,${0.92 * backgroundOpacity.value})`,
  borderBottomWidth: interpolate(backgroundOpacity.value, [0, 1], [0, 1]),
  borderBottomColor: colors.border,
}));
```

### 2. Hero Carousel with Pan Gesture

Use `GestureDetector` with `Gesture.Pan()` for precise control over the swipe animation. NOT FlatList (momentum would feel inconsistent with the 400ms ease design).

```typescript
// In HeroCarousel.tsx
const translateX = useSharedValue(0);
const activeIndex = useSharedValue(0);
const containerWidth = useSharedValue(0);

const panGesture = Gesture.Pan()
  .onUpdate((event) => {
    translateX.value = -activeIndex.value * containerWidth.value + event.translationX;
  })
  .onEnd((event) => {
    const threshold = containerWidth.value * 0.25;
    const velocity = event.velocityX;
    
    let nextIndex = activeIndex.value;
    if (velocity < -500 || (velocity > -500 && event.translationX < -threshold)) {
      nextIndex = Math.min(activeIndex.value + 1, imageCount - 1);
    } else if (velocity > 500 || (velocity < 500 && event.translationX > threshold)) {
      nextIndex = Math.max(activeIndex.value - 1, 0);
    }
    
    activeIndex.value = nextIndex;
    translateX.value = withTiming(-nextIndex * containerWidth.value, {
      duration: 400,
      easing: Easing.bezier(0.4, 0, 0.2, 1),
    });
    
    // Update React state for UI (pagination, counter)
    runOnJS(setCurrentIndex)(nextIndex);
  });
```

### 3. Multi-Select Service State

Track selection order for numbered badges:

```typescript
// In ServicesList.tsx
const [selectedIds, setSelectedIds] = useState<number[]>([]);

const toggleService = (id: number) => {
  setSelectedIds(prev => {
    if (prev.includes(id)) {
      return prev.filter(x => x !== id);
    }
    return [...prev, id];
  });
};

// Get selection order (1-indexed for display)
const getSelectionIndex = (id: number): number => {
  const idx = selectedIds.indexOf(id);
  return idx === -1 ? -1 : idx + 1;
};
```

### 4. Sticky CTA Bar

Position at bottom with blur background:

```typescript
// In StickyCTA.tsx
import { BlurView } from 'expo-blur';

<View style={styles.container}>
  <BlurView intensity={40} tint="dark" style={StyleSheet.absoluteFill} />
  <View style={styles.content}>
    {/* Selection text + button */}
  </View>
</View>

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    overflow: 'hidden',
  },
});
```

### 5. Gradient Scrim for Carousel

Use `expo-linear-gradient`:

```typescript
import { LinearGradient } from 'expo-linear-gradient';

<LinearGradient
  colors={['transparent', 'rgba(26,24,21,0.85)']}
  style={styles.scrim}
/>

const styles = StyleSheet.create({
  scrim: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: 140,
  },
});
```

---

## Dependencies

### Required (already installed)
- `react-native-reanimated` (~3.16.0)
- `react-native-gesture-handler` (~2.20.0)
- `expo-blur` (~14.0.0)
- `expo-image` (~2.0.0)
- `lucide-react-native` (^0.475.0)

### To Add
- `expo-linear-gradient` - for hero carousel scrim

```bash
npx expo install expo-linear-gradient
```

---

## Type Definitions

### `types/influencer.ts`

```typescript
// Platform info for display
export interface InfluencerPlatform {
  name: string;
  icon: 'instagram' | 'tiktok' | 'youtube';
  followers: string;
}

// Service offering
export interface InfluencerService {
  id: number;
  name: string;
  platform: string;
  price: number;
  delivery: string;
}

// Review from a business
export interface InfluencerReview {
  from: string;
  rating: number;
  text: string;
  booked: string;
  date: string;
}

// Full storefront data
export interface InfluencerStorefront {
  id: string;
  name: string;
  handle: string;
  bio: string | null;
  location: string;
  verified: boolean;
  available: boolean;
  rating: number;
  reviewCount: number;
  reach: string;
  categories: string[];
  platforms: InfluencerPlatform[];
  portfolio: string[];
  services: InfluencerService[];
  reviewsPreview: InfluencerReview[];
}
```

---

## Props Flow

```
[id].tsx (InfluencerStorefrontScreen)
  |
  |-- scrollY: SharedValue<number>
  |-- influencer: InfluencerStorefront (mock)
  |-- selectedServiceIds: number[]
  |-- setSelectedServiceIds: Dispatch<SetStateAction<number[]>>
  |-- isFavorited: boolean
  |-- setIsFavorited: Dispatch<SetStateAction<boolean>>
  |
  +-- TopBar
  |     props: scrollY, influencerName, isFavorited, onFavoriteToggle, onBack, onShare
  |
  +-- Animated.ScrollView
  |     |
  |     +-- HeroCarousel
  |     |     props: images (portfolio)
  |     |
  |     +-- HeaderBlock
  |     |     props: name, location, available, verified, categories, bio
  |     |
  |     +-- BentoStats
  |     |     props: reach, rating, reviewCount, platforms
  |     |
  |     +-- ServicesList
  |     |     props: services, selectedIds, onToggle
  |     |
  |     +-- ReviewsPreview
  |           props: reviews, onSeeAllPress
  |
  +-- StickyCTA
        props: selectedServices, total, onRequestBooking
```

---

## Animation Specifications

| Animation | Trigger | Duration | Easing | Values |
|-----------|---------|----------|--------|--------|
| TopBar bg/name fade | Scroll Y > 280px | 250ms | ease (default) | opacity 0->1 |
| Carousel swipe | Pan gesture end | 400ms | bezier(0.4, 0, 0.2, 1) | translateX snap to page |
| Pagination dot width | Active index change | 200ms | ease-out | width 6->22 (active), 22->6 (inactive) |
| Section fade-up | Mount | 500ms | ease-out | opacity 0->1, translateY 8->0 |

---

## Accessibility

- Back button: `accessibilityLabel="Go back"`
- Favorite button: `accessibilityLabel="Add to favorites"` / `accessibilityLabel="Remove from favorites"`
- Share button: `accessibilityLabel="Share profile"`
- Service rows: `accessibilityRole="checkbox"`, `accessibilityState={{ checked: isSelected }}`
- Carousel images: `accessibilityLabel="Portfolio image {n} of {total}"`
- Stars in reviews: `accessibilityLabel="{rating} out of 5 stars"`

---

## Testing Notes

- Carousel: Test snap threshold (25% width OR velocity > 500)
- TopBar: Test scroll position 279 vs 281 for transition trigger
- Services: Test selection order persistence through toggle cycles
- CTA: Test total calculation with multiple services

---

## TODOs (Future PRs)

```typescript
// In [id].tsx
// TODO: Fetch influencer by id from Supabase
// TODO: Handle invalid/missing influencer ID

// In TopBar.tsx
// TODO: Implement share functionality

// In ReviewsPreview.tsx
// TODO: Navigate to full reviews list

// In StickyCTA.tsx
// TODO: Implement booking request flow
```

---

## Commits Strategy

1. `feat(influencer): storefront screen components and mock data`
   - All new files in `components/influencer/storefront/`
   - `constants/mockInfluencerStorefront.ts`
   - `types/influencer.ts`
   - `app/influencer/[id].tsx`

2. `feat(business): wire Discover InfluencerCard to navigate to /influencer/[id]`
   - Modify `app/(business)/discover.tsx`
   - Pass through props in InfluencerRow and InfluencerCard if needed

---

## Sign-off

- [x] File structure defined
- [x] Animation strategy documented
- [x] Props flow mapped
- [x] Dependencies identified
- [x] Types specified
