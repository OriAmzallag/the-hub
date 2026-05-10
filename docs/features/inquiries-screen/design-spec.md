# Inquiries Inbox Screen - Design Specification
Generated: 2026-05-10
Role: Designer

## Design System Compliance

This spec cites existing tokens from `constants/theme.ts`. All values reference tokens by name. No inline hex/size/radius values should appear in implementation.

## Token Usage Summary

### Colors Used
- `colors.bg` - Screen background
- `colors.surface` - Thread row background, icon tile background
- `colors.surfaceAlt` - Monogram avatar background
- `colors.border` - Thread row border, search bar default border
- `colors.borderStrong` - Search bar active border (has content)
- `colors.ink` - Primary text (titles, names, headlines)
- `colors.inkMuted` - Secondary text (timestamps, muted captions, preview text)
- `colors.inkSubtle` - Tertiary text (subtle captions, empty preview italic)
- `colors.accent` - Active states, action-required status, unread badges, CTA buttons

### Typography Used
- `typography.sectionTitle` - Top bar title "Inquiries" (22px, weight 700, -0.035em)
- `typography.tileTitle` - Section headers (17px, weight 700, -0.03em)
- `typography.bannerTitle` - Thread name (14.5px, weight 700, -0.025em, line 1.1)
- `typography.monoStatus` - Status captions, timestamps, unread caption (9.5px, weight 500, 0.15em)
- `typography.monoBadge` - Unread badge number (8px, weight 700)

### Radii Used
- `radii.card` (14) - Thread row container, icon tile
- `radii.avatar` (12) - Avatar corners (rounded square, NEVER circle)
- `radii.pill` (9999) - Search bar, CTA buttons, unread badge

### Recipes Used
- `recipes.surfaceTile` - Thread row base styling (surface bg + border + card radius)

---

## Component Specifications

### TopBar

**Container**
- paddingTop: 16
- paddingHorizontal: 18
- paddingBottom: 10

**Title "Inquiries"**
- Style: `typography.sectionTitle`
- Color: `colors.ink`

**Unread Caption "{N} unread"** (right side, only when N > 0)
- Style: `typography.monoStatus` with weight override to 600
- Color: `colors.accent`
- letterSpacing: 1.71 (0.18em at 9.5px) - NOTE: existing `monoStatus` uses 0.15em (1.425); spec calls for 0.18em

**Token Addition Needed:**
```typescript
// Add to typography in constants/theme.ts
monoStatusWide: {
  fontFamily: 'JetBrainsMono-SemiBold',
  fontSize: 9.5,
  fontWeight: '600' as const,
  letterSpacing: 1.71, // 0.18em
  lineHeight: 9.5,
  textTransform: 'uppercase' as const,
},
```
Justification: The reference specifies 0.18em tracking for accent status captions, while existing `monoStatus` uses 0.15em. The wider tracking improves legibility for attention-grabbing labels.

---

### SearchBar

**Container**
- paddingHorizontal: 14
- paddingBottom: 12

**Pill Input**
- backgroundColor: `colors.surface`
- borderRadius: `radii.pill`
- borderWidth: 1
- borderColor: `colors.border` (empty) / `colors.borderStrong` (has content)
- paddingVertical: 8
- paddingHorizontal: 12
- gap: 9 (between icon and text)

**Search Icon**
- Size: 14
- strokeWidth: 2
- Color: `colors.inkMuted`

**Input Text**
- fontFamily: 'InterTight-Regular'
- fontSize: 13
- Color: `colors.ink`
- placeholderTextColor: `colors.inkMuted`
- Placeholder: "Search by name..."

---

### SectionHeader (Local Variant)

**Container**
- paddingHorizontal: 18
- marginBottom: 10
- marginTop: 6

**Title**
- Style: `typography.tileTitle`
- Color: `colors.ink`

---

### ThreadRow

