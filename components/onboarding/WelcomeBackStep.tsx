/**
 * WelcomeBackStep Component
 * Returning-user success state after OTP verification.
 *
 * Shown when OTP verifies AND the phone number maps to an existing account.
 * Quieter than the onboarding Done state: confirmation moment, not a destination.
 */

import React, { useEffect } from 'react';
import { View, Text, Pressable, Image, StyleSheet } from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
  withDelay,
} from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { ArrowRight, Check } from 'lucide-react-native';
import { colors, typography, radii } from '@/constants/theme';
import { useFadeUpEntrance } from '@/hooks/useFadeUpEntrance';
import type { AuthUser } from '@/types/auth';

interface WelcomeBackStepProps {
  user: AuthUser;
  onContinue: () => void;
}

export function WelcomeBackStep({ user, onContinue }: WelcomeBackStepProps) {
  const insets = useSafeAreaInsets();
  const fadeStyle = useFadeUpEntrance();

  const checkScale = useSharedValue(0);

  useEffect(() => {
    checkScale.value = withDelay(
      200,
      withSpring(1, {
        damping: 12,
        stiffness: 180,
        overshootClamping: false,
      })
    );
  }, [checkScale]);

  const checkStyle = useAnimatedStyle(() => ({
    transform: [{ scale: checkScale.value }],
  }));

  return (
    <Animated.View
      style={[
        styles.container,
        {
          paddingTop: insets.top + 60,
          paddingBottom: Math.max(insets.bottom, 24),
        },
        fadeStyle,
      ]}
    >
      {/* Hero photo with check overlay */}
      <View style={styles.heroBlock}>
        <View style={styles.photoWrapper}>
          {user.photoUri ? (
            <Image source={{ uri: user.photoUri }} style={styles.photo} />
          ) : (
            <View style={styles.photoPlaceholder}>
              <Text style={styles.photoInitial}>
                {user.firstName.charAt(0).toUpperCase()}
              </Text>
            </View>
          )}
          <Animated.View style={[styles.checkOverlay, checkStyle]}>
            <Check size={18} strokeWidth={3} color={colors.bg} />
          </Animated.View>
        </View>
      </View>

      {/* Caption */}
      <Text style={styles.caption}>WELCOME BACK</Text>

      {/* Headline */}
      <Text style={styles.headline}>Hey,{'\n'}{user.firstName}.</Text>

      {/* Subtitle */}
      <Text style={styles.subtitle}>
        Signed in. Picking up where you left off.
      </Text>

      <View style={styles.spacer} />

      {/* CTA */}
      <Pressable
        style={styles.ctaButton}
        onPress={onContinue}
        accessibilityRole="button"
        accessibilityLabel="Continue to Home"
      >
        <Text style={styles.ctaText}>Continue to Home</Text>
        <ArrowRight size={18} strokeWidth={2.5} color={colors.bg} />
      </Pressable>

      {/* Fine print */}
      <Text style={styles.finePrint}>NOT YOU? SIGN OUT FROM SETTINGS</Text>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.bg,
    paddingHorizontal: 24,
    alignItems: 'center',
  },
  heroBlock: {
    width: 110,
    height: 110,
    marginBottom: 28,
  },
  photoWrapper: {
    width: 110,
    height: 110,
    borderRadius: 28,
    overflow: 'visible',
    borderWidth: 1,
    borderColor: colors.borderStrong,
    backgroundColor: colors.surface,
  },
  photo: {
    width: 110,
    height: 110,
    borderRadius: 28,
  },
  photoPlaceholder: {
    width: 110,
    height: 110,
    borderRadius: 28,
    alignItems: 'center',
    justifyContent: 'center',
  },
  photoInitial: {
    fontFamily: 'InterTight-ExtraBold',
    fontSize: 44,
    fontWeight: '800',
    color: colors.ink,
  },
  checkOverlay: {
    position: 'absolute',
    bottom: -6,
    right: -6,
    width: 38,
    height: 38,
    borderRadius: 19,
    backgroundColor: colors.accent,
    borderWidth: 3,
    borderColor: colors.bg,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: colors.accent,
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.3,
    shadowRadius: 16,
    elevation: 6,
  },
  caption: {
    ...typography.monoGreeting,
    color: colors.accent,
    marginTop: 4,
    marginBottom: 16,
  },
  headline: {
    fontFamily: 'InterTight-ExtraBold',
    fontSize: 40,
    fontWeight: '800',
    letterSpacing: -1.8,
    lineHeight: 40,
    color: colors.ink,
    textAlign: 'center',
    marginBottom: 14,
  },
  subtitle: {
    fontFamily: 'InterTight-Regular',
    fontSize: 15,
    fontWeight: '400',
    lineHeight: 22,
    color: colors.ink,
    opacity: 0.7,
    textAlign: 'center',
    maxWidth: 260,
  },
  spacer: {
    flex: 1,
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
  finePrint: {
    ...typography.monoTimestamp,
    color: colors.inkSubtle,
    marginTop: 14,
  },
});
