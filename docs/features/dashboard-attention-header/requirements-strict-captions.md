# Requirements Addendum: Strict Canonical Captions

**Feature**: dashboard-attention-header
**Addendum**: strict-captions
**Date**: 2026-05-10
**Status**: IMPLEMENTED

## The Rule

Every status caption on every dashboard card must be a canonical caption produced by `getDealCaption()`. No ad-hoc descriptive text.

This applies to:
- Active deal rows (already compliant via DealRow)
- Attention banner cards (this iteration)
- Any future surface

## What Was Changed

### AttentionItem Type Migration

**Before** (ad-hoc strings):
```typescript
interface AttentionItem {
  id: string;
  kind: 'rating-due' | 'payment-pending' | 'review-response';
  title: string;
  subtitle: string;  // e.g., "Story Set delivered May 6"
  cta: string;       // e.g., "Rate now"
  photo: string;
}
```

**After** (state-driven):
```typescript
interface AttentionItem {
  id: string;
  state: DealState;
  title: string;
  hoursLeft?: number;
  businessRated?: boolean;
  influencerRated?: boolean;
  photo: string;
}
```

### Removed Fields
- `subtitle` - replaced by `getDealCaption(state, role, opts).text`
- `kind` - redundant with `state`; all branching now uses `state` directly
- `cta` - implicit via chevron affordance; no string needed

## Audit Results

Forbidden ad-hoc patterns searched in source files (`app/`, `components/`, `constants/`, `lib/`, `types/`):
- "Story Set delivered" - CLEAN
- "Respond within" - CLEAN
- "Tomorrow at" - CLEAN
- "Drafts due" - CLEAN
- "Rate now" (lowercase) - CLEAN (only in resolver source)
- "In progress" (lowercase) - CLEAN (only in resolver source)
- "Waiting . " (lowercase) - CLEAN (only in resolver source)

Documentation files (`docs/`) and reference files (`references/`) may contain these strings and are exempt.

## Cases Handled (Business Dashboard)

| State | businessRated | Caption | Badge |
|-------|--------------|---------|-------|
| DELIVERED | n/a | REVIEW DELIVERY | Package icon |
| COMPLETED | false | RATE NOW | Star icon |
| COMPLETED | true | COMPLETE | (not an attention item) |

## Cases Deferred

- **Influencer Dashboard**: Not built yet. The resolver and types are ready; when the Influencer dashboard ships, it can use `getDealCaption(state, 'INFLUENCER', opts)` directly.
- **PENDING attention items for Influencer**: Defined in resolver (`RESPOND . {N}H LEFT`) but no Influencer dashboard to consume them yet.

## Acceptance Criteria

- [x] No ad-hoc subtitle strings in AttentionItem type
- [x] No `kind` field - use `state` instead
- [x] AttentionBanner renders caption via getDealCaption()
- [x] Caption color derived from tier (accent/inkMuted/inkSubtle)
- [x] At least one attention item visible in dev mock data
- [x] TypeScript compiles cleanly
