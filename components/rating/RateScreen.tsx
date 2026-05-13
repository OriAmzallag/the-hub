/**
 * RateScreen Component
 * Primary rating input screen with stars, tags, and review.
 */

import React, { useState } from 'react';
import {
  View,
  Text,
  Image,
  Pressable,
  StyleSheet,
  ScrollView,
} from 'react-native';
import Animated from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { BlurView } from 'expo-blur';
import { X, ArrowRight } from 'lucide-react-native';
import { colors, typography, radii } from '@/constants/theme';
import { useFadeUpEntrance } from '@/hooks/useFadeUpEntrance';
import { getTagsForRole } from '@/lib/ratingTags';
import { StarInput } from './StarInput';
import { TagChips } from './TagChips';
import { ReviewInput } from './ReviewInput';
import { NoticeCard } from './NoticeCard';
import type { RatingDealContext, RatingInput, RatingTag, StarRating } from '@/types/rating';

interface RateScreenProps {
  context: RatingDealContext;
  onSubmit: (input: RatingInput) => void;
  onClose: () => void;
}

const STAR_LABELS: Record<number, string> = {
  1: 'Poor',
  2: 'Below average',
  3: 'OK',
  4: 'Great',
  5: 'Excellent',
};

export function RateScreen({ context, onSubmit, onClose }: RateScreenProps) {
  const insets = useSafeAreaInsets();
  const fadeStyle = useFadeUpEntrance();

  const [stars, setStars] = useState<StarRating | 0>(0);
  const [selectedTags, setSelectedTags] = useState<RatingTag[]>([]);
  const [review, setReview] = useState('');

  const tags = getTagsForRole(context.viewerRole);
  const canSubmit = stars > 0;

  const handleSubmit = () => {
    if (!canSubmit) return;

    onSubmit({
      dealId: context.id,
      stars: stars as StarRating,
      tags: selectedTags,
      review: review.trim() || undefined,
    });
  };

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
        <Text style={styles.eyebrow}>RATE YOUR COLLABORATION</Text>
        <View style={styles.closeButtonPlaceholder} />
      </View>

      {/* Scrollable content */}
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
      >
        <Animated.View style={fadeStyle}>
          {/* Hero block */}
          <View style={styles.heroBlock}>
            {/* Avatar */}
            <View style={styles.avatarContainer}>
              {context.counterparty.photo ? (
                <Image
                  source={{ uri: context.counterparty.photo }}
                  style={styles.avatar}
                />
              ) : (
                <View style={styles.monogramAvatar}>
                  <Text style={styles.monogramText}>
                    {context.counterparty.monogram || '??'}
                  </Text>
                </View>
              )}
            </View>

            {/* Deal summary */}
            <Text style={styles.dealSummary}>
              {context.services} · ₪{context.money}
            </Text>

            {/* Headline */}
            <Text style={styles.headline}>
              How was working{'\n'}with {context.counterparty.firstName}?
            </Text>
          </View>

          {/* Star input */}
          <View style={styles.starsSection}>
            <StarInput value={stars} onChange={setStars} />
            {stars > 0 && (
              <Text style={styles.starLabel}>{STAR_LABELS[stars]}</Text>
            )}
          </View>

          {/* Tags */}
          <View style={styles.tagsSection}>
            <TagChips
              tags={tags}
              selected={selectedTags}
              onChange={setSelectedTags}
            />
          </View>

          {/* Review */}
          <View style={styles.reviewSection}>
            <ReviewInput value={review} onChange={setReview} />
          </View>

          {/* Notice card */}
          <View style={styles.noticeSection}>
            <NoticeCard>
              You'll see {context.counterparty.firstName}'s rating once they
              submit theirs. Ratings reveal at the same time.
            </NoticeCard>
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
          <Pressable
            style={[styles.submitButton, !canSubmit && styles.submitButtonDisabled]}
            onPress={handleSubmit}
            disabled={!canSubmit}
            accessibilityRole="button"
            accessibilityLabel="Submit rating"
            accessibilityState={{ disabled: !canSubmit }}
          >
            <Text
              style={[
                styles.submitButtonText,
                !canSubmit && styles.submitButtonTextDisabled,
              ]}
            >
              Submit rating
            </Text>
            <ArrowRight
              size={16}
              strokeWidth={2.6}
              color={canSubmit ? colors.bg : colors.inkMuted}
            />
          </Pressable>
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
  heroBlock: {
    alignItems: 'center',
    paddingTop: 24,
    marginBottom: 32,
  },
  avatarContainer: {
    marginBottom: 16,
  },
  avatar: {
    width: 96,
    height: 96,
    borderRadius: 24,
    borderWidth: 1,
    borderColor: colors.borderStrong,
  },
  monogramAvatar: {
    width: 96,
    height: 96,
    borderRadius: 24,
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.borderStrong,
    alignItems: 'center',
    justifyContent: 'center',
  },
  monogramText: {
    fontFamily: 'InterTight-ExtraBold',
    fontSize: 32,
    fontWeight: '800',
    color: colors.ink,
  },
  dealSummary: {
    ...typography.monoStatus,
    color: colors.inkMuted,
    marginBottom: 16,
  },
  headline: {
    fontFamily: 'InterTight-ExtraBold',
    fontSize: 30,
    fontWeight: '800',
    letterSpacing: -1.2,
    lineHeight: 34,
    color: colors.ink,
    textAlign: 'center',
  },
  starsSection: {
    alignItems: 'center',
    marginBottom: 24,
  },
  starLabel: {
    ...typography.monoLabel,
    color: colors.accent,
    marginTop: 12,
  },
  tagsSection: {
    marginBottom: 24,
  },
  reviewSection: {
    marginBottom: 24,
  },
  noticeSection: {
    marginBottom: 24,
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
  submitButton: {
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
  submitButtonDisabled: {
    backgroundColor: colors.surface,
    shadowOpacity: 0,
    elevation: 0,
  },
  submitButtonText: {
    fontFamily: 'InterTight-Bold',
    fontSize: 15,
    fontWeight: '700',
    letterSpacing: -0.3,
    color: colors.bg,
  },
  submitButtonTextDisabled: {
    color: colors.inkMuted,
  },
});
