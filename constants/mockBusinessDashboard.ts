/**
 * Mock Business Dashboard Data
 * Used for UI development before Supabase integration.
 *
 * Covers all 7 deal states:
 * - Active: PENDING, IN_PROGRESS, DELIVERED, COMPLETED (x2)
 * - Terminal: EXPIRED, DECLINED
 * - RATED is excluded (filtered to History view)
 */

import type { BusinessDashboardData } from '@/types/business';

// Reusable talent photos for visual continuity
const TALENT_PHOTOS = {
  maya: 'https://images.unsplash.com/photo-1518611012118-696072aa579a?w=400&q=80',
  noa: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=400&q=80',
  daniel: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=400&q=80',
  yael: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=400&q=80',
  amit: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&q=80',
  tamar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400&q=80',
  oren: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400&q=80',
};

export const MOCK_BUSINESS_DASHBOARD: BusinessDashboardData = {
  business: {
    name: 'FitBar TLV',
    firstName: 'FitBar',
  },

  attentionItems: [
    {
      id: 'att-1',
      kind: 'rating-due',
      title: 'Rate Daniel Levi',
      subtitle: 'Story Set delivered May 6',
      cta: 'Rate now',
      photo: TALENT_PHOTOS.daniel,
    },
  ],

  deals: [
    // PENDING - Awaiting talent response (47h countdown)
    {
      id: 'deal-1',
      talent: {
        name: 'Noa Berman',
        photo: TALENT_PHOTOS.noa,
      },
      services: '1 service',
      total: 350,
      state: 'PENDING',
      hoursLeft: 47,
      timeLabel: 'Sent yesterday',
    },

    // IN_PROGRESS - Work underway
    {
      id: 'deal-2',
      talent: {
        name: 'Maya Cohen',
        photo: TALENT_PHOTOS.maya,
      },
      services: '2 services',
      total: 530,
      state: 'IN_PROGRESS',
      timeLabel: 'Started 4h ago',
    },

    // DELIVERED - Awaiting business review
    {
      id: 'deal-3',
      talent: {
        name: 'Yael Shapira',
        photo: TALENT_PHOTOS.yael,
      },
      services: '1 service',
      total: 420,
      state: 'DELIVERED',
      timeLabel: 'Delivered 2h ago',
    },

    // COMPLETED (unrated) - Business needs to rate
    {
      id: 'deal-4',
      talent: {
        name: 'Daniel Levi',
        photo: TALENT_PHOTOS.daniel,
      },
      services: '1 service',
      total: 180,
      state: 'COMPLETED',
      businessRated: false,
      talentRated: true,
      timeLabel: 'Delivered 3d ago',
    },

    // COMPLETED (business rated) - Waiting for talent to rate
    {
      id: 'deal-5',
      talent: {
        name: 'Amit Golan',
        photo: TALENT_PHOTOS.amit,
      },
      services: '2 services',
      total: 650,
      state: 'COMPLETED',
      businessRated: true,
      talentRated: false,
      timeLabel: 'Delivered 5d ago',
    },

    // EXPIRED - Talent never responded (terminal)
    {
      id: 'deal-6',
      talent: {
        name: 'Tamar Rosen',
        photo: TALENT_PHOTOS.tamar,
      },
      services: '1 service',
      total: 275,
      state: 'EXPIRED',
      timeLabel: 'Expired 2d ago',
    },

    // DECLINED - Talent declined the request (terminal)
    {
      id: 'deal-7',
      talent: {
        name: 'Oren Katz',
        photo: TALENT_PHOTOS.oren,
      },
      services: '1 service',
      total: 380,
      state: 'DECLINED',
      timeLabel: 'Declined yesterday',
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
    // Note: This count should match the filtered active deals, not total
    // When using isActiveOnDashboard, all 7 deals show for BUSINESS role
    // (RATED would be filtered out, but we don't have one in mock data)
    activeDeals: 7,
    bookingValue: 2785,
    perksClaimed: 3,
  },
};

// Empty state mock data for testing edge cases
export const MOCK_BUSINESS_DASHBOARD_EMPTY: BusinessDashboardData = {
  business: {
    name: 'New Business',
    firstName: 'New',
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
