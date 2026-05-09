/**
 * SectionHeader Component
 * Reusable section header with optional count badge and action link.
 */

import React from 'react';
import { View, Text, Pressable, StyleSheet } from 'react-native';
import { colors, typography } from '@/constants/theme';

interface SectionHeaderProps {
  title: string;
  count?: number;
  actionLabel?: string;
  onAction?: () => void;
}

export function SectionHeader({
  title,
  count,
  actionLabel,
  onAction,
}: SectionHeaderProps) {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>{title}</Text>

      {count !== undefined && (
        <Text style={styles.count}>{count}</Text>
      )}

      {actionLabel && onAction && (
        <Pressable
          onPress={onAction}
          hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
          accessibilityRole="button"
          accessibilityLabel={actionLabel}
        >
          <Text style={styles.action}>{actionLabel} {'→'}</Text>
        </Pressable>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'baseline',
    justifyContent: 'space-between',
    marginBottom: 14,
  },
  title: {
    ...typography.sectionTitle,
    color: colors.ink,
  },
  count: {
    ...typography.monoStatus,
    color: colors.inkMuted,
  },
  action: {
    ...typography.monoLabel,
    color: colors.accent,
  },
});
