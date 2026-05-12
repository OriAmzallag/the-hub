# Feature: Business Dashboard
## Design Specification

**Author:** Designer Agent  
**Date:** 2026-05-09  
**Status:** APPROVED FOR DEVELOPMENT

---

## 1. Theme Token Update Required

The current `constants/theme.ts` uses a **light theme** (Indigo primary). The reference uses **"Metal x Sunset Orange"** dark theme. 

### 1.1 New Color Tokens

| Token | Hex Value | RGBA (if applicable) | Usage |
|-------|-----------|---------------------|-------|
| `bg` | `#1A1815` | - | Main background |
| `surface` | `#2A2620` | - | Cards, rows |
| `surfaceAlt` | `#221F1A` | - | Icon backgrounds, secondary surfaces |
| `border` | - | `rgba(244,240,232,0.08)` | Default borders |
| `borderStrong` | - | `rgba(244,240,232,0.15)` | Emphasized borders (images) |
| `ink` | `#F4F0E8` | - | Primary text (warm white) |
| `inkMuted` | `#8A7E6C` | - | Secondary text (tan) |
| `inkSubtle` | `#5C5448` | - | Tertiary/dividers (dark tan) |
| `accent` | `#FF7A29` | - | Primary accent (sunset orange) |
| `accentSoft` | - | `rgba(255,122,41,0.12)` | Accent backgrounds |
| `accentBorder` | - | `rgba(255,122,41,0.40)` | Accent borders |
| `accentShadow` | - | `rgba(255,122,41,0.30)` | Accent glow shadows |

### 1.2 Tailwind Mapping

```javascript
colors: {
  hub: {
    bg: '#1A1815',
    surface: '#2A2620',
    'surface-alt': '#221F1A',
    border: 'rgba(244,240,232,0.08)',
    'border-strong': 'rgba(244,240,232,0.15)',
    ink: '#F4F0E8',
    'ink-muted': '#8A7E6C',
    'ink-subtle': '#5C5448',
    accent: '#FF7A29',
    'accent-soft': 'rgba(255,122,41,0.12)',
    'accent-border': 'rgba(255,122,41,0.40)',
  }
}
```

---

## 2. Typography Specifications

### 2.1 Font Families

| Name | CSS Family | Usage |
|------|------------|-------|
| Display | `Inter Tight` | Headers, names, values |
| Mono | `JetBrains Mono` | Labels, status, badges |

### 2.2 Typography Scale

| Style Name | Font | Size | Weight | Letter-Spacing | Line-Height | Usage |
|------------|------|------|--------|----------------|-------------|-------|
| `display-xl` | Inter Tight | 26px | 800 | -0.04em (-1.04px) | 1 (26px) | Business name in TopBar |
| `display-lg` | Inter Tight | 24px | 800 | -0.04em (-0.96px) | 1 (24px) | Stat values |
| `section-title` | Inter Tight | 22px | 700 | -0.035em (-0.77px) | 1 | Section headers |
| `tile-title` | Inter Tight | 17px | 700 | -0.03em (-0.51px) | 1 | Action tile labels |
| `row-primary` | Inter Tight | 16px | 700 | -0.03em (-0.48px) | 1 | Deal total amount |
| `row-title` | Inter Tight | 15px | 700 | -0.025em (-0.375px) | 1.1 | Deal/Perk name |
| `banner-title` | Inter Tight | 14.5px | 700 | -0.025em (-0.3625px) | 1.1 | Attention banner title |
| `row-secondary` | Inter Tight | 14px | 700 | -0.025em (-0.35px) | 1 | Perk claim count |
| `avatar-mono` | Inter Tight | 13px | 800 | -0.04em (-0.52px) | 1 | Avatar monogram |
| `mono-greeting` | JetBrains Mono | 10px | 500 | 0.2em (2px) | 1 | "Good morning" label |
| `mono-label` | JetBrains Mono | 10.5px | 500 | 0.15em (1.575px) | 1 | "See all" link |
| `mono-status` | JetBrains Mono | 9.5px | 500 | 0.15em (1.425px) | 1 | Status labels, counts |
| `mono-stat-label` | JetBrains Mono | 9.5px | 500 | 0.15em | 1.3 | Stat tile labels |
| `mono-tab` | JetBrains Mono | 9px | 500/600 | 0.12em (1.08px) | 1 | Tab bar labels |
| `mono-badge` | JetBrains Mono | 8px | 700 | 0 | 1 | Badge numbers |

