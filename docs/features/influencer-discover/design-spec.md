# Influencer Discover (Perks) - Design Specification

**Feature:** Influencer Discover Tab  
**Version:** 1.0 (MVP)  
**Date:** 2026-05-11  
**Status:** APPROVED

---

## Design System Alignment

All values derive from `constants/theme.ts`. No new tokens introduced.

### Colors Used
| Token | Value | Usage |
|-------|-------|-------|
| `colors.bg` | #1A1815 | Screen background |
| `colors.surface` | #2A2620 | Inactive chips, sheet sections |
| `colors.surfaceAlt` | #221F1A | Shimmer mid-tone |
| `colors.border` | rgba(244,240,232,0.08) | Subtle borders |
| `colors.borderStrong` | rgba(244,240,232,0.15) | Card borders, sheet top |
| `colors.ink` | #F4F0E8 | Primary text |
| `colors.inkMuted` | #8A7E6C | Secondary text, captions |
| `colors.inkSubtle` | #5C5448 | Dot separator |
| `colors.accent` | #FF7A29 | Active states, CTAs |
| `colors.accentSoft` | rgba(255,122,41,0.12) | Chip backgrounds |
| `colors.accentBorder` | rgba(255,122,41,0.40) | Active chip borders |
| `colors.accentShadow` | rgba(255,122,41,0.30) | Button glow |
| `colors.decline` | #C4886B | "Below threshold" status |
| `colors.bgScrim` | rgba(0,0,0,0.55) | Sheet overlay |
| `colors.bgOverlay85` | rgba(26,24,21,0.85) | Frosted badge bg |

### Typography Used
| Token | Spec | Usage |
|-------|------|-------|
| `typography.sectionTitle` | 22/700/-0.035em | Screen title "Discover" |
| `textScale.displayL` | 36/800/-0.04em | Empty state headline |
| Display 20/700/-0.035em | Custom | Row titles |
| Display 16/700/-0.03em | rowPrimary | Filter section titles |
| Display 14.5/700/-0.025em | bannerTitle | Card title |
| Display 13/700/-0.025em | Custom | Value chip |
| `typography.monoStatusWide` | 9.5/600/0.18em | Badge labels, filter count |
| `typography.monoStatus` | 9.5/500/0.15em | Subtitle captions |
| `typography.monoTab` | 9/500/0.12em | Required action, SEE ALL |
| Mono 9/0.15em | Custom | Business name |

### Radii Used
| Token | Value | Usage |
|-------|-------|-------|
| `radii.card` | 14 | Card covers, sheet corners (22 override) |
| `radii.pill` | 9999 | Chips, buttons |

---

## Screen States

### 1. Loading State

```
+------------------------------------------+
|  [safe area top]                         |
|  Discover                    [Filter 38] |
|------------------------------------------|
|  [All] [Food] [Fitness] [Beauty] ...     |  <- chips
|------------------------------------------|
|  [skeleton row 1 - 2 cards visible]      |
|  [skeleton row 2 - 2 cards visible]      |
|  [skeleton row 3 - 2 cards visible]      |
+------------------------------------------+
|  [Tab Bar]                               |
+------------------------------------------+
```

- 3 skeleton rows
- Each row: header shimmer (title + SEE ALL) + 2 card shimmers
- Shimmer recipe: opacity animation 0.6 -> 0.8 -> 1 -> 0.8 -> 0.6, 1600ms loop
- Skeleton card: 200x250 (4:5 aspect), radius 14
- Below card: name block (70% width), category block (40% width)

### 2. Content State

