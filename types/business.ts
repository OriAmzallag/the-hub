/**
 * Business Dashboard Type Definitions
 * Types for the business dashboard data shapes.
 */

import type { DealState } from '@/lib/dealLifecycle';

export interface Business {
  name: string;
  firstName: string;
}

/**
 * AttentionItem - state-driven, no ad-hoc strings.
 *
 * The subtitle/caption is derived from getDealCaption(state, role, opts).
 * The CTA is implicit (chevron affordance); no ad-hoc cta string.
 *
 * Valid attention-item states (Business/Business side):
 * - DELIVERED: "Review delivery from {Influencer}"
 * - COMPLETED with businessRated === false: "Rate {Influencer}"
 *
 * Valid attention-item states (Influencer side, future):
 * - PENDING: "New request from {Business}"
 * - COMPLETED with influencerRated === false: "Rate {Business}"
 */
export interface AttentionItem {
  id: string;
  /** The lifecycle state of the underlying deal - drives the canonical caption */
  state: DealState;
  /** Human context for the title (e.g., influencer name). NOT the status caption. */
  title: string;
  /** Hours remaining until expiry (only for PENDING state) */
  hoursLeft?: number;
  /** Whether the business/business has submitted their rating (only for COMPLETED) */
  businessRated?: boolean;
  /** Whether the influencer has submitted their rating (only for COMPLETED) */
  influencerRated?: boolean;
  /** Avatar URL */
  photo: string;
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
  /** Whether the business/business has submitted their rating (only for COMPLETED) */
  businessRated?: boolean;
  /** Whether the influencer has submitted their rating (only for COMPLETED) */
  influencerRated?: boolean;
  /** Human-readable time context (e.g., "Started 4h ago", "Sent yesterday") */
  timeLabel?: string;
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
