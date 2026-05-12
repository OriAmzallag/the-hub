/**
 * Perk Types
 * Types for the Influencer Discover (Perks) feature.
 */

/**
 * Platform identifiers for reach/qualification checks.
 * Maps to MAYA_COHEN.platforms[].name in a normalized form.
 */
export type PerkPlatform = 'IG' | 'TikTok' | 'YouTube';

/**
 * Category options for perks.
 * Expanded to support onboarding categories for both business and influencer flows.
 * Base 8: Food, Fitness, Beauty, Lifestyle, Wellness, Drinks, Fashion, Tech
 * Added: Travel, Home (business), Music, Gaming (influencer)
 */
export type PerkCategory =
  | 'Food'
  | 'Fitness'
  | 'Beauty'
  | 'Lifestyle'
  | 'Wellness'
  | 'Drinks'
  | 'Fashion'
  | 'Tech'
  | 'Travel'
  | 'Home'
  | 'Music'
  | 'Gaming';

/**
 * A single deliverable requirement within a perk.
 * The influencer must meet the requiredFollowers threshold on the
 * specified platform to qualify for this deliverable.
 */
export interface PerkDeliverable {
  platform: PerkPlatform;
  action: string; // e.g., "3 Stories", "1 Reel"
  requiredFollowers: number;
  description?: string; // detailed instructions, used on detail screen
}

/**
 * A single perk offer from a business (list view shape).
 */
export interface Perk {
  id: string;
  title: string;
  business: string; // business name for list display
  businessMonogram: string;
  value: number; // NIS
  cover: string; // image URL
  deliverables: PerkDeliverable[]; // 1+ deliverables
  category: PerkCategory;
  slotsLeft: number;
  slotsTotal: number;
  badge: string | null; // "Top match", "New", etc.
  expiringSoon: boolean;
}

/**
 * Business info object for detail view (richer than list string).
 */
export interface PerkBusinessInfo {
  name: string;
  monogram: string;
  verified: boolean;
  rating: number;
  deals: number;
  location: string;
}

/**
 * Full perk detail shape (extends list perk with detail-only fields).
 */
export interface PerkDetail {
  id: string;
  title: string;
  category: PerkCategory;
  business: PerkBusinessInfo;
  value: number;
  cover: string;
  deliverables: PerkDeliverable[];
  deadline: string;
  description: string; // perk-level description prose
  slotsLeft: number;
  slotsTotal: number;
  expiresOn: string;
  badge: string | null;
  expiringSoon: boolean;
}

/**
 * Qualification status for a perk (all, some, or none of deliverables met).
 */
export type QualificationStatus = 'full' | 'partial' | 'none';

/**
 * A curated row of perks (for "Top match", "Expiring soon", etc.)
 */
export interface PerkRow {
  id: string;
  title: string;
  subtitle: string | null;
  perkIds: string[];
}

/**
 * Viewer reach data for qualification checks.
 * Keys match PerkPlatform type.
 */
export interface ViewerReach {
  IG: number;
  TikTok: number;
  YouTube: number;
}

/**
 * Sort options for the filter sheet.
 */
export type PerkSortOption =
  | 'recommended'
  | 'value_high'
  | 'newest'
  | 'expiring';

/**
 * Filter state shape for the Discover screen.
 */
export interface PerkFilterState {
  categories: PerkCategory[];
  valueMin: number;
  valueMax: number;
  qualifyOnly: boolean;
  expiringSoonOnly: boolean;
  sort: PerkSortOption;
}
