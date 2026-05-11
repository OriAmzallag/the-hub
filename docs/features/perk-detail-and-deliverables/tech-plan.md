# Perk Detail and Deliverables - Technical Plan

Generated: 2026-05-11
Status: IMPLEMENTED

## Data Model Changes

### types/perk.ts

```typescript
// NEW
export interface PerkDeliverable {
  platform: PerkPlatform;
  action: string;              // e.g. "3 Stories", "1 Reel"
  requiredFollowers: number;
  description?: string;        // optional, used on detail screen
}

// UPDATED Perk interface
export interface Perk {
  id: string;
  title: string;
  business: string;
  businessMonogram: string;
  value: number;
  cover: string;
  deliverables: PerkDeliverable[];  // 1+ entries (replaces flat fields)
  category: PerkCategory;
  slotsLeft: number;
  slotsTotal: number;
  badge: string | null;
  expiringSoon: boolean;
}

// NEW - Detail-specific business info
export interface PerkBusinessInfo {
  name: string;
  monogram: string;
  verified: boolean;
  rating: number;
  deals: number;
  location: string;
}

// NEW - Full perk detail shape
export interface PerkDetail {
  id: string;
  title: string;
  category: PerkCategory;
  business: PerkBusinessInfo;
  value: number;
  cover: string;
  deliverables: PerkDeliverable[];
  deadline: string;
  description: string;
  slotsLeft: number;
  slotsTotal: number;
  expiresOn: string;
  badge: string | null;
  expiringSoon: boolean;
}

// NEW
export type QualificationStatus = 'full' | 'partial' | 'none';
```

### lib/perkQualification.ts

Updated helpers:
- `deliverableQualifies(deliverable, viewerReach)` - single deliverable check
- `qualifiesForPerk(perk, viewerReach)` - loops `perk.deliverables.every()`
- `getOverallQualification(perk, viewerReach): QualificationStatus`
- `formatThreshold(n)` - alias for display formatting
- `getCardPlatformLine(perk)` - 1 deliverable: "{N}K+ on {P}", 2+: "{P1} + {P2}"

### constants/mockInfluencerPerks.ts

- Updated all 6 PERKS entries to new shape with `deliverables[]`
- Added descriptions to each deliverable
- NEW: `PERK_DETAILS: Record<string, PerkDetail>` with richer business info
- NEW: `getPerkDetailById(id)` helper

## File Structure

```
app/
  perks/
    [id].tsx              # PerkDetailScreen

components/influencer/perk-detail/
  index.ts                # barrel export
  PerkDetailTopBar.tsx
  PerkHero.tsx
  PerkIdentity.tsx
  QualificationBanner.tsx
  PerkStatsRow.tsx
  DeliverableTile.tsx
  DeadlinePill.tsx
  ConfirmSheet.tsx
  ClaimedSuccess.tsx
```

## Routing

- `/perks/[id]` - top-level, outside tab group (same pattern as `/influencer/[id]`)
- Entry: PerkCard tap → `router.push(\`/perks/${perk.id}\`)`
- Back: `router.back()` or fallback to `/(influencer)/discover`

## Sheet Pattern

ConfirmSheet uses the canonical pattern established in this codebase:
- `<Modal visible={isMounted} transparent>`
- `<GestureHandlerRootView>` inside Modal
- `isMounted` state + `requestAnimationFrame`-deferred entrance
- `withTiming` completion callback for exit
- Footer: `Math.max(insets.bottom, 22)` padding

## State Machine

```
PerkDetailScreen:
  screenState: 'detail' | 'claimed'
  confirmOpen: boolean

  detail + tap Claim → confirmOpen=true
  confirmOpen + "Yes, claim" → screenState='claimed'
  confirmOpen + Cancel/pan-down → confirmOpen=false
```

## Migration Impact

Files touched by Change A (data model refactor):
- `types/perk.ts` - type definitions
- `constants/mockInfluencerPerks.ts` - mock data
- `lib/perkQualification.ts` - qualification helpers
- `lib/perkFilters.ts` - filter helpers (uses updated qualifiesForPerk)
- `components/influencer/discover/PerkCard.tsx` - uses new helpers

Files created for Change B (detail screen):
- `app/perks/[id].tsx` - route
- 9 components in `components/influencer/perk-detail/`

## Testing Scenarios

1. Single-deliverable perk (p-1: Dinner for two) - should show "10K+ on IG"
2. Multi-deliverable perk (p-2: Pilates class pack) - should show "IG + TikTok"
3. Fully qualified perk (p-1, p-5) - shows qualified banner, claimable CTA
4. Partial match (p-2: qualifies on IG, not TikTok) - shows partial banner
5. Fully below (p-4: needs 100K IG) - shows below banner
6. Claim flow: detail → confirm sheet → claimed success
