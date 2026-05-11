# Influencer Discover (Perks) - Product Requirements

**Feature:** Influencer Discover Tab  
**Version:** 1.0 (MVP)  
**Date:** 2026-05-11  
**Status:** APPROVED

---

## Overview

The Influencer Discover tab is a **perks marketplace browser** where influencers browse offers from businesses. A "perk" is a defined exchange: the influencer performs a social action (e.g., "3 IG Stories", "1 IG Reel") in return for value (food, classes, products worth a specific amount in NIS).

This is NOT the Business Discover (which is "browse influencers to book"). The two screens share zero data and minimal logic.

---

## User Stories

### Core Browse Flow
1. **As an influencer**, I want to browse available perks organized by curated rows (Top match, Expiring soon, New perks, Near you) so I can quickly find relevant opportunities.
2. **As an influencer**, I want to filter perks by category using horizontal chips so I can focus on my areas of interest.
3. **As an influencer**, I want to see each perk's value (in NIS), required action, and whether I qualify based on my follower count.

### Filter & Sort Flow
4. **As an influencer**, I want to open a filter sheet to refine perks by category, value range, qualification status, urgency, and sort order.
5. **As an influencer**, I want to see active filters as removable chips below the category bar so I know what's filtering my results.
6. **As an influencer**, I want to clear individual filters by tapping the X on a chip, or clear all filters at once.

### Qualification Status
7. **As an influencer**, I want to see at a glance whether I qualify for each perk (based on my follower count on the required platform) so I don't waste time on offers I can't claim.

### Empty & Loading States
8. **As an influencer**, I want to see a helpful empty state with a "Reset filters" button when my filters yield zero perks.
9. **As an influencer**, I want to see a shimmer skeleton while perks are loading so the screen feels responsive.

---

## Scope Decisions

### MVP Row Sections (Confirmed)
The reference shows 4 row sections. All 4 are MVP:
1. **Top match for {Name}** - Personalized based on influencer's categories
2. **Expiring soon** - Perks with limited time left
3. **New perks** - Recently added offers
4. **Near you in {City}** - Location-based (uses influencer's city from profile)

### Sort Behavior Decision
**Decision: MVP keeps row-based layout always.**

When sort is NOT "Recommended":
- Rows remain visible with their titles
- Perks within each row are reordered according to the sort criterion
- This preserves the curated browsing experience while respecting user sort preference

Rationale: Collapsing into a flat grid would lose the context of why perks appear (top match vs. expiring vs. new). Users can still see "Value: high to low" ordering within each row. A future iteration may add a "flat grid" view toggle.

### Viewer Reach Data Source
**Decision: Hardcode for MVP, plan for MAYA_COHEN.platforms.**

For MVP, viewer reach is hardcoded as:
```typescript
{ IG: 47200, TikTok: 82100, YouTube: 8400 }
```

**Tech Lead note:** In production, extract numeric values from `MAYA_COHEN.platforms` (parsing "47.2K" to 47200). Add a helper `lib/reachParser.ts` or similar. Flag this as a follow-up.

---

## Functional Requirements

### FR-1: Screen Header
- Title "Discover" using `sectionTitle` typography
- Filter button (38x38, accent-soft background) on the right
- Count badge on filter button when filters are active (showing count)

### FR-2: Category Chips
- Horizontal scroll, single-select
- Options: "All", "Food", "Fitness", "Beauty", "Lifestyle", "Wellness", "Drinks"
- "All" is default and shows all perks
- Active chip: solid accent + accent shadow + bg text
- Inactive chip: surface + border + ink text

### FR-3: Active Filter Chip Bar
- Only visible when filters are active AND not loading
- Header row: "{N} FILTERS ACTIVE" (mono accent) + "CLEAR ALL" (mono inkMuted, tappable)
- Horizontal scroll of accentSoft pills with "Label x" format, each tappable to remove
- Sources: selected categories (from sheet, not the top chip), value range (when not 0-1000), "I qualify", "Expiring soon", non-default sort

### FR-4: Perk Rows
- Each row has:
  - Display title (20/700/-0.035em)
  - Optional mono accent subtitle
  - "SEE ALL" button (mono inkMuted) - non-functional in MVP (future: navigate to filtered list)
- Horizontal scroll of PerkCards

### FR-5: Perk Card (200px wide)
- Cover: 4:5 aspect ratio, radius 14, 1px borderStrong
- Top-left badge (frosted dark pill): shows perk's `badge` OR "EXPIRING" when `expiringSoon`
- Bottom scrim gradient (0 to 0.75 alpha black)
- Bottom-left value chip: frosted dark pill, "NIS{value}"
- Caption block:
  - Title (display 14.5/700, ink, 1 line ellipsis)
  - Business name (mono 9/0.15em uppercase inkMuted)
  - Required action (mono 9/0.12em uppercase ink)
  - Threshold + qualification: "{N}K+ on {Platform}" inkMuted + dot separator + status

### FR-6: Qualification Status
- Compare viewer's `reach[platform]` to perk's `requiredFollowers`
- If qualified: accent color + "You qualify" + check icon (9px)
- If not qualified: decline color + "Below threshold"

### FR-7: Filter Sheet
- Bottom sheet, 92% max height
- Drag handle + header (mono caption + "Filters" title + close button)
- Sections:
  1. Categories (multi-select pills, no "All")
  2. Value range (Min/Max number inputs, default 0-1000)
  3. Reach: "Show only perks I qualify for" toggle
  4. Urgency: "Expiring soon only" toggle
  5. Sort by: Recommended (default), Value: high to low, Newest, Expiring soonest
- Sticky footer: "Reset" outline pill + "Apply filters" accent pill

### FR-8: Loading State
- 3 skeleton rows, 2 visible skeleton cards per row
- Shimmer animation matching existing codebase pattern

### FR-9: Empty State
- Centered display-L headline "Try widening / your search." (two lines)
- Mono caption "NO PERKS MATCH"
- Body copy explaining what filters to drop
- Primary accent pill "Reset filters" that clears everything (including category chip back to "All")

---

## Out of Scope (MVP)

1. "SEE ALL" row navigation - button renders but is non-functional
2. Perk detail screen / claiming flow
3. Real API integration - uses mock data
4. Flat grid view when sorting
5. Location-based filtering (Near you row exists but no actual geolocation)

---

## Acceptance Criteria

1. Screen replaces the "Coming soon" stub at `app/(influencer)/discover.tsx`
2. All three states render correctly: loading, content, empty
3. Category chips are single-select with visual feedback
4. Filter sheet opens/closes with correct animation
5. Active filter chips appear and are individually removable
6. Perk cards show qualification status correctly
7. TypeScript strict mode passes (`npx tsc --noEmit`)
8. No lint errors
