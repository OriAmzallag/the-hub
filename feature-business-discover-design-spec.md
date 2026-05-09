# Feature: Business Discover Screen - Design Specification

**Date**: 2026-05-09  
**Author**: Designer Agent  
**Status**: APPROVED

---

## 1. Overview

Complete design specification for the Business Discover screen, derived from the JSX reference with exact pixel values, typography, colors, and animation timings.

---

## 2. Screen Layout

### 2.1 Overall Structure
- **Background**: `colors.bg` (#1A1815)
- **Safe area**: Respects top inset for status bar
- **Scroll**: Full-height ScrollView with `paddingBottom: 100` for tab bar clearance

---

## 3. Header Section

### 3.1 Container
- **Padding**: 14px top, 16px horizontal, 10px bottom
- **Background**: `colors.bg` (#1A1815)
- **Layout**: flexDirection row, gap 8px, alignItems center

### 3.2 Search Bar
- **Flex**: 1 (fills available space)
- **Background**: `colors.surface` (#2A2620)
- **Border**: 1px solid
  - Default: `colors.border` (rgba(244,240,232,0.08))
  - Active (text present): `colors.borderStrong` (rgba(244,240,232,0.15))
- **Border radius**: 100 (pill shape)
- **Padding**: 10px vertical, 14px horizontal
- **Layout**: flexDirection row, alignItems center, gap 10px

### 3.3 Search Icon
- **Size**: 16px
- **Stroke width**: 2.2
- **Color**: 
  - Default: `colors.inkMuted` (#8A7E6C)
  - Active: `colors.ink` (#F4F0E8)

### 3.4 Search Input
- **Font**: Inter Tight
- **Font size**: 14px
- **Font weight**: 500 (Medium)
- **Color**: `colors.ink` (#F4F0E8)
- **Placeholder color**: (native default, slightly muted)
- **Placeholder text**: "Search talent or category..."

### 3.5 Filter Button
- **Size**: 42x42px
- **Border radius**: 50% (21px)
- **Background**: `colors.surface` (#2A2620)
- **Border**: 1px solid `colors.border`
- **Icon**: Sliders, 17px, strokeWidth 2.2, `colors.ink`

---

## 4. Category Chips Section

### 4.1 Container
- **Layout**: horizontal ScrollView
- **Padding**: 6px top, 16px horizontal, 14px bottom
- **Gap**: 8px between chips
- **Scroll indicators**: hidden

### 4.2 Chip (Inactive)
- **Padding**: 8px vertical, 14px horizontal
- **Background**: `colors.surface` (#2A2620)
- **Border**: 1px solid `colors.border`
- **Border radius**: 100 (pill)
- **Font**: Inter Tight
- **Font size**: 13px
- **Font weight**: 600 (SemiBold)
- **Color**: `colors.ink` (#F4F0E8)
- **Letter spacing**: -0.01em (-0.13px)

### 4.3 Chip (Active)
- **Background**: `colors.accent` (#FF7A29)
- **Border**: 1px solid `colors.accent`
- **Color**: `colors.bg` (#1A1815)
- **Shadow**: 
  - shadowColor: `colors.accentShadow` (rgba(255,122,41,0.30))
  - shadowOffset: { width: 0, height: 6 }
  - shadowOpacity: 1
  - shadowRadius: 16
  - elevation: 6

---

## 5. Loading State (Skeleton)

### 5.1 Skeleton Row Container
- **Margin top**: 22px
- **3 rows total**

### 5.2 Skeleton Header
- **Padding**: 0 16px horizontal
- **Margin bottom**: 12px
- **Layout**: flexDirection row, justifyContent space-between

### 5.3 Skeleton Title Block
- **Width**: Row 1: 200px, Rows 2-3: 140px
- **Height**: 22px
- **Border radius**: 6px
- **Background**: Shimmer gradient

### 5.4 Skeleton "See all" Block
- **Width**: 50px
- **Height**: 12px
- **Border radius**: 4px
- **Background**: Shimmer gradient

### 5.5 Skeleton Cards Container
- **Layout**: flexDirection row, gap 10px
- **Padding**: 0 16px horizontal
- **Overflow**: hidden

### 5.6 Skeleton Card
- **Width**: 168px
- **Layout**: flexDirection column, gap 10px

#### Image Skeleton
- **Width**: 100%
- **Aspect ratio**: 4:5
- **Border radius**: 14px
- **Background**: Shimmer gradient

#### Name Skeleton
- **Width**: Card 1: 70%, Card 2: 55%, Card 3: 80%
- **Height**: 14px
- **Border radius**: 4px
- **Margin left**: 2px
- **Background**: Shimmer gradient

### 5.7 Shimmer Gradient
- **Colors**: 
  - 0%: `colors.surface` (#2A2620)
  - 30%: `colors.surfaceAlt` (#221F1A)
  - 50%: #34302a (slightly lighter)
  - 70%: `colors.surfaceAlt` (#221F1A)
  - 100%: `colors.surface` (#2A2620)
- **Animation**: 1.6s linear infinite, background-position sweep -400px to 400px

---

## 6. Content State

### 6.1 Talent Row Container
- **Margin top**: 22px
- **Animation**: fade-up with 50ms stagger per row

### 6.2 Row Header
- **Padding**: 0 16px horizontal
- **Margin bottom**: 12px
- **Layout**: flexDirection row, alignItems baseline, justifyContent space-between

### 6.3 Row Title
- **Font**: Inter Tight
- **Font size**: 20px
- **Font weight**: 700 (Bold)
- **Color**: `colors.ink` (#F4F0E8)
- **Letter spacing**: -0.035em (-0.7px)
- **Line height**: 1.1 (22px)

### 6.4 Row Subtitle
- **Font**: JetBrains Mono
- **Font size**: 9.5px
- **Font weight**: 500 (Medium)
- **Color**: `colors.accent` (#FF7A29)
- **Letter spacing**: 0.18em (1.71px)
- **Text transform**: uppercase
- **Margin top**: 5px

### 6.5 "See all" Button
- **Layout**: flexDirection row, alignItems center, gap 2px
- **Font**: JetBrains Mono
- **Font size**: 10px
- **Font weight**: 500 (Medium)
- **Color**: `colors.inkMuted` (#8A7E6C)
- **Letter spacing**: 0.15em (1.5px)
- **Text transform**: uppercase
- **Icon**: ChevronRight, 12px, strokeWidth 2.4

### 6.6 Cards ScrollView
- **Layout**: horizontal ScrollView
- **Gap**: 10px
- **Padding**: 0 16px horizontal
- **Scroll indicators**: hidden

---

## 7. Talent Card

### 7.1 Container
- **Width**: 168px (fixed)
- **Layout**: flexDirection column, gap 10px
- **Text align**: left

### 7.2 Image Container
- **Width**: 100%
- **Aspect ratio**: 4:5 (168 x 210)
- **Border radius**: 14px
- **Overflow**: hidden
- **Border**: 1px solid `colors.borderStrong` (rgba(244,240,232,0.15))

### 7.3 Image
- **contentFit**: cover
- **Transition**: 200ms (expo-image)

### 7.4 Badge Pill (if present)
- **Position**: absolute, top 10px, left 10px
- **Padding**: 5px vertical, 10px horizontal
- **Border radius**: 100 (pill)
- **Background**: rgba(26, 24, 21, 0.85)
- **Backdrop filter**: blur(8px) - use expo-blur BlurView
- **Border**: 1px solid `colors.accentBorder` (rgba(255,122,41,0.40))
- **Font**: JetBrains Mono
- **Font size**: 9px
- **Font weight**: 600 (SemiBold)
- **Color**: `colors.accent` (#FF7A29)
- **Letter spacing**: 0.18em (1.62px)
- **Text transform**: uppercase

### 7.5 Available Pulse Dot (if available)
- **Position**: absolute, top 12px, right 12px
- **Size**: 10x10px
- **Border radius**: 50% (5px)
- **Background**: `colors.accent` (#FF7A29)
- **Border**: 2px solid rgba(0,0,0,0.5)
- **Shadow**: 0 0 10px `colors.accent`
- **Animation**: pulse-dot 2s ease-in-out infinite (opacity 1 <-> 0.4)

### 7.6 Bottom Gradient Scrim
- **Position**: absolute, left 0, right 0, bottom 0
- **Height**: 70px
- **Background**: linear-gradient to top, rgba(0,0,0,0.75) to transparent
- **Pointer events**: none

### 7.7 Rating Chip (if rating exists)
- **Position**: absolute, bottom 10px, left 10px
- **Layout**: flexDirection row, alignItems center, gap 4px
- **Padding**: 4px vertical, 8px right, 7px left
- **Background**: rgba(26, 24, 21, 0.85)
- **Backdrop filter**: blur(8px)
- **Border radius**: 100 (pill)

#### Star Icon
- **Size**: 10px
- **Fill**: `colors.accent` (#FF7A29)
- **Stroke**: none

#### Rating Value
- **Font**: Inter Tight
- **Font size**: 11.5px
- **Font weight**: 700 (Bold)
- **Color**: `colors.ink` (#F4F0E8)
- **Letter spacing**: -0.02em (-0.23px)
- **Line height**: 1

### 7.8 Name (below card)
- **Padding**: 0 2px horizontal
- **Font**: Inter Tight
- **Font size**: 14.5px
- **Font weight**: 700 (Bold)
- **Color**: `colors.ink` (#F4F0E8)
- **Letter spacing**: -0.025em (-0.36px)
- **Line height**: 1.15 (16.7px)
- **Overflow**: hidden, ellipsis, no wrap

---

## 8. Empty State

### 8.1 Container
- **Padding**: 60px vertical, 32px horizontal
- **Layout**: flexDirection column, alignItems center
- **Text align**: center
- **Animation**: fade-up on mount

### 8.2 Icon Box
- **Size**: 64x64px
- **Border radius**: 16px
- **Background**: `colors.surface` (#2A2620)
- **Border**: 1px solid `colors.border`
- **Layout**: center content
- **Margin bottom**: 24px

### 8.3 Icon
- **Icon**: Search
- **Size**: 26px
- **Stroke width**: 2
- **Color**: `colors.inkMuted` (#8A7E6C)

### 8.4 Caption
- **Font**: JetBrains Mono
- **Font size**: 10px
- **Font weight**: 500 (Medium)
- **Color**: `colors.inkMuted` (#8A7E6C)
- **Letter spacing**: 0.25em (2.5px)
- **Text transform**: uppercase
- **Margin bottom**: 14px

### 8.5 Headline
- **Font**: Inter Tight
- **Font size**: 30px
- **Font weight**: 800 (ExtraBold)
- **Color**: `colors.ink` (#F4F0E8)
- **Letter spacing**: -0.045em (-1.35px)
- **Line height**: 0.95 (28.5px)
- **Margin bottom**: 10px
- **Text**: "Try widening\nyour search." (multiline)

### 8.6 Body Text
- **Font**: Inter Tight
- **Font size**: 14px
- **Font weight**: 400 (Regular)
- **Color**: `colors.ink` at 70% opacity
- **Line height**: 1.5 (21px)
- **Margin bottom**: 28px
- **Max width**: 30ch

### 8.7 Reset Button
- **Background**: `colors.accent` (#FF7A29)
- **Color**: `colors.bg` (#1A1815)
- **Border**: none
- **Padding**: 14px vertical, 26px horizontal
- **Border radius**: 100 (pill)
- **Font**: Inter Tight
- **Font size**: 14px
- **Font weight**: 700 (Bold)
- **Letter spacing**: -0.015em (-0.21px)
- **Shadow**:
  - shadowColor: `colors.accentShadow`
  - shadowOffset: { width: 0, height: 6 }
  - shadowOpacity: 1
  - shadowRadius: 18

---

## 9. Filter Panel

### 9.1 Overlay
- **Position**: absolute, inset 0
- **Background**: rgba(0, 0, 0, 0.55)
- **Backdrop filter**: blur(2px)
- **Animation**: overlay-fade 300ms ease-out

### 9.2 Sheet Container
- **Position**: absolute, left 0, right 0, bottom 0
- **Background**: `colors.bg` (#1A1815)
- **Border top-left radius**: 22px
- **Border top-right radius**: 22px
- **Border top**: 1px solid `colors.borderStrong`
- **Max height**: 92%
- **Shadow**: 0 -20px 60px rgba(0,0,0,0.5)
- **Animation**: sheet-rise 420ms cubic-bezier(0.32, 0.72, 0, 1)

### 9.3 Drag Handle
- **Container padding**: 10px top, 6px bottom
- **Layout**: center
- **Handle size**: 36x4px
- **Border radius**: 2px
- **Background**: `colors.borderStrong`

### 9.4 Sheet Header
- **Padding**: 8px top, 22px horizontal, 18px bottom
- **Border bottom**: 1px solid `colors.border`
- **Layout**: flexDirection row, alignItems center, justifyContent space-between

#### Super Title
- **Font**: JetBrains Mono
- **Font size**: 10px
- **Font weight**: 500
- **Color**: `colors.accent`
- **Letter spacing**: 0.2em (2px)
- **Text transform**: uppercase
- **Margin bottom**: 6px

#### Title
- **Font**: Inter Tight
- **Font size**: 26px
- **Font weight**: 800
- **Color**: `colors.ink`
- **Letter spacing**: -0.04em (-1.04px)
- **Line height**: 1

#### Close Button
- **Size**: 38x38px
- **Border radius**: 50%
- **Background**: `colors.surface`
- **Border**: 1px solid `colors.border`
- **Icon**: X, 18px, strokeWidth 2.2, `colors.ink`

### 9.5 Sheet Body
- **Overflow**: scrollY
- **Flex**: 1
- **Padding**: 20px top, 22px horizontal, 8px bottom

### 9.6 Filter Section
- **Margin bottom**: 24px

#### Section Header
- **Layout**: flexDirection row, alignItems baseline, justifyContent space-between
- **Margin bottom**: 10px

#### Section Title
- **Font**: Inter Tight
- **Font size**: 16px
- **Font weight**: 700
- **Color**: `colors.ink`
- **Letter spacing**: -0.025em (-0.4px)

#### Section Hint
- **Font**: JetBrains Mono
- **Font size**: 9.5px
- **Font weight**: 500
- **Color**: `colors.inkMuted`
- **Letter spacing**: 0.12em (1.14px)
- **Text transform**: uppercase

---

## 10. Filter Controls

### 10.1 Range Slider (Location)
- **Padding**: 8px top, 4px bottom

#### Track
- **Height**: 4px
- **Background**: `colors.borderStrong`
- **Border radius**: 2px

#### Fill
- **Background**: `colors.accent`

#### Thumb
- **Size**: 20x20px (approximate)
- **Background**: `colors.accent`
- **Border radius**: 50%

#### Labels
- **Layout**: flexDirection row, justifyContent space-between
- **Margin top**: 6px
- **Font**: JetBrains Mono
- **Font size**: 9.5px
- **Font weight**: 500
- **Color**: `colors.inkMuted`
- **Letter spacing**: 0.12em

### 10.2 Number Input (Price)
- **Container**: flexDirection row, gap 8px
- **Margin top**: 4px

#### Input Card
- **Flex**: 1
- **Background**: `colors.surface`
- **Border**: 1px solid `colors.border`
- **Border radius**: 12px
- **Padding**: 10px vertical, 14px horizontal
- **Layout**: flexDirection column, gap 2px

#### Label
- **Font**: JetBrains Mono
- **Font size**: 9px
- **Font weight**: 500
- **Color**: `colors.inkMuted`
- **Letter spacing**: 0.18em (1.62px)
- **Text transform**: uppercase

#### Value Row
- **Layout**: flexDirection row, alignItems baseline, gap 4px

#### Currency Symbol
- **Font**: Inter Tight
- **Font size**: 14px
- **Font weight**: 500
- **Color**: `colors.inkMuted`

#### Input
- **Font**: Inter Tight
- **Font size**: 16px
- **Font weight**: 700
- **Color**: `colors.ink`
- **Letter spacing**: -0.025em

### 10.3 Platform Chips
- **Container**: flexDirection row, flexWrap wrap, gap 8px
- **Margin top**: 4px

#### Chip (Inactive)
- **Padding**: 9px vertical, 14px horizontal
- **Background**: `colors.surface`
- **Border**: 1px solid `colors.border`
- **Border radius**: 100
- **Layout**: flexDirection row, alignItems center, gap 7px
- **Font**: Inter Tight
- **Font size**: 13px
- **Font weight**: 600
- **Color**: `colors.ink`
- **Letter spacing**: -0.01em
- **Icon**: 13px, strokeWidth 2.2

#### Chip (Active)
- **Background**: `colors.accentSoft`
- **Border**: 1px solid `colors.accentBorder`
- **Color**: `colors.accent`

### 10.4 Rating Buttons
- **Container**: flexDirection row, gap 6px
- **Margin top**: 4px

#### Button (Inactive)
- **Flex**: 1
- **Padding**: 12px vertical, 8px horizontal
- **Background**: `colors.surface`
- **Border**: 1px solid `colors.border`
- **Border radius**: 12px
- **Layout**: flexDirection column, alignItems center, gap 4px

#### Button (Active)
- **Background**: `colors.accentSoft`
- **Border**: 1px solid `colors.accentBorder`

#### Star Icon
- **Size**: 14px
- **Inactive**: stroke `colors.inkMuted`, strokeWidth 2, no fill
- **Active**: fill `colors.accent`, no stroke

#### Label
- **Font**: JetBrains Mono
- **Font size**: 9.5px
- **Font weight**: 600
- **Letter spacing**: 0.05em
- **Inactive**: `colors.inkMuted`
- **Active**: `colors.accent`

### 10.5 Availability Toggle
- **Margin top**: 4px

#### Container
- **Width**: 100%
- **Padding**: 14px vertical, 16px horizontal
- **Background (off)**: `colors.surface`
- **Background (on)**: `colors.accentSoft`
- **Border (off)**: 1px solid `colors.border`
- **Border (on)**: 1px solid `colors.accentBorder`
- **Border radius**: 14px
- **Layout**: flexDirection row, alignItems center, gap 12px

#### Checkbox
- **Size**: 22x22px
- **Border radius**: 6px
- **Unchecked**: 1.5px border `colors.borderStrong`, transparent bg
- **Checked**: no border, `colors.accent` bg
- **Check icon**: Check, 14px, strokeWidth 3, `colors.bg`

#### Label
- **Font**: Inter Tight
- **Font size**: 14.5px
- **Font weight**: 600
- **Color**: `colors.ink`
- **Letter spacing**: -0.02em

### 10.6 Sort Radio List
- **Container**: flexDirection column, gap 6px
- **Margin top**: 4px

#### Radio Card (Inactive)
- **Width**: 100%
- **Padding**: 13px vertical, 16px horizontal
- **Background**: `colors.surface`
- **Border**: 1px solid `colors.border`
- **Border radius**: 12px
- **Layout**: flexDirection row, alignItems center, justifyContent space-between
- **Font**: Inter Tight
- **Font size**: 14px
- **Font weight**: 600
- **Color**: `colors.ink`
- **Letter spacing**: -0.02em

#### Radio Card (Active)
- **Background**: `colors.accentSoft`
- **Border**: 1px solid `colors.accentBorder`

#### Active Indicator
- **Size**: 18x18px
- **Border radius**: 50%
- **Background**: `colors.accent`
- **Icon**: Check, 11px, strokeWidth 3, `colors.bg`

---

## 11. Sticky Footer

### 11.1 Container
- **Padding**: 14px top, 16px horizontal, 22px bottom
- **Background**: `colors.bg`
- **Border top**: 1px solid `colors.border`
- **Layout**: flexDirection row, gap 8px

### 11.2 Reset Button
- **Flex**: 1
- **Background**: transparent
- **Color**: `colors.ink`
- **Border**: 1px solid `colors.borderStrong`
- **Padding**: 16px vertical, 22px horizontal
- **Border radius**: 100
- **Font**: Inter Tight
- **Font size**: 14.5px
- **Font weight**: 700
- **Letter spacing**: -0.015em

### 11.3 Apply Button
- **Flex**: 1.5
- **Background**: `colors.accent`
- **Color**: `colors.bg`
- **Border**: none
- **Padding**: 16px vertical, 22px horizontal
- **Border radius**: 100
- **Font**: Inter Tight
- **Font size**: 14.5px
- **Font weight**: 700
- **Letter spacing**: -0.015em
- **Shadow**:
  - shadowColor: `colors.accentShadow`
  - shadowOffset: { width: 0, height: 8 }
  - shadowOpacity: 1
  - shadowRadius: 24

---

## 12. Animation Specifications

| Animation | Duration | Easing | Properties |
|-----------|----------|--------|------------|
| pulse-dot | 2000ms | ease-in-out | opacity 1 -> 0.4 -> 1 (infinite, reverse) |
| fade-up | 400ms | ease-out (Easing.out(Easing.ease)) | opacity 0 -> 1, translateY 8 -> 0 |
| shimmer | 1600ms | linear | gradient position -400px -> 400px (infinite) |
| sheet-rise | 420ms | cubic-bezier(0.32, 0.72, 0, 1) | translateY 100% -> 0% |
| overlay-fade | 300ms | ease-out | opacity 0 -> 1 |
| row-stagger | 50ms delay per row | - | applied to fade-up |

---

## 13. Typography Summary

| Style | Font | Size | Weight | Tracking | Line Height | Usage |
|-------|------|------|--------|----------|-------------|-------|
| Display XL | Inter Tight | 30px | 800 | -0.045em | 0.95 | Empty headline |
| Display LG | Inter Tight | 26px | 800 | -0.04em | 1 | Filter sheet title |
| Section Title | Inter Tight | 20px | 700 | -0.035em | 1.1 | Row titles |
| Filter Title | Inter Tight | 16px | 700 | -0.025em | - | Filter section titles |
| Card Name | Inter Tight | 14.5px | 700 | -0.025em | 1.15 | Talent names |
| Button Label | Inter Tight | 14.5px | 700 | -0.015em | - | Apply/Reset buttons |
| Body | Inter Tight | 14px | 400 | - | 1.5 | Empty state body |
| Search | Inter Tight | 14px | 500 | - | - | Search input |
| Chip | Inter Tight | 13px | 600 | -0.01em | - | Category/platform chips |
| Rating | Inter Tight | 11.5px | 700 | -0.02em | 1 | Rating value |
| Mono Subtitle | JetBrains Mono | 9.5px | 500 | 0.18em | - | Row subtitles |
| Mono Hint | JetBrains Mono | 9.5px | 500 | 0.12em | - | Filter hints |
| Mono See All | JetBrains Mono | 10px | 500 | 0.15em | - | See all button |
| Mono Caption | JetBrains Mono | 10px | 500 | 0.25em | - | Empty caption |
| Mono Badge | JetBrains Mono | 9px | 600 | 0.18em | - | Card badges |

---

## 14. New Tokens Used (vs Dashboard)

These tokens appear in Discover but were not prominently used in the Dashboard:

| Token | Value | New Usage |
|-------|-------|-----------|
| `colors.accentSoft` | rgba(255,122,41,0.12) | Active filter chips, rating buttons |
| `colors.accentBorder` | rgba(255,122,41,0.40) | Active filter chip borders, badge borders |
| `shadows.accentGlow` variant | 0 6px 16px | Active category chip |
| Typography 30px ExtraBold | - | Empty state headline |
| Typography 20px Bold | - | Row titles |
| Typography 9px SemiBold | - | Badge text |
