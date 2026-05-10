/**
 * Inquiry Thread Types
 * Types for the Inquiries inbox screen.
 */

import type { DealState, ViewerRole } from '@/lib/dealLifecycle';

/**
 * Counterparty in a thread.
 * Business view: Influencer counterparty has photo
 * Influencer view: Business counterparty has monogram
 */
export interface Counterparty {
  name: string;
  /** URL for photo avatar (Influencer counterparty in Business view) */
  photo?: string;
  /** 2-char monogram (Business counterparty in Influencer view) */
  monogram?: string;
}

/**
 * Single thread in the inbox.
 * State-driven: caption resolved at render time via getDealCaption.
 */
export interface Thread {
  id: string;
  counterparty: Counterparty;
  /** Canonical deal state from the lifecycle state machine */
  state: DealState;
  /** Hours remaining until expiry (only for PENDING state) */
  hoursLeft?: number;
  /** Whether the business/business has submitted their rating (only for COMPLETED) */
  businessRated?: boolean;
  /** Whether the influencer has submitted their rating (only for COMPLETED) */
  influencerRated?: boolean;
  /** Last message content, or null if no messages yet */
  lastMessage: string | null;
  /** Who sent the last message */
  lastMessageBy: 'me' | 'them' | null;
  /** Human-readable timestamp (e.g., "2h ago", "11:42", "Yesterday") */
  timestamp: string;
  /** Number of unread messages in this thread */
  unread: number;
}

/**
 * Props for the shared InquiriesScreen component.
 */
export interface InquiriesScreenProps {
  viewerRole: ViewerRole;
  threads: Thread[];
  unreadTotal: number;
}
