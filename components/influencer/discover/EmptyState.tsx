/**
 * EmptyState Component
 * No results state for the Influencer Discover screen.
 */

import React from 'react';
import { View, Text, Pressable, StyleSheet, Platform } from 'react-native';
import Animated, { FadeInUp, Easing } from 'react-native-reanimated';
import { Search } from 'lucide-react-native';
import { colors } from '@/constants/theme';

interface EmptyStateProps {
  onReset: () => void;
}

export function EmptyState({ onReset }: EmptyStateProps) {
  const entering = FadeInUp.duration(400).easing(Easing.out(Easing.ease));

  return (
    <Animated.View style={styles.container} entering={entering}>
      {/* Icon box */}
      <View style={styles.iconBox}>
        <Search size={26} strokeWidth={2} color={colors.inkMuted} />
      </View>

      {/* Caption */}
      <Text style={styles.caption}>NO PERKS MATCH</Text>

      {/* Headline */}
      <Text style={styles.headline}>Try widening{'\n'}your search.</Text>

      {/* Body */}
      <Text style={styles.body}>
        Drop a category filter or toggle to see more perks.
      </Text>

      {/* Reset button */}
      <Pressable
        style={[styles.resetButton, Platform.OS === 'ios' && styles.resetButtonShadow]}
        onPress={onReset}
        accessibilityRole="button"
        accessibilityLabel="Reset filters"
      >
        <Text style={styles.resetButtonText}>Reset filters</Text>
      </Pressable>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingVertical: 60,
    paddingHorizontal: 32,
    alignItems: 'center',
  },
  iconBox: {
    width: 64,
    height: 64,
    borderRadius: 16,
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 24,
  },
  caption: {
    fontFamily: 'JetBrainsMono-Medium',
    fontSize: 10,
    fontWeight: '500',
    letterSpacing: 2.5,
    textTransform: 'uppercase',
    color: colors.inkMuted,
    marginBottom: 14,
  },
  headline: {
    fontFamily: 'InterTight-ExtraBold',
    fontSize: 30,
    fontWeight: '800',
    letterSpacing: -1.35,
    lineHeight: 29,
    color: colors.ink,
    textAlign: 'center',
    marginBottom: 10,
  },
  body: {
    fontFamily: 'InterTight-Regular',
    fontSize: 14,
    fontWeight: '400',
    lineHeight: 21,
    color: colors.ink,
    opacity: 0.7,
    textAlign: 'center',
    marginBottom: 28,
    maxWidth: 260,
  },
  resetButton: {
    backgroundColor: colors.accent,
    paddingVertical: 14,
    paddingHorizontal: 26,
    borderRadius: 100,
  },
  resetButtonShadow: {
    shadowColor: colors.accentShadow,
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 1,
    shadowRadius: 18,
    elevation: 6,
  },
  resetButtonText: {
    fontFamily: 'InterTight-Bold',
    fontSize: 14,
    fontWeight: '700',
    letterSpacing: -0.21,
    color: colors.bg,
  },
});
