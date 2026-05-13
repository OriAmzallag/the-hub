/**
 * Mock Influencer Dashboard Data
 * Used for UI development before Supabase integration.
 *
 * Canonical influencer: Maya Cohen
 * State-driven: deals and attention items derive captions from getDealCaption().
 */

import type {
  InfluencerDashboardData,
  InfluencerDeal,
  InfluencerAttentionItem,
} from '@/types/influencerDashboard';
import { getDealCaption } from '@/lib/dealLifecycle';

// Define deals first so we can derive attention items from them.
const deals: InfluencerDeal[] = [
  {
    id: 'deal-1',
    business: { name: 'FitBar TLV', monogram: 'FB' },
    services: '2 services',
    earnings: 530,
    state: 'IN_PROGRESS',
  },
  {
    id: 'deal-2',
    business: { name: 'Onza', monogram: 'ON' },
    services: '1 service',
    earnings: 350,
    state: 'PENDING',
    hoursLeft: 47,
  },
  {
    id: 'deal-3',
    business: { name: 'Sushi Bar', monogram: 'SB' },
    services: '1 service',
    earnings: 180,
    state: 'COMPLETED',
    completedSubstate: 'neither-rated',
  },
  {
    id: 'deal-4',
    business: { name: 'BeautyBar', monogram: 'BB' },
    services: '2 services',
    earnings: 420,
    state: 'COMPLETED',
    completedSubstate: 'influencer-rated', // Influencer rated, awaiting business
  },
];

/**
 * Derive attention items from deals using the canonical actionable rule.
 *
 * A deal is attention-worthy for the influencer iff
 * `getDealCaption(deal, 'influencer').actionable === true`. That is the
 * single source of truth — no ad-hoc state checks.
 *
 * For influencer, this means COMPLETED deals where they haven't rated
 * yet. PENDING is AWAITING RESPONSE (not actionable) and stays in
 * "Active deals".
 */
function deriveInfluencerAttentionItems(
  dealsList: InfluencerDeal[]
): InfluencerAttentionItem[] {
  return dealsList
    .filter((deal) => getDealCaption(deal, 'influencer').actionable)
    .map((deal) => ({
      id: `att-${deal.id}`,
      state: deal.state,
      title: deal.business.name,
      monogram: deal.business.monogram,
      hoursLeft: deal.hoursLeft,
      completedSubstate: deal.completedSubstate,
    }));
}

export const MAYA_DASHBOARD: InfluencerDashboardData = {
  influencer: {
    name: 'Maya Cohen',
    firstName: 'Maya',
  },

  earnings: {
    thisMonth: 2460,
    thisMonthCount: 4,
    allTime: 9840,
    trend: 'up',
    trendPercent: 32,
  },

  attentionItems: deriveInfluencerAttentionItems(deals),

  deals,

  perkClaims: [
    {
      id: 'claim-1',
      title: 'Dinner for two at Onza',
      business: 'Onza',
      monogram: 'ON',
      deadline: 'DELIVER BY MAY 14',
      status: 'to_deliver',
    },
  ],

  stats: {
    activeDeals: 4,
    rating: 4.9,
    thisMonthCount: 4,
  },
};

/**
 * Empty state mock for testing EarningsCard empty variant
 */
export const MAYA_DASHBOARD_EMPTY: InfluencerDashboardData = {
  influencer: {
    name: 'Maya Cohen',
    firstName: 'Maya',
  },

  earnings: {
    thisMonth: 0,
    thisMonthCount: 0,
    allTime: 0,
    trend: 'flat',
    trendPercent: 0,
  },

  attentionItems: [],
  deals: [],
  perkClaims: [],

  stats: {
    activeDeals: 0,
    rating: 0,
    thisMonthCount: 0,
  },
};
