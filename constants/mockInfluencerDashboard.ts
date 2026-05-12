/**
 * Mock Influencer Dashboard Data
 * Used for UI development before Supabase integration.
 *
 * Canonical influencer: Maya Cohen
 * Values match the reference file exactly.
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

  attentionItems: [
    {
      id: 'att-1',
      kind: 'new-request',
      title: 'Onza',
      subtitle: 'NEW REQUEST',
      monogram: 'ON',
      earnings: 530,
    },
    {
      id: 'att-2',
      kind: 'rate',
      title: 'Sushi Bar',
      subtitle: 'RATE NOW',
      monogram: 'SB',
    },
  ],

  deals: [
    {
      id: 'deal-1',
      business: {
        name: 'FitBar TLV',
        monogram: 'FB',
      },
      services: '2 services',
      earnings: 530,
      status: 'in_progress',
      statusLabel: 'IN PROGRESS',
      statusAccent: false,
    },
    {
      id: 'deal-2',
      business: {
        name: 'Onza',
        monogram: 'ON',
      },
      services: '1 service',
      earnings: 350,
      status: 'respond',
      statusLabel: 'RESPOND',
      statusAccent: true,
    },
    {
      id: 'deal-3',
      business: {
        name: 'Sushi Bar',
        monogram: 'SB',
      },
      services: '1 service',
      earnings: 180,
      status: 'rate',
      statusLabel: 'RATE NOW',
      statusAccent: true,
    },
    {
      id: 'deal-4',
      business: {
        name: 'BeautyBar',
        monogram: 'BB',
      },
      services: '2 services',
      earnings: 420,
      status: 'delivered',
      statusLabel: 'AWAITING REVIEW',
      statusAccent: false,
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
