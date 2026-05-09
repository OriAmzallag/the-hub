# Feature: Talent Storefront
**Product Requirements Document**
Generated: 2026-05-09
Author: PM Agent

---

## Overview

The Talent Storefront is the public-facing profile a Business sees when tapping a Talent card from the Discover screen. It serves as the primary conversion point where Businesses evaluate a Talent's work, services, and reputation before initiating a booking request.

---

## User Story

**As a** Business user browsing talent on the Discover screen,
**I want to** view a detailed, visually compelling storefront for any Talent I tap,
**So that I can** evaluate their portfolio, services, pricing, and reviews before deciding to request a booking.

---

## Entry Points

1. **Primary**: Tapping a TalentCard on the Discover screen (`app/(business)/discover.tsx`)
2. **Future**: Trending feed cards, Inquiries list, Bookings history (out of scope for this PR)

---

## Screen Sections (Top to Bottom)

### 1. Sticky TopBar
**Purpose**: Navigation and quick actions (back, share, favorite)

**Acceptance Criteria**:
- [ ] Back button (left) returns to previous screen
- [ ] Share button (right) - TODO placeholder for now
- [ ] Heart/Favorite button (right) toggles local "favorited" state
- [ ] Heart fills with accent color when favorited
- [ ] At scroll position 0-280px: transparent background, blur on icon buttons
- [ ] After scroll >280px: solid bg (`rgba(26,24,21,0.92)`), blurred backdrop, bottom border, talent name fades in centered
- [ ] Transition duration: 250ms ease

### 2. Hero Carousel
**Purpose**: Showcase portfolio images in an immersive, swipeable gallery

**Acceptance Criteria**:
- [ ] Displays 3-6 portfolio images
- [ ] 4:5 aspect ratio for all images
- [ ] Swipe gesture to navigate between images
- [ ] Smooth 400ms ease transition (not FlatList momentum)
- [ ] Pagination dots at bottom-center: active = 22px wide accent with glow, inactive = 6px wide ink/0.4
- [ ] Image counter at bottom-right: mono style "01 / 05"
- [ ] Bottom gradient scrim (140px tall) for readability of overlays

### 3. Header Block
**Purpose**: Primary talent identity and status

**Acceptance Criteria**:
- [ ] Mono accent status line with PulsingDot: "AVAILABLE . TEL AVIV"
- [ ] Display XL name with line break (e.g., "Maya\nCohen.")
- [ ] Verified badge (accent CheckCircle2 icon) next to name if talent is verified
- [ ] Categories row in mono: "FITNESS . LIFESTYLE . WELLNESS"
- [ ] Bio paragraph (body 15, ink @ 0.85 opacity, max ~32 characters per line)

### 4. Bento Stats Grid
**Purpose**: Quick metrics overview

**Acceptance Criteria**:
- [ ] 3-column grid: Reach, Rating (with star icon), Reviews
- [ ] Each tile: surface bg, border, radius 14, padding 14, minHeight 86
- [ ] Below: full-width Platforms tile showing each platform with icon + follower count
- [ ] Platforms displayed horizontally with appropriate spacing

### 5. Services List
**Purpose**: Multi-select service picker for booking

**Acceptance Criteria**:
- [ ] Section header "Services"
- [ ] Each service row shows: name, platform tag, delivery time (with clock icon), price
- [ ] Selection circle on far right (24x24)
- [ ] Unselected: transparent bg, 1.5px borderStrong border
- [ ] Selected: accent bg with numbered badge ("01", "02"...), 4px accentSoft ring shadow
- [ ] Selected card: accentSoft bg + accentBorder
- [ ] Selection order preserved (first selected = "01", second = "02", etc.)
- [ ] Tapping again deselects and reorders remaining badges

### 6. Reviews Preview
**Purpose**: Social proof from previous bookings

**Acceptance Criteria**:
- [ ] Section header "Reviews" with "See all ->" action (logs TODO for now)
- [ ] Shows 2 review cards
- [ ] Each card: business name, 5-star rating display, review text (truncated at 140 chars), date
- [ ] Stars: filled = accent, unfilled = inkSubtle

### 7. Sticky CTA Bar
**Purpose**: Booking action based on selection state

**Acceptance Criteria**:
- [ ] Frosted background with blur effect
- [ ] **0 services selected**: "SELECT A SERVICE" (mono inkMuted), disabled button (surface bg, inkMuted text, no shadow)
- [ ] **1 service selected**: "1 SERVICE SELECTED" (mono accent) + total price (display 22 weight 800), primary accent button with glow
- [ ] **2+ services selected**: "{N} SERVICES SELECTED" + sum of prices, same primary button
- [ ] Button text: "Request a booking ->" with arrow icon
- [ ] Button tap: logs TODO for booking request flow

---

## Edge Cases

### Empty/Missing Data
| Scenario | Behavior |
|----------|----------|
| 0 reviews | Hide Reviews section entirely |
| No bio | Hide bio paragraph, maintain spacing |
| Single service | Show normally, selection works |
| Single portfolio image | Show without pagination dots, no swipe |
| No platforms | Hide Platforms tile |

### Selection States
| Scenario | Behavior |
|----------|----------|
| All services selected | All have numbered badges, total shows sum |
| Deselect middle item | Remaining items renumber (01, 02, 03 -> 01, 02) |
| Re-select after deselect | Gets next available number |

### Navigation
| Scenario | Behavior |
|----------|----------|
| Back press | Returns to Discover (or previous screen) |
| Deep link (future) | Works with any valid talent ID |
| Invalid talent ID | Show Maya for MVP (log TODO for error handling) |

---

## Out of Scope (Future PRs)

- Actual booking request flow
- "See all" reviews navigation
- Share functionality implementation
- Favorite persistence (currently local state only)
- Dynamic talent loading from Supabase
- Deep linking from other screens

---

## Technical Notes

- Route: `app/talent/[id].tsx` (shared route, not under any tab group)
- Use mock data for MVP (always shows Maya Cohen regardless of ID)
- No Supabase integration in this PR
- Route param `id` is read but not used for lookup yet

---

## Success Metrics (Post-Launch)

1. Conversion rate: % of storefront views that lead to booking requests
2. Engagement: Average time spent on storefront
3. Service selection: Average number of services selected per booking request
4. Bounce rate: % of users who leave without interaction

---

## Sign-off

- [ ] Design review complete
- [ ] Tech review complete
- [ ] Implementation complete
- [ ] QA pass complete
