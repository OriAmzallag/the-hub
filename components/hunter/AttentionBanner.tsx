/**
 * AttentionBanner Component
 * Urgent action banner (rating due, payment pending, etc.).
 */

import React from 'react';
import { View, Text, Pressable, StyleSheet } from 'react-native';
import { Image } from 'expo-image';
import { ChevronRight, Star } from 'lucide-react-native';
import { colors, typography, borderRadius } from '@/constants/theme';
import type { AttentionItem } from '@/types/hunter';

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
      {items.map((item) => (
        <Pressable
          key={item.id}
          style={styles.item}
          onPress={() => onItemPress?.(item)}
          accessibilityRole="button"
          accessibilityLabel={`${item.title}, ${item.subtitle}`}
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
            {item.kind === 'rating-due' && (
              <View style={styles.starBadge}>
                <Star
                  size={10}
                  fill={colors.bg}
                  color={colors.bg}
                  strokeWidth={0}
                />
              </View>
            )}
          </View>

          {/* Text content */}
          <View style={styles.content}>
            <Text style={styles.title}>{item.title}</Text>
            <Text style={styles.subtitle}>{item.subtitle}</Text>
          </View>

          {/* Chevron */}
          <ChevronRight
            size={18}
            strokeWidth={2.2}
            color={colors.accent}
          />
        </Pressable>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 20,
    paddingBottom: 24,
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
    color: colors.accent,
  },
});
