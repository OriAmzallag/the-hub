# Deal Card v0.8 — Product Requirements

**Author**: PM Agent  
**Date**: 2026-05-13  
**Status**: APPROVED  

---

## 1. Overview

Adopt the v0.8 deal lifecycle across the app. This is a **cards-only** scope — the dashboard structure (Earnings hero, Quick Actions, Stats grid, section ordering) remains unchanged. Only the deal lifecycle source-of-truth, mock data, and deal card visuals are updated.

### 1.1 What Changes

| Layer | Change |
|-------|--------|
| Lifecycle (`lib/dealLifecycle.ts`) | Drop DELIVERED state, adopt v0.8 caption enum with 4 active + 2 terminal states |
| Types | New `CaptionTone`, lowercase `ViewerRole`, `CompletedSubstate` union, `actionable` boolean |
| Mock data | Recast DELIVERED fixtures to COMPLETED sub-states; add all 3 sub-state fixtures |
| DealRow (Business) | Match prototype visual recipe (38x38 avatar, mono caption, actionable card fill) |
| InfluencerDealRow | Same visual updates, plus use lifecycle resolver instead of pre-rendered labels |
| AttentionBanner (Business) | Remove DELIVERED-specific Package icon badge |
| InfluencerAttentionItem | Update to use lifecycle resolver for subtitle |

### 1.2 What Stays

- Top bar (greeting + name)
- Earnings hero (influencer) / TopBar with stats (business)
- "Needs your attention" section ordering
- "Active deals" section ordering
- Quick Actions section
- Active Claims (influencer)
- Overview / Stats grid
- All current routing and onPress handlers

---

## 2. v0.8 Lifecycle Spec

### 2.1 State Machine

```
Active:   PENDING -> IN_PROGRESS -> COMPLETED -> RATED
Terminal: EXPIRED, DECLINED
```

**Removed**: `DELIVERED` (previously between IN_PROGRESS and COMPLETED)

### 2.2 Caption Table (Single Source of Truth)

| State | Sub-state | Business sees | Influencer sees | Tone | Actionable |
|-------|-----------|---------------|-----------------|------|------------|
| PENDING | — | `RESPOND BY {N}H` | `AWAITING RESPONSE` | accent / muted | yes / no |
| IN_PROGRESS | — | `IN PROGRESS` | `IN PROGRESS` | muted | no |
| COMPLETED | neither-rated | `RATE NOW` | `RATE NOW` | accent | yes |
| COMPLETED | business-rated | `AWAITING THEIR RATING` | `RATE NOW` | muted / accent | no / yes |
| COMPLETED | influencer-rated | `RATE NOW` | `AWAITING THEIR RATING` | accent / muted | yes / no |
| RATED | — | `RATED * {N}` | `RATED * {N}` | muted | no |
| EXPIRED | — | `EXPIRED` | `EXPIRED` | decline | no |
| DECLINED | — | `DECLINED` | `DECLINED . {REASON}` | decline | no |

**Variables**:
- `{N}H` — hours remaining for business to respond (1-72, always hours)
- `{N}` in `RATED * {N}` — the rating *you received* (1.0-5.0)
- `{REASON}` — uppercase canonical: `BRIEF OUTSIDE SCOPE` / `WRONG FIT` / `TOO SHORT NOTICE` / `FULLY BOOKED` / `OTHER`

### 2.3 Actionable Captions (Only Two)

| Caption | Hint |
|---------|------|
| `RESPOND BY {N}H` | `Tap to respond` |
| `RATE NOW` | `Tap to rate` |

---

## 3. Open Questions — Resolved

### Q1: Destination routing in scope?

**Answer**: NO. Cards-only scope means existing onPress handlers stay unchanged. The resolver returns the minimum v0.8 contract:

```ts
interface Caption {
  text: string;
  tone: CaptionTone;
  actionable: boolean;
}
```

A separate `getCaptionHint(caption: Caption): string | null` helper provides the hint text. Destination routing (`destination`, `destinationLabel`) is deferred to a future PR.

