# Rating Flow - Product Requirements
Version: 1.0
Date: 2026-05-13
Status: APPROVED

## Overview

The Rating Flow is the UX that fires when a deal reaches COMPLETED state. It is the sole producer of RATED-state transitions in the deal lifecycle (shipped in PR #28, deal-card v0.8).

## Six Locked Product Decisions (NON-NEGOTIABLE)

| # | Decision | Rationale |
|---|----------|-----------|
| 1 | **Public ratings** | Attributed and shown on the rated person's storefront/profile. Anonymous aggregates are gameable; public ratings are real trust currency. |
| 2 | **Stars required, tags + review optional** | Required text fields produce low-quality reviews ("good", "thx"). Optional with good prompts produces better signal. Stars 1-5 required. |
| 3 | **Mutual reveal** | Neither side sees the other's rating until both submit. Same model as Airbnb. Prevents retaliation, encourages honesty. |
| 4 | **Locked once submitted, forever** | No edit, no delete, no appeal. Editable ratings are gameable. Permanence is the signal. Abusive content handled via silent admin moderation (out of scope). |
| 5 | **Single dimension** | One overall 1-5 star rating + optional tag chips + optional 200-char review. Multi-dimensional dimensions (comms/quality/timeliness) cause rating fatigue. |
| 6 | **Conversational prompt** | "How was working with {Name}?" frames rating as reflection, not judgment. |

## Tag Taxonomies (LOCKED)

### Business rates Influencer
- On time
- Clear delivery
- Great quality
- Good comms
- Knew the brand
- Would book again (strongest predictive signal - store separately)

### Influencer rates Business
- Clear brief
- Easy to work with
- Fast comms
- Trusted my creativity
- Fair deal
- Would work again (strongest predictive signal - store separately)

## Three Screens

### Screen 1: Rate

**Purpose**: Primary rating input screen

**Components**:
- Top bar: X close (left) + "RATE YOUR COLLABORATION" accent mono eyebrow
- Hero: 96x96 counterparty avatar (photo for influencer, monogram tile for business), radius 24, borderStrong
- Deal summary: "{services} - {money}" inkMuted mono caption
- Headline: "How was working\nwith {FirstName}?" display 30/800/-0.04em
- Stars: 5 x 42pt accent-filled stars with star-pop spring animation. After first tap, shows label: Poor / Below average / OK / Great / Excellent
- Tag chips: wrap, centered, gap 7. Active = accentSoft + accentBorder + accent text + Check 12 icon. Inactive = surface + border + ink text. Caption: "WHAT STOOD OUT - OPTIONAL"
- Review textarea: 14px ink, 3 rows, max 200 chars, char counter bottom-right (accent if >180). Caption: "ANYTHING ELSE - OPTIONAL"
- Mutual-reveal notice card: Clock icon + "You'll see {Name}'s rating once they submit theirs. Ratings reveal at the same time."
- Sticky footer: primary "Submit rating" pill + ArrowRight 16/2.6. Disabled until stars >= 1.

### Screen 2: Submitted - Waiting (first rater)

**Purpose**: Confirmation after submitting when counterparty hasn't rated yet

**Components**:
- Hero: 80x80 accent check circle with check-pop animation
- Eyebrow: "RATED - {N} STARS" accent mono 10/0.28em
- Headline: "Submitted." display 30/800/-0.04em centered
- Body: "We'll show you what {FirstName} rated once they submit theirs."
- Explainer card: Clock icon + "HOW THIS WORKS" + "Ratings stay hidden until both sides submit. It keeps things honest - nobody rates in reaction."
- Secondary outline CTA: "Back to Dashboard"

### Screen 3: Mutual Reveal (when second rater submits)

**Purpose**: Show both ratings once both parties have submitted

**Entry**: Tapping the deal card after both have rated (deal is now RATED state)

**Components**:
- Top bar: X close + "RATINGS REVEALED" accent eyebrow
- Hero: 72x72 accent check circle
- Conditional headline (display 30/800):
  - Both 5 stars: "5 stars each. Nice work."
  - Both equal but not 5: "{N} stars each."
  - Different: "You've both rated."
- Body: "This collaboration is now part of both your histories."
- Two RatingCard primitives stacked with "--- AND ---" separator:
  - "You rated {counterparty}" - viewer's rating, no avatar
  - "{Counterparty} rated you" - their rating, with their 32x32 avatar (radius 9)
  - Each card: 5 stars with numeric "{N}.0" suffix + tag chips (accentSoft fill) + italic review in quotes
- Sticky footer: two pills - outline "Back" + primary "View deal summary"

## Business Rules

| Rule | Behavior |
|------|----------|
| Entry condition | Deal state = COMPLETED |
| Entry point | Tapping a `RATE NOW` card (COMPLETED state where viewer hasn't rated) |
| Rating window | 7 days from COMPLETED. After expiry, locks at current state (one-sided is fine). |
| State transitions | After rating: COMPLETED-{viewer}-rated. Both rated: RATED (terminal). |
| Re-entry guard | Once viewer has rated, card shows `AWAITING THEIR RATING` (not actionable). Resolver handles this. |
| Storefront display | Rating tile hidden until >= 3 reviews, shows "NEW" instead. (Out of scope) |
| Aggregate computation | Weighted moving average (recent weighted higher). Server-side. (Out of scope) |

## Open Questions - RESOLVED

| # | Question | Resolution |
|---|----------|------------|
| 1 | Mutual reveal trigger | Option (c): On next deal-card tap. Dashboard caption flips from `AWAITING THEIR RATING` to RATED, tapping surfaces Mutual Reveal. Push notifications deferred. |
| 2 | 7-day window expiry | Mock allows one-side-complete. Server-side cron for production is future concern. Document in code. |
| 3 | Re-entry to locked rating | Gated at entry point. Card no longer shows RATE NOW for users who have rated. No flow-level guard needed. |
| 4 | Star labels | Confirmed: Poor / Below average / OK / Great / Excellent |
| 5 | Tags + review storage | Mock: in-memory state. Types: `Rating` interface with extracted `wouldWorkAgain` boolean. |
| 6 | Storefront display | Out of scope. Tech Lead sketches aggregation hook point for future. |

## Integration with Deal-Card v0.8

- **Entry point**: Tapping a `RATE NOW` card (COMPLETED state where `getDealCaption(deal, viewer).actionable === true`)
- **Destination**: `rating` route from deal-card prototype
- **After rating**: Deal advances from COMPLETED-{either-rated-state} to COMPLETED-{viewer}-rated via `completedSubstate`
- **Both rated**: Deal advances to RATED. This flow is the only path to RATED.
- **Caption resolver**: `getDealCaption` already handles all COMPLETED sub-states. No changes needed.

## Out of Scope

1. Real Supabase backend for ratings (mock the service)
2. Storefront rating tile aggregation + "NEW" state
3. Weighted moving average computation
4. Push / in-app notifications for reveal trigger
5. Admin moderation flow for abusive content
6. Editing or appealing a submitted rating (by design)

## Success Metrics (Future)

- Rating submission rate (% of COMPLETED deals that reach RATED)
- Time to rate (hours from COMPLETED to first rating)
- "Would work again" prevalence (positive signal for matching)
- Review completion rate (% of ratings that include review text)

## Terminology

- **business / influencer**: Lowercase `ViewerRole` everywhere
- **counterparty**: The other party in the deal (business sees influencer, influencer sees business)
- **mutual reveal**: The moment both ratings become visible
