/**
 * Canonical Deal Lifecycle (v0.8)
 *
 * Single source of truth for deal states, captions, and tones.
 * Used by both Business Dashboard and Influencer Dashboard.
 */

// -----------------------------------------------------------------------------
// Types
// -----------------------------------------------------------------------------

/**
 * The 6 canonical deal states (v0.8).
 *
 * Lifecycle:
 *   PENDING -> IN_PROGRESS -> COMPLETED -> RATED (terminal)
 *      |
 *      +-> EXPIRED (terminal)
 *      +-> DECLINED (terminal)
 *
 * Note: DELIVERED state was removed in v0.8. Content delivery is now
 * implicit in the IN_PROGRESS -> COMPLETED transition.
 */
export type DealState =
  | 'PENDING'
  | 'IN_PROGRESS'
  | 'COMPLETED'
  | 'RATED'
  | 'EXPIRED'
  | 'DECLINED';

/**
 * Caption tone — maps directly to theme color tokens.
 *
 * - accent: colors.accent (#ff7829) — actionable items
 * - muted: colors.inkMuted (#8A7E6C) — passive items
 * - decline: colors.decline (#C4886B) — terminal negative states
 */
export type CaptionTone = 'accent' | 'muted' | 'decline';

/**
 * Viewer's role in the deal — lowercase per v0.8 spec.
 */
export type ViewerRole = 'business' | 'influencer';

/**
 * COMPLETED state sub-state — single field replaces separate booleans.
 *
 * - neither-rated: Both parties need to rate (default)
 * - business-rated: Business rated, awaiting influencer
 * - influencer-rated: Influencer rated, awaiting business
 */
export type CompletedSubstate =
  | 'neither-rated'
  | 'business-rated'
  | 'influencer-rated';

/**
 * Canonical decline reasons — uppercase.
 */
export type DeclineReason =
  | 'BRIEF OUTSIDE SCOPE'
  | 'WRONG FIT'
  | 'TOO SHORT NOTICE'
  | 'FULLY BOOKED'
  | 'OTHER';

/**
 * Result from getDealCaption — v0.8 contract.
 */
export interface Caption {
  text: string;
  tone: CaptionTone;
  actionable: boolean;
}

/**
 * Input shape for caption resolution.
 * Components pass a deal-like object with the relevant fields.
 */
export interface DealCaptionInput {
  state: DealState;
  hoursLeft?: number; // PENDING only
  completedSubstate?: CompletedSubstate; // COMPLETED only
  rating?: number; // RATED only (1.0-5.0)
  declineReason?: DeclineReason; // DECLINED only
}

// -----------------------------------------------------------------------------
// Constants
// -----------------------------------------------------------------------------

/**
 * Terminal states that end the deal lifecycle.
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
 * @param viewerRole - 'business' or 'influencer'
 * @returns true if the deal should be displayed
 *
 * Behavior:
 * - RATED: hidden for both roles (moves to History view)
 * - EXPIRED/DECLINED: shown only for business (terminal states they should see)
 * - All others: shown for both roles
 *
 * @example
 * isActiveOnDashboard('PENDING', 'business')    // => true
 * isActiveOnDashboard('RATED', 'business')      // => false
 * isActiveOnDashboard('EXPIRED', 'business')    // => true
 * isActiveOnDashboard('EXPIRED', 'influencer')  // => false
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
      // Terminal states only shown to business (they need to see what happened)
      return viewerRole === 'business';

    case 'PENDING':
    case 'IN_PROGRESS':
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
 * Resolves the display caption, tone, and actionable flag for a deal state.
 *
 * @param deal - Deal-like object with state and optional fields
 * @param viewerRole - 'business' or 'influencer'
 * @returns Caption with text, tone, and actionable flag
 *
 * Caption table (v0.8):
 *
 * | State     | Sub-state         | Business            | Influencer          | Tone    | Actionable |
 * |-----------|-------------------|---------------------|---------------------|---------|------------|
 * | PENDING   | —                 | RESPOND BY {N}H     | AWAITING RESPONSE   | accent/muted | yes/no |
 * | IN_PROGRESS | —               | IN PROGRESS         | IN PROGRESS         | muted   | no |
 * | COMPLETED | neither-rated     | RATE NOW            | RATE NOW            | accent  | yes |
 * | COMPLETED | business-rated    | AWAITING THEIR RATING | RATE NOW          | muted/accent | no/yes |
 * | COMPLETED | influencer-rated  | RATE NOW            | AWAITING THEIR RATING | accent/muted | yes/no |
 * | RATED     | —                 | RATED ★ {N}         | RATED ★ {N}         | muted   | no |
 * | EXPIRED   | —                 | EXPIRED             | EXPIRED             | decline | no |
 * | DECLINED  | —                 | DECLINED            | DECLINED · {REASON} | decline | no |
 *
 * @example
 * getDealCaption({ state: 'PENDING', hoursLeft: 47 }, 'business')
 * // => { text: 'RESPOND BY 47H', tone: 'accent', actionable: true }
 *
 * getDealCaption({ state: 'COMPLETED', completedSubstate: 'neither-rated' }, 'business')
 * // => { text: 'RATE NOW', tone: 'accent', actionable: true }
 */
