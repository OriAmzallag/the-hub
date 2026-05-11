/**
 * PerkDetailTopBar Component
 * Sticky top bar with back/share/heart buttons, title appears on scroll.
 */

import React from 'react';
import { View, Text, Pressable, StyleSheet } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Animated, {
  useAnimatedStyle,
  interpolate,
  Extrapolation,
} from 'react-native-reanimated';
import { BlurView } from 'expo-blur';
import { ChevronLeft, Share, Heart } from 'lucide-react-native';
import { colors, radii, typography } from '@/constants/theme';

interface PerkDetailTopBarProps {
  scrollY: Animated.SharedValue<number>;
  perkTitle: string;
  isFavorited: boolean;
  onFavoriteToggle: () => void;
  onBack: () => void;
  onShare: () => void;
}

const HERO_HEIGHT = 280; // approximate hero height for scroll threshold

export function PerkDetailTopBar({
  scrollY,
  perkTitle,
  isFavorited,
  onFavoriteToggle,
  onBack,
  onShare,
}: PerkDetailTopBarProps) {
  const insets = useSafeAreaInsets();

  // Animate title and background based on scroll
  const titleStyle = useAnimatedStyle(() => {
    const opacity = interpolate(
      scrollY.value,
      [HERO_HEIGHT - 100, HERO_HEIGHT - 50],
      [0, 1],
      Extrapolation.CLAMP
    );
    return { opacity };
  });

  const bgStyle = useAnimatedStyle(() => {
    const opacity = interpolate(
      scrollY.value,
      [HERO_HEIGHT - 100, HERO_HEIGHT - 50],
      [0, 1],
      Extrapolation.CLAMP
    );
    return { opacity };
  });

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      {/* Background blur (visible on scroll) */}
      <Animated.View style={[styles.bgContainer, bgStyle]}>
        <BlurView intensity={20} tint="dark" style={StyleSheet.absoluteFill} />
        <View style={styles.bgOverlay} />
      </Animated.View>

      {/* Bar content */}
      <View style={styles.bar}>
        {/* Left: Back button */}
        <Pressable
          style={styles.iconButton}
          onPress={onBack}
          accessibilityRole="button"
          accessibilityLabel="Go back"
        >
          <ChevronLeft size={22} strokeWidth={2.5} color={colors.ink} />
        </Pressable>

        {/* Center: Title (appears on scroll) */}
        <Animated.View style={[styles.titleContainer, titleStyle]}>
          <Text style={styles.title} numberOfLines={1}>
            {perkTitle}
          </Text>
        </Animated.View>

        {/* Right: Share + Heart */}
        <View style={styles.rightActions}>
          <Pressable
            style={styles.iconButton}
            onPress={onShare}
            accessibilityRole="button"
            accessibilityLabel="Share"
          >
            <Share size={18} strokeWidth={2.5} color={colors.ink} />
          </Pressable>
          <Pressable
            style={styles.iconButton}
            onPress={onFavoriteToggle}
            accessibilityRole="button"
            accessibilityLabel={isFavorited ? 'Remove from favorites' : 'Add to favorites'}
          >
            <Heart
              size={18}
              strokeWidth={2.5}
              color={isFavorited ? colors.accent : colors.ink}
              fill={isFavorited ? colors.accent : 'transparent'}
            />
          </Pressable>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    zIndex: 50,
  },
  bgContainer: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: colors.bgOverlay94,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  bgOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: colors.bgOverlay85,
  },
  bar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 12,
    paddingVertical: 10,
  },
  iconButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: colors.bgOverlay85,
    alignItems: 'center',
    justifyContent: 'center',
  },
  titleContainer: {
    flex: 1,
    marginHorizontal: 12,
    alignItems: 'center',
  },
  title: {
    ...typography.rowTitle,
    color: colors.ink,
    textAlign: 'center',
  },
  rightActions: {
    flexDirection: 'row',
    gap: 8,
  },
});
