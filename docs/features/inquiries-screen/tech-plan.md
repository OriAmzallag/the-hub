# Inquiries Inbox Screen - Technical Plan
Generated: 2026-05-10
Role: Tech Lead

## Architecture Overview

This screen follows the existing role-driven pattern: one shared component (`InquiriesScreen`) that accepts `viewerRole` and renders appropriately. Business and Influencer mounts pass different roles but share 100% of the UI code.

## File-by-File Plan

### 1. `lib/dealLifecycle.ts` (MODIFY)
Add `requiresAction` helper to determine if a user must act on a deal.

```typescript
/**
 * Determines if the viewer needs to take action on this deal state.
 *
 * BUSINESS role:
 *   - DELIVERED: true (review delivery)
 *   - COMPLETED + businessRated === false: true (rate now)
 *   - All others: false (PENDING = waiting passively)
 *
 * INFLUENCER role:
 *   - PENDING: true (respond to request)
 *   - COMPLETED + influencerRated === false: true (rate now)
 *   - All others: false
 */
export function requiresAction(
  state: DealState,
  viewerRole: ViewerRole,
  opts: CaptionOptions = {}
): boolean;
```

### 2. `types/inquiry.ts` (CREATE)

```typescript
import type { DealState } from '@/lib/dealLifecycle';

/**
 * Counterparty in a thread.
 * Business view: Influencer counterparty has photo
 * Influencer view: Business counterparty has monogram
 */
export interface Counterparty {
  name: string;
  photo?: string;        // URL for Influencer counterparty
  monogram?: string;     // 2-char for Business counterparty
}

/**
 * Single thread in the inbox.
 * State-driven: caption resolved at render time via getDealCaption.
 */
export interface Thread {
  id: string;
  counterparty: Counterparty;
  state: DealState;
  hoursLeft?: number;           // For PENDING countdown
  businessRated?: boolean;      // For COMPLETED rating state
  influencerRated?: boolean;        // For COMPLETED rating state
  lastMessage: string | null;   // null = no messages yet
  lastMessageBy: 'me' | 'them' | null;
  timestamp: string;            // "2h ago", "11:42", "Yesterday"
  unread: number;
}

/**
 * Props for the shared InquiriesScreen component.
 */
export interface InquiriesScreenProps {
  viewerRole: 'BUSINESS' | 'INFLUENCER';
  threads: Thread[];
  unreadTotal: number;
}
```

### 3. `constants/mockBusinessInquiries.ts` (CREATE)

4 mock threads matching the reference, with state-driven data (NOT pre-rendered captions):

```typescript
export const MOCK_BUSINESS_THREADS: Thread[] = [
  {
    id: 'h-thr-1',
    counterparty: { name: 'Yael Mizrahi', photo: '...' },
    state: 'DELIVERED',
    lastMessage: 'Final cut delivered, hope you love it!',
    lastMessageBy: 'them',
    timestamp: '2h ago',
    unread: 1,
  },
  {
    id: 'h-thr-2',
    counterparty: { name: 'Maya Cohen', photo: '...' },
    state: 'IN_PROGRESS',
    lastMessage: 'Got the brief, looking forward to filming!',
    lastMessageBy: 'them',
    timestamp: '11:42',
    unread: 2,
  },
  {
    id: 'h-thr-3',
    counterparty: { name: 'Noa Berman', photo: '...' },
    state: 'PENDING',
    hoursLeft: 47,
    lastMessage: null,
    lastMessageBy: null,
    timestamp: 'Yesterday',
    unread: 0,
  },
  {
    id: 'h-thr-4',
    counterparty: { name: 'Daniel Levi', photo: '...' },
    state: 'COMPLETED',
    businessRated: false,
    influencerRated: true,
    lastMessage: 'Thanks for working with us!',
    lastMessageBy: 'them',
    timestamp: '3d ago',
    unread: 0,
  },
];
```

### 4. `components/business/inquiries/` (CREATE directory)

#### `index.ts` - Barrel export
```typescript
export { InquiriesScreen } from './InquiriesScreen';
```

#### `InquiriesScreen.tsx` - Main shared component
Props: `{ viewerRole, threads, unreadTotal }`

Responsibilities:
- Hold search state
- Compute filtered threads (by name match)
- Compute pinned vs other buckets
- Render appropriate body state (empty / no-results / content)
- fadeUp animation on state change

#### `TopBar.tsx`
Props: `{ unreadCount: number }`
- Title "Inquiries" (typography.sectionTitle)
- "{N} unread" mono accent caption (right side, only if N > 0)

#### `SearchBar.tsx`
Props: `{ value: string; onChangeText: (v: string) => void }`
- Controlled pill input
- Magnifier icon (14px)
- Border tint logic: `border` when empty, `borderStrong` when has content

