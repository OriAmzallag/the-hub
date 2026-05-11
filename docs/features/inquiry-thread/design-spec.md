# Inquiry Thread Screen - Design Specification

**Feature**: Inquiry Thread (Conversation/Chat Screen)  
**Status**: In Progress  
**Date**: 2026-05-11  
**Designer**: AI Agent

---

## Design System Alignment

All specifications use tokens from `constants/theme.ts`. No new tokens introduced.

**Discipline rules followed**:
- One accent (`#FF7A29`) used surgically for CTAs, active states, status
- No red anywhere - decline tone not needed for this screen
- Mono (JetBrains) = system voice for timestamps, status captions
- Avatars are 12px rounded squares, never circles
- Numbers paired with labels (e.g., "2 services . 530")

---

## Screen Layout

```
+------------------------------------------+
|  [<] [Avatar] Name + Verified            | TopBar (safe area + 56px)
+------------------------------------------+
|  [ ACTIVE . 2 services . 530     [v] ]   | DealContextCard (collapsible)
|  ----------------------------------------|
|  | Service 1                       350 | |
|  | Service 2                       180 | |
|  | [Cal] MAY 16 - MAY 23               | |
+------------------------------------------+
|                                          |
|  [ Deal accepted . May 9 . 14:32 ]       | SystemMessage
|                                          |
|           [ them bubble - left aligned ] | MessageBubble (them)
|                                          |
|  [ me bubble - right aligned ]           | MessageBubble (me)
|                            14:48 [vv]    |
|                                          |
|           [Image attachment]             | ImageAttachment
|                                          |
|  [ HandoffOfferCard or HandoffAccepted ] | Handoff cards
|                                          |
+------------------------------------------+
| [ Chip ] [ Chip ] [ WhatsApp Chip ]      | TemplateChips
+------------------------------------------+
| [clip] [ Type a message...    ] [send]   | InputBar
+------------------------------------------+
```

---

## Component Specifications

### TopBar

**Container**:
- Height: 56px (plus safe area top)
- Background: `bg` (`#1A1815`)
- Bottom border: 1px `border` (`rgba(244,240,232,0.08)`)
- Padding: horizontal 16px

**Back Button**:
- Size: 38x38
- Background: `surface` (`#2A2620`)
- Border: 1px `border`
- Border radius: 19 (circle for back button only - exception to avatar rule)
- Icon: ChevronLeft, 20px, `ink`

**Counterpart Avatar Tile**:
- Size: 36x36
- Border radius: `radii.avatar` (12px - rounded square per discipline)
- Background: `surfaceAlt` for monogram, or photo
- Border: 1px `borderStrong`
- Monogram text: `InterTight-ExtraBold`, 13px, -0.04em tracking, `ink`

**Counterpart Name**:
- Typography: `typography.rowTitle` (15px, 700, -0.025em)
- Color: `ink`
- Verified badge: CheckCircle2, 13px, filled, `accent`
- Gap between name and badge: 4px

---

### DealContextCard

**Container**:
- Background: `surface`
- Border: 1px `border`
- Border radius: `radii.card` (14px)
- Margin: horizontal 14px, top 12px

**Header Row** (always visible):
- Padding: 14px 16px
- Flex row, space-between

**Status Pill**:
- Typography: `typography.monoStatus` (9.5px, 500, 0.15em tracking, uppercase)
- Color: `accent`
- Text: "ACTIVE" (derived from `getDealCaption()`)

**Dot Separator**:
- Size: 3x3
- Background: `inkSubtle`
- Border radius: 1.5 (circle)
- Margin: horizontal 6px

**Summary Text**:
- Typography: custom (13.5px, 700, -0.02em tracking)
- Color: `ink`
- Format: "{count} services . {total}" with currency symbol

**Chevron**:
- Icon: ChevronUp (expanded) / ChevronDown (collapsed)
- Size: 16px
- Color: `inkMuted`

**Expanded Body** (when expanded):
- Padding: 0 16px 14px 16px
- Border top: 1px `border` (separates from header)

**Service Row**:
- Flex row, space-between
- Name: 13px, 500, `inkMuted`
- Price: custom (13.5px, 700, -0.02em), `ink`, with currency prefix

**Date Row**:
- Margin top: 10px
- Flex row, align center, gap 6px
- Calendar icon: 11px, `inkMuted`
- Date text: `typography.monoStatus`, `inkMuted`, uppercase
- Format: "MAY 16 - MAY 23"

---

### SystemMessage

