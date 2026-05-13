/**
 * MutualReveal Component
 * Shows both ratings after both parties have submitted.
 */

import React from 'react';
import { View, Text, Pressable, StyleSheet, ScrollView } from 'react-native';
import Animated from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { BlurView } from 'expo-blur';
import { X } from 'lucide-react-native';
import { colors, typography, radii } from '@/constants/theme';
import { useFadeUpEntrance } from '@/hooks/useFadeUpEntrance';
import { CheckHero } from './CheckHero';
import { RatingCard } from './RatingCard';
import type { RatingDealContext, Rating } from '@/types/rating';

interface MutualRevealProps {
  context: RatingDealContext;
  viewerRating: Rating;
  counterpartyRating: Rating;
  onBack: () => void;
  onViewDealSummary: () => void;
  onClose: () => void;
}

function getHeadline(viewerStars: number, counterpartyStars: number): string {
  if (viewerStars === 5 && counterpartyStars === 5) {
    return '5 stars each. Nice work.';
  }
  if (viewerStars === counterpartyStars) {
    return `${viewerStars} stars each.`;
  }
  return "You've both rated.";
}

export function MutualReveal({
  context,
  viewerRating,
  counterpartyRating,
  onBack,
  onViewDealSummary,
  onClose,
}: MutualRevealProps) {
  const insets = useSafeAreaInsets();
  const fadeStyle = useFadeUpEntrance();

  const headline = getHeadline(viewerRating.stars, counterpartyRating.stars);

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      {/* Top bar */}
      <View style={styles.topBar}>
        <Pressable
          style={styles.closeButton}
          onPress={onClose}
          accessibilityRole="button"
          accessibilityLabel="Close and go back"
        >
          <X size={20} strokeWidth={2} color={colors.ink} />
        </Pressable>
        <Text style={styles.eyebrow}>RATINGS REVEALED</Text>
        <View style={styles.closeButtonPlaceholder} />
      </View>

      {/* Scrollable content */}
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <Animated.View style={[styles.content, fadeStyle]}>
          {/* Check hero */}
          <View style={styles.heroSection}>
            <CheckHero size={72} />
          </View>

          {/* Headline */}
          <Text style={styles.headline}>{headline}</Text>

          {/* Body */}
          <Text style={styles.body}>
            This collaboration is now part of both your histories.
          </Text>

          {/* Viewer's rating */}
          <View style={styles.cardSection}>
            <RatingCard
              label={`You rated ${context.counterparty.firstName}`}
              rating={viewerRating}
              showAvatar={false}
            />
          </View>

          {/* Separator */}
          <Text style={styles.separator}>——— AND ———</Text>

          {/* Counterparty's rating */}
          <View style={styles.cardSection}>
            <RatingCard
              label={`${context.counterparty.firstName} rated you`}
              rating={counterpartyRating}
              showAvatar={true}
              counterpartyPhoto={context.counterparty.photo}
              counterpartyMonogram={context.counterparty.monogram}
            />
          </View>
        </Animated.View>
      </ScrollView>

      {/* Sticky footer */}
      <BlurView intensity={80} tint="dark" style={styles.footerBlur}>
        <View
          style={[
            styles.footer,
            { paddingBottom: Math.max(insets.bottom, 24) },
          ]}
        >
          <View style={styles.buttonRow}>
            <Pressable
              style={styles.backButton}
              onPress={onBack}
              accessibilityRole="button"
              accessibilityLabel="Back"
            >
              <Text style={styles.backButtonText}>Back</Text>
            </Pressable>
            <Pressable
              style={styles.primaryButton}
              onPress={onViewDealSummary}
              accessibilityRole="button"
              accessibilityLabel="View deal summary"
            >
              <Text style={styles.primaryButtonText}>View deal summary</Text>
            </Pressable>
          </View>
        </View>
      </BlurView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.bg,
  },
  topBar: {
    height: 56,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
  },
  closeButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: colors.surface,
    alignItems: 'center',
    justifyContent: 'center',
  },
  closeButtonPlaceholder: {
    width: 36,
    height: 36,
  },
  eyebrow: {
    flex: 1,
    ...typography.monoGreeting,
    color: colors.accent,
    textAlign: 'center',
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: 24,
    paddingBottom: 120,
  },
  content: {
    alignItems: 'center',
  },
  heroSection: {
    marginTop: 24,
    marginBottom: 20,
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
    marginBottom: 32,
  },
  cardSection: {
    width: '100%',
  },
  separator: {
    ...typography.monoTimestamp,
    color: colors.inkSubtle,
    textAlign: 'center',
    marginVertical: 16,
  },
  footerBlur: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
  },
  footer: {
    paddingTop: 16,
    paddingHorizontal: 24,
    borderTopWidth: 1,
    borderTopColor: colors.border,
    backgroundColor: colors.bgOverlay94,
  },
  buttonRow: {
    flexDirection: 'row',
    gap: 12,
  },
  backButton: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 16,
    paddingHorizontal: 24,
    backgroundColor: 'transparent',
    borderWidth: 1,
    borderColor: colors.borderStrong,
    borderRadius: radii.pill,
  },
  backButtonText: {
    fontFamily: 'InterTight-Bold',
    fontSize: 15,
    fontWeight: '700',
    letterSpacing: -0.3,
    color: colors.ink,
  },
  primaryButton: {
    flex: 2,
    alignItems: 'center',
    justifyContent: 'center',
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
});
