/**
 * NoResultsState Component for Inquiries Screen
 * Shown when search is active but matches nothing.
 */

import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import Animated, { FadeInUp, Easing } from 'react-native-reanimated';
import { colors } from '@/constants/theme';

interface NoResultsStateProps {
  searchValue: string;
}

export function NoResultsState({ searchValue }: NoResultsStateProps) {
  const entering = FadeInUp.duration(400).easing(Easing.out(Easing.ease));

  return (
    <Animated.View style={styles.container} entering={entering}>
      {/* Caption */}
      <Text style={styles.caption}>NO MATCHES</Text>

      {/* Headline */}
      <Text style={styles.headline}>
        Nothing matched "{searchValue}".
      </Text>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingVertical: 50,
    paddingHorizontal: 32,
    alignItems: 'center',
  },
  caption: {
    fontFamily: 'JetBrainsMono-Medium',
    fontSize: 9.5,
    fontWeight: '500',
    letterSpacing: 1.9, // 0.2em
    textTransform: 'uppercase',
    color: colors.inkMuted,
    marginBottom: 12,
  },
  headline: {
    fontFamily: 'InterTight-ExtraBold',
    fontSize: 22,
    fontWeight: '800',
    letterSpacing: -0.88, // -0.04em
    lineHeight: 22,
    color: colors.ink,
    textAlign: 'center',
  },
});
