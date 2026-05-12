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
import { ArrowRight, Check } from 'lucide-react-native';
import { colors } from '@/constants/theme';
import { useFadeUpEntrance } from '@/hooks/useFadeUpEntrance';
import type { AuthUser } from '@/types/auth';

interface WelcomeBackStepProps {
  user: AuthUser;
  onContinue: () => void;
}

export function WelcomeBackStep({ user, onContinue }: WelcomeBackStepProps) {
  const fadeUpStyle = useFadeUpEntrance();

  // Check-pop animation
  const checkScale = useSharedValue(0);

  useEffect(() => {
    // Delayed spring animation for check overlay
    checkScale.value = withDelay(
      200,
      withSpring(1, {
        damping: 12,
        stiffness: 180,
        overshootClamping: false,
      })
    );
  }, [checkScale]);

  const checkPopStyle = useAnimatedStyle(() => ({
    transform: [{ scale: checkScale.value }],
  }));

  return (
    <View style={styles.container}>
      <Animated.View style={[styles.content, fadeUpStyle]}>
        {/* Hero photo with check overlay */}
        <View style={styles.heroContainer}>
          <View style={styles.photoContainer}>
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
            </View>

            {/* Check overlay - positioned relative to photo container */}
            <Animated.View style={[styles.checkOverlay, checkPopStyle]}>
              <Check size={18} strokeWidth={3} color={colors.bg} />
            </Animated.View>
          </View>
        </View>

        {/* Eyebrow */}
        <Text style={styles.eyebrow}>Welcome back</Text>

        {/* Headline */}
        <Text style={styles.headline}>
          Hey,{'\n'}
          {user.firstName}.
        </Text>

        {/* Subtitle */}
        <Text style={styles.subtitle}>
          Signed in. Picking up where you left off.
        </Text>

        {/* Spacer */}
        <View style={styles.spacer} />

        {/* Primary CTA */}
        <Pressable
          style={({ pressed }) => [
            styles.ctaButton,
            pressed && styles.ctaButtonPressed,
          ]}
          onPress={onContinue}
        >
          <Text style={styles.ctaText}>Continue to Home</Text>
          <ArrowRight size={16} strokeWidth={2.6} color={colors.bg} />
        </Pressable>

        {/* Fine print */}
        <Text style={styles.finePrint}>Not you? Sign out from settings</Text>
      </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.bg,
  },
  content: {
    flex: 1,
    paddingTop: 60,
    paddingHorizontal: 28,
    paddingBottom: 30,
  },
  heroContainer: {
    alignItems: 'center',
    marginBottom: 32,
  },
  photoContainer: {
    // Container needs to be sized to accommodate the check overlay
    width: 110 + 6, // photo width + check overflow
    height: 110 + 6, // photo height + check overflow
    alignItems: 'flex-start',
  },
  photoWrapper: {
    width: 110,
    height: 110,
    borderRadius: 28,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: colors.borderStrong,
  },
  photo: {
    width: '100%',
    height: '100%',
  },
  photoPlaceholder: {
    width: '100%',
    height: '100%',
    backgroundColor: colors.surface,
    alignItems: 'center',
    justifyContent: 'center',
  },
  photoInitial: {
    fontFamily: 'InterTight-Bold',
    fontSize: 44,
    fontWeight: '700',
    color: colors.ink,
    letterSpacing: -0.03 * 44,
  },
  checkOverlay: {
    position: 'absolute',
    bottom: 0, // -6 from photo edge + 6 container padding = 0
    right: 0, // -6 from photo edge + 6 container padding = 0
    width: 38,
    height: 38,
    borderRadius: 19,
    backgroundColor: colors.accent,
    borderWidth: 3,
    borderColor: colors.bg,
    alignItems: 'center',
    justifyContent: 'center',
    // Shadow
    shadowColor: colors.accent,
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.3,
    shadowRadius: 16,
    elevation: 6,
  },
  eyebrow: {
    fontFamily: 'JetBrainsMono-SemiBold',
    fontSize: 11,
    fontWeight: '600',
    color: colors.accent,
    letterSpacing: 0.3 * 11,
    textTransform: 'uppercase',
    textAlign: 'center',
    marginBottom: 16,
  },
  headline: {
    fontFamily: 'InterTight-ExtraBold',
    fontSize: 40,
    fontWeight: '800',
    color: colors.ink,
    letterSpacing: -0.045 * 40,
    lineHeight: 40 * 0.95,
    textAlign: 'center',
    marginBottom: 16,
  },
  subtitle: {
    fontFamily: 'InterTight-Regular',
    fontSize: 15,
    fontWeight: '400',
    color: colors.ink,
    opacity: 0.7,
    lineHeight: 15 * 1.5,
    textAlign: 'center',
    maxWidth: 240, // ~30ch approximation
    alignSelf: 'center',
    marginBottom: 36,
  },
  spacer: {
    flex: 1,
  },
  ctaButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    backgroundColor: colors.accent,
    paddingVertical: 18,
    paddingHorizontal: 22,
    borderRadius: 100,
    // Shadow
    shadowColor: colors.accent,
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.3,
    shadowRadius: 24,
    elevation: 8,
  },
  ctaButtonPressed: {
    opacity: 0.9,
    transform: [{ scale: 0.98 }],
  },
  ctaText: {
    fontFamily: 'InterTight-Bold',
    fontSize: 15,
    fontWeight: '700',
    color: colors.bg,
    letterSpacing: -0.015 * 15,
  },
  finePrint: {
    fontFamily: 'JetBrainsMono-Medium',
    fontSize: 9.5,
    fontWeight: '500',
    color: colors.inkSubtle,
    letterSpacing: 0.15 * 9.5,
    textTransform: 'uppercase',
    textAlign: 'center',
    marginTop: 14,
  },
});
