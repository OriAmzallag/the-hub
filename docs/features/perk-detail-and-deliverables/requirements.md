# Perk Detail and Deliverables - Product Requirements

Generated: 2026-05-11
Status: APPROVED

## Summary

This feature bundles two related changes into a single PR:

**Change A: Perk Model Refactor**
- Replace flat `requiredAction` / `requiredPlatform` / `requiredFollowers` fields with a `deliverables: PerkDeliverable[]` array
- Each deliverable has its own platform, action, required followers, and optional description
- Qualification = viewer's reach meets the requirement on EVERY deliverable

**Change B: New Perk Detail Screen**
- Full perk view at `/perks/[id]` with three render states: qualified, below/partial, claimed
- Displays deliverables, business info, qualification status, claim flow

## PM Decisions

### Description Field Placement
**Decision: Option (a)** - Add `description?: string` to `PerkDeliverable` everywhere.

Rationale: Single source of truth. The mock file grows slightly but avoids dual-model complexity. The list screen ignores the field; the detail screen reads it.

### "Open inquiry" MVP Destination
**Decision**: Navigate to the **(influencer) inquiries tab** (`/(influencer)/inquiries`).

Rationale: No real backend exists yet, so creating a new thread is not possible. Routing to the inquiries list is a safe placeholder. Future iteration will create the actual thread and deep-link to `/inquiries/[threadId]`.

## User Stories

### Influencer Browsing Perks
- As an influencer, I want to see which platforms each perk requires so I can evaluate if I qualify
- As an influencer, I want to see my qualification status for each deliverable individually
- As an influencer, I want to understand why I don't qualify (partial match vs full below)

### Influencer Claiming Perks
- As an influencer, I want to view full perk details before deciding to claim
- As an influencer, I want to confirm my claim before it's submitted
- As an influencer, I want clear confirmation that my claim succeeded

## Scope

### In Scope
- Data model migration: `Perk` type with `deliverables[]` array
- Mock data updates for all 6 perks
- Updated qualification helpers (`qualifiesForPerk`, `getCardPlatformLine`, etc.)
- PerkCard updates to use new helpers
- New PerkDetail screen with all subcomponents
- ConfirmSheet with canonical modal pattern
- ClaimedSuccess state with animations
- Route at `/perks/[id]`

### Out of Scope
- Backend/Supabase integration (mock-first)
- Real inquiry thread creation
- Notification system
- Perk claiming API
