# QA Report: See All — Discover Overflow Screen

Tester: QA Agent
Date: 2026-05-18
Status: **PENDING VISUAL VERIFICATION**

## Test Plan

### Entry Point Tests (Influencer - Perks)

| Test Case | Expected | Status |
|-----------|----------|--------|
| Tap "See all" on "Top match for Maya" row | Opens See All, subtitle shows "Best match . N perks" | PENDING |
| Tap "See all" on "Expiring soon" row | Opens See All, subtitle shows "Expires soonest . N perks" | PENDING |
| Tap "See all" on "New perks" row | Opens See All, subtitle shows "Newest . N perks" | PENDING |
| Tap "See all" on "Near you in Tel Aviv" row | Opens See All, subtitle shows "Best match . N perks" | PENDING |

### Entry Point Tests (Business - Talent)

| Test Case | Expected | Status |
|-----------|----------|--------|
| Tap "See all" on "Top match for FitBar" row | Opens See All, subtitle shows "Best match . N creators" | PENDING |
| Tap "See all" on "Trending in Tel Aviv" row | Opens See All, subtitle shows "Best match . N creators" | PENDING |
| Tap "See all" on "Top rated" row | Opens See All, subtitle shows "Highest rated . N creators" | PENDING |
| Tap "See all" on "New on The Hub" row | Opens See All, subtitle shows "Newest . N creators" | PENDING |
| Tap "See all" on "Available right now" row | Opens See All, subtitle shows "Best match . N creators" | PENDING |

### Sort Behavior Tests

| Test Case | Expected | Status |
|-----------|----------|--------|
| Entry via "Expiring soon" shows badge "1" | Filter button has badge with "1" | PENDING |
| Change sort in filter sheet | Subtitle updates immediately | PENDING |
| Sort changes to default | Badge count decrements by 1 | PENDING |
| Reset filters | Sort returns to "Best match", badge clears | PENDING |

### Search Tests

| Test Case | Expected | Status |
|-----------|----------|--------|
| Type in search (Perks) | Results filter to matching perks | PENDING |
| Type in search (Talent) | Results filter to matching talent | PENDING |
| Tap clear-X | Search clears, all results shown | PENDING |
| Search + filters combined | Both apply to results | PENDING |
| Search "xyz" (no matches) | Empty state shown | PENDING |

### Filter Sheet Tests

| Test Case | Expected | Status |
|-----------|----------|--------|
| Open filter sheet (Perks) | PerkFilterSheet opens with Sort at bottom | PENDING |
| Open filter sheet (Talent) | FilterSheet opens with Sort at bottom | PENDING |
| Select category | Results filter immediately (live apply) | PENDING |
| Tap Reset | All filters + sort reset to default | PENDING |
| Pan down to dismiss | Sheet closes, filters persist | PENDING |

### Grid Layout Tests

| Test Case | Expected | Status |
|-----------|----------|--------|
| Grid shows 2 columns | Cards in 2-up layout | PENDING |
| Cards fill width | Cards flex to fill column width | PENDING |
| Gap between cards | 12px horizontal and vertical gap | PENDING |
| Scrolling | Smooth scroll, no janks | PENDING |

### Card Tests

| Test Case | Expected | Status |
|-----------|----------|--------|
| Perk card shows badge | Badge visible for "Top match", "New" | PENDING |
| Perk card shows value | Value chip visible (e.g., "250") | PENDING |
| Talent card shows rating | Rating chip visible for rated talent | PENDING |
| Talent card NO pulse-dot | No availability indicator | PENDING |
| Tap card | Navigates to detail screen | PENDING |

### Empty State Tests

| Test Case | Expected | Status |
|-----------|----------|--------|
| Filter to no results | Shows "NOTHING MATCHES" | PENDING |
| Search to no results | Shows "NOTHING MATCHES" | PENDING |
| Tap "Reset filters" | Filters cleared, results shown | PENDING |

### Navigation Tests

| Test Case | Expected | Status |
|-----------|----------|--------|
| Tap back button | Returns to Discover | PENDING |
| System back (Android) | Returns to Discover | PENDING |
| Filter sheet X button | Closes sheet, stays on See All | PENDING |

### Visual Tests

| Test Case | Expected | Status |
|-----------|----------|--------|
| Title "All perks" / "All talent" | Display 20/800, correct color | PENDING |
| Subtitle format | "SORT . N PERKS" uppercase mono | PENDING |
| Back button | 36x36 circle, surface bg | PENDING |
| Filter button inactive | 38x38 circle, surface bg | PENDING |
| Filter button active | accentSoft bg, accentBorder | PENDING |
| Badge position | Top-right of filter button, -3/-3 offset | PENDING |
| Search placeholder (Perks) | "Search perks or business..." | PENDING |
| Search placeholder (Talent) | "Search talent or category..." | PENDING |

### Performance Tests

| Test Case | Expected | Status |
|-----------|----------|--------|
| Initial render | Fast, no visible jank | PENDING |
| Filter change | Results update immediately | PENDING |
| Scroll large list | Smooth 60fps | PENDING |
| Filter sheet open | Smooth rise animation | PENDING |

## Regression Tests

| Test Case | Expected | Status |
|-----------|----------|--------|
| Discover home still works | All rows show, filter works | PENDING |
| Card taps on Discover | Navigate to detail screens | PENDING |
| Filter sheet on Discover | Opens correctly | PENDING |

## Test Results Summary

- Total tests: 50+
- Passed: 0
- Failed: 0
- Pending: All (requires visual verification in simulator)

## Notes

1. All test cases require visual verification in iOS simulator
2. Entry-point tests are highest priority (verify locked decision #3)
3. Sort label tests verify locked decision #5
4. Badge count tests verify locked decision #6

## Simulator Instructions

To verify:
1. Start Expo dev server: `npx expo start`
2. Open in iOS simulator: Press `i`
3. Navigate to Discover tab (both personas)
4. Tap "See all" on each row
5. Verify subtitle, badge, filters, cards

## Sign-off

QA Verification: PENDING
Visual Confirmation Required: YES
