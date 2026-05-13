# Deal Card v0.8 — Technical Plan

**Author**: Tech Lead Agent  
**Date**: 2026-05-13  
**Status**: APPROVED  

---

## 1. Architecture Overview

This is a refactor of the deal lifecycle source-of-truth with cascading updates to types, mock data, and UI components. No new screens or routing changes.

### 1.1 Files to Modify

| File | Changes |
|------|---------|
| `lib/dealLifecycle.ts` | Core refactor: drop DELIVERED, adopt v0.8 types and resolver |
| `types/business.ts` | Update JSDoc, add CompletedSubstate to Deal type |
| `types/influencerDashboard.ts` | Update InfluencerDealStatus, add state-driven fields |
| `constants/mockBusinessDashboard.ts` | Recast DELIVERED fixtures to COMPLETED sub-states |
| `constants/mockBusinessInquiries.ts` | Recast DELIVERED thread to COMPLETED |
| `constants/mockThread.ts` | Recast YAEL_THREAD from DELIVERED to COMPLETED |
| `constants/mockInfluencerDashboard.ts` | Update to use DealState + completedSubstate |
| `components/business/DealRow.tsx` | Update visual to match prototype recipe |
| `components/business/AttentionBanner.tsx` | Remove DELIVERED-specific Package icon |
| `components/influencer/dashboard/InfluencerDealRow.tsx` | Update to use lifecycle resolver |
| `components/influencer/dashboard/InfluencerAttentionItem.tsx` | Update to use lifecycle resolver |

### 1.2 Files NOT Modified (False Positives from Audit)

- `types/influencerDashboard.ts` `PerkClaimStatus = 'delivered'` — perk-claim lifecycle, different concept
- `mockThread.ts:29` template chip `{ id: 'delivered', label: 'All delivered' }` — chat quick-reply, not deal state
- `references/business-dashboard.reference.jsx` `"Story Set delivered May 6"` — natural-language subtitle

---

## 2. Type Definitions

### 2.1 New Types in `lib/dealLifecycle.ts`

```typescript
/**
 * The 6 canonical deal states (v0.8).
 *
 * Lifecycle:
 *   PENDING -> IN_PROGRESS -> COMPLETED -> RATED (terminal)
 *      |
 *      +-> EXPIRED (terminal)
 *      +-> DECLINED (terminal)
 */
export type DealState =
  | 'PENDING'
  | 'IN_PROGRESS'
  | 'COMPLETED'
  | 'RATED'
  | 'EXPIRED'
  | 'DECLINED';

/**
 * Caption tone — maps directly to theme color tokens.
 * Renamed from CaptionTier to CaptionTone per v0.8 spec.
 */
export type CaptionTone = 'accent' | 'muted' | 'decline';

/**
 * Viewer's role in the deal — LOWERCASE per v0.8 spec.
 */
export type ViewerRole = 'business' | 'influencer';

/**
 * COMPLETED state sub-state — single field replaces separate booleans.
 */
export type CompletedSubstate = 'neither-rated' | 'business-rated' | 'influencer-rated';

/**
 * Canonical decline reasons.
 */
export type DeclineReason =
  | 'BRIEF OUTSIDE SCOPE'
  | 'WRONG FIT'
  | 'TOO SHORT NOTICE'
  | 'FULLY BOOKED'
  | 'OTHER';

/**
 * Result from getDealCaption — v0.8 contract.
 */
export interface Caption {
  text: string;
  tone: CaptionTone;
  actionable: boolean;
}

/**
 * Deal shape additions for caption resolution.
 */
export interface DealCaptionInput {
  state: DealState;
  hoursLeft?: number;              // PENDING only
  completedSubstate?: CompletedSubstate;  // COMPLETED only
  rating?: number;                 // RATED only (1.0-5.0)
  declineReason?: DeclineReason;   // DECLINED only
}
```

### 2.2 Tone-to-Color Mapping

```typescript
// In components or a shared utility:
function getToneColor(tone: CaptionTone): string {
  switch (tone) {
    case 'accent':
      return colors.accent;
    case 'muted':
      return colors.inkMuted;
    case 'decline':
      return colors.decline;
  }
}
```

**Note**: The old `inkSubtle` tier is gone. EXPIRED and DECLINED now use `decline` tone (maps to `colors.decline`), not `inkSubtle`.

### 2.3 Type Updates in `types/business.ts`

```typescript
import type { DealState, CompletedSubstate, DeclineReason } from '@/lib/dealLifecycle';

export interface Deal {
  id: string;
  influencer: DealInfluencer;
  services: string;
  total: number;
  state: DealState;
  hoursLeft?: number;              // PENDING only
  completedSubstate?: CompletedSubstate;  // COMPLETED only
  rating?: number;                 // RATED only
  declineReason?: DeclineReason;   // DECLINED only
  timeLabel?: string;
}

export interface AttentionItem {
  id: string;
  state: DealState;
  title: string;
  photo: string;
  hoursLeft?: number;
  completedSubstate?: CompletedSubstate;
  // Remove: businessRated, influencerRated (replaced by completedSubstate)
}
```

