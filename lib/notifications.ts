/**
 * Notifications Store
 *
 * Module-level mutable store + pub-sub so all screens share the same
 * notification state. Bell badge and notifications screen both subscribe.
 *
 * Pattern mirrors lib/dealStore.ts:
 * - Module-level state array
 * - Set of listener callbacks
 * - notify() on any mutation
 * - useSyncExternalStore for React integration
 *
 * v1: In-memory only. Notifications reset on app restart.
 * v2: AsyncStorage persistence.
 */

import { useSyncExternalStore } from 'react';
import type { Notification, NotificationType, NotificationRoute, NotificationAvatar } from '@/types/notification';
import type { ViewerRole } from '@/lib/dealLifecycle';

// -----------------------------------------------------------------------------
// Module-level State
// -----------------------------------------------------------------------------

/** Maximum notifications to keep (prevents unbounded growth) */
const MAX_NOTIFICATIONS = 50;

/** In-memory notification list, newest first */
let notifications: readonly Notification[] = [];

/** Subscriber callbacks */
const listeners = new Set<() => void>();

/** Notify all subscribers of state change */
function notify(): void {
  for (const listener of listeners) listener();
}

// -----------------------------------------------------------------------------
// Subscribe Primitive
// -----------------------------------------------------------------------------

/**
 * Subscribe to notification state changes. Returns an unsubscribe function.
 * Prefer the React hooks below for component usage.
 */
export function subscribe(listener: () => void): () => void {
  listeners.add(listener);
  return () => {
    listeners.delete(listener);
  };
}

// -----------------------------------------------------------------------------
// Snapshot Accessors
// -----------------------------------------------------------------------------

/** Get current notifications array. Identity changes on every update. */
export function getNotificationsSnapshot(): readonly Notification[] {
  return notifications;
}

/** Get count of unread notifications */
export function getUnreadCount(): number {
  return notifications.filter((n) => !n.read).length;
}

// -----------------------------------------------------------------------------
// Mutations
// -----------------------------------------------------------------------------

/**
 * Add a new notification to the store.
 * Prepends to list (newest first) and enforces max count.
 */
export function addNotification(notification: Notification): void {
  notifications = [notification, ...notifications].slice(0, MAX_NOTIFICATIONS);
  notify();
}

/**
 * Mark a single notification as read.
 * Idempotent: no-op if already read.
 */
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

/**
 * Mark all notifications as read.
 * No-op if all are already read.
 */
export function markAllAsRead(): void {
  const hasUnread = notifications.some((n) => !n.read);
  if (!hasUnread) return;
  notifications = notifications.map((n) => ({ ...n, read: true }));
  notify();
}

/**
 * Clear all notifications (for testing/reset).
 */
export function clearNotifications(): void {
  if (notifications.length === 0) return;
  notifications = [];
  notify();
}

// -----------------------------------------------------------------------------
// React Hooks
// -----------------------------------------------------------------------------

/**
 * React hook that subscribes to the notifications store.
 * Re-renders when notifications change.
 */
export function useNotifications(): readonly Notification[] {
  return useSyncExternalStore(subscribe, getNotificationsSnapshot, getNotificationsSnapshot);
}

/**
 * React hook that returns unread count.
 * Optimized to only re-render when count changes.
 */
export function useUnreadCount(): number {
  return useSyncExternalStore(subscribe, getUnreadCount, getUnreadCount);
}

// -----------------------------------------------------------------------------
// Notification Factory
// -----------------------------------------------------------------------------

/**
 * Create a notification with consistent ID generation.
 */
