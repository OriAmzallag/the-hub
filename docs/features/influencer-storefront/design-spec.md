# Feature: Talent Storefront
**Design Specification**
Generated: 2026-05-09
Author: Designer Agent

---

## Design System Reference

All values derive from `constants/theme.ts` (Metal x Sunset Orange palette).

### Colors
| Token | Value | Usage |
|-------|-------|-------|
| bg | #1A1815 | Screen background |
| surface | #2A2620 | Cards, tiles, disabled button |
| surfaceAlt | #221F1A | Alternative surface |
| border | rgba(244,240,232,0.08) | Subtle borders |
| borderStrong | rgba(244,240,232,0.15) | Prominent borders |
| ink | #F4F0E8 | Primary text |
| inkMuted | #8A7E6C | Secondary text, disabled |
| inkSubtle | #5C5448 | Tertiary text, unfilled stars |
| accent | #FF7A29 | Primary accent (sunset orange) |
| accentSoft | rgba(255,122,41,0.12) | Selected card bg, glow rings |
| accentBorder | rgba(255,122,41,0.40) | Selected card border |
| accentShadow | rgba(255,122,41,0.30) | Button glow |

### Typography Tokens
| Token | Font | Size | Weight | Letter-spacing | Line-height |
|-------|------|------|--------|----------------|-------------|
| displayXL (name) | InterTight-ExtraBold | 52px | 800 | -0.045em (-2.34px) | 0.92 (47.84px) |
| display22 (prices, section) | InterTight-Bold | 22px | 700 | -0.035em (-0.77px) | 22px |
| display17 (service name) | InterTight-Bold | 17px | 700 | -0.03em (-0.51px) | 17px |
| display14 (reviewer name) | InterTight-Bold | 14px | 700 | -0.025em (-0.35px) | 14px |
| body15 (bio, review text) | InterTight-Regular | 15px | 400 | 0 | 1.5 (22.5px) |
| body14 (review body) | InterTight-Regular | 14px | 400 | 0 | 1.5 (21px) |
| mono10.5 (status, labels) | JetBrainsMono-Medium | 10.5px | 500 | 0.18em (1.89px) | 10.5px |
| mono10 (counter, badge) | JetBrainsMono-SemiBold | 10px | 600 | 0.1em (1px) | 10px |
| mono9.5 (date, stat label) | JetBrainsMono-Medium | 9.5px | 500 | 0.15em (1.425px) | 12.35px |

---

## Component Specifications

### 1. TopBar

**Dimensions**
- Height: 56px (content) + safeAreaTop
- Padding: 16px horizontal

