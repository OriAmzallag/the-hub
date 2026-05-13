# Deal Card v0.8 — Design Specification

**Author**: Designer Agent  
**Date**: 2026-05-13  
**Status**: APPROVED  

---

## 1. Design System Alignment

All values derive from `constants/theme.ts`. No new tokens introduced.

### 1.1 Tone-to-Color Mapping

| Tone | Color Token | Hex Value |
|------|-------------|-----------|
| `accent` | `colors.accent` | `#ff7829` |
| `muted` | `colors.inkMuted` | `#8A7E6C` |
| `decline` | `colors.decline` | `#C4886B` |

### 1.2 Card Fill States

| State | Background | Border |
|-------|------------|--------|
| Actionable | `colors.accentSoft` (`rgba(255,122,41,0.12)`) | `colors.accentBorder` (`rgba(255,122,41,0.40)`) |
| Passive | `colors.surface` (`#2A2620`) | `colors.border` (`rgba(244,240,232,0.08)`) |

---

## 2. DealRow Visual Recipe

Reference: `references/deal-card.reference.jsx` lines 316-448

### 2.1 Layout

```
+------------------------------------------------------------------+
| [Avatar 38x38]  Name (display)              [Hint + Arrow] or    |
|                 CAPTION (mono)              [Arrow only]         |
|                 Summary . Money (body)                           |
+------------------------------------------------------------------+
```

### 2.2 Container

| Property | Value |
|----------|-------|
| Padding | `11px 13px` (vertical / horizontal) |
| Border radius | `12` (`borderRadius.lg`) |
| Gap | `11` |
| Background | Actionable: `accentSoft`, Passive: `surface` |
| Border | `1px solid`, Actionable: `accentBorder`, Passive: `border` |

### 2.3 Avatar (Business POV)

Business sees Influencer's photo.

| Property | Value |
|----------|-------|
| Size | `38 x 38` |
| Border radius | `10` |
| Border | `1px solid borderStrong` |
| Content | `<Image>` with `objectFit: cover` |

### 2.4 Monogram Tile (Influencer POV)

Influencer sees Business's monogram.

| Property | Value |
|----------|-------|
| Size | `38 x 38` |
| Border radius | `10` |
| Background | `surfaceAlt` |
| Border | `1px solid borderStrong` |
| Text | `13px`, weight `800`, `-0.04em` tracking, `ink` |

### 2.5 Middle Column

#### Name

| Property | Value |
|----------|-------|
| Font | Display |
| Size | `13.5` |
| Weight | `700` |
| Letter spacing | `-0.025em` |
| Color | `ink` |
| Margin bottom | `2` |
| Overflow | `ellipsis`, single line |

#### Caption

| Property | Value |
|----------|-------|
| Font | Mono |
| Size | `8.5` |
| Weight | `600` |
| Letter spacing | `0.16em` |
| Text transform | `uppercase` |
| Color | Tone color (`accent` / `muted` / `decline`) |
| Margin bottom | `3` |

#### Summary Line

| Property | Value |
|----------|-------|
| Font | Body |
| Size | `11` |
| Color | `inkMuted` |
| Format | `{summary} . {money}` |

### 2.6 Right Column

#### Actionable State (with hint)

| Element | Property | Value |
|---------|----------|-------|
| Container | Gap | `3` |
| Hint text | Font | Mono |
| Hint text | Size | `8` |
| Hint text | Weight | `600` |
| Hint text | Letter spacing | `0.12em` |
| Hint text | Text transform | `uppercase` |
| Hint text | Color | `accent` |
| Arrow | Size | `9` |
| Arrow | Stroke width | `2.6` |
| Arrow | Color | `accent` |

#### Passive State (chevron only)

| Element | Property | Value |
|---------|----------|-------|
| Arrow | Size | `13` |
| Arrow | Stroke width | `2.2` |
| Arrow | Color | `inkSubtle` |

### 2.7 Press Animation

| Property | Value |
|----------|-------|
| Transform | `scale(0.98)` |
| Transition | `0.12s ease` |

---

## 3. AttentionBanner Updates

### 3.1 Remove DELIVERED Badge

The Package icon badge (lines 73-81 in current code) is removed. Only the Star badge remains for COMPLETED rating-due state.

### 3.2 Badge Logic

```typescript
// Only show star badge for COMPLETED where viewer needs to rate
const isRatingDue =
  item.state === 'COMPLETED' &&
  (item.completedSubstate === 'neither-rated' ||
   (viewerRole === 'business' && item.completedSubstate === 'influencer-rated'));
```

---

## 4. InfluencerAttentionItem Updates

### 4.1 State-to-Icon Mapping

| State | Icon |
|-------|------|
| PENDING | `Inbox` |
| COMPLETED (rate due) | `Star` |
| Other | `Inbox` (fallback) |

Remove the `deliver` kind — it was for DELIVERED state which no longer exists.

### 4.2 Subtitle Source

Subtitle now comes from `getDealCaption(deal, 'influencer').text` instead of pre-rendered `item.subtitle`.

---

## 5. Typography Reference

From `constants/theme.ts`:

| Use | Style | Size | Weight | Tracking |
|-----|-------|------|--------|----------|
| Name | `typography.rowTitle` | 15 | 700 | -0.025em |
| Caption | Custom mono | 8.5 | 600 | 0.16em |
| Summary | Custom body | 11 | — | — |
| Hint | Custom mono | 8 | 600 | 0.12em |

**Note**: The prototype uses slightly different sizes than existing `typography` tokens. For pixel-perfect match:
- Name: 13.5 (not 15)
- Caption: 8.5 (not 9.5)
- Hint: 8 (not 9)

Create inline styles or add new tokens if needed. Do NOT modify existing tokens that other components use.

---

## 6. Visual Audit Checklist

- [ ] Avatar is 38x38 with radius 10 (not 44x44 with radius 12)
- [ ] Caption uses 8.5px mono at 0.16em tracking
- [ ] Actionable cards have accentSoft fill + accentBorder
- [ ] Passive cards have surface fill + border
- [ ] Hint text is 8px mono at 0.12em tracking
- [ ] Arrow in hint row is 9px with 2.6 stroke
- [ ] Arrow in passive row is 13px with 2.2 stroke
- [ ] Press scales to 0.98

---

## 7. Accessibility

- Pressable has `accessibilityRole="button"`
- Accessible label format: `"Deal with {name}, {caption}, {money} shekels"`
- Color contrast for all tones meets WCAG AA on their respective backgrounds
