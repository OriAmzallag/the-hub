# Feature: Business Discover Screen

**Date**: 2026-05-09  
**Author**: PM Agent  
**Status**: APPROVED

---

## 1. Overview

The Business Discover screen is the primary talent discovery interface for business users (SMBs/brands). It allows businesses to browse, search, and filter talent profiles to find suitable collaborators for their marketing campaigns.

---

## 2. User Story

**As a** Business user (SMB/brand)  
**I want to** browse and discover talent profiles with rich filtering options  
**So that I can** find the right influencer/creator for my campaign needs

---

## 3. Screen Structure

### 3.1 Header Section
- Search bar with placeholder text "Search talent or category..."
- Search bar border tint changes to `borderStrong` when text is present
- Filter icon button (circular, right side) opens the filter panel

### 3.2 Category Chips
- Horizontal scrolling list of category chips
- Categories: All, Fitness, Lifestyle, Food, Fashion, Beauty, Music, Tech
- Active chip: accent fill with accent shadow
- Inactive chip: surface fill with border
- Selecting a category filters the visible talent rows

### 3.3 Content Body (Three Render States)

#### State A: Loading
- Displays 3 skeleton rows
- Each skeleton row has:
  - Varying-width header skeleton (row 1: 200px, rows 2-3: 140px)
  - 3 skeleton cards (4:5 aspect ratio)
  - Varying-width name skeleton below each card (70%/55%/80% widths)
- Shimmer animation: 1.6s linear infinite gradient sweep

#### State B: Content
- Displays 5 horizontal scrolling talent rows:
  1. "Top match for {business.firstName}" - subtitle "Based on your category"
  2. "Trending in Tel Aviv" - no subtitle
  3. "Top rated" - no subtitle
  4. "New on The Hub" - no subtitle
  5. "Available right now" - no subtitle
- Each row has:
  - Title (display font, 20px)
  - Optional subtitle (mono font, accent color)
  - "See all" button with chevron
  - Horizontal scroll of TalentCards
- Rows animate in with fade-up + 50ms stagger

#### State C: Empty
- Centered hero layout
- Search icon in 64x64 surface square (16px border radius)
- Mono caption: "No talent matches"
- Display headline: "Try widening\nyour search." (30px, multi-line)
- Body copy explaining options
- Primary "Reset filters" pill button
- Fade-up animation on mount

### 3.4 Talent Card
- 168px width, 4:5 aspect ratio image
- Border radius 14px, border 1px borderStrong
- Optional badge pill (top-left): "Top match", "Top rated", "New"
- Available pulse dot (top-right): 10px accent circle with glow, 2s pulse animation
- Bottom gradient scrim (70px height)
- Rating chip (bottom-left): star icon + rating value
- Name below card (14.5px, bold)

### 3.5 Filter Panel (Bottom Sheet)
Opens when filter icon is tapped.

**Structure:**
- Overlay: 55% black with 2px blur
- Sheet: slides up from bottom (420ms cubic-bezier(0.32, 0.72, 0, 1))
- Drag handle at top (36x4px, borderStrong)
- Header: "Refine your search" (mono, accent) / "Filters" (display, 26px) / X close button
- Scrollable body with sections:

**Filter Sections:**
1. **Location** - Range slider 1-50 km, hint shows current value
2. **Price range** - Two number inputs (Min/Max) with shekel prefix
3. **Platform** - Multi-select chips: Instagram, TikTok, YouTube, Event (with icons)
4. **Minimum rating** - 5 button cards (1+ through 5+), tapping active one deselects
5. **Availability** - Full-width toggle "Available now only" with checkbox visual
6. **Sort by** - Vertical radio list: Recommended, Price low->high, Price high->low, Rating, Newest

**Sticky Footer:**
- "Reset" outline button (flex: 1)
- "Apply filters" primary button (flex: 1.5)

---

## 4. State Transitions

### 4.1 Initial Load
- Screen mounts in `loading` state
- After 800-1200ms delay, transitions to `content` state

### 4.2 Empty State Trigger
For this mock implementation (deterministic logic):
- Active category not in any talent's categories array, OR
- Price max filter < 50 (since no actual price data, this triggers empty state)
- Note: Real implementation will check actual filtered results count

### 4.3 Reset Behavior
When "Reset filters" is tapped:
- All filter values return to defaults:
  - Category: "All"
  - Search: ""
  - Radius: 10
  - Price Min: 50, Max: 2000
  - Platforms: []
  - Min Rating: 0
  - Available Only: false
  - Sort: "recommended"
- State returns to `content`

---

## 5. Acceptance Criteria

### 5.1 Search Bar
- [ ] Placeholder text visible when empty
- [ ] Border color changes when text is present
- [ ] Search icon color changes when text is present

### 5.2 Category Chips
- [ ] Horizontal scroll without visible scrollbar
- [ ] Active chip has accent fill and shadow
- [ ] Inactive chips have surface fill and border
- [ ] Tapping a chip updates activeCategory state