### 2.4 Type Updates in `types/influencerDashboard.ts`

The current InfluencerDeal type uses pre-rendered `statusLabel` and `statusAccent`. We need to refactor to use the lifecycle resolver:

```typescript
import type { DealState, CompletedSubstate, DeclineReason } from '@/lib/dealLifecycle';

export interface InfluencerDeal {
  id: string;
  business: {
    name: string;
    monogram: string;
  };
  services: string;
  earnings: number;
  state: DealState;
  hoursLeft?: number;
  completedSubstate?: CompletedSubstate;
  rating?: number;
  declineReason?: DeclineReason;
  // Remove: status, statusLabel, statusAccent (derived from resolver)
}

// Update InfluencerAttentionItem to be state-driven:
export interface InfluencerAttentionItem {
  id: string;
  state: DealState;
  title: string;
  monogram: string;
  earnings?: number;
  hoursLeft?: number;
  completedSubstate?: CompletedSubstate;
  // Remove: kind, subtitle (derived from resolver)
}
```

---

## 3. Resolver Implementation

### 3.1 getDealCaption

```typescript
export function getDealCaption(
  deal: DealCaptionInput,
  viewerRole: ViewerRole
): Caption {
  const isBusiness = viewerRole === 'business';

  switch (deal.state) {
    case 'PENDING':
      return isBusiness
        ? {
            text: `RESPOND BY ${deal.hoursLeft ?? 0}H`,
            tone: 'accent',
            actionable: true,
          }
        : {
            text: 'AWAITING RESPONSE',
            tone: 'muted',
            actionable: false,
          };

    case 'IN_PROGRESS':
      return {
        text: 'IN PROGRESS',
        tone: 'muted',
        actionable: false,
      };

    case 'COMPLETED': {
      const sub = deal.completedSubstate ?? 'neither-rated';
      const iAlreadyRated =
        (isBusiness && sub === 'business-rated') ||
        (!isBusiness && sub === 'influencer-rated');
      return iAlreadyRated
        ? {
            text: 'AWAITING THEIR RATING',
            tone: 'muted',
            actionable: false,
          }
        : {
            text: 'RATE NOW',
            tone: 'accent',
            actionable: true,
          };
    }

    case 'RATED':
      return {
        text: `RATED ★ ${deal.rating ?? 5.0}`,
        tone: 'muted',
        actionable: false,
      };

    case 'EXPIRED':
      return {
        text: 'EXPIRED',
        tone: 'decline',
        actionable: false,
      };

    case 'DECLINED': {
      const text =
        !isBusiness && deal.declineReason
          ? `DECLINED · ${deal.declineReason}`
          : 'DECLINED';
      return {
        text,
        tone: 'decline',
        actionable: false,
      };
    }

    default: {
      const _exhaustive: never = deal.state;
      return _exhaustive;
    }
  }
}
```

### 3.2 getCaptionHint

```typescript
export function getCaptionHint(caption: Caption): string | null {
  if (!caption.actionable) return null;
  
  if (caption.text.startsWith('RESPOND BY')) {
    return 'Tap to respond';
  }
  if (caption.text === 'RATE NOW') {
    return 'Tap to rate';
  }
  return null;
}
```

### 3.3 requiresAction (Updated)

```typescript
export function requiresAction(
  deal: DealCaptionInput,
  viewerRole: ViewerRole
): boolean {
  // Simply delegate to the caption resolver
  const caption = getDealCaption(deal, viewerRole);
  return caption.actionable;
}
```

### 3.4 isActiveOnDashboard (Updated)

```typescript
export function isActiveOnDashboard(
  state: DealState,
  viewerRole: ViewerRole
): boolean {
  switch (state) {
    case 'RATED':
      return false; // History view

    case 'EXPIRED':
    case 'DECLINED':
      return viewerRole === 'business';

    case 'PENDING':
    case 'IN_PROGRESS':
    case 'COMPLETED':
      return true;

    default: {
      const _exhaustive: never = state;
      return _exhaustive;
    }
  }
}
```

---

## 4. Mock Data Changes

### 4.1 mockBusinessDashboard.ts

Recast `deal-3` from DELIVERED to COMPLETED. Add fixtures for all 3 sub-states:

```typescript
// COMPLETED (neither rated) - Both need to rate
{
  id: 'deal-3',
  influencer: { name: 'Yael Shapira', photo: INFLUENCER_PHOTOS.yael },
  services: '1 service',
  total: 420,
  state: 'COMPLETED',
  completedSubstate: 'neither-rated',
  timeLabel: 'Completed 2h ago',
},

// COMPLETED (influencer rated) - Business needs to rate
{
  id: 'deal-4',
  influencer: { name: 'Daniel Levi', photo: INFLUENCER_PHOTOS.daniel },
  services: '1 service',
  total: 180,
  state: 'COMPLETED',
  completedSubstate: 'influencer-rated',
  timeLabel: 'Completed 3d ago',
},

// COMPLETED (business rated) - Waiting for influencer to rate
{
  id: 'deal-5',
  influencer: { name: 'Amit Golan', photo: INFLUENCER_PHOTOS.amit },
  services: '2 services',
  total: 650,
  state: 'COMPLETED',
  completedSubstate: 'business-rated',
  timeLabel: 'Completed 5d ago',
},
```

