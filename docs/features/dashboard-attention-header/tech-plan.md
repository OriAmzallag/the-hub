# Technical Plan: Canonical Deal Lifecycle

**Feature:** dashboard-attention-header (Phase 2 - Deal Lifecycle)
**Author:** Tech Lead Agent
**Date:** 2026-05-10

---

## Architecture Decision: BUSINESS vs BUSINESS Naming

**Decision:** Use `BUSINESS` for the ViewerRole type.

**Rationale:**
- The codebase already renamed `business -> business` in PR #2
- File paths use `(business)/`, component paths use `business/`
- Consistency with existing naming convention takes priority
- Internal option fields (`businessRated`, `influencerRated`) describe "the rating left by the business-side rater" - these can stay as `businessRated` since they're internal API, but we'll use `businessRated` for full consistency

**Alternative considered:** `businessRated` kept for historical accuracy. Rejected because it creates cognitive load mixing naming conventions.

---

## File Changes

### 1. NEW: `lib/dealLifecycle.ts`

Single source of truth for deal lifecycle logic.

```typescript
// Type exports
export type DealState = 'PENDING' | 'IN_PROGRESS' | 'DELIVERED' | 'COMPLETED' | 'RATED' | 'EXPIRED' | 'DECLINED';
export type CaptionTier = 'accent' | 'inkMuted' | 'inkSubtle';
export type ViewerRole = 'BUSINESS' | 'INFLUENCER';

export interface CaptionResult {
  text: string;
  tier: CaptionTier;
}

export interface CaptionOptions {
  hoursLeft?: number;
  businessRated?: boolean;
  influencerRated?: boolean;
}

// Constants
export const TERMINAL_STATES: readonly DealState[] = ['RATED', 'EXPIRED', 'DECLINED'];

// Functions
export function isActiveOnDashboard(state: DealState, viewerRole: ViewerRole): boolean;
export function getDealCaption(state: DealState, viewerRole: ViewerRole, opts?: CaptionOptions): CaptionResult;
```

**Implementation notes:**
- `getDealCaption` uses exhaustive switch with `never` check on default branch
- For COMPLETED state, check `businessRated`/`influencerRated` based on viewerRole
- Include JSDoc comments showing expected outputs per state

### 2. MODIFY: `types/business.ts`

**Remove:**
```typescript
export type DealStatus = 'in_progress' | 'waiting' | 'rate_now' | 'completed';
```

**Remove from Deal interface:**
```typescript
status: DealStatus;
statusLabel: string;
statusAccent: boolean;
```

**Add to Deal interface:**
```typescript
import type { DealState } from '@/lib/dealLifecycle';

state: DealState;
hoursLeft?: number;      // Only for PENDING
businessRated?: boolean; // Only for COMPLETED
influencerRated?: boolean;   // Only for COMPLETED
```

**Keep:**
```typescript
timeLabel?: string; // Still used by DealRow for "Started 4h ago" etc.
```

### 3. MODIFY: `constants/mockBusinessDashboard.ts`

Expand from 3 deals to 7 deals covering all states:

| Deal ID | State | Key Fields | Notes |
|---------|-------|------------|-------|
| deal-1 | PENDING | hoursLeft: 47 | Waiting for influencer response |
| deal-2 | IN_PROGRESS | - | Work underway |
| deal-3 | DELIVERED | - | Awaiting business review |
| deal-4 | COMPLETED | businessRated: false | Shows "RATE NOW" |
| deal-5 | COMPLETED | businessRated: true, influencerRated: false | Shows "COMPLETE" muted |
| deal-6 | EXPIRED | - | Terminal, shows subtle |
| deal-7 | DECLINED | - | Terminal, shows subtle |

Reuse existing influencer photos for visual continuity.

### 4. MODIFY: `components/business/DealRow.tsx`

**Current:**
```typescript
const statusColor = deal.statusAccent ? colors.accent : colors.inkMuted;
// Uses deal.statusLabel directly
```

**New:**
```typescript
import { getDealCaption } from '@/lib/dealLifecycle';

const caption = getDealCaption(deal.state, 'BUSINESS', {
  hoursLeft: deal.hoursLeft,
  businessRated: deal.businessRated,
  influencerRated: deal.influencerRated,
});

const statusColor = colors[caption.tier]; // Direct theme token lookup
```

