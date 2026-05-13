/**
 * Influencer Dashboard Types
 * Types for the influencer-side dashboard screen.
 */

import type {
  DealState,
  CompletedSubstate,
  DeclineReason,
  DealInitiator,
} from '@/lib/dealLifecycle';

/**
 * Influencer identity for dashboard display
 */
export interface DashboardInfluencer {
  name: string;
  firstName: string;
}

/**
 * Earnings summary for hero card
 */
export interface InfluencerEarnings {
  thisMonth: number;
  thisMonthCount: number;
  allTime: number;
  trend: 'up' | 'down' | 'flat';
  trendPercent: number;
}

/**
 * Attention item for "Needs your attention" section.
 *
 * State-driven: subtitle is derived from getDealCaption(deal, 'influencer').
 * Icon is derived from state: PENDING -> Inbox, COMPLETED -> Star.
 *
 * Valid attention-item states (influencer side):
 * - PENDING: "New request from {Business}" (but for influencer, PENDING is NOT actionable)
 * - COMPLETED with viewer not yet rated: "Rate {Business}"
 *
 * Note: For influencer, PENDING shows "AWAITING RESPONSE" (not actionable).
 * The attention items for influencer would be COMPLETED rate-now deals.
 */
export interface InfluencerAttentionItem {
  id: string;
  /** The lifecycle state of the underlying deal */
  state: DealState;
  /** Human context for the title (business name) */
  title: string;
  /** Business monogram for tile display */
  monogram: string;
  /** Earnings value (optional, shown on right) */
  earnings?: number;
  /** Hours remaining (only for PENDING state) */
  hoursLeft?: number;
  /** Sub-state for COMPLETED deals */
  completedSubstate?: CompletedSubstate;
  /** Who initiated the deal (PENDING only). Defaults to 'influencer'. */
  requestedBy?: DealInitiator;
  /** Counterparty first name (for "WAITING ON {NAME}" caption) */
  counterpartyFirstName?: string;
}

/**
 * Deal row in "Active deals" section.
 *
 * State-driven: status label and accent are derived from getDealCaption().
 */
export interface InfluencerDeal {
  id: string;
  business: {
    name: string;
    monogram: string;
  };
  services: string;
  earnings: number;
  /** Canonical deal state */
  state: DealState;
  /** Hours remaining (only for PENDING state) */
  hoursLeft?: number;
  /** Sub-state for COMPLETED deals */
  completedSubstate?: CompletedSubstate;
  /** Rating received (only for RATED state) */
  rating?: number;
  /** Reason for decline (only for DECLINED state) */
  declineReason?: DeclineReason;
  /**
   * Who initiated the deal request (PENDING only). Defaults to
   * 'influencer'. When 'business', the influencer is the responder
   * and sees the accent "RESPOND BY {N}H" caption.
   */
  requestedBy?: DealInitiator;
}

/**
 * Perk claim status — separate lifecycle from deals.
 * 'delivered' here refers to perk delivery, NOT deal delivery.
 */
export type PerkClaimStatus = 'to_deliver' | 'delivered' | 'expired';

/**
 * Perk claim row in "Active claims" section
 */
export interface PerkClaim {
  id: string;
  title: string;
  business: string;
  monogram: string;
  deadline: string;
  status: PerkClaimStatus;
}

/**
 * Dashboard stats for overview section
 */
export interface InfluencerStats {
  activeDeals: number;
  rating: number;
  thisMonthCount: number;
}

/**
 * Full influencer dashboard data shape
 */
export interface InfluencerDashboardData {
  influencer: DashboardInfluencer;
  earnings: InfluencerEarnings;
  attentionItems: InfluencerAttentionItem[];
  deals: InfluencerDeal[];
  perkClaims: PerkClaim[];
  stats: InfluencerStats;
}
