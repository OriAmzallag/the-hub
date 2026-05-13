/**
 * Rating Tag Taxonomies
 * Role-specific tag options for rating flow.
 */

import type { ViewerRole } from '@/lib/dealLifecycle';
import type {
  BusinessRatesInfluencerTag,
  InfluencerRatesBusinessTag,
  RatingTag,
} from '@/types/rating';

/**
 * Tags shown when a business rates an influencer.
 */
export const BUSINESS_RATES_INFLUENCER_TAGS: readonly BusinessRatesInfluencerTag[] =
  [
    'On time',
    'Clear delivery',
    'Great quality',
    'Good comms',
    'Knew the brand',
    'Would book again',
  ] as const;

/**
 * Tags shown when an influencer rates a business.
 */
export const INFLUENCER_RATES_BUSINESS_TAGS: readonly InfluencerRatesBusinessTag[] =
  [
    'Clear brief',
    'Easy to work with',
    'Fast comms',
    'Trusted my creativity',
    'Fair deal',
    'Would work again',
  ] as const;

/**
 * Get the appropriate tag set for a given viewer role.
 */
export function getTagsForRole(viewerRole: ViewerRole): readonly RatingTag[] {
  return viewerRole === 'business'
    ? BUSINESS_RATES_INFLUENCER_TAGS
    : INFLUENCER_RATES_BUSINESS_TAGS;
}

/**
 * Check if a tag is the "Would work/book again" signal tag.
 */
export function isWouldWorkAgainTag(tag: RatingTag): boolean {
  return tag === 'Would book again' || tag === 'Would work again';
}

/**
 * Extract the wouldWorkAgain boolean from a tag array.
 */
export function extractWouldWorkAgain(tags: RatingTag[]): boolean {
  return tags.some(isWouldWorkAgainTag);
}
