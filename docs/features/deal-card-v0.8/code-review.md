# Deal Card v0.8 — Code Review

**Reviewer**: Code Reviewer Agent  
**Date**: 2026-05-13  
**Status**: APPROVE  

---

## Summary

Reviewed the v0.8 lifecycle refactor. All changes align with the tech plan and design spec. The implementation correctly drops the DELIVERED state, adopts the new type system, updates mock data, and refactors UI components to match the prototype visual recipe.

---

## Files Reviewed

### Core Lifecycle (`lib/dealLifecycle.ts`)

**Verdict**: APPROVE

Changes:
- Removed DELIVERED from DealState union (6 states now)
- Renamed CaptionTier -> CaptionTone with values `accent | muted | decline`
- Changed ViewerRole to lowercase `business | influencer`
- Added CompletedSubstate union type
- Added DeclineReason union type
- Changed getDealCaption signature to accept DealCaptionInput object
- Added getCaptionHint helper
- Added getToneColorKey helper
- Updated requiresAction to delegate to getDealCaption
- Updated isActiveOnDashboard to remove DELIVERED case

Notes:
- Exhaustive switch statements maintained with `never` checks
- JSDoc updated to reflect v0.8 caption table
- All functions properly typed

### Types (`types/business.ts`, `types/influencerDashboard.ts`, `types/inquiry.ts`)

**Verdict**: APPROVE

Changes:
- Replaced businessRated/influencerRated booleans with completedSubstate
- Added rating and declineReason fields where needed
- Removed pre-rendered statusLabel/statusAccent from InfluencerDeal
- JSDoc updated to reflect new state model

### Mock Data (`constants/mock*.ts`)

**Verdict**: APPROVE

Changes:
- Recast DELIVERED fixtures to COMPLETED with sub-states
- Added all 3 sub-state fixtures (neither-rated, business-rated, influencer-rated)
- Added RATED fixture with rating value
- Updated deriveAttentionItems to check PENDING and COMPLETED states
- Updated thread mock to use COMPLETED

Notes:
- Template chip `{ id: 'delivered', label: 'All delivered' }` correctly left unchanged (chat quick-reply, not deal state)

### UI Components

#### `components/business/DealRow.tsx`

**Verdict**: APPROVE

Changes:
- Updated to new getDealCaption signature
- Added actionable card fill logic (accentSoft/accentBorder vs surface/border)
- Added hint row with getCaptionHint
- Updated visual recipe to match prototype:
  - Avatar 38x38 with radius 10
  - Caption 8.5px mono at 0.16em tracking
  - Hint 8px mono at 0.12em tracking
  - Arrow sizes: 9/2.6 actionable, 13/2.2 passive

#### `components/business/AttentionBanner.tsx`

**Verdict**: APPROVE

Changes:
- Removed DELIVERED-specific Package icon badge
- Updated badge logic: PENDING -> Inbox, COMPLETED -> Star
- Updated to new getDealCaption signature

#### `components/influencer/dashboard/InfluencerDealRow.tsx`

**Verdict**: APPROVE

Changes:
- Refactored from pre-rendered statusLabel/statusAccent to lifecycle resolver
- Added actionable card fill logic
- Updated visual recipe to match prototype

#### `components/influencer/dashboard/InfluencerAttentionItem.tsx`

**Verdict**: APPROVE

Changes:
- Refactored from pre-rendered kind/subtitle to lifecycle resolver
- Removed 'deliver' kind (was for DELIVERED)
- State-to-icon mapping: PENDING -> Inbox, COMPLETED -> Star

#### `components/business/inquiries/ThreadRow.tsx`

**Verdict**: APPROVE

Changes:
- Updated to new getDealCaption signature
- Renamed caption.tier -> caption.tone
- Uses getToneColorKey for color mapping

#### `components/business/inquiries/InquiriesScreen.tsx`

**Verdict**: APPROVE

Changes:
- Updated requiresAction call to new signature
- Updated role comparisons to lowercase

#### `components/thread/DealContextCard.tsx`

**Verdict**: APPROVE

Changes:
- Updated to new getDealCaption signature
- Added dynamic status color using getToneColorKey

### Route Files

#### `app/(business)/index.tsx`, `app/(business)/inquiries.tsx`

**Verdict**: APPROVE

Changes:
- Updated role strings to lowercase ('business')

#### `app/inquiries/[threadId].tsx`

**Verdict**: APPROVE

Changes:
- Updated role strings to lowercase ('business', 'influencer')

#### `components/business/inquiries/EmptyState.tsx`

**Verdict**: APPROVE

Changes:
- Updated role comparison to lowercase

---

## Issues Found

### MINOR

1. **Unused radii import in ThreadRow.tsx**
   - Line 8: `radii` is imported but not used
   - Recommendation: Remove unused import
   - Severity: NIT (cosmetic)

### No blockers or major issues found.

---

## Type Safety Check

- All DealState usages updated to 6-state union
- No remaining references to 'DELIVERED' in runtime code
- ViewerRole consistently lowercase throughout
- CompletedSubstate properly optional with default fallback

---

## Recommendation

**APPROVE** — Ready to merge after TypeScript validation passes.
