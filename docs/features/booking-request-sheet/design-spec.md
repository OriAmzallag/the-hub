# Booking Request Sheet - Design Specification
Generated: 2026-05-10
Status: APPROVED

## Design Tokens Reference
All values from `constants/theme.ts` unless otherwise noted.

### Colors Used
| Token | Value | Usage |
|-------|-------|-------|
| bg | #1A1815 | Sheet background, button text on accent |
| surface | #2A2620 | Cards, chips inactive, disabled button bg |
| border | rgba(244,240,232,0.08) | Subtle borders |
| borderStrong | rgba(244,240,232,0.15) | Stronger borders, drag handle, empty state dashed |
| ink | #F4F0E8 | Primary text |
| inkMuted | #8A7E6C | Secondary text, disabled button text |
| inkSubtle | #5C5448 | Footer note text |
| accent | #FF7A29 | Active states, badges, CTAs |
| accentSoft | rgba(255,122,41,0.12) | Active chip bg |
| accentBorder | rgba(255,122,41,0.40) | Active chip border |
| accentShadow | rgba(255,122,41,0.30) | Button glow, success icon shadow |

---

## Sheet Shell

### Scrim (Overlay)
- **Background**: rgba(0, 0, 0, 0.55)
- **Blur**: BlurView intensity 4, tint "dark"
- **zIndex**: 60

