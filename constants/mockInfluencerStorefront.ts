/**
 * Mock Talent Storefront Data
 * Maya Cohen - sample talent for development and testing.
 */

import type { TalentStorefront } from '@/types/talent';

export const MAYA_COHEN: TalentStorefront = {
  id: 'maya-cohen-1',
  name: 'Maya Cohen',
  handle: '@maya.moves',
  bio: 'Fitness & lifestyle in Tel Aviv. Sweaty mornings, slow afternoons, honest reviews.',
  location: 'Tel Aviv',
  verified: true,
  available: true,
  rating: 4.9,
  reviewCount: 38,
  reach: '137K',
  categories: ['Fitness', 'Lifestyle', 'Wellness'],
  platforms: [
    { name: 'Instagram', icon: 'instagram', followers: '47.2K' },
    { name: 'TikTok', icon: 'tiktok', followers: '82.1K' },
    { name: 'YouTube', icon: 'youtube', followers: '8.4K' },
  ],
  portfolio: [
    'https://images.unsplash.com/photo-1518611012118-696072aa579a?w=900&q=80',
    'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=900&q=80',
    'https://images.unsplash.com/photo-1506629082955-511b1aa562c8?w=900&q=80',
    'https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?w=900&q=80',
    'https://images.unsplash.com/photo-1517836357463-d25dfeac3438?w=900&q=80',
  ],
  services: [
    { id: 1, name: 'Instagram Reel', platform: 'IG REEL', price: 350, delivery: '48h' },
    { id: 2, name: 'Story Set', platform: 'IG STORY', price: 180, delivery: '24h' },
    { id: 3, name: 'TikTok Native', platform: 'TIKTOK', price: 420, delivery: '3 days' },
    { id: 4, name: 'Event Appearance', platform: 'EVENT', price: 900, delivery: 'Custom' },
  ],
  reviewsPreview: [
    {
      from: 'FitBar TLV',
      rating: 5,
      text: 'Delivered exactly the brief, on time. Engagement was 3x our usual. Already booked her for next month\'s launch.',
      booked: 'IG Reel',
      date: '2 weeks ago',
    },
    {
      from: 'Sushi Bar',
      rating: 5,
      text: 'Professional from first DM to final upload. Real recommendation - gets the brand instantly, no hand-holding needed.',
      booked: 'Story Set',
      date: '1 month ago',
    },
  ],
};

/**
 * Get talent by ID (for future dynamic loading)
 * Currently always returns Maya for MVP.
 */
export function getTalentStorefront(_id: string): TalentStorefront {
  // TODO: Fetch from Supabase by ID
  return MAYA_COHEN;
}