### 4.2 mockBusinessInquiries.ts

Recast `h-thr-1` from DELIVERED to COMPLETED:

```typescript
{
  id: 'h-thr-1',
  counterparty: { name: 'Yael Mizrahi', photo: INFLUENCER_PHOTOS.yael },
  state: 'COMPLETED',
  completedSubstate: 'neither-rated',
  lastMessage: 'Work complete, looking forward to your rating!',
  lastMessageBy: 'them',
  timestamp: '2h ago',
  unread: 1,
},
```

### 4.3 mockThread.ts

Recast `YAEL_THREAD` from DELIVERED to COMPLETED:

```typescript
deal: {
  id: 'deal_yael_1',
  status: 'COMPLETED', // was 'DELIVERED'
  // ...rest unchanged
},
```

### 4.4 mockInfluencerDashboard.ts

Refactor deals to use state-driven shape:

```typescript
deals: [
  {
    id: 'deal-1',
    business: { name: 'FitBar TLV', monogram: 'FB' },
    services: '2 services',
    earnings: 530,
    state: 'IN_PROGRESS',
  },
  {
    id: 'deal-2',
    business: { name: 'Onza', monogram: 'ON' },
    services: '1 service',
    earnings: 350,
    state: 'PENDING',
    hoursLeft: 47,
  },
  {
    id: 'deal-3',
    business: { name: 'Sushi Bar', monogram: 'SB' },
    services: '1 service',
    earnings: 180,
    state: 'COMPLETED',
    completedSubstate: 'neither-rated',
  },
  {
    id: 'deal-4',
    business: { name: 'BeautyBar', monogram: 'BB' },
    services: '2 services',
    earnings: 420,
    state: 'COMPLETED',
    completedSubstate: 'influencer-rated', // Influencer rated, awaiting business
  },
],

attentionItems: [
  {
    id: 'att-1',
    state: 'PENDING',
    title: 'Onza',
    monogram: 'ON',
    earnings: 530,
    hoursLeft: 47,
  },
  {
    id: 'att-2',
    state: 'COMPLETED',
    completedSubstate: 'neither-rated',
    title: 'Sushi Bar',
    monogram: 'SB',
  },
],
```

---

## 5. Component Changes

### 5.1 DealRow.tsx

- Update to match prototype visual recipe (see design-spec.md)
- Use new resolver signature: `getDealCaption(deal, 'business')`
- Add `getToneColor` helper for tone-to-color mapping
- Add actionable card fill logic

### 5.2 AttentionBanner.tsx

- Remove `isDeliveryReview` check and Package icon badge
- Update resolver call to new signature
- The Star badge for COMPLETED rating-due stays

### 5.3 InfluencerDealRow.tsx

- Refactor from pre-rendered `statusLabel`/`statusAccent` to lifecycle resolver
- Use `getDealCaption(deal, 'influencer')`
- Add actionable card fill logic

### 5.4 InfluencerAttentionItem.tsx

- Refactor from pre-rendered `kind`/`subtitle` to lifecycle resolver
- Map deal state to icon: PENDING -> Inbox, COMPLETED -> Star
- Remove `deliver` kind (was for DELIVERED state)

---

## 6. Migration Strategy

1. **Update types first** — Add new types, deprecate old ones
2. **Update resolver** — New signature, drop DELIVERED branch
3. **Update mock data** — Recast DELIVERED fixtures
4. **Update components** — One by one, test each
5. **Clean up** — Remove deprecated types/helpers

No database migration needed — no production data exists.

---

## 7. Testing Checklist

- [ ] `npx tsc --noEmit` passes
- [ ] All 6 states have caption coverage
- [ ] All 3 COMPLETED sub-states have caption coverage
- [ ] Business POV captions match spec exactly
- [ ] Influencer POV captions match spec exactly
- [ ] Actionable cards have accentSoft+accentBorder fill
- [ ] Passive cards have surface+border fill
- [ ] No DELIVERED references remain in code
- [ ] `requiresAction` returns correct values for all states

---

## 8. Risks

| Risk | Mitigation |
|------|------------|
| Type errors from signature change | Update all call sites in same PR |
| Visual regression | Side-by-side comparison with prototype |
| Missed DELIVERED reference | Grep for 'DELIVERED' before PR |

---

## 9. Future Work (Out of Scope)

- Destination routing resolver
- Coordination Thread system message refactor
- Real backend integration
- Rating flow surface
- Incoming-request surface
