/**
 * Rating Type Definitions
 * Types for the rating flow feature.
 */

import type { ViewerRole } from '@/lib/dealLifecycle';

/**
 * Star rating value (1-5).
 */
export type StarRating = 1 | 2 | 3 | 4 | 5;

/**
 * Business rates Influencer tag taxonomy.
 */
export type BusinessRatesInfluencerTag =
  | 'On time'
  | 'Clear delivery'
  | 'Great quality'
  | 'Good comms'
  | 'Knew the brand'
  | 'Would book again';

/**
 * Influencer rates Business tag taxonomy.
 */
export type InfluencerRatesBusinessTag =
  | 'Clear brief'
  | 'Easy to work with'
  | 'Fast comms'
  | 'Trusted my creativity'
  | 'Fair deal'
  | 'Would work again';

/**
 * Union of all rating tags.
 */
export type RatingTag = BusinessRatesInfluencerTag | InfluencerRatesBusinessTag;

/**
 * Single rating record.
 */
export interface Rating {
  id: string;
  dealId: string;
  raterId: string;
  raterRole: ViewerRole;
  stars: StarRating;
  tags: RatingTag[];
  review?: string;
  wouldWorkAgain: boolean;
  submittedAt: string;
}

/**
 * Input for submitting a rating.
 */
export interface RatingInput {
  dealId: string;
  stars: StarRating;
  tags: RatingTag[];
  review?: string;
}

/**
 * Deal context for the rating flow.
 */
export interface RatingDealContext {
  id: string;
  counterparty: {
    id: string;
    name: string;
    firstName: string;
    photo?: string;
    monogram?: string;
  };
  services: string;
  money: number;
  viewerRole: ViewerRole;
  viewerRating?: Rating;
  counterpartyRating?: Rating;
}

/**
 * Star label mapping.
 */
export const STAR_LABELS: Record<StarRating, string> = {
  1: 'Poor',
  2: 'Below average',
  3: 'OK',
  4: 'Great',
  5: 'Excellent',
};
