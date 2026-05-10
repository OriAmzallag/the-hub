# Requirements: Canonical Deal Lifecycle

**Feature:** dashboard-attention-header (Phase 2 - Deal Lifecycle)
**Author:** PM Agent
**Date:** 2026-05-10

---

## Overview

Implement a canonical deal lifecycle system that provides a single source of truth for deal states, captions, and color tiers. This replaces the ad-hoc legacy fields (`status`, `statusLabel`, `statusAccent`) with a structured state machine and resolver functions.

---

## User Stories

### US-1: As a Business user, I see deal status captions that reflect the current lifecycle state
**Given** I am viewing my dashboard
**When** I look at any deal in my Active Deals section
**Then** I see a caption (e.g., "WAITING - 47H LEFT", "IN PROGRESS", "REVIEW DELIVERY", "RATE NOW") that accurately reflects the deal's state

### US-2: As a Business user, I see color-coded status indicators
**Given** I am viewing deal statuses
**When** a deal requires my action (PENDING, DELIVERED, or unrated COMPLETED)
**Then** the status is displayed in accent color (orange)
**And** when no action is required, the status is displayed in muted color

### US-3: As a Business user, terminal-state deals appear with appropriate styling
**Given** a deal has expired or been declined
**When** I view my dashboard
**Then** I see those deals with subtle (dimmed) styling
**And** RATED deals are NOT shown (filtered to future History view)

### US-4: As a Business user, the Active Deals count is accurate
**Given** I have deals in various states including terminal states
**When** I view the "Active deals" section header
**Then** the count badge reflects only the deals visible in the list (filtered count)

---

## Functional Requirements

### FR-1: Deal State Machine
The system SHALL support exactly 7 deal states:
- **Active states (5):** PENDING, IN_PROGRESS, DELIVERED, COMPLETED, RATED
- **Terminal states (3):** RATED, EXPIRED, DECLINED

Note: RATED is both "active" in the sense of being reachable from COMPLETED, and "terminal" in that it ends the lifecycle.

### FR-2: State Transitions
| From | To | Trigger |
|------|-----|---------|
| (new) | PENDING | Booking submitted |
| PENDING | IN_PROGRESS | Talent accepts |
| PENDING | EXPIRED | 72h timeout |
| PENDING | DECLINED | Talent declines |
| IN_PROGRESS | DELIVERED | Talent marks delivered |
| DELIVERED | COMPLETED | Hunter confirms delivery |
| COMPLETED | RATED | Both parties rated |

### FR-3: Caption Resolution
The system SHALL provide a `getDealCaption(state, viewerRole, opts)` function that returns the correct caption text and color tier per the following table:

| State | Business Caption | Business Tier | Talent Caption | Talent Tier |
|-------|------------------|---------------|----------------|-------------|
| PENDING | WAITING - {N}H LEFT | accent | RESPOND - {N}H LEFT | accent |
| IN_PROGRESS | IN PROGRESS | inkMuted | IN PROGRESS | inkMuted |
| DELIVERED | REVIEW DELIVERY | accent | AWAITING REVIEW | inkMuted |
| COMPLETED (unrated) | RATE NOW | accent | RATE NOW | accent |
| COMPLETED (rated) | COMPLETE | inkMuted | COMPLETE | inkMuted |
| EXPIRED | EXPIRED | inkSubtle | (hidden) | - |
| DECLINED | DECLINED | inkSubtle | (hidden) | - |
| RATED | (hidden) | - | (hidden) | - |

### FR-4: Dashboard Filtering
The system SHALL provide an `isActiveOnDashboard(state, viewerRole)` function:
- Returns `false` for RATED (both roles)
- Returns `true` for EXPIRED/DECLINED only for BUSINESS role
- Returns `true` for all other states for both roles

### FR-5: Mock Data Coverage
The mock data SHALL include at least one deal in each of:
- PENDING (with hoursLeft value)
- IN_PROGRESS
- DELIVERED
- COMPLETED (with hunterRated: false to show "RATE NOW")
- EXPIRED
- DECLINED

---

## Non-Functional Requirements

### NFR-1: Type Safety
All deal state handling SHALL use TypeScript union types with exhaustive checking.

### NFR-2: Single Source of Truth
The `lib/dealLifecycle.ts` module SHALL be the ONLY place where deal states and caption logic are defined of the types/business.ts file is the only one that has type of state.

### NFR-3: Future Compatibility
The resolver SHALL support Talent role captions even though Talent Dashboard is not yet implemented.

---

## Acceptance Criteria

| # | Criterion | Status |
|---|-----------|--------|
| AC-1 | `lib/dealLifecycle.ts` exports `DealState`, `TERMINAL_STATES`, `isActiveOnDashboard`, `getDealCaption` | TODO |
| AC-2 | `types/business.ts` uses `state: DealState` instead of legacy fields | TODO |
| AC-3 | `mockBusinessDashboard.ts` has deals covering all 5 active + terminal states | TODO |
| AC-4 | `DealRow.tsx` calls `getDealCaption()` for status text and color | TODO |
| AC-5 | `app/(business)/index.tsx` filters deals using `isActiveOnDashboard()` | TODO |
| AC-6 | Mock data includes at least one `DELIVERED` deal | TODO |
| AC-7 | Active deals count matches filtered (visible) count | TODO |
| AC-8 | "Needs your attention" section has correct header | DONE (commit b84b472) |
| AC-9 | `npx tsc --noEmit` passes cleanly | TODO |
| AC-10 | No hardcoded status strings remain outside `dealLifecycle.ts` and mock data | TODO |

---

## Out of Scope (Future PRs)

- Coordination Thread surface
- Inquiries inbox
- History view (where RATED deals will appear)
- Talent Dashboard implementation
- Actual state transitions (backend logic)
- Countdown timer implementation (hoursLeft is static mock data)

---

## Dependencies

- Existing theme tokens: `colors.accent`, `colors.inkMuted`, `colors.inkSubtle` (verified present)
- Existing `Deal` interface in `types/business.ts` (to be migrated)