### 5.3 Loading State
- [ ] 3 skeleton rows render
- [ ] Skeleton header widths vary (200px first, 140px others)
- [ ] Skeleton cards have 4:5 aspect ratio
- [ ] Shimmer animation runs at 1.6s linear infinite

### 5.4 Content State
- [ ] 5 rows render with correct titles
- [ ] Row 1 shows subtitle "Based on your category"
- [ ] "See all" buttons are visible and tappable
- [ ] Rows animate in with fade-up + 50ms stagger
- [ ] Horizontal scroll works for talent cards

### 5.5 Talent Cards
- [ ] 168px width, 4:5 aspect ratio
- [ ] Badge pill shows for talent with badge
- [ ] Pulse dot shows for available talent
- [ ] Rating chip shows for talent with rating
- [ ] Name displays below image

### 5.6 Empty State
- [ ] Hero layout centers correctly
- [ ] "Reset filters" button works
- [ ] Fade-up animation plays

### 5.7 Filter Panel
- [ ] Opens when filter icon tapped
- [ ] Overlay fades in (300ms)
- [ ] Sheet slides up (420ms)
- [ ] X button closes panel
- [ ] Overlay tap closes panel
- [ ] All filter sections are interactive
- [ ] Reset clears all filters
- [ ] Apply closes panel

---

## 6. Mock Data Requirements

### 6.1 Talent Array (7 items)
```
Maya Cohen - Fitness, Lifestyle - 4.9 rating - Top match badge - available
Noa Berman - Lifestyle, Fashion - 4.8 rating - no badge - available
Daniel Levi - Food, Lifestyle - 4.7 rating - no badge - not available
Yael Mizrahi - Fashion, Beauty - 5.0 rating - Top rated badge - available
Tomer Avraham - Music, Lifestyle - no rating - New badge - available
Roni Kaplan - Fitness, Wellness - 4.9 rating - no badge - available
Adi Shoham - Tech, Lifestyle - 4.6 rating - no badge - not available
```

### 6.2 Rows Array (5 items)
```
row-match: "Top match for FitBar" - talentIds: t-1, t-6, t-2, t-3
row-trending: "Trending in Tel Aviv" - talentIds: t-2, t-4, t-1, t-7
row-toprated: "Top rated" - talentIds: t-4, t-1, t-6, t-2
row-new: "New on The Hub" - talentIds: t-5, t-7, t-3
row-available: "Available right now" - talentIds: t-1, t-2, t-4, t-5, t-6
```

### 6.3 Categories
All, Fitness, Lifestyle, Food, Fashion, Beauty, Music, Tech

### 6.4 Platforms
Instagram (Instagram icon), TikTok (Music2 icon), YouTube (Youtube icon), Event (CalendarClock icon)

### 6.5 Sort Options
Recommended, Price: low -> high, Price: high -> low, Rating, Newest

---

## 7. Out of Scope

1. **Real Supabase querying** - Mock data only for this phase
2. **Real navigation destinations** - TalentCard tap does nothing
3. **"See all" routes** - Button exists but no navigation
4. **Search debouncing** - Search is immediate/local only
5. **Search result filtering** - Search bar is visual only, no filtering logic
6. **Actual geolocation** - Radius filter is visual only
7. **Real price filtering** - Price inputs don't filter actual data
8. **Keyboard handling** - Basic keyboard dismiss behavior only
9. **Pull-to-refresh** - Not implemented in this phase
10. **Deep linking** - Not implemented

---

## 8. Dependencies

### 8.1 Required (Already Installed)
- react-native-reanimated (v3.16) - animations
- expo-blur - filter panel overlay
- expo-image - talent photos
- lucide-react-native - icons
- react-native-gesture-handler - touch handling

### 8.2 May Need Addition
- @react-native-community/slider OR custom Reanimated slider - for location range slider

---

## 9. Edge Cases

| Scenario | Expected Behavior |
|----------|-------------------|
| Search bar focused | Keyboard appears, border tints |
| Search bar cleared | Border returns to default |
| Category chip tap | Updates state, chip becomes active |
| Filter sheet open + back gesture | Sheet closes |
| Multiple platform chips selected | All selected chips show active state |
| Min rating re-tapped | Deselects (returns to "Any rating") |
| Apply filters with empty results | Transitions to empty state |
| Reset filters from empty | Returns to content state |

---

## 10. Animations Summary

| Animation | Duration | Easing | Properties |
|-----------|----------|--------|------------|
| pulse-dot | 2s | ease-in-out | opacity 1<->0.4 |
| fade-up | 400ms | ease-out | opacity 0->1, translateY 8->0 |
| shimmer | 1.6s | linear | gradient position sweep |
| sheet-rise | 420ms | cubic-bezier(0.32, 0.72, 0, 1) | translateY 100%->0% |
| overlay-fade | 300ms | ease-out | opacity 0->1 |
| row-stagger | 50ms per row | - | delay between fade-up starts |
