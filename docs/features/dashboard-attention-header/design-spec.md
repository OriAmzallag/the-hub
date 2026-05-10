# Design Spec: Canonical Deal Lifecycle

**Feature:** dashboard-attention-header (Phase 2 - Deal Lifecycle)
**Author:** Designer Agent
**Date:** 2026-05-10

---

## Overview

This feature standardizes deal status display across the app. The visual changes are minimal - we're systematizing existing patterns, not introducing new ones.

---

## Color Tier System

### Tier Definitions

| Tier | Token | Hex Value | Usage |
|------|-------|-----------|-------|
| `accent` | `colors.accent` | #FF7A29 | Action required from viewer |
| `inkMuted` | `colors.inkMuted` | #8A7E6C | Informational, no action needed |
| `inkSubtle` | `colors.inkSubtle` | #5C5448 | Terminal/archived states |

### Token Verification

All three tiers are already defined in `constants/theme.ts`:
- Line 23: `accent: '#FF7A29'`
- Line 19: `inkMuted: '#8A7E6C'`
- Line 20: `inkSubtle: '#5C5448'`

**No new tokens required.**

---

## State-to-Tier Mapping (Business View)

| State | Caption Text | Tier | Visual Intent |
|-------|-------------|------|---------------|
| PENDING | WAITING - 47H LEFT | accent | Urgency - awaiting response |
| IN_PROGRESS | IN PROGRESS | inkMuted | Passive - work ongoing |
| DELIVERED | REVIEW DELIVERY | accent | Action needed - review work |
| COMPLETED (unrated) | RATE NOW | accent | Action needed - submit rating |
| COMPLETED (rated) | COMPLETE | inkMuted | Passive - waiting for other party |
| EXPIRED | EXPIRED | inkSubtle | Terminal - no recovery |
| DECLINED | DECLINED | inkSubtle | Terminal - no recovery |

---

## Typography

Status captions use the existing `monoStatus` style from `constants/theme.ts`:

```typescript
monoStatus: {
  fontFamily: 'JetBrainsMono-Medium',
  fontSize: 9.5,
  fontWeight: '500',
  letterSpacing: 1.425, // 0.15em
  lineHeight: 9.5,
  textTransform: 'uppercase',
}
```

**No typography changes required.**

---

## Component Impact

### DealRow

The only visual change is that the chevron icon color now matches the status tier. Currently:
- Accent (orange) chevron when `statusAccent: true`
- Muted chevron when `statusAccent: false`

After change:
- Accent chevron for `accent` tier
- Muted chevron for `inkMuted` tier
- Subtle chevron for `inkSubtle` tier (new - for EXPIRED/DECLINED)

This adds visual consistency: terminal states appear fully dimmed, including their chevron.

---

## Visual Hierarchy

The three tiers create a clear visual hierarchy:

```
[HIGHEST URGENCY]
    accent (#FF7A29)     - Orange, high contrast, demands attention
    
[NEUTRAL]
    inkMuted (#8A7E6C)   - Warm gray, visible but not demanding
    
[LOWEST PRIORITY]
    inkSubtle (#5C5448)  - Dark gray, nearly blends with background
```

---

## Accessibility

- All color tiers maintain WCAG AA contrast ratio against the surface background (#2A2620)
- Status text is uppercase monospace, maintaining readability
- Accessibility labels include the resolved caption text

---

## No New Components

This feature reuses existing components:
- `DealRow` - modified to use resolver
- `SectionHeader` - unchanged
- No new visual components needed

---

## Mockup Reference

No visual mockups needed - this is a logic change with systematic color application. The existing design patterns are preserved.
