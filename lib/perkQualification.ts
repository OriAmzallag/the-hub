/**
 * Perk Qualification Utilities
 * Helpers for checking if a viewer qualifies for a perk.
 */

import type {
  Perk,
  PerkDeliverable,
  ViewerReach,
  QualificationStatus,
} from '@/types/perk';

/**
 * Check if viewer qualifies for a single deliverable.
 */
export function deliverableQualifies(
  deliverable: PerkDeliverable,
  viewerReach: ViewerReach
): boolean {
  const viewerFollowers = viewerReach[deliverable.platform] || 0;
  return viewerFollowers >= deliverable.requiredFollowers;
}

/**
 * Check if viewer qualifies for a perk (all deliverables must be met).
 */
export function qualifiesForPerk(perk: Perk, viewerReach: ViewerReach): boolean {
  return perk.deliverables.every((d) => deliverableQualifies(d, viewerReach));
}

/**
 * Get overall qualification status for a perk.
 * - 'full': all deliverables met
 * - 'partial': some but not all deliverables met
 * - 'none': no deliverables met
 */
export function getOverallQualification(
  perk: Perk,
  viewerReach: ViewerReach
): QualificationStatus {
  const results = perk.deliverables.map((d) =>
    deliverableQualifies(d, viewerReach)
  );
  const passedCount = results.filter(Boolean).length;

  if (passedCount === results.length) return 'full';
  if (passedCount === 0) return 'none';
  return 'partial';
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
 * Format threshold for display (alias for formatFollowers).
 * Named to match the reference spec convention.
 */
export function formatThreshold(followers: number): string {
  if (followers >= 1000000) return `${(followers / 1000000).toFixed(0)}M`;
  if (followers >= 1000) return `${(followers / 1000).toFixed(0)}K`;
  return String(followers);
}

/**
 * Get the platform line for display on a PerkCard.
 * - Single deliverable: "{threshold}+ on {platform}"
 * - Multiple deliverables: "{platform1} + {platform2}"
 */
export function getCardPlatformLine(perk: Perk): string {
  if (perk.deliverables.length === 1) {
    const d = perk.deliverables[0];
    return `${formatThreshold(d.requiredFollowers)}+ on ${d.platform}`;
  }
  return perk.deliverables.map((d) => d.platform).join(' + ');
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
