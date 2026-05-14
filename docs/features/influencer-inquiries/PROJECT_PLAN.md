# Project Plan: Influencer Inquiries

**Generated**: 2026-05-14  
**Status**: READY TO SHIP (pending cleanup)

## Overview

Wire the shared Inquiries inbox surface for the influencer persona. The screen component is already role-agnostic; this feature adds the influencer route, mock data, and cleans up module location.

## Product Requirements

- Influencer sees their inbox of booking requests from businesses
- Counterparties are businesses with monogram avatars (no photos)
- Same UI as business inquiries, different data
- EmptyState shows influencer-specific copy (no CTA)
- Demo stub replaced with real route

See: `docs/features/influencer-inquiries/requirements.md`

## Technical Plan

### Module Rename
Moved `components/business/inquiries/` to `components/inquiries/`:
- Cleaner single source of truth
- Matches convention for shared modules
- Only one import needed update (`app/(business)/inquiries.tsx`)

### New Files
- `constants/mockInfluencerInquiries.ts` - 5 threads covering v0.8 caption matrix
- `app/(influencer)/inquiries.tsx` - Route mounting InquiriesScreen

### Mock Data Fixtures

| ID | Business | State | SubState | Caption Maya Sees | Pinned |
|----|----------|-------|----------|-------------------|--------|
| i-thr-1 | Bellboy | PENDING | - | RESPOND BY 47H | Yes |
| i-thr-2 | FitBar TLV | IN_PROGRESS | - | IN PROGRESS | No |
| i-thr-3 | Sushi Bar | COMPLETED | neither-rated | RATE NOW | Yes |
| i-thr-4 | BeautyBar | COMPLETED | influencer-rated | AWAITING THEIR RATING | No |
| i-thr-5 | Onza | COMPLETED | business-rated | RATE NOW | Yes (unread) |

See: `docs/features/influencer-inquiries/tech-plan.md`

## Design Specs

N/A - No UI changes. The shared InquiriesScreen handles both personas. Avatar rendering is data-driven (monogram vs photo based on counterparty shape).

See: `docs/features/influencer-inquiries/design-spec.md`

## Implementation Summary

### Files Created
| File | Description |
|------|-------------|
| `components/inquiries/*` | Moved from `components/business/inquiries/` (8 files) |
| `constants/mockInfluencerInquiries.ts` | Influencer-side mock threads |
| `app/(influencer)/inquiries.tsx` | Influencer route |

### Files Updated
| File | Change |
|------|--------|
| `app/(business)/inquiries.tsx` | Import path: `@/components/inquiries` |

### Files to Delete
| File | Reason |
|------|--------|
| `components/business/inquiries/*` | Superseded by `components/inquiries/` |

## Code Review

**Verdict**: APPROVE (pending cleanup)

- Mock data covers all v0.8 caption states
- Business names match `mockInfluencerDashboard.ts` for correlation
- No hard rule violations
- Requires deletion of old `components/business/inquiries/` directory

See: `docs/features/influencer-inquiries/code-review.md`

## QA Report

**Status**: PASS

All 10 test cases passed:
- Business inquiries works after module rename
- Influencer inquiries renders with mock data
- Monogram avatars render correctly
- Pinned/All sections have correct threads
- Captions match v0.8 resolver
- Empty state shows influencer copy
- Search and navigation work

See: `docs/features/influencer-inquiries/qa-report.md`

## Final Status

| Metric | Value |
|--------|-------|
| Bugs found | 0 |
| Blockers | No |
| Ready to ship | YES (after cleanup) |

## Pre-Merge Checklist

1. Delete old directory:
   ```bash
   rm -rf components/business/inquiries/
   ```

2. Verify TypeScript:
   ```bash
   npx tsc --noEmit
   ```

3. Create branch and PR:
   ```bash
   git checkout -b feature/influencer-inquiries
   git add .
   git commit -m "feat(influencer-inquiries): wire shared inbox surface for influencers"
   gh pr create --draft --title "feat(influencer-inquiries): wire shared inbox surface for influencers" --base main
   ```

## PR Description

```markdown
## Summary

Wires the shared Inquiries inbox surface for the influencer persona.

## Changes

- **Module rename**: `components/business/inquiries/` -> `components/inquiries/`
- **New mock data**: `constants/mockInfluencerInquiries.ts` (5 threads)
- **New route**: `app/(influencer)/inquiries.tsx`
- **Updated import**: `app/(business)/inquiries.tsx`

## Mock Data Fixtures

| Business | State | Caption |
|----------|-------|---------|
| Bellboy | PENDING | RESPOND BY 47H |
| FitBar TLV | IN_PROGRESS | IN PROGRESS |
| Sushi Bar | COMPLETED (neither-rated) | RATE NOW |
| BeautyBar | COMPLETED (influencer-rated) | AWAITING THEIR RATING |
| Onza | COMPLETED (business-rated) | RATE NOW |

## Notes

- Module renamed for clarity (was misleadingly in `business/` despite being shared)
- Captions come from `getDealCaption()` - no hardcoded strings
- Avatar dispatching is data-driven (monogram for businesses, photo for influencers)
```

## Next Steps

1. User deletes `components/business/inquiries/` directory
2. User runs `npx tsc --noEmit` to verify types
3. User creates branch and draft PR
4. User tests on device
5. User merges when ready
