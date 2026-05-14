/**
 * Deal Archive Service
 * Mock implementation for terminal-state deal history and summary.
 *
 * Pattern mirrors services/auth.ts and services/ratings.ts —
 * interface-first design that can be swapped for Supabase later.
 */

import type { ArchivedDeal, HistoryTab, HistoryCounts, TerminalState } from '@/types/dealArchive';
import type { ViewerRole, DeclineReason } from '@/lib/dealLifecycle';
import type { Rating } from '@/types/rating';

/**
 * Deal Archive service interface.
 */
export interface DealArchiveService {
  /**
   * Get history deals filtered by tab.
   */
  getHistory(
    viewerId: string,
    viewerRole: ViewerRole,
    tab: HistoryTab
  ): Promise<ArchivedDeal[]>;

  /**
   * Get counts per tab.
   */
  getHistoryCounts(
    viewerId: string,
    viewerRole: ViewerRole
  ): Promise<HistoryCounts>;

  /**
   * Get single archived deal for summary.
   */
  getDeal(dealId: string, viewerRole: ViewerRole): Promise<ArchivedDeal>;
}

// -----------------------------------------------------------------------------
// Mock Data
// -----------------------------------------------------------------------------

/**
 * Mock archived deals.
 * IDs h-1 through h-7 to avoid collision with rating service IDs.
 */
