/**
 * Timeline Component
 * Vertical event list for Deal Summary screen.
 */

import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { colors } from '@/constants/theme';
import { TimelineEventRow } from './TimelineEventRow';
import type { ArchivedDeal } from '@/types/dealArchive';
import type { ViewerRole } from '@/lib/dealLifecycle';

interface TimelineProps {
  deal: ArchivedDeal;
  viewerRole: ViewerRole;
}

export function Timeline({ deal, viewerRole }: TimelineProps) {
  const events = deal.timeline;

  return (
    <View style={styles.container}>
      <Text style={styles.sectionHeader}>THE STORY</Text>
      <View style={styles.eventList}>
        {events.map((event, index) => (
          <TimelineEventRow
            key={event.id}
            event={event}
            deal={deal}
            viewerRole={viewerRole}
            isLast={index === events.length - 1}
          />
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginBottom: 24,
  },
  sectionHeader: {
    fontFamily: 'JetBrainsMono-Medium',
    fontSize: 10,
    fontWeight: '500',
    letterSpacing: 2.2, // 0.22em
    lineHeight: 10,
    textTransform: 'uppercase',
    color: colors.inkMuted,
    marginBottom: 16,
  },
  eventList: {
    gap: 0,
  },
});
