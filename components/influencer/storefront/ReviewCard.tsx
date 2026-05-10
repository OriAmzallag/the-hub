/**
 * ReviewCard Component
 * Individual review card with rating stars and truncated text.
 */

import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Star } from 'lucide-react-native';
import { colors } from '@/constants/theme';
import type { InfluencerReview } from '@/types/influencer';

interface ReviewCardProps {
  review: InfluencerReview;
}

export function ReviewCard({ review }: ReviewCardProps) {
  const truncatedText = review.text.length > 140
    ? review.text.substring(0, 140) + '...'
    : review.text;

  return (
    <View style={styles.container}>
      {/* Header row */}
      <View style={styles.header}>
        <Text style={styles.businessName}>{review.from}</Text>
        <View
          style={styles.starsRow}
          accessibilityLabel={`${review.rating} out of 5 stars`}
        >
          {[1, 2, 3, 4, 5].map((star) => (
            <Star
              key={star}
              size={11}
              fill={star <= review.rating ? colors.accent : 'transparent'}
              color={star <= review.rating ? colors.accent : colors.inkSubtle}
              strokeWidth={star <= review.rating ? 0 : 1.5}
            />
          ))}
        </View>
      </View>

      {/* Review text */}
      <Text style={styles.reviewText}>{truncatedText}</Text>

      {/* Date */}
      <Text style={styles.date}>{review.date.toUpperCase()}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 14,
    paddingVertical: 16,
    paddingHorizontal: 18,
    marginBottom: 10,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  businessName: {
    fontFamily: 'InterTight-Bold',
    fontSize: 14,
    fontWeight: '700',
    letterSpacing: -0.35,
    color: colors.ink,
  },
  starsRow: {
    flexDirection: 'row',
    gap: 2,
  },
  reviewText: {
    fontFamily: 'InterTight-Regular',
    fontSize: 14,
    fontWeight: '400',
    lineHeight: 21,
    color: colors.ink,
    opacity: 0.92,
    marginTop: 10,
  },
  date: {
    fontFamily: 'JetBrainsMono-Medium',
    fontSize: 9.5,
    fontWeight: '500',
    letterSpacing: 1.14,
    textTransform: 'uppercase',
    color: colors.inkMuted,
    marginTop: 10,
  },
});