const mockArchivedDeals: ArchivedDeal[] = [
  // RATED deals (h-1, h-2, h-3)
  {
    id: 'h-1',
    state: 'RATED',
    business: {
      id: 'fitbar-001',
      name: 'FitBar TLV',
      firstName: 'FitBar',
      monogram: 'FB',
    },
    influencer: {
      id: 'maya-001',
      name: 'Maya Cohen',
      firstName: 'Maya',
      photo: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=400&q=80',
    },
    services: ['Instagram Reel', 'Story Set'],
    serviceSummary: 'Instagram Reel + Story Set',
    money: 530,
    timeline: [
      { id: 'h1-e1', type: 'request_sent', actor: 'business', date: 'APR 28', time: '14:22' },
      { id: 'h1-e2', type: 'accepted', actor: 'influencer', date: 'APR 28', time: '16:08', detail: 'Accepted in 1h 46m' },
      { id: 'h1-e3', type: 'marked_done', actor: 'influencer', date: 'MAY 1', time: '09:30', detail: 'Content shared via WhatsApp' },
      { id: 'h1-e4', type: 'rated', actor: 'business', date: 'MAY 2', time: '11:15', detail: '5★ · 3 tags · written review' },
      { id: 'h1-e5', type: 'rated', actor: 'influencer', date: 'MAY 2', time: '14:42', detail: '5★ · 4 tags · written review' },
      { id: 'h1-e6', type: 'deal_closed', actor: 'system', date: 'MAY 2', time: '14:42' },
    ],
    ratings: {
      business: {
        id: 'r-h1-b',
        dealId: 'h-1',
        raterId: 'fitbar-001',
        raterRole: 'business',
        stars: 5,
        tags: ['On time', 'Great quality', 'Would book again'],
        review: 'Maya nailed it. The reel got 3x our usual engagement.',
        wouldWorkAgain: true,
        submittedAt: '2026-05-02T11:15:00Z',
      },
      influencer: {
        id: 'r-h1-i',
        dealId: 'h-1',
        raterId: 'maya-001',
        raterRole: 'influencer',
        stars: 5,
        tags: ['Clear brief', 'Easy to work with', 'Fair deal', 'Would work again'],
        review: 'Professional from start to finish. Fast payment, no surprises.',
        wouldWorkAgain: true,
        submittedAt: '2026-05-02T14:42:00Z',
      },
    },
    messageCount: 12,
    threadId: 'demo-thread',
    terminalDate: 'MAY 2',
  },
  {
    id: 'h-2',
    state: 'RATED',
    business: {
      id: 'sushi-bar-001',
      name: 'Sushi Bar',
      firstName: 'Sushi',
      monogram: 'SB',
    },
    influencer: {
      id: 'maya-001',
      name: 'Maya Cohen',
      firstName: 'Maya',
      photo: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=400&q=80',
    },
    services: ['Instagram Reel'],
    serviceSummary: 'Instagram Reel',
    money: 320,
    timeline: [
      { id: 'h2-e1', type: 'request_sent', actor: 'business', date: 'APR 20', time: '10:30' },
      { id: 'h2-e2', type: 'accepted', actor: 'influencer', date: 'APR 20', time: '12:15', detail: 'Accepted in 1h 45m' },
      { id: 'h2-e3', type: 'marked_done', actor: 'influencer', date: 'APR 23', time: '16:00' },
      { id: 'h2-e4', type: 'rated', actor: 'influencer', date: 'APR 24', time: '09:00', detail: '5★ · 3 tags' },
      { id: 'h2-e5', type: 'rated', actor: 'business', date: 'APR 24', time: '14:30', detail: '4★ · 2 tags' },
      { id: 'h2-e6', type: 'deal_closed', actor: 'system', date: 'APR 24', time: '14:30' },
    ],
    ratings: {
      business: {
        id: 'r-h2-b',
        dealId: 'h-2',
        raterId: 'sushi-bar-001',
        raterRole: 'business',
        stars: 4,
        tags: ['On time', 'Good comms'],
        wouldWorkAgain: false,
        submittedAt: '2026-04-24T14:30:00Z',
      },
      influencer: {
        id: 'r-h2-i',
        dealId: 'h-2',
        raterId: 'maya-001',
        raterRole: 'influencer',
        stars: 5,
        tags: ['Clear brief', 'Fast comms', 'Would work again'],
        wouldWorkAgain: true,
        submittedAt: '2026-04-24T09:00:00Z',
      },
    },
    messageCount: 8,
    threadId: 'h-thr-1',
    terminalDate: 'APR 24',
  },
  {
    id: 'h-3',
    state: 'RATED',
    business: {
      id: 'studio-movement-001',
      name: 'Studio Movement',
      firstName: 'Studio',
      monogram: 'SM',
    },
    influencer: {
      id: 'maya-001',
      name: 'Maya Cohen',
      firstName: 'Maya',
      photo: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=400&q=80',
    },
    services: ['Story Set'],
    serviceSummary: 'Story Set',
    money: 180,
    timeline: [
      { id: 'h3-e1', type: 'request_sent', actor: 'business', date: 'APR 15', time: '08:00' },
      { id: 'h3-e2', type: 'accepted', actor: 'influencer', date: 'APR 15', time: '10:30', detail: 'Accepted in 2h 30m' },
      { id: 'h3-e3', type: 'marked_done', actor: 'influencer', date: 'APR 17', time: '14:00' },
      { id: 'h3-e4', type: 'rated', actor: 'business', date: 'APR 18', time: '11:00', detail: '5★ · 4 tags · written review' },
      { id: 'h3-e5', type: 'rated', actor: 'influencer', date: 'APR 18', time: '15:00', detail: '4★ · 2 tags' },
      { id: 'h3-e6', type: 'deal_closed', actor: 'system', date: 'APR 18', time: '15:00' },
    ],
    ratings: {
      business: {
        id: 'r-h3-b',
        dealId: 'h-3',
        raterId: 'studio-movement-001',
        raterRole: 'business',
        stars: 5,
        tags: ['On time', 'Clear delivery', 'Great quality', 'Would book again'],
        review: 'Fantastic work! Maya understood exactly what we needed.',
        wouldWorkAgain: true,
        submittedAt: '2026-04-18T11:00:00Z',
      },
      influencer: {
        id: 'r-h3-i',
        dealId: 'h-3',
        raterId: 'maya-001',
        raterRole: 'influencer',
        stars: 4,
        tags: ['Easy to work with', 'Fair deal'],
        wouldWorkAgain: false,
        submittedAt: '2026-04-18T15:00:00Z',
      },
    },
    messageCount: 5,
    // Third RATED fixture reuses demo-thread since only two mock
    // threads exist; in production every deal has its own thread.
    threadId: 'demo-thread',
    terminalDate: 'APR 18',
  },

  // DECLINED deals (h-4, h-5)
  {
    id: 'h-4',
    state: 'DECLINED',
    business: {
      id: 'coffee-lab-001',
      name: 'Coffee Lab',
      firstName: 'Coffee',
      monogram: 'CL',
    },
    influencer: {
      id: 'noa-001',
      name: 'Noa Levy',
      firstName: 'Noa',
      photo: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=400&q=80',
    },
    services: ['Instagram Reel', 'Story Set'],
    serviceSummary: 'Instagram Reel + Story Set',
    money: 450,
    timeline: [
      { id: 'h4-e1', type: 'request_sent', actor: 'business', date: 'APR 25', time: '11:00' },
      { id: 'h4-e2', type: 'declined', actor: 'influencer', date: 'APR 25', time: '14:30' },
    ],
    declineReason: 'FULLY BOOKED',
    declineNote: 'Hey! Really appreciate the offer but I\'m fully booked through May. Would love to work together another time!',
    messageCount: 0,
    terminalDate: 'APR 25',
  },
  {
    id: 'h-5',
    state: 'DECLINED',
    business: {
      id: 'yoga-flow-001',
      name: 'Yoga Flow',
      firstName: 'Yoga',
      monogram: 'YF',
    },
    influencer: {
      id: 'daniel-001',
      name: 'Daniel Levi',
      firstName: 'Daniel',
      photo: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=400&q=80',
    },
    services: ['Story Set'],
    serviceSummary: 'Story Set',
    money: 200,
    timeline: [
      { id: 'h5-e1', type: 'request_sent', actor: 'business', date: 'APR 22', time: '09:00' },
      { id: 'h5-e2', type: 'declined', actor: 'influencer', date: 'APR 22', time: '10:15' },
    ],
    declineReason: 'WRONG FIT',
    // No note - exercises the fallback
    messageCount: 0,
    terminalDate: 'APR 22',
  },

  // EXPIRED deals (h-6, h-7)
  {
    id: 'h-6',
    state: 'EXPIRED',
    business: {
      id: 'green-bowl-001',
      name: 'Green Bowl',
      firstName: 'Green',
      monogram: 'GB',
    },
    influencer: {
      id: 'amit-001',
      name: 'Amit Golan',
      firstName: 'Amit',
      photo: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&q=80',
    },
    services: ['Instagram Reel'],
    serviceSummary: 'Instagram Reel',
    money: 350,
    timeline: [
      { id: 'h6-e1', type: 'request_sent', actor: 'business', date: 'APR 10', time: '15:00' },
      { id: 'h6-e2', type: 'viewed', actor: 'influencer', date: 'APR 10', time: '18:30' },
      { id: 'h6-e3', type: 'expired', actor: 'system', date: 'APR 12', time: '15:00', detail: '48h window closed' },
    ],
    messageCount: 0,
    terminalDate: 'APR 12',
  },
  {
    id: 'h-7',
    state: 'EXPIRED',
    business: {
      id: 'tech-hub-001',
      name: 'Tech Hub',
      firstName: 'Tech',
      monogram: 'TH',
    },
    influencer: {
      id: 'yael-001',
      name: 'Yael Shapira',
      firstName: 'Yael',
      photo: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=400&q=80',
    },
    services: ['Story Set'],
    serviceSummary: 'Story Set',
    money: 150,
    timeline: [
      { id: 'h7-e1', type: 'request_sent', actor: 'business', date: 'APR 5', time: '12:00' },
      { id: 'h7-e2', type: 'viewed', actor: 'influencer', date: 'APR 5', time: '14:15' },
      { id: 'h7-e3', type: 'expired', actor: 'system', date: 'APR 7', time: '12:00', detail: '48h window closed' },
    ],
    messageCount: 0,
    terminalDate: 'APR 7',
  },
];

