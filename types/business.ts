/**
 * Business Dashboard Type Definitions
 * Types for the business dashboard data shapes.
 */

import type {
  DealState,
  CompletedSubstate,
  DeclineReason,
} from '@/lib/dealLifecycle';

export interface Business {
  name: string;
  firstName: string;
}

/**
 * AttentionItem - state-driven, no ad-hoc strings.
 *
 * The subtitle/caption is derived from getDealCaption(deal, viewerRole).
 * The CTA is implicit (chevron affordance); no ad-hoc cta string.
 *
 * Valid attention-item states (business side):
 * - PENDING: "Respond to {Influencer}" (business must respond within countdown)
 * - COMPLETED with viewer not yet rated: "Rate {Influencer}"
 */
export interface AttentionItem {
  id: string;
  /** The lifecycle state of the underlying deal - drives the canonical caption */
  state: DealState;
  /** Human context for the title (e.g., influencer name). NOT the status caption. */
  title: string;
  /** Hours remaining until expiry (only for PENDING state) */
  hoursLeft?: number;
  /** Sub-state for COMPLETED deals */
  completedSubstate?: CompletedSubstate;
  /** Influencer first name (for "WAITING ON {NAME}" caption on PENDING) */
  counterpartyFirstName?: string;
  /** Avatar URL */
  photo: string;
  /** Coordination thread id — used as fallback route when the item is
   * not an actionable rating prompt. */
  threadId?: string;
}

export interface DealInfluencer {
  name: string;
  photo: string;
}

export interface Deal {
  id: string;
  influencer: DealInfluencer;
  services: string;
  total: number;
  /** Canonical deal state from the lifecycle state machine */
  state: DealState;
  /** Hours remaining until expiry (only for PENDING state) */
  hoursLeft?: number;
  /** Sub-state for COMPLETED deals */
  completedSubstate?: CompletedSubstate;
  /** Rating received (only for RATED state, 1.0-5.0) */
  rating?: number;
  /** Reason for decline (only for DECLINED state) */
  declineReason?: DeclineReason;
  /** Human-readable time context (e.g., "Started 4h ago", "Sent yesterday") */
  timeLabel?: string;
  /**
   * Coordination thread id for this deal. Optional — only present when
   * a thread exists. Dashboard taps route here when set (unless the
   * card resolves to an actionable rating prompt, which takes precedence).
   */
  threadId?: string;
}

export interface Perk {
  id: string;
  title: string;
  claimed: number;
  max: number;
  expires: string;
}

export interface BusinessStats {
  activeDeals: number;
  bookingValue: number;
  perksClaimed: number;
}

export interface BusinessDashboardData {
  business: Business;
  attentionItems: AttentionItem[];
  deals: Deal[];
  perks: Perk[];
  stats: BusinessStats;
}
