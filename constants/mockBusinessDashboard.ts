/**
 * Mock Business Dashboard Data
 * Used for UI development before Supabase integration.
 *
 * Covers all 6 deal states (v0.8):
 * - Active: PENDING, IN_PROGRESS, COMPLETED (x3 sub-states)
 * - Terminal: RATED, EXPIRED, DECLINED
 *
 * AttentionItems are state-driven (no ad-hoc subtitle/cta strings).
 * They derive their caption from getDealCaption() in the component.
 */

import type { BusinessDashboardData, Deal, AttentionItem } from '@/types/business';
import { getDealCaption } from '@/lib/dealLifecycle';

// Reusable influencer photos for visual continuity
const INFLUENCER_PHOTOS = {
  maya: 'https://images.unsplash.com/photo-1518611012118-696072aa579a?w=400&q=80',
  noa: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=400&q=80',
  daniel: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=400&q=80',
  yael: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=400&q=80',
  amit: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&q=80',
  tamar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400&q=80',
  oren: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400&q=80',
  roni: 'https://images.unsplash.com/photo-1554151228-14d9def656e4?w=400&q=80',
};

// Define deals first so we can derive attention items from them
const deals: Deal[] = [
  // PENDING - business booked Noa, waiting on her to respond.
  // Renders "WAITING ON NOA" muted + non-actionable → "All deals"
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
    timeLabel: 'Sent 6h ago',
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

  // COMPLETED (neither-rated) - Both need to rate
  {
    id: 'deal-3',
    influencer: {
      name: 'Yael Shapira',
      photo: INFLUENCER_PHOTOS.yael,
    },
    services: '1 service',
    total: 420,
    state: 'COMPLETED',
    completedSubstate: 'neither-rated',
    timeLabel: 'Completed 2h ago',
  },

  // COMPLETED (influencer-rated) - Business needs to rate
  {
    id: 'deal-4',
    influencer: {
      name: 'Daniel Levi',
      photo: INFLUENCER_PHOTOS.daniel,
    },
    services: '1 service',
    total: 180,
    state: 'COMPLETED',
    completedSubstate: 'influencer-rated',
    timeLabel: 'Completed 3d ago',
  },

  // COMPLETED (business-rated) - Waiting for influencer to rate
  {
    id: 'deal-5',
    influencer: {
      name: 'Amit Golan',
      photo: INFLUENCER_PHOTOS.amit,
    },
    services: '2 services',
    total: 650,
    state: 'COMPLETED',
    completedSubstate: 'business-rated',
    timeLabel: 'Completed 5d ago',
  },

  // RATED - Both parties rated
  {
    id: 'deal-5b',
    influencer: {
      name: 'Roni Kaplan',
      photo: INFLUENCER_PHOTOS.roni,
    },
    services: '1 service',
    total: 290,
    state: 'RATED',
    rating: 4.8,
    timeLabel: 'Rated 1d ago',
  },

  // EXPIRED - Business never responded (terminal)
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

  // DECLINED - Business declined the request (terminal)
  {
    id: 'deal-7',
    influencer: {
      name: 'Oren Katz',
      photo: INFLUENCER_PHOTOS.oren,
    },
    services: '1 service',
    total: 380,
    state: 'DECLINED',
    declineReason: 'WRONG FIT',
    timeLabel: 'Declined yesterday',
  },
];

/**
 * Derive attention items from deals using the canonical actionable rule.
 *
 * A deal is attention-worthy iff
 * `getDealCaption(deal, 'business').actionable === true`. That's the
 * single source of truth — no ad-hoc state checks here.
 *
 * Under the v0.8 model that lands in attention only when COMPLETED
 * and the business still owes a rating, so the title is always
 * "Rate {name}".
 */
function deriveAttentionItems(dealsList: Deal[]): AttentionItem[] {
  return dealsList
    .filter((deal) =>
      getDealCaption(
        {
          state: deal.state,
          hoursLeft: deal.hoursLeft,
          completedSubstate: deal.completedSubstate,
          counterpartyFirstName: deal.influencer.name.split(' ')[0],
        },
        'business'
      ).actionable
    )
    .map((deal) => ({
      id: `att-${deal.id}`,
      state: deal.state,
      title: `Rate ${deal.influencer.name}`,
      hoursLeft: deal.hoursLeft,
      completedSubstate: deal.completedSubstate,
      counterpartyFirstName: deal.influencer.name.split(' ')[0],
      photo: deal.influencer.photo,
    }));
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
    // Active deals count (excludes RATED which is in History)
    activeDeals: deals.filter((d) => d.state !== 'RATED').length,
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