export function createNotification(params: {
  type: NotificationType;
  title: string;
  counterpartyName: string;
  avatar: NotificationAvatar;
  timestampLabel: string;
  route: NotificationRoute;
  read?: boolean;
}): Notification {
  return {
    id: `notif-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
    type: params.type,
    title: params.title,
    counterpartyName: params.counterpartyName,
    avatar: params.avatar,
    timestamp: new Date().toISOString(),
    timestampLabel: params.timestampLabel,
    read: params.read ?? false,
    route: params.route,
  };
}

// -----------------------------------------------------------------------------
// Seed Initial Notifications
// -----------------------------------------------------------------------------

/**
 * Seed notifications from existing data sources for demo/dev.
 * Called once on app mount. In production, notifications would come from
 * the backend via push or polling.
 */
export function seedNotifications(viewerRole: ViewerRole): void {
  // Only seed if empty (prevents double-seeding on HMR)
  if (notifications.length > 0) return;

  const isBusiness = viewerRole === 'business';

  // Create sample notifications based on viewer role
  const sampleNotifications: Notification[] = isBusiness
    ? [
        createNotification({
          type: 'deal_accepted',
          title: 'Maya Cohen accepted your booking',
          counterpartyName: 'Maya Cohen',
          avatar: { type: 'photo', url: 'https://images.unsplash.com/photo-1518611012118-696072aa579a?w=400&q=80' },
          timestampLabel: '2h ago',
          route: { type: 'thread', threadId: 'h-thr-2', viewerRole: 'business' },
          read: false,
        }),
        createNotification({
          type: 'marked_done',
          title: 'Yael Shapira marked the deal as done',
          counterpartyName: 'Yael Shapira',
          avatar: { type: 'photo', url: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=400&q=80' },
          timestampLabel: '4h ago',
          route: { type: 'rate', dealId: 'deal-3', viewerRole: 'business' },
          read: false,
        }),
        createNotification({
          type: 'new_message',
          title: 'New message from Liat Cohen',
          counterpartyName: 'Liat Cohen',
          avatar: { type: 'photo', url: 'https://images.unsplash.com/photo-1487412720507-e7ab37603c6f?w=400&q=80' },
          timestampLabel: '30m ago',
          route: { type: 'thread', threadId: 'h-thr-0', viewerRole: 'business' },
          read: false,
        }),
        createNotification({
          type: 'rating_received',
          title: 'Daniel Levi rated your collaboration',
          counterpartyName: 'Daniel Levi',
          avatar: { type: 'photo', url: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=400&q=80' },
          timestampLabel: 'Yesterday',
          route: { type: 'rate', dealId: 'deal-4', viewerRole: 'business' },
          read: true,
        }),
        createNotification({
          type: 'deal_expired',
          title: 'Booking with Tamar Rosen expired',
          counterpartyName: 'Tamar Rosen',
          avatar: { type: 'photo', url: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400&q=80' },
          timestampLabel: '2d ago',
          route: { type: 'thread', threadId: 'h-thr-1', viewerRole: 'business' },
          read: true,
        }),
      ]
    : [
        createNotification({
          type: 'new_message',
          title: 'New message from Bellboy',
          counterpartyName: 'Bellboy',
          avatar: { type: 'monogram', text: 'BL' },
          timestampLabel: '1h ago',
          route: { type: 'thread', threadId: 'i-thr-1', viewerRole: 'influencer' },
          read: false,
        }),
        createNotification({
          type: 'deal_accepted',
          title: 'You accepted FitBar TLV\'s booking',
          counterpartyName: 'FitBar TLV',
          avatar: { type: 'monogram', text: 'FB' },
          timestampLabel: '3h ago',
          route: { type: 'thread', threadId: 'i-thr-2', viewerRole: 'influencer' },
          read: false,
        }),
        createNotification({
          type: 'rating_received',
          title: 'Studio Movement rated your collaboration',
          counterpartyName: 'Studio Movement',
          avatar: { type: 'monogram', text: 'SM' },
          timestampLabel: 'Yesterday',
          route: { type: 'rate', dealId: 'i-deal-5', viewerRole: 'influencer' },
          read: false,
        }),
        createNotification({
          type: 'marked_done',
          title: 'You marked the deal with Sushi Bar as done',
          counterpartyName: 'Sushi Bar',
          avatar: { type: 'monogram', text: 'SB' },
          timestampLabel: '2d ago',
          route: { type: 'rate', dealId: 'i-deal-3', viewerRole: 'influencer' },
          read: true,
        }),
        createNotification({
          type: 'perk_claimed',
          title: 'You claimed a perk from Onza',
          counterpartyName: 'Onza',
          avatar: { type: 'monogram', text: 'ON' },
          timestampLabel: '3d ago',
          route: { type: 'perk', perkId: 'claim-1' },
          read: true,
        }),
      ];

  // Add all sample notifications
  notifications = sampleNotifications;
  notify();
}
