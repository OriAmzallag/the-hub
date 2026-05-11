/**
 * Mock Thread Data
 * Used for UI development before Supabase integration.
 */

import type {
  ThreadDetail,
  ThreadMessage,
  TemplateChip,
  ViewerRole,
} from '@/types/thread';

/**
 * Template chips for Business users
 */
export const TEMPLATES_BUSINESS: TemplateChip[] = [
  { id: 'got-it', label: 'Got it' },
  { id: 'when-start', label: 'When can you start?' },
  { id: 'send-draft', label: 'Send the draft' },
  { id: 'whatsapp', label: "Let's hop on WhatsApp", isHandoff: true },
];

/**
 * Template chips for Influencer users
 */
export const TEMPLATES_INFLUENCER: TemplateChip[] = [
  { id: 'confirmed', label: 'Confirmed' },
  { id: 'drafts', label: 'Drafts ready' },
  { id: 'delivered', label: 'All delivered' },
  { id: 'whatsapp', label: "Let's hop on WhatsApp", isHandoff: true },
];

/**
 * Get template chips based on viewer role
 */
export function getTemplates(viewerRole: ViewerRole): TemplateChip[] {
  return viewerRole === 'BUSINESS' ? TEMPLATES_BUSINESS : TEMPLATES_INFLUENCER;
}

/**
 * Demo thread - Maya (Influencer) + FitBar TLV (Business)
 * From the Influencer's perspective, Maya is "me" and FitBar is "them"
 * From the Business's perspective, FitBar is "me" and Maya is "them"
 */
const DEMO_MESSAGES: ThreadMessage[] = [
  {
    id: 'sys-1',
    type: 'system',
    icon: 'check',
    text: 'Deal accepted',
    timestamp: 'May 9 · 14:32',
  },
  {
    id: 'msg-1',
    type: 'message',
    side: 'them', // FitBar (Business) from Influencer's view
    text: 'Hey Maya! Super excited to work together. Just sent the brief through booking - let me know if anything is missing.',
    timestamp: '14:35',
    read: true,
  },
  {
    id: 'msg-2',
    type: 'message',
    side: 'me', // Maya (Influencer) from Influencer's view
    text: 'Thanks! Brief looks great. Quick question - do you have a high-res logo I can drop in for the story sticker?',
    timestamp: '14:48',
    read: true,
  },
  {
    id: 'msg-3',
    type: 'message',
    side: 'them',
    text: 'Sending now',
    timestamp: '14:51',
    read: true,
  },
  {
    id: 'msg-4',
    type: 'message',
    side: 'them',
    attachment: { kind: 'image', label: 'fitbar-logo.png' },
    timestamp: '14:51',
    read: true,
  },
];

/**
 * Demo thread for Influencer view (Maya as "me")
 */
const DEMO_THREAD_INFLUENCER: ThreadDetail = {
  id: 'demo-thread',
  deal: {
    id: 'deal_4f8a',
    status: 'IN_PROGRESS',
    business: {
      name: 'FitBar TLV',
      firstName: 'FitBar',
      monogram: 'FB',
      verified: true,
      phone: '+972501234567',
    },
    influencer: {
      name: 'Maya Cohen',
      firstName: 'Maya',
      phone: '+972529876543',
      photo: 'https://images.unsplash.com/photo-1518611012118-696072aa579a?w=400&q=80',
    },
    services: [
      { id: 'svc-1', name: 'Instagram Reel', platform: 'IG REEL', price: 350 },
      { id: 'svc-2', name: 'Story Set', platform: 'IG STORY', price: 180 },
    ],
    total: 530,
    dateLabel: 'Next week',
    dateRange: 'May 16 - May 23',
    acceptedAt: 'May 9 · 14:32',
  },
  messages: DEMO_MESSAGES,
  handoffState: null,
};

/**
 * Yael thread (from Business Inquiries mock) - Business view
 */
