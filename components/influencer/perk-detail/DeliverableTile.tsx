/**
 * DeliverableTile Component
 * Individual deliverable with action, description, and qualification status.
 */

import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { colors, radii, typography } from '@/constants/theme';
import type { PerkDeliverable, ViewerReach } from '@/types/perk';
import { deliverableQualifies, formatThreshold, formatFollowers } from '@/lib/perkQualification';

interface DeliverableTileProps {
  deliverable: PerkDeliverable;
  index: number;
  viewerReach: ViewerReach;
}

export function DeliverableTile({
  deliverable,
  index,
  viewerReach,
}: DeliverableTileProps) {
  const qualifies = deliverableQualifies(deliverable, viewerReach);
  const viewerCount = viewerReach[deliverable.platform] || 0;
  const indexLabel = String(index + 1).padStart(2, '0');

  return (
    <View style={styles.container}>
      {/* Header row */}
      <View style={styles.header}>
        <View style={styles.headerLeft}>
          <Text style={styles.index}>{indexLabel}</Text>
          <Text style={styles.action}>
            {deliverable.action.toUpperCase()} ON {deliverable.platform.toUpperCase()}
          </Text>
        </View>
        <View style={[styles.chip, qualifies ? styles.chipQualified : styles.chipBelow]}>
          <Text style={[styles.chipText, qualifies ? styles.chipTextQualified : styles.chipTextBelow]}>
            {qualifies ? 'QUALIFIED' : 'BELOW'}
          </Text>
        </View>
      </View>

      {/* Description */}
      {deliverable.description && (
        <Text style={styles.description}>{deliverable.description}</Text>
      )}

      {/* Footer */}
      <View style={styles.footer}>
        <Text style={styles.requirement}>
          Need {formatThreshold(deliverable.requiredFollowers)}+ on {deliverable.platform}
        </Text>
        <Text style={[styles.viewerCount, qualifies ? styles.textQualified : styles.textBelow]}>
          You: {formatFollowers(viewerCount)}
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: radii.card,
    overflow: 'hidden',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 14,
  },
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  index: {
    fontFamily: 'JetBrainsMono-Medium',
    fontSize: 9,
    fontWeight: '500',
    letterSpacing: 0.9,
    color: colors.inkMuted,
  },
  action: {
    fontFamily: 'JetBrainsMono-Medium',
    fontSize: 10,
    fontWeight: '500',
    letterSpacing: 1,
    color: colors.accent,
  },
  chip: {
    paddingVertical: 4,
    paddingHorizontal: 8,
    borderRadius: radii.pill,
  },
  chipQualified: {
    backgroundColor: colors.accentSoft,
  },
  chipBelow: {
    backgroundColor: colors.declineSoft,
  },
  chipText: {
    fontFamily: 'JetBrainsMono-SemiBold',
    fontSize: 8,
    fontWeight: '600',
    letterSpacing: 0.96,
  },
  chipTextQualified: {
    color: colors.accent,
  },
  chipTextBelow: {
    color: colors.decline,
  },
  description: {
    paddingHorizontal: 14,
    paddingBottom: 14,
    fontFamily: 'InterTight-Regular',
    fontSize: 14,
    fontWeight: '400',
    lineHeight: 21,
    color: colors.ink,
  },
  footer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 10,
    paddingHorizontal: 14,
    borderTopWidth: 1,
    borderTopColor: colors.border,
  },
  requirement: {
    fontFamily: 'JetBrainsMono-Medium',
    fontSize: 9,
    fontWeight: '500',
    letterSpacing: 0.9,
    color: colors.inkMuted,
  },
  viewerCount: {
    fontFamily: 'JetBrainsMono-Medium',
    fontSize: 9,
    fontWeight: '500',
    letterSpacing: 0.9,
  },
  textQualified: {
    color: colors.accent,
  },
  textBelow: {
    color: colors.decline,
  },
});
