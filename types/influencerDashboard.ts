/**
 * Influencer Dashboard Types
 * Types for the influencer-side dashboard screen.
 */

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
 * Attention item kinds - determines the overlay icon
 */
export type AttentionKind = 'new-request' | 'rate' | 'deliver';

/**
 * Attention item for "Needs your attention" section
 */
export interface InfluencerAttentionItem {
  id: string;
  kind: AttentionKind;
  title: string;
  subtitle: string;
  monogram: string;
  earnings?: number;
}

/**
 * Deal status for display
 */
export type InfluencerDealStatus =
  | 'in_progress'
  | 'respond'
  | 'rate'
  | 'delivered';

/**
 * Deal row in "Active deals" section
 */
export interface InfluencerDeal {
  id: string;
  business: {
    name: string;
    monogram: string;
  };
  services: string;
  earnings: number;
  status: InfluencerDealStatus;
  statusLabel: string;
  statusAccent: boolean;
}

/**
 * Perk claim status
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
