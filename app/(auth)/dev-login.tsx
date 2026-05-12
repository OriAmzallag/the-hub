/**
 * Dev Login Screen
 *
 * Mock persona selector for development. NOT real auth — this screen
 * exists so the user can pick which side of the marketplace to load
 * (Business or Influencer) on every cold start. Replace with the real
 * auth flow (welcome / sign-in / sign-up) once accounts are wired.
 */

import React from 'react';
import { View, Text, Pressable, StyleSheet } from 'react-native';
import { useRouter, type Href } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Building2, Sparkles, ChevronRight, ArrowRight } from 'lucide-react-native';
import { colors, typography, recipes, shadows } from '@/constants/theme';

type Persona = {
  key: 'business' | 'influencer';
  title: string;
  caption: string;
  icon: typeof Building2;
  route: Href;
};

const PERSONAS: Persona[] = [
  {
    key: 'business',
    title: 'Business',
    caption: 'HUNT INFLUENCERS · MANAGE DEALS',
    icon: Building2,
    route: '/(business)',
  },
  {
    key: 'influencer',
    title: 'Influencer',
    caption: 'YOUR STOREFRONT · TAKE BOOKINGS',
    icon: Sparkles,
    route: '/(influencer)/profile',
  },
];

export default function DevLoginScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();

  const handlePick = (route: Href) => {
    router.replace(route);
  };

  const handleTryOnboarding = () => {
    router.push('/(auth)/onboarding');
  };

  return (
    <View
      style={[
        styles.container,
        { paddingTop: insets.top + 64, paddingBottom: insets.bottom + 24 },
      ]}
    >
      <View style={styles.header}>
        <Text style={styles.brand}>THE HUB</Text>
        <Text style={styles.brandCaption}>DEV LOGIN · PICK A PERSONA</Text>
      </View>

      <View style={styles.cards}>
        {PERSONAS.map((persona) => {
          const Icon = persona.icon;
          return (
            <Pressable
              key={persona.key}
              style={styles.card}
              onPress={() => handlePick(persona.route)}
              accessibilityRole="button"
              accessibilityLabel={`Continue as ${persona.title}`}
            >
              <View style={styles.iconTile}>
                <Icon size={22} color={colors.bg} />
              </View>
              <View style={styles.cardText}>
                <Text style={styles.cardTitle}>{persona.title}</Text>
                <Text style={styles.cardCaption}>{persona.caption}</Text>
              </View>
              <ChevronRight size={20} color={colors.accent} />
            </Pressable>
          );
        })}
      </View>

      <View style={styles.footer}>
        {/* Try onboarding link */}
        <Pressable
          style={styles.onboardingLink}
          onPress={handleTryOnboarding}
          accessibilityRole="button"
          accessibilityLabel="Try the onboarding flow"
        >
          <Text style={styles.onboardingLinkText}>Try the onboarding flow</Text>
          <ArrowRight size={14} color={colors.accent} />
        </Pressable>

        <Text style={styles.footerText}>NOT REAL AUTH · DEV BUILD ONLY</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.bg,
    paddingHorizontal: 24,
    justifyContent: 'space-between',
  },
  header: {
    alignItems: 'flex-start',
  },
  brand: {
    ...typography.displayXl,
    color: colors.ink,
    fontSize: 44,
    lineHeight: 44,
    letterSpacing: -1.76,
  },
  brandCaption: {
    ...typography.monoStatusWide,
    color: colors.accent,
    marginTop: 12,
  },
  cards: {
    gap: 14,
  },
  card: {
    ...recipes.surfaceTile,
    paddingVertical: 18,
    paddingHorizontal: 18,
    flexDirection: 'row',
    alignItems: 'center',
    ...shadows.md,
  },
  iconTile: {
    width: 44,
    height: 44,
    borderRadius: 12,
    backgroundColor: colors.accent,
    alignItems: 'center',
    justifyContent: 'center',
    ...shadows.accentGlow,
  },
  cardText: {
    flex: 1,
    marginLeft: 16,
  },
  cardTitle: {
    ...typography.sectionTitle,
    color: colors.ink,
  },
  cardCaption: {
    ...typography.monoTimestamp,
    color: colors.inkMuted,
    marginTop: 6,
  },
  footer: {
    alignItems: 'center',
    gap: 20,
  },
  onboardingLink: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingVertical: 8,
    paddingHorizontal: 16,
  },
  onboardingLinkText: {
    fontFamily: 'InterTight-SemiBold',
    fontSize: 14,
    fontWeight: '600',
    letterSpacing: -0.28,
    color: colors.accent,
  },
  footerText: {
    ...typography.monoStatusWide,
    color: colors.inkSubtle,
  },
});
