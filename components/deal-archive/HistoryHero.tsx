/**
 * HistoryHero Component
 * Hero section for Deal History screen.
 */

import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { colors, typography } from '@/constants/theme';

interface HistoryHeroProps {
  totalCount: number;
}

export function HistoryHero({ totalCount }: HistoryHeroProps) {
  return (
    <View style={styles.container}>
      <Text style={styles.eyebrow}>{totalCount} CLOSED DEALS</Text>
      <Text style={styles.headline}>{'Everything\nthat\'s wrapped.'}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginTop: 8,
    marginBottom: 24,
  },
  eyebrow: {
    fontFamily: 'JetBrainsMono-Medium',
    fontSize: 10,
    fontWeight: '500',
    letterSpacing: 2.2, // 0.22em
    lineHeight: 10,
    textTransform: 'uppercase',
    color: colors.accent,
    marginBottom: 8,
  },
  headline: {
    fontFamily: 'InterTight-ExtraBold',
    fontSize: 30,
    fontWeight: '800',
    letterSpacing: -1.2, // -0.04em
    lineHeight: 34,
    color: colors.ink,
  },
});
