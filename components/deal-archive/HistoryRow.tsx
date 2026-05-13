/**
 * HistoryRow Component
 * Single row in the Deal History list.
 */

import React from 'react';
import { View, Text, Pressable, Image, StyleSheet } from 'react-native';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from 'react-native-reanimated';
import { colors, motion } from '@/constants/theme';
import { getDealCaption, getToneColorKey } from '@/lib/dealLifecycle';
import type { ArchivedDeal } from '@/types/dealArchive';
import type { ViewerRole } from '@/lib/dealLifecycle';

interface HistoryRowProps {
  deal: ArchivedDeal;
  viewerRole: ViewerRole;
  onPress: () => void;
}

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

export function HistoryRow({ deal, viewerRole, onPress }: HistoryRowProps) {
  const scale = useSharedValue(1);
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

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  const handlePressIn = () => {
    scale.value = withTiming(0.99, { duration: motion.duration.fast });
  };

  const handlePressOut = () => {
    scale.value = withTiming(1, { duration: motion.duration.fast });
  };

  return (
    <AnimatedPressable
      style={[styles.container, animatedStyle]}
      onPress={onPress}
      onPressIn={handlePressIn}
      onPressOut={handlePressOut}
      accessibilityRole="button"
      accessibilityLabel={`View deal with ${counterpartyName}`}
    >
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

      {/* Middle column */}
      <View style={styles.middle}>
        <Text style={styles.name} numberOfLines={1}>
          {counterpartyName}
        </Text>
        <Text style={[styles.caption, { color: captionColor }]}>
          {caption.text}
        </Text>
        <Text style={styles.summary} numberOfLines={1}>
          {deal.serviceSummary} · {'₪'}{deal.money}
        </Text>
      </View>

      {/* Right column */}
      <Text style={styles.date}>{deal.terminalDate}</Text>
    </AnimatedPressable>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 13,
    paddingHorizontal: 14,
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 12,
    gap: 12,
  },
  avatar: {
    width: 40,
    height: 40,
    borderRadius: 11,
    borderWidth: 1,
    borderColor: colors.borderStrong,
  },
  avatarDesaturated: {
    opacity: 0.6,
  },
  monogramTile: {
    width: 40,
    height: 40,
    borderRadius: 11,
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
    fontSize: 14,
    fontWeight: '700',
    letterSpacing: -0.28,
    color: colors.ink,
  },
  middle: {
    flex: 1,
    gap: 3,
  },
  name: {
    fontFamily: 'InterTight-Bold',
    fontSize: 14,
    fontWeight: '700',
    letterSpacing: -0.35, // -0.025em
    lineHeight: 16,
    color: colors.ink,
  },
  caption: {
    fontFamily: 'JetBrainsMono-SemiBold',
    fontSize: 8.5,
    fontWeight: '600',
    letterSpacing: 1.36, // 0.16em
    lineHeight: 9,
    textTransform: 'uppercase',
  },
  summary: {
    fontFamily: 'InterTight-Regular',
    fontSize: 11.5,
    fontWeight: '400',
    lineHeight: 14,
    color: colors.inkMuted,
  },
  date: {
    fontFamily: 'JetBrainsMono-Medium',
    fontSize: 9,
    fontWeight: '500',
    letterSpacing: 1.08, // 0.12em
    lineHeight: 9,
    textTransform: 'uppercase',
    color: colors.inkSubtle,
  },
});
