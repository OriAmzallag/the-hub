/**
 * RequestSuccess Component
 * Success state content shown after submitting a booking request.
 */

import React, { useEffect } from 'react';
import { View, Text, Pressable, StyleSheet } from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
  withTiming,
  withDelay,
  Easing,
} from 'react-native-reanimated';
import { Check, ArrowRight } from 'lucide-react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { colors, shadows } from '@/constants/theme';
import type { BookingSummary } from '@/types/booking';

interface RequestSuccessProps {
  influencerFirstName: string;
  summary: BookingSummary;
  onViewStatus: () => void;
  onBackToDiscovery: () => void;
}

export function RequestSuccess({
  influencerFirstName,
  summary,
  onViewStatus,
  onBackToDiscovery,
}: RequestSuccessProps) {
  const insets = useSafeAreaInsets();

  // Animation values
  const iconScale = useSharedValue(0.6);
  const iconOpacity = useSharedValue(0);
  const contentOpacity = useSharedValue(0);
  const contentTranslateY = useSharedValue(8);

  useEffect(() => {
    // Success-pop animation for icon
    iconScale.value = withSpring(1, {
      damping: 12,
      stiffness: 180,
      overshootClamping: false,
    });
    iconOpacity.value = withTiming(1, { duration: 300 });

    // Fade-up animation for content (staggered)
    contentOpacity.value = withDelay(
      150,
      withTiming(1, { duration: 400, easing: Easing.out(Easing.ease) })
    );
    contentTranslateY.value = withDelay(
      150,
      withTiming(0, { duration: 400, easing: Easing.out(Easing.ease) })
    );
  }, [iconScale, iconOpacity, contentOpacity, contentTranslateY]);

  const iconStyle = useAnimatedStyle(() => ({
    transform: [{ scale: iconScale.value }],
    opacity: iconOpacity.value,
  }));

  const contentStyle = useAnimatedStyle(() => ({
    opacity: contentOpacity.value,
    transform: [{ translateY: contentTranslateY.value }],
  }));

  return (
    <View style={[styles.container, { paddingBottom: insets.bottom + 22 }]}>
      {/* Hero check icon */}
      <Animated.View style={[styles.heroIcon, iconStyle]}>
        <Check size={32} strokeWidth={3} color={colors.bg} />
      </Animated.View>

      {/* Copy stack */}
      <Animated.View style={[styles.copyStack, contentStyle]}>
        <Text style={styles.monoLabel}>REQUEST SENT</Text>
        <Text style={styles.heading}>
          On its way{'\n'}to {influencerFirstName}.
        </Text>
        <Text style={styles.subCopy}>
          She typically responds within 72 hours. We'll notify you when she replies.
        </Text>
      </Animated.View>

      {/* Summary card */}
      <Animated.View style={[styles.summaryCard, contentStyle]}>
        <View style={styles.summaryRow}>
          <Text style={styles.summaryLabel}>SERVICES</Text>
          <Text style={styles.summaryValue}>{summary.serviceCount}</Text>
        </View>
        <View style={styles.summaryDivider} />
        <View style={styles.summaryRow}>
          <Text style={styles.summaryLabel}>TOTAL</Text>
          <Text style={styles.summaryTotal}>₪{summary.total}</Text>
        </View>
      </Animated.View>

      {/* CTAs */}
      <Animated.View style={[styles.ctaContainer, contentStyle]}>
        <Pressable
          style={[styles.primaryCta, shadows.accentGlow]}
          onPress={onViewStatus}
          accessibilityRole="button"
          accessibilityLabel="View request status"
        >
          <Text style={styles.primaryCtaText}>View request status</Text>
          <ArrowRight size={14} strokeWidth={2} color={colors.bg} />
        </Pressable>

        <Pressable
          style={styles.secondaryCta}
          onPress={onBackToDiscovery}
          accessibilityRole="button"
          accessibilityLabel="Back to discovery"
        >
          <Text style={styles.secondaryCtaText}>Back to discovery</Text>
        </Pressable>
      </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 32,
    paddingHorizontal: 22,
    alignItems: 'center',
  },
  heroIcon: {
    width: 72,
    height: 72,
    borderRadius: 36,
    backgroundColor: colors.accent,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: colors.accentShadow,
    shadowOffset: { width: 0, height: 12 },
    shadowOpacity: 1,
    shadowRadius: 36,
    elevation: 12,
  },
  copyStack: {
    alignItems: 'center',
    marginTop: 24,
  },
  monoLabel: {
    fontFamily: 'JetBrainsMono-Medium',
    fontSize: 10,
    fontWeight: '500',
    letterSpacing: 2.5,
    textTransform: 'uppercase',
    color: colors.accent,
  },
  heading: {
    fontFamily: 'InterTight-ExtraBold',
    fontSize: 38,
    fontWeight: '800',
    letterSpacing: -1.52,
    lineHeight: 42,
    color: colors.ink,
    textAlign: 'center',
    marginTop: 12,
  },
  subCopy: {
    fontFamily: 'InterTight-Regular',
    fontSize: 14.5,
    fontWeight: '400',
    letterSpacing: -0.15,
    lineHeight: 21,
    color: colors.ink,
    opacity: 0.8,
    textAlign: 'center',
    maxWidth: 280,
    marginTop: 12,
  },
  summaryCard: {
    width: '100%',
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 14,
    padding: 18,
    marginTop: 28,
  },
  summaryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  summaryLabel: {
    fontFamily: 'JetBrainsMono-Medium',
    fontSize: 9.5,
    fontWeight: '500',
    letterSpacing: 1.14,
    textTransform: 'uppercase',
    color: colors.inkMuted,
  },
  summaryValue: {
    fontFamily: 'InterTight-Bold',
    fontSize: 16,
    fontWeight: '700',
    letterSpacing: -0.32,
    color: colors.ink,
  },
  summaryDivider: {
    height: 1,
    backgroundColor: colors.border,
    marginVertical: 12,
  },
  summaryTotal: {
    fontFamily: 'InterTight-ExtraBold',
    fontSize: 22,
    fontWeight: '800',
    letterSpacing: -0.77,
    color: colors.ink,
  },
  ctaContainer: {
    width: '100%',
    marginTop: 28,
  },
  primaryCta: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    paddingVertical: 18,
    paddingHorizontal: 22,
    backgroundColor: colors.accent,
    borderRadius: 100,
  },
  primaryCtaText: {
    fontFamily: 'InterTight-Bold',
    fontSize: 14.5,
    fontWeight: '700',
    letterSpacing: -0.29,
    color: colors.bg,
  },
  secondaryCta: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 14,
    marginTop: 8,
  },
  secondaryCtaText: {
    fontFamily: 'JetBrainsMono-Medium',
    fontSize: 10.5,
    fontWeight: '500',
    letterSpacing: 1.575,
    textTransform: 'uppercase',
    color: colors.inkMuted,
  },
});
