/**
 * Talent Storefront Types
 * UI-specific types for the public talent storefront screen.
 */

/**
 * Platform info for social media display
 */
export interface TalentPlatform {
  name: string;
  icon: 'instagram' | 'tiktok' | 'youtube';
  followers: string;
}

/**
 * Service offering available for booking
 */
export interface TalentService {
  id: number;
  name: string;
  platform: string;
  price: number;
  delivery: string;
}

/**
 * Review from a business
 */
export interface TalentReview {
  from: string;
  rating: number;
  text: string;
  booked: string;
  date: string;
}

/**
 * Full storefront data for display
 */
export interface TalentStorefront {
  id: string;
  name: string;
  handle: string;
  bio: string | null;
  location: string;
  verified: boolean;
  available: boolean;
  rating: number;
  reviewCount: number;
  reach: string;
  categories: string[];
  platforms: TalentPlatform[];
  portfolio: string[];
  services: TalentService[];
  reviewsPreview: TalentReview[];
}