```
+------------------------------------------+
|  [safe area top]                         |
|  Discover                    [Filter 38] |
|------------------------------------------|
|  [All] [Food] [Fitness] ...              |
|------------------------------------------|
|  [Active filter chips if any]            |
|------------------------------------------|
|  Top match for Maya    Based on your...  |
|                              SEE ALL ->  |
|  [Card] [Card] [Card] ...                |
|------------------------------------------|
|  Expiring soon              SEE ALL ->   |
|  [Card] [Card] ...                       |
|------------------------------------------|
|  New perks                  SEE ALL ->   |
|  [Card] [Card] [Card] ...                |
|------------------------------------------|
|  Near you in Tel Aviv       SEE ALL ->   |
|  [Card] [Card] ...                       |
+------------------------------------------+
```

### 3. Empty State

```
+------------------------------------------+
|  [safe area top]                         |
|  Discover                    [Filter 38] |
|------------------------------------------|
|  [Food] (selected)                       |
|------------------------------------------|
|  2 FILTERS ACTIVE         CLEAR ALL      |
|  [Category x] [Qualify x]                |
|------------------------------------------|
|                                          |
|            [Search icon box]             |
|            NO PERKS MATCH                |
|                                          |
|            Try widening                  |
|            your search.                  |
|                                          |
|    Drop a category filter or toggle      |
|    to see more perks.                    |
|                                          |
|           [Reset filters]                |
|                                          |
+------------------------------------------+
```

---

## Component Specifications

### DiscoverHeader

```
Layout:
  paddingTop: safeAreaTop + 16
  paddingHorizontal: 20
  paddingBottom: 14
  flexDirection: row
  justifyContent: space-between
  alignItems: center

Title:
  typography.sectionTitle (22/700/-0.035em)
  color: colors.ink

Filter Button:
  width: 38
  height: 38
  borderRadius: 19
  backgroundColor: colors.accentSoft
  borderWidth: 1
  borderColor: colors.accentBorder
  alignItems: center
  justifyContent: center
  
  Icon: Sliders, size 17, color accent

Count Badge (when activeFilterCount > 0):
  position: absolute
  top: -4
  right: -4
  minWidth: 18
  height: 18
  borderRadius: 9
  backgroundColor: colors.accent
  paddingHorizontal: 5
  alignItems: center
  justifyContent: center
  
  Text: typography.monoBadge (8/700), color bg
```

### CategoryChips

```
Container:
  paddingHorizontal: 16
  paddingTop: 2
  paddingBottom: 12
  
ScrollView:
  horizontal
  showsHorizontalScrollIndicator: false
  contentContainerStyle: { gap: 8 }

Chip (inactive):
  paddingVertical: 10
  paddingHorizontal: 16
  backgroundColor: colors.surface
  borderWidth: 1
  borderColor: colors.border
  borderRadius: radii.pill
  
  Text: 13/600/-0.01em, color ink

Chip (active):
  backgroundColor: colors.accent
  borderColor: colors.accent
  shadowColor: colors.accentShadow
  shadowOffset: { width: 0, height: 4 }
  shadowOpacity: 1
  shadowRadius: 12
  elevation: 4
  
  Text: 13/600/-0.01em, color bg
```

### ActiveFilterChipBar

```
Container:
  paddingHorizontal: 16
  paddingTop: 4
  paddingBottom: 14
  borderBottomWidth: 1
  borderBottomColor: colors.border

Header Row:
  flexDirection: row
  justifyContent: space-between
  alignItems: center
  marginBottom: 10
  
  Left: "{N} FILTERS ACTIVE"
    typography.monoStatusWide
    color: colors.accent
    
  Right: "CLEAR ALL"
    typography.monoTab
    color: colors.inkMuted

Chips ScrollView:
  horizontal
  gap: 8

Filter Chip:
  flexDirection: row
  alignItems: center
  gap: 6
  paddingVertical: 8
  paddingLeft: 12
  paddingRight: 10
  backgroundColor: colors.accentSoft
  borderWidth: 1
  borderColor: colors.accentBorder
  borderRadius: radii.pill
  
  Label: 12/600, color accent
  X icon: size 12, color accent
```

### PerkRow