**Container**
- Style: `recipes.surfaceTile` (surface bg, border, 14px radius)
- Override borderRadius to 12 (reference spec)
- paddingVertical: 12
- paddingHorizontal: 13
- gap: 11 (between avatar and content)
- marginHorizontal: 14
- marginBottom: 6

**Avatar**
- Size: 44 x 44
- borderRadius: `radii.avatar` (12px rounded square)

*Photo Avatar (Business view):*
- expo-image with contentFit: "cover"
- borderWidth: 1
- borderColor: `colors.borderStrong`

*Monogram Avatar (Talent view):*
- backgroundColor: `colors.surfaceAlt`
- 2-character text centered
- fontFamily: 'InterTight-ExtraBold'
- fontSize: 16
- Color: `colors.ink`

**Content Column** (flex: 1)

*Top Row (name + timestamp)*
- flexDirection: 'row'
- justifyContent: 'space-between'
- alignItems: 'baseline'

Name:
- Style: `typography.bannerTitle`
- Color: `colors.ink`
- numberOfLines: 1 (ellipsis)

Timestamp:
- fontFamily: 'JetBrainsMono-Medium'
- fontSize: 9
- letterSpacing: 0.9 (0.1em)
- Color: `colors.inkMuted`
- textTransform: 'uppercase'

**Token Addition Needed:**
```typescript
// Add to typography in constants/theme.ts
monoTimestamp: {
  fontFamily: 'JetBrainsMono-Medium',
  fontSize: 9,
  fontWeight: '500' as const,
  letterSpacing: 0.9, // 0.1em
  lineHeight: 9,
  textTransform: 'uppercase' as const,
},
```
Justification: Reference specifies 9px with 0.1em tracking for timestamps, distinct from other mono styles (monoStatus is 9.5px/0.15em, monoTab is 9px/0.12em). Tighter tracking improves timestamp readability at small size.

*Status Caption Row*
- marginTop: 3

Caption Text:
- Style: `typography.monoStatus` base
- letterSpacing: 1.71 (0.18em override)
- fontWeight: '600' when tier === 'accent', '500' otherwise
- Color: `colors[caption.tier]` (accent / inkMuted / inkSubtle)

*Preview Row*
- marginTop: 4
- flexDirection: 'row'
- justifyContent: 'space-between'
- alignItems: 'center'

Preview Text:
- fontFamily: 'InterTight-Regular' (normal) / 'InterTight-SemiBold' (when unread > 0)
- fontSize: 12.5
- lineHeight: 16.25 (1.3)
- Color: `colors.inkMuted` (has message) / `colors.inkSubtle` + fontStyle: 'italic' (no message)
- numberOfLines: 1
- flex: 1

**Token Addition Needed:**
```typescript
// Add to typography in constants/theme.ts
bodyPreview: {
  fontFamily: 'InterTight-Regular',
  fontSize: 12.5,
  fontWeight: '400' as const,
  letterSpacing: 0,
  lineHeight: 16.25, // 1.3
},
bodyPreviewUnread: {
  fontFamily: 'InterTight-SemiBold',
  fontSize: 12.5,
  fontWeight: '600' as const,
  letterSpacing: 0,
  lineHeight: 16.25, // 1.3
},
```
Justification: Preview text at 12.5px with 1.3 line height is not covered by existing body styles (bodyL is 15px, bodyM is 14px). The unread variant needs SemiBold weight.

**Unread Badge** (only when unread > 0)
- minWidth: 18
- height: 18
- borderRadius: 9
- backgroundColor: `colors.accent`
- paddingHorizontal: 5
- alignItems: 'center'
- justifyContent: 'center'

Badge Number:
- fontFamily: 'JetBrainsMono-Bold'
- fontSize: 10
- fontWeight: '700'
- Color: `colors.bg`

---

### EmptyState

**Container**
- paddingVertical: 70
- paddingHorizontal: 32
- alignItems: 'center'

**Icon Tile**
- width: 60
- height: 60
- borderRadius: `radii.card` (14)
- backgroundColor: `colors.surface`
- borderWidth: 1
- borderColor: `colors.border`
- marginBottom: 20

