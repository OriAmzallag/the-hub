# Technical Plan: Influencer Inquiries

**Feature**: Influencer Inquiries  
**Date**: 2026-05-14  
**Status**: APPROVED

## Architecture Decision

### Module Rename: APPROVED

Move `components/business/inquiries/` to `components/inquiries/`.

**Rationale**:
- The module is already shared (InquiriesScreen takes `viewerRole` prop)
- Current path lies about ownership
- Matches convention: `components/onboarding/`, `components/profile/`, `components/deal-archive/`, `components/rating/` have no persona prefix
- Only one consumer needs import update: `app/(business)/inquiries.tsx`

**Impact**:
- Grep confirms only `app/(business)/inquiries.tsx` imports from this path
- Docs reference the old path but are not code - no update needed

## Implementation Plan

### Phase 1: Module Rename (3 files)

1. **Move directory**: `components/business/inquiries/` -> `components/inquiries/`
2. **Update import**: `app/(business)/inquiries.tsx`

Files affected:
- `components/inquiries/` (moved, 8 files)
- `app/(business)/inquiries.tsx` (import path only)

### Phase 2: Mock Data (1 new file)

Create `constants/mockInfluencerInquiries.ts`:

```typescript
export const MOCK_INFLUENCER_THREADS: Thread[] = [
  // 5 threads covering v0.8 caption matrix
];

export function computeUnreadTotal(threads: Thread[]): number;
export const MOCK_UNREAD_TOTAL: number;
```

**Thread fixtures** (Maya's POV):

| ID | Business | State | SubState | Caption Maya Sees | Pinned |
|----|----------|-------|----------|-------------------|--------|
| i-thr-1 | Bellboy | PENDING | - | RESPOND BY 47H | Yes |
| i-thr-2 | FitBar TLV | IN_PROGRESS | - | IN PROGRESS | No |
| i-thr-3 | Sushi Bar | COMPLETED | neither-rated | RATE NOW | Yes |
| i-thr-4 | BeautyBar | COMPLETED | influencer-rated | AWAITING THEIR RATING | No |
| i-thr-5 | Onza | COMPLETED | - | (2 unread) | Yes |

**Counterparty shape** (all businesses):
```typescript
{
  name: string;
  monogram: string;  // 2-char, e.g., "BL", "FB"
  // NO photo field - Avatar renders monogram path
}
```

### Phase 3: Route Implementation (1 file)

Replace `app/(influencer)/inquiries.tsx`:

```typescript
import { InquiriesScreen } from '@/components/inquiries';
import { MOCK_INFLUENCER_THREADS, computeUnreadTotal } from '@/constants/mockInfluencerInquiries';

export default function InfluencerInquiriesScreen() {
  const threads = MOCK_INFLUENCER_THREADS;
  const unreadTotal = useMemo(() => computeUnreadTotal(threads), [threads]);

  return (
    <InquiriesScreen
      viewerRole="influencer"
      threads={threads}
      unreadTotal={unreadTotal}
    />
  );
}
```

## File Changes Summary

| File | Action | Lines |
|------|--------|-------|
| `components/inquiries/*` | MOVE from `components/business/inquiries/` | 0 (just move) |
| `app/(business)/inquiries.tsx` | UPDATE import path | ~1 |
| `constants/mockInfluencerInquiries.ts` | CREATE | ~85 |
| `app/(influencer)/inquiries.tsx` | REPLACE | ~25 |

**Total new code**: ~110 lines

## Data Consistency

Mock data aligns with `mockInfluencerDashboard.ts`:
- Same business names (Bellboy, FitBar TLV, Sushi Bar, BeautyBar)
- Same monograms (BL, FB, SB, BB)
- Adds Onza (ON) from perkClaims

This allows testers to correlate dashboard deals with inbox threads.

## Hard Rules Compliance

1. **Branch**: `feature/influencer-inquiries`
2. **Captions from getDealCaption**: Mock data is state-driven, captions resolved at render
3. **Avatar data-driven**: Counterparties have `monogram`, no `photo` - Avatar dispatches automatically
4. **No visual divergence**: Same InquiriesScreen component, different data
5. **Mock data consistency**: Business names match Maya's dashboard mocks

## Testing Checklist

- [ ] `npx tsc --noEmit` passes
- [ ] Business inquiries still works after module rename
- [ ] Influencer inquiries renders with monogram avatars
- [ ] Pinned section shows correct threads (PENDING, neither-rated, unread)
- [ ] Captions match expected values
- [ ] Empty state shows influencer copy (no CTA)
- [ ] Search filters by business name
