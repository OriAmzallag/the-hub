/**
 * SectionHeader Component
 * Display title with optional "See all" action for influencer storefront.
 */

import React from 'react';
import { View, Text, Pressable, StyleSheet } from 'react-native';
import { ArrowRight } from 'lucide-react-native';
import { colors } from '@/constants/theme';

interface SectionHeaderProps {
  title: string;
  actionLabel?: string;
  onAction?: () => void;
}

export function SectionHeader({ title, actionLabel, onAction }: SectionHeaderProps) {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>{title}</Text>

      {actionLabel && onAction && (
        <Pressable
          onPress={onAction}
          hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
          accessibilityRole="button"
          accessibilityLabel={actionLabel}
          style={styles.actionButton}
        >
          <Text style={styles.actionText}>{actionLabel}</Text>
          <ArrowRight size={12} strokeWidth={2} color={colors.accent} />
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
    fontFamily: 'InterTight-Bold',
    fontSize: 22,
    fontWeight: '700',
    letterSpacing: -0.77,
    lineHeight: 22,
    color: colors.ink,
  },
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  actionText: {
    fontFamily: 'JetBrainsMono-Medium',
    fontSize: 10.5,
    fontWeight: '500',
    letterSpacing: 1.575,
    textTransform: 'uppercase',
    color: colors.accent,
  },
});
