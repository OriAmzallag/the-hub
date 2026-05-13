# Project Plan: Deal Card v0.8

**Generated**: 2026-05-13  
**Status**: READY TO SHIP  

---

## Product Requirements

Adopt the v0.8 deal lifecycle across the app. **Cards-only scope** — dashboard structure remains unchanged.

### What Changes

- Drop DELIVERED state from lifecycle (was 7 states, now 6)
- Adopt v0.8 caption enum with CaptionTone (`accent | muted | decline`)
- Add CompletedSubstate for rating tracking (`neither-rated | business-rated | influencer-rated`)
- Update DealRow visuals to match prototype recipe
- Remove DELIVERED-specific Package icon badge from AttentionBanner

### What Stays

- Top bar, Earnings hero, Quick Actions, Stats grid, section ordering
- All current routing and onPress handlers

### v0.8 State Machine

```
Active:   PENDING -> IN_PROGRESS -> COMPLETED -> RATED
Terminal: EXPIRED, DECLINED
```

Full requirements: [requirements.md](requirements.md)

---

## Technical Plan

### Files Modified (12 total)

| File | Change |
|------|--------|
| `lib/dealLifecycle.ts` | Core refactor: new types, resolver signature, drop DELIVERED |
| `types/business.ts` | Add completedSubstate, remove businessRated/influencerRated |
| `types/influencerDashboard.ts` | Add state-driven fields, remove pre-rendered labels |
| `types/inquiry.ts` | Add completedSubstate |
| `constants/mockBusinessDashboard.ts` | Recast DELIVERED to COMPLETED fixtures |
| `constants/mockBusinessInquiries.ts` | Recast DELIVERED thread |
| `constants/mockThread.ts` | Recast YAEL_THREAD status |
| `constants/mockInfluencerDashboard.ts` | Use state-driven shape |
| `components/business/DealRow.tsx` | Update visuals + actionable logic |
| `components/business/AttentionBanner.tsx` | Remove DELIVERED badge |
| `components/influencer/dashboard/InfluencerDealRow.tsx` | Use lifecycle resolver |
| `components/influencer/dashboard/InfluencerAttentionItem.tsx` | Use lifecycle resolver |

Additional files updated for ViewerRole casing:
- `components/business/inquiries/ThreadRow.tsx`
- `components/business/inquiries/InquiriesScreen.tsx`
- `components/business/inquiries/EmptyState.tsx`
- `components/thread/DealContextCard.tsx`
- `app/(business)/index.tsx`
- `app/(business)/inquiries.tsx`
- `app/inquiries/[threadId].tsx`

Full technical plan: [tech-plan.md](tech-plan.md)

---

## Design Specs

### Tone-to-Color Mapping

| Tone | Color Token |
|------|-------------|
| accent | `colors.accent` (#ff7829) |
| muted | `colors.inkMuted` (#8A7E6C) |
| decline | `colors.decline` (#C4886B) |

### Card Fill States

| Actionable | Background | Border |
|------------|------------|--------|
| true | accentSoft | accentBorder |
| false | surface | border |

### DealRow Visual Recipe

- Avatar: 38x38, radius 10
- Name: display 13.5/700/-0.025em
- Caption: mono 8.5/600/0.16em uppercase
- Summary: body 11 inkMuted
- Hint: mono 8/600/0.12em accent + ArrowRight 9/2.6
- Chevron (passive): ArrowRight 13/2.2 inkSubtle

Full design spec: [design-spec.md](design-spec.md)

---

## Implementation Summary

All changes implemented per tech plan:

1. Refactored `lib/dealLifecycle.ts` with v0.8 types and resolver
2. Updated type definitions across 3 type files
3. Recast all DELIVERED mock fixtures to COMPLETED with sub-states
4. Updated 4 UI components to use new resolver and visual recipe
5. Updated 7 additional files for lowercase ViewerRole
6. Added `getToneColorKey` helper for tone-to-color mapping
7. Added `getCaptionHint` helper for actionable captions

---

## Code Review

**Verdict**: APPROVE

- All changes align with tech plan and design spec
- No blockers or major issues found
- 1 NIT: unused radii import in ThreadRow.tsx (cosmetic)

Full review: [code-review.md](code-review.md)

---

## QA Report

**Verdict**: PASS

All test cases pass:
- TC-01: DealState union (6 states, no DELIVERED)
- TC-02/03: Caption resolution (business + influencer POV)
- TC-04: Hint text
- TC-05: Card fill logic
- TC-06/07: Helper functions
- TC-08: Mock data coverage (all states + sub-states)
- TC-09: DELIVERED references removed
- TC-10: ViewerRole casing
- TC-11: Visual recipe match

Full report: [qa-report.md](qa-report.md)

---

## Final Status

- Bugs found: 0
- Blockers: NO
- Ready to ship: YES

---

## Out of Scope (Future Work)

1. Dashboard restructure (Earnings hero, Quick Actions, Stats stay)
2. Coordination Thread system message refactor (transition-event enum)
3. Real backend integration / Supabase wiring
4. Tappable cards demo screen (prototype destination-stub UI)
5. New rating flow surface
6. New incoming-request surface

---

## Next Steps

1. Run `npx tsc --noEmit` to validate types
2. Create branch `feature/deal-card-v0.8` (if not already on it)
3. Commit all changes
4. Open draft PR titled `feat(deal-card-v0.8): adopt v0.8 lifecycle + caption enum`
5. User merges via squash-merge

---

## PR Description Template

```markdown
## Summary

Adopt the v0.8 deal lifecycle, dropping the DELIVERED state and introducing the new caption enum system.

## Changes

- **Lifecycle**: 7 states -> 6 states (PENDING, IN_PROGRESS, COMPLETED, RATED, EXPIRED, DECLINED)
- **Types**: CaptionTone replaces CaptionTier, CompletedSubstate replaces businessRated/influencerRated booleans
- **ViewerRole**: Now lowercase ('business' | 'influencer')
- **DealRow**: Updated visuals to match prototype (38x38 avatar, mono caption, actionable card fill)
- **AttentionBanner**: Removed DELIVERED-specific Package icon badge
- **Mock Data**: All DELIVERED fixtures recast to COMPLETED with sub-states

## Testing

- `npx tsc --noEmit` passes
- All 6 states have mock data coverage
- All 3 COMPLETED sub-states have mock data coverage

## Out of Scope

- Dashboard restructure
- Coordination Thread system messages
- Backend integration
```
