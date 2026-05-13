# Rating Flow - Technical Plan
Version: 1.0
Date: 2026-05-13
Status: APPROVED

## Architecture Overview

The Rating Flow is a 3-screen modal flow triggered from deal cards in COMPLETED state. It produces RATED-state transitions and persists rating data through a mock service that mirrors the auth service pattern.

```
Entry Point                    Rating Flow                      Exit Points
-----------                    -----------                      -----------
DealCard (RATE NOW)  --->  [Rate Screen]  --->  [Submitted/Waiting]  ---> Dashboard
                               |                       |
                               |                       v
                               |              [Mutual Reveal]  ---> Dashboard / Deal Summary
                               |                       ^
                               |                       |
                               +-- (both rated) -------+
```

## File Structure

```
app/
  rate/
    [dealId].tsx              # Main rating flow route (shared by both personas)

components/
  rating/
    RateScreen.tsx            # Screen 1: Star input + tags + review
    SubmittedWaiting.tsx      # Screen 2: First rater confirmation
    MutualReveal.tsx          # Screen 3: Both ratings revealed
    RatingCard.tsx            # Primitive: displays a single rating
    StarInput.tsx             # 5-star interactive input with animation
    TagChips.tsx              # Role-specific tag selection (wraps ChipGrid)
    ReviewInput.tsx           # Textarea with char counter
    NoticeCard.tsx            # Clock icon + explanation card
    CheckHero.tsx             # Animated check circle (reusable)

lib/
  ratingTags.ts               # Tag taxonomies + type guards

services/
  ratings.ts                  # Rating service interface + mock impl

types/
  rating.ts                   # Rating type definitions

constants/
  mockBusinessDashboard.ts    # Extended with RATE NOW fixtures
  mockInfluencerDashboard.ts  # Extended with RATE NOW fixtures
```

## Route Design

### Route: `app/rate/[dealId].tsx`

**Rationale**: Rating flow is shared between business and influencer personas. Placing it outside the persona route groups `(business)` and `(influencer)` avoids duplication. The route receives `dealId` and derives viewer role from auth context.

**State machine**:
```typescript
type RatingFlowState = 
  | { step: 'rate' }                           // Initial: input screen
  | { step: 'submitted', stars: number }       // After submit, waiting for counterparty
  | { step: 'reveal' };                        // Both have rated
```

**Entry determination**:
- If viewer already rated: redirect to dashboard (should not happen if entry is gated)
- If counterparty already rated: show Rate screen, then skip to Reveal on submit
- If neither rated: show Rate screen, then Submitted/Waiting on submit

## Data Types

### `types/rating.ts`

```typescript
/**
 * Star rating value (1-5).
 */
export type StarRating = 1 | 2 | 3 | 4 | 5;

/**
 * Business rates Influencer tag taxonomy.
 */
export type BusinessRatesInfluencerTag =
  | 'On time'
  | 'Clear delivery'
  | 'Great quality'
  | 'Good comms'
  | 'Knew the brand'
  | 'Would book again';

/**
 * Influencer rates Business tag taxonomy.
 */
export type InfluencerRatesBusinessTag =
  | 'Clear brief'
  | 'Easy to work with'
  | 'Fast comms'
  | 'Trusted my creativity'
  | 'Fair deal'
  | 'Would work again';

/**
 * Union of all rating tags.
 */
export type RatingTag = BusinessRatesInfluencerTag | InfluencerRatesBusinessTag;

/**
 * Single rating record.
 */
export interface Rating {
  id: string;
  dealId: string;
  raterId: string;
  raterRole: 'business' | 'influencer';
  stars: StarRating;
  tags: RatingTag[];
  review?: string;
  wouldWorkAgain: boolean;  // Extracted from "Would book/work again" tag
  submittedAt: string;      // ISO timestamp
}

/**
 * Input for submitting a rating.
 */
export interface RatingInput {
  dealId: string;
  stars: StarRating;
  tags: RatingTag[];
  review?: string;
}

/**
 * Deal context for the rating flow.
 */
export interface RatingDealContext {
  id: string;
  counterparty: {
    id: string;
    name: string;
    firstName: string;
    photo?: string;     // For influencer counterparty
    monogram?: string;  // For business counterparty
  };
  services: string;     // e.g., "Instagram Reel + Story Set"
  money: number;        // e.g., 530
  viewerRole: 'business' | 'influencer';
  viewerRating?: Rating;      // Viewer's submitted rating (if any)
  counterpartyRating?: Rating; // Counterparty's rating (if any)
}
```

## Service Design

### `services/ratings.ts`

Pattern mirrors `services/auth.ts` with interface + mock implementation.