**Container**:
- Align self: center
- Background: `surfaceAlt`
- Border: 1px `border`
- Border radius: 100 (pill)
- Padding: 6px 12px
- Margin: vertical 12px

**Content**:
- Flex row, align center, gap 6px
- Icon (Check): 11px, `accent`
- Text: `typography.monoStatus` (9.5px, 0.18em tracking, uppercase), `inkMuted`
- Format: "DEAL ACCEPTED . MAY 9 . 14:32"

---

### MessageBubble

**Common**:
- Max width: 78%
- Padding: 12px 14px
- Margin: horizontal 14px, bottom 6px
- Text: 14.5px, line-height 1.4, word-break: break-word

**"me" Side (current user)**:
- Align self: flex-end (right)
- Background: `ink` (`#F4F0E8`)
- Text color: `bg` (`#1A1815`)
- Font weight: 500
- Border radius: 18px 18px 4px 18px (sharp bottom-right)

**"them" Side (counterpart)**:
- Align self: flex-start (left)
- Background: `surface`
- Border: 1px `border`
- Text color: `ink`
- Font weight: 400
- Border radius: 18px 18px 18px 4px (sharp bottom-left)

**Timestamp Row** (below bubble):
- Margin top: 4px
- Flex row, justify-content based on side
- Timestamp: `typography.monoTimestamp` (9px, 0.1em), `inkSubtle`

**Read Receipt** (me bubbles only):
- Icon: CheckCheck, 11px
- Color: `accent` if read, `inkSubtle` if sent only
- Gap from timestamp: 4px

---

### ImageAttachment

**Container**:
- Same bubble shape/colors as MessageBubble
- Min width: 200px
- Flex row, gap 10px
- Padding: 10px 12px

**Icon Tile**:
- Size: 36x36
- Background: `surfaceAlt` (me) or `surface` (them)
- Border radius: 8px
- Icon: ImageIcon, 16px, `inkMuted`

**Content**:
- Filename: custom (13px, 600, -0.02em), bubble text color
- Caption: `typography.monoTimestamp`, uppercase, "IMAGE", `inkMuted`

---

### HandoffOfferCard

**Container**:
- Background: `accentSoft`
- Border: 1px `accentBorder`
- Border radius: `radii.card` (14px)
- Padding: 16px
- Margin: horizontal 14px, vertical 8px

**Header Row**:
- Flex row, gap 8px, align center
- Icon: MessageCircle, 14px, `accent`
- Text: `typography.monoStatusWide` (9.5px, 600, 0.18em), `accent`, "YOU SUGGESTED WHATSAPP"

**Body Text**:
- Margin top: 10px
- Typography: 13.5px, line-height 1.5, `ink`
- Text: "Waiting for {counterpart.name} to confirm sharing numbers. Once they accept, you'll both get a WhatsApp link to continue off-platform."

**Pending Row**:
- Margin top: 12px
- Flex row, gap 6px, align center

**Pulsing Dot**:
- Size: 6x6
- Background: `accent`
- Border radius: 3 (circle)
- Animation: pulse opacity 0.4 - 1.0, duration 1.2s, infinite

**Pending Text**:
- Typography: `typography.monoTimestamp` (9px, 0.18em), `accent`, "PENDING"

---

### HandoffAcceptedCard

**Container**:
- Background: `surface`
- Border: 1px `borderStrong`
- Border radius: `radii.card` (14px)
- Padding: 18px 16px
- Margin: horizontal 14px, vertical 8px

**Header Row**:
- Flex row, gap 12px, align flex-start

**Icon Tile**:
- Size: 32x32
- Background: `accent`
- Border radius: 8px
- Icon: MessageCircle, 16px, `bg`

**Title Block**:
- Title: custom (14px, 700, -0.025em), `ink`, "Numbers shared"
- Subtitle: `typography.monoTimestamp` (9px, 0.18em), `inkMuted`, "CONTINUE ON WHATSAPP"

**Body Text**:
- Margin top: 12px
- Typography: 12.5px, line-height 1.5, `inkMuted`
- Text: "Important commitments still belong here - confirmations, deliverables, ratings."

**CTA Button**:
- Margin top: 14px
- Recipe: `recipes.primaryButton`
- Additional: padding 13px 20px
- Text: `InterTight-Bold`, 14px, `bg`
- Label: "Open WhatsApp with {counterpart.firstName}"
- Links to: `wa.me/{counterpart.phone}` (without + prefix)

---

### TemplateChips

**Container**:
- Border top: 1px `border`
- Padding: 10px 14px
- Background: `bg`

**ScrollView**:
- Horizontal, shows no indicator
- Content gap: 8px

