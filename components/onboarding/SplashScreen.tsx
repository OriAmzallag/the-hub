/**
 * SplashScreen Component
 * Token-check entry point. Brief logo + spinner (~0.5s minimum dwell).
 *
 * Validates the device session token stored in SecureStore:
 * - Token valid → routes silently to persona home (business or influencer)
 * - Token missing/invalid → routes to onboarding (Welcome → Phone → OTP)
 *
 * This is the most-frequently-seen screen in the app, but the least
 * visible — production users barely register it.
 */

import React, { useEffect } from 'react';
import { View, StyleSheet } from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withRepeat,
  withTiming,
  Easing,
} from 'react-native-reanimated';
import { useRouter } from 'expo-router';
import { colors } from '@/constants/theme';
import { useFadeUpEntrance } from '@/hooks/useFadeUpEntrance';
import { authService, getDeviceToken } from '@/services/auth';

/**
 * Minimum time to show splash before routing (ms).
 * Prevents a jarring flash when token validation is fast.
 */
const MIN_DWELL_MS = 500;

/**
 * Delay helper.
 */
function delay(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

export function SplashScreen() {
  const router = useRouter();
  const fadeUpStyle = useFadeUpEntrance();

  // Spinner rotation
  const rotation = useSharedValue(0);

  useEffect(() => {
    // Start spinner animation
    rotation.value = withRepeat(
      withTiming(360, {
        duration: 800,
        easing: Easing.linear,
      }),
      -1, // infinite
      false // don't reverse
    );
  }, [rotation]);

  const spinnerStyle = useAnimatedStyle(() => ({
    transform: [{ rotate: `${rotation.value}deg` }],
  }));

  useEffect(() => {
    const checkAuth = async () => {
      const startTime = Date.now();

      try {
        // Get token from SecureStore
        const token = await getDeviceToken();

        // Validate token if present
        let isValid = false;
        let persona: 'business' | 'influencer' | null = null;

        if (token) {
          const response = await authService.validateToken(token);
          if (response.valid && response.user) {
            isValid = true;
            persona = response.user.persona;
          }
        }

        // Enforce minimum dwell time
        const elapsed = Date.now() - startTime;
        if (elapsed < MIN_DWELL_MS) {
          await delay(MIN_DWELL_MS - elapsed);
        }

        // Route based on result
        if (isValid && persona) {
          const route =
            persona === 'business' ? '/(business)' : '/(influencer)';
          router.replace(route);
        } else {
          router.replace('/(auth)/onboarding');
        }
      } catch (error) {
        console.error('Auth check failed:', error);
        // On any error, fall back to onboarding
        const elapsed = Date.now() - startTime;
        if (elapsed < MIN_DWELL_MS) {
          await delay(MIN_DWELL_MS - elapsed);
        }
        router.replace('/(auth)/onboarding');
      }
    };

    checkAuth();
  }, [router]);

  return (
    <View style={styles.container}>
      <Animated.View style={[styles.content, fadeUpStyle]}>
        {/* Logo tile */}
        <View style={styles.logoTile}>
          <Animated.Text style={styles.logoGlyph}>H</Animated.Text>
        </View>

        {/* Spinner + caption row */}
        <View style={styles.spinnerRow}>
          <Animated.View style={[styles.spinner, spinnerStyle]} />
          <Animated.Text style={styles.caption}>Signing you in</Animated.Text>
        </View>
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
    alignItems: 'center',
    justifyContent: 'center',
    paddingTop: 60,
    paddingHorizontal: 28,
    paddingBottom: 30,
  },
  logoTile: {
    width: 64,
    height: 64,
    borderRadius: 18,
    backgroundColor: colors.accent,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 28,
    // Shadow
    shadowColor: colors.accent,
    shadowOffset: { width: 0, height: 12 },
    shadowOpacity: 0.3,
    shadowRadius: 32,
    elevation: 12,
  },
  logoGlyph: {
    fontFamily: 'InterTight-ExtraBold',
    fontSize: 32,
    fontWeight: '900',
    color: colors.bg,
    letterSpacing: -0.06 * 32,
    lineHeight: 32,
  },
  spinnerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    marginBottom: 60,
  },
  spinner: {
    width: 12,
    height: 12,
    borderRadius: 6,
    borderWidth: 2,
    borderColor: colors.surface,
    borderTopColor: colors.accent,
  },
  caption: {
    fontFamily: 'JetBrainsMono-Medium',
    fontSize: 10,
    fontWeight: '500',
    color: colors.inkMuted,
    letterSpacing: 0.2 * 10,
    textTransform: 'uppercase',
  },
});
