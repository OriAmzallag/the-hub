export type UserRole = "influencer" | "business";

export interface Profile {
  id: string;
  user_id: string;
  role: UserRole;
  full_name: string;
  avatar_url?: string;
  bio?: string;
  tagline?: string;
  location?: string;
  created_at: string;
}

export interface InfluencerPlatform {
  id: string;
  influencer_id: string;
  platform_name: string;
  profile_url?: string;
  followers_count: number;
}

export interface Service {
  id: string;
  influencer_id: string;
  platform: string;
  service_type: string;
  price: number;
  currency: string;
}

export interface InfluencerProfile extends Profile {
  role: "influencer";
  niche: string[];
  platforms: string[];
  engagement_rate?: number;
  gallery_images?: string[];
}

export interface BusinessProfile extends Profile {
  role: "business";
  company_name: string;
  industry: string;
  website?: string;
}

// Local wizard state types (used in registration form, not stored directly)
export interface PlatformEntry {
  platform_name: string;
  profile_url: string;
  followers_count: string;
}

export interface ServiceEntry {
  platform: string;
  service_type: string;
  price: string;
}
