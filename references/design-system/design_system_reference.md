# The Hub — Design System Reference

_Single source of truth for visual identity. Pair with `designTokens.ts` for code._

**Brand direction:** Metal × Sunset Orange — Wolt-style typography (bold, tight, confident geometric sans) over Revolut-style color discipline (warm-tinted dark surface + one loud accent, everything else quiet).

---

## Discipline rules (read first)

1. **One accent color, used surgically.** The sunset orange (`#FF7A29`) appears only on primary actions, active states, status dots, selected items, and verified badges. Never decorative. Never multiple colors competing.

2. **No red — anywhere.** Even for "destructive" actions like Decline, Cancel, or Delete. The decline tone (`#C4886B` — warm muted) handles all "negative" actions. Red would frame normal marketplace actions as alarming, which they're not.

3. **Mono is the system voice.** JetBrains Mono uppercase + wide tracking signals "this is metadata, not content." Used for status captions, labels, dates, counts.

4. **Picture-driven identity.** All avatars are rounded squares (12px), never circles. Influencer always shows a photo. Businesses show logo or monogram fallback.

5. **Numbers always pair with a label.** `47H LEFT` not `47H`. `3/5 claimed` not `3/5`. `4.9 ★` not `4.9`.

---

## Colors

### Surfaces

| Token | Hex / RGBA | Use |
|---|---|---|
| `bg` | `#1A1815` | Base canvas — warm-tinted dark grey |
| `surface` | `#2A2620` | Raised cards |
| `surfaceAlt` | `#221F1A` | Subtle alternative surface |
| `border` | `rgba(244,240,232,0.08)` | Soft dividers |
| `borderStrong` | `rgba(244,240,232,0.15)` | Stronger dividers, avatar edges |

### Ink (text)

| Token | Hex | Use |
|---|---|---|
| `ink` | `#F4F0E8` | Primary text — warm off-white |
| `inkMuted` | `#8A7E6C` | Secondary text, mono labels — warm grey |
| `inkSubtle` | `#5C5448` | Tertiary — dividers, empty stars, disabled state |

### Accent — sunset orange

| Token | Value | Use |
|---|---|---|
| `accent` | `#FF7A29` | Primary actions, active states, status dots |
| `accentSoft` | `rgba(255,122,41,0.12)` | Tinted backgrounds (selected, banners) |
| `accentBorder` | `rgba(255,122,41,0.40)` | Outlines on accent-soft elements |
| `accentShadow` | `rgba(255,122,41,0.30)` | Glow on active CTAs |

### Decline tone — warm muted, never red

| Token | Value | Use |
|---|---|---|
| `decline` | `#C4886B` | Decline buttons, removal Xs, errors |
| `declineSoft` | `rgba(196,136,107,0.12)` | Tinted backgrounds for decline UI |
| `declineBorder` | `rgba(196,136,107,0.40)` | Outlines on decline-soft elements |
| `declineShadow` | `rgba(196,136,107,0.30)` | Glow if needed |

### Status colors (computed from above)

- **Live / available:** uses `accent` (no separate green)
- **Busy:** uses `inkMuted`, no animation
- **On vacation:** uses `inkSubtle`, no animation
- **Terminal states (EXPIRED, DECLINED):** use `inkSubtle`

---

## Typography

### Families

| Family | Use |
|---|---|
| **Inter Tight** (display) | Names, prices, headlines, big numbers |
| **Inter Tight** (body) | Bio, review text, descriptions |
| **JetBrains Mono** | Status, labels, metadata, captions |

Display + body share the same family but live in different weight/tracking zones — display is bold and tight, body is regular and normal. Mono is the system voice.

### Type scale

| Role | Size | Line | Tracking | Use |
|---|---|---|---|---|
| Display XL | 52–64px | 0.92 | -0.045em | Influencer name on storefront |
| Display L | 32–48px | 1.0 | -0.04em | Section heroes |
| Display M | 22–28px | 1.05 | -0.035em | Section titles, big numerics |
| Heading | 17–22px | 1.2 | -0.025em | Card titles, service names |
| Body L | 15–17px | 1.45 | -0.005em | Bio, review text |
| Body M | 13.5–15px | 1.5 | normal | Default UI text |
| Mono label | 9.5–11px | 1.0 | +0.15em | All system labels, captions |

### Weights

| Weight | Used for |
|---|---|
| 400 (regular) | Body text |
| 500 (medium) | UI text, mono captions |
| 600 (semibold) | Active mono captions, button text |
| 700 (bold) | Card titles, prices, default display |
| 800 (heavy) | Section heroes, hero numbers, name displays |

---

## Geometry

### Radius tokens

| Token | Value | Use |
|---|---|---|
| Card radius | 14–16px | All surfaces |
| Pill radius | 100px | All buttons, all status pills |
| Avatar radius | 12px | All identity tiles (rounded square — **NEVER circle**) |
| Sheet radius | 22px (top corners only) | Bottom sheets |

### Shadow tokens

| Token | Value | Use |
|---|---|---|
| CTA shadow | `0 8px 24px rgba(255,122,41,0.30)` | Active primary CTA |
| Sheet shadow | `0 -20px 60px rgba(0,0,0,0.5)` | Bottom sheets |
| Selection ring | `0 0 0 4px rgba(255,122,41,0.12)` | Selected service badge, etc. |

### Spacing (informal)

Common values used across the app: **4, 6, 8, 10, 12, 14, 16, 20, 22, 24, 28, 32 px**.

---

## Motion

### Durations

| Token | Value | Use |
|---|---|---|
| Fast | 0.15s | Micro-interactions |
| Base | 0.18s | Default transitions (hover, select) |
| Slow | 0.42s | Sheet rises, big moves |

### Easings

| Token | Value | Use |
|---|---|---|
| Base | `ease` | Default |
| Out | `ease-out` | Most transitions |
| Smooth | `cubic-bezier(0.4, 0, 0.2, 1)` | Carousel transitions |
| Sheet | `cubic-bezier(0.32, 0.72, 0, 1)` | Bottom sheet rise |

---

## Avatar / identity rules (picture-driven)

**Critical rule: All avatars are rounded squares (12px), never circles.**

| Identity type | Default avatar | Fallback |
|---|---|---|
| **Influencer** | First portfolio image | None — Influencer must upload at least one image before publishing |
| **Business / Business** | Uploaded logo | Monogram tile (display 800 initials on `surfaceAlt`) |
| **System / generic** | Mono caption only | — |

Avatars never carry status info. Status uses mono captions or status dots, communicated separately from the avatar.

---

## Quick reference card

When in doubt:

- **Card backgrounds** → `surface` (`#2A2620`)
- **Default text** → `ink` (`#F4F0E8`)
- **System labels / captions** → `inkMuted` (`#8A7E6C`) in mono uppercase
- **Anything that needs attention** → `accent` (`#FF7A29`)
- **Avoid red** → use `decline` (`#C4886B`) for negative actions
- **Selected / active** → `accentSoft` background + `accentBorder`
- **All radii** → 14px for cards, 100px for buttons, 12px for avatars
