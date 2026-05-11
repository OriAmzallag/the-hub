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
 */
export type PerkCategory =
  | 'Food'
  | 'Fitness'
  | 'Beauty'
  | 'Lifestyle'
  | 'Wellness'
  | 'Drinks';

/**
 * A single perk offer from a business.
 */
export interface Perk {
  id: string;
  title: string;
  business: string;
  businessMonogram: string;
  value: number; // NIS
  cover: string; // image URL
  requiredAction: string; // e.g., "3 IG Stories"
  requiredPlatform: PerkPlatform;
  requiredFollowers: number; // minimum followers needed
  category: PerkCategory;
  slotsLeft: number;
  slotsTotal: number;
  badge: string | null; // "Top match", "New", etc.
  expiringSoon: boolean;
}

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
