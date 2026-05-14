/**
 * Inquiries Screen (Business Route)
 * Mounts the shared InquiriesScreen with viewerRole='business'.
 */

import React, { useMemo } from 'react';
import { InquiriesScreen } from '@/components/inquiries';
import {
  MOCK_BUSINESS_THREADS,
  computeUnreadTotal,
} from '@/constants/mockBusinessInquiries';

export default function BusinessInquiriesScreen() {
  // In production, this would come from Supabase
  const threads = MOCK_BUSINESS_THREADS;

  // Compute total unread for top bar and tab badge
  const unreadTotal = useMemo(() => computeUnreadTotal(threads), [threads]);

  return (
    <InquiriesScreen
      viewerRole="business"
      threads={threads}
      unreadTotal={unreadTotal}
    />
  );
}
