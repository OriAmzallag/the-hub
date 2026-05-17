# Mark Deal as Done - Design Specification

## Reference

Visual reference: `/references/mark-done.reference.jsx`

All measurements, colors, and copy are locked. This spec documents the exact values for implementation.

## Design Tokens

All colors from `constants/theme.ts`:

| Token | Value | Usage |
|-------|-------|-------|
| `colors.bg` | #1A1815 | Modal bg, button text on accent |
| `colors.surface` | #2A2620 | Textarea container |
| `colors.surfaceAlt` | #221F1A | - |
| `colors.border` | rgba(244,240,232,0.08) | Textarea border |
| `colors.borderStrong` | rgba(244,240,232,0.15) | Drag handle, cancel button border |
| `colors.ink` | #F4F0E8 | Primary text |
| `colors.inkMuted` | #8A7E6C | Secondary text, labels |
| `colors.inkSubtle` | #5C5448 | Placeholder, counter |
| `colors.accent` | #FF7A29 | Primary action, icons, highlights |
| `colors.accentSoft` | rgba(255,122,41,0.12) | Tile/strip/hero bg |
| `colors.accentBorder` | rgba(255,122,41,0.40) | Tile/strip/toast border |
| `colors.accentShadow` | rgba(255,122,41,0.30) | Button shadow |

## Component Specifications

### 1. Thread Tile (MarkDoneTile)

Position: Above InputBar, within thread scroll area padding.

```
Container:
  - width: 100%
  - padding: 12px 14px
  - background: accentSoft
  - border: 1px solid accentBorder
  - borderRadius: 12px
  - flexDirection: row
  - alignItems: center
  - gap: 12px

Icon Container:
  - width: 32px
  - height: 32px
  - borderRadius: 9px
  - background: accent
  - alignItems: center
  - justifyContent: center

Check Icon:
  - size: 17px
  - strokeWidth: 3
  - color: bg

Text Container:
  - flex: 1

Title:
  - fontFamily: InterTight-Bold
  - fontSize: 14px
  - fontWeight: 700
  - letterSpacing: -0.025em (-0.35px)
  - color: ink

Caption:
  - fontFamily: JetBrainsMono-Medium
  - fontSize: 9px
  - letterSpacing: 0.16em (1.44px)
  - textTransform: uppercase
  - color: inkMuted
  - marginTop: 2px

Chevron:
  - ArrowRight icon
  - size: 14px
  - strokeWidth: 2.4
  - color: accent
```

### 2. Dashboard Card Strip

Position: Bottom of IN_PROGRESS deal card, inside card border.

```
Container:
  - width: 100%
  - padding: 12px 16px
  - background: accentSoft
  - borderTop: 1px solid accentBorder
  - flexDirection: row
  - alignItems: center
  - justifyContent: space-between

Left Content:
  - flexDirection: row
  - alignItems: center
  - gap: 8px

Check Icon:
  - size: 14px
  - strokeWidth: 2.8
  - color: accent

Label:
  - fontFamily: InterTight-Bold
  - fontSize: 13px
  - fontWeight: 700
  - letterSpacing: -0.02em (-0.26px)
  - color: accent

Chevron:
  - ArrowRight icon
  - size: 13px
  - strokeWidth: 2.6
  - color: accent
```

### 3. Modal Sheet (MarkDoneSheet)

Position: Bottom-anchored, full-width.

```
Backdrop:
  - position: absolute, inset: 0
  - background: rgba(0,0,0,0.6)
  - backdropFilter: blur(4px)

Sheet Container:
  - position: absolute, bottom: 0, left: 0, right: 0
  - background: bg
  - borderTopLeftRadius: 22px
  - borderTopRightRadius: 22px
  - borderTop: 1px solid borderStrong
  - paddingTop: 8px
  - paddingBottom: 20px

Drag Handle:
  - width: 36px
  - height: 4px
  - borderRadius: 2px
  - background: borderStrong
  - margin: 0 auto 18px

Hero Section:
  - padding: 8px 22px 18px
  - textAlign: center

Hero Icon Container:
  - width: 56px
  - height: 56px
  - borderRadius: 16px
  - background: accentSoft
  - border: 1px solid accentBorder
  - margin: 0 auto 16px

Check Icon (Hero):
  - size: 26px
  - strokeWidth: 2.6
  - color: accent

Title:
  - fontFamily: InterTight-ExtraBold
  - fontSize: 24px
  - fontWeight: 800
  - letterSpacing: -0.04em (-0.96px)
  - lineHeight: 1.1
  - color: ink
  - marginBottom: 10px

Body:
  - fontFamily: InterTight-Regular
  - fontSize: 14px
  - fontWeight: 400
  - lineHeight: 1.5
  - color: ink
  - opacity: 0.75
  - maxWidth: 32ch
  - margin: 0 auto

Message Section:
  - padding: 0 22px 18px

Message Label:
  - fontFamily: JetBrainsMono-Medium
  - fontSize: 9.5px
  - fontWeight: 500
  - letterSpacing: 0.18em (1.71px)
  - textTransform: uppercase
  - color: inkMuted
  - marginBottom: 8px

Textarea Container:
  - padding: 12px 14px
  - background: surface
  - border: 1px solid border
  - borderRadius: 12px

Textarea:
  - fontFamily: InterTight-Regular
  - fontSize: 13.5px
  - fontWeight: 400
  - lineHeight: 1.5
  - color: ink
  - numberOfLines: 3
  - maxLength: 200

Character Counter:
  - fontFamily: JetBrainsMono-Medium
  - fontSize: 9px
  - fontWeight: 500
  - letterSpacing: 0.1em (0.9px)
  - color: inkSubtle (default) | accent (when > 180)
  - marginTop: 4px
  - textAlign: right

Actions Container:
  - padding: 0 16px
  - flexDirection: row
  - gap: 8px

Cancel Button:
  - flex: 1
  - padding: 15px 22px
  - background: transparent
  - border: 1px solid borderStrong
  - borderRadius: 100px (pill)

Cancel Button Text:
  - fontFamily: InterTight-Bold
  - fontSize: 14px
  - fontWeight: 700
  - letterSpacing: -0.015em (-0.21px)
  - color: ink

Confirm Button:
  - flex: 1.5
  - padding: 15px 22px
  - background: accent
  - borderRadius: 100px (pill)
  - flexDirection: row
  - alignItems: center
  - justifyContent: center
  - gap: 6px
  - shadowColor: accentShadow
  - shadowOffset: { width: 0, height: 8 }
  - shadowRadius: 24

Confirm Button Text:
  - fontFamily: InterTight-Bold
  - fontSize: 14px
  - fontWeight: 700
  - letterSpacing: -0.015em (-0.21px)
  - color: bg

Confirm Check Icon:
  - size: 15px
  - strokeWidth: 3
  - color: bg
```