```typescript
interface RatingsService {
  /**
   * Get deal context for rating flow.
   * Returns deal details + existing ratings.
   */
  getDealContext(dealId: string, viewerId: string): Promise<RatingDealContext>;

  /**
   * Submit a rating.
   * Returns the created rating + updated deal state.
   */
  submitRating(input: RatingInput, raterId: string): Promise<{
    rating: Rating;
    dealState: 'COMPLETED' | 'RATED';
    completedSubstate?: CompletedSubstate;
  }>;

  /**
   * Get both ratings for mutual reveal.
   * Only returns counterparty rating if both have submitted.
   */
  getRatings(dealId: string): Promise<{
    viewerRating: Rating;
    counterpartyRating: Rating;
  }>;
}
```

**Mock implementation**:
- In-memory Map for ratings storage
- `getDealContext` returns mock data based on `dealId`
- `submitRating` creates rating, updates mock deal state
- `getRatings` returns both ratings (mock assumes mutual reveal is triggered correctly)

## Tag Taxonomy Module

### `lib/ratingTags.ts`

```typescript
export const BUSINESS_RATES_INFLUENCER_TAGS: readonly BusinessRatesInfluencerTag[] = [
  'On time',
  'Clear delivery',
  'Great quality',
  'Good comms',
  'Knew the brand',
  'Would book again',
] as const;

export const INFLUENCER_RATES_BUSINESS_TAGS: readonly InfluencerRatesBusinessTag[] = [
  'Clear brief',
  'Easy to work with',
  'Fast comms',
  'Trusted my creativity',
  'Fair deal',
  'Would work again',
] as const;

export function getTagsForRole(viewerRole: ViewerRole): readonly RatingTag[] {
  return viewerRole === 'business'
    ? BUSINESS_RATES_INFLUENCER_TAGS
    : INFLUENCER_RATES_BUSINESS_TAGS;
}

export function isWouldWorkAgainTag(tag: RatingTag): boolean {
  return tag === 'Would book again' || tag === 'Would work again';
}

export function extractWouldWorkAgain(tags: RatingTag[]): boolean {
  return tags.some(isWouldWorkAgainTag);
}
```

## Component Architecture

### StarInput

Reusable 5-star input with spring animation on tap.

```typescript
interface StarInputProps {
  value: StarRating | 0;
  onChange: (stars: StarRating) => void;
  size?: number;       // Default: 42
  disabled?: boolean;
}
```

**Animation**: Each star scales up with `withSpring({ damping: 12, stiffness: 180 })` on selection, cascading with 30ms delay per star.

### TagChips

Wraps existing `ChipGrid` component with rating-specific styling.

```typescript
interface TagChipsProps {
  tags: readonly RatingTag[];
  selected: RatingTag[];
  onChange: (selected: RatingTag[]) => void;
}
```

**Styling delta from ChipGrid**:
- Centered wrap layout (justify-content: center)
- Gap: 7 (vs default 8)
- Active chip shows Check icon (12px)

### ReviewInput

Textarea with character counter.

```typescript
interface ReviewInputProps {
  value: string;
  onChange: (value: string) => void;
  maxLength?: number;  // Default: 200
}
```

### CheckHero

Animated check circle for confirmation screens.

```typescript
interface CheckHeroProps {
  size: number;        // 72 for reveal, 80 for submitted
  delay?: number;      // Animation delay (default: 200)
}
```

Reuses animation pattern from `WelcomeBackStep.tsx`.

### NoticeCard

Reusable explainer card with icon.

```typescript
interface NoticeCardProps {
  icon: 'clock';       // Extensible for future icons
  title?: string;      // Optional "HOW THIS WORKS" header
  children: ReactNode; // Body text
}
```

### RatingCard

Displays a single rating in the Mutual Reveal screen.

```typescript
interface RatingCardProps {
  label: string;                // "You rated {name}" or "{Name} rated you"
  rating: Rating;
  showAvatar?: boolean;         // true for counterparty's rating
  counterpartyPhoto?: string;
  counterpartyMonogram?: string;
}
```

## Screen Implementation

### RateScreen

```typescript
interface RateScreenProps {
  context: RatingDealContext;
  onSubmit: (input: RatingInput) => void;
  onClose: () => void;
}
```

**Layout** (top to bottom):
1. Top bar (X + eyebrow) - 56px height
2. Hero block (avatar + summary + headline) - centered
3. StarInput - centered
4. Star label (Poor/Below average/OK/Great/Excellent) - appears after first tap
5. TagChips with caption
6. ReviewInput with caption
7. NoticeCard (mutual reveal explainer)
8. Sticky footer (Submit button)

### SubmittedWaiting

```typescript
interface SubmittedWaitingProps {
  stars: StarRating;
  counterpartyFirstName: string;
  onBackToDashboard: () => void;
}
```

### MutualReveal

```typescript
interface MutualRevealProps {
  context: RatingDealContext;
  viewerRating: Rating;
  counterpartyRating: Rating;
  onBack: () => void;
  onViewDealSummary: () => void;
  onClose: () => void;
}
```

## State Management