// -----------------------------------------------------------------------------
// Mock Implementation
// -----------------------------------------------------------------------------

/**
 * Simulate network delay.
 */
function delay(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

/**
 * Map HistoryTab to TerminalState.
 */
function tabToState(tab: HistoryTab): TerminalState {
  switch (tab) {
    case 'completed':
      return 'RATED';
    case 'declined':
      return 'DECLINED';
    case 'expired':
      return 'EXPIRED';
  }
}

/**
 * Mock deal archive service implementation.
 */
class MockDealArchiveService implements DealArchiveService {
  async getHistory(
    viewerId: string,
    viewerRole: ViewerRole,
    tab: HistoryTab
  ): Promise<ArchivedDeal[]> {
    await delay(150);

    const state = tabToState(tab);
    return mockArchivedDeals.filter((deal) => deal.state === state);
  }

  async getHistoryCounts(
    viewerId: string,
    viewerRole: ViewerRole
  ): Promise<HistoryCounts> {
    await delay(100);

    return {
      completed: mockArchivedDeals.filter((d) => d.state === 'RATED').length,
      declined: mockArchivedDeals.filter((d) => d.state === 'DECLINED').length,
      expired: mockArchivedDeals.filter((d) => d.state === 'EXPIRED').length,
    };
  }

  async getDeal(dealId: string, viewerRole: ViewerRole): Promise<ArchivedDeal> {
    await delay(150);

    const deal = mockArchivedDeals.find((d) => d.id === dealId);
    if (!deal) {
      throw new Error(`Deal not found: ${dealId}`);
    }

    return deal;
  }
}

/**
 * Singleton deal archive service instance.
 */
export const dealArchiveService: DealArchiveService = new MockDealArchiveService();
