# Notifications Feature - Design Spec

**Author:** Designer Agent  
**Date:** 2025-05-18  
**Status:** APPROVED

---

## Design Principles

1. **Consistency** - Bell button matches existing header button chrome (filter button on Discover)
2. **Hierarchy** - Unread notifications use accent treatment, read use neutral surface
3. **Reuse** - Row layout inspired by `InfluencerAttentionItem` and `ThreadRow`
4. **Accessibility** - All interactive elements have proper labels and hit targets

---

## Component Specifications

### 1. NotificationBell (Header Button)

The bell button appears in all 8 tab-level headers. On Discover, it sits between the search bar and filter button. On other tabs, it's the only right-side element.

**Dimensions:**
- Width: 38px
- Height: 38px
- Border radius: 19px (full circle)

**States:**

| State | Background | Border | Icon Color |
|-------|------------|--------|------------|
| Default (no unread) | `colors.surface` | `colors.border` | `colors.ink` |
| Has unread | `colors.accentSoft` | `colors.accentBorder` | `colors.accent` |
| Pressed | opacity 0.8 | - | - |

**Badge:**
- Position: top-right, overlapping button by 3px
- Min width: 16px
- Height: 16px
- Border radius: 8px (pill)
- Background: `colors.accent`
- Border: 2px `colors.bg`
- Text: `typography.monoBadge` (JetBrainsMono-Bold 8px)
- Text color: `colors.bg`
- Content: Number capped at "9+"

**Icon:**
- Lucide `Bell`
- Size: 17px
- Stroke width: 2.2

```
  +---------+
  |   [B]   |  <- Badge (16x16, overlaps corner)
  |  [Bell] |  <- Icon (17px)
  +---------+
     38x38
```

---

### 2. NotificationRow

Each notification in the feed follows a consistent row layout.

**Container:**
- Padding: 14px vertical, 16px horizontal
- Border radius: `borderRadius.xl` (14px)
- Gap between elements: 14px
- Margin: 0 horizontal (full-width within list), 6px bottom between rows

**Unread State:**
- Background: `colors.accentSoft`
- Border: 1px `colors.accentBorder`

**Read State:**
- Background: `colors.surface`
- Border: 1px `colors.border`

**Layout:**
```
+------------------------------------------------------------------+
| [Avatar]  [Title - primary text]                      [Chevron]  |
| [44x44]   [Timestamp - muted secondary]                          |
| [+icon]                                                          |
+------------------------------------------------------------------+
```

**Avatar (Left):**
- Size: 44x44
- Border radius: `borderRadius.lg` (12px) for monogram, 12px for photo
- Monogram: `typography.rowTitle`, `colors.ink` on `colors.surfaceAlt` with `colors.borderStrong` border
- Photo: cover fit, 12px radius

**Type Icon Overlay:**
- Position: bottom-right of avatar, offset -2px
- Size: 20x20
- Border radius: 10px (circle)
- Background: `colors.accent`
- Border: 2px `colors.bg`
- Icon: 10px, stroke 2.5, `colors.bg`

| Type | Icon |
|------|------|
| deal_accepted | Check |
| deal_expired | Clock |
| deal_declined | X |
| marked_done | CheckCircle |
| rating_received | Star |
| mutual_reveal | Eye |
| perk_claimed | Gift |
| new_message | MessageCircle |

**Title (Center):**
- Style: `typography.bannerTitle` (14.5px, 700, -0.025em)
- Color: `colors.ink`
- Single line, ellipsize tail

**Timestamp (Center, below title):**
- Style: `typography.monoTimestamp` (9px, 500, 0.1em, uppercase)
- Color: `colors.inkMuted`
- Margin top: 3px

**Chevron (Right):**
- Lucide `ChevronRight`
- Size: 18px
- Stroke width: 2.2
- Color: `colors.accent` (unread), `colors.inkMuted` (read)

---

### 3. NotificationsScreen

Full-screen feed with standard header and scrollable list.

**Header:**
- Component: `ScreenHeader`
- Title: "Notifications"
- Right slot: "Mark all read" text button (only when unread > 0)
- Back button: No (tab-level screen, user uses native back or tab bar)

