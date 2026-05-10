/**
 * Mock Business Dashboard Data
 * Used for UI development before Supabase integration.
 *
 * Covers all 7 deal states:
 * - Active: PENDING, IN_PROGRESS, DELIVERED, COMPLETED (x2)
 * - Terminal: EXPIRED, DECLINED
 * - RATED is excluded (filtered to History view)
 *
 * AttentionItems are state-driven (no ad-hoc subtitle/cta strings).
 * They derive their caption from getDealCaption() in the component.
 */

import type { BusinessDashboardData, Deal, AttentionItem } from '@/types/business';

// Reusable influencer photos for visual continuity
const INFLUENCER_PHOTOS = {
  maya: 'https://images.unsplash.com/photo-1518611012118-696072aa579a?w=400&q=80',
  noa: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=400&q=80',
  daniel: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=400&q=80',
  yael: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=400&q=80',
  amit: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&q=80',
  tamar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400&q=80',
  oren: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400&q=80',
};

// Define deals first so we can derive attention items from them
const deals: Deal[] = [
  // PENDING - Awaiting influencer response (47h countdown)
  {
    id: 'deal-1',
    influencer: {
      name: 'Noa Berman',
      photo: INFLUENCER_PHOTOS.noa,
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
    influencer: {
      name: 'Maya Cohen',
      photo: INFLUENCER_PHOTOS.maya,
    },
    services: '2 services',
    total: 530,
    state: 'IN_PROGRESS',
    timeLabel: 'Started 4h ago',
  },

  // DELIVERED - Awaiting business review
  {
    id: 'deal-3',
    influencer: {
      name: 'Yael Shapira',
      photo: INFLUENCER_PHOTOS.yael,
    },
    services: '1 service',
    total: 420,
    state: 'DELIVERED',
    timeLabel: 'Delivered 2h ago',
  },

  // COMPLETED (unrated) - Business needs to rate
  {
    id: 'deal-4',
    influencer: {
      name: 'Daniel Levi',
      photo: INFLUENCER_PHOTOS.daniel,
    },
    services: '1 service',
    total: 180,
    state: 'COMPLETED',
    businessRated: false,
    influencerRated: true,
    timeLabel: 'Delivered 3d ago',
  },

  // COMPLETED (business rated) - Waiting for influencer to rate
  {
    id: 'deal-5',
    influencer: {
      name: 'Amit Golan',
      photo: INFLUENCER_PHOTOS.amit,
    },
    services: '2 services',
    total: 650,
    state: 'COMPLETED',
    businessRated: true,
    influencerRated: false,
    timeLabel: 'Delivered 5d ago',
  },

  // EXPIRED - Influencer never responded (terminal)
  {
    id: 'deal-6',
    influencer: {
      name: 'Tamar Rosen',
      photo: INFLUENCER_PHOTOS.tamar,
    },
    services: '1 service',
    total: 275,
    state: 'EXPIRED',
    timeLabel: 'Expired 2d ago',
  },

  // DECLINED - Influencer declined the request (terminal)
  {
    id: 'deal-7',
    influencer: {
      name: 'Oren Katz',
      photo: INFLUENCER_PHOTOS.oren,
    },
    services: '1 service',
    total: 380,
    state: 'DECLINED',
    timeLabel: 'Declined yesterday',
  },
];

/**
 * Derive attention items from deals where business action is required.
 *
 * For Business/Business role, attention-worthy states are:
 * - DELIVERED: Review delivery from influencer
 * - COMPLETED with businessRated === false: Rate the influencer
 */
function deriveAttentionItems(dealsList: Deal[]): AttentionItem[] {
  const attentionItems: AttentionItem[] = [];

  for (const deal of dealsList) {
    // COMPLETED and business hasn't rated yet
    if (deal.state === 'COMPLETED' && deal.businessRated === false) {
      attentionItems.push({
        id: `att-${deal.id}`,
        state: deal.state,
        title: `Rate ${deal.influencer.name}`,
        businessRated: deal.businessRated,
        influencerRated: deal.influencerRated,
        photo: deal.influencer.photo,
      });
    }

    // DELIVERED - business needs to review
    if (deal.state === 'DELIVERED') {
      attentionItems.push({
        id: `att-${deal.id}`,
        state: deal.state,
        title: `Review ${deal.influencer.name}`,
        photo: deal.influencer.photo,
      });
    }
  }

  return attentionItems;
}

export const MOCK_BUSINESS_DASHBOARD: BusinessDashboardData = {
  business: {
    name: 'FitBar TLV',
    firstName: 'FitBar',
  },

  attentionItems: deriveAttentionItems(deals),

  deals,

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
