/**
 * ClaimedSuccess Component
 * Full-screen success state after claiming a perk.
 */

import React, { useEffect } from 'react';
import { View, Text, Pressable, StyleSheet } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
  withTiming,
  withDelay,
  Easing,
} from 'react-native-reanimated';
import { Check, MessageSquare } from 'lucide-react-native';
import { colors, radii, textScale, typography } from '@/constants/theme';
import type { PerkDetail } from '@/types/perk';

interface ClaimedSuccessProps {
  perk: PerkDetail;
  onOpenInquiry: () => void;
  onBackToPerks: () => void;
}

export function ClaimedSuccess({
  perk,
  onOpenInquiry,
  onBackToPerks,
}: ClaimedSuccessProps) {
  const insets = useSafeAreaInsets();

  // Animation values
  const checkScale = useSharedValue(0);
  const contentOpacity = useSharedValue(0);
  const contentTranslateY = useSharedValue(8);

  // Run animations on mount
  useEffect(() => {
    // Check pop animation (spring)
    checkScale.value = withSpring(1, {
      damping: 12,
      stiffness: 180,
      mass: 1,
      overshootClamping: false,
    });

    // Content fade-up animation (delayed)
    contentOpacity.value = withDelay(
      200,
      withTiming(1, { duration: 400, easing: Easing.out(Easing.ease) })
    );
    contentTranslateY.value = withDelay(
      200,
      withTiming(0, { duration: 400, easing: Easing.out(Easing.ease) })
    );
  }, [checkScale, contentOpacity, contentTranslateY]);

  const checkStyle = useAnimatedStyle(() => ({
    transform: [{ scale: checkScale.value }],
  }));

  const contentStyle = useAnimatedStyle(() => ({
    opacity: contentOpacity.value,
    transform: [{ translateY: contentTranslateY.value }],
  }));

  return (
    <View style={[styles.container, { paddingTop: insets.top + 60 }]}>
      {/* Check circle */}
      <Animated.View style={[styles.checkCircle, checkStyle]}>
        <Check size={40} strokeWidth={3} color={colors.bg} />
      </Animated.View>

      {/* Content */}
      <Animated.View style={[styles.content, contentStyle]}>
        {/* Caption */}
        <Text style={styles.caption}>CLAIMED</Text>

        {/* Headline */}
        <Text style={styles.headline}>It's yours.</Text>

        {/* Subtext */}
        <Text style={styles.subtext}>
          {perk.business.name} has been notified. You have until{' '}
          {perk.deadline.toLowerCase()} to deliver.
        </Text>

        {/* Summary card */}
        <View style={styles.summaryCard}>
          <View style={styles.summaryRow}>
            <Text style={styles.summaryLabel}>Perk</Text>
            <Text style={styles.summaryValue}>{perk.title}</Text>
          </View>
          <View style={styles.divider} />
          <View style={styles.summaryRow}>
            <Text style={styles.summaryLabel}>Business</Text>
            <Text style={styles.summaryValue}>{perk.business.name}</Text>
          </View>
          <View style={styles.divider} />
          <View style={styles.summaryRow}>
            <Text style={styles.summaryLabel}>Value</Text>
            <Text style={styles.summaryValue}>₪{perk.value}</Text>
          </View>
        </View>

        {/* CTAs */}
        <View
          style={[
            styles.ctaContainer,
            { paddingBottom: Math.max(insets.bottom, 22) },
          ]}
        >
          <Pressable style={styles.primaryButton} onPress={onOpenInquiry}>
            <MessageSquare size={18} strokeWidth={2.5} color={colors.bg} />
            <Text style={styles.primaryButtonText}>Open inquiry</Text>
          </Pressable>
          <Pressable style={styles.secondaryButton} onPress={onBackToPerks}>
            <Text style={styles.secondaryButtonText}>Back to perks</Text>
          </Pressable>
        </View>
      </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.bg,
    alignItems: 'center',
  },
  checkCircle: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: colors.accent,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: colors.accent,
    shadowOffset: { width: 0, height: 12 },
    shadowOpacity: 0.4,
    shadowRadius: 32,
    elevation: 12,
  },
  content: {
    flex: 1,
    width: '100%',
    alignItems: 'center',
    paddingTop: 24,
    paddingHorizontal: 24,
  },
  caption: {
    ...typography.monoGreeting,
    color: colors.accent,
    marginBottom: 12,
  },
  headline: {
    ...textScale.displayL,
    color: colors.ink,
    textAlign: 'center',
    marginBottom: 12,
  },
  subtext: {
    fontFamily: 'InterTight-Regular',
    fontSize: 15,
    fontWeight: '400',
    lineHeight: 21.75,
    color: colors.inkMuted,
    textAlign: 'center',
    marginBottom: 32,
  },
  summaryCard: {
    width: '100%',
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: radii.card,
    overflow: 'hidden',
  },
  summaryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 14,
    paddingHorizontal: 14,
  },
  summaryLabel: {
    ...typography.monoStatus,
    color: colors.inkMuted,
  },
  summaryValue: {
    fontFamily: 'InterTight-SemiBold',
    fontSize: 14,
    fontWeight: '600',
    letterSpacing: -0.28,
    color: colors.ink,
  },
  divider: {
    height: 1,
    backgroundColor: colors.border,
  },
  ctaContainer: {
    flex: 1,
    width: '100%',
    justifyContent: 'flex-end',
    gap: 10,
    marginTop: 32,
  },
  primaryButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    paddingVertical: 16,
    paddingHorizontal: 24,
    backgroundColor: colors.accent,
    borderRadius: radii.pill,
    shadowColor: colors.accent,
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.3,
    shadowRadius: 24,
    elevation: 8,
  },
  primaryButtonText: {
    fontFamily: 'InterTight-Bold',
    fontSize: 15,
    fontWeight: '700',
    letterSpacing: -0.3,
    color: colors.bg,
  },
  secondaryButton: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 16,
    paddingHorizontal: 24,
    borderWidth: 1,
    borderColor: colors.borderStrong,
    borderRadius: radii.pill,
  },
  secondaryButtonText: {
    fontFamily: 'InterTight-Bold',
    fontSize: 15,
    fontWeight: '700',
    letterSpacing: -0.3,
    color: colors.ink,
  },
});
