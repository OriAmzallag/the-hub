# Deal Archive - Technical Plan

## Architecture Overview

The Deal Archive feature follows the established patterns from Rating Flow:
- Interface-first service design (mock now, Supabase later)
- Shared routes outside persona groups
- Single source of truth resolvers for display logic

## File Structure

```
types/
  dealArchive.ts          # ArchivedDeal, TimelineEvent, EventType

services/
  dealArchive.ts          # DealArchiveService interface + mock impl

lib/
  timelineEvents.ts       # getEventMeta(event, deal, viewerRole) resolver

app/
  history.tsx             # /history?viewerRole={role}
  deals/
    [dealId]/
      summary.tsx         # /deals/{dealId}/summary?viewerRole={role}

components/
  deal-archive/
    index.ts
    HistoryHero.tsx
    FilterTabs.tsx
    HistoryRow.tsx
    EmptyState.tsx
    SummaryHero.tsx
    Timeline.tsx
    TimelineEventRow.tsx
    DealCard.tsx
    RatingsArchiveCard.tsx
    DeclineNote.tsx
    CoordinationCTA.tsx
    BackToHistoryFooter.tsx
```

## Type Definitions

### EventType (Locked Taxonomy)
```typescript
export type EventType =
  | 'request_sent'
  | 'viewed'
  | 'accepted'
  | 'marked_done'
  | 'rated'
  | 'deal_closed'
  | 'expired'
  | 'declined';
```

### TimelineEvent
```typescript
export interface TimelineEvent {
  id: string;
  type: EventType;
  actor: 'business' | 'influencer' | 'system';
  date: string;      // "APR 28"
  time: string;      // "14:22"
  detail?: string;   // Optional body line
}
```

### ArchivedDeal
```typescript
export interface ArchivedDeal {
  id: string;
  state: TerminalState;
  business: { id, name, firstName, monogram };
  influencer: { id, name, firstName, photo };
  services: string[];
  serviceSummary: string;
  money: number;
  timeline: TimelineEvent[];
  ratings?: { business: Rating; influencer: Rating };
  declineReason?: DeclineReason;
  declineNote?: string;
  messageCount: number;
  terminalDate: string;
}
```

## Service Interface

```typescript
export interface DealArchiveService {
  getHistory(viewerId, viewerRole, tab): Promise<ArchivedDeal[]>;
  getHistoryCounts(viewerId, viewerRole): Promise<HistoryCounts>;
  getDeal(dealId, viewerRole): Promise<ArchivedDeal>;
}
```

## Timeline Lengths by State

| State | Events |
|-------|--------|
| RATED | 6 (request_sent -> accepted -> marked_done -> rated (x2) -> deal_closed) |
| EXPIRED | 3 (request_sent -> viewed -> expired) |
| DECLINED | 2 (request_sent -> declined) |

## Event Meta Resolver

Single source of truth: `lib/timelineEvents.ts`

```typescript
export function getEventMeta(
  event: TimelineEvent,
  deal: ArchivedDeal,
  viewerRole: ViewerRole
): EventMeta {
  // Returns { Icon, iconProps, title, tone }
  // Title is POV-aware via youOrThem() helper
}
```

## Route Structure

Both routes are shared (outside persona groups), same pattern as `/rate/[dealId]`:

- `/history?viewerRole={role}` - Deal History list
- `/deals/[dealId]/summary?viewerRole={role}` - Deal Summary archive

The `viewerRole` query param enables testing both POVs against the same mock service.

## Profile Integration

Added "Deal history" `ProfileRow` to MANAGE section in:
- `BusinessProfileScreen.tsx`
- `InfluencerProfileScreen.tsx`

Uses Clock icon, routes with appropriate viewerRole.

## MutualReveal Update

Updated `handleViewDealSummary` in `/rate/[dealId].tsx` to route to:
```typescript
router.push({
  pathname: '/deals/[dealId]/summary',
  params: { dealId, viewerRole: viewer.role },
});
```

## Mock Data

7 terminal deals covering all visual states:

| ID | State | Features |
|----|-------|----------|
| h-1 | RATED | 5/5 mutual, written reviews, 12 messages |
| h-2 | RATED | 4 from business, 5 from influencer, 8 messages |
| h-3 | RATED | 5 from business, 4 from influencer, 5 messages |
| h-4 | DECLINED | With note, FULLY BOOKED reason |
| h-5 | DECLINED | No note (exercises fallback), WRONG FIT reason |
| h-6 | EXPIRED | Viewed but not responded |
| h-7 | EXPIRED | Same pattern |

## Design System Compliance

Using only existing tokens:
- `colors.accent`, `colors.accentSoft`, `colors.accentBorder`
- `colors.decline`, `colors.declineSoft`, `colors.declineBorder`
- `colors.ink`, `colors.inkMuted`, `colors.inkSubtle`
- `colors.surface`, `colors.surfaceAlt`, `colors.bg`
- `colors.border`, `colors.borderStrong`
- `colors.bgOverlay94`

No new tokens introduced.