Icon (MessageSquare):
- Size: 24
- strokeWidth: 2
- Color: `colors.inkMuted`

**Caption "NO INQUIRIES YET"**
- fontFamily: 'JetBrainsMono-Medium'
- fontSize: 9.5
- letterSpacing: 2.375 (0.25em)
- textTransform: 'uppercase'
- Color: `colors.inkMuted`
- marginBottom: 14

**Headline**
- fontFamily: 'InterTight-ExtraBold'
- fontSize: 26
- fontWeight: '800'
- letterSpacing: -1.17 (-0.045em)
- lineHeight: 24.7 (0.95)
- Color: `colors.ink`
- textAlign: 'center'
- marginBottom: 10

Business: "Find someone\nto work with."
Talent: "Your first request is\naround the corner."

**Body Copy**
- fontFamily: 'InterTight-Regular'
- fontSize: 13
- lineHeight: 19.5 (1.5)
- Color: `colors.ink` with opacity 0.6
- textAlign: 'center'
- maxWidth: 240 (approx 30ch)
- marginBottom: 24

**CTA Button** (Business only)
- Style: `recipes.primaryButton` (accent bg, pill radius, shadow)
- paddingVertical: 12
- paddingHorizontal: 24

Button Text:
- fontFamily: 'InterTight-Bold'
- fontSize: 13
- fontWeight: '700'
- Color: `colors.bg`
- Text: "Browse Discover" + " " + "→"

---

### NoResultsState

**Container**
- paddingVertical: 50
- paddingHorizontal: 32
- alignItems: 'center'

**Caption "NO MATCHES"**
- fontFamily: 'JetBrainsMono-Medium'
- fontSize: 9.5
- letterSpacing: 1.9 (0.2em)
- textTransform: 'uppercase'
- Color: `colors.inkMuted`
- marginBottom: 12

**Headline**
- fontFamily: 'InterTight-ExtraBold'
- fontSize: 22
- fontWeight: '800'
- letterSpacing: -0.88 (-0.04em)
- lineHeight: 22
- Color: `colors.ink`
- textAlign: 'center'
- Text: `Nothing matched "${searchValue}".`

---

## Animation Specifications

**Body FadeUp** (when content state changes)
- Duration: 400ms
- Easing: ease-out (Easing.out(Easing.ease))
- Properties: opacity 0 -> 1, translateY 8 -> 0

Use Reanimated entering animation:
```typescript
FadeInUp.duration(400).easing(Easing.out(Easing.ease))
```

---

## New Token Summary

Three new typography tokens needed (additive only):

| Token | Size | Weight | Tracking | Justification |
|-------|------|--------|----------|---------------|
| `monoStatusWide` | 9.5px | 600 | 0.18em | Action-required status captions per reference |
| `monoTimestamp` | 9px | 500 | 0.1em | Thread timestamps per reference |
| `bodyPreview` / `bodyPreviewUnread` | 12.5px | 400/600 | 0 | Message preview text per reference |

---

## Accessibility Notes

1. **Search Input**: Must have accessibilityLabel="Search threads by name"
2. **Thread Row**: accessibilityLabel must include counterparty name, status caption text, and unread state (e.g., "Yael Mizrahi, Review Delivery, 1 unread message")
3. **Unread Badge**: accessibilityLabel on badge announces count (e.g., "1 unread")
4. **EmptyState CTA**: accessibilityRole="button", accessibilityLabel="Browse Discover"

---

## Visual Hierarchy Summary

1. **Top Bar**: Display title anchors the screen, accent unread count draws attention
2. **Search**: Neutral until active, then borderStrong indicates "filtering active"
3. **Sections**: Clear hierarchy with section headers separating attention-required from all
4. **Thread Rows**: Avatar anchors left, name/status dominate middle, unread badge pulls eye right
5. **Status Colors**: Accent tier demands action, muted tiers recede
