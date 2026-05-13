# Deal Archive - Product Requirements

## Overview

Deal Archive provides a comprehensive record of terminal-state deals (RATED, EXPIRED, DECLINED). Two screens in one PR:

1. **Deal History**: Filterable list accessed from Profile
2. **Deal Summary**: Detailed archive view of a single deal with full timeline

## Why One PR

Both screens share the same data model (terminal-state deals + timeline events) and History tap routes to Summary. Splitting would mean double the mock-data wiring and a half-built Summary destination during PR-1 review.

## Entry Points

1. Profile -> "Deal history" row (MANAGE section)
2. History row tap -> Deal Summary
3. MutualReveal "View deal summary" CTA -> Deal Summary

## User Stories

### US-1: Access deal history from profile
As a business/influencer, I want to access my closed deals from Profile so I can review past collaborations.
- **Acceptance**: "Deal history" row in MANAGE section routes to `/history?viewerRole={role}`

### US-2: Filter history by terminal state
As a user, I want to filter closed deals by Completed/Declined/Expired so I can find specific outcomes.
- Three tabs with counts
- Completed = RATED state, Declined = DECLINED state, Expired = EXPIRED state

### US-3: View deal summary from history
As a user, I want to tap a history row to see the full deal record including timeline.
- Routes to `/deals/{dealId}/summary?viewerRole={role}`

### US-4: View deal summary from Mutual Reveal
As a user who just completed ratings, I want the "View deal summary" CTA to open the archive.
- MutualReveal's `onViewDealSummary` routes to summary screen

### US-5: Understand deal timeline
As a user, I want to see the complete chronological story of a deal with POV-aware titles.
- 8 event types: request_sent, viewed, accepted, marked_done, rated, deal_closed, expired, declined
- POV awareness: "You sent the request" vs "FitBar TLV sent the request"

### US-6: Review ratings exchanged (RATED deals)
As a user, I want to see both ratings in compact format on the deal summary.
- Stars, tags, optional review in smaller format than MutualReveal

### US-7: Review decline details (DECLINED deals)
As a user, I want to see the decline note and reason if provided.
- Falls back to "No note was added." if empty

### US-8: Access archived thread (read-only)
As a user, I want to tap "Open archived thread" to see the coordination messages.
- Deferred: logs TODO (same pattern as Rating Flow)

## Decisions

| Question | Decision |
|----------|----------|
| Profile section placement | MANAGE (deals are core workflow, not settings) |
| Tab order | Completed - Declined - Expired |
| History row date label | Raw dates ("MAY 3", "APR 30") |
| Timeline event data shape | `{ type, actor, date, time, detail? }` |
| Coordination thread archive | Log TODO on tap |
| Mock data IDs | Fresh h-1 through h-7 (no collision with rating service) |

## Scope Boundaries

### In Scope
- Deal History screen with 3 filter tabs
- Deal Summary screen with timeline, deal card, state-specific blocks
- Profile row integration (both personas)
- MutualReveal CTA update
- Mock service with 7 terminal deals

### Out of Scope (Explicit)
- Re-contact CTA (v2)
- Dispute, report, share, export, delete actions
- Edit affordances of any kind
- Real archived-thread view (TODO placeholder)
- Real Supabase backend (mock service, swap-ready interface)
- Notification deep links (route accepts dealId for future)

## Invariants

- **Immutability**: Terminal deals never change. No edit/mutate paths anywhere.
- **POV Awareness**: All event titles, decline-note labels, and explanatory copy adapt to viewer role.
- **Single Source of Truth**: State captions from `getDealCaption`, event titles from `getEventMeta`.
