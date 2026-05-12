/**
 * WelcomeStep Component
 * Full-screen welcome state (no shell) - first screen of onboarding.
 */

import React from 'react';
import { View, Text, Pressable, StyleSheet } from 'react-native';
import Animated from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { ArrowRight } from 'lucide-react-native';
import { colors, typography, radii } from '@/constants/theme';
// Imported directly (not via the @/hooks barrel) so we don't transitively
// pull in useSession + supabase.ts, which throws on module load when env
// vars aren't set.
import { useFadeUpEntrance } from '@/hooks/useFadeUpEntrance';

interface WelcomeStepProps {
  onGetStarted: () => void;
}

export function WelcomeStep({ onGetStarted }: WelcomeStepProps) {
  const insets = useSafeAreaInsets();
  const fadeStyle = useFadeUpEntrance();

  return (
    <Animated.View
      style={[
        styles.container,
        {
          paddingTop: insets.top + 80,
          paddingBottom: Math.max(insets.bottom, 24),
        },
        fadeStyle,
      ]}
    >
      {/* Logo tile */}
      <View style={styles.logoTile}>
        <Text style={styles.logoText}>H</Text>
      </View>

      {/* Caption */}
      <Text style={styles.caption}>WELCOME TO THE HUB</Text>

      {/* Headline */}
      <Text style={styles.headline}>
        Where Tel Aviv{'\n'}gets together.
      </Text>

      {/* Subtitle */}
      <Text style={styles.subtitle}>
        Connect with local businesses and influencers.{'\n'}Real collaborations,
        real value.
      </Text>

      {/* Spacer */}
      <View style={styles.spacer} />

      {/* CTA */}
      <Pressable
        style={styles.ctaButton}
        onPress={onGetStarted}
        accessibilityRole="button"
        accessibilityLabel="Get started"
      >
        <Text style={styles.ctaText}>Get started</Text>
        <ArrowRight size={18} strokeWidth={2.5} color={colors.bg} />
      </Pressable>

      {/* Footer */}
      <Text style={styles.footer}>Tel Aviv · v0.6</Text>
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
  logoTile: {
    width: 64,
    height: 64,
    borderRadius: radii.card,
    backgroundColor: colors.accent,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: colors.accent,
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.3,
    shadowRadius: 24,
    elevation: 8,
  },
  logoText: {
    fontFamily: 'InterTight-ExtraBold',
    fontSize: 32,
    fontWeight: '800',
    color: colors.bg,
  },
  caption: {
    ...typography.monoGreeting,
    color: colors.accent,
    marginTop: 28,
  },
  headline: {
    fontFamily: 'InterTight-ExtraBold',
    fontSize: 44,
    fontWeight: '800',
    letterSpacing: -1.98, // -0.045em
    lineHeight: 44, // 1.0
    color: colors.ink,
    textAlign: 'center',
    marginTop: 16,
  },
  subtitle: {
    fontFamily: 'InterTight-Regular',
    fontSize: 16,
    fontWeight: '400',
    lineHeight: 23.2, // 1.45
    color: colors.ink,
    opacity: 0.65,
    textAlign: 'center',
    marginTop: 14,
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
  footer: {
    ...typography.monoTimestamp,
    color: colors.inkSubtle,
    marginTop: 16,
  },
});
