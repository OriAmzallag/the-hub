/**
 * TalentCard Component
 * Individual talent card with image, badge, and rating.
 */

import React, { memo } from 'react';
import { View, Text, Pressable, StyleSheet } from 'react-native';
import { Image } from 'expo-image';
import { BlurView } from 'expo-blur';
import { Star } from 'lucide-react-native';
import { colors } from '@/constants/theme';
import type { Talent } from '@/constants/mockBusinessDiscover';

interface TalentCardProps {
  talent: Talent;
  onPress?: () => void;
}

function TalentCardComponent({ talent, onPress }: TalentCardProps) {
  return (
    <Pressable
      style={styles.container}
      onPress={onPress}
      accessibilityRole="button"
      accessibilityLabel={`${talent.name}${talent.rating ? `, rated ${talent.rating}` : ''}`}
    >
      <View style={styles.imageContainer}>
        <Image
          source={{ uri: talent.photo }}
          style={styles.image}
          contentFit="cover"
          transition={200}
        />

        {/* Badge pill */}
        {talent.badge && (
          <BlurView intensity={20} tint="dark" style={styles.badgeBlur}>
            <View style={styles.badge}>
              <Text style={styles.badgeText}>{talent.badge}</Text>
            </View>
          </BlurView>
        )}

        {/* Bottom gradient scrim */}
        <View style={styles.scrim} />

        {/* Rating chip */}
        {talent.rating !== null && (
          <BlurView intensity={20} tint="dark" style={styles.ratingBlur}>
            <View style={styles.ratingChip}>
              <Star
                size={10}
                fill={colors.accent}
                color={colors.accent}
                strokeWidth={0}
              />
              <Text style={styles.ratingText}>{talent.rating}</Text>
            </View>
          </BlurView>
        )}
      </View>

      {/* Name + primary category */}
      <View style={styles.nameContainer}>
        <Text style={styles.name} numberOfLines={1}>
          {talent.name}
        </Text>
        {talent.categories[0] && (
          <Text style={styles.category} numberOfLines={1}>
            {talent.categories[0]}
          </Text>
        )}
      </View>
    </Pressable>
  );
}

export const TalentCard = memo(TalentCardComponent);

const styles = StyleSheet.create({
  container: {
    width: 168,
    gap: 10,
  },
  imageContainer: {
    width: '100%',
    aspectRatio: 4 / 5,
    borderRadius: 14,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: colors.borderStrong,
  },
  image: {
    width: '100%',
    height: '100%',
  },
  badgeBlur: {
    position: 'absolute',
    top: 10,
    left: 10,
    borderRadius: 100,
    overflow: 'hidden',
  },
  badge: {
    paddingVertical: 5,
    paddingHorizontal: 10,
    backgroundColor: colors.bgOverlay85,
    borderWidth: 1,
    borderColor: colors.accentBorder,
    borderRadius: 100,
  },
  badgeText: {
    fontFamily: 'JetBrainsMono-SemiBold',
    fontSize: 9,
    letterSpacing: 1.62,
    textTransform: 'uppercase',
    color: colors.accent,
  },
  scrim: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    height: 70,
    backgroundColor: 'transparent',
    // Gradient simulation - in production use expo-linear-gradient
    borderBottomLeftRadius: 14,
    borderBottomRightRadius: 14,
  },
  ratingBlur: {
    position: 'absolute',
    bottom: 10,
    left: 10,
    borderRadius: 100,
    overflow: 'hidden',
  },
  ratingChip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingVertical: 4,
    paddingLeft: 7,
    paddingRight: 8,
    backgroundColor: colors.bgOverlay85,
    borderRadius: 100,
  },
  ratingText: {
    fontFamily: 'InterTight-Bold',
    fontSize: 11.5,
    letterSpacing: -0.23,
    color: colors.ink,
    lineHeight: 12,
  },
  nameContainer: {
    paddingHorizontal: 2,
  },
  name: {
    fontFamily: 'InterTight-Bold',
    fontSize: 14.5,
    letterSpacing: -0.36,
    lineHeight: 17,
    color: colors.ink,
    marginBottom: 4,
  },
  // Primary category caption — mono uppercase, inkMuted. Reuses the same
  // tracking as the rest of the discover screen's mono labels (0.15em).
  category: {
    fontFamily: 'JetBrainsMono-Medium',
    fontSize: 9,
    fontWeight: '500',
    letterSpacing: 1.35, // 0.15em
    textTransform: 'uppercase',
    color: colors.inkMuted,
  },
});
