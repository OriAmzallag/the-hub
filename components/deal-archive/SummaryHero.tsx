/**
 * SummaryHero Component
 * Compact hero for Deal Summary screen.
 */

import React from 'react';
import { View, Text, Image, StyleSheet } from 'react-native';
import { colors } from '@/constants/theme';
import { getDealCaption, getToneColorKey } from '@/lib/dealLifecycle';
import type { ArchivedDeal } from '@/types/dealArchive';
import type { ViewerRole } from '@/lib/dealLifecycle';

interface SummaryHeroProps {
  deal: ArchivedDeal;
  viewerRole: ViewerRole;
}

export function SummaryHero({ deal, viewerRole }: SummaryHeroProps) {
  const isBusiness = viewerRole === 'business';
  const isDesaturated = deal.state === 'EXPIRED' || deal.state === 'DECLINED';

  // Get caption from canonical resolver
  const caption = getDealCaption(
    {
      state: deal.state,
      rating: deal.ratings?.business?.stars ?? deal.ratings?.influencer?.stars,
      declineReason: deal.declineReason,
    },
    viewerRole
  );
  const captionColor = colors[getToneColorKey(caption.tone)];

  // Counterparty display
  const counterpartyName = isBusiness
    ? deal.influencer.name
    : deal.business.name;
  const counterpartyPhoto = isBusiness ? deal.influencer.photo : null;
  const counterpartyMonogram = isBusiness ? null : deal.business.monogram;

  return (
    <View style={styles.container}>
      {/* Avatar */}
      {counterpartyPhoto ? (
        <Image
          source={{ uri: counterpartyPhoto }}
          style={[
            styles.avatar,
            isDesaturated && styles.avatarDesaturated,
          ]}
        />
      ) : (
        <View
          style={[
            styles.monogramTile,
            isDesaturated && styles.monogramDesaturated,
          ]}
        >
          <Text style={styles.monogramText}>{counterpartyMonogram}</Text>
        </View>
      )}

      {/* Info */}
      <View style={styles.info}>
        <Text style={[styles.caption, { color: captionColor }]}>
          {caption.text}
        </Text>
        <Text style={styles.name}>{counterpartyName}</Text>
        <Text style={styles.summary}>
          {deal.serviceSummary} · {'₪'}{deal.money}
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 14,
    marginBottom: 24,
  },
  avatar: {
    width: 56,
    height: 56,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: colors.borderStrong,
  },
  avatarDesaturated: {
    opacity: 0.6,
  },
  monogramTile: {
    width: 56,
    height: 56,
    borderRadius: 14,
    backgroundColor: colors.surfaceAlt,
    borderWidth: 1,
    borderColor: colors.borderStrong,
    alignItems: 'center',
    justifyContent: 'center',
  },
  monogramDesaturated: {
    opacity: 0.6,
  },
  monogramText: {
    fontFamily: 'InterTight-Bold',
    fontSize: 18,
    fontWeight: '700',
    letterSpacing: -0.36,
    color: colors.ink,
  },
  info: {
    flex: 1,
    gap: 4,
  },
  caption: {
    fontFamily: 'JetBrainsMono-SemiBold',
    fontSize: 8.5,
    fontWeight: '600',
    letterSpacing: 1.36, // 0.16em
    lineHeight: 9,
    textTransform: 'uppercase',
  },
  name: {
    fontFamily: 'InterTight-ExtraBold',
    fontSize: 18,
    fontWeight: '800',
    letterSpacing: -0.63, // -0.035em
    lineHeight: 20,
    color: colors.ink,
  },
  summary: {
    fontFamily: 'InterTight-Regular',
    fontSize: 12,
    fontWeight: '400',
    lineHeight: 15,
    color: colors.inkMuted,
  },
});
