# Notifications Feature - Technical Plan

**Author:** Tech Lead Agent  
**Date:** 2025-05-18  
**Status:** APPROVED

---

## Architecture Overview

The notifications feature follows the established `dealStore` pattern: module-level state with `useSyncExternalStore` for reactive updates across components. Notifications are derived from existing data sources (deals, ratings, threads) rather than stored as a separate entity.

---

## Data Model

### Notification Type

```typescript
// types/notification.ts

import type { ViewerRole } from '@/lib/dealLifecycle';

export type NotificationType =
  | 'deal_accepted'
  | 'deal_expired'
  | 'deal_declined'
  | 'marked_done'
  | 'rating_received'
  | 'mutual_reveal'
  | 'perk_claimed'
  | 'new_message';

export interface Notification {
  id: string;
  type: NotificationType;
  /** Primary text shown in the notification row */
  title: string;
  /** Counterparty name for routing context */
  counterpartyName: string;
  /** Counterparty photo URL (influencer) or monogram (business) */
  avatar: { type: 'photo'; url: string } | { type: 'monogram'; text: string };
  /** ISO timestamp for sorting and display */
  timestamp: string;
  /** Relative display label (e.g., "2h ago", "Yesterday") */
  timestampLabel: string;
  /** Read state (in-memory for v1) */
  read: boolean;
  /** Route params for tap action */
  route: NotificationRoute;
}

export type NotificationRoute =
  | { type: 'thread'; threadId: string; viewerRole: ViewerRole }
  | { type: 'rate'; dealId: string; viewerRole: ViewerRole }
  | { type: 'reveal'; dealId: string; viewerRole: ViewerRole }
  | { type: 'perk'; perkId: string };
```

---

## Store Architecture

### File: `lib/notifications.ts`

Mirrors `lib/dealStore.ts` exactly:

```typescript
/**
 * Notifications Store
 *
 * Module-level mutable store + pub-sub so all screens share the same
 * notification state. Bell badge and notifications screen both subscribe.
 *
 * v1: In-memory only. Resets on app restart.
 * v2: AsyncStorage persistence.
 */

import { useSyncExternalStore } from 'react';
import type { Notification, NotificationType, NotificationRoute } from '@/types/notification';
import type { ViewerRole } from '@/lib/dealLifecycle';

// Module-level state
let notifications: readonly Notification[] = [];
const listeners = new Set<() => void>();

function notify(): void {
  for (const listener of listeners) listener();
}

// Subscribe primitive
export function subscribe(listener: () => void): () => void {
  listeners.add(listener);
  return () => listeners.delete(listener);
}

// Snapshot accessors
export function getNotificationsSnapshot(): readonly Notification[] {
  return notifications;
}

export function getUnreadCount(): number {
  return notifications.filter((n) => !n.read).length;
}

// Mutations
export function addNotification(notification: Notification): void {
  // Prepend (newest first), enforce max 50
  notifications = [notification, ...notifications].slice(0, 50);
  notify();
}

export function markAsRead(notificationId: string): void {
  let mutated = false;
  const next = notifications.map((n) => {
    if (n.id !== notificationId || n.read) return n;
    mutated = true;
    return { ...n, read: true };
  });
  if (mutated) {
    notifications = next;
    notify();
  }
}

export function markAllAsRead(): void {
  const hasUnread = notifications.some((n) => !n.read);
  if (!hasUnread) return;
  notifications = notifications.map((n) => ({ ...n, read: true }));
  notify();
}

// React hooks
export function useNotifications(): readonly Notification[] {
  return useSyncExternalStore(subscribe, getNotificationsSnapshot, getNotificationsSnapshot);
}

export function useUnreadCount(): number {
  return useSyncExternalStore(
    subscribe,
    getUnreadCount,
    getUnreadCount
  );
}

// Seed initial notifications from existing data sources
export function seedNotifications(viewerRole: ViewerRole): void {
  // Implementation pulls from dealStore, mockThread, ratings service
  // See implementation section below
}
```

---

## Component Architecture

### New Components (3 total)

| Component | File | Responsibility |
|-----------|------|----------------|
| `NotificationBell` | `components/ui/NotificationBell.tsx` | Bell icon + badge, handles navigation |
| `NotificationRow` | `components/notifications/NotificationRow.tsx` | Single notification item |
| `NotificationsScreen` | `app/notifications.tsx` | Full-screen feed |

### Reused Components

| Component | From | Usage |
|-----------|------|-------|
| `ScreenHeader` | `components/ui/ScreenHeader.tsx` | Notifications screen header |
| `Avatar` | `components/inquiries/Avatar.tsx` | Counterparty avatar in row |

---

## Implementation Details

### 1. NotificationBell Component

```typescript
// components/ui/NotificationBell.tsx

/**
 * NotificationBell Component
 * 
 * 38x38 circular button with Bell icon and optional unread badge.
 * Matches filter button chrome from DiscoverHeader.
 */

interface NotificationBellProps {
  /** Whether there are active filters (for Discover screen co-existence) */
  hasFilters?: boolean;
}

// Uses useUnreadCount() hook
// On press: router.push('/notifications')
// Badge: 16px diameter, accent fill, capped at "9+"
```

### 2. Header Integration

Modify `ScreenHeader` to accept an optional `bellSlot` prop that renders before `rightSlot`:

```typescript
// ScreenHeader.tsx additions

interface ScreenHeaderProps {
  // ... existing props
  /** Bell notification slot, renders before rightSlot */
  bellSlot?: React.ReactNode;
}
```

