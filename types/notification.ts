/**
 * Notification Types
 *
 * Type definitions for the notifications system. Notifications are derived
 * from existing deal/rating/message events rather than stored as a separate
 * entity.
 */

import type { ViewerRole } from '@/lib/dealLifecycle';

/**
 * Notification event types - map 1:1 to deal lifecycle events.
 */
export type NotificationType =
  | 'deal_accepted'
  | 'deal_expired'
  | 'deal_declined'
  | 'marked_done'
  | 'rating_received'
  | 'mutual_reveal'
  | 'perk_claimed'
  | 'new_message';

/**
 * Avatar representation for notifications.
 * Photo for influencer counterparties, monogram for business counterparties.
 */
export type NotificationAvatar =
  | { type: 'photo'; url: string }
  | { type: 'monogram'; text: string };

/**
 * Route destination when tapping a notification.
 */
export type NotificationRoute =
  | { type: 'thread'; threadId: string; viewerRole: ViewerRole }
  | { type: 'rate'; dealId: string; viewerRole: ViewerRole }
  | { type: 'reveal'; dealId: string; viewerRole: ViewerRole }
  | { type: 'perk'; perkId: string };

/**
 * Single notification item.
 */
export interface Notification {
  /** Unique identifier */
  id: string;
  /** Event type - determines icon and routing behavior */
  type: NotificationType;
  /** Primary text shown in the notification row */
  title: string;
  /** Counterparty name for context */
  counterpartyName: string;
  /** Avatar display */
  avatar: NotificationAvatar;
  /** ISO timestamp for sorting */
  timestamp: string;
  /** Relative display label (e.g., "2h ago", "Yesterday") */
  timestampLabel: string;
  /** Read state (in-memory for v1) */
  read: boolean;
  /** Route params for tap action */
  route: NotificationRoute;
}

/**
 * Icon mapping for notification types.
 * Used by NotificationRow to display the correct overlay icon.
 */
export const NOTIFICATION_ICONS: Record<NotificationType, string> = {
  deal_accepted: 'Check',
  deal_expired: 'Clock',
  deal_declined: 'X',
  marked_done: 'CheckCircle',
  rating_received: 'Star',
  mutual_reveal: 'Eye',
  perk_claimed: 'Gift',
  new_message: 'MessageCircle',
} as const;
