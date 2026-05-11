/**
 * Mock Influencer Perks Data
 * Mock data for the Influencer Discover (Perks) feature.
 */

import type { Perk, PerkRow, ViewerReach, PerkCategory, PerkSortOption } from '@/types/perk';

/**
 * Maya's reach for qualification checks.
 * IG: 47.2K, TikTok: 82.1K, YouTube: 8.4K
 */
export const VIEWER_REACH: ViewerReach = {
  IG: 47200,
  TikTok: 82100,
  YouTube: 8400,
};

/**
 * Mock perks from various businesses.
 */
export const PERKS: Perk[] = [
  {
    id: 'p-1',
    title: 'Dinner for two',
    business: 'Onza',
    businessMonogram: 'ON',
    value: 400,
    cover: 'https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=600&q=80',
    requiredAction: '3 IG Stories',
    requiredPlatform: 'IG',
    requiredFollowers: 10000,
    category: 'Food',
    slotsLeft: 3,
    slotsTotal: 5,
    badge: 'Top match',
    expiringSoon: false,
  },
  {
    id: 'p-2',
    title: 'Pilates class pack',
    business: 'Studio Movement',
    businessMonogram: 'SM',
    value: 580,
    cover: 'https://images.unsplash.com/photo-1518611012118-696072aa579a?w=600&q=80',
    requiredAction: '1 IG Reel',
    requiredPlatform: 'IG',
    requiredFollowers: 25000,
    category: 'Fitness',
    slotsLeft: 2,
    slotsTotal: 4,
    badge: null,
    expiringSoon: false,
  },
  {
    id: 'p-3',
    title: 'Skincare bundle',
    business: 'BeautyBar',
    businessMonogram: 'BB',
    value: 320,
    cover: 'https://images.unsplash.com/photo-1556228720-195a672e8a03?w=600&q=80',
    requiredAction: 'TikTok review',
    requiredPlatform: 'TikTok',
    requiredFollowers: 50000,
    category: 'Beauty',
    slotsLeft: 1,
    slotsTotal: 5,
    badge: null,
    expiringSoon: true,
  },
  {
    id: 'p-4',
    title: 'Cocktails at Bellboy',
    business: 'Bellboy',
    businessMonogram: 'BB',
    value: 280,
    cover: 'https://images.unsplash.com/photo-1551024601-bec78aea704b?w=600&q=80',
    requiredAction: '2 IG Stories',
    requiredPlatform: 'IG',
    requiredFollowers: 100000,
    category: 'Drinks',
    slotsLeft: 4,
    slotsTotal: 5,
    badge: null,
    expiringSoon: false,
  },
  {
    id: 'p-5',
    title: 'Coffee + brunch',
    business: 'FitBar TLV',
    businessMonogram: 'FB',
    value: 180,
    cover: 'https://images.unsplash.com/photo-1497515114629-f71d768fd07c?w=600&q=80',
    requiredAction: '1 IG Story',
    requiredPlatform: 'IG',
    requiredFollowers: 5000,
    category: 'Food',
    slotsLeft: 8,
    slotsTotal: 10,
    badge: 'New',
    expiringSoon: false,
  },
  {
    id: 'p-6',
    title: 'Sushi tasting',
    business: 'Sushi Bar',
    businessMonogram: 'SB',
    value: 450,
    cover: 'https://images.unsplash.com/photo-1579871494447-9811cf80d66c?w=600&q=80',
    requiredAction: '1 IG Reel',
    requiredPlatform: 'IG',
    requiredFollowers: 30000,
    category: 'Food',
    slotsLeft: 2,
    slotsTotal: 3,
    badge: null,
    expiringSoon: false,
  },
];

/**
 * Curated perk rows for the Discover screen.
 */
export const PERK_ROWS: PerkRow[] = [
  {
    id: 'row-match',
    title: 'Top match for Maya',
    subtitle: 'Based on your categories',
    perkIds: ['p-1', 'p-2', 'p-5'],
  },
  {
    id: 'row-expiring',
    title: 'Expiring soon',
    subtitle: null,
    perkIds: ['p-3', 'p-6'],
  },
  {
    id: 'row-new',
    title: 'New perks',
    subtitle: null,
    perkIds: ['p-5', 'p-4', 'p-2'],
  },
  {
    id: 'row-tlv',
    title: 'Near you in Tel Aviv',
    subtitle: null,
    perkIds: ['p-1', 'p-4', 'p-6', 'p-3', 'p-5'],
  },
];

/**
 * Category chips for the top bar (includes "All").
 */
export const CATEGORIES_CHIPS: string[] = [
  'All',
  'Food',
  'Fitness',
  'Beauty',
  'Lifestyle',
  'Wellness',
  'Drinks',
];

/**
 * Category options for the filter sheet (no "All").
 */
export const CATEGORIES_FILTER: PerkCategory[] = [
  'Food',
  'Fitness',
  'Beauty',
  'Lifestyle',
  'Wellness',
  'Drinks',
];

/**
 * Sort options for the filter sheet.
 */
export const SORT_OPTIONS: { id: PerkSortOption; label: string }[] = [
  { id: 'recommended', label: 'Recommended' },
  { id: 'value_high', label: 'Value: high → low' },
  { id: 'newest', label: 'Newest' },
  { id: 'expiring', label: 'Expiring soonest' },
];

/**
 * Get a perk by ID.
 */
export function getPerkById(id: string): Perk | undefined {
  return PERKS.find((p) => p.id === id);
}

/**
 * Get perks for a row.
 */
export function getPerksForRow(row: PerkRow): Perk[] {
  return row.perkIds
    .map((id) => getPerkById(id))
    .filter((p): p is Perk => p !== undefined);
}
