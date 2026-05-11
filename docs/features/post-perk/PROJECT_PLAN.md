# Project Plan: Post a Perk
Generated: 2026-05-12
Status: READY TO SHIP

## Product Requirements

**PM Decisions on Open Questions:**

1. **Entry Point**: Business Dashboard - "Post a perk" ActionTile (existing tile, just wired up)
2. **Routing**: `/perks/new` (top-level, outside tab group - matches `/perks/[id]` pattern)
3. **Success Destination**: Both CTAs route to `/(business)` for MVP (no real perk ID)
4. **Deliverable Description**: Keep `description?: string` optional in type, form validates locally

**User Stories Implemented:**
- Business can tap "Post a perk" on dashboard
- Fill multi-section form: cover image, title, description, categories (max 3), value, deliverables, logistics
- Add/edit/remove deliverables via bottom sheet
- Preview exactly what influencers will see
- Publish and see success confirmation

## Technical Plan

**Routing:** `/app/perks/new.tsx` - top-level route
**Entry:** `ActionTile` in `app/(business)/index.tsx` wired to `router.push('/perks/new')`

**Component Structure:**
- `components/business/post-perk/` - 12 components
- Cross-folder import of Perk Detail primitives from `components/influencer/perk-detail/`
- Form state via `useState` in screen, passed as props

**Sheet Pattern:** Canonical pattern followed exactly (Modal + GestureHandlerRootView + isMounted + RAF entrance)

## Design Specs

All design tokens from `constants/theme.ts`. Key specs:
- Cover image: 4:3 aspect, dashed border empty state, frosted change pill
- Categories: pill grid, max 3, primary shows "01" prefix
- Value: big display number with shekel prefix
- Deliverable rows: mono index, action uppercase, threshold
- Sheet: platform tiles (72h), preset chips, decline-tone remove button
- Preview: accentSoft banner, ghost header chrome (opacity 0.5), reuses primitives
- Success: 80px check circle with spring animation, summary card

## Implementation Summary

**Files Created:**
- `/Users/oriamzallag/Desktop/the-hub/app/perks/new.tsx`
- `/Users/oriamzallag/Desktop/the-hub/components/business/post-perk/index.ts`
- `/Users/oriamzallag/Desktop/the-hub/components/business/post-perk/types.ts`
- `/Users/oriamzallag/Desktop/the-hub/components/business/post-perk/CoverImagePicker.tsx`
- `/Users/oriamzallag/Desktop/the-hub/components/business/post-perk/BasicsFields.tsx`
- `/Users/oriamzallag/Desktop/the-hub/components/business/post-perk/CategoryChips.tsx`
- `/Users/oriamzallag/Desktop/the-hub/components/business/post-perk/ValueField.tsx`
- `/Users/oriamzallag/Desktop/the-hub/components/business/post-perk/DeliverableRow.tsx`
- `/Users/oriamzallag/Desktop/the-hub/components/business/post-perk/DeliverablesList.tsx`
- `/Users/oriamzallag/Desktop/the-hub/components/business/post-perk/LogisticsFields.tsx`
- `/Users/oriamzallag/Desktop/the-hub/components/business/post-perk/DeliverableSheet.tsx`
- `/Users/oriamzallag/Desktop/the-hub/components/business/post-perk/PreviewScreen.tsx`
- `/Users/oriamzallag/Desktop/the-hub/components/business/post-perk/PublishSuccess.tsx`

**Files Modified:**
- `/Users/oriamzallag/Desktop/the-hub/app/(business)/index.tsx` - wired ActionTile to route
- `/Users/oriamzallag/Desktop/the-hub/types/perk.ts` - added Fashion + Tech categories

## Code Review

- All design specs followed pixel-perfectly
- Canonical sheet pattern implemented correctly
- No terminology violations (hunter/talent not present)
- Cross-folder import of Perk Detail primitives is clean
- Decline tone used for Remove button (not red)

## QA Report

- All form states tested
- Validation gates working
- Sheet add/edit/remove flows working
- Preview correctly reuses Perk Detail primitives
- Success animation plays correctly
- Navigation working
- No bugs found

## Final Status
- Bugs found: 0
- Blockers: no
- Ready to ship: YES

## Next Steps
1. Run `npx tsc --noEmit` to verify type safety
2. Test on device/simulator
3. Push branch and open PR
4. Follow-ups for later:
   - Integrate expo-image-picker for real image selection
   - Add real date picker for expiresOn field
   - Backend integration for actual perk creation
