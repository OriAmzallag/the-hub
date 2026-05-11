/**
 * QualificationBanner Component
 * Shows qualification status: qualified, partial match, or below threshold.
 */

import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { CheckCircle2, AlertCircle } from 'lucide-react-native';
import { colors, radii, typography } from '@/constants/theme';
import type { QualificationStatus, PerkDeliverable, ViewerReach } from '@/types/perk';
import { deliverableQualifies } from '@/lib/perkQualification';

interface QualificationBannerProps {
  status: QualificationStatus;
  deliverables: PerkDeliverable[];
  viewerReach: ViewerReach;
}

export function QualificationBanner({
  status,
  deliverables,
  viewerReach,
}: QualificationBannerProps) {
  // Count how many deliverables the user qualifies for
  const qualifiedCount = deliverables.filter((d) =>
    deliverableQualifies(d, viewerReach)
  ).length;
  const totalCount = deliverables.length;

  if (status === 'full') {
    return (
      <View style={[styles.container, styles.qualified]}>
        <CheckCircle2
          size={24}
          strokeWidth={2}
          color={colors.accent}
          fill={colors.accentSoft}
        />
        <View style={styles.textBlock}>
          <Text style={styles.titleQualified}>You qualify</Text>
          <Text style={styles.caption}>All reach requirements met</Text>
        </View>
      </View>
    );
  }

  if (status === 'partial') {
    return (
      <View style={[styles.container, styles.decline]}>
        <AlertCircle size={24} strokeWidth={2} color={colors.decline} />
        <View style={styles.textBlock}>
          <Text style={styles.titleDecline}>Partial match</Text>
          <Text style={styles.body}>
            {qualifiedCount} of {totalCount} requirements met. Check the deliverables below to see where you fall short.
          </Text>
        </View>
      </View>
    );
  }

  // status === 'none'
  return (
    <View style={[styles.container, styles.decline]}>
      <AlertCircle size={24} strokeWidth={2} color={colors.decline} />
      <View style={styles.textBlock}>
        <Text style={styles.titleDecline}>Below threshold</Text>
        <Text style={styles.body}>
          Keep growing — or browse perks that match your current reach.
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 12,
    marginHorizontal: 16,
    marginTop: 20,
    padding: 14,
    borderWidth: 1,
    borderRadius: radii.card,
  },
  qualified: {
    backgroundColor: colors.accentSoft,
    borderColor: colors.accentBorder,
  },
  decline: {
    backgroundColor: colors.declineSoft,
    borderColor: colors.declineBorder,
  },
  textBlock: {
    flex: 1,
    gap: 4,
  },
  titleQualified: {
    ...typography.rowTitle,
    color: colors.ink,
  },
  titleDecline: {
    ...typography.rowTitle,
    color: colors.decline,
  },
  body: {
    fontFamily: 'InterTight-Regular',
    fontSize: 13,
    fontWeight: '400',
    lineHeight: 18.2,
    color: colors.ink,
  },
  caption: {
    ...typography.monoStatusWide,
    color: colors.accent,
  },
});
