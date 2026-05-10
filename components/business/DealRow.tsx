/**
 * DealRow Component
 * Single deal item in the deals list.
 */

import React, { memo } from 'react';
import { View, Text, Pressable, StyleSheet } from 'react-native';
import { Image } from 'expo-image';
import { ChevronRight } from 'lucide-react-native';
import { colors, typography, borderRadius } from '@/constants/theme';
import { getDealCaption } from '@/lib/dealLifecycle';
import type { Deal } from '@/types/business';

interface DealRowProps {
  deal: Deal;
  onPress?: () => void;
}

function DealRowComponent({ deal, onPress }: DealRowProps) {
  // Resolve caption and color tier using the canonical lifecycle resolver
  const caption = getDealCaption(deal.state, 'BUSINESS', {
    hoursLeft: deal.hoursLeft,
    businessRated: deal.businessRated,
    influencerRated: deal.influencerRated,
  });

  // Map tier to theme color token
  const statusColor = colors[caption.tier];

  return (
    <Pressable
      style={styles.container}
      onPress={onPress}
      accessibilityRole="button"
      accessibilityLabel={`Deal with ${deal.influencer.name}, ${caption.text}, ${deal.total} shekels`}
    >
      {/* Influencer photo */}
      <View style={styles.photoContainer}>
        <Image
          source={{ uri: deal.influencer.photo }}
          style={styles.photo}
          contentFit="cover"
          transition={200}
        />
      </View>

      {/* Influencer name + status */}
      <View style={styles.content}>
        <Text style={styles.name} numberOfLines={1}>
          {deal.influencer.name}
        </Text>
        <View style={styles.statusRow}>
          <Text style={[styles.status, { color: statusColor }]}>
            {caption.text}
          </Text>
          <View style={styles.dot} />
          <Text style={styles.services}>{deal.services}</Text>
        </View>
      </View>

      {/* Right side: total + chevron */}
      <View style={styles.rightSide}>
        <Text style={styles.total}>{'₪'}{deal.total}</Text>
        <ChevronRight
          size={16}
          strokeWidth={2.2}
          color={statusColor}
        />
      </View>
    </Pressable>
  );
}

// Memoize to prevent unnecessary re-renders in lists
export const DealRow = memo(DealRowComponent);

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: borderRadius.xl,
    padding: 14,
    paddingHorizontal: 16,
    gap: 12,
  },
  photoContainer: {
    width: 44,
    height: 44,
    borderRadius: borderRadius.lg,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: colors.borderStrong,
  },
  photo: {
    width: '100%',
    height: '100%',
  },
  content: {
    flex: 1,
    minWidth: 0,
  },
  name: {
    ...typography.rowTitle,
    color: colors.ink,
    marginBottom: 4,
  },
  statusRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  status: {
    ...typography.monoStatus,
  },
  dot: {
    width: 3,
    height: 3,
    borderRadius: 1.5,
    backgroundColor: colors.inkSubtle,
  },
  services: {
    ...typography.monoStatus,
    color: colors.inkMuted,
  },
  rightSide: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  total: {
    ...typography.rowPrimary,
    color: colors.ink,
  },
});
