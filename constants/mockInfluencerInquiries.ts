/**
 * Mock Influencer Inquiries Data
 * Used for UI development before Supabase integration.
 *
 * 5 threads covering the v0.8 caption matrix for the influencer side.
 * Captions are resolved at render time via getDealCaption().
 *
 * Canonical user: Maya Cohen (matches mockInfluencerDashboard.ts)
 * Counterparties: businesses with monograms (no photos)
 *
 * Thread distribution for influencer role:
 * - Pinned (3): PENDING (Maya must respond), COMPLETED neither-rated (RATE NOW), COMPLETED with unread
 * - Other (2): IN_PROGRESS (passive), COMPLETED influencer-rated (awaiting their rating)
 */

import type { Thread } from '@/types/inquiry';

/**
 * Mock threads for influencer inbox.
 * Counterparties are Businesses, so they have monogram avatars (no photo).
 * Business names match Maya's dashboard mocks for cross-reference.
 */
export const MOCK_INFLUENCER_THREADS: Thread[] = [
  // PENDING - business booked Maya, Maya sees "RESPOND BY 47H" - pins via requiresAction
  {
    id: 'i-thr-1',
    counterparty: {
      name: 'Bellboy',
      monogram: 'BL',
    },
    state: 'PENDING',
    hoursLeft: 47,
    lastMessage: 'Hi Maya, we loved your content! Would you be interested in a collaboration?',
    lastMessageBy: 'them',
    timestamp: '1h ago',
    unread: 1,
  },

  // IN_PROGRESS - work underway, passive (no requiresAction), in "All inquiries"
  {
    id: 'i-thr-2',
    counterparty: {
      name: 'FitBar TLV',
      monogram: 'FB',
    },
    state: 'IN_PROGRESS',
    lastMessage: 'Perfect, see you tomorrow at 10am for the shoot!',
    lastMessageBy: 'them',
    timestamp: '10:30',
    unread: 0,
  },

  // COMPLETED (neither-rated) - Maya sees "RATE NOW" - pins via requiresAction
  {
    id: 'i-thr-3',
    counterparty: {
      name: 'Sushi Bar',
      monogram: 'SB',
    },
    state: 'COMPLETED',
    completedSubstate: 'neither-rated',
    lastMessage: 'Thanks for the amazing content! Really exceeded our expectations.',
    lastMessageBy: 'them',
    timestamp: 'Yesterday',
    unread: 0,
  },

  // COMPLETED (influencer-rated) - Maya already rated, sees "AWAITING THEIR RATING" - passive
  {
    id: 'i-thr-4',
    counterparty: {
      name: 'BeautyBar',
      monogram: 'BB',
    },
    state: 'COMPLETED',
    completedSubstate: 'influencer-rated',
    lastMessage: 'Thanks for the collaboration!',
    lastMessageBy: 'me',
    timestamp: '3d ago',
    unread: 0,
  },

  // COMPLETED with unread messages - pins via unread > 0 (not via requiresAction)
  {
    id: 'i-thr-5',
    counterparty: {
      name: 'Onza',
      monogram: 'ON',
    },
    state: 'COMPLETED',
    completedSubstate: 'business-rated',
    lastMessage: 'Just wanted to say thank you again for the great work!',
    lastMessageBy: 'them',
    timestamp: '2d ago',
    unread: 2,
  },
];

/**
 * Compute total unread count from threads.
 */
export function computeUnreadTotal(threads: Thread[]): number {
  return threads.reduce((sum, thread) => sum + thread.unread, 0);
}

// Pre-computed for convenience
export const MOCK_UNREAD_TOTAL = computeUnreadTotal(MOCK_INFLUENCER_THREADS);
