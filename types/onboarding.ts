/**
 * Onboarding Types
 * Types for the multi-step onboarding flow.
 */

import type { PerkCategory, PerkPlatform } from './perk';

/**
 * All possible onboarding steps.
 */
export type OnboardingStep =
  | 'welcome'
  | 'phone'
  | 'otp'
  | 'fork'
  // Business flow (5 progress steps, but done is full-screen)
  | 'b-name'
  | 'b-location'
  | 'b-logo'
  | 'b-bio'
  | 'b-done'
  // Influencer flow (8 progress steps, but done is full-screen)
  | 'i-name'
  | 'i-photo'
  | 'i-categories'
  | 'i-content'
  | 'i-languages'
  | 'i-demo'
  | 'i-platforms'
  | 'i-done';

/**
 * Platform verification state for a single platform.
 */
export interface PlatformState {
  enabled: boolean;
  followers: number;
  verified: boolean;
}

/**
 * All platforms state.
 */
export interface PlatformsState {
  IG: PlatformState;
  TikTok: PlatformState;
  YouTube: PlatformState;
}

/**
 * Full onboarding form state.
 */
export interface OnboardingState {
  step: OnboardingStep;
  phone: string;
  otp: string;
  persona: 'business' | 'influencer' | null;

  // Business fields
  businessName: string;
  businessCategory: PerkCategory | null;
  businessLocation: string;
  businessLogo: string | null;
  businessBio: string;

  // Influencer fields
  influencerName: string;
  influencerBio: string;
  influencerPhoto: string | null;
  influencerCategories: PerkCategory[];
  influencerContentTypes: string[];
  influencerLanguages: string[];
  influencerAge: string | null;
  influencerGender: string | null;
  influencerPlatforms: PlatformsState;
}

/**
 * Initial empty onboarding state.
 */
export const INITIAL_ONBOARDING_STATE: OnboardingState = {
  step: 'welcome',
  phone: '',
  otp: '',
  persona: null,

  // Business fields
  businessName: '',
  businessCategory: null,
  businessLocation: '',
  businessLogo: null,
  businessBio: '',

  // Influencer fields
  influencerName: '',
  influencerBio: '',
  influencerPhoto: null,
  influencerCategories: [],
  influencerContentTypes: [],
  influencerLanguages: [],
  influencerAge: null,
  influencerGender: null,
  influencerPlatforms: {
    IG: { enabled: false, followers: 0, verified: false },
    TikTok: { enabled: false, followers: 0, verified: false },
    YouTube: { enabled: false, followers: 0, verified: false },
  },
};

/**
 * Business steps for progress calculation (excluding done which is full-screen).
 * Reference says "5 progress steps" - the progress bar shows on steps 1-4,
 * completing at step 4 (bio). Done is full-screen without progress.
 */
export const BUSINESS_STEPS: OnboardingStep[] = [
  'b-name',
  'b-location',
  'b-logo',
  'b-bio',
];

/**
 * Influencer steps for progress calculation (excluding done which is full-screen).
 * Reference says "8 progress steps" - the progress bar shows on steps 1-7,
 * completing at step 7 (platforms). Done is full-screen without progress.
 */
export const INFLUENCER_STEPS: OnboardingStep[] = [
  'i-name',
  'i-photo',
  'i-categories',
  'i-content',
  'i-languages',
  'i-demo',
  'i-platforms',
];

/**
 * Get progress info for current step.
 */
export function getProgressInfo(step: OnboardingStep): {
  current: number;
  total: number;
} | null {
  const businessIndex = BUSINESS_STEPS.indexOf(step);
  if (businessIndex !== -1) {
    return { current: businessIndex + 1, total: BUSINESS_STEPS.length };
  }

  const influencerIndex = INFLUENCER_STEPS.indexOf(step);
  if (influencerIndex !== -1) {
    return { current: influencerIndex + 1, total: INFLUENCER_STEPS.length };
  }

  // Shared steps (welcome, phone, otp, fork) and done steps have no progress bar
  return null;
}

/**
 * Get previous step for back navigation.
 */
export function getPreviousStep(step: OnboardingStep): OnboardingStep | null {
  switch (step) {
    case 'welcome':
      return null;
    case 'phone':
      return 'welcome';
    case 'otp':
      return 'phone';
    case 'fork':
      return 'otp';
    // Business flow
    case 'b-name':
      return 'fork';
    case 'b-location':
      return 'b-name';
    case 'b-logo':
      return 'b-location';
    case 'b-bio':
      return 'b-logo';
    case 'b-done':
      return 'b-bio';
    // Influencer flow
    case 'i-name':
      return 'fork';
    case 'i-photo':
      return 'i-name';
    case 'i-categories':
      return 'i-photo';
    case 'i-content':
      return 'i-categories';
    case 'i-languages':
      return 'i-content';
    case 'i-demo':
      return 'i-languages';
    case 'i-platforms':
      return 'i-demo';
    case 'i-done':
      return 'i-platforms';
    default:
      return null;
  }
}
