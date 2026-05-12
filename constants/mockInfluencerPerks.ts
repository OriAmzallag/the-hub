/**
 * Mock Influencer Perks Data
 * Mock data for the Influencer Discover (Perks) feature.
 */

import type {
  Perk,
  PerkDetail,
  PerkRow,
  ViewerReach,
  PerkCategory,
  PerkSortOption,
} from '@/types/perk';

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
 * Updated to use deliverables[] array per v2 data model.
 */
export const PERKS: Perk[] = [
  {
    id: 'p-1',
    title: 'Dinner for two',
    business: 'Onza',
    businessMonogram: 'ON',
    value: 400,
    cover: 'https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=600&q=80',
    deliverables: [
      {
        platform: 'IG',
        action: '3 Stories',
        requiredFollowers: 10000,
        description:
          'Three Instagram Stories featuring your meal at Onza. Tag @onza_tlv and use #onzatlv.',
      },
    ],
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
    deliverables: [
      {
        platform: 'IG',
        action: '1 Reel',
        requiredFollowers: 25000,
        description:
          'One Instagram Reel showcasing your Pilates session. Highlight the studio atmosphere and tag @studio_movement.',
      },
      {
        platform: 'TikTok',
        action: '1 Reel',
        requiredFollowers: 30000,
        description:
          'One TikTok video of your class experience. Show the workout in action and tag @studiomovement_tlv.',
      },
    ],
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
    deliverables: [
      {
        platform: 'TikTok',
        action: '1 Review',
        requiredFollowers: 50000,
        description:
          'One TikTok review video showing you unboxing and testing the skincare products. Share your honest first impressions.',
      },
    ],
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
    deliverables: [
      {
        platform: 'IG',
        action: '2 Stories',
        requiredFollowers: 100000,
        description:
          'Two Instagram Stories capturing the cocktail experience at Bellboy. Show the drinks, the vibe, and tag @bellboy_bar.',
      },
    ],
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
    deliverables: [
      {
        platform: 'IG',
        action: '1 Story',
        requiredFollowers: 5000,
        description:
          'One Instagram Story of your brunch at FitBar. Show the food, the coffee, and tag @fitbar_tlv.',
      },
    ],
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
    deliverables: [
      {
        platform: 'IG',
        action: '1 Reel',
        requiredFollowers: 30000,
        description:
          'One Instagram Reel showcasing the sushi tasting experience. Capture the presentation and flavors.',
      },
      {
        platform: 'TikTok',
        action: '1 Story',
        requiredFollowers: 200000,
        description:
          'One TikTok Story showing behind-the-scenes of your sushi experience. Tag @sushibar_tlv.',
      },
    ],
    category: 'Food',
    slotsLeft: 2,
    slotsTotal: 3,
    badge: null,
    expiringSoon: false,
  },
];

/**
 * Detailed perk data for the detail screen.
 * Includes richer business info, deadline, and perk description.
 */