```
Container:
  marginTop: 22
  
Header:
  flexDirection: row
  justifyContent: space-between
  alignItems: flex-start
  paddingHorizontal: 16
  marginBottom: 12

Title Column:
  Title: 20/700/-0.035em, color ink
  Subtitle (if present): typography.monoStatus, color accent, marginTop 6

SEE ALL Button:
  flexDirection: row
  alignItems: center
  gap: 4
  
  Text: typography.monoTab, color inkMuted
  Arrow: ChevronRight, size 12, color inkMuted

Cards ScrollView:
  horizontal
  showsHorizontalScrollIndicator: false
  paddingHorizontal: 16
  contentContainerStyle: { gap: 10 }
```

### PerkCard (200px wide)

```
Container:
  width: 200

Cover:
  width: 200
  height: 250 (4:5 aspect)
  borderRadius: radii.card (14)
  borderWidth: 1
  borderColor: colors.borderStrong
  overflow: hidden
  position: relative

Cover Image:
  width: 100%
  height: 100%
  resizeMode: cover

Top Badge (when badge or expiringSoon):
  position: absolute
  top: 10
  left: 10
  paddingVertical: 5
  paddingHorizontal: 8
  backgroundColor: colors.bgOverlay85
  borderWidth: 1
  borderColor: colors.accentBorder
  borderRadius: radii.pill
  
  Text: typography.monoStatusWide (9/600/0.18em)
  color: colors.accent
  Label: perk.badge || "EXPIRING"

Bottom Scrim:
  position: absolute
  bottom: 0
  left: 0
  right: 0
  height: 80
  background: linear-gradient(transparent, rgba(0,0,0,0.75))

Value Chip:
  position: absolute
  bottom: 10
  left: 10
  paddingVertical: 6
  paddingHorizontal: 10
  backgroundColor: colors.bgOverlay85
  borderRadius: radii.pill
  
  Text: 13/700/-0.025em, color ink
  Format: "NIS{value}"

Caption Block:
  paddingTop: 10
  paddingHorizontal: 2

Card Title:
  typography.bannerTitle (14.5/700/-0.025em/1.1)
  color: colors.ink
  numberOfLines: 1
  ellipsizeMode: tail

Business Name:
  marginTop: 4
  fontFamily: JetBrainsMono-Medium
  fontSize: 9
  letterSpacing: 1.35 (0.15em)
  textTransform: uppercase
  color: colors.inkMuted
  numberOfLines: 1

Required Action:
  marginTop: 3
  fontFamily: JetBrainsMono-Medium
  fontSize: 9
  letterSpacing: 1.08 (0.12em)
  textTransform: uppercase
  color: colors.ink

Threshold + Qualification Row:
  marginTop: 5
  flexDirection: row
  alignItems: center
  gap: 0

  Threshold Text:
    fontFamily: JetBrainsMono-Medium
    fontSize: 9
    letterSpacing: 1.08 (0.12em)
    textTransform: uppercase
    color: colors.inkMuted
    Format: "{N}K+ ON {PLATFORM}"

  Dot Separator:
    width: 3
    height: 3
    borderRadius: 1.5
    backgroundColor: colors.inkSubtle
    marginHorizontal: 6

  Qualification Status (qualifies):
    flexDirection: row
    alignItems: center
    gap: 3
    Text: "You qualify", color accent
    Check icon: size 9, color accent

  Qualification Status (below):
    Text: "Below threshold", color decline
```

### PerkFilterSheet

