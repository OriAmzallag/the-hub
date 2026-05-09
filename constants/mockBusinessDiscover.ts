/**
 * Mock Business Discover Data
 * Used for UI development before Supabase integration.
 */

export interface Talent {
  id: string;
  name: string;
  photo: string;
  rating: number | null;
  badge: string | null;
  available: boolean;
  categories: string[];
}

export interface TalentRow {
  id: string;
  title: string;
  subtitle: string | null;
  talentIds: string[];
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

export const TALENT: Talent[] = [
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

export const ROWS: TalentRow[] = [
  {
    id: 'row-match',
    title: 'Top match for FitBar',
    subtitle: 'Based on your category',
    talentIds: ['t-1', 't-6', 't-2', 't-3'],
  },
  {
    id: 'row-trending',
    title: 'Trending in Tel Aviv',
    subtitle: null,
    talentIds: ['t-2', 't-4', 't-1', 't-7'],
  },
  {
    id: 'row-toprated',
    title: 'Top rated',
    subtitle: null,
    talentIds: ['t-4', 't-1', 't-6', 't-2'],
  },
  {
    id: 'row-new',
    title: 'New on The Hub',
    subtitle: null,
    talentIds: ['t-5', 't-7', 't-3'],
  },
  {
    id: 'row-available',
    title: 'Available right now',
    subtitle: null,
    talentIds: ['t-1', 't-2', 't-4', 't-5', 't-6'],
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

export const PLATFORMS: Platform[] = [
  { id: 'ig', label: 'Instagram', iconName: 'Instagram' },
  { id: 'tt', label: 'TikTok', iconName: 'Music2' },
  { id: 'yt', label: 'YouTube', iconName: 'Youtube' },
  { id: 'ev', label: 'Event', iconName: 'CalendarClock' },
];

export const SORT_OPTIONS: SortOption[] = [
  { id: 'recommended', label: 'Recommended' },
  { id: 'price_low', label: 'Price: low → high' },
  { id: 'price_high', label: 'Price: high → low' },
  { id: 'rating', label: 'Rating' },
  { id: 'newest', label: 'Newest' },
];

// Helper to get talent by ID
export function getTalentById(id: string): Talent | undefined {
  return TALENT.find((t) => t.id === id);
}
