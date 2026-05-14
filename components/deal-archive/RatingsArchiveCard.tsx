/**
 * RatingsArchiveCard Component
 * Compact rating display for Deal Summary (RATED state).
 */

import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Star } from 'lucide-react-native';
import { colors } from '@/constants/theme';
import type { Rating } from '@/types/rating';
import type { ArchivedDeal } from '@/types/dealArchive';
import type { ViewerRole } from '@/lib/dealLifecycle';

interface RatingsArchiveCardProps {
  deal: ArchivedDeal;
  viewerRole: ViewerRole;
}

interface CompactRatingProps {
  label: string;
  rating: Rating;
}

function CompactRating({ label, rating }: CompactRatingProps) {
  return (
    <View style={styles.ratingContainer}>
      <Text style={styles.ratingLabel}>{label}</Text>

      {/* Stars */}
      <View style={styles.starsRow}>
        {[1, 2, 3, 4, 5].map((star) => (
          <Star
            key={star}
            size={13}
            strokeWidth={1.5}
            color={colors.accent}
            fill={star <= rating.stars ? colors.accent : 'transparent'}
          />
        ))}
        <Text style={styles.starCount}>{rating.stars}</Text>
      </View>

      {/* Tags */}
      {rating.tags.length > 0 && (
        <View style={styles.tagsRow}>
          {rating.tags.map((tag, index) => (
            <View key={index} style={styles.tag}>
              <Text style={styles.tagText}>{tag}</Text>
            </View>
          ))}
        </View>
      )}

      {/* Review */}
      {rating.review && (
        <Text style={styles.review}>"{rating.review}"</Text>
      )}
    </View>
  );
}

export function RatingsArchiveCard({ deal, viewerRole }: RatingsArchiveCardProps) {
  if (!deal.ratings) return null;

  const isBusiness = viewerRole === 'business';
  const counterpartyFirstName = isBusiness
    ? deal.influencer.firstName
    : deal.business.firstName;

  // Determine which rating is viewer's and which is counterparty's
  const viewerRating = isBusiness
    ? deal.ratings.business
    : deal.ratings.influencer;
  const counterpartyRating = isBusiness
    ? deal.ratings.influencer
    : deal.ratings.business;

  return (
    <View style={styles.container}>
      <Text style={styles.sectionHeader}>RATINGS EXCHANGED</Text>
      <View style={styles.card}>
        <CompactRating
          label={`You rated ${counterpartyFirstName}`}
          rating={viewerRating}
        />
        <View style={styles.separator} />
        <CompactRating
          label={`${counterpartyFirstName} rated you`}
          rating={counterpartyRating}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginBottom: 24,
  },
  sectionHeader: {
    fontFamily: 'JetBrainsMono-Medium',
    fontSize: 10,
    fontWeight: '500',
    letterSpacing: 2.2, // 0.22em
    lineHeight: 10,
    textTransform: 'uppercase',
    color: colors.inkMuted,
    marginBottom: 12,
  },
  card: {
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 14,
    padding: 16,
  },
  ratingContainer: {
    gap: 8,
  },
  ratingLabel: {
    fontFamily: 'JetBrainsMono-Medium',
    fontSize: 9,
    fontWeight: '500',
    letterSpacing: 1.35, // 0.15em
    lineHeight: 9,
    textTransform: 'uppercase',
    color: colors.inkMuted,
  },
  starsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 2,
  },
  starCount: {
    fontFamily: 'InterTight-Bold',
    fontSize: 13,
    fontWeight: '700',
    letterSpacing: -0.26,
    lineHeight: 13,
    color: colors.accent,
    marginLeft: 6,
  },
  tagsRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 6,
  },
  tag: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    backgroundColor: colors.surfaceAlt,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 6,
  },
  tagText: {
    fontFamily: 'InterTight-Medium',
    fontSize: 10.5,
    fontWeight: '500',
    letterSpacing: -0.105,
    lineHeight: 11,
    color: colors.ink,
  },
  review: {
    fontFamily: 'InterTight-Regular',
    fontSize: 12,
    fontWeight: '400',
    fontStyle: 'italic',
    lineHeight: 17,
    color: colors.inkMuted,
  },
  separator: {
    height: 1,
    backgroundColor: colors.border,
    marginVertical: 16,
  },
});
