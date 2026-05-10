/**
 * ReviewsPreview Component
 * 2-card preview section with "See all" action.
 */

import React from 'react';
import { View, StyleSheet } from 'react-native';
import { SectionHeader } from './SectionHeader';
import { ReviewCard } from './ReviewCard';
import type { TalentReview } from '@/types/talent';

interface ReviewsPreviewProps {
  reviews: TalentReview[];
  onSeeAllPress: () => void;
}

export function ReviewsPreview({ reviews, onSeeAllPress }: ReviewsPreviewProps) {
  if (reviews.length === 0) return null;

  // Only show first 2 reviews
  const previewReviews = reviews.slice(0, 2);

  return (
    <View style={styles.container}>
      <SectionHeader
        title="Reviews"
        actionLabel="See all"
        onAction={onSeeAllPress}
      />
      {previewReviews.map((review, index) => (
        <ReviewCard key={index} review={review} />
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 22,
    paddingTop: 12,
    paddingBottom: 20,
  },
});
