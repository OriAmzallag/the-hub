/**
 * AttentionBanner Component
 * Urgent action banner (rating due, review delivery, etc.).
 *
 * Uses getDealCaption() for canonical status captions.
 * No ad-hoc subtitle or cta strings.
 */

import React from 'react';
import { View, Text, Pressable, StyleSheet } from 'react-native';
import { Image } from 'expo-image';
import { ChevronRight, Star, Package } from 'lucide-react-native';
import { colors, typography, borderRadius } from '@/constants/theme';
import { getDealCaption } from '@/lib/dealLifecycle';
import type { AttentionItem } from '@/types/business';

interface AttentionBannerProps {
  items: AttentionItem[];
  onItemPress?: (item: AttentionItem) => void;
}

export function AttentionBanner({ items, onItemPress }: AttentionBannerProps) {
  if (items.length === 0) {
    return null;
  }

  return (
    <View style={styles.container}>
      {items.map((item) => {
        // Resolve caption and color tier using the canonical lifecycle resolver
        const caption = getDealCaption(item.state, 'BUSINESS', {
          hoursLeft: item.hoursLeft,
          businessRated: item.businessRated,
          talentRated: item.talentRated,
        });

        // Map tier to theme color token
        const statusColor = colors[caption.tier];

        // Determine badge based on state
        const isRatingDue =
          item.state === 'COMPLETED' && item.businessRated === false;
        const isDeliveryReview = item.state === 'DELIVERED';

        return (
          <Pressable
            key={item.id}
            style={styles.item}
            onPress={() => onItemPress?.(item)}
            accessibilityRole="button"
            accessibilityLabel={`${item.title}, ${caption.text}`}
          >
            {/* Photo with badge */}
            <View style={styles.photoWrapper}>
              <View style={styles.photoContainer}>
                <Image
                  source={{ uri: item.photo }}
                  style={styles.photo}
                  contentFit="cover"
                  transition={200}
                />
              </View>
              {isRatingDue && (
                <View style={styles.starBadge}>
                  <Star
                    size={10}
                    fill={colors.bg}
                    color={colors.bg}
                    strokeWidth={0}
                  />
                </View>
              )}
              {isDeliveryReview && (
                <View style={styles.starBadge}>
                  <Package
                    size={10}
                    color={colors.bg}
                    strokeWidth={2.5}
                  />
                </View>
              )}
            </View>

            {/* Text content */}
            <View style={styles.content}>
              <Text style={styles.title}>{item.title}</Text>
              <Text style={[styles.subtitle, { color: statusColor }]}>
                {caption.text}
              </Text>
            </View>

            {/* Chevron */}
            <ChevronRight
              size={18}
              strokeWidth={2.2}
              color={colors.accent}
            />
          </Pressable>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    gap: 8,
  },
  item: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.accentSoft,
    borderWidth: 1,
    borderColor: colors.accentBorder,
    borderRadius: borderRadius.xl,
    padding: 14,
    paddingHorizontal: 16,
    gap: 14,
  },
  photoWrapper: {
    position: 'relative',
  },
  photoContainer: {
    width: 44,
    height: 44,
    borderRadius: borderRadius.lg,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: colors.borderStrong,
  },
  photo: {
    width: '100%',
    height: '100%',
  },
  starBadge: {
    position: 'absolute',
    bottom: -2,
    right: -2,
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: colors.accent,
    borderWidth: 2,
    borderColor: colors.bg,
    alignItems: 'center',
    justifyContent: 'center',
  },
  content: {
    flex: 1,
    minWidth: 0,
  },
  title: {
    ...typography.bannerTitle,
    color: colors.ink,
    marginBottom: 3,
  },
  subtitle: {
    ...typography.monoStatus,
    // color is set dynamically from caption.tier
  },
});
