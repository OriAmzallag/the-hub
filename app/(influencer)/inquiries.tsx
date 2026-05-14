/**
 * Inquiries Screen (Influencer Route)
 * Mounts the shared InquiriesScreen with viewerRole='influencer'.
 */

import React, { useMemo } from 'react';
import { InquiriesScreen } from '@/components/inquiries';
import {
  MOCK_INFLUENCER_THREADS,
  computeUnreadTotal,
} from '@/constants/mockInfluencerInquiries';

export default function InfluencerInquiriesScreen() {
  // In production, this would come from Supabase
  const threads = MOCK_INFLUENCER_THREADS;

  // Compute total unread for top bar and tab badge
  const unreadTotal = useMemo(() => computeUnreadTotal(threads), [threads]);

  return (
    <InquiriesScreen
      viewerRole="influencer"
      threads={threads}
      unreadTotal={unreadTotal}
    />
  );
}
