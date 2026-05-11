/**
 * Perk Qualification Utilities
 * Helpers for checking if a viewer qualifies for a perk.
 */

import type { Perk, ViewerReach } from '@/types/perk';

/**
 * Check if viewer qualifies for a perk based on their reach.
 */
export function qualifiesForPerk(perk: Perk, viewerReach: ViewerReach): boolean {
  const viewerFollowers = viewerReach[perk.requiredPlatform];
  return viewerFollowers >= perk.requiredFollowers;
}

/**
 * Format follower count for display (e.g., 47200 -> "47K")
 */
export function formatFollowers(count: number): string {
  if (count >= 1000000) {
    return `${(count / 1000000).toFixed(1).replace(/\.0$/, '')}M`;
  }
  if (count >= 1000) {
    return `${Math.floor(count / 1000)}K`;
  }
  return String(count);
}

/**
 * Get the display label for a platform.
 */
export function getPlatformLabel(platform: string): string {
  switch (platform) {
    case 'IG':
      return 'Instagram';
    case 'TikTok':
      return 'TikTok';
    case 'YouTube':
      return 'YouTube';
    default:
      return platform;
  }
}
