# Project Plan: See All — Discover Overflow Screen

Generated: 2026-05-18
Status: READY FOR VISUAL QA

## Product Requirements

See All is the unified grid destination when the user taps `See all` on any curated row on the Discover surfaces. ONE screen per persona (Business -> Talent, Influencer -> Perks), NOT one screen per row.

**Six Locked Decisions:**
1. One screen per persona — entry param drives initial sort only
2. Reuse existing cards and filter sheets — no duplication
3. Entry-point -> sort mapping (locked per spec)
4. Sort taxonomies (locked per spec)
5. Subtitle = live sort label, not entry label
6. Filter badge count includes sort when != best_match

**Entry-Point Mapping (Perks):**
- `best_match` / `row-match` -> Best match
- `expiring` / `row-expiring` -> Expires soonest
- `new` / `row-new` -> Newest
- `near_you` / `row-tlv` -> Best match

**Entry-Point Mapping (Talent):**
- `top_match` / `row-match` -> Best match
- `trending` / `row-trending` -> Best match
- `top_rated` / `row-toprated` -> Highest rated
- `new` / `row-new` -> Newest
- `available` / `row-available` -> Best match

**Sort Taxonomies:**
- Perks: Best match, Expires soonest, Newest, Value: high -> low
- Talent: Best match, Highest rated, Newest, Available first

Full reference: `/Users/oriamzallag/Desktop/the-hub/references/see-all.reference.jsx`

## Creative Direction

N/A — Standard UI feature, no creative differentiation needed.

## Technical Plan

**New Routes:**
- `app/(influencer)/see-all.tsx` — All Perks screen
- `app/(business)/see-all.tsx` — All Talent screen

**REUSED Components (no changes needed to core logic):**
- `PerkCard` — Added optional `style` prop for grid flex sizing
- `InfluencerCard` — Added optional `style` prop for grid flex sizing
- `PerkFilterSheet` — Full reuse, no changes
- `FilterSheet` (talent) — Full reuse, no changes
- Theme tokens from `constants/theme.ts`

**Modified Components:**
- `PerkRow.tsx` — Wired "See all" to `/see-all?entry={row.id}`
- `InfluencerRow.tsx` — Wired "See all" to `/see-all?entry={row.id}`
- `PerkCard.tsx` — Added `style?: ViewStyle` prop
- `InfluencerCard.tsx` — Added `style?: ViewStyle` prop

**Updated Screens:**
- `app/(business)/discover.tsx` — Removed TODO comment, let InfluencerRow handle routing

**Pattern:**
- Route params drive initial sort via `ENTRY_SORT_MAP`
- FlatList `numColumns={2}` for 2-up grid
- Search + filter state local to screen
- Filter sheets opened via Modal (same pattern as Discover)

## Design Specs

Pixel-perfect from reference `/references/see-all.reference.jsx`:

**Top Bar:**
- Back button: 36x36 circle, surface bg, border
- Title: `InterTight-ExtraBold` 20px, -0.7 letter-spacing
- Subtitle: `JetBrainsMono-SemiBold` 9.5px, 0.18em tracking, uppercase
- Filter button: 38x38 circle, badge top-right with 1.5px bg border

**Search Bar:**
- Pill-shaped: radius 100 (pill)
- Padding: 10px 14px
- Mag icon: 15px, inkMuted
- Clear-X: 20x20 circle, surfaceAlt bg

**Grid:**
- 2 columns, 12px gap
- Cards flex to fill (width: 100%)
- Padding: 16px horizontal

**Empty State:**
- Mono title: "NOTHING MATCHES"
- Body: 14px, 0.7 opacity
- Reset button: outlined pill

**Filter Sheet:**
- Full reuse of existing PerkFilterSheet / FilterSheet
- Sort section at bottom (already present)
- Reset only footer (no Apply — filters apply live)

## Implementation Summary

**Files Created:**
- `app/(influencer)/see-all.tsx` (272 lines)
- `app/(business)/see-all.tsx` (293 lines)
- `docs/features/see-all/PROJECT_PLAN.md`
- `docs/features/see-all/code-review.md`
- `docs/features/see-all/qa-report.md`

**Files Modified:**
- `components/influencer/discover/PerkCard.tsx` — Added style prop
- `components/business/discover/InfluencerCard.tsx` — Added style prop
- `components/influencer/discover/PerkRow.tsx` — Wired See All routing
- `components/business/discover/InfluencerRow.tsx` — Wired See All routing
- `app/(business)/discover.tsx` — Removed obsolete onSeeAllPress prop

**Key Implementation Details:**
1. Route param `entry` maps to initial sort via lookup table
2. Cards use `width: '100%'` in grid (wrapper provides calculated width)
3. Filter badge count increments by 1 when sort != default
4. Subtitle is live: `{SORT_LABEL} . {N} PERKS|CREATORS`
5. TalentCard has NO pulse-dot (per production decision)

## Code Review

**Status:** APPROVE

- All six locked decisions verified
- Pattern consistency maintained
- Accessibility implemented
- Maximum component reuse achieved
- No blocking issues

Full review: `/docs/features/see-all/code-review.md`

## QA Report

**Status:** PENDING VISUAL VERIFICATION

- 50+ test cases documented
- Requires simulator verification
- Entry-point tests highest priority

Full report: `/docs/features/see-all/qa-report.md`

## Final Status

- Bugs found: 0 (code review)
- Blockers: NO
- Ready to ship: PENDING QA

## Files Changed

### New Files
```
app/(influencer)/see-all.tsx
app/(business)/see-all.tsx
docs/features/see-all/PROJECT_PLAN.md
docs/features/see-all/code-review.md
docs/features/see-all/qa-report.md
```

### Modified Files
```
components/influencer/discover/PerkCard.tsx
components/business/discover/InfluencerCard.tsx
components/influencer/discover/PerkRow.tsx
components/business/discover/InfluencerRow.tsx
app/(business)/discover.tsx
```

## Branch & PR

- **Branch:** `feature/see-all`
- **Base:** `main`
- **PR:** To be created after branch push

## Reuse Compliance

**Fully Reused (no modification to core logic):**
- PerkFilterSheet — filter chrome, all 5 sections, live apply, Reset only
- FilterSheet (talent) — filter chrome, all 10 sections, live apply, Reset only
- Theme tokens — all colors, radii, typography from constants/theme.ts

**Minimally Extended (backward compatible):**
- PerkCard — added optional `style` prop
- InfluencerCard — added optional `style` prop

**New (justified):**
- See All screens — required for 2-up grid layout (horizontal scroll != grid)
- Top bar with subtitle — ScreenHeader pattern extended but not overwritten

## Deviations from Spec

None. All six locked decisions and all locked copy implemented exactly as specified.

## Next Steps (Post-Merge)

1. **Backend integration** — Replace mock data with Supabase queries
2. **Pagination** — Infinite scroll for large result sets
3. **Analytics** — Track entry point -> sort -> conversion
4. **Search debounce** — Optimize for real-time backend queries
