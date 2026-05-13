/**
 * Timeline Event Meta Resolver
 * Single source of truth for timeline event rendering.
 *
 * Returns icon, title (POV-aware), and tone for each event type.
 * NO local copies of event titles in components — all go through getEventMeta.
 */

import type { LucideIcon } from 'lucide-react-native';
import {
  Send,
  Check,
  Inbox,
  CheckCircle2,
  Star,
  Sparkles,
  Clock,
  XCircle,
  Hash,
} from 'lucide-react-native';
import type { TimelineEvent, ArchivedDeal, EventType } from '@/types/dealArchive';
import type { ViewerRole, CaptionTone } from '@/lib/dealLifecycle';

/**
 * Event metadata returned by getEventMeta.
 */
export interface EventMeta {
  Icon: LucideIcon;
  iconProps: {
    size: number;
    strokeWidth: number;
    fill?: string;
  };
  title: string;
  tone: CaptionTone;
}

/**
 * Resolves event metadata for timeline rendering.
 *
 * @param event - The timeline event
 * @param deal - The archived deal (for counterparty names)
 * @param viewerRole - 'business' or 'influencer'
 * @returns EventMeta with icon, title, and tone
 *
 * @example
 * const meta = getEventMeta(event, deal, 'business');
 * // event.type === 'request_sent' && event.actor === 'business'
 * // => { title: 'You sent the request', tone: 'accent', ... }
 *
 * const meta = getEventMeta(event, deal, 'influencer');
 * // event.type === 'request_sent' && event.actor === 'business'
 * // => { title: 'FitBar TLV sent the request', tone: 'accent', ... }
 */
export function getEventMeta(
  event: TimelineEvent,
  deal: ArchivedDeal,
  viewerRole: ViewerRole
): EventMeta {
  const isBusiness = viewerRole === 'business';

  /**
   * Resolves actor to display name based on viewer POV.
   */
  const youOrThem = (actor: 'business' | 'influencer' | 'system'): string => {
    if (actor === 'system') return '';
    if (actor === 'business') {
      return isBusiness ? 'You' : deal.business.name;
    }
    // actor === 'influencer'
    return isBusiness ? deal.influencer.firstName : 'You';
  };

  switch (event.type) {
    case 'request_sent':
      return {
        Icon: Send,
        iconProps: { size: 11, strokeWidth: 2.4 },
        title: `${youOrThem(event.actor)} sent the request`,
        tone: 'accent',
      };

    case 'viewed':
      return {
        Icon: Inbox,
        iconProps: { size: 11, strokeWidth: 2.4 },
        title: `${youOrThem(event.actor)} opened the request`,
        tone: 'accent',
      };

    case 'accepted':
      return {
        Icon: Check,
        iconProps: { size: 12, strokeWidth: 3 },
        title: `${youOrThem(event.actor)} accepted`,
        tone: 'accent',
      };

    case 'marked_done':
      return {
        Icon: CheckCircle2,
        iconProps: { size: 13, strokeWidth: 2.4 },
        title: `${youOrThem(event.actor)} marked it done`,
        tone: 'accent',
      };

    case 'rated':
      return {
        Icon: Star,
        iconProps: { size: 11, strokeWidth: 1.5, fill: 'currentColor' },
        title: `${youOrThem(event.actor)} rated`,
        tone: 'accent',
      };

    case 'deal_closed':
      return {
        Icon: Sparkles,
        iconProps: { size: 11, strokeWidth: 2.2 },
        title: 'Deal closed',
        tone: 'accent',
      };

    case 'expired':
      return {
        Icon: Clock,
        iconProps: { size: 11, strokeWidth: 2.4 },
        title: 'Request expired',
        tone: 'decline',
      };

    case 'declined':
      return {
        Icon: XCircle,
        iconProps: { size: 12, strokeWidth: 2.4 },
        title: `${youOrThem(event.actor)} declined`,
        tone: 'decline',
      };

    default: {
      // Exhaustive check
      const _exhaustive: never = event.type;
      return {
        Icon: Hash,
        iconProps: { size: 11, strokeWidth: 2.4 },
        title: String(_exhaustive),
        tone: 'muted',
      };
    }
  }
}

/**
 * All valid event types (locked taxonomy).
 */
export const EVENT_TYPES: readonly EventType[] = [
  'request_sent',
  'viewed',
  'accepted',
  'marked_done',
  'rated',
  'deal_closed',
  'expired',
  'declined',
] as const;