The rating flow uses local component state. No global store needed.

```typescript
// In app/rate/[dealId].tsx
const [flowState, setFlowState] = useState<RatingFlowState>({ step: 'rate' });
const [context, setContext] = useState<RatingDealContext | null>(null);
const [viewerRating, setViewerRating] = useState<Rating | null>(null);
const [counterpartyRating, setCounterpartyRating] = useState<Rating | null>(null);
```

## Integration Points

### Deal Card Entry

Deal cards with `RATE NOW` caption navigate to `/rate/{dealId}`:

```typescript
// In DealCard.tsx (or equivalent)
const handlePress = () => {
  if (caption.text === 'RATE NOW') {
    router.push(`/rate/${deal.id}`);
  }
};
```

### Deal State Updates

After rating submission, the mock service updates the deal's `completedSubstate`:

```typescript
// Mock service behavior
if (viewerRole === 'business') {
  deal.completedSubstate = 'business-rated';
} else {
  deal.completedSubstate = 'influencer-rated';
}

// If both have rated
if (deal.completedSubstate === 'both-rated') {
  deal.state = 'RATED';
}
```

### Dashboard Caption Resolution

No changes to `getDealCaption` needed. Existing logic handles:
- `COMPLETED + neither-rated` -> `RATE NOW` (actionable)
- `COMPLETED + viewer-rated` -> `AWAITING THEIR RATING` (not actionable)
- `COMPLETED + counterparty-rated` -> `RATE NOW` (actionable)
- `RATED` -> `RATED [star] {N}` (not actionable)

## Mock Data Extensions

### Business Dashboard

Add a COMPLETED deal with `neither-rated` substate and realistic counterparty data:

```typescript
// In mockBusinessDashboard.ts
{
  id: 'deal-rate-1',
  influencer: {
    name: 'Noa Berman',
    photo: INFLUENCER_PHOTOS.noa,
  },
  services: 'Instagram Reel + Story Set',
  total: 530,
  state: 'COMPLETED',
  completedSubstate: 'neither-rated',
  timeLabel: 'Completed 2h ago',
}
```

### Influencer Dashboard

Add a COMPLETED deal with `business-rated` substate:

```typescript
// In mockInfluencerDashboard.ts
{
  id: 'deal-rate-2',
  business: { name: 'FitBar TLV', monogram: 'FB' },
  services: 'Instagram Reel + Story Set',
  earnings: 530,
  state: 'COMPLETED',
  completedSubstate: 'business-rated',
}
```

## Animation Specifications

| Animation | Trigger | Spec |
|-----------|---------|------|
| Star pop | Star tap | `withSpring({ damping: 12, stiffness: 180 })`, scale 0 -> 1, 30ms cascade delay |
| Check pop | Screen mount | `withDelay(200, withSpring({ damping: 12, stiffness: 180 }))`, scale 0 -> 1 |
| Fade up | Screen mount | Reuse `useFadeUpEntrance()` - opacity 0->1, translateY 16->0, 400ms ease-out |

## Future Hooks (Out of Scope)

### Storefront Aggregation

The `Rating` type stores `wouldWorkAgain` separately for future matching queries:

```typescript
// Future: services/ratings.ts
interface RatingsService {
  // ...existing methods...

  /**
   * Get aggregate rating for storefront display.
   * Returns null if < 3 reviews (show "NEW" instead).
   */
  getStorefrontRating(userId: string): Promise<{
    average: number;
    count: number;
    wouldWorkAgainPercent: number;
  } | null>;
}
```

### 7-Day Window Expiry

Document cron job requirements:

```typescript
// Future: server-side cron (not in this PR)
// Runs daily, finds COMPLETED deals where:
//   - completedAt + 7 days < now
//   - state !== 'RATED'
// Transitions them to RATED with whatever ratings exist
```

## Testing Strategy

### Unit Tests (not in PR scope, documented for future)
- `ratingTags.ts`: Tag taxonomy helpers
- `types/rating.ts`: Type guards

### Manual Test Cases (for QA)
1. Business rates influencer (first rater) -> Submitted/Waiting screen
2. Influencer rates business (second rater) -> Mutual Reveal screen
3. Tap RATED deal card -> Mutual Reveal screen
4. Star input: tap each star, verify label updates
5. Tags: toggle on/off, verify Check icon appears
6. Review: type 200 chars, verify counter turns accent at 180
7. Empty state: stars = 0 -> Submit button disabled

## Dependencies

No new external dependencies. Uses existing:
- `react-native-reanimated` for animations
- `lucide-react-native` for icons
- `expo-router` for navigation

## Risk Assessment

| Risk | Mitigation |
|------|------------|
| Rating service mock diverges from real API | Interface-first design; mock implements same interface |
| Animation jank on low-end devices | Use native driver (Reanimated), test on older devices |
| Race condition on mutual rating | Mock service is synchronous; real implementation uses optimistic locking |
