/**
 * Mock Business Profile Data
 * FitBar TLV - sample business for development and testing.
 */

import type { BusinessProfile } from '@/types/profile';

export const FITBAR_TLV: BusinessProfile = {
  id: 'fitbar-tlv-1',
  name: 'FitBar TLV',
  verified: true,
  stats: {
    deals: 47,
    bookingValue: 19420,
    rating: 4.9,
  },
};

/**
 * Get business profile by ID (for future dynamic loading)
 * Currently always returns FitBar for MVP.
 */
export function getBusinessProfile(_id: string): BusinessProfile {
  // TODO: Fetch from Supabase by ID
  return FITBAR_TLV;
}
