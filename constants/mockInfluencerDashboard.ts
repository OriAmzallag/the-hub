/**
 * Mock Influencer Dashboard Data
 * Used for UI development before Supabase integration.
 *
 * Canonical influencer: Maya Cohen
 * State-driven: deals and attention items derive captions from getDealCaption().
 */

import type { InfluencerDashboardData } from '@/types/influencerDashboard';

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

  // State-driven attention items
  // For influencer, actionable states are COMPLETED where they need to rate
  // PENDING shows "AWAITING RESPONSE" (not actionable for influencer)
  attentionItems: [
    {
      id: 'att-1',
      state: 'PENDING',
      title: 'Onza',
      monogram: 'ON',
      earnings: 530,
      hoursLeft: 47,
    },
    {
      id: 'att-2',
      state: 'COMPLETED',
      completedSubstate: 'neither-rated',
      title: 'Sushi Bar',
      monogram: 'SB',
    },
  ],

  // State-driven deals - captions resolved via getDealCaption()
  deals: [
    {
      id: 'deal-1',
      business: {
        name: 'FitBar TLV',
        monogram: 'FB',
      },
      services: '2 services',
      earnings: 530,
      state: 'IN_PROGRESS',
    },
    {
      id: 'deal-2',
      business: {
        name: 'Onza',
        monogram: 'ON',
      },
      services: '1 service',
      earnings: 350,
      state: 'PENDING',
      hoursLeft: 47,
    },
    {
      id: 'deal-3',
      business: {
        name: 'Sushi Bar',
        monogram: 'SB',
      },
      services: '1 service',
      earnings: 180,
      state: 'COMPLETED',
      completedSubstate: 'neither-rated',
    },
    {
      id: 'deal-4',
      business: {
        name: 'BeautyBar',
        monogram: 'BB',
      },
      services: '2 services',
      earnings: 420,
      state: 'COMPLETED',
      completedSubstate: 'influencer-rated', // Influencer rated, awaiting business
    },
  ],

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