### 2.3 Text Transform Rules

| Style | Transform |
|-------|-----------|
| All mono styles | `uppercase` |
| Display/row styles | `none` (normal case) |

---

## 3. Spacing Scale

### 3.1 Extracted Pixel Values

| Usage | Value | Tailwind Class |
|-------|-------|----------------|
| Screen horizontal padding | 20px | `px-5` |
| Section bottom margin | 24px | `mb-6` |
| Stats section bottom margin | 32px | `mb-8` |
| Section header bottom margin | 14px | `mb-3.5` (custom) |
| Row gap in lists | 8px | `gap-2` |
| Grid gap | 8px | `gap-2` |
| Row internal gap | 12-14px | `gap-3` |
| Card padding | 14px 16px | `py-3.5 px-4` |
| Action tile padding | 18px 16px | `py-[18px] px-4` |
| Stat tile padding | 14px | `p-3.5` (custom) |
| Top bar padding | 16px 20px 14px | `pt-4 px-5 pb-3.5` |
| Tab bar padding | 10px 12px 18px | `pt-2.5 px-3 pb-[18px]` |
| Scroll content bottom padding | 100px | `pb-[100px]` |

### 3.2 Custom Spacing (not in Tailwind default)

Add to `tailwind.config.js`:

```javascript
spacing: {
  '3.5': '14px',
  '4.5': '18px',
}
```

---

## 4. Component Dimensions

### 4.1 TopBar

| Element | Dimension |
|---------|-----------|
| Container height | Auto (content-based) |
| Icon button size | 38x38px |
| Icon button radius | 50% (full) |
| Icon size | 17px |

### 4.2 Attention Banner

| Element | Dimension |
|---------|-----------|
| Container radius | 14px |
| Container padding | 14px 16px |
| Photo size | 44x44px |
| Photo radius | 12px |
| Star badge size | 20x20px (circular) |
| Star badge border | 2px solid bg color |
| Star icon size | 10px |
| Chevron size | 18px |
| Gap between photo and text | 14px |

### 4.3 Deal Row

| Element | Dimension |
|---------|-----------|
| Container radius | 14px |
| Container padding | 14px 16px |
| Photo size | 44x44px |
| Photo radius | 12px |
| Chevron size | 16px |
| Gap photo to text | 12px |
| Gap text to amount | 10px |
| Status dot size | 3x3px |

### 4.4 Action Tile

| Element | Dimension |
|---------|-----------|
| Container radius | 14px |
| Container min-height | 110px |
| Container padding | 18px 16px |
| Icon box size | 36x36px |
| Icon box radius | 10px |
| Icon size | 18px |
| Gap icon to text | 24px |
| Gap title to hint | 5px |

### 4.5 Perk Row

| Element | Dimension |
|---------|-----------|
| Container radius | 14px |
| Container padding | 14px 16px |
| Progress bar height | 4px |
| Progress bar radius | 2px |
| Gap content to progress | 10px |
| Gap title to count | 12px |

### 4.6 Stat Tile

| Element | Dimension |
|---------|-----------|
| Container radius | 14px |
| Container min-height | 86px |
| Container padding | 14px |
| Gap label to value | 8px (via justify-between) |

### 4.7 Tab Bar

| Element | Dimension |
|---------|-----------|
| Container padding | 10px 12px 18px |
| Tab icon size | 20px |
| Tab badge min-width | 14px |
| Tab badge height | 14px |
| Tab badge radius | 7px |
| Tab badge border | 2px solid bg color |
| Tab badge font size | 8px |
| Gap icon to label | 4px |

---

## 5. Border Specifications

| Element | Border |
|---------|--------|
| Default cards | 1px solid `border` (rgba 8%) |
| Image containers | 1px solid `borderStrong` (rgba 15%) |
| Attention banner | 1px solid `accentBorder` (rgba 40%) |
| Primary action tile | none |
| Tab bar | 1px solid `border` (top only) |

---

## 6. Shadow Specifications

### 6.1 Primary Action Tile (Find Influencer)

