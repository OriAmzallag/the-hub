/**
 * Ratings Service
 * Mock implementation for rating flow.
 *
 * Pattern mirrors services/auth.ts — interface-first design
 * that can be swapped for Supabase later.
 */

import type { ViewerRole, CompletedSubstate } from '@/lib/dealLifecycle';
import type {
  Rating,
  RatingInput,
  RatingDealContext,
  StarRating,
} from '@/types/rating';
import { extractWouldWorkAgain } from '@/lib/ratingTags';

/**
 * Ratings service interface.
 */
export interface RatingsService {
  /**
   * Get deal context for rating flow.
   */
  getDealContext(
    dealId: string,
    viewerId: string,
    viewerRole: ViewerRole
  ): Promise<RatingDealContext>;

  /**
   * Submit a rating.
   */
  submitRating(
    input: RatingInput,
    raterId: string,
    raterRole: ViewerRole
  ): Promise<{
    rating: Rating;
    dealState: 'COMPLETED' | 'RATED';
    completedSubstate?: CompletedSubstate;
  }>;

  /**
   * Get both ratings for mutual reveal.
   */
  getRatings(
    dealId: string,
    viewerRole: ViewerRole
  ): Promise<{
    viewerRating: Rating;
    counterpartyRating: Rating;
  }>;
}

// -----------------------------------------------------------------------------
// Mock Implementation
// -----------------------------------------------------------------------------

/**
 * In-memory storage for mock ratings.
 */
const mockRatings: Map<string, Rating> = new Map();

/**
 * Mock deal data for the rating flow.
 * Keys are dealId, values contain counterparty info for each role.
 */
const mockDeals: Record<
  string,
  {
    businessId: string;
    influencerId: string;
    influencer: { name: string; firstName: string; photo: string };
    business: { name: string; firstName: string; monogram: string };
    services: string;
    money: number;
    completedSubstate: CompletedSubstate;
  }
> = {
  'deal-3': {
    businessId: 'avi-001',
    influencerId: 'maya-001',
    influencer: {
      name: 'Yael Shapira',
      firstName: 'Yael',
      photo:
        'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=400&q=80',
    },
    business: {
      name: 'FitBar TLV',
      firstName: 'FitBar',
      monogram: 'FB',
    },
    services: 'Instagram Reel + Story Set',
    money: 420,
    completedSubstate: 'neither-rated',
  },
  'deal-4': {
    businessId: 'avi-001',
    influencerId: 'maya-001',
    influencer: {
      name: 'Daniel Levi',
      firstName: 'Daniel',
      photo:
        'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=400&q=80',
    },
    business: {
      name: 'FitBar TLV',
      firstName: 'FitBar',
      monogram: 'FB',
    },
    services: 'Story Set',
    money: 180,
    completedSubstate: 'influencer-rated',
  },
  'deal-5': {
    businessId: 'avi-001',
    influencerId: 'maya-001',
    influencer: {
      name: 'Amit Golan',
      firstName: 'Amit',
      photo:
        'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&q=80',
    },
    business: {
      name: 'Studio Movement',
      firstName: 'Studio',
      monogram: 'SM',
    },
    services: 'Instagram Reel',
    money: 290,
    completedSubstate: 'business-rated',
  },
  // Pre-populated ratings for testing mutual reveal
  'deal-rated-1': {
    businessId: 'avi-001',
    influencerId: 'maya-001',
    influencer: {
      name: 'Maya Cohen',
      firstName: 'Maya',
      photo:
        'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=400&q=80',
    },
    business: {
      name: 'FitBar TLV',
      firstName: 'FitBar',
      monogram: 'FB',
    },
    services: 'Instagram Reel + Story Set',
    money: 530,
    completedSubstate: 'neither-rated', // Will be RATED when both exist
  },
};

// Pre-populate some ratings for testing mutual reveal
mockRatings.set('deal-rated-1-business', {
  id: 'rating-1',
  dealId: 'deal-rated-1',
  raterId: 'avi-001',
  raterRole: 'business',
  stars: 5,
  tags: ['On time', 'Clear delivery', 'Great quality', 'Would book again'],
  review: 'Amazing collaboration! Delivered exactly what we needed.',
  wouldWorkAgain: true,
  submittedAt: '2026-05-12T10:00:00Z',
});

mockRatings.set('deal-rated-1-influencer', {
  id: 'rating-2',
  dealId: 'deal-rated-1',
  raterId: 'maya-001',
  raterRole: 'influencer',
  stars: 5,
  tags: ['Clear brief', 'Easy to work with', 'Fair deal', 'Would work again'],
  review: 'Professional from first DM. Fast payment, no surprises.',
  wouldWorkAgain: true,
  submittedAt: '2026-05-12T11:00:00Z',
});

