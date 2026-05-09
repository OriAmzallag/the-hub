/**
 * DealRow Component
 * Single deal item in the deals list.
 */

import React, { memo } from 'react';
import { View, Text, Pressable, StyleSheet } from 'react-native';
import { Image } from 'expo-image';
import { ChevronRight } from 'lucide-react-native';
import { colors, typography, borderRadius } from '@/constants/theme';
import type { Deal } from '@/types/business';

interface DealRowProps {
  deal: Deal;
  onPress?: () => void;
}

function DealRowComponent({ deal, onPress }: DealRowProps) {
  const statusColor = deal.statusAccent ? colors.accent : colors.inkMuted;

  return (
    <Pressable
      style={styles.container}
      onPress={onPress}
      accessibilityRole="button"
      accessibilityLabel={`Deal with ${deal.talent.name}, ${deal.statusLabel}, ${deal.total} shekels`}
    >
      {/* Talent photo */}
      <View style={styles.photoContainer}>
        <Image
          source={{ uri: deal.talent.photo }}
          style={styles.photo}
          contentFit="cover"
          transition={200}
        />
      </View>

      {/* Talent name + status */}
      <View style={styles.content}>
        <Text style={styles.name} numberOfLines={1}>
          {deal.talent.name}
        </Text>
        <View style={styles.statusRow}>
          <Text style={[styles.status, { color: statusColor }]}>
            {deal.statusLabel}
          </Text>
          <View style={styles.dot} />
          <Text style={styles.services}>{deal.services}</Text>
        </View>
      </View>

      {/* Right side: total + chevron */}
      <View style={styles.rightSide}>
        <Text style={styles.total}>₪{deal.total}</Text>
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