**Accessibility label** should use `caption.text` instead of `deal.statusLabel`.

### 5. MODIFY: `app/(business)/index.tsx`

**Add filtering:**
```typescript
import { isActiveOnDashboard } from '@/lib/dealLifecycle';

const activeDeals = deals.filter(d => isActiveOnDashboard(d.state, 'BUSINESS'));

// In render:
<SectionHeader title="Active deals" count={activeDeals.length} />
{activeDeals.map((deal) => ...)}
```

### 6. MODIFY: `lib/index.ts`

Add barrel export:
```typescript
export * from './dealLifecycle';
```

---

## Data Model Migration

### Legacy Shape
```typescript
{
  status: 'in_progress' | 'waiting' | 'rate_now' | 'completed',
  statusLabel: 'In progress' | 'Waiting · 47h left' | 'Rate now' | ...,
  statusAccent: boolean,
  timeLabel: 'Started 4h ago' | 'Sent yesterday' | ...
}
```

### New Shape
```typescript
{
  state: 'PENDING' | 'IN_PROGRESS' | 'DELIVERED' | 'COMPLETED' | 'RATED' | 'EXPIRED' | 'DECLINED',
  hoursLeft?: number,
  businessRated?: boolean,
  influencerRated?: boolean,
  timeLabel?: string  // Kept for display
}
```

### Migration Map
| Legacy `status` | New `state` |
|-----------------|-------------|
| `'waiting'` | `'PENDING'` |
| `'in_progress'` | `'IN_PROGRESS'` |
| `'rate_now'` | `'COMPLETED'` (with `businessRated: false`) |
| `'completed'` | `'COMPLETED'` (with `businessRated: true`) |

---

## Caption Resolution Logic

```
getDealCaption(state, role, opts):
  
  PENDING:
    BUSINESS -> "WAITING · {hoursLeft}H LEFT" / accent
    INFLUENCER   -> "RESPOND · {hoursLeft}H LEFT" / accent
    
  IN_PROGRESS:
    both     -> "IN PROGRESS" / inkMuted
    
  DELIVERED:
    BUSINESS -> "REVIEW DELIVERY" / accent
    INFLUENCER   -> "AWAITING REVIEW" / inkMuted
    
  COMPLETED:
    if (role === BUSINESS && !businessRated) -> "RATE NOW" / accent
    if (role === INFLUENCER && !influencerRated)     -> "RATE NOW" / accent
    else                                      -> "COMPLETE" / inkMuted
    
  RATED:
    (should not be called - filtered out)    -> "RATED" / inkSubtle
    
  EXPIRED:
    BUSINESS -> "EXPIRED" / inkSubtle
    INFLUENCER   -> (should not be called)       -> "EXPIRED" / inkSubtle
    
  DECLINED:
    BUSINESS -> "DECLINED" / inkSubtle
    INFLUENCER   -> (should not be called)       -> "DECLINED" / inkSubtle
```

---

## Commit Strategy

1. `feat: canonical deal lifecycle types + caption resolver` - lib/dealLifecycle.ts, lib/index.ts
2. `feat(business-dashboard): wire DealRow + filter to dealLifecycle resolver` - types/business.ts, DealRow.tsx, index.tsx
3. `chore(mock): expand deals fixture to cover all 5 active + terminal states` - mockBusinessDashboard.ts
4. `docs(dashboard-attention-header): per-agent specs` - docs/features/dashboard-attention-header/*

---

## Testing Considerations

- Unit tests for `getDealCaption` would be ideal but not in scope for this PR
- Manual verification via simulator covers acceptance criteria
- TypeScript exhaustive switch ensures all states are handled

---

## Future Influencer Dashboard Prep

Comment in `lib/dealLifecycle.ts`:
```typescript
/**
 * Note: INFLUENCER role paths are validated for the future Influencer Dashboard
 * but not exercised in production yet. When building the Influencer Dashboard,
 * import getDealCaption with viewerRole: 'INFLUENCER'.
 */
```