### Sheet Container
- **Position**: absolute, bottom: 0, left: 0, right: 0
- **Background**: bg (#1A1815)
- **Border radius**: 22px top-left, 22px top-right
- **Border**: 1px borderStrong top only
- **Max height**: 92%
- **zIndex**: 70
- **Shadow**: 
  - color: #000
  - offset: { width: 0, height: -20 }
  - opacity: 0.5
  - radius: 60

### Drag Handle
- **Container padding**: top 10, bottom 6
- **Handle size**: 36 x 4
- **Handle radius**: 2
- **Handle color**: borderStrong

---

## Form State Layout

### Header
- **Padding**: top 8, horizontal 22, bottom 18
- **Border**: 1px border bottom

**Super title (mono):**
- Font: JetBrainsMono-Medium
- Size: 10
- Letter spacing: 2 (0.2em)
- Text transform: uppercase
- Color: accent
- Content: "BOOKING - {NAME}"
- Margin bottom: 6

**Title (display):**
- Font: InterTight-ExtraBold
- Size: 26
- Letter spacing: -1.04 (-0.04em)
- Color: ink
- Content: "Request"

**Close button:**
- Size: 38 x 38
- Radius: 19 (circle)
- Background: surface
- Border: 1px border
- Icon: X, size 18, strokeWidth 2.2, color ink

### Body (ScrollView)
- **Padding**: top 20, horizontal 22, bottom 8
- **Content bottom padding**: 100 (for sticky button clearance)

---

## Section Header (Local Component)

- **Title**: InterTight-Bold, 17, -0.51, ink
- **Hint** (optional): JetBrainsMono-Medium, 9.5, 1.14 (0.12em), uppercase, inkMuted
- **Gap**: 6
- **Margin bottom**: 12

---

## Services Section

### Section Title
- Title: "Services"
- Hint: "{count} selected"

### Services Card
- **Background**: surface
- **Border**: 1px border
- **Radius**: 14
- **Padding**: 14 horizontal, 16 vertical
- **Gap between rows**: 8

### Service Line Item
**Badge (order number):**
- Size: 24 x 24
- Radius: 12 (circle)
- Background: accent
- Font: JetBrainsMono-Bold, 10, ink (dark on accent)
- Content: "01", "02", etc.

**Name column:**
- Name: InterTight-Bold, 15, -0.375, lineHeight 16.5, ink
- Platform/delivery: JetBrainsMono-Medium, 9.5, 1.14 (0.12em), uppercase, inkMuted
- Format: "{PLATFORM} - {DELIVERY}"
- Gap: 3

**Price:**
- Font: InterTight-Bold, 18, -0.54, ink
- Format: "{price}" (currency symbol)

**Remove button:**
- Size: 28 x 28
- Radius: 14 (circle)
- Background: transparent
- Icon: X, size 14, strokeWidth 2, inkMuted
- Hit slop: 8 all sides

### Empty State
- **Container**: dashed border (borderStrong), 1px
- **Padding**: 32 horizontal, 24 vertical
- **Radius**: 14
- **Text**: JetBrainsMono-Medium, 10, 1.5 (0.15em), uppercase, inkMuted, center
- **Content**: "ALL SERVICES REMOVED - GO BACK TO ADD SOME"

---

## When Section

### Section Title
- Title: "When"
- Hint: none (or chip label when selected)

### Chip Grid
- **Layout**: 2 columns, flexWrap
- **Gap**: 8
- **Chip width**: ~48.5% (flex: 1 with gap)

### Date Chip (Inactive)
- **Padding**: 14 horizontal, 14 vertical
- **Background**: surface
- **Border**: 1px border
- **Radius**: 14

**Label:**
- Font: InterTight-Bold, 14, -0.28, ink

**Days range:**
- Font: JetBrainsMono-Medium, 9.5, 1.14 (0.12em), uppercase, inkMuted
- Margin top: 4

### Date Chip (Active)
- **Background**: accentSoft
- **Border**: 1px accentBorder
- **Shadow** (ring effect):
  - color: accentSoft
  - offset: { width: 0, height: 0 }
  - opacity: 1
  - radius: 4

**Label:**
- Color: accent (instead of ink)

### "Pick a date" Chip
- Calendar icon: size 14, strokeWidth 2, color ink (or accent when active)
- Icon position: inline with label, gap 6
- Days slot: "CALENDAR" (instead of date range)

---

## Brief Section

### Section Title
- Title: "The brief"
- Hint: none

### Text Card
- **Background**: surface
- **Border**: 1px border (borderStrong when has content)
- **Radius**: 14
- **Padding**: 14 top, 16 horizontal, 8 bottom

### TextInput
- **Font**: InterTight-Regular, 14, -0.14, lineHeight 21 (1.5)
- **Color**: ink
- **Placeholder**: "Describe your project, goals, and any specific requirements..."
- **Placeholder color**: inkMuted
- **Multiline**: true
- **Number of lines**: 5 (initial)
- **Text align vertical**: top

### Character Counter
- **Position**: bottom-right of card
- **Font**: JetBrainsMono-Medium, 9.5, 0.95 (0.1em)
- **Color**: inkMuted (normal), accent (at 300)
- **Visibility**: hidden until first character typed
- **Format**: "{count} / 300"

---

## Total Section

### Section Title
- Title: "Total"
- Hint: none

### Total Card
- **Background**: surface
- **Border**: 1px border
- **Radius**: 14
- **Padding**: 18

### Line Items
- **Gap**: 10
- **Layout**: row, space-between

**Service name:**
- Font: InterTight-Medium, 13.5, -0.27, inkMuted

**Service price:**
- Font: InterTight-Bold, 14, -0.28, ink

### Divider
- **Height**: 1
- **Color**: border
- **Margin**: 14 vertical

### Total Row
**Label:**
- Font: JetBrainsMono-Medium, 9.5, 1.425 (0.15em), uppercase, inkMuted
- Content: "TOTAL"

**Amount:**
- Font: InterTight-ExtraBold, 28, -0.84, ink

### Budget Checkbox Row
- **Margin top**: 16
- **Gap**: 12

**Checkbox (unchecked):**
- Size: 22 x 22
- Radius: 6
- Border: 1.5px borderStrong
- Background: transparent

**Checkbox (checked):**
- Background: accent
- Border: none
- Icon: Check, size 14, strokeWidth 3, bg

**Label:**
- Font: InterTight-SemiBold, 13.5, -0.27, ink
- Content: "I confirm the total budget of {total}"

---

## Footer Note
- **Font**: JetBrainsMono-Medium, 9.5, 1.14 (0.12em), uppercase
- **Color**: inkSubtle
- **Alignment**: center
- **Margin**: top 20, bottom 16
- **Content**: "{FIRST_NAME} RESPONDS WITHIN 72H"

---

## Sticky Submit Button

### Container
- **Position**: absolute, bottom 0, left 0, right 0
- **Padding**: 16 horizontal, 22 bottom (+ safe area)
- **Background**: gradient from bg (100% opacity) to bg (0% opacity) over 20px at top, or solid bg

### Button (Active)
- **Padding**: 18 vertical, 22 horizontal
- **Background**: accent
- **Radius**: 100 (pill)
- **Shadow**:
  - color: accentShadow
  - offset: { width: 0, height: 8 }
  - opacity: 1
  - radius: 24

**Text:**
- Font: InterTight-Bold, 14.5, -0.29
- Color: bg
- Content: "Send request"

**Arrow:**
- Icon: ArrowRight, size 14, strokeWidth 2, bg
- Gap: 8

### Button (Disabled)
- **Background**: surface
- **Border**: 1px border
- **Shadow**: none

**Text:**
- Color: inkMuted

**Arrow:**
- Color: inkMuted

---

## Success State Layout

### Container
- **Padding**: 32 top, 22 horizontal
- **Alignment**: center

### Hero Check Icon
- **Size**: 72 x 72
- **Radius**: 36 (circle)
- **Background**: accent
- **Shadow**:
  - color: accentShadow
  - offset: { width: 0, height: 12 }
  - opacity: 1
  - radius: 36
- **Icon**: Check, size 32, strokeWidth 3, bg

### Copy Stack
**Mono label:**
- Font: JetBrainsMono-Medium, 10, 2.5 (0.25em), uppercase
- Color: accent
- Content: "REQUEST SENT"
- Margin top: 24

**Display heading:**
- Font: InterTight-ExtraBold, 38, -1.52, lineHeight 42
- Color: ink
- Content: "On its way\nto {firstName}."
- Alignment: center
- Margin top: 12

**Sub copy:**
- Font: InterTight-Regular, 14.5, -0.15, lineHeight 21
- Color: ink @ 80% opacity
- Content: "She typically responds within 72 hours. We'll notify you when she replies."
- Alignment: center
- Max width: 30ch (280px approx)
- Margin top: 12

### Summary Card
- **Background**: surface
- **Border**: 1px border
- **Radius**: 14
- **Padding**: 18
- **Margin top**: 28
- **Width**: 100%

**Services count:**
- Label: JetBrainsMono-Medium, 9.5, 1.14, uppercase, inkMuted ("SERVICES")
- Value: InterTight-Bold, 16, -0.32, ink

**Divider:**
- Height: 1, color: border, margin 12 vertical

**Total:**
- Label: JetBrainsMono-Medium, 9.5, 1.14, uppercase, inkMuted ("TOTAL")
- Value: InterTight-ExtraBold, 22, -0.77, ink

### CTAs
**Primary ("View request status"):**
- Same as sticky submit button (active state)
- Full width
- Margin top: 28

**Secondary ("Back to discovery"):**
- Padding: 14 vertical
- Background: transparent

**Text:**
- Font: JetBrainsMono-Medium, 10.5, 1.575 (0.15em), uppercase
- Color: inkMuted
- Margin top: 8

---

## Animations

### Sheet Rise
- **Duration**: 420ms
- **Easing**: cubic-bezier(0.32, 0.72, 0, 1)
- **Property**: translateY from 100% to 0%

### Sheet Fall
- **Duration**: 320ms
- **Easing**: cubic-bezier(0.32, 0.72, 0, 1)
- **Property**: translateY from current to 100%

### Overlay Fade In
- **Duration**: 300ms
- **Easing**: Easing.out(Easing.ease)
- **Property**: opacity from 0 to 1

### Overlay Fade Out
- **Duration**: 200ms
- **Easing**: linear
- **Property**: opacity from 1 to 0

### Drag Dismiss Threshold
- **Distance**: 25% of screen height
- **OR Velocity**: > 800 px/s

### Success Pop (Hero Icon)
- **Duration**: 500ms
- **Easing**: cubic-bezier(0.34, 1.56, 0.64, 1) - overshoot spring
- **Scale**: 0.6 -> 1.05 -> 1
- **Opacity**: 0 -> 1

### Fade Up (Success Content)
- **Duration**: 400ms
- **Easing**: Easing.out(Easing.ease)
- **Property**: opacity 0 -> 1, translateY 8 -> 0
- **Stagger**: 50ms between elements

---

## Responsive Considerations

- Sheet maxHeight 92% ensures content doesn't overflow on small devices
- Safe area insets applied to sticky button bottom padding
- ScrollView allows content to scroll if it exceeds available height
- Brief TextInput expands with content (textAlignVertical: 'top')

---

## Token Verification

All tokens used are available in `constants/theme.ts`:
- Colors: bg, surface, border, borderStrong, ink, inkMuted, inkSubtle, accent, accentSoft, accentBorder, accentShadow
- Typography styles: Can be composed from InterTight and JetBrainsMono families
- Shadows: accentGlow pattern reusable for submit button

**New tokens needed**: None. All surfaces can be built with existing tokens.