export function getDealCaption(
  deal: DealCaptionInput,
  viewerRole: ViewerRole
): Caption {
  const isBusiness = viewerRole === 'business';

  switch (deal.state) {
    case 'PENDING':
      return isBusiness
        ? {
            text: `RESPOND BY ${deal.hoursLeft ?? 0}H`,
            tone: 'accent',
            actionable: true,
          }
        : {
            text: 'AWAITING RESPONSE',
            tone: 'muted',
            actionable: false,
          };

    case 'IN_PROGRESS':
      return {
        text: 'IN PROGRESS',
        tone: 'muted',
        actionable: false,
      };

    case 'COMPLETED': {
      const sub = deal.completedSubstate ?? 'neither-rated';
      const iAlreadyRated =
        (isBusiness && sub === 'business-rated') ||
        (!isBusiness && sub === 'influencer-rated');
      return iAlreadyRated
        ? {
            text: 'AWAITING THEIR RATING',
            tone: 'muted',
            actionable: false,
          }
        : {
            text: 'RATE NOW',
            tone: 'accent',
            actionable: true,
          };
    }

    case 'RATED':
      return {
        text: `RATED ★ ${deal.rating ?? 5.0}`,
        tone: 'muted',
        actionable: false,
      };

    case 'EXPIRED':
      return {
        text: 'EXPIRED',
        tone: 'decline',
        actionable: false,
      };

    case 'DECLINED': {
      const text =
        !isBusiness && deal.declineReason
          ? `DECLINED · ${deal.declineReason}`
          : 'DECLINED';
      return {
        text,
        tone: 'decline',
        actionable: false,
      };
    }

    default: {
      // Exhaustive check - TypeScript will error if a state is missing
      const _exhaustive: never = deal.state;
      return _exhaustive;
    }
  }
}

/**
 * Returns the hint text for an actionable caption.
 *
 * @param caption - Caption from getDealCaption
 * @returns Hint text or null if not actionable
 *
 * Only two captions have hints:
 * - "RESPOND BY {N}H" -> "Tap to respond"
 * - "RATE NOW" -> "Tap to rate"
 *
 * @example
 * getCaptionHint({ text: 'RESPOND BY 47H', tone: 'accent', actionable: true })
 * // => 'Tap to respond'
 *
 * getCaptionHint({ text: 'IN PROGRESS', tone: 'muted', actionable: false })
 * // => null
 */
export function getCaptionHint(caption: Caption): string | null {
  if (!caption.actionable) return null;

  if (caption.text.startsWith('RESPOND BY')) {
    return 'Tap to respond';
  }
  if (caption.text === 'RATE NOW') {
    return 'Tap to rate';
  }
  return null;
}

/**
 * Determines if the viewer needs to take action on this deal.
 *
 * Used for inbox pinning logic: deals where the user must act are
 * shown in the "Needs your attention" section.
 *
 * This is equivalent to checking `getDealCaption(deal, viewerRole).actionable`.
 *
 * @param deal - Deal-like object with state and optional fields
 * @param viewerRole - 'business' or 'influencer'
 * @returns true if the viewer needs to take action
 *
 * Actionable states:
 * - PENDING (business only): must respond within countdown
 * - COMPLETED (rate-now side): must submit rating
 *
 * @example
 * requiresAction({ state: 'PENDING', hoursLeft: 47 }, 'business')
 * // => true
 *
 * requiresAction({ state: 'PENDING', hoursLeft: 47 }, 'influencer')
 * // => false (awaiting response, not actionable)
 *
 * requiresAction({ state: 'COMPLETED', completedSubstate: 'neither-rated' }, 'business')
 * // => true
 */
export function requiresAction(
  deal: DealCaptionInput,
  viewerRole: ViewerRole
): boolean {
  return getDealCaption(deal, viewerRole).actionable;
}

/**
 * Maps a CaptionTone to the corresponding theme color token name.
 *
 * @param tone - Caption tone
 * @returns Theme color key to use with colors[key]
 *
 * @example
 * import { colors } from '@/constants/theme';
 * const color = colors[getToneColorKey('accent')]; // colors.accent
 */
export function getToneColorKey(
  tone: CaptionTone
): 'accent' | 'inkMuted' | 'decline' {
  switch (tone) {
    case 'accent':
      return 'accent';
    case 'muted':
      return 'inkMuted';
    case 'decline':
      return 'decline';
  }
}