#### `SectionHeader.tsx`
Decision: Create a local simple variant rather than overloading the existing `components/business/SectionHeader.tsx`. The existing one has count + actionLabel + onAction props that are irrelevant here. A 15-line local component is cleaner than conditional prop gymnastics.

Props: `{ title: string }`
- Display 17 weight 700, -0.03em tracking
- Padding and margin per spec

#### `ThreadRow.tsx`
Props: `{ thread: Thread; viewerRole: ViewerRole }`

Renders:
- Avatar component (photo or monogram based on counterparty data)
- Name + timestamp row
- Status caption (from `getDealCaption`)
- Preview + unread badge row

Status caption color mapping:
```typescript
const statusColor = colors[caption.tier]; // 'accent' | 'inkMuted' | 'inkSubtle'
```

#### `Avatar.tsx`
Props: `{ counterparty: Counterparty; size?: number }`
Default size: 44

Dispatcher component:
- If `counterparty.photo` exists: render Image with rounded square
- If `counterparty.monogram` exists: render View with surfaceAlt bg + mono text

Both variants: 44x44, borderRadius: radii.avatar (12px)

#### `EmptyState.tsx`
Props: `{ viewerRole: ViewerRole }`

Persona-aware:
- BUSINESS: "Find someone to work with." + "Browse Discover" CTA button
- INFLUENCER: "Your first request is around the corner." + softer copy (no prominent CTA)

Structure:
- 60x60 surface tile with MessageSquare icon
- Mono "NO INQUIRIES YET" caption
- Display headline (26 weight 800)
- Body copy
- Optional CTA pill

#### `NoResultsState.tsx`
Props: `{ searchValue: string }`

Structure:
- Mono "NO MATCHES" caption
- Display headline: `Nothing matched "{searchValue}".`

### 5. `app/(business)/inquiries.tsx` (REPLACE placeholder)

Responsibilities:
- Import mock data
- Hold local state: `searchValue`, `threads` (derived from mock)
- Compute `unreadTotal` = sum of `thread.unread`
- Compute `pinnedThreads` = threads.filter(t => requiresAction(state, role, opts) || t.unread > 0)
- Compute `otherThreads` = threads.filter(t => !requiresAction(state, role, opts) && t.unread === 0)
- Apply search filter to both buckets
- Pass to `<InquiriesScreen viewerRole="BUSINESS" ... />`

## Search Algorithm
Client-side, case-insensitive contains:
```typescript
const filtered = threads.filter(t =>
  t.counterparty.name.toLowerCase().includes(searchValue.toLowerCase())
);
```

Apply to raw threads before computing pinned/other.

## `requiresAction` Logic

```typescript
export function requiresAction(
  state: DealState,
  viewerRole: ViewerRole,
  opts: CaptionOptions = {}
): boolean {
  const { businessRated = false, influencerRated = false } = opts;

  if (viewerRole === 'BUSINESS') {
    if (state === 'DELIVERED') return true;
    if (state === 'COMPLETED' && !businessRated) return true;
    return false;
  }

  // INFLUENCER
  if (state === 'PENDING') return true;
  if (state === 'COMPLETED' && !influencerRated) return true;
  return false;
}
```

## Pinning Rule Summary

| State | Business Pins? | Influencer Pins? |
|-------|---------------|--------------|
| PENDING | No (waiting) | Yes (respond) |
| IN_PROGRESS | No | No |
| DELIVERED | Yes (review) | No (awaiting) |
| COMPLETED unrated | Yes (rate now) | Yes (rate now) |
| COMPLETED rated | No | No |
| + unread > 0 | Yes | Yes |

## Animation
FadeUp on body content: 400ms ease-out, opacity 0->1, translateY 8->0

Use Reanimated `FadeInUp.duration(400).easing(Easing.out(Easing.ease))`

## Tab Bar Badge
The `CustomTabBar` currently has hardcoded `badge: 1` for inquiries. The implementation should update this to read from a shared state or context. For this PR (mock data phase), we can:
1. Keep the hardcoded badge as a known limitation, OR
2. Pass the unread count through React context

Recommendation: Keep hardcoded for now, document as follow-up when real data lands.

## TypeScript Considerations
- All components must be fully typed
- Export types from `types/inquiry.ts`
- Ensure `npx tsc --noEmit` passes

## Testing Checklist
- 4 threads render with correct captions
- Pinned: DELIVERED (1), IN_PROGRESS with unread (1), COMPLETED unrated (1) = 3 threads
- Other: PENDING (1) = 1 thread
- Search "may" -> only Maya shows
- Search "xyz" -> NoResultsState
- Clear search -> sections return
- Empty state shows when no threads (test with empty array)
