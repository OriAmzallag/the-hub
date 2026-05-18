/**
 * PerkCard Component
 * Individual perk card with cover image, badges, and qualification status.
 * Supports both fixed width (horizontal scroll) and flexible width (grid) layouts.
 */

import React from 'react';
import { View, Text, Image, StyleSheet, Pressable, ViewStyle } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import { Check } from 'lucide-react-native';
import { colors, radii, typography } from '@/constants/theme';
import type { Perk, ViewerReach } from '@/types/perk';
import {
  qualifiesForPerk,
  getCardPlatformLine,
} from '@/lib/perkQualification';

interface PerkCardProps {
  perk: Perk;
  viewerReach: ViewerReach;
  /** Optional container style override (e.g., for grid flex sizing) */
  style?: ViewStyle;
}

export function PerkCard({ perk, viewerReach, style }: PerkCardProps) {
  const router = useRouter();
  const qualifies = qualifiesForPerk(perk, viewerReach);
  const platformLine = getCardPlatformLine(perk);
  const badgeLabel = perk.badge || (perk.expiringSoon ? 'EXPIRING' : null);

  // Build action line from first deliverable (for single) or summary (for multi)
  const actionLine =
    perk.deliverables.length === 1
      ? `${perk.deliverables[0].action} on ${perk.deliverables[0].platform}`.toUpperCase()
      : `${perk.deliverables.length} DELIVERABLES`;

  const handlePress = () => {
    router.push(`/perks/${perk.id}`);
  };

  return (
    <Pressable style={[styles.container, style]} onPress={handlePress}>
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
        <Text style={styles.action}>{actionLine}</Text>

        {/* Threshold + qualification row */}
        <View style={styles.qualificationRow}>
          <Text style={styles.threshold}>{platformLine.toUpperCase()}</Text>
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
    </Pressable>
  );
}

const styles = StyleSheet.create({
  container: {
    width: 200, // Default for horizontal scroll; overridden by style prop in grid
  },
  cover: {
    width: '100%',
    aspectRatio: 4 / 5,
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