**Regular Chip**:
- Background: `surface`
- Border: 1px `border`
- Border radius: 100 (pill)
- Padding: 9px 14px
- Text: `InterTight-Medium`, 13px, `ink`

**WhatsApp Chip** (handoff trigger):
- Background: `accentSoft`
- Border: 1px `accentBorder`
- Border radius: 100
- Padding: 9px 14px
- Flex row, gap 6px
- Icon: MessageCircle, 13px, `accent`
- Text: `InterTight-Medium`, 13px, `accent`

---

### InputBar

**Container**:
- Background: `bg`
- Border top: 1px `border`
- Padding: 10px 14px
- Padding bottom: safe area + 10px
- Flex row, gap 10px, align center

**Attach Button**:
- Size: 42x42
- Background: `surface`
- Border: 1px `border`
- Border radius: 21 (circle)
- Icon: Paperclip, 20px, `inkMuted`

**Input Container**:
- Flex: 1
- Background: `surface`
- Border: 1px `border` (empty) / `borderStrong` (has content)
- Border radius: 22px
- Padding: 11px 16px
- Min height: 44px

**Input Text**:
- Typography: `InterTight-Regular`, 15px
- Color: `ink`
- Placeholder: "Type a message...", `inkSubtle`

**Send Button**:
- Size: 42x42
- Border radius: 21 (circle)

**Send Disabled**:
- Background: `surface`
- Border: 1px `border`
- Icon: Send, 20px, `inkMuted`

**Send Active**:
- Background: `accent`
- Shadow: `shadows.accentGlow`
- Icon: Send, 20px, `bg`

---

## Template Chip Sets

### Influencer Templates
| Label | Style |
|-------|-------|
| Confirmed | Regular chip |
| Drafts ready | Regular chip |
| All delivered | Regular chip |
| Let's hop on WhatsApp | WhatsApp chip (accentSoft) |

### Business Templates
| Label | Style |
|-------|-------|
| Got it | Regular chip |
| When can you start? | Regular chip |
| Send the draft | Regular chip |
| Let's hop on WhatsApp | WhatsApp chip (accentSoft) |

---

## Motion Specifications

### DealContextCard Expand/Collapse
- Duration: `motion.duration.base` (180ms)
- Easing: `motion.easing.smooth`
- Height animates from 0 to content height

### Pulsing Dot (Pending Handoff)
- Opacity: 0.4 to 1.0
- Duration: 1200ms
- Easing: ease-in-out
- Iteration: infinite

### New Message Appear
- FadeInUp
- Duration: `motion.duration.fast` (150ms)
- Translate Y: 8px to 0

### Send Button State Change
- Duration: `motion.duration.fast` (150ms)
- Scale: 0.95 to 1.0 on press

---

## Responsive Behavior

- Max bubble width 78% ensures readability on all screen sizes
- InputBar padding bottom uses safe area insets
- TopBar padding top uses safe area insets
- Template chips scroll horizontally if they overflow

---

## Accessibility

- TopBar back button: `accessibilityLabel="Go back"`
- Message bubbles: `accessibilityLabel="{sender}: {message}"`
- Read receipts: `accessibilityLabel="Read"` or `"Sent"`
- Template chips: `accessibilityRole="button"`
- Send button: `accessibilityLabel="Send message"`, disabled state announced
- DealContextCard: `accessibilityRole="button"` on header, `accessibilityState={{ expanded }}`

---

## Design Token Usage Summary

| Token | Usage |
|-------|-------|
| `colors.bg` | Screen background, me bubble text |
| `colors.surface` | Them bubbles, cards, buttons |
| `colors.surfaceAlt` | System message pill, icon tiles |
| `colors.border` | Dividers, inactive borders |
| `colors.borderStrong` | Active input border, avatar border |
| `colors.ink` | Me bubble bg, primary text |
| `colors.inkMuted` | Secondary text, icons |
| `colors.inkSubtle` | Timestamps, placeholders |
| `colors.accent` | CTAs, status, read receipts, active states |
| `colors.accentSoft` | WhatsApp chip bg, handoff offer bg |
| `colors.accentBorder` | WhatsApp chip border, handoff offer border |
| `radii.card` (14) | Card border radius |
| `radii.avatar` (12) | Avatar border radius |
| `radii.pill` (9999) | Buttons, chips, system message |
| `typography.rowTitle` | Counterpart name |
| `typography.monoStatus` | Status captions |
| `typography.monoTimestamp` | Timestamps |
| `recipes.primaryButton` | WhatsApp CTA |
| `shadows.accentGlow` | Active send button |