const YAEL_THREAD: ThreadDetail = {
  id: 'h-thr-1',
  deal: {
    id: 'deal_yael_1',
    status: 'DELIVERED',
    business: {
      name: 'Sunrise Cafe',
      firstName: 'Sunrise',
      monogram: 'SC',
      verified: false,
      phone: '+972501111111',
    },
    influencer: {
      name: 'Yael Mizrahi',
      firstName: 'Yael',
      phone: '+972522222222',
      photo: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=400&q=80',
    },
    services: [
      { id: 'svc-y1', name: 'TikTok Video', platform: 'TIKTOK', price: 450 },
    ],
    total: 450,
    dateLabel: 'This week',
    dateRange: 'May 10 - May 12',
    acceptedAt: 'May 8 · 10:15',
  },
  messages: [
    {
      id: 'sys-y1',
      type: 'system',
      icon: 'check',
      text: 'Deal accepted',
      timestamp: 'May 8 · 10:15',
    },
    {
      id: 'msg-y1',
      type: 'message',
      side: 'me', // Business
      text: 'Looking forward to the content!',
      timestamp: '10:20',
      read: true,
    },
    {
      id: 'msg-y2',
      type: 'message',
      side: 'them', // Yael
      text: 'Final cut delivered, hope you love it!',
      timestamp: '2h ago',
      read: false,
    },
  ],
  handoffState: null,
};

/**
 * Maya thread (from Business Inquiries mock) - Business view
 */
const MAYA_THREAD: ThreadDetail = {
  id: 'h-thr-2',
  deal: {
    id: 'deal_maya_2',
    status: 'IN_PROGRESS',
    business: {
      name: 'FitBar TLV',
      firstName: 'FitBar',
      monogram: 'FB',
      verified: true,
      phone: '+972501234567',
    },
    influencer: {
      name: 'Maya Cohen',
      firstName: 'Maya',
      phone: '+972529876543',
      photo: 'https://images.unsplash.com/photo-1518611012118-696072aa579a?w=400&q=80',
    },
    services: [
      { id: 'svc-m1', name: 'Instagram Reel', platform: 'IG REEL', price: 350 },
      { id: 'svc-m2', name: 'Story Set', platform: 'IG STORY', price: 180 },
    ],
    total: 530,
    dateLabel: 'Next week',
    dateRange: 'May 16 - May 23',
    acceptedAt: 'May 9 · 14:32',
  },
  messages: [
    {
      id: 'sys-m1',
      type: 'system',
      icon: 'check',
      text: 'Deal accepted',
      timestamp: 'May 9 · 14:32',
    },
    {
      id: 'msg-m1',
      type: 'message',
      side: 'me', // Business (FitBar)
      text: 'Hey Maya! Super excited to work together.',
      timestamp: '14:35',
      read: true,
    },
    {
      id: 'msg-m2',
      type: 'message',
      side: 'them', // Maya
      text: 'Got the brief, looking forward to filming!',
      timestamp: '11:42',
      read: false,
    },
  ],
  handoffState: null,
};

/**
 * All mock threads keyed by ID
 */
export const MOCK_THREADS: Record<string, ThreadDetail> = {
  'demo-thread': DEMO_THREAD_INFLUENCER,
  'h-thr-1': YAEL_THREAD,
  'h-thr-2': MAYA_THREAD,
};

/**
 * Get thread by ID, with role-aware message side swapping
 *
 * The mock data stores messages from a particular perspective.
 * When the viewer role changes, we need to swap 'me' and 'them'.
 *
 * For demo-thread: stored from Influencer perspective
 * For h-thr-* threads: stored from Business perspective
 */
export function getThread(
  threadId: string,
  viewerRole: ViewerRole
): ThreadDetail | null {
  const thread = MOCK_THREADS[threadId];
  if (!thread) return null;

  // Determine if we need to swap sides
  // demo-thread is stored as Influencer view
  // h-thr-* threads are stored as Business view
  const isInfluencerPerspective = threadId === 'demo-thread';
  const needsSwap =
    (isInfluencerPerspective && viewerRole === 'BUSINESS') ||
    (!isInfluencerPerspective && viewerRole === 'INFLUENCER');

  if (!needsSwap) {
    return thread;
  }

  // Swap message sides
  const swappedMessages: ThreadMessage[] = thread.messages.map((msg) => {
    if (msg.side === undefined) return msg; // System messages don't have sides
    return {
      ...msg,
      side: msg.side === 'me' ? 'them' : 'me',
    };
  });

  return {
    ...thread,
    messages: swappedMessages,
  };
}

/**
 * Get the counterparty based on viewer role
 */
export function getCounterparty(thread: ThreadDetail, viewerRole: ViewerRole) {
  return viewerRole === 'BUSINESS' ? thread.deal.influencer : thread.deal.business;
}

/**
 * Get the current user party based on viewer role
 */
export function getCurrentUser(thread: ThreadDetail, viewerRole: ViewerRole) {
  return viewerRole === 'BUSINESS' ? thread.deal.business : thread.deal.influencer;
}