// Pre-populate a rating for deal-4 (influencer already rated)
mockRatings.set('deal-4-influencer', {
  id: 'rating-3',
  dealId: 'deal-4',
  raterId: 'maya-001',
  raterRole: 'influencer',
  stars: 4,
  tags: ['Clear brief', 'Fast comms'],
  review: 'Good experience overall.',
  wouldWorkAgain: false,
  submittedAt: '2026-05-11T15:00:00Z',
});

// Pre-populate a rating for deal-5 (business already rated)
mockRatings.set('deal-5-business', {
  id: 'rating-4',
  dealId: 'deal-5',
  raterId: 'avi-001',
  raterRole: 'business',
  stars: 5,
  tags: ['On time', 'Great quality', 'Would book again'],
  wouldWorkAgain: true,
  submittedAt: '2026-05-10T09:00:00Z',
});

/**
 * Simulate network delay.
 */
function delay(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

/**
 * Generate a unique ID.
 */
function generateId(): string {
  return `rating-${Date.now()}-${Math.random().toString(36).slice(2, 9)}`;
}

/**
 * Mock ratings service implementation.
 */
class MockRatingsService implements RatingsService {
  async getDealContext(
    dealId: string,
    viewerId: string,
    viewerRole: ViewerRole
  ): Promise<RatingDealContext> {
    await delay(150);

    const deal = mockDeals[dealId];
    if (!deal) {
      throw new Error(`Deal not found: ${dealId}`);
    }

    const isBusinessViewer = viewerRole === 'business';

    // Get existing ratings
    const viewerRatingKey = `${dealId}-${viewerRole}`;
    const counterpartyRatingKey = `${dealId}-${isBusinessViewer ? 'influencer' : 'business'}`;

    const viewerRating = mockRatings.get(viewerRatingKey);
    const counterpartyRating = mockRatings.get(counterpartyRatingKey);

    return {
      id: dealId,
      counterparty: isBusinessViewer
        ? {
            id: deal.influencerId,
            name: deal.influencer.name,
            firstName: deal.influencer.firstName,
            photo: deal.influencer.photo,
          }
        : {
            id: deal.businessId,
            name: deal.business.name,
            firstName: deal.business.firstName,
            monogram: deal.business.monogram,
          },
      services: deal.services,
      money: deal.money,
      viewerRole,
      viewerRating,
      counterpartyRating,
    };
  }

  async submitRating(
    input: RatingInput,
    raterId: string,
    raterRole: ViewerRole
  ): Promise<{
    rating: Rating;
    dealState: 'COMPLETED' | 'RATED';
    completedSubstate?: CompletedSubstate;
  }> {
    await delay(300);

    const deal = mockDeals[input.dealId];
    if (!deal) {
      throw new Error(`Deal not found: ${input.dealId}`);
    }

    // Create the rating
    const rating: Rating = {
      id: generateId(),
      dealId: input.dealId,
      raterId,
      raterRole,
      stars: input.stars,
      tags: input.tags,
      review: input.review,
      wouldWorkAgain: extractWouldWorkAgain(input.tags),
      submittedAt: new Date().toISOString(),
    };

    // Store the rating
    const ratingKey = `${input.dealId}-${raterRole}`;
    mockRatings.set(ratingKey, rating);

    // Check if counterparty has rated
    const counterpartyRole = raterRole === 'business' ? 'influencer' : 'business';
    const counterpartyRatingKey = `${input.dealId}-${counterpartyRole}`;
    const counterpartyRating = mockRatings.get(counterpartyRatingKey);

    if (counterpartyRating) {
      // Both have rated -> RATED state
      return {
        rating,
        dealState: 'RATED',
      };
    }

    // Only viewer has rated -> update completedSubstate
    const newSubstate: CompletedSubstate =
      raterRole === 'business' ? 'business-rated' : 'influencer-rated';
    deal.completedSubstate = newSubstate;

    return {
      rating,
      dealState: 'COMPLETED',
      completedSubstate: newSubstate,
    };
  }

  async getRatings(
    dealId: string,
    viewerRole: ViewerRole
  ): Promise<{
    viewerRating: Rating;
    counterpartyRating: Rating;
  }> {
    await delay(150);

    const viewerRatingKey = `${dealId}-${viewerRole}`;
    const counterpartyRole =
      viewerRole === 'business' ? 'influencer' : 'business';
    const counterpartyRatingKey = `${dealId}-${counterpartyRole}`;

    const viewerRating = mockRatings.get(viewerRatingKey);
    const counterpartyRating = mockRatings.get(counterpartyRatingKey);

    if (!viewerRating || !counterpartyRating) {
      throw new Error('Both ratings required for mutual reveal');
    }

    return {
      viewerRating,
      counterpartyRating,
    };
  }
}

/**
 * Singleton ratings service instance.
 */
export const ratingsService: RatingsService = new MockRatingsService();
