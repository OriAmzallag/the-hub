/**
 * Mock Business Dashboard Data
 * Used for UI development before Supabase integration.
 */

import type { BusinessDashboardData } from '@/types/business';

export const MOCK_BUSINESS_DASHBOARD: BusinessDashboardData = {
  business: {
    name: 'FitBar TLV',
    firstName: 'FitBar',
    monogram: 'FB',
  },

  attentionItems: [
    {
      id: 'att-1',
      kind: 'rating-due',
      title: 'Rate Daniel Levi',
      subtitle: 'Story Set delivered May 6',
      cta: 'Rate now',
      photo:
        'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=400&q=80',
    },
  ],

  deals: [
    {
      id: 'deal-1',
      talent: {
        name: 'Maya Cohen',
        photo:
          'https://images.unsplash.com/photo-1518611012118-696072aa579a?w=400&q=80',
      },
      services: '2 services',
      total: 530,
      status: 'in_progress',
      statusLabel: 'In progress',
      statusAccent: false,
      timeLabel: 'Started 4h ago',
    },
    {
      id: 'deal-2',
      talent: {
        name: 'Noa Berman',
        photo:
          'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=400&q=80',
      },
      services: '1 service',
      total: 350,
      status: 'waiting',
      statusLabel: 'Waiting · 47h left',
      statusAccent: true,
      timeLabel: 'Sent yesterday',
    },
    {
      id: 'deal-3',
      talent: {
        name: 'Daniel Levi',
        photo:
          'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=400&q=80',
      },
      services: '1 service',
      total: 180,
      status: 'rate_now',
      statusLabel: 'Rate now',
      statusAccent: true,
      timeLabel: 'Delivered 3d ago',
    },
  ],

  perks: [
    {
      id: 'perk-1',
      title: 'Free dinner for 2',
      claimed: 3,
      max: 5,
      expires: 'May 31',
    },
  ],

  stats: {
    activeDeals: 3,
    bookingValue: 1060,
    perksClaimed: 3,
  },
};

// Empty state mock data for testing edge cases
export const MOCK_BUSINESS_DASHBOARD_EMPTY: BusinessDashboardData = {
  business: {
    name: 'New Business',
    firstName: 'New',
    monogram: 'NB',
  },
  attentionItems: [],
  deals: [],
  perks: [],
  stats: {
    activeDeals: 0,
    bookingValue: 0,
    perksClaimed: 0,
  },
};
