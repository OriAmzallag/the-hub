/**
 * ConfirmSheet Component
 * Bottom sheet for confirming perk claim.
 * Uses canonical Modal + GestureHandlerRootView + isMounted + requestAnimationFrame pattern.
 */

import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  Pressable,
  StyleSheet,
  Dimensions,
  Modal,
} from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  Easing,
  runOnJS,
} from 'react-native-reanimated';
import {
  Gesture,
  GestureDetector,
  GestureHandlerRootView,
} from 'react-native-gesture-handler';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { BlurView } from 'expo-blur';
import { ArrowRight } from 'lucide-react-native';
import { colors, motion, radii, textScale, typography, shadows } from '@/constants/theme';
import type { PerkDetail } from '@/types/perk';

const { height: SCREEN_HEIGHT } = Dimensions.get('window');

interface ConfirmSheetProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  perk: PerkDetail;
}

export function ConfirmSheet({
  isOpen,
  onClose,
  onConfirm,
  perk,
}: ConfirmSheetProps) {
  const insets = useSafeAreaInsets();
  const overlayOpacity = useSharedValue(0);
  const sheetTranslateY = useSharedValue(SCREEN_HEIGHT);
  const [isMounted, setIsMounted] = useState(false);

  // Mount lifecycle + exit animation
  useEffect(() => {
    if (isOpen) {
      setIsMounted(true);
    } else if (isMounted) {
      overlayOpacity.value = withTiming(0, { duration: 200 });
      sheetTranslateY.value = withTiming(SCREEN_HEIGHT, { duration: 300 }, (finished) => {
        'worklet';
        if (finished) runOnJS(setIsMounted)(false);
      });
    }
  }, [isOpen, isMounted, overlayOpacity, sheetTranslateY]);

  // Entrance animation — deferred one frame
  useEffect(() => {
    if (!isMounted || !isOpen) return;
    const raf = requestAnimationFrame(() => {
      overlayOpacity.value = withTiming(1, { duration: 300, easing: Easing.out(Easing.ease) });
      sheetTranslateY.value = withTiming(0, {
        duration: motion.duration.slow,
        easing: Easing.bezier(...motion.easing.sheet),
      });
    });
    return () => cancelAnimationFrame(raf);
  }, [isMounted, isOpen, overlayOpacity, sheetTranslateY]);

  const overlayStyle = useAnimatedStyle(() => ({
    opacity: overlayOpacity.value,
  }));

  const sheetStyle = useAnimatedStyle(() => ({
    transform: [{ translateY: sheetTranslateY.value }],
  }));

  // Pan-down to dismiss
  const panGesture = Gesture.Pan()
    .onUpdate((event) => {
      'worklet';
      if (event.translationY > 0) {
        sheetTranslateY.value = event.translationY;
      }
    })
    .onEnd((event) => {
      'worklet';
      const shouldClose =
        event.translationY > SCREEN_HEIGHT * 0.15 || event.velocityY > 600;
      if (shouldClose) {
        sheetTranslateY.value = withTiming(SCREEN_HEIGHT, { duration: 250 });
        overlayOpacity.value = withTiming(0, { duration: 200 });
        runOnJS(onClose)();
      } else {
        sheetTranslateY.value = withTiming(0, {
          duration: 250,
          easing: Easing.bezier(...motion.easing.sheet),
        });
      }
    });

  // Format deliverables list
  const deliverablesText = perk.deliverables
    .map((d) => `${d.action} on ${d.platform}`)
    .join('\n');

  return (
    <Modal
      visible={isMounted}
      transparent
      animationType="none"
      statusBarTranslucent
      onRequestClose={onClose}
    >
      <GestureHandlerRootView style={StyleSheet.absoluteFill}>
        {/* Overlay */}
        <Animated.View style={[styles.overlay, overlayStyle]}>
          <Pressable style={StyleSheet.absoluteFill} onPress={onClose} />
          <BlurView
            intensity={4}
            tint="dark"
            style={StyleSheet.absoluteFill}
            pointerEvents="none"
          />
        </Animated.View>

        {/* Sheet */}
        <Animated.View style={[styles.sheet, sheetStyle]}>
          {/* Drag handle */}
          <GestureDetector gesture={panGesture}>
            <View style={styles.handleContainer}>
              <View style={styles.handle} />
            </View>
          </GestureDetector>

          {/* Header */}
          <View style={styles.header}>
            <Text style={styles.superTitle}>CONFIRM CLAIM</Text>
            <Text style={styles.title}>Ready to claim?</Text>
          </View>

          {/* Summary card */}
          <View style={styles.summaryCard}>
            <View style={styles.summaryRow}>
              <Text style={styles.summaryLabel}>The perk</Text>
              <Text style={styles.summaryValue}>
                {perk.title} · ₪{perk.value}
              </Text>
            </View>
            <View style={styles.divider} />
            <View style={styles.summaryRow}>
              <Text style={styles.summaryLabel}>You deliver</Text>
              <Text style={styles.summaryValue}>{deliverablesText}</Text>
            </View>
            <View style={styles.divider} />
            <View style={styles.summaryRow}>
              <Text style={styles.summaryLabel}>Deadline</Text>
              <Text style={[styles.summaryValue, styles.summaryValueAccent]}>
                {perk.deadline}
              </Text>
            </View>
          </View>

          {/* Disclaimer */}
          <Text style={styles.disclaimer}>
            By claiming, you agree to deliver the content within the deadline.
            The business will be notified immediately.
          </Text>

          {/* Footer */}
          <View
            style={[
              styles.footer,
              { paddingBottom: Math.max(insets.bottom, 22) },
            ]}
          >
            <Pressable style={styles.cancelButton} onPress={onClose}>
              <Text style={styles.cancelButtonText}>Cancel</Text>
            </Pressable>
            <Pressable style={styles.confirmButton} onPress={onConfirm}>
              <Text style={styles.confirmButtonText}>Yes, claim</Text>
              <ArrowRight size={16} strokeWidth={2.5} color={colors.bg} />
            </Pressable>
          </View>
        </Animated.View>
      </GestureHandlerRootView>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: colors.bgScrim,
    zIndex: 60,
  },
  sheet: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: colors.bg,
    borderTopLeftRadius: radii.sheet,
    borderTopRightRadius: radii.sheet,
    borderTopWidth: 1,
    borderTopColor: colors.borderStrong,
    zIndex: 70,
    ...shadows.sheet,
  },
  handleContainer: {
    paddingTop: 10,
    paddingBottom: 6,
    alignItems: 'center',
  },
  handle: {
    width: 36,
    height: 4,
    borderRadius: 2,
    backgroundColor: colors.borderStrong,
  },
  header: {
    paddingTop: 8,
    paddingHorizontal: 22,
    paddingBottom: 18,
  },
  superTitle: {
    ...typography.monoGreeting,
    color: colors.accent,
    marginBottom: 6,
  },
  title: {
    fontFamily: 'InterTight-ExtraBold',
    fontSize: 26,
    fontWeight: '800',
    letterSpacing: -1.04,
    color: colors.ink,
  },
  summaryCard: {
    marginHorizontal: 22,
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: radii.card,
    overflow: 'hidden',
  },
  summaryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    paddingVertical: 14,
    paddingHorizontal: 14,
    gap: 12,
  },
  summaryLabel: {
    ...typography.monoStatus,
    color: colors.inkMuted,
    flexShrink: 0,
  },
  summaryValue: {
    flex: 1,
    fontFamily: 'InterTight-SemiBold',
    fontSize: 14,
    fontWeight: '600',
    letterSpacing: -0.28,
    color: colors.ink,
    textAlign: 'right',
  },
  summaryValueAccent: {
    color: colors.accent,
  },
  divider: {
    height: 1,
    backgroundColor: colors.border,
  },
  disclaimer: {
    marginTop: 16,
    marginHorizontal: 22,
    fontFamily: 'InterTight-Regular',
    fontSize: 13,
    fontWeight: '400',
    lineHeight: 19.5,
    color: colors.ink,
    opacity: 0.7,
  },
  footer: {
    flexDirection: 'row',
    gap: 10,
    paddingTop: 20,
    paddingHorizontal: 16,
  },
  cancelButton: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 16,
    paddingHorizontal: 22,
    borderWidth: 1,
    borderColor: colors.borderStrong,
    borderRadius: radii.pill,
  },
  cancelButtonText: {
    fontFamily: 'InterTight-Bold',
    fontSize: 14.5,
    fontWeight: '700',
    letterSpacing: -0.22,
    color: colors.ink,
  },
  confirmButton: {
    flex: 1.5,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    paddingVertical: 16,
    paddingHorizontal: 22,
    backgroundColor: colors.accent,
    borderRadius: radii.pill,
    shadowColor: colors.accent,
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.3,
    shadowRadius: 24,
    elevation: 8,
  },
  confirmButtonText: {
    fontFamily: 'InterTight-Bold',
    fontSize: 14.5,
    fontWeight: '700',
    letterSpacing: -0.22,
    color: colors.bg,
  },
});
