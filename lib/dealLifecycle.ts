/**
 * Canonical Deal Lifecycle
 *
 * Single source of truth for deal states, captions, and color tiers.
 * Used by both Business Dashboard and (future) Talent Dashboard.
 *
 * Note: TALENT role paths are validated for the future Talent Dashboard
 * but not exercised in production yet. When building the Talent Dashboard,
 * import getDealCaption with viewerRole: 'TALENT'.
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
 * BUSINESS = the SMB/Hunter side
 * TALENT = the creator/talent side
 */
export type ViewerRole = 'BUSINESS' | 'TALENT';

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
  /** Whether the business/hunter has submitted their rating (for COMPLETED) */
  businessRated?: boolean;
  /** Whether the talent has submitted their rating (for COMPLETED) */
  talentRated?: boolean;
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
 * @param viewerRole - BUSINESS or TALENT
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
 * isActiveOnDashboard('EXPIRED', 'TALENT')      // => false
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
 * @param viewerRole - BUSINESS or TALENT
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
 * Caption table (TALENT view):
 *   PENDING      -> "RESPOND · {N}H LEFT"  / accent
 *   IN_PROGRESS  -> "IN PROGRESS"          / inkMuted
 *   DELIVERED    -> "AWAITING REVIEW"      / inkMuted
 *   COMPLETED    -> "RATE NOW" or "COMPLETE" depending on talentRated
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
  const { hoursLeft, businessRated = false, talentRated = false } = opts;

  switch (state) {
    case 'PENDING': {
      const hoursText = hoursLeft !== undefined ? `${hoursLeft}H LEFT` : 'PENDING';
      if (viewerRole === 'BUSINESS') {
        return { text: `WAITING · ${hoursText}`, tier: 'accent' };
      }
      // TALENT
      return { text: `RESPOND · ${hoursText}`, tier: 'accent' };
    }

    case 'IN_PROGRESS':
      return { text: 'IN PROGRESS', tier: 'inkMuted' };

    case 'DELIVERED':
      if (viewerRole === 'BUSINESS') {
        return { text: 'REVIEW DELIVERY', tier: 'accent' };
      }
      // TALENT
      return { text: 'AWAITING REVIEW', tier: 'inkMuted' };

    case 'COMPLETED': {
      // Check if the viewer has rated
      const viewerHasRated =
        viewerRole === 'BUSINESS' ? businessRated : talentRated;

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