```
Overlay:
  backgroundColor: colors.bgScrim
  + BlurView intensity 4, tint dark

Sheet:
  position: absolute
  bottom: 0
  left: 0
  right: 0
  backgroundColor: colors.bg
  borderTopLeftRadius: 22
  borderTopRightRadius: 22
  borderTopWidth: 1
  borderTopColor: colors.borderStrong
  maxHeight: 92%
  shadowColor: #000
  shadowOffset: { width: 0, height: -20 }
  shadowOpacity: 0.5
  shadowRadius: 60

Drag Handle:
  paddingTop: 10
  paddingBottom: 6
  alignItems: center
  
  Bar: width 36, height 4, radius 2, bg borderStrong

Header:
  flexDirection: row
  justifyContent: space-between
  alignItems: center
  paddingTop: 8
  paddingHorizontal: 22
  paddingBottom: 18
  borderBottomWidth: 1
  borderBottomColor: colors.border

  Left:
    Super Title (active): "{N} ACTIVE", monoGreeting style, color accent
    Super Title (default): "REFINE PERKS", monoGreeting style, color accent
    Title: "Filters", displayXl (26/800/-0.04em), color ink

  Close Button:
    width: 38
    height: 38
    borderRadius: 19
    backgroundColor: colors.surface
    borderWidth: 1
    borderColor: colors.border
    X icon: size 18, strokeWidth 2.2, color ink

Body ScrollView:
  paddingTop: 20
  paddingHorizontal: 22
  paddingBottom: 8

FilterSection (each):
  marginBottom: 24
  
  Header Row:
    flexDirection: row
    justifyContent: space-between
    alignItems: center
    marginBottom: 12
    
    Title: rowPrimary (16/700/-0.03em), color ink
    Hint: monoStatus, color accent

Section: Categories
  Multi-select pill grid
  Options: Food, Fitness, Beauty, Lifestyle, Wellness, Drinks (no "All")
  
  Pill (inactive):
    paddingVertical: 9
    paddingHorizontal: 14
    backgroundColor: colors.surface
    borderWidth: 1
    borderColor: colors.border
    borderRadius: 100
    Text: 13/600/-0.01em, color ink
    
  Pill (active):
    backgroundColor: colors.accentSoft
    borderColor: colors.accentBorder
    Text color: accent

Section: Value range
  Two side-by-side number inputs
  
  Input Card:
    flex: 1
    backgroundColor: colors.surface
    borderWidth: 1
    borderColor: colors.border
    borderRadius: 12
    paddingVertical: 10
    paddingHorizontal: 14
    
    Label: "MIN" / "MAX", mono 9/0.18em uppercase, color inkMuted
    Value Row: "NIS" prefix (14, inkMuted) + TextInput (16/700, ink)

Section: Reach
  Toggle row "Show only perks I qualify for"
  
  Row:
    flexDirection: row
    alignItems: center
    gap: 12
    paddingVertical: 14
    paddingHorizontal: 16
    backgroundColor: colors.surface (or accentSoft when on)
    borderWidth: 1
    borderColor: colors.border (or accentBorder when on)
    borderRadius: 14
    
    Checkbox:
      width: 22
      height: 22
      borderRadius: 6
      borderWidth: 1.5
      borderColor: borderStrong (or filled accent when on)
      Check icon: size 14, color bg (when on)
      
    Label: 14.5/600/-0.02em, color ink

Section: Urgency
  Toggle row "Expiring soon only"
  Same styling as Reach section

Section: Sort by
  Radio list (single select)
  Options: Recommended, Value: high to low, Newest, Expiring soonest
  
  Radio Row:
    flexDirection: row
    justifyContent: space-between
    alignItems: center
    paddingVertical: 13
    paddingHorizontal: 16
    backgroundColor: colors.surface (or accentSoft when active)
    borderWidth: 1
    borderColor: colors.border (or accentBorder when active)
    borderRadius: 12
    
    Label: 14/600/-0.02em, color ink
    
    Indicator (when active):
      width: 18
      height: 18
      borderRadius: 9
      backgroundColor: colors.accent
      Check icon: size 11, color bg

Footer:
  flexDirection: row
  gap: 8
  paddingTop: 14
  paddingHorizontal: 16
  paddingBottom: 22
  borderTopWidth: 1
  borderTopColor: colors.border

  Reset Button:
    flex: 1
    paddingVertical: 16
    borderWidth: 1
    borderColor: colors.borderStrong
    borderRadius: 100
    Text: 14.5/700/-0.015em, color ink

  Apply Button:
    flex: 1.5
    paddingVertical: 16
    backgroundColor: colors.accent
    borderRadius: 100
    shadowColor: accentShadow
    shadowOffset: { width: 0, height: 8 }
    shadowOpacity: 1
    shadowRadius: 24
    Text: 14.5/700/-0.015em, color bg
```

