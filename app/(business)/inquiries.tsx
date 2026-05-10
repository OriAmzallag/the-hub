/**
 * Inquiries Screen (Business Route)
 * Mounts the shared InquiriesScreen with viewerRole='BUSINESS'.
 */

import React, { useMemo } from 'react';
import { InquiriesScreen } from '@/components/business/inquiries';
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
      viewerRole="BUSINESS"
      threads={threads}
      unreadTotal={unreadTotal}
    />
  );
}
