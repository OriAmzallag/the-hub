/**
 * Mock Business Inquiries Data
 * Used for UI development before Supabase integration.
 *
 * 4 threads matching the reference, state-driven (NOT pre-rendered captions).
 * Captions are resolved at render time via getDealCaption().
 *
 * Thread distribution for business role:
 * - Pinned (3): PENDING + unread (business must respond), IN_PROGRESS + unread, COMPLETED unrated
 * - Other (1): COMPLETED where business already rated (awaiting influencer)
 */

import type { Thread } from '@/types/inquiry';

// Reusable influencer photos for visual continuity (same as mockBusinessDashboard)
const INFLUENCER_PHOTOS = {
  yael: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=400&q=80',
  maya: 'https://images.unsplash.com/photo-1518611012118-696072aa579a?w=400&q=80',
  noa: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=400&q=80',
  daniel: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=400&q=80',
  liat: 'https://images.unsplash.com/photo-1487412720507-e7ab37603c6f?w=400&q=80',
  eden: 'https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?w=400&q=80',
};

/**
 * Mock threads for business inbox.
 * Counterparties are Influencers, so they have photo avatars.
 */
export const MOCK_BUSINESS_THREADS: Thread[] = [
  // PENDING (incoming) - Liat reached out to FitBar with a booking
  // request. Newest item, fresh unread, pins by virtue of unread + the
  // business owing a response. Mirrors mockBusinessDashboard `deal-0`.
  {
    id: 'h-thr-0',
    counterparty: {
      name: 'Liat Cohen',
      photo: INFLUENCER_PHOTOS.liat,
    },
    state: 'PENDING',
    hoursLeft: 47,
    lastMessage: "Hi! Love what you're doing at FitBar — would you be open to a story set for the new menu?",
    lastMessageBy: 'them',
    timestamp: '30m ago',
    unread: 1,
  },

  // COMPLETED (neither-rated) - pins via requiresAction + has 1 unread
  {
    id: 'h-thr-1',
    counterparty: {
      name: 'Yael Mizrahi',
      photo: INFLUENCER_PHOTOS.yael,
    },
    state: 'COMPLETED',
    completedSubstate: 'neither-rated',
    lastMessage: 'Work complete, looking forward to your rating!',
    lastMessageBy: 'them',
    timestamp: '2h ago',
    unread: 1,
  },

  // IN_PROGRESS - pins via unread > 0 (not via requiresAction)
  {
    id: 'h-thr-2',
    counterparty: {
      name: 'Maya Cohen',
      photo: INFLUENCER_PHOTOS.maya,
    },
    state: 'IN_PROGRESS',
    lastMessage: 'Got the brief, looking forward to filming!',
    lastMessageBy: 'them',
    timestamp: '11:42',
    unread: 2,
  },

  // PENDING - pins for business (they must respond within countdown)
  {
    id: 'h-thr-3',
    counterparty: {
      name: 'Noa Berman',
      photo: INFLUENCER_PHOTOS.noa,
    },
    state: 'PENDING',
    hoursLeft: 47,
    lastMessage: null,
    lastMessageBy: null,
    timestamp: 'Yesterday',
    unread: 0,
  },

  // PENDING (outbound) - FitBar sent Eden a brief yesterday, still waiting.
  // Mirrors `deal-1b` in mockBusinessDashboard.
  {
    id: 'h-thr-1b',
    counterparty: {
      name: 'Eden Levi',
      photo: INFLUENCER_PHOTOS.eden,
    },
    state: 'PENDING',
    hoursLeft: 23,
    lastMessage:
      "Hi Eden! We're launching the spring menu next week and would love a reel + story set. Brief inside.",
    lastMessageBy: 'me',
    timestamp: 'Yesterday',
    unread: 0,
  },

  // COMPLETED (influencer-rated) - pins via requiresAction (business needs to rate)
  {
    id: 'h-thr-4',
    counterparty: {
      name: 'Daniel Levi',
      photo: INFLUENCER_PHOTOS.daniel,
    },
    state: 'COMPLETED',
    completedSubstate: 'influencer-rated',
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
