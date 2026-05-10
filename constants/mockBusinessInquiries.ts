/**
 * Mock Business Inquiries Data
 * Used for UI development before Supabase integration.
 *
 * 4 threads matching the reference, state-driven (NOT pre-rendered captions).
 * Captions are resolved at render time via getDealCaption().
 *
 * Thread distribution for Business (Hunter) role:
 * - Pinned (3): DELIVERED + unread, IN_PROGRESS + unread, COMPLETED unrated
 * - Other (1): PENDING (Hunter waits passively)
 */

import type { Thread } from '@/types/inquiry';

// Reusable talent photos for visual continuity (same as mockBusinessDashboard)
const TALENT_PHOTOS = {
  yael: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=400&q=80',
  maya: 'https://images.unsplash.com/photo-1518611012118-696072aa579a?w=400&q=80',
  noa: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=400&q=80',
  daniel: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=400&q=80',
};

/**
 * Mock threads for Business (Hunter) inbox.
 * Counterparties are Talents, so they have photo avatars.
 */
export const MOCK_BUSINESS_THREADS: Thread[] = [
  // DELIVERED - pins via requiresAction + has 1 unread
  {
    id: 'h-thr-1',
    counterparty: {
      name: 'Yael Mizrahi',
      photo: TALENT_PHOTOS.yael,
    },
    state: 'DELIVERED',
    lastMessage: 'Final cut delivered, hope you love it!',
    lastMessageBy: 'them',
    timestamp: '2h ago',
    unread: 1,
  },

  // IN_PROGRESS - pins via unread > 0 (not via requiresAction)
  {
    id: 'h-thr-2',
    counterparty: {
      name: 'Maya Cohen',
      photo: TALENT_PHOTOS.maya,
    },
    state: 'IN_PROGRESS',
    lastMessage: 'Got the brief, looking forward to filming!',
    lastMessageBy: 'them',
    timestamp: '11:42',
    unread: 2,
  },

  // PENDING - does NOT pin for Hunter (they're waiting passively)
  {
    id: 'h-thr-3',
    counterparty: {
      name: 'Noa Berman',
      photo: TALENT_PHOTOS.noa,
    },
    state: 'PENDING',
    hoursLeft: 47,
    lastMessage: null,
    lastMessageBy: null,
    timestamp: 'Yesterday',
    unread: 0,
  },

  // COMPLETED unrated - pins via requiresAction (businessRated=false)
  {
    id: 'h-thr-4',
    counterparty: {
      name: 'Daniel Levi',
      photo: TALENT_PHOTOS.daniel,
    },
    state: 'COMPLETED',
    businessRated: false,
    talentRated: true,
    lastMessage: 'Thanks for working with us!',
    lastMessageBy: 'them',
    timestamp: '3d ago',
    unread: 0,
  },
];

/**
 * Compute total unread count from threads.
 */
export function computeUnreadTotal(threads: Thread[]): number {
  return threads.reduce((sum, thread) => sum + thread.unread, 0);
}

// Pre-computed for convenience
export const MOCK_UNREAD_TOTAL = computeUnreadTotal(MOCK_BUSINESS_THREADS);