Alternative approach (preferred): Create a wrapper component `HeaderWithBell` that composes `ScreenHeader` with `NotificationBell` in the right-slot, avoiding changes to the base primitive.

**Decision:** Use composition pattern. Create `NotificationBell` as a standalone component that screens can place in the `rightSlot` alongside or instead of other controls.

### 3. Discover Header Special Case

Discover uses `DiscoverHeader` (custom header with search bar), not `ScreenHeader`. Modify `DiscoverHeader` to accept an optional `bellSlot` prop between search and filter button:

```typescript
// DiscoverHeader.tsx modification

interface DiscoverHeaderProps {
  // ... existing props
  /** Bell notification slot, renders between search and filter */
  bellSlot?: React.ReactNode;
}
```

Layout becomes: `[Search Bar] [Bell] [Filter Button]`

### 4. NotificationRow Component

Follows `InfluencerAttentionItem` layout pattern:

```
+----------------------------------------------------------+
| [Avatar 44x44] [Title + Timestamp]              [Chevron] |
|                [Timestamp label - muted]                  |
+----------------------------------------------------------+
```

- Unread: `accentSoft` background, `accentBorder`
- Read: `surface` background, `border`
- Avatar: photo or monogram (uses existing `Avatar` component)
- Icon overlay on avatar based on notification type

### 5. NotificationsScreen

```typescript
// app/notifications.tsx

/**
 * Notifications Screen
 * Full-screen feed of notifications, newest first.
 */

// Header: ScreenHeader with title="Notifications" and "Mark all read" in rightSlot
// Body: FlatList of NotificationRow
// Empty: Centered bell icon + "You're all caught up"
```

### 6. Seeding from Existing Data

The `seedNotifications` function pulls from:

1. **Deals** (`mockBusinessDashboard.ts`, `mockInfluencerDashboard.ts`):
   - COMPLETED deals -> `marked_done` notification
   - RATED deals -> `rating_received` or `mutual_reveal`
   - EXPIRED/DECLINED deals -> respective notifications

2. **Threads** (`mockThread.ts`):
   - Last message timestamp -> `new_message` notification

3. **Ratings** (`services/ratings.ts`):
   - Submitted ratings -> `rating_received`

Initial seed happens on app mount via `useEffect` in layout or notifications screen.

---

## File Changes Summary

### New Files (MINIMAL)

| File | Type | Description |
|------|------|-------------|
| `types/notification.ts` | Type | Notification interfaces |
| `lib/notifications.ts` | Store | Notification store (mirrors dealStore) |
| `components/ui/NotificationBell.tsx` | Component | Bell + badge |
| `components/notifications/NotificationRow.tsx` | Component | Row item |
| `components/notifications/index.ts` | Barrel | Exports |
| `app/notifications.tsx` | Screen | Full-screen feed |

### Modified Files

| File | Change |
|------|--------|
| `components/business/discover/DiscoverHeader.tsx` | Add `bellSlot` prop |
| `components/influencer/discover/DiscoverHeader.tsx` | Add `bellSlot` prop |
| `app/(business)/discover.tsx` | Pass NotificationBell to header |
| `app/(influencer)/discover.tsx` | Pass NotificationBell to header |
| `app/(business)/index.tsx` | Add bell to TopBar or header |
| `app/(influencer)/index.tsx` | Add bell to TopBar or header |
| `app/(business)/inquiries.tsx` | Add bell to ScreenHeader rightSlot |
| `app/(influencer)/inquiries.tsx` | Add bell to ScreenHeader rightSlot |
| `app/(business)/profile.tsx` | Add bell to ScreenHeader rightSlot |
| `app/(influencer)/profile.tsx` | Add bell to ScreenHeader rightSlot |

---

## Routing

| Route | File | Purpose |
|-------|------|---------|
| `/notifications` | `app/notifications.tsx` | Notifications feed |

Notification tap routes:
- `thread` -> `/inquiries/[threadId]?viewerRole={role}`
- `rate` -> `/rate/[dealId]?viewerRole={role}`
- `reveal` -> `/rate/[dealId]/reveal?viewerRole={role}` (or similar)
- `perk` -> placeholder (log or toast for v1)

---

## Performance Considerations

1. **FlatList** for notifications list (not ScrollView) to handle large lists
2. **Memoization** on `NotificationRow` to prevent unnecessary re-renders
3. **Badge count** computed via separate selector to minimize re-renders on notification content changes
4. **50-item cap** prevents unbounded memory growth

---

## Testing Strategy

1. **Unit tests**: Store mutations (add, markAsRead, markAllAsRead)
2. **Integration tests**: Bell badge updates on notification changes
3. **E2E**: Full flow from bell tap -> notification tap -> detail screen -> back

---

## Risks & Mitigations

| Risk | Mitigation |
|------|------------|
| Badge count flicker on navigation | Use `useSyncExternalStore` with stable snapshot |
| Memory growth from notifications | 50-item cap enforced in `addNotification` |
| Stale notifications after app restart | Acceptable for v1; v2 adds persistence |
| Race condition on rapid mark-as-read | Idempotent `markAsRead` implementation |

---

## Dependencies

- `lucide-react-native`: `Bell`, `Check`, `Clock`, `X`, `CheckCircle`, `Star`, `Eye`, `Gift`, `MessageCircle` icons
- Existing: `useSyncExternalStore` (React 18), `expo-router`, `react-native-safe-area-context`

No new packages required.
