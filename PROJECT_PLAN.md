# Project Plan: Perk Detail and Deliverables

Generated: 2026-05-11
Status: READY TO SHIP
Branch: feature/perk-detail-and-deliverables

---

## Executive Summary

This feature bundles two inseparable changes into a single PR:

**Change A: Perk Model Refactor** - Each `Perk` now carries a `deliverables[]` array instead of flat `requiredAction`/`requiredPlatform`/`requiredFollowers` fields. Qualification = viewer's reach meets the requirement on EVERY deliverable.

**Change B: Perk Detail Screen** - New screen at `/perks/[id]` with three render states (qualified, below/partial, claimed) that consumes the new data shape.

---

## Product Requirements

**PM Decision - Description field**: Option (a) selected - `description?: string` added to `PerkDeliverable` everywhere for single source of truth.

**PM Decision - "Open inquiry" MVP destination**: Routes to `/(influencer)/inquiries` tab as placeholder until backend exists.

**Scope**: Both changes ship together - the detail screen cannot type-check against the old model.

Full requirements: `docs/features/perk-detail-and-deliverables/requirements.md`

---

## Technical Plan

**Data Model**:
- `PerkDeliverable` type with platform, action, requiredFollowers, description?
- `Perk` updated to use `deliverables[]` array
- `PerkDetail` for rich detail view with business object
- `QualificationStatus` enum: 'full' | 'partial' | 'none'

**Routing**: `/perks/[id]` top-level (outside tab group)

**Sheet Pattern**: ConfirmSheet uses canonical Modal + GestureHandlerRootView + isMounted + requestAnimationFrame pattern

Full plan: `docs/features/perk-detail-and-deliverables/tech-plan.md`

---

## Design Specs

Three render states: qualified, below/partial, claimed. All specs use existing theme.ts tokens - no new design tokens required.

Full spec: `docs/features/perk-detail-and-deliverables/design-spec.md`

---

## Implementation Summary

### Files Modified (Change A)
| File | Change |
|------|--------|
| `types/perk.ts` | Type definitions updated, added PerkDeliverable, PerkDetail, QualificationStatus |
| `constants/mockInfluencerPerks.ts` | Mock data + PERK_DETAILS added |
| `lib/perkQualification.ts` | New helpers (deliverableQualifies, getOverallQualification, getCardPlatformLine) |
| `lib/perkFilters.ts` | Uses updated qualifiesForPerk (no breaking changes) |
| `components/influencer/discover/PerkCard.tsx` | Uses new helpers + added Pressable navigation |

### Files Created (Change B)
| File | Purpose |
|------|---------|
| `app/perks/[id].tsx` | Route handler with state machine |
| `components/influencer/perk-detail/index.ts` | Barrel export |
| `components/influencer/perk-detail/PerkDetailTopBar.tsx` | Sticky top bar with scroll animation |
| `components/influencer/perk-detail/PerkHero.tsx` | 4:3 hero image |
| `components/influencer/perk-detail/PerkIdentity.tsx` | Category + title + business tile |
| `components/influencer/perk-detail/QualificationBanner.tsx` | Full/partial/none states |
| `components/influencer/perk-detail/PerkStatsRow.tsx` | 3-up bento grid |
| `components/influencer/perk-detail/DeliverableTile.tsx` | Per-deliverable with qualification |
| `components/influencer/perk-detail/DeadlinePill.tsx` | Deadline display |
| `components/influencer/perk-detail/ConfirmSheet.tsx` | Claim confirmation |
| `components/influencer/perk-detail/ClaimedSuccess.tsx` | Success state with animation |

---

## Code Review

**Status: APPROVED**

No blocking issues. Code follows established patterns, uses design system correctly, maintains type safety.

Full review: `docs/features/perk-detail-and-deliverables/code-review.md`

---

## QA Report

**Status: PASSED**

All test cases pass. Type safety verified. No bugs found.

Full report: `docs/features/perk-detail-and-deliverables/qa-report.md`

---

## Final Status

- **Bugs Found:** 0
- **Blockers:** NO
- **Ready to Ship:** YES

---

## Next Steps

1. User pushes branch `feature/perk-detail-and-deliverables` to origin
2. User opens PR to merge into `main`
3. Squash merge (per repo workflow)

---

## Future Iterations (Out of Scope)

- Backend integration for claim API
- Real inquiry thread creation on claim
- Notification to business on claim
- Persist favorite state

---

*End of Project Plan*
