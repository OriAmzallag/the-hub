/**
 * Mock Business Discover Data
 * Used for UI development before Supabase integration.
 */

export interface Influencer {
  id: string;
  name: string;
  photo: string;
  rating: number | null;
  badge: string | null;
  available: boolean;
  categories: string[];
}

export interface InfluencerRow {
  id: string;
  title: string;
  subtitle: string | null;
  influencerIds: string[];
}

export interface Platform {
  id: string;
  label: string;
  iconName: 'Instagram' | 'Music2' | 'Youtube' | 'CalendarClock';
}

export interface SortOption {
  id: string;
  label: string;
}

export interface ContentType {
  id: string;
  label: string;
}

export interface AudienceTier {
  id: string;
  label: string;
  hint: string;
}

export interface Language {
  id: string;
  label: string;
}

export interface AgeBracket {
  id: string;
  label: string;
}

export interface Gender {
  id: string;
  label: string;
}

export const INFLUENCER: Influencer[] = [
  {
    id: 't-1',
    name: 'Maya Cohen',
    photo: 'https://images.unsplash.com/photo-1518611012118-696072aa579a?w=600&q=80',
    rating: 4.9,
    badge: 'Top match',
    available: true,
    categories: ['Fitness', 'Lifestyle'],
  },
  {
    id: 't-2',
    name: 'Noa Berman',
    photo: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=600&q=80',
    rating: 4.8,
    badge: null,
    available: true,
    categories: ['Lifestyle', 'Fashion'],
  },
  {
    id: 't-3',
    name: 'Daniel Levi',
    photo: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=600&q=80',
    rating: 4.7,
    badge: null,
    available: false,
    categories: ['Food', 'Lifestyle'],
  },
  {
    id: 't-4',
    name: 'Yael Mizrahi',
    photo: 'https://images.unsplash.com/photo-1508214751196-bcfd4ca60f91?w=600&q=80',
    rating: 5.0,
    badge: 'Top rated',
    available: true,
    categories: ['Fashion', 'Beauty'],
  },
  {
    id: 't-5',
    name: 'Tomer Avraham',
    photo: 'https://images.unsplash.com/photo-1531427186611-ecfd6d936c79?w=600&q=80',
    rating: null,
    badge: 'New',
    available: true,
    categories: ['Music', 'Lifestyle'],
  },
  {
    id: 't-6',
    name: 'Roni Kaplan',
    photo: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=600&q=80',
    rating: 4.9,
    badge: null,
    available: true,
    categories: ['Fitness', 'Wellness'],
  },
  {
    id: 't-7',
    name: 'Adi Shoham',
    photo: 'https://images.unsplash.com/photo-1488426862026-3ee34a7d66df?w=600&q=80',
    rating: 4.6,
    badge: null,
    available: false,
    categories: ['Tech', 'Lifestyle'],
  },
];

export const ROWS: InfluencerRow[] = [
  {
    id: 'row-match',
    title: 'Top match for FitBar',
    subtitle: 'Based on your category',
    influencerIds: ['t-1', 't-6', 't-2', 't-3'],
  },
  {
    id: 'row-trending',
    title: 'Trending in Tel Aviv',
    subtitle: null,
    influencerIds: ['t-2', 't-4', 't-1', 't-7'],
  },
  {
    id: 'row-toprated',
    title: 'Top rated',
    subtitle: null,
    influencerIds: ['t-4', 't-1', 't-6', 't-2'],
  },
  {
    id: 'row-new',
    title: 'New on The Hub',
    subtitle: null,
    influencerIds: ['t-5', 't-7', 't-3'],
  },
  {
    id: 'row-available',
    title: 'Available right now',
    subtitle: null,
    influencerIds: ['t-1', 't-2', 't-4', 't-5', 't-6'],
  },
];

export const CATEGORIES: string[] = [
  'All',
  'Fitness',
  'Lifestyle',
  'Food',
  'Fashion',
  'Beauty',
  'Music',
  'Tech',
];

export const CONTENT_TYPES: ContentType[] = [
  { id: 'ugc', label: 'UGC' },
  { id: 'sponsored', label: 'Sponsored' },
  { id: 'short_video', label: 'Short-Form Video' },
  { id: 'lifestyle', label: 'Lifestyle' },
  { id: 'product_review', label: 'Product Review' },
  { id: 'tutorial', label: 'Tutorial / Educational' },
  { id: 'storytelling', label: 'Storytelling' },
  { id: 'performance', label: 'Performance Creative' },
  { id: 'testimonial', label: 'Testimonial' },
  { id: 'bts', label: 'Behind-the-Scenes' },
];

export const AUDIENCE_TIERS: AudienceTier[] = [
  { id: 'nano', label: 'Nano', hint: '<10K' },
  { id: 'micro', label: 'Micro', hint: '10–50K' },
  { id: 'mid', label: 'Mid', hint: '50–500K' },
  { id: 'macro', label: 'Macro', hint: '500K+' },
];

export const LANGUAGES: Language[] = [
  { id: 'he', label: 'Hebrew' },
  { id: 'en', label: 'English' },
  { id: 'ar', label: 'Arabic' },
  { id: 'ru', label: 'Russian' },
];

export const AGE_BRACKETS: AgeBracket[] = [
  { id: '18-24', label: '18–24' },
  { id: '25-34', label: '25–34' },
  { id: '35-44', label: '35–44' },
  { id: '45+', label: '45+' },
];

export const GENDERS: Gender[] = [
  { id: 'women', label: 'Women' },
  { id: 'men', label: 'Men' },
  { id: 'nonbinary', label: 'Non-binary' },
];

export const PLATFORMS: Platform[] = [
  { id: 'ig', label: 'Instagram', iconName: 'Instagram' },
  { id: 'tt', label: 'TikTok', iconName: 'Music2' },
  { id: 'yt', label: 'YouTube', iconName: 'Youtube' },
  { id: 'ev', label: 'Event', iconName: 'CalendarClock' },
];

export const SORT_OPTIONS: SortOption[] = [
  { id: 'recommended', label: 'Best match' },
  { id: 'price_low', label: 'Price: low → high' },
  { id: 'price_high', label: 'Price: high → low' },
  { id: 'rating', label: 'Rating' },
  { id: 'newest', label: 'Newest' },
];

// Default filter values (used for detecting active state)
export const FILTER_DEFAULTS = {
  PRICE_MIN: 50,
  PRICE_MAX: 2000,
  SORT: 'recommended',
} as const;

// Helper to get influencer by ID
export function getInfluencerById(id: string): Influencer | undefined {
  return INFLUENCER.find((t) => t.id === id);
}
