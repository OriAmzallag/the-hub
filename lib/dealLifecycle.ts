/**
 * Canonical Deal Lifecycle
 *
 * Single source of truth for deal states, captions, and color tiers.
 * Used by both Business Dashboard and (future) Influencer Dashboard.
 *
 * Note: INFLUENCER role paths are validated for the future Influencer Dashboard
 * but not exercised in production yet. When building the Influencer Dashboard,
 * import getDealCaption with viewerRole: 'INFLUENCER'.
 */

// -----------------------------------------------------------------------------
// Types
// -----------------------------------------------------------------------------

/**
 * The 7 canonical deal states.
 *
 * Lifecycle:
 *   PENDING ──── IN_PROGRESS ──── DELIVERED ──── COMPLETED ──── RATED (terminal)
 *      │              │
 *      ↓              ↓
 *   EXPIRED       DECLINED
 *   (terminal)    (terminal)
 */
export type DealState =
  | 'PENDING'
  | 'IN_PROGRESS'
  | 'DELIVERED'
  | 'COMPLETED'
  | 'RATED'
  | 'EXPIRED'
  | 'DECLINED';

/**
 * Color tier for status caption display.
 * Maps directly to theme color tokens.
 */
export type CaptionTier = 'accent' | 'inkMuted' | 'inkSubtle';

/**
 * Viewer's role in the deal.
 * BUSINESS = the SMB/Business side
 * INFLUENCER = the creator/influencer side
 */
export type ViewerRole = 'BUSINESS' | 'INFLUENCER';

/**
 * Result from getDealCaption containing text and color tier.
 */
export interface CaptionResult {
  text: string;
  tier: CaptionTier;
}

/**
 * Options for caption resolution.
 */
export interface CaptionOptions {
  /** Hours remaining for PENDING state countdown */
  hoursLeft?: number;
  /** Whether the business/business has submitted their rating (for COMPLETED) */
  businessRated?: boolean;
  /** Whether the influencer has submitted their rating (for COMPLETED) */
  influencerRated?: boolean;
}

// -----------------------------------------------------------------------------
// Constants
// -----------------------------------------------------------------------------

/**
 * Terminal states that end the deal lifecycle.
 * These do NOT appear in "Active deals" (except EXPIRED/DECLINED on Business side).
 */
export const TERMINAL_STATES: readonly DealState[] = [
  'RATED',
  'EXPIRED',
  'DECLINED',
] as const;

// -----------------------------------------------------------------------------
// Functions
// -----------------------------------------------------------------------------

/**
 * Determines if a deal should appear on the dashboard for a given viewer role.
 *
 * @param state - Current deal state
 * @param viewerRole - BUSINESS or INFLUENCER
 * @returns true if the deal should be displayed
 *
 * Behavior:
 * - RATED: hidden for both roles (moves to History view)
 * - EXPIRED/DECLINED: shown only for BUSINESS (terminal states they should see)
 * - All others: shown for both roles
 *
 * @example
 * isActiveOnDashboard('PENDING', 'BUSINESS')    // => true
 * isActiveOnDashboard('RATED', 'BUSINESS')      // => false
 * isActiveOnDashboard('EXPIRED', 'BUSINESS')    // => true
 * isActiveOnDashboard('EXPIRED', 'INFLUENCER')      // => false
 */
export function isActiveOnDashboard(
  state: DealState,
  viewerRole: ViewerRole
): boolean {
  switch (state) {
    case 'RATED':
      // Never shown on active dashboard - belongs in History
      return false;

    case 'EXPIRED':
    case 'DECLINED':
      // Terminal states only shown to Business (they need to see what happened)
      return viewerRole === 'BUSINESS';

    case 'PENDING':
    case 'IN_PROGRESS':
    case 'DELIVERED':
    case 'COMPLETED':
      // Active states shown to both roles
      return true;

    default: {
      // Exhaustive check - TypeScript will error if a state is missing
      const _exhaustive: never = state;
      return _exhaustive;
    }
  }
}