**Icon Buttons**
- Size: 40x40px
- Border radius: 20px (full)
- Background (top state): rgba(26,24,21,0.7)
- Background (scrolled state): surface (#2A2620)
- Border: 1px border color
- Icon size: 20px, strokeWidth 2

**Scrolled State Background**
- Background: rgba(26,24,21,0.92)
- Backdrop blur: 16px
- Border bottom: 1px border color

**Centered Name (scrolled)**
- Font: InterTight-Bold, 17px, -0.025em
- Color: ink
- Opacity transition: 0 -> 1 over 250ms

**Heart States**
- Unfavorited: stroke only, ink color
- Favorited: filled, accent color

---

### 2. HeroCarousel

**Container**
- Width: 100%
- Aspect ratio: 4:5

**Images**
- contentFit: cover
- No border radius (full bleed)

**Gradient Scrim**
- Height: 140px
- Position: absolute bottom
- Colors: transparent -> rgba(26,24,21,0.85)

**Pagination Dots**
- Position: bottom 20px, center horizontal
- Gap: 6px
- Active dot: 22px wide, 6px tall, accent color, 0px 0px 12px accentShadow glow
- Inactive dot: 6px wide, 6px tall, rgba(244,240,232,0.4)
- Border radius: 3px (full for height)
- Transition: width 200ms ease-out

**Image Counter**
- Position: bottom 20px, right 16px
- Font: mono10 (JetBrainsMono-SemiBold, 10px, 0.1em)
- Color: ink
- Format: "01 / 05"

---

### 3. HeaderBlock

**Container**
- Padding: 28px 22px 20px

**Status Line**
- Layout: row, gap 8px, align center
- PulsingDot: 8px, accent color
- Text: mono10.5, accent color, uppercase
- Content: "AVAILABLE . TEL AVIV" (use center dot)

**Name Block**
- Layout: row, align flex-start
- Name: displayXL (52px, weight 800, -0.045em tracking, 0.92 line-height)
- Line break: natural (e.g., "Maya\nCohen.")
- Color: ink

**Verified Badge**
- Icon: CheckCircle2 from lucide
- Size: 22px
- Fill: accent
- Background: bg color (circle behind check)
- Margin: top 6px (align with first line baseline)
- Margin left: 10px

**Categories**
- Margin top: 12px
- Font: mono10.5, uppercase
- Color: inkMuted
- Format: "FITNESS . LIFESTYLE . WELLNESS"
- Letter-spacing: 0.18em

**Bio**
- Margin top: 14px
- Font: body15 (15px, weight 400, line-height 1.5)
- Color: ink at 0.85 opacity
- Max width: ~32 characters per line (natural wrap)

---

### 4. BentoStats

**Container**
- Padding: 8px 22px 20px

**Stats Grid (3-up)**
- Layout: row, gap 8px
- Each tile flex: 1

**StatTile**
- Background: surface
- Border: 1px border
- Border radius: 14px
- Padding: 14px
- Min height: 86px
- Layout: column, space-between

**Stat Label**
- Font: mono9.5 (JetBrainsMono-Medium, 9.5px, 0.15em)
- Color: inkMuted
- Text transform: uppercase

**Stat Value**
- Font: display26 (InterTight-ExtraBold, 26px, weight 800, -0.04em)
- Color: ink

**Rating Tile (special)**
- Value row: display26 value + Star icon (14px, filled accent)
- Gap: 6px between value and star

**PlatformsTile (full width)**
- Margin top: 8px
- Background: surface
- Border: 1px border
- Border radius: 16px
- Padding: 16px 18px

**Platforms Label**
- Font: mono9.5
- Color: inkMuted
- Margin bottom: 12px

**Platforms Row**
- Layout: row, gap 28px between platforms
- Each platform: row, gap 9px (icon + count)
- Icon: 18px, strokeWidth 1.8, inkMuted
- Count: InterTight-Bold, 14px, -0.025em, ink

---

### 5. ServicesList

**Container**
- Padding: 20px 22px

**SectionHeader**
- Title: display22 (22px, weight 700, -0.035em)
- Color: ink
- Margin bottom: 14px

**ServiceRow**
- Background: surface (unselected) / accentSoft (selected)
- Border: 1px border (unselected) / 1px accentBorder (selected)
- Border radius: 14px
- Padding: 16px 18px
- Margin bottom: 8px
- Layout: row, space-between, align center

**Service Left Content**
- Name: display17 (17px, weight 700, -0.03em), ink
- Meta row (below name):
  - Margin top: 6px
  - Platform tag: mono9.5, inkMuted, uppercase
  - Separator: " . " in inkSubtle
  - Delivery: Clock icon (12px, inkMuted) + mono9.5 text, gap 4px

**Service Right Content**
- Layout: row, gap 14px, align center
- Price: display22 (22px, weight 700, -0.035em), ink, format "350"
- Selection circle: 24x24px

**Selection Circle (unselected)**
- Size: 24x24px
- Background: transparent
- Border: 1.5px borderStrong
- Border radius: 12px (full)

**Selection Circle (selected)**
- Size: 24x24px
- Background: accent
- Border: none
- Border radius: 12px (full)
- Shadow: 0px 0px 0px 4px accentSoft (ring)
- Badge text: mono10, 10px, weight 600, bg color

---

### 6. ReviewsPreview

**Container**
- Padding: 12px 22px 20px

**SectionHeader**
- Title: display22, ink
- Action: mono10.5, accent, "See all ->"
- Layout: row, space-between, baseline

**ReviewCard**
- Background: surface
- Border: 1px border
- Border radius: 14px
- Padding: 16px 18px
- Margin bottom: 10px

**Card Header**
- Layout: row, space-between, align center
- Business name: display14 (14px, weight 700), ink
- Stars row: 5 stars, 11px each, gap 2px
  - Filled: accent
  - Empty: inkSubtle

**Review Text**
- Margin top: 10px
- Font: body14 (14px, weight 400, line-height 1.5)
- Color: ink at 0.92 opacity
- Max: 140 characters, ellipsis truncation

**Review Date**
- Margin top: 10px
- Font: mono9.5
- Color: inkMuted
- Text transform: uppercase

---

### 7. StickyCTA

**Container**
- Position: absolute bottom 0
- Width: 100%
- Padding: 16px 22px + safeAreaBottom
- Background: rgba(26,24,21,0.94)
- Backdrop blur: 16px
- Border top: 1px border

**Layout**
- Row, space-between, align center

**Left Side (disabled state)**
- Text: mono10.5, inkMuted, uppercase
- Content: "SELECT A SERVICE"

**Left Side (active state)**
- Top line: mono10.5, accent, uppercase
- Content: "1 SERVICE SELECTED" / "2 SERVICES SELECTED"
- Bottom line: display22 (22px, weight 800), ink
- Content: total price with symbol

**Button (disabled)**
- Background: surface
- Border radius: 100px (pill)
- Padding: 16px 22px
- Text: mono10.5, inkMuted
- Content: "Request a booking ->"

**Button (active)**
- Background: accent
- Border radius: 100px (pill)
- Padding: 16px 22px
- Text: mono10.5, bg color (dark text on orange)
- Shadow: accentGlow (0px 8px 20px accentShadow)
- Content: "Request a booking ->" with ArrowRight icon (14px)

---

## Animation Timing

| Element | Property | Duration | Easing | Delay |
|---------|----------|----------|--------|-------|
| TopBar background | opacity, border | 250ms | ease | 0 |
| TopBar name | opacity | 250ms | ease | 0 |
| Carousel swipe | translateX | 400ms | cubic-bezier(0.4, 0, 0.2, 1) | 0 |
| Pagination dot | width | 200ms | ease-out | 0 |
| Section mount | opacity, translateY | 500ms | ease-out | 0-200ms stagger |
| Service selection | backgroundColor, borderColor | 150ms | ease | 0 |
| Button state | backgroundColor, shadow | 150ms | ease | 0 |

---

## Spacing Summary

| Area | Value |
|------|-------|
| Screen horizontal padding | 22px |
| Section gap (vertical) | varies per section |
| Card gap | 8-10px |
| Tile internal padding | 14-18px |
| Component internal gaps | 4-14px per spec above |

---

## Responsive Behavior

This is a mobile-first design. No tablet/desktop variants needed for MVP.

- Max content width: device width
- Images: full bleed in carousel
- Text: natural line breaks

---

## Sign-off

- [x] All pixel values documented
- [x] Typography mapped to theme tokens
- [x] Color usage specified
- [x] Animation timing defined
- [x] Component states covered
