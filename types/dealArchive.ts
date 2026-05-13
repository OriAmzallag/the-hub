/**
 * Deal Archive Type Definitions
 * Types for terminal-state deal history and summary screens.
 */

import type { ViewerRole, DeclineReason } from '@/lib/dealLifecycle';
import type { Rating } from '@/types/rating';

/**
 * Locked event-type taxonomy (8 total).
 * These are the only valid event types in the deal timeline.
 */
export type EventType =
  | 'request_sent'
  | 'viewed'
  | 'accepted'
  | 'marked_done'
  | 'rated'
  | 'deal_closed'
  | 'expired'
  | 'declined';

/**
 * Single timeline event.
 */
export interface TimelineEvent {
  id: string;
  type: EventType;
  actor: 'business' | 'influencer' | 'system';
  date: string;      // "APR 28"
  time: string;      // "14:22"
  detail?: string;   // Optional body line
}

/**
 * Terminal state for archived deals.
 */
export type TerminalState = 'RATED' | 'EXPIRED' | 'DECLINED';

/**
 * Archived deal record.
 */
export interface ArchivedDeal {
  id: string;
  state: TerminalState;

  // Counterparty info
  business: {
    id: string;
    name: string;
    firstName: string;
    monogram: string;
  };
  influencer: {
    id: string;
    name: string;
    firstName: string;
    photo: string;
  };

  // Deal details
  services: string[];
  serviceSummary: string;
  money: number;

  // Timeline
  timeline: TimelineEvent[];

  // State-specific data
  ratings?: {
    business: Rating;
    influencer: Rating;
  };
  declineReason?: DeclineReason;
  declineNote?: string;

  // Coordination
  messageCount: number;

  // Terminal date (for row display)
  terminalDate: string; // "MAY 3"
}

/**
 * History filter tab.
 */
export type HistoryTab = 'completed' | 'declined' | 'expired';

/**
 * History counts per tab.
 */
export interface HistoryCounts {
  completed: number;
  declined: number;
  expired: number;
}
