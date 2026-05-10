/**
 * TopBar Component
 * Scroll-aware sticky header with back, share, and favorite buttons.
 */

import React from 'react';
import { View, Text, Pressable, StyleSheet } from 'react-native';
import { BlurView } from 'expo-blur';
import { ChevronLeft, Share, Heart } from 'lucide-react-native';
import Animated, {
  SharedValue,
  useAnimatedStyle,
  interpolate,
  Extrapolation,
} from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { colors } from '@/constants/theme';

interface TopBarProps {
  scrollY: SharedValue<number>;
  influencerName: string;
  isFavorited: boolean;
  onFavoriteToggle: () => void;
  onBack: () => void;
  onShare: () => void;
}

const SCROLL_THRESHOLD = 280;

export function TopBar({
  scrollY,
  influencerName,
  isFavorited,
  onFavoriteToggle,
  onBack,
  onShare,
}: TopBarProps) {
  const insets = useSafeAreaInsets();

  // Animated background style
  const animatedBgStyle = useAnimatedStyle(() => {
    const progress = interpolate(
      scrollY.value,
      [SCROLL_THRESHOLD - 20, SCROLL_THRESHOLD],
      [0, 1],
      Extrapolation.CLAMP
    );
    return {
      backgroundColor: `rgba(26,24,21,${0.92 * progress})`,
      borderBottomWidth: progress,
      borderBottomColor: colors.border,
    };
  });

  // Animated name opacity
  const animatedNameStyle = useAnimatedStyle(() => {
    const opacity = interpolate(
      scrollY.value,
      [SCROLL_THRESHOLD - 20, SCROLL_THRESHOLD],
      [0, 1],
      Extrapolation.CLAMP
    );
    return { opacity };
  });

  // Animated button background for top state
  const animatedButtonBgStyle = useAnimatedStyle(() => {
    const progress = interpolate(
      scrollY.value,
      [SCROLL_THRESHOLD - 20, SCROLL_THRESHOLD],
      [0, 1],
      Extrapolation.CLAMP
    );
    return {
      backgroundColor: progress > 0.5 ? colors.surface : colors.bgOverlay70,
    };
  });

  return (
    <Animated.View style={[styles.container, { paddingTop: insets.top }, animatedBgStyle]}>
      {/* Blur background when scrolled */}
      <BlurView intensity={16} tint="dark" style={StyleSheet.absoluteFill} />

      <View style={styles.content}>
        {/* Back button */}
        <Animated.View style={[styles.iconButton, animatedButtonBgStyle]}>
          <Pressable
            onPress={onBack}
            hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
            accessibilityRole="button"
            accessibilityLabel="Go back"
            style={styles.pressable}
          >
            <ChevronLeft size={20} strokeWidth={2} color={colors.ink} />
          </Pressable>
        </Animated.View>

        {/* Centered name (appears on scroll) */}
        <Animated.Text
          style={[styles.centeredName, animatedNameStyle]}
          numberOfLines={1}
        >
          {influencerName}
        </Animated.Text>

        {/* Right buttons */}
        <View style={styles.rightButtons}>
          <Animated.View style={[styles.iconButton, animatedButtonBgStyle]}>
            <Pressable
              onPress={onShare}
              hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
              accessibilityRole="button"
              accessibilityLabel="Share profile"
              style={styles.pressable}
            >
              <Share size={18} strokeWidth={2} color={colors.ink} />
            </Pressable>
          </Animated.View>

          <Animated.View style={[styles.iconButton, animatedButtonBgStyle]}>
            <Pressable
              onPress={onFavoriteToggle}
              hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
              accessibilityRole="button"
              accessibilityLabel={isFavorited ? 'Remove from favorites' : 'Add to favorites'}
              style={styles.pressable}
            >
              <Heart
                size={18}
                strokeWidth={2}
                color={isFavorited ? colors.accent : colors.ink}
                fill={isFavorited ? colors.accent : 'transparent'}
              />
            </Pressable>
          </Animated.View>
        </View>
      </View>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    zIndex: 100,
    overflow: 'hidden',
  },
  content: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    height: 56,
    paddingHorizontal: 16,
  },
  iconButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: colors.border,
    overflow: 'hidden',
  },
  pressable: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  centeredName: {
    position: 'absolute',
    left: 60,
    right: 100,
    textAlign: 'center',
    fontFamily: 'InterTight-Bold',
    fontSize: 17,
    fontWeight: '700',
    letterSpacing: -0.425,
    color: colors.ink,
  },
  rightButtons: {
    flexDirection: 'row',
    gap: 8,
  },
});
