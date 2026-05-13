/**
 * TimelineEventRow Component
 * Single event in the timeline.
 */

import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { colors } from '@/constants/theme';
import { getEventMeta } from '@/lib/timelineEvents';
import { getToneColorKey } from '@/lib/dealLifecycle';
import type { TimelineEvent, ArchivedDeal } from '@/types/dealArchive';
import type { ViewerRole } from '@/lib/dealLifecycle';

interface TimelineEventRowProps {
  event: TimelineEvent;
  deal: ArchivedDeal;
  viewerRole: ViewerRole;
  isLast: boolean;
}

export function TimelineEventRow({
  event,
  deal,
  viewerRole,
  isLast,
}: TimelineEventRowProps) {
  const meta = getEventMeta(event, deal, viewerRole);
  const isDeclineTone = meta.tone === 'decline';

  // Icon colors based on tone
  const iconBg = isDeclineTone ? colors.declineSoft : colors.accentSoft;
  const iconBorder = isDeclineTone ? colors.declineBorder : colors.accentBorder;
  const iconColor = isDeclineTone ? colors.decline : colors.accent;

  return (
    <View style={styles.container}>
      {/* Left column: icon + connector */}
      <View style={styles.leftColumn}>
        {/* Icon circle */}
        <View
          style={[
            styles.iconCircle,
            { backgroundColor: iconBg, borderColor: iconBorder },
          ]}
        >
          <meta.Icon
            size={meta.iconProps.size}
            strokeWidth={meta.iconProps.strokeWidth}
            color={iconColor}
            fill={meta.iconProps.fill === 'currentColor' ? iconColor : undefined}
          />
        </View>

        {/* Connector line */}
        {!isLast && <View style={styles.connector} />}
      </View>

      {/* Right column: content */}
      <View style={styles.rightColumn}>
        {/* Title row */}
        <View style={styles.titleRow}>
          <Text style={styles.title}>{meta.title}</Text>
          <Text style={styles.timestamp}>
            {event.date} · {event.time}
          </Text>
        </View>

        {/* Detail (optional) */}
        {event.detail && (
          <Text style={styles.detail}>{event.detail}</Text>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    minHeight: 44,
  },
  leftColumn: {
    width: 24,
    alignItems: 'center',
    marginRight: 12,
  },
  iconCircle: {
    width: 24,
    height: 24,
    borderRadius: 12,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  connector: {
    flex: 1,
    width: 1,
    backgroundColor: colors.border,
    marginTop: 4,
    marginBottom: -4,
    minHeight: 16,
  },
  rightColumn: {
    flex: 1,
    paddingBottom: 16,
  },
  titleRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    gap: 8,
  },
  title: {
    flex: 1,
    fontFamily: 'InterTight-Bold',
    fontSize: 13.5,
    fontWeight: '700',
    letterSpacing: -0.27, // -0.02em
    lineHeight: 16,
    color: colors.ink,
  },
  timestamp: {
    fontFamily: 'JetBrainsMono-Medium',
    fontSize: 9,
    fontWeight: '500',
    letterSpacing: 0.9, // 0.1em
    lineHeight: 9,
    textTransform: 'uppercase',
    color: colors.inkSubtle,
    marginTop: 2,
  },
  detail: {
    fontFamily: 'InterTight-Regular',
    fontSize: 12,
    fontWeight: '400',
    lineHeight: 16,
    color: colors.inkMuted,
    marginTop: 2,
  },
});