/**
 * Resolves the display caption and color tier for a deal state.
 *
 * @param state - Current deal state
 * @param viewerRole - BUSINESS or INFLUENCER
 * @param opts - Additional context (hoursLeft, rating status)
 * @returns CaptionResult with text and tier
 *
 * Caption table (BUSINESS view):
 *   PENDING      -> "WAITING · {N}H LEFT"  / accent
 *   IN_PROGRESS  -> "IN PROGRESS"          / inkMuted
 *   DELIVERED    -> "REVIEW DELIVERY"      / accent
 *   COMPLETED    -> "RATE NOW" or "COMPLETE" depending on businessRated
 *   RATED        -> "RATED"                / inkSubtle
 *   EXPIRED      -> "EXPIRED"              / inkSubtle
 *   DECLINED     -> "DECLINED"             / inkSubtle
 *
 * Caption table (INFLUENCER view):
 *   PENDING      -> "RESPOND · {N}H LEFT"  / accent
 *   IN_PROGRESS  -> "IN PROGRESS"          / inkMuted
 *   DELIVERED    -> "AWAITING REVIEW"      / inkMuted
 *   COMPLETED    -> "RATE NOW" or "COMPLETE" depending on influencerRated
 *   RATED        -> "RATED"                / inkSubtle
 *   EXPIRED      -> "EXPIRED"              / inkSubtle
 *   DECLINED     -> "DECLINED"             / inkSubtle
 *
 * @example
 * getDealCaption('PENDING', 'BUSINESS', { hoursLeft: 47 })
 * // => { text: 'WAITING · 47H LEFT', tier: 'accent' }
 *
 * getDealCaption('COMPLETED', 'BUSINESS', { businessRated: false })
 * // => { text: 'RATE NOW', tier: 'accent' }
 *
 * getDealCaption('COMPLETED', 'BUSINESS', { businessRated: true })
 * // => { text: 'COMPLETE', tier: 'inkMuted' }
 */
export function getDealCaption(
  state: DealState,
  viewerRole: ViewerRole,
  opts: CaptionOptions = {}
): CaptionResult {
  const { hoursLeft, businessRated = false, influencerRated = false } = opts;

  switch (state) {
    case 'PENDING': {
      const hoursText = hoursLeft !== undefined ? `${hoursLeft}H LEFT` : 'PENDING';
      if (viewerRole === 'BUSINESS') {
        return { text: `WAITING · ${hoursText}`, tier: 'accent' };
      }
      // INFLUENCER
      return { text: `RESPOND · ${hoursText}`, tier: 'accent' };
    }

    case 'IN_PROGRESS':
      return { text: 'IN PROGRESS', tier: 'inkMuted' };

    case 'DELIVERED':
      if (viewerRole === 'BUSINESS') {
        return { text: 'REVIEW DELIVERY', tier: 'accent' };
      }
      // INFLUENCER
      return { text: 'AWAITING REVIEW', tier: 'inkMuted' };

    case 'COMPLETED': {
      // Check if the viewer has rated
      const viewerHasRated =
        viewerRole === 'BUSINESS' ? businessRated : influencerRated;

      if (!viewerHasRated) {
        return { text: 'RATE NOW', tier: 'accent' };
      }
      // Viewer has rated, waiting for other party
      return { text: 'COMPLETE', tier: 'inkMuted' };
    }

    case 'RATED':
      // Should not typically be called (filtered out), but handle gracefully
      return { text: 'RATED', tier: 'inkSubtle' };

    case 'EXPIRED':
      return { text: 'EXPIRED', tier: 'inkSubtle' };

    case 'DECLINED':
      return { text: 'DECLINED', tier: 'inkSubtle' };

    default: {
      // Exhaustive check - TypeScript will error if a state is missing
      const _exhaustive: never = state;
      return _exhaustive;
    }
  }
}

/**
 * Determines if the viewer needs to take action on this deal state.
 *
 * Used for inbox pinning logic: threads where the user must act are
 * pinned to the "Needs your attention" section.
 *
 * @param state - Current deal state
 * @param viewerRole - BUSINESS or INFLUENCER
 * @param opts - Additional context (rating status)
 * @returns true if the viewer needs to take action
 *
 * BUSINESS role:
 *   - DELIVERED: true (review delivery)
 *   - COMPLETED + businessRated === false: true (rate now)
 *   - All others: false (PENDING = waiting passively on Influencer)
 *
 * INFLUENCER role:
 *   - PENDING: true (respond to request)
 *   - COMPLETED + influencerRated === false: true (rate now)
 *   - All others: false
 *
 * @example
 * requiresAction('DELIVERED', 'BUSINESS')
 * // => true
 *
 * requiresAction('PENDING', 'BUSINESS')
 * // => false (Business waits passively)
 *
 * requiresAction('PENDING', 'INFLUENCER')
 * // => true (Influencer must respond)
 *
 * requiresAction('COMPLETED', 'BUSINESS', { businessRated: false })
 * // => true
 *
 * requiresAction('COMPLETED', 'BUSINESS', { businessRated: true })
 * // => false
 */
export function requiresAction(
  state: DealState,
  viewerRole: ViewerRole,
  opts: CaptionOptions = {}
): boolean {
  const { businessRated = false, influencerRated = false } = opts;

  if (viewerRole === 'BUSINESS') {
    // Business needs to review delivered content
    if (state === 'DELIVERED') return true;
    // Business needs to rate after completion
    if (state === 'COMPLETED' && !businessRated) return true;
    // All other states: Business waits (including PENDING)
    return false;
  }

  // INFLUENCER
  // Influencer needs to respond to pending request
  if (state === 'PENDING') return true;
  // Influencer needs to rate after completion
  if (state === 'COMPLETED' && !influencerRated) return true;
  // All other states: Influencer waits or has already acted
  return false;
}