**Mark All Read Button:**
- Text: "MARK ALL READ"
- Style: `typography.monoStatusWide` (9.5px, 600, 0.18em)
- Color: `colors.accent`
- Hit area: 44px height minimum

**List:**
- Component: FlatList
- Padding: 14px horizontal
- Item separator: 6px vertical gap
- Content bottom padding: 100px (room for tab bar)

**Empty State:**
- Centered vertically and horizontally
- Icon: Lucide `Bell`, 48px, stroke 1.5, `colors.inkMuted`
- Text: "You're all caught up"
- Text style: `typography.bodyPreview` (12.5px, 400)
- Text color: `colors.inkMuted`
- Gap between icon and text: 16px

```
         [Bell icon 48px - muted]
              16px gap
        "You're all caught up"
```

---

### 4. Header Integration

**Discover (both personas):**

Layout: `[Search Bar (flex)] [8px] [Bell 38x38] [8px] [Filter 42x42]`

The bell sits between search and filter. Both buttons follow similar chrome but different sizes (bell is 38px to feel slightly lighter than the primary filter action).

**Dashboard / Inquiries / Profile (both personas):**

For screens using `TopBar` or `ScreenHeader`:
- Bell renders in the right-slot
- No other right-side controls on these screens
- Layout: `[Title (left-aligned)] ... [Bell 38x38]`

---

## Interaction Specifications

**Bell Button:**
- Tap: Navigate to `/notifications`
- Haptic: None (standard button)

**Notification Row:**
- Tap: Mark as read + navigate to destination
- Visual feedback: Pressable opacity 0.8 on press

**Mark All Read:**
- Tap: Clear all unread states
- Visual feedback: Standard pressable opacity
- Button disappears when all read

---

## Accessibility

**NotificationBell:**
- Role: `button`
- Label: "Notifications" (no unread) or "Notifications, {n} unread" (with unread)

**NotificationRow:**
- Role: `button`
- Label: "{title}, {timestamp}, {read/unread state}"

**Mark All Read:**
- Role: `button`
- Label: "Mark all notifications as read"

**Empty State:**
- No interaction required
- Text is readable by screen reader

---

## Motion

**Badge appearance:**
- No animation for v1 (simple render)
- v2: Scale pop from 0 to 1 with `motion.easing.pop`

**List item transitions:**
- Standard FlatList behavior
- No custom animations for v1

**Mark as read:**
- Instant background color change (no animation)
- v2: Subtle fade transition

---

## Dark Mode

All specifications above use the existing dark theme tokens. No light mode variant for v1.

---

## Responsive Behavior

**Tablet:**
- Same layout, content max-width not constrained
- List uses full available width

**Small screens (<375px):**
- Badge may overlap into safe area; acceptable
- Title truncates with ellipsis if needed

---

## Design Tokens Reference

All values from `constants/theme.ts`:

| Token | Value | Usage |
|-------|-------|-------|
| `colors.surface` | `#2A2620` | Read row bg, default button bg |
| `colors.accentSoft` | `rgba(255,122,41,0.12)` | Unread row bg, active button bg |
| `colors.accent` | `#ff7829` | Badge bg, icon active, chevron active |
| `colors.accentBorder` | `rgba(255,122,41,0.40)` | Unread row border |
| `colors.border` | `rgba(244,240,232,0.08)` | Read row border |
| `colors.ink` | `#F4F0E8` | Title text |
| `colors.inkMuted` | `#8A7E6C` | Timestamp, chevron read |
| `colors.bg` | `#1A1815` | Badge border, icon on badge |
| `borderRadius.xl` | 14 | Row radius |
| `borderRadius.lg` | 12 | Avatar radius |
| `typography.bannerTitle` | 14.5/700/-0.025em | Row title |
| `typography.monoTimestamp` | 9/500/0.1em | Timestamp |
| `typography.monoBadge` | 8/700/0 | Badge count |

---

## Figma Alignment

This spec aligns with design system references in `references/design-system/`. Key patterns:

1. **Button chrome** matches filter button from `DiscoverHeader`
2. **Row layout** matches `InfluencerAttentionItem` (avatar + icon overlay + title + chevron)
3. **Badge** matches unread badge from `ThreadRow`
4. **Empty state** follows established empty state pattern (centered icon + text)
