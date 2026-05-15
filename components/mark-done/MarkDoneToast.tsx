/**
 * MarkDoneToast Component
 * Success toast shown after marking deal as done.
 *
 * Visual spec (from mark-done.reference.jsx):
 * - Position: top 16 + safeAreaTop, left/right 14
 * - Background: rgba(26,24,21,0.96) with blur 16
 * - Border: 1px accentBorder, radius 14
 * - Padding: 12/14, gap 11
 * - Check: 32x32 radius 9 accent bg, icon 17/3, pop animation
 * - Title: display 13.5/700/-0.02em, ink
 * - Caption: mono 9/0.16em uppercase, inkMuted
 * - Dismiss: X 14/2.4, inkMuted
 * - Auto-dismiss: 3.5 seconds
 */

import React, { useEffect, useCallback } from 'react';
import { View, Text, Pressable, StyleSheet } from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  withSpring,
  withSequence,
  Easing,
  runOnJS,
} from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { BlurView } from 'expo-blur';
import { Check, X } from 'lucide-react-native';
import { colors } from '@/constants/theme';

interface MarkDoneToastProps {
  visible: boolean;
  onDismiss: () => void;
}

const AUTO_DISMISS_DELAY = 3500; // 3.5 seconds

export function MarkDoneToast({ visible, onDismiss }: MarkDoneToastProps) {
  const insets = useSafeAreaInsets();
  const translateY = useSharedValue(-100);
  const opacity = useSharedValue(0);
  const checkScale = useSharedValue(0);

  const dismiss = useCallback(() => {
    'worklet';
    translateY.value = withTiming(-100, { duration: 300 });
    opacity.value = withTiming(0, { duration: 300 }, (finished) => {
      if (finished) {
        runOnJS(onDismiss)();
      }
    });
  }, [translateY, opacity, onDismiss]);

  useEffect(() => {
    if (visible) {
      // Entrance animation
      translateY.value = withTiming(0, {
        duration: 350,
        easing: Easing.bezier(0.32, 0.72, 0, 1),
      });
      opacity.value = withTiming(1, { duration: 350 });

      // Check pop animation: 0 -> 1.2 -> 1.0
      checkScale.value = withSequence(
        withTiming(0, { duration: 0 }),
        withTiming(1.2, {
          duration: 300,
          easing: Easing.bezier(0.32, 0.72, 0, 1),
        }),
        withSpring(1, {
          damping: 12,
          stiffness: 200,
        })
      );

      // Auto-dismiss timer
      const timer = setTimeout(() => {
        dismiss();
      }, AUTO_DISMISS_DELAY);

      return () => clearTimeout(timer);
    } else {
      translateY.value = -100;
      opacity.value = 0;
      checkScale.value = 0;
    }
  }, [visible, translateY, opacity, checkScale, dismiss]);

  const containerStyle = useAnimatedStyle(() => ({
    transform: [{ translateY: translateY.value }],
    opacity: opacity.value,
  }));

  const checkContainerStyle = useAnimatedStyle(() => ({
    transform: [{ scale: checkScale.value }],
  }));

  if (!visible) return null;

  return (
    <Animated.View
      style={[
        styles.container,
        { top: 16 + insets.top },
        containerStyle,
      ]}
    >
      <BlurView
        intensity={16}
        tint="dark"
        style={StyleSheet.absoluteFill}
      />
      <View style={styles.content}>
        {/* Check icon with pop animation */}
        <Animated.View style={[styles.checkContainer, checkContainerStyle]}>
          <Check size={17} strokeWidth={3} color={colors.bg} />
        </Animated.View>

        {/* Text content */}
        <View style={styles.textContainer}>
          <Text style={styles.title}>Marked done.</Text>
          <Text style={styles.caption}>RATE WHEN YOU'RE READY</Text>
        </View>

        {/* Dismiss button */}
        <Pressable
          style={styles.dismissButton}
          onPress={() => dismiss()}
          accessibilityRole="button"
          accessibilityLabel="Dismiss"
        >
          <X size={14} strokeWidth={2.4} color={colors.inkMuted} />
        </Pressable>
      </View>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    left: 14,
    right: 14,
    zIndex: 90,
    borderRadius: 14,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: colors.accentBorder,
    backgroundColor: 'rgba(26, 24, 21, 0.96)',
    // Shadow
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 12 },
    shadowOpacity: 0.4,
    shadowRadius: 32,
    elevation: 20,
  },
  content: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 11,
    padding: 12,
    paddingHorizontal: 14,
  },
  checkContainer: {
    width: 32,
    height: 32,
    borderRadius: 9,
    backgroundColor: colors.accent,
    alignItems: 'center',
    justifyContent: 'center',
  },
  textContainer: {
    flex: 1,
    minWidth: 0,
  },
  title: {
    fontFamily: 'InterTight-Bold',
    fontSize: 13.5,
    fontWeight: '700',
    letterSpacing: -0.27, // -0.02em
    lineHeight: 16.2, // 1.2
    color: colors.ink,
    marginBottom: 1,
  },
  caption: {
    fontFamily: 'JetBrainsMono-Medium',
    fontSize: 9,
    fontWeight: '500',
    letterSpacing: 1.44, // 0.16em
    textTransform: 'uppercase',
    color: colors.inkMuted,
  },
  dismissButton: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: 'transparent',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
