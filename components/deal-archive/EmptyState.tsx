/**
 * EmptyState Component
 * Empty state display for Deal History tabs.
 */

import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { colors } from '@/constants/theme';
import type { HistoryTab } from '@/types/dealArchive';
import type { ViewerRole } from '@/lib/dealLifecycle';

interface EmptyStateProps {
  tab: HistoryTab;
  viewerRole: ViewerRole;
}

/**
 * Get empty state copy based on tab and viewer role.
 */
function getEmptyStateCopy(tab: HistoryTab, viewerRole: ViewerRole): string {
  const isBusiness = viewerRole === 'business';

  switch (tab) {
    case 'completed':
      return isBusiness
        ? "Completed deals will appear here once you've rated them."
        : 'Your completed deals will appear here once both sides have rated.';
    case 'declined':
      return isBusiness
        ? 'Influencers who declined your requests will appear here.'
        : "Requests you've declined will appear here.";
    case 'expired':
      return isBusiness
        ? 'Requests that timed out without a response will appear here.'
        : "Requests you didn't respond to in time will appear here.";
  }
}

export function EmptyState({ tab, viewerRole }: EmptyStateProps) {
  const copy = getEmptyStateCopy(tab, viewerRole);

  return (
    <View style={styles.container}>
      <Text style={styles.eyebrow}>NOTHING HERE YET</Text>
      <Text style={styles.body}>{copy}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    paddingVertical: 48,
    paddingHorizontal: 24,
  },
  eyebrow: {
    fontFamily: 'JetBrainsMono-Medium',
    fontSize: 10,
    fontWeight: '500',
    letterSpacing: 2.2, // 0.22em
    lineHeight: 10,
    textTransform: 'uppercase',
    color: colors.inkMuted,
    marginBottom: 8,
  },
  body: {
    fontFamily: 'InterTight-Regular',
    fontSize: 13,
    fontWeight: '400',
    lineHeight: 19,
    color: colors.inkMuted,
    textAlign: 'center',
    maxWidth: 260,
  },
});
