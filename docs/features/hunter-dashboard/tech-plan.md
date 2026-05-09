# Feature: Hunter Dashboard
## Technical Implementation Plan

**Author:** Tech Lead Agent  
**Date:** 2026-05-09  
**Status:** APPROVED FOR DEVELOPMENT

---

## 1. Architecture Overview

The Hunter Dashboard is the first real screen in The Hub. It follows a component-based architecture with:
- Screen-level component at `app/(hunter)/index.tsx`
- Reusable UI components in `components/hunter/`
- Shared UI primitives in `components/ui/`
- Mock data co-located in `constants/mockHunterDashboard.ts`
- Updated theme tokens in `constants/theme.ts`

---

## 2. File Plan

### 2.1 Files to CREATE

| File | Purpose |
|------|---------|
| `app/(hunter)/index.tsx` | Main dashboard screen |
| `app/(hunter)/discover.tsx` | Placeholder screen for Discover tab |
| `app/(hunter)/inquiries.tsx` | Placeholder screen for Inquiries tab |
| `app/(hunter)/profile.tsx` | Placeholder screen for Profile tab |
| `components/hunter/TopBar.tsx` | Header with greeting, name, notification bell, avatar |
| `components/hunter/AttentionBanner.tsx` | Urgent action banner (rating due, etc.) |
| `components/hunter/DealRow.tsx` | Single deal item in the deals list |
| `components/hunter/ActionTile.tsx` | Quick action button (Find talent, Post perk) |
| `components/hunter/PerkRow.tsx` | Single perk item with progress bar |
| `components/hunter/StatTile.tsx` | Single stat card in overview grid |
| `components/hunter/SectionHeader.tsx` | Reusable section header with optional count/action |
| `components/ui/PulsingDot.tsx` | Animated notification indicator |
| `constants/mockHunterDashboard.ts` | Mock data (Hunter, Deals, Perks, Stats, Attention items) |
| `types/hunter.ts` | TypeScript types for dashboard data shapes |

### 2.2 Files to MODIFY

| File | Changes |
|------|---------|
| `app/(hunter)/_layout.tsx` | Configure tab navigator with 4 tabs, custom styling |
| `app/_layout.tsx` | Add font loading (Inter Tight, JetBrains Mono) with splash gating |
| `constants/theme.ts` | Replace light theme with "Metal x Sunset Orange" dark theme |
| `tailwind.config.js` | Update color tokens to match new dark theme |

---

## 3. Component Decomposition

```
HunterDashboard (Screen)
├── TopBar
│   ├── Greeting (time-based)
│   ├── Hunter Name
│   ├── NotificationBell + PulsingDot
│   └── AvatarMonogram
├── ScrollView
│   ├── AttentionBanner (conditional)
│   │   └── AttentionItem[]
│   ├── SectionHeader ("Active deals", count)
│   │   └── DealRow[]
│   ├── SectionHeader ("Quick actions")
│   │   └── ActionTile[] (2-col grid)
│   ├── SectionHeader ("Your perks", "See all")
│   │   └── PerkRow[]
│   └── SectionHeader ("Overview")
│       └── StatTile[] (3-col grid)
└── TabBar (via Expo Router Tabs)
```

---

## 4. Font Loading Strategy

### 4.1 Required Fonts
- **Inter Tight** (weights: 400, 500, 600, 700, 800) - Display/body text
- **JetBrains Mono** (weights: 400, 500, 600) - Labels/monospace text

### 4.2 Implementation Pattern

In `app/_layout.tsx`:

