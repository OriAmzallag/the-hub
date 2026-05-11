/**
 * PerkCard Component
 * Individual perk card with cover image, badges, and qualification status.
 */

import React from 'react';
import { View, Text, Image, StyleSheet } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Check } from 'lucide-react-native';
import { colors, radii, typography } from '@/constants/theme';
import type { Perk, ViewerReach } from '@/types/perk';
import { qualifiesForPerk, formatFollowers } from '@/lib/perkQualification';

interface PerkCardProps {
  perk: Perk;
  viewerReach: ViewerReach;
}

export function PerkCard({ perk, viewerReach }: PerkCardProps) {
  const qualifies = qualifiesForPerk(perk, viewerReach);
  const thresholdLabel = `${formatFollowers(perk.requiredFollowers)}+ ON ${perk.requiredPlatform}`;
  const badgeLabel = perk.badge || (perk.expiringSoon ? 'EXPIRING' : null);

  return (
    <View style={styles.container}>
      {/* Cover image */}
      <View style={styles.cover}>
        <Image source={{ uri: perk.cover }} style={styles.coverImage} />

        {/* Top badge */}
        {badgeLabel && (
          <View style={styles.badge}>
            <Text style={styles.badgeText}>{badgeLabel.toUpperCase()}</Text>
          </View>
        )}

        {/* Bottom scrim */}
        <LinearGradient
          colors={['transparent', 'rgba(0,0,0,0.75)']}
          style={styles.scrim}
        />

        {/* Value chip */}
        <View style={styles.valueChip}>
          <Text style={styles.valueText}>₪{perk.value}</Text>
        </View>
      </View>

      {/* Caption block */}
      <View style={styles.caption}>
        <Text style={styles.title} numberOfLines={1}>
          {perk.title}
        </Text>
        <Text style={styles.business} numberOfLines={1}>
          {perk.business.toUpperCase()}
        </Text>
        <Text style={styles.action}>{perk.requiredAction.toUpperCase()}</Text>

        {/* Threshold + qualification row */}
        <View style={styles.qualificationRow}>
          <Text style={styles.threshold}>{thresholdLabel}</Text>
          <View style={styles.dot} />
          {qualifies ? (
            <View style={styles.qualifyStatus}>
              <Text style={styles.qualifyText}>You qualify</Text>
              <Check size={9} strokeWidth={3} color={colors.accent} />
            </View>
          ) : (
            <Text style={styles.belowText}>Below threshold</Text>
          )}
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: 200,
  },
  cover: {
    width: 200,
    height: 250,
    borderRadius: radii.card,
    borderWidth: 1,
    borderColor: colors.borderStrong,
    overflow: 'hidden',
    position: 'relative',
  },
  coverImage: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
  badge: {
    position: 'absolute',
    top: 10,
    left: 10,
    paddingVertical: 5,
    paddingHorizontal: 8,
    backgroundColor: colors.bgOverlay85,
    borderWidth: 1,
    borderColor: colors.accentBorder,
    borderRadius: radii.pill,
  },
  badgeText: {
    ...typography.monoStatusWide,
    color: colors.accent,
  },
  scrim: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: 80,
  },
  valueChip: {
    position: 'absolute',
    bottom: 10,
    left: 10,
    paddingVertical: 6,
    paddingHorizontal: 10,
    backgroundColor: colors.bgOverlay85,
    borderRadius: radii.pill,
  },
  valueText: {
    fontFamily: 'InterTight-Bold',
    fontSize: 13,
    fontWeight: '700',
    letterSpacing: -0.325,
    color: colors.ink,
  },
  caption: {
    paddingTop: 10,
    paddingHorizontal: 2,
  },
  title: {
    ...typography.bannerTitle,
    color: colors.ink,
  },
  business: {
    marginTop: 4,
    fontFamily: 'JetBrainsMono-Medium',
    fontSize: 9,
    fontWeight: '500',
    letterSpacing: 1.35,
    textTransform: 'uppercase',
    color: colors.inkMuted,
  },
  action: {
    marginTop: 3,
    fontFamily: 'JetBrainsMono-Medium',
    fontSize: 9,
    fontWeight: '500',
    letterSpacing: 1.08,
    textTransform: 'uppercase',
    color: colors.ink,
  },
  qualificationRow: {
    marginTop: 5,
    flexDirection: 'row',
    alignItems: 'center',
  },
  threshold: {
    fontFamily: 'JetBrainsMono-Medium',
    fontSize: 9,
    fontWeight: '500',
    letterSpacing: 1.08,
    textTransform: 'uppercase',
    color: colors.inkMuted,
  },
  dot: {
    width: 3,
    height: 3,
    borderRadius: 1.5,
    backgroundColor: colors.inkSubtle,
    marginHorizontal: 6,
  },
  qualifyStatus: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 3,
  },
  qualifyText: {
    fontFamily: 'JetBrainsMono-Medium',
    fontSize: 9,
    fontWeight: '500',
    letterSpacing: 1.08,
    color: colors.accent,
  },
  belowText: {
    fontFamily: 'JetBrainsMono-Medium',
    fontSize: 9,
    fontWeight: '500',
    letterSpacing: 1.08,
    color: colors.decline,
  },
});
