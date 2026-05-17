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
  return viewerRole === 'business' ? TEMPLATES_BUSINESS : TEMPLATES_INFLUENCER;
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
    state: 'IN_PROGRESS',
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
 * Liat thread (from Business Inquiries mock) - Business view
 *
 * Fresh incoming booking request. Liat reached out to FitBar, business
 * has not responded yet. State is PENDING with 47h on the countdown.
 * Single inbound message, no acceptance system event yet.
 */
const LIAT_THREAD: ThreadDetail = {
  id: 'h-thr-0',
  deal: {
    id: 'deal_liat_inbound',
    state: 'PENDING',
    business: {
      name: 'FitBar TLV',
      firstName: 'FitBar',
      monogram: 'FB',
      verified: true,
      phone: '+972501234567',
    },
    influencer: {
      name: 'Liat Cohen',
      firstName: 'Liat',
      phone: '+972529998877',
      photo:
        'https://images.unsplash.com/photo-1487412720507-e7ab37603c6f?w=400&q=80',
    },
    services: [
      { id: 'svc-l1', name: 'Story Set', platform: 'IG STORY', price: 400 },
    ],
    total: 400,
    dateLabel: 'Next week',
    dateRange: 'May 22 - May 23',
    acceptedAt: '',
  },
  messages: [
    {
      id: 'msg-l1',
      type: 'message',
      side: 'them', // Liat (Influencer reaching out to Business)
      text: "Hi! Love what you're doing at FitBar — would you be open to a story set for the new menu?",
      timestamp: '30m ago',
      read: false,
    },
  ],
  handoffState: null,
};

/**
 * Yael thread (from Business Inquiries mock) - Business view
 * Updated to COMPLETED state per v0.8 lifecycle (DELIVERED removed)
 */