```typescript
// iOS
shadowColor: '#FF7A29',
shadowOffset: { width: 0, height: 8 },
shadowOpacity: 0.3,
shadowRadius: 20,

// Android (fallback - no colored shadow)
elevation: 8,
```

### 6.2 Status Dot Glow

```typescript
// iOS only
shadowColor: '#FF7A29',
shadowOffset: { width: 0, height: 0 },
shadowOpacity: 1,
shadowRadius: 8,
```

---

## 7. Animation Specifications

### 7.1 Pulsing Status Dot

| Property | Value |
|----------|-------|
| Duration | 2000ms (2s) |
| Easing | ease-in-out |
| Direction | alternate (ping-pong) |
| Iterations | infinite |
| Opacity range | 1.0 to 0.4 |

### 7.2 Fade-Up Entry (Optional)

| Property | Value |
|----------|-------|
| Duration | 400ms |
| Easing | ease-out |
| Transform | translateY: 8px to 0 |
| Opacity | 0 to 1 |

---

## 8. Icon Specifications

Using `lucide-react-native`:

| Icon | Component | Size | Stroke Width |
|------|-----------|------|--------------|
| Chevron right | `ChevronRight` | 16-18px | 2.2 |
| Search | `Search` | 18px | 2.2 |
| Gift | `Gift` | 18px | 2.2 |
| Star (rating) | `Star` | 10px | 0 (filled) |
| Tab: Discover | `Search` | 20px | 2.0 (inactive) / 2.4 (active) |
| Tab: Dashboard | `LayoutDashboard` | 20px | 2.0 / 2.4 |
| Tab: Inquiries | `MessageSquare` | 20px | 2.0 / 2.4 |
| Tab: Profile | `User` | 20px | 2.0 / 2.4 |

---

## 9. State Variations

### 9.1 Deal Row Status Colors

| Status | Text Color | Chevron Color |
|--------|------------|---------------|
| `in_progress` | `inkMuted` | `inkMuted` |
| `waiting` | `accent` | `accent` |
| `rate_now` | `accent` | `accent` |

### 9.2 Tab Bar States

| State | Icon Color | Label Color | Label Weight |
|-------|------------|-------------|--------------|
| Inactive | `inkMuted` | `inkMuted` | 500 |
| Active | `accent` | `accent` | 600 |

### 9.3 Action Tile Variants

| Variant | Background | Border | Icon BG | Icon Color | Text Color | Hint Color |
|---------|------------|--------|---------|------------|------------|------------|
| Primary | `accent` | none | `rgba(26,24,21,0.18)` | `bg` | `bg` | `rgba(26,24,21,0.55)` |
| Secondary | `surface` | 1px `border` | `surfaceAlt` | `ink` | `ink` | `inkMuted` |

---

## 10. Accessibility Requirements

### 10.1 Touch Targets

All tappable elements must have minimum 44x44pt touch area:
- Icon buttons: 38x38 visible, pad hitSlop to 44x44
- Deal rows: Full row tappable (already > 44pt height)
- Tab bar items: Flex to fill space, already > 44pt

### 10.2 Accessibility Labels

| Element | accessibilityRole | accessibilityLabel |
|---------|-------------------|-------------------|
| Profile avatar | `button` | `"Profile menu"` |
| Deal row | `button` | `"Deal with {name}, {status}, {amount}"` |
| Action tile | `button` | `"{label}"` |
| Perk row | `button` | `"{title}, {claimed} of {max} claimed"` |
| Tab item | `tab` | `"{label}"` + `accessibilityState={{ selected }}` |

---

## 11. Currency Formatting

- Currency symbol: (Israeli Shekel / New Israeli Shekel)
- Position: Before number, no space (`530`, not `530`)
- Reference file note: Source has mojibake `âª` which should be ``

---

## 12. Empty State Designs

### 12.1 No Active Deals

- Center-aligned container
- Text: "No active deals yet" in `ink` color, `row-title` style
- CTA button: "Find influencer" with accent background
- Button style: Same as primary action tile

### 12.2 No Perks

- Center-aligned container
- Text: "No perks posted" in `ink` color, `row-title` style
- CTA button: "Post a perk" with surface background + border

---

*End of Designer Agent Output*
