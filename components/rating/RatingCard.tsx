/**
 * RatingCard Component
 * Displays a single rating in the Mutual Reveal screen.
 */

import React from 'react';
import { View, Text, Image, StyleSheet } from 'react-native';
import { Star } from 'lucide-react-native';
import { colors, typography, radii } from '@/constants/theme';
import type { Rating } from '@/types/rating';

interface RatingCardProps {
  label: string;
  rating: Rating;
  showAvatar?: boolean;
  counterpartyPhoto?: string;
  counterpartyMonogram?: string;
}

export function RatingCard({
  label,
  rating,
  showAvatar = false,
  counterpartyPhoto,
  counterpartyMonogram,
}: RatingCardProps) {
  return (
    <View style={styles.card}>
      {/* Label row */}
      <View style={styles.labelRow}>
        {showAvatar && (
          <View style={styles.avatarContainer}>
            {counterpartyPhoto ? (
              <Image
                source={{ uri: counterpartyPhoto }}
                style={styles.avatar}
              />
            ) : (
              <View style={styles.monogramAvatar}>
                <Text style={styles.monogramText}>
                  {counterpartyMonogram || '??'}
                </Text>
              </View>
            )}
          </View>
        )}
        <Text style={styles.label}>{label}</Text>
      </View>

      {/* Stars row */}
      <View style={styles.starsRow}>
        {Array.from({ length: 5 }).map((_, index) => (
          <Star
            key={index}
            size={14}
            strokeWidth={1.5}
            color={colors.accent}
            fill={index < rating.stars ? colors.accent : 'transparent'}
          />
        ))}
        <Text style={styles.starsNumeric}>{rating.stars}.0</Text>
      </View>

      {/* Tags */}
      {rating.tags.length > 0 && (
        <View style={styles.tagsRow}>
          {rating.tags.map((tag) => (
            <View key={tag} style={styles.tag}>
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

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: radii.card,
    padding: 16,
    gap: 12,
  },
  labelRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  avatarContainer: {
    width: 32,
    height: 32,
  },
  avatar: {
    width: 32,
    height: 32,
    borderRadius: 9,
  },
  monogramAvatar: {
    width: 32,
    height: 32,
    borderRadius: 9,
    backgroundColor: colors.surfaceAlt,
    borderWidth: 1,
    borderColor: colors.borderStrong,
    alignItems: 'center',
    justifyContent: 'center',
  },
  monogramText: {
    fontFamily: 'InterTight-Bold',
    fontSize: 12,
    fontWeight: '700',
    color: colors.ink,
  },
  label: {
    ...typography.rowTitle,
    color: colors.ink,
  },
  starsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  starsNumeric: {
    ...typography.monoLabel,
    color: colors.accent,
    marginLeft: 6,
  },
  tagsRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 6,
  },
  tag: {
    backgroundColor: colors.accentSoft,
    paddingVertical: 4,
    paddingHorizontal: 8,
    borderRadius: radii.pill,
  },
  tagText: {
    fontFamily: 'InterTight-SemiBold',
    fontSize: 11,
    fontWeight: '600',
    color: colors.accent,
  },
  review: {
    fontFamily: 'InterTight-Regular',
    fontSize: 13,
    fontWeight: '400',
    fontStyle: 'italic',
    lineHeight: 19,
    color: colors.inkMuted,
  },
});
