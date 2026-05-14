/**
 * EmptyState Component for Inquiries Screen
 * Shown when user has no threads. Persona-aware messaging.
 */

import React from 'react';
import { View, Text, Pressable, StyleSheet, Platform } from 'react-native';
import Animated, { FadeInUp, Easing } from 'react-native-reanimated';
import { MessageSquare } from 'lucide-react-native';
import { colors, radii, recipes } from '@/constants/theme';
import type { ViewerRole } from '@/lib/dealLifecycle';

interface EmptyStateProps {
  viewerRole: ViewerRole;
  onBrowseDiscover?: () => void;
}

export function EmptyState({ viewerRole, onBrowseDiscover }: EmptyStateProps) {
  const isBusiness = viewerRole === 'business';

  const entering = FadeInUp.duration(400).easing(Easing.out(Easing.ease));

  return (
    <Animated.View style={styles.container} entering={entering}>
      {/* Icon tile */}
      <View style={styles.iconTile}>
        <MessageSquare size={24} strokeWidth={2} color={colors.inkMuted} />
      </View>

      {/* Caption */}
      <Text style={styles.caption}>NO INQUIRIES YET</Text>

      {/* Headline */}
      <Text style={styles.headline}>
        {isBusiness
          ? 'Find someone\nto work with.'
          : 'Your first request is\naround the corner.'}
      </Text>

      {/* Body copy */}
      <Text style={styles.body}>
        {isBusiness
          ? 'Browse Discover to find influencer and send your first booking request.'
          : 'When a business sends you a request, it will appear here.'}
      </Text>

      {/* CTA button (Business only) */}
      {isBusiness && onBrowseDiscover && (
        <Pressable
          style={[styles.ctaButton, Platform.OS === 'ios' && styles.ctaButtonShadow]}
          onPress={onBrowseDiscover}
          accessibilityRole="button"
          accessibilityLabel="Browse Discover"
        >
          <Text style={styles.ctaText}>Browse Discover {'→'}</Text>
        </Pressable>
      )}
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingVertical: 70,
    paddingHorizontal: 32,
    alignItems: 'center',
  },
  iconTile: {
    width: 60,
    height: 60,
    borderRadius: radii.card,
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 20,
  },
  caption: {
    fontFamily: 'JetBrainsMono-Medium',
    fontSize: 9.5,
    fontWeight: '500',
    letterSpacing: 2.375, // 0.25em
    textTransform: 'uppercase',
    color: colors.inkMuted,
    marginBottom: 14,
  },
  headline: {
    fontFamily: 'InterTight-ExtraBold',
    fontSize: 26,
    fontWeight: '800',
    letterSpacing: -1.17, // -0.045em
    lineHeight: 24.7, // 0.95
    color: colors.ink,
    textAlign: 'center',
    marginBottom: 10,
  },
  body: {
    fontFamily: 'InterTight-Regular',
    fontSize: 13,
    fontWeight: '400',
    lineHeight: 19.5, // 1.5
    color: colors.ink,
    opacity: 0.6,
    textAlign: 'center',
    maxWidth: 240,
    marginBottom: 24,
  },
  ctaButton: {
    ...recipes.primaryButton,
    paddingVertical: 12,
    paddingHorizontal: 24,
  },
  ctaButtonShadow: {
    shadowColor: colors.accent,
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.3,
    shadowRadius: 24,
    elevation: 8,
  },
  ctaText: {
    fontFamily: 'InterTight-Bold',
    fontSize: 13,
    fontWeight: '700',
    color: colors.bg,
  },
});