### 4. Toast (MarkDoneToast)

Position: Top of screen, below safe area.

```
Container:
  - position: absolute
  - top: 16px (+ safeAreaTop)
  - left: 14px
  - right: 14px
  - background: rgba(26, 24, 21, 0.96)
  - backdropFilter: blur(16px)
  - border: 1px solid accentBorder
  - borderRadius: 14px
  - padding: 12px 14px
  - flexDirection: row
  - alignItems: center
  - gap: 11px
  - shadowColor: #000
  - shadowOffset: { width: 0, height: 12 }
  - shadowOpacity: 0.4
  - shadowRadius: 32

Check Container:
  - width: 32px
  - height: 32px
  - borderRadius: 9px
  - background: accent

Check Icon:
  - size: 17px
  - strokeWidth: 3
  - color: bg

Text Container:
  - flex: 1

Title:
  - fontFamily: InterTight-Bold
  - fontSize: 13.5px
  - fontWeight: 700
  - letterSpacing: -0.02em (-0.27px)
  - lineHeight: 1.2
  - color: ink
  - marginBottom: 1px

Caption:
  - fontFamily: JetBrainsMono-Medium
  - fontSize: 9px
  - fontWeight: 500
  - letterSpacing: 0.16em (1.44px)
  - textTransform: uppercase
  - color: inkMuted

Dismiss Button:
  - width: 28px
  - height: 28px
  - borderRadius: 14px
  - background: transparent

Dismiss Icon:
  - X icon
  - size: 14px
  - strokeWidth: 2.4
  - color: inkMuted
```

### 5. Disabled Input State

When deal is COMPLETED:

```
Input Container:
  - opacity: 0.4 on input field
  - Send button: surfaceAlt bg, inkMuted icon

Caption Below:
  - fontFamily: JetBrainsMono-Medium
  - fontSize: 9px
  - fontWeight: 500
  - letterSpacing: 0.18em (1.62px)
  - textTransform: uppercase
  - color: inkSubtle
  - textAlign: center
  - marginTop: 8px
```

### 6. System Message (Accent Variant)

Uses existing SystemMessage component with accent styling:

```
Pill:
  - padding: 4px 10px
  - background: accentSoft
  - border: 1px solid accentBorder
  - borderRadius: 100px

Text:
  - fontFamily: JetBrainsMono-SemiBold
  - fontSize: 9px
  - fontWeight: 600
  - letterSpacing: 0.16em (1.44px)
  - textTransform: uppercase
  - color: accent
```

## Animations

### Sheet Entry
- Backdrop: fade in 220ms ease-out
- Sheet: slide up from bottom, 320ms, cubic-bezier(0.32, 0.72, 0, 1)

### Sheet Exit
- Backdrop: fade out 200ms
- Sheet: slide down, 300ms

### Toast Entry
- Slide down from -20px, fade in
- Duration: 350ms
- Easing: cubic-bezier(0.32, 0.72, 0, 1)

### Toast Check Pop
- Scale: 0 -> 1.2 -> 1.0
- Duration: 500ms
- Easing: cubic-bezier(0.32, 0.72, 0, 1)

### Toast Exit
- Fade out, slide up
- Duration: 300ms

## Interaction States

### Thread Tile
- Default: as specified
- Pressed: scale(0.99)

### Dashboard Strip
- Default: as specified
- Pressed: background rgba(255,122,41,0.18)

### Modal Buttons
- Cancel pressed: slight opacity reduction
- Confirm pressed: slight scale reduction

### Toast Dismiss
- Pressed: inkMuted -> ink color on X icon

## Accessibility

- All interactive elements have `accessibilityRole="button"`
- Tile: "Mark deal as done, when the work is delivered"
- Modal title: accessibilityRole="header"
- Textarea: accessibilityLabel="Optional final message"
- Toast dismiss: accessibilityLabel="Dismiss"
