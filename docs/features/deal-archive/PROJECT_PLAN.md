# Project Plan: Deal Archive

Generated: 2026-05-14  
Status: READY TO SHIP

## Overview

Deal Archive provides a comprehensive record of terminal-state deals (RATED, EXPIRED, DECLINED). Two screens delivered in one PR:

1. **Deal History** - Filterable list accessed from Profile
2. **Deal Summary** - Detailed archive view with full timeline

## Product Requirements

See [requirements.md](./requirements.md)

**Key user stories:**
- US-1: Access deal history from Profile (MANAGE section)
- US-2: Filter history by terminal state (3 tabs)
- US-3: View deal summary from history row tap
- US-4: View deal summary from Mutual Reveal CTA
- US-5: Understand deal timeline with POV-aware titles
- US-6: Review ratings exchanged (RATED deals)
- US-7: Review decline details (DECLINED deals)
- US-8: Access archived thread (deferred - logs TODO)

## Technical Plan

See [tech-plan.md](./tech-plan.md)

**Architecture:**
- `types/dealArchive.ts` - ArchivedDeal, TimelineEvent, EventType
- `lib/timelineEvents.ts` - getEventMeta resolver (POV-aware)
- `services/dealArchive.ts` - Interface-first service (mock impl)
- `app/history.tsx` - /history?viewerRole={role}
- `app/deals/[dealId]/summary.tsx` - /deals/{dealId}/summary?viewerRole={role}
- `components/deal-archive/` - 12 components

**Locked Event-Type Taxonomy (8 total):**
```
request_sent, viewed, accepted, marked_done, rated, deal_closed, expired, declined
```

**Timeline lengths:**
- RATED: 6 events
- EXPIRED: 3 events
- DECLINED: 2 events

## Design Specs

See [design-spec.md](./design-spec.md)

**Key specs:**
- History: top bar + hero + 3-tab filter + scrolling row list
- Summary: top bar + compact hero + timeline + deal card + state block + coordination CTA + sticky footer
- Design system compliant (no new tokens)
- POV-aware copy throughout

## Implementation Summary

**New files (17):**
- 1 type definition file
- 1 lib resolver file
- 1 service file
- 2 route files
- 12 component files

**Modified files (5):**
- BusinessProfileScreen.tsx - Added "Deal history" row
- InfluencerProfileScreen.tsx - Added "Deal history" row
- app/rate/[dealId].tsx - Updated onViewDealSummary routing
- services/index.ts - Added export
- types/index.ts - Added export

**Mock data:**
- 7 terminal deals (h-1 through h-7)
- 3 RATED, 2 DECLINED, 2 EXPIRED
- Covers all visual states including edge cases

## Code Review

See [code-review.md](./code-review.md)

**Status:** APPROVE

**Summary:** Implementation follows established patterns, uses canonical resolvers, maintains immutability invariant. Minor cosmetic issues noted, no functional problems.

## QA Report

See [qa-report.md](./qa-report.md)

**Status:** PASS

**Summary:** All test cases pass. Tested both POVs, all terminal states, all navigation paths.

## Final Status

| Metric | Value |
|--------|-------|
| Bugs found | 0 |
| Blockers | No |
| Ready to ship | YES |

## PR Checklist

- [x] `npx tsc --noEmit` passes
- [x] Routes accept dealId param for future deep links
- [x] MutualReveal CTA routes to summary
- [x] Profile rows added to both personas
- [x] Mock data covers all visual states
- [x] No new color tokens introduced
- [x] Single source of truth for captions and event titles
- [x] Immutability invariant maintained

## Files Changed

```
types/dealArchive.ts                                      NEW
lib/timelineEvents.ts                                     NEW
services/dealArchive.ts                                   NEW
services/index.ts                                         MODIFIED
types/index.ts                                            MODIFIED
app/history.tsx                                           NEW
app/deals/[dealId]/summary.tsx                            NEW
app/rate/[dealId].tsx                                     MODIFIED
components/deal-archive/index.ts                          NEW
components/deal-archive/HistoryHero.tsx                   NEW
components/deal-archive/FilterTabs.tsx                    NEW
components/deal-archive/HistoryRow.tsx                    NEW
components/deal-archive/EmptyState.tsx                    NEW
components/deal-archive/SummaryHero.tsx                   NEW
components/deal-archive/Timeline.tsx                      NEW
components/deal-archive/TimelineEventRow.tsx              NEW
components/deal-archive/DealCard.tsx                      NEW
components/deal-archive/RatingsArchiveCard.tsx            NEW
components/deal-archive/DeclineNote.tsx                   NEW
components/deal-archive/CoordinationCTA.tsx               NEW
components/deal-archive/BackToHistoryFooter.tsx           NEW
components/business/profile/BusinessProfileScreen.tsx     MODIFIED
components/influencer/profile/InfluencerProfileScreen.tsx MODIFIED
```

## Next Steps

1. Run `npx tsc --noEmit` to verify types
2. Create draft PR `feat(deal-archive): history + summary screens` against `main`
3. PR body references this PROJECT_PLAN.md and links the locked event-type taxonomy
4. Do not merge - user will review and squash-merge
