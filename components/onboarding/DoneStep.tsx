/**
 * DoneStep Component
 * Full-screen success state (no shell) - final screen of onboarding.
 * Mirrors ClaimedSuccess / PublishSuccess patterns.
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
import { Check, ArrowRight } from 'lucide-react-native';
import { colors, typography, radii } from '@/constants/theme';

interface DoneStepProps {
  /** User's display name */
  name: string;
  /** Persona type */
  persona: 'business' | 'influencer';
  /** CTA handler */
  onContinue: () => void;
}

export function DoneStep({ name, persona, onContinue }: DoneStepProps) {
  const insets = useSafeAreaInsets();

  // Animation values
  const checkScale = useSharedValue(0);
  const contentOpacity = useSharedValue(0);
  const contentTranslateY = useSharedValue(8);

  // Run animations on mount
  useEffect(() => {
    // Check pop animation (spring) - 0 -> 1.15 -> 1
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

  const ctaLabel =
    persona === 'business' ? 'Find Influencers' : 'Browse perks';
  const subtitle =
    persona === 'business'
      ? 'Your business profile is ready. Start discovering influencers who can help spread the word.'
      : 'Your profile is live. Explore perks from local businesses and start collaborating.';

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
      {/* Check circle */}
      <Animated.View style={[styles.checkCircle, checkStyle]}>
        <Check size={44} strokeWidth={3.5} color={colors.bg} />
      </Animated.View>

      {/* Content */}
      <Animated.View style={[styles.content, contentStyle]}>
        {/* Caption */}
        <Text style={styles.caption}>YOU'RE IN</Text>

        {/* Headline */}
        <Text style={styles.headline}>Welcome,{'\n'}{name}.</Text>

        {/* Subtitle */}
        <Text style={styles.subtitle}>{subtitle}</Text>
      </Animated.View>

      {/* Spacer */}
      <View style={styles.spacer} />

      {/* CTA */}
      <Animated.View style={[styles.ctaContainer, contentStyle]}>
        <Pressable
          style={styles.ctaButton}
          onPress={onContinue}
          accessibilityRole="button"
          accessibilityLabel={ctaLabel}
        >
          <Text style={styles.ctaText}>{ctaLabel}</Text>
          <ArrowRight size={18} strokeWidth={2.5} color={colors.bg} />
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
    alignItems: 'center',
  },
  checkCircle: {
    width: 88,
    height: 88,
    borderRadius: 44,
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
    alignItems: 'center',
    paddingTop: 24,
  },
  caption: {
    ...typography.monoGreeting,
    color: colors.accent,
    marginBottom: 12,
  },
  headline: {
    fontFamily: 'InterTight-ExtraBold',
    fontSize: 40,
    fontWeight: '800',
    letterSpacing: -1.6, // -0.04em
    lineHeight: 40, // 1.0
    color: colors.ink,
    textAlign: 'center',
  },
  subtitle: {
    fontFamily: 'InterTight-Regular',
    fontSize: 15,
    fontWeight: '400',
    lineHeight: 21.75, // 1.45
    color: colors.ink,
    opacity: 0.7,
    textAlign: 'center',
    marginTop: 14,
    paddingHorizontal: 12,
  },
  spacer: {
    flex: 1,
  },
  ctaContainer: {
    width: '100%',
  },
  ctaButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    width: '100%',
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
  ctaText: {
    fontFamily: 'InterTight-Bold',
    fontSize: 15,
    fontWeight: '700',
    letterSpacing: -0.3,
    color: colors.bg,
  },
});
