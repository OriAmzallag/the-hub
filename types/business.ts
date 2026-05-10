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
 * Valid attention-item states (Business/Hunter side):
 * - DELIVERED: "Review delivery from {Talent}"
 * - COMPLETED with businessRated === false: "Rate {Talent}"
 *
 * Valid attention-item states (Talent side, future):
 * - PENDING: "New request from {Hunter}"
 * - COMPLETED with talentRated === false: "Rate {Hunter}"
 */
export interface AttentionItem {
  id: string;
  /** The lifecycle state of the underlying deal - drives the canonical caption */
  state: DealState;
  /** Human context for the title (e.g., talent name). NOT the status caption. */
  title: string;
  /** Hours remaining until expiry (only for PENDING state) */
  hoursLeft?: number;
  /** Whether the business/hunter has submitted their rating (only for COMPLETED) */
  businessRated?: boolean;
  /** Whether the talent has submitted their rating (only for COMPLETED) */
  talentRated?: boolean;
  /** Avatar URL */
  photo: string;
}

export interface DealTalent {
  name: string;
  photo: string;
}

export interface Deal {
  id: string;
  talent: DealTalent;
  services: string;
  total: number;
  /** Canonical deal state from the lifecycle state machine */
  state: DealState;
  /** Hours remaining until expiry (only for PENDING state) */
  hoursLeft?: number;
  /** Whether the business/hunter has submitted their rating (only for COMPLETED) */
  businessRated?: boolean;
  /** Whether the talent has submitted their rating (only for COMPLETED) */
  talentRated?: boolean;
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