```typescript
import { useFonts } from 'expo-font';
import * as SplashScreen from 'expo-splash-screen';

SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const [fontsLoaded] = useFonts({
    'InterTight-Regular': require('../assets/fonts/InterTight-Regular.ttf'),
    'InterTight-Medium': require('../assets/fonts/InterTight-Medium.ttf'),
    'InterTight-SemiBold': require('../assets/fonts/InterTight-SemiBold.ttf'),
    'InterTight-Bold': require('../assets/fonts/InterTight-Bold.ttf'),
    'InterTight-ExtraBold': require('../assets/fonts/InterTight-ExtraBold.ttf'),
    'JetBrainsMono-Regular': require('../assets/fonts/JetBrainsMono-Regular.ttf'),
    'JetBrainsMono-Medium': require('../assets/fonts/JetBrainsMono-Medium.ttf'),
    'JetBrainsMono-SemiBold': require('../assets/fonts/JetBrainsMono-SemiBold.ttf'),
  });

  useEffect(() => {
    if (fontsLoaded) {
      SplashScreen.hideAsync();
    }
  }, [fontsLoaded]);

  if (!fontsLoaded) {
    return null; // Keep splash screen visible
  }

  // ... rest of layout
}
```

### 4.3 Font Files
Font files must be placed in `assets/fonts/`. Developer should download from Google Fonts:
- https://fonts.google.com/specimen/Inter+Tight
- https://fonts.google.com/specimen/JetBrains+Mono

---

## 5. Platform-Specific Patterns

### 5.1 Shadows (iOS vs Android)

React Native shadows differ by platform:

```typescript
// iOS
shadowColor: '#000',
shadowOffset: { width: 0, height: 8 },
shadowOpacity: 0.3,
shadowRadius: 20,

// Android
elevation: 8,
```

For the accent button shadow (sunset orange glow):
```typescript
// iOS only - Android elevation doesn't support colored shadows
shadowColor: '#FF7A29',
shadowOffset: { width: 0, height: 8 },
shadowOpacity: 0.3,
shadowRadius: 20,
```

### 5.2 Backdrop Blur (Tab Bar)

Use `expo-blur` for the frosted glass effect:

```typescript
import { BlurView } from 'expo-blur';

<BlurView intensity={40} tint="dark" style={styles.tabBar}>
  {/* Tab content */}
</BlurView>
```

**Note:** `expo-blur` is NOT in current `package.json`. Developer must add it:
```bash
pnpm add expo-blur
```

### 5.3 Images

Use `expo-image` (already a dependency) for optimized image loading:

```typescript
import { Image } from 'expo-image';

<Image
  source={{ uri: photo }}
  style={{ width: 44, height: 44 }}
  contentFit="cover"
  transition={200}
/>
```

---

## 6. Animation Specifications

### 6.1 Pulsing Dot (Notification Indicator)

Use `react-native-reanimated` (already a dependency):

```typescript
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withRepeat,
  withTiming,
  Easing,
} from 'react-native-reanimated';

// In component:
const opacity = useSharedValue(1);

useEffect(() => {
  opacity.value = withRepeat(
    withTiming(0.4, { duration: 1000, easing: Easing.inOut(Easing.ease) }),
    -1, // infinite
    true // reverse
  );
}, []);

const animatedStyle = useAnimatedStyle(() => ({
  opacity: opacity.value,
}));
```

### 6.2 Fade-Up Entry Animation

For sections appearing on load:

```typescript
const translateY = useSharedValue(8);
const opacity = useSharedValue(0);

useEffect(() => {
  translateY.value = withTiming(0, { duration: 400, easing: Easing.out(Easing.ease) });
  opacity.value = withTiming(1, { duration: 400, easing: Easing.out(Easing.ease) });
}, []);
```

**Note:** Fade-up is optional for MVP. Prioritize pulsing dot animation.

---

## 7. Tab Navigation Architecture

### 7.1 Use Expo Router's Tabs Component

Do NOT create a manual tab bar with absolute positioning. Use Expo Router's built-in `<Tabs>` component with a custom `tabBar` prop.

```typescript
// app/(hunter)/_layout.tsx
import { Tabs } from 'expo-router';
import { CustomTabBar } from '@/components/hunter/CustomTabBar';

export default function HunterLayout() {
  return (
    <Tabs
      tabBar={(props) => <CustomTabBar {...props} />}
      screenOptions={{
        headerShown: false,
      }}
    >
      <Tabs.Screen name="discover" options={{ title: 'Discover' }} />
      <Tabs.Screen name="index" options={{ title: 'Dashboard' }} />
      <Tabs.Screen name="inquiries" options={{ title: 'Inquiries' }} />
      <Tabs.Screen name="profile" options={{ title: 'Profile' }} />
    </Tabs>
  );
}
```