### EmptyState

```
Container:
  paddingVertical: 60
  paddingHorizontal: 32
  alignItems: center

Icon Box:
  width: 64
  height: 64
  borderRadius: 16
  backgroundColor: colors.surface
  borderWidth: 1
  borderColor: colors.border
  alignItems: center
  justifyContent: center
  marginBottom: 24
  
  Icon: Search, size 26, strokeWidth 2, color inkMuted

Caption:
  typography.monoStatusWide
  color: colors.inkMuted
  letterSpacing: 2.5
  marginBottom: 14
  Text: "NO PERKS MATCH"

Headline:
  textScale.displayL (36/800/-0.04em/1.0)
  NOTE: Use slightly smaller 30px to fit better
  fontFamily: InterTight-ExtraBold
  fontSize: 30
  letterSpacing: -1.35
  lineHeight: 29
  color: colors.ink
  textAlign: center
  marginBottom: 10
  Text: "Try widening\nyour search."

Body:
  fontSize: 14
  lineHeight: 21
  fontFamily: InterTight-Regular
  color: colors.ink
  opacity: 0.7
  textAlign: center
  marginBottom: 28
  maxWidth: 260
  Text: "Drop a category filter or toggle to see more perks."

Reset Button:
  backgroundColor: colors.accent
  paddingVertical: 14
  paddingHorizontal: 26
  borderRadius: 100
  shadowColor: colors.accentShadow
  shadowOffset: { width: 0, height: 6 }
  shadowOpacity: 1
  shadowRadius: 18
  
  Text: 14/700/-0.015em, color bg
```

### SkeletonRow

```
Container:
  marginTop: 22

Header:
  flexDirection: row
  justifyContent: space-between
  alignItems: center
  paddingHorizontal: 16
  marginBottom: 12
  
  Title Block: width varies (200/140), height 22, radius 6
  SEE ALL Block: width 50, height 12, radius 4

Cards Container:
  flexDirection: row
  gap: 10
  paddingHorizontal: 16
  overflow: hidden

Skeleton Card:
  width: 200
  gap: 8
  
  Cover Block: 200x250, radius 14
  Name Block: 70%/55%/80% width, height 13, radius 4
  Action Block: 40%/30%/45% width, height 9, radius 3

Shimmer Animation:
  useSharedValue for opacity
  withRepeat + withTiming
  Duration: 1600ms
  Easing: linear
  Opacity keyframes: 0.6 -> 0.8 -> 1 -> 0.8 -> 0.6
```

---

## Animations

### Sheet Rise
- Duration: 420ms (`motion.duration.slow`)
- Easing: cubic-bezier(0.32, 0.72, 0, 1) (`motion.easing.sheet`)
- Pan-to-dismiss: close when drag > 25% height OR velocity > 800

### Chip Press
- Scale: 0.96 on press
- Duration: 100ms
- Restore: 150ms

### Empty State Enter
- FadeInUp
- Duration: 400ms
- Easing: ease-out

---

## Accessibility

- Filter button: accessibilityRole="button", accessibilityLabel="Filters, {N} active"
- Category chips: accessibilityRole="button", accessibilityState={{ selected }}
- Filter chips: accessibilityLabel="{Filter name}, tap to remove"
- Perk cards: accessibilityLabel describing title, value, qualification
- Empty state reset: accessibilityRole="button"
- All text meets 4.5:1 contrast ratio (ink on bg, accent on bg/accentSoft)