export const PERK_DETAILS: Record<string, PerkDetail> = {
  'p-1': {
    id: 'p-1',
    title: 'Dinner for two',
    category: 'Food',
    business: {
      name: 'Onza',
      monogram: 'ON',
      verified: true,
      rating: 4.7,
      deals: 24,
      location: 'Tel Aviv',
    },
    value: 400,
    cover: 'https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=1200&q=80',
    deliverables: [
      {
        platform: 'IG',
        action: '3 Stories',
        requiredFollowers: 10000,
        description:
          'Three Instagram Stories featuring your meal at Onza. Tag @onza_tlv and use #onzatlv.',
      },
    ],
    deadline: 'Within 7 days of claiming',
    description:
      'A multi-course tasting menu for two at Onza, including a glass of natural wine each. Dietary preferences accommodated with 48h notice.',
    slotsLeft: 3,
    slotsTotal: 5,
    expiresOn: 'May 18',
    badge: 'Top match',
    expiringSoon: false,
  },
  'p-2': {
    id: 'p-2',
    title: 'Pilates class pack',
    category: 'Fitness',
    business: {
      name: 'Studio Movement',
      monogram: 'SM',
      verified: true,
      rating: 4.9,
      deals: 18,
      location: 'Tel Aviv',
    },
    value: 580,
    cover: 'https://images.unsplash.com/photo-1518611012118-696072aa579a?w=1200&q=80',
    deliverables: [
      {
        platform: 'IG',
        action: '1 Reel',
        requiredFollowers: 25000,
        description:
          'One Instagram Reel showcasing your Pilates session. Highlight the studio atmosphere and tag @studio_movement.',
      },
      {
        platform: 'TikTok',
        action: '1 Reel',
        requiredFollowers: 30000,
        description:
          'One TikTok video of your class experience. Show the workout in action and tag @studiomovement_tlv.',
      },
    ],
    deadline: 'Within 7 days of claiming',
    description:
      'A 5-class Pilates pack at Studio Movement. Choose from reformer, mat, or barre classes. Book any time that works for you.',
    slotsLeft: 2,
    slotsTotal: 4,
    expiresOn: 'May 25',
    badge: null,
    expiringSoon: false,
  },
  'p-3': {
    id: 'p-3',
    title: 'Skincare bundle',
    category: 'Beauty',
    business: {
      name: 'BeautyBar',
      monogram: 'BB',
      verified: true,
      rating: 4.5,
      deals: 31,
      location: 'Tel Aviv',
    },
    value: 320,
    cover: 'https://images.unsplash.com/photo-1556228720-195a672e8a03?w=1200&q=80',
    deliverables: [
      {
        platform: 'TikTok',
        action: '1 Review',
        requiredFollowers: 50000,
        description:
          'One TikTok review video showing you unboxing and testing the skincare products. Share your honest first impressions.',
      },
    ],
    deadline: 'Within 7 days of claiming',
    description:
      'A curated skincare bundle including cleanser, serum, and moisturizer from BeautyBar. All products are cruelty-free and vegan.',
    slotsLeft: 1,
    slotsTotal: 5,
    expiresOn: 'May 14',
    badge: null,
    expiringSoon: true,
  },
  'p-4': {
    id: 'p-4',
    title: 'Cocktails at Bellboy',
    category: 'Drinks',
    business: {
      name: 'Bellboy',
      monogram: 'BB',
      verified: true,
      rating: 4.8,
      deals: 42,
      location: 'Tel Aviv',
    },
    value: 280,
    cover: 'https://images.unsplash.com/photo-1551024601-bec78aea704b?w=1200&q=80',
    deliverables: [
      {
        platform: 'IG',
        action: '2 Stories',
        requiredFollowers: 100000,
        description:
          'Two Instagram Stories capturing the cocktail experience at Bellboy. Show the drinks, the vibe, and tag @bellboy_bar.',
      },
    ],
    deadline: 'Within 7 days of claiming',
    description:
      "Four signature cocktails at Bellboy, one of Tel Aviv's most iconic speakeasy bars. Reservations required.",
    slotsLeft: 4,
    slotsTotal: 5,
    expiresOn: 'May 30',
    badge: null,
    expiringSoon: false,
  },
  'p-5': {
    id: 'p-5',
    title: 'Coffee + brunch',
    category: 'Food',
    business: {
      name: 'FitBar TLV',
      monogram: 'FB',
      verified: false,
      rating: 4.4,
      deals: 8,
      location: 'Tel Aviv',
    },
    value: 180,
    cover: 'https://images.unsplash.com/photo-1497515114629-f71d768fd07c?w=1200&q=80',
    deliverables: [
      {
        platform: 'IG',
        action: '1 Story',
        requiredFollowers: 5000,
        description:
          'One Instagram Story of your brunch at FitBar. Show the food, the coffee, and tag @fitbar_tlv.',
      },
    ],
    deadline: 'Within 7 days of claiming',
    description:
      'Brunch for two at FitBar TLV, including any two main dishes and specialty coffee. Perfect for health-conscious foodies.',
    slotsLeft: 8,
    slotsTotal: 10,
    expiresOn: 'Jun 1',
    badge: 'New',
    expiringSoon: false,
  },
  'p-6': {
    id: 'p-6',
    title: 'Sushi tasting',
    category: 'Food',
    business: {
      name: 'Sushi Bar',
      monogram: 'SB',
      verified: true,
      rating: 4.6,
      deals: 15,
      location: 'Tel Aviv',
    },
    value: 450,
    cover: 'https://images.unsplash.com/photo-1579871494447-9811cf80d66c?w=1200&q=80',
    deliverables: [
      {
        platform: 'IG',
        action: '1 Reel',
        requiredFollowers: 30000,
        description:
          'One Instagram Reel showcasing the sushi tasting experience. Capture the presentation and flavors.',
      },
      {
        platform: 'TikTok',
        action: '1 Story',
        requiredFollowers: 200000,
        description:
          'One TikTok Story showing behind-the-scenes of your sushi experience. Tag @sushibar_tlv.',
      },
    ],
    deadline: 'Within 7 days of claiming',
    description:
      "An omakase-style sushi tasting for two at Sushi Bar. Chef's selection of 12 pieces plus miso soup and edamame.",
    slotsLeft: 2,
    slotsTotal: 3,
    expiresOn: 'May 20',
    badge: null,
    expiringSoon: false,
  },
};

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
  'Fashion',
  'Tech',
  'Travel',
  'Home',
  'Music',
  'Gaming',
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
 * Get perk detail by ID.
 */
export function getPerkDetailById(id: string): PerkDetail | undefined {
  return PERK_DETAILS[id];
}

/**
 * Get perks for a row.
 */
export function getPerksForRow(row: PerkRow): Perk[] {
  return row.perkIds
    .map((id) => getPerkById(id))
    .filter((p): p is Perk => p !== undefined);
}
