/**
 * Profile Screen Types
 * UI-specific types for the Business and Influencer profile screens.
 * These are UI mock shapes, NOT database entity types.
 */

/**
 * Mini stat item for the 3-up stats row
 */
export interface MiniStatItem {
  value: string;
  label: string;
  hasAccentStar?: boolean;
}

/**
 * Profile row item for navigation rows
 */
export interface ProfileRowItem {
  id: string;
  icon: string;
  label: string;
  hint?: string;
  route?: string;
}

/**
 * Business profile data for the profile screen
 */
export interface BusinessProfile {
  id: string;
  name: string;
  verified: boolean;
  stats: {
    deals: number;
    bookingValue: number;
    rating: number;
  };
}

/**
 * Influencer profile data extends the storefront type
 * with additional profile-specific computed values
 */
export interface InfluencerProfileData {
  id: string;
  name: string;
  verified: boolean;
  available: boolean;
  location: string;
  avatarUri: string | null;
  stats: {
    deals: number;
    bookingValue: number;
    rating: number;
  };
}