### 7.2 Custom Tab Bar Component

The custom tab bar will:
- Use `expo-blur` for background
- Render icons from `lucide-react-native`
- Handle badge display for Inquiries
- Apply accent color to active tab

---

## 8. Type Definitions

Create `types/hunter.ts`:

```typescript
export interface Hunter {
  name: string;
  firstName: string;
  monogram: string;
}

export interface AttentionItem {
  id: string;
  kind: 'rating-due' | 'payment-pending' | 'review-response';
  title: string;
  subtitle: string;
  cta: string;
  photo: string;
}

export interface DealTalent {
  name: string;
  photo: string;
}

export interface Deal {
  id: string;
  talent: DealTalent;
  services: string;
  total: number;
  status: 'in_progress' | 'waiting' | 'rate_now' | 'completed';
  statusLabel: string;
  statusAccent: boolean;
  timeLabel: string;
}

export interface Perk {
  id: string;
  title: string;
  claimed: number;
  max: number;
  expires: string;
}

export interface HunterStats {
  activeDeals: number;
  bookingValue: number;
  perksClaimed: number;
}

export interface HunterDashboardData {
  hunter: Hunter;
  attentionItems: AttentionItem[];
  deals: Deal[];
  perks: Perk[];
  stats: HunterStats;
}
```

---

## 9. Mock Data Location

Create `constants/mockHunterDashboard.ts` with the exact data from the reference file:

```typescript
import { HunterDashboardData } from '@/types/hunter';

export const MOCK_HUNTER_DASHBOARD: HunterDashboardData = {
  hunter: {
    name: 'FitBar TLV',
    firstName: 'FitBar',
    monogram: 'FB',
  },
  attentionItems: [
    {
      id: 'att-1',
      kind: 'rating-due',
      title: 'Rate Daniel Levi',
      subtitle: 'Story Set delivered May 6',
      cta: 'Rate now',
      photo: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=400&q=80',
    },
  ],
  deals: [
    // ... (copy from reference)
  ],
  perks: [
    // ... (copy from reference)
  ],
  stats: {
    activeDeals: 3,
    bookingValue: 1060,
    perksClaimed: 3,
  },
};
```

---

## 10. Verification Commands

After implementation, run:

```bash
# Type checking
npx tsc --noEmit

# Expo doctor
npx expo-doctor

# Start dev server (for manual verification)
pnpm start
```

---

## 11. Dependencies to Add

```bash
pnpm add expo-blur expo-font
```

Note: `expo-font` may already be included with Expo 52, but verify.

---

## 12. Risk Mitigation

| Risk | Mitigation |
|------|------------|
| Fonts fail to load | Provide fallback to system fonts, gated by `fontsLoaded` |
| Blur not working on Android | Use solid semi-transparent background as fallback |
| Colored shadows on Android | Accept platform limitation, elevation provides depth |
| Image loading slow | Use `expo-image` with transition for smooth UX |

---

## 13. File Creation Order

1. Update `constants/theme.ts` with new dark theme tokens
2. Update `tailwind.config.js` to match
3. Add font files to `assets/fonts/`
4. Update `app/_layout.tsx` for font loading
5. Create `types/hunter.ts`
6. Create `constants/mockHunterDashboard.ts`
7. Create UI components (`components/ui/PulsingDot.tsx`)
8. Create hunter components (in order: SectionHeader, StatTile, PerkRow, ActionTile, DealRow, AttentionBanner, TopBar)
9. Create placeholder tab screens
10. Update `app/(hunter)/_layout.tsx` with tab configuration
11. Create main dashboard screen `app/(hunter)/index.tsx`

---

*End of Tech Lead Agent Output*
