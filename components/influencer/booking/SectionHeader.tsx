/**
 * SectionHeader Component (Booking Sheet variant)
 * Display title with optional mono hint for booking form sections.
 *
 * Note: This is separate from the storefront's SectionHeader which has
 * an action button. This variant is simpler: title + optional hint.
 */

import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { colors } from '@/constants/theme';

interface SectionHeaderProps {
  title: string;
  hint?: string;
}

export function SectionHeader({ title, hint }: SectionHeaderProps) {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>{title}</Text>
      {hint && <Text style={styles.hint}>{hint}</Text>}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'baseline',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  title: {
    fontFamily: 'InterTight-Bold',
    fontSize: 17,
    fontWeight: '700',
    letterSpacing: -0.51,
    color: colors.ink,
  },
  hint: {
    fontFamily: 'JetBrainsMono-Medium',
    fontSize: 9.5,
    fontWeight: '500',
    letterSpacing: 1.14,
    textTransform: 'uppercase',
    color: colors.inkMuted,
  },
});
