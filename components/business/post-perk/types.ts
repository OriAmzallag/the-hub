/**
 * Post Perk Types
 * Local types for the Post Perk form flow.
 */

import type { PerkCategory, PerkPlatform } from '@/types/perk';

/**
 * A single deliverable in the form (with local id for keying).
 * Note: description is required in the form, but optional in PerkDeliverable type.
 */
export interface FormDeliverable {
  id: string;
  platform: PerkPlatform;
  action: string;
  requiredFollowers: number;
  description: string;
}

/**
 * Full form state for creating a perk.
 */
export interface PostPerkFormState {
  coverImage: string | null;
  title: string;
  description: string;
  categories: PerkCategory[];
  value: number | null;
  deliverables: FormDeliverable[];
  maxClaims: number | null;
  deliveryDeadline: string;
  expiresOn: string;
}

/**
 * Platform option for the deliverable sheet.
 */
export interface PlatformOption {
  id: PerkPlatform;
  label: string;
  icon: 'Instagram' | 'Music2' | 'Youtube';
}

/**
 * Action presets per platform.
 */
export const ACTION_PRESETS: Record<PerkPlatform, string[]> = {
  IG: ['1 Story', '2 Stories', '3 Stories', '1 Reel', '1 Post'],
  TikTok: ['1 Reel', '1 Story', '1 Review'],
  YouTube: ['1 Short', '1 Video', '1 Review'],
};

/**
 * Platform options for the deliverable sheet.
 */
export const PLATFORM_OPTIONS: PlatformOption[] = [
  { id: 'IG', label: 'Instagram', icon: 'Instagram' },
  { id: 'TikTok', label: 'TikTok', icon: 'Music2' },
  { id: 'YouTube', label: 'YouTube', icon: 'Youtube' },
];

/**
 * Category options for the perk form.
 * All 8 categories from the reference.
 */
export const CATEGORY_OPTIONS: PerkCategory[] = [
  'Food',
  'Fitness',
  'Beauty',
  'Lifestyle',
  'Wellness',
  'Drinks',
  'Fashion',
  'Tech',
];

/**
 * Initial empty form state.
 */
export const INITIAL_FORM_STATE: PostPerkFormState = {
  coverImage: null,
  title: '',
  description: '',
  categories: [],
  value: null,
  deliverables: [],
  maxClaims: null,
  deliveryDeadline: '',
  expiresOn: '',
};
