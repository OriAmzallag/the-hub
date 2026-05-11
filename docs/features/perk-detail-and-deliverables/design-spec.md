# Perk Detail and Deliverables - Design Spec

Generated: 2026-05-11
Status: IMPLEMENTED

## Three Render States

### 1. Detail - Qualified
- QualificationBanner: accentSoft bg, accent border, CheckCircle2 icon + "You qualify" + "Tap Claim to reserve..."
- Sticky CTA: accent fill, "Claim this perk" + ArrowRight icon
- DeliverableTiles: each shows "QUALIFIED" chip (accentSoft bg, accent text)

### 2. Detail - Below/Partial
- QualificationBanner:
  - **None**: declineSoft bg, decline border, AlertCircle icon + "Below threshold" + "Keep growing..."
  - **Partial**: declineSoft bg, decline border, AlertCircle icon + "Partial match" + "{N} of {M} requirements met..."
- Sticky CTA: disabled, declineSoft bg, decline text: "Below threshold - Can't claim" or "Partial match - Can't claim"
- DeliverableTiles: show "QUALIFIED" or "BELOW" chip per deliverable

### 3. Claimed Success
- Full-screen replace (not modal)
- 80x80 accent circle with white Check, spring scale animation
- Mono accent "CLAIMED" caption
- Display L "It's yours." (36px, -0.045em)
- Subtext: "{Business} has been notified. You have until {deadline} to deliver."
- Summary card (surface tile): Perk, Business, Value
- Primary CTA: "Open inquiry" (accent pill + MessageSquare)
- Secondary CTA: "Back to perks" (outline pill)

## Component Specs

### PerkDetailTopBar
- Position: absolute, top 0
- Initial: frosted dark pill (bgOverlay85) back + share + heart
- After scroll past hero: surface bg, title appears center
- Heart: accent fill when favorited

### PerkHero
- 4:3 aspect ratio (width: 100%, paddingTop: 75%)
- Top-left badge if exists (same style as PerkCard)
- Bottom-left value chip (frosted, "₪{value}")
- Bottom gradient scrim

### PerkIdentity
- Category: mono 10px accent, uppercase, 0.15em tracking
- Title: display 36, weight 800, -0.045em
- Business tile: 40x40 monogram (rounded square), name + verified badge row, mono row (star rating, deals, location)

### QualificationBanner
- Full-width, 16px horizontal margin
- Icon 24px + text block
- Border radius: card (14)

### PerkStatsRow
- 3-up horizontal grid, equal widths
- Each: display M value, mono 9.5px label

### DeliverableTile
- Surface tile with border
- Header: mono index "01", mono "{ACTION} on {PLATFORM}", right-aligned chip
- Body: 14px ink description, 1.5 line-height
- Footer: border-top separator, "Need {N}+ on {P}" left, "You: {count}" right

### DeadlinePill
- Full-width, surface bg, mono text
- Clock icon + "Within 7 days of claiming"

### ConfirmSheet
- Modal + GestureHandlerRootView pattern
- Header: mono "CONFIRM CLAIM", display 26 "Ready to claim?"
- Summary card: 3 rows (Perk, Deliverables stacked, Deadline)
- Disclaimer copy
- Footer: outline "Cancel" + accent "Yes, claim"

### ClaimedSuccess
- check-pop animation: scale 0 → 1, spring damping 12, stiffness 180
- fade-up: opacity 0→1, translateY 8→0, 0.4s, delayed 200ms

## Tokens Used

All from existing `constants/theme.ts`:
- colors.accent, accentSoft, accentBorder
- colors.decline, declineSoft, declineBorder
- colors.surface, border, borderStrong
- colors.ink, inkMuted, inkSubtle
- radii.card (14), radii.pill, radii.avatar (12)
- typography: textScale.displayL, sectionTitle, monoLabel, monoStatus
- motion.duration.slow, motion.easing.sheet

**No new tokens needed** - all specs use existing theme.ts values.
