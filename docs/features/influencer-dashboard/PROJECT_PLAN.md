# Project Plan: Influencer Dashboard
Generated: 2026-05-12
Status: READY FOR REVIEW

## Product Requirements

**Scope**: Full implementation of the Influencer Dashboard at `app/(influencer)/index.tsx`.

**MVP Decisions**:
- Tap targets for AttentionItem, DealRow, PerkClaimRow, Bell icon, Quick actions all log to console (future: route to detail screens)
- "SEE ALL" on Active claims logs to console (future: All Claims screen)
- Empty state of EarningsCard implemented (when `thisMonth === 0`)
- Section title "Needs your attention" matches Business Dashboard convention

**Out of Scope**:
- Notifications screen
- Deal detail screen
- Perk claim detail screen
- All claims list screen
- Storefront editor routing

## Technical Plan

**File Structure**:
```
components/influencer/dashboard/
  index.ts                      # Barrel export
  InfluencerTopBar.tsx          # Greeting + name + bell with notification dot
  EarningsCard.tsx              # Hero earnings (default + empty states)
  InfluencerAttentionItem.tsx   # Monogram + kind-icon overlay + earnings
  InfluencerDealRow.tsx         # Business counterparty deal row
  PerkClaimRow.tsx              # Active perk claim row

constants/
  mockInfluencerDashboard.ts    # Maya's dashboard data

types/
  influencerDashboard.ts        # Dashboard-specific types
```

**Reused Components** (cross-folder import from `components/business/`):
- `SectionHeader` - already supports count + actionLabel
- `ActionTile` - already supports primary variant
- `StatTile` - extended with `starred` + `hint` props

**Mock Data**: Maya Cohen with values from reference (thisMonth 2460, 4 deals, allTime 9840, trend +32%).

## Design Specs

**Pixel-Fidelity Checklist** (per reference):

1. **Top Bar**: padding 16/20/14, greeting mono 10/0.2em/inkMuted, name display 26/800/-0.04em, bell 38x38 surface+border radius 10, notification dot 8x8 accent with bg border and notificationDot shadow

2. **Hero Earnings Card**: padding 22/20, radius 18, surface+border
   - Default: "EARNED THIS MONTH" mono 9/0.18em, trend pill accentSoft+ArrowUpRight 11, amount display 42/800/-0.045em, split row with 1x28 divider
   - Empty: "THIS MONTH" + "Your first deal is\naround the corner." display 26 + body 13 inkMuted

3. **Needs Your Attention**: section title, gap 8, primary (accentSoft+accentBorder) vs default (surface+border), 44x44 monogram + 20x20 kind-icon overlay, bannerTitle 14.5, monoStatus 9.5, earnings rowPrimary 16, chevron 18

4. **Active Deals**: section title + count, gap 8, 40x40 monogram, rowTitle 15, status row with 3x3 dot, earnings + chevron 16, statusAccent toggles accent vs inkMuted

5. **Quick Actions**: 2-up grid gap 8, primary Gift "Browse perks"/"BARTER", secondary Edit3 "Edit storefront"/"PROFILE"

6. **Active Claims**: section title + "SEE ALL" action, 40x40 monogram, rowTitle 15, deadline monoStatus accent, chevron 16 accent

7. **Overview**: 3-up grid gap 8, StatTile with starred (Rating) and hint (This month + "DEALS")

## Implementation Summary

**Files Created**:
- `/types/influencerDashboard.ts` - Dashboard types
- `/constants/mockInfluencerDashboard.ts` - Maya mock data + empty state mock
- `/components/influencer/dashboard/InfluencerTopBar.tsx`
- `/components/influencer/dashboard/EarningsCard.tsx`
- `/components/influencer/dashboard/InfluencerAttentionItem.tsx`
- `/components/influencer/dashboard/InfluencerDealRow.tsx`
- `/components/influencer/dashboard/PerkClaimRow.tsx`
- `/components/influencer/dashboard/index.ts`

**Files Modified**:
- `/components/business/StatTile.tsx` - Added `starred` + `hint` props
- `/app/(influencer)/index.tsx` - Full dashboard implementation

## Code Review

**Section-by-Section Pixel Check**:
- [x] Top bar padding matches (16/20/14)
- [x] Greeting uses monoGreeting token (mono 10, 0.2em, 500, uppercase)
- [x] Name uses displayXl token (26, 800, -0.04em) with trailing period
- [x] Bell button 38x38, radius 10, surface+border
- [x] Notification dot 8x8, accent bg, 2px bg border, notificationDot shadow
- [x] EarningsCard padding 22/20, radius 18
- [x] "EARNED THIS MONTH" uses custom mono 9, 0.18em (JetBrainsMono-SemiBold)
- [x] Trend pill accentSoft, ArrowUpRight 11 strokeWidth 2.6
- [x] Amount display 42, 800, -0.045em
- [x] Split row 1px border-top, paddingTop 12, 1x28 vertical divider
- [x] Empty state headline display 26, 800, line 1.1
- [x] Empty state body 13, inkMuted, line 1.5
- [x] AttentionItem primary uses accentSoft+accentBorder
- [x] Monogram 44x44, kind-icon overlay 20x20
- [x] DealRow 40x40 monogram, chevron 16
- [x] Status color accent when statusAccent, else inkMuted
- [x] PerkClaimRow deadline uses accent color
- [x] StatTile starred shows filled Star 11 in accent
- [x] No "hunter" or "talent" terminology leaked
- [x] All Pressables have accessibilityRole + accessibilityLabel

## QA Report

**Test Cases**:
1. [PASS] Dashboard renders with Maya's mock data
2. [PASS] Top bar shows time-appropriate greeting (morning/afternoon/evening)
3. [PASS] Hero card shows formatted earnings with toLocaleString()
4. [PASS] Trend pill shows +32% with up arrow
5. [PASS] "Needs your attention" section appears when items exist
6. [PASS] First attention item is primary styled, rest are default
7. [PASS] Active deals section shows count in header
8. [PASS] Quick actions grid has primary + secondary tiles
9. [PASS] Active claims shows "SEE ALL" action link
10. [PASS] Overview stats show Active, Rating (with star), This month (with hint)
11. [PASS] Empty state: Switch to MAYA_DASHBOARD_EMPTY shows empty earnings card

**Terminology Check**: Grep for "hunter|talent" returns no matches in new files.

**A11y Check**: All interactive elements have accessibilityRole="button" and accessibilityLabel.

## Final Status
- Bugs found: 0
- Blockers: No
- Ready to ship: YES

## Next Steps
1. User: Push branch and open PR
2. Future: Wire tap targets to actual navigation (notifications, deal detail, claim detail)
3. Future: Connect to real data (Supabase)
4. Future: Add pull-to-refresh
5. Future: Add skeleton loading states
