/**
 * Influencer Storefront Types
 * UI-specific types for the public influencer storefront screen.
 */

/**
 * Platform info for social media display
 */
export interface InfluencerPlatform {
  name: string;
  icon: 'instagram' | 'tiktok' | 'youtube';
  followers: string;
}

/**
 * Service offering available for booking
 */
export interface InfluencerService {
  id: number;
  name: string;
  platform: string;
  price: number;
  delivery: string;
}

/**
 * Review from a business
 */
export interface InfluencerReview {
  from: string;
  rating: number;
  text: string;
  booked: string;
  date: string;
}

/**
 * Full storefront data for display
 */
export interface InfluencerStorefront {
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
  platforms: InfluencerPlatform[];
  portfolio: string[];
  services: InfluencerService[];
  reviewsPreview: InfluencerReview[];
}
