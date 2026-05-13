/**
 * SubmittedWaiting Component
 * Confirmation screen shown after submitting when counterparty hasn't rated yet.
 */

import React from 'react';
import { View, Text, Pressable, StyleSheet } from 'react-native';
import Animated from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { colors, typography, radii } from '@/constants/theme';
import { useFadeUpEntrance } from '@/hooks/useFadeUpEntrance';
import { CheckHero } from './CheckHero';
import { NoticeCard } from './NoticeCard';
import type { StarRating } from '@/types/rating';

interface SubmittedWaitingProps {
  stars: StarRating;
  counterpartyFirstName: string;
  onBackToDashboard: () => void;
}

export function SubmittedWaiting({
  stars,
  counterpartyFirstName,
  onBackToDashboard,
}: SubmittedWaitingProps) {
  const insets = useSafeAreaInsets();
  const fadeStyle = useFadeUpEntrance();

  return (
    <View
      style={[
        styles.container,
        {
          paddingTop: insets.top + 60,
          paddingBottom: Math.max(insets.bottom, 24),
        },
      ]}
    >
      <Animated.View style={[styles.content, fadeStyle]}>
        {/* Check hero */}
        <CheckHero size={80} />

        {/* Eyebrow */}
        <Text style={styles.eyebrow}>RATED · {stars} STARS</Text>

        {/* Headline */}
        <Text style={styles.headline}>Submitted.</Text>

        {/* Body */}
        <Text style={styles.body}>
          We'll show you what {counterpartyFirstName} rated once they submit
          theirs.
        </Text>

        {/* Notice card */}
        <View style={styles.noticeContainer}>
          <NoticeCard title="HOW THIS WORKS">
            Ratings stay hidden until both sides submit. It keeps things honest
            — nobody rates in reaction.
          </NoticeCard>
        </View>

        <View style={styles.spacer} />

        {/* CTA */}
        <Pressable
          style={styles.ctaButton}
          onPress={onBackToDashboard}
          accessibilityRole="button"
          accessibilityLabel="Back to Dashboard"
        >
          <Text style={styles.ctaText}>Back to Dashboard</Text>
        </Pressable>
      </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.bg,
    paddingHorizontal: 24,
  },
  content: {
    flex: 1,
    alignItems: 'center',
  },
  eyebrow: {
    fontFamily: 'JetBrainsMono-Medium',
    fontSize: 10,
    fontWeight: '500',
    letterSpacing: 2.8,
    textTransform: 'uppercase',
    color: colors.accent,
    marginTop: 20,
    marginBottom: 16,
  },
  headline: {
    fontFamily: 'InterTight-ExtraBold',
    fontSize: 30,
    fontWeight: '800',
    letterSpacing: -1.2,
    lineHeight: 34,
    color: colors.ink,
    textAlign: 'center',
    marginBottom: 12,
  },
  body: {
    fontFamily: 'InterTight-Regular',
    fontSize: 15,
    fontWeight: '400',
    lineHeight: 22,
    color: colors.ink,
    opacity: 0.7,
    textAlign: 'center',
    maxWidth: 280,
  },
  noticeContainer: {
    width: '100%',
    marginTop: 32,
  },
  spacer: {
    flex: 1,
  },
  ctaButton: {
    width: '100%',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 16,
    paddingHorizontal: 24,
    backgroundColor: 'transparent',
    borderWidth: 1,
    borderColor: colors.borderStrong,
    borderRadius: radii.pill,
  },
  ctaText: {
    fontFamily: 'InterTight-Bold',
    fontSize: 15,
    fontWeight: '700',
    letterSpacing: -0.3,
    color: colors.ink,
  },
});
