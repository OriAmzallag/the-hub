# Product Requirements: Influencer Inquiries

**Feature**: Influencer Inquiries  
**Date**: 2026-05-14  
**Status**: APPROVED

## Overview

Wire the shared Inquiries inbox surface for the influencer persona. The screen component already exists and is role-agnostic; this feature adds the influencer route and mock data.

## User Story

As Maya (influencer), I want to see my inbox of booking requests from businesses so I can respond to pending deals, track active work, and rate completed collaborations.

## Scope

### In Scope

1. **Mock data file**: `constants/mockInfluencerInquiries.ts` with influencer-side threads
2. **Route implementation**: Replace stub at `app/(influencer)/inquiries.tsx` with real route
3. **Module rename**: Move `components/business/inquiries/` to `components/inquiries/` for clarity

### Out of Scope

- UI changes to InquiriesScreen
- Supabase backend integration
- Push notifications
- Changes to business inquiries route (except import path)

## Requirements

### R1: Mock Data Fixtures

Cover all v0.8 caption combinations for the influencer side:

| State | SubState | What Maya Sees | Pinned? |
|-------|----------|----------------|---------|
| PENDING | - | "RESPOND BY {N}H" | Yes (requiresAction) |
| IN_PROGRESS | - | "IN PROGRESS" | No (unless unread > 0) |
| COMPLETED | neither-rated | "RATE NOW" | Yes (requiresAction) |
| COMPLETED | influencer-rated | "AWAITING THEIR RATING" | No |
| COMPLETED | - | (unread messages) | Yes (unread > 0) |

### R2: Counterparty Data

- Counterparties are businesses
- Each has `{ name, monogram }` with NO `photo`
- Avatar renders monogram tile path (data-driven, no role branching)
- Use business names from Maya's mock data: Bellboy, FitBar TLV, Sushi Bar, BeautyBar, Studio Movement, Onza

### R3: Route Implementation

- Mirror `app/(business)/inquiries.tsx` exactly
- Pass `viewerRole='influencer'` and influencer mock data
- Remove the demo CTA stub

### R4: Module Rename

- Move `components/business/inquiries/` to `components/inquiries/`
- Update import in `app/(business)/inquiries.tsx`
- Update import in `app/(influencer)/inquiries.tsx`

### R5: EmptyState Behavior

The EmptyState component already handles influencer role:
- Headline: "Your first request is around the corner."
- Body: "When a business sends you a request, it will appear here."
- No CTA button (influencers don't initiate)

No changes needed.

## Decisions

| Question | Decision |
|----------|----------|
| Module rename in this PR? | YES - cleaner single source of truth |
| Influencer EmptyState copy? | Already implemented correctly |
| Drop demo CTA? | YES - real screen renders inquiries |

## Success Criteria

1. `npx tsc --noEmit` passes
2. Influencer inquiries tab shows real inbox with mock data
3. Monogram avatars render for business counterparties
4. Captions match v0.8 resolver output
5. Module lives at `components/inquiries/` (no persona prefix)
