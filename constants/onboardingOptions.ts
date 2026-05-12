/**
 * Onboarding Options
 * Constants for all onboarding form options.
 */

import type { PerkCategory } from '@/types/perk';

/**
 * Business categories (10 options).
 * Includes Travel + Home beyond the 8 PerkCategory base.
 */
export const BUSINESS_CATEGORIES: PerkCategory[] = [
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
];

/**
 * Influencer categories (10 options).
 * Includes Travel + Music + Gaming beyond the 8 PerkCategory base.
 */
export const INFLUENCER_CATEGORIES: PerkCategory[] = [
  'Fitness',
  'Lifestyle',
  'Wellness',
  'Beauty',
  'Fashion',
  'Food',
  'Travel',
  'Tech',
  'Music',
  'Gaming',
];

/**
 * Content types for influencer onboarding.
 */
export const CONTENT_TYPES: string[] = [
  'UGC',
  'Sponsored',
  'Short-Form Video',
  'Lifestyle',
  'Product Review',
  'Tutorial/Educational',
  'Storytelling',
  'Performance Creative',
  'Testimonial',
  'Behind-the-Scenes',
];

/**
 * Languages for influencer onboarding.
 */
export const LANGUAGES: string[] = [
  'Hebrew',
  'English',
  'Arabic',
  'Russian',
  'French',
  'Spanish',
];

/**
 * Age brackets for influencer demographics.
 * Using en-dash for ranges per encoding convention.
 */
export const AGE_BRACKETS: string[] = [
  '18–24',
  '25–34',
  '35–44',
  '45–54',
  '55+',
];

/**
 * Gender options for influencer demographics.
 */
export const GENDERS: string[] = [
  'Women',
  'Men',
  'Non-binary',
  'Prefer not to say',
];

/**
 * Platform options for influencer verification.
 */
export const PLATFORMS = [
  { id: 'IG' as const, label: 'Instagram', icon: 'Instagram' as const },
  { id: 'TikTok' as const, label: 'TikTok', icon: 'Music2' as const },
  { id: 'YouTube' as const, label: 'YouTube', icon: 'Youtube' as const },
];

/**
 * Maya's canonical reach values for mock OAuth verification.
 */
export const MOCK_REACH = {
  IG: 47200,
  TikTok: 82100,
  YouTube: 8400,
};
