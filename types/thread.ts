/**
 * Thread Types
 * Types for the Inquiry Thread conversation screen.
 */

import type { DealState, ViewerRole } from '@/lib/dealLifecycle';

/**
 * Party in a deal (Business or Influencer)
 */
export interface Party {
  name: string;
  firstName: string;
  phone: string;
  /** 2-char monogram (Business only) */
  monogram?: string;
  /** Photo URL (Influencer only) */
  photo?: string;
  /** Verified badge */
  verified?: boolean;
}

/**
 * Service in a deal
 */
export interface DealService {
  id: string;
  name: string;
  /** Platform abbreviation, e.g., "IG REEL", "IG STORY" */
  platform: string;
  price: number;
}

/**
 * Deal context for the thread
 */
export interface ThreadDeal {
  id: string;
  state: DealState;
  business: Party;
  influencer: Party;
  services: DealService[];
  total: number;
  /** Human-readable date label, e.g., "Next week" */
  dateLabel: string;
  /** Date range string, e.g., "May 16 - May 23" */
  dateRange: string;
  /** Acceptance timestamp, e.g., "May 9 · 14:32" */
  acceptedAt: string;
  /**
   * Canonical dashboard deal id. Mark Done from the thread propagates
   * to the shared dealStore using this id so the Influencer Dashboard
   * card mirrors the state change. v1 mock-data bridge — in production
   * thread + dashboard hit the same Supabase row by primary key.
   */
  dashboardDealId?: string;
}

/**
 * Message attachment (images only for MVP)
 */
export interface MessageAttachment {
  kind: 'image';
  /** Filename to display */
  label: string;
}

/**
 * Message types in the thread
 */
export type MessageType = 'system' | 'message' | 'handoff-offer' | 'handoff-accepted';

/**
 * Single message in the thread
 */
export interface ThreadMessage {
  id: string;
  type: MessageType;
  /** Whose message - only for 'message' and 'handoff-offer' types */
  side?: 'me' | 'them';
  /** Message text - for 'message' and 'system' types */
  text?: string;
  /** File attachment */
  attachment?: MessageAttachment;
  /** Display timestamp */
  timestamp: string;
  /** Read receipt state - only for 'me' messages */
  read?: boolean;
  /** Icon for system messages, e.g., 'check' for deal accepted */
  icon?: 'check' | string;
}

/**
 * WhatsApp handoff state machine
 * null -> 'pending' (user offered) -> 'accepted' (counterpart accepted)
 */
export type HandoffState = null | 'pending' | 'accepted';

/**
 * Full thread data for the screen
 */
export interface ThreadDetail {
  id: string;
  deal: ThreadDeal;
  messages: ThreadMessage[];
  handoffState: HandoffState;
}

/**
 * Template chip definition for quick replies
 */
export interface TemplateChip {
  id: string;
  label: string;
  /** True for the WhatsApp handoff chip */
  isHandoff?: boolean;
}

// Re-export ViewerRole for convenience
export type { ViewerRole } from '@/lib/dealLifecycle';