const YAEL_THREAD: ThreadDetail = {
  id: 'h-thr-1',
  deal: {
    id: 'deal_yael_1',
    state: 'COMPLETED',
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
      text: 'Work complete, looking forward to your rating!',
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
    state: 'IN_PROGRESS',
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

// =================================================================
// Maya's Inbox threads (i-thr-*) - stored from Influencer perspective
// One per row in constants/mockInfluencerInquiries.ts. Maya is "me".
// =================================================================

const MAYA_IDENTITY = {
  name: 'Maya Cohen',
  firstName: 'Maya',
  phone: '+972529876543',
  photo: 'https://images.unsplash.com/photo-1518611012118-696072aa579a?w=400&q=80',
};

const BELLBOY_THREAD: ThreadDetail = {
  id: 'i-thr-1',
  deal: {
    id: 'deal_bellboy',
    state: 'PENDING',
    business: { name: 'Bellboy', firstName: 'Bellboy', monogram: 'BL', verified: true, phone: '+972503334444' },
    influencer: MAYA_IDENTITY,
    services: [
      { id: 'svc-b1', name: 'Instagram Reel', platform: 'IG REEL', price: 480 },
    ],
    total: 480,
    dateLabel: 'Next week',
    dateRange: 'May 19 - May 23',
    acceptedAt: '',
  },
  messages: [
    {
      id: 'sys-bb-1',
      type: 'system',
      icon: 'send',
      text: 'Booking request sent',
      timestamp: '1h ago',
    },
    {
      id: 'msg-bb-1',
      type: 'message',
      side: 'them', // Bellboy
      text: 'Hi Maya, we loved your content! Would you be interested in a collaboration?',
      timestamp: '1h ago',
      read: false,
    },
  ],
  handoffState: null,
};

const FITBAR_PROGRESS_THREAD: ThreadDetail = {
  id: 'i-thr-2',
  deal: {
    id: 'deal_fitbar_inprog',
    state: 'IN_PROGRESS',
    business: { name: 'FitBar TLV', firstName: 'FitBar', monogram: 'FB', verified: true, phone: '+972501234567' },
    influencer: MAYA_IDENTITY,
    services: [
      { id: 'svc-f1', name: 'Story Set', platform: 'IG STORY', price: 530 },
    ],
    total: 530,
    dateLabel: 'This week',
    dateRange: 'May 13 - May 14',
    acceptedAt: 'May 12 · 09:10',
    // Mirrors `deal-2` in mockInfluencerDashboard so Mark Done from the
    // thread updates the Dashboard card via lib/dealStore.
    dashboardDealId: 'deal-2',
  },
  messages: [
    {
      id: 'sys-fb-1',
      type: 'system',
      icon: 'check',
      text: 'Deal accepted',
      timestamp: 'May 12 · 09:10',
    },
    {
      id: 'msg-fb-1',
      type: 'message',
      side: 'me', // Maya
      text: 'See you tomorrow at 10am for the shoot. Bringing the gear.',
      timestamp: '10:15',
      read: true,
    },
    {
      id: 'msg-fb-2',
      type: 'message',
      side: 'them', // FitBar
      text: 'Perfect, see you tomorrow at 10am for the shoot!',
      timestamp: '10:30',
      read: true,
    },
  ],
  handoffState: null,
};

const SUSHI_THREAD: ThreadDetail = {
  id: 'i-thr-3',
  deal: {
    id: 'deal_sushi_completed',
    state: 'COMPLETED',
    business: { name: 'Sushi Bar', firstName: 'Sushi', monogram: 'SB', verified: false, phone: '+972505556666' },
    influencer: MAYA_IDENTITY,
    services: [
      { id: 'svc-s1', name: 'Instagram Reel', platform: 'IG REEL', price: 180 },
    ],
    total: 180,
    dateLabel: 'Last week',
    dateRange: 'May 5 - May 9',
    acceptedAt: 'May 5 · 12:00',
  },
  messages: [
    {
      id: 'sys-sb-1',
      type: 'system',
      icon: 'check',
      text: 'Deal accepted',
      timestamp: 'May 5 · 12:00',
    },
    {
      id: 'msg-sb-1',
      type: 'message',
      side: 'me',
      text: 'Content shared, hope you love it!',
      timestamp: 'Yesterday',
      read: true,
    },
    {
      id: 'msg-sb-2',
      type: 'message',
      side: 'them',
      text: 'Thanks for the amazing content! Really exceeded our expectations.',
      timestamp: 'Yesterday',
      read: true,
    },
  ],
  handoffState: null,
};

const BEAUTYBAR_THREAD: ThreadDetail = {
  id: 'i-thr-4',
  deal: {
    id: 'deal_beautybar',
    state: 'COMPLETED',
    business: { name: 'BeautyBar', firstName: 'BeautyBar', monogram: 'BB', verified: true, phone: '+972507778888' },
    influencer: MAYA_IDENTITY,
    services: [
      { id: 'svc-bb-1', name: 'Story Set', platform: 'IG STORY', price: 420 },
    ],
    total: 420,
    dateLabel: 'Last week',
    dateRange: 'May 3 - May 6',
    acceptedAt: 'May 3 · 14:00',
  },
  messages: [
    {
      id: 'sys-bbar-1',
      type: 'system',
      icon: 'check',
      text: 'Deal accepted',
      timestamp: 'May 3 · 14:00',
    },
    {
      id: 'msg-bbar-1',
      type: 'message',
      side: 'me',
      text: 'Thanks for the collaboration!',
      timestamp: '3d ago',
      read: true,
    },
  ],
  handoffState: null,
};

const ONZA_THREAD: ThreadDetail = {
  id: 'i-thr-5',
  deal: {
    id: 'deal_onza_completed',
    state: 'COMPLETED',
    business: { name: 'Onza', firstName: 'Onza', monogram: 'ON', verified: true, phone: '+972509990000' },
    influencer: MAYA_IDENTITY,
    services: [
      { id: 'svc-o1', name: 'TikTok Native', platform: 'TIKTOK', price: 420 },
    ],
    total: 420,
    dateLabel: 'Last week',
    dateRange: 'May 1 - May 5',
    acceptedAt: 'May 1 · 11:30',
  },
  messages: [
    {
      id: 'sys-on-1',
      type: 'system',
      icon: 'check',
      text: 'Deal accepted',
      timestamp: 'May 1 · 11:30',
    },
    {
      id: 'msg-on-1',
      type: 'message',
      side: 'me',
      text: 'Final cut delivered. Hope it lands well!',
      timestamp: '3d ago',
      read: true,
    },
    {
      id: 'msg-on-2',
      type: 'message',
      side: 'them',
      text: 'Engagement is already through the roof. Will rate now.',
      timestamp: '2d ago',
      read: false,
    },
    {
      id: 'msg-on-3',
      type: 'message',
      side: 'them',
      text: 'Just wanted to say thank you again for the great work!',
      timestamp: '2d ago',
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
  'h-thr-0': LIAT_THREAD,
  'h-thr-1': YAEL_THREAD,
  'h-thr-2': MAYA_THREAD,
  'i-thr-1': BELLBOY_THREAD,
  'i-thr-2': FITBAR_PROGRESS_THREAD,
  'i-thr-3': SUSHI_THREAD,
  'i-thr-4': BEAUTYBAR_THREAD,
  'i-thr-5': ONZA_THREAD,
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

  // Determine if we need to swap sides.
  // - demo-thread + i-thr-* are stored from the Influencer perspective
  //   (Maya is "me" in the message data).
  // - h-thr-* threads are stored from the Business perspective.
  const isInfluencerPerspective =
    threadId === 'demo-thread' || threadId.startsWith('i-thr-');
  const needsSwap =
    (isInfluencerPerspective && viewerRole === 'business') ||
    (!isInfluencerPerspective && viewerRole === 'influencer');

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
  return viewerRole === 'business' ? thread.deal.influencer : thread.deal.business;
}

/**
 * Get the current user party based on viewer role
 */
export function getCurrentUser(thread: ThreadDetail, viewerRole: ViewerRole) {
  return viewerRole === 'business' ? thread.deal.business : thread.deal.influencer;
}