### Q2: COMPLETED sub-state default?

**Answer**: When `completedSubstate` is undefined/missing, default to `"neither-rated"`. Both parties need to rate.

### Q3: Backwards compatibility?

**Answer**: No production data exists yet. No migration needed. Confirmed.

### Q4: `requiresAction` helper behavior?

**Answer**: Update to match the new actionable logic:

| State | Business | Influencer |
|-------|----------|------------|
| PENDING | YES (must respond within countdown) | NO (awaiting response) |
| IN_PROGRESS | NO | NO |
| COMPLETED (not rated by viewer) | YES | YES |
| COMPLETED (already rated by viewer) | NO | NO |
| RATED | NO | NO |
| EXPIRED | NO | NO |
| DECLINED | NO | NO |

**Note**: This is a behavior change from the current implementation where PENDING was actionable for Influencer, not Business. The v0.8 spec flips this: Business receives incoming requests from Influencers and must respond within the countdown window.

---

## 4. User Stories

### US-1: Business views deal cards with v0.8 captions

**As a** Business user  
**I want** to see deal cards with the correct v0.8 status captions  
**So that** I know which deals need my attention

**Acceptance Criteria**:
- PENDING deals show `RESPOND BY {N}H` in accent with "Tap to respond" hint
- IN_PROGRESS deals show `IN PROGRESS` in muted
- COMPLETED deals show `RATE NOW` or `AWAITING THEIR RATING` based on who has rated
- RATED deals show `RATED * {N}` with the rating I received
- EXPIRED deals show `EXPIRED` in decline tone
- DECLINED deals show `DECLINED` in decline tone
- Card background is accentSoft+accentBorder when actionable, surface+border when passive

### US-2: Influencer views deal cards with v0.8 captions

**As an** Influencer user  
**I want** to see deal cards with the correct v0.8 status captions  
**So that** I know which deals need my attention

**Acceptance Criteria**:
- PENDING deals show `AWAITING RESPONSE` in muted (no action needed)
- IN_PROGRESS deals show `IN PROGRESS` in muted
- COMPLETED deals show `RATE NOW` or `AWAITING THEIR RATING` based on who has rated
- RATED deals show `RATED * {N}` with the rating I received
- EXPIRED deals show `EXPIRED` in decline tone
- DECLINED deals show `DECLINED . {REASON}` in decline tone with the canonical reason
- Card background is accentSoft+accentBorder when actionable, surface+border when passive

### US-3: Attention items derive caption from lifecycle resolver

**As a** user (Business or Influencer)  
**I want** attention items to use the canonical lifecycle resolver  
**So that** captions are consistent across all surfaces

**Acceptance Criteria**:
- Business AttentionBanner uses getDealCaption with v0.8 states
- Influencer InfluencerAttentionItem uses getDealCaption with v0.8 states
- DELIVERED-specific Package icon badge is removed from Business AttentionBanner

---

## 5. Out of Scope

1. **Dashboard restructure** — Earnings hero, Quick Actions, Stats stay unchanged
2. **Coordination Thread system messages** — Transition-event enum is a separate future PR
3. **Real backend integration** — Supabase wiring is future work
4. **Tappable cards demo screen** — Prototype's destination-stub UI is for spec illustration only
5. **New rating flow surface** — Future PR
6. **New incoming-request surface** — Future PR (likely exists already, no changes here)

---

## 6. Success Metrics

- `npx tsc --noEmit` passes
- All 4 active states + 2 terminal states have mock data coverage
- All 3 COMPLETED sub-states have mock data coverage
- DealRow visual matches prototype exactly (38x38 avatar, mono caption, card fill logic)
- No DELIVERED references remain in lifecycle code or mock data

---

## 7. Dependencies

- `references/deal-card.reference.jsx` — Canonical visual reference
- `constants/theme.ts` — Design tokens (accent, muted, decline tones)
- Existing dashboard screens and routing remain unchanged
