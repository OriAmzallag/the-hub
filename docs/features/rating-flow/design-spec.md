# Rating Flow - Design Specification
Version: 1.0
Date: 2026-05-13
Status: APPROVED

## Design System Alignment

All specifications use existing tokens from `constants/theme.ts`. No new tokens introduced.

### Colors Used
- `colors.bg` (#1A1815) - Screen background
- `colors.surface` (#2A2620) - Cards, inactive chips
- `colors.border` (rgba(244,240,232,0.08)) - Inactive chip borders
- `colors.borderStrong` (rgba(244,240,232,0.15)) - Avatar borders
- `colors.ink` (#F4F0E8) - Primary text
- `colors.inkMuted` (#8A7E6C) - Secondary text, captions
- `colors.inkSubtle` (#5C5448) - Tertiary text
- `colors.accent` (#FF7A29) - Stars, active states, CTAs
- `colors.accentSoft` (rgba(255,122,41,0.12)) - Active chip background
- `colors.accentBorder` (rgba(255,122,41,0.40)) - Active chip border

### Radii Used
- `radii.avatarHero` (24) - 96x96 hero avatars
- `radii.avatar` (12) - 32x32 avatars in RatingCard
- `radii.card` (14) - Notice cards
- `radii.pill` (9999) - CTAs, chips

---

## Screen 1: Rate

### Layout (375pt width reference)

```
+------------------------------------------+
|  [X]         RATE YOUR COLLABORATION     |  <- Top bar: 56pt height
+------------------------------------------+
|                                          |
|              [96x96 Avatar]              |  <- borderStrong, radius 24
|                                          |
|     Instagram Reel + Story Set - ₪530    |  <- inkMuted mono caption
|                                          |
|           How was working                |  <- display 30/800/-0.04em
|           with Maya?                     |     ink, centered
|                                          |
|       [*] [*] [*] [*] [*]               |  <- 5 x 42pt stars, gap 8
|              Great                       |  <- accent mono label (after tap)
|                                          |
|       WHAT STOOD OUT - OPTIONAL          |  <- inkMuted mono caption
|  [On time] [Clear delivery] [Great...]   |  <- chips, wrap, gap 7
|  [Good comms] [Knew the brand] [Would..] |
|                                          |
|       ANYTHING ELSE - OPTIONAL           |  <- inkMuted mono caption
|  +------------------------------------+  |
|  | Your review here...               |  |  <- surface bg, border
|  |                                    |  |     14px ink, 3 rows
|  |                          123/200  |  |  <- accent if >180
|  +------------------------------------+  |
|                                          |
|  +------------------------------------+  |
|  | [Clock] You'll see Maya's rating  |  |  <- NoticeCard
|  | once they submit theirs. Ratings  |  |     surface bg, border
|  | reveal at the same time.          |  |     inkMuted text
|  +------------------------------------+  |
|                                          |
+------------------------------------------+
|  [======= Submit rating ==========>]     |  <- sticky footer, primary pill
+------------------------------------------+
```

### Top Bar

| Element | Spec |
|---------|------|
| Height | 56pt |
| X button | Left, 36x36 surface circle, X icon 20px ink |
| Eyebrow | "RATE YOUR COLLABORATION", `typography.monoGreeting`, accent |
| Alignment | X flush left, eyebrow centered |

### Hero Block

| Element | Spec |
|---------|------|
| Avatar size | 96x96 |
| Avatar radius | 24 (`radii.avatarHero`) |
| Avatar border | 1px `borderStrong` |
| Photo | For influencer counterparty |
| Monogram | For business counterparty, surface bg, display text |
| Spacing below | 16pt |
| Deal summary | `typography.monoStatus`, inkMuted |
| Summary format | "{services} - ₪{money}" |
| Headline | "How was working\nwith {FirstName}?" |
| Headline style | fontSize 30, fontWeight 800, letterSpacing -0.04em, lineHeight 34 |
| Headline color | ink |

### Star Input

| Element | Spec |
|---------|------|
| Star size | 42pt |
| Star gap | 8pt |
| Fill color | accent (selected), inkSubtle (unselected) |
| Animation | Spring scale 0->1 on select, damping 12, stiffness 180 |
| Cascade delay | 30ms per star |
| Label | Appears after first tap |
| Label values | Poor (1), Below average (2), OK (3), Great (4), Excellent (5) |
| Label style | `typography.monoLabel`, accent |
| Label spacing | 12pt below stars |

### Tag Chips

| Element | Spec |
|---------|------|
| Caption | "WHAT STOOD OUT - OPTIONAL" |
| Caption style | `typography.monoGreeting`, inkMuted |
| Caption spacing | 16pt below star label |
| Layout | flexWrap: wrap, justifyContent: center |
| Gap | 7pt |
| Chip padding | 8pt vertical, 14pt horizontal |
| Inactive chip | surface bg, border, ink text |
| Active chip | accentSoft bg, accentBorder, accent text |
| Check icon | 12px, accent, appears on active chips |
| Chip text | fontSize 13, fontWeight 600, letterSpacing -0.02em |

### Review Input

| Element | Spec |
|---------|------|
| Caption | "ANYTHING ELSE - OPTIONAL" |
| Caption style | `typography.monoGreeting`, inkMuted |
| Caption spacing | 24pt below tags |
| Container | surface bg, 1px border, `radii.card` |
| Padding | 16pt |
| Text | 14px, ink |
| Rows | 3 (minHeight ~66pt) |
| Max chars | 200 |
| Counter | Bottom right, `typography.monoTimestamp` |
| Counter color | inkMuted (<=180), accent (>180) |

### Notice Card

| Element | Spec |
|---------|------|
| Spacing above | 24pt |
| Background | surface |
| Border | 1px border |
| Radius | `radii.card` (14) |
| Padding | 16pt |
| Icon | Clock, 16px, inkMuted |
| Text | "You'll see {Name}'s rating once they submit theirs. Ratings reveal at the same time." |
| Text style | `typography.bodyM`, inkMuted |
| Layout | icon left, text right, gap 12pt |

### Sticky Footer

| Element | Spec |
|---------|------|
| Pattern | Reuse from StepShell |
| Blur | intensity 80, tint dark |
| Background | bgOverlay94 |
| Border | 1px border top |
| Padding | 16pt top, 24pt horizontal, max(safeArea, 24pt) bottom |
| Button | Primary pill, full width |
| Button text | "Submit rating" |
| Button icon | ArrowRight, 16px, strokeWidth 2.6 |
| Disabled state | surface bg, no shadow, inkMuted text/icon |
| Disabled when | stars === 0 |

---

## Screen 2: Submitted - Waiting

### Layout

```
+------------------------------------------+
|                                          |
|                                          |
|              [Check Circle]              |  <- 80x80 accent circle
|               [Check Icon]               |     with check-pop animation
|                                          |
|           RATED - 5 STARS                |  <- accent mono eyebrow
|                                          |
|             Submitted.                   |  <- display 30/800/-0.04em
|                                          |
|    We'll show you what Maya rated        |  <- ink, opacity 0.7
|       once they submit theirs.           |
|                                          |
|  +------------------------------------+  |
|  | [Clock] HOW THIS WORKS            |  |  <- NoticeCard with title
|  |                                    |  |
|  | Ratings stay hidden until both    |  |
|  | sides submit. It keeps things     |  |
|  | honest - nobody rates in reaction.|  |
|  +------------------------------------+  |
|                                          |
|  [-------- Back to Dashboard --------]   |  <- outline secondary button
|                                          |
+------------------------------------------+
```

### Check Hero

| Element | Spec |
|---------|------|
| Circle size | 80x80 |
| Circle color | accent |
| Circle shadow | accentShadow, offset 0/8, radius 24 |
| Check icon | 28px, strokeWidth 3, bg color (dark) |
| Animation | Scale 0->1, withDelay(200), withSpring(damping 12, stiffness 180) |

### Eyebrow

| Element | Spec |
|---------|------|
| Text | "RATED - {N} STARS" |
| Style | `typography.monoGreeting`, letterSpacing 0.28em |
| Color | accent |
| Spacing | 20pt below check |

### Headline

| Element | Spec |
|---------|------|
| Text | "Submitted." |
| Style | fontSize 30, fontWeight 800, letterSpacing -0.04em |
| Color | ink |
| Alignment | center |

### Body Text

| Element | Spec |
|---------|------|
| Text | "We'll show you what {FirstName} rated once they submit theirs." |
| Style | fontSize 15, fontWeight 400, lineHeight 22 |
| Color | ink, opacity 0.7 |
| Max width | 280pt |
| Alignment | center |

### Notice Card (with title)

| Element | Spec |
|---------|------|
| Title | "HOW THIS WORKS" |
| Title style | `typography.monoLabel`, inkMuted |
| Body | "Ratings stay hidden until both sides submit. It keeps things honest - nobody rates in reaction." |
| Body style | `typography.bodyM`, inkMuted |

### Secondary CTA

| Element | Spec |
|---------|------|
| Style | Outline button (secondaryButton recipe) |
| Text | "Back to Dashboard" |
| Text style | `typography.rowSecondary`, ink |
| Full width | Yes |
| Spacing | 32pt below notice card |

---

## Screen 3: Mutual Reveal

### Layout

```
+------------------------------------------+
|  [X]           RATINGS REVEALED          |  <- Top bar
+------------------------------------------+
|                                          |
|              [Check Circle]              |  <- 72x72 accent
|                                          |
|         5 stars each. Nice work.         |  <- Conditional headline
|                                          |
|    This collaboration is now part of     |
|         both your histories.             |
|                                          |
|  +------------------------------------+  |
|  | You rated Maya                     |  |  <- RatingCard (yours)
|  | [*][*][*][*][*] 5.0               |  |
|  | [On time] [Great quality] [...]   |  |
|  | "Amazing collaboration, loved..."|  |
|  +------------------------------------+  |
|                                          |
|           ——— AND ———                    |  <- Separator
|                                          |
|  +------------------------------------+  |
|  | [Avatar] Maya rated you            |  |  <- RatingCard (theirs)
|  | [*][*][*][*][*] 5.0               |  |
|  | [Clear brief] [Easy to work with] |  |
|  | "Professional from first DM..."   |  |
|  +------------------------------------+  |
|                                          |
+------------------------------------------+
|  [--- Back ---] [== View deal summary ==]|  <- Two-button footer
+------------------------------------------+
```

### Check Hero (Reveal variant)

| Element | Spec |
|---------|------|
| Circle size | 72x72 |
| Other specs | Same as Submitted screen |

### Conditional Headline

| Condition | Text |
|-----------|------|
| Both 5 stars | "5 stars each. Nice work." |
| Equal, not 5 | "{N} stars each." |
| Different | "You've both rated." |

Style: fontSize 30, fontWeight 800, letterSpacing -0.04em, ink, centered

### Body Text

| Element | Spec |
|---------|------|
| Text | "This collaboration is now part of both your histories." |
| Style | fontSize 15, fontWeight 400, lineHeight 22 |
| Color | ink, opacity 0.7 |
| Max width | 280pt |

### RatingCard

| Element | Spec |
|---------|------|
| Background | surface |
| Border | 1px border |
| Radius | `radii.card` (14) |
| Padding | 16pt |
| Label row | Avatar (optional) + label text |
| Avatar size | 32x32 |
| Avatar radius | 9 |
| Label text | "You rated {Name}" or "{Name} rated you" |
| Label style | `typography.rowTitle`, ink |
| Stars | 5 inline, 14px each, accent fill |
| Numeric | "{N}.0" suffix, `typography.monoLabel`, accent |
| Tags | accentSoft chips (no border), gap 6, wrap |
| Tag text | fontSize 11, fontWeight 600, accent |
| Review | Italic, inkMuted, quotes around text |
| Review style | fontSize 13, fontStyle italic |

### Separator

| Element | Spec |
|---------|------|
| Text | "——— AND ———" |
| Style | `typography.monoTimestamp`, inkSubtle |
| Alignment | center |
| Spacing | 16pt vertical |

### Two-Button Footer

| Element | Spec |
|---------|------|
| Layout | Row, gap 12pt |
| "Back" button | Outline (secondaryButton), flex 1 |
| "View deal summary" | Primary, flex 2 |

---

## Animations

### Star Pop

```typescript
// On star tap
starScale[index].value = withSpring(1, {
  damping: 12,
  stiffness: 180,
  overshootClamping: false,
});

// Cascade: previous stars also animate
for (let i = 0; i < index; i++) {
  starScale[i].value = withDelay(
    (index - i) * 30,
    withSpring(1, { damping: 12, stiffness: 180 })
  );
}
```

### Check Pop

Reuse pattern from `WelcomeBackStep.tsx`:

```typescript
useEffect(() => {
  checkScale.value = withDelay(
    200,
    withSpring(1, {
      damping: 12,
      stiffness: 180,
      overshootClamping: false,
    })
  );
}, []);
```

### Fade Up Entrance

Reuse `useFadeUpEntrance()` hook on all three screens.

---

## Responsive Behavior

- All screens scroll when content exceeds viewport
- Sticky footer remains pinned
- Tag chips wrap naturally on narrower screens
- Review textarea grows vertically with content (up to 3 rows initial)

## Accessibility

| Element | A11y Spec |
|---------|-----------|
| Star input | `accessibilityRole="slider"`, `accessibilityValue` for current stars |
| Tag chips | `accessibilityRole="checkbox"`, `accessibilityState={{ checked }}` |
| Review input | `accessibilityLabel="Optional review, 200 characters max"` |
| Submit button | `accessibilityState={{ disabled }}` when stars === 0 |
| X close | `accessibilityLabel="Close and go back"` |

## Dark Theme

Already dark-first. No light theme variant needed for this PR.
