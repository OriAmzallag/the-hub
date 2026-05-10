# Inquiries Inbox Screen - Product Requirements
Generated: 2026-05-10
Role: PM

## Overview
The Inquiries Inbox is a unified conversation list screen where users see all their deal-related threads. This screen serves both Business (Business) and Influencer personas with identical structure but role-appropriate presentation (avatar types, status captions).

## User Story
**As a** Business user (Business)
**I want to** see all my deal conversations in one inbox
**So that I** can quickly identify which deals need my attention and respond efficiently

## Scope: This PR
- Business route mount only (`app/(business)/inquiries.tsx`)
- Shared, role-driven component architecture (zero refactor needed for future Influencer mount)
- Mock data (no Supabase integration)
- Read-only list (tapping a thread is out of scope; no navigation to thread detail)

## Out of Scope
- Influencer route mount (lands when `app/(influencer)/` tab structure exists)
- Real Supabase queries
- Opening a thread (thread detail screen / coordination screen)
- Message-send actions
- Push notifications
- Real-time updates

## Screen States

### 1. Content State (threads exist)
- **Pinned Section** ("Needs your attention"): Threads where `requiresAction(state, role) === true` OR `unread > 0`
- **Chronological Section** ("All inquiries"): Remaining threads (no action required AND no unreads)
- Section headers only appear when that section has items
- If only one bucket has items, show that bucket's appropriate header

### 2. Empty State (no threads at all)
- Persona-aware messaging
- Business: "Find someone to work with." + "Browse Discover" CTA
- Influencer (future): "Your first request is around the corner." + softer copy

### 3. No Results State (search active, zero matches)
- Shows "NO MATCHES" mono caption
- Display headline: "Nothing matched "{searchValue}"."

## Acceptance Criteria

### Top Bar
- [x] Title "Inquiries" (display 22 weight 700)
- [x] Right side shows "{N} unread" in mono accent when N > 0
- [x] Unread count = sum of all `thread.unread` values

### Search Bar
- [x] Pill-shaped input with magnifier icon
- [x] Placeholder: "Search by name..."
- [x] Border tint shifts to `borderStrong` when input has content
- [x] Filters both pinned and other sections by counterparty name (case-insensitive contains)

### Thread Row
- [x] Avatar: 44x44 rounded square (12px radius, NEVER circle)
  - Business view: photo avatar (counterparty is Influencer)
  - Influencer view: monogram avatar (counterparty is Business)
- [x] Name: display 14.5 weight 700, single line with ellipsis
- [x] Timestamp: mono 9px, inkMuted, right-aligned
- [x] Status caption: mono 9px uppercase, 0.18em tracking
  - Color from `getDealCaption(state, role, opts).tier` mapped to theme color
  - Weight 600 when accent tier, 500 when muted
- [x] Preview: body 12.5, inkMuted (or inkSubtle italic when null)
  - Weight 600 when unread > 0
  - Single line truncation
- [x] Unread badge: 18x18 circle, accent bg, mono number

### Section Headers
- [x] "Needs your attention" for pinned section
- [x] "All inquiries" for chronological section
- [x] Simple title-only variant (no count, no action link)

### Tab Bar
- [x] Inquiries tab shows unread badge matching total unread count

### Accessibility
- [x] Search input has accessible label
- [x] Thread row label includes name + status + unread state
- [x] Unread badge count is announced to screen readers

## Edge Cases

### No Threads
- Show EmptyState component with persona-aware copy

### Search Miss
- Show NoResultsState with the searched text echoed back
- Search clears -> both sections return

### Unread Badge Counts
- Top bar unread = sum of all threads' unread counts
- Tab bar badge = same value
- Per-thread badge shows that thread's unread count

### Pinned Ordering
For Business (Business) role, pinned threads are those where:
- `state === 'DELIVERED'` (review delivery)
- `state === 'COMPLETED' && businessRated === false` (rate now)
- `unread > 0` (any thread with unreads)

Note: PENDING is NOT pinned for Business - they're waiting passively on Influencer response.

### Thread Caption Resolution
All status captions MUST come from `getDealCaption(state, role, opts)` in `lib/dealLifecycle.ts`. No hardcoded status strings in components or mock data.

## Mock Data Requirements
4 threads matching the reference:
1. DELIVERED state, 1 unread (pins to attention via state + unread)
2. IN_PROGRESS state, 2 unreads (pins to attention via unread)
3. PENDING state, 0 unread (goes to "All inquiries" - Business waits passively)
4. COMPLETED unrated state, 0 unread (pins to attention via state)

## Success Metrics (Post-Launch)
- Thread tap-through rate
- Time to first action on attention-required threads
- Search usage rate
