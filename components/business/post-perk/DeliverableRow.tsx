/**
 * DeliverableRow Component
 * Compact button-style row showing deliverable summary with edit affordance.
 */

import React from 'react';
import { View, Text, Pressable, StyleSheet } from 'react-native';
import { Edit3 } from 'lucide-react-native';
import { colors, radii, typography } from '@/constants/theme';
import type { FormDeliverable } from './types';

interface DeliverableRowProps {
  deliverable: FormDeliverable;
  index: number;
  onPress: () => void;
}

function formatThreshold(followers: number): string {
  if (followers >= 1000000) {
    return `${(followers / 1000000).toFixed(1).replace(/\.0$/, '')}M`;
  }
  if (followers >= 1000) {
    return `${(followers / 1000).toFixed(1).replace(/\.0$/, '')}K`;
  }
  return followers.toLocaleString();
}

export function DeliverableRow({
  deliverable,
  index,
  onPress,
}: DeliverableRowProps) {
  const indexLabel = String(index + 1).padStart(2, '0');
  const actionText = `${deliverable.action.toUpperCase()} ON ${deliverable.platform.toUpperCase()}`;
  const thresholdText = `${formatThreshold(deliverable.requiredFollowers)}+ ON ${deliverable.platform}`;

  return (
    <Pressable style={styles.container} onPress={onPress}>
      <View style={styles.content}>
        <View style={styles.headerRow}>
          <Text style={styles.index}>{indexLabel}</Text>
          <Text style={styles.action}>{actionText}</Text>
        </View>
        <Text style={styles.threshold}>{thresholdText}</Text>
      </View>
      <Edit3 size={16} strokeWidth={2.2} color={colors.inkMuted} />
    </Pressable>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: radii.card,
    paddingVertical: 12,
    paddingHorizontal: 14,
  },
  content: {
    flex: 1,
    gap: 4,
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  index: {
    fontFamily: 'JetBrainsMono-Medium',
    fontSize: 9,
    fontWeight: '500',
    letterSpacing: 0.9,
    color: colors.accent,
  },
  action: {
    ...typography.bannerTitle,
    color: colors.ink,
  },
  threshold: {
    fontFamily: 'JetBrainsMono-Medium',
    fontSize: 9,
    fontWeight: '500',
    letterSpacing: 0.9,
    color: colors.inkMuted,
    marginLeft: 17, // Align with action text (index width + gap)
  },
});
